import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { chromium, type Browser } from "playwright";
import { runLocalExport } from "../packages/exporter-core/src/local-export.js";
import { resolveExportRouteMetadata } from "../packages/shared/src/route-contract.js";

type FixtureManifest = {
  fixtures: Array<{
    id: string;
    label: string;
    url: string;
    surface: string;
  }>;
};

type Args = {
  fixtureId?: string;
  url?: string;
  outDir?: string;
  pluginPayloadPath?: string;
  routeManifestPath?: string;
  freshRuns: number;
  cachedRuns: number;
  expectedMinRoutes: number;
  maxRoutes: number;
};

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const manifest = JSON.parse(
    await fs.readFile(
      path.join(process.cwd(), "benchmarks", "framer-fixtures", "manifest.json"),
      "utf8",
    ),
  ) as FixtureManifest;
  const fixture = resolveFixture(manifest.fixtures, args);
  const outputRoot =
    args.outDir ??
    (await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-portfolio-proof-")));
  await fs.mkdir(outputRoot, { recursive: true });

  const routeManifest = args.routeManifestPath
    ? JSON.parse(await fs.readFile(args.routeManifestPath, "utf8"))
    : null;
  let browser: Browser | null = null;
  try {
    const pluginCapture =
      args.pluginPayloadPath && Array.isArray(routeManifest)
        ? createFullSitePluginCaptureFromInputs({
            payload: JSON.parse(await fs.readFile(args.pluginPayloadPath, "utf8")),
            routeManifest,
          })
        : Array.isArray(routeManifest)
          ? createFullSitePluginCaptureFromRouteManifest(routeManifest)
          : args.pluginPayloadPath
            ? JSON.parse(await fs.readFile(args.pluginPayloadPath, "utf8"))
            : createSimulatedFullSitePluginCapture(
                await discoverRoutes(fixture.url, args.maxRoutes, {
                  getBrowser: async () => {
                    browser ??= await chromium.launch({ headless: true });
                    return browser;
                  },
                }),
              );
    const knownRoutes = readKnownRoutes(pluginCapture);
    if (knownRoutes.length < args.expectedMinRoutes) {
      throw new Error(
        `Resolved only ${knownRoutes.length} routes for ${fixture.id}; expected at least ${args.expectedMinRoutes}.`,
      );
    }
    const summary = {
      fixture,
      discoveredRouteCount: knownRoutes.length,
      discoveredRoutes: knownRoutes,
      freshRuns: [] as Array<Awaited<ReturnType<typeof executeExportRun>>>,
      cachedWarmup: null as Awaited<ReturnType<typeof executeExportRun>> | null,
      cachedRuns: [] as Array<Awaited<ReturnType<typeof executeExportRun>>>,
    };

    for (let index = 0; index < args.freshRuns; index += 1) {
      const run = await executeExportRun({
        label: `fresh-${index + 1}`,
        outDir: path.join(outputRoot, "fresh", `run-${index + 1}`),
        url: fixture.url,
        pluginCapture,
        expectedMinRoutes: args.expectedMinRoutes,
        expectCacheHit: false,
      });
      summary.freshRuns.push(run);
    }

    if (args.cachedRuns > 0) {
      const cachedOutDir = path.join(outputRoot, "cached-shared");
      summary.cachedWarmup = await executeExportRun({
        label: "cached-warmup",
        outDir: cachedOutDir,
        url: fixture.url,
        pluginCapture,
        expectedMinRoutes: args.expectedMinRoutes,
        expectCacheHit: false,
      });

      for (let index = 0; index < args.cachedRuns; index += 1) {
        const run = await executeExportRun({
          label: `cached-${index + 1}`,
          outDir: cachedOutDir,
          url: fixture.url,
          pluginCapture,
          expectedMinRoutes: args.expectedMinRoutes,
          expectCacheHit: true,
        });
        summary.cachedRuns.push(run);
      }
    }

    const summaryPath = path.join(outputRoot, "portfolio-repeat-proof.json");
    await fs.writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`);
    console.log(summaryPath);
  } finally {
    await browser?.close();
  }
}

function parseArgs(argv: string[]): Args {
  const args: Args = {
    freshRuns: 3,
    cachedRuns: 3,
    expectedMinRoutes: 20,
    maxRoutes: 64,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];
    if (arg === "--fixture" && next) {
      args.fixtureId = next;
      index += 1;
    } else if (arg === "--url" && next) {
      args.url = next;
      index += 1;
    } else if (arg === "--out-dir" && next) {
      args.outDir = path.resolve(next);
      index += 1;
    } else if (arg === "--plugin-payload" && next) {
      args.pluginPayloadPath = path.resolve(next);
      index += 1;
    } else if (arg === "--route-manifest" && next) {
      args.routeManifestPath = path.resolve(next);
      index += 1;
    } else if (arg === "--fresh-runs" && next) {
      args.freshRuns = Number(next);
      index += 1;
    } else if (arg === "--cached-runs" && next) {
      args.cachedRuns = Number(next);
      index += 1;
    } else if (arg === "--expected-min-routes" && next) {
      args.expectedMinRoutes = Number(next);
      index += 1;
    } else if (arg === "--max-routes" && next) {
      args.maxRoutes = Number(next);
      index += 1;
    }
  }
  if (!args.fixtureId && !args.url) {
    throw new Error("Pass --fixture <id> or --url <published-framer-url>.");
  }
  return args;
}

function resolveFixture(fixtures: FixtureManifest["fixtures"], args: Args) {
  if (args.url) {
    return {
      id: args.fixtureId ?? "ad-hoc-fixture",
      label: args.fixtureId ?? args.url,
      url: args.url,
    };
  }
  const fixture = fixtures.find((entry) => entry.id === args.fixtureId);
  if (!fixture) throw new Error(`Fixture not found: ${args.fixtureId}`);
  return fixture;
}

async function discoverRoutes(
  originUrl: string,
  maxRoutes: number,
  input: {
    getBrowser: () => Promise<Browser>;
  },
) {
  const root = new URL(originUrl);
  const queue = [normalizeRoutePath(`${root.pathname}${root.search}${root.hash}`)];
  const discovered = new Set<string>();

  while (queue.length > 0 && discovered.size < maxRoutes) {
    const routePath = queue.shift()!;
    if (discovered.has(routePath)) continue;
    discovered.add(routePath);
    const url = new URL(routePath, root).toString();
    const staticRoutes = await fetchRouteHtml(url)
      .then((html) => extractInternalRoutes(html, root))
      .catch(() => []);
    const renderedRoutes = await fetchRenderedInternalRoutes(url, root, input.getBrowser).catch(
      () => [],
    );
    for (const nextRoute of [...staticRoutes, ...renderedRoutes]) {
      if (!discovered.has(nextRoute) && !queue.includes(nextRoute)) {
        queue.push(nextRoute);
      }
    }
  }

  return Array.from(discovered).sort(routePathSort);
}

async function fetchRouteHtml(url: string) {
  const response = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(30_000),
    headers: { "user-agent": "CoderelayPortfolioProof/1.0" },
  });
  if (!response.ok) {
    throw new Error(`Route discovery failed for ${url}: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

function extractInternalRoutes(html: string, root: URL) {
  const routes = new Set<string>();
  for (const match of html.matchAll(/href=["']([^"'#]+(?:#[^"']*)?)["']/g)) {
    const href = match[1]?.trim();
    if (!href) continue;
    if (href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    if (/\.(png|jpe?g|gif|webp|svg|ico|css|js|json|woff2?|ttf|otf|mp4|webm|mp3|pdf)(\?|#|$)/i.test(href)) {
      continue;
    }
    try {
      const resolved = new URL(href, root);
      if (resolved.origin !== root.origin) continue;
      routes.add(normalizeRoutePath(`${resolved.pathname}${resolved.search}`));
    } catch {
      continue;
    }
  }
  return routes;
}

async function fetchRenderedInternalRoutes(
  url: string,
  root: URL,
  getBrowser: () => Promise<Browser>,
) {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => undefined);
    const hrefs = await page.locator("a[href]").evaluateAll((anchors) =>
      anchors
        .map((anchor) => anchor.getAttribute("href")?.trim() ?? "")
        .filter(Boolean),
    );
    return extractInternalRoutesFromHrefs(hrefs, root);
  } finally {
    await page.close();
  }
}

function extractInternalRoutesFromHrefs(hrefs: string[], root: URL) {
  const routes = new Set<string>();
  for (const href of hrefs) {
    if (!href) continue;
    if (href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    if (/\.(png|jpe?g|gif|webp|svg|ico|css|js|json|woff2?|ttf|otf|mp4|webm|mp3|pdf)(\?|#|$)/i.test(href)) {
      continue;
    }
    try {
      const resolved = new URL(href, root);
      if (resolved.origin !== root.origin) continue;
      routes.add(normalizeRoutePath(`${resolved.pathname}${resolved.search}`));
    } catch {
      continue;
    }
  }
  return routes;
}

function createSimulatedFullSitePluginCapture(routes: string[]) {
  return {
    mode: "simulated" as const,
    capturedAt: new Date().toISOString(),
    selectedNodes: [],
    context: {
      exportMode: "full-site" as const,
      captureMode: "runtime-first" as const,
      sitePages: routes.map((routePath) => ({
        name: routePath === "/" ? "Home" : routePath.split("/").filter(Boolean).join(" / "),
        path: routePath,
      })),
    },
  };
}

function createFullSitePluginCaptureFromInputs(input: {
  payload: any;
  routeManifest: Array<any> | null;
}) {
  if (!Array.isArray(input.routeManifest)) return input.payload;
  const sitePages = input.routeManifest.map((route) => {
    const routeMetadata = resolveManifestRouteMetadata(route);
    const page: Record<string, unknown> = {
      name:
        typeof route.title === "string" && route.title.trim()
          ? route.title.trim()
          : typeof route.path === "string"
            ? route.path
            : "Route",
      path: route.path,
    };
    if (routeMetadata.routeKind === "redirect") {
      page.destination = routeMetadata.destination;
      page.redirectTo = routeMetadata.redirectTo;
      page.redirectStatus = routeMetadata.redirectStatus;
    }
    if (typeof route.collectionId === "string") {
      page.collectionId = route.collectionId;
    }
    return page;
  });
  return {
    ...input.payload,
    context: {
      ...(input.payload?.context ?? {}),
      exportMode: "full-site",
      captureMode: "runtime-first",
      sitePages,
    },
  };
}

function createFullSitePluginCaptureFromRouteManifest(routeManifest: Array<any>) {
  return {
    mode: "simulated" as const,
    capturedAt: new Date().toISOString(),
    selectedNodes: [],
    context: {
      exportMode: "full-site" as const,
      captureMode: "runtime-first" as const,
      sitePages: routeManifest.map((route) => {
        const routeMetadata = resolveManifestRouteMetadata(route);
        const page: Record<string, unknown> = {
          name:
            typeof route?.title === "string" && route.title.trim()
              ? route.title.trim()
              : typeof route?.componentName === "string" && route.componentName.trim()
                ? route.componentName.trim()
                : typeof route?.path === "string"
                  ? route.path
                  : "Route",
          path: route?.path,
        };
        if (typeof route?.templateId === "string") {
          page.templateId = route.templateId;
        }
        if (typeof route?.templatePath === "string") {
          page.templatePath = route.templatePath;
        }
        if (typeof route?.templateKind === "string") {
          page.templateKind = route.templateKind;
        }
        if (typeof route?.collectionId === "string") {
          page.collectionId = route.collectionId;
        }
        if (routeMetadata.routeKind === "redirect") {
          page.destination = routeMetadata.destination;
          page.redirectTo = routeMetadata.redirectTo;
          page.redirectStatus = routeMetadata.redirectStatus;
        }
        return page;
      }),
    },
  };
}

function readKnownRoutes(pluginCapture: any) {
  const sitePages = Array.isArray(pluginCapture?.context?.sitePages)
    ? pluginCapture.context.sitePages
    : [];
  const routes = new Set<string>();
  for (const page of sitePages) {
    if (typeof page?.path === "string" && page.path.trim()) {
      routes.add(normalizeRoutePath(page.path));
    }
  }
  return Array.from(routes).sort(routePathSort);
}

function resolveManifestRouteMetadata(route: any) {
  return resolveExportRouteMetadata({
    routeKind:
      route?.kind === "redirect" || route?.routeKind === "redirect"
        ? "redirect"
        : route?.kind === "page" || route?.routeKind === "page"
          ? "page"
          : undefined,
    destination: typeof route?.destination === "string" ? route.destination : undefined,
    destinationKind:
      route?.destinationKind === "internal" || route?.destinationKind === "external"
        ? route.destinationKind
        : undefined,
    redirectTo: typeof route?.redirectTo === "string" ? route.redirectTo : undefined,
    redirectStatus:
      typeof route?.redirectStatus === "number" ? route.redirectStatus : undefined,
    templateKind: typeof route?.templateKind === "string" ? route.templateKind : undefined,
  });
}

async function executeExportRun(input: {
  label: string;
  outDir: string;
  url: string;
  pluginCapture: ReturnType<typeof createSimulatedFullSitePluginCapture>;
  expectedMinRoutes: number;
  expectCacheHit: boolean;
}) {
  let lastProgressSignature = "";
  const result = await runLocalExport({
    outDir: input.outDir,
    url: input.url,
    exportMode: "full-site",
    pluginCapture: input.pluginCapture,
    maxAttempts: 1,
    targetFidelity: 0.9,
    onProgress: async (progress) => {
      const signature = JSON.stringify({
        stage: progress.stage,
        completed: progress.completed ?? null,
        total: progress.total ?? null,
        routePath: progress.routePath ?? null,
        failed: progress.failed ?? null,
      });
      if (signature === lastProgressSignature) return;
      lastProgressSignature = signature;
      console.log(
        `[portfolio-proof:${input.label}]`,
        JSON.stringify({
          stage: progress.stage,
          completed: progress.completed ?? null,
          total: progress.total ?? null,
          routePath: progress.routePath ?? null,
          failed: progress.failed ?? null,
        }),
      );
    },
  });

  if (result.revisionCacheHit !== input.expectCacheHit) {
    throw new Error(
      `${input.label}: revisionCacheHit=${result.revisionCacheHit} expected ${input.expectCacheHit}.`,
    );
  }
  if (!result.validation.packagedArchive?.verified) {
    throw new Error(`${input.label}: packaged archive was not verified.`);
  }
  if (result.validation.externalRequests.length > 0) {
    throw new Error(
      `${input.label}: external runtime requests were recorded.\n${result.validation.externalRequests.join("\n")}`,
    );
  }
  if (result.validation.failedRequests.length > 0) {
    throw new Error(
      `${input.label}: failed runtime requests were recorded.\n${JSON.stringify(result.validation.failedRequests, null, 2)}`,
    );
  }
  if (result.validation.routes.length < input.expectedMinRoutes) {
    throw new Error(
      `${input.label}: expected at least ${input.expectedMinRoutes} routes, found ${result.validation.routes.length}.`,
    );
  }

  const routeKinds = result.validation.routes.reduce<Record<string, number>>(
    (counts, route) => {
      const key = resolveManifestRouteMetadata(route).routeKind;
      counts[key] = (counts[key] ?? 0) + 1;
      return counts;
    },
    {},
  );
  const renderedRoutes = result.validation.routes.filter(
    (route) => resolveManifestRouteMetadata(route).routeKind !== "redirect",
  );
  const redirectRoutes = result.validation.routes.filter(
    (route) => resolveManifestRouteMetadata(route).routeKind === "redirect",
  );

  return {
    label: input.label,
    exportDir: result.exportDir,
    revisionCacheHit: result.revisionCacheHit,
    routeCount: result.validation.routes.length,
    renderedRouteCount: renderedRoutes.length,
    redirectRouteCount: redirectRoutes.length,
    routeKinds,
    renderedViewportChecks: renderedRoutes.reduce(
      (sum, route) => sum + route.viewportChecks.length,
      0,
    ),
    packagedArchive: result.validation.packagedArchive,
    runtimeLocalization: result.validation.runtimeLocalization,
  };
}

function normalizeRoutePath(routePath: string) {
  if (!routePath || routePath === "/") return "/";
  const [pathnameRaw, search = ""] = routePath.split("?", 2);
  const pathname = pathnameRaw.replace(/\/+$/, "") || "/";
  const next = pathname + (search ? `?${search}` : "");
  return next.startsWith("/") ? next : `/${next}`;
}

function routePathSort(left: string, right: string) {
  if (left === "/") return -1;
  if (right === "/") return 1;
  return left.localeCompare(right);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exit(1);
});
