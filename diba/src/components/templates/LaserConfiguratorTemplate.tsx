"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import FigmaHeading from "@/components/figma/FigmaHeading";
import { FigmaBreadcrumbs, FigmaFilterPills } from "@/components/figma/FigmaTemplateUi";
import DeLijn from "@/components/ui/DeLijn";
import StickyActionBar from "@/components/ui/StickyActionBar";
import {
  FITZPATRICK_TYPES,
  LASER_ZONE_AREAS,
  LASER_ZONES,
  type FitzpatrickId,
  type LaserZoneArea,
} from "@/data/laser-zones";
import { calculateLaserPrice, toggleZoneSelection } from "@/lib/laser-pricing";
import { figmaBtnMint, figmaBtnPrimary } from "@/lib/figma-home-layout";
import {
  figmaBody,
  figmaCardWhite,
  figmaInnerContainer,
  figmaLabel,
  figmaSection,
  figmaSectionTight,
} from "@/lib/figma-inner-layout";

export type LaserConfiguratorTemplateProps = {
  whatsappHref: string;
};

const zoneBtnBase =
  "flex min-h-[56px] w-full items-center justify-between rounded-[1.5rem] border px-5 text-left text-[15px] font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#286943] motion-reduce:transition-none";

export default function LaserConfiguratorTemplate({
  whatsappHref,
}: LaserConfiguratorTemplateProps) {
  const [activeArea, setActiveArea] = useState<LaserZoneArea>("gelaat");
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [skinType, setSkinType] = useState<FitzpatrickId | null>(null);

  const visibleZones = useMemo(
    () => LASER_ZONES.filter((z) => z.area === activeArea),
    [activeArea],
  );

  const summary = useMemo(
    () => calculateLaserPrice(selectedZones),
    [selectedZones],
  );

  function toggleZone(zoneId: string) {
    setSelectedZones((prev) => toggleZoneSelection(prev, zoneId));
  }

  const canProceed = selectedZones.length > 0 && skinType !== null;

  return (
    <main className="pb-20 md:pb-24">
      <section className={`${figmaInnerContainer} ${figmaSection}`} data-reveal>
        <FigmaBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Laserontharing", href: "/laserontharing" },
            { label: "Configurator" },
          ]}
        />
        <p className={figmaLabel}>Laserprijs</p>
        <FigmaHeading
          as="h1"
          size="hero"
          text="Bereken je *laserprijs*"
          className="mt-4 max-w-3xl"
        />
        <p className={`mt-7 max-w-2xl ${figmaBody}`}>
          Kies je zones, zie direct je prijsopbouw. GentleMax Pro, veilig voor elk huidtype
          Fitzpatrick I tot VI.
        </p>
      </section>

      <section className={`${figmaInnerContainer} ${figmaSectionTight}`}>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <div data-reveal>
              <p className={figmaLabel}>Zones</p>
              <FigmaHeading as="h2" size="section" text="Waar wilt u *ontharen*?" className="mt-4" />
              <FigmaFilterPills
                className="mt-8"
                items={LASER_ZONE_AREAS}
                value={activeArea}
                onChange={setActiveArea}
                ariaLabel="Lichaamsgebied"
              />

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {visibleZones.map((zone) => {
                  const selected = selectedZones.includes(zone.id);
                  return (
                    <li key={zone.id}>
                      <button
                        type="button"
                        onClick={() => toggleZone(zone.id)}
                        aria-pressed={selected}
                        className={`${zoneBtnBase} ${
                          selected
                            ? "border-[#286943] bg-[#f2f7ef] text-[#17372a]"
                            : "border-[#dce8d9] bg-white text-[#17372a] shadow-[0_8px_32px_rgba(15,45,28,.04)] hover:-translate-y-0.5 hover:border-[#95c592]"
                        }`}
                      >
                        <span>{zone.label}</span>
                        <span
                          className={`text-[13px] tabular-nums ${selected ? "text-[#286943]" : "text-[#5f7765]"}`}
                        >
                          {zone.singlePrice === 0 ? "Prijs op aanvraag" : `€${zone.singlePrice}`}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-14" data-reveal>
              <p className={figmaLabel}>Huidtype</p>
              <FigmaHeading as="h2" size="section" text="Wat is *jouw* huidtype?" className="mt-4" />
              <p className={`mt-5 ${figmaBody}`}>
                Fitzpatrick I tot VI, allemaal gelijkwaardig. Dit bepaalt de instellingen op de
                GentleMax Pro.
              </p>
              {selectedZones.length === 0 ? (
                <p className={`mt-5 ${figmaBody}`}>Kies eerst minstens één zone.</p>
              ) : (
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {FITZPATRICK_TYPES.map((type) => {
                    const selected = skinType === type.id;
                    return (
                      <li key={type.id}>
                        <button
                          type="button"
                          onClick={() => setSkinType(type.id)}
                          aria-pressed={selected}
                          className={`${zoneBtnBase} flex-col items-start justify-center py-4 ${
                            selected
                              ? "border-[#286943] bg-[#f2f7ef]"
                              : "border-[#dce8d9] bg-white shadow-[0_8px_32px_rgba(15,45,28,.04)] hover:border-[#95c592]"
                          }`}
                        >
                          <span className="text-[15px] font-medium text-[#17372a]">{type.label}</span>
                          <span className="mt-1 text-[13px] text-[#5f7765]">{type.description}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          <aside className="lg:col-span-5 lg:sticky lg:top-8" data-reveal>
            <div className={`${figmaCardWhite} p-6 sm:p-8`}>
              <p className={figmaLabel}>Je prijsopbouw</p>
              <p className="mt-2 text-4xl font-medium leading-none tracking-[-.04em] text-[#17372a] tabular-nums md:text-5xl">
                {summary.formattedSubtotal}
              </p>
              {summary.hasMissingPrices ? (
                <p className={`mt-2 ${figmaBody}`}>
                  Definitieve prijzen volgen zodra Okan ze aanlevert.
                </p>
              ) : null}

              {summary.lines.length > 0 ? (
                <ul className="mt-6 flex flex-col gap-2 border-t border-[#e8f0e4] pt-4">
                  {summary.lines.map((line) => (
                    <li
                      key={line.zoneId}
                      className="flex items-center justify-between text-[14px] text-[#5f7765]"
                    >
                      <span>{line.label}</span>
                      <span className="tabular-nums">{line.formatted}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={`mt-6 ${figmaBody}`}>Nog geen zones gekozen.</p>
              )}

              {skinType ? (
                <p className={`mt-4 ${figmaBody}`}>Huidtype: Fitzpatrick {skinType}</p>
              ) : null}

              <div className="mt-5">
                <DeLijn length="full" dot={canProceed ? 100 : summary.lines.length ? 50 : 0} />
              </div>

              <div className="mt-8 flex flex-col gap-3">
                {canProceed ? (
                  <Link href="/intake" className={`${figmaBtnPrimary} text-center`}>
                    Start je intake ↗
                  </Link>
                ) : (
                  <span
                    className={`${figmaBtnPrimary} pointer-events-none text-center opacity-40`}
                    aria-disabled="true"
                  >
                    Start je intake ↗
                  </span>
                )}
                <Link
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${figmaBtnMint} text-center`}
                >
                  Vraag stellen via WhatsApp ↗
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <StickyActionBar
        whatsappHref={whatsappHref}
        intakeHref="/intake"
        intakeLabel="Start je intake"
      />
    </main>
  );
}
