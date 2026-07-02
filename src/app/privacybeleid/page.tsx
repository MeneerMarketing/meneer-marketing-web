import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { JsonLdScript, breadcrumbJsonLd } from "@/components/seo/JsonLd";
import { businessEmail, businessKvk } from "@/lib/contact";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacybeleid",
  description:
    "Hoe MeneerMarketing omgaat met persoonsgegevens, cookies en beveiliging. In lijn met de AVG, uitgelegd in gewone taal.",
  alternates: { canonical: absoluteUrl("/privacybeleid") },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Privacybeleid", path: "/privacybeleid" },
        ])}
      />
      <LegalPageShell
        title="Privacybeleid"
        updatedAt="2 juli 2026"
        intro="Kort samengevat: we verzamelen alleen wat nodig is om je te helpen, we verkopen niks door en je kunt altijd inzien wat we van je hebben. Hieronder staat het volledige verhaal."
      >
        <h2>Wie is verantwoordelijk?</h2>
        <p>
          MeneerMarketing (KvK {businessKvk}), gevestigd in Nederland, is
          verwerkingsverantwoordelijke voor de persoonsgegevens die via deze
          website en onze dienstverlening worden verwerkt. Vragen over privacy?
          Mail naar <a href={`mailto:${businessEmail}`}>{businessEmail}</a>.
        </p>

        <h2>Welke gegevens verwerken we?</h2>
        <ul>
          <li>
            <strong>Contact en intake:</strong> naam, bedrijfsnaam, e-mailadres,
            telefoonnummer en de inhoud van berichten die je zelf verstuurt via
            het contactformulier, de intake of e-mail.
          </li>
          <li>
            <strong>Websitebezoek:</strong> technische gegevens zoals IP-adres,
            browsertype en apparaat, in serverlogs die nodig zijn voor
            beveiliging en het draaiend houden van de site.
          </li>
          <li>
            <strong>Statistieken:</strong> alleen als je daarvoor toestemming
            geeft via de cookiebanner, verzamelen we geanonimiseerde
            gebruiksstatistieken (zoals paginaweergaves) via Google Analytics
            met IP-anonimisering.
          </li>
          <li>
            <strong>Klanten en facturatie:</strong> gegevens die nodig zijn om
            offertes op te stellen, projecten uit te voeren en facturen te
            versturen.
          </li>
        </ul>

        <h2>Waarvoor gebruiken we die gegevens?</h2>
        <p>
          We gebruiken je gegevens om contactverzoeken te beantwoorden, diensten
          te leveren, facturen te sturen, de website veilig en snel te houden en
          te leren wat op de site wel en niet werkt. De wettelijke grondslagen
          daarvoor zijn: uitvoering van een overeenkomst, gerechtvaardigd belang
          (zoals beveiliging), toestemming (voor statistieken en marketing) en
          wettelijke verplichtingen (zoals administratie voor de
          Belastingdienst).
        </p>

        <h2>Hoe lang bewaren we gegevens?</h2>
        <p>
          Niet langer dan nodig. Contactverzoeken die niet tot een samenwerking
          leiden verwijderen we binnen een redelijke termijn. Administratieve
          gegevens zoals facturen bewaren we zeven jaar, omdat de wet dat
          voorschrijft.
        </p>

        <h2>Met wie delen we gegevens?</h2>
        <p>
          We verkopen je gegevens nooit. We delen ze alleen met partijen die
          nodig zijn om onze diensten te leveren, zoals hostingpartij Vercel,
          e-mailverwerker Resend en, bij toestemming, Google Analytics. Met
          verwerkers sluiten we verwerkersovereenkomsten waar de AVG dat
          vereist. Sommige partijen verwerken gegevens buiten de EU; in dat
          geval gebeurt dat op basis van passende waarborgen zoals
          standaardcontractbepalingen.
        </p>

        <h2>Hoe beveiligen we je gegevens?</h2>
        <p>
          De website draait volledig over een versleutelde verbinding (https),
          toegang tot systemen is beperkt en beveiligd, en we slaan niet meer op
          dan nodig. Honderd procent garantie bestaat niet, maar we nemen
          beveiliging serieus en houden onze systemen actueel.
        </p>

        <h2>Jouw rechten</h2>
        <p>
          Je hebt het recht om je gegevens in te zien, te laten corrigeren of te
          laten verwijderen. Ook kun je bezwaar maken tegen verwerking, de
          verwerking laten beperken of je gegevens laten overdragen. Stuur een
          mail naar <a href={`mailto:${businessEmail}`}>{businessEmail}</a> en
          we handelen je verzoek binnen een maand af. Niet tevreden over hoe we
          met je gegevens omgaan? Dan kun je een klacht indienen bij de{" "}
          <a
            href="https://www.autoriteitpersoonsgegevens.nl"
            rel="noopener noreferrer"
            target="_blank"
          >
            Autoriteit Persoonsgegevens
          </a>
          .
        </p>

        <h2>Cookies</h2>
        <p>
          Voor cookies hebben we een aparte pagina met uitleg over welke cookies
          we gebruiken en hoe je je voorkeuren aanpast. Je vindt hem op{" "}
          <a href="/cookiebeleid">de cookiebeleid-pagina</a>.
        </p>

        <h2>Wijzigingen</h2>
        <p>
          Dit beleid kan veranderen, bijvoorbeeld als we nieuwe tools gaan
          gebruiken. De datum bovenaan laat zien wanneer de laatste wijziging
          was. Bij grote wijzigingen melden we dat duidelijk op de website.
        </p>
      </LegalPageShell>
    </>
  );
}
