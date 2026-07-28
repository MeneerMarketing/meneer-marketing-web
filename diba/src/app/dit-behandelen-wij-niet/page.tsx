import type { Metadata } from "next";
import DitBehandelenTemplate from "@/components/templates/DitBehandelenTemplate";
import { PAGE_DEFAULTS } from "@/lib/page-defaults";

export const metadata: Metadata = {
  title: "Dit behandelen wij niet",
  description:
    "Eerlijke grenzen bij Diba Clinics. Wat wij niet kunnen staat hier ook, zonder verborgen addertjes.",
};

export default function DitBehandelenWijNietPage() {
  return <DitBehandelenTemplate {...PAGE_DEFAULTS} />;
}
