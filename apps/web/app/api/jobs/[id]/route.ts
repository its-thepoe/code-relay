import { NextResponse } from "next/server";
import { corsHeaders } from "../../../../lib/cors";
import { readJob } from "../../../../lib/jobs-store";

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

  return NextResponse.json(job, {
    headers: corsHeaders(request, allowedMethods),
  });
}
