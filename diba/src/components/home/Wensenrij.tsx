import Image from "next/image";
import Link from "next/link";
import Label from "@/components/ui/Label";
import Veegrij from "@/components/ui/Veegrij";
import type { HomeWens } from "@/data/home-intents";

/**
 * "Waar wil je hulp bij?" als rij die je opzij veegt.
 *
 * WAT ER MIS WAS.
 *
 * Zeven kaarten onder elkaar, elk met een icoon, een titel, twee regels tekst en een
 * uitklapper. Yasin, 11 september 2026: "die sectie neemt verticaal veel te veel ruimte in
 * beslag; ik wil een horizontale slider die je kunt vegen en die vanzelf doorloopt, met een
 * foto erboven." Gemeten op een telefoon was het blok 1.900 pixels hoog, ruim twee
 * schermen, voor een keuze uit zeven.
 *
 * HOE BREED DE KAARTEN ZIJN.
 *
 * Op een breed scherm stonden er vier naast elkaar van 340 pixels. Yasin daarover: "die
 * blokken zijn te veel en te klein, en er valt bijna niks te sliden omdat je alles al
 * ziet." Nu twee en een half: veertig procent van de kolom, met een bovengrens van 520
 * zodat de foto niet uit zijn krachten groeit. Dan is de foto het onderwerp in plaats van
 * een postzegel, en zie je meteen dat er meer naast staat.
 *
 * Het schuiven, de stippen en het doorlopen zitten in Veegrij; hier staat alleen wat er op
 * de kaarten komt.
 */

export default function Wensenrij({ wensen }: { wensen: readonly HomeWens[] }) {
  return (
    <section className="bg-[var(--g-025)] py-12 sm:py-16 lg:py-24">
      <div className="mx-auto px-5 sm:px-9 lg:px-[7.5vw]">
        <Label>Voor jou</Label>
        <h2 className="diba-display-m mt-4 max-w-[20ch]">
          Waar wil je <span className="diba-accent">hulp bij?</span>
        </h2>
        <p className="mt-5 max-w-[58ch] text-[16px] leading-7 text-[var(--t-body)]">
          Veeg langs de klachten en klik door naar het hele verhaal: wat het is,
          wat eraan te doen valt en wat het kost.
        </p>
      </div>

      <Veegrij
        label="Huidklachten"
        vanzelf
        klasse="mt-8 sm:mt-10"
        breedte="w-[78%] max-w-[520px] sm:w-[56%] lg:w-[40%]"
        items={wensen.map((w) => ({
          sleutel: w.id,
          naam: w.label,
          inhoud: (
            <Link
              href={w.pad}
              className="group flex h-full flex-col overflow-hidden rounded-[var(--r-lg)] bg-white transition-shadow duration-300 [transition-timing-function:var(--ease-diba)] hover:shadow-[var(--shadow-float)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
            >
              <span className="relative block aspect-[4/3] overflow-hidden bg-[var(--g-075)]">
                <Image
                  src={w.image}
                  alt={w.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 40vw, (min-width: 640px) 56vw, 78vw"
                  className="object-cover transition-transform duration-500 [transition-timing-function:var(--ease-diba)] group-hover:scale-[1.03]"
                  style={{ objectPosition: `50% ${w.brandpunt}%` }}
                />
              </span>

              <span className="flex flex-1 flex-col p-5 sm:p-6">
                <span className="diba-card-title text-[var(--t-strong)]">
                  {w.label}
                </span>
                <span className="mt-2 flex-1 text-[15px] leading-7 text-[var(--t-body)] sm:min-h-[2lh]">
                  {w.kort}
                </span>
                <span className="diba-label mt-5 inline-flex items-center gap-1.5 text-[var(--g-700)]">
                  {w.totaal} behandelingen
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    ›
                  </span>
                </span>
              </span>
            </Link>
          ),
        }))}
      />
    </section>
  );
}
