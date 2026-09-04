import type { Metadata } from "next";
import { Bodoni_Moda, DM_Sans, Instrument_Sans } from "next/font/google";
import { JsonLdScript } from "@/components/json-ld";
import {
  HOME_DESCRIPTION,
  HOME_TITLE,
  localBusinessJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import { isSeoIndexable, SITE, siteUrl } from "@/lib/site";
import { CookieBar } from "@/components/cookie-bar";
import "./globals.css";

/*
 * DM Sans (variabele, met opsz) voor koppen: zelfde familie als DIBA Figma-home,
 * strakke negatieve tracking op grote titels.
 */
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

/*
 * Bodoni blijft alleen voor het "Lá Sweet"-wordmark: het echte logo
 * op de bekers en dozen is een hoog-contrast fashion-serif.
 */
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal"],
  variable: "--font-bodoni",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
});

const indexable = isSeoIndexable();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: HOME_TITLE,
    template: "%s | Lá Sweet by Ela",
  },
  description: HOME_DESCRIPTION,
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  keywords: [
    "matcha enschede",
    "koekjes enschede",
    "cookies enschede",
    "crumble cookies enschede",
    "strawberry matcha enschede",
    "iced matcha enschede",
    "cookie box enschede",
    "Lá Sweet by Ela",
    "la sweet by ela",
  ],
  alternates: {
    canonical: "/",
  },
  robots: indexable
    ? { index: true, follow: true, googleBot: { index: true, follow: true } }
    : {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
      },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: "/",
    siteName: SITE.name,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [
      {
        url: SITE.ogImagePath,
        width: 1200,
        height: 1200,
        alt: "Strawberry matcha van Lá Sweet by Ela in Enschede",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [SITE.ogImagePath],
  },
  icons: {
    icon: "/favicon.ico",
  },
  category: "food",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${dmSans.variable} ${bodoni.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream text-ink font-sans">
        <JsonLdScript data={[localBusinessJsonLd(), websiteJsonLd()]} />
        {children}
        <CookieBar />
      </body>
    </html>
  );
}
