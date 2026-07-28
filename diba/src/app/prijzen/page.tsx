import type { Metadata } from "next";
import PrijzenTemplate from "@/components/templates/PrijzenTemplate";

export const metadata: Metadata = {
  title: "Prijzen",
  description:
    "Volledige prijzen bij Diba Clinics. Trajectprijs naast losse prijs, filterbaar per categorie.",
};

export default function PrijzenPage() {
  return <PrijzenTemplate />;
}
