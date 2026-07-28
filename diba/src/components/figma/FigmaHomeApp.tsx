"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import FigmaKennisbankSection from "@/components/figma/FigmaKennisbankSection";
import FigmaSiteHeaderBlock from "@/components/figma/FigmaSiteHeaderBlock";
import FigmaVoorJouSection from "@/components/figma/FigmaVoorJouSection";
import DibaIcon from "@/components/ui/DibaIcon";
import FigmaSoftAccent from "@/components/figma/FigmaSoftAccent";
import HuidscanVisualShell from "@/components/ui/HuidscanVisualShell";
import WerkwijzeStepsFlow from "@/components/ui/WerkwijzeStepsFlow";
import { FIGMA_HOME_CLINIC, FIGMA_TRAJECT_TESTIMONIAL } from "@/data/figma-home-images";
import { HOME_FAQ_ITEMS } from "@/data/home-faq";
import { publicCopy } from "@/lib/copy-flags";
import {
  FIGMA_EERLIJK_PORTRAIT,
  FIGMA_EERLIJK_PORTRAIT_ALT,
  FIGMA_HERO_PORTRAIT,
  FIGMA_HERO_PORTRAIT_ALT,
} from "@/lib/figma-home-layout";
import { DIBA_INSTAGRAM_URL, DIBA_WHATSAPP_URL } from "@/lib/site";

const PROOF_STATS = [
  { stat: "4.000+", label: "klantreviews" },
  { stat: "50.000+", label: "uitgevoerde behandelingen" },
  { stat: "8.000+", label: "geholpen klanten" },
  { stat: "2017", label: "vertrouwd sinds" },
] as const;

export default function FigmaHomeApp() {
  const [scanOpen, setScanOpen] = useState(false);

  const year = new Date().getFullYear();

  useEffect(() => {
    if (!scanOpen) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setScanOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [scanOpen]);

  return (
    <main className="figma-home min-h-screen overflow-hidden bg-[#fcfdfb] text-[#17372a] selection:bg-[#b5df9d]">
      <FigmaSiteHeaderBlock variant="home" whatsappHref={DIBA_WHATSAPP_URL} />

      <section id="top" className="relative mx-auto max-w-[1800px] px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid min-h-[730px] lg:grid-cols-[1.18fr_.82fr]">
          <div className="flex flex-col justify-between py-14 lg:py-20">
            <div className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[.16em] text-[#5d8166]">
              <span className="h-2 w-2 rounded-full bg-[#5eae67]" aria-hidden="true" />
              Trust the green touch.
            </div>

            <div className="my-12">
              <p className="mb-5 text-[11px] uppercase tracking-[.14em] text-[#5d8166]">
                Huidzorg die klopt
              </p>
              <h1 className="max-w-4xl text-[clamp(3.8rem,8.3vw,8.8rem)] font-medium leading-[.84] tracking-[-.08em]">
                Geen gokwerk.
                <br />
                <span className="text-[#387849]">Wel jouw huid.</span>
              </h1>
              <p className="mt-8 max-w-md text-[16px] leading-7 text-[#5d7464]">
                Diba Clinics in Hillegersberg, Rotterdam. Eerlijk advies, openbare prijzen,
                en een nulmeting voordat we behandelen. Soms is het advies om even te wachten.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/intake"
                className="rounded-full bg-[#286943] px-6 py-4 text-[11px] font-medium uppercase tracking-[.13em] text-white transition hover:-translate-y-0.5 hover:bg-[#174e31]"
              >
                Start je intake (4 min) ↗
              </Link>
              <a
                href={DIBA_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 text-[11px] font-medium uppercase tracking-[.13em] text-[#2c6843] underline decoration-[#a0c9a1] underline-offset-5"
              >
                Nog niet zeker? Stel je vraag
              </a>
            </div>
          </div>

          <div className="relative min-h-[440px] overflow-hidden rounded-bl-[9rem] bg-[#cbe5bf] lg:rounded-bl-[14rem]">
            <Image
              src={FIGMA_HERO_PORTRAIT}
              alt={FIGMA_HERO_PORTRAIT_ALT}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-center mix-blend-multiply opacity-75"
            />
            <div
              className="absolute inset-0 bg-[linear-gradient(145deg,rgba(232,248,220,.84),transparent_55%,rgba(38,104,66,.28))]"
              aria-hidden="true"
            />
            <span className="absolute left-7 top-7 rounded-full bg-white/90 px-4 py-2 text-[10px] font-medium uppercase tracking-[.12em] text-[#397449]">
              Huidzorg, zonder hype
            </span>
            <span className="absolute bottom-7 right-7 grid h-24 w-24 place-items-center rounded-full border border-white/70 bg-[#2c7649]/90 text-center text-[10px] uppercase leading-4 tracking-[.11em] text-white">
              Eerlijk
              <br />
              advies
            </span>
          </div>
        </div>
      </section>

      <section className="border-y border-[#dce8d9] bg-white px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="mx-auto grid max-w-[1800px] divide-y divide-[#dce8d9] md:grid-cols-4 md:divide-x md:divide-y-0">
          {PROOF_STATS.map(({ stat, label }) => (
            <div key={label} className="py-7 text-center">
              <strong className="block text-3xl tracking-[-.06em] text-[#276541]">{stat}</strong>
              <span className="mt-2 block text-[10px] uppercase tracking-[.13em] text-[#66806a]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <FigmaVoorJouSection />

      <section className="relative overflow-hidden px-5 py-10 sm:px-9 lg:px-[7.5vw]">
        <div className="mx-auto flex max-w-[1800px] items-center justify-between rounded-[2rem] bg-[#eff8ea] px-7 py-6 sm:px-10">
          <div className="flex items-center gap-5">
            <DibaIcon variant="dark" size={56} className="rounded-full" />
            <p className="max-w-xl text-sm leading-6 text-[#487152]">
              <strong className="font-medium text-[#286943]">
                Elke huid wordt serieus genomen.
              </strong>{" "}
              Ook als je nog niet weet waar je moet beginnen.
            </p>
          </div>
          <a
            href={DIBA_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-white px-5 py-3 text-[10px] font-medium uppercase tracking-[.13em] text-[#286943] shadow-sm transition hover:bg-[#f2f7ef]"
          >
            Stel je vraag ↗
          </a>
        </div>
      </section>

      <section
        id="huidscan"
        className="bg-[#286943] px-5 py-20 text-white sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto grid max-w-[1800px] gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[.16em] text-[#b9dfa9]">
              De Diba huidscan
            </p>
            <h2 className="mt-5 text-5xl leading-[.93] tracking-[-.065em] sm:text-7xl">
              Wij gokken niet.
              <br />
              <span className="text-[#b8e39d]">Wij meten.</span>
            </h2>
            <p className="mt-7 max-w-md text-[16px] leading-7 text-[#d2ead0]">
              Met de Eve-M huidanalyse maken we een objectieve nulmeting. Zo zien we wat
              jouw huid nodig heeft en volgen we jouw voortgang in beeld.
            </p>
            <div className="mt-9 flex w-fit flex-col items-center gap-4">
              <button
                type="button"
                onClick={() => setScanOpen(true)}
                className="rounded-full bg-[#d8f0c8] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#245f3b]"
              >
                Hoe werkt de huidscan? ↗
              </button>
              <Link
                href="/behandelingen/huidanalyse"
                className="text-center text-[11px] font-medium uppercase tracking-[.13em] text-[#bfe7ac] underline underline-offset-4"
              >
                Meer over De Nulmeting ↗
              </Link>
            </div>
          </div>
          <HuidscanVisualShell className="mx-auto lg:ml-auto lg:mr-0" />
        </div>
      </section>

      {scanOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#123321]/55 p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="scan-dialog-title"
          onClick={() => setScanOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-[2rem] bg-white p-8 text-[#17372a] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setScanOpen(false)}
              className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-[#edf5e9] text-lg"
              aria-label="Sluiten"
            >
              ×
            </button>
            <span className="inline-block rounded-full bg-[#e7f4df] px-3 py-2 text-[10px] font-bold uppercase tracking-[.13em] text-[#337142]">
              Eve-M huidanalyse
            </span>
            <h3 id="scan-dialog-title" className="mt-6 text-4xl leading-none tracking-[-.06em]">
              Jouw huid in kaart.
            </h3>
            <p className="mt-5 max-w-md leading-7 text-[#607667]">
              Tijdens je intake bekijken we onder meer hydratatie, pigment, poriën en
              huidstructuur. De huidscan geeft ons een objectieve start. Jouw wensen
              blijven altijd leidend.
            </p>
            <Link
              href="/intake"
              onClick={() => setScanOpen(false)}
              className="mt-7 inline-block rounded-full bg-[#286943] px-5 py-3 text-[11px] uppercase tracking-[.13em] text-white"
            >
              Start je intake (4 min) ↗
            </Link>
          </div>
        </div>
      ) : null}

      <section id="werkwijze" className="px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <div className="mx-auto max-w-[1800px]">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[.15em] text-[#5d9564]">
                Onze werkwijze
              </p>
              <h2 className="mt-4 text-4xl leading-[.98] tracking-[-.06em] sm:text-6xl">
                Eerst begrijpen.
                <br />
                Dan behandelen.
              </h2>
            </div>
            <WerkwijzeStepsFlow variant="figma" className="self-end" />
          </div>
        </div>
      </section>

      <section className="bg-[#eef7e9] px-5 py-16 sm:px-9 lg:px-[7.5vw]">
        <div className="mx-auto grid max-w-[1800px] gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] bg-[#cbe5bf]">
            <Image
              src={FIGMA_EERLIJK_PORTRAIT}
              alt={FIGMA_EERLIJK_PORTRAIT_ALT}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover object-center mix-blend-multiply opacity-85"
            />
          </div>
          <div className="rounded-[2rem] bg-white p-8 sm:p-12">
            <p className="text-[10px] font-medium uppercase tracking-[.15em] text-[#5d9564]">
              Eerlijk advies
            </p>
            <h2 className="mt-5 max-w-xl text-4xl leading-[1] tracking-[-.06em] sm:text-6xl">
              Soms is niet behandelen óók het beste advies.
            </h2>
            <p className="mt-7 max-w-xl text-[16px] leading-7 text-[#5d7464]">
              Wij behandelen niet om te behandelen. We adviseren wat past bij jouw huid,
              jouw doel en jouw veiligheid. Ook wanneer dat betekent dat je beter eerst
              iets anders kunt doen.
            </p>
            <Link
              href="/intake?topic=second-opinion"
              className="mt-9 inline-block rounded-full border border-[#a9c9a9] px-5 py-3 text-[11px] font-medium uppercase tracking-[.13em] text-[#286943]"
            >
              Vraag een second opinion ↗
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <FigmaSoftAccent variant="traject" />
        <div className="relative mx-auto max-w-[1800px]">
          <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr]">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[.15em] text-[#5d9564]">
                Niet zomaar een afspraak
              </p>
              <h2 className="mt-4 text-4xl leading-[.98] tracking-[-.06em] sm:text-6xl">
                Een traject dat met je meebeweegt.
              </h2>
            </div>
            <p className="max-w-2xl self-end text-[16px] leading-7 text-[#5f7765]">
              Een mooie huid is zelden één moment. Daarom bekijken we samen wat er speelt,
              wat haalbaar is en hoe we jouw voortgang kunnen volgen, zonder dat je vastzit
              aan een pakket.
            </p>
          </div>
          <div className="mt-14 grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
            <div className="overflow-hidden rounded-[2rem] bg-[#e9f5e4] p-7 sm:p-10">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white px-4 py-2 text-[10px] font-medium uppercase tracking-[.12em] text-[#397249]">
                  Mijn Diba
                </span>
                <DibaIcon variant="dark" size={40} />
              </div>
              <h3 className="mt-16 max-w-lg text-3xl leading-[1] tracking-[-.055em] sm:text-5xl">
                Zie wat je huid
                <br />
                je vertelt.
              </h3>
              <div className="mt-12 grid grid-cols-3 gap-3">
                {[
                  { label: "Hydratatie", value: "+18%", width: "72%" },
                  { label: "Textuur", value: "Rustiger", width: "63%" },
                  { label: "Jouw plan", value: "Helder", width: "88%" },
                ].map((metric) => (
                  <div key={metric.label} className="rounded-2xl bg-white p-4">
                    <span className="text-[9px] uppercase tracking-[.12em] text-[#6e8673]">
                      {metric.label}
                    </span>
                    <strong className="mt-4 block text-2xl tracking-[-.06em] text-[#3f8850]">
                      {metric.value}
                    </strong>
                    <i className="mt-3 block h-1.5 w-full rounded-full bg-[#dcebd8]">
                      <i
                        className="block h-full rounded-full bg-[#6eb46e]"
                        style={{ width: metric.width }}
                      />
                    </i>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative min-h-[410px] overflow-hidden rounded-[2rem] bg-[#94bc8a]">
              <Image
                src={FIGMA_TRAJECT_TESTIMONIAL.src}
                alt={FIGMA_TRAJECT_TESTIMONIAL.alt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover object-[center_30%] mix-blend-multiply opacity-85"
              />
              <div
                className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(25,82,46,.82))]"
                aria-hidden="true"
              />
              <blockquote className="absolute bottom-7 left-7 right-7 max-w-md text-2xl leading-[1.15] tracking-[-.04em] text-white sm:text-3xl">
                “Ik voelde me voor het eerst niet als een probleem dat opgelost moest worden.”
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f2f7ef] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <div className="mx-auto max-w-[1800px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[.15em] text-[#5d9564]">
                In de kliniek
              </p>
              <h2 className="mt-4 text-4xl tracking-[-.06em] sm:text-6xl">
                Een groene pauze in je dag.
              </h2>
            </div>
            <p className="max-w-sm text-[15px] leading-7 text-[#627a68]">
              Van de eerste kop thee tot je nazorg: we hebben aandacht voor de hele ervaring.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-[.75fr_1.25fr_.75fr]">
            <div className="min-h-[300px] rounded-[2rem] bg-[#d1e9c6] p-7">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#4c9855]">
                ⌁
              </span>
              <h3 className="mt-28 text-3xl tracking-[-.05em]">Geen haast.</h3>
              <p className="mt-3 text-sm leading-6 text-[#54715d]">
                Er is ruimte voor je vragen, en voor twijfel.
              </p>
            </div>
            <div className="relative min-h-[300px] overflow-hidden rounded-[2rem] bg-[#70a96d]">
              <Image
                src={FIGMA_HOME_CLINIC.src}
                alt={FIGMA_HOME_CLINIC.alt}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover object-center mix-blend-multiply opacity-80"
              />
              <div
                className="absolute inset-0 bg-[linear-gradient(145deg,rgba(216,239,200,.78),rgba(112,169,109,.42)_48%,rgba(30,85,54,.62))]"
                aria-hidden="true"
              />
              <FigmaSoftAccent variant="clinic" className="z-10" />
              <div className="absolute -left-16 bottom-[-152px] z-[1] h-[22rem] w-[22rem] rounded-full border-[26px] border-[#d8efcc]/55" />
              <p className="absolute left-7 top-7 z-10 rounded-full bg-white/90 px-4 py-2 text-[10px] uppercase tracking-[.12em] text-[#397249]">
                Diba, Rotterdam
              </p>
              <p className="absolute bottom-7 left-7 z-10 text-2xl tracking-[-.05em] text-white drop-shadow-[0_2px_12px_rgba(15,45,28,.35)]">
                Warm in gevoel.
                <br />
                Scherp in kennis.
              </p>
              <Link
                href="/contact"
                className="absolute bottom-8 right-8 z-10 grid h-12 w-12 place-items-center rounded-full border border-white/50 text-xl text-white transition hover:bg-white/10"
                aria-label="Contact"
              >
                ↗
              </Link>
            </div>
            <div className="min-h-[300px] rounded-[2rem] bg-white p-7">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#e1f1da] text-[#4c9855]">
                ✦
              </span>
              <h3 className="mt-28 text-3xl tracking-[-.05em]">Heldere keuzes.</h3>
              <p className="mt-3 text-sm leading-6 text-[#54715d]">
                Over behandeling, kosten en wat je kunt verwachten.
              </p>
              <Link
                href="/prijzen"
                className="mt-6 inline-block text-[10px] font-medium uppercase tracking-[.14em] text-[#286943] underline underline-offset-4"
              >
                Bekijk prijzen ↗
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FigmaKennisbankSection />

      <section className="px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <div className="mx-auto grid max-w-[1800px] gap-10 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[.15em] text-[#5d9564]">
              Goed om te weten
            </p>
            <h2 className="mt-4 text-4xl leading-[.98] tracking-[-.06em] sm:text-6xl">
              Eerst even dit.
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-7 text-[#627a68]">
              Duidelijkheid is een vorm van zorg. Daarom beantwoorden we de vragen die het
              vaakst vooraf worden gesteld.
            </p>
          </div>
          <div className="border-t border-[#dce8d9]">
            {HOME_FAQ_ITEMS.map((item) => (
              <details key={item.id} className="group border-b border-[#dce8d9] py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-xl tracking-[-.035em]">
                  <span>{item.question}</span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#edf6e8] text-[#367544] transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="max-w-xl pt-4 text-[15px] leading-7 text-[#617968]">
                  {publicCopy(item.answer)}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section
        id="boeken"
        className="mx-5 mb-5 overflow-hidden rounded-[2.5rem] bg-[#286943] px-7 py-14 text-white sm:mx-9 sm:px-12 lg:mx-[7.5vw] lg:px-16 lg:py-20"
      >
        <div className="relative mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[1.2fr_.8fr]">
          <FigmaSoftAccent variant="cta" />
          <div className="relative">
            <p className="text-[10px] font-medium uppercase tracking-[.16em] text-[#bfe7ac]">
              Jouw eerste afspraak
            </p>
            <h2 className="mt-5 text-5xl leading-[.91] tracking-[-.07em] sm:text-7xl">
              Kom zoals je bent.
              <br />
              Wij kijken met je mee.
            </h2>
          </div>
          <div className="relative flex flex-col justify-end">
            <p className="max-w-sm text-[16px] leading-7 text-[#d5ead1]">
              Plan een intake in onze kliniek in Hillegersberg. We nemen de tijd voor jouw
              vragen, huidanalyse en een duidelijk behandelvoorstel.
            </p>
            <Link
              href="/intake"
              className="mt-8 w-fit rounded-full bg-[#d8f0c8] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#245f3b]"
            >
              Start je intake (4 min) ↗
            </Link>
            <a
              href={DIBA_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-[11px] font-medium uppercase tracking-[.13em] text-[#bfe7ac] underline underline-offset-4"
            >
              Nog niet zeker? Stel je vraag
            </a>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-[1800px] px-5 pb-10 sm:px-9 lg:px-[7.5vw]">
        <div className="flex flex-col gap-6 border-t border-[#dce8d9] pt-7">
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-[10px] font-medium uppercase tracking-[.13em] text-[#66806a]">
            <Link href="/huidproblemen" className="transition hover:text-[#286943]">
              Huidproblemen
            </Link>
            <Link href="/prijzen" className="transition hover:text-[#286943]">
              Prijzen
            </Link>
            <Link href="/contact" className="transition hover:text-[#286943]">
              Contact
            </Link>
            <Link href="/privacybeleid" className="transition hover:text-[#286943]">
              Privacy
            </Link>
            <Link href="/cookiebeleid" className="transition hover:text-[#286943]">
              Cookies
            </Link>
            {DIBA_INSTAGRAM_URL ? (
              <a
                href={DIBA_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-[#286943]"
              >
                Instagram
              </a>
            ) : (
              <span className="opacity-50" title="[GEGEVEN-NODIG]">
                Instagram
              </span>
            )}
          </div>
          <div className="flex flex-col gap-5 text-[10px] font-medium uppercase tracking-[.13em] text-[#66806a] sm:flex-row sm:items-center sm:justify-between">
            <span>© {year} Diba Clinics</span>
            <span>Weissenbruchlaan 166 · Rotterdam · Hillegersberg</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
