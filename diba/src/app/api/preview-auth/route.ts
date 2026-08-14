import { NextResponse, type NextRequest } from "next/server";
import {
  PREVIEW_AUTH_COOKIE,
  passwordsMatch,
  previewAuthToken,
  previewPasswordConfigured,
} from "@/lib/preview-auth";

const MAX_AGE = 60 * 60 * 24 * 14; // 14 dagen

export async function POST(request: NextRequest) {
  if (!previewPasswordConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Preview-beveiliging staat uit." },
      { status: 503 },
    );
  }

  let body: { password?: string };
  try {
    body = (await request.json()) as { password?: string };
  } catch {
    return NextResponse.json(
      { ok: false, error: "Ongeldig verzoek." },
      { status: 400 },
    );
  }

  const input = body.password?.trim() ?? "";
  const expected = process.env.PREVIEW_PASSWORD!.trim();

  if (!passwordsMatch(input, expected)) {
    return NextResponse.json(
      { ok: false, error: "Onjuist wachtwoord." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(PREVIEW_AUTH_COOKIE, await previewAuthToken(expected), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(PREVIEW_AUTH_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
