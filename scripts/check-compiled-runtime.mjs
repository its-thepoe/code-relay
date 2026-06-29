import fs from "node:fs";
import path from "node:path";

const checks = [
  {
    file: "dist/apps/exporter-cli/src/index.js",
    patterns: ["exportMode: args.exportMode", "[coderelay:cli:runLocalExport]"],
  },
  {
    file: "dist/apps/worker/src/index.js",
    patterns: ["exportMode: job.exportMode", "[coderelay:worker:runLocalExport]"],
  },
  {
    file: "dist/packages/shared/src/cli.js",
    patterns: ['arg === "--export-mode"', "Invalid --export-mode"],
  },
];

for (const check of checks) {
  const filePath = path.resolve(check.file);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Compiled runtime file is missing: ${check.file}`);
  }
  const source = fs.readFileSync(filePath, "utf8");
  for (const pattern of check.patterns) {
    if (!source.includes(pattern)) {
      throw new Error(
        `Compiled runtime is stale: ${check.file} is missing ${JSON.stringify(pattern)}.`,
      );
    }
  }
}

console.log("[coderelay:compiled-runtime] source/runtime parity checks passed");
