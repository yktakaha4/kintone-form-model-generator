import { createConfig } from "./util/config";
import * as client from "./util/client";
import getAppsResponse from "./__tests__/get-apps-response.json";
import getFormFieldsResponse from "./__tests__/get-form-fields-response.json";
import { mkdtempSync, writeFileSync, readFileSync } from "fs";
import { join } from "path";
import { main } from "./main";
import { tmpdir } from "os";

describe("main", () => {
  let tmpDirPath: string;
  let resultPath: string;
  let configfilePath: string;
  beforeEach(() => {
    tmpDirPath = mkdtempSync(join(tmpdir(), "kfmgtests_"));
    resultPath = join(tmpDirPath, "result");
    configfilePath = join(tmpDirPath, "config.json");
    jest.spyOn(client, "Client").mockImplementationOnce(() => {
      return {
        getApps: () => getAppsResponse.apps,
        getFormFields: () => getFormFieldsResponse,
      } as unknown as client.Client;
    });
  });

  describe("normal", () => {
    test("generate", async () => {
      const config = createConfig();
      config.modelNaming = "appId";
      config.outDir = resultPath;
      writeFileSync(configfilePath, JSON.stringify(config));

      await main(["generate", `-c=${configfilePath}`]);

      const content = readFileSync(join(resultPath, "index.ts")).toString();
      expect(content).toContain("export interface KintoneApp54Record");
      expect(content).toContain(
        "export interface KintoneApp54RecordForParameter"
      );
    });

    test("specify app-ids", async () => {
      const config = createConfig();
      config.modelNaming = "appId";
      config.outDir = resultPath;
      writeFileSync(configfilePath, JSON.stringify(config));

      await main(["generate", `-a=54`, `-c=${configfilePath}`]);

      const content = readFileSync(join(resultPath, "index.ts")).toString();
      expect(content).toContain("export interface KintoneApp54Record");
      expect(content).toContain(
        "export interface KintoneApp54RecordForParameter"
      );
    });
  });

  describe("error", () => {
    test("app not found", async () => {
      const config = createConfig();
      config.modelNaming = "appId";
      config.outDir = resultPath;
      writeFileSync(configfilePath, JSON.stringify(config));

      const result = main(["generate", `-a=100`, `-c=${configfilePath}`]);
      await expect(result).rejects.toThrow();
    });

    test("app all ignored", async () => {
      const appId = "54";
      const config = createConfig();
      config.modelNaming = "appId";
      config.ignoreAppIds = [appId];
      config.outDir = resultPath;
      writeFileSync(configfilePath, JSON.stringify(config));

      const result = main(["generate", `-a=${appId}`, `-c=${configfilePath}`]);
      await expect(result).rejects.toThrow();
    });

    test("config not found", async () => {
      const result = main(["generate", `-c=${configfilePath}`]);
      await expect(result).rejects.toThrow();
    });

    test("kintone-config not found", async () => {
      const result = main(["generate", `-k=${configfilePath}`]);
      await expect(result).rejects.toThrow();
    });
  });
});
