# kintone-form-model-generator

## Prerequirements

- Node.js

## Usage

```sh
# Install
npm install -g yktakaha4/kintone-form-model-generator

# Specify secrets
export KINTONE_BASE_URL=https://your-domain.cybozu.com
export KINTONE_USERNAME=your-username
export KINTONE_PASSWORD=your-password

# Generate all models
kintone-form-model-generator generate

# Specify app ids
kintone-form-model-generator generate --app-ids=1,5,10

# If you don't want to install
npx yktakaha4/kintone-form-model-generator generate
```

## Configuration

### Configuration

Specify detailed behavior by `--config` option. (Must be `utf-8` encoding)

```sh
kintone-form-model-generator generate --config=config.json
```

Example.

```json
{
  "outDir": "dist/",
  "modelNaming": "AppName"
}
```

| Name | Type | Default | Description |
| ---- | ---- | ---- | ---- |
| outDir | String | `out/` | Output directory |
| modelNaming | String | `AppId` | `AppId` or `AppName` |
| propertyNaming | String | `Code` | `Code` or `Label` |

### Client configuration

Specify the connection to Kintone API with `--client-config` option. (Must be `utf-8` encoding)

See more details.

https://github.com/kintone/js-sdk/tree/master/packages/rest-api-client#parameters-for-kintonerestapiclient

```sh
kintone-form-model-generator generate --client-config=client-config.json
```

Example.

```json
{
  "baseUrl": "https://your-domain.cybozu.com",
  "auth": {
    "username": "your-username",
    "password": "your-password"
  }
}
```
