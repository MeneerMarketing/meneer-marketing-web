import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminConfigured } from "@/lib/supabase/admin";
import {
  createPreviewShareLink,
  revokePreviewShareLink,
} from "@/services/preview/previewShareService";

const createSchema = z.object({
  businessId: z.string().uuid(),
  password: z.string().min(4).max(80).nullable().optional(),
  expiresInDays: z.number().int().min(1).max(90).optional(),
  label: z.string().max(80).nullable().optional(),
});

const revokeSchema = z.object({
  businessId: z.string().uuid(),
  linkId: z.string().uuid(),
});

export async function POST(request: Request) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json({ ok: false, error: "Admin key ontbreekt" }, { status: 500 });
    }

    const parsed = createSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Ongeldige input" }, { status: 400 });
    }

    const link = await createPreviewShareLink({
      businessId: parsed.data.businessId,
      password: parsed.data.password ?? null,
      expiresInDays: parsed.data.expiresInDays,
      label: parsed.data.label ?? null,
    });

    return NextResponse.json({ ok: true, link });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Share link mislukt" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json({ ok: false, error: "Admin key ontbreekt" }, { status: 500 });
    }

    const parsed = revokeSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Ongeldige input" }, { status: 400 });
    }

    await revokePreviewShareLink({
      businessId: parsed.data.businessId,
      linkId: parsed.data.linkId,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Intrekken mislukt" },
      { status: 500 },
    );
  }
}
