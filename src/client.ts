import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { App } from "@kintone/rest-api-client/lib/client/types/app";

export interface ClientOptions {
  baseUrl?: string;
  auth?: {
    username: string;
    password: string;
  };
}

export class Client {
  private readonly client: KintoneRestAPIClient;

  constructor(options: ClientOptions) {
    this.client = new KintoneRestAPIClient(options);
  }

  async getAllApps() {
    const limit = 100;
    let offset = 0;
    let allApps: Array<App> = [];
    while (true) {
      const { apps } = await this.client.app.getApps({
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
