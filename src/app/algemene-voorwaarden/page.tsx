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
        updatedAt="17 augustus 2026"
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
          strategie.{" "}
          <strong>Abonnementspakketten</strong>: doorlopende pakketten zoals
          Studio Edition, Clinic Edition, Local Growth en Growth Partner, waarbij
          een maandelijks bedrag geldt voor het gebruik van een website en
          bijbehorende diensten.
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

        <h2 id="abonnement-incasso">
          Artikel 6a. Abonnementen en automatische incasso
        </h2>
        <p>
          Voor doorlopende pakketten zoals Studio Edition geldt een
          maandelijks abonnement. Maandbedragen op de website en in het
          aanmeldformulier zijn exclusief btw, tenzij expliciet anders vermeld.
          De eerste maand betaal je via iDEAL bij Mollie, inclusief 21% btw. Vanaf
          de tweede maand incasseert Mollie maandelijks het overeengekomen bedrag
          inclusief btw via SEPA-incasso, totdat je opzegt.
        </p>
        <p>
          Je geeft toestemming voor deze incasso bij het afrekenen in Mollie en
          bij het aanvinken van de akkoordverklaring op het formulier. Mollie
          verwerkt de betalingen als betaalprovider; voor die verwerking geldt
          ook het privacybeleid van Mollie waar van toepassing.
        </p>
        <p>
          Het abonnement is maandelijks opzegbaar met inachtneming van de
          opzegtermijn in artikel 10. Opzegging kan schriftelijk of per e-mail
          naar{" "}
          <a href={`mailto:${businessEmail}`}>{businessEmail}</a>. Reeds
          betaalde perioden worden niet naar rato gerestitueerd, tenzij
          schriftelijk anders overeengekomen.
        </p>
        <h3 id="abonnement-website-beheer">
          Beheer website bij abonnementspakketten
        </h3>
        <p>
          Abonnementspakketten zijn bedoeld als doorlopend gebruik van een
          website en bijbehorende diensten. Dit is geen koop of verkoop van een
          website. Bij deze pakketten beheert MeneerMarketing de website,
          hosting, technische infrastructuur en onderliggende code. De
          Opdrachtgever krijgt een gebruiksrecht zolang het abonnement loopt en
          betalingen op tijd binnen zijn.
        </p>
        <p>
          Bij opzegging of beëindiging van het abonnement eindigt dat
          gebruiksrecht. De website gaat offline of wordt buiten gebruik
          gesteld. Er vindt geen overdracht plaats van bestanden, broncode,
          design, databases of hosting naar de Opdrachtgever, tenzij partijen
          vooraf schriftelijk een afkoop of migratie tegen een apart tarief
          hebben afgesproken.
        </p>
        <p>
          Wil je de website volledig in eigen beheer? Dat kan via een eenmalig
          project of Signature Custom, met andere afspraken over oplevering en
          eigendom. Die route staat los van de maandelijkse
          abonnementspakketten.
        </p>
        <p>
          Een domeinnaam die op naam van de Opdrachtgever staat, blijft
          eigendom van de Opdrachtgever. Een domeinnaam die via het pakket door
          MeneerMarketing wordt geregistreerd of beheerd, wordt na
          beëindiging behandeld volgens de offerte of het aanbod. Overdracht of
          vrijgave van alleen het domein betekent niet dat de volledige website
          wordt overgedragen.
        </p>

        <h2>Artikel 7. Intellectueel eigendom</h2>
        <p>
          Voor <strong>abonnementspakketten</strong> geldt artikel 6a. Daar
          blijft intellectueel eigendom en technisch beheer bij
          MeneerMarketing. De Opdrachtgever heeft alleen gebruiksrecht zolang het
          abonnement loopt.
        </p>
        <p>
          Voor eenmalige projecten, maatwerkopdrachten en andere opdrachten
          waarbij volledige oplevering is overeengekomen: na volledige betaling
          gaan de rechten op het specifiek voor de Opdrachtgever gemaakte werk
          over op de Opdrachtgever, tenzij in de offerte anders is afgesproken.
          Open-sourcecomponenten en standaardsoftware blijven onder hun eigen
          licenties vallen.
        </p>
        <p>
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
        <p>
          Bij beëindiging van een abonnementspakket geldt tevens artikel 6a:
          het gebruiksrecht op de website eindigt en MeneerMarketing zet de site
          offline of buiten gebruik, zonder overdracht van code of hosting,
          tenzij schriftelijk anders overeengekomen.
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
