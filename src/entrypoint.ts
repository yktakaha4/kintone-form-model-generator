import "./util/logging";
import process from "process";
import { main } from "./main";
import { getLogger } from "log4js";

const cliLogger = getLogger("cli");

main()
  .then(() => {
    cliLogger.info("done.");
    process.exitCode = 0;
  })
  .catch((e) => {
    cliLogger.error(e);
    process.exitCode = 1;
  });
