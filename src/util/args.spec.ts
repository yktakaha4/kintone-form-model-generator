import { parseArgs } from "./args";

describe("parseArgs", () => {
  beforeEach(() => {
    jest.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`erorr: ${code}`);
    });
  });

  test("can parse", () => {
    const result = parseArgs([
      "generate",
      "--app-ids=1,2,3",
      "--config=config.json",
      "--kintone-config=kintone-config.json",
    ]);
    expect(result._[0]).toBe("generate");
    expect(result["app-ids"]).toBe("1,2,3");
    expect(result.config).toBe("config.json");
    expect(result["kintone-config"]).toBe("kintone-config.json");
  });

  test("can parse(shorthand)", () => {
    const result = parseArgs([
      "generate",
      "-a=1,2,3",
      "-c=config.json",
      "-k=kintone-config.json",
    ]);
    expect(result._[0]).toBe("generate");
    expect(result["app-ids"]).toBe("1,2,3");
    expect(result.config).toBe("config.json");
    expect(result["kintone-config"]).toBe("kintone-config.json");
  });
});
