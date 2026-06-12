import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { buildIntermediateRepresentation } from "./ir.js";
import { generateNextProject } from "../../codegen/src/next-project.js";
import { inspectGeneratedPreviewNodes } from "../../fidelity/src/compare.js";
import type {
  NodeMatch,
  PluginCanvasCapture,
  RuntimeCapture,
} from "../../shared/src/types.js";

function createPluginCapture(): PluginCanvasCapture {
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

function createRuntimeCapture(): RuntimeCapture {
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

function createNodeMatches(): NodeMatch[] {
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
  assert.equal(
    ir.component.nodes.some((node) => node.tag === "h1" && node.text === "Styled export"),
    true,
  );
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

test("generateNextProject writes non-empty css and imports it from the component", async () => {
  const ir = buildIntermediateRepresentation({
    url: "framer://project/styled-smoke",
    name: "StyledCard",
    exportMode: "selection",
    runtimeCapture: createRuntimeCapture(),
    pluginCapture: createPluginCapture(),
    nodeMatches: createNodeMatches(),
  });
  const projectDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "coderelay-export-test-"),
  );

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
  assert.match(component, /import \{ FramerCmsAutoSections \} from '\.\.\/src\/framer-data\/cms-sections'/);
  assert.match(component, /FramerComponentRegistryPreview/);
  assert.match(component, /FramerCodeFileList/);
  assert.match(component, /from '\.\.\/src\/framer-data'/);
  assert.match(component, /className=\{\[styles\.surface, styles\.nodeRoot\]\.join\(' '\)\}/);
  assert.match(component, /className=\{\[styles\.heading, styles\.nodeHeading\]\.join\(' '\)\}/);
  assert.match(component, /className=\{\[styles\.body, styles\.nodeBody\]\.join\(' '\)\}/);
  assert.match(component, /includeCmsSections !== false/);
  assert.match(component, /includeFramerRegistry !== false/);
  assert.match(component, /includeFramerCodeFiles !== false/);
  assert.doesNotMatch(component, /__coderelay/);
  assert.ok(
    component.indexOf("styles.nodeRoot") <
      component.indexOf("styles.nodeHeading"),
  );
  assert.ok(
    component.indexOf("styles.nodeHeading") <
      component.indexOf("styles.nodeBody"),
  );
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
  assert.match(dts, /includeCmsSections\?: boolean/);
  assert.match(dts, /includeFramerRegistry\?: boolean/);
  assert.match(dts, /includeFramerCodeFiles\?: boolean/);
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
  assert.match(app, /FramerCmsAutoSections/);
  assert.match(app, /Collection-bound preview/);
  assert.match(app, /FramerComponentRegistryPreview/);
  assert.match(app, /Registered component preview/);
  assert.match(app, /FramerCodeFileList/);
  assert.match(app, /Code file preview/);
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
  assert.match(framerDataCmsRuntime, /useFramerCmsCollection/);
  assert.match(framerDataCmsSections, /export function BlogPostsCollectionSection/);
  assert.match(framerDataCmsSections, /export const framerCmsSectionRegistry =/);
  assert.match(framerDataCmsSections, /export function FramerCmsAutoSections/);
  assert.match(framerDataCmsSections, /FramerCmsCollectionList/);
  assert.match(framerDataCodeFiles, /export const framerCodeFiles =/);
  assert.match(framerDataCodeFiles, /getFramerCodeFileByName/);
  assert.match(framerDataCodeFilesRuntime, /export function FramerCodeFilePreview/);
  assert.match(framerDataCodeFilesRuntime, /export function FramerCodeFileList/);
  assert.match(framerDataFonts, /export const framerFonts =/);
  assert.match(framerDataFonts, /getFramerFontByFamily/);
  assert.match(framerDataFonts, /framerFontFamilies/);
  assert.match(framerDataModules, /export const framerComponentModules =/);
  assert.match(framerDataModules, /getFramerComponentModuleByName/);
  assert.match(framerDataRegistry, /export const framerComponentRegistry =/);
  assert.match(framerDataRegistry, /getFramerRegisteredComponent/);
  assert.match(framerDataComponentRuntime, /export function FramerRegisteredComponentPreview/);
  assert.match(framerDataComponentRuntime, /export function FramerComponentRegistryPreview/);
  await fs.access(compareDiagnosticsPath).catch(() => {
    // compare diagnostics are only generated in full compare runs, not direct codegen-only regression checks
  });
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
    exportTree: baseIr.exportTree?.map((node) =>
      node.id === "root"
        ? {
            ...node,
            attributes: {
              ...node.attributes,
              dataCoderelayForceInlineStyles: true,
            },
          }
        : node,
    ),
  };
  const projectDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "coderelay-inline-fallback-test-"),
  );

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
  const projectDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "coderelay-viewport-range-test-"),
  );

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
  const projectDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "coderelay-preview-style-test-"),
  );

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
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const sandboxBlocked =
      message.includes("browserType.launch") ||
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
