"use client";

import Image from "next/image";
import { useState } from "react";
import Button from "@/components/ui/Button";
import HuidIcon, { type HuidIconNaam } from "@/components/ui/HuidIcon";
import Label from "@/components/ui/Label";
import { HOME_INTENTS, type HomeIntent } from "@/data/home-intents";

/**
 * Het rondje op de kaart, met het icoon uit de set erin.
 *
 * Hier zat een pijl. Op één knop zegt een pijl iets; op zes kaarten waaruit je kiest zegt
 * hij zes keer hetzelfde. Het icoon zegt wél waar de kaart over gaat, en dat zie je voordat
 * je de titel leest.
 *
 * Het rondje zelf blijft: dat is het anker van de kaart, en het wisselt van kleur zodra je
 * de kaart kiest.
 */
function IntentIcoon({
  naam,
  active,
}: {
  naam: HuidIconNaam;
  active: boolean;
}) {
  return (
    <span
      className={`inline-grid h-12 w-12 place-items-center rounded-[var(--r-pill)] transition-colors ${
        active
          ? "bg-[var(--on-dark-accent)] text-[var(--g-700)]"
          : "bg-white text-[var(--g-700)]"
      }`}
      aria-hidden="true"
    >
      <HuidIcon naam={naam} size={28} />
    </span>
  );
}

function IntentCard({
  intent,
  active,
  onSelect,
}: {
  intent: HomeIntent;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={`group rounded-[var(--r-lg)] p-6 text-left transition sm:p-7 ${
        active
          ? "bg-[var(--g-700)] text-[var(--on-dark)] shadow-[0_14px_35px_rgba(35,100,62,.18)]"
          : "bg-[var(--g-025)] hover:-translate-y-1 hover:bg-[var(--g-050)]"
      } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]`}
    >
      <IntentIcoon naam={intent.icoon} active={active} />
      <h3 className="diba-card-title mt-10 sm:mt-12">{intent.title}</h3>
      <p
        className={`mt-3 text-sm leading-6 ${
          active ? "text-[var(--on-dark-body)]" : "text-[var(--t-body)]"
        }`}
      >
        {intent.subtitle}
      </p>
    </button>
  );
}

/** Voor jou — tekstkaarten + uitgelicht paneel met eigen behandelfotografie. */
export default function FigmaVoorJouSection() {
  const [activeConcern, setActiveConcern] = useState(0);
  const selectedIntent = HOME_INTENTS[activeConcern];

  return (
    <section id="voorjou" className="px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
      <div className="mx-auto">
        <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <Label>Voor jou</Label>
            {/* Geen max-w meer: die dwong de kop op twee regels. De maat schaalt met
                de kolom, dus hij past altijd op één regel. */}
            <h2 className="diba-display-s mt-4">Waar wil je hulp bij?</h2>
          </div>
          <p className="max-w-xl self-end text-[15px] leading-7 text-[var(--t-body)]">
            Kies waar je voor komt. Op elke pagina staat wat de klacht is, welke
            behandelingen erbij horen, hoeveel sessies dat gemiddeld vraagt en
            wat het kost.
          </p>
        </div>

        <div
          className="mt-12 grid gap-3 md:grid-cols-2 xl:grid-cols-3"
          role="group"
          aria-label="Kies waar je hulp bij zoekt"
        >
          {HOME_INTENTS.map((intent, index) => (
            <IntentCard
              key={intent.id}
              intent={intent}
              active={activeConcern === index}
              onSelect={() => setActiveConcern(index)}
            />
          ))}
        </div>

        {/* Uitgelicht blok. Drie dingen komen uit het ontwerp en niet uit de vorige
            versie: het paneel is mintgroen (--g-075) in plaats van bijna wit, het beeld
            wordt in het merkgroen getrokken, en de beeldkolom is smaller dan de helft
            waardoor het blok breder en strakker leest. */}
        <div className="mt-5 overflow-hidden rounded-[var(--r-lg)] bg-[var(--g-075)] lg:grid lg:grid-cols-[0.88fr_1.12fr]">
          <div className="relative min-h-[240px] bg-[var(--g-300)] sm:min-h-[260px] lg:min-h-[300px]">
            <Image
              key={selectedIntent.id}
              src={selectedIntent.image}
              alt={selectedIntent.imageAlt}
              fill
              className="object-cover transition-opacity duration-500"
              sizes="(min-width: 1024px) 44vw, 100vw"
            />
          </div>

          <div className="flex flex-col justify-center p-7 sm:p-9 lg:p-11">
            <Label>Jouw focus</Label>
            {/* Zelfde maat als de sectiekop hierboven: dit blok hoort bij die sectie
                en mag daar niet overheen schreeuwen. */}
            <h3 className="diba-display-s mt-4 text-[var(--t-strong)]">
              {selectedIntent.title}
            </h3>
            <p className="mt-4 max-w-md text-[15px] leading-7 text-[var(--t-body)]">
              {selectedIntent.subtitle}
            </p>
            <Button
              href={`/intake?topic=${selectedIntent.id}`}
              className="mt-8 w-fit"
            >
              Bespreek dit met ons
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
