import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  turbopack: {
    root: __dirname,
  },
  outputFileTracingExcludes: {
    "*": [
      ".coderelay/**/*",
      "../../.coderelay/**/*",
      "**/.coderelay/**/*",
      "**/debug/source/**/*",
      "**/debug/attempts/**/*",
    ],
  },
  webpack(config) {
    config.watchOptions = {
      ...(config.watchOptions ?? {}),
      ignored: [
        "**/.coderelay/**",
        "**/node_modules/**",
        "**/.next/**",
      ],
    };
    return config;
  },
};

export default nextConfig;
