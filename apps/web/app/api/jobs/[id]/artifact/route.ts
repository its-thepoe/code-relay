import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { readJob } from "../../../../../lib/jobs-store";

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  const allow =
    origin === "https://localhost:5174" ||
    origin === "http://localhost:5174" ||
    origin.startsWith("https://localhost:") ||
    origin.startsWith("http://localhost:");

  return {
    "access-control-allow-origin": allow ? origin : "*",
    "access-control-allow-methods": "GET, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
  };
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const job = await readJob(id);
  if (!job) {
    return NextResponse.json(
      { error: "Job not found." },
      { status: 404, headers: corsHeaders(request) },
    );
  }

  if (job.status === "queued" || job.status === "running") {
    return NextResponse.json(
      {
        error: "Artifacts are not ready yet.",
        status: job.status,
        updatedAt: job.updatedAt,
      },
      { status: 409, headers: corsHeaders(request) },
    );
  }

  if (job.status === "failed") {
    return NextResponse.json(
      {
        error: job.errorMessage ?? "Export failed before artifacts were ready.",
        status: job.status,
        updatedAt: job.updatedAt,
      },
      { status: 422, headers: corsHeaders(request) },
    );
  }

  if (!job.artifacts) {
    return NextResponse.json(
      { error: "Artifact metadata is missing for this completed job." },
      { status: 404, headers: corsHeaders(request) },
    );
  }

  const url = new URL(request.url);
  const type = url.searchParams.get("type") ?? "zip";

  const pickPath =
    type === "zip"
      ? job.artifacts.zipPath
      : type === "report"
        ? job.artifacts.reportPath
        : type === "revision"
          ? job.artifacts.revisionManifestPath
          : type === "validation"
            ? job.artifacts.validationPath
        : type === "invalidation"
          ? job.artifacts.invalidationPlanPath
        : type === "artifact-index"
          ? job.artifacts.artifactIndexPath
        : type === "preview"
          ? job.artifacts.previewPath
          : undefined;

  if (!pickPath) {
    return NextResponse.json(
      { error: "Artifact not available." },
      { status: 404, headers: corsHeaders(request) },
    );
  }

  const resolved = path.resolve(pickPath);
  let data: Buffer;
  try {
    data = await fs.readFile(resolved);
  } catch {
    return NextResponse.json(
      { error: "Artifact file is missing on disk.", path: resolved },
      { status: 404, headers: corsHeaders(request) },
    );
  }
  const filename =
    type === "zip"
      ? `${id}.zip`
      : type === "report"
        ? `${id}-report.json`
        : type === "revision"
          ? `${id}-revision.json`
        : type === "validation"
          ? `${id}-validation.json`
        : type === "invalidation"
          ? `${id}-invalidation.json`
        : type === "artifact-index"
          ? `${id}-artifact-index.json`
        : `${id}-preview.html`;

  const contentType =
    type === "zip"
      ? "application/zip"
      : type === "report" ||
          type === "revision" ||
          type === "validation" ||
          type === "invalidation" ||
          type === "artifact-index"
        ? "application/json; charset=utf-8"
        : "text/html; charset=utf-8";

  return new NextResponse(data, {
    status: 200,
    headers: {
      ...corsHeaders(request),
      "content-type": contentType,
      "content-disposition":
        type === "zip"
          ? `attachment; filename="${filename}"`
          : `inline; filename="${filename}"`,
    },
  });
}
