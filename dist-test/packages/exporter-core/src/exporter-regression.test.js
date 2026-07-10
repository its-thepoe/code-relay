import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { createServer } from "node:http";
import { buildIntermediateRepresentation } from "./ir.js";
import { assertPluginCaptureIntegrity } from "./local-export.js";
import { generateNextProject } from "../../codegen/src/next-project.js";
import { inspectGeneratedPreviewNodes } from "../../fidelity/src/compare.js";
import { captureRuntimeRoutes, validateFullSiteCapture } from "./capture.js";
function createPluginCapture() {
    return {
        mode: "framer-plugin",
        capturedAt: "2026-06-11T00:00:00.000Z",
        selectedNodes: [
            {
                id: "root",
                name: "Styled Card",
                type: "FrameNode",
                bounds: { x: 0, y: 0, width: 620, height: 420 },
                metadata: {
                    rootId: "root",
                    rootName: "Styled Card",
                    rootKind: "component",
                    sourceIndex: 0,
                    depth: 0,
                    path: "1",
                    styles: {
                        backgroundColor: "#101828",
                        borderRadius: "24px",
                        padding: "32px",
                    },
                },
            },
            {
                id: "heading",
                name: "Heading",
                type: "TextNode",
                text: "Styled export",
                bounds: { x: 32, y: 32, width: 320, height: 48 },
                metadata: {
                    rootId: "root",
                    rootName: "Styled Card",
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
            {
                id: "body",
                name: "Body",
                type: "TextNode",
                text: "This should carry color and typography into TSX.",
                bounds: { x: 32, y: 92, width: 420, height: 56 },
                metadata: {
                    rootId: "root",
                    rootName: "Styled Card",
                    rootKind: "component",
                    sourceIndex: 0,
                    depth: 1,
                    parentId: "root",
                    path: "1.2",
                    tag: "p",
                    styles: {
                        color: "#d0d5dd",
                        fontSize: "18px",
                        lineHeight: "28px",
                        fontWeight: "500",
                    },
                },
            },
        ],
        context: {
            exportMode: "selection",
            project: {
                id: "styled-smoke",
                name: "Styled Smoke",
            },
            componentModules: [
                {
                    id: "component-module-1",
                    name: "Hero Module",
                    source: "selected-component",
                    insertURL: "https://framer.com/m/HeroModule.js",
                    componentIdentifier: "HeroModule",
                    componentName: "HeroModule",
                },
            ],
            fonts: [
                {
                    id: "font-1",
                    name: "Inter",
                    family: "Inter",
                    weight: "400",
                    style: "normal",
                },
            ],
            codeFiles: [
                {
                    id: "code-file-1",
                    name: "Hero.tsx",
                    path: "code/Hero.tsx",
                    exports: ["Hero", "HeroButton"],
                    insertURL: "https://framer.com/m/Hero.js",
                    source: "canvas-code-file",
                },
            ],
            cmsCollections: [
                {
                    id: "collection-1",
                    name: "Blog Posts",
                    managed: true,
                    pluginData: {
                        sourceId: "airtable-blog",
                        lastSyncAt: "2026-06-12T00:00:00.000Z",
                    },
                    fields: [
                        {
                            id: "title",
                            name: "Title",
                            type: "string",
                            userEditable: true,
                        },
                        {
                            id: "slug",
                            name: "Slug",
                            type: "string",
                        },
                        {
                            id: "cover",
                            name: "Cover",
                            type: "image",
                        },
                    ],
                    items: [
                        {
                            id: "post-1",
                            slug: "hello-world",
                            draft: false,
                            fieldData: {
                                title: { type: "string", value: "Hello world" },
                                slug: { type: "string", value: "hello-world" },
                                cover: { type: "image", value: "https://example.com/cover.png" },
                            },
                        },
                    ],
                },
            ],
        },
    };
}
test("Plan 003 blocks full-site exports when a page root is truncated", () => {
    const diagnostics = {
        captureSource: "full-site",
        capturedNodeCount: 3000,
        truncated: true,
        truncatedRootIds: ["page-home"],
        rootSummaries: [
            {
                rootId: "page-home",
                rootName: "Home",
                rootKind: "page",
                capturedCount: 260,
                stoppedBecause: "limit",
            },
        ],
    };
    assert.throws(() => assertPluginCaptureIntegrity({
        exportMode: "full-site",
        pluginCapture: {
            ...createPluginCapture(),
            context: { captureDiagnostics: diagnostics },
        },
    }), /Full-site export blocked: plugin capture was truncated/);
});
test("Plan 003 allows component-only truncation", () => {
    const diagnostics = {
        captureSource: "full-site",
        capturedNodeCount: 3000,
        truncated: true,
        truncatedRootIds: ["component-card"],
        rootSummaries: [
            {
                rootId: "component-card",
                rootName: "Card",
                rootKind: "component",
                capturedCount: 260,
                stoppedBecause: "limit",
            },
        ],
    };
    const pluginCapture = {
        ...createPluginCapture(),
        context: { captureDiagnostics: diagnostics },
    };
    assert.doesNotThrow(() => assertPluginCaptureIntegrity({
        exportMode: "full-site",
        pluginCapture,
    }));
    const ir = buildIntermediateRepresentation({
        url: "https://example.com",
        exportMode: "full-site",
        runtimeCapture: createRuntimeCapture(),
        pluginCapture,
        nodeMatches: [],
    });
    assert.deepEqual(ir.warnings.find((warning) => warning.type === "capture_truncated"), {
        type: "capture_truncated",
        severity: "warning",
        message: "Plugin capture was truncated after 3000 nodes; affected roots: component-card",
    });
});
test("Plan 003 leaves non-truncated captures unchanged", () => {
    assert.doesNotThrow(() => assertPluginCaptureIntegrity({
        exportMode: "full-site",
        pluginCapture: createPluginCapture(),
    }));
});
function createRuntimeCapture() {
    return {
        url: "framer://project/styled-smoke",
        title: "Styled Smoke",
        mode: "section",
        viewports: {
            desktop: { screenshotPath: "", width: 1440, height: 900 },
            laptop: { screenshotPath: "", width: 1280, height: 900 },
            tablet: { screenshotPath: "", width: 768, height: 1024 },
            mobile: { screenshotPath: "", width: 390, height: 844 },
        },
        nodes: [
            {
                id: "root",
                tag: "div",
                domPath: "plugin > div:nth-child(1)",
                rect: { x: 0, y: 0, width: 620, height: 420 },
                sectionIndex: 0,
                sectionName: "Styled Card",
                attributes: {},
                styles: {
                    backgroundColor: "#101828",
                    borderRadius: "24px",
                    padding: "32px",
                    __coderelayRootId: "root",
                    __coderelayRootKind: "component",
                    __coderelayDepth: "0",
                    __coderelaySourceIndex: "0",
                },
            },
            {
                id: "heading",
                tag: "h1",
                domPath: "plugin > h1:nth-child(2)",
                text: "Styled export",
                rect: { x: 32, y: 32, width: 320, height: 48 },
                sectionIndex: 0,
                sectionName: "Styled Card",
                attributes: {},
                styles: {
                    color: "#f9fafb",
                    fontSize: "42px",
                    lineHeight: "48px",
                    fontWeight: "800",
                    __coderelayRootId: "root",
                    __coderelayRootKind: "component",
                    __coderelayDepth: "1",
                    __coderelaySourceIndex: "0",
                },
                motion: {
                    transitionProperty: "transform, opacity",
                    transitionDuration: "0.3s",
                    transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
                },
                interactionStyles: {
                    hover: {
                        color: "#ffffff",
                        transform: "translateY(-2px)",
                    },
                    focus: {
                        color: "#ffffff",
                    },
                },
            },
            {
                id: "body",
                tag: "p",
                domPath: "plugin > p:nth-child(3)",
                text: "This should carry color and typography into TSX.",
                rect: { x: 32, y: 92, width: 420, height: 56 },
                sectionIndex: 0,
                sectionName: "Styled Card",
                attributes: {},
                styles: {
                    color: "#d0d5dd",
                    fontSize: "18px",
                    lineHeight: "28px",
                    fontWeight: "500",
                    __coderelayRootId: "root",
                    __coderelayRootKind: "component",
                    __coderelayDepth: "1",
                    __coderelaySourceIndex: "0",
                },
            },
        ],
        nodesByViewport: {
            desktop: [
                {
                    id: "root",
                    tag: "div",
                    domPath: "plugin > div:nth-child(1)",
                    rect: { x: 0, y: 0, width: 620, height: 420 },
                    sectionIndex: 0,
                    sectionName: "Styled Card",
                    attributes: {},
                    styles: {
                        backgroundColor: "#101828",
                        borderRadius: "24px",
                        padding: "32px",
                    },
                },
                {
                    id: "heading",
                    tag: "h1",
                    domPath: "plugin > h1:nth-child(2)",
                    text: "Styled export",
                    rect: { x: 32, y: 32, width: 320, height: 48 },
                    sectionIndex: 0,
                    sectionName: "Styled Card",
                    attributes: {},
                    styles: {
                        color: "#f9fafb",
                        fontSize: "42px",
                        lineHeight: "48px",
                        fontWeight: "800",
                    },
                    motion: {
                        transitionProperty: "transform, opacity",
                        transitionDuration: "0.3s",
                        transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
                    },
                    interactionStyles: {
                        hover: {
                            color: "#ffffff",
                            transform: "translateY(-2px)",
                        },
                        focus: {
                            color: "#ffffff",
                        },
                    },
                },
            ],
            tablet: [
                {
                    id: "root-tablet",
                    tag: "div",
                    domPath: "plugin > div:nth-child(1)",
                    rect: { x: 0, y: 0, width: 640, height: 420 },
                    sectionIndex: 0,
                    sectionName: "Styled Card",
                    attributes: {},
                    styles: {
                        backgroundColor: "#101828",
                        borderRadius: "24px",
                        padding: "24px",
                    },
                },
                {
                    id: "heading-tablet",
                    tag: "h1",
                    domPath: "plugin > h1:nth-child(2)",
                    text: "Styled export",
                    rect: { x: 24, y: 24, width: 300, height: 44 },
                    sectionIndex: 0,
                    sectionName: "Styled Card",
                    attributes: {},
                    styles: {
                        color: "#f9fafb",
                        fontSize: "36px",
                        lineHeight: "42px",
                        fontWeight: "800",
                    },
                    motion: {
                        transitionProperty: "transform, opacity",
                        transitionDuration: "0.24s",
                        transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
                    },
                    interactionStyles: {
                        hover: {
                            color: "#ffffff",
                            transform: "translateY(-1px)",
                        },
                    },
                },
            ],
            mobile: [
                {
                    id: "root-mobile",
                    tag: "div",
                    domPath: "plugin > div:nth-child(1)",
                    rect: { x: 0, y: 0, width: 390, height: 420 },
                    sectionIndex: 0,
                    sectionName: "Styled Card",
                    attributes: {},
                    styles: {
                        backgroundColor: "#101828",
                        borderRadius: "20px",
                        padding: "20px",
                    },
                },
                {
                    id: "heading-mobile",
                    tag: "h1",
                    domPath: "plugin > h1:nth-child(2)",
                    text: "Styled export",
                    rect: { x: 20, y: 20, width: 260, height: 40 },
                    sectionIndex: 0,
                    sectionName: "Styled Card",
                    attributes: {},
                    styles: {
                        color: "#f9fafb",
                        fontSize: "30px",
                        lineHeight: "36px",
                        fontWeight: "800",
                    },
                    motion: {
                        transitionProperty: "transform, opacity",
                        transitionDuration: "0.2s",
                        transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
                    },
                    interactionStyles: {
                        hover: {
                            color: "#ffffff",
                        },
                    },
                },
            ],
        },
    };
}
function createSimulatedPluginCaptureForTest(runtimeCapture) {
    return {
        mode: "simulated",
        capturedAt: "2026-06-12T00:00:00.000Z",
        selectedNodes: runtimeCapture.nodes
            .filter((node) => node.rect.width > 0 && node.rect.height > 0)
            .map((node) => ({
            id: node.id,
            name: node.text ? node.text.slice(0, 48) : node.tag,
            type: node.tag,
            text: node.text,
            bounds: node.rect,
            metadata: {
                domPath: node.domPath,
                sectionName: node.sectionName,
                className: node.attributes.className,
                rootKind: "component",
            },
        })),
    };
}
function createNodeMatches() {
    return [
        {
            framerNodeId: "root",
            domPath: "plugin > div:nth-child(1)",
            confidence: 0.9,
            matchReasons: ["bounds"],
        },
        {
            framerNodeId: "heading",
            domPath: "plugin > h1:nth-child(2)",
            confidence: 0.95,
            matchReasons: ["text", "type"],
        },
        {
            framerNodeId: "body",
            domPath: "plugin > p:nth-child(3)",
            confidence: 0.92,
            matchReasons: ["text", "type"],
        },
    ];
}
function createRuntimeCaptureWithRuntimeContainerText() {
    const base = createRuntimeCapture();
    const runtimeContainer = {
        id: "runtime-main",
        tag: "main",
        domPath: "body:nth-child(2) > main:nth-child(1)",
        text: "html body { background: rgb(255, 255, 255); }",
        rect: { x: 0, y: 0, width: 1440, height: 900 },
        sectionIndex: 0,
        sectionName: "Page",
        attributes: {},
        styles: {
            backgroundColor: "#ffffff",
        },
    };
    return {
        ...base,
        nodes: [...base.nodes, runtimeContainer],
        nodesByViewport: {
            ...base.nodesByViewport,
            desktop: [...(base.nodesByViewport?.desktop ?? []), runtimeContainer],
        },
    };
}
test("buildIntermediateRepresentation preserves code file source and variant metadata", () => {
    const ir = buildIntermediateRepresentation({
        url: "https://example.com",
        exportMode: "components",
        runtimeCapture: {
            url: "https://example.com",
            title: "Example",
            mode: "section",
            viewports: {
                desktop: { screenshotPath: "", width: 1440, height: 900 },
                laptop: { screenshotPath: "", width: 1280, height: 900 },
                tablet: { screenshotPath: "", width: 768, height: 1024 },
                mobile: { screenshotPath: "", width: 390, height: 844 },
            },
            nodes: [],
        },
        pluginCapture: {
            mode: "framer-plugin",
            capturedAt: "2026-07-01T00:00:00.000Z",
            selectedNodes: [
                {
                    id: "button-primary",
                    name: "Primary Button",
                    type: "ComponentNode",
                    metadata: {
                        component: {
                            id: "button-primary",
                            name: "Primary Button",
                            source: "component-node",
                            insertURL: "https://framer.com/m/button.js",
                            componentIdentifier: "Button",
                            componentName: "Button",
                            isVariant: true,
                            isPrimaryVariant: true,
                            gesture: "tap",
                            inheritsFromId: "button-base",
                            breakpoint: "mobile",
                            variantName: "Primary",
                        },
                    },
                },
            ],
            context: {
                componentModules: [
                    {
                        id: "button-primary",
                        name: "Primary Button",
                        source: "component-node",
                        insertURL: "https://framer.com/m/button.js",
                        componentIdentifier: "Button",
                        componentName: "Button",
                        isVariant: true,
                        isPrimaryVariant: true,
                        gesture: "tap",
                        inheritsFromId: "button-base",
                        breakpoint: "mobile",
                        variantName: "Primary",
                    },
                ],
                codeFiles: [
                    {
                        id: "code-file-1",
                        name: "Button.tsx",
                        path: "code/Button.tsx",
                        versionId: "version-1",
                        content: "export const Button = () => <button />",
                        source: "canvas-code-file",
                        exports: ["Button"],
                        exportDetails: [
                            {
                                name: "ButtonOverride",
                                type: "override",
                                insertURL: "https://framer.com/m/button-override.js",
                                componentIdentifier: "Button",
                                componentName: "Button",
                            },
                        ],
                    },
                ],
            },
        },
        nodeMatches: [],
    });
    assert.equal(ir.componentModules?.[0]?.isVariant, true);
    assert.equal(ir.componentModules?.[0]?.gesture, "tap");
    assert.equal(ir.componentModules?.[0]?.breakpoint, "mobile");
    assert.equal(ir.componentModules?.[0]?.variantName, "Primary");
    assert.equal(ir.componentFamilies?.[0]?.id, "Button");
    assert.equal(ir.componentFamilies?.[0]?.primaryVariantId, "button-primary");
    assert.equal(ir.componentFamilies?.[0]?.variants[0]?.gesture, "tap");
    assert.equal(ir.componentFamilies?.[0]?.provenance, "plugin");
    assert.equal(ir.overrideAssignments?.[0]?.exportName, "ButtonOverride");
    assert.equal(ir.overrideAssignments?.[0]?.assignmentStatus, "unresolved");
    assert.equal(ir.overrideAssignments?.[0]?.unresolvedReason, "plugin-assignment-not-exposed");
    assert.equal(ir.codeFiles?.[0]?.versionId, "version-1");
    assert.equal(ir.codeFiles?.[0]?.content, "export const Button = () => <button />");
});
test("buildIntermediateRepresentation keeps styled surface nodes", () => {
    const ir = buildIntermediateRepresentation({
        url: "framer://project/styled-smoke",
        name: "StyledCard",
        exportMode: "selection",
        runtimeCapture: createRuntimeCapture(),
        pluginCapture: createPluginCapture(),
        nodeMatches: createNodeMatches(),
    });
    assert.equal(ir.captureMode, "plugin-only");
    assert.equal(ir.component.nodes.some((node) => node.id === "root"), true);
    assert.equal(ir.component.nodes.some((node) => node.tag === "h1" && node.text === "Styled export"), true);
    assert.ok(ir.exportTree);
    assert.equal(ir.exportTree?.[0]?.id, "root");
    assert.equal(ir.exportTree?.[0]?.children.length, 2);
    assert.equal(ir.exportTree?.[0]?.source.pluginNodeId, "root");
    assert.equal(ir.exportTree?.[0]?.source.runtimeNodeId, "root");
    assert.equal(ir.exportTree?.[0]?.children[0]?.source.runtimeNodeId, "heading");
    assert.equal(ir.exportTreeDiagnostics?.totalNodes, 3);
    assert.equal(ir.codeFiles?.[0]?.name, "Hero.tsx");
    assert.deepEqual(ir.codeFiles?.[0]?.exports, ["Hero", "HeroButton"]);
    assert.equal(ir.componentModules?.[0]?.name, "Hero Module");
    assert.equal(ir.fonts?.some((font) => font.family === "Inter"), true);
    assert.equal(ir.cmsCollections?.[0]?.name, "Blog Posts");
    assert.equal(ir.cmsCollections?.[0]?.fields.length, 3);
    assert.deepEqual(ir.cmsCollections?.[0]?.pluginDataKeys, ["sourceId", "lastSyncAt"]);
    assert.equal(ir.cmsCollections?.[0]?.pluginData?.sourceId, "airtable-blog");
});
test("buildIntermediateRepresentation drops inherited stylesheet text from runtime container roots", () => {
    const ir = buildIntermediateRepresentation({
        url: "https://talktoaugust.com/",
        name: "August",
        exportMode: "full-site",
        captureMode: "runtime-first",
        runtimeCapture: createRuntimeCaptureWithRuntimeContainerText(),
        pluginCapture: createPluginCapture(),
        nodeMatches: createNodeMatches(),
    });
    const runtimeRoot = ir.exportTree?.find((node) => node.id === "runtime-main");
    assert.equal(runtimeRoot?.tag, "main");
    assert.equal(runtimeRoot?.text, undefined);
    assert.equal(runtimeRoot?.kind, "frame");
});
test("buildIntermediateRepresentation marks published captures as runtime-first", () => {
    const ir = buildIntermediateRepresentation({
        url: "https://styled-smoke.framer.website/",
        name: "StyledCard",
        exportMode: "selection",
        captureMode: "runtime-first",
        runtimeCapture: {
            ...createRuntimeCapture(),
            url: "https://styled-smoke.framer.website/",
        },
        pluginCapture: createPluginCapture(),
        nodeMatches: createNodeMatches(),
    });
    assert.equal(ir.captureMode, "runtime-first");
    assert.equal(ir.exportEngine, "published-runtime");
});
test("full-site published URL export creates a page instead of fake component library entries", async () => {
    const runtimeCapture = createRuntimeCapture();
    runtimeCapture.nodes = runtimeCapture.nodes.map((node) => {
        if (node.id === "root") {
            return { ...node, domPath: "body:nth-child(2) > div:nth-child(1)" };
        }
        return {
            ...node,
            domPath: `body:nth-child(2) > div:nth-child(1) > ${node.tag}:nth-child(${node.id === "heading" ? 1 : 2})`,
        };
    });
    const ir = buildIntermediateRepresentation({
        url: "https://talktoaugust.com/",
        name: "August",
        exportMode: "full-site",
        captureMode: "runtime-first",
        runtimeCapture,
        pluginCapture: {
            ...createSimulatedPluginCaptureForTest(runtimeCapture),
            context: {
                exportMode: "full-site",
                captureMode: "runtime-first",
            },
        },
        nodeMatches: createNodeMatches(),
    });
    assert.equal(ir.exportMode, "full-site");
    assert.equal(ir.libraryComponents, undefined);
    assert.equal(ir.sitePages?.length, 1);
    assert.equal(ir.sitePages?.[0]?.routePath, "/");
    assert.equal(ir.sitePages?.[0]?.templateId, "/");
    assert.equal(ir.routeTemplates?.[0]?.templateId, "/");
    assert.equal(ir.routeTemplates?.[0]?.routeCount, 1);
    assert.ok((ir.sitePages?.[0]?.nodes.length ?? 0) > 0);
    assert.ok((ir.exportTree ?? []).some((node) => node.children.length > 0));
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-full-site-url-test-"));
    await generateNextProject({
        ir,
        projectDir,
        strategy: {
            id: "semantic-layout",
            structuredLayout: false,
            compactSpacing: false,
            aggressiveMobileStacking: false,
            preserveImageAspectRatio: true,
        },
    });
    const app = await fs.readFile(path.join(projectDir, "src", "App.tsx"), "utf8");
    const preview = await fs.readFile(path.join(projectDir, "preview.html"), "utf8");
    const routeManifest = JSON.parse(await fs.readFile(path.join(projectDir, "route-manifest.json"), "utf8"));
    const routeTemplateManifest = JSON.parse(await fs.readFile(path.join(projectDir, "route-template-manifest.json"), "utf8"));
    const componentFiles = await fs.readdir(path.join(projectDir, "components"));
    const pageFiles = await fs.readdir(path.join(projectDir, "pages"));
    assert.match(app, /const pages =/);
    assert.match(app, /import\('\.\.\/pages\/August'\)/);
    assert.match(app, /window\.history\[method\]/);
    assert.match(app, /window\.addEventListener\('popstate'/);
    assert.match(app, /document\.addEventListener\('click'/);
    assert.match(preview, /Full-site preview/);
    assert.doesNotMatch(preview, /Component library preview/);
    assert.equal(componentFiles.length, 0);
    assert.ok(pageFiles.some((file) => file === "August.tsx"));
    assert.equal(routeManifest[0]?.componentName, "August");
    assert.equal(routeManifest[0]?.templateId, "/");
    assert.equal(routeTemplateManifest[0]?.templatePath, "/");
});
test("full-site export ignores anonymous page roots and component catalog noise", () => {
    const runtimeCapture = {
        ...createRuntimeCapture(),
        url: "https://talktoaugust.com/",
        title: "August",
    };
    const ir = buildIntermediateRepresentation({
        url: "https://talktoaugust.com/",
        name: "August",
        exportMode: "full-site",
        captureMode: "runtime-first",
        runtimeCapture,
        pluginCapture: {
            ...createPluginCapture(),
            context: {
                exportMode: "full-site",
                captureMode: "runtime-first",
                sitePages: [{ id: "OnvKRLt5G" }, { id: "VWJTSEXvT" }],
                selectedComponents: [
                    {
                        id: "button",
                        name: "Button",
                        type: "ComponentNode",
                        insertURL: "https://framer.com/m/Button.js",
                    },
                ],
            },
        },
        nodeMatches: createNodeMatches(),
    });
    assert.equal(ir.libraryComponents, undefined);
    assert.equal(ir.sitePages?.length, 1);
    assert.equal(ir.sitePages?.[0]?.componentName, "August");
    assert.equal(ir.sitePages?.[0]?.routePath, "/");
    assert.equal(ir.sitePages?.[0]?.title, "August");
    assert.ok((ir.sitePages?.[0]?.nodes.length ?? 0) > 1);
});
test("full-site export preserves explicit Framer page names and routes", () => {
    const homeCapture = {
        ...createRuntimeCapture(),
        url: "https://example.com/",
        title: "Home",
        routePath: "/",
    };
    const pricingCapture = {
        ...createRuntimeCapture(),
        url: "https://example.com/pricing",
        title: "Pricing",
        routePath: "/pricing",
        nodes: createRuntimeCapture().nodes.map((node) => ({
            ...node,
            id: `/pricing::${node.id}`,
            routePath: "/pricing",
        })),
    };
    const ir = buildIntermediateRepresentation({
        url: "https://example.com/",
        name: "MarketingSite",
        exportMode: "full-site",
        captureMode: "runtime-first",
        runtimeCapture: {
            ...homeCapture,
            routeCaptures: [homeCapture, pricingCapture],
        },
        pluginCapture: {
            ...createPluginCapture(),
            context: {
                exportMode: "full-site",
                captureMode: "runtime-first",
                sitePages: [
                    { id: "home", name: "Home", path: "/" },
                    { id: "pricing", title: "Pricing", slug: "pricing" },
                ],
            },
        },
        nodeMatches: createNodeMatches(),
    });
    assert.deepEqual(ir.sitePages?.map((page) => ({
        componentName: page.componentName,
        routePath: page.routePath,
        title: page.title,
    })), [
        { componentName: "Home", routePath: "/", title: "Home" },
        { componentName: "Pricing", routePath: "/pricing", title: "Pricing" },
    ]);
    assert.equal(ir.exportEngine, "published-runtime");
    assert.equal(ir.sitePages?.[0]?.exportTree?.[0]?.source.pluginNodeId, undefined);
    assert.equal(ir.sitePages?.[1]?.exportTree?.some((node) => node.id.startsWith("/pricing::")), true);
});
test("full-site capture builds each page from its own published runtime tree", async () => {
    const server = createServer((request, response) => {
        const pricing = request.url === "/pricing";
        response.setHeader("content-type", "text/html; charset=utf-8");
        response.end(`<!doctype html>
      <html>
        <head><title>${pricing ? "Pricing" : "Home"}</title></head>
        <body style="margin:0;font-family:${pricing ? "Georgia" : "Courier New"};color:#172554">
          <main style="min-height:100vh;background:${pricing ? "#fff7ed" : "#eff6ff"}">
            <section style="padding:48px">
              <h1 style="font-size:48px;color:#172554">${pricing ? "Choose a plan" : "Runtime home"}</h1>
              <p>${pricing ? "Pricing route content" : "Home route content"}</p>
            </section>
          </main>
        </body>
      </html>`);
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const workDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-route-capture-"));
    try {
        const capture = await captureRuntimeRoutes({
            originUrl: `http://127.0.0.1:${address.port}/`,
            routes: [
                { path: "/", title: "Home" },
                { path: "/pricing", title: "Pricing" },
            ],
            workDir,
        });
        assert.equal(capture.routeCaptures?.length, 2);
        assert.equal(capture.routeCaptures?.[0]?.nodes.some((node) => node.text === "Runtime home"), true);
        assert.equal(capture.routeCaptures?.[1]?.nodes.some((node) => node.text === "Choose a plan"), true);
        assert.equal(capture.routeCaptures?.[1]?.nodes.every((node) => node.id.startsWith("/pricing::")), true);
        assert.match(capture.routeCaptures?.[0]?.rootStyles?.fontFamily ?? "", /Courier New/);
        assert.match(capture.routeCaptures?.[1]?.rootStyles?.fontFamily ?? "", /Georgia/);
        assert.match(capture.routeCaptures?.[0]?.nodes.find((node) => node.tag === "main")
            ?.styles.fontFamily ?? "", /Courier New/);
        const ir = buildIntermediateRepresentation({
            url: `http://127.0.0.1:${address.port}/`,
            name: "RuntimeSite",
            exportMode: "full-site",
            captureMode: "runtime-first",
            runtimeCapture: capture,
            pluginCapture: {
                mode: "framer-plugin",
                capturedAt: "2026-06-30T00:00:00.000Z",
                selectedNodes: [],
                context: {
                    exportMode: "full-site",
                    sitePages: [
                        { name: "Home", path: "/" },
                        { name: "Pricing", path: "/pricing" },
                    ],
                },
            },
            nodeMatches: [],
        });
        assert.equal(ir.sitePages?.length, 2);
        assert.equal(flattenTree(ir.sitePages?.[0]?.exportTree ?? []).some((node) => node.text === "Runtime home"), true);
        assert.equal(flattenTree(ir.sitePages?.[1]?.exportTree ?? []).some((node) => node.text === "Choose a plan"), true);
        const projectDir = path.join(workDir, "project");
        await generateNextProject({
            ir,
            projectDir,
            strategy: {
                id: "runtime-routes",
                structuredLayout: true,
                compactSpacing: false,
                aggressiveMobileStacking: false,
                preserveImageAspectRatio: true,
            },
        });
        assert.match(await fs.readFile(path.join(projectDir, "pages", "Home.tsx"), "utf8"), /Runtime home/);
        assert.match(await fs.readFile(path.join(projectDir, "pages", "Pricing.tsx"), "utf8"), /Choose a plan/);
        assert.match(await fs.readFile(path.join(projectDir, "pages", "Home.module.css"), "utf8"), /font-family: "Courier New"/);
        assert.match(await fs.readFile(path.join(projectDir, "pages", "Pricing.module.css"), "utf8"), /font-family: Georgia/);
    }
    finally {
        await new Promise((resolve) => server.close(() => resolve()));
    }
});
test("runtime capture does not fail when a webfont never finishes loading", async () => {
    const server = createServer((request, response) => {
        if (request.url === "/blocked.woff2") {
            // Keep the response pending to reproduce Playwright's screenshot font wait.
            return;
        }
        response.setHeader("content-type", "text/html; charset=utf-8");
        response.end(`<!doctype html>
      <style>
        @font-face { font-family: Blocked; src: url("/blocked.woff2"); }
        body { font-family: Blocked, sans-serif; }
      </style>
      <main><h1>Export survives blocked fonts</h1></main>`);
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const workDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-blocked-font-capture-"));
    try {
        const capture = await captureRuntimeRoutes({
            originUrl: `http://127.0.0.1:${address.port}/`,
            routes: [{ path: "/", title: "Blocked font" }],
            workDir,
        });
        assert.equal(capture.nodes.some((node) => node.text === "Export survives blocked fonts"), true);
        assert.equal(capture.captureDiagnostics?.fontReadiness?.desktop, false);
        await fs.access(capture.viewports.desktop.screenshotPath);
    }
    finally {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(() => resolve()));
        await fs.rm(workDir, { recursive: true, force: true });
    }
});
test("runtime capture records safe interaction replay without submitting blocked actions", async () => {
    let mutationRequests = 0;
    const server = createServer((request, response) => {
        if (request.method === "POST") {
            mutationRequests += 1;
            response.statusCode = 204;
            response.end();
            return;
        }
        response.setHeader("content-type", "text/html; charset=utf-8");
        response.end(`<!doctype html>
      <html>
        <body>
          <main>
            <button
              id="toggle"
              type="button"
              aria-expanded="false"
              onclick="this.setAttribute('aria-expanded', this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'); document.getElementById('panel').textContent = this.getAttribute('aria-expanded') === 'true' ? 'Open panel' : 'Closed panel';"
            >
              Toggle panel
            </button>
            <div id="panel">Closed panel</div>
            <form method="post" action="/submit">
              <button type="submit">Submit form</button>
            </form>
          </main>
        </body>
      </html>`);
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const workDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-safe-replay-"));
    try {
        const capture = await captureRuntimeRoutes({
            originUrl: `http://127.0.0.1:${address.port}/`,
            routes: [{ path: "/", title: "Replay" }],
            workDir,
        });
        const replay = capture.routeCaptures?.[0]?.interactionReplay ?? [];
        const clickRecord = replay.find((record) => record.action === "click" &&
            record.target.text?.includes("Toggle panel"));
        const keyboardRecord = replay.find((record) => record.action === "keyboard-enter" &&
            record.target.text?.includes("Toggle panel"));
        const blockedRecord = replay.find((record) => record.action === "blocked-click" &&
            record.target.text?.includes("Submit form"));
        assert.equal(replay.length >= 3, true);
        assert.equal(clickRecord?.allowed, true);
        assert.equal(clickRecord?.stateChanged, true);
        assert.equal(clickRecord?.networkActivity.blockedMutationRequests ?? 0, 0);
        assert.equal(keyboardRecord?.allowed, true);
        assert.equal(keyboardRecord?.stateChanged, true);
        assert.equal(blockedRecord?.allowed, false);
        assert.equal(blockedRecord?.blockedReason, "inside-form");
        assert.equal(mutationRequests, 0);
        await fs.access(clickRecord?.beforeScreenshotPath ?? "");
        await fs.access(clickRecord?.afterScreenshotPath ?? "");
    }
    finally {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(() => resolve()));
        await fs.rm(workDir, { recursive: true, force: true });
    }
});
test("interaction replay timeout preserves mandatory full-site evidence", async () => {
    const server = createServer((_request, response) => {
        response.setHeader("content-type", "text/html; charset=utf-8");
        response.end(`<!doctype html>
      <html><body><main><h1>Mandatory evidence survives</h1>
      <button type="button" onclick="this.textContent = 'Changed'">Change</button>
      </main></body></html>`);
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const workDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-replay-timeout-"));
    try {
        const capture = await captureRuntimeRoutes({
            originUrl: `http://127.0.0.1:${address.port}/`,
            routes: [{ path: "/", title: "Replay timeout" }],
            workDir,
            interactionReplayTimeoutMs: 1,
        });
        await validateFullSiteCapture({ routes: [{ path: "/" }], capture });
        assert.deepEqual(capture.routeCaptures?.[0]?.interactionReplay, []);
        assert.equal(capture.nodes.some((node) => node.text === "Mandatory evidence survives"), true);
    }
    finally {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(() => resolve()));
        await fs.rm(workDir, { recursive: true, force: true });
    }
});
test("full-site capture validation requires every route and all four exact viewports", async () => {
    const workDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-full-site-evidence-"));
    const widths = { desktop: 1440, laptop: 1280, tablet: 768, mobile: 390 };
    const heights = { desktop: 900, laptop: 900, tablet: 1024, mobile: 844 };
    const viewportNames = Object.keys(widths);
    const viewports = Object.fromEntries(viewportNames.map((name) => {
        const screenshotPath = path.join(workDir, `${name}.png`);
        return [
            name,
            {
                screenshotPath,
                width: widths[name],
                height: heights[name],
                requested: { width: widths[name], height: heights[name] },
                observed: {
                    innerWidth: widths[name],
                    innerHeight: heights[name],
                    clientWidth: widths[name],
                    devicePixelRatio: 1,
                },
                valid: true,
            },
        ];
    }));
    await Promise.all(viewportNames.map((name) => fs.writeFile(viewports[name].screenshotPath, "png")));
    const capture = {
        ...createRuntimeCapture(),
        mode: "page",
        routeCaptures: [
            {
                ...createRuntimeCapture(),
                routePath: "/",
                viewports,
                captureDiagnostics: {
                    breakpointsCaptured: viewportNames,
                    viewportValidation: Object.fromEntries(viewportNames.map((name) => [
                        name,
                        {
                            requestedWidth: widths[name],
                            requestedHeight: heights[name],
                            observedInnerWidth: widths[name],
                            observedInnerHeight: heights[name],
                            observedClientWidth: widths[name],
                            screenshotWidth: widths[name],
                            screenshotHeight: heights[name],
                            valid: true,
                        },
                    ])),
                },
            },
        ],
    };
    try {
        await validateFullSiteCapture({ routes: [{ path: "/" }], capture });
        await assert.rejects(validateFullSiteCapture({ routes: [{ path: "/" }, { path: "/missing" }], capture }), /route \/missing was not captured/);
        const invalidCapture = structuredClone(capture);
        invalidCapture.routeCaptures[0].captureDiagnostics.viewportValidation.mobile.observedInnerWidth = 768;
        await assert.rejects(validateFullSiteCapture({ routes: [{ path: "/" }], capture: invalidCapture }), /duplicate observed viewport width|width mismatch/);
    }
    finally {
        await fs.rm(workDir, { recursive: true, force: true });
    }
});
test("runtime capture retries an aborted document navigation", async () => {
    let aborted = false;
    const server = createServer((request, response) => {
        if (!aborted) {
            aborted = true;
            request.socket.destroy();
            return;
        }
        response.setHeader("content-type", "text/html; charset=utf-8");
        response.end("<main><h1>Recovered navigation</h1></main>");
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const workDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-aborted-navigation-"));
    try {
        const capture = await captureRuntimeRoutes({
            originUrl: `http://127.0.0.1:${address.port}/`,
            routes: [{ path: "/", title: "Retry" }],
            workDir,
        });
        assert.equal(capture.nodes.some((node) => node.text === "Recovered navigation"), true);
    }
    finally {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(() => resolve()));
        await fs.rm(workDir, { recursive: true, force: true });
    }
});
test("full-site capture resumes completed routes from its durable cache", async () => {
    let requests = 0;
    const server = createServer((_request, response) => {
        requests += 1;
        response.setHeader("content-type", "text/html; charset=utf-8");
        response.end("<main><h1>Cached route</h1></main>");
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const parentDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-route-cache-"));
    const input = {
        originUrl: `http://127.0.0.1:${address.port}/`,
        routes: [{ path: "/", title: "Home" }],
        cacheDir: path.join(parentDir, "cache"),
    };
    try {
        const first = await captureRuntimeRoutes({
            ...input,
            workDir: path.join(parentDir, "first"),
        });
        const requestsAfterFirstCapture = requests;
        const second = await captureRuntimeRoutes({
            ...input,
            workDir: path.join(parentDir, "second"),
        });
        assert.ok(requestsAfterFirstCapture > 0);
        assert.equal(requests, requestsAfterFirstCapture);
        assert.equal(second.nodes.length, first.nodes.length);
    }
    finally {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(() => resolve()));
        await fs.rm(parentDir, { recursive: true, force: true });
    }
});
test("full-site route cache ignores legacy entries without viewport validation", async () => {
    let requests = 0;
    const server = createServer((_request, response) => {
        requests += 1;
        response.setHeader("content-type", "text/html; charset=utf-8");
        response.end("<main><h1>Fresh route</h1></main>");
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const parentDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-route-cache-legacy-"));
    const cacheDir = path.join(parentDir, "cache");
    await fs.mkdir(cacheDir, { recursive: true });
    await fs.writeFile(path.join(cacheDir, "home.json"), `${JSON.stringify({
        schemaVersion: 4,
        sourceUrl: `http://127.0.0.1:${address.port}/`,
        capture: {
            url: `http://127.0.0.1:${address.port}/`,
            title: "Legacy",
            mode: "page",
            routePath: "/",
            viewports: {
                desktop: {
                    screenshotPath: "/tmp/desktop.png",
                    width: 1440,
                    height: 900,
                },
            },
            nodes: [],
            captureDiagnostics: {
                breakpointsCaptured: ["desktop"],
            },
        },
    }, null, 2)}\n`);
    try {
        const capture = await captureRuntimeRoutes({
            originUrl: `http://127.0.0.1:${address.port}/`,
            routes: [{ path: "/", title: "Home" }],
            cacheDir,
            workDir: path.join(parentDir, "fresh"),
        });
        assert.ok(requests > 0);
        assert.equal(capture.captureDiagnostics?.viewportValidation?.desktop?.valid, true);
    }
    finally {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(() => resolve()));
        await fs.rm(parentDir, { recursive: true, force: true });
    }
});
test("external redirects bypass Trusted Types protected documents", async () => {
    const target = createServer((_request, response) => {
        response.setHeader("content-security-policy", "require-trusted-types-for 'script'");
        response.setHeader("content-type", "text/html; charset=utf-8");
        response.end("<main>Protected external destination</main>");
    });
    await new Promise((resolve) => target.listen(0, "127.0.0.1", resolve));
    const targetAddress = target.address();
    assert.ok(targetAddress && typeof targetAddress !== "string");
    const source = createServer((_request, response) => {
        response.statusCode = 302;
        response.setHeader("location", `http://127.0.0.1:${targetAddress.port}/destination`);
        response.end();
    });
    await new Promise((resolve) => source.listen(0, "127.0.0.1", resolve));
    const sourceAddress = source.address();
    assert.ok(sourceAddress && typeof sourceAddress !== "string");
    const workDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-trusted-types-redirect-"));
    try {
        const capture = await captureRuntimeRoutes({
            originUrl: `http://127.0.0.1:${sourceAddress.port}/`,
            routes: [{ path: "/", title: "Redirect" }],
            workDir,
        });
        assert.equal(capture.title, "Redirect");
        assert.equal(capture.nodes.some((node) => node.text?.startsWith("Continue to ")), true);
    }
    finally {
        source.closeAllConnections();
        target.closeAllConnections();
        await Promise.all([
            new Promise((resolve) => source.close(() => resolve())),
            new Promise((resolve) => target.close(() => resolve())),
        ]);
        await fs.rm(workDir, { recursive: true, force: true });
    }
});
function flattenTree(nodes) {
    return nodes.flatMap((node) => [node, ...flattenTree(node.children)]);
}
test("component modules with colliding generated names are deduplicated", () => {
    const pluginCapture = createPluginCapture();
    pluginCapture.context.componentModules = [
        {
            name: "FAQ",
            source: "component-node",
            insertURL: "https://framer.com/m/faq-one.js",
        },
        {
            name: "FAQ",
            source: "component-instance",
            insertURL: "https://framer.com/m/faq-two.js",
        },
        {
            name: "FAQ!",
            source: "code-file-export",
            insertURL: "https://framer.com/m/faq-three.js",
        },
    ];
    const ir = buildIntermediateRepresentation({
        url: "framer://project/collisions",
        name: "CollisionTest",
        exportMode: "components",
        runtimeCapture: createRuntimeCapture(),
        pluginCapture,
        nodeMatches: createNodeMatches(),
    });
    assert.equal(ir.componentModules?.length, 1);
    assert.equal(ir.componentModules?.[0]?.name, "FAQ");
});
test("codegen ignores non-string runtime className values", async () => {
    const runtimeCapture = createRuntimeCapture();
    runtimeCapture.nodes[0].attributes.className = [
        "invalid",
    ];
    const ir = buildIntermediateRepresentation({
        url: "https://example.com",
        name: "ClassNameGuard",
        exportMode: "selection",
        runtimeCapture,
        pluginCapture: createPluginCapture(),
        nodeMatches: createNodeMatches(),
    });
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-class-name-guard-"));
    await assert.doesNotReject(generateNextProject({
        ir,
        projectDir,
        strategy: {
            id: "semantic-layout",
            structuredLayout: false,
            compactSpacing: false,
            aggressiveMobileStacking: false,
            preserveImageAspectRatio: true,
        },
    }));
});
test("full-site page generation does not reuse the entire export tree for every page", async () => {
    const base = buildIntermediateRepresentation({
        url: "https://example.com",
        name: "ScopedSite",
        exportMode: "full-site",
        captureMode: "runtime-first",
        runtimeCapture: createRuntimeCapture(),
        pluginCapture: createPluginCapture(),
        nodeMatches: createNodeMatches(),
    });
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-scoped-pages-"));
    const pageIr = {
        ...base,
        sitePages: [
            {
                componentName: "Home",
                routePath: "/",
                title: "Home",
                nodes: [
                    {
                        ...base.component.nodes[0],
                        id: "home",
                        text: "Home only",
                    },
                ],
            },
            {
                componentName: "Pricing",
                routePath: "/pricing",
                title: "Pricing",
                nodes: [
                    {
                        ...base.component.nodes[0],
                        id: "pricing",
                        text: "Pricing only",
                    },
                ],
            },
        ],
        exportTree: [
            {
                id: "home",
                childIds: [],
                name: "Home",
                text: "Home only",
                kind: "text",
                tag: "h1",
                styles: { color: "rgb(0, 0, 0)" },
                attributes: {},
                source: {},
                children: [],
            },
            {
                id: "pricing",
                childIds: [],
                name: "Pricing",
                text: "Pricing only",
                kind: "text",
                tag: "h1",
                styles: { color: "rgb(0, 0, 0)" },
                attributes: {},
                source: {},
                children: [],
            },
        ],
    };
    await generateNextProject({
        ir: pageIr,
        projectDir,
        strategy: {
            id: "semantic-layout",
            structuredLayout: false,
            compactSpacing: false,
            aggressiveMobileStacking: false,
            preserveImageAspectRatio: true,
        },
    });
    const home = await fs.readFile(path.join(projectDir, "pages", "Home.tsx"), "utf8");
    const pricing = await fs.readFile(path.join(projectDir, "pages", "Pricing.tsx"), "utf8");
    assert.match(home, /Home only/);
    assert.doesNotMatch(home, /Pricing only/);
    assert.match(pricing, /Pricing only/);
    assert.doesNotMatch(pricing, /Home only/);
    const app = await fs.readFile(path.join(projectDir, "src", "App.tsx"), "utf8");
    assert.match(app, /lazy\(\(\) =>\s*import\('\.\.\/pages\/Home'\)/);
    assert.match(app, /lazy\(\(\) =>\s*import\('\.\.\/pages\/Pricing'\)/);
    assert.match(app, /<Suspense/);
    assert.doesNotMatch(app, /import \{ Home \} from/);
    assert.deepEqual(await fs.readdir(path.join(projectDir, "framer-modules")), []);
    assert.deepEqual(JSON.parse(await fs.readFile(path.join(projectDir, "framer-component-modules.json"), "utf8")), pageIr.componentModules ?? []);
});
test("full-site app generation includes redirect route handling", async () => {
    const base = buildIntermediateRepresentation({
        url: "https://example.com",
        name: "RedirectSite",
        exportMode: "full-site",
        captureMode: "runtime-first",
        runtimeCapture: createRuntimeCapture(),
        pluginCapture: createPluginCapture(),
        nodeMatches: createNodeMatches(),
    });
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-redirect-pages-"));
    const pageIr = {
        ...base,
        sitePages: [
            {
                componentName: "Home",
                routePath: "/",
                title: "Home",
                templateId: "/",
                templatePath: "/",
                templateKind: "static",
                nodes: [
                    {
                        ...base.component.nodes[0],
                        id: "home",
                        text: "Home only",
                    },
                ],
            },
            {
                componentName: "Twitter",
                routePath: "/twitter",
                title: "Twitter",
                templateId: "/twitter",
                templatePath: "/twitter",
                templateKind: "utility",
                redirectTo: "https://twitter.com/coderelay",
                redirectStatus: 302,
                nodes: [
                    {
                        ...base.component.nodes[0],
                        id: "twitter",
                        text: "Twitter redirect",
                    },
                ],
            },
            {
                componentName: "DocsRedirect",
                routePath: "/docs",
                title: "Docs",
                templateId: "/docs",
                templatePath: "/docs",
                templateKind: "redirect",
                redirectTo: "/learn",
                redirectStatus: 302,
                nodes: [
                    {
                        ...base.component.nodes[0],
                        id: "docs",
                        text: "Docs redirect",
                    },
                ],
            },
        ],
    };
    await generateNextProject({
        ir: pageIr,
        projectDir,
        strategy: {
            id: "runtime-routes",
            structuredLayout: true,
            compactSpacing: false,
            aggressiveMobileStacking: false,
            preserveImageAspectRatio: true,
        },
    });
    const app = await fs.readFile(path.join(projectDir, "src", "App.tsx"), "utf8");
    const routeManifest = JSON.parse(await fs.readFile(path.join(projectDir, "route-manifest.json"), "utf8"));
    assert.match(app, /redirectTo/);
    assert.match(app, /window\.location\.replace/);
    assert.match(app, /navigateTo\(currentPage\.redirectTo, \{ replace: true \}\)/);
    assert.match(app, /Redirecting…/);
    assert.equal(routeManifest[1]?.templateKind, "utility");
    assert.equal(routeManifest[1]?.redirectTo, "https://twitter.com/coderelay");
    assert.equal(routeManifest[2]?.templateKind, "redirect");
    assert.equal(routeManifest[2]?.redirectTo, "/learn");
});
test("full-site page generation shares template modules for repeated template groups", async () => {
    const base = buildIntermediateRepresentation({
        url: "https://example.com",
        name: "SharedTemplateSite",
        exportMode: "full-site",
        captureMode: "runtime-first",
        runtimeCapture: createRuntimeCapture(),
        pluginCapture: createPluginCapture(),
        nodeMatches: createNodeMatches(),
    });
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-shared-template-pages-"));
    const sharedTree = (text) => [
        {
            id: `route-${text}`,
            childIds: ["shared-heading"],
            name: "Page",
            text: undefined,
            kind: "frame",
            tag: "section",
            styles: { display: "grid", gap: "16px" },
            attributes: {},
            source: { pluginNodeId: "shared-root" },
            children: [
                {
                    id: `heading-${text}`,
                    childIds: [],
                    name: "Heading",
                    text,
                    kind: "text",
                    tag: "h1",
                    styles: { color: "rgb(0, 0, 0)" },
                    attributes: {},
                    source: { pluginNodeId: "shared-heading" },
                    children: [],
                },
            ],
        },
    ];
    const pageIr = {
        ...base,
        sitePages: [
            {
                componentName: "PostAlpha",
                routePath: "/blog/alpha",
                title: "Alpha",
                nodes: [{ ...base.component.nodes[0], id: "alpha", text: "Alpha" }],
                exportTree: sharedTree("Alpha only"),
                templateId: "/blog/:slug",
                templatePath: "/blog/:slug",
                templateKind: "cms",
            },
            {
                componentName: "PostBeta",
                routePath: "/blog/beta",
                title: "Beta",
                nodes: [{ ...base.component.nodes[0], id: "beta", text: "Beta" }],
                exportTree: sharedTree("Beta only"),
                templateId: "/blog/:slug",
                templatePath: "/blog/:slug",
                templateKind: "cms",
            },
        ],
        routeTemplates: [
            {
                templateId: "/blog/:slug",
                templatePath: "/blog/:slug",
                templateKind: "cms",
                representativeRoutePath: "/blog/alpha",
                routePaths: ["/blog/alpha", "/blog/beta"],
                routeCount: 2,
                sourceTextLength: 16,
                nodeCount: 2,
            },
        ],
        exportTree: sharedTree("Alpha only"),
    };
    await generateNextProject({
        ir: pageIr,
        projectDir,
        strategy: {
            id: "shared-template",
            structuredLayout: false,
            compactSpacing: false,
            aggressiveMobileStacking: false,
            preserveImageAspectRatio: true,
        },
    });
    const templateFiles = await fs.readdir(path.join(projectDir, "templates"));
    const templateModule = await fs.readFile(path.join(projectDir, "templates", "PostAlphaTemplate.tsx"), "utf8");
    const alphaPage = await fs.readFile(path.join(projectDir, "pages", "PostAlpha.tsx"), "utf8");
    const betaPage = await fs.readFile(path.join(projectDir, "pages", "PostBeta.tsx"), "utf8");
    const alphaData = await fs.readFile(path.join(projectDir, "src", "framer-data", "routes", "PostAlphaRouteData.ts"), "utf8");
    const betaData = await fs.readFile(path.join(projectDir, "src", "framer-data", "routes", "PostBetaRouteData.ts"), "utf8");
    assert.ok(templateFiles.includes("PostAlphaTemplate.tsx"));
    assert.match(templateModule, /FramerRouteTemplateRuntime/);
    assert.match(alphaPage, /PostAlphaTemplate/);
    assert.match(betaPage, /PostAlphaTemplate/);
    assert.match(alphaData, /Alpha only/);
    assert.match(betaData, /Beta only/);
});
test("shared route templates preserve component family mounts inside route runtime data", async () => {
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-shared-template-family-"));
    const base = buildIntermediateRepresentation({
        url: "https://example.com",
        name: "FamilyTemplatePage",
        exportMode: "full-site",
        runtimeCapture: createRuntimeCapture(),
        pluginCapture: createPluginCapture(),
        nodeMatches: [],
    });
    const routeTree = [
        {
            id: "button-instance-1",
            parentId: undefined,
            childIds: [],
            name: "Button",
            kind: "component",
            tag: "section",
            styles: {},
            attributes: {
                dataFramerName: "Button",
            },
            source: {
                pluginNodeId: "button-instance-1",
            },
            children: [],
        },
    ];
    const pageIr = {
        ...base,
        componentFamilies: [
            {
                id: "Button",
                name: "Button",
                primaryVariantId: "button-default",
                variants: [
                    {
                        id: "button-default",
                        name: "Button / Default",
                        variantName: "Default",
                    },
                ],
                instances: [
                    {
                        nodeId: "button-instance-1",
                        initialVariantId: "button-default",
                    },
                ],
                transitions: [],
                provenance: "plugin",
            },
        ],
        sitePages: [
            {
                componentName: "FamilyAlpha",
                routePath: "/family/alpha",
                title: "Family Alpha",
                nodes: [{ ...base.component.nodes[0], id: "family-alpha", text: "Family Alpha" }],
                exportTree: routeTree,
                templateId: "/family/:slug",
                templatePath: "/family/:slug",
                templateKind: "cms",
            },
            {
                componentName: "FamilyBeta",
                routePath: "/family/beta",
                title: "Family Beta",
                nodes: [{ ...base.component.nodes[0], id: "family-beta", text: "Family Beta" }],
                exportTree: routeTree,
                templateId: "/family/:slug",
                templatePath: "/family/:slug",
                templateKind: "cms",
            },
        ],
        routeTemplates: [
            {
                templateId: "/family/:slug",
                templatePath: "/family/:slug",
                templateKind: "cms",
                representativeRoutePath: "/family/alpha",
                routePaths: ["/family/alpha", "/family/beta"],
                routeCount: 2,
                sourceTextLength: 22,
                nodeCount: 1,
            },
        ],
        exportTree: routeTree,
    };
    await generateNextProject({
        ir: pageIr,
        projectDir,
        strategy: {
            id: "shared-template-family",
            structuredLayout: false,
            compactSpacing: false,
            aggressiveMobileStacking: false,
            preserveImageAspectRatio: true,
        },
    });
    const templateRuntime = await fs.readFile(path.join(projectDir, "src", "framer-data", "route-template-runtime.tsx"), "utf8");
    const alphaData = await fs.readFile(path.join(projectDir, "src", "framer-data", "routes", "FamilyAlphaRouteData.ts"), "utf8");
    assert.match(templateRuntime, /FramerComponentFamilyStateMachine/);
    assert.match(templateRuntime, /placement="route"/);
    assert.match(alphaData, /componentFamilyId/);
    assert.match(alphaData, /Button/);
    assert.match(alphaData, /button-default/);
});
test("full-site page generation keeps inline component-family imports on page components", async () => {
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-family-page-import-"));
    const base = buildIntermediateRepresentation({
        url: "https://example.com",
        name: "FamilyPage",
        exportMode: "full-site",
        runtimeCapture: createRuntimeCapture(),
        pluginCapture: createPluginCapture(),
        nodeMatches: [],
    });
    const routeTree = [
        {
            id: "button-instance-1",
            parentId: undefined,
            childIds: [],
            name: "Button",
            kind: "component",
            tag: "section",
            styles: {},
            attributes: {
                dataFramerName: "Button",
            },
            source: {
                pluginNodeId: "button-instance-1",
            },
            children: [],
        },
    ];
    const pageIr = {
        ...base,
        componentFamilies: [
            {
                id: "Button",
                name: "Button",
                primaryVariantId: "button-default",
                variants: [
                    {
                        id: "button-default",
                        name: "Button / Default",
                        variantName: "Default",
                    },
                ],
                instances: [
                    {
                        nodeId: "button-instance-1",
                        initialVariantId: "button-default",
                    },
                ],
                transitions: [],
                provenance: "plugin",
            },
        ],
        sitePages: [
            {
                componentName: "About",
                routePath: "/about",
                title: "About",
                nodes: [{ ...base.component.nodes[0], id: "about", text: "About" }],
                exportTree: routeTree,
            },
        ],
        routeTemplates: [
            {
                templateId: "/about",
                templatePath: "/about",
                templateKind: "static",
                representativeRoutePath: "/about",
                routePaths: ["/about"],
                routeCount: 1,
                sourceTextLength: 5,
                nodeCount: 1,
            },
        ],
        exportTree: routeTree,
    };
    await generateNextProject({
        ir: pageIr,
        projectDir,
        strategy: {
            id: "family-page-import",
            structuredLayout: false,
            compactSpacing: false,
            aggressiveMobileStacking: false,
            preserveImageAspectRatio: true,
        },
    });
    const aboutPage = await fs.readFile(path.join(projectDir, "pages", "About.tsx"), "utf8");
    assert.match(aboutPage, /FramerComponentFamilyStateMachine/);
    assert.match(aboutPage, /familyId="Button"/);
    assert.match(aboutPage, /placement="route"/);
});
test("generateNextProject writes non-empty css and imports it from the component", async () => {
    const ir = buildIntermediateRepresentation({
        url: "framer://project/styled-smoke",
        name: "StyledCard",
        exportMode: "selection",
        runtimeCapture: createRuntimeCapture(),
        pluginCapture: createPluginCapture(),
        nodeMatches: createNodeMatches(),
    });
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-export-test-"));
    await generateNextProject({
        ir,
        projectDir,
        strategy: {
            id: "semantic-layout",
            structuredLayout: false,
            compactSpacing: false,
            aggressiveMobileStacking: false,
            preserveImageAspectRatio: true,
        },
    });
    const componentPath = path.join(projectDir, "components", "StyledCard.tsx");
    const cssPath = path.join(projectDir, "components", "StyledCard.module.css");
    const dtsPath = path.join(projectDir, "components", "StyledCard.d.ts");
    const previewHtmlPath = path.join(projectDir, "preview.html");
    const exportTreePath = path.join(projectDir, "export-tree.json");
    const motionManifestPath = path.join(projectDir, "motion-manifest.json");
    const assetManifestPath = path.join(projectDir, "asset-manifest.json");
    const codeFilesPath = path.join(projectDir, "framer-code-files.json");
    const fontsPath = path.join(projectDir, "framer-fonts.json");
    const cmsCollectionsPath = path.join(projectDir, "framer-cms-collections.json");
    const appPath = path.join(projectDir, "src", "App.tsx");
    const framerDataIndexPath = path.join(projectDir, "src", "framer-data", "index.ts");
    const framerDataCmsPath = path.join(projectDir, "src", "framer-data", "cms.ts");
    const framerDataCmsRuntimePath = path.join(projectDir, "src", "framer-data", "cms-runtime.tsx");
    const framerDataCmsSectionsPath = path.join(projectDir, "src", "framer-data", "cms-sections.tsx");
    const framerDataCodeFilesPath = path.join(projectDir, "src", "framer-data", "code-files.ts");
    const framerDataCodeFilesRuntimePath = path.join(projectDir, "src", "framer-data", "code-files-runtime.tsx");
    const framerDataFontsPath = path.join(projectDir, "src", "framer-data", "fonts.ts");
    const framerDataModulesPath = path.join(projectDir, "src", "framer-data", "component-modules.ts");
    const framerDataRegistryPath = path.join(projectDir, "src", "framer-data", "component-registry.ts");
    const framerDataComponentRuntimePath = path.join(projectDir, "src", "framer-data", "component-runtime.tsx");
    const compareDiagnosticsPath = path.join(projectDir, "..", "compare-diagnostics.json");
    const component = await fs.readFile(componentPath, "utf8");
    const css = await fs.readFile(cssPath, "utf8");
    const dts = await fs.readFile(dtsPath, "utf8");
    const previewHtml = await fs.readFile(previewHtmlPath, "utf8");
    const exportTree = await fs.readFile(exportTreePath, "utf8");
    const motionManifest = await fs.readFile(motionManifestPath, "utf8");
    const assetManifest = await fs.readFile(assetManifestPath, "utf8");
    const codeFiles = await fs.readFile(codeFilesPath, "utf8");
    const fonts = await fs.readFile(fontsPath, "utf8");
    const cmsCollections = await fs.readFile(cmsCollectionsPath, "utf8");
    const app = await fs.readFile(appPath, "utf8");
    const framerDataIndex = await fs.readFile(framerDataIndexPath, "utf8");
    const framerDataCms = await fs.readFile(framerDataCmsPath, "utf8");
    const framerDataCmsRuntime = await fs.readFile(framerDataCmsRuntimePath, "utf8");
    const framerDataCmsSections = await fs.readFile(framerDataCmsSectionsPath, "utf8");
    const framerDataCodeFiles = await fs.readFile(framerDataCodeFilesPath, "utf8");
    const framerDataCodeFilesRuntime = await fs.readFile(framerDataCodeFilesRuntimePath, "utf8");
    const framerDataFonts = await fs.readFile(framerDataFontsPath, "utf8");
    const framerDataModules = await fs.readFile(framerDataModulesPath, "utf8");
    const framerDataRegistry = await fs.readFile(framerDataRegistryPath, "utf8");
    const framerDataComponentRuntime = await fs.readFile(framerDataComponentRuntimePath, "utf8");
    assert.match(component, /import styles from '\.\/StyledCard\.module\.css'/);
    assert.doesNotMatch(component, /FramerCmsAutoSections/);
    assert.doesNotMatch(component, /FramerComponentRegistryPreview/);
    assert.doesNotMatch(component, /FramerCodeFileList/);
    assert.match(component, /className=\{\[styles\.surface, styles\.nodeRoot\]\.join\(' '\)\}/);
    assert.match(component, /className=\{\[styles\.heading, styles\.nodeHeading\]\.join\(' '\)\}/);
    assert.match(component, /className=\{\[styles\.body, styles\.nodeBody\]\.join\(' '\)\}/);
    assert.doesNotMatch(component, /includeCmsSections/);
    assert.doesNotMatch(component, /includeFramerRegistry/);
    assert.doesNotMatch(component, /includeFramerCodeFiles/);
    assert.doesNotMatch(component, /__coderelay/);
    assert.ok(component.indexOf("styles.nodeRoot") <
        component.indexOf("styles.nodeHeading"));
    assert.ok(component.indexOf("styles.nodeHeading") <
        component.indexOf("styles.nodeBody"));
    assert.ok(css.trim().length > 0);
    assert.match(css, /\.surface\s*\{/);
    assert.match(css, /\.heading\s*,/);
    assert.match(css, /\.nodeRoot\s*\{/);
    assert.match(css, /\.nodeHeading\s*\{/);
    assert.match(css, /padding:\s*32px;/);
    assert.match(css, /font-size:\s*42px;/);
    assert.match(css, /transition-property:\s*transform, opacity;/);
    assert.match(css, /transition-duration:\s*0\.3s;/);
    assert.match(css, /\.nodeHeading:hover\s*\{/);
    assert.match(css, /transform:\s*translateY\(-2px\);/);
    assert.match(css, /\.nodeHeading:focus-visible\s*\{/);
    assert.match(css, /@media \(min-width:\s*391px\) and \(max-width:\s*768px\)/);
    assert.match(css, /font-size:\s*36px;/);
    assert.match(css, /transition-duration:\s*0\.24s;/);
    assert.match(css, /@media \(min-width:\s*769px\) and \(max-width:\s*1280px\)/);
    assert.match(css, /@media \(max-width:\s*390px\)/);
    assert.match(css, /font-size:\s*30px;/);
    assert.match(css, /transition-duration:\s*0\.2s;/);
    assert.doesNotMatch(dts, /includeCmsSections/);
    assert.doesNotMatch(dts, /includeFramerRegistry/);
    assert.doesNotMatch(dts, /includeFramerCodeFiles/);
    assert.match(exportTree, /"pluginNodeId": "root"/);
    assert.match(exportTree, /"runtimeNodeId": "heading"/);
    assert.match(motionManifest, /"nodeCount": 1/);
    assert.match(motionManifest, /"transitionProperty": "transform, opacity"/);
    assert.match(motionManifest, /"interactionStyles"/);
    assert.match(assetManifest, /"runtimeAssets"/);
    assert.match(assetManifest, /"https:\/\/example.com\/cover.png"/);
    assert.match(codeFiles, /"name": "Hero\.tsx"/);
    assert.match(codeFiles, /"exports": \[/);
    assert.match(fonts, /"family": "Inter"/);
    assert.match(cmsCollections, /"name": "Blog Posts"/);
    assert.match(cmsCollections, /"pluginDataKeys": \[/);
    assert.match(cmsCollections, /"pluginData": \{/);
    assert.doesNotMatch(app, /FramerCmsAutoSections/);
    assert.doesNotMatch(app, /FramerComponentRegistryPreview/);
    assert.match(app, /FramerCodeFileList/);
    assert.match(previewHtml, /Framer CMS/);
    assert.match(previewHtml, /Blog Posts/);
    assert.match(previewHtml, /Hello world/);
    assert.match(previewHtml, /Framer registry/);
    assert.match(previewHtml, /Hero Module/);
    assert.match(previewHtml, /Framer code files/);
    assert.match(previewHtml, /Hero\.tsx/);
    assert.match(framerDataIndex, /export const framerDataSummary =/);
    assert.match(framerDataIndex, /cmsCollectionCount: 1/);
    assert.match(framerDataIndex, /FramerCmsCollectionList/);
    assert.match(framerDataIndex, /FramerCmsImage/);
    assert.match(framerDataIndex, /FramerCmsField/);
    assert.match(framerDataIndex, /FramerCmsCollectionPreview/);
    assert.match(framerDataIndex, /FramerCmsAutoSections/);
    assert.match(framerDataIndex, /framerCmsSectionRegistry/);
    assert.match(framerDataIndex, /resolveFramerCmsFieldEntry/);
    assert.match(framerDataIndex, /framerComponentRegistry/);
    assert.match(framerDataCms, /export const framerCmsCollections =/);
    assert.match(framerDataCms, /getFramerCmsCollectionByName/);
    assert.match(framerDataCmsRuntime, /export function getFramerCmsItems/);
    assert.match(framerDataCmsRuntime, /export function resolveFramerCmsFieldEntry/);
    assert.match(framerDataCmsRuntime, /export function getFramerCmsPlainText/);
    assert.match(framerDataCmsRuntime, /export function getFramerCmsDisplayValue/);
    assert.match(framerDataCmsRuntime, /export function getFramerCmsImageUrl/);
    assert.match(framerDataCmsRuntime, /export function getFramerCmsLinkHref/);
    assert.match(framerDataCmsRuntime, /export function FramerCmsCollectionList/);
    assert.match(framerDataCmsRuntime, /export function FramerCmsField/);
    assert.match(framerDataCmsRuntime, /export function FramerCmsCollectionPreview/);
    assert.match(framerDataCmsRuntime, /export function FramerCmsText/);
    assert.match(framerDataCmsRuntime, /export function FramerCmsRichText/);
    assert.match(framerDataCmsRuntime, /export function FramerCmsImage/);
    assert.match(framerDataCmsRuntime, /export function FramerCmsLink/);
    assert.match(framerDataCmsRuntime, /alt\?: string/);
    assert.match(framerDataCmsRuntime, /useFramerCmsCollection/);
    assert.match(framerDataCmsSections, /export function BlogPostsCollectionSection/);
    assert.match(framerDataCmsSections, /export const framerCmsSectionRegistry =/);
    assert.match(framerDataCmsSections, /export function FramerCmsAutoSections/);
    assert.match(framerDataCmsSections, /FramerCmsCollectionList/);
    assert.match(framerDataCodeFiles, /export const framerCodeFiles(?::\s*ReadonlyArray<FramerCodeFileMeta>)?\s*=/);
    assert.match(framerDataCodeFiles, /getFramerCodeFileByName/);
    assert.match(framerDataCodeFilesRuntime, /export function FramerCodeFilePreview/);
    assert.match(framerDataCodeFilesRuntime, /export function FramerCodeFileList/);
    assert.match(framerDataFonts, /export const framerFonts =/);
    assert.match(framerDataFonts, /getFramerFontByFamily/);
    assert.match(framerDataFonts, /framerFontFamilies/);
    assert.match(framerDataModules, /export const framerComponentModules =/);
    assert.match(framerDataModules, /getFramerComponentModuleByName/);
    assert.match(framerDataRegistry, /export const framerComponentRegistry =/);
    assert.match(framerDataRegistry, /export type FramerComponentRegistryEntry =/);
    assert.match(framerDataRegistry, /satisfies Record<string, FramerComponentRegistryEntry>/);
    assert.match(framerDataRegistry, /getFramerRegisteredComponent\([\s\S]*name: string,[\s\S]*\): FramerComponentRegistryEntry \| undefined/);
    assert.match(framerDataRegistry, /getFramerRegisteredComponent/);
    assert.match(framerDataComponentRuntime, /export function FramerRegisteredComponentPreview/);
    assert.match(framerDataComponentRuntime, /export function FramerComponentRegistryPreview/);
    assert.match(framerDataComponentRuntime, /Object\.entries\(framerComponentRegistry\) as Array<\s+\[string, FramerComponentRegistryEntry\]\s+>/s);
    await fs.access(compareDiagnosticsPath).catch(() => {
        // compare diagnostics are only generated in full compare runs, not direct codegen-only regression checks
    });
});
test("generateNextProject keeps link-field label inference type-safe in cms sections", async () => {
    const ir = buildIntermediateRepresentation({
        url: "framer://project/cms-link-fixture",
        name: "CmsLinkFixture",
        exportMode: "selection",
        runtimeCapture: createRuntimeCapture(),
        pluginCapture: createPluginCapture(),
        nodeMatches: createNodeMatches(),
    });
    ir.cmsCollections = [
        {
            id: "collection-link",
            name: "Link Posts",
            managed: true,
            fields: [
                { id: "title", name: "Title", type: "string" },
                { id: "link", name: "Link", type: "link" },
                { id: "cover", name: "Cover", type: "image" },
            ],
            items: [
                {
                    id: "post-1",
                    fieldKeys: ["title", "link", "cover"],
                    fieldData: {
                        title: { type: "string", value: "Link item" },
                        link: { type: "link", value: "https://example.com/link-item" },
                        cover: { type: "image", value: "https://example.com/cover.png" },
                    },
                },
            ],
        },
    ];
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-cms-link-fixture-"));
    await generateNextProject({
        ir,
        projectDir,
        strategy: {
            id: "cms-link-fixture",
            structuredLayout: false,
            compactSpacing: false,
            aggressiveMobileStacking: false,
            preserveImageAspectRatio: true,
        },
    });
    const framerDataCmsRuntime = await fs.readFile(path.join(projectDir, "src", "framer-data", "cms-runtime.tsx"), "utf8");
    const framerDataCmsSections = await fs.readFile(path.join(projectDir, "src", "framer-data", "cms-sections.tsx"), "utf8");
    assert.match(framerDataCmsRuntime, /alt\?: string/);
    assert.match(framerDataCmsSections, /FramerCmsField/);
    assert.match(framerDataCmsSections, /FramerCmsLink/);
});
test("generateNextProject surfaces unadapted code-file fallbacks in framer data previews", async () => {
    const ir = buildIntermediateRepresentation({
        url: "framer://project/code-file-fallback",
        name: "CodeFileFallback",
        exportMode: "selection",
        runtimeCapture: createRuntimeCapture(),
        pluginCapture: createPluginCapture(),
        nodeMatches: createNodeMatches(),
    });
    ir.codeFiles = [
        {
            id: "code-file-unsupported",
            name: "Unsupported.tsx",
            path: "code/Unsupported.tsx",
            source: "framer",
            content: 'import Card from "@/components/ui/card"; export function Unsupported(){ return <Card /> }',
            contentHash: "unsupportedhash",
            contentByteLength: 88,
            hasContent: true,
            exports: ["Unsupported"],
            exportDetails: [{ name: "Unsupported", type: "component" }],
        },
    ];
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-code-file-fallback-"));
    await generateNextProject({
        ir,
        projectDir,
        strategy: {
            id: "code-file-fallback",
            structuredLayout: false,
            compactSpacing: false,
            aggressiveMobileStacking: false,
            preserveImageAspectRatio: true,
        },
        codeCompatibilityReport: {
            files: [
                {
                    codeFileId: "code-file-unsupported",
                    name: "Unsupported.tsx",
                    path: "code/Unsupported.tsx",
                    compatibility: "unsupported",
                    reasons: ["uses-unresolved-project-aliases"],
                    dependencyNames: [],
                },
            ],
        },
        unadaptedCodeFiles: [
            {
                codeFileId: "code-file-unsupported",
                name: "Unsupported.tsx",
                compatibility: "unsupported",
                reasons: ["uses-unresolved-project-aliases"],
                sourcePath: "unadapted-components/unsupportedhash.tsx",
                metadataPath: "unadapted-components/unsupportedhash.json",
            },
        ],
    });
    const framerDataCodeFiles = await fs.readFile(path.join(projectDir, "src", "framer-data", "code-files.ts"), "utf8");
    const framerDataCodeFilesRuntime = await fs.readFile(path.join(projectDir, "src", "framer-data", "code-files-runtime.tsx"), "utf8");
    assert.match(framerDataCodeFiles, /compatibility: 'unsupported'/);
    assert.match(framerDataCodeFiles, /unadapted-components\/unsupportedhash\.tsx/);
    assert.match(framerDataCodeFilesRuntime, /This Framer code file could not be adapted automatically\./);
    assert.match(framerDataCodeFilesRuntime, /data-framer-code-file-fallback-path=/);
});
test("generateNextProject adapts portable code-file components into executable previews", async () => {
    const ir = buildIntermediateRepresentation({
        url: "framer://project/code-file-adapter",
        name: "CodeFileAdapter",
        exportMode: "selection",
        runtimeCapture: createRuntimeCapture(),
        pluginCapture: createPluginCapture(),
        nodeMatches: createNodeMatches(),
    });
    ir.codeFiles = [
        {
            id: "code-file-adapter",
            name: "Hero.tsx",
            path: "code/Hero.tsx",
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
            exports: ["Hero"],
            exportDetails: [{ name: "Hero", type: "component" }],
        },
    ];
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-code-file-adapter-"));
    await generateNextProject({
        ir,
        projectDir,
        strategy: {
            id: "code-file-adapter",
            structuredLayout: false,
            compactSpacing: false,
            aggressiveMobileStacking: false,
            preserveImageAspectRatio: true,
        },
        codeCompatibilityReport: {
            files: [
                {
                    codeFileId: "code-file-adapter",
                    name: "Hero.tsx",
                    path: "code/Hero.tsx",
                    compatibility: "portable-with-adapter",
                    reasons: ["uses-rendertarget", "uses-property-controls"],
                    dependencyNames: [],
                    exportedComponents: ["Hero"],
                    localComponentImports: [],
                    cssImports: [],
                },
            ],
        },
    });
    const adapterRuntime = await fs.readFile(path.join(projectDir, "src", "framer-data", "framer-adapter.tsx"), "utf8");
    const executablesRuntime = await fs.readFile(path.join(projectDir, "src", "framer-data", "code-file-executables.tsx"), "utf8");
    const adaptedFile = await fs.readFile(path.join(projectDir, "src", "framer-generated-code", "code", "Hero.tsx"), "utf8");
    const codeFilesRuntime = await fs.readFile(path.join(projectDir, "src", "framer-data", "code-files-runtime.tsx"), "utf8");
    const packageJson = await fs.readFile(path.join(projectDir, "package.json"), "utf8");
    assert.match(adapterRuntime, /export const RenderTarget =/);
    assert.match(adapterRuntime, /export function addPropertyControls/);
    assert.match(executablesRuntime, /FramerExecutableCodeFilePreview/);
    assert.match(executablesRuntime, /FramerAdapterProvider target="preview"/);
    assert.match(executablesRuntime, /'Hero\.tsx'/);
    assert.match(executablesRuntime, /exportName: 'Hero'/);
    assert.match(adaptedFile, /from '\.\.\/\.\.\/framer-data\/framer-adapter'/);
    assert.match(adaptedFile, /data-render-target/);
    assert.match(codeFilesRuntime, /Executable preview:/);
    assert.match(codeFilesRuntime, /FramerExecutableCodeFilePreview/);
    assert.match(packageJson, /"framer-motion"/);
});
test("generateNextProject adapts local code-file import chains and writes dependency license reports", async () => {
    const ir = buildIntermediateRepresentation({
        url: "framer://project/code-file-local-imports",
        name: "CodeFileLocalImports",
        exportMode: "selection",
        runtimeCapture: createRuntimeCapture(),
        pluginCapture: createPluginCapture(),
        nodeMatches: createNodeMatches(),
    });
    ir.codeFiles = [
        {
            id: "code-file-hero-local",
            name: "Hero.tsx",
            path: "code/Hero.tsx",
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
            exports: ["Hero"],
            exportDetails: [{ name: "Hero", type: "component" }],
        },
        {
            id: "code-file-card-local",
            name: "Card.tsx",
            path: "code/Card.tsx",
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
            exports: ["Card"],
            exportDetails: [{ name: "Card", type: "component" }],
        },
    ];
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-code-file-local-imports-"));
    await generateNextProject({
        ir,
        projectDir,
        strategy: {
            id: "code-file-local-imports",
            structuredLayout: false,
            compactSpacing: false,
            aggressiveMobileStacking: false,
            preserveImageAspectRatio: true,
        },
        codeCompatibilityReport: {
            files: [
                {
                    codeFileId: "code-file-hero-local",
                    name: "Hero.tsx",
                    path: "code/Hero.tsx",
                    compatibility: "portable-with-dependencies",
                    reasons: ["uses-external-npm-dependencies"],
                    dependencyNames: ["clsx"],
                    exportedComponents: ["Hero"],
                    localComponentImports: ["./Card"],
                    cssImports: [],
                },
                {
                    codeFileId: "code-file-card-local",
                    name: "Card.tsx",
                    path: "code/Card.tsx",
                    compatibility: "portable",
                    reasons: [],
                    dependencyNames: [],
                    exportedComponents: ["Card"],
                    localComponentImports: [],
                    cssImports: [],
                },
            ],
        },
    });
    const heroFile = await fs.readFile(path.join(projectDir, "src", "framer-generated-code", "code", "Hero.tsx"), "utf8");
    const cardFile = await fs.readFile(path.join(projectDir, "src", "framer-generated-code", "code", "Card.tsx"), "utf8");
    const packageJson = await fs.readFile(path.join(projectDir, "package.json"), "utf8");
    const dependencyLicenseReport = await fs.readFile(path.join(projectDir, "dependency-license-report.json"), "utf8");
    assert.match(heroFile, /from 'clsx'/);
    assert.match(heroFile, /from '\.\/Card'/);
    assert.match(cardFile, /data-card-wrapper/);
    assert.match(packageJson, /"clsx": "2\.1\.1"/);
    assert.match(dependencyLicenseReport, /"name": "clsx"/);
    assert.match(dependencyLicenseReport, /"license": "MIT"/);
});
test("generateNextProject emits component family runtime modules and preview hooks", async () => {
    const ir = buildIntermediateRepresentation({
        url: "framer://project/component-family-smoke",
        name: "FamilyCard",
        exportMode: "selection",
        runtimeCapture: createRuntimeCapture(),
        pluginCapture: createPluginCapture(),
        nodeMatches: createNodeMatches(),
    });
    ir.componentFamilies = [
        {
            id: "Button",
            name: "Button",
            primaryVariantId: "button-default",
            variants: [
                {
                    id: "button-default",
                    name: "Button / Default",
                    gesture: "click",
                    variantName: "Default",
                },
                {
                    id: "button-open",
                    name: "Button / Open",
                    inheritsFromId: "button-default",
                    gesture: "click",
                    variantName: "Open",
                },
            ],
            instances: [
                {
                    nodeId: "button-instance-1",
                    controls: { label: "Open menu" },
                    initialVariantId: "button-default",
                },
            ],
            transitions: [
                {
                    fromVariantId: "button-default",
                    toVariantId: "button-open",
                    trigger: "click",
                    confidence: 0.72,
                    provenance: "plugin",
                },
            ],
            provenance: "plugin",
        },
    ];
    ir.exportTree = [
        {
            id: "button-instance-1",
            parentId: undefined,
            childIds: [],
            name: "Button",
            kind: "component",
            tag: "section",
            styles: {},
            attributes: {
                dataFramerName: "Button",
            },
            source: {
                pluginNodeId: "button-instance-1",
            },
            children: [],
        },
    ];
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-component-family-"));
    await generateNextProject({
        ir,
        projectDir,
        strategy: {
            id: "semantic-layout",
            structuredLayout: false,
            compactSpacing: false,
            aggressiveMobileStacking: false,
            preserveImageAspectRatio: true,
        },
    });
    const componentPath = path.join(projectDir, "components", "FamilyCard.tsx");
    const dtsPath = path.join(projectDir, "components", "FamilyCard.d.ts");
    const appPath = path.join(projectDir, "src", "App.tsx");
    const framerDataIndexPath = path.join(projectDir, "src", "framer-data", "index.ts");
    const familiesDataPath = path.join(projectDir, "src", "framer-data", "component-families.ts");
    const familiesRuntimePath = path.join(projectDir, "src", "framer-data", "component-families-runtime.tsx");
    const component = await fs.readFile(componentPath, "utf8");
    const dts = await fs.readFile(dtsPath, "utf8");
    const app = await fs.readFile(appPath, "utf8");
    const framerDataIndex = await fs.readFile(framerDataIndexPath, "utf8");
    const familiesData = await fs.readFile(familiesDataPath, "utf8");
    const familiesRuntime = await fs.readFile(familiesRuntimePath, "utf8");
    assert.doesNotMatch(component, /FramerComponentFamilyGallery/);
    assert.doesNotMatch(dts, /includeFramerComponentFamilies\?: boolean/);
    assert.match(component, /FramerComponentFamilyStateMachine/);
    assert.match(component, /familyId="Button"/);
    assert.match(component, /placement="route"/);
    assert.match(app, /FramerComponentFamilyGallery/);
    assert.match(app, /Component families/);
    assert.match(app, /Framer variant state/);
    assert.match(familiesData, /export const framerComponentFamilies: ReadonlyArray<FramerComponentFamilyMeta> =/);
    assert.match(familiesData, /button-open/);
    assert.match(familiesRuntime, /FramerComponentFamilyStateMachine/);
    assert.match(familiesRuntime, /React\.useState/);
    assert.match(familiesRuntime, /Current variant:/);
    assert.match(familiesRuntime, /labelForTrigger/);
    assert.match(familiesRuntime, /Click/);
    assert.match(familiesRuntime, /data-framer-current-variant=/);
    assert.match(familiesRuntime, /data-framer-variant-button=/);
    assert.match(familiesRuntime, /data-framer-component-family-placement=/);
    assert.match(familiesRuntime, /data-framer-transition-trigger=/);
    assert.match(familiesRuntime, /data-framer-transition-target=/);
    assert.match(framerDataIndex, /FramerComponentFamilyGallery,\s+FramerComponentFamilyStateMachine,\s+hasFramerComponentFamilies/s);
});
test("tree codegen preserves nested rich-text children", async () => {
    const ir = buildIntermediateRepresentation({
        url: "https://example.com",
        name: "NestedText",
        exportMode: "selection",
        runtimeCapture: createRuntimeCapture(),
        pluginCapture: createPluginCapture(),
        nodeMatches: [],
    });
    ir.exportTree = [
        {
            id: "heading",
            childIds: ["accent"],
            kind: "text",
            tag: "h1",
            styles: {},
            attributes: {},
            source: {},
            children: [
                {
                    id: "accent",
                    parentId: "heading",
                    childIds: [],
                    text: "nested Framer text",
                    kind: "text",
                    tag: "span",
                    styles: {},
                    attributes: {},
                    source: {},
                    children: [],
                },
            ],
        },
    ];
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-nested-text-"));
    await generateNextProject({
        ir,
        projectDir,
        strategy: {
            id: "nested-text",
            structuredLayout: true,
            compactSpacing: false,
            aggressiveMobileStacking: false,
            preserveImageAspectRatio: true,
        },
    });
    const component = await fs.readFile(path.join(projectDir, "components", "NestedText.tsx"), "utf8");
    assert.match(component, /<h1[^>]*>\s*<span[^>]*>/s);
    assert.match(component, /nested Framer text/);
    assert.match(component, /<\/span>\s*<\/h1>/s);
});
test("generateNextProject drops inherited stylesheet text instead of emitting invalid JSX text", async () => {
    const runtimeCapture = createRuntimeCapture();
    runtimeCapture.nodes = runtimeCapture.nodes.map((node) => node.id === "body"
        ? {
            ...node,
            text: "html body { background: rgb(255, 255, 255); }",
        }
        : node);
    const ir = buildIntermediateRepresentation({
        url: "https://talktoaugust.com/",
        name: "August",
        exportMode: "selection",
        captureMode: "runtime-first",
        runtimeCapture,
        pluginCapture: createPluginCapture(),
        nodeMatches: createNodeMatches(),
    });
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-brace-text-test-"));
    await generateNextProject({
        ir,
        projectDir,
        strategy: {
            id: "semantic-layout",
            structuredLayout: false,
            compactSpacing: false,
            aggressiveMobileStacking: false,
            preserveImageAspectRatio: true,
        },
    });
    const componentPath = path.join(projectDir, "components", "August.tsx");
    const component = await fs.readFile(componentPath, "utf8");
    assert.doesNotMatch(component, /html body \{ background: rgb\(255, 255, 255\); \}/);
    assert.match(component, /\{'This should carry color and typography into TSX\.'\}/);
});
test("generateNextProject emits inline style fallback for forced export-tree nodes", async () => {
    const baseIr = buildIntermediateRepresentation({
        url: "framer://project/styled-smoke",
        name: "StyledCard",
        exportMode: "selection",
        runtimeCapture: createRuntimeCapture(),
        pluginCapture: createPluginCapture(),
        nodeMatches: createNodeMatches(),
    });
    const ir = {
        ...baseIr,
        exportTree: baseIr.exportTree?.map((node) => node.id === "root"
            ? {
                ...node,
                attributes: {
                    ...node.attributes,
                    dataCoderelayForceInlineStyles: true,
                },
            }
            : node),
    };
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-inline-fallback-test-"));
    await generateNextProject({
        ir,
        projectDir,
        strategy: {
            id: "semantic-layout",
            structuredLayout: false,
            compactSpacing: false,
            aggressiveMobileStacking: false,
            preserveImageAspectRatio: true,
        },
    });
    const componentPath = path.join(projectDir, "components", "StyledCard.tsx");
    const previewHtmlPath = path.join(projectDir, "preview.html");
    const component = await fs.readFile(componentPath, "utf8");
    const previewHtml = await fs.readFile(previewHtmlPath, "utf8");
    assert.match(component, /backgroundColor: '#101828'/);
    assert.match(component, /borderRadius: '24px'/);
    assert.match(previewHtml, /background-color:#101828/i);
    assert.match(previewHtml, /border-radius:24px/i);
});
test("generateNextProject bounds viewport override media queries to their breakpoint range", async () => {
    const ir = buildIntermediateRepresentation({
        url: "framer://project/styled-smoke",
        name: "StyledCard",
        exportMode: "selection",
        runtimeCapture: createRuntimeCapture(),
        pluginCapture: createPluginCapture(),
        nodeMatches: createNodeMatches(),
    });
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-viewport-range-test-"));
    await generateNextProject({
        ir,
        projectDir,
        strategy: {
            id: "semantic-layout",
            structuredLayout: false,
            compactSpacing: false,
            aggressiveMobileStacking: false,
            preserveImageAspectRatio: true,
        },
    });
    const cssPath = path.join(projectDir, "components", "StyledCard.module.css");
    const css = await fs.readFile(cssPath, "utf8");
    assert.match(css, /@media \(min-width: 769px\) and \(max-width: 1280px\)/);
    assert.match(css, /@media \(min-width: 391px\) and \(max-width: 768px\)/);
    assert.match(css, /@media \(max-width: 390px\)/);
});
test("generated preview applies non-default computed styles to exported nodes", async (t) => {
    const ir = buildIntermediateRepresentation({
        url: "framer://project/styled-smoke",
        name: "StyledCard",
        exportMode: "selection",
        runtimeCapture: createRuntimeCapture(),
        pluginCapture: createPluginCapture(),
        nodeMatches: createNodeMatches(),
    });
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-preview-style-test-"));
    const generated = await generateNextProject({
        ir,
        projectDir,
        strategy: {
            id: "semantic-layout",
            structuredLayout: false,
            compactSpacing: false,
            aggressiveMobileStacking: false,
            preserveImageAspectRatio: true,
        },
    });
    let inspectedNodes;
    try {
        inspectedNodes = await inspectGeneratedPreviewNodes({
            previewHtmlPath: generated.previewHtmlPath,
            viewport: "desktop",
            nodeClasses: [
                { nodeId: "root", className: "nodeRoot" },
                { nodeId: "heading", className: "nodeHeading" },
                { nodeId: "body", className: "nodeBody" },
            ],
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const sandboxBlocked = message.includes("browserType.launch") ||
            message.includes("bootstrap_check_in") ||
            message.includes("Permission denied (1100)");
        if (sandboxBlocked) {
            t.skip("Playwright preview smoke is blocked by the current sandbox");
            return;
        }
        throw error;
    }
    const root = inspectedNodes.find((node) => node.nodeId === "root");
    const heading = inspectedNodes.find((node) => node.nodeId === "heading");
    const body = inspectedNodes.find((node) => node.nodeId === "body");
    assert.equal(root?.found, true);
    assert.equal(heading?.found, true);
    assert.equal(body?.found, true);
    assert.equal(root?.styles?.backgroundColor, "rgb(16, 24, 40)");
    assert.equal(root?.styles?.borderRadius, "24px");
    assert.equal(root?.styles?.padding, "32px");
    assert.equal(heading?.styles?.fontSize, "42px");
    assert.equal(heading?.styles?.lineHeight, "48px");
    assert.equal(heading?.styles?.fontWeight, "800");
    assert.equal(heading?.styles?.color, "rgb(249, 250, 251)");
    assert.equal(heading?.styles?.transitionDuration, "0.3s");
    assert.equal(body?.styles?.fontSize, "18px");
    assert.equal(body?.styles?.lineHeight, "28px");
    assert.equal(body?.styles?.color, "rgb(208, 213, 221)");
});
