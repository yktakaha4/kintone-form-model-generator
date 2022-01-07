import ts, { factory as f } from "typescript";

export const stringer = (nodes: Array<ts.Node>) => {
  const sourceFile = ts.createSourceFile("", "", ts.ScriptTarget.Latest);
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  return printer.printList(
    ts.ListFormat.MultiLineBlockStatements,
    f.createNodeArray(nodes),
    sourceFile
  );
};
