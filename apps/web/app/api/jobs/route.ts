import { NextResponse } from "next/server";
import { createJobFromRequest } from "../../../lib/jobs-store";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const json = await request.json();
    const job = await createJobFromRequest(json);
    return NextResponse.json(job, { status: 201 });
  }

  const form = await request.formData();
  const sourceUrl = String(form.get("sourceUrl") ?? "").trim();
  const selectorRaw = String(form.get("selector") ?? "").trim();
  const selector = selectorRaw.length > 0 ? selectorRaw : undefined;

  const job = await createJobFromRequest({ sourceUrl, selector });
  return NextResponse.redirect(new URL(`/jobs/${job.id}`, request.url));
}
