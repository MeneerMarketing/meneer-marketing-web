import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { JsonLdScript, breadcrumbJsonLd } from "@/components/seo/JsonLd";
import { businessEmail, businessKvk } from "@/lib/contact";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Algemene voorwaarden",
  description:
    "De algemene voorwaarden van MeneerMarketing: heldere afspraken over offertes, uitvoering, betaling, eigendom en aansprakelijkheid.",
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
        updatedAt="2 juli 2026"
        intro="Goede samenwerking begint met heldere afspraken. Deze voorwaarden gelden voor alle offertes en overeenkomsten van MeneerMarketing, ingeschreven bij de Kamer van Koophandel onder nummer 42095913."
      >
        <h2>Artikel 1. Definities</h2>
        <p>
          In deze voorwaarden wordt verstaan onder:{" "}
          <strong>MeneerMarketing</strong>: de opdrachtnemer, ingeschreven bij
          de KvK onder nummer {businessKvk}, bereikbaar via{" "}
          <a href={`mailto:${businessEmail}`}>{businessEmail}</a>.{" "}
          <strong>Opdrachtgever</strong>: de partij die aan MeneerMarketing een
          opdracht verstrekt. <strong>Diensten</strong>: alle werkzaamheden die
          MeneerMarketing uitvoert, zoals beschreven in de offerte of
          overeenkomst, waaronder webontwikkeling, design, marketing en
          strategie.
        </p>

        <h2>Artikel 2. Toepasselijkheid</h2>
        <p>
          Deze voorwaarden zijn van toepassing op alle offertes, aanbiedingen en
          overeenkomsten van MeneerMarketing. Afwijkingen gelden alleen als ze
          schriftelijk zijn overeengekomen. Inkoop- of andere voorwaarden van de
          Opdrachtgever worden uitdrukkelijk van de hand gewezen.
        </p>

        <h2>Artikel 3. Offertes en totstandkoming</h2>
        <p>
          Offertes zijn vrijblijvend en dertig dagen geldig, tenzij anders
          vermeld. Een overeenkomst komt tot stand na schriftelijke of digitale
          aanvaarding van de offerte, of doordat MeneerMarketing op uitdrukkelijk
          verzoek van de Opdrachtgever met de uitvoering begint. Kennelijke
          vergissingen of verschrijvingen in een offerte binden MeneerMarketing
          niet.
        </p>

        <h2>Artikel 4. Uitvoering</h2>
        <p>
          MeneerMarketing voert de Diensten uit naar beste inzicht en vermogen
          en volgens de eisen van goed vakmanschap. Er geldt een
          inspanningsverplichting, geen resultaatsverplichting: resultaten in
          bijvoorbeeld zoekmachines of advertentieplatformen zijn mede
          afhankelijk van factoren buiten de invloed van MeneerMarketing. De
          Opdrachtgever zorgt dat benodigde informatie, content en toegangen
          tijdig beschikbaar zijn; vertraging daarin kan de planning en kosten
          beïnvloeden.
        </p>

        <h2>Artikel 5. Wijzigingen en meerwerk</h2>
        <p>
          Wijzigingen in de scope worden vooraf besproken en schriftelijk
          vastgelegd. Werkzaamheden buiten de overeengekomen scope gelden als
          meerwerk en kunnen leiden tot aanpassing van planning en honorarium.
          Meerwerk wordt nooit stilzwijgend uitgevoerd en gefactureerd.
        </p>

        <h2>Artikel 6. Tarieven en betaling</h2>
        <p>
          Alle tarieven zijn exclusief btw, tenzij anders vermeld. Facturen
          worden betaald binnen veertien dagen na factuurdatum, tenzij anders
          overeengekomen. Bij projecten kan een aanbetaling worden gevraagd
          voordat de werkzaamheden starten. Bij niet-tijdige betaling is de
          Opdrachtgever wettelijke handelsrente en redelijke incassokosten
          verschuldigd, en mag MeneerMarketing de werkzaamheden opschorten tot
          de betaling is voldaan.
        </p>

        <h2>Artikel 7. Intellectueel eigendom</h2>
        <p>
          Na volledige betaling gaan de rechten op het specifiek voor de
          Opdrachtgever gemaakte werk over op de Opdrachtgever, tenzij in de
          offerte anders is afgesproken. Open-sourcecomponenten en
          standaardsoftware blijven onder hun eigen licenties vallen.
          MeneerMarketing mag opgeleverd werk gebruiken als referentie in
          portfolio en marketinguitingen, tenzij de Opdrachtgever daar
          schriftelijk bezwaar tegen maakt.
        </p>

        <h2>Artikel 8. Aansprakelijkheid</h2>
        <p>
          De aansprakelijkheid van MeneerMarketing is beperkt tot het bedrag dat
          in de zes maanden voorafgaand aan de schadeveroorzakende gebeurtenis
          voor de betreffende opdracht is gefactureerd, tenzij sprake is van
          opzet of bewuste roekeloosheid. MeneerMarketing is niet aansprakelijk
          voor indirecte schade, zoals gevolgschade, gederfde winst of schade
          door bedrijfsstagnatie. De Opdrachtgever is zelf verantwoordelijk voor
          de juistheid van aangeleverde content en voor het naleven van
          wetgeving die op zijn producten of diensten van toepassing is.
        </p>

        <h2>Artikel 9. Geheimhouding en gegevens</h2>
        <p>
          Beide partijen behandelen vertrouwelijke informatie zorgvuldig en
          gebruiken die alleen voor de uitvoering van de opdracht. Voor de
          verwerking van persoonsgegevens geldt{" "}
          <a href="/privacybeleid">het privacybeleid</a>; waar MeneerMarketing
          als verwerker optreedt, worden aanvullende afspraken vastgelegd in een
          verwerkersovereenkomst.
        </p>

        <h2>Artikel 10. Duur en beëindiging</h2>
        <p>
          Overeenkomsten voor doorlopende diensten kennen de opzegtermijn die in
          de offerte staat; ontbreekt die, dan geldt een opzegtermijn van één
          kalendermaand. Beide partijen kunnen de overeenkomst met onmiddellijke
          ingang beëindigen bij faillissement, surseance of ernstige
          wanprestatie van de andere partij. Al uitgevoerde werkzaamheden worden
          bij beëindiging naar rato afgerekend.
        </p>

        <h2>Artikel 11. Overmacht</h2>
        <p>
          Bij overmacht, zoals storingen bij hostingpartijen, wijzigingen in
          platformen van derden of andere omstandigheden buiten de redelijke
          invloed van MeneerMarketing, worden verplichtingen opgeschort zolang
          de overmacht duurt. Duurt die langer dan zestig dagen, dan mogen beide
          partijen de overeenkomst schriftelijk ontbinden zonder
          schadeplichtigheid.
        </p>

        <h2>Artikel 12. Toepasselijk recht</h2>
        <p>
          Op alle overeenkomsten is Nederlands recht van toepassing. Geschillen
          worden eerst in goed overleg opgelost; lukt dat niet, dan is de
          bevoegde rechter in het arrondissement van de vestigingsplaats van
          MeneerMarketing bevoegd, tenzij dwingend recht anders voorschrijft.
        </p>
      </LegalPageShell>
    </>
  );
}
