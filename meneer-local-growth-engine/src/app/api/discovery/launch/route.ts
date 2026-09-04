import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createDiscoveryRunRecord,
  executeDiscoveryPipeline,
  type DiscoveryRerunAction,
} from "@/services/discovery/launchDiscovery";
import { refreshDynamicVerticalPackCache } from "@/services/verticals/dynamicVerticalPack";
import { isAdminConfigured } from "@/lib/supabase/admin";
import type { DiscoveryLauncherMode } from "@/config/discoveryLauncherModes";

const bodySchema = z.object({
  verticalSlug: z.string().min(2),
  countryCode: z.enum(["NL", "BE"]),
  cityName: z.string().min(2).max(80),
  region: z.string().max(80).optional().nullable(),
  mode: z.enum(["QUICK", "STANDARD", "DEEP"]),
  rerunAction: z.enum(["USE_EXISTING", "REFRESH", "DEEPER"]).optional(),
  execute: z.boolean().optional().default(false),
});

export async function POST(request: Request) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json(
        { ok: false, error: "SUPABASE_SECRET_KEY ontbreekt" },
        { status: 500 }
      );
    }
    if (!process.env.DATAFORSEO_LOGIN || !process.env.DATAFORSEO_PASSWORD) {
      return NextResponse.json(
        { ok: false, error: "DataForSEO credentials ontbreken" },
        { status: 500 }
      );
    }

    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Ongeldige input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const input = {
      verticalSlug: parsed.data.verticalSlug,
      countryCode: parsed.data.countryCode,
      cityName: parsed.data.cityName.trim(),
      region: parsed.data.region?.trim() || null,
      mode: parsed.data.mode as DiscoveryLauncherMode,
      rerunAction: parsed.data.rerunAction as DiscoveryRerunAction | undefined,
    };

    await refreshDynamicVerticalPackCache();

    if (input.rerunAction === "USE_EXISTING") {
      const record = await createDiscoveryRunRecord(input).catch((error) => {
        if (error instanceof Error && error.message === "USE_EXISTING") {
          return null;
        }
        throw error;
      });
      if (!record) {
        return NextResponse.json({
          ok: true,
          usedExisting: true,
          redirectUrl: `/dashboard/discovery/${input.verticalSlug}/${normalizeSlug(input.cityName, input.countryCode)}`,
        });
      }
    }

    const record = await createDiscoveryRunRecord(input);

    if (!parsed.data.execute) {
      return NextResponse.json({
        ok: true,
        runId: record.runId,
        citySlug: record.citySlug,
        cityId: record.cityId,
        status: "PREPARING",
      });
    }

    const result = await executeDiscoveryPipeline({
      runId: record.runId,
      verticalSlug: input.verticalSlug,
      citySeed: record.citySeed,
      countryCode: input.countryCode,
      mode: input.mode,
      rerunAction: input.rerunAction,
    });

    return NextResponse.json({
      ok: true,
      runId: record.runId,
      citySlug: result.citySlug,
      redirectUrl: `/dashboard/discovery/${input.verticalSlug}/${result.citySlug}`,
      result,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "USE_EXISTING") {
      return NextResponse.json({ ok: false, code: "USE_EXISTING" }, { status: 409 });
    }
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Discovery launch mislukt",
      },
      { status: 500 }
    );
  }
}

function normalizeSlug(cityName: string, countryCode: string): string {
  const base = cityName
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return countryCode === "BE" ? `${base}-be` : base;
}
