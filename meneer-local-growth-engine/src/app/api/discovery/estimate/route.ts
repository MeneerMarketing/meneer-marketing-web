import { NextResponse } from "next/server";
import { z } from "zod";
import {
  estimateDiscoveryCostRange,
  getDiscoveryModeConfig,
  type DiscoveryLauncherMode,
} from "@/config/discoveryLauncherModes";
import { normalizeCitySlug } from "@/services/discovery/resolveCity";
import { getExistingDiscoverySummary } from "@/services/discovery/launchDiscovery";
import { getVerticalPack } from "@/verticals/registry";

const bodySchema = z.object({
  verticalSlug: z.string().min(2),
  countryCode: z.enum(["NL", "BE"]),
  cityName: z.string().min(2).max(80),
  mode: z.enum(["QUICK", "STANDARD", "DEEP"]),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Ongeldige input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const pack = getVerticalPack(parsed.data.verticalSlug);
    if (!pack) {
      return NextResponse.json({ ok: false, error: "Vertical niet actief" }, { status: 400 });
    }

    const mode = parsed.data.mode as DiscoveryLauncherMode;
    const config = getDiscoveryModeConfig(mode);
    const cost = estimateDiscoveryCostRange(mode);
    const citySlug = normalizeCitySlug(parsed.data.cityName, parsed.data.countryCode);
    const existing = await getExistingDiscoverySummary({
      verticalSlug: parsed.data.verticalSlug,
      citySlug,
    });

    return NextResponse.json({
      ok: true,
      estimate: {
        mode,
        maxIntents: config.maxIntents,
        maxResults: config.maxResults,
        maxCostUsd: config.maxCostUsd,
        costLabel: cost.label,
        intentCountAvailable: pack.intentCount,
      },
      existing,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Estimate mislukt",
      },
      { status: 500 }
    );
  }
}
