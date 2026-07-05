import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SiteConsent } from "@/components/consent/SiteConsent";
import { JsonLd } from "@/components/seo/JsonLd";
import { ScrollMeneer } from "@/components/site/ScrollMeneer";
import {
  buildOpenGraph,
  buildTwitter,
  SITE_NAME,
} from "@/lib/seo/site-metadata";
import { siteOrigin } from "@/lib/site";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const defaultTitle = "MeneerMarketing. Marketing, websites & Shopify";
const defaultDescription =
  "Websites from scratch, Shopify-shops, SEO, Google Ads, Meta Ads en e-mail. Eén strategisch partner voor online groei in Nederland.";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: defaultTitle,
    template: `%s | ${SITE_NAME}`,
  },
  description: defaultDescription,
  applicationName: SITE_NAME,
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
  },
  openGraph: buildOpenGraph({
    title: defaultTitle,
    description: defaultDescription,
    path: "/",
  }),
  twitter: buildTwitter({
    title: defaultTitle,
    description: defaultDescription,
  }),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0F172A" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-mm-bg text-mm-text">
        <JsonLd />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-mm-text focus:px-4 focus:py-2 focus:text-white"
        >
          Ga naar inhoud
        </a>
        {children}
        <ScrollMeneer />
        <SiteConsent />
      </body>
    </html>
  );
}
