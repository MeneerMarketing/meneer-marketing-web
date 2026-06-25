import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { JsonLdScript, breadcrumbJsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Algemene voorwaarden",
  description:
    "Algemene voorwaarden voor diensten en samenwerking met MeneerMarketing. Aan te vullen door je adviseur.",
  alternates: { canonical: absoluteUrl("/algemene-voorwaarden") },
  robots: { index: true, follow: true },
};

export default function VoorwaardenPage() {
  return (
    <>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Algemene voorwaarden", path: "/algemene-voorwaarden" },
        ])}
      />
      <LegalPageShell
        title="Algemene voorwaarden"
        intro="Laatst bijgewerkt: 6 april 2026. Dit is een startdocument: laat het juridisch toetsen voordat je het live zet."
      >
        <p>
          <strong>Belangrijk:</strong> vul KVK-nummer, adres, BTW-id en eventuele
          brancheclausules aan. Dit document is geen juridisch advies.
        </p>

        <h2>Artikel 1. Definities</h2>
        <p>
          In deze voorwaarden wordt verstaan onder: <strong>Opdrachtgever</strong>{" "}
          de partij die een opdracht verstrekt; <strong>MeneerMarketing</strong> de
          uitvoerende partij; <strong>Diensten</strong> de overeengekomen werkzaamheden
          zoals beschreven in de offerte of overeenkomst.
        </p>

        <h2>Artikel 2. Totstandkoming overeenkomst</h2>
        <p>
          Een overeenkomst komt tot stand na schriftelijke (of digitale)
          aanvaarding van een offerte, of door start van uitvoering na uitdrukkelijke
          opdracht van de Opdrachtgever.
        </p>

        <h2>Artikel 3. Uitvoering</h2>
        <p>
          MeneerMarketing voert de Diensten uit naar beste inzicht en vermogen,
          in overleg met de Opdrachtgever. De Opdrachtgever verstrekt tijdig
          benodigde informatie, toegang en content.
        </p>

        <h2>Artikel 4. Wijzigingen en meerwerk</h2>
        <p>
          Wijzigingen in de scope worden schriftelijk vastgelegd en kunnen leiden
          tot aanpassing van planning en honorarium.
        </p>

        <h2>Artikel 5. Tarieven en betaling</h2>
        <p>
          Tenzij anders overeengekomen, worden facturen volgens de afgesproken
          termijn betaald. Bij niet-tijdige betaling zijn wettelijke (handels)rente
          en incassokosten voor rekening van de Opdrachtgever, voor zover toegestaan.
        </p>

        <h2>Artikel 6. Intellectueel eigendom</h2>
        <p>
          Rechten op maatwerk leveringen gaan over conform de offerte. Vaak na
          volledige betaling, tenzij anders afgesproken. Open-source en
          standaardcomponenten blijven onder hun eigen licenties vallen.
        </p>

        <h2>Artikel 7. Aansprakelijkheid</h2>
        <p>
          De aansprakelijkheid van MeneerMarketing is beperkt tot het bedrag dat in
          het betreffende traject in de laatste zes maanden is gefactureerd, tenzij
          sprake is van opzet of grove schuld. MeneerMarketing is niet aansprakelijk
          voor indirecte schade, gevolgschade of gederfde winst.
        </p>

        <h2>Artikel 8. Geheimhouding</h2>
        <p>
          Partijen behandelen vertrouwelijke informatie zorgvuldig en gebruiken die
          alleen voor de uitvoering van de opdracht.
        </p>

        <h2>Artikel 9. Duur en beëindiging</h2>
        <p>
          Voor doorlopende diensten gelden de afgesproken opzegtermijnen.
          Bij wanprestatie of surseance kan de overeenkomst worden beëindigd
          conform de wet.
        </p>

        <h2>Artikel 10. Toepasselijk recht</h2>
        <p>
          Op deze voorwaarden is Nederlands recht van toepassing. Geschillen worden
          voorgelegd aan de bevoegde rechter in het arrondissement waar
          MeneerMarketing is gevestigd, tenzij dwingend recht anders voorschrijft.
        </p>
      </LegalPageShell>
    </>
  );
}
