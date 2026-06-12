import test from "node:test";
import assert from "node:assert/strict";
import { matchPluginNodesToDom } from "./match.js";
import type { PluginCanvasCapture, RuntimeNode } from "../../shared/src/types.js";

test("matchPluginNodesToDom falls back to framerTree nodes when selectedNodes are empty", () => {
  const pluginCapture: PluginCanvasCapture = {
    mode: "framer-plugin",
    capturedAt: "2026-06-12T00:00:00.000Z",
    selectedNodes: [],
    context: {
      framerTree: [
        {
          id: "root",
          type: "FrameNode",
          name: "Hero",
          childIds: ["heading"],
          depth: 0,
          path: "1",
          rootId: "root",
          rootName: "Hero",
          rootKind: "component",
          rect: { x: 0, y: 0, width: 720, height: 420 },
          traits: {},
          styles: {
            backgroundColor: "#0f172a",
          },
        },
        {
          id: "heading",
          type: "TextNode",
          name: "Heading",
          text: "Tree matched heading",
          parentId: "root",
          childIds: [],
          depth: 1,
          path: "1.1",
          rootId: "root",
          rootName: "Hero",
          rootKind: "component",
          rect: { x: 32, y: 32, width: 280, height: 48 },
          traits: {},
          styles: {
            color: "#f8fafc",
            fontSize: "40px",
          },
        },
      ],
    },
  };

  const runtimeNodes: RuntimeNode[] = [
    {
      id: "runtime-root",
      tag: "div",
      domPath: "plugin > div:nth-child(1)",
      rect: { x: 0, y: 0, width: 720, height: 420 },
      sectionIndex: 0,
      sectionName: "Hero",
      attributes: {},
      styles: {},
    },
    {
      id: "runtime-heading",
      tag: "p",
      domPath: "plugin > div:nth-child(1) > p:nth-child(1)",
      text: "Tree matched heading",
      rect: { x: 32, y: 32, width: 280, height: 48 },
      sectionIndex: 0,
      sectionName: "Hero",
      attributes: {},
      styles: {},
    },
  ];

  const matches = matchPluginNodesToDom(pluginCapture, runtimeNodes);

  assert.equal(matches.length, 2);
  assert.equal(matches[0]?.framerNodeId, "root");
  assert.equal(matches[0]?.domPath, "plugin > div:nth-child(1)");
  assert.equal(matches[0]?.confidence > 0.6, true);
  assert.equal(matches[1]?.framerNodeId, "heading");
  assert.equal(matches[1]?.domPath, "plugin > div:nth-child(1) > p:nth-child(1)");
  assert.equal(matches[1]?.matchReasons.includes("text"), true);
});
