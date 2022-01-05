# kintone-form-model-generator

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

Specify detailed behavior by `--config` option.

```sh
kintone-form-model-generator generate --config=config.json
```

```json
{
  "modelNaming": "AppName"
}
```

| Name | Type | Default | Description |
| ---- | ---- | ---- | ---- |
| modelNaming | String | AppId | `AppId` or `AppName` |
| propertyNaming | String | Code | `Code` or `PropertyName` |

### Client configuration

Specify the connection to Kintone API with `--client-config` option.

See more details.

https://github.com/kintone/js-sdk/tree/master/packages/rest-api-client#parameters-for-kintonerestapiclient

```sh
kintone-form-model-generator generate --client-config=client-config.json
```

```json
{
  "baseUrl": "https://your-domain.cybozu.com",
  "auth": {
    "username": "your-username",
    "password": "your-password"
  }
}
```
