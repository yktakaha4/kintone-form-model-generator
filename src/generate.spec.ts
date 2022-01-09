const dummyBaseUrl = "https://dummy-base-url.local";
process.env.KINTONE_BASE_URL = dummyBaseUrl;
process.env.KINTONE_USERNAME = "dummy-user";
process.env.KINTONE_PASSWORD = "dummy-pw";

import { generate } from "./generate";
import * as client from "./util/client";
import { createClientConfig, ClientConfig } from "./util/client";
import { Config, createConfig } from "./util/config";
import getAppsResponse from "./__tests__/get-apps-response.json";
import getNameDuplicatedAppsResponse from "./__tests__/get-name-duplicated-apps-response.json";
import getFormFieldsResponse from "./__tests__/get-form-fields-response.json";
import p from "../package.json";

describe("generate", () => {
  describe("normal case", () => {
    let config: Config;
    let clientConfig: ClientConfig;
    beforeEach(() => {
      config = createConfig();
      clientConfig = createClientConfig();
      jest.spyOn(client, "Client").mockImplementationOnce(() => {
        return {
          getApps: () => getAppsResponse.apps,
          getFormFields: () => getFormFieldsResponse,
        } as unknown as client.Client;
      });
    });

    test("regression test", async () => {
      const result = await generate({
        params: {},
        config,
        clientConfig,
      });

      expect(result).toBe(actual);
    });

    test("modelNameMapping", async () => {
      config.modelNameMapping = {
        "54": "CustomName",
      };

      const result = await generate({
        params: {},
        config,
        clientConfig,
      });

      expect(result).toContain("interface KintoneCustomNameRecord extends");
      expect(result).toContain(
        "interface KintoneCustomNameRecordForParameter {"
      );
    });

    test("if modelNamePrefix is empty", async () => {
      config.modelNamePrefix = "";

      const result = await generate({
        params: {},
        config,
        clientConfig,
      });

      expect(result).toContain("interface App54Record extends");
      expect(result).toContain("interface App54RecordForParameter {");
    });

    test("if modelNameSuffix is empty", async () => {
      config.modelNameSuffix = "";

      const result = await generate({
        params: {},
        config,
        clientConfig,
      });

      expect(result).toContain("interface KintoneApp54 extends");
      expect(result).toContain("interface KintoneApp54ForParameter {");
    });
  });

  describe("error case (not found)", () => {
    let config: Config;
    let clientConfig: ClientConfig;
    beforeEach(() => {
      config = createConfig();
      clientConfig = createClientConfig();
      jest.spyOn(client, "Client").mockImplementationOnce(() => {
        return {
          getApps: () => [],
        } as unknown as client.Client;
      });
    });

    test("if appId is not specified", async () => {
      const result = generate({
        params: {},
        config,
        clientConfig,
      });

      await expect(result).rejects.toThrow();
    });

    test("if appId is not found", async () => {
      const result = generate({
        params: {
          appIds: ["1"],
        },
        config,
        clientConfig,
      });

      await expect(result).rejects.toThrow();
    });
  });

  describe("error case (duplicate)", () => {
    let config: Config;
    let clientConfig: ClientConfig;
    beforeEach(() => {
      config = createConfig();
      config.modelNameMapping = {
        "54": "Duplicate",
        "55": "Duplicate",
      };

      clientConfig = createClientConfig();
      jest.spyOn(client, "Client").mockImplementationOnce(() => {
        return {
          getApps: () => getNameDuplicatedAppsResponse.apps,
          getFormFields: () => getFormFieldsResponse,
        } as unknown as client.Client;
      });
    });

    test("if modelNamingDuplicationStrategy is error", async () => {
      config.modelNamingDuplicationStrategy = "error";

      const result = generate({
        params: {},
        config,
        clientConfig,
      });

      await expect(result).rejects.toThrow();
    });

    test("if modelNamingDuplicationStrategy is skip", async () => {
      config.modelNamingDuplicationStrategy = "skip";

      const result = await generate({
        params: {},
        config,
        clientConfig,
      });

      expect(result).toContain("id: 54");
    });

    test("if modelNamingDuplicationStrategy is uniquifyWithAppId", async () => {
      config.modelNamingDuplicationStrategy = "uniquifyWithAppId";

      const result = await generate({
        params: {},
        config,
        clientConfig,
      });

      expect(result).toContain("interface KintoneDuplicateRecord extends");
      expect(result).toContain("interface KintoneDuplicateRecordApp55 extends");
      expect(result).toContain(
        "interface KintoneDuplicateRecordForParameter {"
      );
      expect(result).toContain(
        "interface KintoneDuplicateRecordApp55ForParameter {"
      );
    });
  });
});

const actual = `
/* tslint:disable */
/* eslint-disable */
/**
 * This file is auto generated by ${p.name} version ${p.version}.
 * Don\`t edit this file manually.
 * @see ${p.homepage}
 */
import { Record } from "@kintone/rest-api-client/lib/client/types";
import { Calc, Category, CheckBox, CreatedTime, Creator, Date, DateTime, Dropdown, File, GroupSelect, ID, Link, Modifier, MultiLineText, MultiSelect, Number, OrganizationSelect, RadioButton, RecordNumber, Revision, RichText, SingleLineText, Status, StatusAssignee, Subtable, Time, UpdatedTime, UserSelect } from "@kintone/rest-api-client/lib/KintoneFields/types/field";
/**
* KintoneApp54Record
* 入力項目テストアプリ
* id: 54
* revision: 4
* @see ${dummyBaseUrl}/k/54/
*/
export interface KintoneApp54Record extends Record {
    /**
    * ID
    * @type ID
    */
    "__ID__": ID;
    /**
    * Revision
    * @type Revision
    */
    "__REVISION__": Revision;
    /**
    * カテゴリー
    * CATEGORY
    * @type Category
    */
    "カテゴリー": Category;
    /**
    * グループ選択
    * GROUP_SELECT
    * @type GroupSelect
    */
    "グループ選択": GroupSelect;
    /**
    * ステータス
    * STATUS
    * @type Status
    */
    "ステータス": Status;
    /**
    * チェックボックス
    * CHECK_BOX
    * @type CheckBox
    */
    "チェックボックス": CheckBox;
    /**
    * テーブル
    * @type Subtable
    */
    "テーブル": Subtable<{
        /**
        * 文字列 (1行)
        * 文字列__1行__Table
        * SINGLE_LINE_TEXT
        * @type SingleLineText
        */
        "文字列__1行__Table": SingleLineText;
        /**
        * 文字列 (1行)2
        * 文字列__1行__Table2
        * SINGLE_LINE_TEXT
        * @type SingleLineText
        */
        "文字列__1行__Table2": SingleLineText;
    }>;
    /**
    * ドロップダウン
    * DROP_DOWN
    * @type Dropdown
    */
    "ドロップダウン": Dropdown;
    /**
    * ユーザー選択
    * USER_SELECT
    * @type UserSelect
    */
    "ユーザー選択": UserSelect;
    /**
    * ラジオボタン
    * RADIO_BUTTON
    * @type RadioButton
    */
    "ラジオボタン": RadioButton;
    /**
    * リッチエディター
    * RICH_TEXT
    * @type RichText
    */
    "リッチエディター": RichText;
    /**
    * リンク
    * LINK
    * @type Link
    */
    "リンク": Link;
    /**
    * ルックアップ
    * NUMBER
    * @type Number
    */
    "ルックアップ": Number;
    /**
    * レコード番号
    * RECORD_NUMBER
    * @type RecordNumber
    */
    "レコード番号": RecordNumber;
    /**
    * 作成日時
    * CREATED_TIME
    * @type CreatedTime
    */
    "作成日時": CreatedTime;
    /**
    * 作成者
    * CREATOR
    * @type Creator
    */
    "作成者": Creator;
    /**
    * 作業者
    * STATUS_ASSIGNEE
    * @type StatusAssignee
    */
    "作業者": StatusAssignee;
    /**
    * 数値
    * NUMBER
    * @type Number
    */
    "数値": Number;
    /**
    * 文字列 (1行)
    * 文字列__1行_
    * SINGLE_LINE_TEXT
    * @type SingleLineText
    */
    "文字列__1行_": SingleLineText;
    /**
    * 文字列 (複数行)
    * 文字列__複数行_
    * MULTI_LINE_TEXT
    * @type MultiLineText
    */
    "文字列__複数行_": MultiLineText;
    /**
    * 日付
    * DATE
    * @type Date
    */
    "日付": Date;
    /**
    * 日時
    * DATETIME
    * @type DateTime
    */
    "日時": DateTime;
    /**
    * 時刻
    * TIME
    * @type Time
    */
    "時刻": Time;
    /**
    * 更新日時
    * UPDATED_TIME
    * @type UpdatedTime
    */
    "更新日時": UpdatedTime;
    /**
    * 更新者
    * MODIFIER
    * @type Modifier
    */
    "更新者": Modifier;
    /**
    * 添付ファイル
    * FILE
    * @type File
    */
    "添付ファイル": File;
    /**
    * 組織選択
    * ORGANIZATION_SELECT
    * @type OrganizationSelect
    */
    "組織選択": OrganizationSelect;
    /**
    * 複数選択
    * MULTI_SELECT
    * @type MultiSelect
    */
    "複数選択": MultiSelect;
    /**
    * 計算
    * CALC
    * @type Calc
    */
    "計算": Calc;
}
/**
* KintoneApp54RecordForParameter
* 入力項目テストアプリ
* id: 54
* revision: 4
* @see ${dummyBaseUrl}/k/54/
*/
export interface KintoneApp54RecordForParameter {
    [fieldCode: string]: {
        value: unknown;
    };
    /**
    * グループ選択
    * GROUP_SELECT
    * @type Object
    */
    "グループ選択"?: {
        value: {
            code: string;
        }[];
    };
    /**
    * チェックボックス
    * CHECK_BOX
    * @type Object
    */
    "チェックボックス"?: {
        value: string[];
    };
    /**
    * テーブル
    * SUBTABLE
    * @type Object
    */
    "テーブル"?: {
        value: {
            /**
            * id
            * @type string
            */
            id: string;
            value: {
                /**
                * 文字列 (1行)
                * 文字列__1行__Table
                * SINGLE_LINE_TEXT
                * @type SingleLineText
                */
                "文字列__1行__Table"?: {
                    value: string;
                };
                /**
                * 文字列 (1行)2
                * 文字列__1行__Table2
                * SINGLE_LINE_TEXT
                * @type SingleLineText
                */
                "文字列__1行__Table2"?: {
                    value: string;
                };
            };
        }[];
    };
    /**
    * ドロップダウン
    * DROP_DOWN
    * @type Object
    */
    "ドロップダウン"?: {
        value: string;
    };
    /**
    * ユーザー選択
    * USER_SELECT
    * @type Object
    */
    "ユーザー選択"?: {
        value: {
            code: string;
        }[];
    };
    /**
    * ラジオボタン
    * RADIO_BUTTON
    * @type Object
    */
    "ラジオボタン"?: {
        value: string;
    };
    /**
    * リッチエディター
    * RICH_TEXT
    * @type Object
    */
    "リッチエディター"?: {
        value: string;
    };
    /**
    * リンク
    * LINK
    * @type Object
    */
    "リンク"?: {
        value: string;
    };
    /**
    * ルックアップ
    * NUMBER
    * @type Object
    */
    "ルックアップ"?: {
        value: string;
    };
    /**
    * 作成日時
    * CREATED_TIME
    * @type Object
    */
    "作成日時"?: {
        value: string;
    };
    /**
    * 作成者
    * CREATOR
    * @type Object
    */
    "作成者"?: {
        value: {
            code: string;
        };
    };
    /**
    * 数値
    * NUMBER
    * @type Object
    */
    "数値"?: {
        value: string;
    };
    /**
    * 文字列 (1行)
    * 文字列__1行_
    * SINGLE_LINE_TEXT
    * @type Object
    */
    "文字列__1行_"?: {
        value: string;
    };
    /**
    * 文字列 (複数行)
    * 文字列__複数行_
    * MULTI_LINE_TEXT
    * @type Object
    */
    "文字列__複数行_"?: {
        value: string;
    };
    /**
    * 日付
    * DATE
    * @type Object
    */
    "日付"?: {
        value: string;
    };
    /**
    * 日時
    * DATETIME
    * @type Object
    */
    "日時"?: {
        value: string;
    };
    /**
    * 時刻
    * TIME
    * @type Object
    */
    "時刻"?: {
        value: string;
    };
    /**
    * 更新日時
    * UPDATED_TIME
    * @type Object
    */
    "更新日時"?: {
        value: string;
    };
    /**
    * 更新者
    * MODIFIER
    * @type Object
    */
    "更新者"?: {
        value: {
            code: string;
        };
    };
    /**
    * 添付ファイル
    * FILE
    * @type Object
    */
    "添付ファイル"?: {
        value: {
            fileKey: string;
        }[];
    };
    /**
    * 組織選択
    * ORGANIZATION_SELECT
    * @type Object
    */
    "組織選択"?: {
        value: {
            code: string;
        }[];
    };
    /**
    * 複数選択
    * MULTI_SELECT
    * @type Object
    */
    "複数選択"?: {
        value: string[];
    };
}
`.trimStart();
