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
  if (!job?.artifacts) {
    return NextResponse.json(
      { error: "Job not found or has no artifacts yet." },
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
  const data = await fs.readFile(resolved);
  const filename =
    type === "zip"
      ? `${id}.zip`
      : type === "report"
        ? `${id}-report.json`
        : `${id}-preview.html`;

  const contentType =
    type === "zip"
      ? "application/zip"
      : type === "report"
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
