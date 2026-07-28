"use client";

import { usePathname } from "next/navigation";
import FigmaSiteHeaderBlock from "@/components/figma/FigmaSiteHeaderBlock";
import SiteFooter from "@/components/ui/SiteFooter";
import { figmaHomeShell } from "@/lib/figma-home-layout";

type SiteChromeProps = {
  children: React.ReactNode;
  whatsappHref: string;
  instagramHref?: string;
};

/** Homepage = FigmaHomeApp (eigen chrome). Overige pagina's = zelfde header/top bar + Figma shell. */
export default function SiteChrome({
  children,
  whatsappHref,
  instagramHref,
}: SiteChromeProps) {
  const pathname = usePathname();
  const isFigmaHome = pathname === "/";

  if (isFigmaHome) {
    return <>{children}</>;
  }

  return (
    <div className={figmaHomeShell}>
      <FigmaSiteHeaderBlock variant="inner" whatsappHref={whatsappHref} />
      {children}
      <SiteFooter instagramHref={instagramHref} />
    </div>
  );
}
