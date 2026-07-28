"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import FigmaKennisbankSection from "@/components/figma/FigmaKennisbankSection";
import FigmaSiteHeaderBlock from "@/components/figma/FigmaSiteHeaderBlock";
import FigmaVoorJouSection from "@/components/figma/FigmaVoorJouSection";
import Button from "@/components/ui/Button";
import DibaIcon from "@/components/ui/DibaIcon";
import { ArrowUpRight, Close, PlusMinus, Pulse, Sparkle } from "@/components/ui/Icon";
import Label from "@/components/ui/Label";
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
    <main className="figma-home min-h-screen overflow-hidden bg-[var(--g-010)] text-[var(--t-strong)] selection:bg-[var(--on-dark-accent)]">
      <FigmaSiteHeaderBlock variant="home" whatsappHref={DIBA_WHATSAPP_URL} />

      <section id="top" className="relative mx-auto max-w-[1800px] px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid min-h-[730px] lg:grid-cols-[1.18fr_.82fr]">
          <div className="flex flex-col justify-between py-14 lg:py-20">
            <div className="diba-label flex items-center gap-3">
              <span
                className="h-2 w-2 rounded-[var(--r-pill)] bg-[var(--g-400)]"
                aria-hidden="true"
              />
              Trust the green touch.
            </div>

            <div className="my-12">
              <Label className="mb-5">Huidzorg die klopt</Label>
              <h1 className="diba-display-xl max-w-4xl">
                Geen gokwerk.
                <br />
                <span className="diba-accent">Wel jouw huid.</span>
              </h1>
              <p className="mt-8 max-w-md text-[16px] leading-7 text-[var(--t-body)]">
                Diba Clinics in Hillegersberg, Rotterdam. Eerlijk advies, openbare prijzen,
                en een nulmeting voordat we behandelen. Soms is het advies om even te wachten.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button href="/intake">Start je intake (4 min)</Button>
              <Button
                href={DIBA_WHATSAPP_URL}
                variant="ghost"
                target="_blank"
                rel="noopener noreferrer"
              >
                Nog niet zeker? Stel je vraag
              </Button>
            </div>
          </div>

          <div className="relative min-h-[440px] overflow-hidden rounded-bl-[9rem] bg-[var(--g-200)] lg:rounded-bl-[14rem]">
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
            <span className="diba-label absolute left-7 top-7 rounded-[var(--r-pill)] bg-white/90 px-4 py-2 text-[var(--g-700)]">
              Huidzorg, zonder hype
            </span>
            <span className="diba-label absolute bottom-7 right-7 grid h-24 w-24 place-items-center rounded-[var(--r-pill)] border border-white/70 bg-[var(--g-700)]/90 text-center leading-4 text-white">
              Eerlijk
              <br />
              advies
            </span>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--g-100)] bg-white px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="mx-auto grid max-w-[1800px] divide-y divide-[var(--g-100)] md:grid-cols-4 md:divide-x md:divide-y-0">
          {PROOF_STATS.map(({ stat, label }) => (
            <div key={label} className="py-7 text-center">
              <strong className="block text-3xl tracking-[-.06em] text-[var(--g-700)] tabular-nums">
                {stat}
              </strong>
              <span className="diba-label mt-2 block text-[var(--t-muted)]">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <FigmaVoorJouSection />

      <section className="relative overflow-hidden px-5 py-10 sm:px-9 lg:px-[7.5vw]">
        <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-5 rounded-[var(--r-lg)] bg-[var(--g-050)] px-7 py-6 sm:px-10">
          <div className="flex items-center gap-5">
            <DibaIcon variant="dark" size={56} className="rounded-[var(--r-pill)]" />
            <p className="max-w-xl text-sm leading-6 text-[var(--t-body)]">
              <strong className="font-medium text-[var(--g-700)]">
                Elke huid wordt serieus genomen.
              </strong>{" "}
              Ook als je nog niet weet waar je moet beginnen.
            </p>
          </div>
          <a
            href={DIBA_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="diba-label inline-flex shrink-0 items-center gap-1.5 rounded-[var(--r-pill)] bg-white px-5 py-3 text-[var(--g-700)] shadow-sm transition hover:bg-[var(--g-025)]"
          >
            Stel je vraag
            <ArrowUpRight size={13} />
          </a>
        </div>
      </section>

      <section
        id="huidscan"
        className="bg-[var(--g-700)] px-5 py-20 text-[var(--on-dark)] sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto grid max-w-[1800px] gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <Label opDonker>De Diba huidscan</Label>
            <h2 className="diba-display-l mt-5">
              Wij gokken niet.
              <br />
              <span className="diba-accent-on-dark">Wij meten.</span>
            </h2>
            <p className="mt-7 max-w-md text-[16px] leading-7 text-[var(--on-dark-body)]">
              Met de Eve-M huidanalyse maken we een objectieve nulmeting. Zo zien we wat
              jouw huid nodig heeft en volgen we jouw voortgang in beeld.
            </p>
            <div className="mt-9 flex w-fit flex-col items-start gap-4">
              <Button variant="primair-op-donker" onClick={() => setScanOpen(true)}>
                Hoe werkt de huidscan?
              </Button>
              <Link
                href="/behandelingen/huidanalyse"
                className="diba-label diba-label-on-dark inline-flex items-center gap-1.5 underline underline-offset-4"
              >
                Meer over De Nulmeting
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
          <HuidscanVisualShell className="mx-auto lg:ml-auto lg:mr-0" />
        </div>
      </section>

      {scanOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[var(--g-900)]/60 p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="scan-dialog-title"
          onClick={() => setScanOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-[var(--r-lg)] bg-white p-8 text-[var(--t-strong)] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setScanOpen(false)}
              className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-[var(--r-pill)] bg-[var(--g-050)] text-[var(--g-700)]"
              aria-label="Sluiten"
            >
              <Close size={18} />
            </button>
            <span className="diba-label inline-block rounded-[var(--r-pill)] bg-[var(--g-050)] px-3 py-2">
              Eve-M huidanalyse
            </span>
            <h3 id="scan-dialog-title" className="diba-display-m mt-6">
              Jouw huid in kaart.
            </h3>
            <p className="mt-5 max-w-md leading-7 text-[var(--t-body)]">
              Tijdens je intake bekijken we onder meer hydratatie, pigment, poriën en
              huidstructuur. De huidscan geeft ons een objectieve start. Jouw wensen
              blijven altijd leidend.
            </p>
            <Button href="/intake" onClick={() => setScanOpen(false)} className="mt-7">
              Start je intake (4 min)
            </Button>
          </div>
        </div>
      ) : null}

      <section id="werkwijze" className="px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <div className="mx-auto max-w-[1800px]">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <Label>Onze werkwijze</Label>
              <h2 className="diba-display-m mt-4">
                Eerst begrijpen.
                <br />
                Dan behandelen.
              </h2>
            </div>
            <WerkwijzeStepsFlow variant="figma" className="self-end" />
          </div>
        </div>
      </section>

      <section className="bg-[var(--g-050)] px-5 py-16 sm:px-9 lg:px-[7.5vw]">
        <div className="mx-auto grid max-w-[1800px] gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div className="relative min-h-[360px] overflow-hidden rounded-[var(--r-lg)] bg-[var(--g-200)]">
            <Image
              src={FIGMA_EERLIJK_PORTRAIT}
              alt={FIGMA_EERLIJK_PORTRAIT_ALT}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover object-center mix-blend-multiply opacity-85"
            />
          </div>
          <div className="rounded-[var(--r-lg)] bg-white p-8 sm:p-12">
            <Label>Eerlijk advies</Label>
            <h2 className="diba-display-m mt-5 max-w-xl">
              Soms is niet behandelen óók het beste advies.
            </h2>
            <p className="mt-7 max-w-xl text-[16px] leading-7 text-[var(--t-body)]">
              Wij behandelen niet om te behandelen. We adviseren wat past bij jouw huid,
              jouw doel en jouw veiligheid. Ook wanneer dat betekent dat je beter eerst
              iets anders kunt doen.
            </p>
            <Button href="/intake?topic=second-opinion" variant="secundair" className="mt-9">
              Vraag een second opinion
            </Button>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <FigmaSoftAccent variant="traject" />
        <div className="relative mx-auto max-w-[1800px]">
          <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr]">
            <div>
              <Label>Niet zomaar een afspraak</Label>
              <h2 className="diba-display-m mt-4">Een traject dat met je meebeweegt.</h2>
            </div>
            <p className="max-w-2xl self-end text-[16px] leading-7 text-[var(--t-body)]">
              Een mooie huid is zelden één moment. Daarom bekijken we samen wat er speelt,
              wat haalbaar is en hoe we jouw voortgang kunnen volgen, zonder dat je vastzit
              aan een pakket.
            </p>
          </div>
          <div className="mt-14 grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
            <div className="overflow-hidden rounded-[var(--r-lg)] bg-[var(--g-050)] p-7 sm:p-10">
              <div className="flex items-center justify-between">
                <span className="diba-label rounded-[var(--r-pill)] bg-white px-4 py-2 text-[var(--g-700)]">
                  Mijn Diba
                </span>
                <DibaIcon variant="dark" size={40} />
              </div>
              <h3 className="diba-display-m mt-16 max-w-lg">
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
                  <div key={metric.label} className="rounded-[var(--r-sm)] bg-white p-4">
                    <span className="diba-label text-[var(--t-muted)]">{metric.label}</span>
                    <strong className="mt-4 block text-2xl tracking-[-.06em] text-[var(--g-600)] tabular-nums">
                      {metric.value}
                    </strong>
                    <i className="mt-3 block h-1.5 w-full rounded-[var(--r-pill)] bg-[var(--g-100)]">
                      <i
                        className="block h-full rounded-[var(--r-pill)] bg-[var(--g-400)]"
                        style={{ width: metric.width }}
                      />
                    </i>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative min-h-[410px] overflow-hidden rounded-[var(--r-lg)] bg-[var(--g-300)]">
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

      <section className="bg-[var(--g-025)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <div className="mx-auto max-w-[1800px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Label>In de kliniek</Label>
              <h2 className="diba-display-m mt-4">Een groene pauze in je dag.</h2>
            </div>
            <p className="max-w-sm text-[15px] leading-7 text-[var(--t-body)]">
              Van de eerste kop thee tot je nazorg: we hebben aandacht voor de hele ervaring.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-[.75fr_1.25fr_.75fr]">
            <div className="min-h-[300px] rounded-[var(--r-lg)] bg-[var(--g-200)] p-7">
              <span className="grid h-10 w-10 place-items-center rounded-[var(--r-pill)] bg-white text-[var(--g-500)]">
                <Pulse size={18} />
              </span>
              <h3 className="diba-card-title mt-28">Geen haast.</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--t-body)]">
                Er is ruimte voor je vragen, en voor twijfel.
              </p>
            </div>
            <div className="relative min-h-[300px] overflow-hidden rounded-[var(--r-lg)] bg-[var(--g-300)]">
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
              <p className="diba-label absolute left-7 top-7 z-10 rounded-[var(--r-pill)] bg-white/90 px-4 py-2 text-[var(--g-700)]">
                Diba, Rotterdam
              </p>
              <p className="diba-card-title absolute bottom-7 left-7 z-10 text-white drop-shadow-[0_2px_12px_rgba(15,45,28,.35)]">
                Warm in gevoel.
                <br />
                Scherp in kennis.
              </p>
              <Link
                href="/contact"
                className="absolute bottom-8 right-8 z-10 grid h-12 w-12 place-items-center rounded-[var(--r-pill)] border border-white/50 text-white transition hover:bg-white/10"
                aria-label="Contact en route"
              >
                <ArrowUpRight size={20} />
              </Link>
            </div>
            <div className="min-h-[300px] rounded-[var(--r-lg)] bg-white p-7">
              <span className="grid h-10 w-10 place-items-center rounded-[var(--r-pill)] bg-[var(--g-050)] text-[var(--g-500)]">
                <Sparkle size={18} />
              </span>
              <h3 className="diba-card-title mt-28">Heldere keuzes.</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--t-body)]">
                Over behandeling, kosten en wat je kunt verwachten.
              </p>
              <Link
                href="/prijzen"
                className="diba-label mt-6 inline-flex items-center gap-1.5 text-[var(--g-700)] underline underline-offset-4"
              >
                Bekijk prijzen
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FigmaKennisbankSection />

      <section className="px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <div className="mx-auto grid max-w-[1800px] gap-10 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <Label>Goed om te weten</Label>
            <h2 className="diba-display-m mt-4">Eerst even dit.</h2>
            <p className="mt-6 max-w-sm text-[15px] leading-7 text-[var(--t-body)]">
              Duidelijkheid is een vorm van zorg. Daarom beantwoorden we de vragen die het
              vaakst vooraf worden gesteld.
            </p>
          </div>
          <div className="border-t border-[var(--g-100)]">
            {HOME_FAQ_ITEMS.map((item) => (
              <details key={item.id} className="group border-b border-[var(--g-100)] py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-xl tracking-[-.035em]">
                  <span>{item.question}</span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[var(--r-pill)] bg-[var(--g-050)] text-[var(--g-700)] transition group-open:rotate-180">
                    <PlusMinus size={16} />
                  </span>
                </summary>
                <p className="max-w-xl pt-4 text-[15px] leading-7 text-[var(--t-body)]">
                  {publicCopy(item.answer)}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section
        id="boeken"
        className="mx-5 mb-5 overflow-hidden rounded-[var(--r-xl)] bg-[var(--g-700)] px-7 py-14 text-[var(--on-dark)] sm:mx-9 sm:px-12 lg:mx-[7.5vw] lg:px-16 lg:py-20"
      >
        <div className="relative mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[1.2fr_.8fr]">
          <FigmaSoftAccent variant="cta" />
          <div className="relative">
            <Label opDonker>Jouw eerste afspraak</Label>
            <h2 className="diba-display-l mt-5">
              Kom zoals je bent.
              <br />
              Wij kijken met je mee.
            </h2>
          </div>
          <div className="relative flex flex-col justify-end">
            <p className="max-w-sm text-[16px] leading-7 text-[var(--on-dark-body)]">
              Plan een intake in onze kliniek in Hillegersberg. We nemen de tijd voor jouw
              vragen, huidanalyse en een duidelijk behandelvoorstel.
            </p>
            <Button href="/intake" variant="primair-op-donker" className="mt-8 w-fit">
              Start je intake (4 min)
            </Button>
            <a
              href={DIBA_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="diba-label diba-label-on-dark mt-4 underline underline-offset-4"
            >
              Nog niet zeker? Stel je vraag
            </a>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-[1800px] px-5 pb-10 sm:px-9 lg:px-[7.5vw]">
        <div className="flex flex-col gap-6 border-t border-[var(--g-100)] pt-7">
          <div className="diba-label flex flex-wrap gap-x-8 gap-y-3 text-[var(--t-muted)]">
            <Link href="/huidproblemen" className="transition hover:text-[var(--g-700)]">
              Huidproblemen
            </Link>
            <Link href="/prijzen" className="transition hover:text-[var(--g-700)]">
              Prijzen
            </Link>
            <Link href="/contact" className="transition hover:text-[var(--g-700)]">
              Contact
            </Link>
            <Link href="/privacybeleid" className="transition hover:text-[var(--g-700)]">
              Privacy
            </Link>
            <Link href="/cookiebeleid" className="transition hover:text-[var(--g-700)]">
              Cookies
            </Link>
            {DIBA_INSTAGRAM_URL ? (
              <a
                href={DIBA_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-[var(--g-700)]"
              >
                Instagram
              </a>
            ) : (
              <span className="opacity-50" title="[GEGEVEN-NODIG]">
                Instagram
              </span>
            )}
          </div>
          <div className="diba-label flex flex-col gap-5 text-[var(--t-muted)] sm:flex-row sm:items-center sm:justify-between">
            <span>© {year} Diba Clinics</span>
            <span>Weissenbruchlaan 166 · Rotterdam · Hillegersberg</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
