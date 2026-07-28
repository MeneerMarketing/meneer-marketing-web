import type { Metadata } from "next";
import PrijzenTemplate from "@/components/templates/PrijzenTemplate";
import { NOG_IN_AANBOUW } from "@/lib/pagina-af";

export const metadata: Metadata = {
  title: "Prijzen",
  description:
    "Volledige prijzen bij Diba Clinics. Trajectprijs naast losse prijs, filterbaar per categorie.",
  ...NOG_IN_AANBOUW,
};

export default function PrijzenPage() {
  return <PrijzenTemplate />;
}
