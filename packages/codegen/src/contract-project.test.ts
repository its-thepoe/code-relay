import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { readCanonicalSiteBundle } from "../../content-contract/src/index.js";
import { reconcileEvidenceBundles } from "../../reconcile/src/index.js";
import { createFramerEvidenceBundle } from "../../source-framer/src/index.js";
import { createRuntimeEvidenceBundle } from "../../source-runtime/src/index.js";
import { generateViteProjectFromBundle } from "./contract-project.js";

test("contract-only generator writes a Vite project from a canonical bundle", async () => {
  const runtime = createRuntimeEvidenceBundle({
    sourceUrl: "https://example.com",
    routes: [{ id: "home", path: "/", rootNodeId: "root" }],
    nodes: [{ id: "root", routeIds: ["home"], tag: "main" }],
  });
  const framer = createFramerEvidenceBundle({
    projectId: "framer-project",
    sourceUrl: "https://example.com",
    components: [{ id: "hero", name: "Hero" }],
  });
  const bundle = reconcileEvidenceBundles({ runtime, framer });
  const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-contract-project-"));
  const result = await generateViteProjectFromBundle(bundle, projectDir);
  const manifestBundle = await readCanonicalSiteBundle(path.join(projectDir, ".coderelay"));
  const main = await fs.readFile(path.join(projectDir, "src/main.tsx"), "utf8");

  assert.equal(result.routeCount, 1);
  assert.equal(manifestBundle.routes.routes[0]?.path, "/");
  assert.match(main, /Code Relay canonical bundle/);
  assert.ok(result.generatedFiles.includes(".coderelay/manifest.json"));
});
