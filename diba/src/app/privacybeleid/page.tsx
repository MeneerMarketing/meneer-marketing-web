import type { Metadata } from "next";
import ContentPageTemplate from "@/components/templates/ContentPageTemplate";
import { DIBA_ADDRESS, DIBA_NAP } from "@/lib/site";
import { PAGE_DEFAULTS } from "@/lib/page-defaults";

export const metadata: Metadata = {
  title: "Privacybeleid",
  description:
    "Hoe Diba Clinics omgaat met persoonsgegevens. EU-hosting, minimale data, geen advertentie-profielen.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <ContentPageTemplate
      h1="Privacybeleid"
      breadcrumbLabel="Privacybeleid"
      breadcrumbPath="/privacybeleid"
      intro="We verzamelen alleen wat nodig is om u te helpen. Geen verkoop van data, geen advertentie-profielen."
      secties={[
        {
          kop: "Wie zijn *wij*?",
          alineas: [
            `${DIBA_NAP.name}, gevestigd aan ${DIBA_ADDRESS.line}.`,
            "[COPY-NODIG: juridische entiteit en contact voor privacyvragen]",
          ],
        },
        {
          kop: "Welke gegevens *verwerken* we?",
          alineas: [
            "Contactgegevens die u zelf invult (e-mail bij intake, WhatsApp-berichten).",
            "Afspraak- en behandelgegevens via Salonized (ons boekingssysteem).",
            "Anonieme sitestatistieken, alleen na cookie-akkoord (zie cookiebeleid).",
          ],
        },
        {
          kop: "Waarvoor *gebruiken* we ze?",
          alineas: [
            "Om uw intake te verwerken en u te bereiken met uw uitkomst.",
            "Om afspraken te plannen en uw behandeltraject bij te houden.",
            "Om de site te verbeteren (anoniem, zonder profielen).",
          ],
        },
        {
          kop: "Bewaartermijn en *opslag*",
          alineas: [
            "Persoonsgegevens worden opgeslagen binnen de EU.",
            "[COPY-NODIG: bewaartermijnen per gegevenstype]",
          ],
        },
        {
          kop: "Uw *rechten*",
          alineas: [
            "U mag uw gegevens inzien, laten corrigeren of laten verwijderen waar de wet dat toelaat.",
            "Neem contact op via WhatsApp of [GEGEVEN-NODIG: privacy-e-mail].",
          ],
        },
        {
          kop: "Cookies",
          alineas: [
            "Zie ons cookiebeleid voor analytische cookies en uw keuze.",
          ],
        },
      ]}
      primaireCta={{ label: "Terug naar home", href: "/" }}
      {...PAGE_DEFAULTS}
    />
  );
}
