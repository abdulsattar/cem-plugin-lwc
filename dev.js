import fs from "fs";
import ts from "typescript";
import { create } from "@custom-elements-manifest/analyzer";
import lwcPlugin from "./index.js";

const code = fs.readFileSync("fixtures/my/element/element.js").toString();

const modules = [
  ts.createSourceFile("element.js", code, ts.ScriptTarget.ES2015, true),
];

console.log(
  JSON.stringify(create({ modules, plugins: [...lwcPlugin()] }), null, 2)
);
