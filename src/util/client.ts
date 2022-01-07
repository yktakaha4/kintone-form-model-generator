import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { App } from "@kintone/rest-api-client/lib/client/types/app";
import { PathLike, readFileSync } from "fs";
import { env } from "process";

const encoding = "utf-8";

export interface ClientConfig {
  baseUrl?: string;
  auth?: {
    username: string;
    password: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  basicAuth?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clientCertAuth?: any;
}

export class Client {
  private readonly client: KintoneRestAPIClient;

  constructor(config: ClientConfig) {
    this.client = new KintoneRestAPIClient(config);
  }

  async getApps(params?: { ids?: Array<string> }) {
    const limit = 100;
    let offset = 0;
    let allApps: Array<App> = [];
    while (offset < Number.MAX_SAFE_INTEGER) {
      const { apps } = await this.client.app.getApps({
        ids: params?.ids,
        offset: offset * limit,
        limit,
      });

      allApps = allApps.concat(apps);

      if (apps.length < limit) {
        break;
      } else {
        offset += 1;
      }
    }

    return allApps;
  }

  async getFormFields({ appId }: { appId: string }) {
    return await this.client.app.getFormFields({ app: appId });
  }
}

export const createClientConfig = (clientConfigPath?: PathLike) => {
  let clientConfig: ClientConfig = {};
  if (clientConfigPath) {
    clientConfig = JSON.parse(readFileSync(clientConfigPath, encoding));
  }

  const { KINTONE_BASE_URL, KINTONE_USERNAME, KINTONE_PASSWORD } = env;
  if (!clientConfig.baseUrl) {
    clientConfig.baseUrl = KINTONE_BASE_URL;
  }
  if (!(clientConfig.basicAuth || clientConfig.clientCertAuth)) {
    if (clientConfig.auth) {
      if (!clientConfig.auth.username && KINTONE_USERNAME) {
        clientConfig.auth.username = KINTONE_USERNAME;
      }
      if (!clientConfig.auth.password && KINTONE_PASSWORD) {
        clientConfig.auth.password = KINTONE_PASSWORD;
      }
    } else if (KINTONE_USERNAME && KINTONE_PASSWORD) {
      clientConfig.auth = {
        username: KINTONE_USERNAME,
        password: KINTONE_PASSWORD,
      };
    }
  }

  return clientConfig;
};
