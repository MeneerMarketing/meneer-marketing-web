import { NextResponse } from "next/server";
import { processDueScheduledOutreach } from "@/services/outreach/sendService";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;
  return request.headers.get("x-cron-secret") === secret;
}

/** Verstuurt outreach-mails waar scheduled_at <= now. Aanroepen via Vercel Cron of cron-job.org. */
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await processDueScheduledOutreach();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Cron mislukt",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
