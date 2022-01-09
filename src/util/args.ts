import yargs from "yargs";

export const parseArgs = (argv: Array<string>) => {
  return yargs(argv)
    .command("generate", "Generate type definitions.")
    .demandCommand(1, 1)
    .option("app-ids", {
      alias: "a",
      type: "string",
      description: "Kintone app id list. (Separated by comma)",
    })
    .option("config", {
      alias: "c",
      type: "string",
      description: "Config file path.",
    })
    .option("kintone-config", {
      alias: "k",
      type: "string",
      description: "Kintone API Config file path.",
    })
    .help()
    .parse();
};
