import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { JsonLdScript, breadcrumbJsonLd } from "@/components/seo/JsonLd";
import { businessEmailDisplay } from "@/lib/contact";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookiebeleid",
  description:
    "Welke cookies MeneerMarketing gebruikt, waarvoor, en hoe je voorkeuren kunt aanpassen.",
  alternates: { canonical: absoluteUrl("/cookiebeleid") },
  robots: { index: true, follow: true },
};

export default function CookiePage() {
  return (
    <>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Cookiebeleid", path: "/cookiebeleid" },
        ])}
      />
      <LegalPageShell
        title="Cookiebeleid"
        intro="Laatst bijgewerkt: 6 april 2026. Cookies en vergelijkbare technieken helpen onze site veilig en bruikbaar te houden. En ons te laten leren wat werkt."
      >
        <h2>Wat zijn cookies?</h2>
        <p>
          Cookies zijn kleine tekstbestanden die op je apparaat worden geplaatst.
          Ze kunnen first-party (door ons) of third-party (door een ingebedde
          dienst) zijn.
        </p>

        <h2>Soorten cookies die wij kunnen gebruiken</h2>
        <ul>
          <li>
            <strong>Strikt noodzakelijk:</strong> voor beveiliging, sessies en
            basisfunctionaliteit van de site.
          </li>
          <li>
            <strong>Functioneel:</strong> om voorkeuren te onthouden (bijv.
            taal of formulierstatus).
          </li>
          <li>
            <strong>Analytisch:</strong> om bezoek en gebruik inzichtelijk te
            maken (bijv. paginaweergaves, fouten). Idealiter met
            privacy-vriendelijke instellingen en waar nodig toestemming.
          </li>
          <li>
            <strong>Marketing:</strong> alleen als jij daar expliciet mee instemt
            en wij campagne- of remarketingtags inzetten.
          </li>
        </ul>

        <h2>Consent</h2>
        <p>
          Waar de wet toestemming vereist, tonen wij een cookiebanner of
          vergelijkbare keuze. Je kunt je voorkeuren later aanpassen via de link
          in de footer of door je browsercookies te wissen. Met de beperking dat
          sommige onderdelen van de site dan minder goed werken.
        </p>

        <h2>Derde partijen</h2>
        <p>
          Als wij tools zoals Google Analytics, Clarity of ingebedde video’s
          gebruiken, kunnen die eigen cookies plaatsen. Raadpleeg ook hun
          privacyverklaringen voor details.
        </p>

        <h2>Contact</h2>
        <p>
          Vragen over dit cookiebeleid? Mail{" "}
          <a href={`mailto:${businessEmailDisplay}`}>{businessEmailDisplay}</a>{" "}
          of gebruik het{" "}
          <a href="/contact">contactformulier</a>.
        </p>
      </LegalPageShell>
    </>
  );
}
