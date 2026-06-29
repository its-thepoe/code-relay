# Plan 002: Gate full-site export as experimental until acceptance and fidelity are trustworthy

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in "STOP conditions" occurs, stop and report. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 2948374..HEAD -- apps/plugin/src/App.tsx apps/plugin/src/App.css apps/web/app/jobs/page.tsx apps/web/app/jobs/[id]/page.tsx apps/web/lib/jobs-store.ts`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on mismatch, stop and report.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: `plans/001-export-acceptance-gate.md`
- **Category**: bug, direction
- **Planned at**: commit `2948374`, 2026-06-14

## Why this matters

The UI currently presents "Full site" as a normal export choice even though the product docs say full-site is Post-MVP and current artifacts prove it can generate fake numbered pages with poor styling. Users naturally pick the biggest option first, then lose trust. Until full-site has strict acceptance and clearer diagnostics, the plugin should steer users toward selection/component exports and label full-site honestly as experimental.

## Current state

- `apps/plugin/src/App.tsx` exposes three export modes in one radio group.
- The Framer plugin skill says Framer plugin UI should prefer `div role="button"` over native buttons where Framer CSS can interfere, and `showUI` should be called in `useLayoutEffect`; preserve those conventions.
- Product docs state MVP focuses on one selected section/component, while full-site is Post-MVP.

Current radio options:

```tsx
// apps/plugin/src/App.tsx:533
[
  ["selection", "Selection"],
  ["components", "Components"],
  ["full-site", "Full site"],
] as const
```

Current full-site copy says:

```tsx
// apps/plugin/src/App.tsx:950
Best for complete websites. Exports pages, CMS metadata, components, styles,
and runtime capture from the published URL.
```

Relevant product intent:

```md
// docs/framer_to_code_prd.md
The MVP focuses on exporting one selected Framer section/component into portable React code...
Post-MVP expands into page export, better motion preservation, CMS export, full-site export...
```

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Typecheck | `npm run typecheck` | exit 0, no TypeScript errors |
| Exporter tests | `npm run test:exporter` | exit 0, all tests pass |
| Build | `npm run build` | exit 0 |

## Scope

**In scope**:

- `apps/plugin/src/App.tsx`
- `apps/plugin/src/App.css`
- `apps/web/app/jobs/page.tsx` only if job list labels need clarification
- `apps/web/app/jobs/[id]/page.tsx` only if job detail labels need clarification

**Out of scope**:

- Do not remove full-site support from the backend.
- Do not change export IR or codegen behavior.
- Do not add new design-system dependencies.

## Git workflow

```bash
git switch -c codex/002-gate-full-site-mode
```

## Steps

### Step 1: Change plugin copy to make full-site experimental

In `apps/plugin/src/App.tsx`, update the full-site label/copy.

Required behavior:

- Label should read `Full site (experimental)` or equivalent.
- Description must clearly say it may be incomplete and is best used after selection/component export works.
- Keep "Selection" as the recommended/default mode.
- Do not hide full-site entirely unless the code already has a feature flag pattern. If adding a flag, default it to enabled but warned, not silently unavailable.

**Verify**: `npm run typecheck` -> exit 0.

### Step 2: Require explicit confirmation before submitting full-site jobs

Before a full-site job is posted, require an explicit UI acknowledgement.

Acceptable implementation:

- Add a checkbox/toggle shown only when `exportMode === "full-site"`.
- Disable the export action until acknowledged.
- Copy should mention: captures can be capped, output may be approximate, and completed jobs still require acceptance validation from Plan 001.

Use existing plugin UI patterns. Per the Framer plugin skill, keep role-based custom controls if the file already uses them.

**Verify**: `npm run typecheck` -> exit 0.

### Step 3: Improve job UI status labels for experimental full-site jobs

If the web jobs pages show export mode, add a visual text label for full-site jobs:

- `Full site experimental`
- Include a short warning on detail pages if report diagnostics indicate fallback/heuristic export.

Do not make the jobs page blink or re-render aggressively. Preserve the existing auto-refresh fix if present.

**Verify**: `npm run typecheck` -> exit 0.

### Step 4: Add minimal tests where practical

If plugin tests do not exist, do not invent a full frontend test framework. Instead, add pure helper tests only if this change extracts helper logic. Otherwise rely on typecheck and manual browser/plugin verification.

**Verify**: `npm run test:exporter` -> exit 0.

## Test plan

- Typecheck the repo.
- Manually run plugin dev and confirm:
  - Selection remains default.
  - Full-site shows an experimental warning.
  - Full-site export cannot start until acknowledged.
- Commands:
  - `npm run typecheck`
  - `npm run test:exporter`

## Done criteria

- [ ] Full-site is visibly labeled experimental in the plugin.
- [ ] Full-site requires explicit acknowledgement before export.
- [ ] Selection/component exports remain unchanged.
- [ ] `npm run typecheck` exits 0.
- [ ] `npm run test:exporter` exits 0.
- [ ] `plans/README.md` row for Plan 002 is updated.

## STOP conditions

- Existing plugin state management has changed enough that adding acknowledgement risks breaking normal selection export.
- The user asks to keep full-site looking production-ready despite current evidence.
- The UI requires a broader redesign beyond this warning/gating change.

## Maintenance notes

Remove or soften this gate only after full-site exports pass Plan 001 acceptance and Plan 004 evidence reporting shows real screenshot-based fidelity, not heuristic fallback.
