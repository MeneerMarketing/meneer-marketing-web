import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import SiteChrome from "@/components/ui/SiteChrome";
import RevealObserver from "@/components/ui/RevealObserver";
import CookieBar from "@/components/ui/CookieBar";
import MobieleActiebalk from "@/components/ui/MobieleActiebalk";
import HuidprofielKnop from "@/components/ui/HuidprofielKnop";
import Analytics from "@/components/ui/Analytics";
import { medicalClinicSchema, SchemaMarkup } from "@/lib/schema";
import {
  DIBA_ADDRESS,
  DIBA_CITAAT,
  DIBA_NAP,
  DIBA_SITE,
  DIBA_SITE_URL,
  DIBA_SOCIALS,
} from "@/lib/site";
import "./globals.css";

/**
 * Huisstijl-font (DIBA-RULES §4). Zelf-gehost door next/font — geen CDN-request.
 *
 * Bewust ZONDER `weight`: dan laadt next/font de variabele versie van DM Sans, met
 * de assen `opsz` (optical size) en `wght`. Dat is dezelfde bouw als het bestand dat
 * de Figma-export van static.figma.com haalde ("DMSans_opsz_wght").
 *
 * Met vier losse gewichten stond `font-optical-sizing: auto` er wel, maar deed het
 * niets — er was geen opsz-as om aan te draaien. Grote koppen kregen daardoor de
 * lettervormen van een tekstgrootte: te open, te breed. Precies het verschil dat je
 * ziet als je onze koppen naast het Figma-ontwerp legt.
 */
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-figma-home",
  display: "swap",
  preload: true,
});

const archivo = localFont({
  src: [
    {
      path: "../fonts/archivo-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/archivo-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-archivo",
  display: "swap",
  // Wordt uitgefaseerd; alleen nog op niet-gemigreerde binnenpagina's. Niet preloaden.
  preload: false,
});

const fraunces = localFont({
  src: [
    {
      path: "../fonts/fraunces-latin-300-italic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../fonts/fraunces-latin-400-italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-fraunces",
  display: "swap",
  preload: false,
});

const inter = localFont({
  src: [
    {
      path: "../fonts/inter-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/inter-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: `${DIBA_SITE.name} | ${DIBA_SITE.area}`,
    template: `%s | ${DIBA_SITE.name}`,
  },
  description: DIBA_CITAAT,
  metadataBase: new URL(DIBA_SITE.baseUrl),
  // Geen `icons` meer: src/app/icon.svg wordt automatisch als favicon opgepikt.
  // Dat is de groene variant uit de merkmap (#405038) in plaats van de bijna-zwarte
  // PNG, en 2 kB in plaats van 70 kB.
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${dmSans.variable} ${archivo.variable} ${fraunces.variable} ${inter.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        <SchemaMarkup
          data={medicalClinicSchema({
            nap: DIBA_NAP,
            url: DIBA_SITE_URL,
            /* Rojda, 7 september 2026: de Instagram koppelen. Voor Google is dit de
               koppeling: hetzelfde bedrijf op een andere plek. Sinds 11 september 2026
               staan TikTok en Facebook er ook in; met alleen de Instagram erin legt Google
               die koppeling voor de andere twee niet. */
            sameAs: DIBA_SOCIALS.length
              ? DIBA_SOCIALS.map((kanaal) => kanaal.url)
              : undefined,
          })}
        />
        <SiteChrome>
          <RevealObserver />
          {children}
        </SiteChrome>
        <span className="sr-only">{DIBA_ADDRESS.line}</span>
        <HuidprofielKnop />
        <MobieleActiebalk />
        <CookieBar />
        <Analytics />
      </body>
    </html>
  );
}
