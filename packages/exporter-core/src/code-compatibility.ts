import ts from "typescript";
import type { FramerCodeFile } from "../../shared/src/types.js";

export type CodeCompatibility =
  | "portable"
  | "portable-with-adapter"
  | "portable-with-dependencies"
  | "runtime-fallback-required"
  | "unsupported";

export type CodeImportKind =
  | "react"
  | "framer"
  | "framer-motion"
  | "project-local"
  | "npm-package"
  | "framer-internal-alias"
  | "unsupported-remote-module";

export type CodeFileCompatibilityReport = {
  codeFileId?: string;
  name: string;
  path?: string;
  compatibility: CodeCompatibility;
  imports: Array<{
    source: string;
    kind: CodeImportKind;
    names: string[];
    isTypeOnly: boolean;
  }>;
  dependencyNames: string[];
  exportedComponents: string[];
  exportedOverrides: string[];
  usesPropertyControls: boolean;
  usesRenderTarget: boolean;
  usesFramerMotion: boolean;
  usesBrowserGlobals: boolean;
  hasDynamicImports: boolean;
  cssImports: string[];
  localComponentImports: string[];
  unsupportedFramerInternals: string[];
  unsupportedRemoteModules: string[];
  unresolvedProjectAliases: string[];
  reasons: string[];
};

const BROWSER_GLOBALS = new Set([
  "window",
  "document",
  "navigator",
  "localStorage",
  "sessionStorage",
  "HTMLElement",
  "location",
  "history",
]);

export function analyzeCodeFileCompatibility(
  file: FramerCodeFile,
): CodeFileCompatibilityReport {
  const content = file.content ?? "";
  const source = ts.createSourceFile(
    file.path ?? file.name,
    content,
    ts.ScriptTarget.Latest,
    true,
    file.path?.endsWith(".tsx") || content.includes("jsx")
      ? ts.ScriptKind.TSX
      : ts.ScriptKind.TS,
  );

  const imports: CodeFileCompatibilityReport["imports"] = [];
  const dependencyNames = new Set<string>();
  const cssImports = new Set<string>();
  const localComponentImports = new Set<string>();
  const unsupportedFramerInternals = new Set<string>();
  const unsupportedRemoteModules = new Set<string>();
  const unresolvedProjectAliases = new Set<string>();
  const exportedComponents = new Set<string>();
  const exportedOverrides = new Set<string>();
  let usesPropertyControls = false;
  let usesRenderTarget = false;
  let usesFramerMotion = false;
  let usesBrowserGlobals = false;
  let hasDynamicImports = false;

  for (const detail of file.exportDetails ?? []) {
    if (detail.type === "component" && detail.name) {
      exportedComponents.add(detail.name);
    }
    if (detail.type === "override" && detail.name) {
      exportedOverrides.add(detail.name);
    }
  }

  function classifyImport(sourceText: string): CodeImportKind {
    if (sourceText === "react") return "react";
    if (sourceText === "framer") return "framer";
    if (sourceText === "framer-motion") return "framer-motion";
    if (/^https?:\/\//.test(sourceText) || sourceText.startsWith("esm.sh/")) {
      return "unsupported-remote-module";
    }
    if (sourceText.startsWith("#framer/")) return "framer-internal-alias";
    if (sourceText.startsWith("./") || sourceText.startsWith("../")) {
      return "project-local";
    }
    if (sourceText.startsWith("@/")) return "project-local";
    return "npm-package";
  }

  function recordImport(
    sourceText: string,
    names: string[],
    isTypeOnly: boolean,
  ) {
    const kind = classifyImport(sourceText);
    imports.push({ source: sourceText, kind, names, isTypeOnly });
    if (kind === "npm-package") dependencyNames.add(sourceText);
    if (kind === "framer-motion") {
      dependencyNames.add(sourceText);
      usesFramerMotion = true;
    }
    if (kind === "framer-internal-alias") {
      unsupportedFramerInternals.add(sourceText);
    }
    if (kind === "unsupported-remote-module") {
      unsupportedRemoteModules.add(sourceText);
    }
    if (kind === "project-local") {
      if (sourceText.startsWith("@/")) {
        unresolvedProjectAliases.add(sourceText);
      }
      if (/\.(css|scss|sass|less)$/.test(sourceText)) {
        cssImports.add(sourceText);
      } else {
        localComponentImports.add(sourceText);
      }
    }
  }

  function walk(node: ts.Node) {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const sourceText = node.moduleSpecifier.text;
      const clause = node.importClause;
      const names: string[] = [];
      if (clause?.name) names.push(clause.name.text);
      if (clause?.namedBindings && ts.isNamedImports(clause.namedBindings)) {
        for (const element of clause.namedBindings.elements) {
          names.push(element.name.text);
        }
      }
      recordImport(sourceText, names, clause?.isTypeOnly ?? false);
    } else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments.length > 0 &&
      ts.isStringLiteral(node.arguments[0]!)
    ) {
      hasDynamicImports = true;
      recordImport(node.arguments[0]!.text, [], false);
    } else if (ts.isIdentifier(node)) {
      if (node.text === "addPropertyControls" || node.text === "ControlType") {
        usesPropertyControls = true;
      }
      if (node.text === "RenderTarget") {
        usesRenderTarget = true;
      }
      if (BROWSER_GLOBALS.has(node.text)) {
        usesBrowserGlobals = true;
      }
    }

    ts.forEachChild(node, walk);
  }

  walk(source);

  const reasons: string[] = [];
  if (unsupportedRemoteModules.size > 0) {
    reasons.push("uses-unsupported-remote-modules");
  }
  if (unsupportedFramerInternals.size > 0) {
    reasons.push("uses-framer-internal-aliases");
  }
  if (unresolvedProjectAliases.size > 0) {
    reasons.push("uses-unresolved-project-aliases");
  }
  if (usesRenderTarget) {
    reasons.push("uses-rendertarget");
  }
  if (usesPropertyControls) {
    reasons.push("uses-property-controls");
  }
  if (usesBrowserGlobals) {
    reasons.push("uses-browser-globals");
  }
  if (hasDynamicImports) {
    reasons.push("uses-dynamic-imports");
  }
  if (usesFramerMotion) {
    reasons.push("uses-framer-motion");
  }
  if (dependencyNames.size > 0) {
    reasons.push("uses-external-npm-dependencies");
  }

  let compatibility: CodeCompatibility = "portable";
  if (
    unsupportedRemoteModules.size > 0 ||
    unsupportedFramerInternals.size > 0 ||
    unresolvedProjectAliases.size > 0
  ) {
    compatibility = "unsupported";
  } else if (usesBrowserGlobals || hasDynamicImports) {
    compatibility = "runtime-fallback-required";
  } else if (dependencyNames.size > 0) {
    compatibility = "portable-with-dependencies";
  } else if (usesRenderTarget || usesPropertyControls) {
    compatibility = "portable-with-adapter";
  }

  return {
    codeFileId: file.id,
    name: file.name,
    path: file.path,
    compatibility,
    imports,
    dependencyNames: Array.from(dependencyNames).sort(),
    exportedComponents: Array.from(exportedComponents).sort(),
    exportedOverrides: Array.from(exportedOverrides).sort(),
    usesPropertyControls,
    usesRenderTarget,
    usesFramerMotion,
    usesBrowserGlobals,
    hasDynamicImports,
    cssImports: Array.from(cssImports).sort(),
    localComponentImports: Array.from(localComponentImports).sort(),
    unsupportedFramerInternals: Array.from(unsupportedFramerInternals).sort(),
    unsupportedRemoteModules: Array.from(unsupportedRemoteModules).sort(),
    unresolvedProjectAliases: Array.from(unresolvedProjectAliases).sort(),
    reasons,
  };
}

export function analyzeCodeFilesCompatibility(codeFiles: FramerCodeFile[]) {
  const files = codeFiles.map((file) => analyzeCodeFileCompatibility(file));
  const summary = {
    portable: files.filter((entry) => entry.compatibility === "portable").length,
    portableWithAdapter: files.filter(
      (entry) => entry.compatibility === "portable-with-adapter",
    ).length,
    portableWithDependencies: files.filter(
      (entry) => entry.compatibility === "portable-with-dependencies",
    ).length,
    runtimeFallbackRequired: files.filter(
      (entry) => entry.compatibility === "runtime-fallback-required",
    ).length,
    unsupported: files.filter((entry) => entry.compatibility === "unsupported")
      .length,
  };

  return {
    generatedAt: new Date().toISOString(),
    fileCount: files.length,
    summary,
    files,
  };
}
