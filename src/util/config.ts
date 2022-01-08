import { PathLike, readFileSync } from "fs";

const encoding = "utf-8";

export interface Config {
  outDir?: string;
  modelNaming?: "appName" | "appId" | "appCode";
  modelNameMapping?: Record<string, string>;
  modelNamePrefix?: string;
  modelNameSuffix?: string;
  modelNamingDuplicationStrategy?: "error" | "skip" | "uniquifyWithAppId";
}

export const createConfig = (configPath?: PathLike) => {
  let config: Config = {};
  if (configPath) {
    config = JSON.parse(readFileSync(configPath, encoding));
  }

  if (!config?.outDir?.trim()) config.outDir = "out/";
  if (!config.modelNaming) config.modelNaming = "appId";
  if (!config.modelNameMapping) config.modelNameMapping = {};
  if (config.modelNamePrefix == null) config.modelNamePrefix = "Kintone";
  if (config.modelNameSuffix == null) config.modelNameSuffix = "Record";
  if (!config.modelNamingDuplicationStrategy)
    config.modelNamingDuplicationStrategy = "error";

  return config;
};
