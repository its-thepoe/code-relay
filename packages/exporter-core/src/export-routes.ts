import type { PluginCanvasCapture } from "../../shared/src/types.js";
import { classifyRouteDestinationKind } from "../../shared/src/route-contract.js";

export const EXPORT_ROUTE_SCHEMA_VERSION = 1;

export type ExportRouteTemplate = "static" | "cms";
export type ExportRouteKind = "page" | "redirect";
export type ExportRouteDestinationKind = "internal" | "external";
export type ExportRouteTemplateKind =
  | ExportRouteTemplate
  | "redirect"
  | "utility";

export type NormalizedExportRoute = {
  schemaVersion: typeof EXPORT_ROUTE_SCHEMA_VERSION;
  path: string;
  title: string;
  collectionId?: string;
  templateId: string;
  templatePath: string;
  kind: ExportRouteKind;
  templateKind: ExportRouteTemplateKind;
  template?: ExportRouteTemplate;
  destination?: string;
  destinationKind?: ExportRouteDestinationKind;
  redirectTo?: string;
  redirectStatus?: number;
};

export function normalizeExportRoutePath(value: string): string {
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

export function readRedirectTargetFromRecord(
  source: Record<string, unknown>,
): string | undefined {
  for (const key of [
    "redirectTo",
    "redirectUrl",
    "targetUrl",
    "destination",
    "destinationUrl",
    "externalUrl",
  ]) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  const link =
    source.link && typeof source.link === "object"
      ? (source.link as Record<string, unknown>)
      : null;
  if (link) {
    for (const key of ["url", "href", "path", "target"]) {
      const value = link[key];
      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }
  }

  const metadata =
    source.metadata && typeof source.metadata === "object"
      ? (source.metadata as Record<string, unknown>)
      : null;
  if (metadata) {
    return readRedirectTargetFromRecord(metadata);
  }

  return undefined;
}

export function readRedirectStatusFromRecord(
  source: Record<string, unknown>,
): number | undefined {
  for (const key of ["redirectStatus", "statusCode", "status"]) {
    const value = source[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && /^\d{3}$/.test(value.trim())) {
      return Number(value.trim());
    }
  }

  const metadata =
    source.metadata && typeof source.metadata === "object"
      ? (source.metadata as Record<string, unknown>)
      : null;
  if (metadata) {
    return readRedirectStatusFromRecord(metadata);
  }

  return undefined;
}

export function normalizePluginExportRoutes(
  pluginCapture?: PluginCanvasCapture,
): NormalizedExportRoute[] {
  const pages = Array.isArray(pluginCapture?.context?.sitePages)
    ? pluginCapture.context.sitePages
    : [];
  const collections = Array.isArray(pluginCapture?.context?.cmsCollections)
    ? pluginCapture.context.cmsCollections
    : [];

  const routes = pages
    .map((page) => {
      const record =
        page && typeof page === "object"
          ? (page as Record<string, unknown>)
          : {};
      const metadata =
        record.metadata && typeof record.metadata === "object"
          ? (record.metadata as Record<string, unknown>)
          : {};
      const rawPath = [
        record.routePath,
        record.path,
        record.pathname,
        record.pagePath,
        record.route,
        record.slug,
        record.url,
        metadata.routePath,
        metadata.path,
        metadata.pathname,
        metadata.pagePath,
      ].find((value) => typeof value === "string" && value.trim());
      const path =
        typeof rawPath === "string" ? normalizeExportRoutePath(rawPath) : "";
      const rawTitle = [
        record.name,
        record.title,
        record.pageTitle,
        record.displayName,
        metadata.name,
        metadata.title,
      ].find((value) => typeof value === "string" && value.trim());
      const title = typeof rawTitle === "string" ? rawTitle.trim() : "";
      const collectionId =
        typeof record.collectionId === "string"
          ? record.collectionId
          : typeof metadata.collectionId === "string"
            ? metadata.collectionId
            : undefined;
      const templatePath =
        typeof record.path === "string" && record.path.trim()
          ? record.path.trim()
          : typeof metadata.path === "string" && metadata.path.trim()
            ? metadata.path.trim()
            : path;
      const destination = readRedirectTargetFromRecord(record);
      const redirectStatus = readRedirectStatusFromRecord(record);

      return {
        path,
        title: title || (path === "/" ? "Home" : path.replace(/^\//, "")),
        collectionId,
        templatePath,
        templateId: templatePath,
        destination,
        redirectStatus,
      };
    })
    .filter(
      (route) =>
        route.path &&
        !/^\/drafts(?:\/|$)/i.test(route.path) &&
        !/^\/404\/?$/i.test(route.path),
    )
    .flatMap((route): NormalizedExportRoute[] => {
      if (!route.path.includes(":slug")) {
        if (route.destination) {
          const destinationKind = classifyRouteDestinationKind(route.destination);
          return [
            {
              schemaVersion: EXPORT_ROUTE_SCHEMA_VERSION,
              path: route.path,
              title: route.title,
              collectionId: route.collectionId,
              templateId: route.templateId,
              templatePath: route.templatePath,
              kind: "redirect",
              templateKind:
                destinationKind === "external" ? "utility" : "redirect",
              destination: route.destination,
              destinationKind,
              redirectTo: route.destination,
              redirectStatus: route.redirectStatus,
            },
          ];
        }
        return [
          {
            schemaVersion: EXPORT_ROUTE_SCHEMA_VERSION,
            path: route.path,
            title: route.title,
            collectionId: route.collectionId,
            templateId: route.templateId,
            templatePath: route.templatePath,
            kind: "page",
            template: "static",
            templateKind: "static",
          },
        ];
      }

      if (!route.collectionId) {
        return [
          {
            schemaVersion: EXPORT_ROUTE_SCHEMA_VERSION,
            path: route.path,
            title: route.title,
            collectionId: route.collectionId,
            templateId: route.templateId,
            templatePath: route.templatePath,
            kind: "page",
            template: "cms",
            templateKind: "cms",
          },
        ];
      }

      const collection = collections.find((entry) => {
        const record =
          entry && typeof entry === "object"
            ? (entry as Record<string, unknown>)
            : {};
        return record.id === route.collectionId;
      });
      const collectionRecord =
        collection && typeof collection === "object"
          ? (collection as Record<string, unknown>)
          : {};
      const items = Array.isArray(collectionRecord.items)
        ? collectionRecord.items
        : [];
      const expanded = items
        .map<NormalizedExportRoute | null>((item) => {
          const record =
            item && typeof item === "object"
              ? (item as Record<string, unknown>)
              : {};
          const slug = typeof record.slug === "string" ? record.slug.trim() : "";
          if (!slug) return null;
          return {
            schemaVersion: EXPORT_ROUTE_SCHEMA_VERSION,
            path: normalizeExportRoutePath(
              route.path.replace(":slug", encodeURIComponent(slug)),
            ),
            title: route.title ? `${route.title} - ${slug}` : slug,
            collectionId: route.collectionId,
            templateId: route.templateId,
            templatePath: route.templatePath,
            kind: "page",
            template: "cms",
            templateKind: "cms",
          };
        })
        .filter((entry): entry is NormalizedExportRoute => entry !== null);

      return expanded.length > 0
        ? expanded
        : [
            {
              schemaVersion: EXPORT_ROUTE_SCHEMA_VERSION,
              path: route.path,
              title: route.title,
              collectionId: route.collectionId,
              templateId: route.templateId,
              templatePath: route.templatePath,
              kind: "page",
              template: "cms",
              templateKind: "cms",
            },
          ];
    });

  validateNormalizedExportRoutes(routes);
  return routes;
}

export function validateNormalizedExportRoutes(
  routes: NormalizedExportRoute[],
): void {
  const seenPaths = new Set<string>();
  for (const route of routes) {
    if (!route.path) {
      throw new Error("Invalid full-site route manifest: route path is empty.");
    }
    if (seenPaths.has(route.path)) {
      throw new Error(
        `Invalid full-site route manifest: duplicate normalized path ${route.path}.`,
      );
    }
    seenPaths.add(route.path);

    if (route.kind === "page") {
      if (route.template !== "static" && route.template !== "cms") {
        throw new Error(
          `Invalid full-site route manifest: page ${route.path} must declare a static or cms template.`,
        );
      }
      continue;
    }

    if (!route.destination) {
      throw new Error(
        `Invalid full-site route manifest: redirect ${route.path} is missing a destination.`,
      );
    }
    if (
      route.destinationKind !== "internal" &&
      route.destinationKind !== "external"
    ) {
      throw new Error(
        `Invalid full-site route manifest: redirect ${route.path} has an invalid destination kind.`,
      );
    }
    if (
      route.destinationKind === "internal" &&
      !route.destination.startsWith("/")
    ) {
      throw new Error(
        `Invalid full-site route manifest: redirect ${route.path} must point to an internal path or HTTP(S) URL.`,
      );
    }
    if (
      route.destinationKind === "external" &&
      !/^https?:\/\//i.test(route.destination)
    ) {
      throw new Error(
        `Invalid full-site route manifest: redirect ${route.path} must point to an internal path or HTTP(S) URL.`,
      );
    }
  }
}
