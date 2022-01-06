import ts, { factory as f } from "typescript";
import { Record } from "@kintone/rest-api-client/lib/client/types";
import {
  ID,
  RecordNumber,
  Revision,
  Creator,
  CreatedTime,
  Modifier,
  UpdatedTime,
  CheckBox,
  RadioButton,
  MultiSelect,
  Dropdown,
  UserSelect,
  OrganizationSelect,
  GroupSelect,
  Date,
  Time,
  DateTime,
  Link,
  File,
  SingleLineText,
  Number,
  Subtable,
  Category,
  Status,
  StatusAssignee,
} from "@kintone/rest-api-client/lib/KintoneFields/types/field";

describe("yatteiki", () => {
  const stringer = (nodes: Array<ts.Node>) => {
    const sourceFile = ts.createSourceFile("", "", ts.ScriptTarget.Latest);
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

    return printer.printList(
      ts.ListFormat.MultiLineBlockStatements,
      f.createNodeArray(nodes),
      sourceFile
    );
  };

  test("Import statement", () => {
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
      ts.factory.createImportDeclaration(
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

    console.log(stringer(nodes));
  });
});

export interface FieldTestInterface extends Record {
  IdField: ID;
  RecordNumberField: RecordNumber;
  RevisionField: Revision;
  CreatorField: Creator;
  CreatedTimeField: CreatedTime;
  ModifierField: Modifier;
  UpdatedTimeField: UpdatedTime;

  CheckBoxField: CheckBox;
  RadioButtonField: RadioButton;
  MultiSelectField: MultiSelect;
  DropdownField: Dropdown;
  UserSelectField: UserSelect;
  OrganizationSelectField: OrganizationSelect;
  GroupSelectField: GroupSelect;
  DateField: Date;
  TimeField: Time;
  DateTimeField: DateTime;
  LinkField: Link;
  FileField: File;
  SingleLineTextField: SingleLineText;
  NumberField: Number;
  SubtableField: Subtable<{
    SubtableRowField: SingleLineText;
  }>;
  CategoryField: Category;
  StatusField: Status;
  StatusAssigneeField: StatusAssignee;
}
