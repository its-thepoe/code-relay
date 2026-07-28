import { describe, it } from "node:test";
import assert from "node:assert/strict";
import ts from "typescript";
import { generateViteConfig } from "../src/generate/app.js";

describe("generateViteConfig", () => {
  it("typechecks and redirects deep routes to trailing-slash paths in dev and preview", () => {
    const source = generateViteConfig([
      { name: "main", html: "index.html" },
      { name: "dispensary", html: "dispensary/index.html" },
    ]);

    const transpiled = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
      },
      reportDiagnostics: true,
    });

    const errors =
      transpiled.diagnostics?.filter(
        (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
      ) ?? [];

    assert.equal(
      errors.length,
      0,
      errors
        .map((diagnostic) =>
          ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
        )
        .join("\n"),
    );
    assert.match(source, /"\/dispensary"/);

    const redirectMatches = source.match(
      /res\.setHeader\("Location", url\.pathname \+ "\/"\);/g,
    );
    assert.equal(redirectMatches?.length, 2);
    assert.match(source, /configureServer\(server\)/);
    assert.match(source, /configurePreviewServer\(server\)/);
  });
});
