import { NextResponse } from "next/server";
import { isAdminConfigured } from "@/lib/supabase/admin";
import {
  acknowledgeAllReplies,
  acknowledgeReplyInboxItem,
} from "@/services/inbox/replyInboxService";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ ok: false, error: "Admin key ontbreekt" }, { status: 500 });
  }

  let body: { action?: string; replyId?: string };
  try {
    body = (await request.json()) as { action?: string; replyId?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (body.action === "acknowledge" && body.replyId) {
    const ok = await acknowledgeReplyInboxItem(body.replyId);
    return NextResponse.json({ ok });
  }

  if (body.action === "acknowledge_all") {
    const count = await acknowledgeAllReplies();
    return NextResponse.json({ ok: true, count });
  }

  return NextResponse.json({ ok: false, error: "unknown_action" }, { status: 400 });
}
