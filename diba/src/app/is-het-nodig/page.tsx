import type { Metadata } from "next";
import IsHetNodigTemplate from "@/components/templates/IsHetNodigTemplate";
import { PAGE_DEFAULTS } from "@/lib/page-defaults";
import { NOG_IN_AANBOUW } from "@/lib/pagina-af";

export const metadata: Metadata = {
  title: "Is het nodig?",
  ...NOG_IN_AANBOUW,
};

const PADEN = [
  {
    label: "Start Behandeling Nul",
    href: "/intake",
    toelichting: "Gratis intake van 4 minuten. Soms is het antwoord nee.",
  },
  {
    label: "Bekijk huidproblemen",
    href: "/huidproblemen",
    toelichting: "Herken je iets? Lees eerst wat er in je huid gebeurt.",
  },
  {
    label: "Bekijk behandelingen",
    href: "/behandelingen",
    toelichting: "Alle behandelingen met openbare prijzen.",
  },
  {
    label: "Stel je vraag",
    href: PAGE_DEFAULTS.whatsappHref,
    toelichting: "Via WhatsApp. Geen chatbot, een mens reageert.",
  },
];

export default function IsHetNodigPage() {
  return <IsHetNodigTemplate paden={PADEN} {...PAGE_DEFAULTS} />;
}
