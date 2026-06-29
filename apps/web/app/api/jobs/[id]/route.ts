import { NextResponse } from "next/server";
import { readJob } from "../../../../lib/jobs-store";

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

  return NextResponse.json(job, { headers: corsHeaders(request) });
}
