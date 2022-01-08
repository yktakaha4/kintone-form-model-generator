import log4js from "log4js";
import path from "path";
import util from "util";

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

log4js.configure({
  appenders: {
    console: {
      type: "console",
      layout: logLayout,
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
      level: "all",
      enableCallStack: true,
    },
    kintone: {
      appenders: ["kintone"],
      level: "all",
      enableCallStack: true,
    },
  },
});
