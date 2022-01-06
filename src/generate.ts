import { Client, ClientConfig } from "./util/client";
import { Config } from "./util/config";

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
  const apps = await client.getApps({ ids: params.appIds });

  // generate
  for (const { appId, code: appCode, name: appName } of apps) {
    const { properties } = await client.getFormFields({ appId });
    for (const code of Object.keys(properties).sort()) {
      const field = properties[code];
      const label = field.label;
    }
  }

  // export
};
