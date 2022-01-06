import { PathLike } from "fs";
import { readFile } from "fs/promises";

const encoding = "utf-8";

export interface Config {
  outDir?: string;
  modelNaming?: "AppName" | "AppId" | "AppCode";
  propertyNaming?: "Code" | "Label";
}

export const createConfig = async (configPath?: PathLike) => {
  let config: Config = {};
  if (configPath) {
    config = JSON.parse(await readFile(configPath, encoding));
  }
  return config;
};
