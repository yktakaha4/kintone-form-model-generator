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
const cliLogger = getLogger("cli");

const kintoneRecordImportPath = "@kintone/rest-api-client/lib/client/types";
const kintoneRecordTypeName = "Record";
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

// https://developer.cybozu.io/hc/ja/articles/202166330
const simpleParameterTypeMappings: Record<string, ts.TypeLiteralNode> = {
  CREATOR: f.createTypeLiteralNode([
    f.createPropertySignature(
      undefined,
      f.createIdentifier("value"),
      undefined,
      f.createTypeLiteralNode([
        f.createPropertySignature(
          undefined,
          f.createIdentifier("code"),
          undefined,
          f.createTypeReferenceNode(f.createIdentifier("string"))
        ),
      ])
    ),
  ]),
  CREATED_TIME: f.createTypeLiteralNode([
    f.createPropertySignature(
      undefined,
      f.createIdentifier("value"),
      undefined,
      f.createTypeReferenceNode(f.createIdentifier("string"))
    ),
  ]),
  MODIFIER: f.createTypeLiteralNode([
    f.createPropertySignature(
      undefined,
      f.createIdentifier("value"),
      undefined,
      f.createTypeLiteralNode([
        f.createPropertySignature(
          undefined,
          f.createIdentifier("code"),
          undefined,
          f.createTypeReferenceNode(f.createIdentifier("string"))
        ),
      ])
    ),
  ]),
  UPDATED_TIME: f.createTypeLiteralNode([
    f.createPropertySignature(
      undefined,
      f.createIdentifier("value"),
      undefined,
      f.createTypeReferenceNode(f.createIdentifier("string"))
    ),
  ]),
  SINGLE_LINE_TEXT: f.createTypeLiteralNode([
    f.createPropertySignature(
      undefined,
      f.createIdentifier("value"),
      undefined,
      f.createTypeReferenceNode(f.createIdentifier("string"))
    ),
  ]),
  MULTI_LINE_TEXT: f.createTypeLiteralNode([
    f.createPropertySignature(
      undefined,
      f.createIdentifier("value"),
      undefined,
      f.createTypeReferenceNode(f.createIdentifier("string"))
    ),
  ]),
  RICH_TEXT: f.createTypeLiteralNode([
    f.createPropertySignature(
      undefined,
      f.createIdentifier("value"),
      undefined,
      f.createTypeReferenceNode(f.createIdentifier("string"))
    ),
  ]),
  NUMBER: f.createTypeLiteralNode([
    f.createPropertySignature(
      undefined,
      f.createIdentifier("value"),
      undefined,
      f.createTypeReferenceNode(f.createIdentifier("string"))
    ),
  ]),
  // CALC type can`t update.
  CHECK_BOX: f.createTypeLiteralNode([
    f.createPropertySignature(
      undefined,
      f.createIdentifier("value"),
      undefined,
      f.createArrayTypeNode(
        f.createTypeReferenceNode(f.createIdentifier("string"))
      )
    ),
  ]),
  RADIO_BUTTON: f.createTypeLiteralNode([
    f.createPropertySignature(
      undefined,
      f.createIdentifier("value"),
      undefined,
      f.createTypeReferenceNode(f.createIdentifier("string"))
    ),
  ]),
  MULTI_SELECT: f.createTypeLiteralNode([
    f.createPropertySignature(
      undefined,
      f.createIdentifier("value"),
      undefined,
      f.createArrayTypeNode(
        f.createTypeReferenceNode(f.createIdentifier("string"))
      )
    ),
  ]),
  DROP_DOWN: f.createTypeLiteralNode([
    f.createPropertySignature(
      undefined,
      f.createIdentifier("value"),
      undefined,
      f.createTypeReferenceNode(f.createIdentifier("string"))
    ),
  ]),
  USER_SELECT: f.createTypeLiteralNode([
    f.createPropertySignature(
      undefined,
      f.createIdentifier("value"),
      undefined,
      f.createArrayTypeNode(
        f.createTypeLiteralNode([
          f.createPropertySignature(
            undefined,
            f.createIdentifier("code"),
            undefined,
            f.createTypeReferenceNode(f.createIdentifier("string"))
          ),
        ])
      )
    ),
  ]),
  ORGANIZATION_SELECT: f.createTypeLiteralNode([
    f.createPropertySignature(
      undefined,
      f.createIdentifier("value"),
      undefined,
      f.createArrayTypeNode(
        f.createTypeLiteralNode([
          f.createPropertySignature(
            undefined,
            f.createIdentifier("code"),
            undefined,
            f.createTypeReferenceNode(f.createIdentifier("string"))
          ),
        ])
      )
    ),
  ]),
  GROUP_SELECT: f.createTypeLiteralNode([
    f.createPropertySignature(
      undefined,
      f.createIdentifier("value"),
      undefined,
      f.createArrayTypeNode(
        f.createTypeLiteralNode([
          f.createPropertySignature(
            undefined,
            f.createIdentifier("code"),
            undefined,
            f.createTypeReferenceNode(f.createIdentifier("string"))
          ),
        ])
      )
    ),
  ]),
  DATE: f.createTypeLiteralNode([
    f.createPropertySignature(
      undefined,
      f.createIdentifier("value"),
      undefined,
      f.createTypeReferenceNode(f.createIdentifier("string"))
    ),
  ]),
  TIME: f.createTypeLiteralNode([
    f.createPropertySignature(
      undefined,
      f.createIdentifier("value"),
      undefined,
      f.createTypeReferenceNode(f.createIdentifier("string"))
    ),
  ]),
  DATETIME: f.createTypeLiteralNode([
    f.createPropertySignature(
      undefined,
      f.createIdentifier("value"),
      undefined,
      f.createTypeReferenceNode(f.createIdentifier("string"))
    ),
  ]),
  LINK: f.createTypeLiteralNode([
    f.createPropertySignature(
      undefined,
      f.createIdentifier("value"),
      undefined,
      f.createTypeReferenceNode(f.createIdentifier("string"))
    ),
  ]),
  FILE: f.createTypeLiteralNode([
    f.createPropertySignature(
      undefined,
      f.createIdentifier("value"),
      undefined,
      f.createArrayTypeNode(
        f.createTypeLiteralNode([
          f.createPropertySignature(
            undefined,
            f.createIdentifier("fileKey"),
            undefined,
            f.createTypeReferenceNode(f.createIdentifier("string"))
          ),
        ])
      )
    ),
  ]),
  // CATEGORY type can`t update.
  // STATUS type can`t update.
  // STATUS_ASSIGNEE type can`t update.
};

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
  cliLogger.info("fetch Kintone app info...");
  const appIds = params.appIds?.filter((appId) => appId) ?? [];
  const apps = await client.getApps({ ids: appIds });
  for (const appId of appIds) {
    if (!apps.find((app) => app.appId === appId)) {
      throw new Error(`not found: appId=${appId}`);
    }
  }
  if (apps.length === 0) {
    throw new Error("There is no apps in your Kintone account.");
  }

  logger.info("appIds:", appIds);

  // generate
  cliLogger.info("generating models...");
  const interfaceNames: Set<string> = new Set();
  const interfaceNodes: Array<ts.Node> = [];
  const fieldTypes: Set<string> = new Set();

  // For each application
  for (const { appId, code: appCode, name: appName } of apps) {
    logger.info("appId:", appId);
    const { properties, revision } = await client.getFormFields({ appId });

    const propertyNames: Set<string> = new Set();
    const propertyElements: Array<ts.TypeElement> = [];
    const parameterPropertyElements: Array<ts.TypeElement> = [];

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
        const parameterInSubtablePropertySignatures: Array<ts.PropertySignature> =
          [];
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
                  inSubtableType,
                  `@type ${simpleTypeMappings[inSubtableType]}`,
                ]
              )
            );

            // for parameter
            if (simpleParameterTypeMappings[inSubtableType]) {
              parameterInSubtablePropertySignatures.push(
                withJSDocComments(
                  f.createPropertySignature(
                    undefined,
                    f.createStringLiteral(inSubtableCode),
                    f.createToken(ts.SyntaxKind.QuestionToken),
                    f.createTypeLiteralNode([
                      f.createPropertySignature(
                        undefined,
                        f.createIdentifier("value"),
                        undefined,
                        f.createTypeReferenceNode(f.createIdentifier("string"))
                      ),
                    ])
                  ),
                  [
                    inSubtableLabel,
                    inSubtableCode,
                    inSubtableType,
                    `@type ${simpleTypeMappings[inSubtableType]}`,
                  ]
                )
              );
            } else {
              logger.debug(
                `skip parameter: appId=${appId}, code=${code}, inSubtableCode=${inSubtableCode}, inSubtableType=${inSubtableType}`
              );
            }
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

        // for Parameter
        parameterPropertyElements.push(
          withJSDocComments(
            f.createPropertySignature(
              undefined,
              f.createStringLiteral(propertyName),
              f.createToken(ts.SyntaxKind.QuestionToken),
              f.createTypeLiteralNode([
                f.createPropertySignature(
                  undefined,
                  f.createIdentifier("value"),
                  undefined,
                  f.createArrayTypeNode(
                    f.createTypeLiteralNode([
                      withJSDocComments(
                        f.createPropertySignature(
                          undefined,
                          f.createIdentifier("id"),
                          undefined,
                          f.createTypeReferenceNode("string")
                        ),
                        ["id", "@type string"]
                      ),
                      f.createPropertySignature(
                        undefined,
                        f.createIdentifier("value"),
                        undefined,
                        f.createTypeLiteralNode(
                          parameterInSubtablePropertySignatures
                        )
                      ),
                    ])
                  )
                ),
              ])
            ),
            [`${label}`, code, type, `@type Object`]
          )
        );
      } else if (simpleTypeMappings[type]) {
        // Simple type
        fieldTypes.add(simpleTypeMappings[type]);
        propertyElements.push(
          withJSDocComments(
            f.createPropertySignature(
              undefined,
              f.createStringLiteral(propertyName),
              undefined,
              f.createTypeReferenceNode(simpleTypeMappings[type])
            ),
            [label, code, type, `@type ${simpleTypeMappings[type]}`]
          )
        );

        // for Parameter
        if (simpleParameterTypeMappings[type]) {
          parameterPropertyElements.push(
            withJSDocComments(
              f.createPropertySignature(
                undefined,
                f.createStringLiteral(propertyName),
                f.createToken(ts.SyntaxKind.QuestionToken),
                simpleParameterTypeMappings[type]
              ),
              [label, code, type, "@type Object"]
            )
          );
        } else {
          logger.debug(
            `skip parameter: appId=${appId}, code=${code}, type=${type}`
          );
        }
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
      if (config.modelNamingDuplicationStrategy === "skip") {
        cliLogger.warn(
          `duplicate: appId=${appId}, interfaceName=${interfaceName}`
        );
        // to next app
        continue;
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
          [
            f.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
              f.createExpressionWithTypeArguments(
                f.createIdentifier(kintoneRecordTypeName),
                undefined
              ),
            ]),
          ],
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

    // for parameter
    const interfaceNameForParameter = `${interfaceName}ForParameter`;
    interfaceNodes.push(
      withJSDocComments(
        f.createInterfaceDeclaration(
          undefined,
          [f.createToken(ts.SyntaxKind.ExportKeyword)],
          f.createIdentifier(interfaceNameForParameter),
          undefined,
          undefined,
          parameterPropertyElements
        ),
        [
          interfaceNameForParameter,
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
  const importSpecifiers: Array<ts.ImportSpecifier> = [];
  for (const fieldType of Array.from(fieldTypes).sort()) {
    importSpecifiers.push(
      f.createImportSpecifier(false, undefined, f.createIdentifier(fieldType))
    );
  }

  const importDeclarations = [
    ts.factory.createImportDeclaration(
      undefined,
      undefined,
      f.createImportClause(
        false,
        undefined,
        f.createNamedImports([
          f.createImportSpecifier(
            false,
            undefined,
            f.createIdentifier(kintoneRecordTypeName)
          ),
        ])
      ),
      f.createStringLiteral(kintoneRecordImportPath)
    ),
    ts.factory.createImportDeclaration(
      undefined,
      undefined,
      f.createImportClause(
        false,
        undefined,
        f.createNamedImports(importSpecifiers)
      ),
      f.createStringLiteral(kintoneFieldImportPath)
    ),
  ];

  return stringer([
    ...createHeaderComment(),
    ...importDeclarations,
    ...interfaceNodes,
  ]);
};
