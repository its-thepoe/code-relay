# CodeRelay Implementation Plan: Option 2 + Option 4

## Scope

This plan combines:

1. **Option 2: Revision and artifact model**
2. **Option 4: Plugin Code File content and recursive variant capture**

These two options should be implemented together because Option 4 produces high-value source and component evidence, and Option 2 is what makes that evidence reusable across future exports and improvement revisions.

The goal is not just to improve one broken export. The goal is to make future exports capture the right evidence from the start, persist it in a reusable artifact model, and avoid routine full recapture.

---

## What This Plan Must Achieve

After this work:

- a fresh export captures source-aware component evidence on the first run
- that evidence is stored in revisioned, content-addressed artifacts
- future exports reuse unchanged artifacts instead of blindly recapturing
- improvement revisions only regenerate what is invalidated
- component source, variants, overrides, and instance context are visible in reports
- missing evidence is explicit, not silently treated as success

This plan does **not** require full recapture as the normal path.

Full recapture should happen only when:

- the source fingerprint changed
- artifact schema changed incompatibly
- a required artifact is missing or corrupt
- a capability was unavailable during the original run
- a user explicitly requests a full refresh

---

## Why These Two Options Belong Together

Option 2 without Option 4 gives us a reusable cache for incomplete evidence.

Option 4 without Option 2 gives us better evidence, but we keep recollecting it and cannot safely attach it to prior revisions.

Together they let us:

- capture Code File source once
- fingerprint it
- store it as an immutable artifact
- attach it to the relevant revision
- reuse it in later exports and later improvements
- invalidate only the affected component, template, or generated module when source changes

---

## Desired End State

For every export job, CodeRelay should produce:

```text
job_x
├── revision_0001
│   ├── manifests/
│   │   ├── revision-manifest.json
│   │   ├── invalidation-plan.json
│   │   ├── artifact-index.json
│   │   └── capability-report.json
│   ├── plugin/
│   │   ├── project-snapshot.json
│   │   ├── component-catalog.json
│   │   ├── component-families.json
│   │   ├── override-assignments.json
│   │   └── code-files/
│   │       ├── <hash>.json
│   │       └── <hash>.tsx
│   ├── ir/
│   │   ├── export-ir.json
│   │   └── component-model.json
│   ├── generated/
│   ├── validation/
│   └── export.zip
└── revision_0002
    ├── parent.json
    ├── manifests/
    ├── plugin/
    ├── ir/
    ├── generated/
    ├── validation/
    └── export.zip
```

In addition, a shared content-addressed cache should exist outside the per-job folder:

```text
.coderelay/
└── revision-cache/
    └── <revision-or-artifact-hash>/
```

That shared cache is what prevents repeated rework across later exports and revisions.

---

## Core Rules

### Rule 1: Evidence must be explicit

If the plugin could not read Code File source, the system must record:

- API was unavailable, or
- permission failed, or
- file had no readable content, or
- file capture was truncated, or
- source was external/unresolved

An empty list is not success.

### Rule 2: Reuse is based on fingerprints, not file presence

An artifact is reusable only if:

- schema version matches
- input fingerprint matches
- dependency hashes match
- prior generation completed successfully
- required files still exist

### Rule 3: Source-aware capture must be first-class on fresh exports

Fresh exports should capture:

- Code File source
- Code File exports
- component family graph
- replica and inheritance metadata
- instance controls
- override exports

This should not be treated as a later repair step.

### Rule 4: Revisions inherit by manifest, not by guessing

Every improvement revision must start from:

- a parent revision id
- a reuse plan
- an invalidation plan
- an explicit requested focus

### Rule 5: Regeneration follows dependency scope

If one Code File changes, CodeRelay should regenerate only:

- dependent component family artifacts
- dependent IR nodes
- dependent generated modules
- dependent validations

It should not restart the full export unless the change invalidates the entire graph.

---

## Option 2: Revision and Artifact Model

## Objective

Turn export output into a revisioned, content-addressed pipeline where unchanged artifacts can be reused safely across:

- repeated exports of the same source
- improvement revisions
- revalidate-only runs
- exporter upgrades with selective invalidation

## Deliverables

- revision records
- artifact manifests
- invalidation planning
- shared cache root
- reuse reporting in UI
- migration path for old jobs

## Data Model

### Revision record

```ts
type ExportRevisionRecord = {
  id: string
  jobId: string
  parentRevisionId?: string
  kind: "initial" | "improvement"
  reason:
    | "initial-export"
    | "responsive-improvement"
    | "component-source-refresh"
    | "interaction-improvement"
    | "revalidate-only"
    | "schema-upgrade"
    | "manual-regeneration"
  requestedFocus?: "responsiveness" | "components" | "both" | "revalidate"
  sourceFingerprint: string
  pluginFingerprint?: string
  artifactGraphHash: string
  captureSchemaVersion: string
  irSchemaVersion: string
  codegenVersion: string
  status: "queued" | "planning" | "capturing" | "generating" | "validating" | "completed" | "failed"
  reusedArtifacts: ArtifactReference[]
  invalidatedArtifacts: ArtifactInvalidation[]
  createdAt: string
  updatedAt: string
}
```

### Artifact record

```ts
type ArtifactRecord = {
  id: string
  artifactType: string
  schemaVersion: string
  hash: string
  sourceFingerprint: string
  routePath?: string
  templateId?: string
  componentId?: string
  codeFileId?: string
  viewport?: string
  dependencyHashes: string[]
  filePath: string
  byteSize: number
  createdAt: string
  status: "complete" | "failed"
}
```

### Invalidation record

```ts
type ArtifactInvalidation = {
  artifact: string
  reason:
    | "source-fingerprint-changed"
    | "plugin-source-missing"
    | "schema-version-changed"
    | "dependency-changed"
    | "artifact-missing"
    | "artifact-corrupt"
    | "user-requested-refresh"
  dependsOn?: string[]
}
```

## Artifact Classes

We should support these artifact classes immediately:

- plugin project snapshot
- plugin component catalog
- plugin component family graph
- plugin Code File snapshot
- plugin override assignment graph
- plugin capability report
- export IR
- component model IR
- generated component module
- generated route/page module
- generated stylesheet
- build result
- runtime validation result
- revision report

Responsive capture artifacts already exist in spirit, but this plan keeps focus on options 2 and 4.

## Fingerprinting Strategy

### Job/source fingerprint

Should include:

- source URL
- export mode
- selector
- plugin project id if available
- publish URL if available

### Plugin snapshot fingerprint

Should include:

- component ids and versions
- Code File ids and version ids
- Code File content hashes
- readable capability flags
- collection ids and version markers where relevant

### Component family fingerprint

Should include:

- primary variant id
- variant ids
- inheritance chain
- gesture metadata
- instance controls shape
- linked Code File hash if any

### Generated module fingerprint

Should include:

- relevant IR hash
- codegen version
- dependency artifact hashes

## Reuse / Invalidation Algorithm

### Fresh export

1. compute source fingerprint
2. compute plugin snapshot fingerprint
3. check whether matching artifacts already exist
4. reuse matching artifacts
5. capture only missing or invalid plugin/source artifacts
6. generate only missing dependent IR/codegen artifacts

### Improvement revision

1. load parent revision manifest
2. compute requested focus
3. compute invalidation plan
4. inherit reusable artifact references
5. recompute only invalidated nodes in the artifact graph
6. persist a new revision manifest

### Revalidate-only revision

1. require parent revision id
2. reuse parent generated output
3. rerun validation artifacts only
4. emit a new revision report without capture/codegen recost

## File-Level Work

### `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/packages/shared/src/types.ts`

Add or finish:

- `ExportRevisionRecord`
- `ArtifactRecord`
- `ArtifactInvalidation`
- `ArtifactReference`
- schema-versioned artifact enums
- richer `revisionRequest` typing

### `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/apps/web/lib/jobs-store.ts`

Add or finish:

- revision creation helpers
- parent revision lookup
- invalidation-plan persistence
- artifact manifest path tracking
- before/after revision metadata

### `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/packages/exporter-core/src/local-export.ts`

Add or finish:

- revision planning phase
- content-addressed artifact resolution
- invalidation planning
- revalidate-only fast path
- selective regeneration based on artifact dependency graph
- report patching for inherited revisions

### `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/apps/worker/src/index.ts`

Add or finish:

- revision-aware logging
- stage progress persistence
- artifact manifest persistence
- proper artifact paths in job record

### `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/apps/web/app/jobs/[id]/page.tsx`

Add or finish:

- revision relationship UI
- reuse plan UI
- invalidation reasons UI
- artifact counts
- capability/source capture summary
- revalidate-only visibility

## Tests

Add tests for:

- identical export in different output directories reuses shared cache
- improvement revision inherits parent artifacts
- revalidate-only creates a new revision without new capture
- schema version bump invalidates expected artifacts
- corrupt artifact file forces recapture of that artifact only
- missing parent revision fails clearly

## Acceptance Criteria

- two identical exports should reuse the same Code File and component-family artifacts
- a component-only improvement revision should not force route recapture
- a revalidate-only revision should not rerun capture or codegen
- the revision report must list what was reused and what was invalidated

---

## Option 4: Plugin Code File Content and Recursive Variant Capture

## Objective

Capture enough Framer authoring evidence to reconstruct component families, variant structure, overrides, and source-linked behavior without guessing.

## Deliverables

- full Code File source capture when readable
- structured Code File export metadata
- recursive component family graph
- replica and inheritance model
- instance control snapshots
- override export capture
- capability diagnostics for unavailable source

## What Must Be Captured

### Code Files

For every readable Code File:

- `id`
- `name`
- `path`
- `versionId`
- raw `content`
- content hash
- byte length
- `hasContent`
- export list
- export details
- insertion URL
- default export flag
- export type such as component or override

### Export detail shape

```ts
type CapturedCodeFileExport = {
  name?: string
  type?: string
  insertURL?: string
  isDefaultExport?: boolean
  componentIdentifier?: string
  componentName?: string
  isVariant?: boolean
  isPrimaryVariant?: boolean
  gesture?: string
  inheritsFromId?: string
  breakpoint?: string
  variantName?: string
}
```

### Component graph

For every component node and relevant instance:

- node id
- parent id
- ordered children
- rect
- layout traits
- text/style references
- variant traits
- primary/replica identity
- breakpoint identity
- gesture metadata
- instance controls
- links

### Component family model

Families should be grouped by durable identity, preferably:

1. `componentIdentifier`
2. `componentName`
3. stable component node id fallback

Each family should contain:

- family id
- display name
- primary variant id
- all variants
- instance list
- transition edges
- provenance

### Override capture

For every override export:

- source artifact reference
- export name
- export type
- likely target node/component if exposed
- assigned props if exposed
- dependency list if derivable
- assignment confidence

If assignment is not exposed by the plugin:

- mark it unresolved
- retain source
- allow later runtime evidence to augment it

## Capture Flow

### Phase A: Capability preflight

Before export starts, the plugin should record:

- Code File API availability
- source content readability
- component catalog readability
- CMS readability
- styles readability
- permission failures
- unsupported node categories

### Phase B: Code File snapshot

The plugin should:

1. enumerate available Code Files
2. sanitize each file into a structured payload
3. compute `contentHash`
4. store large source payloads as separate artifacts if necessary
5. record a per-file status

### Phase C: Component family capture

The plugin should:

1. enumerate components
2. walk recursive children for each component root
3. collect variant and inheritance traits
4. collect instance control values
5. map discovered Code File exports back to component families where possible

### Phase D: Family graph construction

The exporter core should:

1. group modules into families
2. identify primary variant
3. derive known transition hints from gesture metadata
4. link instances to route/template context
5. preserve provenance and confidence

## File-Level Work

### `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/apps/plugin/src/App.tsx`

Add or finish:

- async Code File sanitization
- content hashing
- byte-length reporting
- export detail extraction
- capability report generation
- recursive component capture
- chunking strategy for large source payloads
- explicit missing-source diagnostics

### `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/packages/shared/src/types.ts`

Add or finish:

- richer `FramerCodeFile`
- `CapturedCodeFileExport`
- `FramerComponentFamily`
- transition and provenance types

### `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/packages/exporter-core/src/ir.ts`

Add or finish:

- family grouping logic
- primary variant selection
- transition edge storage
- instance-to-family linking
- provenance retention

### `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/packages/exporter-core/src/local-export.ts`

Add or finish:

- Code File artifact persistence
- component family artifact persistence
- explicit capability/report writing
- attachment of plugin source artifacts to revision manifest

## Guardrails

### Do not silently drop source

If a Code File is present but source is unreadable, record:

- `hasContent: false`
- `contentHash: undefined`
- explicit reason in capability report

### Do not invent transition edges

Only create hard transition edges from:

- plugin gesture evidence
- readable source evidence
- runtime evidence in a later stage

Multiple variants alone are not enough.

### Do not flatten component families into one default snapshot

The exporter must retain:

- primary variant
- replica variants
- inheritance
- breakpoint-specific variants when exposed

## Tests

Add tests for:

- Code File content capture with hash and byte size
- export metadata capture for component and override exports
- family grouping by stable identifier
- primary variant selection
- inheritance preservation
- gesture metadata preservation
- unresolved source reported explicitly
- large Code File artifact chunking

## Acceptance Criteria

- every readable Code File is persisted as a source artifact
- every captured component family has a primary variant
- family variants retain inheritance and gesture metadata
- missing source is visible in reports and job UI

---

## Combined Execution Plan

## Phase 1: Finish revision plumbing already started

Implement or complete:

- `revisionRequest` typing
- parent revision lookup
- shared revision cache root
- job artifact path wiring
- revision manifest writing
- report exposure in API/UI

Exit condition:

- the UI can show parent revision, requested focus, revision id, revision report, and artifact references

## Phase 2: Make the artifact graph first-class

Implement:

- `artifact-index.json`
- `invalidation-plan.json`
- reusable artifact registry
- dependency-based regeneration

Exit condition:

- a second export can explain exactly what it reused and why

## Phase 3: Make plugin source capture first-class on fresh exports

Implement:

- Code File source artifacts
- per-file capture status
- capability report
- recursive component family capture

Exit condition:

- a new export includes source-aware component artifacts without needing a repair pass

## Phase 4: Attach source artifacts to revisions and reuse them

Implement:

- artifact references from revision manifest to Code File/component family artifacts
- reuse of those artifacts on identical source fingerprints
- invalidation when content hash changes

Exit condition:

- rerunning the same source does not recollect unchanged Code File source

## Phase 5: Add improvement revision modes that do not start from zero

Implement:

- `components` improvement
- `both` improvement
- `revalidate` fast path

Exit condition:

- improvements create a new revision while preserving parent artifacts and exports

---

## Detailed Execution Plan

This section is the concrete build order for Options 2 and 4.

The purpose is to make the initial export itself source-aware and revision-aware so that later exports do not need a recurring rescue pass.

The core product rule is:

- the first healthy export must already capture the evidence needed for reuse
- later exports should only recapture when a fingerprint, dependency, schema, or capability meaningfully changed

### Global invariants

These invariants should be enforced in code and tests, not treated as conventions.

#### Invariant 1: No silent partial success

If any of these are missing:

- `exportMode`
- source URL
- plugin source capability status
- Code File readability result
- parent revision id for revision-only flows

the pipeline must either:

- fail explicitly, or
- mark the export as partial with machine-readable reasons

It must never report plain success while hiding missing source evidence.

#### Invariant 2: Every artifact must declare its dependencies

No artifact may be written without:

- `artifactType`
- `schemaVersion`
- `hash`
- `dependencyHashes`
- `sourceFingerprint`
- `status`

This is what allows correct reuse on future exports.

#### Invariant 3: Reuse decisions must be reproducible

If two exports have the same:

- source fingerprint
- plugin snapshot fingerprint
- artifact schema versions
- dependency hashes

then reuse must be deterministic regardless of job id, output folder, or machine restart.

#### Invariant 4: Fresh exports are the normal path

The default initial export must collect:

- Code File content when readable
- export metadata
- component-family structure
- override/export assignments when visible
- capability diagnostics when not visible

That evidence must be persisted as part of the first export, not postponed to an improvement pass.

#### Invariant 5: Improvements inherit, they do not restart

An improvement revision must start from:

- the parent revision manifest
- the parent artifact index
- a new invalidation plan
- explicit requested focus

It should only perform full recapture if the invalidation engine proves that the parent evidence is no longer trustworthy.

### Workstream 1: Runtime contract hardening

Objective:

- make the executed export pipeline impossible to run with missing revision or source-aware inputs

Implementation tasks:

- confirm the real executed entrypoints for:
  - plugin submission
  - local worker processing
  - CLI/local export
- add startup logs for:
  - raw argv
  - parsed args
  - incoming job payload
  - resolved revision request
  - `runLocalExport` input
- add hard guards in `runLocalExport` for:
  - missing URL
  - missing `exportMode`
  - missing `parentRevisionId` when `requestedFocus === "revalidate"`
  - impossible revision states such as `kind === "improvement"` with no parent
- add a startup self-check that logs:
  - codegen version
  - capture schema version
  - revision schema version

Files:

- `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/apps/worker/src/index.ts`
- `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/packages/exporter-core/src/local-export.ts`
- `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/packages/shared/src/types.ts`

Exit condition:

- every job log clearly shows what was requested, what was received, and which revision flow is active

### Workstream 2: Revision record completion

Objective:

- make revisions first-class and durable rather than inferred from folder state

Implementation tasks:

- finalize revision ids and parent linkage
- persist one `revision-manifest.json` per revision with:
  - revision id
  - job id
  - parent revision id
  - reason
  - requested focus
  - source fingerprint
  - plugin fingerprint
  - artifact graph hash
  - schema versions
  - timestamps
  - status
  - reused artifact ids
  - invalidated artifact ids
- persist one `parent.json` for improvement revisions so lineage is directly readable on disk
- persist revision-level stage state:
  - `planning`
  - `capturing`
  - `generating`
  - `validating`
  - `completed`
  - `failed`
- make the web UI render revision lineage and reason directly from revision metadata

Files:

- `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/apps/web/lib/jobs-store.ts`
- `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/apps/web/app/jobs/[id]/page.tsx`
- `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/packages/shared/src/types.ts`
- `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/packages/exporter-core/src/local-export.ts`

Exit condition:

- every export and improvement is inspectable as a specific revision, not just a latest folder

### Workstream 3: Artifact graph normalization

Objective:

- make every persistent output reusable and selectively invalidatable

Implementation tasks:

- finalize `artifact-index.json` as the canonical artifact inventory
- ensure each entry records:
  - stable artifact id
  - artifact type
  - byte size
  - content hash
  - schema version
  - status
  - local path
  - dependency artifact ids
  - route path when relevant
  - component family id when relevant
  - code file id when relevant
  - viewport when relevant
- define artifact classes for:
  - plugin project snapshot
  - plugin capability report
  - component families
  - code file metadata
  - code file source
  - override assignment graph
  - export IR
  - component model IR
  - generated route module
  - generated component module
  - generated CSS module
  - validation output
  - revision report
- reject artifact registration if:
  - hash is missing
  - file does not exist for `complete` status
  - dependency ids reference unknown artifacts

Files:

- `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/packages/exporter-core/src/local-export.ts`
- `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/packages/shared/src/types.ts`

Exit condition:

- one artifact index can fully explain what exists, what depends on what, and what can be reused

### Workstream 4: First-run source-aware plugin capture

Objective:

- move Code File and component-family evidence into the default initial export path

Implementation tasks:

- on the first export, capture and persist for each readable Code File:
  - `id`
  - `name`
  - `path`
  - `versionId`
  - `content`
  - `contentHash`
  - `contentByteLength`
  - `hasContent`
  - `exports`
  - `exportDetails`
  - `insertURL`
  - default-export markers
  - inferred role such as component or override
- for unreadable or partially readable Code Files, persist:
  - capability status
  - error reason
  - whether content was absent, restricted, truncated, or external
- recursively build component families using:
  - primary/replica identity
  - variant metadata
  - inheritance metadata
  - gesture metadata
  - instance controls
  - node hierarchy
  - links and insertion URLs
- persist component family artifacts independently from generated code
- record plugin capability diagnostics in a dedicated artifact even when capture succeeds

Files:

- `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/apps/plugin/src/App.tsx`
- `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/packages/exporter-core/src/ir.ts`
- `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/packages/exporter-core/src/local-export.ts`

Framer-specific rule:

- treat the Plugin SDK as authoring metadata and source access
- do not treat it as proof of fully resolved browser CSS or full site source export

Exit condition:

- a brand new export contains durable source artifacts and family artifacts before any improvement flow exists

### Workstream 5: Fingerprint strategy for reuse from scratch

Objective:

- make future fresh exports reuse previously captured evidence without needing manual recapture

Implementation tasks:

- define source fingerprint inputs:
  - source URL
  - export mode
  - selector
  - plugin project id if available
  - publish URL if available
- define plugin snapshot fingerprint inputs:
  - Code File ids
  - Code File version ids
  - Code File content hashes
  - component family ids
  - readable capability flags
  - override export metadata hashes
- define family fingerprint inputs:
  - primary variant id
  - family member ids
  - linked code file hashes
  - inheritance markers
  - gesture metadata
  - controls shape
- define generated-module fingerprint inputs:
  - IR hash
  - codegen version
  - dependency artifact hashes
- ensure fresh exports look up matching artifact hashes before recollecting or regenerating

Important rule:

- a fresh export should check for reusable source artifacts before it talks to the plugin for expensive recapture
- the plugin should still run for minimal capability and project freshness checks when required

Exit condition:

- running the same export twice should reuse source-aware artifacts on the second run without a manual improvement pass

### Workstream 6: Invalidation engine

Objective:

- make recapture rare and narrow

Implementation tasks:

- finalize `invalidation-plan.json`
- generate invalidations per artifact edge rather than per whole job
- support invalidation reasons:
  - source fingerprint changed
  - plugin snapshot changed
  - Code File content hash changed
  - component family membership changed
  - override export metadata changed
  - schema version changed
  - artifact missing
  - artifact corrupt
  - user requested full refresh
  - prior capability missing and now required
- implement dependency walk rules:
  - changed Code File invalidates that source artifact
  - that invalidates dependent family artifacts
  - that invalidates dependent IR nodes
  - that invalidates dependent generated modules
  - that invalidates dependent validations
- preserve unrelated artifacts even when one component changes

Files:

- `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/packages/exporter-core/src/local-export.ts`

Exit condition:

- the invalidation plan can explain exactly why a future export recaptured anything at all

### Workstream 7: Improvement revision flows

Objective:

- allow targeted repairs and enhancements without resetting everything

Implementation tasks:

- support revision reasons:
  - `component-source-refresh`
  - `responsive-improvement`
  - `interaction-improvement`
  - `revalidate-only`
  - `schema-upgrade`
  - `manual-regeneration`
- finalize improvement focuses:
  - `components`
  - `responsiveness`
  - `both`
  - `revalidate`
- implement fast paths:
  - parent export reuse for `revalidate`
  - parent export reuse when component source diff is empty
  - validation-only revision creation
- ensure improvement jobs can accept:
  - fresh plugin capture
  - a new selector
  - a new source URL
  - explicit requested focus
- patch revision reports so the user can see:
  - reused parent artifacts
  - new artifacts
  - invalidated artifacts
  - validation outcome for the new revision

Files:

- `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/apps/web/lib/jobs-store.ts`
- `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/apps/worker/src/index.ts`
- `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/packages/exporter-core/src/local-export.ts`

Exit condition:

- an improvement revision starts from the parent manifest, not from a blank workspace

### Workstream 8: UI and operator visibility

Objective:

- make reuse, partial source capture, and recapture reasons obvious to users and to us

Implementation tasks:

- jobs list should show:
  - latest revision id
  - revision reason
  - whether output was fully generated, partially reused, or revalidated
- job detail should show:
  - revision lineage
  - capability summary
  - unreadable Code Files count
  - component families count
  - artifact counts by type
  - reused artifact count
  - invalidated artifact count
  - direct download links for:
    - revision manifest
    - invalidation plan
    - artifact index
    - capability report
    - export report
- improvement actions should be explicit buttons, not inferred refreshes
- if a source-aware artifact is missing, show that as a concrete product warning

Files:

- `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/apps/web/app/jobs/page.tsx`
- `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/apps/web/app/jobs/[id]/page.tsx`
- `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/apps/web/app/jobs/auto-refresh.tsx`

Exit condition:

- a user can tell, from the UI alone, whether the exporter reused healthy artifacts or recaptured something and why

### Workstream 9: Regression test matrix

Objective:

- make these fixes durable so future exports get the benefit automatically

Implementation tasks:

- add unit tests for:
  - source fingerprint generation
  - plugin snapshot fingerprint generation
  - component family grouping
  - source artifact diffing
  - invalidation-plan generation
  - artifact corruption detection
- add integration tests for:
  - initial export writes source-aware artifacts by default
  - identical export in a different output folder reuses shared source artifacts
  - changed Code File invalidates only dependent family/IR/codegen artifacts
  - unchanged component-source improvement reuses the parent export
  - revalidate-only emits a new revision without capture/codegen
  - missing `exportMode` fails explicitly
  - missing parent revision fails explicitly for revalidate
- add end-to-end assertions for:
  - manifest/report visibility in API
  - UI revision lineage rendering
  - downloadable artifact manifests are valid JSON

Files:

- `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/packages/exporter-core/src/local-export.integration.test.ts`
- `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/packages/exporter-core/src/exporter-regression.test.ts`
- `/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay/apps/web/app/api/jobs/[id]/artifact/route.ts`

Exit condition:

- a future regression cannot silently remove first-run source capture or selective reuse without failing tests

### Workstream 10: Migration and rollout

Objective:

- move existing jobs and future jobs onto the new model without breaking downloadability

Implementation tasks:

- define revision/artifact schema versions explicitly
- support old jobs with missing manifests by:
  - marking them legacy
  - generating derived manifests where safe
  - refusing unsafe reuse where provenance is unknown
- add a one-time migration step for:
  - artifact path normalization
  - revision lineage backfill when parent metadata is inferable
- gate production reuse on:
  - schema version match
  - artifact integrity check
  - dependency closure check
- log and surface when a legacy export had to fall back to full regeneration

Exit condition:

- old jobs remain inspectable, but only new-schema jobs participate in safe reuse automatically

### Recommended shipping order

This is the order that gives the fastest durable payoff.

1. finish runtime guards and revision manifest hardening
2. finalize artifact index and invalidation plan
3. make first-run Code File and component-family capture mandatory
4. finalize source-artifact fingerprinting and shared-cache reuse
5. finalize component-focused and revalidate-only improvement flows
6. expose revision lineage and reuse reasons in the UI
7. lock the entire flow with integration and regression tests

### What “fixed from scratch” means in practice

After Options 2 and 4 land fully, a normal new export should behave like this:

1. compute source fingerprint
2. check for reusable source-aware artifacts
3. collect only missing or invalid plugin evidence
4. persist Code File and component-family artifacts immediately
5. generate IR and code only for invalidated nodes
6. validate
7. write a revision report that explains reuse vs regeneration

That means future exports benefit on the first run from:

- source-aware component capture
- artifact reuse
- selective invalidation
- revision lineage
- explicit capability reporting

It also means improvement flows become optional refinement tools, not a crutch required to make the export usable.

---

## How We Prevent Future Routine Recapture

This is the most important part of the plan.

Future exports should not need recapture all the time because we will change the default export behavior itself:

### 1. Capture source-aware plugin evidence on day one

Every initial export should capture:

- Code File source
- component family graph
- variant metadata
- override export metadata

That removes the need for a later source-only rescue pass in normal cases.

### 2. Persist immutable artifacts by content hash

If a Code File has the same content hash, we reuse it.

If a component family graph has the same dependency hash, we reuse it.

If the generated module dependencies have not changed, we reuse them.

### 3. Invalidate narrowly

Do not say “export changed, rebuild everything.”

Instead:

- changed Code File invalidates its source artifact
- that invalidates dependent family model
- that invalidates dependent IR
- that invalidates dependent generated modules

Nothing else should move.

### 4. Separate revalidation from regeneration

Validation failures should not automatically imply recapture.

If generated output already exists, allow:

- revalidate-only
- rebuild-only
- component-source-refresh

Each should have its own reason and scope.

### 5. Version the schemas

Any time we change the structure of:

- Code File artifacts
- component family artifacts
- revision manifest
- generated module dependencies

we bump the schema version and invalidate only the affected layers.

### 6. Make missing evidence visible in the product

If the plugin could not read source, the UI should say that directly.

That prevents false confidence and prevents users from assuming a blank or partial export came from a healthy source capture.

---

## Dependencies and Ordering

Option 2 should land before Option 4 is fully relied on in production.

Recommended order:

1. finish revision/request plumbing
2. add artifact index and invalidation plan
3. persist Code File artifacts
4. persist component family artifacts
5. expose reports and reuse plan in UI
6. add revalidate-only and component-only improvement flows
7. lock it down with regression tests

Reason:

Without the revision/artifact model, the plugin capture improvements will help, but they will still be expensive and hard to trust over time.

---

## Risks

### Payload size growth

Readable Code File source can enlarge plugin payloads.

Mitigation:

- chunk large source artifacts
- persist large source separately
- store hashes in the main payload

### Partial plugin capability

Some projects may expose components but not all source details.

Mitigation:

- explicit capability report
- explicit per-file status
- no silent success

### Stale artifact reuse

Bad reuse would be worse than recapture.

Mitigation:

- dependency hashes
- schema versions
- corruption checks
- clear invalidation reasons

### Family grouping mistakes

Grouping by weak identity could merge unrelated components.

Mitigation:

- stable priority order for identifiers
- confidence flag
- fallback to separate families when uncertain

---

## Test Matrix

### Unit tests

- artifact key generation
- invalidation-plan generation
- Code File hash generation
- family grouping logic
- primary variant selection

### Integration tests

- identical export reuses source artifacts
- improvement revision reuses parent artifacts
- revalidate-only skips capture/codegen
- changed Code File invalidates only dependent component artifacts
- schema bump invalidates expected layers

### Product tests

- jobs page shows revision lineage
- job detail page shows reuse/invalidation summary
- capability report exposes unreadable source
- downloadable revision and validation manifests are valid JSON

---

## Definition of Done

This work is done only when:

- a new export captures Code File source and component families by default
- identical exports reuse those artifacts without full recapture
- improvement revisions inherit from parent revisions instead of restarting from zero
- revalidate-only works without new capture/codegen
- missing source is reported explicitly
- tests prove that unchanged component evidence is reused across runs

---

## Recommended Immediate Build Sequence

1. finish `local-export.ts` revision fast paths and invalidation planning
2. formalize `artifact-index.json` and revision manifests
3. complete plugin Code File artifact capture and capability report
4. complete component family artifact persistence
5. add regression tests for reuse and selective invalidation
6. expose the reuse/invalidation evidence clearly in the web UI

If we do these in order, future exports should start with the right source/component evidence from scratch, and later improvements should become targeted revisions rather than expensive recapture cycles.
