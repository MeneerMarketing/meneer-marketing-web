import type { PillarSlug } from "@/lib/navigation";

export interface MegaMenuExtraLink {
  label: string;
  href: string;
}

/** Drie compacte links onder Uitgelicht in het mega-menu. */
export function getMegaMenuExtraLinks(pillarSlug: PillarSlug): MegaMenuExtraLink[] {
  return [
    { label: "Kennisbank", href: `/kennisbank#kb-${pillarSlug}` },
    { label: "Werkwijze", href: "/werkwijze" },
    { label: "FAQ", href: "/faq" },
  ];
}
