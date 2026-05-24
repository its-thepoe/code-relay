import { framer, FramerPluginClosedError } from "framer-plugin";
import "framer-plugin/framer.css";
import React, { useLayoutEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

type SelectionNode = {
  id: string;
  name?: string;
  type?: string;
};

type PluginCapture = {
  mode: "framer-plugin";
  selectedNodes: SelectionNode[];
  capturedAt: string;
};

function App() {
  const [sourceUrl, setSourceUrl] = useState("");
  const [apiBaseUrl, setApiBaseUrl] = useState("http://localhost:3000");
  const [selection, setSelection] = useState<SelectionNode[]>([]);
  const [busy, setBusy] = useState(false);
  const selectionLabel = useMemo(
    () => (selection.length === 1 ? "1 item" : `${selection.length} items`),
    [selection.length],
  );

  useLayoutEffect(() => {
    framer.showUI({
      width: 360,
      height: 420,
      resizable: true,
    });
  }, []);

  useLayoutEffect(() => {
    let unsub: (() => void) | undefined;

    const load = async () => {
      const initial = await framer.getSelection();
      setSelection(simplifySelection(initial));

      unsub = framer.subscribeToSelection((next) => {
        setSelection(simplifySelection(next));
      });
    };

    void load();

    return () => {
      try {
        unsub?.();
      } catch {
        // ignore
      }
    };
  }, []);

  async function onCreateJob() {
    if (!sourceUrl.trim()) {
      framer.notify("Paste the published page URL first.", {
        variant: "error",
      });
      return;
    }

    if (selection.length === 0) {
      framer.notify("Select a section or component on the canvas first.", {
        variant: "error",
      });
      return;
    }

    const pluginCapture: PluginCapture = {
      mode: "framer-plugin",
      selectedNodes: selection,
      capturedAt: new Date().toISOString(),
    };

    setBusy(true);
    try {
      const response = await fetch(
        `${apiBaseUrl.replace(/\/$/, "")}/api/jobs`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            sourceUrl: sourceUrl.trim(),
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
        // If openURL is missing in a given SDK version, this will throw; we fall back to a toast.
        // @ts-expect-error - not all typings include this yet.
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
    <div style={{ padding: 12, display: "grid", gap: 10 }}>
      <div style={{ fontWeight: 700, fontSize: 14 }}>Coderelay Export</div>

      <label style={{ display: "grid", gap: 6 }}>
        <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.8 }}>
          Published page URL
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

      <button
        type="button"
        disabled={busy}
        onClick={() => void onCreateJob()}
        style={{
          height: 36,
          borderRadius: 10,
          border: "1px solid rgba(0,0,0,0.2)",
          background: busy ? "rgba(0,0,0,0.07)" : "#111",
          color: busy ? "#111" : "#fff",
          cursor: busy ? "default" : "pointer",
          fontWeight: 700,
        }}
      >
        {busy ? "Creating…" : "Create Export Job"}
      </button>

      <div style={{ fontSize: 11, opacity: 0.7, lineHeight: 1.4 }}>
        This is an MVP test: no auth. It sends lightweight selection metadata +
        URL to the local dashboard.
      </div>
    </div>
  );
}

function simplifySelection(selection: any): SelectionNode[] {
  if (!selection) return [];
  const nodes = Array.isArray(selection)
    ? selection
    : selection.nodes
      ? selection.nodes
      : [];
  return nodes
    .map((node: any) => ({
      id: String(node.id ?? ""),
      name: typeof node.name === "string" ? node.name : undefined,
      type: typeof node.type === "string" ? node.type : undefined,
    }))
    .filter((node: SelectionNode) => node.id.length > 0)
    .slice(0, 60);
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
