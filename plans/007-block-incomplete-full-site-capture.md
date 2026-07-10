# Plan 007: Block incomplete full-site route and breakpoint capture

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report; do not improvise. When done, update this plan's row in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 3889054..HEAD -- packages/exporter-core/src/capture.ts packages/exporter-core/src/local-export.ts packages/exporter-core/src/local-export.integration.test.ts packages/exporter-core/src/exporter-regression.test.ts packages/shared/src/types.ts`
> If a capture schema or route-manifest contract has changed, stop and reconcile this plan with the new contract before editing code.

## Status

- **Implementation status**: DONE
- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: `plans/001-export-acceptance-gate.md`
- **Category**: bug, tests
- **Planned at**: commit `3889054`, 2026-07-10

## Why this matters

The current job log shows capture activity for 26 routes and reports viewport node counts for desktop, laptop, tablet, and mobile. It does not print the width-validation records, so the log alone cannot prove that all four rendered at their exact intended widths. More importantly, `captureRuntimeRoutes` currently skips an individual failed route and only throws when *every* route fails. A full-site job can therefore generate a partial site after one or more route failures.

The capture API already contains the right raw evidence: requested dimensions, observed browser widths, screenshot dimensions, and a validity flag per viewport. This plan turns that evidence into an enforced full-site invariant and a reportable result.

## Current state

The intended capture dimensions are fixed in the runtime capture module:

```ts
// packages/exporter-core/src/capture.ts:55-60
const viewports = {
  desktop: { width: 1440, height: 900 },
  laptop: { width: 1280, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
};
```

`captureViewport` reads `window.innerWidth` and validates it against both the requested viewport and screenshot width:

```ts
// packages/exporter-core/src/capture.ts:671-677, 723-752
const observedViewport = await readObservedViewport(page)
const viewportValidation = createViewportValidation(viewport, observedViewport, imageSize)
// valid only when innerWidth, clientWidth, and screenshot width agree
```

It also creates the page correctly: a `BrowserContext` gets `newPage()` plus `setViewportSize`, while a `Browser` creates a dedicated context with the requested viewport (`packages/exporter-core/src/capture.ts:700-711`). The prior `context.newPage({ viewport })` bug is not present.

The gap is full-site completeness:

```ts
// packages/exporter-core/src/capture.ts:265-289, 320-345
// Individual failures are recorded and converted to null.
// Only zero successful routes throws; otherwise the partial routeCaptures are returned.
if (routeCaptures.length === 0) throw new Error(...)
```

Generated-project validation checks all four output widths for overflow and root width (`packages/exporter-core/src/local-export.ts:2221-2333`), but does not prove every source route was captured at all four dimensions.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Source typecheck | `npm run typecheck` | exit 0, no errors |
| Exporter tests | `npm run test:exporter` | exit 0, all tests pass |
| Production compile | `npm run build` | exit 0 |

## Scope

**In scope**:

- `packages/exporter-core/src/capture.ts`
- `packages/exporter-core/src/local-export.ts`
- `packages/exporter-core/src/local-export.integration.test.ts`
- `packages/exporter-core/src/exporter-regression.test.ts` only for pure helper tests
- `packages/shared/src/types.ts` only if route-level capture completeness needs a typed report field
- `plans/README.md`

**Out of scope**:

- Do not change viewport dimensions without an explicit product decision.
- Do not treat equal node counts at desktop/laptop as an error; some sites legitimately have no breakpoint change in that range.
- Do not increase route concurrency or remove the route cache.
- Do not claim visual fidelity solely from width validation; screenshot comparison remains the evidence for visual parity.

## Git workflow

```bash
git switch -c codex/007-block-incomplete-full-site-capture
```

## Steps

### Step 1: Define one explicit full-site capture invariant

Add a small pure helper in `packages/exporter-core/src/capture.ts` or `packages/exporter-core/src/local-export.ts` that validates a full-site runtime capture against the requested route manifest.

For an initial full-site revision, it must require:

- every requested route path has one `routeCaptures` entry;
- every route entry contains `desktop`, `laptop`, `tablet`, and `mobile` in `breakpointsCaptured`;
- every viewport validation entry is `valid: true`;
- requested and observed inner widths are exactly `1440`, `1280`, `768`, and `390` for their named viewports;
- the four observed widths are distinct;
- each required source screenshot path is nonempty and exists on disk.

For an approved responsive-only improvement revision, allow inherited desktop evidence only when its parent artifact includes a valid desktop validation record and screenshot path. The report must identify inherited versus freshly captured evidence.

**Verify**: add direct unit tests for valid evidence, a duplicate width, one missing viewport, and a missing source screenshot.

### Step 2: Fail full-site export before IR/codegen on incomplete capture

Call the helper immediately after `captureRuntimeRoutes`/`mergeRuntimeCaptures` returns in `runLocalExport` (`packages/exporter-core/src/local-export.ts:445-467`) and before IR construction or generated attempts.

On failure, throw one concise error containing:

- the missing or invalid route path;
- the viewport name;
- the requested and observed widths when applicable;
- whether the evidence was fresh or inherited.

Keep selection/component mode behavior unchanged. Do not let a full-site export proceed with a subset of routes just because another route succeeded.

**Verify**: integration test a local server where one discovered route returns a capture failure; `runLocalExport({ exportMode: "full-site" })` rejects before code generation.

### Step 3: Emit capture proof into artifacts and worker logs

Extend the existing core capture log (`packages/exporter-core/src/local-export.ts:468-478`) with a compact `viewportValidation` summary. Do not log raw DOM or screenshots.

Add a report field, for example `runtimeCapture.validation`, containing per-route and per-viewport:

- requested width;
- observed inner width;
- screenshot width;
- valid flag/reason;
- fresh versus inherited provenance;
- route count requested/captured/failed.

Use this field in the web/plugin status views only if the existing report consumers can read it without broad UI work. The essential requirement is that the JSON artifact makes the claim auditable.

**Verify**: an integration fixture reads `raw-runtime-capture.json` and `export-report.json` and asserts the four named widths plus complete route coverage.

### Step 4: Strengthen generated-project responsive checks

Keep the existing output validation loop but add assertions in the full-site integration test that every generated route has exactly four `viewportChecks`, in the expected names and widths. Preserve rejection on horizontal overflow and narrow roots.

This validates generated responsiveness separately from source capture; it is not a substitute for Step 1.

**Verify**: `npm run test:exporter` exits 0, including a failure fixture for mobile overflow and one for missing source-capture evidence.

## Test plan

- Pure full-site capture invariant tests: valid set, missing route, missing viewport, duplicate observed width, mismatch width, missing screenshot.
- Local-server full-site integration test: two routes succeed with all four capture dimensions.
- Local-server full-site integration test: one route fails and the export rejects before codegen/build.
- Generated-project responsive validation: all four viewport checks per route, plus existing overflow/root-width failure cases.
- `npm run typecheck`
- `npm run test:exporter`
- `npm run build`

## Done criteria

- [ ] A first-run full-site export cannot continue with a skipped route.
- [ ] Every source route must prove desktop `1440`, laptop `1280`, tablet `768`, and mobile `390` observed width before code generation.
- [ ] Every required source screenshot exists and its width matches the named viewport.
- [ ] Responsive-only revisions explicitly identify inherited desktop evidence.
- [ ] The report and core capture log expose compact, auditable route/breakpoint completeness.
- [ ] Generated output still validates all four viewports for each route.
- [ ] `npm run typecheck`, `npm run test:exporter`, and `npm run build` exit 0.
- [ ] `plans/README.md` marks Plan 007 `DONE` when complete.

## STOP conditions

- Responsive revision reuse has no stable parent-artifact provenance field. Stop and add that data contract before allowing inherited evidence.
- Framer/runtime screenshots have unavoidable device-scale variance that makes exact image width inappropriate. Keep exact `innerWidth` and use the existing one-pixel screenshot tolerance, documenting the reason.
- A source route intentionally redirects externally. Preserve existing external-redirect handling, but mark it excluded only with an explicit route-manifest policy; never silently omit it.

## Maintenance notes

The successful condition is evidence completeness, not a high node count. A site may legitimately have identical desktop/laptop DOM counts; it may not claim responsive source capture without four validated viewport records for every included full-site route.
