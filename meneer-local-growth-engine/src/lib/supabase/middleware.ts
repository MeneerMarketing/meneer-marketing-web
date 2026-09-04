import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { isProtectedApiPath } from "@/lib/http/apiRouteAccess";

function apiUnauthorized(): NextResponse {
  return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
}

function apiUnavailable(): NextResponse {
  return NextResponse.json(
    { ok: false, error: "supabase_not_configured" },
    { status: 503 },
  );
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const bypass = process.env.LGE_DEV_AUTH_BYPASS === "true";

  const pathname = request.nextUrl.pathname;
  const isDashboard = pathname.startsWith("/dashboard");
  const isLogin = pathname.startsWith("/login");
  const isAuthCallback = pathname.startsWith("/auth");
  const isProtectedApi = isProtectedApiPath(pathname);
  const needsSession = isDashboard || isLogin || isProtectedApi;

  if (!needsSession) {
    return supabaseResponse;
  }

  if (!url || !key) {
    if (isDashboard && !bypass) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("error", "supabase_not_configured");
      return NextResponse.redirect(redirectUrl);
    }
    if (isProtectedApi && !bypass) {
      return apiUnavailable();
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.auth.refreshSession().catch(() => null);
  }

  if (isProtectedApi && !user && !bypass) {
    return apiUnauthorized();
  }

  if (isDashboard && !user && !bypass) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isLogin && user && !isAuthCallback) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
