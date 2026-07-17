import type {
  ExportRouteDestinationKind,
  ExportRouteKind,
} from "./types.js";

type ExportRouteTemplateKind =
  | "static"
  | "cms"
  | "component"
  | "redirect"
  | "utility";

type ExportRouteMetadataInput = {
  routeKind?: ExportRouteKind | null;
  destination?: string | null;
  destinationKind?: ExportRouteDestinationKind | null;
  redirectTo?: string | null;
  redirectStatus?: number | null;
  templateKind?: ExportRouteTemplateKind | null;
};

type ResolvedExportRouteMetadata = {
  routeKind: ExportRouteKind;
  destination?: string;
  destinationKind?: ExportRouteDestinationKind;
  redirectTo?: string;
  redirectStatus?: number;
  templateKind?: ExportRouteTemplateKind;
};

function normalizeRouteDestination(value?: string | null): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export function classifyRouteDestinationKind(
  destination: string,
): ExportRouteDestinationKind {
  return /^https?:\/\//i.test(destination.trim()) ? "external" : "internal";
}

export function resolveExportRouteMetadata(
  input: ExportRouteMetadataInput,
  options?: {
    observedRedirectTo?: string | null;
  },
): ResolvedExportRouteMetadata {
  const observedRedirectTo = normalizeRouteDestination(options?.observedRedirectTo);
  const declaredDestination =
    normalizeRouteDestination(input.destination) ??
    normalizeRouteDestination(input.redirectTo);
  const routeKind: ExportRouteKind =
    observedRedirectTo
      ? "redirect"
      : input.routeKind ??
        (declaredDestination ? "redirect" : "page");

  if (routeKind === "page") {
    return {
      routeKind,
      templateKind:
        input.templateKind === "static" ||
        input.templateKind === "cms" ||
        input.templateKind === "component"
          ? input.templateKind
          : undefined,
    };
  }

  const destination = observedRedirectTo ?? declaredDestination;
  const destinationKind =
    input.destinationKind ??
    (destination ? classifyRouteDestinationKind(destination) : undefined);

  return {
    routeKind,
    destination,
    destinationKind,
    redirectTo: destination,
    redirectStatus:
      typeof input.redirectStatus === "number" ? input.redirectStatus : undefined,
    templateKind:
      input.templateKind === "redirect" || input.templateKind === "utility"
        ? input.templateKind
        : destinationKind === "external"
          ? "utility"
          : destination
            ? "redirect"
            : undefined,
  };
}
