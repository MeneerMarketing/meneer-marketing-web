import { getIndexNowKey } from "@/lib/seo/indexnow";

/** Verificatiebestand voor IndexNow: /{INDEXNOW_KEY}.txt */
export async function GET() {
  const key = getIndexNowKey();
  if (!key) {
    return new Response("IndexNow niet geconfigureerd", { status: 404 });
  }

  return new Response(key, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
