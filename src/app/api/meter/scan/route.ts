import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { scanWebsiteForMeter } from "@/lib/meter/scan-website";

const ScanSchema = z.object({
  url: z.string().min(3).max(2048),
});

const RATE_WINDOW_MS = 60_000;
const rateMap = new Map<string, number>();

function clientKey(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const last = rateMap.get(key) ?? 0;
  if (now - last < RATE_WINDOW_MS) return true;
  rateMap.set(key, now);
  if (rateMap.size > 5000) {
    for (const [k, ts] of rateMap) {
      if (now - ts > RATE_WINDOW_MS * 2) rateMap.delete(k);
    }
  }
  return false;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const key = clientKey(req);
    if (isRateLimited(key)) {
      return NextResponse.json(
        { error: "Even rust. Nog een scan kan over ongeveer een minuut." },
        { status: 429 },
      );
    }

    const raw: unknown = await req.json();
    const parsed = ScanSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Vul een geldige URL in." }, { status: 400 });
    }

    const result = await scanWebsiteForMeter(parsed.data.url);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true, result });
  } catch (err) {
    console.error("[API Meter Scan]", err);
    return NextResponse.json(
      { error: "Scan mislukt. Probeer het opnieuw." },
      { status: 500 },
    );
  }
}
