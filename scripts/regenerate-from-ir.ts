import fs from "node:fs/promises";
import path from "node:path";
import { generateNextProject } from "../packages/codegen/src/next-project.js";

type Strategy = {
  id: string;
  structuredLayout: boolean;
  compactSpacing: boolean;
  aggressiveMobileStacking: boolean;
  preserveImageAspectRatio: boolean;
};

function parseArgs(argv: string[]) {
  const parsed: {
    ir?: string;
    out?: string;
    strategy?: string;
  } = {};

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    const next = argv[index + 1];
    if (value === "--ir" && next) {
      parsed.ir = next;
      index += 1;
      continue;
    }
    if (value === "--out" && next) {
      parsed.out = next;
      index += 1;
      continue;
    }
    if (value === "--strategy" && next) {
      parsed.strategy = next;
      index += 1;
    }
  }

  return parsed;
}

function resolveStrategy(id: string | undefined): Strategy {
  if (id === "structured-layout") {
    return {
      id,
      structuredLayout: true,
      compactSpacing: false,
      aggressiveMobileStacking: false,
      preserveImageAspectRatio: true,
    };
  }

  return {
    id: id ?? "semantic-layout",
    structuredLayout: false,
    compactSpacing: false,
    aggressiveMobileStacking: false,
    preserveImageAspectRatio: true,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.ir || !args.out) {
    throw new Error(
      "Usage: tsx scripts/regenerate-from-ir.ts --ir /path/to/normalized-ir.json --out /path/to/project [--strategy semantic-layout]",
    );
  }

  const irPath = path.resolve(args.ir);
  const outDir = path.resolve(args.out);
  const ir = JSON.parse(await fs.readFile(irPath, "utf8"));
  const runtimeCapturePath = path.join(path.dirname(irPath), "raw-runtime-capture.json");
  try {
    const runtimeCapture = JSON.parse(
      await fs.readFile(runtimeCapturePath, "utf8"),
    );
    if (!Array.isArray(ir.runtimeCapture?.nodes)) {
      ir.runtimeCapture = runtimeCapture;
    }
  } catch {}
  await fs.rm(outDir, { recursive: true, force: true });
  await generateNextProject({
    ir,
    projectDir: outDir,
    strategy: resolveStrategy(args.strategy),
  });
  console.log(outDir);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exit(1);
});
