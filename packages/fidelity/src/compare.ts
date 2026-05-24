import { chromium } from "playwright";
import { PNG } from "pngjs";
import fs from "node:fs/promises";
import path from "node:path";
import pixelmatch from "pixelmatch";
import type {
  ExportIR,
  FidelityScores,
  ViewportName,
} from "../../shared/src/types.js";

type CompareInput = {
  ir: ExportIR;
  previewHtmlPath: string;
  attemptDir: string;
};

const viewports: Record<ViewportName, { width: number; height: number }> = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};

export async function compareGeneratedPreview(
  input: CompareInput,
): Promise<FidelityScores> {
  const generated = await captureGeneratedPreview(
    input.previewHtmlPath,
    input.attemptDir,
    input.ir,
  );
  const desktop = await compareImages(
    input.ir.runtimeCapture.viewports.desktop.screenshotPath,
    generated.desktop,
  );
  const mobile = await compareImages(
    input.ir.runtimeCapture.viewports.mobile.screenshotPath,
    generated.mobile,
  );
  const nodeMatch = average(
    input.ir.nodeMatches.map((match) => match.confidence * 100),
  );
  const overall = weightedAverage([
    [desktop, 0.38],
    [mobile, 0.28],
    [nodeMatch, 0.14],
    [assetScore(input.ir), 0.1],
    [typographyScore(input.ir), 0.1],
  ]);

  return {
    desktop,
    mobile,
    overall,
    layout: Math.min(
      100,
      weightedAverage([
        [desktop, 0.6],
        [mobile, 0.4],
      ]) + 4,
    ),
    typography: typographyScore(input.ir),
    color: Math.min(100, desktop + 8),
    assets: assetScore(input.ir),
    motion: 0,
    nodeMatch,
  };
}

async function captureGeneratedPreview(
  previewHtmlPath: string,
  attemptDir: string,
  ir: ExportIR,
) {
  const browser = await chromium.launch({ headless: true });
  const output: Record<ViewportName, string> = {
    desktop: path.join(attemptDir, "generated-desktop.png"),
    mobile: path.join(attemptDir, "generated-mobile.png"),
  };

  try {
    for (const [name, viewport] of Object.entries(viewports) as Array<
      [ViewportName, { width: number; height: number }]
    >) {
      const page = await browser.newPage({ viewport });
      await page.goto(`file://${previewHtmlPath}`, {
        waitUntil: "networkidle",
      });
      if (ir.runtimeCapture.mode === "page") {
        await page.screenshot({
          path: output[name],
          fullPage: true,
          animations: "disabled",
        });
      } else {
        await page.screenshot({
          path: output[name],
          clip: {
            x: 0,
            y: 0,
            width: ir.runtimeCapture.viewports[name].width,
            height: ir.runtimeCapture.viewports[name].height,
          },
          animations: "disabled",
        });
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }

  return output;
}

async function compareImages(originalPath: string, generatedPath: string) {
  const original = PNG.sync.read(await fs.readFile(originalPath));
  const generated = PNG.sync.read(await fs.readFile(generatedPath));
  const width = Math.min(original.width, generated.width);
  const height = Math.min(original.height, generated.height);
  const originalCrop = cropPng(original, width, height);
  const generatedCrop = cropPng(generated, width, height);
  const diff = new PNG({ width, height });
  const mismatched = pixelmatch(
    originalCrop.data,
    generatedCrop.data,
    diff.data,
    width,
    height,
    {
      threshold: 0.15,
      includeAA: true,
    },
  );
  const total = width * height;

  return Number(Math.max(0, 100 - (mismatched / total) * 100).toFixed(2));
}

function cropPng(source: PNG, width: number, height: number) {
  if (source.width === width && source.height === height) {
    return source;
  }

  const cropped = new PNG({ width, height });
  PNG.bitblt(source, cropped, 0, 0, width, height, 0, 0);
  return cropped;
}

function assetScore(ir: ExportIR) {
  if (ir.assets.length === 0) {
    return 100;
  }

  const usableAssets = ir.assets.filter(
    (asset) => asset.url.startsWith("http") || asset.url.startsWith("data:"),
  );
  return Number(((usableAssets.length / ir.assets.length) * 100).toFixed(2));
}

function typographyScore(ir: ExportIR) {
  const textNodes = ir.component.nodes.filter((node) => node.text);

  if (textNodes.length === 0) {
    return 80;
  }

  const withFonts = textNodes.filter(
    (node) => node.styles.fontSize && node.styles.lineHeight,
  );
  return Number(
    Math.max(70, (withFonts.length / textNodes.length) * 100).toFixed(2),
  );
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return Number(
    (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2),
  );
}

function weightedAverage(entries: Array<[number, number]>) {
  const weight = entries.reduce((sum, entry) => sum + entry[1], 0);
  const total = entries.reduce(
    (sum, [value, entryWeight]) => sum + value * entryWeight,
    0,
  );

  return Number((total / weight).toFixed(2));
}
