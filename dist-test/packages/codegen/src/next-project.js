import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import prettier from "prettier";
import { resolveExportRouteMetadata } from "../../shared/src/route-contract.js";
const SUPPORTED_CODE_FILE_DEPENDENCIES = {
    clsx: {
        version: "2.1.1",
        license: "MIT",
    },
    "framer-motion": {
        version: "12.42.0",
        license: "MIT",
    },
};
export const generatedProjectVersions = {
    framerMotion: "12.42.0",
    react: "19.2.7",
    reactDom: "19.2.7",
    typesReact: "19.2.17",
    typesReactDom: "19.2.3",
    vite: "8.1.0",
    viteReact: "6.0.3",
    typescript: "6.0.3",
};
function isExecutableCodeCompatibility(value) {
    return (value === "portable" ||
        value === "portable-with-adapter" ||
        value === "portable-with-dependencies");
}
function normalizeCodeFileCandidatePath(file) {
    const raw = file.path?.trim() || file.name.trim();
    const normalized = raw.replace(/\\/g, "/").replace(/^\.?\//, "");
    return normalized || file.name.trim();
}
function stripKnownCodeExtension(value) {
    return value.replace(/\.(tsx?|jsx?)$/i, "");
}
function defaultGeneratedCodeFilePath(file) {
    const normalized = normalizeCodeFileCandidatePath(file);
    if (/\.(tsx?|jsx?)$/i.test(normalized)) {
        return normalized;
    }
    return `${normalized}.tsx`;
}
function resolveLocalCodeImportPath(importer, specifier) {
    if (!specifier.startsWith("./") && !specifier.startsWith("../")) {
        return "";
    }
    const importerPath = defaultGeneratedCodeFilePath(importer);
    const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(importerPath), specifier));
    return stripKnownCodeExtension(resolved);
}
function pickExecutableCodeFileExport(file, report) {
    const componentDetails = (file.exportDetails ?? []).filter((detail) => detail?.type === "component" && typeof detail.name === "string");
    if (componentDetails.length > 0) {
        return componentDetails[0]?.name ?? "";
    }
    const reported = report.exportedComponents?.find((entry) => /^[A-Z]/.test(entry));
    if (reported)
        return reported;
    return (file.exports ?? []).find((entry) => /^[A-Z]/.test(entry)) ?? "";
}
function isSupportedCodeFileDependency(name) {
    return Object.prototype.hasOwnProperty.call(SUPPORTED_CODE_FILE_DEPENDENCIES, name);
}
function resolveExecutableCodeFiles(input) {
    const compatibilityFiles = input.codeCompatibilityReport?.files ?? [];
    const files = input.ir.codeFiles ?? [];
    const baseCandidates = files
        .map((file) => {
        const report = compatibilityFiles.find((entry) => entry.codeFileId === file.id ||
            entry.path === file.path ||
            entry.name === file.name) ?? null;
        if (!report || !file.content)
            return null;
        if (!isExecutableCodeCompatibility(report.compatibility)) {
            return null;
        }
        if ((report.cssImports?.length ?? 0) > 0)
            return null;
        if ((report.dependencyNames ?? []).some((dependency) => !isSupportedCodeFileDependency(dependency))) {
            return null;
        }
        const exportName = pickExecutableCodeFileExport(file, report);
        if (!exportName)
            return null;
        const compatibility = report.compatibility;
        return {
            file,
            report,
            exportName,
            compatibility,
        };
    })
        .filter((entry) => Boolean(entry));
    const byNormalizedPath = new Map(baseCandidates.map((entry) => [
        stripKnownCodeExtension(defaultGeneratedCodeFilePath(entry.file)),
        entry,
    ]));
    let filtered = baseCandidates;
    let changed = true;
    while (changed) {
        changed = false;
        const next = filtered.filter((entry) => {
            const imports = entry.report.localComponentImports ?? [];
            if (imports.length === 0)
                return true;
            if (!entry.file.path)
                return false;
            return imports.every((specifier) => {
                const resolved = resolveLocalCodeImportPath(entry.file, specifier);
                return resolved.length > 0 && filtered.some((candidate) => {
                    const candidatePath = stripKnownCodeExtension(defaultGeneratedCodeFilePath(candidate.file));
                    return candidatePath === resolved;
                });
            });
        });
        if (next.length !== filtered.length) {
            filtered = next;
            changed = true;
        }
    }
    return filtered.map((entry) => {
        const generatedSourcePath = path.posix.join("src", "framer-generated-code", defaultGeneratedCodeFilePath(entry.file));
        return {
            ...entry,
            generatedSourcePath,
            importPathFromFramerData: toPosixModulePath(path.posix.relative(path.posix.join("src", "framer-data"), stripKnownCodeExtension(generatedSourcePath))),
        };
    });
}
function toPosixModulePath(value) {
    const normalized = value.replace(/\\/g, "/");
    return normalized.startsWith(".") ? normalized : `./${normalized}`;
}
function rewriteCodeFileSource(source, adapterImportPath) {
    return source
        .replace(/\bfrom\s+(['"])framer\1/g, `from '${adapterImportPath}'`)
        .replace(/\bimport\s*\(\s*(['"])framer\1\s*\)/g, `import('${adapterImportPath}')`);
}
export async function generateNextProject(input) {
    const componentDir = path.join(input.projectDir, "components");
    const moduleDir = path.join(input.projectDir, "framer-modules");
    const pageDir = path.join(input.projectDir, "pages");
    const templateDir = path.join(input.projectDir, "templates");
    const srcDir = path.join(input.projectDir, "src");
    const framerDataDir = path.join(srcDir, "framer-data");
    const routeDataDir = path.join(framerDataDir, "routes");
    await mkdir(componentDir, { recursive: true });
    await mkdir(moduleDir, { recursive: true });
    await mkdir(pageDir, { recursive: true });
    await mkdir(templateDir, { recursive: true });
    await mkdir(srcDir, { recursive: true });
    await mkdir(framerDataDir, { recursive: true });
    await mkdir(routeDataDir, { recursive: true });
    const componentPath = path.join(componentDir, `${input.ir.componentName}.tsx`);
    const cssPath = path.join(componentDir, `${input.ir.componentName}.module.css`);
    const dtsPath = path.join(componentDir, `${input.ir.componentName}.d.ts`);
    const previewHtmlPath = path.join(input.projectDir, "preview.html");
    const isLibrary = Array.isArray(input.ir.libraryComponents) &&
        input.ir.libraryComponents.length > 0;
    const sitePages = Array.isArray(input.ir.sitePages)
        ? input.ir.sitePages.map((entry) => deriveIrForComponent(input.ir, entry.componentName, entry.nodes, entry.exportTree, entry.routePath))
        : [];
    const isFullSite = input.ir.exportMode === "full-site" && sitePages.length > 0;
    const templateGroups = isFullSite
        ? buildTemplateGroups(input.ir, sitePages)
        : [];
    const diagnosticSitePage = (() => {
        if (!isFullSite)
            return [];
        const primaryIndex = input.ir.sitePages?.findIndex((page) => page.routePath === "/");
        return [
            sitePages[typeof primaryIndex === "number" && primaryIndex >= 0
                ? primaryIndex
                : 0],
        ];
    })();
    const entries = isLibrary
        ? input.ir.libraryComponents.map((entry) => deriveIrForComponent(input.ir, entry.componentName, entry.nodes))
        : [input.ir];
    const componentEntries = isFullSite && !isLibrary ? [] : entries;
    const componentModules = Array.isArray(input.ir.componentModules)
        ? input.ir.componentModules
        : [];
    const runtimeComponentModules = isFullSite ? [] : componentModules;
    const routeTemplateHasComponentFamilies = sitePages.some((entry) => hasInlineComponentFamilyMount(entry));
    await writeFile(path.join(input.projectDir, "framer-component-modules.json"), `${JSON.stringify(componentModules, null, 2)}\n`);
    await writeFile(path.join(input.projectDir, "framer-code-files.json"), `${JSON.stringify(input.ir.codeFiles ?? [], null, 2)}\n`);
    await writeFile(path.join(input.projectDir, "framer-fonts.json"), `${JSON.stringify(input.ir.fonts ?? [], null, 2)}\n`);
    await writeFile(path.join(input.projectDir, "framer-cms-collections.json"), `${JSON.stringify(input.ir.cmsCollections ?? [], null, 2)}\n`);
    await writeFile(path.join(input.projectDir, "framer-tree.json"), `${JSON.stringify(input.ir.framerTree ?? [], null, 2)}\n`);
    await writeFile(path.join(input.projectDir, "export-tree.json"), `${JSON.stringify(input.ir.exportTree ?? [], null, 2)}\n`);
    await writeFile(path.join(input.projectDir, "motion-manifest.json"), `${JSON.stringify(createMotionManifest(input.ir), null, 2)}\n`);
    await writeFile(path.join(input.projectDir, "asset-manifest.json"), `${JSON.stringify(createAssetManifest(input.ir), null, 2)}\n`);
    await writeFile(path.join(input.projectDir, "runtime-strategy-manifest.json"), `${JSON.stringify(createRuntimeStrategyManifest(input.ir), null, 2)}\n`);
    await writeFile(path.join(input.projectDir, "agent-handoff-manifest.json"), `${JSON.stringify(createAgentHandoffManifest(input.ir), null, 2)}\n`);
    await writeFile(path.join(input.projectDir, "route-manifest.json"), `${JSON.stringify((input.ir.sitePages ?? []).map((page) => {
        const routeMetadata = resolveExportRouteMetadata(page);
        return {
            componentName: page.componentName,
            path: page.routePath,
            title: page.title,
            routeKind: routeMetadata.routeKind,
            templateId: page.templateId ?? page.routePath,
            templatePath: page.templatePath ?? page.routePath,
            template: page.template ?? null,
            templateKind: routeMetadata.templateKind ?? page.templateKind ?? "static",
            destination: routeMetadata.destination ?? null,
            destinationKind: routeMetadata.destinationKind ?? null,
            redirectTo: routeMetadata.redirectTo ?? null,
            redirectStatus: routeMetadata.redirectStatus ?? null,
            sourceTextLength: page.sourceTextLength ?? 0,
            sourceNodeCount: page.exportTree
                ? countExportTreeNodes(page.exportTree)
                : page.nodes.length,
        };
    }), null, 2)}\n`);
    await writeFile(path.join(input.projectDir, "route-template-manifest.json"), `${JSON.stringify(input.ir.routeTemplates ?? [], null, 2)}\n`);
    for (const module of runtimeComponentModules) {
        const modulePath = path.join(moduleDir, `${toSafeIdentifier(module.name)}Remote.tsx`);
        await writeFile(modulePath, await formatTsx(createRemoteModuleWrapper(module), "typescript"));
    }
    for (const entry of componentEntries) {
        const entryComponentPath = path.join(componentDir, `${entry.componentName}.tsx`);
        const entryCssPath = path.join(componentDir, `${entry.componentName}.module.css`);
        const entryDtsPath = path.join(componentDir, `${entry.componentName}.d.ts`);
        const component = await formatTsx(createComponent(entry, { includeDataPreviews: false }), "typescript");
        const css = createCss(entry, input.strategy);
        await writeFile(entryComponentPath, component);
        await writeFile(entryCssPath, css);
        await writeFile(entryDtsPath, createDts(entry, false));
    }
    for (const entry of sitePages) {
        const templateGroup = templateGroups.find((group) => group.memberPages.some((page) => page.componentName === entry.componentName));
        if (templateGroup && templateGroup.isShared) {
            const routeDataName = `${entry.componentName}RouteData`;
            const routeDataPath = path.join(routeDataDir, `${routeDataName}.ts`);
            const routePagePath = path.join(pageDir, `${entry.componentName}.tsx`);
            await writeFile(routeDataPath, await formatTsx(createRouteDataModule(routeDataName, entry), "typescript"));
            await writeFile(routePagePath, await formatTsx(createSharedTemplateRoutePage({
                pageComponentName: entry.componentName,
                templateComponentName: templateGroup.templateComponentName,
                routeDataImportName: routeDataName,
            }), "typescript"));
            continue;
        }
        const entryComponentPath = path.join(pageDir, `${entry.componentName}.tsx`);
        const entryCssPath = path.join(pageDir, `${entry.componentName}.module.css`);
        const entryDtsPath = path.join(pageDir, `${entry.componentName}.d.ts`);
        const pageComponent = await formatTsx(createComponent(entry, {
            cssImportPath: `./${entry.componentName}.module.css`,
            includeDataPreviews: false,
        }), "typescript");
        await writeFile(entryComponentPath, pageComponent);
        await writeFile(entryCssPath, createCss(entry, input.strategy));
        await writeFile(entryDtsPath, createDts(entry, false));
    }
    for (const group of templateGroups.filter((candidate) => candidate.isShared)) {
        const templateComponentPath = path.join(templateDir, `${group.templateComponentName}.tsx`);
        const templateCssPath = path.join(templateDir, `${group.templateComponentName}.module.css`);
        const templateDtsPath = path.join(templateDir, `${group.templateComponentName}.d.ts`);
        await writeFile(templateComponentPath, await formatTsx(createSharedTemplateComponent(group.representativePage, group.templateComponentName), "typescript"));
        await writeFile(templateCssPath, createCss(group.representativePage, input.strategy));
        await writeFile(templateDtsPath, createSharedTemplateDts(group.templateComponentName));
    }
    const app = await formatTsx(isFullSite
        ? createViteSiteApp(input.ir, sitePages)
        : createViteApp(entries, input.ir.exportMode === "selection" ? "selection" : "components", componentModules, (input.ir.codeFiles?.length ?? 0) > 0), "typescript");
    const framerStyleCss = input.ir.runtimeCapture.framerStyleCss?.trim() ?? "";
    const main = await formatTsx(createViteMain(Boolean(framerStyleCss)), "typescript");
    const globalCss = createGlobalCss();
    const executableCodeFiles = resolveExecutableCodeFiles({
        ir: input.ir,
        codeCompatibilityReport: input.codeCompatibilityReport,
    });
    const packageJson = `${JSON.stringify(createPackageJson(input.ir, executableCodeFiles), null, 2)}\n`;
    const tsconfig = `${JSON.stringify(createTsConfig(), null, 2)}\n`;
    await writeFile(path.join(srcDir, "App.tsx"), app);
    await writeFile(path.join(framerDataDir, "component-modules.ts"), await formatTsx(createComponentModulesDataModule(componentModules), "typescript"));
    await writeFile(path.join(framerDataDir, "component-registry.ts"), await formatTsx(createComponentRegistryModule(runtimeComponentModules), "typescript"));
    await writeFile(path.join(framerDataDir, "component-runtime.tsx"), await formatTsx(createComponentRuntimeModule(runtimeComponentModules), "typescript"));
    await writeFile(path.join(framerDataDir, "component-families.ts"), await formatTsx(createComponentFamiliesDataModule(input.ir), "typescript"));
    await writeFile(path.join(framerDataDir, "component-families-runtime.tsx"), await formatTsx(createComponentFamiliesRuntimeModule(input.ir), "typescript"));
    await writeFile(path.join(framerDataDir, "framer-adapter.tsx"), await formatTsx(createFramerAdapterModule(), "typescript"));
    await writeFile(path.join(framerDataDir, "code-files.ts"), await formatTsx(createCodeFilesDataModule(input.ir, input.codeCompatibilityReport, input.unadaptedCodeFiles), "typescript"));
    await writeFile(path.join(framerDataDir, "code-file-executables.tsx"), await formatTsx(createCodeFileExecutablesModule(executableCodeFiles), "typescript"));
    await writeFile(path.join(framerDataDir, "code-files-runtime.tsx"), await formatTsx(createCodeFilesRuntimeModule(input.ir, executableCodeFiles), "typescript"));
    await writeFile(path.join(framerDataDir, "fonts.ts"), await formatTsx(createFontsDataModule(input.ir), "typescript"));
    await writeFile(path.join(framerDataDir, "cms.ts"), await formatTsx(createCmsDataModule(input.ir), "typescript"));
    await writeFile(path.join(framerDataDir, "cms-runtime.tsx"), await formatTsx(createCmsRuntimeModule(input.ir), "typescript"));
    await writeFile(path.join(framerDataDir, "cms-sections.tsx"), await formatTsx(createCmsSectionsModule(input.ir), "typescript"));
    await writeFile(path.join(framerDataDir, "index.ts"), await formatTsx(createFramerDataIndexModule(input.ir), "typescript"));
    await writeFile(path.join(framerDataDir, "route-template-runtime.tsx"), await formatTsx(createRouteTemplateRuntimeModule(routeTemplateHasComponentFamilies), "typescript"));
    await writeFile(path.join(srcDir, "main.tsx"), main);
    await writeFile(path.join(srcDir, "styles.css"), globalCss);
    for (const executable of executableCodeFiles) {
        const targetPath = path.join(input.projectDir, executable.generatedSourcePath.replace(/^src\//, "src/"));
        await mkdir(path.dirname(targetPath), { recursive: true });
        const adapterImportPath = toPosixModulePath(path.posix.relative(path.posix.dirname(executable.generatedSourcePath), path.posix.join("src", "framer-data", "framer-adapter")));
        await writeFile(targetPath, await formatTsx(rewriteCodeFileSource(executable.file.content ?? "", adapterImportPath), "typescript"));
    }
    const dependencyLicenseReport = createDependencyLicenseReport(executableCodeFiles);
    await writeFile(path.join(input.projectDir, "dependency-license-report.json"), `${JSON.stringify(dependencyLicenseReport, null, 2)}\n`);
    if (framerStyleCss) {
        await writeFile(path.join(srcDir, "framer-styles.css"), framerStyleCss);
    }
    await writeFile(path.join(srcDir, "vite-env.d.ts"), createViteEnv());
    await writeFile(path.join(input.projectDir, "index.html"), createIndexHtml(input.ir));
    await writeFile(path.join(input.projectDir, "package.json"), packageJson);
    await writeFile(path.join(input.projectDir, "tsconfig.json"), tsconfig);
    await writeFile(path.join(input.projectDir, "vite.config.ts"), createViteConfig());
    await writeFile(previewHtmlPath, isFullSite
        ? createMultiEntryPreviewHtml(input.ir, diagnosticSitePage, input.strategy, "Page")
        : isLibrary
            ? createMultiEntryPreviewHtml(input.ir, entries, input.strategy, "Component")
            : createPreviewHtml(input.ir, createCss(input.ir, input.strategy)));
    return {
        projectDir: input.projectDir,
        componentPath,
        cssPath,
        dtsPath,
        previewHtmlPath,
    };
}
function countExportTreeNodes(nodes) {
    return nodes.reduce((total, node) => total + 1 + countExportTreeNodes(node.children), 0);
}
function buildTemplateGroups(base, pages) {
    const grouped = new Map();
    for (const page of pages) {
        const sitePageRecord = findSitePageRecord(base, page.componentName);
        const templateId = sitePageRecord?.templateId ??
            sitePageRecord?.routePath ??
            page.componentName;
        grouped.set(templateId, [...(grouped.get(templateId) ?? []), page]);
    }
    const templateManifest = new Map((base.routeTemplates ?? []).map((template) => [template.templateId, template]));
    const usedNames = new Map();
    return [...grouped.entries()].map(([templateId, memberPages]) => {
        const manifest = templateManifest.get(templateId);
        const representativePage = memberPages.find((page) => findSitePageRecord(base, page.componentName)?.routePath ===
            manifest?.representativeRoutePath) ?? memberPages[0];
        const baseName = `${representativePage.componentName}Template`;
        const deduped = usedNames.get(baseName) ?? 0;
        usedNames.set(baseName, deduped + 1);
        return {
            templateId,
            templateComponentName: deduped === 0 ? baseName : `${baseName}${deduped + 1}`,
            representativePage,
            memberPages,
            isShared: memberPages.length > 1,
        };
    });
}
function findSitePageRecord(base, componentName) {
    return base.sitePages?.find((page) => page.componentName === componentName);
}
function deriveIrForComponent(base, componentName, nodes, runtimeExportTree, routePath) {
    const exportTree = runtimeExportTree ??
        (base.exportMode === "full-site"
            ? undefined
            : scopeExportTreeToNodes(base.exportTree, nodes));
    return {
        ...base,
        componentName,
        runtimeCapture: routePath
            ? base.runtimeCapture.routeCaptures?.find((capture) => capture.routePath === routePath) ?? base.runtimeCapture
            : base.runtimeCapture,
        exportTree,
        component: {
            semanticType: base.component.semanticType,
            nodes,
            sections: [
                {
                    index: 0,
                    name: componentName,
                    kind: "content",
                    confidence: 1,
                    nodes,
                },
            ],
        },
    };
}
function createRouteDataModule(routeDataName, entry) {
    const exportTree = sanitizeRouteTemplateTree(entry.exportTree ?? [], entry);
    return `export const ${routeDataName} = ${JSON.stringify({
        sourceUrl: entry.sourceUrl,
        exportTree,
    }, null, 2)} as const
`;
}
function normalizeFamilyLookupKey(value) {
    return typeof value === "string" && value.trim()
        ? value.trim().toLowerCase()
        : "";
}
function resolveComponentFamilyMount(node, ir) {
    const families = ir.componentFamilies ?? [];
    if (families.length === 0)
        return undefined;
    const pluginNodeId = node.source.pluginNodeId;
    const runtimeNodeId = node.source.runtimeNodeId;
    const directFamily = families.find((family) => family.instances.some((instance) => instance.nodeId === pluginNodeId ||
        instance.nodeId === runtimeNodeId ||
        instance.nodeId === node.id));
    if (directFamily) {
        const instance = directFamily.instances.find((entry) => entry.nodeId === pluginNodeId ||
            entry.nodeId === runtimeNodeId ||
            entry.nodeId === node.id);
        return {
            familyId: directFamily.id,
            familyName: directFamily.name,
            initialVariantId: instance?.initialVariantId ?? directFamily.primaryVariantId,
        };
    }
    const lookup = new Set([
        node.name,
        typeof node.attributes.dataFramerName === "string"
            ? node.attributes.dataFramerName
            : undefined,
    ]
        .map(normalizeFamilyLookupKey)
        .filter(Boolean));
    if (lookup.size === 0)
        return undefined;
    const matchedFamily = families.find((family) => {
        const candidates = [
            family.id,
            family.name,
            ...family.variants.map((variant) => variant.name),
            ...family.variants
                .map((variant) => variant.variantName)
                .filter((value) => typeof value === "string"),
        ]
            .map(normalizeFamilyLookupKey)
            .filter(Boolean);
        return candidates.some((candidate) => lookup.has(candidate));
    });
    if (!matchedFamily)
        return undefined;
    return {
        familyId: matchedFamily.id,
        familyName: matchedFamily.name,
        initialVariantId: matchedFamily.primaryVariantId,
    };
}
function treeNodeHasComponentFamilyMount(node, ir) {
    if (resolveComponentFamilyMount(node, ir))
        return true;
    return node.children.some((child) => treeNodeHasComponentFamilyMount(child, ir));
}
function hasInlineComponentFamilyMount(ir) {
    return (ir.exportTree ?? []).some((node) => treeNodeHasComponentFamilyMount(node, ir));
}
function sanitizeRouteTemplateTree(nodes, ir) {
    return nodes.map((node) => {
        const familyMount = ir ? resolveComponentFamilyMount(node, ir) : undefined;
        return {
            id: node.id,
            classKey: treeNodeClass(node),
            tag: node.tag,
            text: node.text,
            kind: node.kind,
            componentFamilyId: familyMount?.familyId,
            componentFamilyName: familyMount?.familyName,
            componentFamilyInitialVariantId: familyMount?.initialVariantId,
            attributes: {
                src: node.attributes.src,
                href: node.attributes.href,
                alt: node.attributes.alt,
                role: node.attributes.role,
                className: typeof node.attributes.className === "string"
                    ? node.attributes.className
                    : undefined,
                dataFramerName: typeof node.attributes.dataFramerName === "string"
                    ? node.attributes.dataFramerName
                    : undefined,
            },
            inlineStyle: Object.fromEntries(treeInlineStyleEntries(node)),
            children: sanitizeRouteTemplateTree(node.children, ir),
        };
    });
}
function createSharedTemplateRoutePage(input) {
    return `import { ${input.templateComponentName} } from '../templates/${input.templateComponentName}'
import { ${input.routeDataImportName} } from '../src/framer-data/routes/${input.routeDataImportName}'

export function ${input.pageComponentName}() {
  return <${input.templateComponentName} pageData={${input.routeDataImportName}} />
}
`;
}
function createSharedTemplateComponent(entry, templateComponentName) {
    return `import styles from './${templateComponentName}.module.css'
import { FramerRouteTemplateRuntime } from '../src/framer-data/route-template-runtime'

export type ${templateComponentName}Props = {
  pageData: {
    sourceUrl: string
    exportTree: ReadonlyArray<Record<string, unknown>>
  }
}

export function ${templateComponentName}(props: ${templateComponentName}Props) {
  return (
    <main className={styles.page} data-coderelay-source={props.pageData.sourceUrl}>
      <FramerRouteTemplateRuntime tree={props.pageData.exportTree} styles={styles} />
    </main>
  )
}
`;
}
function createSharedTemplateDts(templateComponentName) {
    return `export type ${templateComponentName}Props = {
  pageData: {
    sourceUrl: string
    exportTree: ReadonlyArray<Record<string, unknown>>
  }
}

export declare function ${templateComponentName}(props: ${templateComponentName}Props): React.JSX.Element
`;
}
function createRouteTemplateRuntimeModule(_hasComponentFamilies) {
    return `import * as React from 'react'
import { FramerComponentFamilyStateMachine } from './component-families-runtime'

type RouteTemplateNode = {
  id?: string
  classKey?: string
  tag?: string
  text?: string
  kind?: string
  componentFamilyId?: string
  componentFamilyName?: string
  componentFamilyInitialVariantId?: string
  attributes?: Record<string, unknown>
  inlineStyle?: Record<string, unknown>
  children?: RouteTemplateNode[]
}

type RuntimeProps = {
  tree: ReadonlyArray<Record<string, unknown>>
  styles: Record<string, string>
}

const textTags = new Set(['p', 'span', 'li', 'label', 'strong', 'em', 'small', 'blockquote'])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function asNode(value: Record<string, unknown>): RouteTemplateNode {
  return {
    id: typeof value.id === 'string' ? value.id : undefined,
    classKey: typeof value.classKey === 'string' ? value.classKey : undefined,
    tag: typeof value.tag === 'string' ? value.tag : 'div',
    text: typeof value.text === 'string' ? value.text : undefined,
    kind: typeof value.kind === 'string' ? value.kind : undefined,
    componentFamilyId:
      typeof value.componentFamilyId === 'string' ? value.componentFamilyId : undefined,
    componentFamilyName:
      typeof value.componentFamilyName === 'string' ? value.componentFamilyName : undefined,
    componentFamilyInitialVariantId:
      typeof value.componentFamilyInitialVariantId === 'string'
        ? value.componentFamilyInitialVariantId
        : undefined,
    attributes: isRecord(value.attributes) ? value.attributes : {},
    inlineStyle: isRecord(value.inlineStyle) ? value.inlineStyle : {},
    children: Array.isArray(value.children)
      ? value.children.filter(isRecord).map(asNode)
      : [],
  }
}

function baseClassForTag(node: RouteTemplateNode) {
  if (node.tag === 'img') return 'image'
  if (node.tag === 'h1') return 'heading'
  if (node.tag === 'h2' || node.tag === 'h3') return 'subheading'
  if (node.tag === 'a') return 'link'
  if (node.tag === 'button') return 'button'
  if (node.kind === 'text' || textTags.has(node.tag ?? '')) return 'body'
  return 'surface'
}

function tagForNode(node: RouteTemplateNode, depth: number) {
  if (node.tag && /^h[1-6]$/.test(node.tag)) return node.tag
  if (node.tag === 'a' || node.tag === 'button' || node.tag === 'img') return node.tag
  if (textTags.has(node.tag ?? '')) return node.tag ?? 'span'
  if (depth === 0 && node.kind === 'component') return 'section'
  if (node.tag === 'section' || node.tag === 'main' || node.tag === 'article') {
    return node.tag
  }
  return 'div'
}

function toStyleObject(value: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => typeof entry === 'string' && entry.length > 0),
  ) as React.CSSProperties
}

function classNameForNode(node: RouteTemplateNode, styles: Record<string, string>) {
  const classes = [styles[baseClassForTag(node)]]
  if (node.classKey && styles[node.classKey]) classes.push(styles[node.classKey])
  const extra = typeof node.attributes?.className === 'string' ? node.attributes.className : ''
  if (extra) classes.push(extra)
  return classes.filter(Boolean).join(' ')
}

function renderNode(node: RouteTemplateNode, styles: Record<string, string>, depth: number): React.ReactNode {
  if (node.componentFamilyId) {
    return (
      <FramerComponentFamilyStateMachine
        key={node.id ?? node.componentFamilyId}
        familyId={node.componentFamilyId}
        initialVariantId={node.componentFamilyInitialVariantId}
        placement="route"
        familyName={node.componentFamilyName}
      />
    )
  }

  const tag = tagForNode(node, depth)
  const children = (node.children ?? []).map((child, index) =>
    renderNode(child, styles, depth + 1) ?? <React.Fragment key={index} />,
  )
  const style = toStyleObject(isRecord(node.inlineStyle) ? node.inlineStyle : {})
  const className = classNameForNode(node, styles)
  const key = node.id ?? node.classKey ?? \`node-\${depth}\`

  if (tag === 'img' && typeof node.attributes?.src === 'string') {
    return React.createElement('img', {
      key,
      className,
      style,
      src: node.attributes.src,
      alt: typeof node.attributes.alt === 'string' ? node.attributes.alt : '',
    })
  }

  const props: Record<string, unknown> = {
    key,
    className,
    style,
  }

  if (tag === 'a') {
    props.href = typeof node.attributes?.href === 'string' ? node.attributes.href : '#'
  }
  if (tag === 'button') {
    props.type = 'button'
  }

  return React.createElement(tag, props, node.text, ...children)
}

export function FramerRouteTemplateRuntime({ tree, styles }: RuntimeProps) {
  const nodes = Array.isArray(tree) ? tree.filter(isRecord).map(asNode) : []
  return <>{nodes.map((node, index) => renderNode(node, styles, index))}</>
}
`;
}
function scopeExportTreeToNodes(tree, nodes) {
    if (!tree?.length || nodes.length === 0)
        return undefined;
    const nodeIds = new Set(nodes.map((node) => node.id));
    const scoped = tree.filter((node) => nodeIds.has(node.id));
    return scoped.length > 0 ? scoped : undefined;
}
function createRemoteModuleWrapper(module) {
    const exportName = module.isDefaultExport
        ? "default"
        : module.componentName ?? module.name;
    const safeName = toSafeIdentifier(module.name);
    return `import * as React from 'react'

type RemoteProps = Record<string, unknown>
type RemoteComponentModule = Record<string, unknown> & {
  default?: React.ComponentType<RemoteProps>
}

function resolveComponent(mod: RemoteComponentModule) {
  const exportName: string = ${JSON.stringify(exportName)}
  const named = exportName !== 'default' ? mod[exportName] : undefined
  const candidate = named ?? mod.default ?? Object.values(mod).find((value) => typeof value === 'function')
  return candidate as React.ComponentType<RemoteProps>
}

const RemoteComponent = React.lazy(async () => {
  const moduleUrl: string = ${JSON.stringify(module.insertURL)}
  const mod = await import(/* @vite-ignore */ moduleUrl) as RemoteComponentModule
  return { default: resolveComponent(mod) }
})

export const framerModuleInfo = ${JSON.stringify(module, null, 2)} as const

export function ${safeName}Remote(props: RemoteProps) {
  return (
    <React.Suspense fallback={<div data-framer-module-loading="${escapeAttribute(module.name)}">${escapeText(module.name)}</div>}>
      <RemoteComponent {...props} />
    </React.Suspense>
  )
}
`;
}
function createAssetManifest(ir) {
    const runtimeAssets = ir.runtimeCapture.nodes
        .flatMap((node) => {
        const assets = [];
        if (node.attributes.src) {
            assets.push({
                nodeId: node.id,
                kind: "image",
                url: node.attributes.src,
                alt: node.attributes.alt,
                source: "runtime",
            });
        }
        const backgroundUrl = extractFirstCssUrl(node.styles.backgroundImage);
        if (backgroundUrl) {
            assets.push({
                nodeId: node.id,
                kind: "image",
                url: backgroundUrl,
                source: "runtime",
            });
        }
        if (node.attributes.href) {
            assets.push({
                nodeId: node.id,
                kind: "link",
                url: node.attributes.href,
                source: "runtime",
            });
        }
        return assets;
    })
        .filter((asset, index, assets) => {
        return (assets.findIndex((entry) => entry.nodeId === asset.nodeId &&
            entry.kind === asset.kind &&
            entry.url === asset.url) === index);
    });
    const cmsAssets = (ir.cmsCollections ?? [])
        .flatMap((collection) => (collection.items ?? []).flatMap((item) => Object.entries(item.fieldData ?? {}).flatMap(([fieldId, entry]) => {
        if (!entry || typeof entry !== "object")
            return [];
        const fieldEntry = entry;
        const type = fieldEntry.type;
        const value = fieldEntry.value;
        if ((type === "image" || type === "file" || type === "link") &&
            typeof value === "string" &&
            value.trim().length > 0) {
            return [
                {
                    collectionId: collection.id,
                    itemId: item.id,
                    fieldId,
                    kind: type === "link" ? "link" : "image",
                    url: value,
                    source: "cms",
                },
            ];
        }
        return [];
    })))
        .filter((asset, index, assets) => {
        return (assets.findIndex((entry) => entry.collectionId === asset.collectionId &&
            entry.itemId === asset.itemId &&
            entry.fieldId === asset.fieldId &&
            entry.url === asset.url) === index);
    });
    return {
        exportedAt: new Date().toISOString(),
        totals: {
            irAssets: ir.assets.length,
            runtimeAssets: runtimeAssets.length,
            cmsAssets: cmsAssets.length,
        },
        irAssets: ir.assets,
        runtimeAssets,
        cmsAssets,
    };
}
function createRuntimeStrategyManifest(ir) {
    const routeCount = ir.sitePages?.length ?? 0;
    return {
        strategy: ir.exportMode === "full-site" ? "runtime-kept-full-site" : "reconstructed-react",
        runtimeKept: ir.exportMode === "full-site",
        intendedEditor: ir.exportMode === "full-site" ? "agent-first" : "human-or-agent",
        sourceUrl: ir.sourceUrl,
        captureMode: ir.captureMode ?? "plugin-only",
        exportEngine: ir.exportEngine ?? "plugin-approximation",
        routeCount,
        routeTemplateCount: ir.routeTemplates?.length ?? 0,
        componentModuleCount: ir.componentModules?.length ?? 0,
        codeFileCount: ir.codeFiles?.length ?? 0,
        cmsCollectionCount: ir.cmsCollections?.length ?? 0,
        framerStyleCssPreserved: Boolean(ir.runtimeCapture.framerStyleCss?.trim()),
        breakpointsCaptured: ir.runtimeCapture.captureDiagnostics?.breakpointsCaptured ?? [],
        artifacts: {
            routeManifest: "route-manifest.json",
            routeTemplateManifest: "route-template-manifest.json",
            assetManifest: "asset-manifest.json",
            runtimeLocalizationReport: "runtime-localization-report.json",
            cmsManifest: "framer-cms-collections.json",
            codeFilesManifest: "framer-code-files.json",
            fontsManifest: "framer-fonts.json",
            rawRuntimeCapture: "raw-runtime-capture.json",
            exportReport: "export-report.json",
        },
    };
}
function createAgentHandoffManifest(ir) {
    return {
        handoffMode: ir.exportMode === "full-site" ? "runtime-kept" : "reconstructed-react",
        intendedEditor: ir.exportMode === "full-site" ? "agent-first" : "human-or-agent",
        guidance: [
            "Start with export-report.json and AGENT_BRIEF.md.",
            "Preserve visual fidelity and route behavior unless explicitly instructed otherwise.",
            "Use route-manifest.json and raw-runtime-capture.json to audit path coverage before editing.",
            "Use asset-manifest.json, framer-cms-collections.json, and framer-code-files.json to patch dynamic areas safely.",
        ],
        artifacts: {
            report: "export-report.json",
            readme: "README.md",
            agentBrief: "AGENT_BRIEF.md",
            routeManifest: "route-manifest.json",
            routeTemplateManifest: "route-template-manifest.json",
            runtimeStrategyManifest: "runtime-strategy-manifest.json",
            assetManifest: "asset-manifest.json",
            runtimeLocalizationReport: "runtime-localization-report.json",
            cmsManifest: "framer-cms-collections.json",
            codeFilesManifest: "framer-code-files.json",
            fontsManifest: "framer-fonts.json",
            rawRuntimeCapture: "raw-runtime-capture.json",
            patchHistory: "patch-history.json",
        },
    };
}
function extractFirstCssUrl(value) {
    if (!value)
        return undefined;
    const match = value.match(/url\((['"]?)(.*?)\\1\)/i);
    return match?.[2]?.trim() || undefined;
}
function createDts(ir, includeDataPreviews = true) {
    const lines = [];
    lines.push(`import type * as React from "react"`);
    lines.push("");
    lines.push(`export type ${ir.componentName}Props = {`);
    const props = ir.exportProps;
    if (props?.heroTitle)
        lines.push(`  ${props.heroTitle}?: string`);
    if (props?.heroSubtitle)
        lines.push(`  ${props.heroSubtitle}?: string`);
    if (props?.ctaLabel)
        lines.push(`  ${props.ctaLabel}?: string`);
    if (props?.ctaHref)
        lines.push(`  ${props.ctaHref}?: string`);
    if (includeDataPreviews && (ir.cmsCollections?.length ?? 0) > 0) {
        lines.push(`  includeCmsSections?: boolean`);
    }
    if (includeDataPreviews && (ir.componentModules?.length ?? 0) > 0) {
        lines.push(`  includeFramerRegistry?: boolean`);
    }
    if (includeDataPreviews && (ir.componentFamilies?.length ?? 0) > 0) {
        lines.push(`  includeFramerComponentFamilies?: boolean`);
    }
    if (includeDataPreviews && (ir.codeFiles?.length ?? 0) > 0) {
        lines.push(`  includeFramerCodeFiles?: boolean`);
    }
    lines.push(`}`);
    lines.push("");
    lines.push(`export declare function ${ir.componentName}(props: ${ir.componentName}Props): React.JSX.Element`);
    lines.push("");
    return `${lines.join("\n")}\n`;
}
function createComponent(ir, options = {}) {
    const cssImportPath = options.cssImportPath ?? `./${ir.componentName}.module.css`;
    const cmsImportPath = options.cmsImportPath ?? `../src/framer-data/cms-sections`;
    const framerDataImportPath = options.framerDataImportPath ?? `../src/framer-data`;
    const includeDataPreviews = options.includeDataPreviews !== false;
    const hasCmsCollections = includeDataPreviews && (ir.cmsCollections?.length ?? 0) > 0;
    const hasComponentModules = includeDataPreviews && (ir.componentModules?.length ?? 0) > 0;
    const hasComponentFamilies = includeDataPreviews && (ir.componentFamilies?.length ?? 0) > 0;
    const hasInlineComponentFamilies = hasInlineComponentFamilyMount(ir);
    const hasCodeFiles = includeDataPreviews && (ir.codeFiles?.length ?? 0) > 0;
    const content = hasUsableExportTree(ir)
        ? renderExportTreeForReact(ir)
        : ir.component.sections.length > 0
            ? ir.component.sections
                .map((section, index) => renderSection({
                nodes: section.nodes,
                index,
                ir,
                kind: section.kind ?? inferKindFromNodes(section.nodes, index),
                confidence: section.confidence,
            }))
                .join("\n")
            : renderSection({
                nodes: ir.component.nodes,
                index: 0,
                ir,
                kind: inferKindFromNodes(ir.component.nodes, 0),
                confidence: ir.component.sections[0]?.confidence,
            });
    return `import type * as React from 'react'
	import styles from '${cssImportPath}'
  ${hasCmsCollections ? `import { FramerCmsAutoSections } from '${cmsImportPath}'` : ""}
  ${hasComponentModules || hasComponentFamilies || hasInlineComponentFamilies || hasCodeFiles
        ? `import { ${[
            hasComponentModules ? "FramerComponentRegistryPreview" : null,
            hasInlineComponentFamilies ? "FramerComponentFamilyStateMachine" : null,
            hasComponentFamilies ? "FramerComponentFamilyGallery" : null,
            hasCodeFiles ? "FramerCodeFileList" : null,
        ]
            .filter(Boolean)
            .join(", ")} } from '${framerDataImportPath}'`
        : ""}

function SectionHero({ children, style }: { children: React.ReactNode; style: React.CSSProperties }) {
  return (
    <section className={styles.section} style={style}>
      <div className={styles.inner} data-layout="hero">
        {children}
      </div>
    </section>
  )
}

function SectionContent({ children, style }: { children: React.ReactNode; style: React.CSSProperties }) {
  return (
    <section className={styles.section} style={style}>
      <div className={styles.inner} data-layout="content">
        {children}
      </div>
    </section>
  )
}

function SectionMediaGrid({ children, style }: { children: React.ReactNode; style: React.CSSProperties }) {
  return (
    <section className={styles.section} style={style}>
      <div className={styles.inner} data-layout="media-grid">
        {children}
      </div>
    </section>
  )
}

export type ${ir.componentName}Props = {
  ${formatPropTypeLines(ir)}
  ${hasCmsCollections ? "includeCmsSections?: boolean" : ""}
  ${hasComponentModules ? "includeFramerRegistry?: boolean" : ""}
  ${hasComponentFamilies ? "includeFramerComponentFamilies?: boolean" : ""}
  ${hasCodeFiles ? "includeFramerCodeFiles?: boolean" : ""}
}

export function ${ir.componentName}(props: ${ir.componentName}Props) {
  return (
    <main className={styles.page} data-coderelay-source="${escapeAttribute(ir.sourceUrl)}">
      ${content}
      ${hasCmsCollections ? "{props.includeCmsSections !== false ? <FramerCmsAutoSections /> : null}" : ""}
      ${hasComponentModules
        ? `{props.includeFramerRegistry !== false ? <FramerComponentRegistryPreview /> : null}`
        : ""}
      ${hasComponentFamilies
        ? `{props.includeFramerComponentFamilies !== false ? <FramerComponentFamilyGallery /> : null}`
        : ""}
      ${hasCodeFiles
        ? `{props.includeFramerCodeFiles !== false ? <FramerCodeFileList /> : null}`
        : ""}
    </main>
  )
}
`;
}
function createViteApp(entries, label, _componentModules = [], hasGlobalCodeFiles = false) {
    const hasComponentFamilies = entries.some((entry) => (entry.componentFamilies?.length ?? 0) > 0);
    const imports = entries
        .map((entry) => `import { ${entry.componentName} } from '../components/${entry.componentName}'`)
        .join("\n");
    const render = entries
        .map((entry, index) => `<motion.section
          className="previewItem"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, delay: ${index} * 0.035 }}
        >
          <div className="previewHeader">
            <div>
	          <div className="previewEyebrow">${label === "components" ? "Component" : "Selection"}</div>
              <h2>${escapeJs(entry.componentName)}</h2>
            </div>
            <code>${escapeJs(entry.componentName)}.tsx</code>
          </div>
          <div className="previewCanvas">
            <${entry.componentName} />
          </div>
        </motion.section>`)
        .join("\n");
    return `import { motion } from 'framer-motion'
${imports}
${hasComponentFamilies ? `import { FramerComponentFamilyGallery } from './framer-data/component-families-runtime'` : ""}
${hasGlobalCodeFiles ? `import { FramerCodeFileList } from './framer-data/code-files-runtime'` : ""}

export default function App() {
  return (
    <main className="previewShell">
      <header className="previewTopbar">
        <div>
          <div className="previewEyebrow">Coderelay export</div>
	          <h1>${label === "components" ? "Component library preview" : "Export preview"}</h1>
        </div>
        <span>${entries.length} component${entries.length === 1 ? "" : "s"}</span>
      </header>
      ${render}
      ${hasComponentFamilies
        ? `<section className="previewItem">
        <div className="previewHeader">
          <div>
            <div className="previewEyebrow">Component families</div>
            <h2>Framer variant state</h2>
          </div>
          <code>src/framer-data/component-families-runtime.tsx</code>
        </div>
        <div className="previewCanvas">
          <FramerComponentFamilyGallery />
        </div>
      </section>`
        : ""}
      ${hasGlobalCodeFiles
        ? `<section className="previewItem">
        <div className="previewHeader">
          <div>
            <div className="previewEyebrow">Code files</div>
            <h2>Framer executable previews</h2>
          </div>
          <code>src/framer-data/code-files-runtime.tsx</code>
        </div>
        <div className="previewCanvas">
          <FramerCodeFileList />
        </div>
      </section>`
        : ""}
    </main>
  )
}
`;
}
function createViteSiteApp(base, pages) {
    const sitePages = base.sitePages ??
        pages.map((entry) => ({
            componentName: entry.componentName,
            routePath: "/",
            title: entry.componentName,
            nodes: entry.component.nodes,
            routeKind: "page",
            templateId: "/",
            templatePath: "/",
            template: "static",
            templateKind: "static",
            destination: undefined,
            destinationKind: undefined,
            redirectTo: undefined,
            redirectStatus: undefined,
        }));
    const pageMetadata = sitePages.map((page, index) => {
        const routeMetadata = resolveExportRouteMetadata(page);
        return {
            componentName: pages[index]?.componentName ?? page.componentName,
            routePath: page.routePath,
            title: page.title,
            routeKind: routeMetadata.routeKind,
            templateId: page.templateId ?? page.routePath,
            templatePath: page.templatePath ?? page.routePath,
            template: page.template ?? null,
            templateKind: routeMetadata.templateKind ?? page.templateKind ?? "static",
            destination: routeMetadata.destination ?? null,
            destinationKind: routeMetadata.destinationKind ?? null,
            redirectTo: routeMetadata.redirectTo ?? null,
            redirectStatus: routeMetadata.redirectStatus ?? null,
        };
    });
    const lazyComponents = pages
        .map((entry) => `const ${entry.componentName} = lazy(() =>
  import('../pages/${entry.componentName}').then((module) => ({
    default: module.${entry.componentName},
  })),
)`)
        .join("\n\n");
    const preloaders = pages
        .map((entry, index) => `  ${JSON.stringify(pageMetadata[index]?.routePath ?? "/")}: () =>
    import('../pages/${entry.componentName}').then((module) => ({
      default: module.${entry.componentName},
    })),`)
        .join("\n");
    const pageObjects = pageMetadata
        .map((page) => `{
      path: ${JSON.stringify(page.routePath)},
      title: ${JSON.stringify(page.title)},
      routeKind: ${JSON.stringify(page.routeKind)},
      templateId: ${JSON.stringify(page.templateId)},
      templatePath: ${JSON.stringify(page.templatePath)},
      template: ${JSON.stringify(page.template ?? null)},
      templateKind: ${JSON.stringify(page.templateKind)},
      destination: ${JSON.stringify(page.destination ?? null)},
      destinationKind: ${JSON.stringify(page.destinationKind ?? null)},
      redirectTo: ${JSON.stringify(page.redirectTo ?? null)},
      redirectStatus: ${JSON.stringify(page.redirectStatus ?? null)},
      Component: ${page.componentName},
    }`)
        .join(",\n");
    return `import { Component, lazy, Suspense, startTransition, useEffect, useState, type ReactNode } from 'react'

${lazyComponents}

const pages = [
  ${pageObjects}
]

const pagePreloaders: Record<string, () => Promise<unknown>> = {
${preloaders}
}

function normalizePath(path: string) {
  if (!path) return '/'
  if (path === '/') return '/'
  return path.endsWith('/') ? path.slice(0, -1) : path
}

function getInitialPath() {
  if (typeof window === 'undefined') return pages[0]?.path ?? '/'
  const browserPath = normalizePath(window.location.pathname)
  if (pages.some((page) => normalizePath(page.path) === browserPath)) {
    return browserPath
  }
  const hashPath = normalizePath(window.location.hash.replace(/^#/, ''))
  if (pages.some((page) => normalizePath(page.path) === hashPath)) {
    return hashPath
  }
  return normalizePath(pages[0]?.path ?? '/')
}

function preloadRoute(path: string) {
  const preload = pagePreloaders[normalizePath(path)]
  if (!preload) return
  void preload()
}

function navigateTo(path: string, options: { replace?: boolean } = {}) {
  if (typeof window === 'undefined') return
  const nextPath = normalizePath(path)
  const method = options.replace ? 'replaceState' : 'pushState'
  window.history[method](null, '', nextPath)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function isExternalUrl(path: string) {
  return /^https?:\\/\\//.test(path)
}

function isModifiedEvent(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
}

function findInternalAnchor(target: EventTarget | null) {
  if (!(target instanceof Element)) return null
  const anchor = target.closest('a[href]')
  if (!(anchor instanceof HTMLAnchorElement)) return null
  if (!anchor.href) return null
  const url = new URL(anchor.href, window.location.href)
  if (url.origin !== window.location.origin) return null
  return {
    anchor,
    path: normalizePath(url.pathname),
  }
}

class RouteErrorBoundary extends Component<
  { path: string; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { path: string; children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error('CodeRelay route render failed', { path: this.props.path, error })
  }

  componentDidUpdate(prevProps: { path: string }) {
    if (prevProps.path !== this.props.path && this.state.hasError) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="routeStateCard" role="alert">
          <div className="routeStateEyebrow">Route error</div>
          <h2>We could not render this exported page.</h2>
          <p>Try another route or regenerate this export with fresh source evidence.</p>
        </div>
      )
    }

    return this.props.children
  }
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => getInitialPath())

  useEffect(() => {
    const updatePath = () => {
      startTransition(() => {
        setCurrentPath(getInitialPath())
      })
    }

    const handleMouseOver = (event: MouseEvent) => {
      const match = findInternalAnchor(event.target)
      if (!match) return
      preloadRoute(match.path)
    }

    const handleDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || isModifiedEvent(event)) {
        return
      }
      const match = findInternalAnchor(event.target)
      if (!match) return
      if (!pages.some((page) => normalizePath(page.path) === match.path)) return
      event.preventDefault()
      preloadRoute(match.path)
      navigateTo(match.path)
    }

    updatePath()
    preloadRoute(currentPath)
    window.addEventListener('popstate', updatePath)
    document.addEventListener('click', handleDocumentClick)
    document.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('popstate', updatePath)
      document.removeEventListener('click', handleDocumentClick)
      document.removeEventListener('mouseover', handleMouseOver)
    }
  }, [currentPath])

  const currentPage =
    pages.find((page) => normalizePath(page.path) === normalizePath(currentPath)) ??
    pages[0]

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.title = currentPage?.title || '${escapeJs(base.componentName)}'
  }, [currentPage])

  useEffect(() => {
    const currentIndex = pages.findIndex(
      (page) => normalizePath(page.path) === normalizePath(currentPage?.path ?? ''),
    )
    if (currentIndex < 0) return
    preloadRoute(pages[currentIndex - 1]?.path ?? '')
    preloadRoute(pages[currentIndex + 1]?.path ?? '')
  }, [currentPage])

  useEffect(() => {
    if (!currentPage?.redirectTo || typeof window === 'undefined') return
    if (isExternalUrl(currentPage.redirectTo)) return
    navigateTo(currentPage.redirectTo, { replace: true })
  }, [currentPage])

  if (!currentPage) {
    return (
      <main data-coderelay-runtime-kept="true">
        <div className="routeStateCard" role="alert">
          <div className="routeStateEyebrow">No route</div>
          <h2>This export has no routable pages.</h2>
        </div>
      </main>
    )
  }

  const Page = currentPage.Component

  return (
    <>
      {currentPage.redirectTo ? (
        <div className="routeStateCard" role="status">
          <div className="routeStateEyebrow">Redirect</div>
          <h2>Redirecting…</h2>
          <p>
            <code>{currentPage.path}</code> → <code>{currentPage.redirectTo}</code>
          </p>
        </div>
      ) : null}
      <RouteErrorBoundary path={currentPage.path}>
        <Suspense
          fallback={
            <div className="routeStateCard" aria-live="polite">
              <div className="routeStateEyebrow">Loading route</div>
              <h2>{currentPage.title}</h2>
              <p>Preparing the generated page module and its styles.</p>
            </div>
          }
        >
          {currentPage.redirectTo ? null : <Page />}
        </Suspense>
      </RouteErrorBoundary>
    </>
  )
}
`;
}
function createMultiEntryPreviewHtml(base, entries, strategy, label) {
    const css = createCss(entries[0] ?? base, strategy);
    const cmsPreview = renderCmsCollectionsPreviewHtml(base);
    const componentModulePreview = renderComponentModulesPreviewHtml(base);
    const codeFilesPreview = renderCodeFilesPreviewHtml(base);
    const items = entries
        .map((entry) => {
        const body = hasUsableExportTree(entry)
            ? renderExportTreeForHtml(entry)
            : entry.component.sections.length > 0
                ? entry.component.sections
                    .map((section, index) => renderPreviewSection(section.nodes, index, entry))
                    .join("\n")
                : renderPreviewSection(entry.component.nodes, 0, entry);
        return `<section class="previewItem">
  <div class="previewHeader">
    <div>
      <div class="previewEyebrow">${label}</div>
      <h2>${escapeText(entry.componentName)}</h2>
    </div>
    <code>${escapeText(entry.componentName)}.tsx</code>
  </div>
  <div class="previewCanvas">
    <main class="page" data-coderelay-source="${escapeAttribute(entry.sourceUrl)}">
      ${body}
    </main>
  </div>
</section>`;
    })
        .join("\n");
    return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeText(base.componentName)} Preview</title>
    <style>
      ${base.runtimeCapture.framerStyleCss ?? ""}
      ${createGlobalCss()}
      ${css}
    </style>
  </head>
  <body>
    <main class="previewShell">
      <header class="previewTopbar">
        <div>
          <div class="previewEyebrow">Coderelay export</div>
          <h1>${label === "Page" ? "Full-site preview" : "Component library preview"}</h1>
        </div>
        <span>${entries.length} ${label.toLowerCase()}${entries.length === 1 ? "" : "s"}</span>
      </header>
      ${items}
      ${cmsPreview}
      ${componentModulePreview}
      ${codeFilesPreview}
    </main>
  </body>
</html>
`;
}
function createViteMain(withFramerStyles = false) {
    const importFramerStyles = withFramerStyles
        ? `import './framer-styles.css'\n`
        : "";
    return `import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
${importFramerStyles}import './styles.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;
}
function renderNode(node) {
    const style = reactStyleAttribute(node);
    const imgClass = reactClassName("styles.image", node);
    const headingClass = reactClassName("styles.heading", node);
    const subheadingClass = reactClassName("styles.subheading", node);
    const linkClass = reactClassName("styles.link", node);
    const buttonClass = reactClassName("styles.button", node);
    const bodyClass = reactClassName("styles.body", node);
    if (node.tag === "img" && node.attributes.src) {
        return `<img className=${imgClass} src="${escapeAttribute(node.attributes.src)}" alt="${escapeAttribute(node.attributes.alt ?? "")}"${style} />`;
    }
    const text = escapeText(node.text ?? "");
    if (!text) {
        return "";
    }
    if (node.tag === "h1") {
        return `<h1 className=${headingClass}${style}>${text}</h1>`;
    }
    if (node.tag === "h2" || node.tag === "h3") {
        return `<h2 className=${subheadingClass}${style}>${text}</h2>`;
    }
    if (node.tag === "a") {
        return `<a className=${linkClass} href="${escapeAttribute(node.attributes.href ?? "#")}"${style}>${text}</a>`;
    }
    if (node.tag === "button") {
        return `<button className=${buttonClass} type="button"${style}>${text}</button>`;
    }
    return `<p className=${bodyClass}${style}>${text}</p>`;
}
function createRenderContext() {
    return {
        titleUsed: false,
        subtitleUsed: false,
        ctaLabelUsed: false,
        ctaHrefUsed: false,
    };
}
function renderNodeWithProps(node, ir, ctx) {
    const style = reactStyleAttribute(node);
    const imgClass = reactClassName("styles.image", node);
    const headingClass = reactClassName("styles.heading", node);
    const subheadingClass = reactClassName("styles.subheading", node);
    const linkClass = reactClassName("styles.link", node);
    const buttonClass = reactClassName("styles.button", node);
    const bodyClass = reactClassName("styles.body", node);
    if (node.tag === "img" && node.attributes.src) {
        return `<img className=${imgClass} src="${escapeAttribute(node.attributes.src)}" alt="${escapeAttribute(node.attributes.alt ?? "")}"${style} />`;
    }
    const rawText = node.text ?? "";
    if (!rawText.trim())
        return "";
    const text = reactTextLiteral(rawText);
    const props = ir.exportProps;
    const titleKey = props?.heroTitle;
    const subtitleKey = props?.heroSubtitle;
    const ctaLabelKey = props?.ctaLabel;
    const ctaHrefKey = props?.ctaHref;
    if (node.tag === "h1") {
        const content = titleKey && !ctx.titleUsed
            ? `{props.${titleKey} ?? ${JSON.stringify(rawText)}}`
            : text;
        if (titleKey && !ctx.titleUsed)
            ctx.titleUsed = true;
        return `<h1 className=${headingClass}${style}>${content}</h1>`;
    }
    if (node.tag === "h2" || node.tag === "h3") {
        const content = subtitleKey && !ctx.subtitleUsed
            ? `{props.${subtitleKey} ?? ${JSON.stringify(rawText)}}`
            : text;
        if (subtitleKey && !ctx.subtitleUsed)
            ctx.subtitleUsed = true;
        return `<h2 className=${subheadingClass}${style}>${content}</h2>`;
    }
    if (node.tag === "a") {
        const label = ctaLabelKey && !ctx.ctaLabelUsed
            ? `{props.${ctaLabelKey} ?? ${JSON.stringify(rawText)}}`
            : text;
        if (ctaLabelKey && !ctx.ctaLabelUsed)
            ctx.ctaLabelUsed = true;
        const href = node.attributes.href ?? "#";
        const hrefExpr = ctaHrefKey && !ctx.ctaHrefUsed
            ? `{props.${ctaHrefKey} ?? ${JSON.stringify(href)}}`
            : `"${escapeAttribute(href)}"`;
        if (ctaHrefKey && !ctx.ctaHrefUsed)
            ctx.ctaHrefUsed = true;
        return `<a className=${linkClass} href=${hrefExpr}${style}>${label}</a>`;
    }
    if (node.tag === "button") {
        const label = ctaLabelKey && !ctx.ctaLabelUsed
            ? `{props.${ctaLabelKey} ?? ${JSON.stringify(rawText)}}`
            : text;
        if (ctaLabelKey && !ctx.ctaLabelUsed)
            ctx.ctaLabelUsed = true;
        return `<button className=${buttonClass} type="button"${style}>${label}</button>`;
    }
    return `<p className=${bodyClass}${style}>${text}</p>`;
}
function formatPropTypeLines(ir) {
    const props = ir.exportProps;
    const lines = [];
    if (props?.heroTitle)
        lines.push(`${props.heroTitle}?: string`);
    if (props?.heroSubtitle)
        lines.push(`${props.heroSubtitle}?: string`);
    if (props?.ctaLabel)
        lines.push(`${props.ctaLabel}?: string`);
    if (props?.ctaHref)
        lines.push(`${props.ctaHref}?: string`);
    if (lines.length === 0)
        return "";
    return lines.join("\n  ");
}
function renderSection(input) {
    const repaired = repairSectionNodes(input.nodes);
    const groups = groupSectionNodes(repaired);
    const ctx = createRenderContext();
    const items = [
        ...groups.surfaces.map(renderSurfaceNode),
        ...groups.headings.map((node) => renderNodeWithProps(node, input.ir, ctx)),
        ...groups.body.map((node) => renderNodeWithProps(node, input.ir, ctx)),
        ...groups.cta.map((node) => renderNodeWithProps(node, input.ir, ctx)),
        ...groups.images.map((node) => renderNodeWithProps(node, input.ir, ctx)),
    ]
        .filter(Boolean)
        .join("\n");
    const style = sectionStyle(input.nodes, input.index, input.ir);
    const component = input.kind === "hero"
        ? "SectionHero"
        : input.kind === "media-grid"
            ? "SectionMediaGrid"
            : "SectionContent";
    const confidence = input.confidence ?? 1;
    if (confidence < 0.5) {
        return `<${component} style={${style.styleObject}}>
      <div className={styles.placeholder}>
        Exported section flagged low-confidence. Review layout and typography.
      </div>
    </${component}>`;
    }
    return `<${component} style={${style.styleObject}}>
    ${items || "<div className={styles.placeholder}>Exported Framer section</div>"}
  </${component}>`;
}
function createCss(ir, strategy) {
    if (hasUsableExportTree(ir)) {
        return createTreeCss(ir);
    }
    return createHeuristicCss(ir, strategy);
}
function createHeuristicCss(ir, strategy) {
    const root = ir.runtimeCapture.nodes.find((node) => node.rect.width > 200 && node.rect.height > 100);
    const heading = ir.component.nodes.find((node) => node.tag === "h1" || node.tag === "h2");
    const body = ir.component.nodes.find((node) => node.tag === "p");
    const backgroundColor = findBackgroundColor(ir, root);
    const textColor = usableColor(heading?.styles.color ?? body?.styles.color) ?? "#111111";
    const headingSize = heading?.styles.fontSize ?? "clamp(2.5rem, 6vw, 5.5rem)";
    const bodySize = body?.styles.fontSize ?? "1.125rem";
    const minHeight = ir.runtimeCapture.mode === "page"
        ? 520
        : Math.max(360, Math.min(900, ir.runtimeCapture.viewports.desktop.height));
    const tabletHeight = ir.runtimeCapture.viewports.tablet?.height ??
        ir.runtimeCapture.viewports.mobile.height;
    const landingStructured = strategy.structuredLayout;
    const stricterSpacing = strategy.compactSpacing;
    const mobilePaddingByLayout = {
        hero: landingStructured ? "56px 20px" : "64px 22px",
        content: strategy.aggressiveMobileStacking ? "44px 16px" : "52px 18px",
        "media-grid": strategy.aggressiveMobileStacking ? "40px 16px" : "48px 18px",
    };
    const desktopPaddingByLayout = {
        hero: stricterSpacing ? "84px 56px" : "112px 72px",
        content: stricterSpacing ? "72px 48px" : "96px 64px",
        "media-grid": stricterSpacing ? "72px 48px" : "96px 64px",
    };
    return `.page {
  min-height: 100vh;
  background: ${backgroundColor};
  color: ${textColor};
}

.section,
.heroSection {
  min-height: ${minHeight}px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${desktopPaddingByLayout.content};
}

.inner {
  width: min(1120px, 100%);
  display: grid;
  grid-template-columns: minmax(0, 820px);
  align-items: center;
  justify-content: center;
  gap: ${stricterSpacing ? "32px" : "48px"};
}

.inner[data-layout='hero'] {
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.85fr);
}

.inner[data-layout='content'] {
  grid-template-columns: minmax(0, 820px);
}

.inner[data-layout='media-grid'] {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.heading {
  margin: 0;
  max-width: 900px;
  font-size: ${headingSize};
  line-height: ${heading?.styles.lineHeight ?? "0.98"};
  font-weight: ${heading?.styles.fontWeight ?? "700"};
  letter-spacing: ${heading?.styles.letterSpacing ?? "0"};
}

.subheading {
  margin: 0;
  max-width: 760px;
  font-size: clamp(1.75rem, 4vw, 3.25rem);
  line-height: 1.05;
}

.body {
  margin: 24px 0 0;
  max-width: 680px;
  font-size: ${bodySize};
  line-height: ${body?.styles.lineHeight ?? "1.6"};
}

.link,
.button {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  margin-top: 32px;
  padding: 12px 18px;
  border: 1px solid currentColor;
  border-radius: 999px;
  color: inherit;
  background: transparent;
  text-decoration: none;
  font: inherit;
}

.image {
  width: 100%;
  aspect-ratio: ${strategy.preserveImageAspectRatio ? "4 / 5" : "auto"};
  max-height: ${landingStructured ? "760px" : "680px"};
  object-fit: cover;
  border-radius: 18px;
  box-shadow: 0 28px 80px rgb(0 0 0 / 18%);
}

.placeholder {
  min-height: 240px;
}

.surface {
  width: 100%;
  min-height: 12px;
}

@media (max-width: 768px) {
  .section {
    min-height: ${ir.runtimeCapture.mode === "page" ? 420 : Math.max(360, Math.min(900, ir.runtimeCapture.viewports.mobile.height))}px;
    padding: ${mobilePaddingByLayout.content};
  }

  .heroSection {
    min-height: ${ir.runtimeCapture.mode === "page" ? 560 : Math.max(360, Math.min(900, ir.runtimeCapture.viewports.mobile.height))}px;
    padding: ${mobilePaddingByLayout.hero};
  }

  .inner {
    grid-template-columns: 1fr;
    gap: ${strategy.aggressiveMobileStacking ? "18px" : "24px"};
  }

  .inner[data-layout='dense'],
  .inner[data-layout='media-grid'],
  .inner[data-layout='hero'],
  .inner[data-layout='content'] {
    grid-template-columns: 1fr;
  }

  .section {
    padding: ${mobilePaddingByLayout.content};
  }

  .image {
    aspect-ratio: auto;
    max-height: 520px;
  }

  /* Mobile-first repair: explicit spacing + image normalization by section type */
  .inner[data-layout='hero'] {
    gap: 20px;
  }

  .inner[data-layout='content'] {
    gap: 18px;
  }

  .inner[data-layout='media-grid'] {
    gap: 14px;
  }

  .inner[data-layout='hero'] .image {
    max-height: 560px;
  }

  .inner[data-layout='media-grid'] .image {
    max-height: 420px;
    object-fit: cover;
  }

  .heading {
    font-size: clamp(2.25rem, 12vw, 4rem);
  }
}

@media (max-width: 1024px) {
  .section,
  .heroSection {
    min-height: ${ir.runtimeCapture.mode === "page" ? 480 : Math.max(360, Math.min(900, tabletHeight))}px;
    padding: ${stricterSpacing ? "64px 32px" : "72px 40px"};
  }

  .inner[data-layout='hero'] {
    grid-template-columns: minmax(0, 1fr);
  }

  .inner[data-layout='media-grid'] {
    grid-template-columns: 1fr;
  }
}
`;
}
function createTreeCss(ir) {
    const rootNode = (ir.exportTree ?? [])[0];
    const pageBackground = usableColor(rootNode?.styles.backgroundColor) ??
        findBackgroundColor(ir, ir.runtimeCapture.nodes[0]);
    const pageTextColor = usableColor(rootNode?.styles.color) ??
        usableColor(flattenExportTree(ir.exportTree ?? [])
            .map((node) => node.styles.color)
            .find(Boolean)) ??
        "#111111";
    const viewportWidths = {
        laptop: ir.runtimeCapture.viewports.laptop?.width ?? 1280,
        tablet: ir.runtimeCapture.viewports.tablet?.width ?? 768,
        mobile: ir.runtimeCapture.viewports.mobile?.width ?? 390,
    };
    const treeNodes = flattenExportTree(ir.exportTree ?? []);
    const rootBaseRules = styleRuleEntries(ir.runtimeCapture.rootStyles ?? {});
    const rootLaptopRules = styleRuleEntries(ir.runtimeCapture.rootStylesByViewport?.laptop ?? {}, ir.runtimeCapture.rootStyles ?? {});
    const rootTabletRules = styleRuleEntries(ir.runtimeCapture.rootStylesByViewport?.tablet ?? {}, ir.runtimeCapture.rootStyles ?? {});
    const rootMobileRules = styleRuleEntries(ir.runtimeCapture.rootStylesByViewport?.mobile ?? {}, ir.runtimeCapture.rootStyles ?? {});
    const baseRules = treeNodes
        .map((node) => {
        const entries = treeCssEntries(node);
        if (entries.length === 0)
            return "";
        return `${treeCssSelector(node)} {\n${entries
            .map(([key, value]) => `  ${toKebabCase(key)}: ${value};`)
            .join("\n")}\n}`;
    })
        .filter(Boolean)
        .join("\n\n");
    const laptopRules = createViewportOverrideRules(treeNodes, "laptop");
    const tabletRules = createViewportOverrideRules(treeNodes, "tablet");
    const mobileRules = createViewportOverrideRules(treeNodes, "mobile");
    const hoverRules = createInteractionStateRules(treeNodes, "hover");
    const focusRules = createInteractionStateRules(treeNodes, "focus");
    const laptopHoverRules = createViewportInteractionStateRules(treeNodes, "laptop", "hover");
    const tabletHoverRules = createViewportInteractionStateRules(treeNodes, "tablet", "hover");
    const mobileHoverRules = createViewportInteractionStateRules(treeNodes, "mobile", "hover");
    const laptopFocusRules = createViewportInteractionStateRules(treeNodes, "laptop", "focus");
    const tabletFocusRules = createViewportInteractionStateRules(treeNodes, "tablet", "focus");
    const mobileFocusRules = createViewportInteractionStateRules(treeNodes, "mobile", "focus");
    return `.page {
  min-height: 100vh;
${rootBaseRules.map(([key, value]) => `  ${toKebabCase(key)}: ${value};`).join("\n")}
  background: ${pageBackground};
  color: ${pageTextColor};
  overflow-x: hidden;
}

.surface {
  min-width: 0;
}

.surface,
.body,
.heading,
.subheading,
.link,
.button,
.image {
  box-sizing: border-box;
}

.heading,
.subheading,
.body {
  margin: 0;
}

.link,
.button {
  text-decoration: none;
}

.image {
  display: block;
  max-width: 100%;
}

${baseRules}
${hoverRules ? `\n\n@media (hover: hover) and (pointer: fine) {\n${indentCss(hoverRules, 2)}\n}` : ""}
${focusRules ? `\n\n${focusRules}` : ""}
${laptopRules || rootLaptopRules.length ? `\n\n@media ${viewportMediaQuery("laptop", viewportWidths)} {\n${rootLaptopRules.length ? `  .page {\n${rootLaptopRules.map(([key, value]) => `    ${toKebabCase(key)}: ${value};`).join("\n")}\n  }\n` : ""}${laptopRules ? indentCss(laptopRules, 2) : ""}\n}` : ""}
${tabletRules || rootTabletRules.length ? `\n\n@media ${viewportMediaQuery("tablet", viewportWidths)} {\n${rootTabletRules.length ? `  .page {\n${rootTabletRules.map(([key, value]) => `    ${toKebabCase(key)}: ${value};`).join("\n")}\n  }\n` : ""}${tabletRules ? indentCss(tabletRules, 2) : ""}\n}` : ""}
${mobileRules || rootMobileRules.length ? `\n\n@media ${viewportMediaQuery("mobile", viewportWidths)} {\n${rootMobileRules.length ? `  .page {\n${rootMobileRules.map(([key, value]) => `    ${toKebabCase(key)}: ${value};`).join("\n")}\n  }\n` : ""}${mobileRules ? indentCss(mobileRules, 2) : ""}\n}` : ""}
${laptopHoverRules ? `\n\n@media (hover: hover) and (pointer: fine) and ${viewportMediaQuery("laptop", viewportWidths)} {\n${indentCss(laptopHoverRules, 2)}\n}` : ""}
${tabletHoverRules ? `\n\n@media (hover: hover) and (pointer: fine) and ${viewportMediaQuery("tablet", viewportWidths)} {\n${indentCss(tabletHoverRules, 2)}\n}` : ""}
${mobileHoverRules ? `\n\n@media (hover: hover) and (pointer: fine) and ${viewportMediaQuery("mobile", viewportWidths)} {\n${indentCss(mobileHoverRules, 2)}\n}` : ""}
${laptopFocusRules ? `\n\n@media ${viewportMediaQuery("laptop", viewportWidths)} {\n${indentCss(laptopFocusRules, 2)}\n}` : ""}
${tabletFocusRules ? `\n\n@media ${viewportMediaQuery("tablet", viewportWidths)} {\n${indentCss(tabletFocusRules, 2)}\n}` : ""}
${mobileFocusRules ? `\n\n@media ${viewportMediaQuery("mobile", viewportWidths)} {\n${indentCss(mobileFocusRules, 2)}\n}` : ""}
`;
}
function createPreviewHtml(ir, css) {
    const body = hasUsableExportTree(ir)
        ? renderExportTreeForHtml(ir)
        : ir.component.sections.length > 0
            ? ir.component.sections
                .map((section, index) => renderPreviewSection(section.nodes, index, ir))
                .join("\n")
            : renderPreviewSection(ir.component.nodes, 0, ir);
    const cmsPreview = renderCmsCollectionsPreviewHtml(ir);
    const componentModulePreview = renderComponentModulesPreviewHtml(ir);
    const codeFilesPreview = renderCodeFilesPreviewHtml(ir);
    return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeText(ir.componentName)}</title>
    <style>
      ${ir.runtimeCapture.framerStyleCss ?? ""}
      ${createGlobalCss()}
      ${css.replaceAll(/\.(\w+)/g, ".$1")}
    </style>
  </head>
  <body>
    <main class="page">
      ${body}
      ${cmsPreview}
      ${componentModulePreview}
      ${codeFilesPreview}
    </main>
  </body>
</html>
`;
}
function renderPreviewSection(nodes, index, ir) {
    const repaired = repairSectionNodes(nodes);
    const groups = groupSectionNodes(repaired);
    const style = sectionStyle(nodes, index, ir);
    const kind = inferKindFromNodes(nodes, index);
    const layout = kind === "hero" ? "hero" : kind === "media-grid" ? "media-grid" : "content";
    return `<section class="section" style="${style.inlineCss}">
  <div class="inner" data-layout="${layout}">
    ${[
        ...groups.surfaces.map(renderPreviewSurfaceNode),
        ...groups.headings.map(renderPreviewNode),
        ...groups.body.map(renderPreviewNode),
        ...groups.cta.map(renderPreviewNode),
        ...groups.images.map(renderPreviewNode),
    ]
        .filter(Boolean)
        .join("\n")}
  </div>
</section>`;
}
function renderCmsCollectionsPreviewHtml(ir) {
    const collections = ir.cmsCollections ?? [];
    if (collections.length === 0)
        return "";
    const sections = collections
        .map((collection) => {
        const items = collection.items ?? [];
        const fields = collection.fields;
        const cards = items
            .map((item) => {
            const fieldRows = fields
                .map((field) => {
                const entry = item.fieldData?.[field.id];
                const rendered = renderCmsFieldEntryHtml(entry);
                return `<div style="display:grid;gap:4px;">
  <dt style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#71717a;">${escapeText(field.name)}</dt>
  <dd style="margin:0;">${rendered}</dd>
</div>`;
            })
                .join("\n");
            return `<li style="list-style:none;border:1px solid rgb(24 24 27 / 10%);border-radius:16px;background:white;padding:16px;">
  <dl style="margin:0;display:grid;gap:10px;">
    ${fieldRows}
  </dl>
</li>`;
        })
            .join("\n");
        return `<section class="previewItem">
  <div class="previewHeader">
    <div>
      <div class="previewEyebrow">Framer CMS</div>
      <h2>${escapeText(collection.name)}</h2>
    </div>
    <code>${collection.items?.length ?? 0} item${(collection.items?.length ?? 0) === 1 ? "" : "s"}</code>
  </div>
  <div class="previewCanvas" style="padding:16px;">
    <ul style="display:grid;gap:12px;padding:0;margin:0;">
      ${cards || `<li style="list-style:none;opacity:0.64;">No items</li>`}
    </ul>
  </div>
</section>`;
    })
        .join("\n");
    return sections;
}
function renderComponentModulesPreviewHtml(ir) {
    const modules = ir.componentModules ?? [];
    if (modules.length === 0)
        return "";
    const cards = modules
        .map((module) => `<li style="list-style:none;border:1px solid rgb(24 24 27 / 10%);border-radius:16px;background:white;padding:16px;">
  <div style="display:grid;gap:8px;">
    <strong>${escapeText(module.name)}</strong>
    <code style="color:#71717a;font-size:12px;">${escapeText(module.source)}</code>
    <div style="display:flex;flex-wrap:wrap;gap:6px;">
      ${module.isDefaultExport
        ? `<span style="border:1px solid rgb(24 24 27 / 8%);border-radius:999px;padding:2px 8px;font-size:11px;">default export</span>`
        : ""}
      ${module.isVariant
        ? `<span style="border:1px solid rgb(24 24 27 / 8%);border-radius:999px;padding:2px 8px;font-size:11px;">variant${module.isPrimaryVariant ? " primary" : ""}</span>`
        : ""}
      ${module.breakpoint
        ? `<span style="border:1px solid rgb(24 24 27 / 8%);border-radius:999px;padding:2px 8px;font-size:11px;">${escapeText(module.breakpoint)}</span>`
        : ""}
      ${module.gesture
        ? `<span style="border:1px solid rgb(24 24 27 / 8%);border-radius:999px;padding:2px 8px;font-size:11px;">${escapeText(module.gesture)}</span>`
        : ""}
    </div>
    ${module.componentIdentifier
        ? `<div style="font-size:13px;color:#3f3f46;">Identifier: ${escapeText(module.componentIdentifier)}</div>`
        : ""}
    ${module.variantName || module.inheritsFromId
        ? `<div style="font-size:12px;color:#52525b;display:grid;gap:2px;">
            ${module.variantName ? `<div>Variant name: ${escapeText(module.variantName)}</div>` : ""}
            ${module.inheritsFromId ? `<div>Inherits from: ${escapeText(module.inheritsFromId)}</div>` : ""}
          </div>`
        : ""}
    ${module.insertURL
        ? `<a href="${escapeAttribute(module.insertURL)}" style="font-weight:700;color:#18181b;">${escapeText(module.insertURL)}</a>`
        : ""}
  </div>
</li>`)
        .join("\n");
    return `<section class="previewItem">
  <div class="previewHeader">
    <div>
      <div class="previewEyebrow">Framer registry</div>
      <h2>Registered component preview</h2>
    </div>
    <code>${modules.length} module${modules.length === 1 ? "" : "s"}</code>
  </div>
  <div class="previewCanvas" style="padding:16px;">
    <ul style="display:grid;gap:12px;padding:0;margin:0;">
      ${cards}
    </ul>
  </div>
</section>`;
}
function renderCodeFilesPreviewHtml(ir) {
    const codeFiles = ir.codeFiles ?? [];
    if (codeFiles.length === 0)
        return "";
    const cards = codeFiles
        .map((file) => `<li style="list-style:none;border:1px solid rgb(24 24 27 / 10%);border-radius:16px;background:white;padding:16px;">
  <div style="display:grid;gap:8px;">
    <strong>${escapeText(file.name)}</strong>
    <code style="color:#71717a;font-size:12px;">${escapeText(file.path ?? file.source ?? "code-file")}</code>
    ${file.versionId
        ? `<div style="font-size:12px;color:#52525b;">Version: ${escapeText(file.versionId)}</div>`
        : ""}
    ${file.insertURL
        ? `<a href="${escapeAttribute(file.insertURL)}" style="font-weight:700;color:#18181b;">${escapeText(file.insertURL)}</a>`
        : ""}
    ${Array.isArray(file.exports) && file.exports.length > 0
        ? `<ul style="display:flex;flex-wrap:wrap;gap:8px;padding:0;margin:0;list-style:none;">${file.exports
            .map((entry) => `<li style="border:1px solid rgb(24 24 27 / 8%);border-radius:999px;padding:4px 10px;font-size:12px;">${escapeText(entry)}</li>`)
            .join("")}</ul>`
        : ""}
    ${typeof file.content === "string" && file.content.length > 0
        ? `<pre style="margin:0;max-height:160px;overflow:auto;padding:12px;border-radius:12px;background:rgb(24 24 27 / 4%);font-size:11px;line-height:1.5;white-space:pre-wrap;word-break:break-word;">${escapeText(file.content.slice(0, 1200))}${file.content.length > 1200 ? "\n…" : ""}</pre>`
        : ""}
  </div>
</li>`)
        .join("\n");
    return `<section class="previewItem">
  <div class="previewHeader">
    <div>
      <div class="previewEyebrow">Framer code files</div>
      <h2>Code file preview</h2>
    </div>
    <code>${codeFiles.length} file${codeFiles.length === 1 ? "" : "s"}</code>
  </div>
  <div class="previewCanvas" style="padding:16px;">
    <ul style="display:grid;gap:12px;padding:0;margin:0;">
      ${cards}
    </ul>
  </div>
</section>`;
}
function renderCmsFieldEntryHtml(entry) {
    if (!entry || typeof entry !== "object") {
        return `<span style="opacity:0.56;">No value</span>`;
    }
    const record = entry;
    const type = typeof record.type === "string" ? record.type : undefined;
    const value = "value" in record ? record.value : undefined;
    if (type === "image" && typeof value === "string" && value.length > 0) {
        return `<img src="${escapeAttribute(value)}" alt="" style="display:block;width:100%;max-width:240px;min-height:120px;object-fit:cover;border-radius:12px;">`;
    }
    if (type === "link" && typeof value === "string" && value.length > 0) {
        return `<a href="${escapeAttribute(value)}" style="color:#18181b;font-weight:700;">${escapeText(value)}</a>`;
    }
    if (type === "formattedText" && typeof value === "string" && value.length > 0) {
        return value;
    }
    if (type === "color" && typeof value === "string" && value.length > 0) {
        return `<span style="display:inline-flex;align-items:center;gap:8px;"><span style="display:inline-block;width:12px;height:12px;border-radius:999px;background:${escapeAttribute(value)};border:1px solid rgb(0 0 0 / 0.1);"></span>${escapeText(value)}</span>`;
    }
    if (Array.isArray(value)) {
        return `<span>${escapeText(value.join(", "))}</span>`;
    }
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        return `<span>${escapeText(String(value))}</span>`;
    }
    return `<span style="opacity:0.56;">No value</span>`;
}
function hasUsableExportTree(ir) {
    return Array.isArray(ir.exportTree) && ir.exportTree.length > 0;
}
function renderExportTreeForReact(ir) {
    const ctx = createRenderContext();
    return (ir.exportTree ?? [])
        .map((node) => renderExportTreeNodeReact(node, ir, ctx, 0))
        .filter(Boolean)
        .join("\n");
}
function renderExportTreeForHtml(ir) {
    return (ir.exportTree ?? [])
        .map((node) => renderExportTreeNodeHtml(node, ir, 0))
        .filter(Boolean)
        .join("\n");
}
function renderExportTreeNodeReact(node, ir, ctx, depth) {
    const familyMount = resolveComponentFamilyMount(node, ir);
    if (familyMount) {
        return `<FramerComponentFamilyStateMachine familyId="${escapeAttribute(familyMount.familyId)}"${familyMount.initialVariantId ? ` initialVariantId="${escapeAttribute(familyMount.initialVariantId)}"` : ""} placement="route" familyName="${escapeAttribute(familyMount.familyName)}" />`;
    }
    const style = reactTreeStyleAttribute(node);
    const className = reactTreeClassName(node);
    const childContent = node.children
        .map((child) => renderExportTreeNodeReact(child, ir, ctx, depth + 1))
        .filter(Boolean)
        .join("\n");
    const rawText = node.text ?? "";
    const text = rawText.trim() ? reactTextLiteral(rawText) : "";
    if (node.tag === "img" && typeof node.attributes.src === "string") {
        return `<img className=${className} src="${escapeAttribute(node.attributes.src)}" alt="${escapeAttribute(String(node.attributes.alt ?? ""))}"${style} />`;
    }
    if (node.tag === "h1") {
        const props = ir.exportProps;
        const titleKey = props?.heroTitle;
        const content = titleKey && !ctx.titleUsed
            ? `{props.${titleKey} ?? ${JSON.stringify(rawText)}}`
            : text;
        if (titleKey && !ctx.titleUsed)
            ctx.titleUsed = true;
        return `<h1 className=${className}${style}>${content}${childContent}</h1>`;
    }
    if (/^h[2-6]$/.test(node.tag)) {
        const props = ir.exportProps;
        const subtitleKey = props?.heroSubtitle;
        const content = subtitleKey && !ctx.subtitleUsed
            ? `{props.${subtitleKey} ?? ${JSON.stringify(rawText)}}`
            : text;
        if (subtitleKey && !ctx.subtitleUsed)
            ctx.subtitleUsed = true;
        return `<${node.tag} className=${className}${style}>${content}${childContent}</${node.tag}>`;
    }
    if (node.tag === "a") {
        const props = ir.exportProps;
        const labelKey = props?.ctaLabel;
        const hrefKey = props?.ctaHref;
        const label = labelKey && !ctx.ctaLabelUsed
            ? `{props.${labelKey} ?? ${JSON.stringify(rawText)}}`
            : text;
        if (labelKey && !ctx.ctaLabelUsed)
            ctx.ctaLabelUsed = true;
        const href = typeof node.attributes.href === "string" ? node.attributes.href : "#";
        const hrefExpr = hrefKey && !ctx.ctaHrefUsed
            ? `{props.${hrefKey} ?? ${JSON.stringify(href)}}`
            : `"${escapeAttribute(href)}"`;
        if (hrefKey && !ctx.ctaHrefUsed)
            ctx.ctaHrefUsed = true;
        return `<a className=${className} href=${hrefExpr}${style}>${label}${childContent}</a>`;
    }
    if (node.tag === "button") {
        const props = ir.exportProps;
        const labelKey = props?.ctaLabel;
        const label = labelKey && !ctx.ctaLabelUsed
            ? `{props.${labelKey} ?? ${JSON.stringify(rawText)}}`
            : text;
        if (labelKey && !ctx.ctaLabelUsed)
            ctx.ctaLabelUsed = true;
        return `<button className=${className} type="button"${style}>${label}${childContent}</button>`;
    }
    if (isTreeTextNode(node)) {
        const tag = reactTextTag(node.tag);
        return `<${tag} className=${className}${style}>${text}${childContent}</${tag}>`;
    }
    const tag = reactContainerTag(node, depth);
    return `<${tag} className=${className}${style}>
    ${childContent || text}
  </${tag}>`;
}
function renderExportTreeNodeHtml(node, ir, depth) {
    const familyMount = resolveComponentFamilyMount(node, ir);
    if (familyMount) {
        return `<article class="surface" data-framer-component-family-placeholder="${escapeAttribute(familyMount.familyName)}">
  <strong>${escapeText(familyMount.familyName)}</strong>
  <p>Interactive Framer component family mounted in the React preview.</p>
</article>`;
    }
    const style = htmlTreeStyleAttribute(node);
    const className = htmlTreeClassName(node);
    const childContent = node.children
        .map((child) => renderExportTreeNodeHtml(child, ir, depth + 1))
        .filter(Boolean)
        .join("\n");
    const text = escapeText(node.text ?? "");
    if (node.tag === "img" && typeof node.attributes.src === "string") {
        return `<img class="${className}" src="${escapeAttribute(node.attributes.src)}" alt="${escapeAttribute(String(node.attributes.alt ?? ""))}"${style}>`;
    }
    if (/^h[1-6]$/.test(node.tag)) {
        return `<${node.tag} class="${className}"${style}>${text}${childContent}</${node.tag}>`;
    }
    if (node.tag === "a") {
        const href = typeof node.attributes.href === "string" ? node.attributes.href : "#";
        return `<a class="${className}" href="${escapeAttribute(href)}"${style}>${text}${childContent}</a>`;
    }
    if (node.tag === "button") {
        return `<button class="${className}" type="button"${style}>${text}${childContent}</button>`;
    }
    if (isTreeTextNode(node)) {
        const tag = reactTextTag(node.tag);
        return `<${tag} class="${className}"${style}>${text}${childContent}</${tag}>`;
    }
    const tag = htmlContainerTag(node, depth);
    return `<${tag} class="${className}"${style}>
    ${childContent || text}
  </${tag}>`;
}
function sectionStyle(nodes, index, ir) {
    const hasHeading = nodes.some((node) => node.tag === "h1" || node.tag === "h2");
    const imageCount = nodes.filter((node) => node.tag === "img").length;
    const textCount = nodes.filter((node) => node.text && node.tag !== "img").length;
    const rootId = nodes.find((node) => node.styles.__coderelayRootId)?.styles
        .__coderelayRootId;
    const root = (rootId
        ? ir.runtimeCapture.nodes.find((node) => node.styles.__coderelayRootId === rootId &&
            node.styles.__coderelayDepth === "0")
        : undefined) ?? nodes[0];
    const bg = usableColor(root?.styles.backgroundColor) ??
        (index % 2 === 0 ? "transparent" : "rgba(0, 0, 0, 0.02)");
    const isHero = index === 0 && hasHeading;
    const layout = isHero
        ? "hero"
        : imageCount >= 2 && textCount <= 6
            ? "media-grid"
            : "content";
    const contentHeight = Math.max(220, ...nodes.map((node) => Number(node.rect.height || 0)).filter(Boolean));
    const minHeight = Math.max(260, Math.min(620, Number(root?.rect.height ?? contentHeight + 120)));
    return {
        layout,
        styleObject: `{ background: ${JSON.stringify(bg)}, minHeight: '${minHeight}px' }`,
        inlineCss: `background:${bg};min-height:${minHeight}px`,
    };
}
function repairSectionNodes(nodes) {
    const pluginOrdered = nodes.every((node) => getSourceIndex(node) !== null);
    if (pluginOrdered) {
        return [...nodes].sort((first, second) => getSourceIndex(first) - getSourceIndex(second));
    }
    // Structural repair pass:
    // - reorder by source y/x
    // - preserve natural reading order (top-to-bottom, then left-to-right)
    // - keep tiny overlays from dominating order (by using a y tolerance)
    return [...nodes].sort((first, second) => {
        const yDelta = first.rect.y - second.rect.y;
        if (Math.abs(yDelta) > 10)
            return yDelta;
        return first.rect.x - second.rect.x;
    });
}
function getSourceIndex(node) {
    const value = node.styles.__coderelaySourceIndex;
    if (typeof value !== "string")
        return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}
function groupSectionNodes(nodes) {
    const headings = nodes.filter((node) => node.tag === "h1" || node.tag === "h2" || node.tag === "h3");
    const cta = nodes.filter((node) => node.tag === "a" || node.tag === "button");
    const images = nodes.filter((node) => node.tag === "img");
    const used = new Set([...headings, ...cta, ...images]);
    const bodyRaw = nodes.filter((node) => !used.has(node));
    const surfaces = bodyRaw.filter(isSurfaceNode);
    const bodyText = bodyRaw.filter((node) => !isSurfaceNode(node));
    // Cluster handling:
    // - keep heading-group + body + CTA clusters in approximate vertical order
    // - group image clusters separately so they don't break reading flow
    const body = clusterByY(bodyText).flat();
    const clusteredSurfaces = clusterByY(surfaces).flat();
    const clusteredImages = clusterByY(images).flat();
    const clusteredCta = clusterByY(cta).flat();
    const clusteredHeadings = clusterByY(headings).flat();
    return {
        surfaces: clusteredSurfaces,
        headings: clusteredHeadings,
        body,
        cta: clusteredCta,
        images: clusteredImages,
    };
}
function isSurfaceNode(node) {
    if (node.text?.trim())
        return false;
    if (node.tag === "img" || node.tag === "a" || node.tag === "button") {
        return false;
    }
    const hasVisualStyle = Boolean(node.styles.backgroundColor ||
        node.styles.border ||
        node.styles.borderRadius ||
        node.styles.boxShadow);
    const hasSize = node.rect.width >= 24 && node.rect.height >= 16;
    return hasVisualStyle && hasSize;
}
function clusterByY(nodes) {
    const sorted = [...nodes].sort((a, b) => a.rect.y === b.rect.y ? a.rect.x - b.rect.x : a.rect.y - b.rect.y);
    const clusters = [];
    for (const node of sorted) {
        const last = clusters[clusters.length - 1];
        if (!last) {
            clusters.push([node]);
            continue;
        }
        const anchor = last[0];
        if (Math.abs(node.rect.y - anchor.rect.y) <= 28) {
            last.push(node);
        }
        else {
            clusters.push([node]);
        }
    }
    // Within each cluster, keep left-to-right.
    return clusters.map((cluster) => cluster.sort((a, b) => a.rect.x - b.rect.x));
}
function inferKindFromNodes(nodes, index) {
    const headings = nodes.filter((node) => node.tag === "h1" || node.tag === "h2").length;
    const images = nodes.filter((node) => node.tag === "img").length;
    const text = nodes.filter((node) => node.text && node.tag !== "img").length;
    if (index === 0 && (headings > 0 || images > 0)) {
        return "hero";
    }
    if (images >= 2 && text <= 6) {
        return "media-grid";
    }
    return "content";
}
function renderPreviewNode(node) {
    const style = htmlStyleAttribute(node);
    const imgClass = htmlClassName("image", node);
    const headingClass = htmlClassName("heading", node);
    const subheadingClass = htmlClassName("subheading", node);
    const linkClass = htmlClassName("link", node);
    const buttonClass = htmlClassName("button", node);
    const bodyClass = htmlClassName("body", node);
    if (node.tag === "img" && node.attributes.src) {
        return `<img class="${imgClass}" src="${escapeAttribute(node.attributes.src)}" alt="${escapeAttribute(node.attributes.alt ?? "")}"${style}>`;
    }
    const text = escapeText(node.text ?? "");
    if (!text) {
        return "";
    }
    if (node.tag === "h1") {
        return `<h1 class="${headingClass}"${style}>${text}</h1>`;
    }
    if (node.tag === "h2" || node.tag === "h3") {
        return `<h2 class="${subheadingClass}"${style}>${text}</h2>`;
    }
    if (node.tag === "a") {
        return `<a class="${linkClass}" href="${escapeAttribute(node.attributes.href ?? "#")}"${style}>${text}</a>`;
    }
    if (node.tag === "button") {
        return `<button class="${buttonClass}" type="button"${style}>${text}</button>`;
    }
    return `<p class="${bodyClass}"${style}>${text}</p>`;
}
function renderSurfaceNode(node) {
    const style = reactStyleAttribute(node);
    return `<div className={styles.surface}${style} />`;
}
function renderPreviewSurfaceNode(node) {
    const style = htmlStyleAttribute(node);
    return `<div class="surface"${style}></div>`;
}
function createGlobalCss() {
    return `* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  min-height: 100%;
}

body {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

img {
  display: block;
}

.previewShell {
  min-height: 100vh;
  background: #f4f4f5;
  color: #18181b;
  padding: 28px 0;
}

.previewTopbar {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto 18px;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
}

.previewTopbar h1,
.previewHeader h2 {
  margin: 0;
}

.previewTopbar h1 {
  font-size: 28px;
  line-height: 1.1;
}

.previewRouteMeta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin: 10px 0 0;
  color: #52525b;
  font-size: 13px;
}

.previewRouteMeta code {
  padding: 4px 8px;
  border-radius: 999px;
  background: rgb(24 24 27 / 6%);
}

.routeStateCard {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 24px;
  border: 1px solid rgb(24 24 27 / 10%);
  border-radius: 18px;
  background: white;
  box-shadow: 0 18px 50px rgb(24 24 27 / 8%);
}

.routeStateCard h2 {
  margin: 0;
  font-size: 24px;
  line-height: 1.1;
}

.routeStateCard p {
  margin: 12px 0 0;
  color: #52525b;
  line-height: 1.6;
}

.routeStateEyebrow {
  margin-bottom: 8px;
  color: #71717a;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.previewEyebrow {
  margin-bottom: 4px;
  color: #71717a;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.previewItem {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto 16px;
  overflow: hidden;
  border: 1px solid rgb(24 24 27 / 10%);
  border-radius: 14px;
  background: white;
  box-shadow: 0 18px 50px rgb(24 24 27 / 8%);
}

.previewHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border-bottom: 1px solid rgb(24 24 27 / 10%);
}

.previewHeader code {
  color: #52525b;
  font-size: 12px;
}

.previewCanvas {
  min-height: 160px;
  background: white;
}

.siteShell {
  min-height: 100vh;
  background: white;
  color: #18181b;
}

.siteTopbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 14px 22px;
  border-bottom: 1px solid rgb(24 24 27 / 10%);
  background: rgb(255 255 255 / 92%);
  backdrop-filter: blur(14px);
}

.siteTopbar h1 {
  margin: 0;
  font-size: 22px;
  line-height: 1.1;
}

.siteTopbar nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.siteTopbar button {
  min-height: 34px;
  border: 1px solid rgb(24 24 27 / 12%);
  border-radius: 999px;
  background: white;
  color: #27272a;
  padding: 0 12px;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease;
}

.siteTopbar button[data-active="true"] {
  border-color: #18181b;
  background: #18181b;
  color: white;
}

@media (max-width: 760px) {
  .siteTopbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .siteTopbar nav {
    justify-content: flex-start;
  }
}
`;
}
function createDependencyLicenseReport(executableCodeFiles) {
    const used = new Set();
    for (const executable of executableCodeFiles) {
        for (const dependency of executable.report.dependencyNames ?? []) {
            if (isSupportedCodeFileDependency(dependency))
                used.add(dependency);
        }
    }
    return {
        generatedAt: new Date().toISOString(),
        dependencies: Array.from(used)
            .sort()
            .map((name) => ({
            name,
            version: SUPPORTED_CODE_FILE_DEPENDENCIES[name].version,
            license: SUPPORTED_CODE_FILE_DEPENDENCIES[name].license,
        })),
    };
}
function createPackageJson(ir, executableCodeFiles) {
    const dependencyEntries = Object.fromEntries(Array.from(new Set(executableCodeFiles.flatMap((entry) => (entry.report.dependencyNames ?? []).filter(isSupportedCodeFileDependency))))
        .sort()
        .map((name) => [
        name,
        SUPPORTED_CODE_FILE_DEPENDENCIES[name].version,
    ]));
    return {
        name: ir.componentName.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
        version: "0.1.0",
        private: true,
        scripts: {
            dev: "vite --host 0.0.0.0",
            build: "tsc -b && vite build",
            preview: "vite preview --host 0.0.0.0",
        },
        dependencies: {
            "framer-motion": generatedProjectVersions.framerMotion,
            react: generatedProjectVersions.react,
            "react-dom": generatedProjectVersions.reactDom,
            ...dependencyEntries,
        },
        devDependencies: {
            "@types/react": generatedProjectVersions.typesReact,
            "@types/react-dom": generatedProjectVersions.typesReactDom,
            "@vitejs/plugin-react": generatedProjectVersions.viteReact,
            typescript: generatedProjectVersions.typescript,
            vite: generatedProjectVersions.vite,
        },
    };
}
function createTsConfig() {
    return {
        compilerOptions: {
            target: "ES2020",
            useDefineForClassFields: true,
            lib: ["ES2020", "DOM", "DOM.Iterable"],
            skipLibCheck: true,
            strict: true,
            module: "ESNext",
            moduleResolution: "bundler",
            allowImportingTsExtensions: true,
            resolveJsonModule: true,
            isolatedModules: true,
            noEmit: true,
            jsx: "react-jsx",
        },
        include: [
            "src/main.tsx",
            "src/App.tsx",
            "src/vite-env.d.ts",
            "components/**/*.tsx",
            "pages/**/*.tsx",
            "vite.config.ts",
        ],
    };
}
function createIndexHtml(ir) {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeText(ir.componentName)} - Coderelay Export</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}
function createViteConfig() {
    return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
`;
}
function createViteEnv() {
    return `/// <reference types="vite/client" />
`;
}
function createComponentModulesDataModule(modules) {
    return `export const framerComponentModules = ${JSON.stringify(modules, null, 2)} as const

export type FramerComponentModuleMeta = (typeof framerComponentModules)[number]

export function getFramerComponentModuleByName(name: string) {
  return framerComponentModules.find((entry) => entry.name === name)
}
`;
}
function createComponentRegistryModule(modules) {
    const imports = modules
        .map((module) => {
        const safeName = toSafeIdentifier(module.name);
        return `import { ${safeName}Remote, framerModuleInfo as ${safeName}Info } from '../../framer-modules/${safeName}Remote'`;
    })
        .join("\n");
    const registryEntries = modules
        .map((module) => {
        const safeName = toSafeIdentifier(module.name);
        return `  ${JSON.stringify(module.name)}: { Component: ${safeName}Remote, meta: ${safeName}Info },`;
    })
        .join("\n");
    return `import * as React from 'react'
${imports}

export type FramerComponentRegistryEntry = {
  Component: React.ComponentType<any>
  meta: {
    source: string
    isDefaultExport?: boolean
    isVariant?: boolean
    isPrimaryVariant?: boolean
    gesture?: string
    inheritsFromId?: string
    breakpoint?: string
    variantName?: string
  }
}

export const framerComponentRegistry = {
${registryEntries}
} as const satisfies Record<string, FramerComponentRegistryEntry>

export type FramerComponentRegistryKey = keyof typeof framerComponentRegistry
export type FramerComponentRegistryValue = (typeof framerComponentRegistry)[FramerComponentRegistryKey]

export function getFramerRegisteredComponent(name: string): FramerComponentRegistryEntry | undefined {
  return framerComponentRegistry[name as FramerComponentRegistryKey]
}
`;
}
function createComponentRuntimeModule(modules) {
    const hasModules = modules.length > 0;
    return `import * as React from 'react'
import {
  framerComponentRegistry,
  getFramerRegisteredComponent,
  type FramerComponentRegistryEntry,
} from './component-registry'

export function FramerRegisteredComponentPreview(props: {
  name: string
  fallback?: React.ReactNode
}) {
  const entry = getFramerRegisteredComponent(props.name)
  if (!entry) return <>{props.fallback ?? null}</>
  const Component = entry.Component
  return <Component />
}

export function FramerComponentRegistryPreview() {
  const entries = Object.entries(framerComponentRegistry) as Array<
    [string, FramerComponentRegistryEntry]
  >

  if (entries.length === 0) {
    return <div style={{ opacity: 0.64 }}>No Framer component modules detected.</div>
  }

  return (
    <section data-framer-component-registry="true" style={{ display: 'grid', gap: '1rem' }}>
      {entries.map(([name, entry]) => {
        const Component = entry.Component
        return (
          <article
            key={name}
            style={{
              display: 'grid',
              gap: '0.75rem',
              border: '1px solid rgb(24 24 27 / 0.1)',
              borderRadius: '1rem',
              background: 'white',
              padding: '1rem',
            }}
          >
            <header style={{ display: 'grid', gap: '0.25rem' }}>
              <strong>{name}</strong>
              <code style={{ color: '#71717a', fontSize: '0.8rem' }}>{entry.meta.source}</code>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {entry.meta.isDefaultExport ? (
                  <span style={{ border: '1px solid rgb(24 24 27 / 0.08)', borderRadius: '999px', padding: '0.125rem 0.5rem', fontSize: '0.7rem' }}>
                    default export
                  </span>
                ) : null}
                {entry.meta.isVariant ? (
                  <span style={{ border: '1px solid rgb(24 24 27 / 0.08)', borderRadius: '999px', padding: '0.125rem 0.5rem', fontSize: '0.7rem' }}>
                    {entry.meta.isPrimaryVariant ? 'variant primary' : 'variant'}
                  </span>
                ) : null}
                {entry.meta.breakpoint ? (
                  <span style={{ border: '1px solid rgb(24 24 27 / 0.08)', borderRadius: '999px', padding: '0.125rem 0.5rem', fontSize: '0.7rem' }}>
                    {entry.meta.breakpoint}
                  </span>
                ) : null}
                {entry.meta.gesture ? (
                  <span style={{ border: '1px solid rgb(24 24 27 / 0.08)', borderRadius: '999px', padding: '0.125rem 0.5rem', fontSize: '0.7rem' }}>
                    {entry.meta.gesture}
                  </span>
                ) : null}
              </div>
              {entry.meta.variantName || entry.meta.inheritsFromId ? (
                <div style={{ color: '#52525b', fontSize: '0.75rem', display: 'grid', gap: '0.125rem' }}>
                  {entry.meta.variantName ? <div>Variant name: {entry.meta.variantName}</div> : null}
                  {entry.meta.inheritsFromId ? <div>Inherits from: {entry.meta.inheritsFromId}</div> : null}
                </div>
              ) : null}
            </header>
            <div>
              <Component />
            </div>
          </article>
        )
      })}
    </section>
  )
}

export const hasFramerRegisteredComponents = ${hasModules ? "true" : "false"} as const
`;
}
function createCodeFilesDataModule(ir, codeCompatibilityReport, unadaptedCodeFiles) {
    const compatibilityFiles = codeCompatibilityReport?.files ?? [];
    const unadaptedFiles = unadaptedCodeFiles ?? [];
    const enriched = (ir.codeFiles ?? []).map((file) => {
        const compatibility = compatibilityFiles.find((entry) => entry.codeFileId === file.id ||
            entry.path === file.path ||
            entry.name === file.name) ?? null;
        const unadapted = unadaptedFiles.find((entry) => entry.codeFileId === file.id || entry.name === file.name) ?? null;
        return {
            ...file,
            compatibility: compatibility?.compatibility,
            compatibilityReasons: compatibility?.reasons ?? [],
            dependencyNames: compatibility?.dependencyNames ?? [],
            unadaptedComponentPath: unadapted?.sourcePath,
            unadaptedMetadataPath: unadapted?.metadataPath,
        };
    });
    return `export type FramerCodeFileCompatibility =
  | 'portable'
  | 'portable-with-adapter'
  | 'portable-with-dependencies'
  | 'runtime-fallback-required'
  | 'unsupported'

export type FramerCodeFileMeta = {
  id?: string
  name: string
  path?: string
  versionId?: string
  exports?: string[]
  exportDetails?: ReadonlyArray<Record<string, unknown>>
  insertURL?: string
  source?: string
  content?: string
  contentHash?: string
  contentByteLength?: number
  hasContent?: boolean
  compatibility?: FramerCodeFileCompatibility
  compatibilityReasons?: string[]
  dependencyNames?: string[]
  unadaptedComponentPath?: string
  unadaptedMetadataPath?: string
}

export const framerCodeFiles: ReadonlyArray<FramerCodeFileMeta> = ${JSON.stringify(enriched, null, 2)}

export function getFramerCodeFileByName(name: string) {
  return framerCodeFiles.find((entry) => entry.name === name)
}
`;
}
function createFramerAdapterModule() {
    return `import * as React from 'react'
export * from 'framer-motion'
export { motion } from 'framer-motion'

type RenderTargetValue = 'canvas' | 'preview' | 'export'

const renderTargetState: {
  current: RenderTargetValue
} = {
  current: typeof window === 'undefined' ? 'export' : 'preview',
}

export const RenderTarget = {
  canvas: 'canvas' as const,
  preview: 'preview' as const,
  export: 'export' as const,
  current() {
    return renderTargetState.current
  },
}

export function FramerAdapterProvider(props: {
  target?: RenderTargetValue
  children: React.ReactNode
}) {
  const target = props.target ?? (typeof window === 'undefined' ? 'export' : 'preview')
  renderTargetState.current = target

  React.useEffect(() => {
    renderTargetState.current = target
    return () => {
      renderTargetState.current = typeof window === 'undefined' ? 'export' : 'preview'
    }
  }, [target])

  return <>{props.children}</>
}

export function addPropertyControls<T = unknown>(
  _component: unknown,
  _controls: PropertyControls<T>,
) {
  return undefined
}

export const ControlType = {
  String: 'String',
  Boolean: 'Boolean',
  Number: 'Number',
  Color: 'Color',
  Enum: 'Enum',
  Array: 'Array',
  Object: 'Object',
  File: 'File',
  Image: 'Image',
  ResponsiveImage: 'ResponsiveImage',
  Transition: 'Transition',
  Font: 'Font',
  BorderRadius: 'BorderRadius',
  Padding: 'Padding',
  FusedNumber: 'FusedNumber',
  SegmentedEnum: 'SegmentedEnum',
  EventHandler: 'EventHandler',
  ComponentInstance: 'ComponentInstance',
} as const

export type PropertyControls<T = unknown> = Record<string, unknown>
export type ControlDescription = Record<string, unknown>

export const Frame = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function Frame(props, ref) {
    return <div ref={ref} {...props} />
  },
)

export function Stack(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />
}

export function useIsStaticRenderer() {
  return false
}
`;
}
function createCodeFileExecutablesModule(executableCodeFiles) {
    const imports = executableCodeFiles
        .map((entry, index) => {
        const importName = `CodeFileExecutable${index + 1}`;
        return `import { ${entry.exportName} as ${importName} } from '${entry.importPathFromFramerData}'`;
    })
        .join("\n");
    const entries = executableCodeFiles
        .map((entry, index) => {
        const importName = `CodeFileExecutable${index + 1}`;
        return `  ${JSON.stringify(entry.file.name)}: {
    Component: ${importName},
    exportName: ${JSON.stringify(entry.exportName)},
    compatibility: ${JSON.stringify(entry.compatibility)},
  },`;
    })
        .join("\n");
    return `import * as React from 'react'
import { FramerAdapterProvider } from './framer-adapter'
${imports}

type ExecutableEntry = {
  Component: React.ComponentType<any>
  exportName: string
  compatibility: 'portable' | 'portable-with-adapter' | 'portable-with-dependencies'
}

class FramerExecutableCodeFileErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) return this.props.fallback
    return this.props.children
  }
}

export const framerCodeFileExecutables: Record<string, ExecutableEntry> = {
${entries}
}

export function getFramerExecutableCodeFileByName(name: string) {
  return framerCodeFileExecutables[name]
}

export function FramerExecutableCodeFilePreview(props: {
  name: string
  fallback?: React.ReactNode
}) {
  const entry = getFramerExecutableCodeFileByName(props.name)
  if (!entry) return <>{props.fallback ?? null}</>
  const Component = entry.Component
  const fallback = (
    <div data-framer-code-file-executable-fallback={props.name}>
      {props.fallback ?? (
        <div style={{ opacity: 0.72 }}>
          Executable preview failed for <code>{props.name}</code>.
        </div>
      )}
    </div>
  )

  return (
    <FramerExecutableCodeFileErrorBoundary
      fallback={fallback}
    >
      <FramerAdapterProvider target="preview">
        <div data-framer-code-file-executable={props.name} data-framer-code-file-export={entry.exportName}>
          <Component />
        </div>
      </FramerAdapterProvider>
    </FramerExecutableCodeFileErrorBoundary>
  )
}

export const hasFramerExecutableCodeFiles = ${executableCodeFiles.length > 0 ? "true" : "false"} as const
`;
}
function createComponentFamiliesDataModule(ir) {
    return `export type FramerComponentFamilyVariantMeta = {
  id: string
  name: string
  gesture?: string
  inheritsFromId?: string
  breakpoint?: string
  variantName?: string
  codeFileId?: string
}

export type FramerComponentFamilyInstanceMeta = {
  nodeId: string
  routePath?: string
  controls?: Record<string, unknown>
  initialVariantId?: string
}

export type FramerComponentFamilyTransitionMeta = {
  fromVariantId: string
  toVariantId?: string
  trigger?: string
  confidence: number
  provenance: 'plugin' | 'runtime' | 'source' | 'merged'
}

export type FramerComponentFamilyMeta = {
  id: string
  name: string
  primaryVariantId: string
  variants: FramerComponentFamilyVariantMeta[]
  instances: FramerComponentFamilyInstanceMeta[]
  transitions: FramerComponentFamilyTransitionMeta[]
  provenance: 'plugin' | 'runtime' | 'source' | 'merged'
}

export const framerComponentFamilies: ReadonlyArray<FramerComponentFamilyMeta> = ${JSON.stringify(ir.componentFamilies ?? [], null, 2)}

export function getFramerComponentFamilyById(id: string) {
  return framerComponentFamilies.find((entry) => entry.id === id)
}

export function getFramerComponentFamilyByName(name: string) {
  return framerComponentFamilies.find((entry) => entry.name === name)
}
`;
}
function createComponentFamiliesRuntimeModule(ir) {
    const hasFamilies = (ir.componentFamilies?.length ?? 0) > 0;
    return `import * as React from 'react'
import {
  framerComponentFamilies,
  getFramerComponentFamilyById,
  type FramerComponentFamilyMeta,
} from './component-families'

type Trigger = 'click' | 'tap' | 'hover-start' | 'hover-end' | 'focus' | 'timeout'

function normalizeTrigger(value: string | undefined): Trigger | undefined {
  switch (value) {
    case 'click':
    case 'tap':
    case 'hover-start':
    case 'hover-end':
    case 'focus':
    case 'timeout':
      return value
    default:
      return undefined
  }
}

function nextVariantIdForFamily(family: FramerComponentFamilyMeta, currentVariantId: string) {
  const transition = family.transitions.find((entry) => entry.fromVariantId === currentVariantId && entry.toVariantId)
  if (transition?.toVariantId) return transition.toVariantId
  const variants = family.variants ?? []
  const currentIndex = variants.findIndex((entry) => entry.id === currentVariantId)
  if (currentIndex >= 0 && variants.length > 1) {
    return variants[(currentIndex + 1) % variants.length]?.id ?? currentVariantId
  }
  return family.primaryVariantId
}

function labelForTrigger(value: string | undefined) {
  const normalized = normalizeTrigger(value)
  return normalized === 'tap' ? 'Tap' : normalized === 'click' ? 'Click' : normalized === 'hover-start' ? 'Hover start' : normalized === 'hover-end' ? 'Hover end' : normalized === 'focus' ? 'Focus' : normalized === 'timeout' ? 'Timeout' : 'Advance'
}

export function FramerComponentFamilyStateMachine(props: {
  familyId: string
  initialVariantId?: string
  placement?: 'route' | 'gallery'
  familyName?: string
}) {
  const family = getFramerComponentFamilyById(props.familyId)
  const initialVariantId = props.initialVariantId ?? family?.primaryVariantId
  const [currentVariantId, setCurrentVariantId] = React.useState(initialVariantId)

  React.useEffect(() => {
    setCurrentVariantId(initialVariantId)
  }, [initialVariantId])

  if (!family) {
    return <div style={{ opacity: 0.64 }}>Unknown family {props.familyId}</div>
  }

  const currentVariant =
    family.variants.find((entry) => entry.id === currentVariantId) ??
    family.variants.find((entry) => entry.id === family.primaryVariantId) ??
    family.variants[0]
  const availableTransitions = family.transitions.filter((entry) => entry.fromVariantId === currentVariant?.id)

  return (
    <article
      data-framer-component-family={family.id}
      data-framer-component-family-name={props.familyName ?? family.name}
      data-framer-component-family-placement={props.placement ?? 'gallery'}
      style={{
        display: 'grid',
        gap: '0.75rem',
        border: '1px solid rgb(24 24 27 / 0.1)',
        borderRadius: '1rem',
        background: 'white',
        padding: '1rem',
      }}
    >
      <header style={{ display: 'grid', gap: '0.25rem' }}>
        <strong>{family.name}</strong>
        <div data-framer-current-variant={currentVariant?.id ?? family.primaryVariantId} style={{ color: '#52525b', fontSize: '0.8rem' }}>
          Current variant: <code>{currentVariant?.name ?? currentVariant?.id ?? family.primaryVariantId}</code>
        </div>
        <div style={{ color: '#71717a', fontSize: '0.75rem' }}>
          Provenance: {family.provenance}
        </div>
      </header>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {(family.variants ?? []).map((variant) => (
          <button
            key={variant.id}
            type="button"
            onClick={() => setCurrentVariantId(variant.id)}
            data-framer-variant-button={variant.id}
            style={{
              border: variant.id === currentVariant?.id ? '1px solid #18181b' : '1px solid rgb(24 24 27 / 0.1)',
              borderRadius: '999px',
              padding: '0.3rem 0.65rem',
              background: variant.id === currentVariant?.id ? '#18181b' : 'white',
              color: variant.id === currentVariant?.id ? 'white' : '#18181b',
              cursor: 'pointer',
            }}
          >
            {variant.name}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gap: '0.5rem', borderRadius: '0.75rem', background: 'rgb(24 24 27 / 0.04)', padding: '0.75rem' }}>
        <div style={{ fontSize: '0.8rem', color: '#3f3f46' }}>Variant metadata</div>
        <div style={{ display: 'grid', gap: '0.2rem', fontSize: '0.8rem', color: '#18181b' }}>
          {currentVariant?.gesture ? <div>Gesture: {currentVariant.gesture}</div> : null}
          {currentVariant?.variantName ? <div>Variant name: {currentVariant.variantName}</div> : null}
          {currentVariant?.inheritsFromId ? <div>Inherits from: {currentVariant.inheritsFromId}</div> : null}
          {currentVariant?.breakpoint ? <div>Breakpoint: {currentVariant.breakpoint}</div> : null}
          {!currentVariant?.gesture && !currentVariant?.variantName && !currentVariant?.inheritsFromId && !currentVariant?.breakpoint ? (
            <div>No additional variant metadata.</div>
          ) : null}
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {availableTransitions.length > 0 ? (
          availableTransitions.map((transition, index) => (
            <button
              key={\`\${transition.fromVariantId}-\${transition.trigger ?? 'advance'}-\${index}\`}
              type="button"
              onClick={() => setCurrentVariantId(transition.toVariantId ?? nextVariantIdForFamily(family, currentVariant?.id ?? family.primaryVariantId))}
              data-framer-transition-trigger={transition.trigger ?? 'advance'}
              data-framer-transition-target={transition.toVariantId ?? nextVariantIdForFamily(family, currentVariant?.id ?? family.primaryVariantId)}
              style={{
                border: '1px solid rgb(24 24 27 / 0.1)',
                borderRadius: '0.75rem',
                padding: '0.45rem 0.75rem',
                background: 'white',
                cursor: 'pointer',
              }}
            >
              {labelForTrigger(transition.trigger)}
            </button>
          ))
        ) : (
          <button
            type="button"
            onClick={() => setCurrentVariantId(nextVariantIdForFamily(family, currentVariant?.id ?? family.primaryVariantId))}
            data-framer-transition-trigger="advance"
            data-framer-transition-target={nextVariantIdForFamily(family, currentVariant?.id ?? family.primaryVariantId)}
            style={{
              border: '1px solid rgb(24 24 27 / 0.1)',
              borderRadius: '0.75rem',
              padding: '0.45rem 0.75rem',
              background: 'white',
              cursor: 'pointer',
            }}
          >
            Advance
          </button>
        )}
      </div>
    </article>
  )
}

export function FramerComponentFamilyGallery() {
  if (framerComponentFamilies.length === 0) {
    return <div style={{ opacity: 0.64 }}>No Framer component families detected.</div>
  }

  return (
    <section data-framer-component-families="true" style={{ display: 'grid', gap: '1rem' }}>
      {framerComponentFamilies.map((family) => (
        <FramerComponentFamilyStateMachine
          key={family.id}
          familyId={family.id}
          placement="gallery"
          familyName={family.name}
        />
      ))}
    </section>
  )
}

export const hasFramerComponentFamilies = ${hasFamilies ? "true" : "false"} as const
`;
}
function createCodeFilesRuntimeModule(ir, executableCodeFiles) {
    const hasCodeFiles = (ir.codeFiles?.length ?? 0) > 0;
    return `import * as React from 'react'
import { framerCodeFiles, getFramerCodeFileByName } from './code-files'
import { FramerExecutableCodeFilePreview, getFramerExecutableCodeFileByName } from './code-file-executables'

export function FramerCodeFilePreview(props: {
  name: string
  fallback?: React.ReactNode
}) {
  const file = getFramerCodeFileByName(props.name)
  if (!file) return <>{props.fallback ?? null}</>
  const executable = getFramerExecutableCodeFileByName(file.name)

  return (
    <article
      data-framer-code-file={file.name}
      style={{
        display: 'grid',
        gap: '0.5rem',
        border: '1px solid rgb(24 24 27 / 0.1)',
        borderRadius: '1rem',
        background: 'white',
        padding: '1rem',
      }}
    >
      <header style={{ display: 'grid', gap: '0.25rem' }}>
        <strong>{file.name}</strong>
        <code style={{ color: '#71717a', fontSize: '0.8rem' }}>{file.path ?? file.source ?? 'code-file'}</code>
        {file.versionId ? (
          <div style={{ color: '#52525b', fontSize: '0.75rem' }}>Version: {file.versionId}</div>
        ) : null}
        {file.compatibility ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            <span
              data-framer-code-file-compatibility={file.compatibility}
              style={{
                border: '1px solid rgb(24 24 27 / 0.08)',
                borderRadius: '999px',
                padding: '0.2rem 0.55rem',
                fontSize: '0.75rem',
                background:
                  file.compatibility === 'unsupported'
                    ? 'rgb(254 226 226)'
                    : file.compatibility === 'runtime-fallback-required'
                      ? 'rgb(254 249 195)'
                      : 'rgb(244 244 245)',
                color:
                  file.compatibility === 'unsupported'
                    ? '#991b1b'
                    : file.compatibility === 'runtime-fallback-required'
                      ? '#854d0e'
                      : '#3f3f46',
              }}
            >
              {file.compatibility}
            </span>
            {Array.isArray(file.dependencyNames) && file.dependencyNames.length > 0 ? (
              <span style={{ color: '#52525b', fontSize: '0.75rem' }}>
                Dependencies: {file.dependencyNames.join(', ')}
              </span>
            ) : null}
          </div>
        ) : null}
      </header>
      {file.compatibility === 'unsupported' || file.compatibility === 'runtime-fallback-required' ? (
        <div
          data-framer-code-file-fallback={file.name}
          style={{
            display: 'grid',
            gap: '0.35rem',
            borderRadius: '0.75rem',
            padding: '0.75rem',
            background:
              file.compatibility === 'unsupported'
                ? 'rgb(254 242 242)'
                : 'rgb(254 252 232)',
            color:
              file.compatibility === 'unsupported'
                ? '#7f1d1d'
                : '#713f12',
            fontSize: '0.8rem',
          }}
        >
          <strong>
            {file.compatibility === 'unsupported'
              ? 'This Framer code file could not be adapted automatically.'
              : 'This Framer code file requires runtime fallback.'}
          </strong>
          {Array.isArray(file.compatibilityReasons) && file.compatibilityReasons.length > 0 ? (
            <div>Reasons: {file.compatibilityReasons.join(', ')}</div>
          ) : null}
          {file.unadaptedComponentPath ? (
            <div data-framer-code-file-fallback-path={file.unadaptedComponentPath}>
              Preserved source: <code>{file.unadaptedComponentPath}</code>
            </div>
          ) : null}
          {file.unadaptedMetadataPath ? (
            <div>
              Metadata: <code>{file.unadaptedMetadataPath}</code>
            </div>
          ) : null}
        </div>
      ) : null}
      {executable ? (
        <div
          data-framer-code-file-executable-preview={file.name}
          style={{
            display: 'grid',
            gap: '0.5rem',
            borderRadius: '0.75rem',
            padding: '0.75rem',
            background: 'rgb(24 24 27 / 0.04)',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#3f3f46' }}>
            Executable preview: <code>{executable.exportName}</code>
          </div>
          <FramerExecutableCodeFilePreview
            name={file.name}
            fallback={
              <div style={{ opacity: 0.72 }}>
                Preview unavailable.
              </div>
            }
          />
        </div>
      ) : null}
      {Array.isArray(file.exports) && file.exports.length > 0 ? (
        <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: 0, margin: 0, listStyle: 'none' }}>
          {file.exports.map((entry) => (
            <li
              key={entry}
              style={{
                border: '1px solid rgb(24 24 27 / 0.08)',
                borderRadius: '999px',
                padding: '0.2rem 0.55rem',
                fontSize: '0.8rem',
              }}
            >
              {entry}
            </li>
          ))}
        </ul>
      ) : null}
      {typeof file.content === 'string' && file.content.length > 0 ? (
        <pre style={{ margin: 0, maxHeight: '10rem', overflow: 'auto', padding: '0.75rem', borderRadius: '0.75rem', background: 'rgb(24 24 27 / 0.04)', fontSize: '0.7rem', lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {file.content.slice(0, 1200)}{file.content.length > 1200 ? '\\n…' : ''}
        </pre>
      ) : null}
    </article>
  )
}

export function FramerCodeFileList() {
  if (framerCodeFiles.length === 0) {
    return <div style={{ opacity: 0.64 }}>No Framer code files detected.</div>
  }

  return (
    <section data-framer-code-files="true" style={{ display: 'grid', gap: '1rem' }}>
      {framerCodeFiles.map((file) => (
        <FramerCodeFilePreview key={file.name} name={file.name} />
      ))}
    </section>
  )
}

export const hasFramerCodeFiles = ${hasCodeFiles ? "true" : "false"} as const
`;
}
function createFontsDataModule(ir) {
    return `export const framerFonts = ${JSON.stringify(ir.fonts ?? [], null, 2)} as const

export type FramerFontMeta = (typeof framerFonts)[number]

export function getFramerFontByFamily(family: string) {
  return framerFonts.find((entry) => entry.family === family)
}

export function getFramerFontByName(name: string) {
  return framerFonts.find((entry) => entry.name === name)
}

export const framerFontFamilies = framerFonts.map((entry) => entry.family)
`;
}
function createCmsDataModule(ir) {
    return `export const framerCmsCollections = ${JSON.stringify(ir.cmsCollections ?? [], null, 2)} as const

export type FramerCmsCollectionMeta = (typeof framerCmsCollections)[number]
export type FramerCmsItemMeta = FramerCmsCollectionMeta extends { items: readonly (infer Item)[] } ? Item : never

export function getFramerCmsCollectionByName(name: string) {
  return framerCmsCollections.find((entry) => entry.name === name)
}

export function getFramerCmsCollectionById(id: string) {
  return framerCmsCollections.find((entry) => entry.id === id)
}
`;
}
function createCmsRuntimeModule(ir) {
    const collectionNames = (ir.cmsCollections ?? [])
        .map((collection) => JSON.stringify(collection.name))
        .join(" | ");
    const collectionNameType = collectionNames.length > 0 ? collectionNames : "string";
    return `import * as React from 'react'
import { framerCmsCollections, getFramerCmsCollectionById, getFramerCmsCollectionByName } from './cms'

export type FramerCmsCollectionName = ${collectionNameType}
export type FramerCmsFieldEntry =
  | { type?: 'string'; value?: string }
  | { type?: 'number'; value?: number }
  | { type?: 'boolean'; value?: boolean }
  | { type?: 'date'; value?: string }
  | { type?: 'link'; value?: string }
  | { type?: 'image'; value?: string | null }
  | { type?: 'file'; value?: string | null }
  | { type?: 'color'; value?: string | null }
  | { type?: 'formattedText'; value?: string; contentType?: string }
  | { type?: 'enum'; value?: string }
  | { type?: 'collectionReference'; value?: string }
  | { type?: 'multiCollectionReference'; value?: string[] }
  | { type?: 'array'; value?: Array<{ id?: string; fieldData?: Record<string, unknown> }> }
  | { type?: string; value?: unknown; contentType?: string }

export function getFramerCmsItems(input: { id?: string; name?: string }) {
  const collection = input.id
    ? getFramerCmsCollectionById(input.id)
    : input.name
      ? getFramerCmsCollectionByName(input.name)
      : undefined

  return collection?.items ?? []
}

export function getFramerCmsItemFieldValue(
  item: { fieldData?: Record<string, unknown> } | undefined,
  fieldKey: string,
) {
  if (!item?.fieldData) return undefined
  return item.fieldData[fieldKey]
}

export function resolveFramerCmsFieldEntry(entry: unknown) {
  if (!entry || typeof entry !== 'object') return entry
  const record = entry as FramerCmsFieldEntry
  if (!('value' in record)) return entry
  return record.value
}

export function getFramerCmsFieldType(entry: unknown) {
  if (!entry || typeof entry !== 'object') return undefined
  const record = entry as { type?: string }
  return typeof record.type === 'string' ? record.type : undefined
}

export function getFramerCmsPlainText(
  item: { fieldData?: Record<string, unknown> } | undefined,
  fieldKey: string,
) {
  const entry = getFramerCmsItemFieldValue(item, fieldKey)
  const value = resolveFramerCmsFieldEntry(entry)
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return undefined
}

export function getFramerCmsImageUrl(
  item: { fieldData?: Record<string, unknown> } | undefined,
  fieldKey: string,
) {
  const value = resolveFramerCmsFieldEntry(getFramerCmsItemFieldValue(item, fieldKey))
  return typeof value === 'string' ? value : undefined
}

export function getFramerCmsLinkHref(
  item: { fieldData?: Record<string, unknown> } | undefined,
  fieldKey: string,
) {
  const value = resolveFramerCmsFieldEntry(getFramerCmsItemFieldValue(item, fieldKey))
  return typeof value === 'string' ? value : undefined
}

export function getFramerCmsFormattedHtml(
  item: { fieldData?: Record<string, unknown> } | undefined,
  fieldKey: string,
) {
  const entry = getFramerCmsItemFieldValue(item, fieldKey)
  const value = resolveFramerCmsFieldEntry(entry)
  return typeof value === 'string' ? value : undefined
}

export function getFramerCmsDisplayValue(
  item: { fieldData?: Record<string, unknown> } | undefined,
  fieldKey: string,
) {
  const entry = getFramerCmsItemFieldValue(item, fieldKey)
  const type = getFramerCmsFieldType(entry)
  const value = resolveFramerCmsFieldEntry(entry)

  if (value == null) return undefined
  if (type === 'formattedText' && typeof value === 'string') return value
  if (type === 'date' && typeof value === 'string') {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString()
  }
  if (type === 'multiCollectionReference' && Array.isArray(value)) {
    return value.join(', ')
  }
  if (type === 'array' && Array.isArray(value)) {
    return value
  }
  if (type === 'boolean' && typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  return value
}

export function mapFramerCmsItems<T>(
  input: { id?: string; name?: string },
  mapper: (item: (typeof framerCmsCollections)[number]['items'] extends readonly (infer Item)[] ? Item : never, index: number) => T,
) {
  return getFramerCmsItems(input).map((item, index) => mapper(item as never, index))
}

export function useFramerCmsCollection(input: { id?: string; name?: string }) {
  return React.useMemo(() => {
    const collection = input.id
      ? getFramerCmsCollectionById(input.id)
      : input.name
        ? getFramerCmsCollectionByName(input.name)
        : undefined

    return {
      collection,
      items: collection?.items ?? [],
      fields: collection?.fields ?? [],
    }
  }, [input.id, input.name])
}

export function FramerCmsCollectionList(props: {
  id?: string
  name?: string
  children: (item: (typeof framerCmsCollections)[number]['items'] extends readonly (infer Item)[] ? Item : never, index: number) => React.ReactNode
  empty?: React.ReactNode
}) {
  const { items } = useFramerCmsCollection({ id: props.id, name: props.name })

  if (items.length === 0) {
    return <>{props.empty ?? null}</>
  }

  return <>{items.map((item, index) => props.children(item as never, index))}</>
}

export function FramerCmsText(props: {
  item?: { fieldData?: Record<string, unknown> }
  field: string
  fallback?: React.ReactNode
  as?: keyof React.JSX.IntrinsicElements
}) {
  const text = getFramerCmsPlainText(props.item, props.field)
  if (!text) return <>{props.fallback ?? null}</>
  const Tag = (props.as ?? 'span') as keyof React.JSX.IntrinsicElements
  return <Tag>{text}</Tag>
}

export function FramerCmsRichText(props: {
  item?: { fieldData?: Record<string, unknown> }
  field: string
  fallback?: React.ReactNode
  as?: keyof React.JSX.IntrinsicElements
}) {
  const html = getFramerCmsFormattedHtml(props.item, props.field)
  if (!html) return <>{props.fallback ?? null}</>
  const Tag = (props.as ?? 'div') as keyof React.JSX.IntrinsicElements
  return <Tag dangerouslySetInnerHTML={{ __html: html }} />
}

export function FramerCmsImage(props: {
  item?: { fieldData?: Record<string, unknown> }
  field: string
  altField?: string
  alt?: string
  fallback?: React.ReactNode
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>) {
  const src = getFramerCmsImageUrl(props.item, props.field)
  if (!src) return <>{props.fallback ?? null}</>
  const alt = props.altField ? getFramerCmsPlainText(props.item, props.altField) ?? '' : props.alt ?? ''
  return <img {...props} src={src} alt={alt} />
}

export function FramerCmsLink(props: {
  item?: { fieldData?: Record<string, unknown> }
  field: string
  labelField?: string
  fallback?: React.ReactNode
  children?: React.ReactNode
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'>) {
  const href = getFramerCmsLinkHref(props.item, props.field)
  if (!href) return <>{props.fallback ?? null}</>
  const label = props.children ?? (props.labelField ? getFramerCmsPlainText(props.item, props.labelField) : href)
  return <a {...props} href={href}>{label}</a>
}

export function FramerCmsField(props: {
  item?: { fieldData?: Record<string, unknown> }
  field: string
  altField?: string
  labelField?: string
  fallback?: React.ReactNode
  textAs?: keyof React.JSX.IntrinsicElements
  richTextAs?: keyof React.JSX.IntrinsicElements
}) {
  const entry = getFramerCmsItemFieldValue(props.item, props.field)
  const type = getFramerCmsFieldType(entry)

  if (type === 'image') {
    return <FramerCmsImage item={props.item} field={props.field} altField={props.altField} fallback={props.fallback} />
  }

  if (type === 'link') {
    return <FramerCmsLink item={props.item} field={props.field} labelField={props.labelField} fallback={props.fallback} />
  }

  if (type === 'formattedText') {
    return <FramerCmsRichText item={props.item} field={props.field} fallback={props.fallback} as={props.richTextAs} />
  }

  if (type === 'color') {
    const value = getFramerCmsDisplayValue(props.item, props.field)
    if (!value || typeof value !== 'string') return <>{props.fallback ?? null}</>
    return <span style={{ display: 'inline-flex', width: '0.875rem', height: '0.875rem', borderRadius: '999px', backgroundColor: value, border: '1px solid rgb(0 0 0 / 0.1)' }} aria-label={value} title={value} />
  }

  return <FramerCmsText item={props.item} field={props.field} fallback={props.fallback} as={props.textAs} />
}

export function FramerCmsCollectionPreview(props: {
  id?: string
  name?: string
  empty?: React.ReactNode
}) {
  const { collection, items, fields } = useFramerCmsCollection({ id: props.id, name: props.name })

  if (!collection || items.length === 0) {
    return <>{props.empty ?? null}</>
  }

  return (
    <section data-framer-cms-preview={collection.name}>
      <header>
        <strong>{collection.name}</strong>
      </header>
      <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0 0', display: 'grid', gap: '0.75rem' }}>
        {items.map((item, index) => (
          <li key={item.id ?? index} style={{ border: '1px solid rgb(0 0 0 / 0.08)', borderRadius: '0.75rem', padding: '0.75rem' }}>
            <dl style={{ margin: 0, display: 'grid', gap: '0.5rem' }}>
              {fields.map((field) => (
                <div key={field.id} style={{ display: 'grid', gap: '0.25rem' }}>
                  <dt style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {field.name}
                  </dt>
                  <dd style={{ margin: 0 }}>
                    <FramerCmsField
                      item={item}
                      field={field.id}
                      labelField={(field.type as string | undefined) === 'link' ? 'title' : undefined}
                      fallback={<span style={{ opacity: 0.56 }}>No value</span>}
                    />
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </section>
  )
}
`;
}
function createCmsSectionsModule(ir) {
    const collections = ir.cmsCollections ?? [];
    const imports = `import * as React from 'react'
import { getFramerCmsCollectionById, getFramerCmsCollectionByName } from './cms'
import {
  FramerCmsCollectionList,
  FramerCmsField,
  FramerCmsImage,
  FramerCmsLink,
  FramerCmsRichText,
  FramerCmsText,
  getFramerCmsItems,
  getFramerCmsPlainText,
} from './cms-runtime'
`;
    const components = collections
        .map((collection) => {
        const componentName = `${toSafeIdentifier(collection.name)}CollectionSection`;
        const titleField = pickCollectionField(collection, ["formattedText", "string"], [
            "title",
            "name",
            "headline",
            "heading",
        ]) ?? pickCollectionField(collection, ["formattedText", "string"]);
        const bodyField = pickCollectionField(collection, ["formattedText", "string"], [
            "summary",
            "description",
            "excerpt",
            "body",
            "content",
        ]) ??
            pickCollectionField(collection, ["formattedText", "string"], [], [
                titleField,
            ]);
        const imageField = pickCollectionField(collection, ["image"], [
            "cover",
            "image",
            "thumbnail",
            "hero",
        ]);
        const linkField = pickCollectionField(collection, ["link"], [
            "link",
            "url",
            "href",
            "cta",
        ]);
        const colorField = pickCollectionField(collection, ["color"], [
            "color",
            "accent",
            "theme",
        ]);
        const metaField = pickCollectionField(collection, ["date", "enum", "string"], [
            "date",
            "published",
            "category",
            "author",
        ], [titleField, bodyField]);
        return `export function ${componentName}(props: {
  title?: React.ReactNode
  empty?: React.ReactNode
}) {
  const collection = getFramerCmsCollectionById(${JSON.stringify(collection.id)}) ?? getFramerCmsCollectionByName(${JSON.stringify(collection.name)})

  return (
    <section data-framer-cms-section=${JSON.stringify(collection.name)} style={{ display: 'grid', gap: '1.25rem' }}>
      <header style={{ display: 'grid', gap: '0.35rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#71717a' }}>
          Framer CMS Collection
        </div>
        <h2 style={{ margin: 0, fontSize: '1.5rem', lineHeight: 1.1 }}>
          {props.title ?? ${JSON.stringify(collection.name)}}
        </h2>
      </header>
      <FramerCmsCollectionList
        id=${JSON.stringify(collection.id)}
        empty={props.empty ?? <div style={{ opacity: 0.64 }}>No items in ${escapeJs(collection.name)}</div>}
      >
        {(item, index) => (
          <article
            key={item.id ?? index}
            style={{
              display: 'grid',
              gap: '0.9rem',
              gridTemplateColumns: ${imageField ? "'minmax(0, 220px) minmax(0, 1fr)'" : "'minmax(0, 1fr)'"},
              padding: '1rem',
              border: '1px solid rgb(24 24 27 / 0.1)',
              borderRadius: '1rem',
              background: 'white',
            }}
          >
            ${imageField
            ? `<FramerCmsImage
              item={item}
              field=${JSON.stringify(imageField)}
              altField=${titleField ? JSON.stringify(titleField) : "undefined"}
              fallback={<div style={{ minHeight: '180px', borderRadius: '0.85rem', background: 'rgb(24 24 27 / 0.06)' }} />}
              style={{ width: '100%', minHeight: '180px', objectFit: 'cover', borderRadius: '0.85rem' }}
            />`
            : ""}
            <div style={{ display: 'grid', gap: '0.7rem', minWidth: 0 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                ${colorField
            ? `<FramerCmsField item={item} field=${JSON.stringify(colorField)} fallback={null} />`
            : ""}
                ${metaField
            ? `<span style={{ fontSize: '0.8rem', color: '#71717a' }}>
                  {getFramerCmsPlainText(item, ${JSON.stringify(metaField)})}
                </span>`
            : ""}
              </div>
              ${titleField
            ? `<FramerCmsText item={item} field=${JSON.stringify(titleField)} as="h3" fallback={<h3 style={{ margin: 0 }}>Untitled item</h3>} />`
            : `<h3 style={{ margin: 0 }}>Untitled item</h3>`}
              ${bodyField
            ? `<FramerCmsField item={item} field=${JSON.stringify(bodyField)} richTextAs="div" textAs="p" fallback={null} />`
            : ""}
              ${linkField
            ? `<div>
                <FramerCmsLink
                  item={item}
                  field=${JSON.stringify(linkField)}
                  labelField=${titleField ? JSON.stringify(titleField) : "undefined"}
                  style={{ color: '#18181b', fontWeight: 700 }}
                >
                  View item
                </FramerCmsLink>
              </div>`
            : ""}
            </div>
          </article>
        )}
      </FramerCmsCollectionList>
    </section>
  )
}`;
    })
        .join("\n\n");
    const registryEntries = collections
        .map((collection) => {
        const componentName = `${toSafeIdentifier(collection.name)}CollectionSection`;
        return `  ${JSON.stringify(collection.name)}: ${componentName},`;
    })
        .join("\n");
    return `${imports}

${components || "export {}"}

export const framerCmsSectionRegistry = {
${registryEntries}
} as const

export function getFramerCmsSectionComponent(name: string) {
  return framerCmsSectionRegistry[name as keyof typeof framerCmsSectionRegistry]
}

export function FramerCmsAutoSections() {
  const collections = [${collections
        .map((collection) => JSON.stringify(collection.name))
        .join(", ")}]
    .map((name) => ({
      name,
      Component: getFramerCmsSectionComponent(name),
      itemCount: getFramerCmsItems({ name }).length,
    }))
    .filter((entry) => entry.itemCount > 0)

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {collections.map((entry) => {
        const Component = entry.Component
        return <Component key={entry.name} />
      })}
    </div>
  )
}
`;
}
function createFramerDataIndexModule(ir) {
    const hasCms = (ir.cmsCollections?.length ?? 0) > 0;
    const hasCodeFiles = (ir.codeFiles?.length ?? 0) > 0;
    const hasModules = (ir.componentModules?.length ?? 0) > 0;
    const hasFamilies = (ir.componentFamilies?.length ?? 0) > 0;
    return `export { framerComponentModules, getFramerComponentModuleByName } from './component-modules'
export {
  framerComponentFamilies,
  getFramerComponentFamilyById,
  getFramerComponentFamilyByName,
} from './component-families'
export { framerComponentRegistry, getFramerRegisteredComponent } from './component-registry'
export {
  FramerComponentFamilyGallery,
  FramerComponentFamilyStateMachine,
  hasFramerComponentFamilies,
} from './component-families-runtime'
export {
  FramerComponentRegistryPreview,
  FramerRegisteredComponentPreview,
  hasFramerRegisteredComponents,
} from './component-runtime'
export { framerCodeFiles, getFramerCodeFileByName } from './code-files'
export {
  FramerCodeFileList,
  FramerCodeFilePreview,
  hasFramerCodeFiles,
} from './code-files-runtime'
export {
  FramerExecutableCodeFilePreview,
  getFramerExecutableCodeFileByName,
  hasFramerExecutableCodeFiles,
} from './code-file-executables'
export {
  framerFontFamilies,
  framerFonts,
  getFramerFontByFamily,
  getFramerFontByName,
} from './fonts'
export { framerCmsCollections, getFramerCmsCollectionById, getFramerCmsCollectionByName } from './cms'
export {
  FramerCmsAutoSections,
  framerCmsSectionRegistry,
  getFramerCmsSectionComponent,
} from './cms-sections'
export {
  FramerCmsCollectionPreview,
  FramerCmsImage,
  FramerCmsCollectionList,
  FramerCmsField,
  FramerCmsLink,
  FramerCmsRichText,
  FramerCmsText,
  getFramerCmsDisplayValue,
  getFramerCmsFieldType,
  getFramerCmsFormattedHtml,
  getFramerCmsImageUrl,
  getFramerCmsItemFieldValue,
  getFramerCmsItems,
  getFramerCmsLinkHref,
  getFramerCmsPlainText,
  mapFramerCmsItems,
  resolveFramerCmsFieldEntry,
  useFramerCmsCollection,
} from './cms-runtime'

export const framerDataSummary = {
  componentModuleCount: ${ir.componentModules?.length ?? 0},
  componentFamilyCount: ${ir.componentFamilies?.length ?? 0},
  codeFileCount: ${ir.codeFiles?.length ?? 0},
  cmsCollectionCount: ${ir.cmsCollections?.length ?? 0},
  hasComponentModules: ${hasModules ? "true" : "false"},
  hasComponentFamilies: ${hasFamilies ? "true" : "false"},
  hasCodeFiles: ${hasCodeFiles ? "true" : "false"},
  hasCmsCollections: ${hasCms ? "true" : "false"},
} as const
`;
}
function createMotionManifest(ir) {
    const nodes = hasUsableExportTree(ir)
        ? flattenExportTree(ir.exportTree ?? [])
        : [];
    const motionNodes = nodes
        .filter((node) => hasMotionStyles(node.motion) || hasInteractionStateStyles(node.interactionStyles))
        .map((node) => ({
        id: node.id,
        tag: node.tag,
        name: node.name,
        text: node.text?.slice(0, 120),
        source: node.source,
        motion: node.motion,
        motionByViewport: node.motionByViewport,
        interactionStyles: node.interactionStyles,
        interactionStylesByViewport: node.interactionStylesByViewport,
    }));
    return {
        componentName: ir.componentName,
        sourceUrl: ir.sourceUrl,
        nodeCount: motionNodes.length,
        nodes: motionNodes,
    };
}
function reactStyleAttribute(node) {
    const entries = styleEntries(node);
    if (entries.length === 0)
        return "";
    return ` style={{ ${entries.map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join(", ")} }}`;
}
function htmlStyleAttribute(node) {
    const css = styleEntries(node)
        .map(([key, value]) => `${toKebabCase(key)}:${escapeAttribute(value)}`)
        .join(";");
    return css ? ` style="${css}"` : "";
}
function styleEntries(node) {
    const allowed = new Set([
        "color",
        "backgroundColor",
        "boxShadow",
        "fontFamily",
        "fontWeight",
        "fontStyle",
        "fontSize",
        "lineHeight",
        "letterSpacing",
        "textAlign",
        "textTransform",
        "textDecoration",
        "opacity",
        "borderRadius",
        "border",
        "width",
        "height",
        "minWidth",
        "minHeight",
        "maxWidth",
        "maxHeight",
        "padding",
        "paddingTop",
        "paddingRight",
        "paddingBottom",
        "paddingLeft",
        "gap",
        "rowGap",
        "columnGap",
        "justifyContent",
        "alignItems",
        "display",
        "flexDirection",
        "flexWrap",
        "top",
        "right",
        "bottom",
        "left",
        "backgroundImage",
        "backgroundPosition",
        "backgroundSize",
        "backgroundRepeat",
        "gridTemplateColumns",
        "gridTemplateRows",
        "transitionProperty",
        "transitionDuration",
        "transitionTimingFunction",
        "transitionDelay",
        "animationName",
        "animationDuration",
        "animationTimingFunction",
        "animationDelay",
        "animationIterationCount",
        "animationDirection",
        "animationFillMode",
        "transformOrigin",
    ]);
    return Object.entries({
        ...node.styles,
        ...(node.motion ?? {}),
    })
        .filter(([key, value]) => allowed.has(key) && Boolean(value))
        .filter(([, value]) => value !== "transparent" && value !== "rgba(0, 0, 0, 0)");
}
function reactTreeStyleAttribute(node) {
    const entries = treeInlineStyleEntries(node);
    if (entries.length === 0)
        return "";
    return ` style={{ ${entries.map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join(", ")} }}`;
}
function htmlTreeStyleAttribute(node) {
    const css = treeInlineStyleEntries(node)
        .map(([key, value]) => `${toKebabCase(key)}:${escapeAttribute(value)}`)
        .join(";");
    return css ? ` style="${css}"` : "";
}
function treeCssAllowedProperties() {
    return new Set([
        "color",
        "backgroundColor",
        "backgroundImage",
        "backgroundBlendMode",
        "backgroundPosition",
        "backgroundSize",
        "backgroundRepeat",
        "background",
        "boxShadow",
        "fontFamily",
        "fontWeight",
        "fontStyle",
        "fontSize",
        "lineHeight",
        "letterSpacing",
        "textAlign",
        "textTransform",
        "textDecoration",
        "opacity",
        "borderRadius",
        "border",
        "width",
        "height",
        "minWidth",
        "minHeight",
        "maxWidth",
        "maxHeight",
        "padding",
        "paddingTop",
        "paddingRight",
        "paddingBottom",
        "paddingLeft",
        "margin",
        "marginTop",
        "marginRight",
        "marginBottom",
        "marginLeft",
        "gap",
        "rowGap",
        "columnGap",
        "justifyContent",
        "alignItems",
        "display",
        "flexDirection",
        "flexWrap",
        "top",
        "right",
        "bottom",
        "left",
        "gridTemplateColumns",
        "gridTemplateRows",
        "gridAutoFlow",
        "gridColumn",
        "gridRow",
        "alignSelf",
        "justifySelf",
        "transform",
        "overflow",
        "overflowX",
        "overflowY",
        "position",
        "objectFit",
        "objectPosition",
        "aspectRatio",
        "placeItems",
        "placeContent",
        "placeSelf",
        "whiteSpace",
        "wordBreak",
        "pointerEvents",
        "zIndex",
        "transitionProperty",
        "transitionDuration",
        "transitionTimingFunction",
        "transitionDelay",
        "animationName",
        "animationDuration",
        "animationTimingFunction",
        "animationDelay",
        "animationIterationCount",
        "animationDirection",
        "animationFillMode",
        "transformOrigin",
        "left",
        "right",
        "top",
        "bottom",
    ]);
}
function treeCssEntries(node, viewport) {
    const sourceStyles = {
        ...((viewport ? node.stylesByViewport?.[viewport] : undefined) ?? node.styles),
        ...((viewport ? node.motionByViewport?.[viewport] : undefined) ?? node.motion),
    };
    const allowed = treeCssAllowedProperties();
    return Object.entries(sourceStyles ?? {})
        .filter(([key, value]) => allowed.has(key) && Boolean(value))
        .filter(([, value]) => value !== "transparent" && value !== "rgba(0, 0, 0, 0)");
}
function styleRuleEntries(styles, baseline = {}) {
    const allowed = treeCssAllowedProperties();
    return Object.entries(styles)
        .filter(([key, value]) => allowed.has(key) && Boolean(value))
        .filter(([key, value]) => baseline[key] !== value)
        .filter(([, value]) => value !== "transparent" && value !== "rgba(0, 0, 0, 0)");
}
function interactionStateEntries(node, state, viewport) {
    const styles = viewport
        ? node.interactionStylesByViewport?.[viewport]?.[state] ??
            node.interactionStyles?.[state]
        : node.interactionStyles?.[state];
    const allowed = treeCssAllowedProperties();
    return Object.entries(styles ?? {})
        .filter(([key, value]) => allowed.has(key) && Boolean(value))
        .filter(([, value]) => value !== "transparent" && value !== "rgba(0, 0, 0, 0)");
}
function interactionStateSelector(node, state) {
    return `${treeCssSelector(node)}${state === "hover" ? ":hover" : ":focus-visible"}`;
}
function createInteractionStateRules(nodes, state) {
    return nodes
        .map((node) => {
        const entries = interactionStateEntries(node, state);
        if (entries.length === 0)
            return "";
        return `${interactionStateSelector(node, state)} {\n${entries
            .map(([key, value]) => `  ${toKebabCase(key)}: ${value};`)
            .join("\n")}\n}`;
    })
        .filter(Boolean)
        .join("\n\n");
}
function createViewportInteractionStateRules(nodes, viewport, state) {
    return nodes
        .map((node) => {
        const viewportEntries = interactionStateEntries(node, state, viewport).filter(([key, value]) => (node.interactionStyles?.[state]?.[key] ?? undefined) !== value);
        if (viewportEntries.length === 0)
            return "";
        return `${interactionStateSelector(node, state)} {\n${viewportEntries
            .map(([key, value]) => `  ${toKebabCase(key)}: ${value};`)
            .join("\n")}\n}`;
    })
        .filter(Boolean)
        .join("\n\n");
}
function treeInlineStyleEntries(node) {
    const forceInline = node.attributes.dataCoderelayForceInlineStyles === true;
    const cssProperties = treeCssAllowedProperties();
    const inlineEntries = Object.entries(node.styles)
        .filter(([key, value]) => Boolean(value) &&
        (forceInline || !cssProperties.has(key)) &&
        !key.startsWith("__coderelay"))
        .filter(([, value]) => value !== "transparent" && value !== "rgba(0, 0, 0, 0)");
    const inlineMotion = forceInline
        ? Object.entries(node.motion ?? {})
            .filter(([, value]) => Boolean(value))
            .filter(([, value]) => value !== "transparent" && value !== "rgba(0, 0, 0, 0)")
        : [];
    return [...inlineEntries, ...inlineMotion];
}
function reactClassName(base, node) {
    const extra = normalizeClassName(node.attributes.className);
    if (!extra)
        return `{${base}}`;
    return `{[${base}, ${JSON.stringify(extra)}].join(' ')}`;
}
function htmlClassName(base, node) {
    const extra = normalizeClassName(node.attributes.className);
    return extra ? `${base} ${extra}` : base;
}
function normalizeClassName(value) {
    if (typeof value !== "string" || !value)
        return "";
    return value.replace(/\s+/g, " ").trim();
}
function reactTreeClassName(node) {
    const base = treeBaseClass(node);
    const unique = treeNodeClass(node);
    const extra = normalizeClassName(typeof node.attributes.className === "string"
        ? node.attributes.className
        : undefined);
    if (!extra)
        return `{[${base}, styles.${unique}].join(' ')}`;
    return `{[${base}, styles.${unique}, ${JSON.stringify(extra)}].join(' ')}`;
}
function htmlTreeClassName(node) {
    const base = treeBaseClass(node).replace(/^styles\./, "");
    const unique = treeNodeClass(node);
    const extra = normalizeClassName(typeof node.attributes.className === "string"
        ? node.attributes.className
        : undefined);
    return extra ? `${base} ${unique} ${extra}` : `${base} ${unique}`;
}
function treeBaseClass(node) {
    if (node.tag === "img")
        return "styles.image";
    if (node.tag === "h1")
        return "styles.heading";
    if (node.tag === "h2" || node.tag === "h3")
        return "styles.subheading";
    if (node.tag === "a")
        return "styles.link";
    if (node.tag === "button")
        return "styles.button";
    if (isTreeTextNode(node))
        return "styles.body";
    return "styles.surface";
}
function treeNodeClass(node) {
    return `node${toSafeIdentifier(stableTreeNodeKey(node))}`;
}
function stableTreeNodeKey(node) {
    const pluginNodeId = node.source.pluginNodeId;
    if (typeof pluginNodeId === "string" && pluginNodeId.length > 0) {
        return pluginNodeId;
    }
    const domPath = node.source.domPath;
    if (typeof domPath === "string" && domPath.length > 0) {
        return domPath;
    }
    return node.id;
}
function isTreeTextNode(node) {
    return (node.kind === "text" ||
        node.tag === "p" ||
        node.tag === "span" ||
        node.tag === "li");
}
function reactTextTag(tag) {
    return new Set([
        "p",
        "span",
        "li",
        "label",
        "strong",
        "em",
        "small",
        "blockquote",
    ]).has(tag)
        ? tag
        : "span";
}
function reactContainerTag(node, depth) {
    if (depth === 0 && node.kind === "component")
        return "section";
    if (node.tag === "section" || node.tag === "main" || node.tag === "article") {
        return node.tag;
    }
    return "div";
}
function htmlContainerTag(node, depth) {
    if (depth === 0 && node.kind === "component")
        return "section";
    if (node.tag === "section" || node.tag === "main" || node.tag === "article") {
        return node.tag;
    }
    return "div";
}
function flattenExportTree(nodes) {
    return nodes.flatMap((node) => [node, ...flattenExportTree(node.children)]);
}
function hasMotionStyles(motion) {
    if (!motion)
        return false;
    return Object.values(motion).some((value) => typeof value === "string" &&
        value.trim().length > 0 &&
        value !== "all 0s ease 0s" &&
        value !== "0s" &&
        value !== "none" &&
        value !== "normal" &&
        value !== "1" &&
        value !== "running");
}
function hasInteractionStateStyles(interactionStyles) {
    if (!interactionStyles)
        return false;
    return ["hover", "focus"].some((state) => {
        const styles = interactionStyles[state];
        return Boolean(styles && Object.values(styles).some((value) => Boolean(value)));
    });
}
function treeCssSelector(node) {
    return `.${treeNodeClass(node)}`;
}
function createViewportOverrideRules(nodes, viewport) {
    return nodes
        .map((node) => {
        if (shouldHideNodeForViewport(node, viewport)) {
            return `${treeCssSelector(node)} {\n  display: none;\n}`;
        }
        const viewportEntries = treeCssEntries(node, viewport).filter(([key, value]) => node.styles[key] !== value);
        if (viewportEntries.length === 0)
            return "";
        return `${treeCssSelector(node)} {\n${viewportEntries
            .map(([key, value]) => `  ${toKebabCase(key)}: ${value};`)
            .join("\n")}\n}`;
    })
        .filter(Boolean)
        .join("\n\n");
}
function shouldHideNodeForViewport(node, viewport) {
    if (viewport === "desktop")
        return false;
    if (hasViewportSnapshot(node, viewport))
        return false;
    return !hasViewportSnapshotInSubtree(node, viewport);
}
function hasViewportSnapshotInSubtree(node, viewport) {
    if (hasViewportSnapshot(node, viewport))
        return true;
    return node.children.some((child) => hasViewportSnapshotInSubtree(child, viewport));
}
function hasViewportSnapshot(node, viewport) {
    if (node.source.runtimeNodeIdsByViewport?.[viewport])
        return true;
    if (node.rectByViewport?.[viewport])
        return true;
    if (node.stylesByViewport?.[viewport])
        return true;
    if (node.motionByViewport?.[viewport])
        return true;
    if (node.interactionStylesByViewport?.[viewport])
        return true;
    return false;
}
function indentCss(css, spaces) {
    const pad = " ".repeat(spaces);
    return css
        .split("\n")
        .map((line) => (line.length > 0 ? `${pad}${line}` : line))
        .join("\n");
}
function toKebabCase(value) {
    return value.replaceAll(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
}
function viewportMediaQuery(viewport, widths) {
    switch (viewport) {
        case "laptop": {
            const minWidth = Math.min(widths.laptop, widths.tablet) + 1;
            return `(min-width: ${minWidth}px) and (max-width: ${widths.laptop}px)`;
        }
        case "tablet": {
            const minWidth = Math.min(widths.tablet, widths.mobile) + 1;
            return `(min-width: ${minWidth}px) and (max-width: ${widths.tablet}px)`;
        }
        case "mobile":
            return `(max-width: ${widths.mobile}px)`;
    }
}
async function formatTsx(source, parser) {
    return prettier.format(source, {
        parser,
        singleQuote: true,
        semi: false,
    });
}
function usableColor(value) {
    if (!value || value === "rgba(0, 0, 0, 0)" || value === "transparent") {
        return undefined;
    }
    return value;
}
function findBackgroundColor(ir, root) {
    const rootColor = usableColor(root?.styles.backgroundColor);
    if (rootColor) {
        return rootColor;
    }
    return (ir.runtimeCapture.nodes
        .map((node) => usableColor(node.styles.backgroundColor))
        .find(Boolean) ?? "#ffffff");
}
function pickCollectionField(collection, types, preferredNames = [], excludedIds = []) {
    const excluded = new Set(excludedIds.filter(Boolean));
    const fields = collection.fields.filter((field) => types.includes(field.type) && !excluded.has(field.id));
    if (fields.length === 0)
        return undefined;
    const preferred = fields.find((field) => preferredNames.some((name) => field.id.toLowerCase() === name || field.name.toLowerCase() === name));
    return preferred?.id ?? fields[0]?.id;
}
function escapeText(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}
function reactTextLiteral(value) {
    return `{${JSON.stringify(value)}}`;
}
function escapeAttribute(value) {
    return escapeText(value).replaceAll('"', "&quot;");
}
function escapeJs(value) {
    return value.replaceAll("\\", "\\\\").replaceAll("'", "\\'");
}
function toSafeIdentifier(value) {
    const cleaned = value
        .replace(/[^a-zA-Z0-9_$]+/g, " ")
        .split(" ")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
    const identifier = cleaned || "FramerModule";
    return /^[A-Za-z_$]/.test(identifier) ? identifier : `Framer${identifier}`;
}
