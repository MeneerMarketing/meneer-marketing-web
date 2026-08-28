import { NextResponse, type NextRequest } from "next/server";
import {
  PREVIEW_AUTH_COOKIE,
  previewAuthToken,
  previewPasswordConfigured,
} from "@/lib/preview-auth";

const PUBLIC_PATHS = ["/preview-login", "/api/preview-auth"] as const;

export async function middleware(request: NextRequest) {
  if (!previewPasswordConfigured()) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  if (
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  ) {
    return NextResponse.next();
  }

  const password = process.env.PREVIEW_PASSWORD!.trim();
  const expected = await previewAuthToken(password);
  const cookie = request.cookies.get(PREVIEW_AUTH_COOKIE)?.value;

  if (cookie === expected) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/preview-login";
  loginUrl.searchParams.set("from", pathname === "/" ? "" : pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2|ico)$).*)",
  ],
};
