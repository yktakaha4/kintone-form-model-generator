import { Client, ClientConfig } from "./util/client";
import { Config } from "./util/config";
import ts, { factory as f } from "typescript";
import { sanitizeInterfaceName, stringer } from "./util/ast";

const kintoneFieldImportPath =
  "@kintone/rest-api-client/lib/KintoneFields/types/field";
const simpleTypeMappings: Record<string, string> = {
  RECORD_NUMBER: "RecordNumber",
  CREATOR: "Creator",
  CREATED_TIME: "CreatedTime",
  MODIFIER: "Modifier",
  UPDATED_TIME: "UpdatedTime",
  CHECK_BOX: "CheckBox",
  RADIO_BUTTON: "RadioButton",
  MULTI_SELECT: "MultiSelect",
  DROP_DOWN: "Dropdown",
  USER_SELECT: "UserSelect",
  ORGANIZATION_SELECT: "OrganizationSelect",
  GROUP_SELECT: "GroupSelect",
  DATE: "Date",
  TIME: "Time",
  DATETIME: "DateTime",
  LINK: "Link",
  FILE: "File",
  SINGLE_LINE_TEXT: "SingleLineText",
  NUMBER: "Number",
  CATEGORY: "Category",
  STATUS: "Status",
  STATUS_ASSIGNEE: "StatusAssignee",
  RICH_TEXT: "RichText",
  MULTI_LINE_TEXT: "MultiLineText",
  CALC: "Calc",
};
const customTypeMappings = {
  SUBTABLE: "Subtable",
};
const metaTypes = [
  { propertyName: "__ID__", type: "ID" },
  { propertyName: "__REVISION__", type: "Revision" },
];

export interface GenerateParams {
  appIds?: Array<string>;
}

export const generate = async ({
  params,
  config,
  clientConfig,
}: {
  params: GenerateParams;
  config: Config;
  clientConfig: ClientConfig;
}) => {
  const client = new Client(clientConfig);

  // get app
  const apps = await client.getApps({ ids: params.appIds });

  // generate
  const interfaceNames: Set<string> = new Set();
  const interfaceNodes: Array<ts.Node> = [];
  const fieldTypes: Set<string> = new Set();

  // For each application
  for (const { appId, code: appCode, name: appName } of apps) {
    const { properties } = await client.getFormFields({ appId });

    const propertyNames: Set<string> = new Set();
    const propertyElements: Array<ts.TypeElement> = [];

    // add meta fields
    for (const { propertyName, type } of metaTypes) {
      fieldTypes.add(type);
      propertyElements.push(
        f.createPropertySignature(
          undefined,
          f.createStringLiteral(propertyName),
          undefined,
          f.createTypeReferenceNode(type)
        )
      );
    }

    // For each property
    for (const code of Object.keys(properties).sort()) {
      const field = properties[code];

      const { type, label } = field;

      let propertyName: string;
      if (config.propertyNaming === "label" && label) {
        propertyName = label;
      } else {
        propertyName = code;
      }

      if (propertyNames.has(propertyName)) {
        const message = `duplicate: appId=${appId}, code=${code}, propertyName=${propertyName}`;
        if (config.propertyNamingDuplicationStrategy === "overwrite") {
          // TODO: logging
          console.warn(message);
        } else {
          throw new Error(message);
        }
      }
      propertyNames.add(propertyName);

      if (type === "SUBTABLE") {
        // For each property in subtable field
        const inSubtablePropertySignatures: Array<ts.PropertySignature> = [];
        for (const inSubtableCode of Object.keys(field.fields)) {
          const inSubtableField = field.fields[inSubtableCode];
          const { type: inSubtableType, label: inSubtableLabel } =
            inSubtableField;

          if (simpleTypeMappings[inSubtableType]) {
            const inSubtablePropertyName =
              config.propertyNaming === "label"
                ? inSubtableLabel
                : inSubtableCode;

            fieldTypes.add(simpleTypeMappings[inSubtableType]);
            inSubtablePropertySignatures.push(
              f.createPropertySignature(
                undefined,
                f.createStringLiteral(inSubtablePropertyName),
                undefined,
                f.createTypeReferenceNode(
                  f.createIdentifier(simpleTypeMappings[inSubtableType])
                )
              )
            );
          } else {
            console.info(
              `skip: appId=${appId}, code=${code}, inSubtableCode=${inSubtableCode}, inSubtableType=${inSubtableType}`
            );
          }
        }

        fieldTypes.add(customTypeMappings.SUBTABLE);
        propertyElements.push(
          f.createPropertySignature(
            undefined,
            f.createStringLiteral(propertyName),
            undefined,
            f.createTypeReferenceNode(customTypeMappings.SUBTABLE, [
              f.createTypeLiteralNode(inSubtablePropertySignatures),
            ])
          )
        );
      } else if (simpleTypeMappings[type]) {
        fieldTypes.add(simpleTypeMappings[type]);
        propertyElements.push(
          f.createPropertySignature(
            undefined,
            f.createStringLiteral(propertyName),
            undefined,
            f.createTypeReferenceNode(simpleTypeMappings[type])
          )
        );
      } else {
        // TODO: logging
        console.info(`skip: appId=${appId}, code=${code}, type=${type}`);
      }
    }

    let interfaceName: string;
    if (config.modelNaming === "appName" && appName) {
      interfaceName = appName;
    } else if (config.modelNaming === "appCode") {
      interfaceName = appCode;
    } else {
      interfaceName = `AppId${appId}`;
    }

    const sanitizedInterfaceName = sanitizeInterfaceName(interfaceName);
    if (interfaceNames.has(sanitizedInterfaceName)) {
      const message = `duplicate: appId=${appId}, sanitizedInterfaceName=${sanitizedInterfaceName}`;
      if (config.modelNamingDuplicationStrategy === "overwrite") {
        // TODO: logging
        console.warn(message);
      } else {
        throw new Error(message);
      }
    }
    interfaceNames.add(sanitizedInterfaceName);

    interfaceNodes.push(
      f.createInterfaceDeclaration(
        undefined,
        [f.createToken(ts.SyntaxKind.ExportKeyword)],
        f.createIdentifier(sanitizedInterfaceName),
        undefined,
        undefined,
        propertyElements
      )
    );
  }

  // import definition
  const fieldImportStringLiteral = f.createStringLiteral(
    kintoneFieldImportPath
  );
  const importSpecifiers: Array<ts.ImportSpecifier> = [];
  for (const fieldType of Array.from(fieldTypes).sort()) {
    importSpecifiers.push(
      f.createImportSpecifier(false, undefined, f.createIdentifier(fieldType))
    );
  }

  const importDeclaration = ts.factory.createImportDeclaration(
    undefined,
    undefined,
    f.createImportClause(
      false,
      undefined,
      f.createNamedImports(importSpecifiers)
    ),
    fieldImportStringLiteral
  );

  return stringer([importDeclaration, ...interfaceNodes]);
};
