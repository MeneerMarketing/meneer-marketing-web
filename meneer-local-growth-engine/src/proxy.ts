import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isDedicatedPreviewHost } from "@/services/outreach/previewUrl";

const RESERVED_ROOT_SEGMENTS = new Set([
  "",
  "dashboard",
  "login",
  "auth",
  "api",
  "admin",
  "preview",
  "_next",
  "favicon.ico",
  "robots.txt",
]);

/**
 * Option A: on preview.* host, public URLs are /{slug}.
 * Internally rewrite to /preview/{slug}. Also canonicalize /preview/{slug} → /{slug}.
 */
function handlePreviewHostUrls(request: NextRequest): NextResponse | null {
  const host = request.headers.get("host") ?? "";
  if (!isDedicatedPreviewHost(host)) return null;

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/preview/")) {
    const slug = pathname.slice("/preview/".length).split(/[/?#]/)[0];
    if (slug && /^[a-z0-9][a-z0-9-]*$/i.test(slug)) {
      const url = request.nextUrl.clone();
      url.pathname = `/${slug}`;
      return NextResponse.redirect(url, 308);
    }
    return null;
  }

  if (pathname === "/" || pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return null;
  }

  const segment = pathname.replace(/^\//, "").split("/")[0] ?? "";
  if (!segment || RESERVED_ROOT_SEGMENTS.has(segment)) return null;
  if (pathname !== `/${segment}`) return null;
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(segment)) return null;

  const url = request.nextUrl.clone();
  url.pathname = `/preview/${segment}`;
  return NextResponse.rewrite(url);
}

export async function proxy(request: NextRequest) {
  const previewResponse = handlePreviewHostUrls(request);
  if (previewResponse) return previewResponse;
  return updateSession(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/auth/:path*",
    "/preview/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
