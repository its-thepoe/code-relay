export const baselineStrategy = {
    id: "semantic-layout",
    structuredLayout: false,
    compactSpacing: false,
    aggressiveMobileStacking: false,
    preserveImageAspectRatio: true,
};
export function buildAttemptPlan(input) {
    if (!input.previousAttempt || input.attemptNumber === 1) {
        return {
            strategy: baselineStrategy,
            diagnosis: ["Initial export attempt uses the baseline semantic strategy."],
            patchesApplied: ["baseline semantic-layout strategy"],
            diagnosisDetails: [
                {
                    category: "initial_baseline",
                    message: "Start from the baseline export before applying corrective patches.",
                },
            ],
            patchOperations: ["baseline_strategy"],
        };
    }
    const previous = input.previousAttempt;
    const diagnosisDetails = [];
    const patchOperations = [];
    const patchTargets = {};
    const patchPropertyHints = {};
    const next = { ...previous.strategy };
    const compareSummary = previous.comparisonDiagnostics?.summary;
    const previewValidation = previous.previewValidation;
    const responsiveTargetViewports = collectResponsiveTargetViewports(previous.fidelity);
    const responsiveViewportTargets = collectNodeIdsByViewportIssue(previous.comparisonDiagnostics, responsiveTargetViewports, ["missing_node", "layout", "surface", "typography", "color"]);
    const responsiveViewportPropertyHints = collectNodePropertyHintsByViewportIssue(previous.comparisonDiagnostics, responsiveTargetViewports, ["missing_node", "layout", "surface", "typography", "color"]);
    const motionTargetViewports = collectIssueTargetViewports(previous.comparisonDiagnostics, ["motion"]);
    const motionViewportTargets = collectNodeIdsByViewportIssue(previous.comparisonDiagnostics, motionTargetViewports, ["motion"]);
    const motionViewportPropertyHints = collectNodePropertyHintsByViewportIssue(previous.comparisonDiagnostics, motionTargetViewports, ["motion"]);
    if (previous.fidelity.mobile < previous.fidelity.desktop - 8) {
        diagnosisDetails.push({
            category: "responsive_mismatch",
            message: "Mobile fidelity lagged desktop, so the next pass should collapse layouts more aggressively and preserve runtime viewport overrides.",
        });
        pushPatch(patchOperations, "enable_aggressive_mobile_stacking");
        pushPatch(patchOperations, "enable_compact_spacing");
        pushPatch(patchOperations, "promote_viewport_overrides");
        addPatchTargets(patchTargets, "promote_viewport_overrides", responsiveViewportTargets);
        addPatchPropertyHints(patchPropertyHints, "promote_viewport_overrides", responsiveViewportPropertyHints);
        next.aggressiveMobileStacking = true;
        next.compactSpacing = true;
    }
    if (typeof previous.fidelity.tablet === "number" &&
        previous.fidelity.tablet < previous.fidelity.desktop - 6) {
        diagnosisDetails.push({
            category: "responsive_mismatch",
            message: "Tablet fidelity also lagged desktop, so the next pass should retain breakpoint-specific wrappers and responsive overrides.",
        });
        pushPatch(patchOperations, "promote_viewport_overrides");
        pushPatch(patchOperations, "preserve_wrapper_surfaces");
        addPatchTargets(patchTargets, "promote_viewport_overrides", responsiveViewportTargets);
        addPatchPropertyHints(patchPropertyHints, "promote_viewport_overrides", responsiveViewportPropertyHints);
        addPatchTargets(patchTargets, "preserve_wrapper_surfaces", responsiveViewportTargets);
    }
    if (previous.fidelity.layout < 88) {
        diagnosisDetails.push({
            category: "layout_mismatch",
            message: "Layout fidelity stayed weak, so the next pass should keep wrappers and reinforce runtime-derived layout styles.",
        });
        pushPatch(patchOperations, "enable_structured_layout");
        pushPatch(patchOperations, "preserve_wrapper_surfaces");
        pushPatch(patchOperations, "reinforce_runtime_styles");
        next.structuredLayout = true;
    }
    if (previous.fidelity.assets < 95) {
        diagnosisDetails.push({
            category: "asset_mismatch",
            message: "Asset fidelity was weak, so the next pass should allow fluid image sizing instead of preserving a fixed aspect ratio.",
        });
        pushPatch(patchOperations, "relax_image_aspect_ratio");
        next.preserveImageAspectRatio = false;
    }
    if (previous.fidelity.nodeMatch < 70) {
        diagnosisDetails.push({
            category: "low_node_match",
            message: "Node-match confidence stayed low, so the next pass should preserve more wrapper surfaces and runtime style evidence.",
        });
        pushPatch(patchOperations, "preserve_wrapper_surfaces");
        pushPatch(patchOperations, "reinforce_runtime_styles");
        next.structuredLayout = true;
    }
    if (previous.fidelity.typography < 94) {
        diagnosisDetails.push({
            category: "typography_mismatch",
            message: "Typography fidelity fell below target, so the next pass should promote runtime font metrics into the export tree.",
        });
        pushPatch(patchOperations, "boost_typography_from_runtime");
        addPatchTargets(patchTargets, "boost_typography_from_runtime", collectNodeIdsByIssue(previous.comparisonDiagnostics, ["typography", "color"]));
    }
    if (previous.fidelity.motion < 85) {
        diagnosisDetails.push({
            category: "motion_mismatch",
            message: "Motion fidelity stayed below target, so the next pass should preserve runtime transition and animation styles.",
        });
        pushPatch(patchOperations, "preserve_motion_styles");
        addPatchTargets(patchTargets, "preserve_motion_styles", motionViewportTargets.length > 0
            ? motionViewportTargets
            : collectNodeIdsByIssue(previous.comparisonDiagnostics, ["motion"]));
        addPatchPropertyHints(patchPropertyHints, "preserve_motion_styles", motionViewportPropertyHints);
    }
    if ((compareSummary?.missingNodes ?? 0) > 0) {
        diagnosisDetails.push({
            category: "layout_mismatch",
            message: "Generated-node comparison found missing exported nodes, so the next pass should preserve wrappers and reinforce runtime layout styles.",
        });
        pushPatch(patchOperations, "preserve_wrapper_surfaces");
        pushPatch(patchOperations, "reinforce_runtime_styles");
        addPatchTargets(patchTargets, "preserve_wrapper_surfaces", collectNodeIdsByIssue(previous.comparisonDiagnostics, ["missing_node"]));
        addPatchTargets(patchTargets, "reinforce_runtime_styles", collectNodeIdsByIssue(previous.comparisonDiagnostics, ["missing_node"]));
    }
    if ((compareSummary?.surfaceIssues ?? 0) > 0) {
        diagnosisDetails.push({
            category: "layout_mismatch",
            message: "Computed-style comparison found surface/padding mismatches, so the next pass should promote viewport overrides and preserve wrapper surfaces.",
        });
        pushPatch(patchOperations, "promote_viewport_overrides");
        pushPatch(patchOperations, "preserve_wrapper_surfaces");
        addPatchTargets(patchTargets, "promote_viewport_overrides", collectNodeIdsByIssue(previous.comparisonDiagnostics, ["surface", "layout"]));
        addPatchTargets(patchTargets, "preserve_wrapper_surfaces", collectNodeIdsByIssue(previous.comparisonDiagnostics, ["surface", "layout"]));
    }
    if ((compareSummary?.typographyIssues ?? 0) > 0) {
        pushPatch(patchOperations, "boost_typography_from_runtime");
        addPatchTargets(patchTargets, "boost_typography_from_runtime", collectNodeIdsByIssue(previous.comparisonDiagnostics, ["typography", "color"]));
    }
    if ((compareSummary?.motionIssues ?? 0) > 0) {
        pushPatch(patchOperations, "preserve_motion_styles");
        addPatchTargets(patchTargets, "preserve_motion_styles", motionViewportTargets.length > 0
            ? motionViewportTargets
            : collectNodeIdsByIssue(previous.comparisonDiagnostics, ["motion"]));
        addPatchPropertyHints(patchPropertyHints, "preserve_motion_styles", motionViewportPropertyHints);
    }
    const hasPreviewMissingWarning = previous.warnings.some((warning) => warning.type === "preview_validation_missing_nodes" ||
        warning.type === "generated_node_missing");
    if (hasPreviewMissingWarning) {
        diagnosisDetails.push({
            category: "layout_mismatch",
            message: "Rendered preview validation could not find expected exported nodes, so the next pass should preserve more wrappers and reinforce runtime-backed structure.",
        });
        pushPatch(patchOperations, "preserve_wrapper_surfaces");
        pushPatch(patchOperations, "reinforce_runtime_styles");
        addPatchTargets(patchTargets, "preserve_wrapper_surfaces", collectNodeIdsByIssue(previous.comparisonDiagnostics, ["missing_node"]));
        addPatchTargets(patchTargets, "reinforce_runtime_styles", collectNodeIdsByIssue(previous.comparisonDiagnostics, ["missing_node"]));
    }
    const hasPreviewUnstyledWarning = previous.warnings.some((warning) => warning.type === "preview_validation_unstyled");
    if (hasPreviewUnstyledWarning) {
        diagnosisDetails.push({
            category: "layout_mismatch",
            message: "Rendered preview validation found exported nodes without non-default styles, so the next pass should preserve wrappers, reinforce runtime styles, and promote viewport overrides.",
        });
        pushPatch(patchOperations, "preserve_wrapper_surfaces");
        pushPatch(patchOperations, "reinforce_runtime_styles");
        pushPatch(patchOperations, "promote_viewport_overrides");
        pushPatch(patchOperations, "force_inline_styles");
        addPatchTargets(patchTargets, "preserve_wrapper_surfaces", collectNodeIdsByIssue(previous.comparisonDiagnostics, [
            "surface",
            "layout",
            "typography",
            "color",
        ]));
        addPatchTargets(patchTargets, "reinforce_runtime_styles", collectNodeIdsByIssue(previous.comparisonDiagnostics, [
            "surface",
            "layout",
            "typography",
            "color",
        ]));
        addPatchTargets(patchTargets, "promote_viewport_overrides", collectNodeIdsByIssue(previous.comparisonDiagnostics, [
            "surface",
            "layout",
            "typography",
            "color",
        ]));
        addPatchTargets(patchTargets, "force_inline_styles", collectNodeIdsByIssue(previous.comparisonDiagnostics, [
            "surface",
            "layout",
            "typography",
            "color",
        ]));
    }
    if (previewValidation?.status === "validated" &&
        previewValidation.summary.nodesExpectingMotion > 0 &&
        previewValidation.summary.nodesWithNonDefaultMotion === 0) {
        diagnosisDetails.push({
            category: "motion_mismatch",
            message: "Rendered preview validation found nodes that should preserve motion but no non-default motion was applied, so the next pass should preserve runtime motion styles.",
        });
        pushPatch(patchOperations, "preserve_motion_styles");
        addPatchTargets(patchTargets, "preserve_motion_styles", motionViewportTargets.length > 0
            ? motionViewportTargets
            : collectNodeIdsByIssue(previous.comparisonDiagnostics, ["motion"]));
        addPatchPropertyHints(patchPropertyHints, "preserve_motion_styles", motionViewportPropertyHints);
    }
    const hasResponsiveWarning = previous.warnings.some((warning) => warning.type === "responsive_mismatch");
    if (hasResponsiveWarning) {
        pushPatch(patchOperations, "enable_aggressive_mobile_stacking");
        pushPatch(patchOperations, "enable_compact_spacing");
        addPatchTargets(patchTargets, "promote_viewport_overrides", responsiveViewportTargets);
        addPatchPropertyHints(patchPropertyHints, "promote_viewport_overrides", responsiveViewportPropertyHints);
        addPatchTargets(patchTargets, "preserve_wrapper_surfaces", responsiveViewportTargets);
        next.aggressiveMobileStacking = true;
        next.compactSpacing = true;
    }
    if (previous.fidelity.overall < 90) {
        diagnosisDetails.push({
            category: "low_overall_fidelity",
            message: "Overall fidelity stayed below target, so the next pass should reinforce runtime styles across the export tree.",
        });
        pushPatch(patchOperations, "reinforce_runtime_styles");
    }
    if (patchOperations.length === 0) {
        diagnosisDetails.push({
            category: "low_overall_fidelity",
            message: "No dominant mismatch bucket stood out, so the next pass should apply a balanced compact structured correction.",
        });
        pushPatch(patchOperations, "enable_structured_layout");
        pushPatch(patchOperations, "enable_compact_spacing");
        next.structuredLayout = true;
        next.compactSpacing = true;
    }
    next.id = strategyId(next);
    return {
        strategy: next,
        diagnosis: diagnosisDetails.map((entry) => entry.message),
        patchesApplied: patchOperations.map(describePatchOperation),
        diagnosisDetails,
        patchOperations,
        patchTargets,
        patchPropertyHints,
    };
}
export function applyAttemptPlan(state, plan) {
    let ir = cloneIr(state.ir);
    const strategy = { ...plan.strategy };
    for (const operation of plan.patchOperations) {
        switch (operation) {
            case "baseline_strategy":
                break;
            case "enable_structured_layout":
            case "enable_compact_spacing":
            case "enable_aggressive_mobile_stacking":
            case "relax_image_aspect_ratio":
                break;
            case "preserve_wrapper_surfaces":
                ir = {
                    ...ir,
                    exportTree: flattenExportTreeWithMutation(ir.exportTree ?? [], ensureSurfaceDimensions, plan.patchTargets?.preserve_wrapper_surfaces),
                };
                break;
            case "reinforce_runtime_styles":
                ir = {
                    ...ir,
                    exportTree: flattenExportTreeWithMutation(ir.exportTree ?? [], reinforceRuntimeStyles, plan.patchTargets?.reinforce_runtime_styles),
                };
                break;
            case "promote_viewport_overrides":
                ir = {
                    ...ir,
                    exportTree: flattenExportTreeWithMutation(ir.exportTree ?? [], (node) => promoteViewportOverrides(node, plan.patchPropertyHints?.promote_viewport_overrides?.[node.id]), plan.patchTargets?.promote_viewport_overrides),
                };
                break;
            case "boost_typography_from_runtime":
                ir = {
                    ...ir,
                    exportTree: flattenExportTreeWithMutation(ir.exportTree ?? [], promoteTypographyStyles, plan.patchTargets?.boost_typography_from_runtime),
                };
                break;
            case "preserve_motion_styles":
                ir = {
                    ...ir,
                    exportTree: flattenExportTreeWithMutation(ir.exportTree ?? [], (node) => preserveMotionStyles(node, plan.patchPropertyHints?.preserve_motion_styles?.[node.id]), plan.patchTargets?.preserve_motion_styles),
                };
                break;
            case "force_inline_styles":
                ir = {
                    ...ir,
                    exportTree: flattenExportTreeWithMutation(ir.exportTree ?? [], forceInlineStyles, plan.patchTargets?.force_inline_styles),
                };
                break;
            default:
                break;
        }
    }
    return {
        ir,
        strategy,
    };
}
export function detectAttemptPlateau(scores, minimumImprovement = 0.75) {
    if (scores.length < 3)
        return false;
    const deltas = [
        scores.at(-1) - scores.at(-2),
        scores.at(-2) - scores.at(-3),
    ];
    return deltas.every((delta) => delta < minimumImprovement);
}
function pushPatch(target, operation) {
    if (!target.includes(operation)) {
        target.push(operation);
    }
}
function addPatchTargets(target, operation, nodeIds) {
    if (nodeIds.length === 0)
        return;
    const existing = new Set(target[operation] ?? []);
    for (const nodeId of nodeIds) {
        existing.add(nodeId);
    }
    target[operation] = Array.from(existing);
}
function addPatchPropertyHints(target, operation, nodeHints) {
    const existing = { ...(target[operation] ?? {}) };
    for (const [nodeId, viewportHints] of Object.entries(nodeHints)) {
        const currentNodeHints = { ...(existing[nodeId] ?? {}) };
        for (const [viewport, properties] of Object.entries(viewportHints)) {
            const merged = new Set([
                ...(currentNodeHints[viewport] ?? []),
                ...properties,
            ]);
            currentNodeHints[viewport] = Array.from(merged);
        }
        existing[nodeId] = currentNodeHints;
    }
    target[operation] = existing;
}
function collectNodeIdsByIssue(diagnostics, issueTypes) {
    if (!diagnostics)
        return [];
    return diagnostics.nodes
        .filter((node) => node.issueTypes.some((issueType) => issueTypes.includes(issueType)))
        .map((node) => node.nodeId);
}
function collectNodeIdsByViewportIssue(diagnostics, viewports, issueTypes) {
    if (!diagnostics?.byViewport || viewports.length === 0)
        return [];
    const matches = new Set();
    for (const viewport of viewports) {
        const scoped = diagnostics.byViewport[viewport];
        if (!scoped)
            continue;
        for (const node of scoped.nodes) {
            if (node.issueTypes.some((issueType) => issueTypes.includes(issueType))) {
                matches.add(node.nodeId);
            }
        }
    }
    return Array.from(matches);
}
function collectNodePropertyHintsByViewportIssue(diagnostics, viewports, issueTypes) {
    if (!diagnostics?.byViewport || viewports.length === 0)
        return {};
    const hints = {};
    for (const viewport of viewports) {
        const scoped = diagnostics.byViewport[viewport];
        if (!scoped)
            continue;
        for (const node of scoped.nodes) {
            if (!node.issueTypes.some((issueType) => issueTypes.includes(issueType))) {
                continue;
            }
            const properties = Array.from(new Set(node.propertyDiffs.map((entry) => entry.property)));
            if (properties.length === 0)
                continue;
            hints[node.nodeId] = {
                ...(hints[node.nodeId] ?? {}),
                [viewport]: properties,
            };
        }
    }
    return hints;
}
function collectIssueTargetViewports(diagnostics, issueTypes) {
    if (!diagnostics?.byViewport)
        return [];
    return Object.entries(diagnostics.byViewport)
        .filter(([, scoped]) => Boolean(scoped?.nodes.some((node) => node.issueTypes.some((issueType) => issueTypes.includes(issueType)))))
        .map(([viewport]) => viewport);
}
function collectResponsiveTargetViewports(fidelity) {
    const viewports = [];
    if (typeof fidelity.laptop === "number" &&
        fidelity.laptop < fidelity.desktop - 4) {
        viewports.push("laptop");
    }
    if (typeof fidelity.tablet === "number" &&
        fidelity.tablet < fidelity.desktop - 6) {
        viewports.push("tablet");
    }
    if (fidelity.mobile < fidelity.desktop - 8) {
        viewports.push("mobile");
    }
    return viewports;
}
function describePatchOperation(operation) {
    switch (operation) {
        case "baseline_strategy":
            return "baseline semantic-layout strategy";
        case "enable_structured_layout":
            return "enabled structured layout mode";
        case "enable_compact_spacing":
            return "tightened content spacing";
        case "enable_aggressive_mobile_stacking":
            return "enabled aggressive mobile stacking";
        case "relax_image_aspect_ratio":
            return "relaxed fixed image aspect-ratio preservation";
        case "preserve_wrapper_surfaces":
            return "preserved wrapper surfaces with runtime dimensions";
        case "reinforce_runtime_styles":
            return "reinforced runtime layout and surface styles";
        case "promote_viewport_overrides":
            return "promoted viewport-specific responsive overrides";
        case "boost_typography_from_runtime":
            return "boosted runtime typography metrics";
        case "preserve_motion_styles":
            return "preserved runtime motion styles";
        case "force_inline_styles":
            return "forced inline style fallback for targeted nodes";
    }
}
function strategyId(strategy) {
    const parts = ["semantic-layout"];
    if (strategy.structuredLayout)
        parts.push("structured");
    if (strategy.compactSpacing)
        parts.push("compact");
    if (strategy.aggressiveMobileStacking)
        parts.push("mobile-repair");
    if (!strategy.preserveImageAspectRatio)
        parts.push("fluid-images");
    return parts.join("+");
}
function cloneIr(ir) {
    return {
        ...ir,
        exportTree: ir.exportTree ? cloneExportTree(ir.exportTree) : ir.exportTree,
    };
}
function cloneExportTree(nodes) {
    return nodes.map((node) => ({
        ...node,
        rect: node.rect ? { ...node.rect } : node.rect,
        rectByViewport: node.rectByViewport
            ? Object.fromEntries(Object.entries(node.rectByViewport).map(([key, rect]) => [
                key,
                rect ? { ...rect } : rect,
            ]))
            : node.rectByViewport,
        styles: { ...node.styles },
        stylesByViewport: node.stylesByViewport
            ? Object.fromEntries(Object.entries(node.stylesByViewport).map(([key, styles]) => [
                key,
                styles ? { ...styles } : styles,
            ]))
            : node.stylesByViewport,
        motion: node.motion ? { ...node.motion } : node.motion,
        motionByViewport: node.motionByViewport
            ? Object.fromEntries(Object.entries(node.motionByViewport).map(([key, motion]) => [
                key,
                motion ? { ...motion } : motion,
            ]))
            : node.motionByViewport,
        interactionStyles: node.interactionStyles
            ? {
                ...(node.interactionStyles.hover
                    ? { hover: { ...node.interactionStyles.hover } }
                    : {}),
                ...(node.interactionStyles.focus
                    ? { focus: { ...node.interactionStyles.focus } }
                    : {}),
            }
            : node.interactionStyles,
        interactionStylesByViewport: node.interactionStylesByViewport
            ? Object.fromEntries(Object.entries(node.interactionStylesByViewport).map(([key, interactionStyles]) => [
                key,
                interactionStyles
                    ? {
                        ...(interactionStyles.hover
                            ? { hover: { ...interactionStyles.hover } }
                            : {}),
                        ...(interactionStyles.focus
                            ? { focus: { ...interactionStyles.focus } }
                            : {}),
                    }
                    : interactionStyles,
            ]))
            : node.interactionStylesByViewport,
        attributes: { ...node.attributes },
        source: {
            ...node.source,
            runtimeNodeIdsByViewport: node.source.runtimeNodeIdsByViewport
                ? { ...node.source.runtimeNodeIdsByViewport }
                : node.source.runtimeNodeIdsByViewport,
        },
        children: cloneExportTree(node.children),
    }));
}
function flattenExportTreeWithMutation(nodes, mutate, targetNodeIds) {
    const targets = targetNodeIds ? new Set(targetNodeIds) : undefined;
    return nodes.map((node) => {
        const cloned = {
            ...node,
            children: flattenExportTreeWithMutation(node.children, mutate, targetNodeIds),
        };
        const next = !targets || targets.has(node.id)
            ? mutate(cloned)
            : cloned;
        return {
            ...next,
            children: next.children,
            childIds: next.children.map((child) => child.id),
        };
    });
}
function ensureSurfaceDimensions(node) {
    if (node.kind === "text" || node.tag === "img")
        return node;
    const nextStyles = { ...node.styles };
    if (!nextStyles.width && node.rect?.width) {
        nextStyles.width = `${Math.round(node.rect.width)}px`;
    }
    if (!nextStyles.minHeight && node.rect?.height) {
        nextStyles.minHeight = `${Math.round(node.rect.height)}px`;
    }
    if (!nextStyles.display) {
        nextStyles.display = node.children.length > 0 ? "flex" : "block";
    }
    if (node.children.length > 0 && !nextStyles.flexDirection) {
        nextStyles.flexDirection = "column";
    }
    return { ...node, styles: nextStyles };
}
function reinforceRuntimeStyles(node) {
    const desktopStyles = node.stylesByViewport?.desktop ??
        node.stylesByViewport?.laptop ??
        node.stylesByViewport?.tablet ??
        node.stylesByViewport?.mobile;
    if (!desktopStyles)
        return node;
    return {
        ...node,
        styles: {
            ...desktopStyles,
            ...node.styles,
        },
    };
}
function promoteViewportOverrides(node, propertyHints) {
    if (!node.stylesByViewport)
        return node;
    const next = { ...node.stylesByViewport };
    for (const [viewport, styles] of Object.entries(next)) {
        if (!styles)
            continue;
        const scopedProperties = propertyHints?.[viewport];
        const filteredStyles = scopedProperties && scopedProperties.length > 0
            ? Object.fromEntries(Object.entries(styles).filter(([key]) => scopedProperties.includes(key)))
            : styles;
        next[viewport] = {
            ...filteredStyles,
            ...(node.rectByViewport?.[viewport]
                ? {
                    width: `${Math.round(node.rectByViewport[viewport].width)}px`,
                    minHeight: `${Math.round(node.rectByViewport[viewport].height)}px`,
                }
                : {}),
        };
    }
    return {
        ...node,
        stylesByViewport: next,
    };
}
function promoteTypographyStyles(node) {
    const isTextNode = node.kind === "text" ||
        node.tag === "p" ||
        node.tag === "span" ||
        node.tag === "li" ||
        node.tag === "h1" ||
        node.tag === "h2" ||
        node.tag === "h3";
    if (!isTextNode)
        return node;
    const desktopStyles = node.stylesByViewport?.desktop ??
        node.stylesByViewport?.laptop ??
        node.stylesByViewport?.tablet ??
        node.stylesByViewport?.mobile;
    if (!desktopStyles)
        return node;
    const nextStyles = { ...node.styles };
    for (const key of [
        "fontFamily",
        "fontSize",
        "fontWeight",
        "lineHeight",
        "letterSpacing",
        "textAlign",
        "color",
    ]) {
        if (desktopStyles[key]) {
            nextStyles[key] = desktopStyles[key];
        }
    }
    return { ...node, styles: nextStyles };
}
function preserveMotionStyles(node, propertyHints) {
    const desktopMotion = node.motionByViewport?.desktop ??
        node.motionByViewport?.laptop ??
        node.motionByViewport?.tablet ??
        node.motionByViewport?.mobile;
    const baseInteractionStyles = node.interactionStylesByViewport?.desktop ??
        node.interactionStylesByViewport?.laptop ??
        node.interactionStylesByViewport?.tablet ??
        node.interactionStylesByViewport?.mobile;
    if (!desktopMotion && !baseInteractionStyles)
        return node;
    const nextMotion = { ...(node.motion ?? {}) };
    const nextInteractionStyles = {
        ...(node.interactionStyles?.hover ? { hover: { ...node.interactionStyles.hover } } : {}),
        ...(node.interactionStyles?.focus ? { focus: { ...node.interactionStyles.focus } } : {}),
    };
    const applyMotionSource = (sourceMotion, sourceInteractionStyles, hintedProperties) => {
        if (sourceMotion) {
            const motionProperties = (hintedProperties ?? []).filter((property) => !property.includes("."));
            const keys = motionProperties.length > 0
                ? motionProperties
                : Object.keys(sourceMotion);
            for (const key of keys) {
                const value = sourceMotion[key];
                if (typeof value === "string" && value) {
                    nextMotion[key] = value;
                }
            }
        }
        const interactionProperties = (hintedProperties ?? []).filter((property) => property.includes("."));
        const grouped = new Map();
        for (const property of interactionProperties) {
            const [state, cssProperty] = property.split(".", 2);
            if ((state === "hover" || state === "focus") &&
                cssProperty &&
                sourceInteractionStyles?.[state]) {
                const existing = grouped.get(state) ?? new Set();
                existing.add(cssProperty);
                grouped.set(state, existing);
            }
        }
        for (const state of ["hover", "focus"]) {
            const sourceState = sourceInteractionStyles?.[state];
            if (!sourceState)
                continue;
            const keys = grouped.get(state)?.size
                ? Array.from(grouped.get(state))
                : hintedProperties && hintedProperties.length > 0
                    ? []
                    : Object.keys(sourceState);
            if (keys.length === 0)
                continue;
            nextInteractionStyles[state] = {
                ...(nextInteractionStyles[state] ?? {}),
            };
            for (const key of keys) {
                const value = sourceState[key];
                if (typeof value === "string" && value) {
                    nextInteractionStyles[state][key] = value;
                }
            }
        }
    };
    if (propertyHints && Object.keys(propertyHints).length > 0) {
        for (const [viewport, hintedProperties] of Object.entries(propertyHints)) {
            applyMotionSource(node.motionByViewport?.[viewport], node.interactionStylesByViewport?.[viewport], hintedProperties);
        }
    }
    else {
        applyMotionSource(desktopMotion, baseInteractionStyles, undefined);
    }
    return {
        ...node,
        motion: Object.keys(nextMotion).length > 0 ? nextMotion : node.motion,
        interactionStyles: Object.keys(nextInteractionStyles).length > 0
            ? nextInteractionStyles
            : node.interactionStyles,
    };
}
function forceInlineStyles(node) {
    return {
        ...node,
        attributes: {
            ...node.attributes,
            dataCoderelayForceInlineStyles: true,
        },
    };
}
