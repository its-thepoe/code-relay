import {
  framer,
  isTextNode,
  FramerPluginClosedError,
  type ComponentNode,
  type CanvasNode,
} from "framer-plugin";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import "./App.css";

type SelectionNode = {
  id: string;
  name?: string;
  type?: string;
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

  useLayoutEffect(() => {
    framer.showUI({
      width: 360,
      height: 520,
      resizable: true,
    });
  }, []);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const info = await framer.getProjectInfo();
        if (!active) return;
        setProject({ id: info.id, name: info.name });
        const inferredUrl = inferPublishedUrl(info);
        if (inferredUrl) {
          setResolvedSourceUrl(inferredUrl);
        }

        const nodes = await framer.getNodesWithType("ComponentNode");
        if (!active) return;
        const sorted = [...nodes].sort((a, b) =>
          (a.name ?? "").localeCompare(b.name ?? ""),
        );
        setComponents(sorted);
      } catch (error) {
        if (error instanceof FramerPluginClosedError) return;
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
    if (simplified.length === 0 && selectedComponentIds.length === 0) {
      framer.notify("Select a section or component on the canvas first.", {
        variant: "error",
      });
      return;
    }

    const chosenComponents = components.filter((node) =>
      selectedComponentIds.includes(node.id),
    );

    const exportProps = inferExportPropsFromSelection(selection);
    const context = await collectPluginContext({
      selection,
      project,
      components,
      selectedComponentIds,
    });

    const pluginCapture: PluginCapture = {
      mode: "framer-plugin",
      selectedNodes:
        chosenComponents.length > 0
          ? chosenComponents.map((node) => ({
              id: node.id,
              name: node.name ?? undefined,
              type: "ComponentNode",
            }))
          : simplified,
      capturedAt: new Date().toISOString(),
      exportProps,
      project: project ?? undefined,
      context,
    };

    setBusy(true);
    try {
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
        throw new Error(
          `Job creation failed (${response.status}). ${text}`.trim(),
        );
      }

      const job = (await response.json()) as { id: string };
      const jobUrl = `${apiBaseUrl.replace(/\/$/, "")}/jobs/${job.id}`;

      try {
        // @ts-expect-error - not all SDK typings include openURL yet.
        await framer.openURL(jobUrl);
      } catch {
        framer.notify(`Created job: ${job.id}`, { variant: "success" });
      }
    } catch (error) {
      if (error instanceof FramerPluginClosedError) return;
      framer.notify(error instanceof Error ? error.message : String(error), {
        variant: "error",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main
      style={{
        padding: 12,
        display: "grid",
        gap: 10,
        height: "100%",
        gridTemplateRows: "auto auto auto auto auto 1fr auto",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 14 }}>Coderelay Export</div>

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
            padding: "0 10px",
            borderRadius: 8,
            border: "1px solid rgba(0,0,0,0.15)",
            outline: "none",
          }}
        />
        <div style={{ fontSize: 11, opacity: 0.7 }}>
          Using:{" "}
          <code>
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
              maxHeight: 170,
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
                    <span style={{ fontWeight: 600 }}>
                      {node.name ?? "(unnamed)"}
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
    </main>
  );
}

async function collectPluginContext(input: {
  selection: CanvasNode[];
  project: { id: string; name: string } | null;
  components: ComponentNode[];
  selectedComponentIds: string[];
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

function simplifySelection(nodes: CanvasNode[]): SelectionNode[] {
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

function inferExportPropsFromSelection(selection: CanvasNode[]) {
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
