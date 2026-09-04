import { NextResponse } from "next/server";
import {
  getAllowedCampaignOrigins,
  isAllowedCampaignOrigin,
} from "@/services/campaigns/types";

export function corsHeaders(origin: string | null): HeadersInit {
  const allowed = origin && isAllowedCampaignOrigin(origin) ? origin : null;
  const headers: Record<string, string> = {
    Vary: "Origin",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Idempotency-Key",
    "Access-Control-Max-Age": "86400",
  };
  if (allowed) {
    headers["Access-Control-Allow-Origin"] = allowed;
  }
  return headers;
}

export function optionsResponse(request: Request): NextResponse {
  const origin = request.headers.get("origin");
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

export function jsonWithCors(
  request: Request,
  body: unknown,
  init?: { status?: number }
): NextResponse {
  const origin = request.headers.get("origin");
  // Allow same-origin / server-side (no Origin) always
  if (origin && !isAllowedCampaignOrigin(origin)) {
    return NextResponse.json(
      { ok: false, error: "origin_not_allowed" },
      { status: 403, headers: corsHeaders(null) }
    );
  }
  return NextResponse.json(body, {
    status: init?.status ?? 200,
    headers: corsHeaders(origin),
  });
}

export function listAllowedOriginsForDocs(): string[] {
  return getAllowedCampaignOrigins();
}
