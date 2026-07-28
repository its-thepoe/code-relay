import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { readCanonicalSiteBundle, writeCanonicalSiteBundle } from "../../content-contract/src/index.js";
import { createRuntimeEvidenceBundle } from "./index.js";

test("runtime source adapter writes a valid canonical bundle with routes and assets", async () => {
  const bundle = createRuntimeEvidenceBundle({
    sourceUrl: "https://example.com",
    routes: [{ id: "home", path: "/", rootNodeId: "root", capturedViewports: ["desktop"] }],
    nodes: [{ id: "root", routeIds: ["home"], tag: "main", text: "Hello" }],
    assets: [{ id: "logo", originalUrl: "https://example.com/logo.png", downloadState: "external" }],
  });
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-source-runtime-"));
  await writeCanonicalSiteBundle(bundle, path.join(dir, ".coderelay"));
  const read = await readCanonicalSiteBundle(path.join(dir, ".coderelay"));

  assert.equal(read.routes.routes[0]?.path, "/");
  assert.equal(read.nodes.nodes[0]?.tag?.value, "main");
  assert.equal(read.assets.assets[0]?.downloadState, "external");
});
