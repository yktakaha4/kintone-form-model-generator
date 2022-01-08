import { Client, ClientConfig } from "./util/client";
import { Config } from "./util/config";
import ts, { factory as f } from "typescript";
import {
  createHeaderComment,
  sanitizeInterfaceName,
  stringer,
  withJSDocComments,
} from "./util/ast";
import { getLogger } from "log4js";

const logger = getLogger();

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
  const appIds = params.appIds?.filter((appId) => appId) ?? [];
  const apps = await client.getApps({ ids: appIds });
  for (const appId of appIds) {
    if (!apps.find((app) => app.appId === appId)) {
      throw new Error(`not found: appId=${appId}`);
    }
  }

  logger.info("appIds:", appIds);

  // generate
  const interfaceNames: Set<string> = new Set();
  const interfaceNodes: Array<ts.Node> = [];
  const fieldTypes: Set<string> = new Set();

  // For each application
  for (const { appId, code: appCode, name: appName } of apps) {
    logger.info("appId:", appId);
    const { properties, revision } = await client.getFormFields({ appId });

    const propertyNames: Set<string> = new Set();
    const propertyElements: Array<ts.TypeElement> = [];

    // add meta fields
    for (const { propertyName, type } of metaTypes) {
      logger.debug("propertyName:", propertyName);
      fieldTypes.add(type);
      propertyElements.push(
        withJSDocComments(
          f.createPropertySignature(
            undefined,
            f.createStringLiteral(propertyName),
            undefined,
            f.createTypeReferenceNode(type)
          ),
          [type, `@type ${type}`]
        )
      );
    }

    // For each property
    for (const code of Object.keys(properties).sort()) {
      logger.debug("code:", code);
      const field = properties[code];

      const { type, label } = field;

      const propertyName = code;
      if (propertyNames.has(propertyName)) {
        throw new Error(
          `duplicate: appId=${appId}, code=${code}, propertyName=${propertyName}`
        );
      }
      propertyNames.add(propertyName);

      if (type === "SUBTABLE") {
        // For each property in subtable field
        const inSubtablePropertySignatures: Array<ts.PropertySignature> = [];
        for (const inSubtableCode of Object.keys(field.fields)) {
          logger.debug("inSubtableCode:", inSubtableCode);
          const inSubtableField = field.fields[inSubtableCode];
          const { type: inSubtableType, label: inSubtableLabel } =
            inSubtableField;

          if (simpleTypeMappings[inSubtableType]) {
            fieldTypes.add(simpleTypeMappings[inSubtableType]);
            inSubtablePropertySignatures.push(
              withJSDocComments(
                f.createPropertySignature(
                  undefined,
                  f.createStringLiteral(inSubtableCode),
                  undefined,
                  f.createTypeReferenceNode(
                    f.createIdentifier(simpleTypeMappings[inSubtableType])
                  )
                ),
                [
                  inSubtableLabel,
                  inSubtableCode,
                  `@type ${simpleTypeMappings[inSubtableType]}`,
                ]
              )
            );
          } else {
            logger.debug(
              `skip: appId=${appId}, code=${code}, inSubtableCode=${inSubtableCode}, inSubtableType=${inSubtableType}`
            );
          }
        }

        fieldTypes.add(customTypeMappings.SUBTABLE);
        propertyElements.push(
          withJSDocComments(
            f.createPropertySignature(
              undefined,
              f.createStringLiteral(propertyName),
              undefined,
              f.createTypeReferenceNode(customTypeMappings.SUBTABLE, [
                f.createTypeLiteralNode(inSubtablePropertySignatures),
              ])
            ),
            [label, code, `@type ${customTypeMappings.SUBTABLE}`]
          )
        );
      } else if (simpleTypeMappings[type]) {
        fieldTypes.add(simpleTypeMappings[type]);
        propertyElements.push(
          withJSDocComments(
            f.createPropertySignature(
              undefined,
              f.createStringLiteral(propertyName),
              undefined,
              f.createTypeReferenceNode(simpleTypeMappings[type])
            ),
            [label, code, `@type ${simpleTypeMappings[type]}`]
          )
        );
      } else {
        logger.debug(`skip: appId=${appId}, code=${code}, type=${type}`);
      }
    }

    const appIdName = `App${appId}`;
    let interfaceName: string;
    if (config.modelNameMapping && config.modelNameMapping[appId]) {
      interfaceName = config.modelNameMapping[appId];
    } else if (config.modelNaming === "appName" && appName) {
      interfaceName = appName;
    } else if (config.modelNaming === "appCode") {
      interfaceName = appCode;
    } else {
      interfaceName = appIdName;
    }

    if (config.modelNamePrefix) {
      interfaceName = config.modelNamePrefix + interfaceName;
    }
    if (config.modelNameSuffix) {
      interfaceName = interfaceName + config.modelNameSuffix;
    }

    interfaceName = sanitizeInterfaceName(interfaceName);
    if (interfaceNames.has(interfaceName)) {
      if (config.modelNamingDuplicationStrategy === "overwrite") {
        logger.warn(
          `duplicate: appId=${appId}, interfaceName=${interfaceName}`
        );
      } else if (
        config.modelNamingDuplicationStrategy === "uniquifyWithAppId"
      ) {
        interfaceName = sanitizeInterfaceName(interfaceName + appIdName);
        if (interfaceNames.has(interfaceName)) {
          throw new Error(
            `duplicate: appId=${appId}, interfaceName=${interfaceName}`
          );
        }
      } else {
        throw new Error(
          `duplicate: appId=${appId}, interfaceName=${interfaceName}`
        );
      }
    }
    interfaceNames.add(interfaceName);

    interfaceNodes.push(
      withJSDocComments(
        f.createInterfaceDeclaration(
          undefined,
          [f.createToken(ts.SyntaxKind.ExportKeyword)],
          f.createIdentifier(interfaceName),
          undefined,
          undefined,
          propertyElements
        ),
        [
          interfaceName,
          appName,
          `id: ${appId}`,
          `revision: ${revision}`,
          appCode && `code: ${appCode}`,
          `@see ${clientConfig.baseUrl}/k/${appId}/`,
        ].filter((c) => c)
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

  return stringer([
    ...createHeaderComment(),
    importDeclaration,
    ...interfaceNodes,
  ]);
};
