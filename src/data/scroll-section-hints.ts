/**
 * Scroll-hints voor het "Je bent hier"-wolkje (desktop).
 * Geen titels kopiëren: korte, Meneer-achtige teksten.
 */
export const SCROLL_SECTION_HINTS: Readonly<Record<string, string>> = {
  // Homepage hero
  "hero-heading":
    "Start. Site, shop, ads. Ik regel het hele online plaatje, jij het echte werk.",

  // USP-balk
  Specialismes:
    "Vijf blokken, één aanspreekpunt. Geen 'dat doen wij niet' tussen door.",

  // Desktop
  services: "Mijn kantoor. Klik rond, zie wat ik bouw en fix.",
  "services-heading": "Mijn kantoor. Klik rond, zie wat ik bouw en fix.",
  "home-ideal-route-heading":
    "De route. Geen funnel uit 2018, wel wat echt converteert.",
  "home-about-meneer-title":
    "Over mij. Twaalf jaar online, nul keer 'even snel een template'.",
  "home-proof-heading":
    "Cases. Geen stockfoto-handdruk, wel shops die echt draaien.",
  "home-why-meneer-heading":
    "Waarom ik? Omdat je geen tiende bureau nodig hebt dat scope verschuift.",
  "even-rechtzetten-heading":
    "Mythes. LinkedIn zegt veel. Ik zeg wat klopt.",
  "insights-heading":
    "Kennisbank. Alles wat ik weet, gratis. Geen paywall op common sense.",
  "home-cta": "Afsluiter. Waar zit jouw groei? Vertel het, ik reageer zelf.",

  // Mobiel editorial
  bouwen: "Bouwen. Vertel je idee. Webshop, app, site. Meestal kan het gewoon.",
  "bouwen-mobile-title":
    "Bouwen. Vertel je idee. Webshop, app, site. Meestal kan het gewoon.",
  "over-meneer":
    "Over Meneer. Het hoofdje linksboven heeft ook een verhaal.",
  "mobile-about-meneer-title":
    "Over Meneer. Het hoofdje linksboven heeft ook een verhaal.",
  "mobile-ai-billboard-title":
    "AI-zoek. ChatGPT, Gemini en meer. Swipe en zie hoe het klinkt.",
  vindbaarheid:
    "Google SEO. 12+ jaar. Tik door de tijdlijn en zie je ranking stijgen.",
  "chapter-vindbaarheid-title":
    "Google SEO. 12+ jaar. Tik door de tijdlijn en zie je ranking stijgen.",
  campagnes:
    "Ads. Klein testen, hard meten. Jouw budget is geen roulette.",
  "chapter-campagnes-title":
    "Ads. Klein testen, hard meten. Jouw budget is geen roulette.",
  "mobile-myth-heading":
    "Even rechtzetten. Swipe. Influencers liegen soms, ik niet (vaak).",
  "mobile-funfacts-heading":
    "Weetjes. Nutteloos? Misschien. Grappig? Zeker weten.",
  "mobile-cta": "Laatste stop. Plan een gesprek of mail. Ik bijt niet.",

  // Footer
  "site-footer": "Footer. Contact, links, en ik wil gewoon even contact, ofzo.",
  Footer: "Footer. Contact, links, en ik wil gewoon even contact, ofzo.",
};

export function resolveScrollSectionHint(el: HTMLElement): string {
  const dataHint = el.getAttribute("data-scroll-hint")?.trim();
  if (dataHint) return dataHint;

  if (el.id && SCROLL_SECTION_HINTS[el.id]) {
    return SCROLL_SECTION_HINTS[el.id]!;
  }

  const labelledBy = el.getAttribute("aria-labelledby")?.trim();
  if (labelledBy) {
    for (const id of labelledBy.split(/\s+/)) {
      if (SCROLL_SECTION_HINTS[id]) return SCROLL_SECTION_HINTS[id]!;
    }
  }

  const ariaLabel = el.getAttribute("aria-label")?.trim();
  if (ariaLabel && SCROLL_SECTION_HINTS[ariaLabel]) {
    return SCROLL_SECTION_HINTS[ariaLabel];
  }

  return getVisibleHeadingText(el);
}

function getVisibleHeadingText(el: HTMLElement): string {
  const heading = el.querySelector("h2, h1");
  if (!(heading instanceof HTMLElement)) return "";

  const chunks: string[] = [];
  for (const node of heading.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) chunks.push(text);
      continue;
    }
    if (!(node instanceof HTMLElement)) continue;
    const style = window.getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden") continue;
    const text = node.textContent?.trim();
    if (text) chunks.push(text);
  }

  return chunks.join(" ").replace(/\s+/g, " ").slice(0, 88);
}
