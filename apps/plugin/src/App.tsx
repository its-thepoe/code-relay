import {
  framer,
  isTextNode,
  isComponentInstanceNode,
  isComponentNode,
  isFrameNode,
  isSVGNode,
  FramerPluginClosedError,
  type ComponentNode,
  type CanvasNode,
} from "framer-plugin";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { extractFramerNodeStyles } from "./framer-style-extraction";
import "./App.css";

type DebugEvent = {
  at: string;
  level: "info" | "warn" | "error";
  message: string;
  data?: unknown;
};

type SelectionNode = {
  id: string;
  name?: string;
  type?: string;
  text?: string;
  bounds?: { x: number; y: number; width: number; height: number };
  metadata?: Record<string, unknown>;
};

type PluginCapture = {
  mode: "framer-plugin";
  selectedNodes: SelectionNode[];
  capturedAt: string;
  exportProps?: {
    heroTitle?: string;
    heroSubtitle?: string;
    ctaLabel?: string;
    ctaHref?: string;
  };
  project?: {
    id: string;
    name: string;
  };
  context?: Record<string, unknown>;
};

type CapturableNode = CanvasNode | ComponentNode | unknown;
type ExportMode = "selection" | "components" | "full-site";
type ExportEngine =
  | "component-module"
  | "page-node-tree"
  | "published-runtime"
  | "hybrid"
  | "plugin-approximation";
type ComponentModuleManifest = {
  id?: string;
  name: string;
  source:
    | "component-node"
    | "component-instance"
    | "code-file-export"
    | "selected-component";
  insertURL: string;
  componentIdentifier?: string;
  componentName?: string;
  codeFileId?: string;
  codeFileName?: string;
  isDefaultExport?: boolean;
  controls?: Record<string, unknown>;
  typedControls?: Record<string, unknown>;
};
type FullSiteRoots = {
  roots: CapturableNode[];
  pages: CapturableNode[];
  components: CapturableNode[];
  rootKinds: Record<string, "page" | "component" | "canvas-root">;
};

function useSelection() {
  const [selection, setSelection] = useState<CanvasNode[]>([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const initial = await framer.getSelection();
      if (!active) return;
      setSelection(initial);
    };

    void load();
    return framer.subscribeToSelection(setSelection);
  }, []);

  return selection;
}

export function App() {
  const [sourceUrl, setSourceUrl] = useState("");
  const [resolvedSourceUrl, setResolvedSourceUrl] = useState("");
  const [apiBaseUrl, setApiBaseUrl] = useState("http://localhost:3000");
  const [busy, setBusy] = useState(false);
  const [exportMode, setExportMode] = useState<ExportMode>("selection");
  const selection = useSelection();
  const [debug, setDebug] = useState<DebugEvent[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  const [project, setProject] = useState<{ id: string; name: string } | null>(
    null,
  );
  const [components, setComponents] = useState<ComponentNode[]>([]);
  const [selectedComponentIds, setSelectedComponentIds] = useState<string[]>(
    [],
  );

  const simplified = useMemo(() => simplifySelection(selection), [selection]);
  const selectionLabel =
    simplified.length === 1 ? "1 item" : `${simplified.length} items`;

  const allComponentsSelected =
    components.length > 0 && selectedComponentIds.length === components.length;

  const log = (level: DebugEvent["level"], message: string, data?: unknown) => {
    setDebug((prev) => {
      const next: DebugEvent = {
        at: new Date().toISOString(),
        level,
        message,
        data,
      };
      return [...prev.slice(-199), next];
    });
  };

  useLayoutEffect(() => {
    framer.showUI({
      width: 520,
      height: 780,
      resizable: true,
    });
  }, []);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        log("info", "Loading project context…");
        const info = await framer.getProjectInfo();
        if (!active) return;
        setProject({ id: info.id, name: info.name });
        log("info", "Project info loaded", info);
        const publishInfo = await framer.getPublishInfo().catch(() => null);
        const publishUrl = getPublishUrl(publishInfo);
        if (publishUrl) setResolvedSourceUrl(publishUrl);
        log("info", "Publish info loaded", publishInfo);

        log("info", "Fetching ComponentNode list…");
        const nodes = await framer.getNodesWithType("ComponentNode");
        if (!active) return;
        const sorted = [...nodes].sort((a, b) =>
          (a.name ?? "").localeCompare(b.name ?? ""),
        );
        setComponents(sorted);
        log("info", `Components loaded: ${sorted.length}`);
      } catch (error) {
        if (error instanceof FramerPluginClosedError) return;
        log("error", "Failed to load project context", error);
        framer.notify(error instanceof Error ? error.message : String(error), {
          variant: "error",
        });
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  async function onCreateJob() {
    const captureSource =
      exportMode === "full-site"
        ? "full-site"
        : exportMode === "components" || selectedComponentIds.length > 0
          ? "component-catalog"
          : "canvas-selection";
    log("info", "Create export job clicked", {
      exportMode,
      captureSource,
      selectedComponentIdsCount: selectedComponentIds.length,
      selectionCount: selection.length,
    });

    if (exportMode === "selection" && simplified.length === 0) {
      framer.notify("Select a section or component on the canvas first.", {
        variant: "error",
      });
      log("warn", "Blocked: no canvas selection or component selection");
      return;
    }

    if (
      exportMode === "components" &&
      selectedComponentIds.length === 0 &&
      components.length === 0
    ) {
      framer.notify("No Framer components were found in this project.", {
        variant: "error",
      });
      log("warn", "Blocked: no project components to export");
      return;
    }

    setBusy(true);
    try {
      let sourceNodes: CapturableNode[] = [];
      let fullSiteRoots: FullSiteRoots | null = null;

      if (exportMode === "full-site") {
        log("info", "Reading full site roots from Framer");
        fullSiteRoots = await readFullSiteRoots(components);
        sourceNodes = fullSiteRoots.roots;
        log("info", "Read full site roots", {
          roots: sourceNodes.length,
          pages: fullSiteRoots.pages.length,
          components: fullSiteRoots.components.length,
          ids: sourceNodes.map((n: any) => n?.id).filter(Boolean),
        });
      } else if (
        exportMode === "components" ||
        selectedComponentIds.length > 0
      ) {
        const componentIds =
          selectedComponentIds.length > 0
            ? selectedComponentIds
            : components.map((node) => node.id);
        log("info", "Reading chosen components directly by id", {
          componentIds,
        });
        sourceNodes = await readNodesByIds(componentIds, components);
        log("info", "Read chosen component nodes", {
          requested: componentIds.length,
          found: sourceNodes.length,
          ids: sourceNodes.map((n: any) => n?.id).filter(Boolean),
        });
      } else {
        sourceNodes = await readSelectionWithRetry(selection);
        log("info", "Read canvas selection after retry", {
          count: sourceNodes.length,
          ids: sourceNodes.map((n: any) => n?.id).filter(Boolean),
        });
      }

      const liveSimplified = simplifySelection(sourceNodes);

      if (liveSimplified.length === 0) {
        const reason =
          exportMode === "full-site"
            ? "Could not read any pages or components from this Framer project."
            : exportMode === "components" || selectedComponentIds.length > 0
              ? "Chosen components could not be read from Framer."
              : "Canvas selection is empty.";
        framer.notify(reason, { variant: "error" });
        log("error", "Blocked: no readable export nodes", {
          captureSource,
          selectedComponentIds,
          subscribedSelection: simplified,
        });
        return;
      }

      const richSelectedNodes = await captureSelectionMetadata(sourceNodes, {
        rootKinds: fullSiteRoots?.rootKinds,
      });
      log("info", "Captured selection metadata", {
        count: richSelectedNodes.length,
        textNodes: richSelectedNodes.filter((node) => node.text).length,
      });
      const exportProps = inferExportPropsFromSelection(sourceNodes);
      log("info", "Inferred export props", exportProps);
      const context = await collectPluginContext({
        exportMode,
        selection: sourceNodes,
        project,
        components,
        selectedComponentIds:
          exportMode === "full-site"
            ? components.map((node) => node.id)
            : selectedComponentIds,
        captureSource,
        sitePages: fullSiteRoots?.pages ?? [],
        sourceUrl: sourceUrl.trim(),
        resolvedSourceUrl,
      });
      log("info", "Collected context", context);

      const pluginCapture: PluginCapture = {
        mode: "framer-plugin",
        selectedNodes: richSelectedNodes,
        capturedAt: new Date().toISOString(),
        exportProps,
        project: project ?? undefined,
        context: { ...(context ?? {}), debug },
      };

      const effectiveSourceUrl =
        sourceUrl.trim() ||
        resolvedSourceUrl ||
        (project
          ? `framer://project/${project.id}`
          : "framer://project/unknown");
      const response = await fetch(
        `${apiBaseUrl.replace(/\/$/, "")}/api/jobs`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            sourceUrl: effectiveSourceUrl,
            exportMode,
            pluginCapture,
          }),
        },
      );

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        log("error", "API job creation failed", {
          status: response.status,
          text,
        });
        throw new Error(
          `Job creation failed (${response.status}). ${text}`.trim(),
        );
      }

      const job = (await response.json()) as { id: string };
      log("info", "Job created", job);
      const jobUrl = `${apiBaseUrl.replace(/\/$/, "")}/jobs/${job.id}`;

      try {
        // @ts-expect-error - not all SDK typings include openURL yet.
        await framer.openURL(jobUrl);
      } catch {
        framer.notify(`Created job: ${job.id}`, { variant: "success" });
      }
    } catch (error) {
      if (error instanceof FramerPluginClosedError) return;
      log("error", "Unhandled error in create job", error);
      framer.notify(error instanceof Error ? error.message : String(error), {
        variant: "error",
      });
    } finally {
      setBusy(false);
    }
  }

  async function onNavigateToComponent(componentId: string) {
    log("info", "Navigate to component", { componentId });
    try {
      const node = await framer.getNode(componentId);
      if (!node) {
        framer.notify("Could not find that component node.", {
          variant: "error",
        });
        log("error", "framer.getNode returned null", { componentId });
        return;
      }

      let navigated = false;
      if (typeof (node as any).navigateTo === "function") {
        await (node as any).navigateTo();
        navigated = true;
      }
      if (typeof (framer as any).zoomIntoView === "function") {
        await (framer as any).zoomIntoView(componentId).catch(() => null);
        navigated = true;
      }
      if (!navigated) {
        framer.notify("Framer did not expose navigation for that component.", {
          variant: "error",
        });
        log("warn", "No navigateTo or zoomIntoView capability available", {
          componentId,
        });
      }
    } catch (error) {
      if (error instanceof FramerPluginClosedError) return;
      log("error", "navigateTo failed", error);
      framer.notify(error instanceof Error ? error.message : String(error), {
        variant: "error",
      });
    }
  }

  return (
    <main
      style={{
        padding: 12,
        display: "grid",
        gap: 10,
        height: "100%",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative",
        gridTemplateRows: "auto auto auto auto auto 1fr auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 10,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 14 }}>Coderelay Export</div>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setShowDebug((v) => !v)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setShowDebug((v) => !v);
            }
          }}
          style={{
            fontSize: 12,
            fontWeight: 800,
            opacity: 0.75,
            cursor: "pointer",
            userSelect: "none",
          }}
          title="Toggle debug overlay"
        >
          Debug
        </div>
      </div>

      <label style={{ display: "grid", gap: 6 }}>
        <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.8 }}>
          Published page URL (optional override)
        </div>
        <input
          value={sourceUrl}
          onChange={(event) => setSourceUrl(event.target.value)}
          placeholder="https://your-site.framer.website/"
          style={{
            height: 36,
            minWidth: 0,
            width: "100%",
            padding: "0 10px",
            borderRadius: 8,
            border: "1px solid rgba(0,0,0,0.15)",
            outline: "none",
          }}
        />
        <div style={{ fontSize: 11, opacity: 0.7 }}>
          Using:{" "}
          <code style={{ overflowWrap: "anywhere" }}>
            {sourceUrl.trim() ||
              resolvedSourceUrl ||
              (project ? `framer://project/${project.id}` : "project context")}
          </code>
        </div>
      </label>

      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.8 }}>
          Export mode
        </div>
        <div
          role="radiogroup"
          aria-label="Export mode"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 6,
          }}
        >
          {(
            [
              ["selection", "Selection"],
              ["components", "Components"],
              ["full-site", "Full site"],
            ] as const
          ).map(([value, label]) => {
            const active = exportMode === value;
            return (
              <div
                key={value}
                role="radio"
                aria-checked={active}
                tabIndex={0}
                onClick={() => setExportMode(value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setExportMode(value);
                  }
                }}
                style={{
                  height: 34,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                  border: active
                    ? "1px solid rgba(0,0,0,0.82)"
                    : "1px solid rgba(0,0,0,0.15)",
                  background: active ? "#111" : "rgba(255,255,255,0.92)",
                  color: active ? "#fff" : "#111",
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {label}
              </div>
            );
          })}
        </div>
      </div>

      <label style={{ display: "grid", gap: 6 }}>
        <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.8 }}>
          API base URL
        </div>
        <input
          value={apiBaseUrl}
          onChange={(event) => setApiBaseUrl(event.target.value)}
          placeholder="http://localhost:3000"
          style={{
            height: 36,
            minWidth: 0,
            width: "100%",
            padding: "0 10px",
            borderRadius: 8,
            border: "1px solid rgba(0,0,0,0.15)",
            outline: "none",
          }}
        />
      </label>

      <div style={{ fontSize: 12, opacity: 0.8 }}>
        Selection: <strong>{selectionLabel}</strong>
      </div>

      <details>
        <summary style={{ cursor: "pointer" }}>
          Project {project ? `(${project.name})` : ""}
        </summary>
        <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              fontSize: 12,
              opacity: 0.9,
            }}
          >
            <div style={{ opacity: 0.9 }}>
              Components: <strong>{components.length}</strong>
              {components.length > 0 ? (
                <>
                  {" "}
                  <span style={{ opacity: 0.7 }}>
                    ({selectedComponentIds.length} selected)
                  </span>
                </>
              ) : null}
            </div>

            {components.length > 0 ? (
              <span
                role="button"
                tabIndex={0}
                title={allComponentsSelected ? "Unselect all" : "Select all"}
                onClick={(event) => {
                  event.preventDefault();
                  if (allComponentsSelected) {
                    setSelectedComponentIds([]);
                  } else {
                    setSelectedComponentIds(components.map((node) => node.id));
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    if (allComponentsSelected) {
                      setSelectedComponentIds([]);
                    } else {
                      setSelectedComponentIds(
                        components.map((node) => node.id),
                      );
                    }
                  }
                }}
                style={{
                  height: 28,
                  padding: "0 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(0,0,0,0.18)",
                  background: "rgba(255,255,255,0.9)",
                  display: "inline-flex",
                  alignItems: "center",
                  fontWeight: 800,
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {allComponentsSelected ? "Unselect all" : "Select all"}
              </span>
            ) : null}
          </div>
          <div
            style={{
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: 8,
              maxHeight: 300,
              overflow: "auto",
            }}
          >
            {components.length === 0 ? (
              <div style={{ padding: 10, fontSize: 12, opacity: 0.7 }}>
                No components found yet.
              </div>
            ) : (
              components.map((node) => {
                const checked = selectedComponentIds.includes(node.id);
                return (
                  <label
                    key={node.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      maxWidth: "100%",
                      padding: "8px 10px",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                      fontSize: 12,
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => {
                        const next = event.target.checked;
                        setSelectedComponentIds((prev) => {
                          if (next)
                            return Array.from(new Set([...prev, node.id]));
                          return prev.filter((id) => id !== node.id);
                        });
                      }}
                    />
                    <span
                      style={{
                        fontWeight: 600,
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {node.name ?? "(unnamed)"}
                    </span>
                    <span style={{ flex: 1 }} />
                    <span
                      role="button"
                      tabIndex={0}
                      title="Go to component"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        void onNavigateToComponent(node.id);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          event.stopPropagation();
                          void onNavigateToComponent(node.id);
                        }
                      }}
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 999,
                        border: "1px solid rgba(0,0,0,0.18)",
                        display: "grid",
                        placeItems: "center",
                        fontWeight: 900,
                        fontSize: 12,
                        opacity: 0.8,
                        cursor: "pointer",
                      }}
                    >
                      i
                    </span>
                  </label>
                );
              })
            )}
          </div>
          <div style={{ fontSize: 11, opacity: 0.7, lineHeight: 1.4 }}>
            Component mode exports checked components. Full site mode exports
            project pages and component definitions from Framer.
          </div>
        </div>
      </details>

      {/* Guideline #7: prefer div role=button over <button> to avoid Framer CSS overrides */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          paddingTop: 10,
          background: "var(--framer-color-bg, #fff)",
        }}
      >
        <div
          role="button"
          tabIndex={0}
          aria-disabled={busy}
          onClick={() => {
            if (busy) return;
            void onCreateJob();
          }}
          onKeyDown={(event) => {
            if (busy) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              void onCreateJob();
            }
          }}
          className="framer-button-primary"
          style={{
            height: 40,
            width: "100%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none",
            cursor: busy ? "default" : "pointer",
            opacity: busy ? 0.7 : 1,
          }}
        >
          {busy
            ? "Creating…"
            : exportMode === "full-site"
              ? "Export Full Site"
              : exportMode === "components"
                ? "Export Components"
                : "Export Selection"}
        </div>

        <div
          style={{ fontSize: 11, opacity: 0.7, lineHeight: 1.4, marginTop: 8 }}
        >
          No auth locally. Sends Framer project metadata to the dashboard
          worker.
        </div>
      </div>

      {showDebug ? (
        <div
          style={{
            position: "absolute",
            inset: 12,
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.18)",
            background: "rgba(255,255,255,0.96)",
            padding: 10,
            display: "grid",
            gridTemplateRows: "auto 1fr",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 12 }}>Debug Log</div>
            <div
              role="button"
              tabIndex={0}
              onClick={() => setShowDebug(false)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setShowDebug(false);
                }
              }}
              style={{
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
                opacity: 0.8,
              }}
            >
              Close
            </div>
          </div>
          <div
            style={{
              overflow: "auto",
              borderRadius: 8,
              border: "1px solid rgba(0,0,0,0.1)",
              background: "#fff",
              padding: 8,
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontSize: 10,
              lineHeight: 1.4,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {debug.map((entry, index) => {
              const prefix =
                entry.level === "error"
                  ? "ERR"
                  : entry.level === "warn"
                    ? "WRN"
                    : "INF";
              return (
                <div key={index}>
                  [{prefix}] {entry.at} {entry.message}
                  {entry.data !== undefined
                    ? `\n${JSON.stringify(entry.data, null, 2)}`
                    : ""}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </main>
  );
}

async function collectPluginContext(input: {
  exportMode: ExportMode;
  selection: CapturableNode[];
  project: { id: string; name: string } | null;
  components: ComponentNode[];
  selectedComponentIds: string[];
  captureSource: "component-catalog" | "canvas-selection" | "full-site";
  sitePages?: CapturableNode[];
  sourceUrl?: string;
  resolvedSourceUrl?: string;
}) {
  const selectedComponents = input.components
    .filter((node) => input.selectedComponentIds.includes(node.id))
    .map((node) => sanitizeNode(node));
  const selectionSnapshot = input.selection.map((node) => sanitizeNode(node));
  const selectedComponentNodes = input.components.filter((node) =>
    input.selectedComponentIds.includes(node.id),
  );
  const selectedOrAllComponents =
    selectedComponentNodes.length > 0 ? selectedComponentNodes : input.components;

  const methodsToCheck = [
    "ManagedCollection.setFields",
    "ManagedCollection.addItems",
    "ManagedCollection.removeItems",
    "ManagedCollection.setPluginData",
  ] as const;

  const [
    projectInfo,
    publishInfo,
    managedCollections,
    collections,
    canSync,
    codeFiles,
    colorStyles,
    textStyles,
    fonts,
  ] = await Promise.all([
    safeCall(() => framer.getProjectInfo()),
    safeCall(() => framer.getPublishInfo()),
    safeCall(() => framer.getManagedCollections()),
    safeCall(() => framer.getCollections()),
    safeCall(() => framer.isAllowedTo(...methodsToCheck)),
    safeCall(() => framer.getCodeFiles()),
    safeCall(() => framer.getColorStyles()),
    safeCall(() => framer.getTextStyles()),
    safeCall(() => framer.getFonts()),
  ]);

  const componentModules = collectComponentModules({
    components: selectedOrAllComponents,
    selection: input.selection,
    codeFiles: codeFiles.ok ? codeFiles.value : [],
  });
  const hasPublishedUrl = Boolean(
    input.sourceUrl?.match(/^https?:\/\//) ||
      input.resolvedSourceUrl?.match(/^https?:\/\//) ||
      (publishInfo.ok && getPublishUrl(publishInfo.value)),
  );
  const exportEngine = chooseExportEngine({
    exportMode: input.exportMode,
    hasPublishedUrl,
    componentModules,
  });
  const cmsCollections = await collectCmsCollections({
    managedCollections: managedCollections.ok ? managedCollections.value : [],
    collections: collections.ok ? collections.value : [],
  });

  return {
    capturedAt: new Date().toISOString(),
    pluginMode: framer.mode,
    exportMode: input.exportMode,
    captureMode: hasPublishedUrl ? "runtime-first" : "plugin-only",
    exportEngine,
    captureSource: input.captureSource,
    project: input.project,
    projectInfo: projectInfo.ok ? sanitizeObject(projectInfo.value) : null,
    publishInfo: publishInfo.ok ? sanitizeObject(publishInfo.value) : null,
    publishedUrl: publishInfo.ok ? getPublishUrl(publishInfo.value) : null,
    selectedComponents,
    componentModules,
    codeFiles: codeFiles.ok ? codeFiles.value.map(sanitizeCodeFile) : [],
    colorStyles: colorStyles.ok
      ? colorStyles.value.map((style) => sanitizeObject(style))
      : [],
    textStyles: textStyles.ok
      ? textStyles.value.map((style) => sanitizeObject(style))
      : [],
    fonts: fonts.ok ? fonts.value.map((font) => sanitizeObject(font)) : [],
    cmsCollections,
    sitePages: (input.sitePages ?? []).map((node) => sanitizeNode(node)),
    selectionSnapshot,
    selectionCount: input.selection.length,
    componentCount: input.components.length,
    permissions: {
      syncMethods: methodsToCheck,
      canSync: canSync.ok ? canSync.value : false,
    },
    managedCollections: managedCollections.ok
      ? managedCollections.value.map((collection) => ({
          id: collection.id,
        }))
      : [],
    collections: collections.ok
      ? collections.value.map((collection) =>
          sanitizeObject({
            id: (collection as any)?.id,
            name: (collection as any)?.name,
            slug: (collection as any)?.slug,
          }),
        )
      : [],
    capabilities: {
      hasProjectInfo: projectInfo.ok,
      hasManagedCollections: managedCollections.ok,
      hasCollections: collections.ok,
      hasSyncPermissionInfo: canSync.ok,
      hasCodeFiles: codeFiles.ok,
      hasColorStyles: colorStyles.ok,
      hasTextStyles: textStyles.ok,
      hasFonts: fonts.ok,
      hasCmsCollections: cmsCollections.length > 0,
    },
  };
}

async function collectCmsCollections(input: {
  managedCollections: readonly unknown[];
  collections: readonly unknown[];
}) {
  const managed = await Promise.all(
    input.managedCollections.map((entry) => collectManagedCmsCollection(entry)),
  );
  const unmanaged = await Promise.all(
    input.collections.map((entry) => collectUnmanagedCmsCollection(entry)),
  );

  const output = [...managed, ...unmanaged].filter(
    (entry): entry is Record<string, unknown> => Boolean(entry),
  );
  const deduped = new Map<string, Record<string, unknown>>();
  for (const collection of output) {
    const id =
      typeof collection.id === "string" && collection.id.trim()
        ? collection.id.trim()
        : undefined;
    if (!id || deduped.has(id)) continue;
    deduped.set(id, collection);
  }
  return Array.from(deduped.values());
}

async function collectManagedCmsCollection(entry: unknown) {
  if (!entry || typeof entry !== "object") return null;
  const collection = entry as Record<string, unknown>;
  const getFields = typeof collection.getFields === "function" ? collection.getFields : null;
  const getItemIds =
    typeof collection.getItemIds === "function" ? collection.getItemIds : null;
  const getPluginDataKeys =
    typeof collection.getPluginDataKeys === "function"
      ? collection.getPluginDataKeys
      : null;
  const getPluginData =
    typeof collection.getPluginData === "function"
      ? (collection.getPluginData as (
          this: unknown,
          key: string,
        ) => Promise<string | null>)
      : null;

  const [fieldsResult, itemIdsResult, pluginDataKeysResult] = await Promise.all([
    safeCall(() => (getFields ? getFields.call(entry) : [])),
    safeCall(() => (getItemIds ? getItemIds.call(entry) : [])),
    safeCall(() => (getPluginDataKeys ? getPluginDataKeys.call(entry) : [])),
  ]);

  const pluginData = await readPluginDataRecord({
    owner: entry,
    keys: pluginDataKeysResult.ok ? pluginDataKeysResult.value : [],
    getPluginData,
  });

  return sanitizeObject({
    id: collection.id,
    name: collection.name,
    managed: true,
    pluginData,
    itemIds: itemIdsResult.ok
      ? itemIdsResult.value.filter(
          (itemId: unknown): itemId is string =>
            typeof itemId === "string" && itemId.trim().length > 0,
        )
      : [],
    fields: fieldsResult.ok
      ? fieldsResult.value.map((field: unknown) => sanitizeCmsField(field))
      : [],
    items: [],
  });
}

async function collectUnmanagedCmsCollection(entry: unknown) {
  if (!entry || typeof entry !== "object") return null;
  const collection = entry as Record<string, unknown>;
  const getFields = typeof collection.getFields === "function" ? collection.getFields : null;
  const getItems = typeof collection.getItems === "function" ? collection.getItems : null;
  const getPluginDataKeys =
    typeof collection.getPluginDataKeys === "function"
      ? collection.getPluginDataKeys
      : null;
  const getPluginData =
    typeof collection.getPluginData === "function"
      ? (collection.getPluginData as (
          this: unknown,
          key: string,
        ) => Promise<string | null>)
      : null;

  const [fieldsResult, itemsResult, pluginDataKeysResult] = await Promise.all([
    safeCall(() => (getFields ? getFields.call(entry) : [])),
    safeCall(() => (getItems ? getItems.call(entry) : [])),
    safeCall(() => (getPluginDataKeys ? getPluginDataKeys.call(entry) : [])),
  ]);

  const pluginData = await readPluginDataRecord({
    owner: entry,
    keys: pluginDataKeysResult.ok ? pluginDataKeysResult.value : [],
    getPluginData,
  });

  return sanitizeObject({
    id: collection.id,
    name: collection.name,
    managed: collection.managedBy && collection.managedBy !== "user",
    pluginData,
    fields: fieldsResult.ok
      ? fieldsResult.value.map((field: unknown) => sanitizeCmsField(field))
      : [],
    items: itemsResult.ok
      ? itemsResult.value.map((item: unknown) => sanitizeCmsItem(item))
      : [],
  });
}

async function readPluginDataRecord(input: {
  owner: unknown;
  keys: readonly unknown[];
  getPluginData: ((this: unknown, key: string) => Promise<string | null>) | null;
}) {
  if (!input.getPluginData) return {};
  const keys = input.keys.filter((key): key is string => typeof key === "string");
  const entries = await Promise.all(
    keys.map(async (key) => {
      const result = await safeCall(() => input.getPluginData!.call(input.owner, key));
      if (!result.ok || result.value == null) return null;
      return [key, result.value] as const;
    }),
  );
  return Object.fromEntries(entries.filter(Boolean) as Array<readonly [string, string]>);
}

function sanitizeCmsField(field: unknown) {
  if (!field || typeof field !== "object") return {};
  const raw = field as Record<string, unknown>;
  return sanitizeObject({
    id: raw.id,
    name: raw.name,
    type: raw.type,
    userEditable: raw.userEditable,
    collectionId: raw.collectionId,
    cases: raw.cases,
  });
}

function sanitizeCmsItem(item: unknown) {
  if (!item || typeof item !== "object") return {};
  const raw = item as Record<string, unknown>;
  return sanitizeObject({
    id: raw.id,
    slug: raw.slug,
    draft: raw.draft,
    fieldData: raw.fieldData,
  });
}

async function safeCall<T>(fn: () => T | Promise<T>) {
  try {
    const value = await fn();
    return { ok: true as const, value };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function sanitizeNode(node: unknown) {
  if (!node || typeof node !== "object") return {};
  const raw = node as Record<string, unknown>;
  return sanitizeObject({
    id: raw.id,
    name: raw.name,
    type: raw.type,
    visible: raw.visible,
    locked: raw.locked,
    position: raw.position,
    size: raw.size,
    opacity: raw.opacity,
    rotation: raw.rotation,
    zIndex: raw.zIndex,
    overflow: raw.overflow,
    backgroundColor: raw.backgroundColor,
    backgroundImage: raw.backgroundImage,
    backgroundGradient: raw.backgroundGradient,
    borderRadius: raw.borderRadius,
    border: raw.border,
    link: raw.link,
    linkOpenInNewTab: raw.linkOpenInNewTab,
    layout: raw.layout,
    gap: raw.gap,
    padding: raw.padding,
    width: raw.width,
    height: raw.height,
    minWidth: raw.minWidth,
    maxWidth: raw.maxWidth,
    minHeight: raw.minHeight,
    maxHeight: raw.maxHeight,
    aspectRatio: raw.aspectRatio,
    top: raw.top,
    right: raw.right,
    bottom: raw.bottom,
    left: raw.left,
    centerX: raw.centerX,
    centerY: raw.centerY,
    gridItemFillCellWidth: raw.gridItemFillCellWidth,
    gridItemFillCellHeight: raw.gridItemFillCellHeight,
    gridItemHorizontalAlignment: raw.gridItemHorizontalAlignment,
    gridItemVerticalAlignment: raw.gridItemVerticalAlignment,
    gridItemColumnSpan: raw.gridItemColumnSpan,
    gridItemRowSpan: raw.gridItemRowSpan,
    componentIdentifier: raw.componentIdentifier,
    componentName: raw.componentName,
    insertURL: raw.insertURL,
    controls: raw.controls,
    typedControls: raw.typedControls,
    isVariant: raw.isVariant,
    isPrimaryVariant: raw.isPrimaryVariant,
    gesture: raw.gesture,
    inheritsFromId: raw.inheritsFromId,
    font: raw.font,
    inlineTextStyle: raw.inlineTextStyle,
    text:
      typeof raw.text === "string"
        ? raw.text.slice(0, 400)
        : typeof raw.characters === "string"
          ? raw.characters.slice(0, 400)
          : undefined,
  });
}

function getPublishUrl(value: unknown) {
  if (!value || typeof value !== "object") return "";
  const raw = value as Record<string, unknown>;
  const direct = typeof raw.url === "string" ? raw.url : "";
  if (/^https?:\/\//.test(direct)) return direct;
  for (const key of ["production", "staging"] as const) {
    const publish = raw[key];
    if (!publish || typeof publish !== "object") continue;
    const url = (publish as Record<string, unknown>).url;
    if (typeof url === "string" && /^https?:\/\//.test(url)) return url;
  }
  return "";
}

function sanitizeCodeFile(codeFile: unknown) {
  if (!codeFile || typeof codeFile !== "object") return {};
  const raw = codeFile as Record<string, unknown>;
  return sanitizeObject({
    id: raw.id,
    name: raw.name,
    path: raw.path,
    versionId: raw.versionId,
    exports: raw.exports,
  });
}

function chooseExportEngine(input: {
  exportMode: ExportMode;
  hasPublishedUrl: boolean;
  componentModules: ComponentModuleManifest[];
}): ExportEngine {
  if (input.exportMode === "components" && input.componentModules.length > 0) {
    return "component-module";
  }
  if (input.exportMode === "full-site" && input.hasPublishedUrl) {
    return "hybrid";
  }
  if (input.exportMode === "full-site") return "page-node-tree";
  if (input.hasPublishedUrl) return "published-runtime";
  return input.componentModules.length > 0
    ? "component-module"
    : "plugin-approximation";
}

function collectComponentModules(input: {
  components: CapturableNode[];
  selection: CapturableNode[];
  codeFiles: readonly unknown[];
}) {
  const modules = new Map<string, ComponentModuleManifest>();

  const add = (entry: ComponentModuleManifest) => {
    if (!entry.insertURL || !/^https?:\/\//.test(entry.insertURL)) return;
    const key = `${entry.source}:${entry.insertURL}:${entry.name}`;
    if (!modules.has(key)) modules.set(key, entry);
  };

  for (const node of input.components) {
    const raw = node as Record<string, unknown>;
    const insertURL = typeof raw.insertURL === "string" ? raw.insertURL : "";
    add({
      id: typeof raw.id === "string" ? raw.id : undefined,
      name:
        typeof raw.name === "string" && raw.name.trim()
          ? raw.name.trim()
          : typeof raw.componentName === "string" && raw.componentName.trim()
            ? raw.componentName.trim()
            : "FramerComponent",
      source: "component-node",
      insertURL,
      componentIdentifier:
        typeof raw.componentIdentifier === "string"
          ? raw.componentIdentifier
          : undefined,
      componentName:
        typeof raw.componentName === "string" ? raw.componentName : undefined,
      controls: sanitizeRecord(raw.controls),
      typedControls: sanitizeRecord(raw.typedControls),
    });
  }

  for (const node of input.selection) {
    const raw = node as Record<string, unknown>;
    const insertURL = typeof raw.insertURL === "string" ? raw.insertURL : "";
    add({
      id: typeof raw.id === "string" ? raw.id : undefined,
      name:
        typeof raw.componentName === "string" && raw.componentName.trim()
          ? raw.componentName.trim()
          : typeof raw.name === "string" && raw.name.trim()
            ? raw.name.trim()
            : "FramerComponent",
      source: isComponentInstanceNode(node)
        ? "component-instance"
        : "selected-component",
      insertURL,
      componentIdentifier:
        typeof raw.componentIdentifier === "string"
          ? raw.componentIdentifier
          : undefined,
      componentName:
        typeof raw.componentName === "string" ? raw.componentName : undefined,
      controls: sanitizeRecord(raw.controls),
      typedControls: sanitizeRecord(raw.typedControls),
    });
  }

  for (const codeFile of input.codeFiles) {
    if (!codeFile || typeof codeFile !== "object") continue;
    const raw = codeFile as Record<string, unknown>;
    const exports = Array.isArray(raw.exports) ? raw.exports : [];
    for (const exported of exports) {
      if (!exported || typeof exported !== "object") continue;
      const item = exported as Record<string, unknown>;
      if (item.type !== "component") continue;
      const insertURL =
        typeof item.insertURL === "string" ? item.insertURL : "";
      add({
        id: typeof raw.id === "string" ? raw.id : undefined,
        name:
          typeof item.name === "string" && item.name.trim()
            ? item.name.trim()
            : "FramerComponent",
        source: "code-file-export",
        insertURL,
        codeFileId: typeof raw.id === "string" ? raw.id : undefined,
        codeFileName: typeof raw.name === "string" ? raw.name : undefined,
        isDefaultExport:
          typeof item.isDefaultExport === "boolean"
            ? item.isDefaultExport
            : undefined,
      });
    }
  }

  return Array.from(modules.values());
}

function sanitizeRecord(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }
  return sanitizeObject(value);
}

function sanitizeObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object") return {};
  const input = value as Record<string, unknown>;
  const output: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(input)) {
    if (entry == null) continue;
    if (
      typeof entry === "string" ||
      typeof entry === "number" ||
      typeof entry === "boolean"
    ) {
      output[key] = entry;
      continue;
    }
    if (Array.isArray(entry)) {
      output[key] = entry
        .slice(0, 120)
        .map((item) => {
          if (
            item == null ||
            typeof item === "string" ||
            typeof item === "number" ||
            typeof item === "boolean"
          ) {
            return item;
          }
          if (typeof item === "object") {
            return sanitizeObject(item);
          }
          return String(item);
        })
        .filter((item) => item !== undefined);
      continue;
    }
    if (typeof entry === "object") {
      output[key] = sanitizeObject(entry);
    }
  }
  return output;
}

function simplifySelection(nodes: CapturableNode[]): SelectionNode[] {
  return nodes
    .map((node) => ({
      id: String((node as any)?.id ?? ""),
      name:
        typeof (node as any)?.name === "string"
          ? (node as any).name
          : undefined,
      type:
        typeof (node as any)?.type === "string"
          ? (node as any).type
          : undefined,
    }))
    .filter((node) => node.id.length > 0)
    .slice(0, 60);
}

async function readNodesByIds(ids: string[], knownComponents: ComponentNode[]) {
  const nodes: CapturableNode[] = [];
  for (const id of ids) {
    const node = await framer.getNode(id).catch(() => null);
    if (node) {
      nodes.push(node);
      continue;
    }

    const knownComponent = knownComponents.find(
      (component) => component.id === id,
    );
    if (knownComponent) nodes.push(knownComponent);
  }
  return nodes;
}

async function readFullSiteRoots(
  knownComponents: ComponentNode[],
): Promise<FullSiteRoots> {
  const [webPages, designPages, canvasRoot] = await Promise.all([
    framer.getNodesWithType("WebPageNode").catch(() => []),
    framer.getNodesWithType("DesignPageNode").catch(() => []),
    framer.getCanvasRoot().catch(() => null),
  ]);

  const pageRoots: CapturableNode[] =
    webPages.length > 0
      ? webPages
      : designPages.length > 0
        ? designPages
        : canvasRoot
          ? ((await framer
              .getChildren((canvasRoot as any).id)
              .catch(() => [])) ?? [])
          : [];
  const componentRoots = await readNodesByIds(
    knownComponents.map((node) => node.id),
    knownComponents,
  );
  const roots = [...pageRoots, ...componentRoots].filter(Boolean);
  const rootKinds: FullSiteRoots["rootKinds"] = {};

  for (const node of pageRoots) {
    const id = String((node as any)?.id ?? "");
    if (id) rootKinds[id] = "page";
  }

  for (const node of componentRoots) {
    const id = String((node as any)?.id ?? "");
    if (id) rootKinds[id] = "component";
  }

  if (canvasRoot) {
    const id = String((canvasRoot as any)?.id ?? "");
    if (id && !rootKinds[id]) rootKinds[id] = "canvas-root";
  }

  return {
    roots,
    pages: pageRoots,
    components: componentRoots,
    rootKinds,
  };
}

async function readSelectionWithRetry(fallback: CanvasNode[]) {
  const attempts = 6;
  for (let i = 0; i < attempts; i += 1) {
    const selection = await framer.getSelection().catch(() => []);
    if (selection.length > 0) return selection;
    // Framer sometimes applies setSelection asynchronously; give it a beat.
    await new Promise((r) => setTimeout(r, 120));
  }
  const finalSelection = await framer.getSelection().catch(() => []);
  return finalSelection.length > 0 ? finalSelection : fallback;
}

function toPropKey(value: string) {
  const cleaned = value
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .split(" ")
    .filter(Boolean);
  if (cleaned.length === 0) return "prop";
  const [first, ...rest] = cleaned;
  const camel =
    first.toLowerCase() +
    rest.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
  return camel.replace(/^[^a-zA-Z]+/, "prop");
}

function inferExportPropsFromSelection(selection: CapturableNode[]) {
  const textNodes = selection.filter((node) => isTextNode(node));
  const firstH1 = textNodes.find((node) => (node as any).tag === "h1");
  const firstH2 = textNodes.find(
    (node) => (node as any).tag === "h2" || (node as any).tag === "h3",
  );
  const firstLink = textNodes.find(
    (node) => typeof (node as any).link === "string" && (node as any).link,
  );

  const heroTitle = firstH1?.name ? toPropKey(firstH1.name) : "title";
  const heroSubtitle = firstH2?.name ? toPropKey(firstH2.name) : "subtitle";
  const ctaLabel = firstLink?.name ? toPropKey(firstLink.name) : "ctaLabel";

  return {
    heroTitle,
    heroSubtitle,
    ctaLabel,
    ctaHref: "ctaHref",
  };
}

async function captureSelectionMetadata(
  selection: CapturableNode[],
  options: {
    rootKinds?: Record<string, "page" | "component" | "canvas-root">;
  } = {},
) {
  const richNodes: SelectionNode[] = [];
  const structuralNodes: SelectionNode[] = [];
  const seenOutput = new Set<string>();

  const push = (node: SelectionNode, rich: boolean) => {
    if (!node.id) return;
    const rootId =
      typeof node.metadata?.rootId === "string" ? node.metadata.rootId : "";
    const key = `${rootId}:${node.id}`;
    if (seenOutput.has(key)) return;
    seenOutput.add(key);
    if (rich) richNodes.push(node);
    else structuralNodes.push(node);
  };

  const totalMaxNodes = 3000;
  const maxNodesPerRoot = Math.max(
    24,
    Math.min(260, Math.floor(totalMaxNodes / Math.max(1, selection.length))),
  );

  for (const [rootIndex, root] of selection.entries()) {
    if (richNodes.length + structuralNodes.length >= totalMaxNodes) break;

    const rootId = String((root as any)?.id ?? "");
    if (!rootId) continue;

    const rootName =
      typeof (root as any)?.name === "string"
        ? String((root as any).name)
        : `Root ${rootIndex + 1}`;
    const rootKind = options.rootKinds?.[rootId] ?? "component";
    const queue: Array<{
      node: CapturableNode;
      depth: number;
      parentId?: string;
      path: string;
    }> = [{ node: root, depth: 0, path: String(rootIndex + 1) }];
    const seenVisit = new Set<string>();
    let capturedForRoot = 0;

    while (
      queue.length > 0 &&
      capturedForRoot < maxNodesPerRoot &&
      richNodes.length + structuralNodes.length < totalMaxNodes
    ) {
      const current = queue.shift()!;
      const node = current.node;
      const id = String((node as any).id ?? "");
      if (!id || seenVisit.has(id)) continue;
      seenVisit.add(id);

      const name =
        typeof (node as any).name === "string" ? (node as any).name : undefined;
      const type = getReadableNodeType(node);

      const rect = await framer.getRect(id).catch(() => null);
      const bounds =
        rect && typeof (rect as any).width === "number"
          ? {
              x: Number((rect as any).x ?? 0),
              y: Number((rect as any).y ?? 0),
              width: Number((rect as any).width ?? 0),
              height: Number((rect as any).height ?? 0),
            }
          : undefined;
      const children = await framer.getChildren(id).catch(() => []);
      const childIds = children
        .map((child: any) => (typeof child?.id === "string" ? child.id : ""))
        .filter(Boolean);
      const image = getBackgroundImage(node);
      const nodeStyles = getNodeStyles(node);
      const nodeTraits = getNodeTraits(node, childIds);
      const component = getNodeComponentModule(node);
      const metadata = {
        rootId,
        rootName,
        rootKind,
        sourceIndex: rootIndex,
        depth: current.depth,
        parentId: current.parentId,
        path: current.path,
        isRoot: current.depth === 0,
        childIds,
        link: (node as any).link,
        linkOpenInNewTab: (node as any).linkOpenInNewTab,
        backgroundColor: (node as any).backgroundColor,
        opacity: (node as any).opacity,
        rotation: (node as any).rotation,
        traits: nodeTraits,
        component,
        styles: nodeStyles,
      };

      if (isTextNode(node)) {
        const text = (await node.getText().catch(() => null)) ?? undefined;
        push(
          {
            id,
            name,
            type: "TextNode",
            text: typeof text === "string" ? text : undefined,
            bounds,
            metadata: {
              ...metadata,
              tag: (node as any).tag,
            },
          } as any,
          true,
        );
      } else if (image) {
        push(
          {
            id,
            name,
            type: "ImageNode",
            bounds,
            metadata: {
              ...metadata,
              src: image.src,
              alt: image.alt,
            },
          },
          true,
        );
      } else if (isSVGNode(node)) {
        push(
          {
            id,
            name,
            type: "SVGNode",
            text: node.svg?.slice(0, 500),
            bounds,
            metadata,
          } as any,
          true,
        );
      } else {
        push(
          {
            id,
            name,
            type: typeof type === "string" ? type : undefined,
            bounds,
            metadata,
          } as any,
          false,
        );
      }

      capturedForRoot += 1;

      children.forEach((child, childIndex) => {
        queue.push({
          node: child,
          depth: current.depth + 1,
          parentId: id,
          path: `${current.path}.${childIndex + 1}`,
        });
      });

      for (const [descendantIndex, descendant] of (
        await getScopedRichDescendants(node)
      ).entries()) {
        queue.push({
          node: descendant,
          depth: current.depth + 1,
          parentId: id,
          path: `${current.path}.d${descendantIndex + 1}`,
        });
      }
    }
  }

  return [...richNodes, ...structuralNodes].slice(0, totalMaxNodes);
}

async function getScopedRichDescendants(node: CapturableNode) {
  const getNodesWithType = (node as any)?.getNodesWithType;
  if (typeof getNodesWithType !== "function") return [];

  const groups = await Promise.all([
    getNodesWithType.call(node, "TextNode").catch(() => []),
    getNodesWithType.call(node, "FrameNode").catch(() => []),
    getNodesWithType.call(node, "SVGNode").catch(() => []),
    getNodesWithType.call(node, "ComponentInstanceNode").catch(() => []),
  ]);

  return groups.flat();
}

function getReadableNodeType(node: CapturableNode) {
  if (isTextNode(node)) return "TextNode";
  if (isFrameNode(node)) return "FrameNode";
  if (isSVGNode(node)) return "SVGNode";
  if (isComponentNode(node)) return "ComponentNode";
  if (isComponentInstanceNode(node)) return "ComponentInstanceNode";
  return typeof (node as any)?.type === "string"
    ? (node as any).type
    : node?.constructor?.name;
}

function getNodeComponentModule(node: CapturableNode) {
  const raw = node as Record<string, unknown>;
  const insertURL = typeof raw.insertURL === "string" ? raw.insertURL : "";
  const hasComponentIdentity =
    insertURL ||
    typeof raw.componentIdentifier === "string" ||
    typeof raw.componentName === "string";
  if (!hasComponentIdentity) return undefined;
  return sanitizeObject({
    id: raw.id,
    name: raw.name,
    source: isComponentInstanceNode(node)
      ? "component-instance"
      : isComponentNode(node)
        ? "component-node"
        : "selected-component",
    insertURL,
    componentIdentifier: raw.componentIdentifier,
    componentName: raw.componentName,
    controls: raw.controls,
    typedControls: raw.typedControls,
  });
}

function getNodeTraits(node: CapturableNode, childIds: string[]) {
  const raw = node as Record<string, unknown>;
  return sanitizeObject({
    nodeClass: getReadableNodeType(node),
    id: raw.id,
    name: raw.name,
    visible: raw.visible,
    locked: raw.locked,
    childIds,
    componentIdentifier: raw.componentIdentifier,
    componentName: raw.componentName,
    insertURL: raw.insertURL,
    controls: raw.controls,
    typedControls: raw.typedControls,
    isVariant: raw.isVariant,
    isPrimaryVariant: raw.isPrimaryVariant,
    gesture: raw.gesture,
    inheritsFromId: raw.inheritsFromId,
    layout: raw.layout,
    gap: raw.gap,
    padding: raw.padding,
    position: raw.position,
    top: raw.top,
    right: raw.right,
    bottom: raw.bottom,
    left: raw.left,
    centerX: raw.centerX,
    centerY: raw.centerY,
    width: raw.width,
    height: raw.height,
    minWidth: raw.minWidth,
    maxWidth: raw.maxWidth,
    minHeight: raw.minHeight,
    maxHeight: raw.maxHeight,
    aspectRatio: raw.aspectRatio,
    zIndex: raw.zIndex,
    overflow: raw.overflow,
    backgroundColor: raw.backgroundColor,
    backgroundImage: raw.backgroundImage,
    backgroundGradient: raw.backgroundGradient,
    border: raw.border,
    borderRadius: raw.borderRadius,
    opacity: raw.opacity,
    rotation: raw.rotation,
    imageRendering: raw.imageRendering,
    font: raw.font,
    inlineTextStyle: raw.inlineTextStyle,
    textTruncation: raw.textTruncation,
    gridItemFillCellWidth: raw.gridItemFillCellWidth,
    gridItemFillCellHeight: raw.gridItemFillCellHeight,
    gridItemHorizontalAlignment: raw.gridItemHorizontalAlignment,
    gridItemVerticalAlignment: raw.gridItemVerticalAlignment,
    gridItemColumnSpan: raw.gridItemColumnSpan,
    gridItemRowSpan: raw.gridItemRowSpan,
    breakpoint: raw.breakpoint,
    link: raw.link,
    linkOpenInNewTab: raw.linkOpenInNewTab,
  });
}

function getBackgroundImage(node: CapturableNode) {
  if (!isFrameNode(node)) return null;
  const image = node.backgroundImage;
  if (!image) return null;
  const src =
    typeof (image as any).url === "string"
      ? (image as any).url
      : typeof (image as any).thumbnailUrl === "string"
        ? (image as any).thumbnailUrl
        : "";
  if (!src) return null;
  return {
    src,
    alt: typeof image.altText === "string" ? image.altText : undefined,
  };
}

function getNodeStyles(node: CapturableNode) {
  const raw = node as Record<string, unknown>;
  return extractFramerNodeStyles(raw);
}
