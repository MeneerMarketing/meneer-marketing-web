import * as cheerio from "cheerio";
import type { ImageCandidate, WebsiteIntelligence } from "./types";

const SKIP =
  /pixel|tracker|sprite|icon|favicon|logo|badge|payment|ideal|paypal|visa|mastercard|facebook|twitter|linkedin|whatsapp|cookie|1x1|spacer|arrow|button/i;

function scoreImage(opts: {
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
  className: string;
}): { score: number; semantic_type: ImageCandidate["semantic_type"] } {
  const blob = `${opts.url} ${opts.alt} ${opts.className}`.toLowerCase();
  if (SKIP.test(blob) && !/studio|reformer|pilates|les|class|trainer/i.test(blob)) {
    return { score: 0, semantic_type: "other" };
  }

  let score = 40;
  let semantic: ImageCandidate["semantic_type"] = "gallery";

  if (/reformer/i.test(blob)) {
    score += 25;
    semantic = "reformer";
  } else if (/hero|banner|header|cover/i.test(blob)) {
    score += 20;
    semantic = "hero";
  } else if (/studio|ruimte|interior|interieur/i.test(blob)) {
    score += 18;
    semantic = "studio";
  } else if (/team|trainer|instructor|docent/i.test(blob)) {
    score += 12;
    semantic = "team";
  } else if (/pilates|yoga|les|class|movement/i.test(blob)) {
    score += 15;
    semantic = "atmosphere";
  }

  const w = opts.width ?? 0;
  const h = opts.height ?? 0;
  if (w > 0 && w < 200) score -= 30;
  if (h > 0 && h < 200) score -= 20;
  if (w >= 800) score += 15;
  else if (w >= 400) score += 8;

  if (/\.svg(\?|$)/i.test(opts.url)) score -= 15;

  return { score: Math.max(0, Math.min(100, score)), semantic_type: semantic };
}

export function extractImages(
  intelligence: WebsiteIntelligence,
  extras?: { google_main_image?: string | null; google_logo?: string | null }
): ImageCandidate[] {
  const candidates: ImageCandidate[] = [];
  const seen = new Set<string>();

  for (const page of intelligence.pages) {
    const $ = cheerio.load(page.html);
    $("img").each((_, el) => {
      const src = $(el).attr("src") || $(el).attr("data-src") || $(el).attr("data-lazy-src");
      if (!src || src.startsWith("data:")) return;
      let abs: string;
      try {
        abs = new URL(src, page.url).toString();
      } catch {
        return;
      }
      if (seen.has(abs)) return;
      seen.add(abs);

      const width = Number($(el).attr("width")) || null;
      const height = Number($(el).attr("height")) || null;
      const alt = ($(el).attr("alt") ?? "").trim();
      const className = ($(el).attr("class") ?? "").trim();
      const { score, semantic_type } = scoreImage({
        url: abs,
        alt,
        width,
        height,
        className,
      });
      if (score < 35) return;

      candidates.push({
        url: abs,
        source_page: page.url,
        alt_text: alt || "Studio beeld",
        width,
        height,
        semantic_type,
        score,
      });
    });
  }

  if (extras?.google_main_image && !seen.has(extras.google_main_image)) {
    candidates.push({
      url: extras.google_main_image,
      source_page: "google_business",
      alt_text: "Google Business hoofdafbeelding",
      width: null,
      height: null,
      semantic_type: "hero",
      score: 70,
    });
  }

  return candidates.sort((a, b) => b.score - a.score).slice(0, 16);
}
