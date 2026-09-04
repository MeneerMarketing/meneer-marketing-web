import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "optional",
});

export const metadata: Metadata = {
  title: "Meneer Marketing · Commerce Opportunity Engine",
  description:
    "Interne intelligence dashboard voor Google Ads discovery, webshop qualification en opportunities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={`${plusJakarta.variable} antialiased`}>{children}</body>
    </html>
  );
}
