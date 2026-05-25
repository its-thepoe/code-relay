import {
  framer,
  isTextNode,
  FramerPluginClosedError,
  type ComponentNode,
  type CanvasNode,
} from "framer-plugin";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
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
        const publishUrl =
          publishInfo &&
          typeof (publishInfo as any).url === "string" &&
          (publishInfo as any).url.length > 0
            ? String((publishInfo as any).url)
            : undefined;
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
      selectedComponentIds.length > 0
        ? "component-catalog"
        : "canvas-selection";
    log("info", "Create export job clicked", {
      captureSource,
      selectedComponentIdsCount: selectedComponentIds.length,
      selectionCount: selection.length,
    });

    if (simplified.length === 0 && selectedComponentIds.length === 0) {
      framer.notify("Select a section or component on the canvas first.", {
        variant: "error",
      });
      log("warn", "Blocked: no canvas selection or component selection");
      return;
    }

    setBusy(true);
    try {
      let sourceNodes: CapturableNode[] = [];

      if (selectedComponentIds.length > 0) {
        log("info", "Reading chosen components directly by id", {
          selectedComponentIds,
        });
        sourceNodes = await readNodesByIds(selectedComponentIds, components);
        log("info", "Read chosen component nodes", {
          requested: selectedComponentIds.length,
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
          selectedComponentIds.length > 0
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

      const richSelectedNodes = await captureSelectionMetadata(sourceNodes);
      log("info", "Captured selection metadata", {
        count: richSelectedNodes.length,
      });
      const exportProps = inferExportPropsFromSelection(sourceNodes);
      log("info", "Inferred export props", exportProps);
      const context = await collectPluginContext({
        selection: sourceNodes,
        project,
        components,
        selectedComponentIds,
        captureSource,
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
          <div style={{ fontSize: 12, opacity: 0.8 }}>
            Components: <strong>{components.length}</strong>
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
            Pick components here to export. If none are selected, we export the
            current canvas selection.
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
          {busy ? "Creating…" : "Create Export Job"}
        </div>

        <div
          style={{ fontSize: 11, opacity: 0.7, lineHeight: 1.4, marginTop: 8 }}
        >
          MVP test: no auth. Sends lightweight selection metadata + URL to the
          local dashboard.
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
  selection: CapturableNode[];
  project: { id: string; name: string } | null;
  components: ComponentNode[];
  selectedComponentIds: string[];
  captureSource: "component-catalog" | "canvas-selection";
}) {
  const selectedComponents = input.components
    .filter((node) => input.selectedComponentIds.includes(node.id))
    .map((node) => sanitizeNode(node));
  const selectionSnapshot = input.selection.map((node) => sanitizeNode(node));

  const methodsToCheck = [
    "ManagedCollection.setFields",
    "ManagedCollection.addItems",
    "ManagedCollection.removeItems",
    "ManagedCollection.setPluginData",
  ] as const;

  const [projectInfo, managedCollections, collections, canSync] =
    await Promise.all([
      safeCall(() => framer.getProjectInfo()),
      safeCall(() => framer.getManagedCollections()),
      safeCall(() => framer.getCollections()),
      safeCall(() => framer.isAllowedTo(...methodsToCheck)),
    ]);

  return {
    capturedAt: new Date().toISOString(),
    pluginMode: framer.mode,
    captureSource: input.captureSource,
    project: input.project,
    projectInfo: projectInfo.ok ? sanitizeObject(projectInfo.value) : null,
    selectedComponents,
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
    },
  };
}

async function safeCall<T>(fn: () => Promise<T>) {
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
    componentIdentifier: raw.componentIdentifier,
    text:
      typeof raw.text === "string"
        ? raw.text.slice(0, 400)
        : typeof raw.characters === "string"
          ? raw.characters.slice(0, 400)
          : undefined,
  });
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

function inferPublishedUrl(projectInfo: unknown): string {
  if (!projectInfo || typeof projectInfo !== "object") return "";
  const info = projectInfo as Record<string, unknown>;
  const keys = [
    "publishedUrl",
    "publishUrl",
    "siteUrl",
    "url",
    "previewUrl",
  ] as const;

  for (const key of keys) {
    const value = info[key];
    if (typeof value === "string" && /^https?:\/\//.test(value)) {
      return value;
    }
  }

  return "";
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

async function captureSelectionMetadata(selection: CapturableNode[]) {
  const nodes: SelectionNode[] = [];
  const seen = new Set<string>();

  const push = (node: SelectionNode) => {
    if (!node.id) return;
    if (seen.has(node.id)) return;
    seen.add(node.id);
    nodes.push(node);
  };

  const queue: CapturableNode[] = [...selection];
  const maxNodes = 120;

  while (queue.length > 0 && nodes.length < maxNodes) {
    const node = queue.shift()!;
    const id = String((node as any).id ?? "");
    if (!id || seen.has(id)) continue;

    const name =
      typeof (node as any).name === "string" ? (node as any).name : undefined;
    const type =
      typeof (node as any).type === "string"
        ? (node as any).type
        : node.constructor?.name;

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

    if (isTextNode(node)) {
      const text = (await node.getText().catch(() => null)) ?? undefined;
      push({
        id,
        name,
        type: "TextNode",
        text: typeof text === "string" ? text : undefined,
        bounds,
        metadata: {
          tag: (node as any).tag,
          link: (node as any).link,
        },
      } as any);
    } else {
      push({
        id,
        name,
        type: typeof type === "string" ? type : undefined,
        bounds,
      } as any);
    }

    const children = await framer.getChildren(id).catch(() => []);
    for (const child of children) queue.push(child);
  }

  return nodes;
}
