import { mkdirp } from "fs-extra";
import path from "node:path";
import { runLocalExport } from "../../../packages/exporter-core/src/local-export.js";
import { parseCliArgs } from "../../../packages/shared/src/cli.js";

async function main() {
  const args = parseCliArgs(process.argv.slice(2));

  if (!args.url) {
    console.error(
      "Usage: npm run export:test -- --url https://example.framer.website",
    );
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
  console.log(
    `Best attempt: ${result.bestAttempt.attemptNumber} (${result.bestAttempt.strategy})`,
  );
  console.log(`Fidelity: ${result.bestAttempt.fidelity.overall.toFixed(2)}%`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exit(1);
});
