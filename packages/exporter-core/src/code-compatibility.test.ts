import test from "node:test";
import assert from "node:assert/strict";
import {
  analyzeCodeFileCompatibility,
  analyzeCodeFilesCompatibility,
} from "./code-compatibility.js";

test("analyzeCodeFileCompatibility classifies adapter and dependency requirements", () => {
  const report = analyzeCodeFileCompatibility({
    id: "code-file-hero",
    name: "Hero.tsx",
    path: "code/Hero.tsx",
    content: `
      import * as React from "react";
      import { RenderTarget, addPropertyControls } from "framer";
      import { motion } from "framer-motion";
      import { Card } from "./Card";
      import clsx from "clsx";
      export function Hero() {
        return <motion.div>{RenderTarget.current() ? "preview" : "runtime"}</motion.div>;
      }
      addPropertyControls(Hero, {});
    `,
    exportDetails: [{ name: "Hero", type: "component" }],
  });

  assert.equal(report.compatibility, "portable-with-dependencies");
  assert.equal(report.usesRenderTarget, true);
  assert.equal(report.usesPropertyControls, true);
  assert.equal(report.usesFramerMotion, true);
  assert.deepEqual(report.dependencyNames, ["clsx", "framer-motion"]);
  assert.deepEqual(report.localComponentImports, ["./Card"]);
});

test("analyzeCodeFileCompatibility marks unresolved aliases and remote modules unsupported", () => {
  const report = analyzeCodeFileCompatibility({
    id: "code-file-remote",
    name: "Remote.tsx",
    path: "code/Remote.tsx",
    content: `
      import Widget from "@/components/Widget";
      import Runtime from "#framer/local/codeFile/runtime.js";
      export const Remote = () => window.location.href;
      export const lazyThing = import("https://esm.sh/some-lib");
    `,
    exportDetails: [{ name: "Remote", type: "component" }],
  });

  assert.equal(report.compatibility, "unsupported");
  assert.equal(report.usesBrowserGlobals, true);
  assert.equal(report.hasDynamicImports, true);
  assert.deepEqual(report.unresolvedProjectAliases, ["@/components/Widget"]);
  assert.deepEqual(report.unsupportedFramerInternals, [
    "#framer/local/codeFile/runtime.js",
  ]);
  assert.deepEqual(report.unsupportedRemoteModules, ["https://esm.sh/some-lib"]);
});

test("analyzeCodeFilesCompatibility summarizes compatibility counts", () => {
  const summary = analyzeCodeFilesCompatibility([
    {
      name: "Portable.tsx",
      content: `export function Portable(){ return null }`,
      exportDetails: [{ name: "Portable", type: "component" }],
    },
    {
      name: "Fallback.tsx",
      content: `export function Fallback(){ return document.title }`,
      exportDetails: [{ name: "Fallback", type: "component" }],
    },
  ]);

  assert.equal(summary.fileCount, 2);
  assert.equal(summary.summary.portable, 1);
  assert.equal(summary.summary.runtimeFallbackRequired, 1);
});
