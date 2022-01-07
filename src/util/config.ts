import { PathLike } from "fs";
import { readFile } from "fs/promises";

const encoding = "utf-8";

export interface Config {
  outDir?: string;
  modelNaming?: "appName" | "appId" | "appCode";
  propertyNaming?: "code" | "label";
}

export const createConfig = async (configPath?: PathLike) => {
  let config: Config = {};
  if (configPath) {
    config = JSON.parse(await readFile(configPath, encoding));
  }
  return config;
};
