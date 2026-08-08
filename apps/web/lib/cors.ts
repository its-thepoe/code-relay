const allowedLocalOrigins = [
  /^https?:\/\/localhost(?::\d+)?$/,
  /^https?:\/\/127\.0\.0\.1(?::\d+)?$/,
  /^https?:\/\/\[::1\](?::\d+)?$/,
];

export function corsHeaders(
  request: Request,
  methods: readonly string[],
): HeadersInit {
  const origin = request.headers.get("origin") ?? "";
  const headers: Record<string, string> = {
    "access-control-allow-methods": methods.join(", "),
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
    vary: "origin",
  };

  if (allowedLocalOrigins.some((pattern) => pattern.test(origin))) {
    headers["access-control-allow-origin"] = origin;
  }

  return headers;
}
