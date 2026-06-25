import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { JsonLdScript, breadcrumbJsonLd } from "@/components/seo/JsonLd";
import { businessEmailDisplay } from "@/lib/contact";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacybeleid",
  description:
    "Hoe MeneerMarketing omgaat met persoonsgegevens, cookies en beveiliging. In lijn met de AVG.",
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
        intro="Laatst bijgewerkt: 6 april 2026. Dit beleid beschrijft hoe wij omgaan met persoonsgegevens in het kader van onze dienstverlening en website."
      >
        <p>
          <strong>Let op:</strong> dit document is een algemene leidraad. Het
          vervangt geen juridisch advies op maat. Pas contact- en bedrijfsgegevens
          aan waar nodig.
        </p>

        <h2>Verwerkingsverantwoordelijke</h2>
        <p>
          MeneerMarketing is verwerkingsverantwoordelijke voor de verwerking van
          persoonsgegevens zoals beschreven in dit beleid. Contact:{" "}
          <a href={`mailto:${businessEmailDisplay}`}>{businessEmailDisplay}</a> of
          via het contactformulier op deze website.
        </p>

        <h2>Welke gegevens verwerken wij?</h2>
        <ul>
          <li>
            <strong>Contact & intake:</strong> naam, bedrijf, e-mailadres,
            telefoonnummer en berichten die je vrijwillig verstuurt.
          </li>
          <li>
            <strong>Website & analytics:</strong> technische logs (IP-adres,
            browser, apparaat) en. Indien geactiveerd en met passende
            toestemming. Statistische gegevens via tools zoals Google Analytics
            of Microsoft Clarity.
          </li>
          <li>
            <strong>Contractuitvoering:</strong> gegevens die nodig zijn om
            offertes, trajecten en facturatie af te handelen.
          </li>
        </ul>

        <h2>Doelen en grondslagen</h2>
        <p>
          Wij verwerken gegevens om contactverzoeken te beantwoorden, diensten te
          leveren, facturen te sturen, onze website te verbeteren en. Waar
          wettelijk verplicht. Administratie bij te houden. Grondslagen kunnen
          zijn: uitvoering van een overeenkomst, gerechtvaardigd belang (zoals
          beveiliging en analyse, met waar passend consent) of wettelijke verplichting.
        </p>

        <h2>Bewaartermijnen</h2>
        <p>
          Wij bewaren gegevens niet langer dan nodig voor de doelen waarvoor ze
          zijn verzameld, tenzij een langere bewaartermijn wettelijk verplicht is.
        </p>

        <h2>Delen met derden</h2>
        <p>
          Wij delen gegevens alleen met verwerkers (hosting, e-mail, analytics,
          CRM) die nodig zijn voor onze dienstverlening en met wie een
          verwerkersovereenkomst kan worden gesloten waar vereist.
        </p>

        <h2>Beveiliging</h2>
        <p>
          Wij treffen passende technische en organisatorische maatregelen om
          misbruik, verlies en onbevoegde toegang te beperken.
        </p>

        <h2>Jouw rechten</h2>
        <p>
          Je kunt. Afhankelijk van de situatie. Rechten uitoefenen op inzage,
          rectificatie, verwijdering, beperking, dataportabiliteit en bezwaar. Voor
          verzoeken kun je contact opnemen via{" "}
          <a href={`mailto:${businessEmailDisplay}`}>{businessEmailDisplay}</a>. Je
          kunt ook een klacht indienen bij de Autoriteit Persoonsgegevens.
        </p>

        <h2>Wijzigingen</h2>
        <p>
          Wij kunnen dit beleid bijwerken. De datum bovenaan geeft de laatste
          wijziging aan.
        </p>
      </LegalPageShell>
    </>
  );
}
