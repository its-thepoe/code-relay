import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { readCanonicalSiteBundle, writeCanonicalSiteBundle } from "../../content-contract/src/index.js";
import { createFramerEvidenceBundle } from "../../source-framer/src/index.js";
import { createRuntimeEvidenceBundle } from "../../source-runtime/src/index.js";
import { reconcileEvidenceBundles } from "./index.js";

test("reconcile keeps runtime routes and Framer source context in one valid bundle", async () => {
  const runtime = createRuntimeEvidenceBundle({
    sourceUrl: "https://example.com",
    routes: [{ id: "home", path: "/", rootNodeId: "root" }],
    nodes: [{ id: "root", routeIds: ["home"], tag: "main" }],
    assets: [{ id: "logo", downloadState: "external" }],
  });
  const framer = createFramerEvidenceBundle({
    projectId: "framer-project",
    sourceUrl: "https://example.com",
    collections: [{ id: "posts", name: "Posts", itemsAccess: "ids-only" }],
    components: [{ id: "hero", name: "Hero" }],
    codeFiles: [
      {
        id: "hero-code",
        path: "Hero.tsx",
        hash: "b".repeat(64),
        byteLength: 64,
        sourceAvailable: true,
      },
    ],
  });
  const reconciled = reconcileEvidenceBundles({ runtime, framer });
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-reconcile-"));
  await writeCanonicalSiteBundle(reconciled, path.join(dir, ".coderelay"));
  const read = await readCanonicalSiteBundle(path.join(dir, ".coderelay"));

  assert.equal(read.routes.routes[0]?.path, "/");
  assert.equal(read.components.components[0]?.name, "Hero");
  assert.equal(read.cms.index.collections[0]?.name, "Posts");
  assert.equal(read.code.files[0]?.path, "Hero.tsx");
});
