import { writeFileSync, mkdirSync, existsSync, lstatSync } from "fs";
import { join } from "path";
import { Config } from "./config";

export const exportFile = (data: string, config: Config) => {
  const path = config.outDir ?? "./out/";
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }

  let targetFile: string;
  if (lstatSync(path).isDirectory()) {
    targetFile = join(path, "index.ts");
  } else {
    targetFile = path;
  }

  writeFileSync(targetFile, data, "utf-8");
};
