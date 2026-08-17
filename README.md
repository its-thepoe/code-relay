# Code Relay

Code Relay turns a Framer design, or a published website URL, into code that you can run, inspect, and continue building locally.

It is made for the point where a visual site needs to become a real codebase. You can use it to export a selected part of a Framer project, export reusable components, generate a full site, or clone a published page for further development.

## How It Is Built

Code Relay is a local monorepo. Each part has one job:

1. A source is captured from Framer or from a published URL.
2. The captured content is converted into a common internal format. This keeps the rest of the system independent from the original source.
3. The code generator turns that format into a React project or export.
4. Validation compares the result with the source and records what worked, what changed, and how closely the output matches.
5. The result is saved on disk as code, a ZIP file, a report, and a preview.

The dashboard and worker are both local. The dashboard creates and displays export jobs. The worker picks up those jobs and runs the export pipeline in the background.

## Choose Your Starting Point

### You are coming from Framer

Use the Framer plugin when you want Framer-aware exports. It can send the selected content, components, code files, and export settings into Code Relay.

The usual flow is:

1. Open the plugin in Framer.
2. Choose what to export.
3. Create an export job.
4. Let the local worker process it.
5. Open the completed job in the dashboard and download or inspect the generated files.

### You have a published URL

Use the dashboard or CLI when you want to work from a live page. Give Code Relay the URL, optionally provide a CSS selector, and choose whether to export a selection, components, or the full site.

The compiler can also clone a URL directly. In this context, “clone” means generating a new codebase from a live website. It does not mean running `git clone` and it does not require access to the original source repository.

## Quick Start

You need Node.js and npm. Install the dependencies from the repository root:

```bash
npm install
```

Start the dashboard:

```bash
npm run dev:web
```

In a second terminal, start the worker:

```bash
npm run dev:worker
```

Open [http://localhost:3000](http://localhost:3000). From the Jobs page, enter a published page URL and create a job. The worker will process it and write the result into `.coderelay/`.

## Export From the Command Line

The CLI is useful when you want a repeatable export without opening the dashboard:

```bash
npm run export:test -- \
  --url https://example.com \
  --export-mode selection \
  --out-dir .coderelay/exports
```

Available export modes are:

- `selection` - export the selected part of a page
- `components` - export reusable components found in the source
- `full-site` - export the complete page or site

To place a ZIP export inside an existing project:

```bash
npm run export:test -- install \
  --zip /path/to/export.zip \
  --target /path/to/your-project
```

The files will be placed in a `coderelay-export` directory inside the target project. Review the generated code before moving components into your application.

## What You Get

Each completed export can include:

- generated React code
- a ZIP archive of the generated project
- a JSON report with validation and fidelity results
- a preview for visual review
- job metadata and progress information

By default, local job data is stored here:

```text
.coderelay/jobs
.coderelay/artifacts
.coderelay/exports
```

These are working files, not source code. They can be removed when you want a clean local run:

```bash
rm -rf .coderelay/jobs .coderelay/artifacts .coderelay/exports
```

## Repository Layout

```text
apps/
  web/            Local dashboard for creating and reviewing jobs
  worker/         Background process that runs queued exports
  plugin/         Framer plugin UI and capture logic
  exporter-cli/   Command-line entry point for direct exports

packages/
  exporter-core/ Core export pipeline and artifact packaging
  content-contract/ Shared shape for captured content
  codegen/        React project and component generation
  fidelity/       Preview comparison and fidelity scoring
  matcher/        Matching between source nodes and generated nodes
  reconcile/      Reconciliation of captured and generated content
  source-framer/ Framer-specific source extraction
  source-runtime/ Runtime capture helpers
  shared/         Shared types, CLI parsing, and health checks

compiler/
  A separate URL-to-code compiler with capture, generation, and validation tools

docs/
  Run commands, design notes, and implementation documentation

scripts/
  Repository checks, benchmarks, and test helpers
```

## Compiler Workflow

The compiler is the lower-level URL-to-code path. Install its browser dependency once:

```bash
cd compiler
npm install
npx playwright install chromium
```

Clone a published page:

```bash
npm run clone -- https://example.com/
```

The command creates a run under `compiler/runs/`. It also prints the command needed to install and start the generated app. To validate a run later:

```bash
npm run validate-site -- ../runs/site-example.com/<timestamp>
```

The compiler can generate Next.js App Router or Vite React output, capture multiple routes, preserve interactions, and run render and quality checks. See the [compiler guide](compiler/README.md) for all compiler options.

## Useful Commands

Run these from the repository root:

```bash
npm run dev:web          # Start the local dashboard
npm run dev:worker       # Start the export worker
npm run typecheck        # Check TypeScript without emitting files
npm run build            # Build the TypeScript workspace
npm run test             # Run the main export tests
npm run test:export-e2e  # Run export end-to-end tests
npm run format           # Format the repository with Prettier
```

The [run commands guide](docs/run-commands.md) contains more examples.

## Notes for Contributors

- The repository uses npm workspaces. Apps and packages share the root install.
- The dashboard and worker are designed to run side by side during local development.
- The compiler has its own workspace and browser setup.
- Generated artifacts belong in `.coderelay/` or `compiler/runs/`, not in the source directories.
- The generated output is a starting point for development. Always review dependencies, interactions, and visual differences before shipping it.

## More Reading

- [Run commands](docs/run-commands.md)
- [Compiler guide](compiler/README.md)
- [Framer plugin guide](apps/plugin/README.md)
