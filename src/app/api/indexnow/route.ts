import { NextResponse } from "next/server";
import { z } from "zod";

import {
  getIndexNowKeyLocation,
  getIndexNowUrls,
  isIndexNowAuthorized,
  submitIndexNowScope,
  submitToIndexNow,
  type IndexNowScope,
} from "@/lib/seo/indexnow";

const scopeSchema = z.enum(["priority", "kennisbank", "zoeken", "all"]);

const bodySchema = z.object({
  scope: scopeSchema.optional(),
  urls: z.array(z.string().url()).max(500).optional(),
});

function parseScope(value: string | null): IndexNowScope {
  const parsed = scopeSchema.safeParse(value);
  return parsed.success ? parsed.data : "priority";
}

async function handleSubmit(request: Request, defaultScope: IndexNowScope) {
  if (!isIndexNowAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let scope = defaultScope;
  let urls: string[] | undefined;

  if (request.method === "POST") {
    try {
      const json: unknown = await request.json();
      const parsed = bodySchema.safeParse(json);
      if (parsed.success) {
        scope = parsed.data.scope ?? defaultScope;
        urls = parsed.data.urls;
      }
    } catch {
      // Lege body: gebruik default scope
    }
  }

  const targetUrls = urls ?? getIndexNowUrls(scope);
  const result = await submitToIndexNow(targetUrls, scope);

  return NextResponse.json(result, { status: result.ok ? 200 : result.status });
}

/** Status (publiek). Submit via POST/GET met Bearer secret. */
export async function GET(request: Request) {
  const keyLocation = getIndexNowKeyLocation();
  const { searchParams } = new URL(request.url);
  const submit = searchParams.get("submit");

  if (submit === "1" || submit === "true") {
    return handleSubmit(request, parseScope(searchParams.get("scope")));
  }

  return NextResponse.json({
    configured: Boolean(keyLocation),
    keyLocation,
    scopes: {
      priority: getIndexNowUrls("priority").length,
      kennisbank: getIndexNowUrls("kennisbank").length,
      zoeken: getIndexNowUrls("zoeken").length,
      all: getIndexNowUrls("all").length,
    },
  });
}

/** Handmatige of cron-submit. Body: { scope?: "priority"|"kennisbank"|"zoeken"|"all", urls?: string[] } */
export async function POST(request: Request) {
  return handleSubmit(request, "priority");
}
