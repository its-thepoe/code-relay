import type { NodeMatch, PluginCanvasCapture, RuntimeNode } from '../../shared/src/types.js'

export function matchPluginNodesToDom(pluginCapture: PluginCanvasCapture, runtimeNodes: RuntimeNode[]): NodeMatch[] {
  return pluginCapture.selectedNodes.map((pluginNode) => {
    const scored = runtimeNodes
      .map((runtimeNode) => scoreMatch(pluginNode, runtimeNode))
      .sort((first, second) => second.confidence - first.confidence)
    const best = scored[0]

    if (!best || best.confidence < 0.45) {
      return {
        framerNodeId: pluginNode.id,
        confidence: 0,
        matchReasons: [],
      }
    }

    return best ?? {
      framerNodeId: pluginNode.id,
      confidence: 0,
      matchReasons: [],
    }
  })
}

function scoreMatch(
  pluginNode: PluginCanvasCapture['selectedNodes'][number],
  runtimeNode: RuntimeNode
): NodeMatch {
  const matchReasons: NodeMatch['matchReasons'] = []
  let score = 0

  if (pluginNode.text && runtimeNode.text) {
    const textScore = similarity(normalize(pluginNode.text), normalize(runtimeNode.text))

    if (textScore > 0.55) {
      score += textScore * 0.45
      matchReasons.push('text')
    }
  }

  if (pluginNode.bounds) {
    const boundsScore = rectSimilarity(pluginNode.bounds, runtimeNode.rect)

    if (boundsScore > 0.55) {
      score += boundsScore * 0.3
      matchReasons.push('bounds')
    }
  }

  if (pluginNode.type && pluginNode.type.toLowerCase() === runtimeNode.tag.toLowerCase()) {
    score += 0.12
    matchReasons.push('type')
  }

  const metadataSrc = typeof pluginNode.metadata?.src === 'string' ? pluginNode.metadata.src : undefined

  if (metadataSrc && runtimeNode.attributes.src && metadataSrc === runtimeNode.attributes.src) {
    score += 0.18
    matchReasons.push('asset')
  }

  const metadataPath = typeof pluginNode.metadata?.domPath === 'string' ? pluginNode.metadata.domPath : undefined

  if (metadataPath) {
    const hierarchyScore = pathSimilarity(metadataPath, runtimeNode.domPath)

    if (hierarchyScore > 0.55) {
      score += hierarchyScore * 0.2
      matchReasons.push('hierarchy')
    }
  }

  return {
    framerNodeId: pluginNode.id,
    domPath: runtimeNode.domPath,
    confidence: Math.min(1, Number(score.toFixed(3))),
    matchReasons,
  }
}

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, ' ').trim()
}

function similarity(first: string, second: string) {
  if (first === second) {
    return 1
  }

  if (first.includes(second) || second.includes(first)) {
    return Math.min(first.length, second.length) / Math.max(first.length, second.length)
  }

  const firstWords = new Set(first.split(' '))
  const secondWords = new Set(second.split(' '))
  const shared = Array.from(firstWords).filter((word) => secondWords.has(word)).length
  const total = new Set([...firstWords, ...secondWords]).size

  return total === 0 ? 0 : shared / total
}

function rectSimilarity(first: { x: number; y: number; width: number; height: number }, second: { x: number; y: number; width: number; height: number }) {
  const widthDelta = Math.abs(first.width - second.width) / Math.max(first.width, second.width, 1)
  const heightDelta = Math.abs(first.height - second.height) / Math.max(first.height, second.height, 1)
  const xDelta = Math.abs(first.x - second.x) / Math.max(first.width, second.width, 1)
  const yDelta = Math.abs(first.y - second.y) / Math.max(first.height, second.height, 1)
  const penalty = (widthDelta + heightDelta + Math.min(1, xDelta) + Math.min(1, yDelta)) / 4

  return Math.max(0, 1 - penalty)
}

function pathSimilarity(first: string, second: string) {
  const firstParts = first.split('>').map((part) => part.trim()).filter(Boolean)
  const secondParts = second.split('>').map((part) => part.trim()).filter(Boolean)
  const min = Math.min(firstParts.length, secondParts.length)
  let sharedPrefix = 0

  for (let index = 0; index < min; index += 1) {
    if (firstParts[index] !== secondParts[index]) {
      break
    }

    sharedPrefix += 1
  }

  if (min === 0) {
    return 0
  }

  return sharedPrefix / Math.max(firstParts.length, secondParts.length)
}
