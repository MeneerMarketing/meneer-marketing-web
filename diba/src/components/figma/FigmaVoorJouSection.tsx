"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HOME_INTENTS, type HomeIntent } from "@/data/home-intents";

function IntentArrow({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-grid h-9 w-9 place-items-center rounded-full text-lg ${
        active ? "bg-[#b8de9d] text-[#286943]" : "bg-white text-[#4f9a56]"
      }`}
      aria-hidden="true"
    >
      ↗
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
      className={`group rounded-[2rem] p-6 text-left transition sm:p-7 ${
        active
          ? "bg-[#286943] text-white shadow-[0_14px_35px_rgba(35,100,62,.18)]"
          : "bg-[#f2f7ef] hover:-translate-y-1 hover:bg-[#e2f0dc]"
      } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#286943]`}
    >
      <IntentArrow active={active} />
      <h3 className="mt-10 text-2xl tracking-[-.05em] sm:mt-12">{intent.title}</h3>
      <p
        className={`mt-3 text-sm leading-6 ${
          active ? "text-[#d9efd6]" : "text-[#607968]"
        }`}
      >
        {intent.subtitle}
      </p>
    </button>
  );
}

/** Voor jou — tekstkaarten + featured panel met Unsplash-beeld. */
export default function FigmaVoorJouSection() {
  const [activeConcern, setActiveConcern] = useState(0);
  const selectedIntent = HOME_INTENTS[activeConcern];

  return (
    <section id="voorjou" className="px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
      <div className="mx-auto max-w-[1800px]">
        <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[.15em] text-[#5d9564]">
              Voor jou
            </p>
            <h2 className="mt-4 max-w-xs text-4xl leading-[.98] tracking-[-.06em] sm:text-5xl">
              Waar wil je hulp bij?
            </h2>
          </div>
          <p className="max-w-xl self-end text-[15px] leading-7 text-[#5f7765]">
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

        <div className="mt-5 overflow-hidden rounded-[2rem] bg-[#f2f7ef] lg:grid lg:grid-cols-2">
          <div className="relative min-h-[280px] bg-[#cbe5bf] sm:min-h-[320px] lg:min-h-[360px]">
            <Image
              key={selectedIntent.id}
              src={selectedIntent.image}
              alt={selectedIntent.imageAlt}
              fill
              className="object-cover mix-blend-multiply opacity-90 transition-opacity duration-500"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div
              className="absolute inset-0 bg-[linear-gradient(135deg,rgba(148,188,138,.2),rgba(40,105,67,.15))]"
              aria-hidden="true"
            />
          </div>

          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
            <p className="text-[10px] font-medium uppercase tracking-[.14em] text-[#5d9564]">
              Jouw focus
            </p>
            <h3 className="mt-4 text-3xl leading-[1.02] tracking-[-.055em] text-[#17372a] sm:text-4xl lg:text-[2.75rem]">
              {selectedIntent.title}
            </h3>
            <p className="mt-4 max-w-md text-[15px] leading-7 text-[#5f7765]">
              {selectedIntent.subtitle}
            </p>
            <Link
              href={`/intake?topic=${selectedIntent.id}`}
              className="mt-8 inline-flex w-fit rounded-full bg-[#286943] px-6 py-4 text-[11px] font-medium uppercase tracking-[.13em] text-white transition hover:-translate-y-0.5 hover:bg-[#174e31]"
            >
              Bespreek dit met ons ↗
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
