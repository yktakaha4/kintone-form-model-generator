import log4js from "log4js";
import path from "path";
import util from "util";
import { env } from "process";

const logDirectory = path.join(process.cwd(), "logs");
const logLayout = {
  type: "pattern",
  pattern: "%d %p %c %f:%l %x{singleLine}",
  tokens: {
    singleLine: function (logEvent: { data: Array<unknown> }) {
      return logEvent.data
        .map((d) => {
          if (
            typeof d === "boolean" ||
            typeof d === "number" ||
            typeof d === "string"
          ) {
            return d.toString().replace(/\n/gm, "\\n");
          } else {
            return util
              .inspect(d, { breakLength: Infinity })
              .replace(/\n/gm, "\\n");
          }
        })
        .filter((d) => d.length > 0)
        .join(" ");
    },
  },
};

const level = env.LOG_LEVEL || "off";
const cliLevel = env.LOG_LEVEL ? "off" : "all";

log4js.configure({
  appenders: {
    console: {
      type: "console",
      layout: logLayout,
    },
    cli: {
      type: "console",
      layout: {
        type: "pattern",
        pattern: "%m",
      },
    },
    app: {
      type: "dateFile",
      layout: logLayout,
      filename: path.join(logDirectory, "app.log"),
      pattern: "-yyyy-MM-dd",
      daysToKeep: 7,
      compress: true,
    },
    kintone: {
      type: "dateFile",
      layout: logLayout,
      filename: path.join(logDirectory, "kintone.log"),
      pattern: "-yyyy-MM-dd",
      daysToKeep: 1,
      compress: true,
    },
  },
  categories: {
    default: {
      appenders: ["console", "app"],
      level,
      enableCallStack: true,
    },
    cli: {
      appenders: ["cli"],
      level: cliLevel,
    },
    kintone: {
      appenders: ["kintone"],
      level,
      enableCallStack: true,
    },
  },
});
