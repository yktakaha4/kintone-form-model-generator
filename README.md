# kintone-form-model-generator

## Prerequirements

- Node.js (>=12)

## Install

```sh
# Install
npm install -g kintone-form-model-generator

# npx
npx kintone-form-model-generator
```

## Usage

### Generate

```sh
# Generate all models
kintone-form-model-generator generate

# Specify app ids (or -a option)
kintone-form-model-generator generate --app-ids=1,5,10
```

By default, files are generated in the `out/` directory.

An example of `out/index.ts` .

```ts:index.ts
import { ID, Revision } from "@kintone/rest-api-client/lib/KintoneFields/types/field";
/**
 * KintoneApp1Record
 * My Awesome App
 * id: 1
 * revision: 1
 * @see https://your-domain.cybozu.com/k/1/
 */
export interface KintoneApp1Record {
  /**
   * ID
   * @type ID
   */
  __ID__: ID;
  /**
   * Revision
   * @type Revision
   */
  __REVISION__: Revision;
  /**
   * チェックボックス
   * CHECK_BOX
   * @type CheckBox
   */
  チェックボックス: CheckBox;
  /**
   * テーブル
   * @type Subtable
   */
  テーブル: Subtable<{
    /**
     * 文字列 (1行)
     * 文字列__1行__Table
     * SINGLE_LINE_TEXT
     * @type SingleLineText
     */
    文字列__1行__Table: SingleLineText;
  }>;
}
/**
 * KintoneApp54RecordForParameter
 * My Awesome App
 * id: 1
 * revision: 1
 * @see https://your-domain.cybozu.com/k/1/
 */
export interface KintoneApp1RecordForParameter {
  /**
   * チェックボックス
   * CHECK_BOX
   * @type Object
   */
  チェックボックス?: {
    value: string[];
  };
  /**
   * テーブル
   * SUBTABLE
   * @type Object
   */
  テーブル?: {
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
        文字列__1行__Table?: {
          value: string;
        };
      };
    }[];
  };
}
```

## Configuration

### Environments variables

Specify secrets in the environment variables.

| Name             | Description                                             |
| ---------------- | ------------------------------------------------------- |
| KINTONE_BASE_URL | URL for kintone (ex. `https://your-domain.cybozu.com` ) |
| KINTONE_USERNAME | Kintone username                                        |
| KINTONE_PASSWORD | Kintone apssword                                        |

### Configuration

Specify detailed behavior by `--config` or `-c` option. (Must be `utf-8` encoded JSON file.)

```sh
kintone-form-model-generator generate --config=config.json
```

| Name                           | Type   | Default   | Description                                                   |
| ------------------------------ | ------ | --------- | ------------------------------------------------------------- |
| outDir                         | String | `out/`    | Output directory                                              |
| modelNaming                    | String | `appId`   | `appId` or `appName` or `appCode`                             |
| modelNameMapping               | Object | {}        | A dictionary object with a model name using `appId` as a key. |
| modelNamePrefix                | String | `Kintone` | Model name prefix                                             |
| modelNameSuffix                | String | `Record`  | Model name suffix                                             |
| modelNamingDuplicationStrategy | String | `error`   | `error` or `skip` or `uniquifyWithAppId`                      |

Example:

```json
{
  "outDir": "dist/",
  "modelNameMapping": {
    "1": "Customer",
    "2": "Sales"
  },
  "modelNamePrefix": "My",
  "modelNameSuffix": "Record"
}
```

### Kintone API configuration

Specify the connection to Kintone API with `--kintone-config` or `-k` option. (Must be `utf-8` encoded JSON file.)

See more details in [@kintone/rest-api-client](https://github.com/kintone/js-sdk/tree/master/packages/rest-api-client#parameters-for-kintonerestapiclient) repository.

```sh
kintone-form-model-generator generate --kintone-config=kintone-config.json
```

Example:

```json
{
  "baseUrl": "https://your-domain.cybozu.com",
  "auth": {
    "apiToken": "your-api-token"
  }
}
```
