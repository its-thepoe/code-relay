import {
  framer,
  FramerPluginClosedError,
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
  const [apiBaseUrl, setApiBaseUrl] = useState("http://localhost:3000");
  const [busy, setBusy] = useState(false);
  const selection = useSelection();

  const simplified = useMemo(() => simplifySelection(selection), [selection]);
  const selectionLabel =
    simplified.length === 1 ? "1 item" : `${simplified.length} items`;

  useLayoutEffect(() => {
    framer.showUI({
      width: 360,
      height: 420,
      resizable: true,
    });
  }, []);

  async function onCreateJob() {
    if (!sourceUrl.trim()) {
      framer.notify("Paste the published page URL first.", {
        variant: "error",
      });
      return;
    }

    if (simplified.length === 0) {
      framer.notify("Select a section or component on the canvas first.", {
        variant: "error",
      });
      return;
    }

    const pluginCapture: PluginCapture = {
      mode: "framer-plugin",
      selectedNodes: simplified,
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
    <main style={{ padding: 12, display: "grid", gap: 10 }}>
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

      {/* Guideline #7: prefer div role=button over <button> to avoid Framer CSS overrides */}
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
          height: 36,
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

      <div style={{ fontSize: 11, opacity: 0.7, lineHeight: 1.4 }}>
        MVP test: no auth. Sends lightweight selection metadata + URL to the
        local dashboard.
      </div>
    </main>
  );
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
