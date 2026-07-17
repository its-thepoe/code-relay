function normalizeRouteDestination(value) {
    if (typeof value !== "string")
        return undefined;
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
}
export function classifyRouteDestinationKind(destination) {
    return /^https?:\/\//i.test(destination.trim()) ? "external" : "internal";
}
export function resolveExportRouteMetadata(input, options) {
    const observedRedirectTo = normalizeRouteDestination(options?.observedRedirectTo);
    const declaredDestination = normalizeRouteDestination(input.destination) ??
        normalizeRouteDestination(input.redirectTo);
    const routeKind = observedRedirectTo
        ? "redirect"
        : input.routeKind ??
            (declaredDestination ? "redirect" : "page");
    if (routeKind === "page") {
        return {
            routeKind,
            templateKind: input.templateKind === "static" ||
                input.templateKind === "cms" ||
                input.templateKind === "component"
                ? input.templateKind
                : undefined,
        };
    }
    const destination = observedRedirectTo ?? declaredDestination;
    const destinationKind = input.destinationKind ??
        (destination ? classifyRouteDestinationKind(destination) : undefined);
    return {
        routeKind,
        destination,
        destinationKind,
        redirectTo: destination,
        redirectStatus: typeof input.redirectStatus === "number" ? input.redirectStatus : undefined,
        templateKind: input.templateKind === "redirect" || input.templateKind === "utility"
            ? input.templateKind
            : destinationKind === "external"
                ? "utility"
                : destination
                    ? "redirect"
                    : undefined,
    };
}
