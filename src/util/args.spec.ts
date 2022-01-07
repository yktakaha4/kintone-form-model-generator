import { parseArgs } from "./args";

describe("parseArgs", () => {
  test("can parse", () => {
    const result = parseArgs([
      "generate -a=1,2,3 -c=config.json -k=kintone-config.json",
    ]);
    expect(result.$0).toBe("generate");
    expect(result["app-ids"]).toBe("1,2,3");
    expect(result.config).toBe("config.json");
    expect(result["kintone-config"]).toBe("kintone-config.json");
  });
});
