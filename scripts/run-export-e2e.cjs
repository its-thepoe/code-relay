const { spawnSync } = require("node:child_process");
const path = require("node:path");

const testFile = path.join(
  process.cwd(),
  "dist-test",
  "packages",
  "exporter-core",
  "src",
  "local-export.integration.test.js",
);

const testNames = [
  "runLocalExport crawls, builds, and validates every full-site route",
  "runLocalExport rebuilds a full-site export when a cached localized asset is deleted",
  "runLocalExport fails closed when ZIP verification cannot extract the archive",
];

for (const testName of testNames) {
  const result = spawnSync(
    process.execPath,
    ["--test", "--test-name-pattern", `^${escapeRegex(testName)}$`, testFile],
    {
      cwd: process.cwd(),
      stdio: "inherit",
    },
  );

  if ((result.status ?? 1) !== 0) {
    process.exit(result.status ?? 1);
  }
}

function escapeRegex(value) {
  return value.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
}
