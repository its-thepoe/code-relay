const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

function collectTests(rootDir) {
  const output = [];

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }
      if (entry.isFile() && entry.name.endsWith(".test.js")) {
        output.push(fullPath);
      }
    }
  }

  if (fs.existsSync(rootDir)) {
    walk(rootDir);
  }

  return output.sort();
}

const rootDir = path.join(process.cwd(), "dist-test");
const testFiles = collectTests(rootDir);

if (testFiles.length === 0) {
  console.error("No compiled test files were found in dist-test.");
  process.exit(1);
}

const result = spawnSync(process.execPath, ["--test", ...testFiles], {
  cwd: process.cwd(),
  stdio: "inherit",
});

process.exit(result.status ?? 1);
