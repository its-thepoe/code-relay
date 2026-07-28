import type { Completeness, Provenanced } from "./common.js";

export type CanonicalProject = {
  id: string;
  sourceUrl?: string;
  publishUrl?: string;
  stagingUrl?: string;
  editorRevision?: string;
  publishedRevision?: string;
  capturedAt: string;
  locales: string[];
  platform?: "framer" | "web" | "unknown";
  requestedOutput: {
    framework: "vite" | "next";
    styling: "tailwind" | "css";
    profile: "snapshot" | "handoff" | "balanced";
  };
  capabilities: Record<string, Completeness>;
  title?: Provenanced<string>;
  description?: Provenanced<string>;
};
