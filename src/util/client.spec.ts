import { join } from "path";
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
  RichText,
  MultiLineText,
  Calc,
} from "@kintone/rest-api-client/lib/KintoneFields/types/field";
import { createClientConfig } from "./client";

interface FieldTestInterface extends Record {
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
  // eslint-disable-next-line @typescript-eslint/ban-types
  NumberField: Number;
  SubtableField: Subtable<{
    SubtableRowField: SingleLineText;
  }>;
  CategoryField: Category;
  StatusField: Status;
  StatusAssigneeField: StatusAssignee;
  RichTextField: RichText;
  MultiLineTextField: MultiLineText;
  CalcField: Calc;
}

describe("Import", () => {
  test("Field type contract test", () => {
    const record: FieldTestInterface = {
      IdField: {
        type: "__ID__",
        value: "value",
      },
      RecordNumberField: {
        type: "RECORD_NUMBER",
        value: "value",
      },
      RevisionField: {
        type: "__REVISION__",
        value: "value",
      },
      CreatorField: {
        type: "CREATOR",
        value: {
          code: "code",
          name: "name",
        },
      },
      CreatedTimeField: {
        type: "CREATED_TIME",
        value: "value",
      },
      ModifierField: {
        type: "MODIFIER",
        value: {
          code: "code",
          name: "name",
        },
      },
      UpdatedTimeField: {
        type: "UPDATED_TIME",
        value: "value",
      },
      CheckBoxField: {
        type: "CHECK_BOX",
        value: ["value"],
      },
      RadioButtonField: {
        type: "RADIO_BUTTON",
        value: "value",
      },
      MultiSelectField: {
        type: "MULTI_SELECT",
        value: ["value"],
      },
      DropdownField: {
        type: "DROP_DOWN",
        value: "value",
      },
      UserSelectField: {
        type: "USER_SELECT",
        value: [{ code: "code", name: "name" }],
      },
      OrganizationSelectField: {
        type: "ORGANIZATION_SELECT",
        value: [{ code: "code", name: "name" }],
      },
      GroupSelectField: {
        type: "GROUP_SELECT",
        value: [{ code: "code", name: "name" }],
      },
      DateField: {
        type: "DATE",
        value: "value",
      },
      TimeField: {
        type: "TIME",
        value: "value",
      },
      DateTimeField: {
        type: "DATETIME",
        value: "value",
      },
      LinkField: {
        type: "LINK",
        value: "value",
      },
      FileField: {
        type: "FILE",
        value: [
          {
            contentType: "contentType",
            fileKey: "fileKey",
            name: "name",
            size: "size",
          },
        ],
      },
      SingleLineTextField: {
        type: "SINGLE_LINE_TEXT",
        value: "value",
      },
      NumberField: {
        type: "NUMBER",
        value: "value",
      },
      SubtableField: {
        type: "SUBTABLE",
        value: [
          {
            id: "id",
            value: {
              SubtableRowField: {
                type: "SINGLE_LINE_TEXT",
                value: "value",
              },
            },
          },
        ],
      },
      CategoryField: {
        type: "CATEGORY",
        value: ["value"],
      },
      StatusField: {
        type: "STATUS",
        value: "value",
      },
      StatusAssigneeField: {
        type: "STATUS_ASSIGNEE",
        value: [
          {
            code: "code",
            name: "name",
          },
        ],
      },
      RichTextField: {
        type: "RICH_TEXT",
        value: "value",
      },
      MultiLineTextField: {
        type: "MULTI_LINE_TEXT",
        value: "value",
      },
      CalcField: {
        type: "CALC",
        value: "value",
      },
    };
    expect(record.IdField.value).toBeTruthy;
  });
});

describe("createClientConfig", () => {
  test("read config file", () => {
    const filePath = join(__dirname, "..", "__tests__", "kintone-config.json");
    const config = createClientConfig(filePath);
    expect(config.auth?.username).toBe("ユーザー名");
  });
});
