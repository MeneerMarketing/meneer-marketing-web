import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminConfigured } from "@/lib/supabase/admin";
import {
  resolvePreviewShareLink,
  shareVerificationCookieName,
  verifyPreviewSharePassword,
} from "@/services/preview/previewShareService";

const bodySchema = z.object({
  token: z.string().min(6).max(32),
  password: z.string().min(1).max(80),
});

export async function POST(request: Request) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
    }

    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
    }

    const resolved = await resolvePreviewShareLink(parsed.data.token);
    if (!resolved.ok) {
      return NextResponse.json({ ok: false, error: resolved.error }, { status: 404 });
    }

    const check = await verifyPreviewSharePassword({
      token: parsed.data.token,
      password: parsed.data.password,
    });
    if (!check.ok) {
      return NextResponse.json({ ok: false, error: check.error ?? "wrong_password" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    const maxAge = Math.max(
      60,
      Math.floor((new Date(resolved.expiresAt).getTime() - Date.now()) / 1000),
    );
    response.cookies.set(shareVerificationCookieName(parsed.data.token), "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: `/p/${parsed.data.token}`,
      maxAge,
    });
    return response;
  } catch {
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
