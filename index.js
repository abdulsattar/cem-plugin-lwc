import { sep } from "path";

function getTagNameFromFilename(path) {
  const [namespace, component] = path.split(sep);
  return `${namespace}-${component}`;
}

function customElementFilenamePlugin() {
  return {
    name: "LWC - CUSTOM-ELEMENT-FILENAME",
    analyzePhase({ ts, node, moduleDoc }) {
      if (node.kind === ts.SyntaxKind.ClassDeclaration) {
        const className = node.name.escapedText;
        const tagName = getTagNameFromFilename(moduleDoc.path);
        const definitionDoc = {
          kind: "custom-element-definition",
          name: tagName,
          declaration: {
            name: className,
            module: moduleDoc.path,
          },
        };

        moduleDoc.exports = [...(moduleDoc.exports || []), definitionDoc];
      }
    },
  };
}

const lwcPlugin = () => [customElementFilenamePlugin()];

export default lwcPlugin;
