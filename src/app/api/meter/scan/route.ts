import { NextResponse } from "next/server";
import { z } from "zod";

import { scanWebsiteForMeter } from "@/lib/meter/scan-website";

const bodySchema = z.object({
  url: z.string().trim().min(3).max(2048),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Ongeldige aanvraag." },
      { status: 400 },
    );
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Dat is geen geldige URL." },
      { status: 400 },
    );
  }

  const result = await scanWebsiteForMeter(parsed.data.url);

  if ("error" in result) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 422 });
  }

  return NextResponse.json({ ok: true, result });
}
