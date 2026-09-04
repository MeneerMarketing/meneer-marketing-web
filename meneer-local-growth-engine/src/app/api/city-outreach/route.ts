import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import {
  getCityOutreachCapacity,
  getTemplateUsageInCity,
  overrideAssignedTemplate,
  prepareSelectedCityOutreach,
  setCityOutreachSelection,
} from "@/services/city-outreach/cityOutreachService";
import { isCityManuallyProtected } from "@/services/city-outreach/cityAcquisitionProtection";

const selectSchema = z.object({
  action: z.literal("select"),
  verticalSlug: z.string(),
  cityId: z.string().uuid(),
  businessIds: z.array(z.string().uuid()),
});

const prepareSchema = z.object({
  verticalSlug: z.string(),
  cityId: z.string().uuid(),
  businessIds: z.array(z.string().uuid()).optional(),
});

const overrideSchema = z.object({
  action: z.literal("override_template"),
  businessId: z.string().uuid(),
  template: z.enum(["editorial", "reformer-minimal", "soft-movement", "clinical-atelier"]),
});

const statusSchema = z.object({
  action: z.literal("status"),
  verticalSlug: z.string(),
  cityId: z.string().uuid(),
});

async function resolveVerticalId(slug: string): Promise<string | null> {
  const client = createAdminClient();
  const { data } = await client.from("verticals").select("id").eq("slug", slug).maybeSingle();
  return data?.id ? String(data.id) : null;
}

export async function GET(request: Request) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json({ ok: false, error: "Admin key ontbreekt" }, { status: 500 });
    }

    const url = new URL(request.url);
    const verticalSlug = url.searchParams.get("verticalSlug") ?? "pilates";
    const cityId = url.searchParams.get("cityId");
    if (!cityId) {
      return NextResponse.json({ ok: false, error: "cityId verplicht" }, { status: 400 });
    }

    const verticalId = await resolveVerticalId(verticalSlug);
    if (!verticalId) {
      return NextResponse.json({ ok: false, error: "Vertical niet gevonden" }, { status: 404 });
    }

    const [capacity, templateUsage, protection] = await Promise.all([
      getCityOutreachCapacity({ verticalSlug, verticalId, cityId }),
      getTemplateUsageInCity({ verticalSlug, verticalId, cityId }),
      isCityManuallyProtected({ verticalId, cityId }),
    ]);

    return NextResponse.json({
      ok: true,
      capacity,
      template_usage: templateUsage,
      acquisition_protected: protection.protected,
      protection_reason: protection.reason,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Status mislukt" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json({ ok: false, error: "Admin key ontbreekt" }, { status: 500 });
    }

    const json = await request.json();

    const override = overrideSchema.safeParse(json);
    if (override.success) {
      const result = await overrideAssignedTemplate({
        businessId: override.data.businessId,
        template: override.data.template,
      });
      if (!result.ok) {
        return NextResponse.json(
          {
            ok: false,
            error: result.error,
            conflict: result.conflict,
          },
          { status: 409 }
        );
      }
      return NextResponse.json({ ok: true });
    }

    const select = selectSchema.safeParse({ ...json, action: "select" });
    if (select.success) {
      const verticalId = await resolveVerticalId(select.data.verticalSlug);
      if (!verticalId) {
        return NextResponse.json({ ok: false, error: "Vertical niet gevonden" }, { status: 404 });
      }
      const result = await setCityOutreachSelection({
        verticalId,
        cityId: select.data.cityId,
        verticalSlug: select.data.verticalSlug,
        businessIds: select.data.businessIds,
      });
      return NextResponse.json(result, { status: result.ok ? 200 : 400 });
    }

    const prepare = prepareSchema.safeParse(json);
    if (prepare.success) {
      const verticalId = await resolveVerticalId(prepare.data.verticalSlug);
      if (!verticalId) {
        return NextResponse.json({ ok: false, error: "Vertical niet gevonden" }, { status: 404 });
      }
      const result = await prepareSelectedCityOutreach({
        verticalId,
        cityId: prepare.data.cityId,
        verticalSlug: prepare.data.verticalSlug,
        businessIds: prepare.data.businessIds,
      });
      return NextResponse.json(result, { status: result.ok ? 200 : 400 });
    }

    return NextResponse.json({ ok: false, error: "Ongeldige actie" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "City outreach mislukt" },
      { status: 500 }
    );
  }
}
