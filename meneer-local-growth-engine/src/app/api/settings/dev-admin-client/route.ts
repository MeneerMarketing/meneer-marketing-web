import { NextResponse } from "next/server";
import { z } from "zod";
import { DEV_ADMIN_CLIENT_COOKIE } from "@/lib/supabase/devClientPreference.shared";
import { isAdminConfigured } from "@/lib/supabase/admin";

const bodySchema = z.object({
  enabled: z.boolean(),
});

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { ok: false, error: "Alleen beschikbaar in development" },
      { status: 403 },
    );
  }

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { ok: false, error: "SUPABASE_SECRET_KEY ontbreekt" },
      { status: 500 },
    );
  }

  if (process.env.LGE_DEV_USE_ADMIN_CLIENT === "true") {
    return NextResponse.json({
      ok: false,
      error: "Uitgeschakeld: LGE_DEV_USE_ADMIN_CLIENT staat al op true",
    });
  }

  if (process.env.LGE_DEV_AUTH_BYPASS === "true") {
    return NextResponse.json({
      ok: false,
      error: "Uitgeschakeld: LGE_DEV_AUTH_BYPASS is actief",
    });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Ongeldige input" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true, enabled: parsed.data.enabled });

  if (parsed.data.enabled) {
    response.cookies.set(DEV_ADMIN_CLIENT_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 60 * 60 * 24 * 400,
    });
  } else {
    response.cookies.set(DEV_ADMIN_CLIENT_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 0,
    });
  }

  return response;
}
