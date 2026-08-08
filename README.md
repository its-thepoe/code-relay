# code-relay

Code Relay is a local export system for turning Framer content into code, reviewing the result, and storing the generated artifacts on disk.

It is built as a monorepo with three main pieces:

- a Framer plugin for creating export jobs
- a Next.js dashboard for browsing and creating jobs locally
- a worker that picks up queued jobs and writes the export artifacts

The repo also includes a deterministic compiler workspace used for cloning and validating published sites.

## What This Repo Does

- Captures source content from Framer or a published URL
- Builds an intermediate representation of the layout and interactions
- Generates a React app export
- Validates the generated result against render and fidelity checks
- Packages the output into a ZIP plus reports and previews
- Keeps job state and artifacts on disk under `.coderelay/`

## Who This Is For

Use this repo if you want to:

- create export jobs from the Framer plugin
- inspect exports in a local dashboard
- run the worker locally to process jobs
- work on the compiler that powers cloning and validation
- test export fidelity against real pages and fixtures

## Repo Map

- `apps/web` - Next.js dashboard for creating and browsing jobs
- `apps/worker` - local worker that processes queued jobs
- `apps/plugin` - Framer plugin UI and plugin runtime
- `apps/exporter-cli` - CLI wrapper around the export pipeline
- `packages/exporter-core` - core export pipeline and packaging logic
- `packages/content-contract` - canonical content bundle schema and helpers
- `packages/codegen` - project generation code
- `packages/fidelity` - preview comparison and fidelity scoring
- `packages/matcher` - DOM-to-plugin node matching
- `packages/reconcile` - reconciliation helpers for exported content
- `packages/shared` - shared CLI, types, and export-health utilities
- `packages/source-framer` - Framer source extraction helpers
- `packages/source-runtime` - runtime source helpers
- `compiler` - deterministic cloning and validation workspace
- `docs` - design notes, implementation plans, and run commands
- `scripts` - repo-level automation for export, benchmarks, and checks

## Core Workflow

1. Create or queue an export job from the Framer plugin or the dashboard.
2. Run the worker locally so it can claim queued jobs.
3. The worker calls the export pipeline in `packages/exporter-core`.
4. The export pipeline captures source, generates code, validates output, and packages artifacts.
5. Job records and artifacts are written to `.coderelay/jobs` and `.coderelay/artifacts`.
6. Open the dashboard to inspect status, logs, and generated files.

## Requirements

- Node.js and npm
- Playwright Chromium for the compiler workspace

If you are working in `compiler`, install browser dependencies once:

```bash
cd compiler
npm install
npx playwright install chromium
```

## Quick Start

From the repo root:

```bash
npm install
npm run dev:web
```

In a second terminal:

```bash
npm run dev:worker
```

Then open the dashboard at `http://localhost:3000`.

## Useful Commands

From the repo root:

- `npm run dev:web` - start the dashboard
- `npm run dev:worker` - start the local worker
- `npm run build` - typecheck and build the workspace
- `npm run test` - run the main export test flow
- `npm run test:export-e2e` - run export end-to-end tests
- `npm run typecheck` - run TypeScript typecheck only
- `npm run format` - format the repository with Prettier
- `npm run export:test -- --url https://example.com --export-mode selection --out-dir .coderelay/exports` - run a local export
- `npm run export:test -- install --zip /path/to/export.zip --target /path/to/project` - unpack an export into another project

The compiler workspace also has its own commands in [compiler/README.md](compiler/README.md).

## Job Artifacts

Completed jobs usually include:

- a ZIP archive of the generated project
- a report JSON with validation and fidelity data
- a preview artifact for review
- job metadata under `.coderelay/jobs`

If you want a clean slate while developing, delete:

```bash
rm -rf .coderelay/jobs .coderelay/artifacts
```

## Working Notes

- The repo uses npm workspaces.
- Root scripts forward into the underlying app, package, or compiler workspaces.
- The dashboard and worker are meant to run side by side during local development.
- The compiler workspace is where most of the heavy capture and validation logic lives.

## More Reading

- [Run commands](docs/run-commands.md)
- [Compiler guide](compiler/README.md)
- [Plugin guide](apps/plugin/README.md)
