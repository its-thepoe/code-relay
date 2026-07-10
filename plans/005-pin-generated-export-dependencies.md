# Plan 005: Pin generated export dependencies and include a reproducible lockfile

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in "STOP conditions" occurs, stop and report. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 2948374..HEAD -- packages/codegen/src/next-project.ts packages/exporter-core/src/exporter-regression.test.ts package.json package-lock.json`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on mismatch, stop and report.

## Status

- **Implementation status**: DONE
- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: `plans/001-export-acceptance-gate.md`
- **Category**: dependencies, dx
- **Planned at**: commit `2948374`, 2026-06-14

## Why this matters

Generated ZIPs currently use `"latest"` for React, Vite, TypeScript, and Framer Motion. That means an export that works today can break tomorrow without any code change in this repo. A user downloading a ZIP should get a reproducible project with pinned versions and a lockfile.

## Current state

`packages/codegen/src/next-project.ts` creates generated package manifests.

Current manifest generation:

```ts
// packages/codegen/src/next-project.ts:2211
function createPackageJson(ir: ExportIR) {
  return {
    name: ir.componentName.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
    version: "0.1.0",
    private: true,
    scripts: {
      dev: "vite --host 0.0.0.0",
      build: "tsc -b && vite build",
      preview: "vite preview --host 0.0.0.0",
    },
    dependencies: {
      "@vitejs/plugin-react": "latest",
      "framer-motion": "latest",
      react: "latest",
      "react-dom": "latest",
      vite: "latest",
    },
    devDependencies: {
      "@types/react": "latest",
      "@types/react-dom": "latest",
      typescript: "latest",
    },
  };
}
```

Root repo versions from `package.json` at plan time:

```json
{
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1"
  },
  "devDependencies": {
    "@types/react": "19.2.15",
    "typescript": "^5.8.3"
  }
}
```

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Typecheck | `npm run typecheck` | exit 0, no TypeScript errors |
| Exporter tests | `npm run test:exporter` | exit 0, all tests pass |
| Build | `npm run build` | exit 0 |

## Scope

**In scope**:

- `packages/codegen/src/next-project.ts`
- `packages/exporter-core/src/exporter-regression.test.ts`
- `package.json` and `package-lock.json` only if adding a root dependency is truly required

**Out of scope**:

- Do not migrate package managers.
- Do not update the whole repo dependency tree as part of this plan.
- Do not change generated app framework from Vite.

## Git workflow

```bash
git switch -c codex/005-pin-generated-export-dependencies
```

## Steps

### Step 1: Replace `"latest"` with pinned generated dependency versions

In `packages/codegen/src/next-project.ts`, define a single constant for generated app versions.

Suggested shape:

```ts
const generatedProjectVersions = {
  vite: "pin-exact-version",
  reactPlugin: "pin-exact-version",
  react: "pin-exact-version",
  reactDom: "pin-exact-version",
  framerMotion: "pin-exact-version",
  typescript: "pin-exact-version",
  typesReact: "pin-exact-version",
  typesReactDom: "pin-exact-version",
};
```

Before choosing exact versions, inspect the current lockfile:

```bash
node -e "const p=require('./package-lock.json'); for (const n of ['node_modules/vite','node_modules/@vitejs/plugin-react','node_modules/framer-motion','node_modules/react','node_modules/react-dom','node_modules/typescript','node_modules/@types/react','node_modules/@types/react-dom']) console.log(n, p.packages?.[n]?.version)"
```

Use versions already present in the lockfile where possible. If a package is not present, add the smallest required dependency update and explain it in the commit message.

At plan time, the root lockfile contained React `19.2.6`, TypeScript `5.9.3`, and `@types/react` `19.2.15`, but did not contain Vite, `@vitejs/plugin-react`, Framer Motion, or `@types/react-dom`. The executor must choose exact published versions for missing generated-project packages and commit the resulting lockfile changes.

**Verify**: `npm run typecheck` -> exit 0.

### Step 2: Generate a package lock for exported projects

Update project generation so the exported project includes `package-lock.json`.

Acceptable approaches:

- Preferred: generate `package-lock.json` deterministically with `npm install --package-lock-only --ignore-scripts --no-audit --no-fund` in the generated project during export, then include it in the ZIP.
- Alternative: write a minimal lockfile only if it is valid for npm and accepted by `npm ci`.

This interacts with Plan 001. If Plan 001 already runs an install/build acceptance gate, reuse that install result instead of doing duplicate work.

**Verify**: Generate a local export fixture and confirm `package-lock.json` exists.

### Step 3: Switch acceptance/build docs to prefer `npm ci`

Once lockfile exists, generated README/agent brief should tell users to run:

```bash
npm ci
npm run build
npm run dev
```

Only update generated documentation inside codegen, not repo docs.

**Verify**: `npm run test:exporter` -> exit 0.

### Step 4: Add regression tests

In `packages/exporter-core/src/exporter-regression.test.ts`, add or update tests asserting:

- Generated `package.json` contains no `"latest"` values.
- Generated export contains `package-lock.json`.
- `package-lock.json` package name matches generated `package.json`.

If the test cannot run `npm install` due speed/network, isolate the lockfile generation helper and test it with a temp directory.

**Verify**: `npm run test:exporter` -> exit 0.

## Test plan

- `npm run typecheck`
- `npm run test:exporter`
- Generate a sample export and run inside it:

```bash
npm ci
npm run build
```

Expected: both commands exit 0.

## Done criteria

- [ ] Generated `package.json` has no `"latest"` dependency versions.
- [ ] Generated ZIP includes `package-lock.json`.
- [ ] Generated README/agent instructions use `npm ci`.
- [ ] Exporter regression test covers the no-`latest` invariant.
- [ ] `npm run typecheck` exits 0.
- [ ] `npm run test:exporter` exits 0.
- [ ] `plans/README.md` row for Plan 005 is updated.

## STOP conditions

- Lockfile generation requires network access and the environment does not allow it.
- The root lockfile does not contain required generated project packages and adding them would cause a broad unrelated dependency migration.
- Plan 001 acceptance implementation already created a different reproducibility mechanism; reconcile instead of duplicating.

## Maintenance notes

When React/Vite/TypeScript are intentionally upgraded, update `generatedProjectVersions` and the regression fixture in the same PR. Do not reintroduce `"latest"` for generated artifacts.
