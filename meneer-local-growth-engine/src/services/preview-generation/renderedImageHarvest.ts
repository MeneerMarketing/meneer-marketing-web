import { scoreImage } from "./imageExtractor";
import type { ImageCandidate } from "./types";

/**
 * Rendered image harvest.
 *
 * Wix, Squarespace and most page builders paint their photography client-side:
 * a static fetch returns a shell and the crawler finds nothing usable. Since a
 * preview built on someone else's stock photos undercuts the whole proposition,
 * we render the page in a real browser and read the images the visitor sees.
 *
 * Playwright is loaded dynamically; without it we fall back to whatever the
 * static crawl found.
 */

type PlaywrightModule = typeof import("playwright");

let playwrightPromise: Promise<PlaywrightModule | null> | null = null;

async function loadPlaywright(): Promise<PlaywrightModule | null> {
  if (!playwrightPromise) {
    playwrightPromise = import("playwright").catch(() => null);
  }
  return playwrightPromise;
}

interface RawShot {
  url: string;
  alt: string;
  className: string;
  naturalWidth: number;
  naturalHeight: number;
  renderedWidth: number;
  renderedHeight: number;
  top: number;
}

export interface RenderedHarvestResult {
  candidates: ImageCandidate[];
  pages_rendered: number;
  error: string | null;
  duration_ms: number;
}

/**
 * Runs in the browser: collect every painted image plus CSS backgrounds.
 *
 * Kept as a source string on purpose. Passing a function reference makes
 * Playwright serialise the *transpiled* body, which carries esbuild helpers
 * like `__name` that do not exist in the page.
 */
const COLLECT_SCRIPT = `(() => {
  const out = [];
  const seen = new Set();

  const push = (raw) => {
    if (!raw.url || raw.url.indexOf('data:') === 0 || seen.has(raw.url)) return;
    seen.add(raw.url);
    out.push({
      url: raw.url,
      alt: raw.alt || '',
      className: raw.className || '',
      naturalWidth: raw.naturalWidth || 0,
      naturalHeight: raw.naturalHeight || 0,
      renderedWidth: raw.renderedWidth || 0,
      renderedHeight: raw.renderedHeight || 0,
      top: raw.top || 0,
    });
  };

  for (const img of Array.from(document.images)) {
    const box = img.getBoundingClientRect();
    push({
      url: img.currentSrc || img.src,
      alt: img.alt,
      className: typeof img.className === 'string' ? img.className : '',
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      renderedWidth: box.width,
      renderedHeight: box.height,
      top: box.top + window.scrollY,
    });
  }

  for (const el of Array.from(document.querySelectorAll('*'))) {
    const background = window.getComputedStyle(el).backgroundImage;
    if (!background || background === 'none') continue;
    const match = /url\\((['"]?)(.*?)\\1\\)/.exec(background);
    if (!match || !match[2]) continue;
    const box = el.getBoundingClientRect();
    if (box.width < 320 || box.height < 200) continue;
    let absolute;
    try { absolute = new URL(match[2], document.baseURI).toString(); } catch (e) { continue; }
    push({
      url: absolute,
      alt: el.getAttribute('aria-label') || '',
      className: typeof el.className === 'string' ? el.className : '',
      renderedWidth: box.width,
      renderedHeight: box.height,
      top: box.top + window.scrollY,
    });
  }

  return out;
})()`;

const SCROLL_SCRIPT = `(async () => {
  const step = window.innerHeight;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((done) => setTimeout(done, 220));
  }
  window.scrollTo(0, 0);
})()`;

/**
 * Page builders serve one source at many sizes. Keeping every crop would fill
 * the gallery with the same photo, so we key on the file identity and keep the
 * largest variant.
 */
function imageIdentity(url: string): string {
  try {
    const parsed = new URL(url);
    const file = parsed.pathname.split("/").filter(Boolean).pop() ?? parsed.pathname;
    // Wix appends /v1/fill/w_800,h_600,.../file.jpg — the filename stays stable.
    return `${parsed.hostname}/${file.toLowerCase()}`;
  } catch {
    return url;
  }
}

function widthOf(url: string, fallback: number): number {
  const match = /[/_](?:w|width)[_=](\d{2,4})/i.exec(url);
  return match?.[1] ? Number(match[1]) : fallback;
}

export async function harvestRenderedImages(input: {
  pageUrls: string[];
  maxPages?: number;
  timeoutMs?: number;
}): Promise<RenderedHarvestResult> {
  const started = Date.now();
  const base: RenderedHarvestResult = {
    candidates: [],
    pages_rendered: 0,
    error: null,
    duration_ms: 0,
  };

  const pages = input.pageUrls.filter(Boolean).slice(0, input.maxPages ?? 3);
  if (!pages.length) {
    return { ...base, error: "no_pages", duration_ms: Date.now() - started };
  }

  const playwright = await loadPlaywright();
  if (!playwright) {
    return { ...base, error: "playwright_unavailable", duration_ms: Date.now() - started };
  }

  const timeout = input.timeoutMs ?? 20_000;
  let browser: Awaited<ReturnType<PlaywrightModule["chromium"]["launch"]>> | null = null;
  const best = new Map<string, ImageCandidate>();
  let rendered = 0;
  let error: string | null = null;

  try {
    browser = await playwright.chromium.launch({ args: ["--no-sandbox"] });
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
      locale: "nl-NL",
    });

    for (const pageUrl of pages) {
      const page = await context.newPage();
      try {
        await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout });
        // Lazy loaders only fire on scroll, so walk the page before reading it.
        await page.evaluate(SCROLL_SCRIPT);
        await page.waitForTimeout(700);

        const shots = (await page.evaluate(COLLECT_SCRIPT)) as RawShot[];
        rendered += 1;

        for (const shot of shots) {
          if (/\.svg(\?|$)/i.test(shot.url)) continue;
          const width = shot.naturalWidth || widthOf(shot.url, Math.round(shot.renderedWidth));
          const height = shot.naturalHeight || Math.round(shot.renderedHeight);
          // Anything this small is chrome: icons, avatars, payment badges.
          if (width && width < 400) continue;
          if (shot.renderedWidth && shot.renderedWidth < 200) continue;

          const { score, semantic_type } = scoreImage({
            url: shot.url,
            alt: shot.alt,
            width,
            height,
            className: shot.className,
          });
          if (score < 35) continue;

          // The first big image on the homepage is the hero, whatever it is named.
          const isHero = shot.top < 900 && (shot.renderedWidth ?? 0) > 700;
          const candidate: ImageCandidate = {
            url: shot.url,
            source_page: pageUrl,
            alt_text: shot.alt || "Studio beeld",
            width: width || null,
            height: height || null,
            semantic_type: isHero ? "hero" : semantic_type,
            score: Math.min(100, score + (isHero ? 20 : 0)),
          };

          const key = imageIdentity(shot.url);
          const current = best.get(key);
          if (!current || (candidate.width ?? 0) > (current.width ?? 0)) {
            best.set(key, current ? { ...candidate, score: Math.max(current.score, candidate.score) } : candidate);
          }
        }
      } catch (pageError) {
        error = pageError instanceof Error ? pageError.message : "page_failed";
      } finally {
        await page.close().catch(() => undefined);
      }
    }

    await context.close();
  } catch (launchError) {
    error = launchError instanceof Error ? launchError.message : "browser_failed";
  } finally {
    await browser?.close().catch(() => undefined);
  }

  const candidates = [...best.values()].sort((a, b) => b.score - a.score).slice(0, 16);
  return {
    candidates,
    pages_rendered: rendered,
    error: candidates.length ? null : error,
    duration_ms: Date.now() - started,
  };
}
