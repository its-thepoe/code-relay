# Plan 001: Require generated exports to build and render before job completion

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in "STOP conditions" occurs, stop and report. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 2948374..HEAD -- apps/worker/src/index.ts packages/exporter-core/src/local-export.ts packages/exporter-core/src/exporter-regression.test.ts packages/fidelity/src/compare.ts packages/shared/src/types.ts`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on mismatch, stop and report.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: bug, tests
- **Planned at**: commit `2948374`, 2026-06-14

## Why this matters

The worker currently marks an export as `completed` as soon as `runLocalExport` returns, even when the generated app was never installed, built, or rendered. That is how broken or blank ZIPs can appear successful. The product invariant should be: a completed job must contain a generated project that builds and renders its actual app entrypoint, not only a standalone `preview.html`.

## Current state

- `apps/worker/src/index.ts` owns job lifecycle. It marks jobs completed immediately after `runLocalExport`.
- `packages/exporter-core/src/local-export.ts` generates attempts and compares `preview.html`, then copies the best project into `exportDir`.
- `packages/codegen/src/next-project.ts` writes a Vite app with `package.json`, `src/App.tsx`, `preview.html`, and generated pages/components.
- `packages/fidelity/src/compare.ts` validates `preview.html`, not the generated Vite build output.

Current completion path:

```ts
// apps/worker/src/index.ts:121
const result = await runLocalExport({
  url: job.sourceUrl,
  pluginCapture: job.pluginCapture as any,
  outDir,
  selector: job.selector,
  exportMode: job.exportMode,
  maxAttempts: 3,
  targetFidelity: 0.95,
});

job.status = "completed";
```

Current attempt validation path:

```ts
// packages/exporter-core/src/local-export.ts:761
const generated = await generateNextProject({
  ir: workingState.ir,
  projectDir,
  strategy: workingState.strategy,
});
const comparison = await compareGeneratedPreview({
  ir: workingState.ir,
  previewHtmlPath: generated.previewHtmlPath,
  attemptDir,
});
```

Repo commands from `package.json`:

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Typecheck | `npm run typecheck` | exit 0, no TypeScript errors |
| Exporter tests | `npm run test:exporter` | exit 0, all tests pass |
| Build | `npm run build` | exit 0 |

## Scope

**In scope**:

- `packages/exporter-core/src/local-export.ts`
- `packages/exporter-core/src/exporter-regression.test.ts`
- `packages/fidelity/src/compare.ts` only if needed to expose validation evidence
- `apps/worker/src/index.ts`
- `packages/shared/src/types.ts` only if result/report types need new fields

**Out of scope**:

- Do not redesign codegen output.
- Do not change plugin capture behavior.
- Do not relax fidelity thresholds to make tests pass.
- Do not add network-only tests that require `talktoaugust.com`.

## Git workflow

Create a branch before editing:

```bash
git switch -c codex/001-export-acceptance-gate
```

Do not push or open a PR unless the operator asks.

## Steps

### Step 1: Add an export acceptance validator

In `packages/exporter-core/src/local-export.ts`, add a function that validates the selected generated project before it is copied and zipped.

Required behavior:

- Run from the generated project directory.
- Prefer `npm install --package-lock-only --ignore-scripts --no-audit --no-fund` if no lockfile exists, then `npm install --ignore-scripts --no-audit --no-fund`.
- Run `npm run build`.
- Start a local preview server with `npm run preview -- --host 127.0.0.1 --port 0` or a deterministic free port.
- Use Playwright to visit the actual served app root, not `preview.html`.
- Verify the page has non-empty rendered text or meaningful elements.
- Enforce a timeout per command/server phase so the worker cannot hang forever.
- Return structured evidence: `status`, `buildExitCode`, `renderedTextLength`, `url`, `errorMessage`, and relevant stdout/stderr snippets capped to a safe length.

Do not shell out through unsanitized user input. Use fixed commands and `child_process.spawn`/`execFile` with `cwd`.

**Verify**: `npm run typecheck` -> exit 0.

### Step 2: Fail the export if acceptance fails

Still in `runLocalExport`, call the validator after `bestAttempt` is selected and before `copy(bestAttempt.projectDir, exportDir)`.

Required behavior:

- If build or render validation fails, throw an error that includes a concise reason.
- The worker catch block should then mark the job as `failed`, using the existing error path.
- Write acceptance evidence into `export-report.json` when validation passes.
- If validation fails before report creation, write a minimal failure artifact under the run directory if safe, but do not produce a completed ZIP.

**Verify**: `npm run typecheck` -> exit 0.

### Step 3: Add regression tests for completed vs failed jobs

In `packages/exporter-core/src/exporter-regression.test.ts`, add tests with local temp projects. Follow the existing Node test style in that file.

Cover:

- A generated minimal valid export passes acceptance.
- A generated invalid export fails acceptance and does not get reported as successful.
- A validation timeout becomes a clear failed result, not a hanging test.

If the acceptance validator is easier to test as an exported helper, export it from `local-export.ts` with an internal-looking name, for example `validateGeneratedExportForAcceptance`.

**Verify**: `npm run test:exporter` -> exit 0, including the new tests.

### Step 4: Include acceptance evidence in reports

Update report creation so `export-report.json` includes a small `acceptance` section.

Minimum fields:

- `status`: `"passed"` or `"failed"`
- `buildCommand`: `"npm run build"`
- `renderCommand`: `"npm run preview"`
- `renderUrl`
- `renderedTextLength`
- `durationMs`

Do not include full stdout/stderr in reports. Cap snippets to avoid huge job JSON.

**Verify**: `npm run test:exporter` -> exit 0.

### Step 5: Worker status should depend on acceptance

Confirm `apps/worker/src/index.ts` needs no special happy-path change after `runLocalExport` throws on failure. If needed, improve `errorMessage` so users see "Generated export failed acceptance: <reason>".

**Verify**: `npm run typecheck` -> exit 0.

## Test plan

- Add unit/regression coverage in `packages/exporter-core/src/exporter-regression.test.ts`.
- Use temp directories and synthetic generated projects; do not hit live websites.
- Existing command: `npm run test:exporter`.
- Full gate: `npm run typecheck && npm run test:exporter && npm run build`.

## Done criteria

- [ ] Broken generated projects cannot produce `job.status = "completed"`.
- [ ] `export-report.json` includes acceptance evidence for successful exports.
- [ ] Acceptance validation renders the actual generated app, not only `preview.html`.
- [ ] `npm run typecheck` exits 0.
- [ ] `npm run test:exporter` exits 0.
- [ ] `npm run build` exits 0.
- [ ] `plans/README.md` row for Plan 001 is updated.

## STOP conditions

- Acceptance validation requires network access to install packages and the operator forbids network usage.
- The generated export project cannot be built without first completing Plan 005 dependency pinning.
- Validation requires touching codegen structure beyond adding acceptance evidence.
- `npm run typecheck` hangs for more than 90 seconds twice; report the tooling failure instead of hiding it.

## Maintenance notes

Reviewers should scrutinize timeouts and process cleanup. This code will run inside the worker, so orphan preview servers or long installs will hurt every export job.
