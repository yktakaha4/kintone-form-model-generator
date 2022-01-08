import "./util/logging";
import process from "process";
import { main } from "./main";
import { getLogger } from "log4js";

const logger = getLogger();

main()
  .then(() => {
    process.exitCode = 0;
  })
  .catch((e) => {
    console.error(e);
    logger.error(e);
    process.exitCode = 1;
  });
