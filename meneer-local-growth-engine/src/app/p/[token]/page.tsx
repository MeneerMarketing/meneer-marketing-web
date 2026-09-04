import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { PreviewShareGate } from "@/components/preview/PreviewShareGate";
import { isAdminConfigured } from "@/lib/supabase/admin";
import {
  recordPreviewShareAccess,
  resolvePreviewShareLink,
  shareVerificationCookieName,
} from "@/services/preview/previewShareService";

interface Props {
  params: Promise<{ token: string }>;
}

function errorMessage(code: "not_found" | "expired" | "revoked"): string {
  switch (code) {
    case "expired":
      return "Deze preview-link is verlopen.";
    case "revoked":
      return "Deze preview-link is ingetrokken.";
    default:
      return "Deze preview-link bestaat niet.";
  }
}

export default async function PreviewSharePage({ params }: Props) {
  const { token } = await params;
  if (!isAdminConfigured()) notFound();

  const resolved = await resolvePreviewShareLink(token);
  if (!resolved.ok) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F4EF] px-4">
        <div className="max-w-md border border-[#E5DFD4] bg-white p-6 text-center">
          <h1 className="text-lg font-extrabold text-[#2C2621]">Link niet beschikbaar</h1>
          <p className="mt-2 text-sm text-[#6B635C]">{errorMessage(resolved.error)}</p>
        </div>
      </div>
    );
  }

  if (resolved.requiresPassword) {
    const cookieStore = await cookies();
    const verified = cookieStore.get(shareVerificationCookieName(token))?.value === "1";
    if (!verified) {
      return <PreviewShareGate token={token} expiresAt={resolved.expiresAt} />;
    }
  }

  await recordPreviewShareAccess(token);
  redirect(resolved.previewUrl);
}
