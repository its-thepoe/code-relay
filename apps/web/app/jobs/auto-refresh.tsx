"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { buildJobSignature } from "../../lib/job-signature";

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
