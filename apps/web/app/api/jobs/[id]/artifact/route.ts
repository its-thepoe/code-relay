import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { corsHeaders } from "../../../../../lib/cors";
import {
  canServeArtifactWhilePending,
  resolveSafeJobArtifact,
  type JobArtifactType,
} from "../../../../../lib/job-artifacts";
import { readJob } from "../../../../../lib/jobs-store";

const allowedMethods = ["GET", "OPTIONS"];

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request, allowedMethods),
  });
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
      { status: 404, headers: corsHeaders(request, allowedMethods) },
    );
  }

  const url = new URL(request.url);
  const requestedType = url.searchParams.get("type") ?? "zip";
  const type = isJobArtifactType(requestedType) ? requestedType : "zip";

  if (job.status === "queued" || job.status === "running") {
    if (!canServeArtifactWhilePending(type)) {
      return NextResponse.json(
        {
          error: "Artifacts are not ready yet.",
          status: job.status,
          updatedAt: job.updatedAt,
        },
        { status: 409, headers: corsHeaders(request, allowedMethods) },
      );
    }
  }

  if (job.status === "failed") {
    if (!canServeArtifactWhilePending(type)) {
      return NextResponse.json(
        {
          error: job.errorMessage ?? "Export failed before artifacts were ready.",
          status: job.status,
          updatedAt: job.updatedAt,
        },
        { status: 422, headers: corsHeaders(request, allowedMethods) },
      );
    }
  }

  if (!job.artifacts) {
    return NextResponse.json(
      {
        error:
          job.status === "queued" || job.status === "running"
            ? "Artifact metadata is not available yet for this running job."
            : "Artifact metadata is missing for this job.",
      },
      { status: 404, headers: corsHeaders(request, allowedMethods) },
    );
  }

  const artifact = resolveSafeJobArtifact(job, type);
  const pickPath = artifact.path;

  if (artifact.blocked) {
    return NextResponse.json(
      { error: "Artifact path is outside the job artifact directory." },
      { status: 403, headers: corsHeaders(request, allowedMethods) },
    );
  }

  if (!pickPath) {
    return NextResponse.json(
      { error: "Artifact not available." },
      { status: 404, headers: corsHeaders(request, allowedMethods) },
    );
  }

  const resolved = path.resolve(pickPath);
  let data: Buffer;
  try {
    data = await fs.readFile(resolved);
  } catch {
    return NextResponse.json(
      { error: "Artifact file is missing on disk.", path: resolved },
      { status: 404, headers: corsHeaders(request, allowedMethods) },
    );
  }

  return new NextResponse(data, {
    status: 200,
    headers: {
      ...corsHeaders(request, allowedMethods),
      "content-type": artifact.contentType,
      "content-disposition":
        type === "zip"
          ? `attachment; filename="${artifact.filename}"`
          : `inline; filename="${artifact.filename}"`,
    },
  });
}

function isJobArtifactType(value: string): value is JobArtifactType {
  return [
    "zip",
    "resolved-request",
    "status",
    "report",
    "capability-report",
    "code-compatibility",
    "before-after",
    "parent",
    "revision",
    "validation",
    "invalidation",
    "artifact-index",
    "responsive-plan",
    "preview",
  ].includes(value);
}
