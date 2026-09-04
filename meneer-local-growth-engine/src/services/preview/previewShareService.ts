import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { writeActivity } from "@/lib/repositories/lge";
import { ensureCampaignForBusiness } from "@/services/campaigns/campaignService";
import { toCanonicalPreviewSlug } from "@/lib/previewSlug";
import { formatPublicPreviewUrl } from "@/services/outreach/previewUrl";

export interface PreviewShareLinkRow {
  id: string;
  share_token: string;
  business_id: string;
  preview_id: string | null;
  campaign_id: string | null;
  password_hash: string | null;
  expires_at: string;
  revoked_at: string | null;
  access_count: number;
  last_accessed_at: string | null;
  label: string | null;
  created_at: string;
}

export interface PreviewShareLinkView {
  id: string;
  token: string;
  url: string;
  expiresAt: string;
  hasPassword: boolean;
  accessCount: number;
  lastAccessedAt: string | null;
  revoked: boolean;
  createdAt: string;
}

export interface ResolvedPreviewShare {
  ok: true;
  previewSlug: string;
  campaignRef: string | null;
  previewUrl: string;
  requiresPassword: boolean;
  expiresAt: string;
}

export interface ResolvedPreviewShareError {
  ok: false;
  error: "not_found" | "expired" | "revoked";
}

const DEFAULT_EXPIRY_DAYS = 30;
const SHARE_COOKIE_PREFIX = "lge_pshare_";

function shareBaseUrl(): string {
  return (
    process.env.PREVIEW_SHARE_BASE_URL ||
    process.env.OUTREACH_PREVIEW_BASE_URL ||
    process.env.NEXT_PUBLIC_LGE_URL ||
    "http://localhost:3001"
  ).replace(/\/$/, "");
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = createHash("sha256").update(`${salt}:${password}`).digest("hex");
  return `${salt}:${hash}`;
}

export function verifySharePassword(stored: string, password: string): boolean {
  const [salt, expected] = stored.split(":");
  if (!salt || !expected) return false;
  const actual = createHash("sha256").update(`${salt}:${password}`).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function shareVerificationCookieName(token: string): string {
  return `${SHARE_COOKIE_PREFIX}${token}`;
}

function generateShareToken(): string {
  return randomBytes(7).toString("base64url");
}

export function buildShareLinkUrl(token: string): string {
  return `${shareBaseUrl()}/p/${token}`;
}

export async function createPreviewShareLink(input: {
  businessId: string;
  password?: string | null;
  expiresInDays?: number;
  label?: string | null;
}): Promise<PreviewShareLinkView> {
  const client = createAdminClient();
  const days = input.expiresInDays ?? DEFAULT_EXPIRY_DAYS;
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

  const campaign = await ensureCampaignForBusiness({ businessId: input.businessId });

  const { data: preview } = await client
    .from("previews")
    .select("id, slug, status")
    .eq("business_id", input.businessId)
    .in("status", ["READY", "APPROVED"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!preview?.slug) {
    throw new Error("Geen READY preview om te delen");
  }

  const token = generateShareToken();
  const passwordHash = input.password?.trim() ? hashPassword(input.password.trim()) : null;

  const { data: row, error } = await client
    .from("preview_share_links")
    .insert({
      share_token: token,
      business_id: input.businessId,
      preview_id: preview.id,
      campaign_id: campaign.id,
      password_hash: passwordHash,
      expires_at: expiresAt,
      label: input.label?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error || !row) {
    throw new Error(error?.message ?? "Share link aanmaken mislukt");
  }

  await writeActivity(client, {
    business_id: input.businessId,
    activity_type: "PREVIEW_SHARE_CREATED",
    title: "Preview share link aangemaakt",
    description: passwordHash ? "Met wachtwoord" : "Zonder wachtwoord",
    metadata: {
      share_token: token,
      expires_at: expiresAt,
      campaign_id: campaign.id,
    },
  });

  return toShareLinkView(row as PreviewShareLinkRow);
}

function toShareLinkView(row: PreviewShareLinkRow): PreviewShareLinkView {
  return {
    id: row.id,
    token: row.share_token,
    url: buildShareLinkUrl(row.share_token),
    expiresAt: row.expires_at,
    hasPassword: Boolean(row.password_hash),
    accessCount: row.access_count,
    lastAccessedAt: row.last_accessed_at,
    revoked: Boolean(row.revoked_at),
    createdAt: row.created_at,
  };
}

export async function listPreviewShareLinks(businessId: string): Promise<PreviewShareLinkView[]> {
  const client = createAdminClient();
  const { data } = await client
    .from("preview_share_links")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })
    .limit(20);

  return (data ?? []).map((row) => toShareLinkView(row as PreviewShareLinkRow));
}

export async function revokePreviewShareLink(input: {
  businessId: string;
  linkId: string;
}): Promise<void> {
  const client = createAdminClient();
  const now = new Date().toISOString();
  await client
    .from("preview_share_links")
    .update({ revoked_at: now, updated_at: now })
    .eq("id", input.linkId)
    .eq("business_id", input.businessId);
}

export async function resolvePreviewShareLink(
  token: string,
): Promise<ResolvedPreviewShare | ResolvedPreviewShareError> {
  const client = createAdminClient();
  const { data: row } = await client
    .from("preview_share_links")
    .select("*")
    .eq("share_token", token)
    .maybeSingle();

  if (!row) return { ok: false, error: "not_found" };
  if (row.revoked_at) return { ok: false, error: "revoked" };
  if (new Date(String(row.expires_at)) < new Date()) {
    return { ok: false, error: "expired" };
  }

  let previewSlug: string | null = null;
  if (row.preview_id) {
    const { data: preview } = await client
      .from("previews")
      .select("slug")
      .eq("id", row.preview_id)
      .maybeSingle();
    previewSlug = (preview?.slug as string) ?? null;
  }

  if (!previewSlug) {
    const { data: preview } = await client
      .from("previews")
      .select("slug")
      .eq("business_id", row.business_id)
      .in("status", ["READY", "APPROVED", "DRAFT"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    previewSlug = (preview?.slug as string) ?? null;
  }

  if (!previewSlug) return { ok: false, error: "not_found" };

  let campaignRef: string | null = null;
  if (row.campaign_id) {
    const { data: campaign } = await client
      .from("campaigns")
      .select("campaign_ref, status")
      .eq("id", row.campaign_id)
      .maybeSingle();
    if (campaign?.status === "ACTIVE") {
      campaignRef = String(campaign.campaign_ref);
    }
  }

  const canonical = toCanonicalPreviewSlug(previewSlug);
  const base = shareBaseUrl();
  let previewUrl = `${base}/preview/${canonical}`;
  try {
    previewUrl = formatPublicPreviewUrl(base, canonical);
  } catch {
    /* keep /preview/ fallback for local */
  }
  if (campaignRef) {
    previewUrl += previewUrl.includes("?") ? "&" : "?";
    previewUrl += `ref=${encodeURIComponent(campaignRef)}`;
  }

  return {
    ok: true,
    previewSlug: canonical,
    campaignRef,
    previewUrl,
    requiresPassword: Boolean(row.password_hash),
    expiresAt: String(row.expires_at),
  };
}

export async function recordPreviewShareAccess(token: string): Promise<void> {
  const client = createAdminClient();
  const { data: row } = await client
    .from("preview_share_links")
    .select("id, access_count, business_id")
    .eq("share_token", token)
    .maybeSingle();
  if (!row) return;

  const now = new Date().toISOString();
  await client
    .from("preview_share_links")
    .update({
      access_count: Number(row.access_count ?? 0) + 1,
      last_accessed_at: now,
      updated_at: now,
    })
    .eq("id", row.id);

  await writeActivity(client, {
    business_id: row.business_id,
    activity_type: "PREVIEW_SHARE_OPENED",
    title: "Preview share link geopend",
    metadata: { share_token: token },
  });
}

export async function verifyPreviewSharePassword(input: {
  token: string;
  password: string;
}): Promise<{ ok: boolean; error?: string }> {
  const client = createAdminClient();
  const { data: row } = await client
    .from("preview_share_links")
    .select("password_hash, revoked_at, expires_at")
    .eq("share_token", input.token)
    .maybeSingle();

  if (!row?.password_hash) return { ok: false, error: "not_protected" };
  if (row.revoked_at) return { ok: false, error: "revoked" };
  if (new Date(String(row.expires_at)) < new Date()) return { ok: false, error: "expired" };

  const valid = verifySharePassword(String(row.password_hash), input.password);
  return valid ? { ok: true } : { ok: false, error: "wrong_password" };
}
