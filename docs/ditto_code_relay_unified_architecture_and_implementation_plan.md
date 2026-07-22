# Ditto + Code Relay: Unified Product Architecture and Implementation Plan

Date: 2026-07-22  
Status: implementation plan based on both local working copies  
Recommended canonical repository: `its-thepoe/code-relay`

## 1. Executive decision

Build one product in one repository. Do not maintain Ditto and Code Relay as two active products connected by a bridge, and do not keep a manually copied Ditto compiler inside Code Relay indefinitely.

The merged product should have one pipeline:

```text
Framer editor evidence (when available)
                 +
browser/runtime evidence (always when a public URL is available)
                 ↓
versioned canonical evidence bundle
                 ↓
evidence reconciliation + provenance/confidence
                 ↓
one unified site IR
                 ↓
one source-aware generator
                 ↓
runnable React/Vite or React/Next project
                 ↓
build, route, interaction, CMS, portability, and visual validation
```

The division of strengths is clear:

- Ditto should supply public-site crawling, browser capture, asset localization, DOM/style/layout evidence, visual reconstruction, interaction recipes, motion capture, multi-page route handling, deterministic generation, quality gates, REST/MCP concepts, queueing, persistence, and artifact storage.
- Code Relay should supply Framer plugin/editor evidence, project and publish metadata, component modules, variants, controls, CMS schemas/items, code-file source and compatibility analysis, plugin-to-runtime matching, revision/invalidation semantics, fidelity repair attempts, and the handoff-focused product UI.
- The canonical evidence contract must own the seam between those strengths. Neither capture system nor generator may invent a private parallel shape after the migration.

The current `@coderelay/content-contract` is a useful marker but is not yet that seam. It currently writes a shallow summary manifest. It does not contain or validate the source evidence needed to generate a source-aware project, and no consumer treats it as authoritative.

## 2. What was inspected and what is true today

This plan is based on the local repositories at:

- `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/ditto.site`
- `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay`

Important working-copy facts:

- Ditto is on `main` with uncommitted changes in `compiler/src/cli.ts`, `compiler/src/generate/app.ts`, `compiler/src/site/cloneSite.ts`, and `compiler/src/site/validateSite.ts`, plus the generated `cloned-sites/` directory.
- Code Relay already contains a copied `compiler/` workspace and root scripts that invoke it.
- Code Relay typechecks successfully.
- Code Relay's exporter test run starts successfully and its reported unit/regression cases pass through the observed portion, but the complete long-running suite must be rerun and allowed to finish before migration work begins.
- Ditto's local compiler does not currently typecheck. Its generated Vite redirect code embeds an unescaped template literal at `compiler/src/generate/app.ts:2491` and again at line 2500. Code Relay's copy already avoids this by using string concatenation.
- The Famasi Ditto output contains 12 captured routes, about 49,000 lines of generated TypeScript/TSX/CSS, and 137 inferred route-local components. It has no generated shared `content.ts` module and no emitted interaction runtime for that capture.
- Ditto's command used for Famasi did not request the optional interaction or motion passes. Its lack of interactions is therefore partly a command/default problem, not only an inference failure.
- Code Relay has materially richer Framer source types and manifests than Ditto, including CMS collections, code files, component modules/families, variants, controls, override assignments, route templates, revision manifests, artifact indexes, and compatibility reports.
- Code Relay's package boundaries are mostly conceptual directories, not real workspace packages. Most internal modules import other packages through paths such as `../../shared/src/types.js`; most `packages/*` directories have no `package.json`. This must be corrected before the merged architecture can be considered modular.

## 3. Strength analysis

### 3.1 Ditto's strongest parts

#### Browser capture and rendering evidence

Ditto captures the information required to reproduce what the user actually saw:

- DOM structure and direct text.
- Computed styles at multiple viewports.
- Bounding boxes and visibility.
- Fonts, CSS resources, images, SVGs, video, Lottie, canvases, and iframe fallbacks.
- Responsive differences across captured widths.
- SEO metadata, structured data, manifests, robots, sitemaps, and `llms.txt`.
- Hover/focus state evidence and higher-level interaction recipes.
- Motion and animation evidence when enabled.
- Screenshots for validation rather than generation.

This is the right fidelity foundation. It avoids screenshot-to-code guessing and gives the compiler deterministic browser evidence.

#### Static export quality

Ditto's generated Famasi project demonstrates real strengths:

- Multiple routes are delivered as local Vite entries.
- Source assets are materialized locally.
- Route page bodies and CSS are generated rather than embedded as screenshots.
- Repeated rendered structures can become data-driven components.
- Validation-only node IDs are stripped from the delivered project while runtime anchors are retained where required.
- Tailwind v4 and residual fidelity CSS can coexist.
- Generated apps include useful agent-facing architecture guidance.

#### Defensive capture behavior

Ditto has unusually mature defensive behavior for public-site capture:

- Lazy content and fallback source discovery.
- Transient asset retry.
- Font integrity checks.
- overlay and consent dismissal.
- bot-wall/pollution detection.
- full-page screenshot fallbacks.
- route caps and collection-template collapse.
- structural confirmation of inferred route collections.
- bounded concurrency and worker self-healing.

These are expensive lessons that should be preserved.

#### Validation culture

Ditto's gates cover build validity, capture completeness, asset/font integrity, DOM equivalence, style/layout fidelity, determinism, pollution, perceptual difference, responsiveness, interaction, and motion. Its benchmark fixtures and generated evidence make regressions diagnosable.

#### Service architecture

Ditto already has sensible service concepts:

- REST and MCP APIs.
- list-before-read agent file access.
- queue worker.
- Postgres/Drizzle job persistence.
- local and S3-compatible artifact stores.
- file maps, bundles, and signed/reference-based binary access.

This is a better backend foundation than Code Relay's current local JSON job store.

### 3.2 Ditto's weaknesses

#### Runtime evidence cannot recover source intent

From a public URL alone, Ditto cannot reliably know:

- which repeated element is an authored component versus accidental repetition;
- original component names, variants, controls, or instance overrides;
- which text/image/link is bound to which CMS field;
- unpublished Framer project state;
- source code for Framer code components and overrides;
- design-token identities as authored in Framer;
- the difference between a dynamic template and similar static pages with certainty;
- semantics that are not visible in the rendered DOM.

Its inferred route collections are explicitly a “CMS-handoff boundary,” not CMS recovery.

#### Maintainability is currently secondary to fidelity

The Famasi result is visually useful but expensive to edit:

- about 49,000 source lines for 12 routes;
- 137 route-local inferred components;
- repeated generic names such as `Tile`, `Tile2`, `MediaTile3`;
- duplicated route-local components rather than shared authored families;
- large page modules containing embedded generated data arrays;
- no canonical content module despite substantial repeated content.

That output is a strong migration snapshot, but not yet a clean long-term application codebase.

#### Interactions are opt-in and bounded

Ditto supports recognized tabs, accordions, carousels, and disclosures, plus captured hover/focus and motion. It intentionally does not reproduce arbitrary application JavaScript. Forms, authentication, checkout, search, external APIs, personalization, and complex application state require explicit adapters or safe fallbacks.

Making interaction and motion capture opt-in causes users to interpret a successful static clone as a complete interactive export. The unified product must make capability selection and resulting limitations explicit before capture.

#### Two framework generators increase test burden

Supporting Next and Vite is useful, but route/runtime behavior has already diverged. The local Vite deep-route patch broke the Ditto compiler while Code Relay's copy had a corrected version. Framework adapters must sit behind shared route and runtime contracts with contract tests.

### 3.3 Code Relay's strongest parts

#### Framer editor evidence

The plugin calls Framer APIs for:

- project and publish info;
- component nodes and selected nodes;
- managed and unmanaged CMS collections;
- code files and export metadata;
- color styles, text styles, and fonts;
- component module metadata, variants, gestures, inheritance, breakpoints, controls, and typed controls;
- plugin permissions and capability diagnostics.

This is the source-intent layer Ditto lacks.

#### CMS awareness

Code Relay models:

- collection identity and name;
- fields, field types, enum cases, and editability;
- item IDs, slugs, draft status, and field data;
- references, arrays, rich text, links, images, files, dates, booleans, enums, and colors;
- route templates and CMS route grouping;
- generated CMS data/runtime helpers.

This is a valuable start, but it is not yet a faithful CMS-to-template binding system. Current generated “CMS sections” are generic display components inferred from field names, not the original site's CMS-bound component trees.

#### Code component context

Code Relay captures code-file content when the Framer API exposes it, hashes it, records exports, and analyzes imports and runtime requirements with the TypeScript compiler API. It classifies files as portable, adapter-required, dependency-required, runtime-fallback-required, or unsupported.

It also models:

- component families and variants;
- instance controls;
- inferred transitions;
- override assignments;
- executable previews for compatible code files;
- unadapted source artifacts for unsupported files.

This is exactly the context required for a serious developer handoff.

#### Revision and artifact model

Code Relay has strong ideas around:

- stable source fingerprints;
- revision IDs and parent relationships;
- invalidation plans;
- selective responsive recapture;
- artifact hashes and dependencies;
- best-attempt selection;
- before/after reports;
- cached revisions;
- source artifact diffs.

These ideas should be retained and generalized to the canonical evidence bundle.

#### Fidelity repair loop

The attempt planner diagnoses layout, responsive, typography, asset, motion, and matching problems, applies bounded strategies, detects plateaus, and selects the best result. This is useful after Ditto supplies stronger source capture and gates.

### 3.4 Code Relay's weaknesses

#### The “runtime-kept” full-site strategy is not yet a clean handoff

Code Relay describes full-site output as `runtime-kept-full-site` and `agent-first`, while selection/component output is `reconstructed-react`. This is an admission that the product currently has two quality models:

- preserve runtime-derived structure for fidelity;
- reconstruct selected components for editability.

The merged solution must reconcile evidence at node/component/template level, not choose an entirely different product behavior by export mode.

#### CMS capture is incomplete in important cases

Managed collections currently capture fields and item IDs but write `items: []`. That means “CMS present” can be reported even when the export has no managed collection content. Completeness must be represented per collection and per capability, not as a collection count.

Other current gaps:

- no canonical field-to-rendered-node binding map;
- no robust collection-reference resolution graph;
- no locale model;
- no pagination or truncation state;
- no explicit field read errors in the normalized collection;
- no distinction between empty collection and inaccessible items;
- generic auto-generated CMS sections can invent visual structure unrelated to the source template;
- rich text is rendered with `dangerouslySetInnerHTML` without a documented sanitization boundary.

#### Component matching is heuristic and greedy

The matcher scores text, bounds, type, asset, hierarchy, and section context, then greedily assigns matches above 0.6. This is useful but can fail when:

- repeated cards have the same text or geometry;
- editor and published revisions differ;
- responsive layouts reorder elements;
- nested instances flatten in the runtime DOM;
- Framer-generated wrappers alter hierarchy;
- a single component instance maps to several DOM roots.

Matches need stable identities, one-to-many support, explicit ambiguity, and cross-viewport consensus.

#### Monolithic source files and fake package boundaries

`packages/codegen/src/next-project.ts` is about 5,500 lines and `packages/exporter-core/src/local-export.ts` is about 7,600 lines. Internal packages import each other's `src` directories directly and do not declare workspace dependencies. This prevents independent contracts, makes cycles easier, and makes tests slower and more fragile.

#### Current content contract is not authoritative

`@coderelay/content-contract` currently contains:

- a version number;
- generic content maps;
- shallow route-derived sections;
- shallow component docs;
- safe-edit-area strings;
- generated-file lists.

Its validator only checks `version`, `sourceUrl`, and that `content` is an object. It has no JSON Schema or runtime validation of nested fields. Generator and exporter both build their own summaries from `ExportIR`, and nothing generates a project from this contract. This means the real source of truth remains `ExportIR` plus several side manifests.

## 4. The target architecture

### 4.1 One repository

Use `code-relay` as the canonical repository because it already contains the product UI/plugin/worker/exporter and has already imported the Ditto compiler. After parity and cutover, make the old Ditto repository read-only or an archived mirror.

Do not continue copying files between repositories. Preserve Ditto history using one of these methods, in order of preference:

1. `git subtree` import of the Ditto repository into the Code Relay history, followed by normal in-repo moves.
2. A one-time `git filter-repo --to-subdirectory-filter` import and merge.
3. If history import is too risky, preserve the final Ditto commit SHA in the merge commit body and archive the old repository immediately after parity.

Never use a long-lived Git submodule for the compiler. It recreates the two-repository operational problem.

### 4.2 Real workspace packages

Target package map:

```text
apps/
  plugin/                 Framer capture UI
  web/                    jobs, reports, downloads, revisions
  worker/                 canonical job orchestration
  cli/                    local clone/export CLI

packages/
  contract/               schemas, types, validation, migrations, hashes
  source-framer/          Framer plugin payload -> canonical evidence
  source-runtime/         Ditto browser capture -> canonical evidence
  reconcile/              identity, provenance, binding, conflict resolution
  site-ir/                generator-ready normalized model
  generator/              shared generation core
  generator-vite/         Vite shell and route adapter
  generator-next/         Next shell and route adapter
  runtime/                safe interaction/motion/component adapters
  fidelity/               visual, structural, interaction, CMS gates
  code-compatibility/     code-file dependency and portability analysis
  artifacts/              manifests, hashes, invalidation, bundles
  jobs/                   job state machine and orchestration types
  storage/                local/S3-compatible artifact store
  db/                     persistent job/revision model
  api/                    REST/MCP application layer
  test-utils/             fixture server and integration harnesses
```

The initial migration does not need to physically split every package at once. It does require package manifests and public entrypoints before new logic is added.

Rules:

- Every `packages/*` directory has a `package.json`, `src/index.ts`, and explicit dependencies.
- Production code imports package names such as `@coderelay/contract`, never `../../contract/src/index.js`.
- No package imports from an app.
- Capture packages do not import generators.
- Generators do not import plugin or Playwright APIs.
- The contract package has no dependency on any capture or generator package.
- Framework adapters depend on generator core, never on each other.

### 4.3 Canonical evidence bundle v2

The canonical contract should represent evidence and source intent, not just editable copy. Use a typed package plus a sharded on-disk bundle.

Recommended artifact shape:

```text
.coderelay/
  manifest.json
  project.json
  routes.json
  nodes/
    index.json
    route-<stable-id>.json
  components/
    index.json
    <component-id>.json
  cms/
    index.json
    schemas/<collection-id>.json
    items/<collection-id>.json
    bindings.json
  code/
    index.json
    compatibility.json
    sources/<content-hash>.<ext>
  interactions/
    index.json
  styles/
    tokens.json
    fonts.json
  assets/
    index.json
  evidence/
    runtime.json
    framer.json
    conflicts.json
  diagnostics/
    capabilities.json
    completeness.json
```

`manifest.json` is the canonical root and contains hashes and relative paths to every shard. Sharding prevents one huge JSON file and allows agents, caches, and revisions to read only the required domain.

### 4.4 Required contract concepts

Every top-level record must contain:

```ts
type EvidenceRef = {
  source: "framer-editor" | "published-runtime" | "inferred" | "user";
  sourceId?: string;
  routeId?: string;
  viewport?: "desktop" | "laptop" | "tablet" | "mobile";
  capturedAt: string;
  sourceRevision?: string;
  confidence: number;
  hash?: string;
};

type Provenanced<T> = {
  value: T;
  selectedEvidence: EvidenceRef;
  alternatives?: Array<{ value: T; evidence: EvidenceRef }>;
  conflict?: "none" | "editor-runtime-mismatch" | "ambiguous" | "missing";
};
```

Required domains:

#### Project

- stable project ID;
- source URL and publish/staging URLs;
- editor and published revision identifiers when available;
- capture timestamps;
- locales;
- platform detection;
- capabilities and permission failures;
- requested output framework/styling/profile;
- contract and compiler versions.

#### Routes and templates

- stable route ID;
- normalized path and aliases;
- page/redirect/utility kind;
- static/CMS/component template kind;
- redirect destination, kind, and status;
- template ID and representative route;
- parameter schema and concrete instances;
- SEO metadata per route;
- captured viewport coverage;
- completeness and failure state;
- source/editor route identity;
- route-to-component tree root.

#### Nodes

- stable canonical node ID independent of generated class names;
- parent/children and ordering;
- semantic tag/role;
- text and attributes;
- geometry and computed styles by viewport;
- authored styles and token references;
- assets;
- visibility;
- editor node ID and runtime DOM path(s);
- match cardinality and confidence;
- component instance membership;
- CMS binding membership;
- interaction role;
- evidence refs and conflicts.

#### Components

- stable family and variant IDs;
- authored name and safe generated identifier;
- source type: Framer component, code component, inferred repeat, section, or runtime-only;
- variants and inheritance;
- controls with type, default, constraints, and instance value;
- slots/children;
- instance IDs and route placements;
- canonical node template;
- code-file linkage;
- interaction state machine linkage;
- portability status;
- fallback behavior;
- docs and safe-edit boundaries.

#### CMS

- collection identity, name, management type, and access state;
- schema fields with stable keys, types, enum cases, references, required/editable state;
- item records with stable ID, slug, draft, locale, field data, and completeness;
- explicit `itemsAccess: complete | ids-only | denied | truncated | unsupported`;
- reference graph with unresolved targets;
- route-template binding;
- node bindings: `{ nodeId, collectionId, fieldId, transform, fallback }`;
- asset linkage;
- rich-text content type and sanitization policy;
- pagination/truncation metadata.

#### Code files

- ID, path, version, hash, byte length, source availability;
- exact exported symbols and kinds;
- import/dependency graph;
- component/override linkage;
- browser/global/environment requirements;
- compatibility class and reasons;
- rewrite/adaptation operations applied;
- original immutable source artifact path;
- generated adapted source path;
- validation result.

#### Interactions and motion

- stable interaction ID;
- trigger and accessible equivalent;
- target nodes;
- initial state;
- state machine states and transitions;
- effects: style, visibility, DOM state, route change, scroll, animation;
- captured before/after evidence;
- safety class: replayable, adapter-required, external-side-effect, unsupported;
- reduced-motion behavior;
- validation status.

#### Assets, styles, and fonts

- original URL and localized path;
- content hash, media type, byte size, dimensions;
- source and consuming node IDs;
- download state and reason;
- responsive variants;
- font faces and fallback state;
- authored token IDs and inferred tokens;
- generated CSS variable mapping.

#### Completeness

Do not infer success from counts. Every domain needs explicit status:

```ts
type Completeness = {
  status: "complete" | "partial" | "missing" | "unsupported" | "failed";
  expected?: number;
  captured?: number;
  reasons: string[];
  requiredForProfiles: Array<"snapshot" | "handoff" | "balanced">;
};
```

### 4.5 Runtime validation and migrations

TypeScript types are not validation. Implement:

- Zod schemas or TypeBox plus JSON Schema generation for every public artifact.
- strict parsing at capture boundaries;
- semantic validators for cross-file references, uniqueness, cycles, route collisions, and hash integrity;
- `v1 -> v2` migration for existing `content-contract.json` files;
- forward-version rejection with a clear message;
- deterministic canonical serialization for hashes;
- fixture tests for invalid nested records.

`isCanonicalContentBundle` must be removed or replaced; its current three-field check is not sufficient.

### 4.6 Evidence precedence and conflict policy

Use source-specific precedence, not one global winner:

| Concern | Primary evidence | Fallback | Conflict behavior |
| --- | --- | --- | --- |
| Project/component names | Framer editor | inferred runtime semantics | preserve editor name and record runtime mismatch |
| CMS schema and field IDs | Framer editor | inferred route collections | never invent editor IDs |
| CMS rendered values | editor item data if complete | runtime text/assets | record stale publish/editor mismatch |
| DOM tag/accessible role | runtime | editor node type | runtime wins for rendered semantics |
| Computed layout/style | runtime per viewport | editor style | runtime wins for fidelity; retain authored token refs |
| Component family/variant | editor | repeated subtree inference | editor wins when matched; inference remains fallback |
| Route path/redirect | published runtime plus editor route model | crawler | reject unresolved disagreement on required routes |
| Code source | Framer code file | runtime fallback | never synthesize missing source and label it original |
| Interaction effect | safe runtime replay | editor gesture metadata | require validation before marking replayable |

If editor and published runtime revisions disagree, the user must receive a visible “published source is stale/different” diagnostic. Do not silently merge values from incompatible revisions.

## 5. One generator, not two hidden products

The generator should consume only `CanonicalSiteBundle`, never raw plugin capture, Ditto capture objects, or the legacy `ExportIR`.

Generation decision per subtree:

1. If a portable authored code component exists and passes compatibility/build/interaction validation, use the adapted authored component.
2. Else if an editor component family is confidently matched to runtime nodes, generate one named component with variants/controls and use it for all instances.
3. Else if a repeated runtime subtree is high-confidence and improves source size, generate an inferred component with explicit inferred provenance.
4. Else generate a faithful route-local node subtree using Ditto's renderer.
5. If behavior cannot be reproduced safely, preserve the visual initial state and emit a visible report entry; do not fake completion.

This produces one mixed but coherent application. A route can contain authored code components, editor-derived component families, CMS-bound templates, and fidelity fallback sections at the same time.

### Output profiles

Profiles control thresholds, not separate pipelines:

- `snapshot`: prioritize deterministic visual migration; permit more route-local fallback code.
- `handoff`: require component/CMS/source completeness; fail or report partial when source context is unavailable.
- `balanced` (default): authored source where proven, fidelity fallback elsewhere.

The same contract and generator are used for all profiles.

### Generated project structure

```text
src/
  app/ or routes/
  components/
    authored/
    generated/
    inferred/
  content/
    collections/
    bindings.ts
  runtime/
    interactions/
    motion/
    framer-adapter/
  styles/
    tokens.css
    fidelity.css
  generated/
    provenance.ts
    route-manifest.ts
.coderelay/
  ...canonical evidence bundle...
AGENTS.md
ARCHITECTURE.md
export-report.json
```

Generated docs must be derived from the canonical bundle. They must not separately inspect generator internals and create another interpretation of the project.

## 6. Exact implementation sequence

### Phase 0: establish a green, reproducible baseline

Goal: no architectural work begins on a broken or ambiguous source tree.

1. Create a branch in Code Relay:

   ```bash
   cd "/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay"
   git switch -c codex/unify-ditto-coderelay
   ```

2. Record both current commit SHAs and save patches for uncommitted Ditto changes. Do not discard generated Famasi evidence.
3. Fix the Ditto Vite template literal regression by using `url.pathname + "/"` in the generated config.
4. Add a unit test that calls `generateViteConfig`, parses/typechecks the returned source, and verifies `/dispensary` redirects to `/dispensary/` in dev and preview.
5. Run and record:

   ```bash
   npm --workspace clone-static run typecheck
   npm --workspace clone-static test
   npm run typecheck
   npm run test:exporter
   npm run test:export-e2e
   ```

6. Add a Famasi smoke fixture that verifies `/`, `/dispensary`, and one nested directory route through the Vite dev server and production preview.
7. Prevent generated output, `.next 2`, benchmark result dumps, and local artifact caches from entering normal diffs unless intentionally versioned as fixtures.

Exit criteria:

- both compiler copies are byte-identical or the old copy is removed;
- all baseline tests finish and pass;
- the current Famasi export can build and all selected routes load through localhost;
- no user-owned local edits are lost.

### Phase 1: turn directories into real packages

1. Add package manifests and public entrypoints for `shared`, `codegen`, `exporter-core`, `fidelity`, `matcher`, and the new contract package.
2. Rename package responsibilities rather than preserving misleading names. `shared` should be emptied into domain packages; it must not become a permanent dumping ground.
3. Replace relative source imports with workspace package imports.
4. Add dependency-cycle checking with `dependency-cruiser` or `madge`.
5. Add package-level typecheck and test scripts; keep a root aggregate command.
6. Split only at stable seams first. Do not refactor the 13,000+ lines of generator/orchestrator code cosmetically during this phase.

Exit criteria:

- package graph is explicit;
- no production cross-package `../../*/src` imports remain;
- each package can typecheck from its public API;
- no new cycles.

### Phase 2: implement canonical contract v2

Files to create or replace:

```text
packages/contract/src/schema/
  manifest.ts
  project.ts
  routes.ts
  nodes.ts
  components.ts
  cms.ts
  code.ts
  interactions.ts
  assets.ts
  diagnostics.ts
packages/contract/src/validate.ts
packages/contract/src/hash.ts
packages/contract/src/serialize.ts
packages/contract/src/migrations/v1-to-v2.ts
packages/contract/src/index.ts
packages/contract/test/
```

Implementation steps:

1. Freeze the v2 IDs and reference rules before writing adapters.
2. Implement strict schemas and inferred TypeScript types.
3. Implement deterministic serialization and content hashes.
4. Implement bundle writer with atomic temp-directory-to-final rename.
5. Implement bundle reader with hash and cross-reference validation.
6. Implement v1 migration for the current shallow content contract.
7. Add malformed, missing shard, duplicate ID, dangling reference, cycle, and unknown version tests.
8. Publish JSON Schemas into the generated package for external tools and agents.

Exit criteria:

- a bundle can round-trip without byte or semantic drift;
- corrupted or incomplete bundles fail with domain-specific errors;
- no capture/generator dependency exists in the contract package.

### Phase 3: build the two source adapters

#### Framer adapter

Move plugin normalization out of `apps/plugin/src/App.tsx`. The plugin should collect API responses and call `@coderelay/source-framer` to normalize them.

Tasks:

1. Preserve capability/read failures instead of converting all failures to empty arrays.
2. Record collection item access separately from collection schema access.
3. Add managed-item capture if Framer exposes a safe read API; otherwise emit `ids-only` explicitly.
4. Normalize code files without losing export metadata.
5. Preserve component family, variant, controls, and instance records.
6. Add root traversal budgets and truthful truncation diagnostics. Current diagnostics initialize `truncated: false`; they must be based on actual traversal.
7. Add project/publish revision identifiers if available.
8. Emit a valid canonical `framer` evidence shard.

#### Runtime adapter

Wrap Ditto capture as `@coderelay/source-runtime` rather than making the unified product import compiler internals everywhere.

Tasks:

1. Define the minimum stable Ditto capture API.
2. Map DOM, styles, geometry, assets, fonts, SEO, routes, interactions, and motion into canonical records.
3. Preserve raw Ditto evidence as immutable debug artifacts, but do not make generators depend on it.
4. Make interaction and motion capture explicit profile requirements. `balanced` should enable safe interaction discovery by default.
5. Map inferred route collections as inferred templates with confidence, never as confirmed CMS schemas.
6. Emit complete capability and pollution diagnostics.

Exit criteria:

- both adapters independently produce schema-valid bundles;
- public-URL-only export works without Framer evidence;
- plugin-only component export works without a public URL;
- missing capabilities are represented as partial, not empty-success.

### Phase 4: reconcile identities, CMS bindings, and components

This is the technically hardest phase and should not be assigned as one large junior task.

1. Replace greedy one-to-one matching with candidate sets and cross-viewport consensus.
2. Support one editor node to multiple runtime nodes and one component instance to a runtime subtree.
3. Score matches by stable asset hash, normalized text, geometry, ancestry, sibling order, component identity, route, and viewport consistency.
4. Mark ambiguous matches rather than forcing a winner.
5. Detect editor/published revision mismatch before merging.
6. Build component family templates from editor identity plus matched runtime appearance.
7. Detect CMS bindings by combining:
   - editor collection/field metadata;
   - route template identity;
   - repeated item values;
   - matched runtime text/assets/links;
   - component control values.
8. Require binding confidence thresholds. Keep unresolved content as static fallback and report it.
9. Produce `conflicts.json` for every overridden or unresolved value.

Exit criteria:

- fixtures cover duplicate cards, reordered mobile layouts, nested components, stale publish state, CMS details/listings, and unmatched runtime nodes;
- every generated node has provenance;
- no ambiguous CMS binding is silently treated as exact.

### Phase 5: migrate the generator to contract-only input

1. Add `generateProject(bundle, options)` as the only public generator entrypoint.
2. Write a temporary `ExportIR -> CanonicalSiteBundle` adapter so old tests continue to run during migration.
3. Move route generation first, then assets/styles, then components, CMS, code files, interactions, and docs.
4. Delete generator reads of `pluginCapture`, `runtimeCapture`, and raw source manifests one domain at a time.
5. Replace generic CMS auto-sections with source-template bindings. Keep a generic data browser only as a debug artifact, never in the user-facing route tree.
6. Generate authored/inferred/fallback component directories based on provenance.
7. Deduplicate components across routes using canonical family IDs.
8. Emit a content module whenever editable values exist, not only when Ditto's repeat extractor happens to trigger.
9. Generate docs and agent guidance from the same bundle.
10. Remove the duplicate content-contract writers from `next-project.ts` and `local-export.ts`; the exporter writes the canonical bundle before generation, and generation copies/references it.

Exit criteria:

- generator tests construct canonical bundle fixtures, not `ExportIR` fixtures;
- changing raw plugin/runtime capture after bundle creation cannot change generation;
- generated outputs are deterministic from the bundle;
- Famasi output has materially fewer duplicate components and an editable content layer without unacceptable fidelity loss.

### Phase 6: unify validation and repair

Validation order:

1. Contract integrity.
2. Capture completeness and pollution.
3. Generated TypeScript/build.
4. Static route and redirect behavior in dev and production preview.
5. Asset/font localization.
6. DOM/text/accessibility structure.
7. Visual fidelity by viewport.
8. Responsive overflow and breakpoint behavior.
9. Interaction contract replay.
10. CMS route/item/binding completeness.
11. Code component compatibility and executable preview.
12. Determinism and packaged archive verification.

The attempt planner may change generated strategy but must never mutate captured evidence. Each patch operation must declare:

- which canonical IDs it targets;
- what generated fields it changes;
- why;
- before/after score;
- whether editability was reduced;
- whether the best state was restored.

Exit criteria:

- a high screenshot score cannot hide missing CMS/items/interactions;
- a complete status requires all profile-required gates;
- partial exports remain downloadable but are labeled with exact missing capabilities.

### Phase 7: one worker, persistence, API, and MCP

Use Ditto's DB/queue/storage architecture and Code Relay's revision model.

Canonical job states:

```text
queued
→ planning
→ capturing-editor
→ capturing-runtime
→ reconciling
→ generating
→ validating
→ packaging
→ completed | partial | failed | cancelled
```

Tasks:

1. Move local JSON job behavior behind a repository interface.
2. Persist jobs, revisions, stage events, source fingerprints, capability summaries, and artifact references.
3. Store large bundle shards and binaries in the artifact store, not Postgres JSON columns.
4. Make worker stages resumable and idempotent.
5. Use artifact dependency hashes for invalidation.
6. Reuse Ditto's list/read/bundle MCP pattern and add:
   - `start_export`;
   - `get_export_status`;
   - `get_capability_report`;
   - `list_export_files`;
   - `read_export_files`;
   - `get_export_bundle`;
   - `request_revision`;
   - `compare_revisions`.
7. Keep binaries out of model context.

Exit criteria:

- local and hosted workers use the same orchestration package;
- interrupted jobs resume without corrupting bundles;
- revision cache hits are hash-verified;
- agents can inspect manifests before reading code.

### Phase 8: cutover and retire the duplicate repo

1. Run old Ditto and the unified product on the same fixture matrix.
2. Compare route coverage, build status, visual scores, source size, component reuse, CMS completeness, interaction coverage, and runtime dependencies.
3. Keep a temporary `clone-static` CLI alias so existing Ditto commands continue to work.
4. Change documentation and CI to reference only Code Relay.
5. Tag the final standalone Ditto version.
6. Archive Ditto after two successful release cycles and no rollback-triggering regression.

## 7. Edge cases that must be designed before implementation

### Source availability

- Public URL only: runtime fidelity works; Framer intent is unknown and must be labeled inferred.
- Plugin only/unpublished: component/CMS/code context may work, but rendered fidelity is partial.
- Editor plus stale published URL: do not silently merge; report revision mismatch.
- Published route requires auth or geo/cookie state: preserve capture state metadata and mark non-portable behavior.
- Bot wall/consent overlay: fail capture completeness rather than clone the wall.

### Routes

- trailing slash and extensionless MPA routes;
- base paths and subdirectory deployments;
- query-driven pages that cannot be deduped by pathname;
- hash routes;
- internal and external redirects with status preservation;
- redirect loops;
- CMS slug collisions;
- duplicate normalized routes;
- localized paths;
- 404/utility pages;
- route caps that omit required navigation destinations;
- dynamic routes with zero accessible items;
- very large collection listings.

### CMS

- managed collection with IDs but no readable items;
- empty collection versus denied collection;
- draft and locale-specific items;
- references and circular references;
- deleted reference targets;
- array fields and nested field data;
- rich text with unsafe HTML;
- image/file fields requiring authenticated URLs;
- two collections with the same display name;
- field rename with stable ID;
- item slug changes between editor and publish;
- listing and detail templates sharing components;
- runtime value transformed from source value, such as formatted dates or truncated excerpts.

### Components and code

- nested instances and detached instances;
- variants with the same visible state;
- controls whose values are expressions or unsupported objects;
- one component rendering multiple DOM roots;
- portals;
- Framer internal aliases;
- `@/` project aliases;
- CSS/module imports and local dependency graphs;
- dynamic imports;
- browser globals and SSR;
- environment variables and secrets;
- remote ESM imports;
- incompatible package versions;
- override ordering and conflicting overrides;
- code that performs network mutations on mount;
- code source unavailable while export metadata is visible.

Never embed secrets captured from runtime storage, cookies, request headers, inline scripts, or environment objects into the export.

### Visual/runtime behavior

- canvas/WebGL and animated backgrounds;
- Lottie and video posters;
- iframes and third-party embeds;
- lazy loading and virtualized lists;
- sticky/fixed elements across full-page screenshots;
- CSS container queries;
- variable fonts;
- shadow DOM;
- pseudo-elements;
- view transitions and scroll timelines;
- reduced-motion settings;
- hover-only behavior on touch devices;
- responsive DOM replacement rather than style-only changes;
- content whose layout changes after font load.

### Interactive behavior

- tabs, accordions, disclosure, carousel;
- menu open/close, Escape, focus return, outside click;
- forms with validation but no backend;
- forms with external mutation endpoints;
- search/autocomplete;
- checkout/auth/account state;
- URL mutation and history behavior;
- timers and autoplay;
- drag gestures;
- state stored in local/session storage;
- analytics versus product-critical side effects.

Safe rule: replay observable local UI state only. External mutations require an explicit adapter and user configuration.

## 8. Testing strategy

### Contract tests

- schema acceptance/rejection for every domain;
- deterministic serialization and hashes;
- v1 migration;
- dangling references and cycles;
- version compatibility;
- atomic write recovery.

### Adapter fixtures

- complete Framer project;
- managed CMS IDs-only project;
- denied code-file content;
- plugin truncation;
- public generic site;
- Framer published site;
- stale editor/published pair;
- bot wall and consent overlay.

### Reconciliation fixtures

- exact component match;
- ambiguous repeated cards;
- one-to-many component DOM roots;
- responsive reorder;
- CMS text/image/link bindings;
- conflicting editor/runtime values;
- unmatched nodes.

### Generator golden tests

- static single page;
- multi-page Vite;
- multi-page Next;
- CMS listing/detail;
- component variants and controls;
- portable code component;
- adapter-required code component;
- unsupported code file with preserved source;
- interaction runtime;
- public-URL-only fidelity fallback.

### End-to-end matrix

For each fixture record:

- capture completeness;
- route count and route response;
- build and typecheck;
- source and generated screenshot score per viewport;
- DOM/text coverage;
- CMS schema/item/binding coverage;
- component family/instance coverage;
- code portability;
- interaction contract coverage;
- localized asset ratio;
- generated LOC and duplicate component ratio;
- deterministic output hash;
- packaged ZIP verification.

Required real-world fixtures should include Famasi and at least:

- one static marketing site;
- one large CMS blog/directory;
- one Framer project with variants and code components;
- one interaction-heavy site;
- one site with video/canvas/iframe media;
- one unpublished plugin-only project.

### Regression budgets

Set explicit release thresholds, for example:

- no required route missing;
- build/typecheck 100%;
- deterministic hash 100% for frozen evidence;
- asset localization >= 99% excluding declared external embeds;
- visual score may not regress by more than 2 points per viewport from accepted baseline;
- generated LOC and duplicate components may not grow by more than 10% without an approved reason;
- CMS binding completeness >= 95% for fixtures with readable CMS;
- all replayable interaction contracts pass.

## 9. Observability and operational safeguards

Every stage should emit structured events with:

- job/revision ID;
- stage and route/component/collection ID;
- elapsed time;
- memory usage;
- cache hit/reuse state;
- capability/completeness changes;
- warning/error code;
- artifact IDs and hashes.

Operational limits:

- bounded browser/page concurrency;
- per-route, per-asset, and total job timeouts;
- maximum DOM nodes and bundle bytes with truthful truncation;
- worker heap recycling retained from Ditto;
- resumable route capture;
- atomic artifact publishing;
- cancellation checks between stages;
- source-domain request allowlist/SSRF protection;
- log redaction for URLs containing tokens and sensitive headers.

Do not mark a job completed until the final archive has been extracted into a clean temp directory, dependencies installed from the lockfile, built, served, and required routes checked.

## 10. What must not be merged as-is

- Do not keep both Ditto and Code Relay capture IRs as permanent sources of truth.
- Do not let generator code continue reading raw plugin and runtime payloads directly.
- Do not call a route-template inference result a CMS schema.
- Do not call CMS complete when managed collection items are IDs-only.
- Do not ship generic debug CMS sections in the production route tree.
- Do not preserve two worker/job systems.
- Do not retain direct relative imports into sibling package `src` directories.
- Do not keep a 7,600-line orchestrator and 5,500-line generator as the long-term extension points.
- Do not enable arbitrary captured JavaScript replay.
- Do not hide missing behavior behind a high screenshot score.
- Do not delete raw authored code when adaptation fails.
- Do not archive Ditto until the parity matrix passes.

## 11. Junior-developer execution checklist

The junior developer should work in small PRs in this order:

1. Baseline-fix PR: Vite deep-route syntax/test, ignore generated junk, green commands.
2. Package-boundary PR: package manifests, public entrypoints, import rewrites, cycle check.
3. Contract-foundation PR: IDs, schemas, deterministic serializer, reader/writer tests.
4. Contract-migration PR: v1 reader and migration.
5. Framer-adapter PR: capability-aware canonical editor evidence.
6. Runtime-adapter PR: Ditto evidence mapped into canonical shards.
7. Reconciliation PR 1: IDs and exact/high-confidence matching.
8. Reconciliation PR 2: ambiguity, one-to-many, cross-viewport consensus.
9. CMS-binding PR: schema/items/template/node binding with completeness.
10. Generator PR 1: routes/assets/styles from contract.
11. Generator PR 2: component families and deduplication.
12. Generator PR 3: CMS templates/content modules.
13. Generator PR 4: code components and adapters.
14. Generator PR 5: interactions/motion and generated docs.
15. Validation PR: unified gate report and profile completion rules.
16. Worker/API PR: persistent staged jobs, artifact storage, MCP.
17. Parity/cutover PR: fixture matrix, aliases, docs, archive checklist.

Every PR must include:

- the schema/API change;
- unit tests;
- at least one integration fixture;
- migration/backward-compatibility note in the PR description;
- exact commands run;
- generated artifact diff when output changes;
- no unrelated refactor.

The junior developer should stop and ask for senior review before changing:

- canonical ID rules;
- evidence precedence;
- schema versioning;
- CMS binding confidence thresholds;
- unsafe interaction/code execution policy;
- artifact invalidation semantics;
- release completion thresholds.

## 12. First two-week milestone

The first milestone should not attempt the whole merge. It should prove the seam.

Deliverables:

1. Both repos/tests are green and the Vite deep-route bug is fixed.
2. Code Relay is the declared canonical repo with Ditto history/source imported once.
3. Real workspace package boundaries exist.
4. Canonical contract v2 supports project, routes, nodes, assets, components, CMS schemas/items/completeness, code files, and provenance.
5. A Framer adapter and Ditto adapter both write valid bundles.
6. One small generator path reads only the bundle and produces a Vite project for:
   - a public URL fixture;
   - a plugin-only component fixture;
   - a Framer CMS fixture.
7. Generated docs read the bundle.
8. No legacy generator is deleted yet.

Demo acceptance:

```text
npm run export -- \
  --url https://fixture.example \
  --framer-capture ./fixtures/project.json \
  --profile balanced \
  --framework vite \
  --out ./tmp/export
```

The command must produce:

- schema-valid `.coderelay/manifest.json` and shards;
- a buildable Vite project;
- working `/` and one nested route;
- one editor-named component mapped to runtime styling;
- one CMS collection with an honest item-access status;
- one code-file compatibility record;
- a report showing provenance and unresolved conflicts.

## 13. Definition of mission success

The merge is successful only when all of the following are true:

- One repository is authoritative and no manual compiler copying remains.
- One canonical versioned evidence bundle is the only generator input.
- Runtime-only and Framer-aware exports use the same pipeline.
- Every generated node/component/content value can be traced to editor evidence, runtime evidence, inference, or user input.
- CMS schemas, items, bindings, routes, and completeness are explicit.
- Authored code components are preserved or adapted when safe, and original source is retained when not adaptable.
- Static visual fidelity remains at least as good as Ditto's accepted baseline.
- Generated code is smaller and more reusable than the current Famasi output without hiding fidelity fallbacks.
- Required routes work in dev and production preview.
- Interactions are tested contracts, not assumed from appearance.
- Partial capabilities are reported honestly and do not receive a “complete” label.
- Frozen evidence produces deterministic output.
- The final archive installs, builds, serves, and passes route checks in a clean environment.
- The old Ditto repository can be archived without losing a unique runtime, service, test, or benchmark capability.

The product promise should then be accurate:

> Export a public site or your Framer project into a locally runnable React codebase that preserves visual evidence, understands available CMS and component source context, records what could not be recovered, and gives humans and coding agents one trustworthy source of truth for continued development.
