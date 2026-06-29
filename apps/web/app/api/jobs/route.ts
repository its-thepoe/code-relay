import { NextResponse } from "next/server";
import { createJobFromRequest, readAllJobs } from "../../../lib/jobs-store";

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  const allow =
    origin === "https://localhost:5174" ||
    origin === "http://localhost:5174" ||
    origin.startsWith("https://localhost:") ||
    origin.startsWith("http://localhost:");

  return {
    "access-control-allow-origin": allow ? origin : "*",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
  };
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) });
}

export async function GET(request: Request) {
  const jobs = await readAllJobs();
  return NextResponse.json(jobs, { headers: corsHeaders(request) });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const json = await request.json();
    console.info(
      "[coderelay:api:job-request]",
      JSON.stringify({
        sourceUrl: json?.sourceUrl,
        selector: json?.selector,
        exportMode: json?.exportMode ?? json?.pluginCapture?.context?.exportMode,
        pluginNodeCount: Array.isArray(json?.pluginCapture?.selectedNodes)
          ? json.pluginCapture.selectedNodes.length
          : 0,
      }),
    );
    const job = await createJobFromRequest(json);
    return NextResponse.json(job, {
      status: 201,
      headers: corsHeaders(request),
    });
  }

  const form = await request.formData();
  const sourceUrl = String(form.get("sourceUrl") ?? "").trim();
  const selectorRaw = String(form.get("selector") ?? "").trim();
  const selector = selectorRaw.length > 0 ? selectorRaw : undefined;

  const job = await createJobFromRequest({
    sourceUrl,
    selector,
    exportMode: "selection",
  });
  const response = NextResponse.redirect(
    new URL(`/jobs/${job.id}`, request.url),
  );
  Object.entries(corsHeaders(request)).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}
