import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { readCanonicalSiteBundle, writeCanonicalSiteBundle } from "../../content-contract/src/index.js";
import { createFramerEvidenceBundle } from "./index.js";

test("Framer source adapter writes a valid canonical bundle with CMS item access", async () => {
  const bundle = createFramerEvidenceBundle({
    projectId: "project-1",
    sourceUrl: "https://example.com",
    collections: [
      {
        id: "products",
        name: "Products",
        itemsAccess: "ids-only",
        fields: [{ id: "name", name: "Name", type: "string" }],
      },
    ],
    components: [{ id: "hero", name: "Hero" }],
    codeFiles: [
      {
        id: "hero-code",
        path: "Hero.tsx",
        hash: "a".repeat(64),
        byteLength: 128,
        sourceAvailable: true,
        exports: [{ name: "Hero", kind: "component" }],
        compatibility: "portable",
      },
    ],
  });
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-source-framer-"));
  await writeCanonicalSiteBundle(bundle, path.join(dir, ".coderelay"));
  const read = await readCanonicalSiteBundle(path.join(dir, ".coderelay"));

  assert.equal(read.cms.index.collections[0]?.itemsAccess, "ids-only");
  assert.equal(read.components.components[0]?.name, "Hero");
  assert.equal(read.code.files[0]?.compatibility, "portable");
});
