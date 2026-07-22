import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const defaultExportDir = await resolveLatestFamasiExportDir(repoRoot);
const exportDir = process.env.FAMASI_EXPORT_DIR
  ? path.resolve(process.env.FAMASI_EXPORT_DIR)
  : defaultExportDir;

const routes = [
  { path: "/", finalPath: "/", expectRedirect: false },
  {
    path: "/dispensary",
    finalPath: "/dispensary/",
    expectRedirect: true,
  },
  {
    path: "/blog/5-reasons-to-use-famasi-today",
    finalPath: "/blog/5-reasons-to-use-famasi-today/",
    expectRedirect: true,
  },
];

async function main() {
  await fs.access(exportDir);

  const packageJson = JSON.parse(
    await fs.readFile(path.join(exportDir, "package.json"), "utf8"),
  );
  assert.ok(packageJson?.scripts?.dev, "Famasi export is missing a dev script.");
  assert.ok(
    packageJson?.scripts?.build,
    "Famasi export is missing a build script.",
  );
  assert.ok(
    packageJson?.scripts?.preview,
    "Famasi export is missing a preview script.",
  );

  if (!(await pathExists(path.join(exportDir, "node_modules")))) {
    await runCommand("npm", ["ci", "--ignore-scripts", "--no-audit", "--no-fund"], {
      cwd: exportDir,
      label: "famasi:npm-ci",
    });
  }

  await runCommand("npm", ["run", "build"], {
    cwd: exportDir,
    label: "famasi:build",
  });

  await withServer(
    "npm",
    ["run", "dev", "--", "--host", "127.0.0.1", "--port", "4173", "--strictPort"],
    "http://127.0.0.1:4173",
    async (baseUrl) => {
      await verifyRoutes(baseUrl, "dev");
    },
  );

  await withServer(
    "npm",
    ["run", "preview", "--", "--host", "127.0.0.1", "--port", "4174", "--strictPort"],
    "http://127.0.0.1:4174",
    async (baseUrl) => {
      await verifyRoutes(baseUrl, "preview");
    },
  );

  console.log("famasi smoke passed");
}

async function verifyRoutes(baseUrl, label) {
  for (const route of routes) {
    if (route.expectRedirect) {
      const response = await fetchWithTimeout(new URL(route.path, baseUrl), {
        redirect: "manual",
      });
      assert.equal(
        response.status,
        302,
        `${label} ${route.path} should redirect with 302`,
      );
      assert.equal(
        response.headers.get("location"),
        route.finalPath,
        `${label} ${route.path} should redirect to ${route.finalPath}`,
      );
    }

    const response = await fetchWithTimeout(new URL(route.finalPath, baseUrl));
    assert.equal(
      response.status,
      200,
      `${label} ${route.finalPath} should load with 200`,
    );
    const html = await response.text();
    assert.match(
      html,
      /<!doctype html>/i,
      `${label} ${route.finalPath} should return HTML`,
    );
  }
}

async function withServer(command, args, healthUrl, work) {
  const child = spawn(command, args, {
    cwd: exportDir,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, FORCE_COLOR: "0" },
  });

  let output = "";
  child.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

  try {
    await waitForServer(healthUrl, child, output);
    await work(healthUrl);
  } finally {
    child.kill("SIGTERM");
    await onceExit(child, 5_000);
  }
}

async function waitForServer(healthUrl, child, output) {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(
        `Server for ${healthUrl} exited early with code ${child.exitCode}.\n${output}`,
      );
    }

    try {
      const response = await fetchWithTimeout(healthUrl, {}, 2_000);
      if (response.status >= 200 && response.status < 500) return;
    } catch {}

    await delay(500);
  }

  throw new Error(`Timed out waiting for ${healthUrl}.\n${output}`);
}

async function runCommand(command, args, { cwd, label }) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, FORCE_COLOR: "0" },
    });

    let output = "";
    child.stdout.on("data", (chunk) => {
      output += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      output += chunk.toString();
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve(undefined);
        return;
      }
      reject(new Error(`${label} failed with code ${code}.\n${output}`));
    });
  });
}

async function fetchWithTimeout(url, init = {}, timeoutMs = 10_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

async function pathExists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function resolveLatestFamasiExportDir(rootDir) {
  const jobPath = path.join(
    rootDir,
    ".coderelay",
    "jobs",
    "job_042076bbe22a7e55.json",
  );
  const rawJob = await fs.readFile(jobPath, "utf8");
  const job = JSON.parse(rawJob);
  const exportDir = job?.artifacts?.exportDir;
  assert.equal(
    typeof exportDir,
    "string",
    `Expected artifacts.exportDir in ${jobPath}`,
  );
  assert.ok(exportDir.length > 0, `Expected non-empty artifacts.exportDir in ${jobPath}`);
  return exportDir;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function onceExit(child, timeoutMs) {
  if (child.exitCode !== null) return;
  await Promise.race([
    new Promise((resolve) => child.once("exit", resolve)),
    delay(timeoutMs).then(() => {
      child.kill("SIGKILL");
    }),
  ]);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exit(1);
});
