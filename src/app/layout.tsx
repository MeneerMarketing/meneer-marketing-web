import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SiteConsent } from "@/components/consent/SiteConsent";
import { JsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://meneermarketing.nl";

export const metadata: Metadata = {
  title: {
    default: "MeneerMarketing. Groei, web & automatisering",
    template: "%s | MeneerMarketing",
  },
  description:
    "Marketingbureau voor groei: maatwerk websites, Shopify-thema's, SEO, ads, e-mailmarketing en automatisering. Strategisch partner. Technisch sterk, menselijk in de aanpak.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl.replace(/\/$/, ""),
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: siteUrl.replace(/\/$/, ""),
    siteName: "MeneerMarketing",
    title: "MeneerMarketing. Groei, web & automatisering",
    description:
      "Maatwerk websites, Shopify-thema's, SEO, ads, e-mailmarketing en automatisering. Strategisch partner voor ondernemers die willen schalen.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MeneerMarketing. Groei, web & automatisering",
    description:
      "Maatwerk websites, Shopify, SEO, ads, e-mailmarketing en automatisering voor schaalbare groei.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e0f2fe" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1222" },
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
        <SiteConsent />
      </body>
    </html>
  );
}
