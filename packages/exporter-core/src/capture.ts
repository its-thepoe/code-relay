import { mkdirp } from 'fs-extra'
import { chromium, type Browser, type ElementHandle, type Page } from 'playwright'
import path from 'node:path'
import { PNG } from 'pngjs'
import fs from 'node:fs/promises'
import type { PluginCanvasCapture, Rect, RuntimeCapture, RuntimeNode, ViewportName } from '../../shared/src/types.js'

type CaptureInput = {
  url: string
  workDir: string
  selector?: string
}

const viewports: Record<ViewportName, { width: number; height: number }> = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
}

export async function captureRuntime(input: CaptureInput): Promise<RuntimeCapture> {
  const captureDir = path.join(input.workDir, 'original')
  await mkdirp(captureDir)

  const browser = await chromium.launch({ headless: true })

  try {
    const desktop = await captureViewport(browser, input, 'desktop', captureDir)
    const mobile = await captureViewport(browser, input, 'mobile', captureDir)

    return {
      url: input.url,
      title: desktop.title,
      mode: input.selector ? 'section' : 'page',
      viewports: {
        desktop: desktop.viewport,
        mobile: mobile.viewport,
      },
      nodes: desktop.nodes,
    }
  } finally {
    await browser.close()
  }
}

export function createSimulatedPluginCapture(nodes: RuntimeNode[]): PluginCanvasCapture {
  const selectedNodes = nodes
    .filter((node) => node.rect.width > 0 && node.rect.height > 0)
    .slice(0, 80)
    .map((node) => ({
      id: node.id,
      name: node.text ? node.text.slice(0, 48) : node.tag,
      type: node.tag,
      text: node.text,
      bounds: node.rect,
      metadata: {
        domPath: node.domPath,
        src: node.attributes.src,
        href: node.attributes.href,
      },
    }))

  return {
    mode: 'simulated',
    selectedNodes,
    capturedAt: new Date().toISOString(),
  }
}

async function captureViewport(
  browser: Browser,
  input: CaptureInput,
  viewportName: ViewportName,
  captureDir: string
) {
  const viewport = viewports[viewportName]
  const page = await browser.newPage({ viewport })

  await page.goto(input.url, { waitUntil: 'networkidle', timeout: 60_000 })
  await page.emulateMedia({ reducedMotion: 'reduce' })

  const screenshotPath = path.join(captureDir, `${viewportName}.png`)

  if (input.selector) {
    const rootHandle = await resolveRootHandle(page, input.selector)
    const clip = await getClip(rootHandle, viewport)

    await page.screenshot({
      path: screenshotPath,
      clip,
      animations: 'disabled',
    })

    await rootHandle.dispose()
  } else {
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
      animations: 'disabled',
    })
  }

  const nodes = await extractNodes(page, input.selector)
  const title = await page.title()
  const imageSize = await getPngSize(screenshotPath)
  await page.close()

  return {
    title,
    nodes,
    viewport: {
      screenshotPath,
      width: imageSize.width,
      height: imageSize.height,
    },
  }
}

async function resolveRootHandle(page: Page, selector?: string) {
  if (selector) {
    const selected = await page.$(selector)

    if (!selected) {
      throw new Error(`No element found for selector: ${selector}`)
    }

    return selected
  }

  const handle = await page.evaluateHandle(`() => {
    const candidates = Array.from(document.querySelectorAll('section, main, header, footer, [data-framer-name]'))
      .filter((element) => {
        const rect = element.getBoundingClientRect()
        return rect.width > 120 && rect.height > 80
      })
      .sort((first, second) => {
        const firstRect = first.getBoundingClientRect()
        const secondRect = second.getBoundingClientRect()
        return secondRect.width * secondRect.height - firstRect.width * firstRect.height
      })

    return candidates[0] ?? document.body
  }`)

  return handle.asElement() ?? (await page.$('body'))!
}

async function getClip(rootHandle: ElementHandle<Element>, viewport: { width: number; height: number }) {
  const box = await rootHandle.boundingBox()

  if (!box) {
    return {
      x: 0,
      y: 0,
      width: viewport.width,
      height: viewport.height,
    }
  }

  return {
    x: Math.max(0, box.x),
    y: Math.max(0, box.y),
    width: Math.min(viewport.width, Math.max(1, box.width)),
    height: Math.min(2400, Math.max(1, box.height)),
  }
}

async function extractNodes(page: Page, selector?: string): Promise<RuntimeNode[]> {
  const rootSelector = JSON.stringify(selector ?? null)

  return page.evaluate(`(() => {
    const rootSelector = ${rootSelector}
    const root = rootSelector ? document.querySelector(rootSelector) : document.body
    const base = root ?? document.body

    const pathFor = (element) => {
      const parts = []
      let current = element

      while (current && current !== document.documentElement) {
        const parent = current.parentElement
        const index = parent ? Array.from(parent.children).indexOf(current) + 1 : 1
        parts.unshift(current.tagName.toLowerCase() + ':nth-child(' + index + ')')
        current = parent
      }

      return parts.join(' > ')
    }

    const sectionElements = Array.from(base.querySelectorAll('section, header, main, footer, [data-framer-name]'))
      .filter((element) => {
        const rect = element.getBoundingClientRect()
        return rect.width > 120 && rect.height > 80
      })

    const sectionFor = (element) => {
      const section = sectionElements.find((candidate) => candidate === element || candidate.contains(element))

      if (!section) {
        return {
          index: 0,
          name: 'Page',
        }
      }

      return {
        index: sectionElements.indexOf(section),
        name: section.getAttribute('data-framer-name') || section.getAttribute('aria-label') || section.tagName.toLowerCase(),
      }
    }

    return Array.from(base.querySelectorAll('*'))
      .map((element, index) => {
        const rect = element.getBoundingClientRect()
        const styles = window.getComputedStyle(element)
        const section = sectionFor(element)

        return {
          id: element.id || 'node-' + (index + 1),
          tag: element.tagName.toLowerCase(),
          domPath: pathFor(element),
          text: element.textContent?.trim().replace(/\\s+/g, ' ').slice(0, 500) || undefined,
          sectionIndex: section.index,
          sectionName: section.name,
          rect: {
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          },
          attributes: {
            src: element.currentSrc || element.src || undefined,
            href: element.href || undefined,
            alt: element.alt || undefined,
            role: element.getAttribute('role') || undefined,
          },
          styles: {
            display: styles.display,
            position: styles.position,
            fontSize: styles.fontSize,
            fontFamily: styles.fontFamily,
            fontWeight: styles.fontWeight,
            lineHeight: styles.lineHeight,
            letterSpacing: styles.letterSpacing,
            color: styles.color,
            backgroundColor: styles.backgroundColor,
            borderRadius: styles.borderRadius,
            boxShadow: styles.boxShadow,
            transform: styles.transform,
            opacity: styles.opacity,
            padding: styles.padding,
            margin: styles.margin,
            gap: styles.gap,
            objectFit: styles.objectFit,
            objectPosition: styles.objectPosition,
          },
        }
      })
      .filter((node) => node.rect.width > 0 && node.rect.height > 0)
  })()`)
}

async function getPngSize(filePath: string) {
  const png = PNG.sync.read(await fs.readFile(filePath))

  return {
    width: png.width,
    height: png.height,
  }
}
