import type { Metadata } from "next";
import ContentPageTemplate from "@/components/templates/ContentPageTemplate";
import { DIBA_NAP } from "@/lib/site";
import { PAGE_DEFAULTS } from "@/lib/page-defaults";

export const metadata: Metadata = {
  title: "Algemene voorwaarden",
  description: "[COPY-NODIG]",
};

export default function VoorwaardenPage() {
  return (
    <ContentPageTemplate
      h1="Algemene voorwaarden"
      breadcrumbLabel="Algemene voorwaarden"
      breadcrumbPath="/algemene-voorwaarden"
      intro="[COPY-NODIG: voorwaarden-intro] De regels rond afspraken, betaling en annulering."
      secties={[
        {
          kop: "Afspraken en *annulering*",
          alineas: [
            "[COPY-NODIG: annuleringsvoorwaarden]",
            "[COPY-NODIG: no-show beleid]",
          ],
        },
        {
          kop: "Betaling en *termijnen*",
          alineas: [
            "[COPY-NODIG: betalingsvoorwaarden Mollie/Salonized]",
            "Geen korting, geen actiecodes. Prijzen op de site zijn leidend.",
          ],
        },
        {
          kop: "Behandeling en *verwachtingen*",
          alineas: [
            "[COPY-NODIG: medische disclaimer] [MEDISCHE-CHECK-ROJDA]",
            "Resultaten verschillen per huid. Geen garanties zonder meetmoment.",
          ],
        },
        {
          kop: "Aansprakelijkheid",
          alineas: ["[COPY-NODIG: aansprakelijkheid juridische tekst]"],
        },
        {
          kop: "Contact",
          alineas: [
            `Vragen over deze voorwaarden: neem contact op met ${DIBA_NAP.name} via WhatsApp of [GEGEVEN-NODIG: e-mail].`,
          ],
        },
      ]}
      primaireCta={{ label: "Terug naar home", href: "/" }}
      {...PAGE_DEFAULTS}
    />
  );
}
