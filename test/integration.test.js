import { test } from "uvu";
import * as assert from "uvu/assert";
import path from "path";
import fs from "fs";
import ts from "typescript";
import { create } from "@custom-elements-manifest/analyzer";
import lwcPlugin from "../index.js";

const fixturesDir = path.join(process.cwd(), "fixtures");
let namespaces = fs.readdirSync(fixturesDir);

namespaces.forEach((namespace) => {
  const namespaceDir = path.join(fixturesDir, namespace);
  const testCases = fs.readdirSync(namespaceDir);
  testCases.forEach((testCase) => {
    const testCaseDir = path.join(namespaceDir, testCase);
    test(`Testcase ${testCase}`, async () => {
      const fixturePath = path.join(testCaseDir, `expected.json`);
      const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf-8"));
      const filePath = path.join(testCaseDir, `${testCase}.js`);
      const source = fs.readFileSync(filePath).toString();
      const module = ts.createSourceFile(
        `${namespace}/${testCase}`,
        source,
        ts.ScriptTarget.ES2015,
        true
      );

      const result = create({ modules: [module], plugins: [...lwcPlugin()] });

      const outputPath = path.join(testCaseDir, `actual.json`);
      fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

      assert.equal(result, fixture);
    });
  });
});

test.run();
