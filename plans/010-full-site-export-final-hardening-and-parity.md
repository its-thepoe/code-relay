# Plan 010: Finish full-site export hardening, evidence labeling, and benchmark parity

> **Executor instructions**: Read this plan fully before editing. This is the umbrella plan for the remaining full-site export work. It covers the capture pipeline, runtime-kept handoff, evidence labeling, benchmark comparison, and final release validation. Do not stop after a partial green. The goal is a complete, reproducible export pipeline that survives heavy Framer sites, reports its confidence honestly, and can be compared against `ditto.site` on the same published URLs.
>
> **Drift check (run first)**: `git diff --stat HEAD -- plans/README.md plans/010-full-site-export-final-hardening-and-parity.md packages/exporter-core/src/capture.ts packages/exporter-core/src/local-export.ts packages/exporter-core/src/exporter-regression.test.ts packages/exporter-core/src/local-export.integration.test.ts apps/worker/src/index.ts packages/shared/src/types.ts`
>
> If the capture/resume logic, report schema, or worker artifact contract has already moved, reconcile this plan before making more changes.

## Status

- **Implementation status**: TODO
- **Priority**: P0
- **Effort**: XL
- **Risk**: HIGH
- **Depends on**: `plans/001-export-acceptance-gate.md`, `plans/003-diagnose-capture-truncation.md`, `plans/004-separate-fidelity-evidence-levels.md`, `plans/007-block-incomplete-full-site-capture.md`, `plans/008-runtime-kept-full-site-mode.md`, `plans/009-resumable-full-site-capture-hardening.md`
- **Category**: capture, fidelity, benchmark, release-gate, worker
- **Planned at**: 2026-07-11

## Why this matters

We are not trying to “make the worker stop failing” in a narrow way. We are fixing the product so a full-site export is actually trustworthy:

- a heavy route should not take down an otherwise valid export;
- a resume should reuse good work instead of starting over;
- the report should say whether fidelity is screenshot-backed or only heuristic;
- breakpoint completeness should be explicit for desktop, laptop, tablet, and mobile;
- runtime-kept exports should preserve the right Framer assumptions without leaking debug chrome;
- the same published Framer URLs should be comparable between Coderelay and `ditto.site`;
- the finish line should be a clean, reproducible export that passes typecheck, exporter tests, and benchmark checks from a clean state.

This plan exists because the current story is still too easy to misread. Some pieces are already implemented, some are only partially wired through reports or worker status, and some still need a final validation pass before we can say the pipeline is done.

## Fix inventory

This plan covers the full remaining fix set, including the pieces that were previously split across other plans.

| Symptom we need to eliminate | Root cause | Fix in this plan | Completion proof |
| --- | --- | --- | --- |
| Export jobs fail on one heavy route even though most of the site was captured | Route capture still behaves like a monolith when one phase runs long | Keep the phase-aware, resumable capture path and finish wiring it through validation, reporting, and worker output | A rerun resumes from valid route/viewport progress and only retries missing pieces |
| Reports still blur screenshot-backed and heuristic-backed fidelity | Evidence labels are not consistently surfaced everywhere | Thread evidence classes into report JSON, worker artifacts, and any UI surfaces that expose export quality | The report can say exactly which routes are screenshot-backed, heuristic-backed, replay-backed, redirect-backed, or invalid |
| Breakpoint capture can appear “done” while one or more viewports are missing or stale | Completeness checks are present, but not yet fully enforced and reflected in all diagnostics | Keep the full breakpoint gate strict and verify desktop, laptop, tablet, and mobile are all captured and labeled | A route with missing tablet or mobile evidence fails loudly and names the missing breakpoint |
| Runtime-kept exports still need final localization / handoff tightening | The shell, manifest, and verification story are not yet fully leak-proof | Finalize runtime-kept handoff metadata, localization ownership, and verification of the exported app surface | The generated export tells the next agent what is preserved, what is adapted, and what still needs care |
| The build can regress on representative generated projects | Generated dependency and compile coverage is not yet treated as a release gate | Keep the generated-project compile gate and run it against representative fixtures before release | Representative fixtures compile in the generated environment from a clean state |
| We cannot confidently say we beat `ditto.site` | No shared benchmark matrix and no fixed comparison rubric | Build a 10-20 fixture benchmark suite and compare both exporters on the same published URLs | Side-by-side results exist for route coverage, screenshots, assets, editability, and report quality |
| Current plan docs drift from reality | README and individual plan statuses do not always match what is implemented | Reconcile the plan index and mark completed work correctly | `plans/README.md` matches the implemented state and the remaining TODOs are real |

## Product decision

Treat the full-site exporter as a **strictly complete, resumable, runtime-kept, agent-first pipeline**.

That means:

- strict completion gates stay strict;
- partial success is never silently promoted to a completed export;
- already-good route and viewport artifacts are reused automatically;
- unsupported or optional work is labeled, not hidden;
- the exported app and report must explain the fidelity level instead of implying one;
- benchmark comparison must be reproducible, not anecdotal.

## Scope

**In scope**:

- `plans/README.md`
- `plans/010-full-site-export-final-hardening-and-parity.md`
- `packages/exporter-core/src/capture.ts`
- `packages/exporter-core/src/local-export.ts`
- `packages/exporter-core/src/ir.ts`
- `packages/exporter-core/src/exporter-regression.test.ts`
- `packages/exporter-core/src/local-export.integration.test.ts`
- `packages/shared/src/types.ts`
- `apps/worker/src/index.ts`
- `apps/worker/src/artifacts.ts`
- any report/status artifacts used by the web app or benchmark comparison flow
- benchmark fixtures, scripts, and comparison outputs used to evaluate `ditto.site`

**Out of scope for the first pass**:

- Do not replace the browser engine.
- Do not relax the completeness gate to make difficult routes “pass”.
- Do not hide missing breakpoints behind softer language.
- Do not add a second source of truth for route coverage or asset coverage.
- Do not turn the benchmark suite into a one-off manual note. It must be repeatable.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Typecheck | `npm run typecheck` | exit 0 |
| Exporter tests | `npm run test:exporter` | exit 0 |
| Clean export repro | `npm run export:test -- --url https://thepoe.framer.website --export-mode full-site --out-dir .coderelay/manual-repro --max-attempts 1 --target-fidelity 0.95` | exit 0 or a precise, named blocking reason |
| Worker loop | `npm run dev:worker` | worker starts and captures a job cleanly |

## Implementation plan

### Step 1: Reconcile the plan index and current reality

Start by updating `plans/README.md` so the plan table matches implemented work and the remaining TODOs are honest.

Required work:

- mark already-completed plans as `DONE`;
- keep `009` as the hardening plan until its remaining test/regression work is actually green;
- add this plan as the final umbrella plan for the remaining release-hardening work;
- make sure the dependency notes match the codebase state instead of the historical roadmap.

**Verify**:

- `plans/README.md` tells the truth about what is done and what is still pending;
- no completed plan is left marked TODO;
- the new plan row sits after `009` and clearly represents the final release-hardening pass.

### Step 2: Finish the resumable full-site capture story

The capture pipeline must keep the strict completeness gate while resuming valid work after failures.

Required work:

- keep route-phase capture state and route-progress persistence;
- preserve the phase history and failure reasons for route capture;
- ensure route cache reuse is not too broad and does not hide incomplete captures;
- ensure breakpoint completeness is still required for desktop, laptop, tablet, and mobile;
- make sure incomplete full-site captures still fail when evidence is missing;
- keep redirect and CMS route behavior explicit in the capture and validation story;
- ensure the worker logs and artifacts can tell reused capture from retried capture.

This step should not weaken the completeness gate. It should make the pipeline resume better while still blocking incomplete exports.

**Verify**:

- a route that only failed in a late optional phase still resumes cleanly;
- a route missing a required viewport still fails;
- route progress files and aggregate capture progress show the exact phase history;
- incomplete full-site exports still fail instead of being promoted.

### Step 3: Make evidence labels first-class everywhere

We already know the pipeline can produce screenshot-backed and heuristic-backed results. The remaining work is to make those labels visible and consistent everywhere that matters.

Required work:

- propagate evidence classes through report JSON;
- propagate evidence classes through worker artifacts;
- propagate evidence classes through route summaries and route failure data;
- make sure the report can distinguish:
  - `screenshot-backed`
  - `heuristic-backed`
  - `dom-backed`
  - `replay-backed`
  - `redirect-backed`
  - `invalid`
- ensure screenshot-backed fidelity is not accidentally presented as stronger than it is;
- ensure heuristic fallbacks are not silently treated as equivalent to real screenshots.

**Verify**:

- report output labels each route clearly;
- worker artifacts preserve the same labels;
- regression tests cover at least one screenshot-backed route and one heuristic-backed fallback path;
- the UI or report consumer does not collapse those labels into a single generic “good” state.

### Step 4: Finalize runtime-kept handoff semantics

The runtime-kept strategy should own localization and leak-proof verification end to end.

Required work:

- keep the full-site shell aligned with runtime-kept export strategy;
- keep localization and route ownership explicit in manifests;
- ensure the handoff says what remains agent-editable and what is intentionally preserved from runtime capture;
- verify that debug chrome does not leak into the shipped surface;
- keep preview/debug information in artifacts and reports, not in the live export surface;
- make sure the next agent can pick up the export without guessing which parts are source-of-truth and which are derived.

**Verify**:

- runtime-kept exports have explicit strategy metadata;
- the exported app surface stays clean;
- the report and manifests describe the handoff without ambiguity;
- localization / route ownership fields are present where needed and not duplicated across multiple sources.

### Step 5: Finish representative generated-project compilation coverage

Generated export code must not only exist. It has to compile in the generated environment that representative fixtures will actually use.

Required work:

- keep the generated dependency pinning and lockfile story reproducible;
- compile representative generated projects before release;
- keep the generated export code paths aligned with the actual exported app shell;
- preserve the current regression coverage around generated projects and the Framer runtime adaptation edge cases;
- make sure unsupported Framer code-file adaptation is reported clearly instead of hiding behind a partial build.

**Verify**:

- representative generated fixtures compile cleanly from a clean state;
- the generated bundle remains reproducible;
- unsupported adaptation paths produce clear diagnostics, not vague build failures.

### Step 6: Build the benchmark suite for Coderelay vs `ditto.site`

This is the part that turns the export story into something measurable.

Required work:

- select 10-20 representative published Framer URLs as fixtures;
- include a mix of:
  - simple marketing pages,
  - CMS/list/detail pages,
  - route-heavy portfolios,
  - pages with code files or runtime overrides,
  - pages with breakpoint-sensitive layout;
- for each fixture, capture both:
  - Coderelay export output,
  - `ditto.site` export output;
- compare the same rubric for both tools:
  - route coverage,
  - desktop screenshot fidelity,
  - tablet screenshot fidelity,
  - mobile screenshot fidelity,
  - asset completeness,
  - CMS/detail-route completeness,
  - code editability,
  - report quality,
  - breakpoint labeling,
  - evidence labeling;
- store the results in a markdown report and, where useful, a machine-readable artifact.

The benchmark suite should make it obvious where we are better, where we are equal, and where we still lose.

**Verify**:

- the same published URLs are compared for both tools;
- the benchmark output is repeatable;
- screenshots are gathered for desktop, tablet, and mobile;
- route coverage is explicit;
- report quality is scored with the same rubric each run.

### Step 7: Run the release-validation loop from a clean state

The plan is not complete until the pipeline is proven, not just patched.

Required work:

- run `npm run typecheck` from a clean state;
- run `npm run test:exporter` from a clean state;
- run the benchmark suite after cleaning stale artifacts;
- re-run any failing export jobs from fresh state and from resume state;
- confirm the worker output, report output, and benchmark outputs all agree;
- fix any last-mile mismatch between code, docs, and artifacts.

**Verify**:

- typecheck passes;
- exporter tests pass;
- benchmark comparison data is present;
- clean-state and resume-state behavior both work as intended.

## Test plan

- `npm run typecheck`
- `npm run test:exporter`
- a clean full-site export repro for a route-heavy published Framer site
- a resume test that proves a partially completed route is resumed instead of restarted
- a comparison run that exports the same fixture set through Coderelay and `ditto.site`

## Done criteria

- [ ] `plans/README.md` matches the current implementation state.
- [ ] Full-site exports still fail when required routes or breakpoints are missing.
- [ ] Resumed captures reuse valid work and retry only the missing pieces.
- [ ] Report output distinguishes screenshot-backed and heuristic-backed fidelity.
- [ ] Worker artifacts preserve route progress, phase history, and evidence labels.
- [ ] Runtime-kept exports keep localization and handoff semantics explicit.
- [ ] Representative generated projects compile successfully before release.
- [ ] The benchmark suite compares Coderelay and `ditto.site` on the same URLs with the same rubric.
- [ ] `npm run typecheck` passes.
- [ ] `npm run test:exporter` passes.

## STOP conditions

- If any plan step would require weakening the completeness gate to pass tests, stop and fix the underlying capture or validation issue instead.
- If the benchmark suite cannot be made repeatable, stop and simplify the benchmark definition before expanding fixture count.
- If report labels drift from the actual capture evidence, stop and reconcile the report schema before shipping more changes.

