import { copy, mkdirp } from 'fs-extra'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { generateNextProject } from '../../codegen/src/next-project.js'
import { compareGeneratedPreview } from '../../fidelity/src/compare.js'
import { matchPluginNodesToDom } from '../../matcher/src/match.js'
import type { ExportAttemptResult, ExportIR, ExportWarning, FidelityScores } from '../../shared/src/types.js'
import { captureRuntime, createSimulatedPluginCapture } from './capture.js'
import { buildIntermediateRepresentation } from './ir.js'
import { zipDirectory } from './package.js'

type LocalExportInput = {
  url: string
  outDir: string
  name?: string
  selector?: string
  maxAttempts: number
  targetFidelity: number
}

type LocalExportResult = {
  exportDir: string
  zipPath: string
  reportPath: string
  bestAttempt: ExportAttemptResult
}

const strategies = ['semantic-layout', 'landing-page-structured', 'spacing-typography-correction']

export async function runLocalExport(input: LocalExportInput): Promise<LocalExportResult> {
  const timestamp = new Date().toISOString().replaceAll(/[:.]/g, '-')
  const runDir = path.join(input.outDir, timestamp)
  const workDir = path.join(runDir, 'work')
  const attemptsDir = path.join(runDir, 'attempts')
  const exportDir = path.join(runDir, 'export')

  await mkdirp(workDir)
  await mkdirp(attemptsDir)
  await mkdirp(exportDir)

  const runtimeCapture = await captureRuntime({
    url: input.url,
    workDir,
    selector: input.selector,
  })
  const pluginCapture = createSimulatedPluginCapture(runtimeCapture.nodes)
  const nodeMatches = matchPluginNodesToDom(pluginCapture, runtimeCapture.nodes)
  const ir = buildIntermediateRepresentation({
    url: input.url,
    name: input.name,
    runtimeCapture,
    pluginCapture,
    nodeMatches,
  })
  const attempts = await runAttempts({
    ir,
    attemptsDir,
    maxAttempts: input.maxAttempts,
    targetFidelity: input.targetFidelity,
  })
  const bestAttempt = selectBestAttempt(attempts)
  const report = createReport(ir, attempts, bestAttempt)

  await copy(bestAttempt.projectDir, exportDir)
  const reportPath = path.join(exportDir, 'export-report.json')
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`)
  await writeFile(path.join(exportDir, 'README.md'), createReadme(ir, bestAttempt))
  await writeFile(path.join(exportDir, 'AGENT_BRIEF.md'), createAgentBrief(ir, bestAttempt))

  const zipPath = path.join(runDir, `${ir.componentName}.zip`)
  await zipDirectory(exportDir, zipPath)

  return {
    exportDir,
    zipPath,
    reportPath,
    bestAttempt,
  }
}

async function runAttempts(input: {
  ir: ExportIR
  attemptsDir: string
  maxAttempts: number
  targetFidelity: number
}) {
  const attempts: ExportAttemptResult[] = []
  const maxAttempts = Math.max(1, Math.min(input.maxAttempts, strategies.length))

  for (let index = 0; index < maxAttempts; index += 1) {
    const attemptNumber = index + 1
    const strategy = strategies[index] ?? strategies[0]
    const attemptDir = path.join(input.attemptsDir, `attempt-${attemptNumber}`)
    const projectDir = path.join(attemptDir, 'project')

    await mkdirp(projectDir)

    const generated = await generateNextProject({
      ir: input.ir,
      projectDir,
      strategy,
    })
    const fidelity = await compareGeneratedPreview({
      ir: input.ir,
      previewHtmlPath: generated.previewHtmlPath,
      attemptDir,
    })
    const warnings = warningsForAttempt(input.ir, fidelity)
    const rerunReason = getRerunReason(fidelity, input.targetFidelity, warnings)

    attempts.push({
      id: `attempt-${attemptNumber}`,
      attemptNumber,
      strategy,
      projectDir,
      fidelity,
      warnings,
      rerunReason,
    })

    if (!rerunReason) {
      break
    }
  }

  return attempts
}

function selectBestAttempt(attempts: ExportAttemptResult[]) {
  const best = [...attempts].sort((first, second) => second.fidelity.overall - first.fidelity.overall)[0]

  if (!best) {
    throw new Error('No export attempts were generated.')
  }

  return best
}

function warningsForAttempt(ir: ExportIR, fidelity: FidelityScores): ExportWarning[] {
  const warnings = [...ir.warnings]

  if (fidelity.overall < 90) {
    warnings.push({
      type: 'low_fidelity_score',
      severity: 'warning',
      message: `Overall fidelity is ${fidelity.overall}%, below the 90% alpha target.`,
    })
  }

  if (fidelity.mobile < fidelity.desktop - 8) {
    warnings.push({
      type: 'responsive_mismatch',
      severity: 'warning',
      message: 'Mobile fidelity is meaningfully lower than desktop fidelity.',
    })
  }

  if (fidelity.motion === 0) {
    warnings.push({
      type: 'unsupported_animation',
      severity: 'info',
      message: 'Motion is not recreated in MVP-A. Review Framer animations manually.',
    })
  }

  const weakSections = ir.component.sections.filter((section) => (section.confidence ?? 0) < 0.5)

  if (weakSections.length > 0) {
    warnings.push({
      type: 'section_extraction_low_confidence',
      severity: 'warning',
      message: `${weakSections.length} sections were extracted with low confidence and may be visually inaccurate.`,
    })
  }

  return warnings
}

function getRerunReason(fidelity: FidelityScores, targetFidelity: number, warnings: ExportWarning[]) {
  const target = targetFidelity <= 1 ? targetFidelity * 100 : targetFidelity

  if (fidelity.overall >= target && !warnings.some((warning) => warning.type === 'responsive_mismatch')) {
    return undefined
  }

  const categories = [
    fidelity.typography < target ? 'typography' : undefined,
    fidelity.layout < target ? 'layout' : undefined,
    fidelity.mobile < target ? 'mobile spacing' : undefined,
    fidelity.assets < target ? 'assets' : undefined,
    fidelity.nodeMatch < 70 ? 'section mapping' : undefined,
  ].filter(Boolean)

  return `${categories.join(', ') || 'visual'} mismatches were above threshold.`
}

function createReport(ir: ExportIR, attempts: ExportAttemptResult[], bestAttempt: ExportAttemptResult) {
  return {
    jobId: ir.jobId,
    exportType: 'component',
    sourceUrl: ir.sourceUrl,
    componentName: ir.componentName,
    createdAt: new Date().toISOString(),
    bestAttempt: bestAttempt.attemptNumber,
    visualFidelity: bestAttempt.fidelity,
    attempts: attempts.map((attempt) => ({
      attempt: attempt.attemptNumber,
      strategy: attempt.strategy,
      overall: attempt.fidelity.overall,
      desktop: attempt.fidelity.desktop,
      mobile: attempt.fidelity.mobile,
      rerunReason: attempt.rerunReason,
      selectedAsBest: attempt.id === bestAttempt.id,
      warningCount: attempt.warnings.length,
    })),
    nodeMatching: {
      matched: ir.nodeMatches.filter((match) => match.confidence >= 0.45).length,
      unmatched: ir.nodeMatches.filter((match) => match.confidence < 0.45).length,
      averageConfidence: average(ir.nodeMatches.map((match) => match.confidence)),
    },
    sections: ir.component.sections.map((section) => ({
      index: section.index,
      name: section.name,
      kind: section.kind ?? 'content',
      nodeCount: section.nodes.length,
      confidence: section.confidence ?? 0,
      flaggedLowConfidence: (section.confidence ?? 0) < 0.5,
    })),
    assets: {
      downloaded: 0,
      linked: ir.assets.length,
      failed: 0,
    },
    warnings: bestAttempt.warnings,
  }
}

function createReadme(ir: ExportIR, bestAttempt: ExportAttemptResult) {
  return `# ${ir.componentName}

Generated by Coderelay MVP-A from:

${ir.sourceUrl}

## Run locally

\`\`\`bash
npm install
npm run dev
\`\`\`

This export is a Next.js App Router project using TypeScript and CSS Modules.

## Important files

- \`app/page.tsx\`
- \`components/${ir.componentName}.tsx\`
- \`components/${ir.componentName}.module.css\`
- \`export-report.json\`
- \`AGENT_BRIEF.md\`

## Fidelity

- Best attempt: ${bestAttempt.attemptNumber} (${bestAttempt.strategy})
- Overall: ${bestAttempt.fidelity.overall}%
- Desktop: ${bestAttempt.fidelity.desktop}%
- Mobile: ${bestAttempt.fidelity.mobile}%

Review \`export-report.json\` before editing.
`
}

function createAgentBrief(ir: ExportIR, bestAttempt: ExportAttemptResult) {
  return `# Agent Brief

This code was exported from a Framer design. Preserve visual fidelity unless instructed otherwise.

## Main files

- Component: \`components/${ir.componentName}.tsx\`
- Styles: \`components/${ir.componentName}.module.css\`
- Report: \`export-report.json\`

## Guidance

- Start by reading \`export-report.json\`.
- Keep spacing, typography, and responsive behavior close to the original.
- Reconnect forms, analytics, custom embeds, and advanced motion manually if needed.
- This MVP-A export links remote assets instead of bundling them.
- Best attempt was ${bestAttempt.attemptNumber} using \`${bestAttempt.strategy}\`.
`
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0
  }

  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(3))
}
