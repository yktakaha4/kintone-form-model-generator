import { mkdtempSync, readFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { createConfig } from "./config";
import { exportFile } from "./out";

describe("exportFile", () => {
  let tmpDirPath: string;
  beforeEach(() => {
    tmpDirPath = mkdtempSync(join(tmpdir(), "kfmgtests_"));
  });

  test("success", async () => {
    const data = "export type 日本語を含む文字列 = string;";
    const config = createConfig();
    config.outDir = join(tmpDirPath, "more", "..", "deep", "dir");

    exportFile(data, config);

    const exportedData = readFileSync(join(config.outDir, "index.ts"));
    expect(exportedData.toString()).toBe(data);
  });
});
