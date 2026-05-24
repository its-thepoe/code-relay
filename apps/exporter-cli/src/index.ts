import { mkdirp } from "fs-extra";
import path from "node:path";
import { spawn } from "node:child_process";
import { runLocalExport } from "../../../packages/exporter-core/src/local-export.js";
import { parseCliArgs } from "../../../packages/shared/src/cli.js";

function printUsage() {
  console.error("Coderelay CLI");
  console.error("");
  console.error("Export:");
  console.error(
    "  npm run export:test -- --url https://example.com --out-dir .coderelay/exports",
  );
  console.error("");
  console.error("Install into an existing React project:");
  console.error(
    "  npm run export:test -- install --zip /path/to/export.zip --target /path/to/your-project",
  );
}

function parseInstallArgs(args: string[]) {
  const parsed: { zip?: string; target?: string } = {};
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === "--zip") {
      parsed.zip = next;
      i += 1;
    } else if (arg === "--target") {
      parsed.target = next;
      i += 1;
    }
  }
  return parsed;
}

async function unzip(zipPath: string, targetDir: string) {
  await mkdirp(targetDir);
  await new Promise<void>((resolve, reject) => {
    const child = spawn("unzip", ["-o", zipPath, "-d", targetDir], {
      stdio: "inherit",
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`unzip failed with code ${code}`));
    });
    child.on("error", reject);
  });
}

async function main() {
  const argv = process.argv.slice(2);

  if (argv[0] === "install") {
    const install = parseInstallArgs(argv.slice(1));
    if (!install.zip || !install.target) {
      printUsage();
      process.exit(1);
    }

    const zipPath = path.resolve(install.zip);
    const target = path.resolve(install.target);
    const dest = path.join(target, "coderelay-export");

    await unzip(zipPath, dest);
    console.log(`Installed export into: ${dest}`);
    console.log("Next step: copy the generated component(s) into your app.");
    return;
  }

  const args = parseCliArgs(argv);

  if (!args.url) {
    printUsage();
    process.exit(1);
  }

  const outputRoot = path.resolve(args.outDir ?? ".coderelay/exports");
  await mkdirp(outputRoot);

  const result = await runLocalExport({
    url: args.url,
    outDir: outputRoot,
    name: args.name,
    selector: args.selector,
    maxAttempts: args.maxAttempts ?? 2,
    targetFidelity: args.targetFidelity ?? 0.9,
  });

  console.log(`Export complete: ${result.exportDir}`);
  console.log(`ZIP: ${result.zipPath}`);
  console.log(`Report: ${result.reportPath}`);
  console.log(`Preview: ${result.previewPath}`);
  console.log(
    `Best attempt: ${result.bestAttempt.attemptNumber} (${result.bestAttempt.strategy})`,
  );
  console.log(`Fidelity: ${result.bestAttempt.fidelity.overall.toFixed(2)}%`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exit(1);
});
