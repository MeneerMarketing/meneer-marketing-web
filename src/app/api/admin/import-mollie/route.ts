import { NextRequest, NextResponse } from "next/server";

import { isLgeSupabaseConfigured } from "@/lib/lge/supabase-admin";
import { isMollieConfigured } from "@/lib/mollie/client";
import { importPaidMolliePayments } from "@/lib/mollie/import-payments";

function isAuthorized(req: NextRequest): boolean {
  const secret =
    process.env.IMPORT_SECRET?.trim() ||
    process.env.CRON_SECRET?.trim() ||
    process.env.INDEXNOW_SECRET?.trim();
  if (!secret) return false;

  const auth = req.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;

  const query = req.nextUrl.searchParams.get("secret");
  return query === secret;
}

/** Eenmalige import van betaalde Mollie-betalingen naar LGE Supabase. */
export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  if (!isMollieConfigured() || !isLgeSupabaseConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error: "missing_config",
        mollie: isMollieConfigured(),
        supabase: isLgeSupabaseConfigured(),
      },
      { status: 503 },
    );
  }

  try {
    const result = await importPaidMolliePayments();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "import_failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  return POST(req);
}
