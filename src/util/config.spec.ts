import { join } from "path";
import { createConfig } from "./config";

describe("createConfig", () => {
  test("read config file", () => {
    const filePath = join(__dirname, "..", "__tests__", "config.json");
    const config = createConfig(filePath);
    expect(config.outDir).toBe("出力先");
  });
});
