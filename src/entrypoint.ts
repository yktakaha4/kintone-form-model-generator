import { createClientConfig } from "./util/client";
import { generate, GenerateParams } from "./generate";
import { createConfig } from "./util/config";

const entrypoint = async () => {
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
