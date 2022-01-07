# kintone-form-model-generator

## Prerequirements

- Node.js

## Install

```sh
# Install
npm install -g yktakaha4/kintone-form-model-generator
```

## Usage

### Generate

```sh
# Generate all models
kintone-form-model-generator generate

# Specify app ids
kintone-form-model-generator generate --app-ids=1,5,10
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

| Name                              | Type   | Default   | Description                       |
| --------------------------------- | ------ | --------- | --------------------------------- |
| outDir                            | String | `out/`    | Output directory                  |
| modelNaming                       | String | `appName` | `appName` or `appId` or `appCode` |
| modelNamePrefix                   | String | `Kintone` | Model name prefix                 |
| modelNameSuffix                   | String | `Record`  | Model name suffix                 |
| modelNamingDuplicationStrategy    | String | `error`   | `error` or `overwrite`            |
| propertyNaming                    | String | `code`    | `code` or `label`                 |
| propertyNamingDuplicationStrategy | String | `error`   | `error` or `overwrite`            |

```json
{
  "outDir": "dist/",
  "modelNaming": "appId"
}
```

### Kintone API configuration

Specify the connection to Kintone API with `--kintone-config` or `-k` option. (Must be `utf-8` encoded JSON file.)

See more details in [@kintone/rest-api-client](https://github.com/kintone/js-sdk/tree/master/packages/rest-api-client#parameters-for-kintonerestapiclient) repository.

```sh
kintone-form-model-generator generate --kintone-config=kintone-config.json
```

```json
{
  "baseUrl": "https://your-domain.cybozu.com",
  "auth": {
    "apiToken": "your-api-token"
  }
}
```
