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
} from "@framer/plugin";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { createCompletedOutcomeCopy } from "../../../packages/shared/src/export-health.js";
import { extractFramerNodeStyles } from "./framer-style-extraction";
import {
  createCapabilityBadges,
  createFinalReportCards,
  createJobOutcomeSummary,
  createPreflightSummary,
  describeJobProgress,
  type JobOutcomeSummary,
} from "./preflight";
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
type JobSnapshot = {
  id: string;
  status: "queued" | "running" | "completed" | "failed";
  sourceUrl?: string;
  exportMode?: ExportMode;
  errorMessage?: string;
  updatedAt?: string;
  artifacts?: {
    zipPath?: string;
    reportPath?: string;
    previewPath?: string;
    capabilityReportPath?: string;
  };
};
type JobReport = Record<string, unknown>;
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
  isVariant?: boolean;
  isPrimaryVariant?: boolean;
  gesture?: string;
  inheritsFromId?: string;
  breakpoint?: string;
  variantName?: string;
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
  const [activeJob, setActiveJob] = useState<JobSnapshot | null>(null);
  const [preflightContext, setPreflightContext] = useState<Record<string, unknown> | null>(null);
  const [preflightBusy, setPreflightBusy] = useState(false);

  const simplified = useMemo(() => simplifySelection(selection), [selection]);
  const selectionLabel =
    simplified.length === 1 ? "1 item" : `${simplified.length} items`;

  const allComponentsSelected =
    components.length > 0 && selectedComponentIds.length === components.length;
  const selectedComponentCount =
    selectedComponentIds.length > 0 ? selectedComponentIds.length : components.length;
  const preflightSummary = useMemo(
    () =>
      createPreflightSummary({
        exportMode,
        sourceUrl,
        resolvedSourceUrl,
        selectionCount: simplified.length,
        selectedComponentCount,
        componentCount: components.length,
        context: preflightContext as any,
      }),
    [
      exportMode,
      sourceUrl,
      resolvedSourceUrl,
      simplified.length,
      selectedComponentCount,
      components.length,
      preflightContext,
    ],
  );

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

  useEffect(() => {
    if (!activeJob) return;
    if (activeJob.status === "completed" || activeJob.status === "failed") {
      return;
    }

    let active = true;
    const baseUrl = normalizeApiBaseUrl(apiBaseUrl);
    const poll = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/jobs/${activeJob.id}`);
        if (!response.ok) return;
        const next = (await response.json()) as JobSnapshot;
        if (!active) return;
        setActiveJob(next);
      } catch (error) {
        log("warn", "Could not refresh job status", error);
      }
    };

    void poll();
    const interval = window.setInterval(() => {
      void poll();
    }, 1800);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [activeJob?.id, activeJob?.status, apiBaseUrl]);

  useEffect(() => {
    let active = true;

    const run = async () => {
      setPreflightBusy(true);
      try {
        const selectionForPreflight =
          exportMode === "full-site"
            ? []
            : await readSelectionWithRetry(selection);
        const fullSiteRoots =
          exportMode === "full-site" ? await readFullSiteRoots(components) : null;
        const context = await collectPluginContext({
          exportMode,
          selection: selectionForPreflight,
          project,
          components,
          selectedComponentIds:
            exportMode === "full-site"
              ? components.map((node) => node.id)
              : selectedComponentIds,
          captureSource:
            exportMode === "full-site"
              ? "full-site"
              : exportMode === "components" || selectedComponentIds.length > 0
                ? "component-catalog"
                : "canvas-selection",
          sitePages: fullSiteRoots?.pages ?? [],
          sourceUrl: sourceUrl.trim(),
          resolvedSourceUrl,
        });
        if (!active) return;
        setPreflightContext(context as Record<string, unknown>);
      } catch (error) {
        if (!active) return;
        log("warn", "Capability preflight failed", error);
      } finally {
        if (active) setPreflightBusy(false);
      }
    };

    void run();
    return () => {
      active = false;
    };
  }, [
    exportMode,
    sourceUrl,
    resolvedSourceUrl,
    project?.id,
    components,
    selectedComponentIds,
    selection,
  ]);

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
        log("info", "Reading full site route and component manifests from Framer");
        fullSiteRoots = await readFullSiteRoots(components);
        // Full-site visual output is captured from each published route. Editor
        // trees are a different identity/coordinate space and are metadata only.
        sourceNodes = [];
        log("info", "Read full site roots", {
          roots: fullSiteRoots.roots.length,
          pages: fullSiteRoots.pages.length,
          components: fullSiteRoots.components.length,
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

      const liveSimplified =
        exportMode === "full-site"
          ? simplifySelection(fullSiteRoots?.pages ?? [])
          : simplifySelection(sourceNodes);

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

      const richSelectedNodes =
        exportMode === "full-site"
          ? []
          : await captureSelectionMetadata(sourceNodes, {
              rootKinds: fullSiteRoots?.rootKinds,
              onReadFailure: (failure) =>
                log("warn", "Framer node read failed", failure),
              onChunkComplete: (chunk) =>
                log("info", "Captured editor root chunk", chunk),
            });
      log("info", "Captured selection metadata", {
        count: richSelectedNodes.length,
        textNodes: richSelectedNodes.filter((node) => node.text).length,
      });
      const exportProps =
        exportMode === "full-site"
          ? undefined
          : inferExportPropsFromSelection(sourceNodes);
      log("info", "Inferred export props", exportProps);
      const context = await collectPluginContext({
        exportMode,
        selection:
          exportMode === "full-site"
            ? []
            : sourceNodes,
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
        capturedNodeCount: richSelectedNodes.length,
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
      log("info", "Prepared plugin export payload", {
        exportMode,
        sourceUrl: sourceUrl.trim() || resolvedSourceUrl,
        selectedNodeCount: pluginCapture.selectedNodes.length,
        pageCount: fullSiteRoots?.pages.length ?? 0,
        componentCount: components.length,
        codeFileCount: Array.isArray((context as any)?.codeFiles)
          ? (context as any).codeFiles.length
          : 0,
        cmsCollectionCount: Array.isArray((context as any)?.cmsCollections)
          ? (context as any).cmsCollections.length
          : 0,
      });

      const effectiveSourceUrl =
        sourceUrl.trim() ||
        resolvedSourceUrl ||
        (project
          ? `framer://project/${project.id}`
          : "framer://project/unknown");
      const baseUrl = normalizeApiBaseUrl(apiBaseUrl);
      const response = await fetch(`${baseUrl}/api/jobs`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sourceUrl: effectiveSourceUrl,
          exportMode,
          pluginCapture,
        }),
      });

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

      const job = (await response.json()) as JobSnapshot;
      setActiveJob(job);
      log("info", "Job created", job);
      framer.notify("Export queued. Completion is confirmed after build and render checks.", {
        variant: "info",
      });
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
      className="plugin-shell"
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
        gridTemplateRows: "auto auto auto auto auto auto 1fr auto",
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
        <div>
          <div style={{ fontWeight: 800, fontSize: 15 }}>Coderelay Export</div>
          <div style={{ fontSize: 11, opacity: 0.65, marginTop: 2 }}>
            Framer to code with runtime fidelity checks
          </div>
        </div>
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

      <JobStatusCard
        job={activeJob}
        apiBaseUrl={apiBaseUrl}
        onOpenUrl={(url) => {
          void openFramerUrl(url);
        }}
      />

      <label style={{ display: "grid", gap: 6 }}>
        <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.8 }}>
          Published site URL
        </div>
        <input
          value={sourceUrl}
          onChange={(event) => setSourceUrl(event.target.value)}
          placeholder="https://talktoaugust.com/"
          className="plugin-input"
          style={{
            width: "100%",
          }}
        />
        <div style={{ fontSize: 11, opacity: 0.7 }}>
          Runtime source:{" "}
          <code style={{ overflowWrap: "anywhere" }}>
            {sourceUrl.trim() ||
              resolvedSourceUrl ||
              (project ? `framer://project/${project.id}` : "project context")}
          </code>
        </div>
      </label>

      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.8 }}>
          What do you want to export?
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
                title={getModeDescription(value, selectionLabel, components.length)}
                className={[
                  "plugin-toggle",
                  active ? "plugin-toggle-active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{
                  opacity: active ? 1 : 0.92,
                }}
              >
                <span>{label}</span>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 11, opacity: 0.68, lineHeight: 1.35 }}>
          {getModeDescription(exportMode, selectionLabel, components.length)}
        </div>
      </div>

      <label style={{ display: "grid", gap: 6 }}>
        <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.8 }}>
          Local dashboard URL
        </div>
        <input
          value={apiBaseUrl}
          onChange={(event) => setApiBaseUrl(event.target.value)}
          placeholder="http://localhost:3000"
          className="plugin-input"
          style={{
            width: "100%",
          }}
        />
      </label>

      <div className="plugin-summary-row">
        <span>
          Selection: <strong>{selectionLabel}</strong>
        </span>
        <span>
          Components: <strong>{components.length}</strong>
        </span>
      </div>

      <div className="job-card">
        <div className="job-card-top">
          <div>
            <div className="job-card-title">Capability preflight</div>
            <div className="job-card-id">
              {preflightBusy ? "Refreshing…" : preflightSummary.capabilityState}
            </div>
          </div>
          <span className="job-pill">{preflightSummary.exportEngine}</span>
        </div>
        <div className="job-card-copy">
          Runtime source: <code>{preflightSummary.runtimeSource}</code>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            fontSize: 11,
            marginTop: 8,
          }}
        >
          <div>Static pages: <strong>{preflightSummary.staticPageCount}</strong></div>
          <div>CMS templates: <strong>{preflightSummary.cmsTemplateCount}</strong></div>
          <div>CMS items: <strong>{preflightSummary.cmsItemCount}</strong></div>
          <div>Components: <strong>{preflightSummary.componentCount}</strong></div>
          <div>Code files: <strong>{preflightSummary.codeFileCount}</strong></div>
          <div>Responsive captures: <strong>{preflightSummary.responsiveCaptureCount}</strong></div>
        </div>
        <div
          style={{
            marginTop: 8,
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          {preflightSummary.capabilityBadges.length > 0 ? (
            preflightSummary.capabilityBadges.map((badge) => (
              <span key={badge} className="plugin-chip">
                {badge}
              </span>
            ))
          ) : (
            <span style={{ fontSize: 11, opacity: 0.72 }}>
              No preflight capabilities detected yet.
            </span>
          )}
        </div>
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
                  cursor: "pointer",
                }}
                className="plugin-chip"
              >
                {allComponentsSelected ? "Unselect all" : "Select all"}
              </span>
            ) : null}
          </div>
          <div
            className="plugin-list"
            style={{
              maxHeight: 300,
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
                    className="plugin-list-row"
                    style={{
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
                    {(node as any).isVariant ||
                    (node as any).gesture ||
                    (node as any).breakpoint ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          flexWrap: "wrap",
                          fontSize: 10,
                          color: "rgba(255,255,255,0.72)",
                        }}
                      >
                        {(node as any).isVariant ? (
                          <span className="plugin-chip">variant</span>
                        ) : null}
                        {(node as any).isPrimaryVariant ? (
                          <span className="plugin-chip">primary</span>
                        ) : null}
                        {typeof (node as any).breakpoint === "string" ? (
                          <span className="plugin-chip">
                            {(node as any).breakpoint}
                          </span>
                        ) : null}
                        {typeof (node as any).gesture === "string" ? (
                          <span className="plugin-chip">
                            {(node as any).gesture}
                          </span>
                        ) : null}
                      </span>
                    ) : null}
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
                        cursor: "pointer",
                      }}
                      className="plugin-icon-button"
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
        }}
        className="plugin-sticky-footer"
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
          Creates a local job. Keep the dashboard and worker running until the
          status says completed.
        </div>
      </div>

      {showDebug ? (
        <div
          style={{
            position: "absolute",
            inset: 12,
            padding: 10,
            display: "grid",
            gridTemplateRows: "auto 1fr",
            gap: 8,
          }}
          className="plugin-overlay"
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
            className="plugin-code"
            style={{
              overflow: "auto",
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

function JobStatusCard({
  job,
  apiBaseUrl,
  onOpenUrl,
}: {
  job: JobSnapshot | null;
  apiBaseUrl: string;
  onOpenUrl: (url: string) => void;
}) {
  const baseUrl = normalizeApiBaseUrl(apiBaseUrl);
  const [report, setReport] = useState<JobReport | null>(null);
  const [capabilityReport, setCapabilityReport] = useState<JobReport | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!job || job.status !== "completed" || !job.artifacts?.reportPath) {
        setReport(null);
        setCapabilityReport(null);
        return;
      }

      try {
        const [reportResponse, capabilityResponse] = await Promise.all([
          fetch(`${baseUrl}/api/jobs/${job.id}/artifact?type=report`),
          job.artifacts?.capabilityReportPath
            ? fetch(`${baseUrl}/api/jobs/${job.id}/artifact?type=capability-report`)
            : Promise.resolve(null),
        ]);
        if (!reportResponse.ok) return;
        const json = (await reportResponse.json()) as JobReport;
        if (!active) return;
        setReport(json);
        if (capabilityResponse && capabilityResponse.ok) {
          setCapabilityReport((await capabilityResponse.json()) as JobReport);
        } else {
          setCapabilityReport(null);
        }
      } catch {
        if (!active) return;
        setReport(null);
        setCapabilityReport(null);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [baseUrl, job?.artifacts?.reportPath, job?.id, job?.status]);

  if (!job) {
    return (
      <div className="job-card job-card-empty">
        <div>
          <div className="job-card-title">Ready</div>
          <div className="job-card-copy">
            Choose a mode, confirm the source URL, then start an export.
          </div>
        </div>
      </div>
    );
  }

  const dashboardUrl = `${baseUrl}/jobs/${job.id}`;
  const zipUrl = `${baseUrl}/api/jobs/${job.id}/artifact?type=zip`;
  const reportUrl = `${baseUrl}/api/jobs/${job.id}/artifact?type=report`;
  const outcomeSummary: JobOutcomeSummary | null =
    job.status === "completed" ? createJobOutcomeSummary(report) : null;
  const capabilityBadges =
    job.status === "completed" ? createCapabilityBadges(capabilityReport) : [];
  const finalReportCards =
    job.status === "completed" ? createFinalReportCards(report) : [];
  const statusCopy =
    job.status === "completed"
      ? createCompletedOutcomeCopy({
          report,
          surface: "plugin-card",
        })
      : job.status === "failed"
        ? job.errorMessage ?? "The worker failed before artifacts were ready."
        : describeJobProgress(job as any);

  return (
    <div className={["job-card", `job-card-${job.status}`].join(" ")}>
      <div className="job-card-top">
        <div>
          <div className="job-card-title">Latest export</div>
          <div className="job-card-id">{job.id}</div>
        </div>
        <span className="job-pill">{job.status}</span>
      </div>
      <div className="job-card-copy">{statusCopy}</div>
      {job.status === "completed" && outcomeSummary ? (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              fontSize: 11,
              marginTop: 8,
            }}
          >
            <div>
              Cache: <strong>{outcomeSummary.cacheStatus}</strong>
            </div>
            <div>
              Health: <strong>{outcomeSummary.exportHealth}</strong>
            </div>
            <div>
              Build: <strong>{outcomeSummary.buildStatus}</strong>
            </div>
            <div>
              Routes: <strong>{outcomeSummary.routeCount ?? "-"}</strong>
            </div>
            <div>
              Desktop: <strong>{outcomeSummary.desktopScore ?? "-"}</strong>
            </div>
            <div>
              Responsive: <strong>{outcomeSummary.responsiveScore ?? "-"}</strong>
            </div>
          </div>
          {capabilityBadges.length > 0 ? (
            <div
              style={{
                marginTop: 8,
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
              }}
            >
              {capabilityBadges.map((badge) => (
                <span key={badge} className="plugin-chip">
                  {badge}
                </span>
              ))}
            </div>
          ) : null}
          {finalReportCards.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginTop: 8,
              }}
            >
              {finalReportCards.map((card) => (
                <div
                  key={card.key}
                  style={{
                    border: "1px solid var(--plugin-border)",
                    borderRadius: 8,
                    padding: "8px 9px",
                    background: "var(--plugin-surface-muted)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        opacity: 0.72,
                        textTransform: "uppercase",
                      }}
                    >
                      {card.label}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 900,
                        color:
                          card.tone === "good"
                            ? "#059669"
                            : card.tone === "warn"
                              ? "#d97706"
                              : "var(--plugin-text)",
                      }}
                    >
                      {card.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </>
      ) : null}
      <div className="job-card-actions">
        <div
          role="button"
          tabIndex={0}
          className="job-action"
          onClick={() => onOpenUrl(dashboardUrl)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onOpenUrl(dashboardUrl);
            }
          }}
        >
          Open dashboard
        </div>
        {job.status === "completed" && job.artifacts?.zipPath ? (
          <div
            role="button"
            tabIndex={0}
            className="job-action job-action-primary"
            onClick={() => onOpenUrl(zipUrl)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onOpenUrl(zipUrl);
              }
            }}
          >
            Download ZIP
          </div>
        ) : null}
        {job.status === "completed" && job.artifacts?.reportPath ? (
          <div
            role="button"
            tabIndex={0}
            className="job-action"
            onClick={() => onOpenUrl(reportUrl)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onOpenUrl(reportUrl);
              }
            }}
          >
            Open report
          </div>
        ) : null}
      </div>
    </div>
  );
}

function getModeDescription(
  mode: ExportMode,
  selectionLabel: string,
  componentCount: number,
) {
  if (mode === "full-site") {
    return `Best for complete websites. Exports pages, CMS metadata, components, styles, and runtime capture from the published URL.`;
  }

  if (mode === "components") {
    return `Best for a component library. ${componentCount} component${
      componentCount === 1 ? "" : "s"
    } detected in this project.`;
  }

  return `Best for one section or screen. Current canvas selection: ${selectionLabel}.`;
}

function normalizeApiBaseUrl(value: string) {
  return (value.trim() || "http://localhost:3000").replace(/\/$/, "");
}

async function openFramerUrl(url: string) {
  try {
    // @ts-expect-error - not all SDK typings include openURL yet.
    await framer.openURL(url);
  } catch {
    framer.notify(url, { variant: "info" });
  }
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
  capturedNodeCount?: number;
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

  const sanitizedCodeFiles = codeFiles.ok
    ? await Promise.all(codeFiles.value.map((entry) => sanitizeCodeFile(entry)))
    : [];
  const componentModules = collectComponentModules({
    components: selectedOrAllComponents,
    selection: input.selection,
    codeFiles: sanitizedCodeFiles,
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
  const diagnosticRoots =
    input.captureSource === "full-site"
      ? input.sitePages ?? []
      : input.selection;
  const captureDiagnostics = {
    captureSource: input.captureSource,
    capturedNodeCount: input.capturedNodeCount ?? input.selection.length,
    truncated: false,
    truncatedRootIds: [],
    rootSummaries: diagnosticRoots.map((root) => ({
      rootId: root.id,
      rootName: root.name,
      rootKind: input.captureSource === "full-site" ? "page" : "canvas-root",
      capturedCount:
        input.captureSource === "full-site"
          ? 0
          : input.capturedNodeCount ?? input.selection.length,
      stoppedBecause: "complete",
    })),
  } as const;

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
    codeFiles: sanitizedCodeFiles,
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
    captureDiagnostics,
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
      capabilityReport: createCapabilityReport({
        projectInfo,
        publishInfo,
        managedCollections,
        collections,
        canSync,
        codeFiles,
        sanitizedCodeFiles,
        colorStyles,
        textStyles,
        fonts,
        selectedComponentCount: selectedOrAllComponents.length,
        cmsCollectionCount: cmsCollections.length,
      }),
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
    title: raw.title,
    pageTitle: raw.pageTitle,
    displayName: raw.displayName,
    slug: raw.slug,
    path: raw.path,
    pathname: raw.pathname,
    pagePath: raw.pagePath,
    route: raw.route,
    routePath: raw.routePath,
    url: raw.url,
    canonicalPath: raw.canonicalPath,
    redirectTo: raw.redirectTo,
    redirectUrl: raw.redirectUrl,
    targetUrl: raw.targetUrl,
    destination: raw.destination,
    destinationUrl: raw.destinationUrl,
    externalUrl: raw.externalUrl,
    statusCode: raw.statusCode,
    redirectStatus: raw.redirectStatus,
    collectionId: raw.collectionId,
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

async function sanitizeCodeFile(codeFile: unknown) {
  if (!codeFile || typeof codeFile !== "object") return {};
  const raw = codeFile as Record<string, unknown>;
  const content = typeof raw.content === "string" ? raw.content : undefined;
  const exportDetails = Array.isArray(raw.exports)
    ? raw.exports
        .map((entry) => {
          if (!entry || typeof entry !== "object") return null;
          const exportRecord = entry as Record<string, unknown>;
          return sanitizeObject({
            name: exportRecord.name,
            type: exportRecord.type,
            insertURL: exportRecord.insertURL,
            isDefaultExport: exportRecord.isDefaultExport,
            componentIdentifier: exportRecord.componentIdentifier,
            componentName: exportRecord.componentName,
            isVariant: exportRecord.isVariant,
            isPrimaryVariant: exportRecord.isPrimaryVariant,
            gesture: exportRecord.gesture,
            inheritsFromId: exportRecord.inheritsFromId,
            breakpoint: exportRecord.breakpoint,
            variantName: exportRecord.variantName,
          });
        })
        .filter((entry): entry is Record<string, unknown> => Boolean(entry))
    : [];
  return sanitizeObject({
    id: raw.id,
    name: raw.name,
    path: raw.path,
    versionId: raw.versionId,
    exports: exportDetails
      .map((entry) => (typeof entry.name === "string" ? entry.name : null))
      .filter((entry): entry is string => Boolean(entry)),
    exportDetails,
    content,
    contentHash: content ? await sha256(content) : undefined,
    contentByteLength: content ? new TextEncoder().encode(content).byteLength : 0,
    hasContent: Boolean(content && content.length > 0),
    isDefaultExport:
      typeof raw.isDefaultExport === "boolean" ? raw.isDefaultExport : undefined,
    insertURL: typeof raw.insertURL === "string" ? raw.insertURL : undefined,
    source: raw.source,
  });
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((entry) => entry.toString(16).padStart(2, "0"))
    .join("");
}

function createCapabilityReport(input: {
  projectInfo: Awaited<ReturnType<typeof safeCall>>;
  publishInfo: Awaited<ReturnType<typeof safeCall>>;
  managedCollections: Awaited<ReturnType<typeof safeCall>>;
  collections: Awaited<ReturnType<typeof safeCall>>;
  canSync: Awaited<ReturnType<typeof safeCall>>;
  codeFiles: Awaited<ReturnType<typeof safeCall>>;
  sanitizedCodeFiles: Array<Record<string, unknown>>;
  colorStyles: Awaited<ReturnType<typeof safeCall>>;
  textStyles: Awaited<ReturnType<typeof safeCall>>;
  fonts: Awaited<ReturnType<typeof safeCall>>;
  selectedComponentCount: number;
  cmsCollectionCount: number;
}) {
  const codeFileContentCount = input.sanitizedCodeFiles.filter(
    (entry) => entry.hasContent === true,
  ).length;
  const overrideExportCount = input.sanitizedCodeFiles.reduce((total, entry) => {
    const exportDetails = Array.isArray(entry.exportDetails)
      ? entry.exportDetails
      : [];
    return (
      total +
      exportDetails.filter(
        (detail) =>
          detail &&
          typeof detail === "object" &&
          (detail as Record<string, unknown>).type === "override",
      ).length
    );
  }, 0);
  const codeFileCount = input.sanitizedCodeFiles.length;
  return {
    projectInfo: {
      readable: input.projectInfo.ok,
      error: input.projectInfo.ok ? undefined : input.projectInfo.error,
    },
    publishInfo: {
      readable: input.publishInfo.ok,
      error: input.publishInfo.ok ? undefined : input.publishInfo.error,
    },
    components: {
      readable: true,
      selectedCount: input.selectedComponentCount,
    },
    codeFiles: {
      readable: input.codeFiles.ok,
      error: input.codeFiles.ok ? undefined : input.codeFiles.error,
      count: codeFileCount,
      contentReadable: codeFileContentCount > 0,
      contentReadableCount: codeFileContentCount,
      contentMissingCount: Math.max(0, codeFileCount - codeFileContentCount),
      overrideExportCount,
      truncatedArtifacts: 0,
    },
    cms: {
      managedCollectionsReadable: input.managedCollections.ok,
      managedCollectionsError: input.managedCollections.ok
        ? undefined
        : input.managedCollections.error,
      collectionsReadable: input.collections.ok,
      collectionsError: input.collections.ok ? undefined : input.collections.error,
      collectionCount: input.cmsCollectionCount,
    },
    styles: {
      colorStylesReadable: input.colorStyles.ok,
      colorStylesError: input.colorStyles.ok ? undefined : input.colorStyles.error,
      textStylesReadable: input.textStyles.ok,
      textStylesError: input.textStyles.ok ? undefined : input.textStyles.error,
      fontsReadable: input.fonts.ok,
      fontsError: input.fonts.ok ? undefined : input.fonts.error,
    },
    permissions: {
      syncPermissionReadable: input.canSync.ok,
      syncPermissionError: input.canSync.ok ? undefined : input.canSync.error,
      canSync: input.canSync.ok ? input.canSync.value : false,
    },
    evidence: {
      missingCodeFileSourceIsExplicit:
        input.codeFiles.ok && codeFileCount > codeFileContentCount,
    },
  };
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
      isVariant:
        typeof raw.isVariant === "boolean" ? raw.isVariant : undefined,
      isPrimaryVariant:
        typeof raw.isPrimaryVariant === "boolean"
          ? raw.isPrimaryVariant
          : undefined,
      gesture: typeof raw.gesture === "string" ? raw.gesture : undefined,
      inheritsFromId:
        typeof raw.inheritsFromId === "string"
          ? raw.inheritsFromId
          : undefined,
      breakpoint:
        typeof raw.breakpoint === "string" ? raw.breakpoint : undefined,
      variantName:
        typeof raw.variantName === "string" ? raw.variantName : undefined,
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
      isVariant:
        typeof raw.isVariant === "boolean" ? raw.isVariant : undefined,
      isPrimaryVariant:
        typeof raw.isPrimaryVariant === "boolean"
          ? raw.isPrimaryVariant
          : undefined,
      gesture: typeof raw.gesture === "string" ? raw.gesture : undefined,
      inheritsFromId:
        typeof raw.inheritsFromId === "string"
          ? raw.inheritsFromId
          : undefined,
      breakpoint:
        typeof raw.breakpoint === "string" ? raw.breakpoint : undefined,
      variantName:
        typeof raw.variantName === "string" ? raw.variantName : undefined,
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
        isVariant:
          typeof item.isVariant === "boolean" ? item.isVariant : undefined,
        isPrimaryVariant:
          typeof item.isPrimaryVariant === "boolean"
            ? item.isPrimaryVariant
            : undefined,
        gesture: typeof item.gesture === "string" ? item.gesture : undefined,
        inheritsFromId:
          typeof item.inheritsFromId === "string"
            ? item.inheritsFromId
            : undefined,
        breakpoint:
          typeof item.breakpoint === "string" ? item.breakpoint : undefined,
        variantName:
          typeof item.variantName === "string" ? item.variantName : undefined,
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
    onReadFailure?: (failure: {
      operation: "getRect" | "getChildren" | "getText";
      nodeId: string;
      message: string;
    }) => void;
    onChunkComplete?: (chunk: {
      rootId: string;
      rootIndex: number;
      rootCount: number;
      chunkIndex: number;
      chunkNodeCount: number;
      capturedNodeCount: number;
      complete: boolean;
    }) => void;
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

  for (const [rootIndex, root] of selection.entries()) {
    const rootId = String((root as any)?.id ?? "");
    if (!rootId) continue;

    const rootName = readNodeLabel(root) ?? `Root ${rootIndex + 1}`;
    const rootKind = options.rootKinds?.[rootId] ?? "component";
    const queue: Array<{
      node: CapturableNode;
      depth: number;
      parentId?: string;
      path: string;
    }> = [{ node: root, depth: 0, path: String(rootIndex + 1) }];
    const seenVisit = new Set<string>();
    let capturedForRoot = 0;
    let capturedInChunk = 0;
    let chunkIndex = 0;
    const chunkSize = 250;

    while (queue.length > 0) {
      const current = queue.shift()!;
      const node = current.node;
      const id = String((node as any).id ?? "");
      if (!id || seenVisit.has(id)) continue;
      seenVisit.add(id);

      const name =
        typeof (node as any).name === "string" ? (node as any).name : undefined;
      const type = getReadableNodeType(node);

      const rect = await framer.getRect(id).catch((error) => {
        options.onReadFailure?.({
          operation: "getRect",
          nodeId: id,
          message: error instanceof Error ? error.message : String(error),
        });
        return null;
      });
      const bounds =
        rect && typeof (rect as any).width === "number"
          ? {
              x: Number((rect as any).x ?? 0),
              y: Number((rect as any).y ?? 0),
              width: Number((rect as any).width ?? 0),
              height: Number((rect as any).height ?? 0),
            }
          : undefined;
      const children = await framer.getChildren(id).catch((error) => {
        options.onReadFailure?.({
          operation: "getChildren",
          nodeId: id,
          message: error instanceof Error ? error.message : String(error),
        });
        return [];
      });
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
        const text =
          (await node.getText().catch((error) => {
            options.onReadFailure?.({
              operation: "getText",
              nodeId: id,
              message: error instanceof Error ? error.message : String(error),
            });
            return null;
          })) ??
          name ??
          undefined;
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
      capturedInChunk += 1;

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

      if (capturedInChunk >= chunkSize) {
        options.onChunkComplete?.({
          rootId,
          rootIndex,
          rootCount: selection.length,
          chunkIndex,
          chunkNodeCount: capturedInChunk,
          capturedNodeCount: capturedForRoot,
          complete: queue.length === 0,
        });
        chunkIndex += 1;
        capturedInChunk = 0;
        await new Promise<void>((resolve) => setTimeout(resolve, 0));
      }
    }
    if (capturedInChunk > 0 || capturedForRoot === 0) {
      options.onChunkComplete?.({
        rootId,
        rootIndex,
        rootCount: selection.length,
        chunkIndex,
        chunkNodeCount: capturedInChunk,
        capturedNodeCount: capturedForRoot,
        complete: true,
      });
    }
  }

  return [...richNodes, ...structuralNodes];
}

function readNodeLabel(node: unknown) {
  if (!node || typeof node !== "object") return undefined;
  const raw = node as Record<string, unknown>;
  for (const key of [
    "name",
    "title",
    "pageTitle",
    "displayName",
    "slug",
    "path",
    "pathname",
    "pagePath",
    "route",
    "routePath",
    "url",
    "canonicalPath",
  ]) {
    const value = raw[key];
    if (typeof value !== "string") continue;
    const normalized = normalizeNodeLabel(value);
    if (normalized) return normalized;
  }
  return undefined;
}

function normalizeNodeLabel(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//.test(trimmed)) {
    try {
      return normalizeNodeLabel(new URL(trimmed).pathname);
    } catch {
      return "";
    }
  }
  const path = trimmed.split(/[?#]/)[0] ?? "";
  if (path === "/" || path.toLowerCase() === "home") return "Home";
  const segment = path
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean)
    .at(-1);
  return (segment || path).replace(/[-_]+/g, " ");
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
    isVariant: raw.isVariant,
    isPrimaryVariant: raw.isPrimaryVariant,
    gesture: raw.gesture,
    inheritsFromId: raw.inheritsFromId,
    breakpoint: raw.breakpoint,
    variantName: raw.variantName,
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
    breakpoint: raw.breakpoint,
    variantName: raw.variantName,
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
