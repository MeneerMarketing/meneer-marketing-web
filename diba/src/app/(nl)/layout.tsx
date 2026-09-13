import type { Metadata } from "next";
import Paginaschil from "@/components/ui/Paginaschil";
import { basisMetadata } from "@/lib/basis-metadata";
import "../globals.css";

/**
 * De wortelindeling van de Nederlandse site.
 *
 * De routegroep `(nl)` staat niet in het adres: `/(nl)/tarieven` is gewoon `/tarieven`.
 * De haakjes zijn er om deze indeling te kunnen scheiden van de Engelse, die dezelfde
 * schil gebruikt met een andere taal.
 */
export const metadata: Metadata = basisMetadata("nl");

export default function NederlandseIndeling({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Paginaschil taal="nl">{children}</Paginaschil>;
}
