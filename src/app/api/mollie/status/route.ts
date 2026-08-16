import { NextResponse } from "next/server";

import { isMollieConfigured } from "@/lib/mollie/config";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ configured: isMollieConfigured() });
}
