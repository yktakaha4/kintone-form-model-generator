import { sanitizeInterfaceName, stringer } from "./ast";
import ts, { factory as f } from "typescript";

describe("stringer", () => {
  test("stringify", () => {
    const fieldImportStringLiteral = f.createStringLiteral(
      "@kintone/rest-api-client/lib/KintoneFields/types/field"
    );
    const idTypeIdentifier = f.createIdentifier("ID");
    const interfaceNameIdentifier = f.createIdentifier("InterfaceName");
    const idFieldPropertyNameIdentifier = f.createStringLiteral("idField");
    const subtableIdentifier = f.createIdentifier("Subtable");
    const subtableFieldPropertyNameIdentifier =
      f.createStringLiteral("subTableField");

    const singleLineTextFieldIdentifier = f.createIdentifier("SingleLineText");
    const singleLineTextFieldPropertyNameIdentifier =
      f.createStringLiteral("singleLineText");

    const nodes = [
      f.createImportDeclaration(
        undefined,
        undefined,
        f.createImportClause(
          false,
          undefined,
          f.createNamedImports([
            f.createImportSpecifier(false, undefined, idTypeIdentifier),
            f.createImportSpecifier(false, undefined, subtableIdentifier),
            f.createImportSpecifier(
              false,
              undefined,
              singleLineTextFieldIdentifier
            ),
          ])
        ),
        fieldImportStringLiteral
      ),
      f.createInterfaceDeclaration(
        undefined,
        [f.createToken(ts.SyntaxKind.ExportKeyword)],
        interfaceNameIdentifier,
        undefined,
        undefined,
        [
          f.createPropertySignature(
            undefined,
            idFieldPropertyNameIdentifier,
            undefined,
            f.createTypeReferenceNode(idTypeIdentifier)
          ),
          f.createPropertySignature(
            undefined,
            subtableFieldPropertyNameIdentifier,
            undefined,
            f.createTypeReferenceNode(subtableIdentifier, [
              f.createTypeLiteralNode([
                f.createPropertySignature(
                  undefined,
                  singleLineTextFieldPropertyNameIdentifier,
                  undefined,
                  f.createTypeReferenceNode(singleLineTextFieldIdentifier)
                ),
              ]),
            ])
          ),
        ]
      ),
    ];

    expect(stringer(nodes)).toBe(
      `
import { ID, Subtable, SingleLineText } from "@kintone/rest-api-client/lib/KintoneFields/types/field";
export interface InterfaceName {
    "idField": ID;
    "subTableField": Subtable<{
        "singleLineText": SingleLineText;
    }>;
}
`.trimStart()
    );
  });
});

describe("sanitizeInterfaceName", () => {
  test("escaping", () => {
    expect(sanitizeInterfaceName("")).toBe("$");
    expect(sanitizeInterfaceName("1Test")).toBe("$1Test");
    expect(sanitizeInterfaceName(" \r\nHoge fuga ")).toBe("Hogefuga");
    expect(sanitizeInterfaceName("\t\t\t1\t2345")).toBe("$12345");
    expect(sanitizeInterfaceName("全角\u3000文字")).toBe("全角文字");
    expect(sanitizeInterfaceName("Hello@world")).toBe("Hello_world");
    expect(sanitizeInterfaceName("_MyAwesomeRecord")).toBe("_MyAwesomeRecord");
    expect(sanitizeInterfaceName("$MyAwesomeRecord")).toBe("$MyAwesomeRecord");
  });
});
