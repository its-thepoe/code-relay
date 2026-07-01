"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export function AutoRefresh({
  enabled,
  initialSignature,
  intervalMs = 3000,
  statusUrl = "/api/jobs",
}: {
  enabled: boolean;
  initialSignature: string;
  intervalMs?: number;
  statusUrl?: string;
}) {
  const router = useRouter();
  const lastSignatureRef = useRef(initialSignature);

  useEffect(() => {
    lastSignatureRef.current = initialSignature;
  }, [initialSignature]);

  useEffect(() => {
    if (!enabled) return;

    let disposed = false;

    const refreshWhenChanged = async () => {
      try {
        const response = await fetch(statusUrl, { cache: "no-store" });
        if (!response.ok) return;

        const payload: unknown = await response.json();
        const nextSignature = buildJobSignature(payload);

        if (disposed || nextSignature === lastSignatureRef.current) return;

        lastSignatureRef.current = nextSignature;
        router.refresh();
      } catch {
        // Keep the current page stable if a transient poll fails.
      }
    };

    const interval = window.setInterval(() => {
      void refreshWhenChanged();
    }, intervalMs);

    return () => {
      disposed = true;
      window.clearInterval(interval);
    };
  }, [enabled, intervalMs, router, statusUrl]);

  return null;
}

function buildJobSignature(payload: unknown) {
  if (Array.isArray(payload)) {
    return payload
      .map((job) => {
        if (!isJobLike(job)) return "";
        const artifacts = job.artifacts;
        return [
          job.id,
          job.status,
          artifacts?.exportDir ? "export" : "",
          artifacts?.zipPath ? "zip" : "",
          artifacts?.reportPath ? "report" : "",
          artifacts?.previewPath ? "preview" : "",
        ].join(":");
      })
      .join("|");
  }

  if (isJobLike(payload)) {
    const progress = payload.progress;
    const artifacts = payload.artifacts;
    return [
      payload.id,
      payload.status,
      progress?.stage ?? "",
      progress?.routePath ?? "",
      progress?.failed ?? "",
      artifacts?.exportDir ? "export" : "",
      artifacts?.zipPath ? "zip" : "",
      artifacts?.reportPath ? "report" : "",
      artifacts?.previewPath ? "preview" : "",
      payload.errorMessage ?? "",
    ].join(":");
  }

  return "";
}

function isJobLike(value: unknown): value is {
  id: string;
  status: string;
  updatedAt?: string;
  progress?: {
    stage?: string;
    routePath?: string;
    failed?: number;
  };
  artifacts?: {
    exportDir?: string;
    zipPath?: string;
    reportPath?: string;
    previewPath?: string;
  };
  errorMessage?: string;
} {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "status" in value &&
    typeof value.id === "string" &&
    typeof value.status === "string"
  );
}
