# Plan 006: Compile representative generated projects before release

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report; do not improvise. When done, update this plan's row in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 3889054..HEAD -- packages/codegen/src/next-project.ts packages/exporter-core/src/exporter-regression.test.ts packages/exporter-core/src/local-export.ts package.json package-lock.json`
> If any in-scope file changed since this plan was written, compare the excerpts below against the live code. Stop if the generator architecture has changed enough that the fixture no longer represents the failing path.

## Status

- **Implementation status**: DONE
- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: `plans/001-export-acceptance-gate.md`, `plans/005-pin-generated-export-dependencies.md`
- **Category**: bug, tests
- **Planned at**: commit `3889054`, 2026-07-10

## Why this matters

Full-site export of `https://thepoe.framer.website` currently reaches generated-project compilation and fails with TypeScript `TS2774` in `src/framer-data/cms-sections.tsx`. The worker correctly marks the job failed, but source-repo `npm run typecheck` cannot see TypeScript inside string templates emitted by `packages/codegen/src/next-project.ts`. Existing generator tests assert emitted text such as `FramerCmsAutoSections`; they do not compile the combination of CMS, component families, component modules, code files, and routes that real full-site exports generate.

After this plan, the immediate CMS output compiles and a small generated-project matrix catches future TypeScript failures before a user job reaches dependency installation.

## Current state

- `packages/codegen/src/next-project.ts` is the generator for `src/framer-data/cms-sections.tsx`.
- The failing emitted code comes from this template:

```ts
// packages/codegen/src/next-project.ts:4662-4685
export const framerCmsSectionRegistry = {
${registryEntries}
} as const

export function getFramerCmsSectionComponent(name: string) {
  return framerCmsSectionRegistry[name as keyof typeof framerCmsSectionRegistry]
}

export function FramerCmsAutoSections() {
  const collections = [...]
    .map((name) => ({
      name,
      Component: getFramerCmsSectionComponent(name),
      itemCount: getFramerCmsItems({ name }).length,
    }))
    .filter((entry) => entry.Component && entry.itemCount > 0)
```

- Because the source names come from the registry's own literal keys, TypeScript infers `entry.Component` as a defined function. The truthiness predicate is therefore always true and `tsc -b` emits `TS2774`.
- `validateGeneratedProject` does run `npm install` then `npm run build` for worker jobs (`packages/exporter-core/src/local-export.ts:1818-1894`). That is why the job failed rather than completing with a broken ZIP.
- Existing fixture assertions at `packages/exporter-core/src/exporter-regression.test.ts:2055-2156` only inspect strings in emitted CMS files. They never run `tsc -b` on the emitted project.
- Generated project dependencies are still covered by pending Plan 005; do not add duplicate dependency-resolution logic here.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Source typecheck | `npm run typecheck` | exit 0, no errors |
| Generator regression suite | `npm run test:exporter` | exit 0, all tests pass |
| Production compile | `npm run build` | exit 0 |

## Scope

**In scope**:

- `packages/codegen/src/next-project.ts`
- `packages/exporter-core/src/exporter-regression.test.ts`
- `packages/exporter-core/src/local-export.integration.test.ts` only if a generated-project acceptance helper is needed
- `package.json` only to add a narrowly-scoped generated-fixture compile script, if the existing `test:exporter` command cannot host it
- `plans/README.md`

**Out of scope**:

- Do not change visual codegen, capture behavior, CMS rendering design, or Framer data semantics.
- Do not weaken TypeScript diagnostics with `@ts-ignore`, `@ts-expect-error`, or a looser generated `tsconfig`.
- Do not duplicate Plan 005's package version/lockfile work.
- Do not run a live Framer URL in unit tests.

## Git workflow

```bash
git switch -c codex/006-compile-representative-generated-projects
```

## Steps

### Step 1: Repair the generated CMS registry contract

In `createCmsSectionsModule` in `packages/codegen/src/next-project.ts`, make the registry lookup and collection list agree about whether a component can be absent.

The correct current model is total: the names array is emitted from exactly the same `collections` array as `framerCmsSectionRegistry`. Emit a typed registry entry if helpful, remove the always-true `entry.Component` predicate, and remove the non-null assertion when rendering. The generated shape should have a collection entry with a defined `Component` and `itemCount`, filtered only by `itemCount > 0`.

Do not change `getFramerCmsSectionComponent(name)` into an unsafe always-defined public API for arbitrary external strings. Keep its public result optional, but narrow it once inside `FramerCmsAutoSections` from its own known registry keys.

**Verify**: generate the existing CMS fixture and inspect its `src/framer-data/cms-sections.tsx`; it contains no `.filter((entry) => entry.Component` and no `entry.Component!`.

### Step 2: Add a real generated-project compilation fixture

Add a fixture builder in `packages/exporter-core/src/exporter-regression.test.ts`, near existing `generateNextProject` tests. It must create one compact `ExportIR` that includes all of these generator branches at once:

- at least one CMS collection with string, link, and image fields;
- at least one full-site route;
- a component family mounted in the route;
- a remote component module/registry entry;
- a compatible code-file executable or its existing safe fallback;
- desktop, laptop, tablet, and mobile runtime capture metadata.

Generate the project to a temporary directory. Reuse the repository's generated-project acceptance path rather than duplicating command spawning: call `validateGeneratedProject(projectDir)` after Plan 005 makes generated dependency installation reproducible. Assert that build succeeds and every route includes all four viewport checks.

If testing full `npm install` would make the regular suite unacceptably slow, split this into an explicitly named `test:generated-fixtures` command and make CI/the release gate run it. Do not silently skip it locally; document its exact invocation in `package.json`.

**Verify**: the test fails when the Step 1 predicate is restored and passes after the correct change.

### Step 3: Add branch-specific static regression assertions

Keep the existing fast string-level CMS fixture, but add these assertions:

- the generated CMS registry uses an explicit entry type or known-key narrowing;
- `FramerCmsAutoSections` filters solely by `itemCount > 0` after known-key narrowing;
- no generated CMS source contains `Component!`;
- the full generated fixture contains its route, component-family, CMS, and component-registry modules.

These assertions make the exact root cause readable without requiring a dependency install to identify it.

**Verify**: `npm run test:exporter` exits 0.

### Step 4: Preserve worker failure evidence without calling it success

Inspect the existing `validateGeneratedProject` failure path in `packages/exporter-core/src/local-export.ts`. Do not change its behavior: a nonzero generated build must throw and the worker must mark the job failed. Add or update a test that asserts a synthetic generated compile failure cannot result in a completed export artifact.

**Verify**: `npm run test:exporter` exits 0 and the test asserts rejection/error status.

## Test plan

- Existing fast fixture checks in `packages/exporter-core/src/exporter-regression.test.ts`.
- One generated full-site compilation fixture containing the combined optional branches listed above.
- `npm run typecheck`
- `npm run test:exporter`
- `npm run build`

## Done criteria

- [ ] The emitted CMS module no longer produces TS2774 for a nonempty collection registry.
- [ ] The generated-project compile fixture covers CMS + full-site routes + component family + component registry + code files.
- [ ] A generated `tsc -b && vite build` failure fails the test/release gate before deployment.
- [ ] No TypeScript suppression is introduced in generated code.
- [ ] `npm run typecheck`, `npm run test:exporter`, and `npm run build` exit 0.
- [ ] `plans/README.md` marks Plan 006 `DONE` when complete.

## STOP conditions

- The generated fixture cannot install deterministically because Plan 005 is not complete. Stop and execute Plan 005 first.
- A compile failure is in a downloaded remote Framer module rather than emitted source. Record the module URL/name in the test fixture metadata and do not mask it with `any` or a stub.
- The only way to run generated compilation is to depend on a public live site. Stop; use a local fixture instead.

## Maintenance notes

Any new optional generator branch must be added to the representative compilation fixture in the same change. Reviewers should reject changes that add generated template strings without a source-level assertion and a generated-project compilation path.
