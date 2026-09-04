import type { Metadata } from "next";
import {
  DM_Sans,
  Figtree,
  Instrument_Serif,
  Inter,
  Newsreader,
} from "next/font/google";
import "./globals.css";

/** A — Editorial: literary serif + clean grotesque */
const editorialSerif = Newsreader({
  variable: "--font-editorial-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const editorialSans = Figtree({
  variable: "--font-editorial-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

/** B — Figma full-screen: single optical sans (DIBA language) */
const figmaDisplay = DM_Sans({
  variable: "--font-figma-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/** C — Cinematic: high-contrast magazine serif met expressieve italic */
const cineDisplay = Instrument_Serif({
  variable: "--font-cine-display",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

/** C — Cinematic: neutrale grotesque voor labels en lopende tekst */
const cineSans = Inter({
  variable: "--font-cine-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Local Growth Engine · Meneer Marketing",
  description:
    "Interne preview-engine voor gepersonaliseerde lokale conceptwebsites. Milestone 1: Pilates templates.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      suppressHydrationWarning
      className={`${editorialSerif.variable} ${editorialSans.variable} ${figmaDisplay.variable} ${cineDisplay.variable} ${cineSans.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
