import fs from "node:fs/promises";
import path from "node:path";
import { hashCanonical, sha256Text } from "./hash.js";
import { canonicalJson } from "./serialize.js";
import {
  CANONICAL_BUNDLE_VERSION,
  ContractValidationError,
  type ContractDomain,
  type ShardRef,
} from "./schema/common.js";
import type { CanonicalSiteManifest } from "./schema/manifest.js";
import type { CanonicalSiteBundle } from "./validate.js";
import {
  assertShardHash,
  assertShardPath,
  validateCanonicalSiteBundle,
  validateManifest,
} from "./validate.js";

type WritableShard = {
  domain: ContractDomain;
  rootKey?: keyof CanonicalSiteManifest["root"];
  path: string;
  value: unknown;
};

export async function writeCanonicalSiteBundle(
  bundle: Omit<CanonicalSiteBundle, "manifest"> & {
    manifest?: Partial<CanonicalSiteManifest>;
  },
  bundleDir: string,
): Promise<CanonicalSiteManifest> {
  await ensureDoesNotContainUnsafeTarget(bundleDir);
  const parent = path.dirname(bundleDir);
  await fs.mkdir(parent, { recursive: true });
  const tempDir = path.join(parent, `.${path.basename(bundleDir)}.${process.pid}.${Date.now()}.tmp`);
  await fs.rm(tempDir, { recursive: true, force: true });
  await fs.mkdir(tempDir, { recursive: true });

  const itemShards = bundle.cms.items.map((items) => ({
    domain: "cms" as const,
    path: `cms/items/${items.collectionId}.json`,
    value: items,
  }));
  const shards: WritableShard[] = [
    { domain: "project", rootKey: "project", path: "project.json", value: bundle.project },
    { domain: "routes", rootKey: "routes", path: "routes.json", value: bundle.routes },
    { domain: "nodes", rootKey: "nodesIndex", path: "nodes/index.json", value: bundle.nodes },
    { domain: "components", rootKey: "componentsIndex", path: "components/index.json", value: bundle.components },
    { domain: "cms", rootKey: "cmsIndex", path: "cms/index.json", value: bundle.cms.index },
    { domain: "cms", path: "cms/bindings.json", value: bundle.cms.bindings },
    ...itemShards,
    { domain: "code", rootKey: "codeIndex", path: "code/index.json", value: bundle.code },
    { domain: "interactions", rootKey: "interactionsIndex", path: "interactions/index.json", value: bundle.interactions },
    { domain: "styles", rootKey: "styles", path: "styles/tokens.json", value: bundle.styles },
    { domain: "assets", rootKey: "assetsIndex", path: "assets/index.json", value: bundle.assets },
    { domain: "evidence", rootKey: "evidence", path: "evidence/runtime.json", value: bundle.evidence },
    { domain: "diagnostics", rootKey: "diagnostics", path: "diagnostics/capabilities.json", value: bundle.diagnostics },
  ];

  const root = {} as CanonicalSiteManifest["root"];
  const domains = emptyDomains();
  for (const shard of shards) {
    assertShardPath(shard.path);
    const ref = await writeShard(tempDir, shard.path, shard.value);
    domains[shard.domain].push(ref);
    if (shard.rootKey) root[shard.rootKey] = ref;
  }

  const manifest: CanonicalSiteManifest = {
    version: CANONICAL_BUNDLE_VERSION,
    bundleId:
      bundle.manifest?.bundleId ??
      hashCanonical({
        project: root.project.sha256,
        routes: root.routes.sha256,
        nodes: root.nodesIndex.sha256,
        components: root.componentsIndex.sha256,
        cms: domains.cms.map((ref) => ref.sha256),
        code: root.codeIndex.sha256,
      }),
    generatedAt: bundle.manifest?.generatedAt ?? new Date().toISOString(),
    sourceUrl: bundle.manifest?.sourceUrl ?? bundle.project.sourceUrl,
    root,
    domains,
  };

  await fs.writeFile(path.join(tempDir, "manifest.json"), canonicalJson(manifest), "utf8");
  validateCanonicalSiteBundle({ ...bundle, manifest });
  await fs.rm(bundleDir, { recursive: true, force: true });
  await fs.rename(tempDir, bundleDir);
  return manifest;
}

export async function readCanonicalSiteBundle(bundleDir: string): Promise<CanonicalSiteBundle> {
  const manifest = validateManifest(await readJson(path.join(bundleDir, "manifest.json")));
  const readRoot = async <T>(key: keyof CanonicalSiteManifest["root"]): Promise<T> => {
    const ref = manifest.root[key];
    assertShardPath(ref.path);
    const absolute = path.join(bundleDir, ref.path);
    const text = await fs.readFile(absolute, "utf8");
    assertShardHash(`manifest.root.${key}`, ref, sha256Text(text));
    return JSON.parse(text) as T;
  };
  const readShard = async <T>(ref: ShardRef): Promise<T> => {
    assertShardPath(ref.path);
    const text = await fs.readFile(path.join(bundleDir, ref.path), "utf8");
    assertShardHash(ref.path, ref, sha256Text(text));
    return JSON.parse(text) as T;
  };
  const cmsIndex = await readRoot<CanonicalSiteBundle["cms"]["index"]>("cmsIndex");
  const bindingRef = manifest.domains.cms.find((ref) => ref.path === (cmsIndex.bindingShardPath ?? "cms/bindings.json"));
  const itemRefs = manifest.domains.cms.filter((ref) => ref.path.startsWith("cms/items/"));
  const bundle: CanonicalSiteBundle = {
    manifest,
    project: await readRoot("project"),
    routes: await readRoot("routes"),
    nodes: await readRoot("nodesIndex"),
    components: await readRoot("componentsIndex"),
    cms: {
      index: cmsIndex,
      items: await Promise.all(
        itemRefs.map((ref) => readShard<CanonicalSiteBundle["cms"]["items"][number]>(ref)),
      ),
      bindings: bindingRef ? await readShard(bindingRef) : { bindings: [] },
    },
    code: await readRoot("codeIndex"),
    interactions: await readRoot("interactionsIndex"),
    styles: await readRoot("styles"),
    assets: await readRoot("assetsIndex"),
    evidence: await readRoot("evidence"),
    diagnostics: await readRoot("diagnostics"),
  };
  return validateCanonicalSiteBundle(bundle);
}

async function readJson(filePath: string) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function writeShard(root: string, relativePath: string, value: unknown): Promise<ShardRef> {
  const absolute = path.join(root, relativePath);
  await fs.mkdir(path.dirname(absolute), { recursive: true });
  const text = canonicalJson(value);
  await fs.writeFile(absolute, text, "utf8");
  return { path: relativePath, sha256: sha256Text(text) };
}

function emptyDomains(): CanonicalSiteManifest["domains"] {
  return {
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
  };
}

async function ensureDoesNotContainUnsafeTarget(bundleDir: string) {
  const resolved = path.resolve(bundleDir);
  if (resolved === path.parse(resolved).root) {
    throw new ContractValidationError("Refusing to write bundle at filesystem root.", [
      { path: "bundleDir", message: resolved },
    ]);
  }
}
