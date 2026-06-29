# Plan 004: Separate real screenshot fidelity from heuristic fallback in reports and job status

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in "STOP conditions" occurs, stop and report. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 2948374..HEAD -- packages/fidelity/src/compare.ts packages/fidelity/src/compare.test.ts packages/exporter-core/src/local-export.ts packages/exporter-core/src/exporter-regression.test.ts packages/shared/src/types.ts apps/web/app/jobs/[id]/page.tsx`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on mismatch, stop and report.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: `plans/001-export-acceptance-gate.md`
- **Category**: bug, tests
- **Planned at**: commit `2948374`, 2026-06-14

## Why this matters

The fidelity engine can return a score even when original screenshots are missing or generated screenshot capture fails. That fallback is useful as a diagnostic, but it should not be presented like proven visual fidelity. Users need to know whether a report is based on real screenshot comparison, DOM/style heuristics, or blocked validation.

## Current state

- `packages/fidelity/src/compare.ts` validates `preview.html` and attempts screenshot comparison.
- If original screenshots are absent, it calls `scoreWithoutGeneratedScreens`.
- If generated screenshot capture fails, it also calls `scoreWithoutGeneratedScreens`.
- `packages/exporter-core/src/local-export.ts` uses the returned score for rerun decisions and reports.

Current fallback paths:

```ts
// packages/fidelity/src/compare.ts:113
const hasOriginalScreens = activeViewports.length > 0;
if (!hasOriginalScreens) {
  return {
    fidelity: scoreWithoutGeneratedScreens(input.ir, allViewports, previewValidation),
    previewValidation,
    diagnostics,
  };
}
```

```ts
// packages/fidelity/src/compare.ts:129
if (!generated) {
  return {
    fidelity: scoreWithoutGeneratedScreens(
      input.ir,
      allViewports,
      previewValidation,
    ),
    diagnostics,
    previewValidation,
  };
}
```

The report currently includes attempt scores/warnings, but not a hard distinction between screenshot-backed score and heuristic score.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Typecheck | `npm run typecheck` | exit 0, no TypeScript errors |
| Exporter tests | `npm run test:exporter` | exit 0, all tests pass |
| Build | `npm run build` | exit 0 |

## Scope

**In scope**:

- `packages/fidelity/src/compare.ts`
- `packages/fidelity/src/compare.test.ts`
- `packages/exporter-core/src/local-export.ts`
- `packages/exporter-core/src/exporter-regression.test.ts`
- `packages/shared/src/types.ts`
- `apps/web/app/jobs/[id]/page.tsx` only to display evidence level

**Out of scope**:

- Do not rewrite the pixel comparison algorithm.
- Do not change codegen output.
- Do not hide fallback diagnostics; label them.

## Git workflow

```bash
git switch -c codex/004-fidelity-evidence-levels
```

## Steps

### Step 1: Add evidence level to compare results

In `packages/fidelity/src/compare.ts`, extend `CompareResult` with an evidence field.

Suggested shape:

```ts
type FidelityEvidenceLevel =
  | "screenshot-comparison"
  | "heuristic-no-original-screens"
  | "heuristic-generated-capture-failed"
  | "blocked";
```

Required behavior:

- Normal screenshot comparison returns `"screenshot-comparison"`.
- No original screenshots returns `"heuristic-no-original-screens"`.
- Generated screenshot capture failure returns `"heuristic-generated-capture-failed"`.
- Preview validation timeout/blocking should be reflected in evidence or a separate `validationStatus`.

Update shared types if `CompareResult` is exported through package boundaries.

**Verify**: `npm run typecheck` -> exit 0.

### Step 2: Make rerun and warning logic evidence-aware

In `packages/exporter-core/src/local-export.ts`, update warning creation so heuristic fallback produces an explicit warning.

Required warning text:

- If no original screenshots: "Fidelity score is heuristic because original screenshots were unavailable."
- If generated capture failed: "Fidelity score is heuristic because generated preview screenshots could not be captured."
- If validation blocked: "Preview validation was blocked; score is not visual proof."

For full-site jobs, consider failing or marking below target if evidence is not `"screenshot-comparison"`, unless this conflicts with Plan 001 behavior. Do not silently pass full-site based only on heuristics.

**Verify**: `npm run typecheck` -> exit 0.

### Step 3: Include evidence level in export report

Update report JSON creation in `packages/exporter-core/src/local-export.ts`.

Required report fields per attempt:

- `fidelityEvidenceLevel`
- `previewValidation.status`
- `screenshotsCompared`: count or viewport list
- `heuristicReason` when applicable

Do not remove existing fields.

**Verify**: `npm run test:exporter` -> exit 0.

### Step 4: Display evidence level in job detail UI

In `apps/web/app/jobs/[id]/page.tsx`, display a clear label near the fidelity/report area:

- `Visual evidence: Screenshot comparison`
- `Visual evidence: Heuristic only`
- `Visual evidence: Blocked`

Keep the display terse. Do not make the jobs page poll or blink.

**Verify**: `npm run typecheck` -> exit 0.

### Step 5: Add tests

Add/update tests in `packages/fidelity/src/compare.test.ts` for:

- No original screenshots -> heuristic evidence.
- Generated screenshot capture failure -> heuristic evidence.
- Successful screenshot comparison -> screenshot evidence.

Add/update exporter regression tests if report serialization needs coverage.

**Verify**: `npm run test:exporter` -> exit 0.

## Test plan

- `npm run typecheck`
- `npm run test:exporter`
- Manually inspect one generated `export-report.json` and confirm evidence level is present.
- If the web app is running, open a job detail page and confirm the evidence label is visible.

## Done criteria

- [ ] Fidelity scores are labeled as screenshot-backed, heuristic, or blocked.
- [ ] Heuristic fallback cannot masquerade as proven visual fidelity.
- [ ] Full-site jobs cannot pass silently on heuristic-only evidence after Plan 001.
- [ ] `export-report.json` includes evidence level per attempt.
- [ ] `npm run typecheck` exits 0.
- [ ] `npm run test:exporter` exits 0.
- [ ] `plans/README.md` row for Plan 004 is updated.

## STOP conditions

- Existing tests depend on the old `CompareResult` shape in many unrelated files.
- Playwright screenshot capture is unavailable in the environment and cannot be simulated in tests.
- UI changes require broad redesign of the jobs detail page.

## Maintenance notes

Treat heuristic scoring as a useful fallback, not proof. Any future "fidelity score" display should show the evidence level next to the number.
