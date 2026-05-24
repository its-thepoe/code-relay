import type {
  NodeMatch,
  PluginCanvasCapture,
  RuntimeNode,
} from "../../shared/src/types.js";

export function matchPluginNodesToDom(
  pluginCapture: PluginCanvasCapture,
  runtimeNodes: RuntimeNode[],
): NodeMatch[] {
  // Build all candidate pairs so we can enforce uniqueness and reject low-confidence merges.
  const candidates = pluginCapture.selectedNodes
    .filter((node) => typeof node.id === "string" && node.id.length > 0)
    .flatMap((pluginNode) =>
      runtimeNodes.map((runtimeNode) =>
        scoreMatch(
          pluginNode as { id: string } & typeof pluginNode,
          runtimeNode,
        ),
      ),
    );

  // Greedy assignment with conflict resolution by highest confidence.
  candidates.sort((a, b) => b.confidence - a.confidence);

  const assignedPlugin = new Set<string>();
  const assignedDom = new Set<string>();
  const picks = new Map<string, NodeMatch>();

  const minConfidence = 0.6;

  for (const candidate of candidates) {
    if (candidate.confidence < minConfidence) {
      break;
    }

    if (!candidate.domPath) continue;
    if (!candidate.framerNodeId) continue;
    if (assignedPlugin.has(candidate.framerNodeId)) continue;
    if (assignedDom.has(candidate.domPath)) continue;

    assignedPlugin.add(candidate.framerNodeId);
    assignedDom.add(candidate.domPath);
    picks.set(candidate.framerNodeId, candidate);
  }

  return pluginCapture.selectedNodes.map((pluginNode) => {
    const pluginId = typeof pluginNode.id === "string" ? pluginNode.id : "";
    if (!pluginId) {
      return { framerNodeId: undefined, confidence: 0, matchReasons: [] };
    }

    return (
      picks.get(pluginId) ?? {
        framerNodeId: pluginId,
        confidence: 0,
        matchReasons: [],
      }
    );
  });
}

function scoreMatch(
  pluginNode: PluginCanvasCapture["selectedNodes"][number],
  runtimeNode: RuntimeNode,
): NodeMatch {
  const matchReasons: NodeMatch["matchReasons"] = [];
  let score = 0;

  if (pluginNode.text && runtimeNode.text) {
    const textScore = similarity(
      normalize(pluginNode.text),
      normalize(runtimeNode.text),
    );

    if (textScore > 0.55) {
      score += textScore * 0.5;
      matchReasons.push("text");
    }
  }

  if (pluginNode.bounds) {
    const boundsScore = rectSimilarity(pluginNode.bounds, runtimeNode.rect);

    if (boundsScore > 0.55) {
      score += boundsScore * 0.35;
      matchReasons.push("bounds");
    }
  }

  if (
    pluginNode.type &&
    pluginNode.type.toLowerCase() === runtimeNode.tag.toLowerCase()
  ) {
    score += 0.08;
    matchReasons.push("type");
  }

  const metadataSrc =
    typeof pluginNode.metadata?.src === "string"
      ? pluginNode.metadata.src
      : undefined;

  if (
    metadataSrc &&
    runtimeNode.attributes.src &&
    metadataSrc === runtimeNode.attributes.src
  ) {
    score += 0.22;
    matchReasons.push("asset");
  }

  const metadataPath =
    typeof pluginNode.metadata?.domPath === "string"
      ? pluginNode.metadata.domPath
      : undefined;

  if (metadataPath) {
    const hierarchyScore = pathSimilarity(metadataPath, runtimeNode.domPath);

    if (hierarchyScore > 0.55) {
      score += hierarchyScore * 0.25;
      matchReasons.push("hierarchy");
    }
  }

  // Tree-context: prefer candidates within the same detected section and with similar DOM depth.
  const pluginSectionHint =
    typeof pluginNode.metadata?.sectionName === "string"
      ? pluginNode.metadata.sectionName
      : undefined;
  if (
    pluginSectionHint &&
    runtimeNode.sectionName &&
    normalize(pluginSectionHint) === normalize(runtimeNode.sectionName)
  ) {
    score += 0.08;
    matchReasons.push("tree-context");
  }

  const pluginDepth = metadataPath
    ? metadataPath.split(">").filter(Boolean).length
    : undefined;
  const runtimeDepth = runtimeNode.domPath.split(">").filter(Boolean).length;
  if (pluginDepth && pluginDepth > 0) {
    const depthDelta = Math.abs(pluginDepth - runtimeDepth);
    const depthScore = Math.max(0, 1 - Math.min(1, depthDelta / 12));
    if (depthScore > 0.6) {
      score += depthScore * 0.06;
      matchReasons.push("tree-context");
    }
  }

  return {
    framerNodeId: pluginNode.id,
    domPath: runtimeNode.domPath,
    confidence: Math.min(1, Number(score.toFixed(3))),
    matchReasons,
  };
}

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function similarity(first: string, second: string) {
  if (first === second) {
    return 1;
  }

  if (first.includes(second) || second.includes(first)) {
    return (
      Math.min(first.length, second.length) /
      Math.max(first.length, second.length)
    );
  }

  const firstWords = new Set(first.split(" "));
  const secondWords = new Set(second.split(" "));
  const shared = Array.from(firstWords).filter((word) =>
    secondWords.has(word),
  ).length;
  const total = new Set([...firstWords, ...secondWords]).size;

  return total === 0 ? 0 : shared / total;
}

function rectSimilarity(
  first: { x: number; y: number; width: number; height: number },
  second: { x: number; y: number; width: number; height: number },
) {
  const widthDelta =
    Math.abs(first.width - second.width) /
    Math.max(first.width, second.width, 1);
  const heightDelta =
    Math.abs(first.height - second.height) /
    Math.max(first.height, second.height, 1);
  const xDelta =
    Math.abs(first.x - second.x) / Math.max(first.width, second.width, 1);
  const yDelta =
    Math.abs(first.y - second.y) / Math.max(first.height, second.height, 1);
  const penalty =
    (widthDelta + heightDelta + Math.min(1, xDelta) + Math.min(1, yDelta)) / 4;

  return Math.max(0, 1 - penalty);
}

function pathSimilarity(first: string, second: string) {
  const firstParts = first
    .split(">")
    .map((part) => part.trim())
    .filter(Boolean);
  const secondParts = second
    .split(">")
    .map((part) => part.trim())
    .filter(Boolean);
  const min = Math.min(firstParts.length, secondParts.length);
  let sharedPrefix = 0;

  for (let index = 0; index < min; index += 1) {
    if (firstParts[index] !== secondParts[index]) {
      break;
    }

    sharedPrefix += 1;
  }

  if (min === 0) {
    return 0;
  }

  return sharedPrefix / Math.max(firstParts.length, secondParts.length);
}
