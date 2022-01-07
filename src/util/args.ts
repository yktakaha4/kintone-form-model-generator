import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export const parseArgs = (argv: Array<string>) => {
  return yargs(hideBin(argv))
    .command("generate", "Generate command", (yargs) => {
      return yargs.option("app-ids", {
        alias: "a",
        type: "string",
        description: "Kintone app id list. (Separated by comma)",
      });
    })
    .demandCommand(1)
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
