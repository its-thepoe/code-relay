import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { __setGenerationFailureTestMode, __setZipVerificationTestMode, createNormalizedIrArtifact, normalizeLocalizableRuntimeUrl, runLocalExport, readFullSiteRouteManifest, validateGeneratedProject, } from "./local-export.js";
import { validateNormalizedExportRoutes } from "./export-routes.js";
import { __setCaptureFailureTestMode, CAPTURED_STYLE_PROPERTIES, } from "./capture.js";
import { resolveExportRouteMetadata } from "../../shared/src/route-contract.js";
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
test("normalizeLocalizableRuntimeUrl strips trailing escape slashes from runtime asset URLs", () => {
    assert.equal(normalizeLocalizableRuntimeUrl("https://framerusercontent.com/images/example.png\\\\"), "https://framerusercontent.com/images/example.png");
    assert.equal(normalizeLocalizableRuntimeUrl("https://framerusercontent.com/images/example.png?width=1200&amp;height=800\\\\"), "https://framerusercontent.com/images/example.png?width=1200&height=800");
});
test("generated validation ignores external document embeds while still validating local rendering", async () => {
    const externalServer = createServer((_request, response) => {
        response.setHeader("content-type", "text/html; charset=utf-8");
        response.end("<!doctype html><html><body>Embedded document</body></html>");
    });
    await new Promise((resolve) => externalServer.listen(0, "127.0.0.1", resolve));
    const externalAddress = externalServer.address();
    assert.ok(externalAddress && typeof externalAddress !== "string");
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-external-document-embed-"));
    await fs.mkdir(path.join(projectDir, "dist"), { recursive: true });
    await fs.writeFile(path.join(projectDir, "package.json"), JSON.stringify({
        name: "external-document-embed",
        private: true,
        scripts: { build: "node -e \"process.exit(0)\"" },
    }));
    await fs.writeFile(path.join(projectDir, "route-manifest.json"), JSON.stringify([
        {
            path: "/",
            sourceTextLength: 160,
            sourceNodeCount: 6,
        },
    ]));
    await fs.writeFile(path.join(projectDir, "placeholder.tsx"), "export const Placeholder = () => null\n");
    await fs.writeFile(path.join(projectDir, "placeholder.css"), "body { background: #fff; color: #111; }\n");
    await fs.writeFile(path.join(projectDir, "preview.html"), "<!doctype html><html><body>preview</body></html>");
    await fs.writeFile(path.join(projectDir, "dist", "index.html"), `<!doctype html>
    <html>
      <body style="margin:0;background:#fff;color:#111;font-family:system-ui,sans-serif">
        <div id="root">
          <main style="padding:24px;display:grid;gap:16px">
            <h1>Embedded document test</h1>
            <iframe
              title="external document"
              src="http://127.0.0.1:${externalAddress.port}/embed"
              style="width:100%;height:120px;border:0"
            ></iframe>
          </main>
        </div>
      </body>
    </html>`);
    try {
        const validation = await validateGeneratedProject(projectDir);
        assert.deepEqual(validation.externalRequests, []);
        assert.equal(validation.renderedElementCount > 0, true);
    }
    finally {
        await new Promise((resolve, reject) => externalServer.close((error) => (error ? reject(error) : resolve())));
    }
});
async function runSpawnedCommand(input) {
    return await new Promise((resolve, reject) => {
        const child = spawn(input.command, input.args, {
            cwd: input.cwd,
            env: process.env,
            stdio: ["ignore", "pipe", "pipe"],
        });
        let stdout = "";
        let stderr = "";
        const timer = setTimeout(() => {
            child.kill("SIGKILL");
            reject(new Error(`${input.command} ${input.args.join(" ")} timed out after ${input.timeoutMs}ms.\nstdout:\n${stdout}\nstderr:\n${stderr}`));
        }, input.timeoutMs);
        child.stdout.on("data", (chunk) => {
            stdout += String(chunk);
        });
        child.stderr.on("data", (chunk) => {
            stderr += String(chunk);
        });
        child.on("error", (error) => {
            clearTimeout(timer);
            reject(error);
        });
        child.on("close", (code) => {
            clearTimeout(timer);
            resolve({
                exitCode: code ?? -1,
                stdout,
                stderr,
            });
        });
    });
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
            schemaVersion: 1,
            path: "/blog/:slug",
            title: "Post",
            collectionId: undefined,
            templateId: "/blog/:slug",
            templatePath: "/blog/:slug",
            kind: "page",
            template: "cms",
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
            schemaVersion: 1,
            path: "/blog/first-post",
            title: "Post - first-post",
            collectionId: "posts",
            templateId: "/blog/:slug",
            templatePath: "/blog/:slug",
            kind: "page",
            template: "cms",
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
            schemaVersion: 1,
            path: "/",
            title: "Home",
            collectionId: undefined,
            templateId: "/",
            templatePath: "/",
            kind: "page",
            template: "static",
            templateKind: "static",
        },
        {
            schemaVersion: 1,
            path: "/about",
            title: "Public",
            collectionId: undefined,
            templateId: "/about",
            templatePath: "/about",
            kind: "page",
            template: "static",
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
            schemaVersion: 1,
            path: "/twitter",
            title: "Twitter",
            collectionId: undefined,
            templateId: "/twitter",
            templatePath: "/twitter",
            kind: "redirect",
            templateKind: "utility",
            destination: "https://twitter.com/coderelay",
            destinationKind: "external",
            redirectTo: "https://twitter.com/coderelay",
            redirectStatus: undefined,
        },
        {
            schemaVersion: 1,
            path: "/docs",
            title: "Docs",
            collectionId: undefined,
            templateId: "/docs",
            templatePath: "/docs",
            kind: "redirect",
            templateKind: "redirect",
            destination: "/learn",
            destinationKind: "internal",
            redirectTo: "/learn",
            redirectStatus: undefined,
        },
    ]);
});
test("full-site route manifest round-trips redirect metadata through shared route validation", () => {
    const capture = createPluginCapture();
    capture.context.sitePages = [
        {
            name: "Home",
            path: "/",
        },
        {
            name: "LinkedIn",
            path: "/linkedin",
            redirectTo: "https://linkedin.com/in/coderelay",
            redirectStatus: 302,
        },
        {
            name: "Docs",
            path: "/docs",
            redirectTo: "/learn",
            redirectStatus: 308,
        },
    ];
    const manifest = readFullSiteRouteManifest(capture);
    validateNormalizedExportRoutes(manifest);
    assert.deepEqual(manifest.map((route) => ({
        path: route.path,
        schemaVersion: route.schemaVersion,
        ...resolveExportRouteMetadata({
            routeKind: route.kind,
            destination: route.destination,
            destinationKind: route.destinationKind,
            redirectTo: route.redirectTo,
            redirectStatus: route.redirectStatus,
            templateKind: route.templateKind,
        }),
    })), [
        {
            path: "/",
            schemaVersion: 1,
            routeKind: "page",
            templateKind: "static",
        },
        {
            path: "/linkedin",
            schemaVersion: 1,
            routeKind: "redirect",
            destination: "https://linkedin.com/in/coderelay",
            destinationKind: "external",
            redirectTo: "https://linkedin.com/in/coderelay",
            redirectStatus: 302,
            templateKind: "utility",
        },
        {
            path: "/docs",
            schemaVersion: 1,
            routeKind: "redirect",
            destination: "/learn",
            destinationKind: "internal",
            redirectTo: "/learn",
            redirectStatus: 308,
            templateKind: "redirect",
        },
    ]);
});
test("full-site route manifest rejects duplicate normalized paths before capture begins", () => {
    const capture = createPluginCapture();
    capture.context.sitePages = [
        { name: "About", path: "/about" },
        { name: "About slash", path: "/about/" },
    ];
    assert.throws(() => readFullSiteRouteManifest(capture), /duplicate normalized path \/about/);
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
test("generated validation allows text-heavy minimal routes with a single visible container", async () => {
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-text-heavy-minimal-route-"));
    await fs.mkdir(path.join(projectDir, "dist"), { recursive: true });
    await fs.writeFile(path.join(projectDir, "package.json"), JSON.stringify({
        name: "text-heavy-minimal-route",
        private: true,
        scripts: { build: "node -e \"process.exit(0)\"" },
    }));
    await fs.writeFile(path.join(projectDir, "route-manifest.json"), JSON.stringify([
        {
            path: "/",
            sourceTextLength: 1200,
            sourceNodeCount: 269,
        },
    ]));
    await fs.writeFile(path.join(projectDir, "placeholder.tsx"), "export const Placeholder = () => null\n");
    await fs.writeFile(path.join(projectDir, "placeholder.css"), "body { background: #ffffff; color: #111827; }\n");
    await fs.writeFile(path.join(projectDir, "preview.html"), "<!doctype html><html><body>preview</body></html>");
    await fs.writeFile(path.join(projectDir, "dist", "index.html"), `<!doctype html>
    <html>
      <body style="margin:0;background:#fff;color:#111827;font-family:system-ui,sans-serif">
        <div id="root">
          <main style="min-height:100vh;padding:24px;background:#fff">
            ${"<p>Rendered route text that should count as real content.</p>".repeat(40)}
          </main>
        </div>
      </body>
    </html>`);
    const validation = await validateGeneratedProject(projectDir);
    assert.equal(validation.routes[0]?.path, "/");
    assert.equal((validation.routes[0]?.renderedTextLength ?? 0) >= 1200, true);
    assert.equal(validation.externalRequests.length, 0);
});
test("generated validation reports detailed timeout diagnostics for a hung build", async () => {
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-build-timeout-diagnostics-"));
    await fs.mkdir(path.join(projectDir, "dist"), { recursive: true });
    await fs.writeFile(path.join(projectDir, "package.json"), JSON.stringify({
        name: "build-timeout-diagnostics",
        private: true,
        scripts: {
            build: 'node -e "console.log(\\\"build-start\\\"); setTimeout(() => console.error(\\\"build-stderr\\\"), 50); setTimeout(() => {}, 5_000)"',
        },
    }));
    await fs.writeFile(path.join(projectDir, "route-manifest.json"), JSON.stringify([
        {
            path: "/",
            routeKind: "page",
            sourceTextLength: 120,
            sourceNodeCount: 4,
        },
    ]));
    await fs.writeFile(path.join(projectDir, "placeholder.tsx"), "export const Placeholder = () => null\n");
    await fs.writeFile(path.join(projectDir, "placeholder.css"), "body { background: #fff; color: #111; }\n");
    await fs.writeFile(path.join(projectDir, "preview.html"), "<!doctype html><html><body>preview</body></html>");
    await fs.writeFile(path.join(projectDir, "dist", "index.html"), `<!doctype html>
    <html>
      <body>
        <div id="root"><main><h1>Placeholder</h1></main></div>
      </body>
    </html>`);
    const previousTimeout = process.env.CODERELAY_BUILD_TIMEOUT_MS;
    process.env.CODERELAY_BUILD_TIMEOUT_MS = "100";
    try {
        await assert.rejects(validateGeneratedProject(projectDir), (error) => {
            const message = error instanceof Error ? error.message : String(error);
            assert.match(message, /npm run build timed out after 100ms/i);
            assert.match(message, /cwd=/i);
            assert.match(message, /pid=/i);
            assert.match(message, /elapsedMs=/i);
            assert.match(message, /stdout:\n[\s\S]*(build-start|\(empty\))/i);
            assert.match(message, /stderr:\n[\s\S]*(build-stderr|\(empty\))/i);
            return true;
        });
    }
    finally {
        if (previousTimeout == null) {
            delete process.env.CODERELAY_BUILD_TIMEOUT_MS;
        }
        else {
            process.env.CODERELAY_BUILD_TIMEOUT_MS = previousTimeout;
        }
    }
});
test("generated validation reports route-specific diagnostics when a route never becomes render-ready", async () => {
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-route-ready-timeout-diagnostics-"));
    await fs.mkdir(path.join(projectDir, "dist"), { recursive: true });
    await fs.writeFile(path.join(projectDir, "package.json"), JSON.stringify({
        name: "route-ready-timeout-diagnostics",
        private: true,
        scripts: { build: "node -e \"process.exit(0)\"" },
    }));
    await fs.writeFile(path.join(projectDir, "route-manifest.json"), JSON.stringify([
        {
            path: "/slow",
            routeKind: "page",
            sourceTextLength: 120,
            sourceNodeCount: 4,
        },
    ]));
    await fs.writeFile(path.join(projectDir, "placeholder.tsx"), "export const Placeholder = () => null\n");
    await fs.writeFile(path.join(projectDir, "placeholder.css"), "body { background: #fff; color: #111; }\n");
    await fs.writeFile(path.join(projectDir, "preview.html"), "<!doctype html><html><body>preview</body></html>");
    await fs.writeFile(path.join(projectDir, "dist", "index.html"), `<!doctype html>
    <html>
      <body>
        <div id="root"><div aria-live="polite">Still loading…</div></div>
        <script>
          setTimeout(() => {
            const root = document.getElementById('root');
            if (root) {
              root.innerHTML = '<main><h1>Slow route</h1></main>';
            }
          }, 500);
        </script>
      </body>
    </html>`);
    const previousTimeout = process.env.CODERELAY_ROUTE_READY_TIMEOUT_MS;
    process.env.CODERELAY_ROUTE_READY_TIMEOUT_MS = "100";
    try {
        await assert.rejects(validateGeneratedProject(projectDir), (error) => {
            const message = error instanceof Error ? error.message : String(error);
            assert.match(message, /Generated runtime validation timed out waiting for route \/slow to render after 100ms/i);
            assert.match(message, /attempt=2\/2/i);
            assert.match(message, /rootChildCount=/i);
            assert.match(message, /ariaLivePresent=/i);
            assert.match(message, /renderedTextLength=/i);
            return true;
        });
    }
    finally {
        if (previousTimeout == null) {
            delete process.env.CODERELAY_ROUTE_READY_TIMEOUT_MS;
        }
        else {
            process.env.CODERELAY_ROUTE_READY_TIMEOUT_MS = previousTimeout;
        }
    }
});
test("generated validation reports redirect routes without applying rendered-page checks", async () => {
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-redirect-route-validation-pass-"));
    await fs.mkdir(path.join(projectDir, "dist"), { recursive: true });
    await fs.writeFile(path.join(projectDir, "package.json"), JSON.stringify({
        name: "redirect-route-validation-pass",
        private: true,
        scripts: { build: "node -e \"process.exit(0)\"" },
    }));
    await fs.writeFile(path.join(projectDir, "route-manifest.json"), JSON.stringify([
        {
            path: "/figma",
            routeKind: "redirect",
            destination: "https://figma.com/@thepoe",
            destinationKind: "external",
            redirectTo: "https://figma.com/@thepoe",
            sourceTextLength: 0,
            sourceNodeCount: 0,
        },
    ]));
    await fs.writeFile(path.join(projectDir, "placeholder.tsx"), "export const Placeholder = () => null\n");
    await fs.writeFile(path.join(projectDir, "placeholder.css"), "body { background: #f8fafc; color: #0f172a; }\n");
    await fs.writeFile(path.join(projectDir, "preview.html"), "<!doctype html><html><body>preview</body></html>");
    await fs.writeFile(path.join(projectDir, "dist", "index.html"), `<!doctype html>
    <html>
      <body style="margin:0;background:#f8fafc;color:#0f172a;font-family:system-ui,sans-serif">
        <div id="root"></div>
      </body>
    </html>`);
    const validation = await validateGeneratedProject(projectDir);
    assert.equal(validation.routes.length, 1);
    assert.deepEqual(validation.routes[0], {
        path: "/figma",
        routeKind: "redirect",
        status: "passed",
        destination: "https://figma.com/@thepoe",
        destinationKind: "external",
        redirectTo: "https://figma.com/@thepoe",
        sourceTextLength: 0,
        sourceNodeCount: 0,
        rootChildCount: 0,
        renderedElementCount: 0,
        renderedTextLength: 0,
        screenshotColorCount: 0,
        viewportChecks: [],
    });
});
test("generated validation rejects redirect routes with unresolved internal destinations", async () => {
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-redirect-route-validation-fail-"));
    await fs.mkdir(path.join(projectDir, "dist"), { recursive: true });
    await fs.writeFile(path.join(projectDir, "package.json"), JSON.stringify({
        name: "redirect-route-validation-fail",
        private: true,
        scripts: { build: "node -e \"process.exit(0)\"" },
    }));
    await fs.writeFile(path.join(projectDir, "route-manifest.json"), JSON.stringify([
        {
            path: "/docs",
            routeKind: "redirect",
            destination: "/missing",
            destinationKind: "internal",
            redirectTo: "/missing",
            sourceTextLength: 0,
            sourceNodeCount: 0,
        },
        {
            path: "/",
            routeKind: "page",
            sourceTextLength: 80,
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
          <main style="min-height:100vh;padding:24px">
            <h1>Home</h1>
            <p>Real page route.</p>
          </main>
        </div>
      </body>
    </html>`);
    await assert.rejects(validateGeneratedProject(projectDir), /invalid internal redirect target: \/missing/i);
});
test("generated validation rejects external redirect routes that navigate away during local validation", async () => {
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-redirect-route-external-nav-fail-"));
    await fs.mkdir(path.join(projectDir, "dist"), { recursive: true });
    await fs.writeFile(path.join(projectDir, "package.json"), JSON.stringify({
        name: "redirect-route-external-nav-fail",
        private: true,
        scripts: { build: "node -e \"process.exit(0)\"" },
    }));
    await fs.writeFile(path.join(projectDir, "route-manifest.json"), JSON.stringify([
        {
            path: "/linkedin",
            routeKind: "redirect",
            destination: "https://linkedin.com/in/thepoe",
            destinationKind: "external",
            redirectTo: "https://linkedin.com/in/thepoe",
            sourceTextLength: 0,
            sourceNodeCount: 0,
        },
    ]));
    await fs.writeFile(path.join(projectDir, "placeholder.tsx"), "export const Placeholder = () => null\n");
    await fs.writeFile(path.join(projectDir, "placeholder.css"), "body { background: #f8fafc; color: #0f172a; }\n");
    await fs.writeFile(path.join(projectDir, "preview.html"), "<!doctype html><html><body>preview</body></html>");
    await fs.writeFile(path.join(projectDir, "dist", "index.html"), `<!doctype html>
    <html>
      <body>
        <div id="root">Redirect placeholder</div>
        <script>
          window.location.replace("https://linkedin.com/in/thepoe");
        </script>
      </body>
    </html>`);
    await assert.rejects(validateGeneratedProject(projectDir), /navigated away during local validation/i);
});
test("generated validation preserves explicit page routes even when stale redirect metadata is present", async () => {
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-page-route-metadata-priority-"));
    await fs.mkdir(path.join(projectDir, "dist"), { recursive: true });
    await fs.writeFile(path.join(projectDir, "package.json"), JSON.stringify({
        name: "page-route-metadata-priority",
        private: true,
        scripts: { build: "node -e \"process.exit(0)\"" },
    }));
    await fs.writeFile(path.join(projectDir, "route-manifest.json"), JSON.stringify([
        {
            path: "/about",
            routeKind: "page",
            destination: "https://stale.example/redirect",
            destinationKind: "external",
            redirectTo: "https://stale.example/redirect",
            sourceTextLength: 80,
            sourceNodeCount: 2,
        },
    ]));
    await fs.writeFile(path.join(projectDir, "placeholder.tsx"), "export const Placeholder = () => null\n");
    await fs.writeFile(path.join(projectDir, "placeholder.css"), "body { background: #f8fafc; color: #0f172a; }\n");
    await fs.writeFile(path.join(projectDir, "preview.html"), "<!doctype html><html><body>preview</body></html>");
    await fs.writeFile(path.join(projectDir, "dist", "index.html"), `<!doctype html>
    <html>
      <body style="margin:0;background:#f8fafc;color:#0f172a;font-family:system-ui,sans-serif">
        <div id="root">
          <main style="min-height:100vh;padding:24px">
            <h1>About</h1>
            <p>This is a real rendered page.</p>
          </main>
        </div>
      </body>
    </html>`);
    const validation = await validateGeneratedProject(projectDir);
    assert.equal(validation.routes.length, 1);
    assert.equal(validation.routes[0]?.path, "/about");
    assert.equal(validation.routes[0]?.routeKind, "page");
    assert.equal(validation.routes[0]?.destination, undefined);
    assert.equal(validation.routes[0]?.destinationKind, undefined);
    assert.equal(validation.routes[0]?.redirectTo, undefined);
    assert.ok((validation.routes[0]?.renderedElementCount ?? 0) > 0);
    assert.ok((validation.routes[0]?.renderedTextLength ?? 0) > 0);
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
test("generated validation skips single-variant component families without real alternate targets", async () => {
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-interaction-contracts-single-variant-"));
    await fs.mkdir(path.join(projectDir, "dist"), { recursive: true });
    await fs.writeFile(path.join(projectDir, "package.json"), JSON.stringify({
        name: "interaction-contracts-single-variant",
        private: true,
        scripts: { build: "node -e \"process.exit(0)\"" },
    }));
    await fs.writeFile(path.join(projectDir, "route-manifest.json"), JSON.stringify([
        {
            path: "/",
            sourceTextLength: 220,
            sourceNodeCount: 10,
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
            <article data-framer-component-family="StaticButton" data-framer-component-family-name="StaticButton" data-framer-component-family-placement="route" style="display:grid;gap:12px;padding:16px;background:white;border-radius:16px">
              <div data-framer-current-variant="static-default">Current variant: <code>Static / Default</code></div>
              <div style="display:flex;gap:8px">
                <button type="button" data-framer-variant-button="static-default">Default</button>
              </div>
              <div style="display:flex;gap:8px">
                <button type="button" data-framer-transition-trigger="advance" data-framer-transition-target="static-default">Advance</button>
              </div>
            </article>
          </main>
        </div>
      </body>
    </html>`);
    const validation = await validateGeneratedProject(projectDir);
    assert.equal(validation.interactionContracts.length, 0);
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
    assert.equal(result.validation.packagedArchive?.verified, true);
    assert.equal((result.validation.packagedArchive?.zipByteSize ?? 0) > 0, true);
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
        artifactIndex.entries.some((entry) => entry.id === "manifest/status" && entry.path === "status.json"), false);
    await fs.access(path.join(result.exportDir, "status.json"));
    assert.equal(Array.isArray(artifactIndex.entries) &&
        artifactIndex.entries.some((entry) => entry.id === "request/resolved" &&
            entry.path === "resolved-request.json" &&
            Array.isArray(entry.dependsOn) &&
            entry.dependsOn.includes("plugin/raw-payload")), true);
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
test("runLocalExport reuses a completed full-site revision cache after status tracking updates", async () => {
    const server = createServer((request, response) => {
        response.setHeader("content-type", "text/html; charset=utf-8");
        response.end(`<!doctype html>
      <html>
        <head><title>Home</title></head>
        <body style="margin:0">
          <main style="min-height:100vh;background:#eff6ff">
            <section style="padding:48px">
              <h1 style="font-size:48px;color:#172554">Runtime home</h1>
              <p style="font-size:18px">Home route content</p>
            </section>
          </main>
        </body>
      </html>`);
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-full-site-revision-cache-"));
    const outDir = path.join(rootDir, "artifacts", "job-a");
    await fs.mkdir(outDir, { recursive: true });
    const input = {
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
                sitePages: [{ name: "Home", path: "/" }],
            },
        },
        maxAttempts: 1,
        targetFidelity: 0.9,
    };
    try {
        const first = await runLocalExport(input);
        const second = await runLocalExport(input);
        const firstManifest = JSON.parse(await fs.readFile(first.revisionManifestPath, "utf8"));
        const cacheExportDir = path.join(rootDir, "revision-cache", firstManifest.revisionId, "export");
        const artifactIndex = JSON.parse(await fs.readFile(path.join(cacheExportDir, "artifact-index.json"), "utf8"));
        assert.equal(first.revisionCacheHit, false);
        assert.equal(second.revisionCacheHit, true);
        assert.equal(second.validation.packagedArchive?.verified, true);
        assert.deepEqual(second.validation.externalRequests, []);
        assert.deepEqual(second.validation.failedRequests, []);
        assert.equal(artifactIndex.entries.some((entry) => entry.path === "status.json"), false);
        await fs.access(path.join(cacheExportDir, "status.json"));
    }
    finally {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(() => resolve()));
    }
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
test("runLocalExport rebuilds a full-site export when a cached localized asset is deleted", async () => {
    const pixel = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9s3FoXQAAAAASUVORK5CYII=", "base64");
    const server = createServer((request, response) => {
        if (request.url?.startsWith("/hero.png")) {
            response.statusCode = 200;
            response.setHeader("content-type", "image/png");
            response.end(pixel);
            return;
        }
        response.setHeader("content-type", "text/html; charset=utf-8");
        response.end(`<!doctype html>
      <html>
        <head><title>Home</title></head>
        <body style="margin:0">
          <main style="min-height:100vh;background:#eff6ff">
            <section style="padding:48px">
              <h1 style="font-size:48px;color:#172554">Runtime home</h1>
              <p style="font-size:18px">Home route content</p>
              <img alt="Hero" src="http://${request.headers.host}/hero.png?width=2784&height=1660" width="96" height="57" />
            </section>
          </main>
        </body>
      </html>`);
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-full-site-deleted-asset-"));
    const outDir = path.join(rootDir, "artifacts", "job-a");
    await fs.mkdir(outDir, { recursive: true });
    const input = {
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
                sitePages: [{ name: "Home", path: "/" }],
            },
        },
        maxAttempts: 1,
        targetFidelity: 0.9,
    };
    try {
        const first = await runLocalExport(input);
        const firstManifest = JSON.parse(await fs.readFile(first.revisionManifestPath, "utf8"));
        const cacheExportDir = path.join(rootDir, "revision-cache", firstManifest.revisionId, "export");
        const artifactIndex = JSON.parse(await fs.readFile(path.join(cacheExportDir, "artifact-index.json"), "utf8"));
        const localizedAssetPath = artifactIndex.entries.find((entry) => entry.path.startsWith("public/runtime-assets/") &&
            entry.artifactType === "file")?.path;
        assert.ok(localizedAssetPath);
        await fs.rm(path.join(cacheExportDir, localizedAssetPath), { force: true });
        const second = await runLocalExport(input);
        assert.equal(second.revisionCacheHit, false);
        assert.deepEqual(second.validation.externalRequests, []);
        assert.deepEqual(second.validation.failedRequests, []);
        assert.equal(second.validation.packagedArchive?.verified, true);
        await fs.access(path.join(cacheExportDir, localizedAssetPath));
        await fs.access(path.join(second.exportDir, localizedAssetPath));
    }
    finally {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(() => resolve()));
    }
});
test("runLocalExport rebuilds a full-site export when a cached localized asset is corrupted", async () => {
    const pixel = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9s3FoXQAAAAASUVORK5CYII=", "base64");
    const server = createServer((request, response) => {
        if (request.url?.startsWith("/hero.png")) {
            response.statusCode = 200;
            response.setHeader("content-type", "image/png");
            response.end(pixel);
            return;
        }
        response.setHeader("content-type", "text/html; charset=utf-8");
        response.end(`<!doctype html>
      <html>
        <head><title>Home</title></head>
        <body style="margin:0">
          <main style="min-height:100vh;background:#eff6ff">
            <section style="padding:48px">
              <h1 style="font-size:48px;color:#172554">Runtime home</h1>
              <p style="font-size:18px">Home route content</p>
              <img alt="Hero" src="http://${request.headers.host}/hero.png?width=2784&height=1660" width="96" height="57" />
            </section>
          </main>
        </body>
      </html>`);
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-full-site-corrupted-asset-"));
    const outDir = path.join(rootDir, "artifacts", "job-a");
    await fs.mkdir(outDir, { recursive: true });
    const input = {
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
                sitePages: [{ name: "Home", path: "/" }],
            },
        },
        maxAttempts: 1,
        targetFidelity: 0.9,
    };
    try {
        const first = await runLocalExport(input);
        const firstManifest = JSON.parse(await fs.readFile(first.revisionManifestPath, "utf8"));
        const cacheExportDir = path.join(rootDir, "revision-cache", firstManifest.revisionId, "export");
        const artifactIndex = JSON.parse(await fs.readFile(path.join(cacheExportDir, "artifact-index.json"), "utf8"));
        const localizedAssetPath = artifactIndex.entries.find((entry) => entry.path.startsWith("public/runtime-assets/") &&
            entry.artifactType === "file")?.path;
        assert.ok(localizedAssetPath);
        await fs.writeFile(path.join(cacheExportDir, localizedAssetPath), Buffer.from("corrupted-runtime-asset", "utf8"));
        const second = await runLocalExport(input);
        assert.equal(second.revisionCacheHit, false);
        assert.deepEqual(second.validation.externalRequests, []);
        assert.deepEqual(second.validation.failedRequests, []);
        assert.equal(second.validation.packagedArchive?.verified, true);
        assert.deepEqual(await fs.readFile(path.join(cacheExportDir, localizedAssetPath)), pixel);
        assert.deepEqual(await fs.readFile(path.join(second.exportDir, localizedAssetPath)), pixel);
    }
    finally {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(() => resolve()));
    }
});
test("runLocalExport deduplicates localized runtime assets by content hash across transformed URL variants", async () => {
    const pixel = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9s3FoXQAAAAASUVORK5CYII=", "base64");
    const server = createServer((request, response) => {
        if (request.url?.startsWith("/hero.png")) {
            response.statusCode = 200;
            response.setHeader("content-type", "image/png");
            response.end(pixel);
            return;
        }
        response.setHeader("content-type", "text/html; charset=utf-8");
        response.end(`<!doctype html>
      <html>
        <head><title>Home</title></head>
        <body>
          <main>
            <img alt="Hero" src="http://${request.headers.host}/hero.png" width="48" height="48" />
            <img alt="Hero variant" src="http://${request.headers.host}/hero.png?width=2784&height=1660" width="96" height="57" />
          </main>
        </body>
      </html>`);
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-localized-asset-dedupe-"));
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
                    sitePages: [{ name: "Home", path: "/" }],
                },
            },
            maxAttempts: 1,
            targetFidelity: 0.9,
        });
        const runtimeAssets = await fs.readdir(path.join(result.exportDir, "public", "runtime-assets"));
        assert.equal(runtimeAssets.length, 1);
        const localizationReport = JSON.parse(await fs.readFile(path.join(result.exportDir, "runtime-localization-report.json"), "utf8"));
        const localizedEntries = localizationReport.assets.filter((entry) => entry.status === "localized");
        assert.equal(localizedEntries.length, 2);
        assert.equal(new Set(localizedEntries.map((entry) => entry.localPath)).size, 1);
    }
    finally {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(() => resolve()));
    }
});
test("runLocalExport records existing localized asset files for encoded runtime URLs with query strings and fragments", async () => {
    const pixel = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9s3FoXQAAAAASUVORK5CYII=", "base64");
    const server = createServer((request, response) => {
        const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
        if (requestUrl.pathname === "/hero%20banner.png") {
            response.statusCode = 200;
            response.setHeader("content-type", "image/png");
            response.end(pixel);
            return;
        }
        response.setHeader("content-type", "text/html; charset=utf-8");
        response.end(`<!doctype html>
      <html>
        <head><title>Encoded asset</title></head>
        <body>
          <main>
            <img alt="Hero" src="http://${request.headers.host}/hero%20banner.png?width=2784&title=Hello%20World#framer-image" width="96" height="57" />
          </main>
        </body>
      </html>`);
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-localized-asset-encoded-url-"));
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
                    sitePages: [{ name: "Home", path: "/" }],
                },
            },
            maxAttempts: 1,
            targetFidelity: 0.9,
        });
        const homePageSource = await fs.readFile(path.join(result.exportDir, "pages", "Home.tsx"), "utf8");
        assert.doesNotMatch(homePageSource, new RegExp(`http:\\/\\/127\\.0\\.0\\.1:${address.port}\\/hero%20banner\\.png\\?width=2784(?:&|&amp;)title=Hello%20World(?:#framer-image)?`));
        const localizationReport = JSON.parse(await fs.readFile(path.join(result.exportDir, "runtime-localization-report.json"), "utf8"));
        const localizedEntries = localizationReport.assets.filter((entry) => entry.status === "localized");
        assert.equal(localizedEntries.length, 1);
        assert.match(localizedEntries[0]?.sourceUrl ?? "", /hero%20banner\.png\?width=2784&title=Hello%20World#framer-image$/);
        assert.match(localizedEntries[0]?.localPath ?? "", /^\/runtime-assets\/.+\.png$/);
        await fs.access(path.join(result.exportDir, "public", String(localizedEntries[0]?.localPath).replace(/^\/runtime-assets\//, "runtime-assets/")));
    }
    finally {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(() => resolve()));
    }
});
test("export CLI exits cleanly after a full-site export with many localized runtime assets", async () => {
    const pixel = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9s3FoXQAAAAASUVORK5CYII=", "base64");
    const server = createServer((request, response) => {
        if (request.url?.startsWith("/asset-")) {
            response.statusCode = 200;
            response.setHeader("content-type", "image/png");
            response.end(pixel);
            return;
        }
        if (request.url?.startsWith("/styles.css")) {
            response.statusCode = 200;
            response.setHeader("content-type", "text/css; charset=utf-8");
            response.end(`
        body { margin: 0; font-family: system-ui; }
        .hero {
          min-height: 100vh;
          padding: 48px;
          background-image: url("http://${request.headers.host}/asset-bg.png?width=2784&height=1660");
          background-size: cover;
        }
      `);
            return;
        }
        const gallery = Array.from({ length: 24 }, (_, index) => {
            const assetId = index % 6;
            return `<img alt="Asset ${index}" src="http://${request.headers.host}/asset-${assetId}.png?width=${800 + index}&height=${600 + index}" width="96" height="64" />`;
        }).join("");
        response.statusCode = 200;
        response.setHeader("content-type", "text/html; charset=utf-8");
        response.end(`<!doctype html>
      <html>
        <head>
          <title>CLI exit proof</title>
          <link rel="stylesheet" href="http://${request.headers.host}/styles.css?cache=bust" />
        </head>
        <body>
          <main class="hero">
            <h1 style="font-size:48px;color:#172554">CLI exit proof</h1>
            <p style="font-size:18px;color:#1e3a8a">The spawned export command must terminate after reporting success.</p>
            <section style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px">
              ${gallery}
            </section>
          </main>
        </body>
      </html>`);
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-cli-exit-proof-"));
    try {
        const commandResult = await runSpawnedCommand({
            command: "npm",
            args: [
                "run",
                "export:test",
                "--",
                "--url",
                `http://127.0.0.1:${address.port}/`,
                "--export-mode",
                "full-site",
                "--out-dir",
                outDir,
            ],
            cwd: process.cwd(),
            timeoutMs: 240_000,
        });
        assert.equal(commandResult.exitCode, 0, commandResult.stderr);
        assert.match(commandResult.stdout, /Export complete:/);
        assert.match(commandResult.stdout, /ZIP:/);
        const runDirs = (await fs.readdir(outDir, { withFileTypes: true }))
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name)
            .sort();
        assert.equal(runDirs.length > 0, true);
        const exportDir = path.join(outDir, runDirs.at(-1), "export");
        const status = JSON.parse(await fs.readFile(path.join(exportDir, "status.json"), "utf8"));
        const validation = JSON.parse(await fs.readFile(path.join(exportDir, "generated-validation.json"), "utf8"));
        assert.equal(status.stage, "completed");
        assert.equal(validation.status, "passed");
        assert.deepEqual(validation.externalRequests, []);
        assert.deepEqual(validation.failedRequests, []);
        assert.equal(validation.packagedArchive?.verified, true);
        assert.equal((validation.packagedArchive?.zipByteSize ?? 0) > 0, true);
    }
    finally {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(() => resolve()));
    }
});
test("runLocalExport fails closed and preserves original runtime URLs when localization download verification fails", async () => {
    const server = createServer((request, response) => {
        if (request.url?.startsWith("/hero.png")) {
            response.statusCode = 200;
            response.setHeader("content-type", "text/html; charset=utf-8");
            response.end("<html><body>not an image</body></html>");
            return;
        }
        response.setHeader("content-type", "text/html; charset=utf-8");
        response.end(`<!doctype html>
      <html>
        <head><title>Home</title></head>
        <body>
          <main>
            <img alt="Hero" src="http://${request.headers.host}/hero.png?width=2784&height=1660" width="96" height="57" />
          </main>
        </body>
      </html>`);
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-localized-asset-failure-"));
    try {
        await assert.rejects(runLocalExport({
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
                    sitePages: [{ name: "Home", path: "/" }],
                },
            },
            maxAttempts: 1,
            targetFidelity: 0.9,
        }), /Generated export still depends on external runtime assets/);
        const runDirs = (await fs.readdir(outDir, { withFileTypes: true }))
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name)
            .sort();
        assert.equal(runDirs.length > 0, true);
        const failedProjectDir = path.join(outDir, runDirs.at(-1), "attempts", "attempt-1", "project");
        const homePageSource = await fs.readFile(path.join(failedProjectDir, "pages", "Home.tsx"), "utf8");
        assert.match(homePageSource, new RegExp(`http:\\/\\/127\\.0\\.0\\.1:${address.port}\\/hero\\.png\\?width=2784(?:&|&amp;)height=1660`));
        assert.doesNotMatch(homePageSource, /\/runtime-assets\//);
        const localizationReport = JSON.parse(await fs.readFile(path.join(failedProjectDir, "runtime-localization-report.json"), "utf8"));
        assert.equal(localizationReport.failed, 1);
        assert.match(localizationReport.assets[0]?.error ?? "", /Unsupported localized asset content type/);
        const runtimeAssetsDir = path.join(failedProjectDir, "public", "runtime-assets");
        const runtimeAssets = await fs.readdir(runtimeAssetsDir);
        assert.deepEqual(runtimeAssets, []);
    }
    finally {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(() => resolve()));
    }
});
test("runLocalExport fails closed when ZIP verification cannot extract the archive", async () => {
    const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-zip-verification-failure-"));
    __setZipVerificationTestMode("force-failure");
    try {
        await assert.rejects(async () => runLocalExport({
            outDir,
            pluginCapture: createPluginCapture(),
            name: "IntegrationSmoke",
            exportMode: "selection",
            maxAttempts: 1,
            targetFidelity: 0.92,
        }), /ZIP verification forced to fail for testing/);
    }
    finally {
        __setZipVerificationTestMode("normal");
    }
    const runEntries = (await fs.readdir(outDir)).sort();
    assert.equal(runEntries.length > 0, true);
    const exportDir = path.join(outDir, runEntries.at(-1), "export");
    const status = JSON.parse(await fs.readFile(path.join(exportDir, "status.json"), "utf8"));
    const manifest = JSON.parse(await fs.readFile(path.join(exportDir, "revision-manifest.json"), "utf8"));
    assert.equal(status.stage, "failed");
    assert.equal(Array.isArray(status.history) &&
        status.history.some((entry) => entry.stage === "failed"), true);
    assert.equal(typeof manifest.revisionId, "string");
    assert.equal(manifest.status, "failed");
    await assert.rejects(fs.access(path.join(outDir, ".revision-cache", String(manifest.revisionId), "export")));
});
test("runLocalExport resumes a full-site capture from persisted tablet progress after interruption", async () => {
    const server = createServer((request, response) => {
        response.setHeader("content-type", "text/html; charset=utf-8");
        response.end(`<!doctype html>
      <html>
        <head><title>Resume capture</title></head>
        <body style="margin:0">
          <main style="min-height:100vh;background:#eff6ff;padding:48px">
            <h1 style="font-size:48px;color:#172554">Resume capture</h1>
            <p style="font-size:18px;color:#1e3a8a">Capture should resume from tablet progress.</p>
          </main>
        </body>
      </html>`);
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-capture-resume-interruption-"));
    const input = {
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
                sitePages: [{ name: "Home", path: "/" }],
            },
        },
        maxAttempts: 1,
        targetFidelity: 0.9,
    };
    try {
        __setCaptureFailureTestMode("fail-after-tablet-progress");
        await assert.rejects(runLocalExport(input), /forced to fail after tablet progress for testing/);
    }
    finally {
        __setCaptureFailureTestMode("normal");
    }
    try {
        const firstRunEntries = (await fs.readdir(outDir)).sort();
        assert.equal(firstRunEntries.length > 0, true);
        const failedExportDir = path.join(outDir, firstRunEntries.at(-1), "export");
        const failedStatus = JSON.parse(await fs.readFile(path.join(failedExportDir, "status.json"), "utf8"));
        assert.equal(failedStatus.stage, "failed");
        const routeProgress = JSON.parse(await fs.readFile(path.join(outDir, ".capture-cache", "home", "route-progress.json"), "utf8"));
        assert.equal(routeProgress.status, "failed");
        assert.equal(routeProgress.failedPhase, "capture-tablet");
        assert.match(routeProgress.failureReason ?? "", /Route \/ phase capture-tablet failed at tablet: forced to fail after tablet progress for testing\./);
        assert.deepEqual(routeProgress.capturedViewports, [
            "desktop",
            "laptop",
            "tablet",
        ]);
        const resumed = await runLocalExport(input);
        const resumedCaptureProgress = JSON.parse(await fs.readFile(resumed.captureProgressPath ?? path.join(resumed.exportDir, "capture-progress.json"), "utf8"));
        const resumedRoute = resumedCaptureProgress.routeProgress?.find((entry) => entry.routePath === "/");
        assert.equal(resumed.revisionCacheHit, false);
        assert.equal(resumed.validation.packagedArchive?.verified, true);
        assert.equal(resumedRoute?.status, "retried");
        assert.equal(resumedRoute?.reusedFromProgress, true);
        assert.deepEqual(resumedRoute?.capturedViewports, [
            "desktop",
            "laptop",
            "tablet",
            "mobile",
        ]);
    }
    finally {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(() => resolve()));
    }
});
test("runLocalExport records capture-stage status progress for full-site routes", async () => {
    const server = createServer((request, response) => {
        response.setHeader("content-type", "text/html; charset=utf-8");
        response.end(`<!doctype html>
      <html>
        <head><title>Capture status</title></head>
        <body style="margin:0">
          <main style="min-height:100vh;background:#eff6ff;padding:48px">
            <h1 style="font-size:48px;color:#172554">Capture status</h1>
            <p style="font-size:18px;color:#1e3a8a">One route is enough to prove status progress.</p>
          </main>
        </body>
      </html>`);
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-capture-status-progress-"));
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
                    sitePages: [{ name: "Home", path: "/" }],
                },
            },
            maxAttempts: 1,
            targetFidelity: 0.9,
        });
        const status = JSON.parse(await fs.readFile(path.join(result.exportDir, "status.json"), "utf8"));
        const captureEntries = (status.history ?? []).filter((entry) => entry.stage === "capturing");
        assert.equal(captureEntries.some((entry) => entry.detail?.includes("Captured route / (1/1).") &&
            entry.progress?.completed === 1 &&
            entry.progress?.total === 1 &&
            entry.progress?.routePath === "/" &&
            entry.progress?.failed === 0), true);
    }
    finally {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(() => resolve()));
    }
});
test("runLocalExport reruns generation safely after an interruption before validation", async () => {
    const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-generation-interruption-"));
    const input = {
        outDir,
        pluginCapture: createPluginCapture(),
        name: "IntegrationSmoke",
        exportMode: "selection",
        maxAttempts: 1,
        targetFidelity: 0.92,
    };
    __setGenerationFailureTestMode("fail-before-validation");
    try {
        await assert.rejects(runLocalExport(input), /forced to fail during generation before validation for testing/);
    }
    finally {
        __setGenerationFailureTestMode("normal");
    }
    const failedRunEntries = (await fs.readdir(outDir)).sort();
    assert.equal(failedRunEntries.length > 0, true);
    const failedExportDir = path.join(outDir, failedRunEntries.at(-1), "export");
    const failedStatus = JSON.parse(await fs.readFile(path.join(failedExportDir, "status.json"), "utf8"));
    assert.equal(failedStatus.stage, "failed");
    assert.equal(typeof failedStatus.revisionId, "string");
    assert.equal(Array.isArray(failedStatus.history) &&
        failedStatus.history.some((entry) => entry.stage === "generating") &&
        failedStatus.history.some((entry) => entry.stage === "failed"), true);
    await assert.rejects(fs.access(path.join(outDir, ".revision-cache", String(failedStatus.revisionId), "export")));
    const recovered = await runLocalExport(input);
    const recoveredManifest = JSON.parse(await fs.readFile(recovered.revisionManifestPath ?? path.join(recovered.exportDir, "revision-manifest.json"), "utf8"));
    const recoveredStatus = JSON.parse(await fs.readFile(path.join(recovered.exportDir, "status.json"), "utf8"));
    assert.equal(recovered.revisionCacheHit, false);
    assert.equal(recovered.validation.packagedArchive?.verified, true);
    assert.equal(recoveredStatus.stage, "completed");
    assert.equal(recoveredManifest.revisionId, failedStatus.revisionId);
    assert.equal(recoveredManifest.status, "completed");
    await fs.access(path.join(outDir, ".revision-cache", String(failedStatus.revisionId), "export"));
});
test("runLocalExport records validation subphase status details through packaging", async () => {
    const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-validation-subphases-"));
    const result = await runLocalExport({
        outDir,
        pluginCapture: createPluginCapture(),
        name: "IntegrationSmoke",
        exportMode: "selection",
        maxAttempts: 1,
        targetFidelity: 0.92,
    });
    const status = JSON.parse(await fs.readFile(path.join(result.exportDir, "status.json"), "utf8"));
    const validationDetails = (status.history ?? [])
        .filter((entry) => entry.stage === "validating")
        .map((entry) => entry.detail ?? "");
    assert.equal(status.stage, "completed");
    assert.equal(validationDetails.some((detail) => detail.includes("Installing generated project dependencies")), true);
    assert.equal(validationDetails.some((detail) => detail.includes("Building generated project")), true);
    assert.equal(validationDetails.some((detail) => detail.includes("Running generated runtime validation across")), true);
    assert.equal(validationDetails.some((detail) => detail.includes("Packaging generated export into a ZIP archive")), true);
    assert.equal(validationDetails.some((detail) => detail.includes("Revalidating extracted ZIP contents from a clean directory")), true);
    assert.equal((status.history ?? []).some((entry) => entry.stage === "validating" &&
        typeof entry.progress?.total === "number" &&
        entry.progress.total >= 1), true);
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
    const pixel = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9s3FoXQAAAAASUVORK5CYII=", "base64");
    const server = createServer((request, response) => {
        if (request.url?.startsWith("/hero.png")) {
            response.statusCode = 200;
            response.setHeader("content-type", "image/png");
            response.end(pixel);
            return;
        }
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
              <img alt="Hero" src="http://${request.headers.host}/hero.png" width="48" height="48" />
              <img alt="Hero variant" src="http://${request.headers.host}/hero.png?width=2784&height=1660" width="96" height="57" />
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
                    cmsCollections: [
                        {
                            id: "posts",
                            name: "Posts",
                            fields: [
                                { id: "title", name: "Title", type: "string" },
                                { id: "link", name: "Link", type: "link" },
                                { id: "cover", name: "Cover", type: "image" },
                            ],
                            items: [
                                {
                                    id: "post-1",
                                    fieldData: {
                                        title: { type: "string", value: "A generated post" },
                                        link: { type: "link", value: "https://example.com/post" },
                                        cover: { type: "image", value: "https://example.com/post.png" },
                                    },
                                },
                            ],
                        },
                    ],
                },
            },
            maxAttempts: 1,
            targetFidelity: 0.9,
        });
        assert.equal(typeof result.captureProgressPath, "string");
        assert.equal(result.validation.packagedArchive?.verified, true);
        assert.equal((result.validation.packagedArchive?.extractedFileCount ?? 0) > 0, true);
        assert.equal(result.validation.routes.length, 2);
        assert.equal(result.validation.routes.every((route) => route.renderedTextLength > 0 && route.renderedElementCount >= 3), true);
        assert.match(await fs.readFile(path.join(result.exportDir, "pages", "Home.tsx"), "utf8"), /Runtime home/);
        const homePageSource = await fs.readFile(path.join(result.exportDir, "pages", "Home.tsx"), "utf8");
        assert.match(homePageSource, /\/runtime-assets\//);
        assert.doesNotMatch(homePageSource, new RegExp(`http:\\/\\/127\\.0\\.0\\.1:${address.port}\\/hero\\.png`));
        assert.doesNotMatch(homePageSource, /\/runtime-assets\/[^"\s]+(?:&amp;|&)width=/);
        assert.match(await fs.readFile(path.join(result.exportDir, "pages", "Pricing.tsx"), "utf8"), /Choose a plan/);
        const pricingPageSource = await fs.readFile(path.join(result.exportDir, "pages", "Pricing.tsx"), "utf8");
        assert.doesNotMatch(pricingPageSource, /\/runtime-assets\/[^"\s]+(?:&amp;|&)width=/);
        const cmsSource = await fs.readFile(path.join(result.exportDir, "src", "framer-data", "cms.ts"), "utf8");
        assert.match(cmsSource, /src=\\\"\/runtime-assets\/[^"\\]+\\\"/);
        const rawRuntime = JSON.parse(await fs.readFile(path.join(result.exportDir, "raw-runtime-capture.json"), "utf8"));
        assert.equal(rawRuntime.routeCaptures.length, 2);
        assert.deepEqual(result.validation.routes[0]?.viewportChecks.map((check) => [check.viewport, check.innerWidth]), [["desktop", 1440], ["laptop", 1280], ["tablet", 768], ["mobile", 390]]);
        assert.deepEqual(result.validation.externalRequests, []);
        assert.deepEqual(result.validation.failedRequests, []);
        assert.equal((result.validation.runtimeLocalization?.downloaded ?? 0) > 0, true);
        const localizationReport = JSON.parse(await fs.readFile(path.join(result.exportDir, "runtime-localization-report.json"), "utf8"));
        assert.equal(localizationReport.downloaded > 0, true);
        const packageJson = JSON.parse(await fs.readFile(path.join(result.exportDir, "package.json"), "utf8"));
        const npmLockPath = path.join(result.exportDir, "package-lock.json");
        const pnpmLockPath = path.join(result.exportDir, "pnpm-lock.yaml");
        const hasNpmLock = await fs
            .access(npmLockPath)
            .then(() => true)
            .catch(() => false);
        const lockfileSource = await fs.readFile(hasNpmLock ? npmLockPath : pnpmLockPath, "utf8");
        if (hasNpmLock) {
            const packageLock = JSON.parse(lockfileSource);
            assert.equal(packageLock.name, packageJson.name);
            assert.equal(packageLock.lockfileVersion, 3);
        }
        else {
            assert.match(lockfileSource, /lockfileVersion:\s*['"]?\d+/);
            assert.match(lockfileSource, /react(?:@|:)\s*19/);
        }
        assert.equal(lockfileSource.includes("latest"), false);
        assert.equal(JSON.stringify(packageJson).includes("latest"), false);
        const appSource = await fs.readFile(path.join(result.exportDir, "src", "App.tsx"), "utf8");
        assert.doesNotMatch(appSource, /previewTopbar/);
        assert.doesNotMatch(appSource, /FramerCodeFileList/);
        const runtimeStrategyManifest = JSON.parse(await fs.readFile(path.join(result.exportDir, "runtime-strategy-manifest.json"), "utf8"));
        assert.equal(runtimeStrategyManifest.strategy, "runtime-kept-full-site");
        assert.equal(runtimeStrategyManifest.runtimeKept, true);
        assert.equal(runtimeStrategyManifest.intendedEditor, "agent-first");
        const agentHandoffManifest = JSON.parse(await fs.readFile(path.join(result.exportDir, "agent-handoff-manifest.json"), "utf8"));
        assert.equal(agentHandoffManifest.handoffMode, "runtime-kept");
        assert.equal(agentHandoffManifest.intendedEditor, "agent-first");
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
        assert.equal(artifactIndex.entries.some((entry) => entry.id === "manifest/capture-progress" &&
            entry.path === "capture-progress.json" &&
            Array.isArray(entry.dependsOn) &&
            entry.dependsOn.includes("runtime/raw-capture")), true);
        assert.equal(artifactIndex.entries.some((entry) => entry.id === "request/resolved" &&
            entry.path === "resolved-request.json" &&
            Array.isArray(entry.dependsOn) &&
            entry.dependsOn.includes("plugin/raw-payload")), true);
        const exportReport = JSON.parse(await fs.readFile(path.join(result.exportDir, "export-report.json"), "utf8"));
        assert.equal(exportReport.exportStrategy, "runtime-kept-full-site");
        assert.equal(exportReport.runtimeKept, true);
        assert.equal(exportReport.intendedEditor, "agent-first");
        assert.equal(exportReport.handoffArtifacts.runtimeStrategyManifest, "runtime-strategy-manifest.json");
    }
    finally {
        await new Promise((resolve) => server.close(() => resolve()));
    }
});
test("runLocalExport rejects a full-site export when one route capture is skipped", async () => {
    const server = createServer((request, response) => {
        if (request.url === "/missing") {
            request.socket.destroy();
            return;
        }
        response.setHeader("content-type", "text/html; charset=utf-8");
        response.end("<!doctype html><html><body><main><h1>Healthy route</h1></main></body></html>");
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-full-site-missing-route-"));
    try {
        await assert.rejects(runLocalExport({
            outDir,
            url: `http://127.0.0.1:${address.port}/`,
            exportMode: "full-site",
            pluginCapture: {
                mode: "framer-plugin",
                capturedAt: "2026-07-10T00:00:00.000Z",
                selectedNodes: [],
                context: {
                    exportMode: "full-site",
                    captureMode: "runtime-first",
                    sitePages: [
                        { name: "Home", path: "/" },
                        { name: "Missing", path: "/missing" },
                    ],
                },
            },
            maxAttempts: 1,
            targetFidelity: 0.9,
        }), /Full-site capture incomplete: route \/missing was not captured/);
    }
    finally {
        server.closeAllConnections();
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
