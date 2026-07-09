import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { createServer } from "node:http";
import { createNormalizedIrArtifact, runLocalExport, readFullSiteRouteManifest, validateGeneratedProject, } from "./local-export.js";
import { CAPTURED_STYLE_PROPERTIES } from "./capture.js";
function createPluginCapture() {
    return {
        mode: "framer-plugin",
        capturedAt: "2026-06-12T00:00:00.000Z",
        selectedNodes: [
            {
                id: "root",
                name: "Hero",
                type: "FrameNode",
                bounds: { x: 0, y: 0, width: 640, height: 320 },
                metadata: {
                    rootId: "root",
                    rootName: "Hero",
                    rootKind: "component",
                    sourceIndex: 0,
                    depth: 0,
                    path: "1",
                    styles: {
                        display: "flex",
                        flexDirection: "column",
                        gap: "24px",
                        padding: "32px",
                        backgroundColor: "#111827",
                        backgroundImage: 'url("https://example.com/bg.png")',
                        overflow: "hidden",
                        aspectRatio: "16 / 9",
                    },
                },
            },
            {
                id: "heading",
                name: "Heading",
                type: "TextNode",
                text: "Hello world",
                bounds: { x: 32, y: 32, width: 240, height: 48 },
                metadata: {
                    rootId: "root",
                    rootName: "Hero",
                    rootKind: "component",
                    sourceIndex: 0,
                    depth: 1,
                    parentId: "root",
                    path: "1.1",
                    tag: "h1",
                    styles: {
                        color: "#f9fafb",
                        fontSize: "42px",
                        lineHeight: "48px",
                        fontWeight: "800",
                    },
                },
            },
        ],
        context: {
            exportMode: "selection",
            captureMode: "plugin-only",
            project: {
                id: "integration-smoke",
                name: "Integration Smoke",
            },
        },
    };
}
function routeCacheFileName(routePath) {
    return `${routePath.replace(/^\/+|\/+$/g, "").replace(/[^a-zA-Z0-9_-]+/g, "-") || "home"}.json`;
}
test("runtime capture property allowlist includes fidelity-critical fields", () => {
    assert.equal(CAPTURED_STYLE_PROPERTIES.includes("background"), true);
    assert.equal(CAPTURED_STYLE_PROPERTIES.includes("paddingTop"), true);
    assert.equal(CAPTURED_STYLE_PROPERTIES.includes("overflow"), true);
    assert.equal(CAPTURED_STYLE_PROPERTIES.includes("aspectRatio"), true);
    assert.equal(CAPTURED_STYLE_PROPERTIES.includes("zIndex"), true);
    assert.equal(CAPTURED_STYLE_PROPERTIES.includes("placeItems"), true);
});
test("normalized IR artifact summarizes materialized full-site route trees", () => {
    const repeatedNodes = Array.from({ length: 10_000 }, (_, index) => ({
        id: `node-${index}`,
        children: [],
    }));
    const ir = {
        pluginCapture: {
            mode: "framer-plugin",
            capturedAt: "2026-07-01T00:00:00.000Z",
            selectedNodes: [],
        },
        runtimeCapture: {
            url: "https://example.com",
            title: "Large site",
            mode: "page",
            routeCaptures: [],
        },
        component: { semanticType: "page", nodes: [], sections: [] },
        sitePages: [
            {
                componentName: "Large",
                routePath: "/large",
                title: "Large",
                nodes: repeatedNodes,
                exportTree: repeatedNodes,
            },
        ],
    };
    const artifact = createNormalizedIrArtifact(ir);
    const serialized = JSON.stringify(artifact);
    assert.equal(artifact.artifactFormat, "summary");
    assert.equal(artifact.sitePages[0]?.nodeCount, 10_000);
    assert.equal("nodes" in (artifact.sitePages[0] ?? {}), false);
    assert.ok(serialized.length < 10_000);
});
test("normalized IR artifact includes route template summaries", () => {
    const ir = {
        pluginCapture: {
            mode: "framer-plugin",
            capturedAt: "2026-07-01T00:00:00.000Z",
            selectedNodes: [],
        },
        runtimeCapture: {
            url: "https://example.com",
            title: "Template site",
            mode: "page",
            routeCaptures: [],
        },
        component: { semanticType: "page", nodes: [], sections: [] },
        routeTemplates: [
            {
                templateId: "/blog/:slug",
                templatePath: "/blog/:slug",
                templateKind: "cms",
                representativeRoutePath: "/blog/alpha",
                routePaths: ["/blog/alpha", "/blog/beta"],
                routeCount: 2,
                sourceTextLength: 240,
                nodeCount: 18,
            },
        ],
        sitePages: [
            {
                componentName: "Blog",
                routePath: "/blog/alpha",
                title: "Blog alpha",
                nodes: [],
                exportTree: [],
                templateId: "/blog/:slug",
                templatePath: "/blog/:slug",
                templateKind: "cms",
            },
        ],
    };
    const artifact = createNormalizedIrArtifact(ir);
    assert.equal(artifact.routeTemplates?.[0]?.routeCount, 2);
    assert.equal(artifact.routeTemplates?.[0]?.templateKind, "cms");
    assert.equal(artifact.sitePages[0]?.templateId, "/blog/:slug");
});
test("runLocalExport rejects a missing exportMode before generating files", async () => {
    const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-missing-export-mode-"));
    await assert.rejects(runLocalExport({
        outDir,
        pluginCapture: createPluginCapture(),
        maxAttempts: 1,
        targetFidelity: 0.92,
    }), /Missing exportMode/);
    assert.deepEqual(await fs.readdir(outDir), []);
});
test("CMS route expansion requires an exact page collection id", () => {
    const base = {
        mode: "framer-plugin",
        capturedAt: "2026-06-30T00:00:00.000Z",
        selectedNodes: [],
        context: {
            sitePages: [{ name: "Post", path: "/blog/:slug" }],
            cmsCollections: [
                {
                    id: "posts",
                    name: "Posts",
                    fields: [],
                    items: [{ id: "one", slug: "first-post", fieldKeys: [] }],
                },
            ],
        },
    };
    assert.deepEqual(readFullSiteRouteManifest(base), [
        {
            path: "/blog/:slug",
            title: "Post",
            collectionId: undefined,
            templateId: "/blog/:slug",
            templatePath: "/blog/:slug",
            templateKind: "cms",
        },
    ]);
    base.context.sitePages = [
        {
            name: "Post",
            path: "/blog/:slug",
            collectionId: "posts",
        },
    ];
    assert.deepEqual(readFullSiteRouteManifest(base), [
        {
            path: "/blog/first-post",
            title: "Post - first-post",
            collectionId: "posts",
            templateId: "/blog/:slug",
            templatePath: "/blog/:slug",
            templateKind: "cms",
        },
    ]);
});
test("full-site route manifest excludes drafts and the explicit 404 page", () => {
    const capture = createPluginCapture();
    capture.context.sitePages = [
        { name: "Home", path: "/" },
        { name: "Draft", path: "/drafts/landing" },
        { name: "Not found", path: "/404" },
        { name: "Public", path: "/about" },
    ];
    assert.deepEqual(readFullSiteRouteManifest(capture), [
        {
            path: "/",
            title: "Home",
            collectionId: undefined,
            templateId: "/",
            templatePath: "/",
            templateKind: "static",
        },
        {
            path: "/about",
            title: "Public",
            collectionId: undefined,
            templateId: "/about",
            templatePath: "/about",
            templateKind: "static",
        },
    ]);
});
test("full-site route manifest classifies redirect and utility routes", () => {
    const capture = createPluginCapture();
    capture.context.sitePages = [
        { name: "Twitter", path: "/twitter", redirectTo: "https://twitter.com/coderelay" },
        { name: "Docs", path: "/docs", redirectTo: "/learn" },
    ];
    assert.deepEqual(readFullSiteRouteManifest(capture), [
        {
            path: "/twitter",
            title: "Twitter",
            collectionId: undefined,
            templateId: "/twitter",
            templatePath: "/twitter",
            templateKind: "utility",
            redirectTo: "https://twitter.com/coderelay",
        },
        {
            path: "/docs",
            title: "Docs",
            collectionId: undefined,
            templateId: "/docs",
            templatePath: "/docs",
            templateKind: "redirect",
            redirectTo: "/learn",
        },
    ]);
});
test("generated validation rejects a mounted but visually empty route", async () => {
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-empty-route-"));
    await fs.mkdir(path.join(projectDir, "dist"), { recursive: true });
    await fs.writeFile(path.join(projectDir, "package.json"), JSON.stringify({
        name: "empty-route",
        private: true,
        scripts: { build: "node -e \"process.exit(0)\"" },
    }));
    await fs.writeFile(path.join(projectDir, "route-manifest.json"), JSON.stringify([
        {
            path: "/",
            sourceTextLength: 120,
            sourceNodeCount: 12,
        },
    ]));
    await fs.writeFile(path.join(projectDir, "placeholder.tsx"), "export const Placeholder = () => null\n");
    await fs.writeFile(path.join(projectDir, "placeholder.css"), "body { background: #001a4c; }\n");
    await fs.writeFile(path.join(projectDir, "preview.html"), "<!doctype html><html><body>preview</body></html>");
    await fs.writeFile(path.join(projectDir, "dist", "index.html"), `<!doctype html><html><body style="margin:0;background:#001a4c">
      <div id="root"><main style="min-height:100vh">
        <div></div><div></div><div></div><div></div><div></div><div></div>
      </main></div>
    </body></html>`);
    await assert.rejects(validateGeneratedProject(projectDir), /near-empty.*sourceText=120.*renderedText=0/s);
});
test("generated validation rejects horizontal overflow at mobile width", async () => {
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-overflow-route-"));
    await fs.mkdir(path.join(projectDir, "dist"), { recursive: true });
    await fs.writeFile(path.join(projectDir, "package.json"), JSON.stringify({
        name: "overflow-route",
        private: true,
        scripts: { build: "node -e \"process.exit(0)\"" },
    }));
    await fs.writeFile(path.join(projectDir, "route-manifest.json"), JSON.stringify([
        {
            path: "/",
            sourceTextLength: 120,
            sourceNodeCount: 2,
        },
    ]));
    await fs.writeFile(path.join(projectDir, "placeholder.tsx"), "export const Placeholder = () => null\n");
    await fs.writeFile(path.join(projectDir, "placeholder.css"), "body { background: #eef2ff; color: #0f172a; }\n");
    await fs.writeFile(path.join(projectDir, "preview.html"), "<!doctype html><html><body>preview</body></html>");
    await fs.writeFile(path.join(projectDir, "dist", "index.html"), `<!doctype html>
    <html>
      <body style="margin:0;background:#eef2ff;color:#0f172a;font-family:system-ui,sans-serif">
        <div id="root">
          <main style="width:100%;min-height:100vh">
            <div style="width:1200px;height:80px;background:#2563eb;color:white">Overflowing ribbon</div>
            <p>Responsive validation should catch horizontal overflow.</p>
          </main>
        </div>
      </body>
    </html>`);
    await assert.rejects(validateGeneratedProject(projectDir), /responsive validation failed.*horizontalOverflow=true/i);
});
test("generated validation rejects a narrow page root", async () => {
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-narrow-root-route-"));
    await fs.mkdir(path.join(projectDir, "dist"), { recursive: true });
    await fs.writeFile(path.join(projectDir, "package.json"), JSON.stringify({
        name: "narrow-root-route",
        private: true,
        scripts: { build: "node -e \"process.exit(0)\"" },
    }));
    await fs.writeFile(path.join(projectDir, "route-manifest.json"), JSON.stringify([
        {
            path: "/",
            sourceTextLength: 120,
            sourceNodeCount: 2,
        },
    ]));
    await fs.writeFile(path.join(projectDir, "placeholder.tsx"), "export const Placeholder = () => null\n");
    await fs.writeFile(path.join(projectDir, "placeholder.css"), "body { background: #f8fafc; color: #0f172a; }\n");
    await fs.writeFile(path.join(projectDir, "preview.html"), "<!doctype html><html><body>preview</body></html>");
    await fs.writeFile(path.join(projectDir, "dist", "index.html"), `<!doctype html>
    <html>
      <body style="margin:0;background:#f8fafc;color:#0f172a;font-family:system-ui,sans-serif">
        <div id="root" style="width:320px;margin:0 auto">
          <main style="min-height:100vh;background:white">
            <h1>Narrow root</h1>
            <p>Responsive validation should reject non-full-width page roots.</p>
          </main>
        </div>
      </body>
    </html>`);
    await assert.rejects(validateGeneratedProject(projectDir), /responsive validation failed.*fullWidthRoot=false/i);
});
test("generated validation executes component-family interaction contracts", async () => {
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-interaction-contracts-pass-"));
    await fs.mkdir(path.join(projectDir, "dist"), { recursive: true });
    await fs.writeFile(path.join(projectDir, "package.json"), JSON.stringify({
        name: "interaction-contracts-pass",
        private: true,
        scripts: { build: "node -e \"process.exit(0)\"" },
    }));
    await fs.writeFile(path.join(projectDir, "route-manifest.json"), JSON.stringify([
        {
            path: "/",
            sourceTextLength: 220,
            sourceNodeCount: 12,
        },
    ]));
    await fs.writeFile(path.join(projectDir, "placeholder.tsx"), "export const Placeholder = () => null\n");
    await fs.writeFile(path.join(projectDir, "placeholder.css"), "body { background: #fff8ec; color: #1f2937; }\n");
    await fs.writeFile(path.join(projectDir, "preview.html"), "<!doctype html><html><body>preview</body></html>");
    await fs.writeFile(path.join(projectDir, "dist", "index.html"), `<!doctype html>
    <html>
      <body style="margin:0;background:#fff8ec;color:#1f2937;font-family:system-ui,sans-serif">
        <div id="root">
          <main style="padding:24px">
            <article data-framer-component-family="Button" data-framer-component-family-name="Button" data-framer-component-family-placement="route" style="display:grid;gap:12px;padding:16px;background:white;border-radius:16px">
              <div data-framer-current-variant="button-default">Current variant: <code>Button / Default</code></div>
              <div style="display:flex;gap:8px">
                <button type="button" data-framer-variant-button="button-default">Default</button>
                <button type="button" data-framer-variant-button="button-open">Open</button>
              </div>
              <div style="display:flex;gap:8px">
                <button type="button" data-framer-transition-trigger="click" data-framer-transition-target="button-open">Click</button>
              </div>
            </article>
          </main>
        </div>
        <script>
          const marker = document.querySelector('[data-framer-current-variant]');
          for (const button of document.querySelectorAll('[data-framer-variant-button]')) {
            button.addEventListener('click', () => {
              marker.setAttribute('data-framer-current-variant', button.getAttribute('data-framer-variant-button'));
            });
          }
          const transition = document.querySelector('[data-framer-transition-trigger]');
          transition?.addEventListener('click', () => {
            marker.setAttribute('data-framer-current-variant', transition.getAttribute('data-framer-transition-target'));
          });
        </script>
      </body>
    </html>`);
    const validation = await validateGeneratedProject(projectDir);
    assert.equal(validation.interactionContracts.length, 1);
    assert.equal(validation.interactionContracts[0]?.status, "passed");
    assert.equal(validation.interactionContracts[0]?.familyId, "Button");
    assert.equal(validation.interactionContracts[0]?.clickVariantId, "button-open");
    assert.equal(validation.interactionContracts[0]?.keyboardVariantId, "button-default");
});
test("generated validation fails when a component-family interaction contract does not update state", async () => {
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-interaction-contracts-fail-"));
    await fs.mkdir(path.join(projectDir, "dist"), { recursive: true });
    await fs.writeFile(path.join(projectDir, "package.json"), JSON.stringify({
        name: "interaction-contracts-fail",
        private: true,
        scripts: { build: "node -e \"process.exit(0)\"" },
    }));
    await fs.writeFile(path.join(projectDir, "route-manifest.json"), JSON.stringify([
        {
            path: "/",
            sourceTextLength: 220,
            sourceNodeCount: 12,
        },
    ]));
    await fs.writeFile(path.join(projectDir, "placeholder.tsx"), "export const Placeholder = () => null\n");
    await fs.writeFile(path.join(projectDir, "placeholder.css"), "body { background: #fef2f2; color: #111827; }\n");
    await fs.writeFile(path.join(projectDir, "preview.html"), "<!doctype html><html><body>preview</body></html>");
    await fs.writeFile(path.join(projectDir, "dist", "index.html"), `<!doctype html>
    <html>
      <body style="margin:0;background:#fef2f2;color:#111827;font-family:system-ui,sans-serif">
        <div id="root">
          <main style="padding:24px">
            <article data-framer-component-family="BrokenButton" data-framer-component-family-name="BrokenButton" data-framer-component-family-placement="route" style="display:grid;gap:12px;padding:16px;background:white;border-radius:16px">
              <div data-framer-current-variant="button-default">Current variant: <code>Button / Default</code></div>
              <div style="display:flex;gap:8px">
                <button type="button" data-framer-variant-button="button-default">Default</button>
                <button type="button" data-framer-variant-button="button-open">Open</button>
              </div>
            </article>
          </main>
        </div>
      </body>
    </html>`);
    await assert.rejects(validateGeneratedProject(projectDir), /interaction contract failed.*BrokenButton.*Pointer activation did not move/i);
});
test("generated validation prefers route-mounted component families over gallery previews", async () => {
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-interaction-contracts-route-priority-"));
    await fs.mkdir(path.join(projectDir, "dist"), { recursive: true });
    await fs.writeFile(path.join(projectDir, "package.json"), JSON.stringify({
        name: "interaction-contracts-route-priority",
        private: true,
        scripts: { build: "node -e \"process.exit(0)\"" },
    }));
    await fs.writeFile(path.join(projectDir, "route-manifest.json"), JSON.stringify([
        {
            path: "/",
            sourceTextLength: 260,
            sourceNodeCount: 16,
        },
    ]));
    await fs.writeFile(path.join(projectDir, "placeholder.tsx"), "export const Placeholder = () => null\n");
    await fs.writeFile(path.join(projectDir, "placeholder.css"), "body { background: #f8fafc; color: #0f172a; }\n");
    await fs.writeFile(path.join(projectDir, "preview.html"), "<!doctype html><html><body>preview</body></html>");
    await fs.writeFile(path.join(projectDir, "dist", "index.html"), `<!doctype html>
    <html>
      <body style="margin:0;background:#f8fafc;color:#0f172a;font-family:system-ui,sans-serif">
        <div id="root">
          <main style="padding:24px;display:grid;gap:16px">
            <article data-framer-component-family="GalleryButton" data-framer-component-family-name="GalleryButton" data-framer-component-family-placement="gallery" style="display:grid;gap:12px;padding:16px;background:#e2e8f0;border-radius:16px">
              <div data-framer-current-variant="gallery-default">Current variant: <code>Gallery / Default</code></div>
              <div style="display:flex;gap:8px">
                <button type="button" data-framer-variant-button="gallery-default">Default</button>
                <button type="button" data-framer-variant-button="gallery-open">Open</button>
              </div>
            </article>
            <article data-framer-component-family="RouteButton" data-framer-component-family-name="RouteButton" data-framer-component-family-placement="route" style="display:grid;gap:12px;padding:16px;background:white;border-radius:16px">
              <div data-framer-current-variant="route-default">Current variant: <code>Route / Default</code></div>
              <div style="display:flex;gap:8px">
                <button type="button" data-framer-variant-button="route-default">Default</button>
                <button type="button" data-framer-variant-button="route-open">Open</button>
              </div>
            </article>
          </main>
        </div>
        <script>
          const routeMarker = document.querySelector('[data-framer-component-family="RouteButton"] [data-framer-current-variant]');
          for (const button of document.querySelectorAll('[data-framer-component-family="RouteButton"] [data-framer-variant-button]')) {
            button.addEventListener('click', () => {
              routeMarker.setAttribute('data-framer-current-variant', button.getAttribute('data-framer-variant-button'));
            });
          }
        </script>
      </body>
    </html>`);
    const validation = await validateGeneratedProject(projectDir);
    assert.equal(validation.interactionContracts.length, 1);
    assert.equal(validation.interactionContracts[0]?.familyId, "RouteButton");
    assert.equal(validation.interactionContracts[0]?.status, "passed");
});
test("generated validation rejects executable code-file previews that fall back", async () => {
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-code-file-executable-fallback-"));
    await fs.mkdir(path.join(projectDir, "dist"), { recursive: true });
    await fs.writeFile(path.join(projectDir, "package.json"), JSON.stringify({
        name: "code-file-executable-fallback",
        private: true,
        scripts: { build: "node -e \"process.exit(0)\"" },
    }));
    await fs.writeFile(path.join(projectDir, "route-manifest.json"), JSON.stringify([
        {
            path: "/",
            sourceTextLength: 220,
            sourceNodeCount: 8,
        },
    ]));
    await fs.writeFile(path.join(projectDir, "placeholder.tsx"), "export const Placeholder = () => null\n");
    await fs.writeFile(path.join(projectDir, "placeholder.css"), "body { background: #f8fafc; color: #0f172a; }\n");
    await fs.writeFile(path.join(projectDir, "preview.html"), "<!doctype html><html><body>preview</body></html>");
    await fs.writeFile(path.join(projectDir, "dist", "index.html"), `<!doctype html>
    <html>
      <body style="margin:0;background:#f8fafc;color:#0f172a;font-family:system-ui,sans-serif">
        <div id="root">
          <main style="padding:24px">
            <article data-framer-code-file="Hero.tsx" style="display:grid;gap:12px;padding:16px;background:white;border-radius:16px">
              <div data-framer-code-file-executable-preview="Hero.tsx" style="display:grid;gap:8px">
                <div>Executable preview: <code>Hero</code></div>
                <div data-framer-code-file-executable-fallback="Hero.tsx">Preview unavailable.</div>
              </div>
            </article>
          </main>
        </div>
      </body>
    </html>`);
    await assert.rejects(validateGeneratedProject(projectDir), /executable code-file contract failed.*Hero\.tsx.*fell back/i);
});
test("runLocalExport writes raw runtime capture artifact for plugin-only exports", async () => {
    const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-local-export-"));
    const result = await runLocalExport({
        outDir,
        pluginCapture: createPluginCapture(),
        name: "IntegrationSmoke",
        exportMode: "selection",
        maxAttempts: 1,
        targetFidelity: 0.92,
    });
    const runtimeCapturePath = path.join(result.exportDir, "raw-runtime-capture.json");
    const reportPath = path.join(result.exportDir, "export-report.json");
    const patchHistoryPath = path.join(result.exportDir, "patch-history.json");
    const debugManifestPath = path.join(result.exportDir, "debug", "manifest.json");
    const debugSummaryPath = path.join(result.exportDir, "debug", "attempts", "attempt-1", "summary.json");
    const runtimeCapture = JSON.parse(await fs.readFile(runtimeCapturePath, "utf8"));
    const report = JSON.parse(await fs.readFile(reportPath, "utf8"));
    const patchHistory = JSON.parse(await fs.readFile(patchHistoryPath, "utf8"));
    const debugManifest = JSON.parse(await fs.readFile(debugManifestPath, "utf8"));
    const debugSummary = JSON.parse(await fs.readFile(debugSummaryPath, "utf8"));
    const invalidationPlan = JSON.parse(await fs.readFile(result.invalidationPlanPath, "utf8"));
    const revisionStatus = JSON.parse(await fs.readFile(path.join(result.exportDir, "status.json"), "utf8"));
    const artifactIndex = JSON.parse(await fs.readFile(result.artifactIndexPath, "utf8"));
    assert.equal(Array.isArray(runtimeCapture.nodes), true);
    assert.equal(runtimeCapture.nodes.length > 0, true);
    assert.equal(runtimeCapture.nodes[0]?.styles?.backgroundImage, 'url("https://example.com/bg.png")');
    assert.equal(runtimeCapture.nodes[0]?.styles?.overflow, "hidden");
    assert.equal(runtimeCapture.nodes[0]?.styles?.aspectRatio, "16 / 9");
    assert.equal(report.captureMode, "plugin-only");
    assert.equal(result.validation.status, "passed");
    assert.equal(result.validation.renderedElementCount > 0, true);
    assert.equal(report.generatedValidation?.status, "passed");
    assert.equal(["validated", "blocked"].includes(report.previewValidation?.status ?? ""), true);
    assert.equal(["validated", "blocked"].includes(report.attempts?.[0]?.previewValidation?.status ?? ""), true);
    assert.equal(String(report.runtimeCapture?.breakpointsCaptured?.length ?? 0) !== "0", true);
    assert.equal(debugManifest.bestAttempt, 1);
    assert.equal(Array.isArray(debugManifest.attempts), true);
    assert.equal(debugManifest.attempts[0]?.attempt, 1);
    assert.equal(typeof debugManifest.attempts[0]?.summary, "string");
    assert.equal(report.debugArtifacts?.manifestPath, "debug/manifest.json");
    assert.equal(report.debugArtifacts?.bestAttempt, 1);
    assert.equal(report.debugArtifacts?.attempts?.[0]?.attempt, 1);
    assert.equal(report.debugArtifacts?.attempts?.[0]?.summary, "debug/attempts/attempt-1/summary.json");
    assert.equal(report.patchHistoryPath, "patch-history.json");
    assert.equal(Array.isArray(patchHistory), true);
    assert.equal(patchHistory[0]?.attempt, 1);
    assert.equal(typeof report.attempts?.[0]?.patchTargets === "object" ||
        typeof report.attempts?.[0]?.patchTargets === "undefined", true);
    assert.equal(typeof debugSummary.patchTargets === "object" ||
        typeof debugSummary.patchTargets === "undefined", true);
    assert.equal(debugSummary.attempt, 1);
    assert.equal(debugSummary.selectedAsBest, true);
    assert.equal(invalidationPlan.kind, "initial");
    assert.equal(revisionStatus.stage, "completed");
    assert.equal(Array.isArray(revisionStatus.history) &&
        revisionStatus.history.some((entry) => entry.stage === "planning") &&
        revisionStatus.history.some((entry) => entry.stage === "capturing") &&
        revisionStatus.history.some((entry) => entry.stage === "generating") &&
        revisionStatus.history.some((entry) => entry.stage === "validating") &&
        revisionStatus.history.some((entry) => entry.stage === "completed"), true);
    assert.equal(Array.isArray(invalidationPlan.invalidated), true);
    assert.equal(typeof artifactIndex.fileCount, "number");
    assert.equal(Array.isArray(artifactIndex.entries) &&
        artifactIndex.entries.some((entry) => entry.path === "revision-manifest.json"), true);
    assert.equal(Array.isArray(artifactIndex.entries) &&
        artifactIndex.entries.some((entry) => entry.id === "manifest/status" && entry.path === "status.json"), true);
    assert.equal(Array.isArray(artifactIndex.entries) &&
        artifactIndex.entries.some((entry) => entry.id === "generated/project" &&
            Array.isArray(entry.dependsOn) &&
            entry.dependsOn.includes("ir/normalized")), true);
});
test("runLocalExport persists readable code files as source artifacts", async () => {
    const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-source-artifacts-"));
    const pluginCapture = createPluginCapture();
    pluginCapture.context = {
        ...(pluginCapture.context ?? {}),
        capabilities: {
            capabilityReport: {
                codeFiles: {
                    readable: true,
                    count: 1,
                    contentReadableCount: 1,
                    overrideExportCount: 0,
                },
                cms: {
                    collectionsReadable: false,
                },
                styles: {
                    colorStylesReadable: true,
                    textStylesReadable: true,
                },
            },
        },
        codeFiles: [
            {
                id: "code-file-button",
                name: "Button.tsx",
                path: "code/Button.tsx",
                versionId: "v1",
                source: "framer",
                content: 'export function Button(){ return <button type="button">Press</button> }',
                contentHash: "buttonhash",
                contentByteLength: 72,
                hasContent: true,
                exportDetails: [
                    {
                        name: "Button",
                        type: "component",
                        insertURL: "https://framer.com/m/Button.js",
                        isDefaultExport: false,
                        componentIdentifier: "Button",
                        componentName: "Button",
                        isPrimaryVariant: true,
                    },
                    {
                        name: "ButtonOverride",
                        type: "override",
                        insertURL: "https://framer.com/m/ButtonOverride.js",
                        componentIdentifier: "Button",
                        componentName: "Button",
                    },
                ],
                exports: ["Button"],
            },
        ],
    };
    const result = await runLocalExport({
        outDir,
        pluginCapture,
        name: "IntegrationSmoke",
        exportMode: "selection",
        maxAttempts: 1,
        targetFidelity: 0.92,
    });
    const sourceManifest = JSON.parse(await fs.readFile(path.join(result.exportDir, "source-artifacts", "manifest.json"), "utf8"));
    const codeFileEntry = Array.isArray(sourceManifest.codeFiles)
        ? sourceManifest.codeFiles[0]
        : undefined;
    const metadata = JSON.parse(await fs.readFile(path.join(result.exportDir, String(codeFileEntry?.metadataPath ?? "")), "utf8"));
    const report = JSON.parse(await fs.readFile(result.reportPath, "utf8"));
    const artifactIndex = JSON.parse(await fs.readFile(result.artifactIndexPath, "utf8"));
    const revisionManifest = JSON.parse(await fs.readFile(result.revisionManifestPath, "utf8"));
    const capabilityReport = JSON.parse(await fs.readFile(result.capabilityReportPath, "utf8"));
    const codeCompatibilityReport = JSON.parse(await fs.readFile(result.codeCompatibilityReportPath, "utf8"));
    const overrideAssignments = JSON.parse(await fs.readFile(path.join(result.exportDir, "source-artifacts", "override-assignments.json"), "utf8"));
    assert.equal(Array.isArray(sourceManifest.codeFiles), true);
    assert.equal(sourceManifest.capabilityReportPath, "capability-report.json");
    assert.equal(sourceManifest.overrideAssignmentsPath, "source-artifacts/override-assignments.json");
    assert.equal(codeFileEntry?.name, "Button.tsx");
    assert.equal(codeFileEntry?.hasContent, true);
    assert.equal(typeof codeFileEntry?.artifactId === "string" &&
        String(codeFileEntry.artifactId).startsWith("source/code-file/"), true);
    assert.equal(typeof codeFileEntry?.metadataArtifactId === "string" &&
        String(codeFileEntry.metadataArtifactId).endsWith("/metadata"), true);
    assert.equal(typeof codeFileEntry?.sourceArtifactId === "string" &&
        String(codeFileEntry.sourceArtifactId).endsWith("/source"), true);
    assert.equal(typeof codeFileEntry?.sourcePath, "string");
    assert.equal(metadata.contentHash, "buttonhash");
    assert.equal(Array.isArray(report.sourceArtifacts?.codeFiles), true);
    assert.equal(Array.isArray(report.codeFiles) &&
        typeof report.codeFiles[0]?.artifact === "object", true);
    assert.equal(report.sourceEvidence?.status, "complete");
    assert.equal(Array.isArray(report.sourceEvidence?.warnings) &&
        report.sourceEvidence.warnings.includes("override-assignment-unresolved"), true);
    assert.equal(revisionManifest.sourceEvidence?.status, "complete");
    assert.equal(Array.isArray(artifactIndex.entries) &&
        artifactIndex.entries.some((entry) => entry.id === codeFileEntry?.metadataArtifactId &&
            Array.isArray(entry.dependsOn) &&
            entry.dependsOn.includes("plugin/raw-payload")), true);
    assert.equal(artifactIndex.schemaVersion, 2);
    assert.equal(typeof artifactIndex.sourceFingerprint, "string");
    assert.equal(Array.isArray(artifactIndex.entries) &&
        artifactIndex.entries.some((entry) => entry.id === codeFileEntry?.sourceArtifactId &&
            Array.isArray(entry.dependsOn) &&
            entry.dependsOn.includes(String(codeFileEntry?.metadataArtifactId)) &&
            Array.isArray(entry.dependencyHashes) &&
            entry.dependencyHashes.length >= 1), true);
    assert.equal(capabilityReport.codeFiles?.contentReadableCount, 1);
    assert.equal(codeCompatibilityReport.fileCount, 1);
    assert.equal(codeCompatibilityReport.summary?.portable, 1);
    assert.equal(overrideAssignments[0]?.exportName, "ButtonOverride");
    assert.equal(overrideAssignments[0]?.assignmentStatus, "unresolved");
    assert.equal(Array.isArray(artifactIndex.entries) &&
        artifactIndex.entries.some((entry) => entry.id === "plugin/capability-report" &&
            entry.path === "capability-report.json" &&
            Array.isArray(entry.dependsOn) &&
            entry.dependsOn.includes("plugin/raw-payload")), true);
    assert.equal(Array.isArray(artifactIndex.entries) &&
        artifactIndex.entries.some((entry) => entry.id === "source/code-compatibility" &&
            entry.path === "code-compatibility-report.json" &&
            Array.isArray(entry.dependsOn) &&
            entry.dependsOn.some((value) => String(value).startsWith("source/code-file/"))), true);
    assert.equal(Array.isArray(artifactIndex.entries) &&
        artifactIndex.entries.some((entry) => entry.id === "source/override-assignments" &&
            entry.path === "source-artifacts/override-assignments.json" &&
            Array.isArray(entry.dependsOn) &&
            entry.dependsOn.some((value) => String(value).startsWith("source/code-file/"))), true);
});
test("runLocalExport marks exports partial when code file source is unreadable", async () => {
    const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-partial-source-evidence-"));
    const pluginCapture = createPluginCapture();
    pluginCapture.context = {
        ...(pluginCapture.context ?? {}),
        capabilities: {
            capabilityReport: {
                codeFiles: {
                    readable: true,
                    count: 1,
                    contentReadableCount: 0,
                },
            },
        },
        codeFiles: [
            {
                id: "code-file-hidden",
                name: "Hidden.tsx",
                path: "code/Hidden.tsx",
                versionId: "v1",
                source: "framer",
                hasContent: false,
                exportDetails: [
                    {
                        name: "Hidden",
                        type: "component",
                        insertURL: "https://framer.com/m/Hidden.js",
                        componentIdentifier: "Hidden",
                        componentName: "Hidden",
                        isPrimaryVariant: true,
                    },
                ],
                exports: ["Hidden"],
            },
        ],
    };
    const result = await runLocalExport({
        outDir,
        pluginCapture,
        name: "IntegrationSmoke",
        exportMode: "selection",
        maxAttempts: 1,
        targetFidelity: 0.92,
    });
    const report = JSON.parse(await fs.readFile(result.reportPath, "utf8"));
    const revisionManifest = JSON.parse(await fs.readFile(result.revisionManifestPath, "utf8"));
    const sourceEvidence = report.sourceEvidence;
    const manifestSourceEvidence = revisionManifest.sourceEvidence;
    assert.equal(sourceEvidence.status, "partial");
    assert.equal(Array.isArray(sourceEvidence.reasons) &&
        sourceEvidence.reasons.includes("code-file-source-unreadable"), true);
    assert.equal(sourceEvidence.unreadableCodeFileCount, 1);
    assert.equal(manifestSourceEvidence.status, "partial");
    assert.equal(Array.isArray(manifestSourceEvidence.reasons) &&
        manifestSourceEvidence.reasons.includes("code-file-source-unreadable"), true);
});
test("runLocalExport lists unsupported behavior in the fidelity report", async () => {
    const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-unsupported-behavior-"));
    const pluginCapture = createPluginCapture();
    pluginCapture.context = {
        ...(pluginCapture.context ?? {}),
        capabilities: {
            capabilityReport: {
                codeFiles: {
                    readable: true,
                    count: 1,
                    contentReadableCount: 1,
                },
            },
        },
        codeFiles: [
            {
                id: "code-file-unsupported",
                name: "Unsupported.tsx",
                path: "code/Unsupported.tsx",
                versionId: "v1",
                source: "framer",
                content: 'import Card from "@/components/ui/card"; export function Unsupported(){ return <Card /> }',
                contentHash: "unsupportedhash",
                contentByteLength: 88,
                hasContent: true,
                exportDetails: [
                    {
                        name: "Unsupported",
                        type: "component",
                        componentIdentifier: "Unsupported",
                        componentName: "Unsupported",
                    },
                ],
                exports: ["Unsupported"],
            },
        ],
    };
    const result = await runLocalExport({
        outDir,
        pluginCapture,
        name: "IntegrationSmoke",
        exportMode: "selection",
        maxAttempts: 1,
        targetFidelity: 0.92,
    });
    const report = JSON.parse(await fs.readFile(result.reportPath, "utf8"));
    const unadaptedSourcePath = path.join(result.exportDir, "unadapted-components", "unsupportedhash.tsx");
    const unadaptedMetadataPath = path.join(result.exportDir, "unadapted-components", "unsupportedhash.json");
    const unsupportedBehavior = Array.isArray(report.unsupportedBehavior)
        ? report.unsupportedBehavior
        : [];
    const reportCodeFiles = Array.isArray(report.codeFiles)
        ? report.codeFiles
        : [];
    const unadaptedMetadata = JSON.parse(await fs.readFile(unadaptedMetadataPath, "utf8"));
    assert.equal(unsupportedBehavior.length > 0, true);
    assert.equal(unsupportedBehavior[0]?.kind, "unsupported");
    assert.equal(unsupportedBehavior[0]?.scope, "code-file");
    assert.equal(unsupportedBehavior[0]?.name, "Unsupported.tsx");
    assert.equal(Array.isArray(unsupportedBehavior[0]?.reasons) &&
        unsupportedBehavior[0]?.reasons?.includes("uses-unresolved-project-aliases"), true);
    assert.match(await fs.readFile(unadaptedSourcePath, "utf8"), /Unsupported/);
    assert.equal(unadaptedMetadata.compatibility, "unsupported");
    assert.equal(unadaptedMetadata.sourcePath, "unadapted-components/unsupportedhash.tsx");
    assert.equal(reportCodeFiles[0]?.unadaptedComponentPath, "unadapted-components/unsupportedhash.tsx");
    assert.equal(reportCodeFiles[0]?.unadaptedMetadataPath, "unadapted-components/unsupportedhash.json");
});
test("runLocalExport adapts portable code files into executable preview modules", async () => {
    const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-code-file-adaptation-"));
    const pluginCapture = createPluginCapture();
    pluginCapture.context = {
        ...(pluginCapture.context ?? {}),
        capabilities: {
            capabilityReport: {
                codeFiles: {
                    readable: true,
                    count: 1,
                    contentReadableCount: 1,
                },
            },
        },
        codeFiles: [
            {
                id: "code-file-adapter",
                name: "Hero.tsx",
                path: "code/Hero.tsx",
                versionId: "v1",
                source: "framer",
                content: `
          import * as React from "react";
          import { RenderTarget, addPropertyControls } from "framer";
          export function Hero() {
            return <div data-render-target={RenderTarget.current()}>Hero preview</div>;
          }
          addPropertyControls(Hero, {});
        `,
                contentHash: "heroadapterhash",
                contentByteLength: 228,
                hasContent: true,
                exportDetails: [
                    {
                        name: "Hero",
                        type: "component",
                        componentIdentifier: "Hero",
                        componentName: "Hero",
                    },
                ],
                exports: ["Hero"],
            },
        ],
    };
    const result = await runLocalExport({
        outDir,
        pluginCapture,
        name: "IntegrationSmoke",
        exportMode: "selection",
        maxAttempts: 1,
        targetFidelity: 0.92,
    });
    const adapterPath = path.join(result.exportDir, "src", "framer-data", "framer-adapter.tsx");
    const executablesPath = path.join(result.exportDir, "src", "framer-data", "code-file-executables.tsx");
    const adaptedFilePath = path.join(result.exportDir, "src", "framer-generated-code", "code", "Hero.tsx");
    assert.match(await fs.readFile(adapterPath, "utf8"), /RenderTarget/);
    assert.match(await fs.readFile(executablesPath, "utf8"), /'Hero\.tsx'/);
    assert.match(await fs.readFile(executablesPath, "utf8"), /data-framer-code-file-executable-fallback=/);
    assert.match(await fs.readFile(adaptedFilePath, "utf8"), /framer-adapter/);
    assert.equal(result.validation.codeFileExecutions.length, 1);
    assert.equal(result.validation.codeFileExecutions[0]?.status, "passed");
    assert.equal(result.validation.codeFileExecutions[0]?.fileName, "Hero.tsx");
    assert.equal(result.validation.codeFileExecutions[0]?.renderTargetValue, "preview");
});
test("runLocalExport adapts local code-file imports and records dependency licenses", async () => {
    const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-code-file-local-import-chain-"));
    const pluginCapture = createPluginCapture();
    pluginCapture.context = {
        ...(pluginCapture.context ?? {}),
        capabilities: {
            capabilityReport: {
                codeFiles: {
                    readable: true,
                    count: 2,
                    contentReadableCount: 2,
                },
            },
        },
        codeFiles: [
            {
                id: "code-file-hero-local",
                name: "Hero.tsx",
                path: "code/Hero.tsx",
                versionId: "v1",
                source: "framer",
                content: `
          import * as React from "react";
          import clsx from "clsx";
          import { Card } from "./Card";
          export function Hero() {
            return <Card className={clsx("hero-card")}>Hero preview</Card>;
          }
        `,
                contentHash: "hero-local-hash",
                contentByteLength: 208,
                hasContent: true,
                exportDetails: [
                    {
                        name: "Hero",
                        type: "component",
                        componentIdentifier: "Hero",
                        componentName: "Hero",
                    },
                ],
                exports: ["Hero"],
            },
            {
                id: "code-file-card-local",
                name: "Card.tsx",
                path: "code/Card.tsx",
                versionId: "v1",
                source: "framer",
                content: `
          import * as React from "react";
          export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
            return <div data-card-wrapper="true" {...props} />;
          }
        `,
                contentHash: "card-local-hash",
                contentByteLength: 170,
                hasContent: true,
                exportDetails: [
                    {
                        name: "Card",
                        type: "component",
                        componentIdentifier: "Card",
                        componentName: "Card",
                    },
                ],
                exports: ["Card"],
            },
        ],
    };
    const result = await runLocalExport({
        outDir,
        pluginCapture,
        name: "IntegrationSmoke",
        exportMode: "selection",
        maxAttempts: 1,
        targetFidelity: 0.92,
    });
    const heroFilePath = path.join(result.exportDir, "src", "framer-generated-code", "code", "Hero.tsx");
    const dependencyLicensePath = path.join(result.exportDir, "dependency-license-report.json");
    assert.match(await fs.readFile(heroFilePath, "utf8"), /from '\.\/Card'/);
    assert.match(await fs.readFile(dependencyLicensePath, "utf8"), /"name": "clsx"/);
});
test("component-focused improvement revisions write dependency-scoped invalidation entries", async () => {
    const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-component-invalidation-"));
    const pluginCapture = createPluginCapture();
    pluginCapture.context = {
        ...(pluginCapture.context ?? {}),
        codeFiles: [
            {
                id: "code-file-tabs",
                name: "Tabs.tsx",
                path: "code/Tabs.tsx",
                versionId: "v1",
                source: "framer",
                content: 'export function Tabs(){ return <div>Tabs</div> }',
                contentHash: "tabshash",
                contentByteLength: 48,
                hasContent: true,
                exportDetails: [
                    {
                        name: "Tabs",
                        type: "component",
                        insertURL: "https://framer.com/m/Tabs.js",
                        componentIdentifier: "Tabs",
                        componentName: "Tabs",
                        isPrimaryVariant: true,
                    },
                ],
                exports: ["Tabs"],
            },
        ],
    };
    const result = await runLocalExport({
        outDir,
        pluginCapture,
        name: "IntegrationSmoke",
        exportMode: "selection",
        maxAttempts: 1,
        targetFidelity: 0.92,
        revisionRequest: {
            kind: "improvement",
            requestedFocus: "components",
            parentRevisionId: "revision_parent",
        },
    });
    const invalidationPlan = JSON.parse(await fs.readFile(result.invalidationPlanPath, "utf8"));
    const revisionManifest = JSON.parse(await fs.readFile(result.revisionManifestPath, "utf8"));
    const invalidated = Array.isArray(invalidationPlan.invalidated)
        ? invalidationPlan.invalidated
        : [];
    assert.equal(invalidationPlan.requestedFocus, "components");
    assert.equal(Array.isArray(revisionManifest.reusedArtifactIds), true);
    assert.equal(Array.isArray(revisionManifest.invalidatedArtifacts), true);
    assert.equal(revisionManifest.parentInfoPath, "parent.json");
    const parentInfo = JSON.parse(await fs.readFile(path.join(result.exportDir, "parent.json"), "utf8"));
    assert.equal(parentInfo.parentRevisionId, "revision_parent");
    assert.equal(parentInfo.requestedFocus, "components");
    assert.equal(invalidated.some((entry) => entry.artifact === "source/component-families" &&
        entry.reason === "component-source-refresh" &&
        Array.isArray(entry.dependsOn) &&
        entry.dependsOn.some((value) => String(value).startsWith("source/code-file/"))), true);
    assert.equal(invalidated.some((entry) => entry.artifact === "generated/project" &&
        entry.reason === "depends-on-component-model" &&
        Array.isArray(entry.dependsOn) &&
        entry.dependsOn.includes("ir/normalized")), true);
});
test("component-focused improvements record changed and unchanged source artifacts against the parent revision", async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-source-diff-"));
    const outDirA = path.join(rootDir, "artifacts", "job-a");
    const outDirB = path.join(rootDir, "artifacts", "job-b");
    await fs.mkdir(outDirA, { recursive: true });
    await fs.mkdir(outDirB, { recursive: true });
    const initialCapture = createPluginCapture();
    initialCapture.context = {
        ...(initialCapture.context ?? {}),
        codeFiles: [
            {
                id: "code-file-tabs",
                name: "Tabs.tsx",
                path: "code/Tabs.tsx",
                versionId: "v1",
                source: "framer",
                content: 'export function Tabs(){ return <div>v1</div> }',
                contentHash: "tabs-v1",
                contentByteLength: 46,
                hasContent: true,
                exportDetails: [{ name: "Tabs", type: "component" }],
                exports: ["Tabs"],
            },
            {
                id: "code-file-card",
                name: "Card.tsx",
                path: "code/Card.tsx",
                versionId: "v1",
                source: "framer",
                content: 'export function Card(){ return <div>same</div> }',
                contentHash: "card-same",
                contentByteLength: 49,
                hasContent: true,
                exportDetails: [{ name: "Card", type: "component" }],
                exports: ["Card"],
            },
        ],
    };
    const initial = await runLocalExport({
        outDir: outDirA,
        pluginCapture: initialCapture,
        name: "IntegrationSmoke",
        exportMode: "selection",
        maxAttempts: 1,
        targetFidelity: 0.92,
    });
    const initialManifest = JSON.parse(await fs.readFile(initial.revisionManifestPath, "utf8"));
    const nextCapture = createPluginCapture();
    nextCapture.context = {
        ...(nextCapture.context ?? {}),
        codeFiles: [
            {
                id: "code-file-tabs",
                name: "Tabs.tsx",
                path: "code/Tabs.tsx",
                versionId: "v2",
                source: "framer",
                content: 'export function Tabs(){ return <div>v2</div> }',
                contentHash: "tabs-v2",
                contentByteLength: 46,
                hasContent: true,
                exportDetails: [{ name: "Tabs", type: "component" }],
                exports: ["Tabs"],
            },
            {
                id: "code-file-card",
                name: "Card.tsx",
                path: "code/Card.tsx",
                versionId: "v1",
                source: "framer",
                content: 'export function Card(){ return <div>same</div> }',
                contentHash: "card-same",
                contentByteLength: 49,
                hasContent: true,
                exportDetails: [{ name: "Card", type: "component" }],
                exports: ["Card"],
            },
        ],
    };
    const next = await runLocalExport({
        outDir: outDirB,
        pluginCapture: nextCapture,
        name: "IntegrationSmoke",
        exportMode: "selection",
        maxAttempts: 1,
        targetFidelity: 0.92,
        revisionRequest: {
            kind: "improvement",
            requestedFocus: "components",
            parentRevisionId: initialManifest.revisionId,
        },
    });
    const invalidationPlan = JSON.parse(await fs.readFile(next.invalidationPlanPath, "utf8"));
    const sourceDiff = invalidationPlan.sourceDiff;
    assert.equal(Array.isArray(sourceDiff.changedCodeFileArtifactIds), true);
    assert.equal(sourceDiff.changedCodeFileArtifactIds.length, 1);
    assert.equal(sourceDiff.unchangedCodeFileArtifactIds.length, 1);
    assert.equal(Array.isArray(invalidationPlan.reused) &&
        invalidationPlan.reused.some((entry) => String(entry).startsWith("source/code-file/")), true);
});
test("component-focused improvements reuse the parent export when source artifacts are unchanged", async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-component-noop-"));
    const outDirA = path.join(rootDir, "artifacts", "job-a");
    const outDirB = path.join(rootDir, "artifacts", "job-b");
    await fs.mkdir(outDirA, { recursive: true });
    await fs.mkdir(outDirB, { recursive: true });
    const capture = createPluginCapture();
    capture.context = {
        ...(capture.context ?? {}),
        codeFiles: [
            {
                id: "code-file-tabs",
                name: "Tabs.tsx",
                path: "code/Tabs.tsx",
                versionId: "v1",
                source: "framer",
                content: 'export function Tabs(){ return <div>same</div> }',
                contentHash: "tabs-same",
                contentByteLength: 48,
                hasContent: true,
                exportDetails: [{ name: "Tabs", type: "component" }],
                exports: ["Tabs"],
            },
        ],
    };
    const initial = await runLocalExport({
        outDir: outDirA,
        pluginCapture: capture,
        name: "IntegrationSmoke",
        exportMode: "selection",
        maxAttempts: 1,
        targetFidelity: 0.92,
    });
    const initialManifest = JSON.parse(await fs.readFile(initial.revisionManifestPath, "utf8"));
    const next = await runLocalExport({
        outDir: outDirB,
        pluginCapture: capture,
        name: "IntegrationSmoke",
        exportMode: "selection",
        maxAttempts: 1,
        targetFidelity: 0.92,
        revisionRequest: {
            kind: "improvement",
            requestedFocus: "components",
            parentRevisionId: initialManifest.revisionId,
        },
    });
    const nextManifest = JSON.parse(await fs.readFile(next.revisionManifestPath, "utf8"));
    const nextReport = JSON.parse(await fs.readFile(next.reportPath, "utf8"));
    const nextBeforeAfter = JSON.parse(await fs.readFile(next.beforeAfterReportPath, "utf8"));
    const invalidationPlan = JSON.parse(await fs.readFile(next.invalidationPlanPath, "utf8"));
    const sourceDiff = invalidationPlan.sourceDiff;
    assert.equal(next.revisionCacheHit, false);
    assert.equal(nextManifest.parentRevisionId, initialManifest.revisionId);
    assert.equal(nextManifest.reusedBecause, "component-source-unchanged");
    assert.equal(nextManifest.parentInfoPath, "parent.json");
    assert.equal(Array.isArray(nextManifest.reusedArtifactIds), true);
    assert.equal(nextReport.reusedBecause, "component-source-unchanged");
    assert.equal(nextBeforeAfter.parentRevisionId, initialManifest.revisionId);
    assert.equal(Array.isArray(nextBeforeAfter.metrics), true);
    assert.equal(nextBeforeAfter.metrics.some((metric) => metric.label === "Overall fidelity"), true);
    const nextParentInfo = JSON.parse(await fs.readFile(path.join(next.exportDir, "parent.json"), "utf8"));
    const nextStatus = JSON.parse(await fs.readFile(path.join(next.exportDir, "status.json"), "utf8"));
    assert.equal(nextParentInfo.parentRevisionId, initialManifest.revisionId);
    assert.equal(nextParentInfo.requestedFocus, "components");
    assert.equal(nextStatus.stage, "completed");
    assert.equal(Array.isArray(nextStatus.history) &&
        nextStatus.history.some((entry) => entry.stage === "validating"), true);
    assert.equal(sourceDiff.changedCodeFileArtifactIds.length, 0);
    assert.equal(sourceDiff.unchangedCodeFileArtifactIds.length, 1);
});
test("component-focused improvements invalidate reused output when override semantics change without code-file content changes", async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-override-diff-"));
    const outDirA = path.join(rootDir, "artifacts", "job-a");
    const outDirB = path.join(rootDir, "artifacts", "job-b");
    await fs.mkdir(outDirA, { recursive: true });
    await fs.mkdir(outDirB, { recursive: true });
    const initialCapture = createPluginCapture();
    initialCapture.context = {
        ...(initialCapture.context ?? {}),
        codeFiles: [
            {
                id: "code-file-tabs",
                name: "Tabs.tsx",
                path: "code/Tabs.tsx",
                versionId: "v1",
                source: "framer",
                content: 'export function Tabs(){ return <div>same</div> }',
                contentHash: "tabs-same",
                contentByteLength: 48,
                hasContent: true,
                exportDetails: [
                    { name: "Tabs", type: "component" },
                    {
                        name: "withTabsPrimary",
                        type: "override",
                        componentIdentifier: "TabsPrimary",
                    },
                ],
                exports: ["Tabs", "withTabsPrimary"],
            },
        ],
    };
    const initial = await runLocalExport({
        outDir: outDirA,
        pluginCapture: initialCapture,
        name: "IntegrationSmoke",
        exportMode: "selection",
        maxAttempts: 1,
        targetFidelity: 0.92,
    });
    const initialManifest = JSON.parse(await fs.readFile(initial.revisionManifestPath, "utf8"));
    const nextCapture = createPluginCapture();
    nextCapture.context = {
        ...(nextCapture.context ?? {}),
        codeFiles: [
            {
                id: "code-file-tabs",
                name: "Tabs.tsx",
                path: "code/Tabs.tsx",
                versionId: "v1",
                source: "framer",
                content: 'export function Tabs(){ return <div>same</div> }',
                contentHash: "tabs-same",
                contentByteLength: 48,
                hasContent: true,
                exportDetails: [
                    { name: "Tabs", type: "component" },
                    {
                        name: "withTabsSecondary",
                        type: "override",
                        componentIdentifier: "TabsSecondary",
                    },
                ],
                exports: ["Tabs", "withTabsSecondary"],
            },
        ],
    };
    const next = await runLocalExport({
        outDir: outDirB,
        pluginCapture: nextCapture,
        name: "IntegrationSmoke",
        exportMode: "selection",
        maxAttempts: 1,
        targetFidelity: 0.92,
        revisionRequest: {
            kind: "improvement",
            requestedFocus: "components",
            parentRevisionId: initialManifest.revisionId,
        },
    });
    const nextManifest = JSON.parse(await fs.readFile(next.revisionManifestPath, "utf8"));
    const invalidationPlan = JSON.parse(await fs.readFile(next.invalidationPlanPath, "utf8"));
    const sourceDiff = invalidationPlan.sourceDiff;
    const invalidated = Array.isArray(invalidationPlan.invalidated)
        ? invalidationPlan.invalidated
        : [];
    assert.equal(nextManifest.reusedBecause, undefined);
    assert.equal(sourceDiff.overrideAssignmentsChanged, true);
    assert.equal(Array.isArray(sourceDiff.unchangedCodeFileArtifactIds) &&
        sourceDiff.unchangedCodeFileArtifactIds.length, 1);
    assert.equal(invalidated.some((entry) => entry.artifact === "source/override-assignments" &&
        entry.reason === "override-assignment-refresh"), true);
});
test("runLocalExport reuses a completed revision cache on identical exports", async () => {
    const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-revision-cache-"));
    const input = {
        outDir,
        pluginCapture: createPluginCapture(),
        name: "IntegrationSmoke",
        exportMode: "selection",
        maxAttempts: 1,
        targetFidelity: 0.92,
    };
    const first = await runLocalExport(input);
    const second = await runLocalExport(input);
    assert.equal(first.revisionCacheHit, false);
    assert.equal(second.revisionCacheHit, true);
    assert.equal(JSON.parse(await fs.readFile(first.revisionManifestPath, "utf8")).revisionId, JSON.parse(await fs.readFile(second.revisionManifestPath, "utf8")).revisionId);
});
test("runLocalExport reuses revision cache across different job output directories", async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-shared-revision-cache-"));
    const outDirA = path.join(rootDir, "artifacts", "job-a");
    const outDirB = path.join(rootDir, "artifacts", "job-b");
    await fs.mkdir(outDirA, { recursive: true });
    await fs.mkdir(outDirB, { recursive: true });
    const first = await runLocalExport({
        outDir: outDirA,
        pluginCapture: createPluginCapture(),
        name: "IntegrationSmoke",
        exportMode: "selection",
        maxAttempts: 1,
        targetFidelity: 0.92,
    });
    const second = await runLocalExport({
        outDir: outDirB,
        pluginCapture: createPluginCapture(),
        name: "IntegrationSmoke",
        exportMode: "selection",
        maxAttempts: 1,
        targetFidelity: 0.92,
    });
    assert.equal(first.revisionCacheHit, false);
    assert.equal(second.revisionCacheHit, true);
    assert.equal(JSON.parse(await fs.readFile(first.revisionManifestPath, "utf8")).revisionId, JSON.parse(await fs.readFile(second.revisionManifestPath, "utf8")).revisionId);
});
test("runLocalExport ignores a corrupted cached generated file but preserves healthy source artifacts", async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-corrupt-cache-regeneration-"));
    const outDir = path.join(rootDir, "artifacts", "job-a");
    await fs.mkdir(outDir, { recursive: true });
    const pluginCapture = createPluginCapture();
    pluginCapture.context = {
        ...(pluginCapture.context ?? {}),
        codeFiles: [
            {
                id: "code-file-hero",
                name: "Hero.tsx",
                path: "code/Hero.tsx",
                versionId: "v1",
                source: "framer",
                content: 'export function Hero(){ return <section>Hero</section> }',
                contentHash: "hero-v1",
                contentByteLength: 54,
                hasContent: true,
                exports: ["Hero"],
                exportDetails: [{ name: "Hero", type: "component" }],
            },
        ],
    };
    const input = {
        outDir,
        pluginCapture,
        name: "IntegrationSmoke",
        exportMode: "selection",
        maxAttempts: 1,
        targetFidelity: 0.92,
    };
    const first = await runLocalExport(input);
    const firstManifest = JSON.parse(await fs.readFile(first.revisionManifestPath, "utf8"));
    const cacheExportDir = path.join(rootDir, "revision-cache", firstManifest.revisionId, "export");
    const artifactIndex = JSON.parse(await fs.readFile(path.join(cacheExportDir, "artifact-index.json"), "utf8"));
    const generatedTsxPath = artifactIndex.entries.find((entry) => !entry.path.startsWith("source-artifacts/") &&
        entry.path.endsWith(".tsx") &&
        entry.artifactType === "source-tsx")?.path;
    assert.ok(generatedTsxPath);
    await fs.rm(path.join(cacheExportDir, generatedTsxPath), { force: true });
    const second = await runLocalExport(input);
    const sourceArtifacts = JSON.parse(await fs.readFile(path.join(second.exportDir, "source-artifacts", "manifest.json"), "utf8"));
    assert.equal(second.revisionCacheHit, false);
    assert.equal(sourceArtifacts.codeFiles?.length, 1);
    assert.equal(sourceArtifacts.codeFiles?.[0]?.name, "Hero.tsx");
    assert.equal(sourceArtifacts.codeFiles?.[0]?.hasContent, true);
    await fs.access(path.join(cacheExportDir, generatedTsxPath));
    assert.match(await fs.readFile(path.join(second.exportDir, String(sourceArtifacts.codeFiles?.[0]?.sourcePath)), "utf8"), /export function Hero/);
});
test("runLocalExport can create a revalidate-only revision from a parent revision", async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-revalidate-revision-"));
    const outDirA = path.join(rootDir, "artifacts", "job-a");
    const outDirB = path.join(rootDir, "artifacts", "job-b");
    await fs.mkdir(outDirA, { recursive: true });
    await fs.mkdir(outDirB, { recursive: true });
    const initial = await runLocalExport({
        outDir: outDirA,
        pluginCapture: createPluginCapture(),
        name: "IntegrationSmoke",
        exportMode: "selection",
        maxAttempts: 1,
        targetFidelity: 0.92,
    });
    const initialManifest = JSON.parse(await fs.readFile(initial.revisionManifestPath, "utf8"));
    const revalidated = await runLocalExport({
        outDir: outDirB,
        pluginCapture: {
            ...createPluginCapture(),
            selectedNodes: [],
            context: {
                exportMode: "selection",
                captureMode: "plugin-only",
                project: {
                    id: "broken-should-not-be-used",
                    name: "Broken should not be used",
                },
            },
        },
        name: "IntegrationSmoke",
        exportMode: "selection",
        maxAttempts: 1,
        targetFidelity: 0.92,
        revisionRequest: {
            kind: "improvement",
            requestedFocus: "revalidate",
            parentRevisionId: initialManifest.revisionId,
        },
    });
    const revalidatedManifest = JSON.parse(await fs.readFile(revalidated.revisionManifestPath, "utf8"));
    const revalidatedReport = JSON.parse(await fs.readFile(revalidated.reportPath, "utf8"));
    const revalidatedBeforeAfter = JSON.parse(await fs.readFile(revalidated.beforeAfterReportPath, "utf8"));
    const revalidatedInvalidation = JSON.parse(await fs.readFile(revalidated.invalidationPlanPath, "utf8"));
    const revalidatedArtifactIndex = JSON.parse(await fs.readFile(revalidated.artifactIndexPath, "utf8"));
    const revalidatedParentInfo = JSON.parse(await fs.readFile(path.join(revalidated.exportDir, "parent.json"), "utf8"));
    const revalidatedStatus = JSON.parse(await fs.readFile(path.join(revalidated.exportDir, "status.json"), "utf8"));
    assert.equal(revalidated.revisionCacheHit, false);
    assert.notEqual(revalidatedManifest.revisionId, initialManifest.revisionId);
    assert.equal(revalidatedManifest.parentRevisionId, initialManifest.revisionId);
    assert.equal(revalidatedManifest.revisionRequest
        ?.requestedFocus, "revalidate");
    assert.equal(revalidatedReport.revisionRequest
        ?.requestedFocus, "revalidate");
    assert.equal(revalidatedReport.generatedValidation?.status, "passed");
    assert.equal(revalidatedInvalidation.requestedFocus, "revalidate");
    assert.equal(Array.isArray(revalidatedInvalidation.reused) &&
        revalidatedInvalidation.reused.includes("generated/project"), true);
    assert.equal(Array.isArray(revalidatedManifest.reusedArtifactIds), true);
    assert.equal(revalidatedManifest.parentInfoPath, "parent.json");
    assert.equal(revalidatedParentInfo.parentRevisionId, initialManifest.revisionId);
    assert.equal(revalidatedParentInfo.requestedFocus, "revalidate");
    assert.equal(revalidatedBeforeAfter.parentRevisionId, initialManifest.revisionId);
    assert.equal(Array.isArray(revalidatedBeforeAfter.metrics), true);
    assert.equal(revalidatedStatus.stage, "completed");
    assert.equal(Array.isArray(revalidatedStatus.history) &&
        revalidatedStatus.history.some((entry) => entry.stage === "validating") &&
        revalidatedStatus.history.some((entry) => entry.stage === "completed"), true);
    assert.equal(typeof revalidatedArtifactIndex.fileCount, "number");
    assert.equal(Array.isArray(revalidatedArtifactIndex.entries) &&
        revalidatedArtifactIndex.entries.some((entry) => entry.id === "manifest/parent" && entry.path === "parent.json"), true);
});
test("runLocalExport rejects revalidate-only revisions without a parent revision id", async () => {
    const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-revalidate-missing-parent-"));
    await assert.rejects(runLocalExport({
        outDir,
        pluginCapture: createPluginCapture(),
        name: "IntegrationSmoke",
        exportMode: "selection",
        maxAttempts: 1,
        targetFidelity: 0.92,
        revisionRequest: {
            kind: "improvement",
            requestedFocus: "revalidate",
        },
    }), /Missing parentRevisionId/);
});
test("runLocalExport writes source artifacts before runtime capture for fresh exports", async () => {
    const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-source-artifacts-first-"));
    const pluginCapture = createPluginCapture();
    pluginCapture.context = {
        ...(pluginCapture.context ?? {}),
        codeFiles: [
            {
                id: "code-file-hero",
                name: "Hero.tsx",
                path: "code/Hero.tsx",
                versionId: "v1",
                source: "framer",
                content: 'export function Hero(){ return <section>Hero</section> }',
                contentHash: "hero-v1",
                contentByteLength: 54,
                hasContent: true,
                exports: ["Hero"],
                exportDetails: [{ name: "Hero", type: "component" }],
            },
        ],
    };
    await assert.rejects(runLocalExport({
        outDir,
        url: "http://127.0.0.1:9/",
        pluginCapture,
        exportMode: "full-site",
        maxAttempts: 1,
        targetFidelity: 0.9,
    }));
    const runEntries = (await fs.readdir(outDir)).sort();
    assert.equal(runEntries.length > 0, true);
    const exportArtifactDir = path.join(outDir, runEntries.at(-1), "export");
    const sourceArtifacts = JSON.parse(await fs.readFile(path.join(exportArtifactDir, "source-artifacts", "manifest.json"), "utf8"));
    const status = JSON.parse(await fs.readFile(path.join(exportArtifactDir, "status.json"), "utf8"));
    assert.equal(sourceArtifacts.codeFiles?.length, 1);
    assert.equal(sourceArtifacts.codeFiles?.[0]?.name, "Hero.tsx");
    assert.equal(sourceArtifacts.codeFiles?.[0]?.hasContent, true);
    assert.match(await fs.readFile(path.join(exportArtifactDir, String(sourceArtifacts.codeFiles?.[0]?.sourcePath)), "utf8"), /export function Hero/);
    assert.equal(status.stage, "failed");
});
test("runLocalExport reconstructs plugin-only runtime nodes from framerTree when selected nodes are empty", async () => {
    const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-local-export-tree-"));
    const result = await runLocalExport({
        outDir,
        exportMode: "selection",
        pluginCapture: {
            mode: "framer-plugin",
            capturedAt: "2026-06-12T00:00:00.000Z",
            selectedNodes: [],
            context: {
                exportMode: "selection",
                captureMode: "plugin-only",
                project: {
                    id: "framer-tree-only",
                    name: "Framer Tree Only",
                },
                framerTree: [
                    {
                        id: "root",
                        type: "FrameNode",
                        name: "Hero",
                        childIds: ["heading", "image"],
                        depth: 0,
                        path: "1",
                        rootId: "root",
                        rootName: "Hero",
                        rootKind: "component",
                        rect: { x: 0, y: 0, width: 720, height: 420 },
                        traits: {},
                        styles: {
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                            padding: "32px",
                            backgroundColor: "#0f172a",
                        },
                    },
                    {
                        id: "heading",
                        type: "TextNode",
                        name: "Heading",
                        text: "Tree fallback heading",
                        parentId: "root",
                        childIds: [],
                        depth: 1,
                        path: "1.1",
                        rootId: "root",
                        rootName: "Hero",
                        rootKind: "component",
                        rect: { x: 32, y: 32, width: 280, height: 48 },
                        traits: {},
                        styles: {
                            color: "#f8fafc",
                            fontSize: "40px",
                            lineHeight: "48px",
                        },
                    },
                    {
                        id: "image",
                        type: "FrameNode",
                        name: "Image",
                        parentId: "root",
                        childIds: [],
                        depth: 1,
                        path: "1.2",
                        rootId: "root",
                        rootName: "Hero",
                        rootKind: "component",
                        rect: { x: 32, y: 120, width: 320, height: 180 },
                        traits: {},
                        styles: {
                            borderRadius: "16px",
                        },
                        asset: {
                            kind: "image",
                            src: "https://example.com/tree-image.png",
                            alt: "Tree image",
                        },
                    },
                ],
            },
        },
        name: "FramerTreeOnly",
        maxAttempts: 1,
        targetFidelity: 0.92,
    });
    const runtimeCapturePath = path.join(result.exportDir, "raw-runtime-capture.json");
    const exportTreePath = path.join(result.exportDir, "export-tree.json");
    const runtimeCapture = JSON.parse(await fs.readFile(runtimeCapturePath, "utf8"));
    const exportTree = JSON.parse(await fs.readFile(exportTreePath, "utf8"));
    assert.equal(runtimeCapture.nodes.length, 3);
    assert.equal(runtimeCapture.nodes[0]?.id, "root");
    assert.equal(runtimeCapture.nodes[0]?.styles?.display, "flex");
    assert.equal(runtimeCapture.nodes[1]?.text, "Tree fallback heading");
    assert.equal(runtimeCapture.nodes[2]?.attributes?.src, "https://example.com/tree-image.png");
    assert.equal(String(runtimeCapture.nodes[2]?.domPath).includes("img:nth-child(2)"), true);
    assert.equal(exportTree[0]?.children?.length, 2);
});
test("runLocalExport crawls, builds, and validates every full-site route", async () => {
    const server = createServer((request, response) => {
        const pricing = request.url === "/pricing";
        response.setHeader("content-type", "text/html; charset=utf-8");
        response.end(`<!doctype html>
      <html>
        <head><title>${pricing ? "Pricing" : "Home"}</title></head>
        <body style="margin:0">
          <main style="min-height:100vh;background:${pricing ? "#fff7ed" : "#eff6ff"}">
            <section style="padding:48px">
              <h1 style="font-size:48px;color:#172554">${pricing ? "Choose a plan" : "Runtime home"}</h1>
              <p style="font-size:18px">${pricing ? "Pricing route content" : "Home route content"}</p>
            </section>
          </main>
        </body>
      </html>`);
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-full-site-routes-"));
    try {
        const result = await runLocalExport({
            outDir,
            url: `http://127.0.0.1:${address.port}/`,
            exportMode: "full-site",
            pluginCapture: {
                mode: "framer-plugin",
                capturedAt: "2026-06-30T00:00:00.000Z",
                selectedNodes: [],
                context: {
                    exportMode: "full-site",
                    captureMode: "runtime-first",
                    sitePages: [
                        { name: "Home", path: "/" },
                        { name: "Pricing", path: "/pricing" },
                    ],
                },
            },
            maxAttempts: 1,
            targetFidelity: 0.9,
        });
        assert.equal(result.validation.routes.length, 2);
        assert.equal(result.validation.routes.every((route) => route.renderedTextLength > 0 && route.renderedElementCount >= 3), true);
        assert.match(await fs.readFile(path.join(result.exportDir, "pages", "Home.tsx"), "utf8"), /Runtime home/);
        assert.match(await fs.readFile(path.join(result.exportDir, "pages", "Pricing.tsx"), "utf8"), /Choose a plan/);
        const rawRuntime = JSON.parse(await fs.readFile(path.join(result.exportDir, "raw-runtime-capture.json"), "utf8"));
        assert.equal(rawRuntime.routeCaptures.length, 2);
        const revisionManifest = JSON.parse(await fs.readFile(result.revisionManifestPath ??
            path.join(result.exportDir, "revision-manifest.json"), "utf8"));
        assert.match(revisionManifest.revisionId, /^revision_[0-9a-f]{16}$/);
        assert.equal(revisionManifest.summary.routeTemplates.length, 2);
        const responsivePlan = JSON.parse(await fs.readFile(path.join(result.exportDir, "responsive-recapture-plan.json"), "utf8"));
        assert.equal(responsivePlan.templateCount, 2);
        assert.deepEqual(responsivePlan.targetViewports, [
            "laptop",
            "tablet",
            "mobile",
        ]);
        assert.equal(responsivePlan.templates[0]?.responsiveCapturePolicy, "all-viewports");
        const artifactIndex = JSON.parse(await fs.readFile(path.join(result.exportDir, "artifact-index.json"), "utf8"));
        assert.equal(artifactIndex.entries.some((entry) => entry.id === "manifest/responsive-recapture"), true);
    }
    finally {
        await new Promise((resolve) => server.close(() => resolve()));
    }
});
test("responsive improvement plans recapture only representative CMS routes", async () => {
    const requestCounts = new Map();
    const server = createServer((request, response) => {
        const pathname = request.url?.split("?")[0] ?? "/";
        requestCounts.set(pathname, (requestCounts.get(pathname) ?? 0) + 1);
        const slug = request.url?.split("/").filter(Boolean).at(-1) ?? "first-post";
        response.setHeader("content-type", "text/html; charset=utf-8");
        response.end(`<!doctype html>
      <html>
        <head><title>${slug}</title></head>
        <body style="margin:0">
          <main style="min-height:100vh;background:#f8fafc">
            <section style="padding:48px">
              <h1 style="font-size:42px;color:#0f172a">Post ${slug}</h1>
              <p style="font-size:18px">Route content for ${slug}</p>
            </section>
          </main>
        </body>
      </html>`);
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-responsive-recapture-plan-"));
    const pluginCapture = {
        mode: "framer-plugin",
        capturedAt: "2026-07-01T00:00:00.000Z",
        selectedNodes: [],
        context: {
            exportMode: "full-site",
            captureMode: "runtime-first",
            sitePages: [
                {
                    name: "Blog post",
                    path: "/blog/:slug",
                    collectionId: "posts",
                },
            ],
            cmsCollections: [
                {
                    id: "posts",
                    name: "Posts",
                    fields: [],
                    items: [
                        { id: "alpha", slug: "first-post", fieldKeys: [] },
                        { id: "beta", slug: "second-post", fieldKeys: [] },
                    ],
                },
            ],
        },
    };
    try {
        const initial = await runLocalExport({
            outDir,
            url: `http://127.0.0.1:${address.port}/`,
            exportMode: "full-site",
            pluginCapture,
            maxAttempts: 1,
            targetFidelity: 0.9,
        });
        const initialManifest = JSON.parse(await fs.readFile(initial.revisionManifestPath ??
            path.join(initial.exportDir, "revision-manifest.json"), "utf8"));
        const parentRevisionId = String(initialManifest.revisionId);
        const firstRouteCountAfterInitial = requestCounts.get("/blog/first-post") ?? 0;
        const secondRouteCountAfterInitial = requestCounts.get("/blog/second-post") ?? 0;
        await fs.rm(path.join(outDir, ".capture-cache", routeCacheFileName("/blog/first-post")), { force: true });
        const improved = await runLocalExport({
            outDir,
            url: `http://127.0.0.1:${address.port}/`,
            exportMode: "full-site",
            pluginCapture,
            maxAttempts: 1,
            targetFidelity: 0.9,
            revisionRequest: {
                kind: "improvement",
                requestedFocus: "responsiveness",
                parentRevisionId,
            },
        });
        const responsivePlan = JSON.parse(await fs.readFile(path.join(improved.exportDir, "responsive-recapture-plan.json"), "utf8"));
        assert.equal(responsivePlan.kind, "improvement");
        assert.equal(responsivePlan.requestedFocus, "responsiveness");
        assert.equal(responsivePlan.templateCount, 1);
        assert.equal(responsivePlan.templates[0]?.responsiveCapturePolicy, "representative-viewports");
        assert.deepEqual(responsivePlan.templates[0]?.routesToCapture, [
            "/blog/first-post",
        ]);
        assert.deepEqual(responsivePlan.templates[0]?.viewports, [
            "laptop",
            "tablet",
            "mobile",
        ]);
        assert.equal((requestCounts.get("/blog/first-post") ?? 0) - firstRouteCountAfterInitial, 3);
        assert.equal((requestCounts.get("/blog/second-post") ?? 0) - secondRouteCountAfterInitial, 0);
        const invalidationPlan = JSON.parse(await fs.readFile(path.join(improved.exportDir, "invalidation-plan.json"), "utf8"));
        assert.equal(invalidationPlan.requestedFocus, "responsiveness");
    }
    finally {
        await new Promise((resolve) => server.close(() => resolve()));
    }
});
