"use client";

import Image from "next/image";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { ArrowUpRight } from "@/components/ui/Icon";
import Label from "@/components/ui/Label";
import { HOME_INTENTS, type HomeIntent } from "@/data/home-intents";

function IntentArrow({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-grid h-9 w-9 place-items-center rounded-[var(--r-pill)] ${
        active
          ? "bg-[var(--on-dark-accent)] text-[var(--g-700)]"
          : "bg-white text-[var(--g-500)]"
      }`}
      aria-hidden="true"
    >
      <ArrowUpRight size={16} />
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
      <IntentArrow active={active} />
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
      <div className="mx-auto max-w-[1800px]">
        <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <Label>Voor jou</Label>
            {/* Geen max-w meer: die dwong de kop op twee regels. De maat schaalt met
                de kolom, dus hij past altijd op één regel. */}
            <h2 className="diba-display-s mt-4">Waar wil je hulp bij?</h2>
          </div>
          <p className="max-w-xl self-end text-[15px] leading-7 text-[var(--t-body)]">
            Of je nu last hebt van acne, pigment, ongewenste haargroei of een huid die veranderd
            voelt: we beginnen bij wat jouw huid écht nodig heeft.
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

        <div className="mt-5 overflow-hidden rounded-[var(--r-lg)] bg-[var(--g-025)] lg:grid lg:grid-cols-2">
          <div className="relative min-h-[280px] bg-[var(--g-200)] sm:min-h-[320px] lg:min-h-[360px]">
            <Image
              key={selectedIntent.id}
              src={selectedIntent.image}
              alt={selectedIntent.imageAlt}
              fill
              className="object-cover transition-opacity duration-500"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div
              className="absolute inset-0 bg-[linear-gradient(135deg,rgba(148,188,138,.2),rgba(40,105,67,.15))]"
              aria-hidden="true"
            />
          </div>

          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
            <Label>Jouw focus</Label>
            {/* Zelfde maat als de sectiekop hierboven: dit blok hoort bij die sectie
                en mag daar niet overheen schreeuwen. */}
            <h3 className="diba-display-s mt-4 text-[var(--t-strong)]">
              {selectedIntent.title}
            </h3>
            <p className="mt-4 max-w-md text-[15px] leading-7 text-[var(--t-body)]">
              {selectedIntent.subtitle}
            </p>
            <Button href={`/intake?topic=${selectedIntent.id}`} className="mt-8 w-fit">
              Bespreek dit met ons
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
