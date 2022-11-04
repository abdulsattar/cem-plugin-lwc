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

function hasApiDecorator(node) {
  if (!node.decorators) return false;
  return node.decorators.find((d) => d.expression.escapedText === "api");
}

function apiDecoratorPlugin() {
  return {
    name: "LWC - API-DECORATOR",
    analyzePhase({ ts, node, moduleDoc }) {
      if (
        node.kind === ts.SyntaxKind.PropertyDeclaration ||
        node.kind === ts.SyntaxKind.MethodDeclaration
      ) {
        if (!hasApiDecorator(node)) {
          const className = node.parent.name.escapedText;
          const methodName = node.name.escapedText;
          const moduleClass = moduleDoc.declarations.find(
            (d) => d.kind === "class" && d.name === className
          );
          moduleClass.members = moduleClass.members.filter(
            (m) => m.name !== methodName
          );
        }
      }
    },
  };
}

const lwcPlugin = () => [customElementFilenamePlugin(), apiDecoratorPlugin()];

export default lwcPlugin;
