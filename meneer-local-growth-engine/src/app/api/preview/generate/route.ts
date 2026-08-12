import { NextResponse } from "next/server";
import { z } from "zod";
import { generateBusinessPreview } from "@/services/preview-generation/generateBusinessPreview";
import { isAdminConfigured } from "@/lib/supabase/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { writeActivity } from "@/lib/repositories/lge";

const bodySchema = z.object({
  businessId: z.string().uuid(),
  forceTemplate: z
    .enum(["editorial", "reformer-minimal", "soft-movement"])
    .optional(),
  allowDemo: z.boolean().optional(),
  action: z.enum(["generate", "archive", "change_template"]).default("generate"),
});

export async function POST(request: Request) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json(
        { ok: false, error: "SUPABASE_SECRET_KEY ontbreekt" },
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

    const { businessId, forceTemplate, allowDemo, action } = parsed.data;
    const client = createAdminClient();

    if (action === "archive") {
      await client
        .from("previews")
        .update({ status: "ARCHIVED", updated_at: new Date().toISOString() })
        .eq("business_id", businessId)
        .neq("status", "ARCHIVED");
      await client
        .from("businesses")
        .update({ preview_status: "ARCHIVED", last_activity_at: new Date().toISOString() })
        .eq("id", businessId);
      await writeActivity(client, {
        business_id: businessId,
        activity_type: "STATUS_CHANGED",
        title: "Previews gearchiveerd",
        description: "Handmatig vanuit dashboard",
      });
      return NextResponse.json({ ok: true, status: "ARCHIVED" });
    }

    if (action === "change_template" && forceTemplate) {
      const { data: tpl } = await client
        .from("templates")
        .select("id")
        .eq("variant", forceTemplate)
        .maybeSingle();
      if (!tpl) {
        return NextResponse.json({ ok: false, error: "Template niet gevonden" }, { status: 404 });
      }
      await client
        .from("businesses")
        .update({
          selected_template_id: tpl.id,
          last_activity_at: new Date().toISOString(),
        })
        .eq("id", businessId);
      await writeActivity(client, {
        business_id: businessId,
        activity_type: "TEMPLATE_CHANGED",
        title: `Template gewijzigd naar ${forceTemplate}`,
        description: "Handmatig; regenerate om nieuwe preview te maken",
      });
    }

    const result = await generateBusinessPreview(businessId, {
      forceTemplate,
      allowDemo,
    });

    if (action === "generate" && result.ok) {
      // already logged PREVIEW_CREATED
    } else if (result.ok) {
      await writeActivity(client, {
        business_id: businessId,
        activity_type: "PREVIEW_REGENERATED",
        title: `Preview geregenereerd · ${result.slug}`,
        metadata: { preview_id: result.previewId },
      });
    }

    return NextResponse.json({ ok: result.ok, result });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Preview generation mislukt",
      },
      { status: 500 }
    );
  }
}
