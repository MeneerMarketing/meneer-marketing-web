import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";

/**
 * De lettertypes van de site, op één plek.
 *
 * Ze stonden in `app/layout.tsx`. Sinds de site twee wortelindelingen heeft, een
 * Nederlandse en een Engelse, zou die aanroep twee keer gebeuren. `next/font` maakt dan
 * twee keer dezelfde set bestanden en zet twee keer dezelfde preload in de kop. Vanuit
 * één module aanroepen en de klassen exporteren houdt het bij één.
 */

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

/** De klassen die op het html-element horen, in beide talen dezelfde. */
export const LETTERKLASSEN = `${dmSans.variable} ${archivo.variable} ${fraunces.variable} ${inter.variable}`;
