/** Gedeelde navigatie — homepage (anchors) vs inner pages (/#anchor). */

export type FigmaNavItem = {
  label: string;
  href: string;
  /** Anchor op homepage, bv. #voorjou */
  homeHref?: string;
};

export const FIGMA_DESKTOP_NAV: readonly FigmaNavItem[] = [
  { label: "Voor jou", href: "/#voorjou", homeHref: "#voorjou" },
  { label: "De huidscan", href: "/#huidscan", homeHref: "#huidscan" },
  { label: "Onze werkwijze", href: "/#werkwijze", homeHref: "#werkwijze" },
  { label: "Kennisbank", href: "/#kennis", homeHref: "#kennis" },
  { label: "Prijzen", href: "/prijzen" },
] as const;

export const FIGMA_MOBILE_NAV: readonly FigmaNavItem[] = [
  { label: "Voor jou", href: "/#voorjou", homeHref: "#voorjou" },
  { label: "Huidscan", href: "/#huidscan", homeHref: "#huidscan" },
  { label: "Prijzen", href: "/prijzen" },
  { label: "Afspraak maken", href: "/intake" },
] as const;

export function figmaNavHref(item: FigmaNavItem, onHome: boolean): string {
  if (onHome && item.homeHref) return item.homeHref;
  return item.href;
}

export function isInternalRoute(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("/#");
}
