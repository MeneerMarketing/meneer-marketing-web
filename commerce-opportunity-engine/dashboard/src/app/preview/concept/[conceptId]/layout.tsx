import { Archivo, DM_Sans, Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-pdtc-ui",
  display: "swap",
  weight: ["400", "500", "600"],
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-pdtc-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-pdtc-nav",
  display: "swap",
  weight: ["400", "500"],
});

export default function ConceptPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.variable} ${archivo.variable} ${dmSans.variable}`}>
      {children}
    </div>
  );
}
