import ts, { factory as f } from "typescript";

export const stringer = (nodes: Array<ts.Node>) => {
  const sourceFile = ts.createSourceFile("", "", ts.ScriptTarget.Latest);
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  return printer.printList(
    ts.ListFormat.MultiLine,
    f.createNodeArray(nodes),
    sourceFile
  );
};

export const sanitizeInterfaceName = (raw: string) => {
  const prefix = "$";
  const cleaned = raw.replace(/\s/gs, "").replace(/[!-#%-/:-@[-^`{-~]/gs, "_");
  if (!cleaned) {
    return prefix;
  } else if (/^\d/.test(cleaned)) {
    return `${prefix}${cleaned}`;
  } else {
    return cleaned;
  }
};
