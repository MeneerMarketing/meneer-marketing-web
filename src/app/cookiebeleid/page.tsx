import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { JsonLdScript, breadcrumbJsonLd } from "@/components/seo/JsonLd";
import { businessEmail } from "@/lib/contact";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookiebeleid",
  description:
    "Welke cookies meneermarketing.nl gebruikt, waarvoor ze dienen en hoe je je voorkeuren op elk moment aanpast.",
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
        updatedAt="2 juli 2026"
        intro="Kort samengevat: deze site gebruikt zo min mogelijk cookies. Statistieken laden alleen als jij daar via de banner toestemming voor geeft, en je kunt die keuze altijd terugdraaien."
      >
        <h2>Wat zijn cookies?</h2>
        <p>
          Cookies zijn kleine tekstbestanden die een website op je apparaat
          plaatst, bijvoorbeeld om een voorkeur te onthouden of bezoek te meten.
          Daarnaast bestaan er vergelijkbare technieken zoals local storage; in
          dit beleid vallen die onder dezelfde noemer.
        </p>

        <h2>Wat gebruikt deze site?</h2>
        <ul>
          <li>
            <strong>Noodzakelijk:</strong> je cookievoorkeur zelf. Als je een
            keuze maakt in de banner, onthouden we die op je apparaat zodat we
            het niet bij elk bezoek opnieuw hoeven te vragen.
          </li>
          <li>
            <strong>Statistieken (alleen met jouw toestemming):</strong> Google
            Analytics met IP-anonimisering, om te zien welke pagina&apos;s goed
            werken en waar bezoekers afhaken. Zeg je nee, dan wordt deze tool
            simpelweg niet geladen.
          </li>
          <li>
            <strong>Marketing:</strong> op dit moment plaatsen we geen
            marketing- of advertentiecookies. Verandert dat, dan vragen we daar
            eerst expliciet toestemming voor via de banner en werken we dit
            beleid bij.
          </li>
        </ul>

        <h2>Je voorkeuren aanpassen</h2>
        <p>
          Onderaan elke pagina staat in de footer een knop om je
          cookievoorkeuren aan te passen. Daarmee kun je toestemming intrekken
          of alsnog geven, wanneer je maar wilt. Cookies verwijderen kan
          daarnaast altijd via de instellingen van je browser.
        </p>

        <h2>Cookies van derden</h2>
        <p>
          Als je toestemming geeft voor statistieken, plaatst Google cookies
          voor Google Analytics. Hoe Google met die gegevens omgaat lees je in{" "}
          <a
            href="https://policies.google.com/privacy"
            rel="noopener noreferrer"
            target="_blank"
          >
            het privacybeleid van Google
          </a>
          . Zonder toestemming worden er geen cookies van derden geplaatst.
        </p>

        <h2>Vragen?</h2>
        <p>
          Vragen over dit cookiebeleid of over je gegevens? Mail naar{" "}
          <a href={`mailto:${businessEmail}`}>{businessEmail}</a> of kijk in{" "}
          <a href="/privacybeleid">het privacybeleid</a> voor het volledige
          verhaal over hoe ik met persoonsgegevens omga.
        </p>
      </LegalPageShell>
    </>
  );
}
