import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

type FixtureManifest = {
  name: string;
  description: string;
  fixtures: Array<{
    id: string;
    label: string;
    url: string;
    surface: string;
  }>;
};

type BenchmarkRun = {
  tool: "coderelay" | "ditto";
  fixture: string;
  url: string;
  outputDir: string;
  appDir: string;
  previewPath: string;
  routeCount: number;
  editableSourceFiles: number;
  assetFiles: number;
  reportFiles: number;
  reportQuality: string;
  fidelityEvidence: string;
  screenshotDiffPct: Partial<Record<string, number>>;
  status: "passed" | "failed";
  error?: string;
};

const viewports = {
  desktop: { width: 1440, height: 900 },
  laptop: { width: 1280, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
} as const;

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const rootDir = process.cwd();
  const manifestPath =
    args.manifest ?? path.join(rootDir, "benchmarks/framer-fixtures/manifest.json");
  const manifest = (await readJson(manifestPath)) as FixtureManifest;
  const selectedFixtures = selectFixtures(manifest.fixtures, args);
  const outputRoot =
    args.outDir ??
    path.join(
      rootDir,
      "benchmarks",
      "framer-fixtures",
      "results",
      new Date().toISOString().replace(/[:.]/g, "-"),
    );
  await fs.mkdir(outputRoot, { recursive: true });

  const runs: BenchmarkRun[] = [];
  for (const fixture of selectedFixtures) {
    const fixtureRoot = path.join(outputRoot, fixture.id);
    await fs.mkdir(fixtureRoot, { recursive: true });
    try {
      const sourceScreens = await captureUrlScreenshots(
        fixture.url,
        path.join(fixtureRoot, "source"),
      );
      const [coderelayResult, dittoResult] = await Promise.allSettled([
        runCoderelayFixture(fixture, fixtureRoot),
        runDittoFixture(fixture, fixtureRoot),
      ]);

      runs.push(
        coderelayResult.status === "fulfilled"
          ? await buildRunSummary({
              tool: "coderelay",
              fixture,
              outputRoot: fixtureRoot,
              exportPath: coderelayResult.value,
              sourceScreens,
            })
          : buildFailureRun("coderelay", fixture, coderelayResult.reason),
      );
      runs.push(
        dittoResult.status === "fulfilled"
          ? await buildRunSummary({
              tool: "ditto",
              fixture,
              outputRoot: fixtureRoot,
              exportPath: dittoResult.value,
              sourceScreens,
            })
          : buildFailureRun("ditto", fixture, dittoResult.reason),
      );
    } catch (error) {
      runs.push(buildFailureRun("coderelay", fixture, error));
      runs.push(buildFailureRun("ditto", fixture, error));
    }
  }

  const markdown = renderMarkdown(manifest, runs);
  const summaryPath = path.join(outputRoot, "summary.md");
  const jsonPath = path.join(outputRoot, "summary.json");
  await fs.writeFile(summaryPath, `${markdown}\n`);
  await fs.writeFile(
    jsonPath,
    `${JSON.stringify({ manifest, runs }, null, 2)}\n`,
  );

  console.log(summaryPath);
  console.log(jsonPath);
}

function parseArgs(argv: string[]) {
  const args: {
    manifest?: string;
    outDir?: string;
    fixtureIds: string[];
    limit?: number;
  } = { fixtureIds: [] };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];
    if (arg === "--manifest" && next) {
      args.manifest = next;
      i += 1;
    } else if (arg === "--out-dir" && next) {
      args.outDir = next;
      i += 1;
    } else if (arg === "--fixture" && next) {
      args.fixtureIds.push(next);
      i += 1;
    } else if (arg === "--limit" && next) {
      args.limit = Number(next);
      i += 1;
    }
  }

  return args;
}

function selectFixtures(
  fixtures: FixtureManifest["fixtures"],
  args: ReturnType<typeof parseArgs>,
) {
  if (args.fixtureIds.length > 0) {
    const wanted = new Set(args.fixtureIds);
    return fixtures.filter((fixture) => wanted.has(fixture.id));
  }
  const limit = Number.isFinite(args.limit ?? NaN) ? Math.max(1, args.limit!) : 3;
  return fixtures.slice(0, limit);
}

async function runCoderelayFixture(
  fixture: FixtureManifest["fixtures"][number],
  fixtureRoot: string,
) {
  const outputDir = path.join(fixtureRoot, "coderelay");
  await fs.mkdir(outputDir, { recursive: true });
  await execCommand(
    "npm",
    [
      "run",
      "export:test",
      "--",
      "--url",
      fixture.url,
      "--export-mode",
      "full-site",
      "--out-dir",
      outputDir,
    ],
    process.cwd(),
    path.join(fixtureRoot, "coderelay.log"),
  );
  const runDir = await newestChildDir(outputDir);
  if (!runDir) {
    throw new Error(`Coderelay did not create a run directory for ${fixture.id}`);
  }
  return path.join(runDir, "export");
}

async function runDittoFixture(
  fixture: FixtureManifest["fixtures"][number],
  fixtureRoot: string,
) {
  const dittoRoot = path.join(fixtureRoot, "ditto");
  await fs.mkdir(dittoRoot, { recursive: true });
  await execCommand(
    "npm",
    ["run", "clone", "--", fixture.url, `--out=${dittoRoot}`],
    "/tmp/ditto.site",
    path.join(fixtureRoot, "ditto.log"),
  );
  const appDir = path.join(dittoRoot, "framer", "app");
  return appDir;
}

async function buildRunSummary(input: {
  tool: "coderelay" | "ditto";
  fixture: FixtureManifest["fixtures"][number];
  outputRoot: string;
  exportPath: string;
  sourceScreens: Record<string, string>;
}): Promise<BenchmarkRun> {
  const previewPath = await locatePreviewPath(input.exportPath);
  const generatedScreens = path.join(input.outputRoot, input.tool, "generated");
  await capturePreviewScreenshots(previewPath, generatedScreens);
  const screenshotDiffPct: Partial<Record<string, number>> = {};
  for (const viewport of Object.keys(viewports)) {
    const sourcePath = input.sourceScreens[viewport];
    const generatedPath = path.join(generatedScreens, `${viewport}.png`);
    screenshotDiffPct[viewport] = await comparePngs(sourcePath, generatedPath);
  }

  const routeCount = await inferRouteCount(input.tool, input.exportPath);
  const editableSourceFiles = await countSourceFiles(input.exportPath);
  const assetFiles = await countAssetFiles(input.exportPath);
  const reportFiles = await countReportFiles(input.exportPath);
  const reportQuality = await assessReportQuality(input.tool, input.exportPath);
  const fidelityEvidence = await readFidelityEvidence(input.tool, input.exportPath);

  return {
    tool: input.tool,
    fixture: input.fixture.id,
    url: input.fixture.url,
    outputDir: input.exportPath,
    appDir: input.exportPath,
    previewPath,
    routeCount,
    editableSourceFiles,
    assetFiles,
    reportFiles,
    reportQuality,
    fidelityEvidence,
    screenshotDiffPct,
    status: "passed",
  };
}

function buildFailureRun(
  tool: BenchmarkRun["tool"],
  fixture: FixtureManifest["fixtures"][number],
  error: unknown,
): BenchmarkRun {
  return {
    tool,
    fixture: fixture.id,
    url: fixture.url,
    outputDir: "",
    appDir: "",
    previewPath: "",
    routeCount: 0,
    editableSourceFiles: 0,
    assetFiles: 0,
    reportFiles: 0,
    reportQuality: "failed",
    fidelityEvidence: "failed",
    screenshotDiffPct: {},
    status: "failed",
    error: error instanceof Error ? error.message : String(error),
  };
}

async function locatePreviewPath(exportPath: string) {
  const candidate = path.join(exportPath, "preview.html");
  await fs.access(candidate);
  return candidate;
}

async function captureUrlScreenshots(url: string, outputDir: string) {
  await fs.mkdir(outputDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const result: Record<string, string> = {};
    for (const [viewport, size] of Object.entries(viewports)) {
      const page = await browser.newPage({ viewport: size });
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
      await page.waitForTimeout(1000);
      const file = path.join(outputDir, `${viewport}.png`);
      await page.screenshot({ path: file, fullPage: true, animations: "disabled" });
      result[viewport] = file;
      await page.close();
    }
    return result;
  } finally {
    await browser.close();
  }
}

async function capturePreviewScreenshots(previewPath: string, outputDir: string) {
  await fs.mkdir(outputDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    for (const [viewport, size] of Object.entries(viewports)) {
      const page = await browser.newPage({ viewport: size });
      await page.goto(`file://${previewPath}`, {
        waitUntil: "domcontentloaded",
        timeout: 30_000,
      });
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: path.join(outputDir, `${viewport}.png`),
        fullPage: true,
        animations: "disabled",
      });
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

async function comparePngs(aPath: string, bPath: string) {
  const a = PNG.sync.read(await fs.readFile(aPath));
  const b = PNG.sync.read(await fs.readFile(bPath));
  const width = Math.min(a.width, b.width);
  const height = Math.min(a.height, b.height);
  const aCrop = cropPng(a, width, height);
  const bCrop = cropPng(b, width, height);
  const diff = new PNG({ width, height });
  const mismatched = pixelmatch(
    aCrop.data,
    bCrop.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 },
  );
  return Number(((mismatched / (width * height)) * 100).toFixed(2));
}

function cropPng(source: PNG, width: number, height: number) {
  const cropped = new PNG({ width, height });
  PNG.bitblt(source, cropped, 0, 0, width, height, 0, 0);
  return cropped;
}

async function inferRouteCount(tool: "coderelay" | "ditto", exportPath: string) {
  if (tool === "coderelay") {
    const routes = (await readJson(path.join(exportPath, "route-manifest.json"))) as unknown[];
    return Array.isArray(routes) ? routes.length : 0;
  }
  return countRoutePages(exportPath);
}

async function countRoutePages(appDir: string) {
  const files = await walk(appDir);
  return files.filter((file) =>
    /(^|\/)(page|index)\.tsx?$/.test(file) &&
    !file.includes("/node_modules/") &&
    !file.includes("/dist/"),
  ).length;
}

async function countSourceFiles(appDir: string) {
  const files = await walk(appDir);
  return files.filter((file) =>
    /\.(tsx?|css|mdx?)$/.test(file) &&
    !file.includes("/node_modules/") &&
    !file.includes("/dist/") &&
    !file.includes("/preview.html") &&
    !file.includes("/.clone/"),
  ).length;
}

async function countAssetFiles(appDir: string) {
  const files = await walk(appDir);
  return files.filter((file) =>
    /\.(png|jpe?g|webp|gif|svg|avif|ico|woff2?|ttf)$/i.test(file) &&
    !file.includes("/node_modules/") &&
    !file.includes("/dist/"),
  ).length;
}

async function countReportFiles(appDir: string) {
  const files = await walk(appDir);
  return files.filter((file) =>
    /(report|manifest|validation|status)\.json$/i.test(file) ||
    /export-report\.json$/i.test(file),
  ).length;
}

async function assessReportQuality(tool: "coderelay" | "ditto", exportPath: string) {
  if (tool === "ditto") {
    return "none";
  }
  const report = (await readJson(path.join(exportPath, "export-report.json"))) as Record<string, unknown>;
  const evidence = report.fidelityEvidence && typeof report.fidelityEvidence === "object";
  const generatedValidation = report.generatedValidation && typeof report.generatedValidation === "object";
  const sourceEvidence = report.sourceEvidence && typeof report.sourceEvidence === "object";
  const score = [evidence, generatedValidation, sourceEvidence].filter(Boolean).length;
  return score >= 3 ? "rich" : score >= 2 ? "medium" : "thin";
}

async function readFidelityEvidence(tool: "coderelay" | "ditto", exportPath: string) {
  if (tool === "ditto") {
    return "none";
  }
  const report = (await readJson(path.join(exportPath, "export-report.json"))) as Record<string, unknown>;
  const fidelityEvidence = report.fidelityEvidence as Record<string, unknown> | undefined;
  return typeof fidelityEvidence?.mode === "string" ? fidelityEvidence.mode : "unknown";
}

async function execCommand(
  command: string,
  args: string[],
  cwd: string,
  logPath: string,
) {
  await fs.mkdir(path.dirname(logPath), { recursive: true });
  const logChunks: string[] = [];
  const child = spawn(command, args, {
    cwd,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout.on("data", (chunk) => {
    logChunks.push(chunk.toString());
  });
  child.stderr.on("data", (chunk) => {
    logChunks.push(chunk.toString());
  });
  const exitCode = await new Promise<number>((resolve, reject) => {
    child.on("error", reject);
    child.on("exit", (code) => resolve(code ?? 1));
  });
  await fs.writeFile(logPath, logChunks.join(""));
  if (exitCode !== 0) {
    throw new Error(
      `${command} ${args.join(" ")} failed in ${cwd} with code ${exitCode}. See ${logPath}`,
    );
  }
}

async function newestChildDir(root: string) {
  const entries = await fs.readdir(root, { withFileTypes: true });
  const dirs = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const full = path.join(root, entry.name);
        const stat = await fs.stat(full);
        return { full, mtimeMs: stat.mtimeMs };
      }),
  );
  dirs.sort((a, b) => b.mtimeMs - a.mtimeMs);
  return dirs[0]?.full;
}

async function walk(root: string): Promise<string[]> {
  const entries = await fs.readdir(root, { withFileTypes: true });
  const output: string[] = [];
  for (const entry of entries) {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) {
      output.push(...(await walk(full)));
    } else {
      output.push(full);
    }
  }
  return output;
}

async function readJson(filePath: string) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

function renderMarkdown(manifest: FixtureManifest, runs: BenchmarkRun[]) {
  const grouped = new Map<string, BenchmarkRun[]>();
  for (const run of runs) {
    const list = grouped.get(run.fixture) ?? [];
    list.push(run);
    grouped.set(run.fixture, list);
  }

  const lines: string[] = [];
  lines.push(`# ${manifest.name}`);
  lines.push("");
  lines.push(manifest.description);
  lines.push("");
  lines.push("| Fixture | Tool | Diff % avg | Routes | Assets | Editable files | Reports | Evidence | Report quality |");
  lines.push("| --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |");

  for (const fixture of manifest.fixtures) {
    const fixtureRuns = grouped.get(fixture.id) ?? [];
    for (const run of fixtureRuns) {
      const avgDiff = average(
        Object.values(run.screenshotDiffPct).filter(
          (value): value is number => typeof value === "number",
        ),
      );
      const diffText =
        run.status === "failed" ? "failed" : formatNumber(avgDiff);
      const evidenceText =
        run.status === "failed" ? "failed" : run.fidelityEvidence;
      const reportQualityText =
        run.status === "failed" ? "failed" : run.reportQuality;
      lines.push(
        `| ${fixture.label} | ${run.tool} | ${diffText} | ${run.routeCount} | ${run.assetFiles} | ${run.editableSourceFiles} | ${run.reportFiles} | ${evidenceText} | ${reportQualityText} |`,
      );
    }
  }

  const coderelayRuns = runs.filter((run) => run.tool === "coderelay");
  const dittoRuns = runs.filter((run) => run.tool === "ditto");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`Coderelay runs: ${coderelayRuns.length}`);
  lines.push(`Ditto runs: ${dittoRuns.length}`);
  lines.push(
    `Passed runs: ${runs.filter((run) => run.status === "passed").length}, failed runs: ${runs.filter((run) => run.status === "failed").length}`,
  );
  const failedRuns = runs.filter((run) => run.status === "failed");
  if (failedRuns.length > 0) {
    lines.push("");
    lines.push("### Failures");
    lines.push("");
    for (const run of failedRuns) {
      lines.push(`- ${run.fixture} / ${run.tool}: ${run.error ?? "unknown error"}`);
    }
  }
  lines.push("");
  lines.push("Observation: lower diff percentages are better. On the sample run we captured manually, ditto.site was ahead on raw screenshot diff, while Coderelay was ahead on report richness and explicit evidence labeling.");
  return lines.join("\n");
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatNumber(value: number) {
  return Number.isFinite(value) ? value.toFixed(2) : "0.00";
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exit(1);
});
