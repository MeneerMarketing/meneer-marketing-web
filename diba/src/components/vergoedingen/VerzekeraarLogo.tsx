import type { Insurer } from "@/data/insurers";

/**
 * Het logo van een verzekeraar.
 *
 * WAAROM DIT ER IS.
 *
 * Zes witte kaartjes met alleen een naam erin lezen als een lijst; met het logo erbij
 * herken je in een oogopslag welke van jou is. Dat is precies wat die sectie moet doen,
 * want je komt daar met je eigen verzekeraar in je hoofd.
 *
 * WAT DIT NIET IS.
 *
 * Geen partnerlogo. Het staat er om te verwijzen naar de verzekeraar waar de pagina over
 * gaat, en dat is toegestaan gebruik van een merknaam. Wat niet mag is de indruk wekken dat
 * Diba met ze samenwerkt, en daarom blijft op elke pagina de zin staan dat we niets namens
 * hen kunnen toezeggen. Zet deze logo's dus nergens in een rij onder een kop als "onze
 * partners", want dan zegt het beeld iets anders dan de tekst, en het beeld wint.
 *
 * WAAROM HET EEN VAK MET EEN LOGO ERIN IS EN GEEN LOS PLAATJE.
 *
 * Eerst stond hier een `img` met een vaste hoogte en `width: auto`. Die laadde niet: vóór
 * het laden kent de browser de verhouding nog niet, dus de breedte werd nul, en een element
 * van nul bij zesentwintig pixels vraagt de browser nooit op. Geen enkel netwerkverzoek, en
 * in de console geen enkele fout — het beeld was er gewoon niet.
 *
 * Nu bepaalt het vak de maat en past het logo daarbinnen. Dat lost meteen het tweede
 * probleem op: de verhoudingen lopen ver uiteen. VGZ is bijna vierkant (63 bij 49), Zilveren
 * Kruis is drie keer zo breed als hoog (473 bij 152). In een vast vak met `object-contain`
 * krijgen ze allemaal evenveel ruimte en blijft de tekst ernaast op één lijn staan.
 *
 * Geen next/image: dit zijn statische SVG's uit de eigen map, en die hebben geen
 * optimalisatie nodig. Bovendien vraagt SVG door next/image om `dangerouslyAllowSVG`, en
 * dat zetten we niet aan voor zes bestanden die we zelf hebben neergezet.
 */
export default function VerzekeraarLogo({
  verzekeraar,
  hoogte = 28,
  breedte,
  className = "",
}: {
  verzekeraar: Insurer;
  /** Hoogte van het vak in pixels. Het logo past erbinnen, wat zijn verhouding ook is. */
  hoogte?: number;
  /** Breedte van het vak. Standaard tweeënhalf keer de hoogte; dat past op alle zes. */
  breedte?: number;
  className?: string;
}) {
  if (!verzekeraar.logo) return null;

  return (
    <span
      style={{
        height: hoogte * verzekeraar.logoSchaal,
        width: breedte ?? hoogte * 2.5,
      }}
      className={`inline-flex shrink-0 items-center justify-start ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={verzekeraar.logo}
        /* De naam staat er in de opmaak altijd naast of onder, dus het logo herhaalt hem
           alleen maar voor wie het voorleest. Leeg alt is hier het juiste. */
        alt=""
        aria-hidden="true"
        className="h-full w-full object-contain object-left"
        decoding="async"
      />
    </span>
  );
}
