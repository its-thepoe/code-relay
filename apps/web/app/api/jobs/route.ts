import { NextResponse } from "next/server";
import { corsHeaders } from "../../../lib/cors";
import { createJobFromRequest, readAllJobs } from "../../../lib/jobs-store";

const allowedMethods = ["GET", "POST", "OPTIONS"];

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request, allowedMethods),
  });
}

export async function GET(request: Request) {
  const jobs = await readAllJobs();
  return NextResponse.json(jobs, {
    headers: corsHeaders(request, allowedMethods),
  });
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
        parentJobId: json?.parentJobId,
        requestedFocus: json?.requestedFocus,
        pluginNodeCount: Array.isArray(json?.pluginCapture?.selectedNodes)
          ? json.pluginCapture.selectedNodes.length
          : 0,
      }),
    );
    const job = await createJobFromRequest(json);
    return NextResponse.json(job, {
      status: 201,
      headers: corsHeaders(request, allowedMethods),
    });
  }

  const form = await request.formData();
  const sourceUrl = String(form.get("sourceUrl") ?? "").trim();
  const selectorRaw = String(form.get("selector") ?? "").trim();
  const selector = selectorRaw.length > 0 ? selectorRaw : undefined;
  const parentJobIdRaw = String(form.get("parentJobId") ?? "").trim();
  const parentJobId = parentJobIdRaw.length > 0 ? parentJobIdRaw : undefined;
  const requestedFocusRaw = String(form.get("requestedFocus") ?? "").trim();
  const requestedFocus =
    requestedFocusRaw.length > 0 ? requestedFocusRaw : undefined;

  const job = await createJobFromRequest({
    sourceUrl,
    selector,
    exportMode: "selection",
    parentJobId,
    requestedFocus,
  });
  const response = NextResponse.redirect(
    new URL(`/jobs/${job.id}`, request.url),
  );
  Object.entries(corsHeaders(request, allowedMethods)).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}
