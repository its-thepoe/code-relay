export type ExportHealth = "complete" | "partial" | "unknown";

export type CompletedOutcomeSurface =
  | "plugin-card"
  | "job-banner"
  | "worker-log";

export function readExportHealth(report?: Record<string, unknown> | null): ExportHealth {
  const sourceEvidence =
    report?.sourceEvidence && typeof report.sourceEvidence === "object"
      ? (report.sourceEvidence as Record<string, unknown>)
      : null;
  const status = sourceEvidence?.status;
  if (status === "complete" || status === "partial") {
    return status;
  }
  return "unknown";
}

export function createCompletedOutcomeCopy(input: {
  report?: Record<string, unknown> | null;
  surface: CompletedOutcomeSurface;
}) {
  const exportHealth = readExportHealth(input.report);

  if (exportHealth === "partial") {
    if (input.surface === "plugin-card") {
      return "Export complete with partial source-aware evidence. Review the report before trusting it as a reusable baseline.";
    }
    if (input.surface === "job-banner") {
      return "Export completed with partial source-aware evidence. Review warnings before trusting the output as a full-fidelity baseline.";
    }
    return "completed with partial source-aware evidence";
  }

  if (input.surface === "plugin-card") {
    return "Export complete. Download the ZIP or inspect the dashboard.";
  }
  if (input.surface === "job-banner") {
    return "Export completed. Artifacts are ready.";
  }
  return "completed";
}
