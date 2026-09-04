import { NextResponse } from "next/server";
import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { getSupabase } from "@/lib/supabase";
import { logActivity } from "@/lib/operator";

/**
 * Queues brand intelligence refresh (qualify:brands crawl/classify only).
 * No DataForSEO discovery.
 */
export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = getSupabase();

    const { data: brand, error: loadError } = await supabase
      .from("brands")
      .select("id, name, normalized_domain, domain")
      .eq("id", id)
      .maybeSingle();

    if (loadError) throw new Error(loadError.message);
    if (!brand) {
      return NextResponse.json({ error: "Brand niet gevonden" }, { status: 404 });
    }

    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from("brands")
      .update({
        refresh_requested_at: now,
        last_refresh_status: "QUEUED",
        updated_at: now,
      })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    await logActivity(supabase, {
      brandId: id,
      eventType: "REFRESH_QUEUED",
      title: "Intelligence refresh in wachtrij",
      detail: brand.normalized_domain ?? brand.domain,
    });

    const spawnAllowed = process.env.OPERATOR_ENGINE_SPAWN !== "false";
    const domainFilter = brand.normalized_domain ?? brand.domain;

    if (spawnAllowed && domainFilter) {
      const engineRoot = resolve(process.cwd(), "..");
      const child = spawn(
        process.platform === "win32" ? "npm.cmd" : "npm",
        ["run", "qualify:brands"],
        {
          cwd: engineRoot,
          env: {
            ...process.env,
            QUALIFY_FORCE: "true",
            QUALIFY_DOMAIN_FILTER: domainFilter,
            QUALIFY_FORCE_PRIORITY_DOMAINS: "true",
            CRAWLER_MAX_BRANDS_PER_RUN: "1",
          },
          detached: true,
          stdio: "ignore",
          shell: process.platform === "win32",
        }
      );
      child.unref();
    }

    return NextResponse.json({
      ok: true,
      queued: true,
      message: "Refresh queued.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Refresh failed" },
      { status: 500 }
    );
  }
}
