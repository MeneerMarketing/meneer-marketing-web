import { NextRequest, NextResponse } from "next/server";
import {
  parseLedPassportFormData,
  sendLedPassportUploadEmails,
} from "@/lib/skincomplete-led-upload";

const DEFAULT_ORIGINS = [
  "https://skincomplete.eu",
  "https://www.skincomplete.eu",
];

function resolveAllowedOrigins(): string[] {
  const fromEnv = process.env.SKINCOMPLETE_CORS_ORIGINS;
  if (!fromEnv) return DEFAULT_ORIGINS;
  return fromEnv
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function corsHeaders(origin: string | null): HeadersInit {
  const allowed = resolveAllowedOrigins();
  const matchedOrigin =
    origin && allowed.includes(origin) ? origin : allowed[0] ?? "";

  return {
    "Access-Control-Allow-Origin": matchedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function resolveResponseDays(): number {
  const raw = process.env.SKINCOMPLETE_LED_RESPONSE_DAYS;
  const parsed = raw ? Number.parseInt(raw, 10) : 5;
  if (!Number.isFinite(parsed) || parsed < 1 || parsed > 21) return 5;
  return parsed;
}

export async function OPTIONS(req: NextRequest): Promise<NextResponse> {
  const origin = req.headers.get("origin");
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const origin = req.headers.get("origin");

  try {
    const formData = await req.formData();
    const parsed = parseLedPassportFormData(formData);

    if ("error" in parsed) {
      if (parsed.error === "INVALID") {
        return NextResponse.json({ ok: true }, {
          status: 200,
          headers: corsHeaders(origin),
        });
      }
      return NextResponse.json(
        { error: parsed.error },
        { status: 400, headers: corsHeaders(origin) },
      );
    }

    await sendLedPassportUploadEmails(parsed, resolveResponseDays());

    return NextResponse.json({ ok: true }, {
      status: 200,
      headers: corsHeaders(origin),
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Upload mislukt. Probeer het opnieuw.";
    console.error("[LED Passport Upload]", message, err);
    return NextResponse.json(
      { error: message },
      { status: 500, headers: corsHeaders(origin) },
    );
  }
}
