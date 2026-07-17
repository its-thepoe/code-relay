import slugify from "slugify";
import { classifyRouteDestinationKind, resolveExportRouteMetadata, } from "../../shared/src/route-contract.js";
import { normalizeExportRoutePath, normalizePluginExportRoutes, readRedirectStatusFromRecord, readRedirectTargetFromRecord, } from "./export-routes.js";
export function buildIntermediateRepresentation(input) {
    const contentNodes = promoteFallbackHeading(pickContentNodes(input.runtimeCapture.nodes));
    const componentName = toComponentName(input.name ?? inferName(input.runtimeCapture.title, contentNodes));
    const warnings = [];
    const captureDiagnostics = input.pluginCapture.context?.captureDiagnostics;
    if (captureDiagnostics?.truncated) {
        const truncatedRootIds = captureDiagnostics.truncatedRootIds.join(", ");
        const pageRootTruncated = captureDiagnostics.truncatedRootIds.some((rootId) => captureDiagnostics.rootSummaries.some((summary) => summary.rootId === rootId && summary.rootKind === "page"));
        warnings.push({
            type: "capture_truncated",
            severity: pageRootTruncated ? "error" : "warning",
            message: `Plugin capture was truncated after ${captureDiagnostics.capturedNodeCount} nodes${truncatedRootIds ? `; affected roots: ${truncatedRootIds}` : "."}`,
        });
    }
    const lowConfidenceMatches = input.nodeMatches.filter((match) => match.confidence < 0.45);
    if (lowConfidenceMatches.length > 0 && input.exportMode !== "full-site") {
        warnings.push({
            type: "node_match_low_confidence",
            severity: "warning",
            message: `${lowConfidenceMatches.length} selected nodes had low confidence runtime matches.`,
        });
    }
    if (contentNodes.length === 0) {
        warnings.push({
            type: "layout_approximated",
            severity: "warning",
            message: "No rich content nodes were detected, so the output uses a generic section structure.",
        });
    }
    const runtimeNodesForAssets = input.runtimeCapture.routeCaptures?.flatMap((capture) => capture.nodes) ??
        input.runtimeCapture.nodes;
    const assets = unique(runtimeNodesForAssets
        .filter((node) => node.tag === "img" && node.attributes.src)
        .map((node) => ({
        url: node.attributes.src,
        kind: "image",
        alt: node.attributes.alt,
    })), (asset) => asset.url);
    const libraryComponents = buildLibraryComponents(input, componentName);
    const exportMode = readExportMode(input);
    const componentModules = readComponentModules(input.pluginCapture);
    const componentFamilies = buildComponentFamilies(componentModules);
    const codeFiles = readCodeFiles(input.pluginCapture);
    const overrideAssignments = buildOverrideAssignments(codeFiles);
    const fonts = readFonts(input);
    const cmsCollections = readCmsCollections(input.pluginCapture);
    const framerTree = buildFramerTree(input.pluginCapture);
    const exportTree = exportMode === "full-site"
        ? buildRuntimeExportTree(input.runtimeCapture)
        : buildExportTree(framerTree, input.runtimeCapture, input.nodeMatches);
    const exportEngine = chooseExportEngine({
        exportMode,
        sourceUrl: input.url,
        componentModules,
        pluginCapture: input.pluginCapture,
    });
    const sitePages = exportMode === "full-site"
        ? buildRuntimeSitePages(input, componentName)
        : undefined;
    const routeTemplates = sitePages ? summarizeRouteTemplates(sitePages) : undefined;
    return {
        jobId: `local-${Date.now()}`,
        sourceUrl: input.url,
        componentName,
        exportMode,
        captureMode: resolveCaptureMode(input),
        exportEngine,
        exportProps: readExportProps(input.pluginCapture),
        runtimeCapture: input.runtimeCapture,
        pluginCapture: input.pluginCapture,
        nodeMatches: input.nodeMatches,
        component: {
            semanticType: inferSemanticType(contentNodes),
            nodes: contentNodes,
            sections: groupSections(contentNodes, input.nodeMatches),
        },
        assets,
        framerTree,
        exportTree,
        componentModules,
        componentFamilies,
        overrideAssignments,
        codeFiles,
        fonts,
        cmsCollections,
        libraryComponents,
        sitePages,
        routeTemplates,
        exportTreeDiagnostics: summarizeExportTree(exportTree, input.runtimeCapture),
        warnings,
    };
}
export function buildPluginSourceSnapshot(pluginCapture) {
    const componentModules = readComponentModules(pluginCapture);
    const codeFiles = readCodeFiles(pluginCapture);
    return {
        pluginCapture,
        componentFamilies: buildComponentFamilies(componentModules),
        overrideAssignments: buildOverrideAssignments(codeFiles),
        codeFiles,
    };
}
function buildOverrideAssignments(codeFiles) {
    const assignments = codeFiles.flatMap((file, fileIndex) => (file.exportDetails ?? [])
        .filter((detail) => detail?.type === "override" && detail.name)
        .map((detail, detailIndex) => ({
        id: file.id && detail.name
            ? `${file.id}:${detail.name}`
            : `override-${fileIndex + 1}-${detailIndex + 1}`,
        codeFileId: file.id,
        codeFileName: file.name,
        exportName: detail.name,
        exportType: "override",
        source: "plugin",
        insertURL: detail.insertURL,
        targetNodeId: undefined,
        targetComponentId: detail.componentIdentifier,
        affectedProps: [],
        dependencyNames: [],
        assignmentStatus: "unresolved",
        assignmentConfidence: 0.2,
        unresolvedReason: "plugin-assignment-not-exposed",
    })));
    return unique(assignments, (entry) => entry.id);
}
function buildComponentFamilies(componentModules) {
    const groups = new Map();
    for (const module of componentModules) {
        const familyId = module.componentIdentifier ??
            module.componentName ??
            module.name;
        groups.set(familyId, [...(groups.get(familyId) ?? []), module]);
    }
    return [...groups.entries()].map(([familyId, modules]) => {
        const primaryVariant = modules.find((module) => module.isPrimaryVariant) ??
            modules.find((module) => module.isVariant) ??
            modules[0];
        const variantModules = modules.filter((module) => module.isVariant ||
            Boolean(module.variantName) ||
            Boolean(module.breakpoint) ||
            Boolean(module.gesture));
        const variants = variantModules.length > 0 ? variantModules : [primaryVariant];
        return {
            id: familyId,
            name: primaryVariant.componentName ??
                primaryVariant.componentIdentifier ??
                primaryVariant.name,
            primaryVariantId: primaryVariant.id ?? primaryVariant.name,
            variants: variants.map((module) => ({
                id: module.id ?? module.name,
                name: module.name,
                gesture: module.gesture,
                inheritsFromId: module.inheritsFromId,
                breakpoint: module.breakpoint,
                variantName: module.variantName,
                codeFileId: module.codeFileId,
            })),
            instances: modules
                .filter((module) => module.source === "component-instance" ||
                module.source === "selected-component")
                .map((module) => ({
                nodeId: module.id ?? module.name,
                controls: module.controls,
                initialVariantId: primaryVariant.id ?? primaryVariant.name,
            })),
            transitions: buildComponentFamilyTransitions(variants, primaryVariant),
            provenance: "plugin",
        };
    });
}
function buildComponentFamilyTransitions(variants, primaryVariant) {
    const primaryVariantId = primaryVariant.id ?? primaryVariant.name;
    return variants
        .filter((module) => typeof module.gesture === "string" && module.gesture.length > 0)
        .map((module) => {
        const variantId = module.id ?? module.name;
        const inferredTarget = variantId !== primaryVariantId &&
            (module.inheritsFromId === primaryVariantId ||
                module.inheritsFromId === primaryVariant.name ||
                variants.length === 2)
            ? variantId
            : undefined;
        return {
            fromVariantId: inferredTarget ? primaryVariantId : variantId,
            toVariantId: inferredTarget,
            trigger: module.gesture,
            confidence: inferredTarget ? 0.72 : 0.55,
            provenance: "plugin",
        };
    });
}
function buildRuntimeSitePages(input, fallbackName) {
    const routeCaptures = input.runtimeCapture.routeCaptures ?? [];
    const normalizedRoutes = normalizePluginExportRoutes(input.pluginCapture);
    const normalizedRoutesByPath = new Map(normalizedRoutes.map((route) => [route.path, route]));
    if (routeCaptures.length === 0) {
        const fallback = buildRuntimeFallbackPage(input, fallbackName);
        return [
            {
                ...fallback,
                exportTree: buildRuntimeExportTree(input.runtimeCapture),
                sourceTextLength: runtimeTextLength(input.runtimeCapture.nodes),
            },
        ];
    }
    const usedNames = new Map();
    return routeCaptures.map((capture, index) => {
        const normalizedRoute = normalizedRoutesByPath.get(normalizeExportRoutePath(capture.routePath));
        const title = normalizedRoute?.title ??
            capture.title?.trim() ??
            (capture.routePath === "/" ? "Home" : fallbackName);
        const baseName = toComponentName(title);
        const count = usedNames.get(baseName) ?? 0;
        usedNames.set(baseName, count + 1);
        const nodes = promoteFallbackHeading(pickContentNodes(capture.nodes));
        const destination = capture.destination ??
            capture.redirectTo ??
            normalizedRoute?.destination;
        const routeMetadata = resolveExportRouteMetadata({
            routeKind: capture.routeKind ?? normalizedRoute?.kind,
            destination,
            destinationKind: capture.destinationKind ?? normalizedRoute?.destinationKind,
            redirectTo: capture.redirectTo ?? normalizedRoute?.redirectTo,
            redirectStatus: capture.redirectStatus ?? normalizedRoute?.redirectStatus,
            templateKind: capture.templateKind ?? normalizedRoute?.templateKind,
        });
        const templateKind = routeMetadata.templateKind ??
            inferTemplateKind(capture.routePath);
        return {
            componentName: count === 0 ? baseName : `${baseName}${count + 1}`,
            routePath: capture.routePath,
            title,
            templateId: capture.templateId ??
                normalizedRoute?.templateId ??
                capture.templatePath ??
                normalizedRoute?.templatePath ??
                capture.routePath ??
                `template-${index + 1}`,
            templatePath: capture.templatePath ??
                normalizedRoute?.templatePath ??
                capture.routePath,
            routeKind: routeMetadata.routeKind,
            template: routeMetadata.routeKind === "page"
                ? normalizedRoute?.template
                : undefined,
            templateKind,
            destination: routeMetadata.destination,
            destinationKind: routeMetadata.destinationKind,
            redirectTo: routeMetadata.redirectTo,
            redirectStatus: routeMetadata.redirectStatus,
            nodes: nodes.length > 0
                ? nodes
                : [
                    createComponentPlaceholderNode({ id: `runtime-route-${index + 1}`, path: capture.routePath }, title, index),
                ],
            exportTree: buildRuntimeExportTree(capture),
            sourceTextLength: runtimeTextLength(capture.nodes),
        };
    });
}
function inferTemplateKind(routePath) {
    return routePath.includes(":slug") ? "cms" : "static";
}
function summarizeRouteTemplates(sitePages) {
    const groups = new Map();
    for (const page of sitePages) {
        const templateId = page.templateId ?? page.templatePath ?? page.routePath;
        const templatePath = page.templatePath ?? page.routePath;
        const templateKind = page.templateKind ?? "static";
        const existing = groups.get(templateId);
        const nodeCount = page.exportTree ? countExportTreeNodes(page.exportTree) : page.nodes.length;
        if (!existing) {
            groups.set(templateId, {
                templateId,
                templatePath,
                templateKind,
                routePaths: [page.routePath],
                sourceTextLength: page.sourceTextLength ?? 0,
                nodeCount,
                representativeRoutePath: page.routePath,
            });
            continue;
        }
        existing.routePaths.push(page.routePath);
        existing.sourceTextLength = Math.max(existing.sourceTextLength, page.sourceTextLength ?? 0);
        existing.nodeCount = Math.max(existing.nodeCount, nodeCount);
    }
    return Array.from(groups.values()).map((group) => ({
        ...group,
        routeCount: group.routePaths.length,
    }));
}
function countExportTreeNodes(nodes) {
    return nodes.reduce((total, node) => total + 1 + countExportTreeNodes(node.children ?? []), 0);
}
function readPluginPageForRoute(pages, routePath) {
    if (!Array.isArray(pages))
        return undefined;
    return pages.find((page) => readPageRoutePath(page) === routePath);
}
function runtimeTextLength(nodes) {
    return nodes.reduce((total, node) => total + (node.text?.trim().length ?? 0), 0);
}
function resolveCaptureMode(input) {
    const contextMode = input.pluginCapture.context?.captureMode;
    if (contextMode === "runtime-first" || contextMode === "plugin-only") {
        return contextMode;
    }
    if (input.captureMode === "runtime-first" || input.captureMode === "plugin-only") {
        return input.captureMode;
    }
    return /^https?:\/\//.test(input.url) ? "runtime-first" : "plugin-only";
}
function buildLibraryComponents(input, fallbackName) {
    const context = input.pluginCapture.context;
    const exportMode = readExportMode(input);
    const selectedComponents = Array.isArray(context?.selectedComponents)
        ? context.selectedComponents
        : [];
    const selectedNodes = Array.isArray(input.pluginCapture.selectedNodes)
        ? input.pluginCapture.selectedNodes
        : [];
    const selectedComponentSources = selectedComponents.length > 0
        ? selectedComponents
        : selectedNodes.filter((node) => {
            const metadata = node.metadata && typeof node.metadata === "object"
                ? node.metadata
                : {};
            return metadata.rootKind !== "page";
        });
    if (exportMode === "full-site") {
        return undefined;
    }
    if (exportMode === "selection" && selectedComponents.length === 0) {
        return undefined;
    }
    if (selectedComponentSources.length < 2 &&
        exportMode !== "components") {
        return undefined;
    }
    const usedNames = new Map();
    const componentModules = readComponentModules(input.pluginCapture);
    const output = selectedComponentSources.map((source, index) => {
        const sourceRecord = source;
        const sourceName = typeof sourceRecord.name === "string" && sourceRecord.name.trim()
            ? sourceRecord.name.trim()
            : `${fallbackName} ${index + 1}`;
        const baseName = toComponentName(sourceName);
        const count = usedNames.get(baseName) ?? 0;
        usedNames.set(baseName, count + 1);
        const componentName = count === 0 ? baseName : `${baseName}${count + 1}`;
        const matchingRuntimeNodes = findNodesForSource(input.runtimeCapture.nodes, sourceRecord, sourceName);
        const nodes = promoteFallbackHeading(pickContentNodes(matchingRuntimeNodes));
        const module = findModuleForSource(componentModules, sourceRecord, sourceName);
        return {
            componentName,
            module,
            nodes: nodes.length > 0
                ? nodes
                : [createComponentPlaceholderNode(sourceRecord, sourceName, index)],
        };
    });
    return output.length > 0 ? output : undefined;
}
function findModuleForSource(modules, source, sourceName) {
    const insertURL = typeof source.insertURL === "string" ? source.insertURL : undefined;
    const id = typeof source.id === "string" ? source.id : undefined;
    const identifier = typeof source.componentIdentifier === "string"
        ? source.componentIdentifier
        : undefined;
    return modules.find((module) => {
        if (insertURL && module.insertURL === insertURL)
            return true;
        if (id && module.id === id)
            return true;
        if (identifier && module.componentIdentifier === identifier)
            return true;
        if (module.name === sourceName || module.componentName === sourceName) {
            return true;
        }
        return false;
    });
}
function buildSitePages(input, fallbackName) {
    const context = input.pluginCapture.context;
    const sitePages = Array.isArray(context?.sitePages)
        ? context.sitePages
        : [];
    const namedSitePages = sitePages.filter(hasUsablePageIdentity);
    const pageSources = namedSitePages.length > 0
        ? namedSitePages
        : sitePages.length > 0 && /^https?:\/\//.test(input.url)
            ? []
            : input.runtimeCapture.nodes
                .filter((node) => node.styles.__coderelayRootKind === "page")
                .map((node) => ({
                id: node.styles.__coderelayRootId,
                name: node.sectionName,
            }))
                .filter(hasUsablePageIdentity);
    const uniqueSources = unique(pageSources, (source) => {
        const record = source;
        return typeof record.id === "string" && record.id
            ? record.id
            : String(record.name ?? "");
    });
    if (uniqueSources.length === 0) {
        return [buildRuntimeFallbackPage(input, fallbackName)];
    }
    const usedNames = new Map();
    return uniqueSources.map((source, index) => {
        const sourceRecord = source;
        const title = readPageTitle(sourceRecord) ?? fallbackName;
        const baseName = toComponentName(title);
        const count = usedNames.get(baseName) ?? 0;
        usedNames.set(baseName, count + 1);
        const componentName = count === 0 ? baseName : `${baseName}${count + 1}`;
        const matchingRuntimeNodes = findNodesForSource(input.runtimeCapture.nodes, sourceRecord, title);
        const nodes = promoteFallbackHeading(pickContentNodes(matchingRuntimeNodes));
        const redirectTo = readRedirectTargetFromRecord(sourceRecord);
        const redirectStatus = readRedirectStatusFromRecord(sourceRecord);
        const templateKind = redirectTo
            ? classifyRouteDestinationKind(redirectTo) === "external"
                ? "utility"
                : "redirect"
            : undefined;
        return {
            componentName,
            routePath: readPageRoutePath(sourceRecord) ??
                (index === 0 ? "/" : `/${toRouteSegment(title)}`),
            title,
            routeKind: redirectTo ? "redirect" : "page",
            destination: redirectTo,
            destinationKind: redirectTo
                ? classifyRouteDestinationKind(redirectTo)
                : undefined,
            redirectTo,
            redirectStatus,
            template: redirectTo ? undefined : "static",
            templateKind,
            nodes: nodes.length > 0
                ? nodes
                : [createComponentPlaceholderNode(sourceRecord, title, index)],
        };
    });
}
function buildRuntimeFallbackPage(input, fallbackName) {
    const title = input.runtimeCapture.title?.trim() || fallbackName;
    const nodes = promoteFallbackHeading(pickContentNodes(input.runtimeCapture.nodes));
    return {
        componentName: fallbackName,
        routePath: "/",
        title,
        templateId: "/",
        templatePath: "/",
        routeKind: "page",
        template: "static",
        templateKind: "static",
        nodes: nodes.length > 0
            ? nodes
            : [
                createComponentPlaceholderNode({ id: "runtime-page", type: "Page" }, title || fallbackName, 0),
            ],
    };
}
function hasUsablePageIdentity(source) {
    if (!source || typeof source !== "object")
        return false;
    const record = source;
    return Boolean(readPageTitle(record) || readPageRoutePath(record));
}
function readPageTitle(source) {
    for (const key of [
        "name",
        "title",
        "pageTitle",
        "displayName",
        "slug",
        "path",
        "route",
        "routePath",
        "pathname",
        "pagePath",
    ]) {
        const value = source[key];
        if (typeof value !== "string")
            continue;
        const normalized = normalizePageTitle(value);
        if (normalized)
            return normalized;
    }
    const metadata = asRecord(source.metadata);
    if (metadata) {
        const metadataTitle = readPageTitle(metadata);
        if (metadataTitle)
            return metadataTitle;
    }
    return undefined;
}
function normalizePageTitle(value) {
    const trimmed = value.trim();
    if (!trimmed || /^root\s+\d+$/i.test(trimmed) || /^page\s+\d+$/i.test(trimmed)) {
        return "";
    }
    if (/^https?:\/\//.test(trimmed)) {
        try {
            const url = new URL(trimmed);
            return normalizePageTitle(url.pathname);
        }
        catch {
            return "";
        }
    }
    const withoutQuery = trimmed.split(/[?#]/)[0] ?? "";
    const cleaned = withoutQuery
        .replace(/^\/+|\/+$/g, "")
        .split("/")
        .filter(Boolean)
        .at(-1);
    if (!cleaned)
        return trimmed === "/" ? "Home" : trimmed;
    return cleaned
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
function readPageRoutePath(source) {
    for (const key of ["routePath", "path", "pathname", "pagePath", "route", "slug", "url"]) {
        const value = source[key];
        if (typeof value !== "string" || !value.trim())
            continue;
        const normalized = normalizePageRoutePath(value);
        if (normalized)
            return normalized;
    }
    const metadata = asRecord(source.metadata);
    if (metadata) {
        const route = readPageRoutePath(metadata);
        if (route)
            return route;
    }
    return undefined;
}
function normalizePageRoutePath(value) {
    const trimmed = value.trim();
    if (!trimmed || /^root\s+\d+$/i.test(trimmed) || /^page\s+\d+$/i.test(trimmed)) {
        return "";
    }
    if (/^https?:\/\//.test(trimmed)) {
        try {
            return normalizePageRoutePath(new URL(trimmed).pathname);
        }
        catch {
            return "";
        }
    }
    const withoutQuery = trimmed.split(/[?#]/)[0] ?? "";
    if (withoutQuery === "/" || withoutQuery.toLowerCase() === "home")
        return "/";
    return normalizeExportRoutePath(withoutQuery);
}
function findNodesForSource(nodes, source, sourceName) {
    const sourceId = typeof source.id === "string" ? source.id : undefined;
    return nodes.filter((node) => {
        if (sourceId && node.styles.__coderelayRootId === sourceId)
            return true;
        if (sourceId && node.id === sourceId)
            return true;
        if (node.sectionName === sourceName)
            return true;
        if (node.text === sourceName)
            return true;
        return false;
    });
}
function createComponentPlaceholderNode(source, name, index) {
    const bounds = source.bounds && typeof source.bounds === "object"
        ? source.bounds
        : {};
    const width = typeof bounds.width === "number" ? bounds.width : 320;
    const height = typeof bounds.height === "number" ? bounds.height : 96;
    return {
        id: typeof source.id === "string" ? source.id : `component-${index + 1}`,
        tag: "h1",
        domPath: `plugin > component:nth-child(${index + 1})`,
        text: name,
        sectionIndex: index,
        sectionName: name,
        rect: {
            x: typeof bounds.x === "number" ? bounds.x : 0,
            y: typeof bounds.y === "number" ? bounds.y : index * 120,
            width,
            height,
        },
        attributes: {},
        styles: {
            fontSize: "24px",
            fontWeight: "700",
            lineHeight: "1.1",
            __coderelaySourceId: typeof source.id === "string" ? source.id : "",
            __coderelaySourceType: typeof source.type === "string" ? source.type : "ComponentNode",
        },
    };
}
function promoteFallbackHeading(nodes) {
    if (nodes.some((node) => node.tag === "h1" || node.tag === "h2")) {
        return nodes;
    }
    const headingIndex = nodes.findIndex((node) => {
        const text = node.text?.trim();
        if (!text)
            return false;
        if (text.length < 8 || text.length > 120)
            return false;
        if (/^(by|anonymous)$/i.test(text))
            return false;
        if (/^(lorem ipsum\b)/i.test(text))
            return false;
        return true;
    });
    if (headingIndex < 0)
        return nodes;
    return nodes.map((node, index) => index === headingIndex ? { ...node, tag: "h1" } : node);
}
function readExportProps(pluginCapture) {
    if (pluginCapture.exportProps) {
        const heroTitle = typeof pluginCapture.exportProps.heroTitle === "string"
            ? pluginCapture.exportProps.heroTitle
            : undefined;
        const heroSubtitle = typeof pluginCapture.exportProps.heroSubtitle === "string"
            ? pluginCapture.exportProps.heroSubtitle
            : undefined;
        const ctaLabel = typeof pluginCapture.exportProps.ctaLabel === "string"
            ? pluginCapture.exportProps.ctaLabel
            : undefined;
        const ctaHref = typeof pluginCapture.exportProps.ctaHref === "string"
            ? pluginCapture.exportProps.ctaHref
            : undefined;
        if (heroTitle || heroSubtitle || ctaLabel || ctaHref) {
            return { heroTitle, heroSubtitle, ctaLabel, ctaHref };
        }
    }
    const meta = pluginCapture.selectedNodes[0]?.metadata;
    if (!meta || typeof meta !== "object")
        return undefined;
    const exportProps = meta.exportProps;
    if (!exportProps || typeof exportProps !== "object")
        return undefined;
    const heroTitle = typeof exportProps.heroTitle === "string"
        ? exportProps.heroTitle
        : undefined;
    const heroSubtitle = typeof exportProps.heroSubtitle === "string"
        ? exportProps.heroSubtitle
        : undefined;
    const ctaLabel = typeof exportProps.ctaLabel === "string" ? exportProps.ctaLabel : undefined;
    const ctaHref = typeof exportProps.ctaHref === "string" ? exportProps.ctaHref : undefined;
    if (!heroTitle && !heroSubtitle && !ctaLabel && !ctaHref)
        return undefined;
    return { heroTitle, heroSubtitle, ctaLabel, ctaHref };
}
function readExportMode(input) {
    const contextMode = input.pluginCapture.context?.exportMode;
    if (contextMode === "full-site")
        return "full-site";
    if (contextMode === "components")
        return "components";
    if (input.exportMode === "full-site" || input.exportMode === "components") {
        return input.exportMode;
    }
    return "selection";
}
function chooseExportEngine(input) {
    const hasPublishedRuntime = /^https?:\/\//.test(input.sourceUrl);
    if (input.exportMode === "full-site" && hasPublishedRuntime) {
        return "published-runtime";
    }
    const contextEngine = input.pluginCapture.context?.exportEngine;
    if (contextEngine === "component-module" ||
        contextEngine === "page-node-tree" ||
        contextEngine === "published-runtime" ||
        contextEngine === "hybrid" ||
        contextEngine === "plugin-approximation") {
        return contextEngine;
    }
    if (input.exportMode === "components" && input.componentModules.length > 0) {
        return "component-module";
    }
    if (input.exportMode === "full-site")
        return "page-node-tree";
    if (hasPublishedRuntime)
        return "published-runtime";
    return input.componentModules.length > 0
        ? "component-module"
        : "plugin-approximation";
}
function readComponentModules(pluginCapture) {
    const contextModules = Array.isArray(pluginCapture.context?.componentModules)
        ? pluginCapture.context.componentModules
        : [];
    const nodeModules = pluginCapture.selectedNodes
        .map((node) => {
        const metadata = node.metadata && typeof node.metadata === "object"
            ? node.metadata
            : {};
        const component = metadata.component && typeof metadata.component === "object"
            ? metadata.component
            : undefined;
        if (!component)
            return null;
        const insertURL = typeof component.insertURL === "string" ? component.insertURL : "";
        if (!insertURL)
            return null;
        return {
            id: typeof component.id === "string" ? component.id : node.id,
            name: typeof component.name === "string" && component.name.trim()
                ? component.name.trim()
                : node.name ?? "FramerComponent",
            source: component.source === "component-instance" ||
                component.source === "component-node" ||
                component.source === "selected-component" ||
                component.source === "code-file-export"
                ? component.source
                : "selected-component",
            insertURL,
            componentIdentifier: typeof component.componentIdentifier === "string"
                ? component.componentIdentifier
                : undefined,
            componentName: typeof component.componentName === "string"
                ? component.componentName
                : undefined,
            isVariant: typeof component.isVariant === "boolean"
                ? component.isVariant
                : undefined,
            isPrimaryVariant: typeof component.isPrimaryVariant === "boolean"
                ? component.isPrimaryVariant
                : undefined,
            gesture: typeof component.gesture === "string" ? component.gesture : undefined,
            inheritsFromId: typeof component.inheritsFromId === "string"
                ? component.inheritsFromId
                : undefined,
            breakpoint: typeof component.breakpoint === "string"
                ? component.breakpoint
                : undefined,
            variantName: typeof component.variantName === "string"
                ? component.variantName
                : undefined,
            controls: asRecord(component.controls),
            typedControls: asRecord(component.typedControls),
        };
    })
        .filter(Boolean);
    // Framer can surface the same component through context, instances, and
    // code exports. Codegen uses this normalized name for files and imports, so
    // duplicates would otherwise produce invalid TypeScript.
    return unique([...contextModules, ...nodeModules], (module) => componentModuleCodegenIdentity(module.name));
}
function componentModuleCodegenIdentity(value) {
    return (value
        .replace(/[^a-zA-Z0-9_$]+/g, " ")
        .split(" ")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("") || "FramerModule");
}
function readCodeFiles(pluginCapture) {
    const contextFiles = Array.isArray(pluginCapture.context?.codeFiles)
        ? pluginCapture.context.codeFiles
        : [];
    const normalized = contextFiles
        .map((entry) => {
        if (!entry || typeof entry !== "object")
            return null;
        const record = entry;
        const name = typeof record.name === "string" && record.name.trim()
            ? record.name.trim()
            : typeof record.path === "string" && record.path.trim()
                ? record.path.trim().split("/").at(-1) ?? "CodeFile"
                : "CodeFile";
        const exports = Array.isArray(record.exports)
            ? record.exports.filter((value) => typeof value === "string")
            : [];
        return {
            id: typeof record.id === "string" ? record.id : undefined,
            name,
            path: typeof record.path === "string" ? record.path : undefined,
            versionId: typeof record.versionId === "string" ? record.versionId : undefined,
            exports: exports.length > 0 ? exports : undefined,
            exportDetails: Array.isArray(record.exportDetails)
                ? record.exportDetails
                    .map((detail) => {
                    if (!detail || typeof detail !== "object")
                        return null;
                    const exportRecord = detail;
                    return {
                        name: typeof exportRecord.name === "string"
                            ? exportRecord.name
                            : undefined,
                        type: typeof exportRecord.type === "string"
                            ? exportRecord.type
                            : undefined,
                        insertURL: typeof exportRecord.insertURL === "string"
                            ? exportRecord.insertURL
                            : undefined,
                        isDefaultExport: typeof exportRecord.isDefaultExport === "boolean"
                            ? exportRecord.isDefaultExport
                            : undefined,
                        componentIdentifier: typeof exportRecord.componentIdentifier === "string"
                            ? exportRecord.componentIdentifier
                            : undefined,
                        componentName: typeof exportRecord.componentName === "string"
                            ? exportRecord.componentName
                            : undefined,
                        isVariant: typeof exportRecord.isVariant === "boolean"
                            ? exportRecord.isVariant
                            : undefined,
                        isPrimaryVariant: typeof exportRecord.isPrimaryVariant === "boolean"
                            ? exportRecord.isPrimaryVariant
                            : undefined,
                        gesture: typeof exportRecord.gesture === "string"
                            ? exportRecord.gesture
                            : undefined,
                        inheritsFromId: typeof exportRecord.inheritsFromId === "string"
                            ? exportRecord.inheritsFromId
                            : undefined,
                        breakpoint: typeof exportRecord.breakpoint === "string"
                            ? exportRecord.breakpoint
                            : undefined,
                        variantName: typeof exportRecord.variantName === "string"
                            ? exportRecord.variantName
                            : undefined,
                    };
                })
                    .filter(Boolean)
                : undefined,
            isDefaultExport: typeof record.isDefaultExport === "boolean"
                ? record.isDefaultExport
                : undefined,
            insertURL: typeof record.insertURL === "string" ? record.insertURL : undefined,
            source: typeof record.source === "string" ? record.source : undefined,
            content: typeof record.content === "string" ? record.content : undefined,
            contentHash: typeof record.contentHash === "string"
                ? record.contentHash
                : undefined,
            contentByteLength: typeof record.contentByteLength === "number"
                ? record.contentByteLength
                : undefined,
            hasContent: typeof record.hasContent === "boolean"
                ? record.hasContent
                : undefined,
        };
    })
        .filter(Boolean);
    return unique(normalized, (entry) => entry.id ?? `${entry.name}:${entry.path ?? ""}`);
}
function readFonts(input) {
    const pluginFonts = Array.isArray(input.pluginCapture.context?.fonts)
        ? input.pluginCapture.context.fonts
            .map((entry) => {
            if (!entry || typeof entry !== "object")
                return null;
            const record = entry;
            const family = typeof record.family === "string" && record.family.trim()
                ? record.family.trim()
                : typeof record.name === "string" && record.name.trim()
                    ? record.name.trim()
                    : undefined;
            if (!family)
                return null;
            return {
                id: typeof record.id === "string" ? record.id : undefined,
                name: typeof record.name === "string" && record.name.trim()
                    ? record.name.trim()
                    : family,
                family,
                source: "plugin",
                weight: typeof record.weight === "string" ? record.weight : undefined,
                style: typeof record.style === "string" ? record.style : undefined,
            };
        })
            .filter(isNonNullable)
        : [];
    const runtimeFonts = unique(input.runtimeCapture.nodes
        .map((node) => node.styles.fontFamily?.trim())
        .filter((value) => Boolean(value))
        .map((family) => ({
        name: firstFontFamily(family),
        family,
        source: "runtime",
    })), (entry) => entry.family);
    return unique([...pluginFonts, ...runtimeFonts], (entry) => entry.family);
}
function readCmsCollections(pluginCapture) {
    const contextCollections = Array.isArray(pluginCapture.context?.cmsCollections)
        ? pluginCapture.context.cmsCollections
        : [];
    const normalized = contextCollections
        .map((entry) => {
        if (!entry || typeof entry !== "object")
            return null;
        const record = entry;
        const rawFields = Array.isArray(record.fields) ? record.fields : [];
        const rawItems = Array.isArray(record.items) ? record.items : [];
        const pluginData = record.pluginData && typeof record.pluginData === "object"
            ? record.pluginData
            : undefined;
        const fields = rawFields
            .map((field) => {
            if (!field || typeof field !== "object")
                return null;
            const fieldRecord = field;
            const id = typeof fieldRecord.id === "string" && fieldRecord.id.trim()
                ? fieldRecord.id.trim()
                : undefined;
            const name = typeof fieldRecord.name === "string" && fieldRecord.name.trim()
                ? fieldRecord.name.trim()
                : undefined;
            const type = typeof fieldRecord.type === "string" && fieldRecord.type.trim()
                ? fieldRecord.type.trim()
                : undefined;
            if (!id || !name || !type)
                return null;
            return {
                id,
                name,
                type,
                userEditable: typeof fieldRecord.userEditable === "boolean"
                    ? fieldRecord.userEditable
                    : undefined,
                collectionId: typeof fieldRecord.collectionId === "string"
                    ? fieldRecord.collectionId
                    : undefined,
                cases: Array.isArray(fieldRecord.cases)
                    ? fieldRecord.cases
                        .map((value) => {
                        if (!value || typeof value !== "object")
                            return null;
                        const caseRecord = value;
                        if (typeof caseRecord.id === "string" &&
                            typeof caseRecord.name === "string") {
                            return { id: caseRecord.id, name: caseRecord.name };
                        }
                        return null;
                    })
                        .filter(Boolean)
                    : undefined,
            };
        })
            .filter(isNonNullable);
        const items = rawItems
            .map((item) => {
            if (!item || typeof item !== "object")
                return null;
            const itemRecord = item;
            const id = typeof itemRecord.id === "string" && itemRecord.id.trim()
                ? itemRecord.id.trim()
                : undefined;
            if (!id)
                return null;
            const fieldData = itemRecord.fieldData && typeof itemRecord.fieldData === "object"
                ? itemRecord.fieldData
                : {};
            return {
                id,
                slug: typeof itemRecord.slug === "string" ? itemRecord.slug : undefined,
                draft: typeof itemRecord.draft === "boolean"
                    ? itemRecord.draft
                    : undefined,
                fieldKeys: Object.keys(fieldData),
                fieldData,
            };
        })
            .filter(isNonNullable);
        const id = typeof record.id === "string" && record.id.trim()
            ? record.id.trim()
            : undefined;
        const name = typeof record.name === "string" && record.name.trim()
            ? record.name.trim()
            : undefined;
        if (!id || !name)
            return null;
        return {
            id,
            name,
            managed: typeof record.managed === "boolean" ? record.managed : undefined,
            pluginData: pluginData && Object.keys(pluginData).length > 0
                ? Object.fromEntries(Object.entries(pluginData).filter((entry) => typeof entry[0] === "string" &&
                    entry[0].trim().length > 0 &&
                    typeof entry[1] === "string"))
                : undefined,
            pluginDataKeys: pluginData ? Object.keys(pluginData) : undefined,
            itemIds: Array.isArray(record.itemIds)
                ? record.itemIds.filter((itemId) => typeof itemId === "string" && itemId.trim().length > 0)
                : undefined,
            fields,
            items: items.length > 0 ? items : undefined,
        };
    })
        .filter(Boolean);
    return unique(normalized, (entry) => entry.id);
}
function isNonNullable(value) {
    return value != null;
}
function firstFontFamily(value) {
    return value
        .split(",")[0]
        ?.replace(/^["']|["']$/g, "")
        .trim() || value.trim();
}
function buildFramerTree(pluginCapture) {
    const contextTree = Array.isArray(pluginCapture.context?.framerTree)
        ? pluginCapture.context.framerTree
        : [];
    if (contextTree.length > 0)
        return contextTree;
    return pluginCapture.selectedNodes.map((node, index) => {
        const metadata = node.metadata && typeof node.metadata === "object"
            ? node.metadata
            : {};
        const traits = asRecord(metadata.traits) ?? {};
        const styles = asStringRecord(metadata.styles);
        const component = asRecord(metadata.component);
        const childIds = Array.isArray(metadata.childIds)
            ? metadata.childIds.filter((id) => typeof id === "string")
            : [];
        return {
            id: node.id ?? `plugin-node-${index + 1}`,
            type: node.type ?? "UnknownNode",
            name: node.name,
            text: node.text,
            parentId: typeof metadata.parentId === "string" ? metadata.parentId : undefined,
            childIds,
            depth: typeof metadata.depth === "number" ? metadata.depth : 0,
            path: typeof metadata.path === "string" ? metadata.path : String(index + 1),
            rootId: typeof metadata.rootId === "string" ? metadata.rootId : undefined,
            rootName: typeof metadata.rootName === "string" ? metadata.rootName : undefined,
            rootKind: metadata.rootKind === "page" ||
                metadata.rootKind === "component" ||
                metadata.rootKind === "canvas-root"
                ? metadata.rootKind
                : undefined,
            rect: node.bounds,
            traits,
            styles,
            asset: typeof metadata.src === "string"
                ? {
                    kind: "image",
                    src: metadata.src,
                    alt: typeof metadata.alt === "string" ? metadata.alt : undefined,
                }
                : undefined,
            component: component
                ? {
                    id: typeof component.id === "string" ? component.id : undefined,
                    name: typeof component.name === "string"
                        ? component.name
                        : node.name ?? "FramerComponent",
                    source: component.source === "component-instance" ||
                        component.source === "component-node" ||
                        component.source === "selected-component" ||
                        component.source === "code-file-export"
                        ? component.source
                        : undefined,
                    insertURL: typeof component.insertURL === "string"
                        ? component.insertURL
                        : "",
                    componentIdentifier: typeof component.componentIdentifier === "string"
                        ? component.componentIdentifier
                        : undefined,
                    componentName: typeof component.componentName === "string"
                        ? component.componentName
                        : undefined,
                    controls: asRecord(component.controls),
                    typedControls: asRecord(component.typedControls),
                }
                : undefined,
        };
    });
}
function asRecord(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return undefined;
    }
    return value;
}
function asStringRecord(value) {
    const record = asRecord(value);
    if (!record)
        return {};
    const output = {};
    for (const [key, entry] of Object.entries(record)) {
        if (typeof entry === "string")
            output[key] = entry;
    }
    return output;
}
function buildExportTree(framerTree, runtimeCapture, matches) {
    const runtimeByDomPath = new Map(runtimeCapture.nodes.map((node) => [node.domPath, node]));
    const matchByPluginId = new Map(matches
        .filter((match) => match.framerNodeId)
        .map((match) => [match.framerNodeId, match]));
    const pluginById = new Map(framerTree.map((node) => [node.id, node]));
    const childIdsByParent = new Map();
    const hasPluginHierarchy = framerTree.some((node) => Boolean(node.parentId) ||
        (Array.isArray(node.childIds) && node.childIds.length > 0));
    if (!hasPluginHierarchy && runtimeCapture.nodes.length > 0) {
        return buildRuntimeExportTree(runtimeCapture);
    }
    for (const node of framerTree) {
        if (!node.parentId)
            continue;
        childIdsByParent.set(node.parentId, [
            ...(childIdsByParent.get(node.parentId) ?? []),
            node.id,
        ]);
    }
    const rootPluginNodes = framerTree.filter((node) => !node.parentId || !pluginById.has(node.parentId));
    const usedRuntimeDomPaths = new Set();
    const buildNode = (pluginNode) => {
        const match = matchByPluginId.get(pluginNode.id);
        const runtimeNode = match?.domPath
            ? runtimeByDomPath.get(match.domPath)
            : undefined;
        if (match?.domPath)
            usedRuntimeDomPaths.add(match.domPath);
        const viewportSnapshots = collectViewportSnapshots(runtimeCapture, match?.domPath);
        const childIds = childIdsByParent.get(pluginNode.id) ?? pluginNode.childIds;
        const children = childIds
            .map((childId) => pluginById.get(childId))
            .filter(Boolean)
            .map((child) => buildNode(child));
        const tag = runtimeNode?.tag ?? inferTagFromPluginNode(pluginNode);
        return {
            id: pluginNode.id,
            parentId: pluginNode.parentId,
            childIds: children.map((child) => child.id),
            name: pluginNode.name ?? runtimeNode?.sectionName,
            text: sanitizeRuntimeTextForTag(tag, pluginNode.text ?? runtimeNode?.text),
            kind: inferExportTreeKind(pluginNode, runtimeNode),
            tag,
            rect: runtimeNode?.rect ?? pluginNode.rect,
            rectByViewport: viewportSnapshots.rectByViewport,
            styles: {
                ...pluginNode.styles,
                ...(runtimeNode?.styles ?? {}),
            },
            stylesByViewport: viewportSnapshots.stylesByViewport,
            motion: runtimeNode?.motion,
            motionByViewport: viewportSnapshots.motionByViewport,
            interactionStyles: runtimeNode?.interactionStyles,
            interactionStylesByViewport: viewportSnapshots.interactionStylesByViewport,
            attributes: {
                src: runtimeNode?.attributes.src ?? pluginNode.asset?.src,
                href: runtimeNode?.attributes.href,
                alt: runtimeNode?.attributes.alt ?? pluginNode.asset?.alt,
                role: runtimeNode?.attributes.role,
                className: runtimeNode?.attributes.className,
                dataFramerName: runtimeNode?.attributes.dataFramerName,
            },
            source: {
                pluginNodeId: pluginNode.id,
                runtimeNodeId: runtimeNode?.id,
                domPath: runtimeNode?.domPath,
                matchConfidence: match?.confidence,
                runtimeNodeIdsByViewport: viewportSnapshots.runtimeNodeIdsByViewport,
            },
            children,
        };
    };
    const pluginRoots = rootPluginNodes.map(buildNode);
    const unmatchedRuntimeRoots = runtimeCapture.nodes
        .filter((runtimeNode) => !usedRuntimeDomPaths.has(runtimeNode.domPath))
        .filter((runtimeNode) => isLikelyRuntimeRoot(runtimeNode))
        .slice(0, 40)
        .map((runtimeNode, index) => ({
        id: `runtime-root-${index + 1}`,
        childIds: [],
        name: runtimeNode.sectionName,
        text: sanitizeRuntimeTextForTag(runtimeNode.tag, runtimeNode.text),
        kind: inferRuntimeKind(runtimeNode),
        tag: runtimeNode.tag,
        rect: runtimeNode.rect,
        rectByViewport: collectViewportSnapshots(runtimeCapture, runtimeNode.domPath).rectByViewport,
        styles: { ...runtimeNode.styles },
        stylesByViewport: collectViewportSnapshots(runtimeCapture, runtimeNode.domPath).stylesByViewport,
        motion: runtimeNode.motion,
        motionByViewport: collectViewportSnapshots(runtimeCapture, runtimeNode.domPath).motionByViewport,
        interactionStyles: runtimeNode.interactionStyles,
        interactionStylesByViewport: collectViewportSnapshots(runtimeCapture, runtimeNode.domPath).interactionStylesByViewport,
        attributes: {
            src: runtimeNode.attributes.src,
            href: runtimeNode.attributes.href,
            alt: runtimeNode.attributes.alt,
            role: runtimeNode.attributes.role,
            className: runtimeNode.attributes.className,
            dataFramerName: runtimeNode.attributes.dataFramerName,
        },
        source: {
            runtimeNodeId: runtimeNode.id,
            domPath: runtimeNode.domPath,
            runtimeNodeIdsByViewport: collectViewportSnapshots(runtimeCapture, runtimeNode.domPath).runtimeNodeIdsByViewport,
        },
        children: [],
    }));
    return [...pluginRoots, ...unmatchedRuntimeRoots];
}
function buildRuntimeExportTree(runtimeCapture) {
    const runtimeByDomPath = new Map(runtimeCapture.nodes.map((node) => [node.domPath, node]));
    const childrenByDomPath = new Map();
    const roots = [];
    for (const node of runtimeCapture.nodes) {
        const parentPath = node.parentDomPath && runtimeByDomPath.has(node.parentDomPath)
            ? node.parentDomPath
            : nearestCapturedParentDomPath(node.domPath, runtimeByDomPath);
        const parent = parentPath ? runtimeByDomPath.get(parentPath) : undefined;
        if (!parent || !parentPath) {
            roots.push(node);
            continue;
        }
        childrenByDomPath.set(parentPath, [
            ...(childrenByDomPath.get(parentPath) ?? []),
            node,
        ]);
    }
    const buildNode = (runtimeNode) => {
        const children = (childrenByDomPath.get(runtimeNode.domPath) ?? []).map(buildNode);
        const snapshots = collectViewportSnapshots(runtimeCapture, runtimeNode.domPath);
        return {
            id: runtimeNode.id,
            parentId: parentDomPath(runtimeNode.domPath),
            childIds: children.map((child) => child.id),
            name: runtimeNode.sectionName,
            text: sanitizeRuntimeTextForTag(runtimeNode.tag, runtimeNode.text),
            kind: inferRuntimeKind(runtimeNode),
            tag: runtimeNode.tag,
            rect: runtimeNode.rect,
            rectByViewport: snapshots.rectByViewport,
            styles: { ...runtimeNode.styles },
            stylesByViewport: snapshots.stylesByViewport,
            motion: runtimeNode.motion,
            motionByViewport: snapshots.motionByViewport,
            interactionStyles: runtimeNode.interactionStyles,
            interactionStylesByViewport: snapshots.interactionStylesByViewport,
            attributes: {
                src: runtimeNode.attributes.src,
                href: runtimeNode.attributes.href,
                alt: runtimeNode.attributes.alt,
                role: runtimeNode.attributes.role,
                className: runtimeNode.attributes.className,
                dataFramerName: runtimeNode.attributes.dataFramerName,
            },
            source: {
                runtimeNodeId: runtimeNode.id,
                domPath: runtimeNode.domPath,
                runtimeNodeIdsByViewport: snapshots.runtimeNodeIdsByViewport,
            },
            children,
        };
    };
    return roots.map(buildNode);
}
function nearestCapturedParentDomPath(domPath, runtimeByDomPath) {
    let current = parentDomPath(domPath);
    while (current) {
        if (runtimeByDomPath.has(current))
            return current;
        current = parentDomPath(current);
    }
    return undefined;
}
function parentDomPath(domPath) {
    const index = domPath.lastIndexOf(" > ");
    if (index < 0)
        return undefined;
    return domPath.slice(0, index);
}
function collectViewportSnapshots(runtimeCapture, domPath) {
    const rectByViewport = {};
    const stylesByViewport = {};
    const motionByViewport = {};
    const interactionStylesByViewport = {};
    const runtimeNodeIdsByViewport = {};
    if (!domPath) {
        return {
            rectByViewport,
            stylesByViewport,
            motionByViewport,
            interactionStylesByViewport,
            runtimeNodeIdsByViewport,
        };
    }
    const nodesByViewport = runtimeCapture.nodesByViewport ?? {};
    for (const [viewportName, nodes] of Object.entries(nodesByViewport)) {
        const matchedNode = nodes?.find((node) => node.domPath === domPath);
        if (!matchedNode)
            continue;
        rectByViewport[viewportName] = matchedNode.rect;
        stylesByViewport[viewportName] = {
            ...matchedNode.styles,
        };
        if (matchedNode.motion) {
            motionByViewport[viewportName] = {
                ...matchedNode.motion,
            };
        }
        if (matchedNode.interactionStyles) {
            interactionStylesByViewport[viewportName] = {
                ...(matchedNode.interactionStyles.hover
                    ? { hover: { ...matchedNode.interactionStyles.hover } }
                    : {}),
                ...(matchedNode.interactionStyles.focus
                    ? { focus: { ...matchedNode.interactionStyles.focus } }
                    : {}),
            };
        }
        runtimeNodeIdsByViewport[viewportName] =
            matchedNode.id;
    }
    return {
        rectByViewport,
        stylesByViewport,
        motionByViewport,
        interactionStylesByViewport,
        runtimeNodeIdsByViewport,
    };
}
function inferExportTreeKind(pluginNode, runtimeNode) {
    if (pluginNode.asset?.kind === "image" || runtimeNode?.tag === "img") {
        return "image";
    }
    if (runtimeNode?.tag === "a")
        return "link";
    if (runtimeNode?.tag === "button")
        return "button";
    if (pluginNode.type === "SVGNode")
        return "svg";
    if (pluginNode.type === "ComponentNode")
        return "component";
    if (pluginNode.type === "TextNode")
        return "text";
    if (pluginNode.type === "FrameNode")
        return "frame";
    return "unknown";
}
function inferRuntimeKind(runtimeNode) {
    if (runtimeNode.tag === "img")
        return "image";
    if (runtimeNode.tag === "a")
        return "link";
    if (runtimeNode.tag === "button")
        return "button";
    if (sanitizeRuntimeTextForTag(runtimeNode.tag, runtimeNode.text)) {
        return "text";
    }
    return "frame";
}
function normalizeRuntimeText(text) {
    if (!text)
        return undefined;
    const normalized = text.trim().replace(/\s+/g, " ").slice(0, 500);
    return normalized.length > 0 ? normalized : undefined;
}
function sanitizeRuntimeTextForTag(tag, text) {
    if (!isTextBearingRuntimeTag(tag))
        return undefined;
    return normalizeRuntimeText(text);
}
function isTextBearingRuntimeTag(tag) {
    return new Set([
        "p",
        "span",
        "li",
        "a",
        "button",
        "label",
        "strong",
        "em",
        "small",
        "blockquote",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
    ]).has(tag);
}
function inferTagFromPluginNode(pluginNode) {
    if (pluginNode.asset?.kind === "image")
        return "img";
    if (pluginNode.type === "TextNode")
        return "p";
    if (pluginNode.type === "SVGNode")
        return "svg";
    if (pluginNode.type === "ComponentNode")
        return "section";
    return "div";
}
function isLikelyRuntimeRoot(node) {
    return (node.rect.width > 120 &&
        node.rect.height > 80 &&
        (Boolean(node.sectionName) ||
            Boolean(node.styles.backgroundColor) ||
            node.tag === "section" ||
            node.tag === "main"));
}
function summarizeExportTree(exportTree, runtimeCapture) {
    const flattened = flattenExportTree(exportTree);
    const matchedRuntimePaths = new Set(flattened
        .map((node) => node.source.domPath)
        .filter((value) => typeof value === "string"));
    return {
        totalNodes: flattened.length,
        pluginBackedNodes: flattened.filter((node) => node.source.pluginNodeId).length,
        runtimeMatchedNodes: flattened.filter((node) => node.source.runtimeNodeId).length,
        unmatchedRuntimeNodes: runtimeCapture.nodes.filter((node) => !matchedRuntimePaths.has(node.domPath)).length,
        breakpointsWithSnapshots: runtimeCapture.captureDiagnostics?.breakpointsCaptured ?? ["desktop"],
    };
}
function flattenExportTree(nodes) {
    return nodes.flatMap((node) => [node, ...flattenExportTree(node.children)]);
}
function pickContentNodes(nodes) {
    const usefulTags = new Set([
        "h1",
        "h2",
        "h3",
        "p",
        "a",
        "button",
        "img",
        "span",
        "li",
    ]);
    const seenText = new Set();
    const selected = [];
    for (const node of nodes) {
        if (!usefulTags.has(node.tag) && !isVisualSurfaceNode(node)) {
            continue;
        }
        if (isVisualSurfaceNode(node)) {
            selected.push(node);
            continue;
        }
        if (node.tag === "img" && node.attributes.src) {
            selected.push(node);
            continue;
        }
        const text = node.text?.trim();
        if (!text || text.length < 2 || seenText.has(text)) {
            continue;
        }
        seenText.add(text);
        selected.push(node);
    }
    return selected.slice(0, 160);
}
function isVisualSurfaceNode(node) {
    if (node.text?.trim())
        return false;
    if (node.tag === "img" || node.tag === "a" || node.tag === "button") {
        return false;
    }
    return Boolean(node.styles.backgroundColor ||
        node.styles.backgroundImage ||
        node.styles.border ||
        node.styles.borderRadius ||
        node.styles.boxShadow);
}
function groupSections(nodes, matches) {
    const grouped = new Map();
    for (const node of nodes) {
        const index = node.sectionIndex ?? 0;
        grouped.set(index, [...(grouped.get(index) ?? []), node]);
    }
    const sections = Array.from(grouped.entries()).map(([index, sectionNodes], sectionNumber) => ({
        index,
        name: sectionNodes[0]?.sectionName ?? `Section ${sectionNumber + 1}`,
        kind: inferSectionKind(sectionNodes, sectionNumber),
        confidence: sectionConfidence(sectionNodes, matches),
        nodes: sectionNodes,
    }));
    if (sections.length <= 1 && nodes.length > 12) {
        return splitLongPageIntoSections(nodes, matches);
    }
    return sections;
}
function splitLongPageIntoSections(nodes, matches) {
    const sorted = [...nodes].sort((first, second) => first.rect.y - second.rect.y);
    const sections = [];
    let current = [];
    for (const node of sorted) {
        const previous = current.at(-1);
        const startsNewByHeading = (node.tag === "h1" || node.tag === "h2") && current.length >= 5;
        const startsNewByGap = previous
            ? node.rect.y - (previous.rect.y + previous.rect.height) > 420
            : false;
        if ((startsNewByHeading || startsNewByGap) && current.length > 0) {
            sections.push({
                index: sections.length,
                name: inferSectionName(current, sections.length),
                kind: inferSectionKind(current, sections.length),
                confidence: sectionConfidence(current, matches),
                nodes: current,
            });
            current = [];
        }
        current.push(node);
    }
    if (current.length > 0) {
        sections.push({
            index: sections.length,
            name: inferSectionName(current, sections.length),
            kind: inferSectionKind(current, sections.length),
            confidence: sectionConfidence(current, matches),
            nodes: current,
        });
    }
    return sections;
}
function inferSectionName(nodes, index) {
    return (nodes
        .find((node) => node.tag === "h1" || node.tag === "h2" || node.tag === "h3")
        ?.text?.slice(0, 48) ?? `Section ${index + 1}`);
}
function inferSectionKind(nodes, index) {
    const images = nodes.filter((node) => node.tag === "img").length;
    const headings = nodes.filter((node) => node.tag === "h1" || node.tag === "h2").length;
    const text = nodes.filter((node) => node.text && node.tag !== "img").length;
    if (index === 0 && (headings > 0 || images > 0)) {
        return "hero";
    }
    if (images >= 2 && text <= 6) {
        return "media-grid";
    }
    return "content";
}
function sectionConfidence(nodes, matches) {
    if (matches.length === 0) {
        return 0;
    }
    const sectionPaths = new Set(nodes.map((node) => node.domPath));
    const relevant = matches.filter((match) => match.domPath ? sectionPaths.has(match.domPath) : false);
    if (relevant.length === 0) {
        return 0;
    }
    return Number((relevant.reduce((sum, match) => sum + match.confidence, 0) /
        relevant.length).toFixed(3));
}
function inferSemanticType(nodes) {
    const hasHeading = nodes.some((node) => node.tag === "h1" || node.tag === "h2");
    const imageCount = nodes.filter((node) => node.tag === "img").length;
    const textCount = nodes.filter((node) => node.text).length;
    if (hasHeading && imageCount > 0) {
        return "hero";
    }
    if (textCount > 6) {
        return "grid";
    }
    return hasHeading ? "section" : "unknown";
}
function inferName(title, nodes) {
    const heading = nodes.find((node) => node.tag === "h1" || node.tag === "h2")?.text;
    return heading ?? title ?? "Exported Section";
}
function toComponentName(value) {
    const slug = slugify(value, { lower: false, strict: true });
    const words = slug.split("-").filter(Boolean);
    const name = words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
    return name && /^[A-Z]/.test(name) ? name : "ExportedSection";
}
function toRouteSegment(value) {
    const segment = slugify(value, { lower: true, strict: true });
    return segment || "page";
}
function unique(items, keyFor) {
    const seen = new Set();
    const result = [];
    for (const item of items) {
        const key = keyFor(item);
        if (seen.has(key)) {
            continue;
        }
        seen.add(key);
        result.push(item);
    }
    return result;
}
