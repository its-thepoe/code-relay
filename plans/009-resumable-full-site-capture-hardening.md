# Plan 009: Make full-site capture resumable, phase-aware, and robust on heavy routes

> **Executor instructions**: Read this plan fully before editing. This plan is not a narrow patch. It is a product hardening plan for the full-site export pipeline. Implement it in slices that keep the product shippable after each slice. Preserve the strict acceptance bar from Plans 001, 003, 004, 007, and 008: broken or partial exports must still fail. The difference is that capture should become smarter, more resumable, and more diagnosable instead of failing monolithically.
>
> **Drift check (run first)**: `git diff --stat HEAD -- packages/exporter-core/src/capture.ts packages/exporter-core/src/local-export.ts packages/exporter-core/src/exporter-regression.test.ts packages/exporter-core/src/local-export.integration.test.ts apps/worker/src/index.ts apps/web plans/README.md`
> If route capture, revision reuse, or worker artifact contracts have already moved substantially, reconcile this plan before making more changes.

## Status

- **Implementation status**: DONE
- **Priority**: P0
- **Effort**: XL
- **Risk**: HIGH
- **Depends on**: `plans/001-export-acceptance-gate.md`, `plans/003-diagnose-capture-truncation.md`, `plans/004-separate-fidelity-evidence-levels.md`, `plans/007-block-incomplete-full-site-capture.md`, `plans/008-runtime-kept-full-site-mode.md`
- **Category**: capture, resilience, revisions, performance, worker
- **Planned at**: 2026-07-11

## Why this matters

The current full-site exporter still treats each route capture as a single large scrape with a single large timeout. That is not robust enough for heavy published Framer pages.

Recent failed jobs show the real pattern:

- route capture can succeed for most pages and still fail the whole export because one or two heavy routes exceed the per-route timeout;
- interaction replay and screenshot work can consume a significant fraction of the route budget even when those steps are optional;
- partial progress is persisted too coarsely, so recovery still feels like “rerun the export” instead of “resume from what already worked”;
- failure artifacts do not identify the exact subphase that consumed the time budget, which makes RCA slower than it should be.

This plan fixes the actual product weakness:

- phase-aware capture,
- per-route and per-viewport resumability,
- explicit optional vs required capture evidence,
- strong reuse of prior successful work,
- better worker and report semantics for resumed or partially reused exports.

The goal is **not** to weaken correctness. The goal is to keep the strict correctness bar while dramatically reducing wasted reruns.

## Fix inventory

This plan is intentionally broad because the failures are coupled. It covers the full path from capture to worker reporting and benchmark validation.

| Symptom we saw | Root cause | Fix in this plan | Completion proof |
| --- | --- | --- | --- |
| `Route capture exceeded 3 minutes` on a heavy article route | One route phase can monopolize the whole route budget | Split route capture into named phases with separate budgets and required/optional semantics | Failure artifacts name the exact phase, and optional phases no longer fail an otherwise valid route |
| A rerun still behaves like a fresh export | Progress is persisted too coarsely | Add route- and viewport-level checkpoints plus reuse eligibility metadata | A rerun reuses valid route/viewport artifacts and only retries missing pieces |
| Redirect / utility routes pollute completeness | Redirect handling is not first-class in the capture state | Preserve redirect classification through capture, resume, validation, and reporting | Redirect routes are cacheable, resumable, and never mistaken for missing page evidence |
| Runtime-kept exports lose localization or fidelity signal | Handoff and verification are not explicit enough | Keep runtime-kept assumptions, but make localization, breakpoint capture, and leak-proof verification explicit and testable | Reports show whether fidelity is screenshot-backed or heuristic and whether each viewport is complete |
| CMS or nested detail pages fail to open cleanly | Route discovery / replay coverage is incomplete | Require route coverage checks and retry only the routes that failed evidence validation | Missing CMS detail routes fail with a named route/phase instead of a vague job failure |
| We cannot compare ourselves cleanly with ditto.site | No shared benchmark suite | Add a fixture benchmark matrix and same-URL export comparison against ditto.site | Desktop/tablet/mobile screenshots, route coverage, asset completeness, code editability, and report quality are recorded side-by-side |

## Product decision

Treat full-site capture as a **resumable, phase-aware pipeline** rather than a single monolithic route scrape.

That means:

- required route evidence must still be complete before success;
- optional steps must not be allowed to consume all route time budget;
- already captured route and viewport artifacts must be reused automatically when valid;
- retries should target only failed routes and failed phases, not the whole export;
- failure artifacts must tell us exactly which phase failed and what was preserved.

## Scope

**In scope**:

- `plans/README.md`
- `packages/exporter-core/src/capture.ts`
- `packages/exporter-core/src/local-export.ts`
- `packages/exporter-core/src/ir.ts`
- `packages/exporter-core/src/exporter-regression.test.ts`
- `packages/exporter-core/src/local-export.integration.test.ts`
- `packages/shared/src/types.ts`
- `apps/worker/src/index.ts`
- job status / artifact contracts used by `apps/web` if needed
- benchmark fixtures and comparison reports used to validate parity or superiority against `ditto.site`

**Out of scope for this plan's first completion**:

- Do not replace Playwright with a different browser engine.
- Do not remove strict full-site completion gates.
- Do not relax route completeness by silently dropping failed pages.
- Do not redesign the UI beyond what is needed to expose resumed state and recovery diagnostics.
- Do not broaden this to component/selection exports unless shared infrastructure clearly benefits both.

## Current root causes this plan must address

This plan exists because the following are all true at current HEAD:

1. **Route capture timeout is too coarse**
   - one slow subphase can consume the whole 3-minute route envelope.

2. **Optional work still competes with required work**
   - interaction replay, extra screenshots, and font waits can meaningfully erode the budget for required DOM and viewport evidence.

3. **Persistence granularity is too large**
   - route cache exists, but reuse still behaves too much like “whole route or nothing.”

4. **Failure diagnostics are not phase-specific enough**
   - many failures collapse into “Route capture exceeded 3 minutes.”

5. **Resume semantics are not operator-friendly**
   - after a minor route failure, users still feel like the only option is “new export.”

6. **Worker/log artifacts do not clearly distinguish**
   - reused capture,
   - retried capture,
   - optional subphase timeout,
   - hard route evidence failure.

7. **Route discovery and validation are not yet treated as a complete contract**
   - a route can be present in the manifest but still not fully captured across all required breakpoints,
   - a CMS detail page can be discovered but not remain visible in the completion story,
   - some routes are treated as “nice to have” in logs even when the export should block on them.

8. **Comparison quality is not yet measurable**
   - we can inspect outputs manually, but we do not yet have a repeatable benchmark suite that proves where we beat, match, or lose to `ditto.site`.

## Product requirements

After this plan:

- a heavy route that times out during interaction replay but already has valid desktop/laptop/tablet/mobile evidence should still count as captured;
- a route with valid desktop + laptop but missing tablet/mobile must remain failed;
- a resumed export should reuse valid route and viewport artifacts from the previous failed run automatically;
- a resumed export should target only failed routes and failed phases whenever possible;
- reports and status files must explicitly say:
  - which routes were reused,
  - which routes were retried,
  - which phases were skipped as optional,
  - which route/phase caused final failure.
- the export system must be able to say, for any route, whether the evidence is:
  - screenshot-backed,
  - heuristic-backed,
  - replay-backed,
  - redirect-backed,
  - or invalidated.
- the benchmark suite must let us compare the same published Framer URLs through both Coderelay and `ditto.site` on desktop, tablet, and mobile, with the same evaluation rubric every time.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Typecheck | `npm run typecheck` | exit 0 |
| Exporter tests | `npm run test:exporter` | exit 0 |
| Worker dev loop | `npm run dev:worker` | local worker starts |
| CLI full-site repro | `npm run export:test -- --url https://example.com --export-mode full-site --out-dir .coderelay/manual-repro --max-attempts 1 --target-fidelity 0.9` | exit 0 or clear blocking reason |

## Architecture target

The full-site capture pipeline should be decomposed into explicit route phases.

Recommended phases:

1. `navigate`
2. `stabilize`
3. `capture-desktop`
4. `capture-laptop`
5. `capture-tablet`
6. `capture-mobile`
7. `extract-dom`
8. `extract-stylesheets`
9. `interaction-replay`
10. `route-finalize`

Not every phase has equal importance.

### Required phases

These are blocking for full-site success:

- navigation to route or redirect resolution
- valid viewport capture at desktop, laptop, tablet, mobile
- required DOM/runtime node extraction or explicit redirect placeholder capture
- route finalization and persistence

### Optional phases

These can fail without killing the route if required evidence is already complete:

- interaction replay
- extra screenshot fallback attempts after a valid screenshot already exists
- font readiness waiting beyond a bounded threshold
- stylesheet fetch/download when enough DOM evidence already exists for route correctness

### Evidence classes

Every route should also carry explicit evidence classes so reports and resume logic can tell us what kind of confidence we have.

- `screenshot-backed`
- `heuristic-backed`
- `dom-backed`
- `replay-backed`
- `redirect-backed`
- `invalid`

These are not cosmetic labels. They are used by validation, worker status, and the benchmark report.

## Step plan

### Step 1: Introduce route-phase capture state and artifact schema

Add a first-class route capture progress model to `packages/exporter-core/src/capture.ts` and shared types.

Required changes:

- define a route-phase enum or string union;
- record per-route:
  - phase start/finish timestamps,
  - success/failure state,
  - failure reason,
  - whether the phase is required or optional;
- persist a route progress artifact under the route work directory;
- update `capture-progress.json` to include failed phase names, not only route paths.

Required artifacts:

- `route-progress.json` per route
- aggregate `capture-progress.json` with per-phase summaries
- validation metadata for each phase:
  - phase kind,
  - required/optional flag,
  - start/end time,
  - captured viewport(s),
  - reuse source,
  - invalidation reason if any.

**Verify**:

- regression test reads route progress artifacts and confirms each route records phases;
- failure artifacts include the exact phase name when capture aborts.

### Step 2: Split the route timeout into phase budgets

Replace the single route-level “3 minutes or fail” behavior with:

- a total route budget,
- phase-specific budgets inside it.

Example target policy:

- navigation: strict but smaller
- stabilize / load: bounded
- each viewport capture: bounded independently
- interaction replay: bounded and optional

Required behavior:

- timeout errors must identify the phase, e.g. `interaction-replay exceeded 20 seconds` or `capture-tablet exceeded 45 seconds`;
- required-phase timeout fails the route;
- optional-phase timeout records a warning and continues.

Recommended budget policy for implementation:

- `navigate`: strict but short, because a bad URL or a broken route should fail fast;
- `stabilize`: short and bounded, because waiting should not consume the whole route;
- `capture-desktop` / `capture-laptop` / `capture-tablet` / `capture-mobile`: independent budgets so one broken breakpoint does not starve the others;
- `extract-dom`: required and bounded;
- `extract-stylesheets`: required only when we need style fidelity for validation;
- `interaction-replay`: optional and capped very tightly;
- `route-finalize`: small persistence budget for writing artifacts and status.

Do not simply raise the existing timeout. Make it structurally smarter.

**Verify**:

- targeted regression forces a slow optional phase and confirms the route still succeeds;
- targeted regression forces a slow required viewport phase and confirms the route fails with the named phase.

### Step 3: Make interaction replay non-blocking for route completeness

Interaction replay is useful evidence, but it must not be allowed to burn the whole route budget after required capture is already done.

Required behavior:

- desktop interaction replay runs only after required viewport capture and DOM extraction succeed;
- replay timeout or replay screenshot timeout must produce a warning artifact, not a route failure, if required capture already passed;
- replay failure must still be reflected in reports and status.

Required report fields:

- replay attempted?
- replay completed?
- replay skipped because optional budget expired?
- replay failed after required capture?

**Verify**:

- test fixture where replay intentionally times out still yields a successful route capture with a replay warning.

### Step 4: Checkpoint per viewport and reuse valid viewport artifacts

The current route cache is too route-centric. Add viewport-level checkpointing.

Required behavior:

- if desktop/laptop/tablet/mobile evidence for a route is already valid on disk, reuse it;
- if only one viewport is missing, retry only that viewport;
- if DOM extraction succeeded and stylesheets succeeded, reuse them too unless invalidated by source change;
- cache validity must still depend on:
  - source URL,
  - route path,
  - capture schema version,
  - viewport validation metadata.

Required artifacts:

- per-route cached viewports,
- phase completion markers,
- invalidation reason when reuse is rejected.

Add one more rule here: if a viewport is already valid but the route-level summary is stale, the viewport should still be reused and the route summary should be recomputed from the preserved phase evidence rather than recaptured.

**Verify**:

- integration test simulates partial route cache and confirms resumed capture retries only the missing viewport(s).

### Step 5: Resume failed full-site jobs from prior artifacts

Extend local export / revision reuse so a failed job can be resumed meaningfully.

Required behavior:

- if a previous failed run has valid route artifacts, a new run with the same request should reuse them automatically;
- resumed runs must target only failed routes/phases unless invalidated;
- resume should work for both:
  - stale running jobs,
  - failed jobs with partial valid capture.

Required contracts:

- identify parent failed capture artifacts;
- define reuse eligibility rules;
- never reuse artifacts missing required validation metadata.

Resumability must cover these cases:

1. a route fully succeeded previously and can be reused as-is;
2. a route succeeded only through some phases and must be finished, not restarted;
3. a route failed only on an optional phase and can be promoted to success on reuse;
4. a job died mid-run and the next invocation should pick up the partial route checkpoints instead of rescanning the whole site;
5. a stale running job should be treated as a resume candidate when its last known artifact set is still valid.

Do not require a fully completed parent revision for reuse of route capture artifacts.

**Verify**:

- integration test starts from a partial failed full-site capture and confirms the next run reuses captured routes and retries only failed routes.

### Step 6: Distinguish hard route failure from optional subphase degradation

At current HEAD, too many issues collapse into route failure. Tighten semantics.

Required rules:

- required evidence missing -> hard failure
- optional evidence missing -> warning / degraded evidence only
- redirect route captured as redirect placeholder -> success
- replay missing but 4 valid viewports and DOM present -> success with warning

Also cover this rule:

- redirect placeholder captured and validated -> success, but the report must say the route is redirect-backed, not page-backed.

Update:

- `validateFullSiteCapture`
- generated report fields
- worker status detail

**Verify**:

- tests cover each of the above rule branches explicitly.

### Step 7: Make route classification and redirect handling coexist with resume

The redirect fixes already added must be integrated into the new phase/reuse model.

Required behavior:

- external redirect routes are never retried as DOM-heavy page captures once classified correctly;
- redirect placeholder capture is cacheable and resumable;
- same-origin redirect routes retain redirect metadata and do not poison route completeness.

This step must also preserve utility routes such as social-link pages, local test pages, and other non-content endpoints so they remain visible in discovery reports instead of disappearing from the benchmark sample.

**Verify**:

- redirect regression still passes after checkpoint and resume changes.

### Step 8: Improve worker status and artifact reporting

The worker should stop failing with vague “failed job” summaries.

Required changes:

- enrich status history with:
  - failed route count,
  - reused route count,
  - retried route count,
  - failed phase names,
  - optional degraded phases;
- include “first blocking route” and “all failed routes” in status artifacts;
- preserve `capture-progress.json` in a way the UI can render.

Consider adding:

- `capture-summary.json`
- `resume-summary.json`
- `benchmark-summary.json`

**Verify**:

- worker artifact tests assert these files exist and contain the expected fields.

### Step 9: Expose recovery semantics in reports and UI-facing artifacts

Users need to understand whether a run was fresh, resumed, partially reused, or degraded.

Required output additions:

- route-level reuse status:
  - `fresh`
  - `reused`
  - `retried`
  - `failed`
- phase-level warning list
- degraded optional evidence list
- explicit note when export failed only because required evidence was missing on named routes
- explicit route evidence class for each route and viewport
- explicit resume source when a route or phase was reused from a prior failed job

Required surfaces:

- `export-report.json`
- `status.json`
- any job validation/revision artifact consumed by `apps/web`

**Verify**:

- report/unit tests assert the new fields are present and readable.

### Step 10: Add representative heavy-route benchmarks

This plan is incomplete without real heavy-route verification.

Build a benchmark fixture group that includes:

- long blog article page
- image-heavy marketing page
- animation-heavy landing page
- redirect-heavy social-link set
- CMS-heavy route set
- long-form content with large images and nested components
- responsive interaction-heavy landing page
- at least one route that exercises unsupported remote modules in code files so we can prove the fallback reporting path is correct

Required measurements:

- route capture duration by phase
- reuse hit rate on retry
- number of routes retried after a partial failure
- success rate before vs after this plan
- viewport coverage on desktop, tablet, and mobile
- asset completeness
- code editability / generated project compile success
- report quality and evidence labeling

Required comparison run:

- run Coderelay and `ditto.site` against the exact same published Framer URLs;
- capture the same desktop, tablet, and mobile screenshots;
- record route coverage and missing routes;
- compare asset completeness, generated code editability, and report quality;
- keep the benchmark output in a stable markdown report so future regressions are obvious.

**Verify**:

- benchmark doc records before/after numbers for at least one heavy Framer site and one local synthetic heavy fixture.
- benchmark doc includes a direct head-to-head comparison against `ditto.site`.

## Detailed test plan

### Capture-phase unit / regression tests

- route timeout reports exact failed phase
- optional interaction replay timeout does not fail the route
- required viewport timeout still fails the route
- redirect placeholder route passes validation
- viewport reuse retries only missing viewport(s)
- per-route progress artifact records phase history
- exact evidence class is written for each route and viewport

### Local export integration tests

- runLocalExport resumes from partial failed full-site capture
- resumed run reuses valid cached routes and retries only failed routes
- export-report.json includes route reuse and degraded phase metadata
- worker status artifact includes blocking route + all failed routes
- partial failed exports can be resumed after a worker restart without losing valid artifacts
- redirect-heavy runs still pass through the same resume path

### Benchmark and parity tests

- export the same published Framer URLs through Coderelay and ditto.site
- compare screenshots across desktop, tablet, and mobile
- compare route counts and missing route lists
- compare asset completeness
- compare editability of generated output
- compare report clarity and evidence labels
- record whether each benchmarked route is screenshot-backed or heuristic-backed

### End-to-end validation

- `npm run typecheck`
- `npm run test:exporter`
- rerun a previously failing full-site published URL with:
  - at least one heavy article route
  - at least one redirect / utility route
- confirm:
  - no full rerun of already good routes,
  - no route failure caused only by optional replay,
  - final failure reason, if any, names exact blocking route and phase.
- confirm the new benchmark suite produces a repeatable comparison report against `ditto.site`

## Done criteria

- [ ] Route capture persists phase-level progress and failure reasons.
- [ ] Required and optional route phases are distinguished in code and artifacts.
- [ ] Interaction replay can no longer cause a route failure after required evidence already exists.
- [ ] Full-site capture can reuse valid per-route and per-viewport artifacts from prior failed runs.
- [ ] A rerun after a partial failed job retries only failed routes/phases when source input is unchanged.
- [ ] Redirect / utility routes remain compatible with the new resume model.
- [ ] `status.json`, `capture-progress.json`, and `export-report.json` expose route/phase-level reuse and failure information.
- [ ] Exporter tests and typecheck pass.
- [ ] At least one real heavy-route repro is rerun and demonstrates either:
  - successful completion after reuse, or
  - a clearly named blocking route+phase instead of a generic timeout.
- [ ] The benchmark suite can compare Coderelay and `ditto.site` on the same published Framer URLs.
- [ ] The benchmark report records desktop, tablet, and mobile screenshots plus route coverage, asset completeness, code editability, and report quality.
- [ ] The export report labels every route as screenshot-backed, heuristic-backed, redirect-backed, replay-backed, dom-backed, or invalid.
- [ ] A resumed export is demonstrably cheaper than a fresh rerun when only a subset of routes failed.

## STOP conditions

- If the implementation starts weakening Plan 007 by allowing missing required route evidence to pass, stop.
- If cache reuse begins accepting artifacts without viewport validation metadata, stop.
- If optional-phase skipping causes false positives in generated validation or fidelity reporting, stop and separate required vs optional evidence more clearly.
- If UI or worker surfaces begin reporting “success” for a route that only has redirect placeholder data but was expected to be a real page, stop and fix route classification first.
- If the benchmark comparison relies on hand inspection only, stop and automate the comparison output first.

## Findings considered and rejected

- **Raise the route timeout globally**: rejected because it increases wasted time and hides phase-level bottlenecks.
- **Disable interaction replay entirely**: rejected because replay evidence still has value; it should be optional, not removed.
- **Allow partial full-site success with missing routes**: rejected because it violates the product contract established by Plans 001 and 007.
- **Require manual user retry selection per failed route**: rejected because the system should recover automatically from minor failures.
- **Start from scratch on every failed job**: rejected because it wastes operator time and ignores valid captured evidence already on disk.

## Completion protocol

This is the checklist for calling the plan done without hand-waving:

1. Run the full typecheck.
2. Run the exporter test suite.
3. Reproduce the previously failing heavy published Framer URL.
4. Confirm the failure no longer collapses into a generic route timeout.
5. Confirm a rerun reuses valid route and viewport artifacts.
6. Confirm redirect and utility routes still appear correctly in the manifest and reports.
7. Confirm desktop, tablet, and mobile capture evidence are all present and labeled correctly.
8. Confirm the benchmark suite can compare Coderelay and `ditto.site` on the same URLs with the same rubric.
9. Confirm the final report clearly states whether the export was fresh, resumed, reused, or degraded.
10. Only then mark the plan complete.
