import { NextResponse } from "next/server";
import { z } from "zod";
import { enrichBusinessEmailFromWebsite } from "@/services/enrichment/enrichBusinessEmail";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";

const bodySchema = z.object({
  businessId: z.string().uuid(),
});

export async function POST(request: Request) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json({ ok: false, error: "Admin key ontbreekt" }, { status: 500 });
    }

    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Ongeldige input" }, { status: 400 });
    }

    const client = createAdminClient();
    const { data: business, error } = await client
      .from("businesses")
      .select("id, studio_name, website_url, domain, normalized_domain, email")
      .eq("id", parsed.data.businessId)
      .maybeSingle();

    if (error || !business) {
      return NextResponse.json({ ok: false, error: "Lead niet gevonden" }, { status: 404 });
    }

    if (!business.website_url) {
      return NextResponse.json(
        { ok: false, error: "Geen website URL bij deze lead" },
        { status: 400 }
      );
    }

    const result = await enrichBusinessEmailFromWebsite(client, {
      businessId: business.id,
      websiteUrl: business.website_url,
      domain: business.normalized_domain ?? business.domain,
      studioName: business.studio_name,
      existingEmail: business.email,
      force: true,
    });

    return NextResponse.json({
      ok: true,
      email: result.email,
      source: result.source,
      updated: result.updated,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Enrichment mislukt" },
      { status: 500 }
    );
  }
}
