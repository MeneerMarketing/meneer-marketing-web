import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Hard block: facturen horen nooit op meneermarketing.nl (alleen lokaal tool). */
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/factuur")) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/factuur", "/factuur/:path*"],
};
