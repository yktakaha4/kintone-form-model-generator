import { PathLike, readFileSync } from "fs";

const encoding = "utf-8";

export interface Config {
  outDir?: string;
  modelNaming?: "appName" | "appId" | "appCode";
  modelNamingMapping?: Record<string, string>;
  modelNamePrefix?: string;
  modelNameSuffix?: string;
  modelNamingDuplicationStrategy?: "error" | "overwrite";
  propertyNaming?: "code" | "label";
  propertyNamingDuplicationStrategy?: "error" | "overwrite";
}

export const createConfig = (configPath?: PathLike) => {
  let config: Config = {};
  if (configPath) {
    config = JSON.parse(readFileSync(configPath, encoding));
  }

  if (!config.outDir) config.outDir = "out/";
  if (!config.modelNaming) config.modelNaming = "appId";
  if (!config.modelNamePrefix) config.modelNamePrefix = "Kintone";
  if (!config.modelNameSuffix) config.modelNameSuffix = "Record";
  if (!config.modelNamingDuplicationStrategy)
    config.modelNamingDuplicationStrategy = "error";
  if (!config.propertyNaming) config.propertyNaming = "code";
  if (!config.propertyNamingDuplicationStrategy)
    config.propertyNamingDuplicationStrategy = "error";

  return config;
};
