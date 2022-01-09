import { createClientConfig } from "./util/client";
import { generate, GenerateParams } from "./generate";
import { createConfig } from "./util/config";
import { parseArgs } from "./util/args";
import { exportFile } from "./util/out";

export const main = async (argv: Array<string>) => {
  const args = parseArgs(argv);
  const config = createConfig(args.config);
  const clientConfig = createClientConfig(args["kintone-config"]);

  if (args._[0] === "generate") {
    const params: GenerateParams = {
      appIds:
        args["app-ids"]
          ?.split(",")
          .map((id) => id.trim())
          .filter((id) => id.length > 0) ?? [],
    };

    const result = await generate({ params, config, clientConfig });

    exportFile(result, config);
  } else {
    throw new Error(`not implemented: ${args._[0]}`);
  }
};
