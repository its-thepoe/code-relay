import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  CANONICAL_BUNDLE_VERSION,
  ContractValidationError,
  createCanonicalContentBundle,
  createEvidenceRef,
  migrateV1ContentContractToV2,
  readCanonicalSiteBundle,
  validateCanonicalSiteBundle,
  writeCanonicalSiteBundle,
  type CanonicalSiteBundle,
  type Completeness,
} from "./index.js";

const completeness: Completeness = {
  status: "complete",
  reasons: [],
  requiredForProfiles: ["snapshot", "balanced"],
};

function fixtureBundle(): CanonicalSiteBundle {
  const evidence = createEvidenceRef({
    source: "published-runtime",
    sourceId: "fixture",
    capturedAt: "2026-07-22T00:00:00.000Z",
    confidence: 1,
  });
  return {
    manifest: {
      version: CANONICAL_BUNDLE_VERSION,
      bundleId: "pending",
      generatedAt: "2026-07-22T00:00:00.000Z",
      sourceUrl: "https://example.com",
      root: {
        project: { path: "", sha256: "0".repeat(64) },
        routes: { path: "", sha256: "0".repeat(64) },
        nodesIndex: { path: "", sha256: "0".repeat(64) },
        componentsIndex: { path: "", sha256: "0".repeat(64) },
        cmsIndex: { path: "", sha256: "0".repeat(64) },
        codeIndex: { path: "", sha256: "0".repeat(64) },
        interactionsIndex: { path: "", sha256: "0".repeat(64) },
        styles: { path: "", sha256: "0".repeat(64) },
        assetsIndex: { path: "", sha256: "0".repeat(64) },
        evidence: { path: "", sha256: "0".repeat(64) },
        diagnostics: { path: "", sha256: "0".repeat(64) },
      },
      domains: {
        project: [],
        routes: [],
        nodes: [],
        components: [],
        cms: [],
        code: [],
        interactions: [],
        styles: [],
        assets: [],
        evidence: [],
        diagnostics: [],
      },
    },
    project: {
      id: "fixture-project",
      sourceUrl: "https://example.com",
      capturedAt: "2026-07-22T00:00:00.000Z",
      locales: ["en"],
      platform: "web",
      requestedOutput: {
        framework: "vite",
        styling: "tailwind",
        profile: "balanced",
      },
      capabilities: {
        runtime: completeness,
      },
    },
    routes: {
      routes: [
        {
          id: "route-home",
          path: "/",
          aliases: [],
          kind: "page",
          templateKind: "static",
          capturedViewports: ["desktop"],
          completeness,
          rootNodeId: "node-root",
        },
      ],
    },
    nodes: {
      nodes: [
        {
          id: "node-root",
          childIds: [],
          routeIds: ["route-home"],
          attributes: {},
          geometryByViewport: {},
          computedStylesByViewport: {},
          assetIds: ["asset-logo"],
          runtimeDomPaths: ["html/body/main"],
          cmsBindingIds: [],
          interactionIds: [],
          completeness,
          evidence: [evidence],
        },
      ],
    },
    components: { components: [] },
    cms: {
      index: { collections: [], itemShardPaths: [], bindingShardPath: "cms/bindings.json" },
      items: [],
      bindings: { bindings: [] },
    },
    code: { files: [] },
    interactions: { interactions: [] },
    styles: {
      tokens: {},
      fonts: [],
      completeness,
    },
    assets: {
      assets: [
        {
          id: "asset-logo",
          originalUrl: "https://example.com/logo.png",
          consumingNodeIds: ["node-root"],
          downloadState: "external",
          evidence: [evidence],
        },
      ],
    },
    evidence: { conflicts: [] },
    diagnostics: {
      domains: { runtime: completeness },
      warnings: [],
      errors: [],
    },
  };
}

test("canonical bundle writes and reads a hash-verified sharded bundle", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-contract-"));
  const bundleDir = path.join(dir, ".coderelay");
  const bundle = fixtureBundle();
  const manifest = await writeCanonicalSiteBundle(bundle, bundleDir);
  const read = await readCanonicalSiteBundle(bundleDir);

  assert.equal(manifest.version, CANONICAL_BUNDLE_VERSION);
  assert.equal(read.routes.routes[0]?.path, "/");
  assert.equal(read.assets.assets[0]?.id, "asset-logo");
});

test("v1 content contract migrates to a partial v2 bundle", () => {
  const legacy = createCanonicalContentBundle({
    sourceUrl: "https://example.com",
    routes: [{ routePath: "/blog", title: "Blog", templateKind: "cms" }],
    components: [{ id: "Hero", name: "Hero", props: ["title"] }],
  });
  const migrated = migrateV1ContentContractToV2(legacy);

  assert.equal(migrated.manifest.version, CANONICAL_BUNDLE_VERSION);
  assert.equal(migrated.routes.routes[0]?.templateKind, "cms");
  assert.equal(migrated.project.capabilities.cms?.status, "missing");
});

test("validator rejects duplicate route paths", async () => {
  const bundle = await roundTripFixture();
  bundle.routes.routes.push({
    ...bundle.routes.routes[0]!,
    id: "route-copy",
  });

  assert.throws(
    () => validateCanonicalSiteBundle(bundle),
    (error) =>
      error instanceof ContractValidationError &&
      error.issues.some((entry) => entry.message.includes("duplicate route path")),
  );
});

test("validator rejects dangling node references", async () => {
  const bundle = await roundTripFixture();
  bundle.nodes.nodes[0]!.assetIds = ["missing-asset"];

  assert.throws(
    () => validateCanonicalSiteBundle(bundle),
    (error) =>
      error instanceof ContractValidationError &&
      error.issues.some((entry) => entry.message.includes("dangling asset reference")),
  );
});

async function roundTripFixture() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-contract-valid-"));
  const bundleDir = path.join(dir, ".coderelay");
  await writeCanonicalSiteBundle(fixtureBundle(), bundleDir);
  return readCanonicalSiteBundle(bundleDir);
}

test("reader rejects tampered shard content", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-contract-tamper-"));
  const bundleDir = path.join(dir, ".coderelay");
  await writeCanonicalSiteBundle(fixtureBundle(), bundleDir);
  await fs.writeFile(path.join(bundleDir, "routes.json"), "{\"routes\":[]}\n", "utf8");

  await assert.rejects(
    () => readCanonicalSiteBundle(bundleDir),
    (error) =>
      error instanceof ContractValidationError &&
      error.issues.some((entry) => entry.message.includes("expected")),
  );
});
