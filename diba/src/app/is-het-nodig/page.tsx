import type { Metadata } from "next";
import IsHetNodigTemplate from "@/components/templates/IsHetNodigTemplate";
import { PAGE_DEFAULTS } from "@/lib/page-defaults";

export const metadata: Metadata = {
  title: "Is het nodig?",
  description: "[COPY-NODIG]",
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
    toelichting: "Herken u iets? Lees eerst wat er in uw huid gebeurt.",
  },
  {
    label: "Bekijk behandelingen",
    href: "/behandelingen",
    toelichting: "Alle behandelingen met openbare prijzen.",
  },
  {
    label: "Stel uw vraag",
    href: PAGE_DEFAULTS.whatsappHref,
    toelichting: "Via WhatsApp. Geen chatbot, een mens reageert.",
  },
];

export default function IsHetNodigPage() {
  return <IsHetNodigTemplate paden={PADEN} {...PAGE_DEFAULTS} />;
}
