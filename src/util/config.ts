import { PathLike, readFileSync } from "fs";

const encoding = "utf-8";

export interface Config {
  outDir?: string;
  modelNaming?: "appName" | "appId" | "appCode";
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
  return config;
};
