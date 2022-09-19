import {
  createHeaderComment,
  sanitizeInterfaceName,
  stringer,
  withJSDocComments,
} from "./ast";
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
      f.createStringLiteral("文字列__1行");

    const objectLiteralFieldPropertyNameIdentifier =
      f.createStringLiteral("objectLiteralField");
    const objectInnerFieldPropertyNameIdentifier =
      f.createStringLiteral("objectInnerField");
    const objectInterFieldIdentifier = f.createIdentifier("string");

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
          f.createPropertySignature(
            undefined,
            objectLiteralFieldPropertyNameIdentifier,
            undefined,
            f.createTypeLiteralNode([
              f.createPropertySignature(
                undefined,
                objectInnerFieldPropertyNameIdentifier,
                undefined,
                f.createTypeReferenceNode(objectInterFieldIdentifier)
              ),
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
        "文字列__1行": SingleLineText;
    }>;
    "objectLiteralField": {
        "objectInnerField": string;
    };
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

describe("createHeaderComment", () => {
  test("export comments", () => {
    const comments = createHeaderComment();
    expect(stringer(comments)).toContain("tslint:disable");
  });
});

describe("withJSDocComments", () => {
  test("commented model exported", () => {
    const nodes = [
      withJSDocComments(
        f.createInterfaceDeclaration(
          undefined,
          [f.createToken(ts.SyntaxKind.ExportKeyword)],
          f.createIdentifier("MyIF"),
          undefined,
          undefined,
          [
            withJSDocComments(
              f.createPropertySignature(
                undefined,
                f.createIdentifier("myField"),
                undefined,
                f.createTypeReferenceNode("string")
              ),
              ["comment of myField"]
            ),
          ]
        ),
        ["comment of MyIF", "I love Kintone."]
      ),
    ];

    expect(stringer(nodes)).toBe(
      `
/**
* comment of MyIF
* I love Kintone.
*/
export interface MyIF {
    /**
    * comment of myField
    */
    myField: string;
}
`.trimStart()
    );
  });
});
