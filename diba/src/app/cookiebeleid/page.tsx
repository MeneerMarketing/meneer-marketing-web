import type { Metadata } from "next";
import ContentPageTemplate from "@/components/templates/ContentPageTemplate";
import { PAGE_DEFAULTS } from "@/lib/page-defaults";

export const metadata: Metadata = {
  title: "Cookiebeleid",
  description:
    "Hoe Diba Clinics cookies gebruikt: functioneel en anonieme statistieken. Geen advertentie-tracking.",
};

export default function CookiePage() {
  return (
    <ContentPageTemplate
      h1="Cookiebeleid"
      breadcrumbLabel="Cookiebeleid"
      breadcrumbPath="/cookiebeleid"
      intro="We houden het klein. Geen advertentie-tracking, geen pop-up die de site blokkeert."
      secties={[
        {
          kop: "Wat zijn *cookies*?",
          alineas: [
            "Cookies zijn kleine bestanden die uw browser opslaat. Ze helpen de site onthouden wat nodig is om goed te werken.",
          ],
        },
        {
          kop: "Welke cookies *gebruiken* we?",
          alineas: [
            "Functionele cookies: nodig om de site te laten werken, bijvoorbeeld uw cookievoorkeur onthouden.",
            "Analytische cookies: alleen als u akkoord geeft. We gebruiken anonieme statistieken om te zien welke pagina's helpen. Geen advertentie-profielen.",
          ],
        },
        {
          kop: "Diensten *achter* analytische cookies",
          alineas: [
            "Google Analytics 4 (anoniem IP-adres) en Microsoft Clarity, alleen na uw akkoord via de cookiebalk.",
            "Zonder akkoord laden deze scripts niet.",
          ],
        },
        {
          kop: "Uw *keuze*",
          alineas: [
            "Via de cookiebalk kunt u akkoord geven of dit beleid lezen. Uw keuze slaan we lokaal op in uw browser.",
            "Wilt u uw keuze wijzigen? Wis de sitegegevens van dibaclinics.nl in uw browser, of neem contact op via WhatsApp.",
          ],
        },
        {
          kop: "Vragen",
          alineas: [
            "[COPY-NODIG: contact voor privacyvragen] Zie ook ons privacybeleid voor hoe we met persoonsgegevens omgaan.",
          ],
        },
      ]}
      primaireCta={{ label: "Terug naar home", href: "/" }}
      {...PAGE_DEFAULTS}
    />
  );
}
