import test from "node:test";
import assert from "node:assert/strict";
import { parseCliArgs } from "./cli.js";
test("parseCliArgs preserves an explicit export mode", () => {
    assert.deepEqual(parseCliArgs([
        "--url",
        "https://example.com",
        "--export-mode",
        "full-site",
    ]), {
        url: "https://example.com",
        exportMode: "full-site",
    });
});
test("parseCliArgs rejects an invalid export mode instead of defaulting", () => {
    assert.throws(() => parseCliArgs(["--export-mode", "invalid"]), /Invalid --export-mode/);
});
