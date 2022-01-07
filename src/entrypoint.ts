import { argv } from "process";
import { createClientConfig } from "./util/client";
import { generate, GenerateParams } from "./generate";
import { createConfig } from "./util/config";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const entrypoint = async () => {
  const args = yargs(hideBin(argv))
    .command("generate", "", (yargs) => {
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

  const subcommand = "generate";
  const configPath = "";
  const clientConfigPath = "";

  const config = await createConfig(configPath);
  const clientConfig = await createClientConfig(clientConfigPath);

  if (subcommand === "generate") {
    const params: GenerateParams = {};
    await generate({ params, config, clientConfig });
  } else {
    throw new Error();
  }
};
