import crypto from "node:crypto";
import {
  chromium,
  type Browser,
  type BrowserContext,
  type ElementHandle,
  type Locator,
  type Page,
  type Route,
} from "playwright";
import path from "node:path";
import { PNG } from "pngjs";
import fs from "node:fs/promises";
import type {
  ExportRouteDestinationKind,
  ExportRouteKind,
  ExportRouteTemplate,
  PluginCanvasCapture,
  Rect,
  RuntimeCapture,
  RuntimeInteractionReplayRecord,
  RuntimeNode,
  RuntimeRouteCapture,
  RouteCaptureEvidenceClass,
  RouteCapturePhaseName,
  RouteCapturePhaseRecord,
  RouteCapturePhaseStatus,
  RouteCaptureProgressSummary,
  ViewportName,
} from "../../shared/src/types.js";
import { resolveExportRouteMetadata } from "../../shared/src/route-contract.js";

type CaptureInput = {
  url: string;
  workDir: string;
  selector?: string;
  routePath?: string;
  route?: {
    routeKind?: ExportRouteKind;
    templateKind?: RuntimeRouteCapture["templateKind"];
    destination?: string;
    destinationKind?: ExportRouteDestinationKind;
    redirectTo?: string;
  };
  viewportNames?: ViewportName[];
  baseCapture?: RuntimeCapture | RuntimeRouteCapture;
  interactionReplayTimeoutMs?: number;
};

type RouteCaptureInput = {
  originUrl: string;
  routes: Array<{
    path: string;
    title?: string;
    templateId?: string;
    templatePath?: string;
    routeKind?: ExportRouteKind;
    template?: ExportRouteTemplate;
    templateKind?: "static" | "cms" | "component" | "redirect" | "utility";
    destination?: string;
    destinationKind?: ExportRouteDestinationKind;
    redirectTo?: string;
    redirectStatus?: number;
  }>;
  workDir: string;
  cacheDir?: string;
  viewportNames?: ViewportName[];
  baseCapturesByRoute?: Record<string, RuntimeRouteCapture | undefined>;
  freshRoutePaths?: string[];
  interactionReplayTimeoutMs?: number;
  onProgress?: (progress: {
    completed: number;
    total: number;
    routePath: string;
    failed: number;
  }) => void | Promise<void>;
};

type CapturedRedirect = {
  redirectTo: string;
  templateKind: "redirect" | "utility";
};

type RouteCaptureProgressArtifact = {
  schemaVersion: number;
  sourceUrl: string;
  compatibilityKey?: string;
  routePath: string;
  routeTitle?: string;
  templateId?: string;
  templatePath?: string;
  routeKind?: ExportRouteKind;
  template?: ExportRouteTemplate;
  templateKind?: RuntimeRouteCapture["templateKind"];
  destination?: string;
  destinationKind?: ExportRouteDestinationKind;
  status: "partial" | "complete" | "failed";
  phases: RouteCapturePhaseRecord[];
  capturedViewports: ViewportName[];
  evidenceClasses: RouteCaptureEvidenceClass[];
  warnings: string[];
  reusedFromCache?: boolean;
  reusedFromProgress?: boolean;
  failedPhase?: RouteCapturePhaseName;
  failureReason?: string;
  capture?: RuntimeRouteCapture;
  createdAt: string;
  updatedAt: string;
};

const INTERACTION_REPLAY_TIMEOUT_MS = 20_000;
const INTERACTION_STYLE_COLLECTION_TIMEOUT_MS = 5_000;
const ROUTE_CAPTURE_CACHE_SCHEMA_VERSION = 7;
const ROUTE_PROGRESS_SCHEMA_VERSION = 3;
const ROUTE_TRANSIENT_RETRY_LIMIT = 3;
const NETWORK_UNAVAILABLE_CONFIRMATION_THRESHOLD = 3;
const NETWORK_AVAILABILITY_PROBE_TIMEOUT_MS = 5_000;
const ROUTE_PHASE_BUDGETS_MS: Record<RouteCapturePhaseName, number> = {
  navigate: 30_000,
  stabilize: 45_000,
  "capture-desktop": 75_000,
  "capture-laptop": 60_000,
  "capture-tablet": 60_000,
  "capture-mobile": 60_000,
  "extract-dom": 20_000,
  "extract-stylesheets": 20_000,
  "interaction-replay": 12_000,
  "route-finalize": 15_000,
};
const INTERACTION_REPLAY_MIN_RESET_BUDGET_MS = 500;

let captureFailureTestMode: "normal" | "fail-after-tablet-progress" = "normal";
let viewportDriftTestMode:
  | "normal"
  | "force-single-post-screenshot-mismatch"
  | "force-persistent-post-screenshot-mismatch" = "normal";
let viewportDriftInjected = false;
let forcedNavigateNetworkFailureRoutePaths = new Set<string>();
let interactionStyleCollectionTestMode: "normal" | "slow" = "normal";

export function __setCaptureFailureTestMode(
  mode: "normal" | "fail-after-tablet-progress",
) {
  captureFailureTestMode = mode;
}

export function __setViewportDriftTestMode(
  mode:
    | "normal"
    | "force-single-post-screenshot-mismatch"
    | "force-persistent-post-screenshot-mismatch",
) {
  viewportDriftTestMode = mode;
  viewportDriftInjected = false;
}

export function __setForcedNavigateNetworkFailureRoutePaths(
  routePaths: string[],
) {
  forcedNavigateNetworkFailureRoutePaths = new Set(
    routePaths.map((routePath) => normalizeRoutePath(routePath)),
  );
}

export function __setInteractionStyleCollectionTestMode(
  mode: "normal" | "slow",
) {
  interactionStyleCollectionTestMode = mode;
}

class RouteCapturePhaseError extends Error {
  constructor(
    message: string,
    public routePath: string,
    public phase: RouteCapturePhaseName,
    public required: boolean,
    public progress?: RouteCaptureProgressArtifact,
  ) {
    super(message);
    this.name = "RouteCapturePhaseError";
  }
}

function routeStateDirectory(rootDir: string, routePath: string) {
  return path.join(rootDir, routeDirectoryName(routePath));
}

function routeProgressPath(rootDir: string, routePath: string) {
  return path.join(routeStateDirectory(rootDir, routePath), "route-progress.json");
}

function routeCacheArtifactPath(rootDir: string, routePath: string) {
  return path.join(routeStateDirectory(rootDir, routePath), "route-cache.json");
}

function routeLegacyCachePath(cacheDir: string, routePath: string) {
  return path.join(cacheDir, `${routeDirectoryName(routePath)}.json`);
}

function createRouteCaptureCompatibilityKey(input: {
  sourceUrl: string;
  routePath: string;
  viewportNames: ViewportName[];
  templateId?: string;
  templatePath?: string;
  routeKind?: ExportRouteKind;
  template?: ExportRouteTemplate;
  templateKind?: RouteCaptureInput["routes"][number]["templateKind"];
  destination?: string;
  destinationKind?: ExportRouteDestinationKind;
  redirectTo?: string;
  redirectStatus?: number;
  interactionReplayTimeoutMs?: number;
}) {
  return JSON.stringify({
    sourceUrl: input.sourceUrl,
    routePath: normalizeRoutePath(input.routePath),
    viewportNames: [...input.viewportNames],
    templateId: input.templateId ?? null,
    templatePath: input.templatePath ?? null,
    routeKind: input.routeKind ?? null,
    template: input.template ?? null,
    templateKind: input.templateKind ?? null,
    destination: input.destination ?? null,
    destinationKind: input.destinationKind ?? null,
    redirectTo: input.redirectTo ?? null,
    redirectStatus: input.redirectStatus ?? null,
    interactionReplayTimeoutMs: input.interactionReplayTimeoutMs ?? INTERACTION_REPLAY_TIMEOUT_MS,
  });
}

async function writeJsonFileAtomic(filePath: string, value: unknown) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(tempPath, `${JSON.stringify(value, null, 2)}\n`);
  await fs.rename(tempPath, filePath);
}

function toRouteProgressSummary(
  routePath: string,
  capture: RuntimeRouteCapture,
  input: {
    status: RouteCaptureProgressSummary["status"];
    warningCount?: number;
    failedPhase?: RouteCapturePhaseName;
    failedReason?: string;
    reusedFromCache?: boolean;
    reusedFromProgress?: boolean;
  },
): RouteCaptureProgressSummary {
  return {
    routePath,
    status: input.status,
    evidenceClasses: summarizeRouteEvidenceClasses(capture),
    capturedViewports: (capture.captureDiagnostics?.breakpointsCaptured ?? []) as ViewportName[],
    warningCount: input.warningCount ?? 0,
    failedPhase: input.failedPhase,
    failedReason: input.failedReason,
    reusedFromCache: input.reusedFromCache,
    reusedFromProgress: input.reusedFromProgress,
  };
}

function summarizeRouteEvidenceClasses(capture: RuntimeRouteCapture) {
  const evidence = new Set<RouteCaptureEvidenceClass>();
  if (capture.redirectTo) {
    evidence.add("redirect-backed");
  }
  const breakpoints = capture.captureDiagnostics?.breakpointsCaptured ?? [];
  const validations = capture.captureDiagnostics?.viewportValidation ?? {};
  if (
    breakpoints.length > 0 &&
    breakpoints.every((viewportName) => validations[viewportName]?.valid)
  ) {
    evidence.add("screenshot-backed");
  } else if (breakpoints.length > 0) {
    evidence.add("heuristic-backed");
  }
  if ((capture.nodes?.length ?? 0) > 0) {
    evidence.add("dom-backed");
  }
  if ((capture.interactionReplay?.length ?? 0) > 0) {
    evidence.add("replay-backed");
  }
  if (evidence.size === 0) {
    evidence.add("invalid");
  }
  return Array.from(evidence);
}

function createRouteProgressArtifact(input: {
  sourceUrl: string;
  compatibilityKey?: string;
  routePath: string;
  routeTitle?: string;
  templateId?: string;
  templatePath?: string;
  routeKind?: ExportRouteKind;
  template?: ExportRouteTemplate;
  templateKind?: RuntimeRouteCapture["templateKind"];
  destination?: string;
  destinationKind?: ExportRouteDestinationKind;
  status: RouteCaptureProgressArtifact["status"];
  phases?: RouteCapturePhaseRecord[];
  capturedViewports?: ViewportName[];
  evidenceClasses?: RouteCaptureEvidenceClass[];
  warnings?: string[];
  reusedFromCache?: boolean;
  reusedFromProgress?: boolean;
  failedPhase?: RouteCapturePhaseName;
  failureReason?: string;
  capture?: RuntimeRouteCapture;
  createdAt?: string;
}) {
  const now = new Date().toISOString();
  return {
    schemaVersion: ROUTE_PROGRESS_SCHEMA_VERSION,
    sourceUrl: input.sourceUrl,
    compatibilityKey: input.compatibilityKey,
    routePath: input.routePath,
    routeTitle: input.routeTitle,
    templateId: input.templateId,
    templatePath: input.templatePath,
    routeKind: input.routeKind,
    template: input.template,
    templateKind: input.templateKind,
    destination: input.destination,
    destinationKind: input.destinationKind,
    status: input.status,
    phases: input.phases ?? [],
    capturedViewports: input.capturedViewports ?? [],
    evidenceClasses: input.evidenceClasses ?? [],
    warnings: input.warnings ?? [],
    reusedFromCache: input.reusedFromCache,
    reusedFromProgress: input.reusedFromProgress,
    failedPhase: input.failedPhase,
    failureReason: input.failureReason,
    capture: input.capture,
    createdAt: input.createdAt ?? now,
    updatedAt: now,
  } satisfies RouteCaptureProgressArtifact;
}

async function readRouteCaptureProgress(
  stateDir: string,
  routePath: string,
  sourceUrl: string,
  compatibilityKey?: string,
) {
  const progressPath = routeProgressPath(stateDir, routePath);
  try {
    const raw = await fs.readFile(progressPath, "utf8");
    const parsed = JSON.parse(raw) as Partial<RouteCaptureProgressArtifact> & {
      schemaVersion?: number;
      sourceUrl?: string;
      compatibilityKey?: string;
      routePath?: string;
    };
    if (
      parsed.schemaVersion !== ROUTE_PROGRESS_SCHEMA_VERSION ||
      parsed.sourceUrl !== sourceUrl ||
      (compatibilityKey && parsed.compatibilityKey !== compatibilityKey) ||
      normalizeRoutePath(parsed.routePath ?? "") !== routePath
    ) {
      return null;
    }
    return parsed as RouteCaptureProgressArtifact;
  } catch {
    return null;
  }
}

async function writeRouteCaptureProgress(
  stateDirs: string[],
  progress: RouteCaptureProgressArtifact,
) {
  const uniqueDirs = Array.from(
    new Set(stateDirs.filter((dir): dir is string => Boolean(dir))),
  );
  await Promise.all(
    uniqueDirs.map(async (dir) => {
      const progressPath = routeProgressPath(dir, progress.routePath);
      await writeJsonFileAtomic(progressPath, progress);
    }),
  );
}

async function readRouteCacheArtifact(
  cacheDir: string,
  routePath: string,
  sourceUrl: string,
  compatibilityKey?: string,
) {
  const modernPath = routeCacheArtifactPath(cacheDir, routePath);
  try {
    const raw = await fs.readFile(modernPath, "utf8");
    const cached = JSON.parse(raw) as {
      schemaVersion?: number;
      sourceUrl?: string;
      compatibilityKey?: string;
      capture?: RuntimeRouteCapture;
    };
    if (
      cached.schemaVersion === ROUTE_CAPTURE_CACHE_SCHEMA_VERSION &&
      cached.sourceUrl === sourceUrl &&
      (!compatibilityKey || cached.compatibilityKey === compatibilityKey) &&
      (await fs.stat(routeLegacyCachePath(cacheDir, routePath)).then(
        () => true,
        () => false,
      )) &&
      cached.capture
    ) {
      return cached.capture;
    }
  } catch {
    // fall back to the legacy flat-file cache path below
  }

  try {
    const raw = await fs.readFile(routeLegacyCachePath(cacheDir, routePath), "utf8");
    const cached = JSON.parse(raw) as {
      schemaVersion?: number;
      sourceUrl?: string;
      compatibilityKey?: string;
      capture?: RuntimeRouteCapture;
    };
    return cached.schemaVersion === ROUTE_CAPTURE_CACHE_SCHEMA_VERSION &&
      cached.sourceUrl === sourceUrl &&
      (!compatibilityKey || cached.compatibilityKey === compatibilityKey) &&
      cached.capture
      ? cached.capture
      : null;
  } catch {
    return null;
  }
}

async function writeRouteCacheArtifact(
  cacheDir: string,
  routePath: string,
  sourceUrl: string,
  compatibilityKey: string,
  capture: RuntimeRouteCapture,
) {
  const payload = {
    schemaVersion: ROUTE_CAPTURE_CACHE_SCHEMA_VERSION,
    sourceUrl,
    compatibilityKey,
    templateId: capture.templateId,
    capture,
  };
  const modernPath = routeCacheArtifactPath(cacheDir, routePath);
  await fs.mkdir(path.dirname(modernPath), { recursive: true });
  await writeJsonFileAtomic(modernPath, payload);
  await writeJsonFileAtomic(routeLegacyCachePath(cacheDir, routePath), payload).catch(
    () => undefined,
  );
}

export const FULL_SITE_VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  laptop: { width: 1280, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
} as const;

const viewports: Record<ViewportName, { width: number; height: number }> =
  FULL_SITE_VIEWPORTS;

const MOTION_STYLE_PROPERTIES = [
  "transitionProperty",
  "transitionDuration",
  "transitionTimingFunction",
  "transitionDelay",
  "animationName",
  "animationDuration",
  "animationTimingFunction",
  "animationDelay",
  "animationIterationCount",
  "animationDirection",
  "animationFillMode",
  "transformOrigin",
] as const;

export const CAPTURED_STYLE_PROPERTIES = [
  "display",
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "fontSize",
  "fontFamily",
  "fontWeight",
  "fontStyle",
  "lineHeight",
  "letterSpacing",
  "textAlign",
  "textTransform",
  "textDecoration",
  "whiteSpace",
  "wordBreak",
  "color",
  "background",
  "backgroundColor",
  "backgroundImage",
  "backgroundBlendMode",
  "backgroundPosition",
  "backgroundSize",
  "backgroundRepeat",
  "borderRadius",
  "border",
  "boxShadow",
  "transform",
  "opacity",
  "padding",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "margin",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "width",
  "height",
  "minWidth",
  "minHeight",
  "maxWidth",
  "maxHeight",
  "gridTemplateColumns",
  "gridTemplateRows",
  "gridAutoFlow",
  "gridColumn",
  "gridRow",
  "gap",
  "rowGap",
  "columnGap",
  "justifyContent",
  "alignItems",
  "alignSelf",
  "justifySelf",
  "placeItems",
  "placeContent",
  "placeSelf",
  "flexDirection",
  "flexWrap",
  "overflow",
  "overflowX",
  "overflowY",
  "objectFit",
  "objectPosition",
  "aspectRatio",
  "pointerEvents",
  "zIndex",
  "cursor",
] as const;

const INTERACTION_STYLE_PROPERTIES = [
  ...CAPTURED_STYLE_PROPERTIES,
  ...MOTION_STYLE_PROPERTIES,
] as const;

export async function captureRuntime(
  input: CaptureInput,
): Promise<RuntimeCapture> {
  const browser = await chromium.launch({ headless: true });

  try {
    return await captureRuntimeWithBrowser(browser, input);
  } finally {
    await closePlaywrightResource(browser.close.bind(browser));
  }
}

export async function captureRuntimeRoutes(
  input: RouteCaptureInput,
): Promise<RuntimeCapture> {
  await fs.mkdir(input.workDir, { recursive: true });
  const routes = unique(
      input.routes
      .map((route) => ({
        path: normalizeRoutePath(route.path),
        title: route.title,
        templateId: route.templateId,
        templatePath: route.templatePath,
        routeKind: route.routeKind,
        template: route.template,
        templateKind: route.templateKind,
        destination: route.destination,
        destinationKind: route.destinationKind,
        redirectTo: route.redirectTo,
        redirectStatus: route.redirectStatus,
      }))
      .filter((route) => route.path),
    (route) => route.path,
  );
  if (routes.length === 0) {
    routes.push({
      path: "/",
      title: undefined,
      templateId: "/",
      templatePath: "/",
      routeKind: "page",
      template: "static",
      templateKind: "static",
      destination: undefined,
      destinationKind: undefined,
      redirectTo: undefined,
      redirectStatus: undefined,
    });
  }

  const routeCaptures: RuntimeRouteCapture[] = [];
  const routeFailures: Array<{
    routePath: string;
    error: string;
    phase?: RouteCapturePhaseName;
    required?: boolean;
    reused?: boolean;
  }> = [];
  const routeProgressSummaries: RouteCaptureProgressSummary[] = [];
  let consecutiveNetworkFailures = 0;
  if (input.cacheDir) await fs.mkdir(input.cacheDir, { recursive: true });
  const freshRoutePaths = new Set(
    (input.freshRoutePaths ?? []).map((routePath) => normalizeRoutePath(routePath)),
  );
  const requestedViewportNames =
    input.viewportNames && input.viewportNames.length > 0
      ? input.viewportNames
      : (Object.keys(viewports) as ViewportName[]);

  // Published Framer routes are captured serially. Recycle the browser between
  // routes so long crawls do not inherit renderer state, CDP sessions, or
  // page-level hooks from earlier routes.
  for (let index = 0; index < routes.length; index += 1) {
    const route = routes[index]!;
    const url = new URL(route.path, input.originUrl).toString();
    const compatibilityKey = createRouteCaptureCompatibilityKey({
      sourceUrl: url,
      routePath: route.path,
      viewportNames: requestedViewportNames,
      templateId: route.templateId,
      templatePath: route.templatePath,
      routeKind: route.routeKind,
      template: route.template,
      templateKind: route.templateKind,
      destination: route.destination,
      destinationKind: route.destinationKind,
      redirectTo: route.redirectTo,
      redirectStatus: route.redirectStatus,
      interactionReplayTimeoutMs: input.interactionReplayTimeoutMs,
    });
    const baseCapture = input.baseCapturesByRoute?.[route.path];
    const routeWorkDir = path.join(
      input.workDir,
      "routes",
      routeDirectoryName(route.path),
    );
    const forceFreshCapture = freshRoutePaths.has(route.path);
    const cached =
      input.cacheDir && !forceFreshCapture
        ? await readRouteCacheArtifact(
            input.cacheDir,
            route.path,
            url,
            compatibilityKey,
          )
        : null;
    const reusableCachedViewportNames = cached
      ? await listReusableViewportNames(cached, requestedViewportNames)
      : new Set<ViewportName>();
    const progressSource =
      input.cacheDir && !forceFreshCapture
        ? await readRouteCaptureProgress(
            input.cacheDir,
            route.path,
            url,
            compatibilityKey,
          )
        : null;
    let capture: RuntimeRouteCapture | null = null;
    let progress: RouteCaptureProgressArtifact | null = progressSource;

    if (cached && reusableCachedViewportNames.size === requestedViewportNames.length) {
      console.log(
        "[coderelay:capture:route-cache-hit]",
        JSON.stringify({ routePath: route.path }),
      );
      consecutiveNetworkFailures = 0;
      const cachedRouteMetadata = resolveExportRouteMetadata(
        {
          routeKind: cached.routeKind ?? route.routeKind,
          destination:
            cached.destination ?? route.destination,
          destinationKind:
            cached.destinationKind ?? route.destinationKind,
          redirectTo: cached.redirectTo ?? route.redirectTo,
          redirectStatus:
            typeof cached.redirectStatus === "number"
              ? cached.redirectStatus
              : route.redirectStatus,
          templateKind: cached.templateKind ?? route.templateKind,
        },
        {
          observedRedirectTo: cached.redirectTo,
        },
      );
      capture = {
        ...cached,
        title: route.title?.trim() || cached.title,
        routePath: route.path,
        templateId: route.templateId,
        templatePath: route.templatePath,
        routeKind: cachedRouteMetadata.routeKind,
        template: cached.template ?? route.template,
        templateKind:
          cachedRouteMetadata.templateKind ??
          cached.templateKind ??
          route.templateKind,
        destination: cachedRouteMetadata.destination,
        destinationKind: cachedRouteMetadata.destinationKind,
        ...(cachedRouteMetadata.redirectTo
          ? { redirectTo: cachedRouteMetadata.redirectTo }
          : {}),
        ...(typeof cachedRouteMetadata.redirectStatus === "number"
          ? { redirectStatus: cachedRouteMetadata.redirectStatus }
          : {}),
        captureDiagnostics: {
          ...(cached.captureDiagnostics ?? {
            breakpointsCaptured: Object.keys(cached.viewports) as ViewportName[],
          }),
          phaseHistory: cached.captureDiagnostics?.phaseHistory ?? [],
        },
      };
      const routeSummary = toRouteProgressSummary(route.path, capture, {
        status: "reused",
        warningCount: 0,
        reusedFromCache: true,
      });
      routeProgressSummaries.push(routeSummary);
    } else {
      if (cached && reusableCachedViewportNames.size > 0) {
        console.log(
          "[coderelay:capture:route-cache-partial-reuse]",
          JSON.stringify({
            routePath: route.path,
            reusableViewports: Array.from(reusableCachedViewportNames),
            requestedViewports: requestedViewportNames,
          }),
        );
      }
      try {
        let routeCaptureResult:
          | Awaited<ReturnType<typeof captureRuntimeRouteWithResume>>
          | undefined;
        let lastError: unknown;
        for (
          let transientAttempt = 1;
          transientAttempt <= ROUTE_TRANSIENT_RETRY_LIMIT;
          transientAttempt += 1
        ) {
          try {
            routeCaptureResult = await captureRuntimeRouteWithResume({
              originUrl: input.originUrl,
              route,
              url,
              routeWorkDir,
              cacheDir: input.cacheDir ?? undefined,
              viewportNames: input.viewportNames,
              baseCapture: cached ?? baseCapture,
              progress,
              interactionReplayTimeoutMs: input.interactionReplayTimeoutMs,
              compatibilityKey,
            });
            break;
          } catch (error) {
            lastError = error;
            const phaseError =
              error instanceof RouteCapturePhaseError ? error : null;
            progress = phaseError?.progress ?? progress;
            if (
              transientAttempt >= ROUTE_TRANSIENT_RETRY_LIMIT ||
              !isTransientNetworkError(error)
            ) {
              throw error;
            }
            console.warn(
              "[coderelay:capture:route-transient-retry]",
              JSON.stringify({
                routePath: route.path,
                attempt: transientAttempt,
                nextAttempt: transientAttempt + 1,
                phase: phaseError?.phase,
                reason: formatError(error),
                reusedFromProgress: progress?.reusedFromProgress ?? false,
              }),
            );
            await new Promise((resolve) =>
              setTimeout(resolve, 750 * transientAttempt),
            );
          }
        }
        if (!routeCaptureResult) {
          throw lastError ?? new Error(`Route ${route.path} capture failed.`);
        }
        const capturedRouteMetadata = resolveExportRouteMetadata(
          {
            routeKind:
              routeCaptureResult.capture.routeKind ?? route.routeKind,
            destination:
              routeCaptureResult.capture.destination ?? route.destination,
            destinationKind:
              routeCaptureResult.capture.destinationKind ?? route.destinationKind,
            redirectTo:
              routeCaptureResult.capture.redirectTo ?? route.redirectTo,
            redirectStatus:
              typeof routeCaptureResult.capture.redirectStatus === "number"
                ? routeCaptureResult.capture.redirectStatus
                : route.redirectStatus,
            templateKind:
              routeCaptureResult.capture.templateKind ?? route.templateKind,
          },
          {
            observedRedirectTo: routeCaptureResult.capture.redirectTo,
          },
        );
        capture = {
          ...routeCaptureResult.capture,
          title: route.title?.trim() || routeCaptureResult.capture.title,
          routePath: route.path,
          templateId: route.templateId,
          templatePath: route.templatePath,
          routeKind: capturedRouteMetadata.routeKind,
          template:
            routeCaptureResult.capture.template ?? route.template,
          templateKind:
            capturedRouteMetadata.templateKind ??
            routeCaptureResult.capture.templateKind ??
            route.templateKind,
          destination: capturedRouteMetadata.destination,
          destinationKind: capturedRouteMetadata.destinationKind,
          ...(capturedRouteMetadata.redirectTo
            ? { redirectTo: capturedRouteMetadata.redirectTo }
            : {}),
          ...(typeof capturedRouteMetadata.redirectStatus === "number"
            ? { redirectStatus: capturedRouteMetadata.redirectStatus }
            : {}),
        };
        progress = routeCaptureResult.progress;
        consecutiveNetworkFailures = 0;
        if (input.cacheDir && capture) {
          await writeRouteCacheArtifact(
            input.cacheDir,
            route.path,
            url,
            compatibilityKey,
            capture,
          );
        }
        if (capture && progress) {
          routeProgressSummaries.push(
            toRouteProgressSummary(route.path, capture, {
              status: progress.reusedFromProgress ? "retried" : "fresh",
              warningCount: progress.warnings.length,
              reusedFromProgress: progress.reusedFromProgress,
            }),
          );
        }
      } catch (error) {
        const phaseError =
          error instanceof RouteCapturePhaseError ? error : null;
        progress = phaseError?.progress ?? progress;
        const formatted = formatError(error);
        if (isTransientNetworkError(error)) {
          consecutiveNetworkFailures += 1;
        } else {
          consecutiveNetworkFailures = 0;
        }
        routeFailures.push({
          routePath: route.path,
          error: formatted,
          phase: phaseError?.phase,
          required: phaseError?.required,
        });
        routeProgressSummaries.push(
          progress
            ? {
                routePath: route.path,
                status: "failed",
                evidenceClasses: progress.evidenceClasses,
                capturedViewports: progress.capturedViewports,
                warningCount: progress.warnings.length,
                failedPhase: phaseError?.phase,
                failedReason: formatted,
                reusedFromProgress: progress.reusedFromProgress,
              }
            : {
                routePath: route.path,
                status: "failed",
                evidenceClasses: ["invalid"],
                capturedViewports: [],
                warningCount: 0,
                failedPhase: phaseError?.phase,
                failedReason: formatted,
              },
        );
        console.warn(
          "[coderelay:capture:route-skipped]",
          JSON.stringify({
            routePath: route.path,
            error: formatted,
            phase: phaseError?.phase,
          }),
        );
      }
    }

    if (capture) {
      routeCaptures.push(capture);
      if (!routeProgressSummaries.some((entry) => entry.routePath === route.path)) {
        routeProgressSummaries.push(
          toRouteProgressSummary(route.path, capture, {
            status: "fresh",
            warningCount: 0,
          }),
        );
      }
    }
    const completed = index + 1;
    await writeJsonFileAtomic(path.join(input.workDir, "capture-progress.json"), {
      schemaVersion: ROUTE_PROGRESS_SCHEMA_VERSION,
      sourceUrl: input.originUrl,
      completed,
      total: routes.length,
      captured: routeCaptures.map((entry) => entry.routePath),
      failures: routeFailures,
      routeProgress: routeProgressSummaries,
      summary: {
        reusedRoutes: routeProgressSummaries.filter(
          (entry) => entry.status === "reused",
        ).length,
        retriedRoutes: routeProgressSummaries.filter(
          (entry) => entry.status === "retried",
        ).length,
        failedRoutes: routeProgressSummaries.filter(
          (entry) => entry.status === "failed",
        ).length,
        optionalDegradedRoutes: routeProgressSummaries.filter(
          (entry) =>
            entry.status !== "failed" &&
            entry.evidenceClasses.includes("heuristic-backed"),
        ).length,
        firstBlockingRoute:
          routeFailures[0]?.routePath ?? routeProgressSummaries[0]?.routePath,
      },
    });
    await input.onProgress?.({
      completed,
      total: routes.length,
      routePath: route.path,
      failed: routeFailures.length,
    });
    if (consecutiveNetworkFailures >= NETWORK_UNAVAILABLE_CONFIRMATION_THRESHOLD) {
      const originProbe = await probeOriginAvailability(input.originUrl);
      if (!originProbe.reachable) {
        throw new Error(
          `Network unavailable for three consecutive routes. Origin probe ${originProbe.probeUrl} failed: ${originProbe.reason}. Capture stopped safely; restart the job when connectivity returns to resume from the route cache.`,
        );
      }
      console.warn(
        "[coderelay:capture:network-probe-recovered]",
        JSON.stringify({
          originUrl: input.originUrl,
          probeUrl: originProbe.probeUrl,
          consecutiveNetworkFailures,
        }),
      );
      consecutiveNetworkFailures = 0;
    }
  }

  if (routeCaptures.length === 0) {
    throw new Error(
      `Full-site capture failed for all ${routes.length} routes. First error: ${
        routeFailures[0]?.error ?? "unknown capture error"
      }`,
    );
  }
  const primary =
    routeCaptures.find((capture) => capture.routePath === "/") ??
    routeCaptures[0]!;
  const stylesheetUrls = unique(
    routeCaptures.flatMap((capture) => capture.stylesheetUrls ?? []),
  );
  const framerStyleCss = Array.from(
    new Set(
      routeCaptures
        .map((capture) => capture.framerStyleCss?.trim())
        .filter((css): css is string => Boolean(css)),
    ),
  ).join("\n\n");
  return {
    ...primary,
    stylesheetUrls,
    framerStyleCss,
    captureDiagnostics: {
      ...(primary.captureDiagnostics ?? {
        breakpointsCaptured: Object.keys(primary.viewports) as ViewportName[],
      }),
      routeFailures,
      routeProgress: routeProgressSummaries,
    },
    routeCaptures,
  };
}

export async function validateFullSiteCapture(input: {
  routes: Array<{ path: string }>;
  capture: RuntimeCapture;
}) {
  const expectedRoutes = new Set(input.routes.map((route) => normalizeRoutePath(route.path)));
  const capturedRoutes = new Map(
    (input.capture.routeCaptures ?? []).map((capture) => [
      normalizeRoutePath(capture.routePath),
      capture,
    ]),
  );

  for (const routePath of expectedRoutes) {
    const capture = capturedRoutes.get(routePath);
    if (!capture) {
      const routeFailure = input.capture.captureDiagnostics?.routeFailures?.find(
        (failure) => normalizeRoutePath(failure.routePath) === routePath,
      );
      throw new Error(
        routeFailure
          ? `Full-site capture incomplete: route ${routePath} was not captured (${routeFailure.error}).`
          : `Full-site capture incomplete: route ${routePath} was not captured.`,
      );
    }
    const breakpoints = capture.captureDiagnostics?.breakpointsCaptured ?? [];
    const observedWidths = new Set<number>();
    for (const viewportName of Object.keys(FULL_SITE_VIEWPORTS) as ViewportName[]) {
      const expected = FULL_SITE_VIEWPORTS[viewportName];
      const validation = capture.captureDiagnostics?.viewportValidation?.[viewportName];
      const viewport = capture.viewports[viewportName];
      if (!breakpoints.includes(viewportName) || !validation || !viewport) {
        throw new Error(
          `Full-site capture incomplete: route ${routePath} is missing ${viewportName} evidence.`,
        );
      }
      if (!validation.valid) {
        throw new Error(
          `Full-site capture invalid: route ${routePath} at ${viewportName} (${validation.reason ?? "viewport validation failed"}).`,
        );
      }
      if (
        validation.requestedWidth !== expected.width ||
        validation.observedInnerWidth !== expected.width ||
        !isTolerableScreenshotWidthMismatch(
          { width: expected.width, height: expected.height },
          {
            innerWidth: validation.observedInnerWidth,
            innerHeight: validation.observedInnerHeight,
            clientWidth: validation.observedClientWidth,
            devicePixelRatio: 1,
          },
          {
            width: validation.screenshotWidth,
            height: validation.screenshotHeight,
          },
        )
      ) {
        throw new Error(
          `Full-site capture width mismatch: route ${routePath} at ${viewportName} requested=${validation.requestedWidth}, observed=${validation.observedInnerWidth}, screenshot=${validation.screenshotWidth}.`,
        );
      }
      if (!viewport.screenshotPath) {
        throw new Error(
          `Full-site capture incomplete: route ${routePath} at ${viewportName} has no screenshot path.`,
        );
      }
      await fs.stat(viewport.screenshotPath).catch(() => {
        throw new Error(
          `Full-site capture incomplete: route ${routePath} at ${viewportName} screenshot does not exist (${viewport.screenshotPath}).`,
        );
      });
      if (observedWidths.has(validation.observedInnerWidth)) {
        throw new Error(
          `Full-site capture invalid: route ${routePath} has duplicate observed viewport width ${validation.observedInnerWidth}.`,
        );
      }
      observedWidths.add(validation.observedInnerWidth);
    }
  }
  for (const routePath of capturedRoutes.keys()) {
    if (!expectedRoutes.has(routePath)) {
      throw new Error(`Full-site capture returned an unexpected route ${routePath}.`);
    }
  }
}

type ViewportCaptureResult = Awaited<ReturnType<typeof captureViewport>>;
type ObservedViewport = Awaited<ReturnType<typeof readObservedViewport>>;

function createViewportCaptureSnapshotFromRouteCapture(
  capture: RuntimeRouteCapture,
  viewportName: ViewportName,
): ViewportCaptureResult | null {
  const viewport = capture.viewports[viewportName];
  if (!viewport) return null;
  const requested = viewport.requested ?? {
    width: viewport.width,
    height: viewport.height,
  };
  const observed = viewport.observed ?? {
    innerWidth: viewport.width,
    innerHeight: viewport.height,
    clientWidth: viewport.width,
    devicePixelRatio: 1,
  };
  const validation =
    capture.captureDiagnostics?.viewportValidation?.[viewportName] ??
    createViewportValidation(requested, observed, {
      width: viewport.width,
      height: viewport.height,
    });
  return {
    viewportName,
    title: capture.title,
    nodes:
      capture.nodesByViewport?.[viewportName] ??
      (viewportName === "desktop" ? capture.nodes : []),
    rootStyles:
      capture.rootStylesByViewport?.[viewportName] ??
      (viewportName === "desktop" ? capture.rootStyles ?? {} : {}),
    viewportValidation: {
      requestedWidth: validation.requestedWidth,
      requestedHeight: validation.requestedHeight,
      observedBeforeInnerWidth: validation.observedBeforeInnerWidth,
      observedBeforeInnerHeight: validation.observedBeforeInnerHeight,
      observedBeforeClientWidth: validation.observedBeforeClientWidth,
      observedInnerWidth: validation.observedInnerWidth,
      observedInnerHeight: validation.observedInnerHeight,
      observedClientWidth: validation.observedClientWidth,
      screenshotWidth: validation.screenshotWidth,
      screenshotHeight: validation.screenshotHeight,
      screenshotAttempts: validation.screenshotAttempts ?? 1,
      valid: validation.valid,
      reason: validation.reason,
    },
    fontsReady: capture.captureDiagnostics?.fontReadiness?.[viewportName] ?? true,
    framerStyleCss:
      viewportName === "desktop" ? capture.framerStyleCss ?? "" : "",
    stylesheetUrls: capture.stylesheetUrls ?? [],
    interactionReplay:
      viewportName === "desktop" ? capture.interactionReplay : undefined,
    redirect: capture.redirectTo
      ? {
          redirectTo: capture.redirectTo,
          templateKind:
            capture.templateKind === "utility" ? "utility" : "redirect",
        }
      : null,
    phaseHistory: [],
    warnings: [],
    viewport: {
      screenshotPath: viewport.screenshotPath,
      width: viewport.width,
      height: viewport.height,
      requested,
      observed,
      valid: validation.valid,
    },
  };
}

function assembleRouteCapture(input: {
  route: RouteCaptureInput["routes"][number];
  url: string;
  captures: ViewportCaptureResult[];
  baseCapture?: RuntimeRouteCapture;
}): RuntimeRouteCapture {
  const baseCapture = input.baseCapture;
  const desktop =
    input.captures.find((capture) => capture.viewportName === "desktop") ??
    readBaseViewportCapture(baseCapture, "desktop") ??
    input.captures[0]!;
  const stylesheetUrls = unique(
    [
      ...(baseCapture?.stylesheetUrls ?? []),
      ...input.captures.flatMap((capture) => capture.stylesheetUrls),
    ],
  );
  const viewportEntries = Object.fromEntries(
    unique(
      [
        ...((baseCapture?.captureDiagnostics?.breakpointsCaptured ?? []) as ViewportName[]),
        ...input.captures.map((capture) => capture.viewportName),
      ],
    ).map((viewportName) => [
      viewportName,
      input.captures.find((capture) => capture.viewportName === viewportName)
        ?.viewport ?? baseCapture?.viewports[viewportName],
    ]),
  ) as RuntimeCapture["viewports"];
  const nodesByViewport = Object.fromEntries(
    unique(
      [
        ...((baseCapture?.captureDiagnostics?.breakpointsCaptured ?? []) as ViewportName[]),
        ...input.captures.map((capture) => capture.viewportName),
      ],
    ).map((viewportName) => [
      viewportName,
      input.captures.find((capture) => capture.viewportName === viewportName)?.nodes ??
        baseCapture?.nodesByViewport?.[viewportName] ??
        (viewportName === "desktop" ? baseCapture?.nodes : undefined),
    ]),
  );
  const rootStylesByViewport = Object.fromEntries(
    unique(
      [
        ...((baseCapture?.captureDiagnostics?.breakpointsCaptured ?? []) as ViewportName[]),
        ...input.captures.map((capture) => capture.viewportName),
      ],
    ).map((viewportName) => [
      viewportName,
      input.captures.find((capture) => capture.viewportName === viewportName)?.rootStyles ??
        baseCapture?.rootStylesByViewport?.[viewportName] ??
        (viewportName === "desktop" ? baseCapture?.rootStyles : undefined),
    ]),
  );
  const breakpointsCaptured = unique(
    [
      ...((baseCapture?.captureDiagnostics?.breakpointsCaptured ?? []) as ViewportName[]),
      ...input.captures.map((capture) => capture.viewportName),
    ],
  );
  const redirect =
    input.captures.find((capture) => capture.viewportName === "desktop")?.redirect ??
    input.captures.find((capture) => capture.redirect)?.redirect;
  const routeMetadata = resolveExportRouteMetadata(
    {
      routeKind: input.route.routeKind,
      destination: input.route.destination,
      destinationKind: input.route.destinationKind,
      redirectTo: input.route.redirectTo,
      redirectStatus: input.route.redirectStatus,
      templateKind: input.route.templateKind,
    },
    {
      observedRedirectTo: redirect?.redirectTo,
    },
  );

  return {
    url: input.url,
    title: desktop.title,
    mode: input.route.templateKind === "utility" ? "page" : "page",
    viewports: viewportEntries,
    nodes: desktop.nodes,
    nodesByViewport,
    rootStyles: desktop.rootStyles,
    rootStylesByViewport,
    captureDiagnostics: {
      breakpointsCaptured,
      viewportValidation: Object.fromEntries(
        breakpointsCaptured.map((viewportName) => {
          const fromCapture = input.captures.find(
            (capture) => capture.viewportName === viewportName,
          )?.viewportValidation;
          const fromBase =
            baseCapture?.captureDiagnostics?.viewportValidation?.[viewportName];
          return [viewportName, fromCapture ?? fromBase];
        }),
      ),
      fontReadiness: Object.fromEntries(
        breakpointsCaptured.map((viewportName) => [
          viewportName,
          input.captures.find((capture) => capture.viewportName === viewportName)
            ?.fontsReady ??
            baseCapture?.captureDiagnostics?.fontReadiness?.[viewportName],
        ]),
      ),
      stylesheetCount: Object.fromEntries(
        breakpointsCaptured.map((viewportName) => [
          viewportName,
          input.captures.find((capture) => capture.viewportName === viewportName)
            ?.stylesheetUrls.length ??
            baseCapture?.captureDiagnostics?.stylesheetCount?.[viewportName] ??
            0,
        ]),
      ),
      nodeCount: Object.fromEntries(
        breakpointsCaptured.map((viewportName) => [
          viewportName,
          input.captures.find((capture) => capture.viewportName === viewportName)
            ?.nodes.length ??
            baseCapture?.captureDiagnostics?.nodeCount?.[viewportName] ??
            (viewportName === "desktop" ? baseCapture?.nodes.length : 0) ??
            0,
        ]),
      ),
      phaseHistory: input.captures.flatMap(
        (capture) => capture.phaseHistory ?? [],
      ),
      routeProgress: [],
    },
    interactionReplay:
      ("interactionReplay" in desktop
        ? desktop.interactionReplay
        : undefined) ??
      baseCapture?.interactionReplay ??
      [],
    framerStyleCss: desktop.framerStyleCss || baseCapture?.framerStyleCss,
    stylesheetUrls,
    routePath: input.route.path,
    templateId: input.route.templateId,
    templatePath: input.route.templatePath,
    routeKind: routeMetadata.routeKind,
    template: input.route.template,
    templateKind: routeMetadata.templateKind ?? input.route.templateKind,
    destination: routeMetadata.destination,
    destinationKind: routeMetadata.destinationKind,
    ...(routeMetadata.redirectTo
      ? { redirectTo: routeMetadata.redirectTo }
      : {}),
    ...(typeof routeMetadata.redirectStatus === "number"
      ? { redirectStatus: routeMetadata.redirectStatus }
      : {}),
  };
}

async function captureRuntimeRouteWithResume(input: {
  originUrl: string;
  route: RouteCaptureInput["routes"][number];
  url: string;
  routeWorkDir: string;
  cacheDir?: string;
  viewportNames?: ViewportName[];
  baseCapture?: RuntimeRouteCapture;
  progress?: RouteCaptureProgressArtifact | null;
  interactionReplayTimeoutMs?: number;
  compatibilityKey?: string;
}): Promise<{
  capture: RuntimeRouteCapture;
  progress: RouteCaptureProgressArtifact;
}> {
  const viewportNames =
    input.viewportNames && input.viewportNames.length > 0
      ? input.viewportNames
      : ((Object.keys(viewports) as ViewportName[]));
  const stateDirs = Array.from(
    new Set(
      [path.dirname(input.routeWorkDir), input.cacheDir].filter(
        Boolean,
      ) as string[],
    ),
  );
  const stateDir = input.cacheDir
    ? routeStateDirectory(input.cacheDir, input.route.path)
    : input.routeWorkDir;
  await fs.mkdir(stateDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const progressHistory = input.progress?.phases ? [...input.progress.phases] : [];
  const warnings = input.progress?.warnings ? [...input.progress.warnings] : [];
  const snapshotSeed =
    alignCaptureWithProgressArtifact(input.progress, input.progress?.capture) ??
    input.baseCapture;
  const captures: ViewportCaptureResult[] = [];
  const capturedViewports = new Set<ViewportName>();
  let currentCapture = snapshotSeed ? structuredClone(snapshotSeed) : null;
  let reusedFromProgress = Boolean(input.progress);

  if (currentCapture) {
    const reusableViewportNames = await listReusableViewportNames(
      currentCapture,
      viewportNames,
    );
    for (const viewportName of viewportNames) {
      if (!reusableViewportNames.has(viewportName)) continue;
      const validation =
        currentCapture.captureDiagnostics?.viewportValidation?.[viewportName];
      const viewport = currentCapture.viewports[viewportName];
      if (viewport && validation?.valid) {
        const snapshot = createViewportCaptureSnapshotFromRouteCapture(
          currentCapture,
          viewportName,
        );
        if (snapshot) {
          captures.push(snapshot);
          capturedViewports.add(viewportName);
          progressHistory.push({
            phase: `capture-${viewportName}`,
            routePath: input.route.path,
            required: true,
            status: "reused",
            startedAt: new Date().toISOString(),
            finishedAt: new Date().toISOString(),
            durationMs: 0,
            viewportName,
            reuseKind: "reused",
          });
        }
      }
    }
  }

  try {
    for (const viewportName of viewportNames) {
      if (capturedViewports.has(viewportName)) continue;
      const viewportCapture = await captureViewport(
        browser,
        {
          url: input.url,
          workDir: stateDir,
          routePath: input.route.path,
          route: {
            routeKind: input.route.routeKind,
            templateKind: input.route.templateKind,
            destination: input.route.destination,
            destinationKind: input.route.destinationKind,
            redirectTo: input.route.redirectTo,
          },
          viewportNames: [viewportName],
          baseCapture: currentCapture ?? input.baseCapture,
          interactionReplayTimeoutMs: input.interactionReplayTimeoutMs,
        },
        viewportName,
        stateDir,
      );
      captures.push(viewportCapture);
      capturedViewports.add(viewportName);
      progressHistory.push(...(viewportCapture.phaseHistory ?? []));
      warnings.push(...(viewportCapture.warnings ?? []));
      currentCapture = assembleRouteCapture({
        route: input.route,
        url: input.url,
        captures: [...captures],
        baseCapture: input.baseCapture,
      });
      const partialProgress = createRouteProgressArtifact({
        sourceUrl: input.url,
        compatibilityKey: input.compatibilityKey,
        routePath: input.route.path,
        routeTitle: input.route.title,
        templateId: input.route.templateId,
        templatePath: input.route.templatePath,
        routeKind: input.route.routeKind,
        template: input.route.template,
        templateKind: input.route.templateKind,
        destination: input.route.destination,
        destinationKind: input.route.destinationKind,
        status: capturedViewports.size === viewportNames.length ? "complete" : "partial",
        phases: progressHistory,
        capturedViewports: Array.from(capturedViewports),
        evidenceClasses: currentCapture
          ? summarizeRouteEvidenceClasses(currentCapture)
          : ["invalid"],
        warnings,
        reusedFromProgress,
        capture: currentCapture ?? undefined,
      });
      await writeRouteCaptureProgress(stateDirs, partialProgress);
      if (
        captureFailureTestMode === "fail-after-tablet-progress" &&
        viewportName === "tablet"
      ) {
        throw new RouteCapturePhaseError(
          `Route ${input.route.path} phase capture-tablet failed at tablet: forced to fail after tablet progress for testing.`,
          input.route.path,
          "capture-tablet",
          true,
          partialProgress,
        );
      }
    }

    const finalCapture = currentCapture
      ? {
          ...currentCapture,
          captureDiagnostics: {
            ...(currentCapture.captureDiagnostics ?? {
              breakpointsCaptured: viewportNames,
            }),
            phaseHistory: progressHistory,
            routeProgress: [
              toRouteProgressSummary(input.route.path, currentCapture, {
                status: reusedFromProgress ? "retried" : "fresh",
                warningCount: warnings.length,
                reusedFromProgress,
              }),
            ],
          },
        }
      : null;

    if (!finalCapture) {
      throw new RouteCapturePhaseError(
        `Route capture produced no evidence for ${input.route.path}.`,
        input.route.path,
        "route-finalize",
        true,
      );
    }

    const finalProgress = createRouteProgressArtifact({
      sourceUrl: input.url,
      compatibilityKey: input.compatibilityKey,
      routePath: input.route.path,
      routeTitle: input.route.title,
      templateId: input.route.templateId,
      templatePath: input.route.templatePath,
      routeKind: input.route.routeKind,
      template: input.route.template,
      templateKind: input.route.templateKind,
      destination: input.route.destination,
      destinationKind: input.route.destinationKind,
      status: "complete",
      phases: progressHistory,
      capturedViewports: Array.from(capturedViewports),
      evidenceClasses: summarizeRouteEvidenceClasses(finalCapture),
      warnings,
      reusedFromProgress,
      capture: finalCapture,
    });
    await writeRouteCaptureProgress(stateDirs, finalProgress);

    return {
      capture: finalCapture,
      progress: finalProgress,
    };
  } catch (error) {
    const phaseError =
      error instanceof RouteCapturePhaseError ? error : null;
    const failingProgress = createRouteProgressArtifact({
      sourceUrl: input.url,
      compatibilityKey: input.compatibilityKey,
      routePath: input.route.path,
      routeTitle: input.route.title,
      templateId: input.route.templateId,
      templatePath: input.route.templatePath,
      routeKind: input.route.routeKind,
      template: input.route.template,
      templateKind: input.route.templateKind,
      destination: input.route.destination,
      destinationKind: input.route.destinationKind,
      status: "failed",
      phases: progressHistory,
      capturedViewports: Array.from(capturedViewports),
      evidenceClasses: currentCapture
        ? summarizeRouteEvidenceClasses(currentCapture)
        : ["invalid"],
      warnings,
      reusedFromProgress,
      failedPhase: phaseError?.phase,
      failureReason: formatError(error),
      capture: currentCapture ?? undefined,
    });
    await writeRouteCaptureProgress(stateDirs, failingProgress);
    if (phaseError) {
      throw phaseError;
    }
    throw new RouteCapturePhaseError(
      formatError(error),
      input.route.path,
      "route-finalize",
      true,
      failingProgress,
    );
  } finally {
    await closePlaywrightResource(browser.close.bind(browser));
  }
}

async function captureRuntimeWithBrowser(
  browser: Browser | BrowserContext,
  input: CaptureInput,
): Promise<RuntimeCapture> {
  const captureDir = path.join(input.workDir, "original");
  await fs.mkdir(captureDir, { recursive: true });
  const captures: Array<Awaited<ReturnType<typeof captureViewport>>> = [];
  const viewportNames =
    input.viewportNames && input.viewportNames.length > 0
      ? input.viewportNames
      : ((Object.keys(viewports) as ViewportName[]));
  for (let index = 0; index < viewportNames.length; index += 2) {
    captures.push(
      ...(await Promise.all(
        viewportNames
          .slice(index, index + 2)
          .map((viewportName) =>
            captureViewport(browser, input, viewportName, captureDir),
          ),
      )),
    );
  }
  const baseCapture = input.baseCapture;
  const desktop =
    captures.find((capture) => capture.viewportName === "desktop") ??
    readBaseViewportCapture(baseCapture, "desktop") ??
    captures[0]!;
  const stylesheetUrls = unique(
    [
      ...(baseCapture?.stylesheetUrls ?? []),
      ...captures.flatMap((capture) => capture.stylesheetUrls),
    ],
  );
  const viewportEntries = Object.fromEntries(
    unique(
      [
        ...((baseCapture?.captureDiagnostics?.breakpointsCaptured ?? []) as ViewportName[]),
        ...captures.map((capture) => capture.viewportName),
      ],
    ).map((viewportName) => [
      viewportName,
      captures.find((capture) => capture.viewportName === viewportName)?.viewport ??
        baseCapture?.viewports[viewportName],
    ]),
  ) as RuntimeCapture["viewports"];
  const nodesByViewport = Object.fromEntries(
    unique(
      [
        ...((baseCapture?.captureDiagnostics?.breakpointsCaptured ?? []) as ViewportName[]),
        ...captures.map((capture) => capture.viewportName),
      ],
    ).map((viewportName) => [
      viewportName,
      captures.find((capture) => capture.viewportName === viewportName)?.nodes ??
        baseCapture?.nodesByViewport?.[viewportName] ??
        (viewportName === "desktop" ? baseCapture?.nodes : undefined),
    ]),
  );
  const rootStylesByViewport = Object.fromEntries(
    unique(
      [
        ...((baseCapture?.captureDiagnostics?.breakpointsCaptured ?? []) as ViewportName[]),
        ...captures.map((capture) => capture.viewportName),
      ],
    ).map((viewportName) => [
      viewportName,
      captures.find((capture) => capture.viewportName === viewportName)?.rootStyles ??
        baseCapture?.rootStylesByViewport?.[viewportName] ??
        (viewportName === "desktop" ? baseCapture?.rootStyles : undefined),
    ]),
  );
  const breakpointsCaptured = unique(
    [
      ...((baseCapture?.captureDiagnostics?.breakpointsCaptured ?? []) as ViewportName[]),
      ...captures.map((capture) => capture.viewportName),
    ],
  );
  const redirect =
    captures.find((capture) => capture.viewportName === "desktop")?.redirect ??
    captures.find((capture) => capture.redirect)?.redirect;

  return {
    url: input.url,
    title: desktop.title,
    mode: input.selector ? "section" : "page",
    viewports: viewportEntries,
    nodes: desktop.nodes,
    nodesByViewport,
    rootStyles: desktop.rootStyles,
    rootStylesByViewport,
    captureDiagnostics: {
      breakpointsCaptured,
      viewportValidation: Object.fromEntries(
        breakpointsCaptured.map((viewportName) => {
          const fromCapture = captures.find(
            (capture) => capture.viewportName === viewportName,
          )?.viewportValidation;
          const fromBase =
            baseCapture?.captureDiagnostics?.viewportValidation?.[viewportName];
          return [viewportName, fromCapture ?? fromBase];
        }),
      ),
      fontReadiness: Object.fromEntries(
        breakpointsCaptured.map((viewportName) => [
          viewportName,
          captures.find((capture) => capture.viewportName === viewportName)
            ?.fontsReady ??
            baseCapture?.captureDiagnostics?.fontReadiness?.[viewportName],
        ]),
      ),
      stylesheetCount: Object.fromEntries(
        breakpointsCaptured.map((viewportName) => [
          viewportName,
          captures.find((capture) => capture.viewportName === viewportName)
            ?.stylesheetUrls.length ??
            baseCapture?.captureDiagnostics?.stylesheetCount?.[viewportName] ??
            0,
        ]),
      ),
      nodeCount: Object.fromEntries(
        breakpointsCaptured.map((viewportName) => [
          viewportName,
          captures.find((capture) => capture.viewportName === viewportName)
            ?.nodes.length ??
            baseCapture?.captureDiagnostics?.nodeCount?.[viewportName] ??
            (viewportName === "desktop" ? baseCapture?.nodes.length : 0) ??
            0,
        ]),
      ),
    },
    interactionReplay:
      ("interactionReplay" in desktop
        ? desktop.interactionReplay
        : undefined) ??
      baseCapture?.interactionReplay ??
      [],
    ...(redirect ? { redirectTo: redirect.redirectTo } : {}),
    framerStyleCss: desktop.framerStyleCss || baseCapture?.framerStyleCss,
    stylesheetUrls,
  };
}

async function readCachedRouteCapture(
  cacheDir: string,
  routePath: string,
  sourceUrl: string,
) {
  try {
    const raw = await fs.readFile(routeCachePath(cacheDir, routePath), "utf8");
    const cached = JSON.parse(raw) as {
      schemaVersion?: number;
      sourceUrl?: string;
      templateId?: string;
      capture?: RuntimeRouteCapture;
    };
    return cached.schemaVersion === ROUTE_CAPTURE_CACHE_SCHEMA_VERSION &&
      cached.sourceUrl === sourceUrl &&
      hasValidCachedResponsiveEvidence(cached.capture) &&
      cached.capture
      ? cached.capture
      : null;
  } catch {
    return null;
  }
}

async function writeCachedRouteCapture(
  cacheDir: string,
  routePath: string,
  sourceUrl: string,
  capture: RuntimeRouteCapture,
) {
  await fs.writeFile(
    routeCachePath(cacheDir, routePath),
    `${JSON.stringify(
      {
        schemaVersion: ROUTE_CAPTURE_CACHE_SCHEMA_VERSION,
        sourceUrl,
        templateId: capture.templateId,
        capture,
      },
      null,
      2,
    )}\n`,
  );
}

function routeCachePath(cacheDir: string, routePath: string) {
  return path.join(cacheDir, `${routeDirectoryName(routePath)}.json`);
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  message: string,
) {
  let timer: NodeJS.Timeout | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(message)), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function closePlaywrightResource(
  close: () => Promise<unknown>,
  timeoutMs = 2_000,
) {
  await withTimeout(
    close(),
    timeoutMs,
    `Playwright teardown exceeded ${Math.round(timeoutMs / 1000)}s.`,
  ).catch(() => undefined);
}

function normalizeRoutePath(value: string) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "/") return "/";
  try {
    const pathname = /^https?:\/\//.test(trimmed)
      ? new URL(trimmed).pathname
      : trimmed;
    return `/${pathname.replace(/^\/+|\/+$/g, "")}`.replace(/\/{2,}/g, "/");
  } catch {
    return "/";
  }
}

function routeDirectoryName(routePath: string) {
  if (routePath === "/") return "home";
  return routePath
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .slice(0, 120);
}

export function createSimulatedPluginCapture(
  nodes: RuntimeNode[],
): PluginCanvasCapture {
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
        sectionName: node.sectionName,
        src: node.attributes.src,
        href: node.attributes.href,
        className: node.attributes.className,
        dataFramerName: node.attributes.dataFramerName,
        motion: node.motion,
      },
    }));

  return {
    mode: "simulated",
    selectedNodes,
    capturedAt: new Date().toISOString(),
  };
}

async function captureViewport(
  browser: Browser | BrowserContext,
  input: CaptureInput,
  viewportName: ViewportName,
  captureDir: string,
) {
  const viewport = viewports[viewportName];
  const { page, close } = await createPageWithViewport(browser, viewport);
  const routePath = input.routePath ?? "/";
  const phaseHistory: RouteCapturePhaseRecord[] = [];
  const warnings: string[] = [];

  async function runPhase<T>(
    phase: RouteCapturePhaseName,
    required: boolean,
    action: () => Promise<T>,
    detail?: string,
  ) {
    const startedAt = new Date().toISOString();
    phaseHistory.push({
      phase,
      routePath,
      required,
      status: "running",
      startedAt,
      viewportName,
      detail,
    });
    const startedMs = Date.now();
    try {
      const result = await withTimeout(
        action(),
        ROUTE_PHASE_BUDGETS_MS[phase],
        `Route ${routePath} phase ${phase} exceeded ${Math.round(
          ROUTE_PHASE_BUDGETS_MS[phase] / 1000,
        )}s at ${viewportName}.`,
      );
      phaseHistory.push({
        phase,
        routePath,
        required,
        status: "completed",
        startedAt,
        finishedAt: new Date().toISOString(),
        durationMs: Date.now() - startedMs,
        viewportName,
        detail,
      });
      return result;
    } catch (error) {
      const finishedAt = new Date().toISOString();
      phaseHistory.push({
        phase,
        routePath,
        required,
        status: required ? "failed" : "skipped",
        startedAt,
        finishedAt,
        durationMs: Date.now() - startedMs,
        viewportName,
        detail: formatError(error),
      });
      if (required) {
        const reason = formatError(error);
        throw new RouteCapturePhaseError(
          `Route ${routePath} phase ${phase} failed at ${viewportName}: ${reason}`,
          routePath,
          phase,
          required,
        );
      }
      warnings.push(formatError(error));
      return undefined as T;
    }
  }
  try {
    await runPhase("navigate", true, async () => {
      await navigateForCapture(page, input.url);
    });
    let redirect =
      readExplicitExternalRouteRedirect(input.route) ??
      readCapturedRedirect(input.url, page.url());
    let fontsReady = true;
    if (!redirect) {
      fontsReady = await runPhase("stabilize", true, async () => {
        await page
          .waitForLoadState("domcontentloaded", { timeout: 15_000 })
          .catch(() => undefined);
        await page.waitForLoadState("load", { timeout: 15_000 }).catch(() => {
          // Modern Framer sites can keep loading analytics/fonts; capture renderable DOM.
        });
        await waitForRenderableContent(page, input.selector);
        return waitForFonts(page);
      });
      redirect = readCapturedRedirect(input.url, page.url());
    } else {
      phaseHistory.push({
        phase: "stabilize",
        routePath,
        required: false,
        status: "skipped",
        startedAt: new Date().toISOString(),
        finishedAt: new Date().toISOString(),
        durationMs: 0,
        viewportName,
        detail: "redirect-placeholder",
      });
    }
    if (redirect) {
      await showExternalRedirect(page, escapeHtml(redirect.redirectTo));
    }
    const screenshotPath = path.join(captureDir, `${viewportName}.png`);
    let nodes: RuntimeNode[] = [];
    let rootStyles: Record<string, string> = {};
    let stylesheets: string[] = [];
    let framerStyleCss = "";
    let nodesWithInteractions: RuntimeNode[] = [];
    let observedViewportBeforeScreenshot: ObservedViewport | undefined;
    let observedViewport: ObservedViewport | undefined;
    let viewportValidation:
      | ReturnType<typeof createViewportValidation>
      | undefined;

    await runPhase(`capture-${viewportName}`, true, async () => {
      const screenshotEvidence = await captureViewportScreenshotWithRetry({
        page,
        input,
        viewport,
        viewportName,
        screenshotPath,
        fontsReady,
      });
      redirect = screenshotEvidence.redirect ?? redirect;
      observedViewportBeforeScreenshot =
        screenshotEvidence.observedViewportBeforeScreenshot;
      observedViewport = screenshotEvidence.observedViewport;
      viewportValidation = screenshotEvidence.viewportValidation;

      if (redirect) {
        nodes = createRedirectPlaceholderNodes(
          input.routePath ?? "/",
          redirect.redirectTo,
        );
        rootStyles = await withDomEvaluationRetry(
          page,
          input.routePath ?? "/",
          "extract-root-styles",
          () => extractRootStyles(page, input.selector),
        );
        stylesheets = [];
        nodesWithInteractions = nodes;
        return;
      }

      nodes = await withDomEvaluationRetry(
        page,
        input.routePath ?? "/",
        "extract-dom",
        async () => {
          const redirected = readCapturedRedirect(input.url, page.url());
          if (redirected) {
            redirect = redirected;
            return createRedirectPlaceholderNodes(
              input.routePath ?? "/",
              redirected.redirectTo,
            );
          }
          return extractNodes(page, input.selector, input.routePath ?? "/");
        },
      );
      if (redirect) {
        rootStyles = await withDomEvaluationRetry(
          page,
          input.routePath ?? "/",
          "extract-root-styles",
          () => extractRootStyles(page, input.selector),
        );
        stylesheets = [];
        nodesWithInteractions = nodes;
        return;
      }
      rootStyles = await withDomEvaluationRetry(
        page,
        input.routePath ?? "/",
        "extract-root-styles",
        () => extractRootStyles(page, input.selector),
      );
      nodesWithInteractions =
        viewportName === "desktop"
          ? await collectInteractionStylesWithinBudget(
              page,
              nodes,
              input.routePath ?? "/",
              viewportName,
              warnings,
            )
          : nodes;
      stylesheets = await withDomEvaluationRetry(
        page,
        input.routePath ?? "/",
        "extract-stylesheets",
        () => extractStylesheets(page),
      );
      framerStyleCss = "";
    });
    if (viewportName === "desktop" && !redirect) {
      framerStyleCss = await runPhase("route-finalize", true, async () =>
        downloadStylesheets(stylesheets, input.url),
      );
    }
    const title = redirect ? "External redirect" : await page.title();
    const imageSize = await getPngSize(screenshotPath).catch(() => viewport);
      const interactionReplay =
      redirect
        ? []
        : viewportName === "desktop"
        ? await runPhase("interaction-replay", false, async () =>
            collectSafeInteractionReplay(
              page,
              input.selector,
              captureDir,
              input.routePath ?? "/",
              viewportName,
              Math.min(
                input.interactionReplayTimeoutMs ?? INTERACTION_REPLAY_TIMEOUT_MS,
                ROUTE_PHASE_BUDGETS_MS["interaction-replay"],
              ),
            ).catch((error) => {
              const warning = formatError(error);
              if (isInteractionReplayTeardownError(warning)) {
                return [];
              }
              warnings.push(warning);
              console.warn(
                "[coderelay:capture:interaction-replay-skipped]",
                JSON.stringify({
                  routePath: input.routePath ?? "/",
                  viewport: viewportName,
                  reason: warning,
                }),
              );
              return [];
            }),
          )
        : undefined;
    if (!observedViewport || !viewportValidation) {
      observedViewport = await withDomEvaluationRetry(
        page,
        input.routePath ?? "/",
        "read-observed-viewport",
        () => readObservedViewport(page),
      );
      viewportValidation = createViewportValidation(
        viewport,
        observedViewport,
        imageSize,
        observedViewportBeforeScreenshot,
      );
    }

    return {
      viewportName,
      title,
      nodes: nodesWithInteractions,
      rootStyles,
      viewport: {
        screenshotPath,
        width: imageSize.width,
        height: imageSize.height,
        requested: viewport,
        observed: observedViewport,
        valid: viewportValidation.valid,
      },
      viewportValidation,
      fontsReady,
      framerStyleCss,
      stylesheetUrls: stylesheets,
      interactionReplay,
      redirect,
      phaseHistory,
      warnings,
    };
  } finally {
    await closePlaywrightResource(close);
  }
}

async function createPageWithViewport(
  browser: Browser | BrowserContext,
  viewport: { width: number; height: number },
) {
  if ("newContext" in browser) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    return {
      page,
      close: () => context.close(),
    };
  }
  const page = await browser.newPage();
  await page.setViewportSize(viewport);
  return {
    page,
    close: () => page.close(),
  };
}

async function readObservedViewport(page: Page) {
  return page.evaluate(() => ({
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    clientWidth:
      document.documentElement?.clientWidth ??
      document.body?.clientWidth ??
      window.innerWidth,
    devicePixelRatio: window.devicePixelRatio,
  }));
}

async function captureViewportScreenshotWithRetry(input: {
  page: Page;
  input: CaptureInput;
  viewport: { width: number; height: number };
  viewportName: ViewportName;
  screenshotPath: string;
  fontsReady: boolean;
}) {
  const routePath = input.input.routePath ?? "/";
  let lastObservedViewportBeforeScreenshot: ObservedViewport | undefined;
  let lastObservedViewport: ObservedViewport | undefined;
  let lastViewportValidation:
    | ReturnType<typeof createViewportValidation>
    | undefined;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    lastObservedViewportBeforeScreenshot = await withDomEvaluationRetry(
      input.page,
      routePath,
      "read-observed-viewport",
      () => readObservedViewport(input.page),
    );

    if (input.input.selector) {
      const rootHandle = await resolveRootHandle(input.page, input.input.selector);
      const clip = await getClip(rootHandle, input.viewport);
      try {
        await captureScreenshot(
          input.page,
          input.screenshotPath,
          input.fontsReady,
          clip,
        );
      } finally {
        await rootHandle.dispose();
      }
    } else {
      await captureScreenshot(
        input.page,
        input.screenshotPath,
        input.fontsReady,
      );
    }

    const redirect = readCapturedRedirect(input.input.url, input.page.url());
    if (redirect) {
      return {
        redirect,
        observedViewportBeforeScreenshot: lastObservedViewportBeforeScreenshot,
        observedViewport: lastObservedViewportBeforeScreenshot,
        viewportValidation: createViewportValidation(
          input.viewport,
          lastObservedViewportBeforeScreenshot,
          await getPngSize(input.screenshotPath).catch(() => input.viewport),
          lastObservedViewportBeforeScreenshot,
          attempt,
        ),
      };
    }

    const observedViewportAfterScreenshot = applyViewportDriftTestMode(
      await withDomEvaluationRetry(
        input.page,
        routePath,
        "read-observed-viewport",
        () => readObservedViewport(input.page),
      ),
      input.viewport,
    );
    const imageSize = await getPngSize(input.screenshotPath).catch(
      () => input.viewport,
    );
    const viewportValidation = createViewportValidation(
      input.viewport,
      observedViewportAfterScreenshot,
      imageSize,
      lastObservedViewportBeforeScreenshot,
      attempt,
    );
    lastObservedViewport = observedViewportAfterScreenshot;
    lastViewportValidation = viewportValidation;

    if (viewportValidation.valid) {
      return {
        redirect,
        observedViewportBeforeScreenshot: lastObservedViewportBeforeScreenshot,
        observedViewport: observedViewportAfterScreenshot,
        viewportValidation,
      };
    }

    if (attempt < 2 && shouldRetryViewportScreenshot(viewportValidation)) {
      console.warn(
        "[coderelay:capture:viewport-retry]",
        JSON.stringify({
          routePath,
          viewport: input.viewportName,
          reason: viewportValidation.reason,
          requestedWidth: input.viewport.width,
          observedBeforeWidth:
            lastObservedViewportBeforeScreenshot.innerWidth,
          observedAfterWidth: observedViewportAfterScreenshot.innerWidth,
          screenshotWidth: imageSize.width,
          attempt,
        }),
      );
      await input.page.setViewportSize(input.viewport).catch(() => undefined);
      await input.page.waitForTimeout(100).catch(() => undefined);
      continue;
    }

    break;
  }

  return {
    redirect: readCapturedRedirect(input.input.url, input.page.url()),
    observedViewportBeforeScreenshot: lastObservedViewportBeforeScreenshot,
    observedViewport: lastObservedViewport ?? lastObservedViewportBeforeScreenshot,
    viewportValidation:
      lastViewportValidation ??
      createViewportValidation(
        input.viewport,
        lastObservedViewport ??
          lastObservedViewportBeforeScreenshot ?? {
            innerWidth: input.viewport.width,
            innerHeight: input.viewport.height,
            clientWidth: input.viewport.width,
            devicePixelRatio: 1,
          },
        await getPngSize(input.screenshotPath).catch(() => input.viewport),
        lastObservedViewportBeforeScreenshot,
        2,
      ),
  };
}

function createViewportValidation(
  requested: { width: number; height: number },
  observed: {
    innerWidth: number;
    innerHeight: number;
    clientWidth: number;
    devicePixelRatio: number;
  },
  screenshot: { width: number; height: number },
  observedBeforeScreenshot?: {
    innerWidth: number;
    innerHeight: number;
    clientWidth: number;
    devicePixelRatio: number;
  },
  screenshotAttempts = 1,
) {
  const reasons: string[] = [];
  if (
    observedBeforeScreenshot &&
    observedBeforeScreenshot.innerWidth !== observed.innerWidth
  ) {
    reasons.push("viewport-drift-innerWidth");
  }
  if (
    observedBeforeScreenshot &&
    Math.abs(observedBeforeScreenshot.clientWidth - observed.clientWidth) > 1
  ) {
    reasons.push("viewport-drift-clientWidth");
  }
  if (observed.innerWidth !== requested.width) {
    reasons.push("innerWidth-mismatch");
  }
  if (Math.abs(observed.clientWidth - requested.width) > 1) {
    reasons.push("clientWidth-mismatch");
  }
  if (!isTolerableScreenshotWidthMismatch(requested, observed, screenshot)) {
    reasons.push("screenshotWidth-mismatch");
  }
  return {
    requestedWidth: requested.width,
    requestedHeight: requested.height,
    observedBeforeInnerWidth: observedBeforeScreenshot?.innerWidth,
    observedBeforeInnerHeight: observedBeforeScreenshot?.innerHeight,
    observedBeforeClientWidth: observedBeforeScreenshot?.clientWidth,
    observedInnerWidth: observed.innerWidth,
    observedInnerHeight: observed.innerHeight,
    observedClientWidth: observed.clientWidth,
    screenshotWidth: screenshot.width,
    screenshotHeight: screenshot.height,
    screenshotAttempts,
    valid: reasons.length === 0,
    reason: reasons.length > 0 ? reasons.join(",") : undefined,
  };
}

function isTolerableScreenshotWidthMismatch(
  requested: { width: number; height: number },
  observed: {
    innerWidth: number;
    innerHeight: number;
    clientWidth: number;
    devicePixelRatio: number;
  },
  screenshot: { width: number; height: number },
) {
  const screenshotDelta = Math.abs(screenshot.width - requested.width);
  if (screenshotDelta <= 1) return true;

  const exactViewportMatch =
    observed.innerWidth === requested.width &&
    Math.abs(observed.clientWidth - requested.width) <= 1;
  if (!exactViewportMatch) return false;

  const toleratedScrollbarGutterPx = 24;
  return (
    screenshot.width >= requested.width &&
    screenshot.width <= requested.width + toleratedScrollbarGutterPx
  );
}

function shouldRetryViewportScreenshot(
  validation: ReturnType<typeof createViewportValidation>,
) {
  return Boolean(
    validation.reason?.includes("viewport-drift") ||
      validation.reason?.includes("innerWidth-mismatch") ||
      validation.reason?.includes("clientWidth-mismatch") ||
      validation.reason?.includes("screenshotWidth-mismatch"),
  );
}

function applyViewportDriftTestMode(
  observed: ObservedViewport,
  requested: { width: number; height: number },
) {
  if (viewportDriftTestMode === "normal") return observed;
  if (
    viewportDriftTestMode === "force-single-post-screenshot-mismatch" &&
    viewportDriftInjected
  ) {
    return observed;
  }
  viewportDriftInjected = true;
  return {
    ...observed,
    innerWidth: requested.width + 53,
    clientWidth: requested.width + 53,
  };
}

function hasValidCachedResponsiveEvidence(capture?: RuntimeRouteCapture) {
  if (!capture?.captureDiagnostics?.viewportValidation) return false;
  const breakpoints = capture.captureDiagnostics.breakpointsCaptured ?? [];
  const observedWidths = new Set<number>();
  for (const viewportName of breakpoints) {
    const entry = capture.captureDiagnostics.viewportValidation[viewportName];
    if (!entry?.valid) return false;
    if (observedWidths.has(entry.observedInnerWidth)) return false;
    observedWidths.add(entry.observedInnerWidth);
  }
  return observedWidths.size > 0;
}

async function listReusableViewportNames(
  capture: RuntimeRouteCapture | RuntimeCapture | undefined,
  viewportNames: ViewportName[],
) {
  if (!capture?.captureDiagnostics?.viewportValidation) {
    return new Set<ViewportName>();
  }
  const reusable = new Set<ViewportName>();
  const observedWidths = new Set<number>();
  for (const viewportName of viewportNames) {
    if (!hasReusableRoutePhaseEvidence(capture, viewportName)) continue;
    const validation = capture.captureDiagnostics.viewportValidation[viewportName];
    const viewport = capture.viewports[viewportName];
    if (!validation?.valid || !viewport?.screenshotPath) continue;
    if (observedWidths.has(validation.observedInnerWidth)) continue;
    try {
      await fs.stat(viewport.screenshotPath);
      const screenshotSize = await getPngSize(viewport.screenshotPath);
      if (
        Math.abs(screenshotSize.width - validation.screenshotWidth) > 1 ||
        Math.abs(screenshotSize.height - validation.screenshotHeight) > 1 ||
        Math.abs(screenshotSize.width - viewport.width) > 1 ||
        Math.abs(screenshotSize.height - viewport.height) > 1
      ) {
        continue;
      }
      observedWidths.add(validation.observedInnerWidth);
      reusable.add(viewportName);
    } catch {
      continue;
    }
  }
  return reusable;
}

function hasReusableRoutePhaseEvidence(
  capture: RuntimeRouteCapture | RuntimeCapture,
  viewportName: ViewportName,
) {
  const phaseHistory = capture.captureDiagnostics?.phaseHistory ?? [];
  const redirectBacked =
    "redirectTo" in capture && Boolean(capture.redirectTo);

  const hasPhase = (
    phase: RouteCapturePhaseName,
    allowedStatuses: RouteCapturePhaseStatus[],
  ) =>
    phaseHistory.some(
      (record) =>
        record.phase === phase &&
        record.viewportName === viewportName &&
        allowedStatuses.includes(record.status),
    );

  if (!hasPhase(`capture-${viewportName}`, ["completed", "reused"])) {
    return false;
  }
  if (!hasPhase("navigate", ["completed", "reused"])) {
    return false;
  }
  if (
    !hasPhase("stabilize", redirectBacked ? ["completed", "reused", "skipped"] : ["completed", "reused"])
  ) {
    return false;
  }
  if (
    viewportName === "desktop" &&
    !redirectBacked &&
    !hasPhase("route-finalize", ["completed", "reused"])
  ) {
    return false;
  }

  return true;
}

function alignCaptureWithProgressArtifact(
  progress: RouteCaptureProgressArtifact | null | undefined,
  capture: RuntimeRouteCapture | null | undefined,
) {
  if (!progress || !capture) return capture ?? null;
  const aligned: RuntimeRouteCapture = {
    ...capture,
    captureDiagnostics: {
      ...(capture.captureDiagnostics ?? {}),
      breakpointsCaptured:
        progress.capturedViewports.length > 0
          ? progress.capturedViewports
          : (capture.captureDiagnostics?.breakpointsCaptured ?? []),
      phaseHistory: [...progress.phases],
    },
  };
  return aligned;
}

function readBaseViewportCapture(
  baseCapture: RuntimeCapture | RuntimeRouteCapture | undefined,
  viewportName: ViewportName,
) {
  if (!baseCapture) return undefined;
  const viewport = baseCapture.viewports[viewportName];
  if (!viewport) return undefined;
  return {
    viewportName,
    title: baseCapture.title,
    nodes:
      baseCapture.nodesByViewport?.[viewportName] ??
      (viewportName === "desktop" ? baseCapture.nodes : []),
    rootStyles:
      baseCapture.rootStylesByViewport?.[viewportName] ??
      (viewportName === "desktop" ? baseCapture.rootStyles ?? {} : {}),
    viewport,
    viewportValidation:
      baseCapture.captureDiagnostics?.viewportValidation?.[viewportName],
    fontsReady:
      baseCapture.captureDiagnostics?.fontReadiness?.[viewportName] ?? true,
    framerStyleCss:
      viewportName === "desktop" ? baseCapture.framerStyleCss ?? "" : "",
    stylesheetUrls: baseCapture.stylesheetUrls ?? [],
    interactionReplay:
      viewportName === "desktop" ? baseCapture.interactionReplay : undefined,
  };
}

async function navigateForCapture(page: Page, url: string) {
  let lastError: unknown;
  for (let attempt = 1; attempt <= ROUTE_TRANSIENT_RETRY_LIMIT; attempt += 1) {
    try {
      if (
        forcedNavigateNetworkFailureRoutePaths.has(
          normalizeRoutePath(new URL(url).pathname),
        )
      ) {
        throw new Error(`page.goto: net::ERR_NAME_NOT_RESOLVED at ${url}`);
      }
      await page.goto(url, { waitUntil: "commit", timeout: 30_000 });
      return;
    } catch (error) {
      lastError = error;
      const recovered = await page
        .waitForLoadState("domcontentloaded", { timeout: 3_000 })
        .then(
          () =>
            page.evaluate(
              () =>
                Boolean(document.body) &&
                (document.body.childElementCount > 0 ||
                  Boolean(document.body.textContent?.trim())),
            ),
          () => false,
        )
        .catch(() => false);
      if (recovered) {
        console.warn(
          "[coderelay:capture:navigation-recovered]",
          JSON.stringify({ url, attempt, reason: formatError(error) }),
        );
        return;
      }
      if (attempt < ROUTE_TRANSIENT_RETRY_LIMIT && isTransientNetworkError(error)) {
        console.warn(
          "[coderelay:capture:navigation-retry]",
          JSON.stringify({ url, attempt, reason: formatError(error) }),
        );
        await page.waitForTimeout(500 * attempt);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

function formatError(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function isTransientNetworkError(error: unknown) {
  const message = formatError(error);
  return /ERR_INTERNET_DISCONNECTED|ERR_NETWORK_CHANGED|ERR_NAME_NOT_RESOLVED|ERR_CONNECTION_RESET|ERR_CONNECTION_CLOSED|ERR_CONNECTION_REFUSED|ERR_TIMED_OUT|ERR_ADDRESS_UNREACHABLE|ERR_EMPTY_RESPONSE|ERR_ABORTED|ECONNRESET|EPIPE|socket hang up/i.test(
    message,
  );
}

async function probeOriginAvailability(originUrl: string): Promise<{
  reachable: boolean;
  probeUrl: string;
  reason?: string;
}> {
  const probeUrl = new URL("/", originUrl).toString();
  try {
    const response = await withTimeout(
      fetch(probeUrl, {
        method: "GET",
        redirect: "manual",
        headers: {
          "cache-control": "no-cache",
        },
      }),
      NETWORK_AVAILABILITY_PROBE_TIMEOUT_MS,
      `Origin probe timed out after ${Math.round(
        NETWORK_AVAILABILITY_PROBE_TIMEOUT_MS / 1000,
      )}s for ${probeUrl}.`,
    );
    await response.body?.cancel().catch(() => undefined);
    return {
      reachable: true,
      probeUrl,
    };
  } catch (error) {
    return {
      reachable: false,
      probeUrl,
      reason: formatError(error),
    };
  }
}

function isRetriableDomEvaluationError(error: unknown) {
  const message = formatError(error);
  return (
    /Execution context was destroyed/i.test(message) ||
    /Cannot find context with specified id/i.test(message) ||
    /Frame was detached/i.test(message) ||
    /Target page, context or browser has been closed/i.test(message)
  );
}

async function withDomEvaluationRetry<T>(
  page: Page,
  routePath: string,
  phase:
    | "extract-dom"
    | "extract-root-styles"
    | "extract-stylesheets"
    | "read-observed-viewport",
  action: () => Promise<T>,
): Promise<T> {
  try {
    return await action();
  } catch (error) {
    if (!isRetriableDomEvaluationError(error)) throw error;
    console.warn(
      "[coderelay:capture:dom-eval-retry]",
      JSON.stringify({
        routePath,
        phase,
        url: page.url(),
        reason: formatError(error),
      }),
    );
    await page
      .waitForLoadState("domcontentloaded", { timeout: 2_000 })
      .catch(() => undefined);
    await page.waitForTimeout(100).catch(() => undefined);
    return action();
  }
}

async function captureScreenshot(
  page: Page,
  screenshotPath: string,
  fontsReady: boolean,
  clip?: { x: number; y: number; width: number; height: number },
) {
  try {
    if (!fontsReady) {
      await captureScreenshotWithCdp(page, screenshotPath, clip);
      return;
    }
    await page.screenshot({
      path: screenshotPath,
      ...(clip ? { clip } : { fullPage: true }),
      animations: "disabled",
      timeout: 15_000,
    });
  } catch (error) {
    console.warn(
      "[coderelay:capture:screenshot-fallback]",
      JSON.stringify({
        url: page.url(),
        reason: error instanceof Error ? error.message : String(error),
      }),
    );
    await captureScreenshotWithCdp(page, screenshotPath, clip).catch(
      (fallbackError) => {
        console.warn(
          "[coderelay:capture:screenshot-skipped]",
          JSON.stringify({
            url: page.url(),
            reason:
              fallbackError instanceof Error
                ? fallbackError.message
                : String(fallbackError),
          }),
        );
      },
    );
  }
}

async function captureScreenshotWithCdp(
  page: Page,
  screenshotPath: string,
  clip?: { x: number; y: number; width: number; height: number },
) {
  const session = await page.context().newCDPSession(page);
  try {
    const dimensions =
      clip ??
      (await page.evaluate(() => ({
        x: 0,
        y: 0,
        width: Math.max(
          document.documentElement.scrollWidth,
          document.body?.scrollWidth ?? 0,
        ),
        height: Math.max(
          document.documentElement.scrollHeight,
          document.body?.scrollHeight ?? 0,
        ),
      })));
    const result = await session.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: true,
      fromSurface: true,
      clip: { ...dimensions, scale: 1 },
    });
    await fs.writeFile(screenshotPath, Buffer.from(result.data, "base64"));
  } finally {
    await session.detach();
  }
}

async function extractRootStyles(page: Page, selector?: string) {
  return page.evaluate(
    ({ selector, styleProperties }) => {
      const root =
        (selector
          ? document.querySelector(selector)
          : document.body ?? document.documentElement) ??
        document.body ??
        document.documentElement;
      if (!(root instanceof HTMLElement)) return {};
      const styles = window.getComputedStyle(root);
      return Object.fromEntries(
        styleProperties
          .map((property) => [property, styles[property] || ""])
          .filter(([, value]) => Boolean(value)),
      );
    },
    { selector, styleProperties: [...CAPTURED_STYLE_PROPERTIES] },
  );
}

function isExternalRedirect(requestedUrl: string, finalUrl: string) {
  try {
    return new URL(requestedUrl).origin !== new URL(finalUrl).origin;
  } catch {
    return false;
  }
}

function readCapturedRedirect(
  requestedUrl: string,
  finalUrl: string,
): CapturedRedirect | null {
  try {
    const requested = new URL(requestedUrl);
    const final = new URL(finalUrl);
    if (!/^https?:$/.test(final.protocol)) return null;
    const normalize = (value: URL) => `${value.origin}${value.pathname}${value.search}`;
    if (normalize(requested) === normalize(final)) return null;
    if (requested.origin !== final.origin) {
      return {
        redirectTo: final.toString(),
        templateKind: "utility",
      };
    }
    return {
      redirectTo: `${final.pathname}${final.search}${final.hash}`,
      templateKind: "redirect",
    };
  } catch {
    return null;
  }
}

function readExplicitExternalRouteRedirect(route?: {
  routeKind?: ExportRouteKind;
  templateKind?: RuntimeRouteCapture["templateKind"];
  destination?: string;
  destinationKind?: ExportRouteDestinationKind;
  redirectTo?: string;
}): CapturedRedirect | null {
  if (!route) return null;
  const redirectTo =
    typeof route.redirectTo === "string" && route.redirectTo.trim().length > 0
      ? route.redirectTo.trim()
      : typeof route.destination === "string" && route.destination.trim().length > 0
        ? route.destination.trim()
        : null;
  if (!redirectTo) return null;
  if (route.destinationKind !== "external") return null;
  if (route.routeKind !== "redirect" && route.templateKind !== "utility") {
    return null;
  }
  return {
    redirectTo,
    templateKind: "utility",
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

async function showExternalRedirect(page: Page, safeUrl: string) {
  const html =
    `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1">` +
    `<title>External redirect</title><style>` +
    `*{box-sizing:border-box}html,body{margin:0;max-width:100%;overflow-x:hidden}` +
    `main{min-height:100vh;display:grid;place-items:center;max-width:100%;padding:16px}` +
    `a{display:block;max-width:100%;overflow-wrap:anywhere;word-break:break-word}` +
    `</style></head><body><main>` +
    `<a href="${safeUrl}">Continue to ${safeUrl}</a></main></body></html>`;
  // A redirected document may enforce Trusted Types, making setContent unsafe.
  await page.goto(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`, {
    waitUntil: "domcontentloaded",
    timeout: 10_000,
  });
}

function createRedirectPlaceholderNodes(routePath: string, redirectTo: string): RuntimeNode[] {
  return [
    {
      id: `${routePath}::redirect-root`,
      routePath,
      tag: "main",
      domPath: "body:nth-child(1) > main:nth-child(1)",
      text: `Continue to ${redirectTo}`,
      sectionIndex: 0,
      sectionName: "Page",
      rect: { x: 0, y: 0, width: 0, height: 0 },
      attributes: {},
      styles: {
        display: "grid",
        minHeight: "100vh",
        placeItems: "center",
      },
    },
    {
      id: `${routePath}::redirect-link`,
      routePath,
      tag: "a",
      domPath: "body:nth-child(1) > main:nth-child(1) > a:nth-child(1)",
      parentDomPath: "body:nth-child(1) > main:nth-child(1)",
      text: `Continue to ${redirectTo}`,
      sectionIndex: 0,
      sectionName: "Page",
      rect: { x: 0, y: 0, width: 0, height: 0 },
      attributes: {
        href: redirectTo,
      },
      styles: {
        display: "inline-block",
      },
    },
  ];
}

async function waitForFonts(page: Page): Promise<boolean> {
  const fontsReady = page.evaluate<boolean>(`(() => {
      if (!('fonts' in document) || !document.fonts?.ready) return true
      return document.fonts.ready.then(() => true).catch(() => false)
    })()`);
  const timeout = page.waitForTimeout(5_000).then(() => false);

  return Promise.race([fontsReady, timeout]).catch(() => false);
}

async function waitForRenderableContent(page: Page, selector?: string) {
  await page
    .waitForFunction(
      (rootSelector) => {
        const root =
          (rootSelector
            ? document.querySelector(rootSelector)
            : document.body ?? document.documentElement) ??
          document.body ??
          document.documentElement;
        if (!root) return false;

        const rect = root.getBoundingClientRect();
        const hasSize = rect.width > 0 && rect.height > 0;
        const hasFramerNodes = Boolean(
          document.querySelector(
            '[data-framer-name], [class*="framer-"], main, section',
          ),
        );
        const textRoot = document.body ?? document.documentElement ?? root;
        const hasText = (textRoot.textContent ?? "").trim().length > 0;

        return document.readyState !== "loading" && hasSize && (hasFramerNodes || hasText);
      },
      selector ?? null,
      { timeout: 20_000 },
    )
    .catch(() => undefined);
  await page.waitForTimeout(750);
}

async function extractStylesheets(page: Page): Promise<string[]> {
  return page.evaluate(`(() => {
    const urls = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map((link) => link.getAttribute('href') || '')
      .filter(Boolean)
      .map((href) => {
        try {
          return new URL(href, window.location.href).toString()
        } catch {
          return ''
        }
      })
      .filter(Boolean)

    // Framer-managed selectors often live in published stylesheet bundles.
    return Array.from(new Set(urls))
  })()`);
}

async function collectInteractionStyles(page: Page, nodes: RuntimeNode[]) {
  const actionableNodes = nodes.filter(isActionableRuntimeNode).slice(0, 16);
  if (actionableNodes.length === 0) return nodes;

  const byDomPath = new Map<string, RuntimeNode>();
  for (const node of nodes) {
    byDomPath.set(node.domPath, node);
  }

  for (const node of actionableNodes) {
    try {
      const interactionStyles = await captureInteractionStatesForNode(
        page,
        node.domPath,
      );
      if (!interactionStyles) continue;
      const target = byDomPath.get(node.domPath);
      if (!target) continue;
      target.interactionStyles = interactionStyles;
    } catch {
      continue;
    }
  }

  return nodes;
}

async function collectInteractionStylesWithinBudget(
  page: Page,
  nodes: RuntimeNode[],
  routePath: string,
  viewportName: ViewportName,
  warnings: string[],
) {
  try {
    return await withTimeout(
      collectInteractionStyles(page, nodes),
      INTERACTION_STYLE_COLLECTION_TIMEOUT_MS,
      `Interaction-style collection exceeded ${Math.round(
        INTERACTION_STYLE_COLLECTION_TIMEOUT_MS / 1000,
      )}s at ${viewportName}.`,
    );
  } catch (error) {
    const reason = formatError(error);
    warnings.push(
      `Route ${routePath} interaction-style collection skipped at ${viewportName}: ${reason}`,
    );
    console.warn(
      "[coderelay:capture:interaction-style-skipped]",
      JSON.stringify({
        routePath,
        viewportName,
        reason,
      }),
    );
    return nodes;
  }
}

async function collectSafeInteractionReplay(
  page: Page,
  selector: string | undefined,
  captureDir: string,
  routePath: string,
  viewport: ViewportName,
  timeoutMs: number,
): Promise<RuntimeInteractionReplayRecord[]> {
  const replayDir = path.join(captureDir, "replay");
  await fs.mkdir(replayDir, { recursive: true });
  const baseUrl = page.url();
  const deadlineAt = Date.now() + timeoutMs;
  const candidates = await annotateReplayCandidates(page, selector);
  if (candidates.length === 0) return [];

  const requestStats = {
    totalRequests: 0,
    fetchRequests: 0,
    xhrRequests: 0,
    documentRequests: 0,
    blockedRequests: 0,
    blockedNavigationRequests: 0,
    blockedMutationRequests: 0,
  };
  const routeHandler = async (route: Route) => {
    const request = route.request();
    requestStats.totalRequests += 1;
    if (request.resourceType() === "fetch") requestStats.fetchRequests += 1;
    if (request.resourceType() === "xhr") requestStats.xhrRequests += 1;
    if (request.isNavigationRequest()) requestStats.documentRequests += 1;

    const method = request.method().toUpperCase();
    const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
    const isMainFrameNavigation =
      request.isNavigationRequest() &&
      request.frame() === page.mainFrame() &&
      request.url() !== baseUrl;

    if (isMainFrameNavigation) {
      requestStats.blockedRequests += 1;
      requestStats.blockedNavigationRequests += 1;
      await route.abort();
      return;
    }
    if (isMutation) {
      requestStats.blockedRequests += 1;
      requestStats.blockedMutationRequests += 1;
      await route.abort();
      return;
    }
    await route.continue();
  };
  await page.route("**/*", routeHandler);

  const records: RuntimeInteractionReplayRecord[] = [];
  try {
    for (let index = 0; index < Math.min(candidates.length, 4); index += 1) {
      try {
        assertReplayBudget(deadlineAt, timeoutMs, "before-candidate");
      } catch (error) {
        if (isInteractionReplayBudgetExceeded(error)) {
          break;
        }
        throw error;
      }
      const candidate = candidates[index]!;
      const beforeDomSnapshot = await readReplayDomSnapshot(page, selector);
      const beforeStyles = await readReplayCandidateStyles(page, candidate.id);
      const beforeAnimation = await readReplayAnimationSnapshot(page, candidate.id);
      const beforeScreenshotPath = path.join(
        replayDir,
        `${viewport}-${index + 1}-before.png`,
      );
      await writeReplayScreenshot(
        page,
        beforeScreenshotPath,
        deadlineAt,
        timeoutMs,
      );

      if (!candidate.allowed) {
        records.push({
          id: `${routePath}:${viewport}:${candidate.id}:blocked-click`,
          routePath,
          viewport,
          action: "blocked-click",
          target: candidate.target,
          allowed: false,
          blockedReason: candidate.blockedReason,
          beforeDomSignature: hashReplaySnapshot(beforeDomSnapshot),
          beforeComputedStyles: beforeStyles,
          beforeScreenshotPath,
          urlChanged: false,
          networkActivity: diffReplayStats(
            { ...requestStats },
            requestStats,
          ),
          consoleErrors: [],
          animationSamples: { before: beforeAnimation },
          stateChanged: false,
          provenance: "runtime",
        });
        continue;
      }

      records.push(
        await executeReplayAction({
          page,
          selector,
          routePath,
          viewport,
          replayDir,
          index,
          candidate,
          action: "click",
          keyPress: undefined,
          beforeDomSnapshot,
          beforeStyles,
          beforeAnimation,
          beforeScreenshotPath,
          beforeUrl: page.url(),
          statsBeforeAction: { ...requestStats },
          requestStats,
          deadlineAt,
          timeoutMs,
        }),
      );

      if (!(await resetReplayPage(page, baseUrl, selector, deadlineAt, timeoutMs))) {
        break;
      }
      await annotateReplayCandidates(page, selector);

      if (!hasReplayBudgetForReset(deadlineAt)) {
        break;
      }
      const refreshedCandidates = await annotateReplayCandidates(page, selector);
      const refreshedCandidate = refreshedCandidates.find(
        (entry) => entry.id === candidate.id,
      ) ?? candidate;

      records.push(
        await executeReplayAction({
          page,
          selector,
          routePath,
          viewport,
          replayDir,
          index,
          candidate: refreshedCandidate,
          action: "keyboard-enter",
          keyPress: "Enter",
          beforeDomSnapshot: await readReplayDomSnapshot(page, selector),
          beforeStyles: await readReplayCandidateStyles(page, refreshedCandidate.id),
          beforeAnimation: await readReplayAnimationSnapshot(page, refreshedCandidate.id),
          beforeScreenshotPath: await writeReplayScreenshot(
            page,
            path.join(replayDir, `${viewport}-${index + 1}-keyboard-before.png`),
            deadlineAt,
            timeoutMs,
          ),
          beforeUrl: page.url(),
          statsBeforeAction: { ...requestStats },
          requestStats,
          deadlineAt,
          timeoutMs,
        }),
      );

      if (!(await resetReplayPage(page, baseUrl, selector, deadlineAt, timeoutMs))) {
        break;
      }
    }
  } finally {
    await page.unroute("**/*", routeHandler).catch(() => undefined);
  }

  return records;
}

async function resetReplayPage(
  page: Page,
  baseUrl: string,
  selector: string | undefined,
  deadlineAt: number,
  timeoutMs: number,
) {
  if (!hasReplayBudgetForReset(deadlineAt)) {
    return false;
  }
  try {
    await page.goto(baseUrl, {
      waitUntil: "domcontentloaded",
      timeout: remainingReplayBudget(deadlineAt, 15_000, timeoutMs),
    });
  } catch (error) {
    if (isInteractionReplayBudgetExceeded(error) || isReplayResetTimeout(error)) {
      return false;
    }
    throw error;
  }
  await waitForRenderableContent(page, selector);
  return true;
}

function hasReplayBudgetForReset(deadlineAt: number) {
  return deadlineAt - Date.now() >= INTERACTION_REPLAY_MIN_RESET_BUDGET_MS;
}

async function executeReplayAction(input: {
  page: Page;
  selector: string | undefined;
  routePath: string;
  viewport: ViewportName;
  replayDir: string;
  index: number;
  candidate: Awaited<ReturnType<typeof annotateReplayCandidates>>[number];
  action: "click" | "keyboard-enter";
  keyPress?: string;
  beforeDomSnapshot: string;
  beforeStyles: Record<string, string>;
  beforeAnimation: Record<string, string>;
  beforeScreenshotPath: string;
  beforeUrl: string;
  statsBeforeAction: RuntimeInteractionReplayRecord["networkActivity"];
  requestStats: RuntimeInteractionReplayRecord["networkActivity"];
  deadlineAt: number;
  timeoutMs: number;
}) {
  const consoleErrors: string[] = [];
  const onConsole = (message: { type(): string; text(): string }) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  };
  input.page.on("console", onConsole);
  try {
    const locator = input.page.locator(
      `[data-coderelay-replay-id="${input.candidate.id}"]`,
    );
    if ((await locator.count()) === 0) {
      return {
        id: `${input.routePath}:${input.viewport}:${input.candidate.id}:${input.action}`,
        routePath: input.routePath,
        viewport: input.viewport,
        action: input.action,
        target: input.candidate.target,
        allowed: false,
        blockedReason: "candidate-missing-after-reset",
        beforeDomSignature: hashReplaySnapshot(input.beforeDomSnapshot),
        beforeComputedStyles: input.beforeStyles,
        beforeScreenshotPath: input.beforeScreenshotPath,
        urlChanged: false,
        networkActivity: diffReplayStats(
          input.statsBeforeAction,
          input.requestStats,
        ),
        consoleErrors,
        animationSamples: { before: input.beforeAnimation },
        stateChanged: false,
        provenance: "runtime" as const,
      };
    }

    try {
      assertReplayBudget(input.deadlineAt, input.timeoutMs, "before-action");
      if (input.keyPress) {
        await locator.focus({ timeout: remainingReplayBudget(input.deadlineAt, 2_000, input.timeoutMs) });
        await input.page.keyboard.press(input.keyPress);
      } else {
        await locator.click({
          timeout: remainingReplayBudget(input.deadlineAt, 2_000, input.timeoutMs),
        });
      }
    } catch (error) {
      return {
        id: `${input.routePath}:${input.viewport}:${input.candidate.id}:${input.action}`,
        routePath: input.routePath,
        viewport: input.viewport,
        action: input.action,
        target: input.candidate.target,
        allowed: false,
        blockedReason: formatError(error),
        beforeDomSignature: hashReplaySnapshot(input.beforeDomSnapshot),
        beforeComputedStyles: input.beforeStyles,
        beforeScreenshotPath: input.beforeScreenshotPath,
        urlChanged: false,
        networkActivity: diffReplayStats(
          input.statsBeforeAction,
          input.requestStats,
        ),
        consoleErrors,
        animationSamples: { before: input.beforeAnimation },
        stateChanged: false,
        provenance: "runtime" as const,
      };
    }

    await input.page.waitForTimeout(
      Math.min(250, remainingReplayBudget(input.deadlineAt, 250, input.timeoutMs)),
    );
    const afterDomSnapshot = await readReplayDomSnapshot(input.page, input.selector);
    const afterStyles = await readReplayCandidateStyles(
      input.page,
      input.candidate.id,
    );
    const afterAnimation = await readReplayAnimationSnapshot(
      input.page,
      input.candidate.id,
    );
    const afterScreenshotPath = await writeReplayScreenshot(
      input.page,
      path.join(
        input.replayDir,
        `${input.viewport}-${input.index + 1}-${input.action}-after.png`,
      ),
      input.deadlineAt,
      input.timeoutMs,
    );
    return {
      id: `${input.routePath}:${input.viewport}:${input.candidate.id}:${input.action}`,
      routePath: input.routePath,
      viewport: input.viewport,
      action: input.action,
      target: input.candidate.target,
      allowed: true,
      beforeDomSignature: hashReplaySnapshot(input.beforeDomSnapshot),
      afterDomSignature: hashReplaySnapshot(afterDomSnapshot),
      beforeComputedStyles: input.beforeStyles,
      afterComputedStyles: afterStyles,
      beforeScreenshotPath: input.beforeScreenshotPath,
      afterScreenshotPath,
      urlChanged: input.page.url() !== input.beforeUrl,
      networkActivity: diffReplayStats(
        input.statsBeforeAction,
        input.requestStats,
      ),
      consoleErrors,
      animationSamples: {
        before: input.beforeAnimation,
        after: afterAnimation,
      },
      stateChanged:
        hashReplaySnapshot(input.beforeDomSnapshot) !==
          hashReplaySnapshot(afterDomSnapshot) ||
        JSON.stringify(input.beforeStyles) !== JSON.stringify(afterStyles),
      provenance: "runtime" as const,
    };
  } finally {
    input.page.off("console", onConsole);
  }
}

function diffReplayStats(
  before: RuntimeInteractionReplayRecord["networkActivity"],
  after: RuntimeInteractionReplayRecord["networkActivity"],
) {
  return {
    totalRequests: after.totalRequests - before.totalRequests,
    fetchRequests: after.fetchRequests - before.fetchRequests,
    xhrRequests: after.xhrRequests - before.xhrRequests,
    documentRequests: after.documentRequests - before.documentRequests,
    blockedRequests: after.blockedRequests - before.blockedRequests,
    blockedNavigationRequests:
      after.blockedNavigationRequests - before.blockedNavigationRequests,
    blockedMutationRequests:
      after.blockedMutationRequests - before.blockedMutationRequests,
  };
}

async function annotateReplayCandidates(page: Page, selector?: string) {
  return page.evaluate((activeSelector) => {
    const root =
      (activeSelector
        ? document.querySelector(activeSelector)
        : document.body ?? document.documentElement) ??
      document.body ??
      document.documentElement;
    if (!(root instanceof HTMLElement)) return [];

    root.querySelectorAll("[data-coderelay-replay-id]").forEach((element) => {
      element.removeAttribute("data-coderelay-replay-id");
    });

    return Array.from(
      root.querySelectorAll<HTMLElement>(
        'button, [role="button"], [role="tab"], [aria-controls], [aria-expanded]',
      ),
    )
      .filter((element) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          Number(style.opacity || "1") > 0 &&
          rect.width > 0 &&
          rect.height > 0
        );
      })
      .slice(0, 6)
      .map((element, index) => {
        const blockedReason =
          element.closest("form")
            ? "inside-form"
            : element instanceof HTMLButtonElement &&
                ["submit", "reset"].includes(element.type)
              ? `button-type-${element.type}`
              : element.closest('a[href]')
                ? "inside-anchor"
                : element.hasAttribute("disabled") ||
                    element.getAttribute("aria-disabled") === "true"
                  ? "disabled"
                  : undefined;
        const id = `candidate-${index + 1}`;
        element.setAttribute("data-coderelay-replay-id", id);
        return {
          id,
          allowed: !blockedReason,
          blockedReason,
          target: {
            tag: element.tagName.toLowerCase(),
            text: element.textContent?.trim().slice(0, 120),
            role: element.getAttribute("role") ?? undefined,
            name:
              element.getAttribute("aria-label") ??
              element.getAttribute("name") ??
              undefined,
          },
        };
      });
  }, selector);
}

async function readReplayDomSnapshot(page: Page, selector?: string) {
  return page.evaluate((activeSelector) => {
    const root =
      (activeSelector
        ? document.querySelector(activeSelector)
        : document.body ?? document.documentElement) ??
      document.body ??
      document.documentElement;
    if (!(root instanceof HTMLElement)) return "";
    return JSON.stringify({
      html: root.innerHTML.slice(0, 20_000),
      text: root.textContent?.trim().slice(0, 4_000) ?? "",
      nodeCount: root.querySelectorAll("*").length,
      ariaExpanded: Array.from(root.querySelectorAll("[aria-expanded]")).map(
        (element) => ({
          tag: element.tagName.toLowerCase(),
          value: element.getAttribute("aria-expanded"),
          text: element.textContent?.trim().slice(0, 60) ?? "",
        }),
      ),
    });
  }, selector);
}

async function readReplayCandidateStyles(
  page: Page,
  id: string,
): Promise<Record<string, string>> {
  return page.evaluate((replayId) => {
    const element = document.querySelector<HTMLElement>(
      `[data-coderelay-replay-id="${replayId}"]`,
    );
    if (!element) return {} as Record<string, string>;
    const style = window.getComputedStyle(element);
    return {
      display: style.display ?? "",
      visibility: style.visibility ?? "",
      opacity: style.opacity ?? "",
      color: style.color ?? "",
      backgroundColor: style.backgroundColor ?? "",
      transform: style.transform ?? "",
      width: style.width ?? "",
      height: style.height ?? "",
      ariaExpanded: element.getAttribute("aria-expanded") ?? "",
      ariaSelected: element.getAttribute("aria-selected") ?? "",
    };
  }, id);
}

async function readReplayAnimationSnapshot(
  page: Page,
  id: string,
): Promise<Record<string, string>> {
  return page.evaluate((replayId) => {
    const element = document.querySelector<HTMLElement>(
      `[data-coderelay-replay-id="${replayId}"]`,
    );
    if (!element) return {} as Record<string, string>;
    const style = window.getComputedStyle(element);
    return {
      transitionProperty: style.transitionProperty ?? "",
      transitionDuration: style.transitionDuration ?? "",
      transitionTimingFunction: style.transitionTimingFunction ?? "",
      animationName: style.animationName ?? "",
      animationDuration: style.animationDuration ?? "",
      animationTimingFunction: style.animationTimingFunction ?? "",
    };
  }, id);
}

async function writeReplayScreenshot(
  page: Page,
  targetPath: string,
  deadlineAt: number,
  timeoutMs: number,
) {
  assertReplayBudget(deadlineAt, timeoutMs, "replay-screenshot");
  try {
    await captureScreenshotWithCdp(page, targetPath);
  } catch (error) {
    console.warn(
      "[coderelay:capture:interaction-replay-screenshot-fallback]",
      JSON.stringify({
        url: page.url(),
        reason: formatError(error),
      }),
    );
    await page.screenshot({
      path: targetPath,
      animations: "disabled",
      timeout: remainingReplayBudget(deadlineAt, 2_000, timeoutMs),
    });
  }
  return targetPath;
}

function hashReplaySnapshot(value: string) {
  return crypto.createHash("sha1").update(value).digest("hex");
}

function assertReplayBudget(
  deadlineAt: number,
  timeoutMs: number,
  stage: string,
) {
  if (Date.now() < deadlineAt) return;
  throw new Error(
    `Interaction replay exceeded ${Math.ceil(timeoutMs / 1_000)} seconds (${stage})`,
  );
}

function remainingReplayBudget(
  deadlineAt: number,
  capMs: number,
  timeoutMs: number,
) {
  const remainingMs = deadlineAt - Date.now();
  if (remainingMs <= 0) {
    throw new Error(
      `Interaction replay exceeded ${Math.ceil(timeoutMs / 1_000)} seconds`,
    );
  }
  return Math.max(1, Math.min(capMs, remainingMs));
}

function isInteractionReplayTeardownError(message: string) {
  return (
    /Target page, context or browser has been closed/i.test(message) ||
    /page\.(goto|waitForTimeout|click|focus|screenshot):[\s\S]*has been closed/i.test(
      message,
    ) ||
    /browser has been closed/i.test(message) ||
    /context has been closed/i.test(message)
  );
}

function isInteractionReplayBudgetExceeded(error: unknown) {
  const message = formatError(error);
  return /Interaction replay exceeded \d+ seconds/i.test(message);
}

function isReplayResetTimeout(error: unknown) {
  const message = formatError(error);
  return /page\.goto: Timeout \d+ms exceeded/i.test(message);
}

async function captureInteractionStatesForNode(page: Page, domPath: string) {
  if (interactionStyleCollectionTestMode === "slow") {
    await page.waitForTimeout(INTERACTION_STYLE_COLLECTION_TIMEOUT_MS + 250);
  }
  const locator = page.locator(domPath).first();
  const visible = await locator
    .evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    })
    .catch(() => false);
  if (!visible) return undefined;

  const baseStyles = await readComputedStylesForInteraction(locator);
  if (!baseStyles) return undefined;

  const hoverStyles = await captureHoverStyles(page, locator, baseStyles);
  const focusStyles = await captureFocusStyles(page, locator, baseStyles);
  const interactionStyles = {
    ...(hoverStyles ? { hover: hoverStyles } : {}),
    ...(focusStyles ? { focus: focusStyles } : {}),
  };

  return Object.keys(interactionStyles).length > 0 ? interactionStyles : undefined;
}

async function captureHoverStyles(
  page: Page,
  locator: Locator,
  baseStyles: Record<string, string>,
) {
  await page.mouse.move(0, 0).catch(() => {});
  const canHover = await locator.hover({ force: true, timeout: 500 }).then(
    () => true,
    () => false,
  );
  if (!canHover) return undefined;
  await page.waitForTimeout(40);
  const hoveredStyles = await readComputedStylesForInteraction(locator);
  await page.mouse.move(0, 0).catch(() => {});
  if (!hoveredStyles) return undefined;
  const diff = diffInteractionStyles(baseStyles, hoveredStyles);
  return Object.keys(diff).length > 0 ? diff : undefined;
}

async function captureFocusStyles(
  page: Page,
  locator: Locator,
  baseStyles: Record<string, string>,
) {
  const canFocus = await locator.focus().then(
    () => true,
    () => false,
  );
  if (!canFocus) return undefined;
  await page.waitForTimeout(20);
  const focusedStyles = await readComputedStylesForInteraction(locator);
  await locator.evaluate((element) => {
    if (element instanceof HTMLElement) {
      element.blur();
    }
  }).catch(() => {});
  await page.waitForTimeout(20);
  if (!focusedStyles) return undefined;
  const diff = diffInteractionStyles(baseStyles, focusedStyles);
  return Object.keys(diff).length > 0 ? diff : undefined;
}

async function readComputedStylesForInteraction(
  locator: Locator,
) {
  return locator
    .evaluate(
      (element, properties) => {
        const styles = window.getComputedStyle(element)
        return Object.fromEntries(
          properties
            .map((property) => [property, styles[property as keyof CSSStyleDeclaration] || ""])
            .filter(([, value]) => Boolean(value)),
        )
      },
      INTERACTION_STYLE_PROPERTIES,
    )
    .catch(() => undefined);
}

function diffInteractionStyles(
  baseStyles: Record<string, string>,
  stateStyles: Record<string, string>,
) {
  const diff: Record<string, string> = {};
  for (const [property, value] of Object.entries(stateStyles)) {
    if (!value) continue;
    if ((baseStyles[property] ?? "") === value) continue;
    diff[property] = value;
  }
  return diff;
}

function isActionableRuntimeNode(node: RuntimeNode) {
  return (
    node.tag === "a" ||
    node.tag === "button" ||
    node.attributes.role === "button" ||
    node.attributes.role === "link" ||
    Boolean(node.attributes.href) ||
    node.styles.cursor === "pointer" ||
    hasMotionMetadata(node.motion)
  );
}

function hasMotionMetadata(motion: RuntimeNode["motion"]) {
  if (!motion) return false;
  return MOTION_STYLE_PROPERTIES.some((property) => {
    const value = motion[property];
    return typeof value === "string" && value.trim().length > 0 && value !== "none" && value !== "0s";
  });
}

async function downloadStylesheets(urls: string[], sourceUrl: string): Promise<string> {
  const sourceOrigin = new URL(sourceUrl).origin;
  const filtered = urls
    .filter((url) => {
      if (!/^https?:\/\//.test(url)) return false;
      try {
        const parsed = new URL(url);
        return (
          parsed.origin === sourceOrigin ||
          parsed.hostname.endsWith("framerusercontent.com") ||
          parsed.hostname.endsWith("framer.com") ||
          parsed.hostname.endsWith("framerstatic.com")
        );
      } catch {
        return false;
      }
    })
    .slice(0, 32);
  if (filtered.length === 0) return "";

  const chunks = (
    await Promise.all(
      filtered.map(async (url) => {
        try {
          const response = await fetch(url, {
            headers: {
              "user-agent": "coderelay-exporter/1.0",
              connection: "close",
            },
            signal: AbortSignal.timeout(8_000),
          });
          if (!response.ok) return "";
          const css = await response.text();
          if (!css.trim()) return "";
          const sanitized = css.replaceAll(/@charset\s+[^;]+;/gi, "");
          return `/* source: ${url} */\n${sanitized}`;
        } catch {
          return "";
        }
      }),
    )
  ).filter(Boolean);

  return chunks.join("\n\n").slice(0, 2_000_000);
}

async function resolveRootHandle(page: Page, selector?: string) {
  if (selector) {
    const selected = await page.$(selector);

    if (!selected) {
      throw new Error(`No element found for selector: ${selector}`);
    }

    return selected;
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

    return candidates[0] ?? document.body ?? document.documentElement
  }`);

  const rootElement =
    handle.asElement() ?? (await page.$("body")) ?? (await page.$("html"));
  if (!rootElement) {
    throw new Error("Unable to resolve a capture root element.");
  }
  return rootElement;
}

async function getClip(
  rootHandle: ElementHandle<Element>,
  viewport: { width: number; height: number },
) {
  const box = await rootHandle.boundingBox();

  if (!box) {
    return {
      x: 0,
      y: 0,
      width: viewport.width,
      height: viewport.height,
    };
  }

  return {
    x: Math.max(0, box.x),
    y: Math.max(0, box.y),
    width: Math.min(viewport.width, Math.max(1, box.width)),
    height: Math.min(2400, Math.max(1, box.height)),
  };
}

async function extractNodes(
  page: Page,
  selector?: string,
  routePath = "/",
): Promise<RuntimeNode[]> {
  const rootSelector = JSON.stringify(selector ?? null);
  const route = JSON.stringify(routePath);
  const styleProperties = JSON.stringify(CAPTURED_STYLE_PROPERTIES);

  return page.evaluate(`(() => {
    const rootSelector = ${rootSelector}
    const routePath = ${route}
    const styleProperties = ${styleProperties}
    const root = rootSelector
      ? document.querySelector(rootSelector)
      : document.body ?? document.documentElement
    const base = root ?? document.body ?? document.documentElement
    if (!(base instanceof Element)) return []
    const ignoredTags = new Set(['script', 'style', 'noscript', 'template', 'meta', 'link'])
    const textLikeTags = new Set([
      'p',
      'span',
      'li',
      'a',
      'button',
      'label',
      'strong',
      'em',
      'small',
      'blockquote',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
    ])

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

    const readText = (element) => {
      const tag = element.tagName.toLowerCase()
      if (!textLikeTags.has(tag)) return undefined

      const directText = Array.from(element.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent || '')
        .join(' ')
        .trim()
        .replace(/\\s+/g, ' ')
      if (directText) return directText.slice(0, 500)

      const ownsOnlyText =
        !Array.from(element.querySelectorAll('*')).some((descendant) =>
          textLikeTags.has(descendant.tagName.toLowerCase())
        )
      if (!ownsOnlyText) return undefined
      const text = element.innerText?.trim().replace(/\\s+/g, ' ').slice(0, 500)
      return text || undefined
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

    const inheritedProperties = new Set([
      'fontSize',
      'fontFamily',
      'fontWeight',
      'fontStyle',
      'lineHeight',
      'letterSpacing',
      'textAlign',
      'textTransform',
      'textDecoration',
      'whiteSpace',
      'wordBreak',
      'color',
      'cursor',
    ])
    const defaultValues = {
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      left: 'auto',
      position: 'static',
      fontStyle: 'normal',
      letterSpacing: 'normal',
      textTransform: 'none',
      textDecoration: 'none',
      whiteSpace: 'normal',
      wordBreak: 'normal',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      backgroundImage: 'none',
      backgroundBlendMode: 'normal',
      backgroundPosition: '0% 0%',
      backgroundSize: 'auto',
      backgroundRepeat: 'repeat',
      borderRadius: '0px',
      boxShadow: 'none',
      transform: 'none',
      opacity: '1',
      marginTop: '0px',
      marginRight: '0px',
      marginBottom: '0px',
      marginLeft: '0px',
      paddingTop: '0px',
      paddingRight: '0px',
      paddingBottom: '0px',
      paddingLeft: '0px',
      minWidth: '0px',
      minHeight: '0px',
      maxWidth: 'none',
      maxHeight: 'none',
      gridTemplateColumns: 'none',
      gridTemplateRows: 'none',
      gridAutoFlow: 'row',
      gridColumn: 'auto',
      gridRow: 'auto',
      justifyContent: 'normal',
      alignItems: 'normal',
      gap: 'normal',
      rowGap: 'normal',
      columnGap: 'normal',
      alignSelf: 'auto',
      justifySelf: 'auto',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      overflow: 'visible',
      overflowX: 'visible',
      overflowY: 'visible',
      objectFit: 'fill',
      objectPosition: '50% 50%',
      aspectRatio: 'auto',
      pointerEvents: 'auto',
      zIndex: 'auto',
      cursor: 'auto',
    }
    const compactStyles = (element, styles, captureRoot) => {
      const emittedParent =
        element.parentElement && element.parentElement !== captureRoot
      const parentStyles = emittedParent
        ? window.getComputedStyle(element.parentElement)
        : null
      const output = {}

      for (const property of styleProperties) {
        const value = styles[property] || ''
        if (!value) continue
        if (property === 'background' || property === 'margin' || property === 'padding') continue
        if (property === 'placeItems' || property === 'placeContent' || property === 'placeSelf') continue
        if (defaultValues[property] === value) continue
        if (property === 'border' && value.startsWith('0px none')) continue
        if (
          inheritedProperties.has(property) &&
          parentStyles &&
          parentStyles[property] === value
        ) {
          continue
        }
        if (
          !styles.display.includes('grid') &&
          property.startsWith('grid')
        ) {
          continue
        }
        if (
          !styles.display.includes('flex') &&
          ['flexDirection', 'flexWrap', 'justifyContent', 'alignItems'].includes(property)
        ) {
          continue
        }
        output[property] = value
      }

      if (styles.paddingTop !== '0px' || styles.paddingRight !== '0px' ||
          styles.paddingBottom !== '0px' || styles.paddingLeft !== '0px') {
        output.padding = styles.padding
        delete output.paddingTop
        delete output.paddingRight
        delete output.paddingBottom
        delete output.paddingLeft
      }
      if (styles.marginTop !== '0px' || styles.marginRight !== '0px' ||
          styles.marginBottom !== '0px' || styles.marginLeft !== '0px') {
        output.margin = styles.margin
        delete output.marginTop
        delete output.marginRight
        delete output.marginBottom
        delete output.marginLeft
      }
      if (styles.overflowX === styles.overflowY && styles.overflow !== 'visible') {
        output.overflow = styles.overflow
        delete output.overflowX
        delete output.overflowY
      }
      return output
    }
    const compactMotion = (styles) => {
      const hasTransition =
        styles.transitionDuration !== '0s' &&
        styles.transitionProperty !== 'none'
      const hasAnimation =
        styles.animationName !== 'none' &&
        styles.animationDuration !== '0s'
      if (!hasTransition && !hasAnimation) return undefined
      return {
        ...(hasTransition
          ? {
              transitionProperty: styles.transitionProperty,
              transitionDuration: styles.transitionDuration,
              transitionTimingFunction: styles.transitionTimingFunction,
              transitionDelay: styles.transitionDelay,
            }
          : {}),
        ...(hasAnimation
          ? {
              animationName: styles.animationName,
              animationDuration: styles.animationDuration,
              animationTimingFunction: styles.animationTimingFunction,
              animationDelay: styles.animationDelay,
              animationIterationCount: styles.animationIterationCount,
              animationDirection: styles.animationDirection,
              animationFillMode: styles.animationFillMode,
            }
          : {}),
        transformOrigin: styles.transformOrigin,
      }
    }

    return Array.from(base.querySelectorAll('*'))
      .filter((element) => !ignoredTags.has(element.tagName.toLowerCase()))
      .map((element, index) => {
        const rect = element.getBoundingClientRect()
        const styles = window.getComputedStyle(element)
        const section = sectionFor(element)
        const styleMap = compactStyles(element, styles, base)

        return {
          id: routePath + '::' + (element.id || 'node-' + (index + 1)),
          routePath,
          tag: element.tagName.toLowerCase(),
          domPath: pathFor(element),
          parentDomPath:
            element.parentElement && element.parentElement !== base
              ? pathFor(element.parentElement)
              : undefined,
          text: readText(element),
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
            href:
              element.href && new URL(element.href, window.location.href).origin === window.location.origin
                ? new URL(element.href, window.location.href).pathname +
                  new URL(element.href, window.location.href).search +
                  new URL(element.href, window.location.href).hash
                : element.href || undefined,
            alt: element.alt || undefined,
            role: element.getAttribute('role') || undefined,
            className: element.className || undefined,
            dataFramerName: element.getAttribute('data-framer-name') || undefined,
          },
          styles: styleMap,
          motion: compactMotion(styles),
        }
      })
      .filter((node) => node.rect.width > 0 && node.rect.height > 0)
  })()`);
}

async function getPngSize(filePath: string) {
  const png = PNG.sync.read(await fs.readFile(filePath));

  return {
    width: png.width,
    height: png.height,
  };
}

function unique<T>(values: T[], key?: (value: T) => string) {
  if (!key) return Array.from(new Set(values));
  const seen = new Set<string>();
  return values.filter((value) => {
    const identity = key(value);
    if (seen.has(identity)) return false;
    seen.add(identity);
    return true;
  });
}
