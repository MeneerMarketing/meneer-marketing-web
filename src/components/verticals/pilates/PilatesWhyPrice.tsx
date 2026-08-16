"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Mail,
  MessageCircle,
  Phone,
  Rocket,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";

import { Reveal } from "@/components/effects/Reveal";
import { Magnetic } from "@/components/effects/Magnetic";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { PilatesPriceHeadline } from "@/components/verticals/pilates/PilatesPriceHeadline";
import { PilatesStudioReceipt } from "@/components/verticals/pilates/PilatesStudioReceipt";
import type { VerticalPackageId } from "@/data/verticals/types";
import {
  businessEmailDisplay,
  getContactChannels,
  mailtoHref,
  telHref,
  whatsappHref,
  type ContactChannel,
} from "@/lib/contact";
import { trackPilatesEvent } from "@/lib/verticals/analytics";

const HEADING_ID = "pilates-why-price-heading";
const EASE = [0.22, 1, 0.36, 1] as const;

const PACKAGE_STORIES: Record<
  VerticalPackageId,
  {
    eyebrow: string;
    title: string;
    paragraphs: readonly [string, string];
    stats: readonly { k: string; v: string }[];
  }
> = {
  "studio-edition": {
    eyebrow: "Studio Edition · instap",
    title: "Gevonden worden in jouw stad, met een site die echt klopt",
    paragraphs: [
      "Je studio oogt premium op de vloer. Online moet dat hetzelfde voelen. Ik bouw je site from scratch in jouw branding: lessen, tarieven, proefles. Geen template, geen rommel.",
      "Daarna de basis die Google snapt: Pilates + jouw stad, technisch netjes, doorverwijzing naar boeking. Eerst zichtbaar worden en serieus overkomen. Ads kunnen later. Dit is je digitale visitekaartje, maar dan eentje die ook scoort.",
    ],
    stats: [
      { k: "Doel", v: "Zichtbaar + vertrouwen" },
      { k: "Google", v: "Lokaal gevonden" },
      { k: "Site", v: "Studioniveau" },
    ],
  },
  "local-growth": {
    eyebrow: "Local Growth · meest gekozen",
    title: "Structureel meer proeflessen uit Google",
    paragraphs: [
      "Alles uit Studio Edition, plus actieve groei. Meerdere pagina's voor reformer, mat, private. Google Maps scherp. Rankings die ik elke maand bijstuur op basis van wat er echt gebeurt in jouw regio.",
      "Iemand zoekt Pilates bij jou in de buurt en landt op jouw pagina, niet op die van de concurrent. Proefles geboekt, rooster gevuld. Dit pakket is voor studio's die online al staan, maar nu echt willen groeien zonder zelf SEO te worden.",
    ],
    stats: [
      { k: "Doel", v: "Meer proeflessen" },
      { k: "Google", v: "Maandelijks scherp" },
      { k: "Maps", v: "Lokaal zichtbaar" },
    ],
  },
  "growth-partner": {
    eyebrow: "Growth Partner · vol gas",
    title: "Echte boost: meer leden, meer omzet",
    paragraphs: [
      "Organisch is solide, maar soms wil je sneller schalen. Growth Partner pakt alles uit Local Growth en zet daar Google Ads, Meta Ads en creators bovenop. Campagnes die doorsturen naar pagina's die echt laten boeken.",
      "Meer verkeer, meer proeflessen, meer vaste leden. Jij runt de studio en de les. Ik run de kanalen die volume brengen. Wil je echt gas geven op omzet en leden, pak dan het grootste pakket.",
    ],
    stats: [
      { k: "Doel", v: "Omzet + leden" },
      { k: "Kanalen", v: "Ads + creators" },
      { k: "Tempo", v: "Snel schalen" },
    ],
  },
};

interface TiltStackCardProps {
  children: ReactNode;
  rotate: number;
  delay?: number;
  className?: string;
}

function TiltStackCard({
  children,
  rotate,
  delay = 0,
  className = "",
}: TiltStackCardProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 22, rotate: rotate * 1.15 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.52, delay, ease: EASE }}
      whileHover={reduce ? undefined : { rotate: rotate * 0.4, y: -2 }}
      className={`relative ml-1 sm:ml-2 ${className}`}
      style={{ transformOrigin: "50% 40%", willChange: "transform" }}
    >
      {children}
      <span
        className="pointer-events-none absolute -bottom-1.5 left-[8%] h-3 w-[84%] rounded-[100%] bg-slate-900/[0.07] blur-md"
        aria-hidden
      />
    </motion.div>
  );
}

const CHANNEL_ICONS = {
  email: Mail,
  whatsapp: MessageCircle,
  phone: Phone,
} as const;

const PILATES_CONTACT_HINTS: Record<ContactChannel["id"], string> = {
  whatsapp:
    "Mijn favoriet. Snel, informeel, ik reageer alsof we al samenwerken.",
  phone: "Liever bellen? Plan een moment of bel direct als het uitkomt.",
  email: "Uitgebreide vraag? Mail werkt. Ik lees alles zelf.",
};

const PILATES_WHATSAPP =
  "Hoi Meneer Marketing! Ik heb een Pilates studio en wil eerst even sparren voordat ik start.";

function pilatesChannelHref(channel: ContactChannel): string {
  if (channel.id === "whatsapp") {
    return whatsappHref(PILATES_WHATSAPP) ?? channel.href;
  }
  if (channel.id === "email") {
    return mailtoHref({
      subject: "Pilates studio · even sparren",
      body: "Hoi!\n\nIk heb een Pilates studio en wil eerst even contact voordat ik start.\n\n",
    });
  }
  return telHref() ?? channel.href;
}

export function PilatesWhyPrice() {
  const reduce = useReducedMotion();
  const channels = getContactChannels();
  const [selectedPackage, setSelectedPackage] =
    useState<VerticalPackageId>("studio-edition");
  const [contactMode, setContactMode] =
    useState<ContactChannel["id"]>("whatsapp");
  const activeChannel =
    channels.find((c) => c.id === contactMode) ?? channels[1]!;
  const packageStory = PACKAGE_STORIES[selectedPackage];

  function startDirect() {
    sessionStorage.setItem("lge-interest", selectedPackage);
    trackPilatesEvent("pilates_package_select", {
      location: "why_price_direct",
      package: selectedPackage,
    });
  }

  function pickContact(id: ContactChannel["id"]) {
    setContactMode(id);
    trackPilatesEvent("pilates_demo_click", {
      location: "why_price_contact",
      channel: id,
    });
  }

  return (
    <section
      id="eerlijk-prijs"
      className="relative overflow-x-clip border-b border-slate-200 bg-[#faf8f5]"
      aria-labelledby={HEADING_ID}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,87,34,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,87,34,0.05) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <PilatesPriceHeadline
            headingId={HEADING_ID}
            selectedPackage={selectedPackage}
            onPackageChange={setSelectedPackage}
          />
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-start lg:gap-12">
          <div className="flex flex-col gap-4 overflow-visible py-1">
            <Reveal delay={0.06}>
              <TiltStackCard rotate={-0.55} delay={0.06}>
                <article className="rounded-2xl border border-slate-200 bg-[#fffef9] p-5 shadow-[0_20px_48px_-32px_rgba(15,23,42,0.32)] ring-1 ring-slate-900/[0.04] sm:p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedPackage}
                      initial={reduce ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: -8 }}
                      transition={{ duration: 0.28, ease: EASE }}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5722]">
                        {packageStory.eyebrow}
                      </p>
                      <h3 className="mt-2 text-lg font-extrabold tracking-tight text-balance text-slate-900 sm:text-xl">
                        {packageStory.title}
                      </h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                        {packageStory.paragraphs[0]}
                      </p>
                      <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                        {packageStory.paragraphs[1]}
                      </p>

                      <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-dashed border-slate-200 pt-3.5">
                        {packageStory.stats.map((item) => (
                          <div key={item.k}>
                            <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                              {item.k}
                            </dt>
                            <dd className="mt-0.5 text-sm font-extrabold tracking-tight text-slate-900">
                              {item.v}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </motion.div>
                  </AnimatePresence>
                </article>
              </TiltStackCard>
            </Reveal>

            <Reveal delay={0.1}>
              <TiltStackCard rotate={0.45} delay={0.1}>
                <div className="flex items-start gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/80 p-4 shadow-[0_14px_36px_-28px_rgba(16,185,129,0.35)] ring-1 ring-emerald-900/[0.04] sm:p-5">
                  <span className="inline-flex size-9 shrink-0 -rotate-3 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                    <ShieldCheck className="size-4" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
                      Maandelijks opzegbaar. Echt.
                    </h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-slate-600">
                      Vandaag starten, volgende maand stoppen mag. Al gok ik
                      dat je blijft: ik stuur op groei die je terugziet in je
                      ledenlijst.
                    </p>
                  </div>
                </div>
              </TiltStackCard>
            </Reveal>

            <Reveal delay={0.14}>
              <TiltStackCard rotate={-0.35} delay={0.14}>
                <Magnetic strength={8} radius={220}>
                  <a
                    href="#aanvraag"
                    onClick={startDirect}
                    className="group relative flex flex-col overflow-hidden rounded-2xl bg-[#FF5722] p-5 text-white shadow-[0_26px_54px_-26px_rgba(255,87,34,0.6)] ring-1 ring-[#FF5722]/30 transition hover:-translate-y-1 hover:bg-[#e64a19] sm:p-6"
                  >
                  <div
                    className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/10 blur-2xl"
                    aria-hidden
                  />
                  <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-white/15">
                      <Rocket className="size-5" aria-hidden />
                    </span>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em]">
                      Snelste route
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-extrabold tracking-tight sm:text-2xl">
                    Ik wil gelijk beginnen
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-orange-50">
                    {selectedPackage === "studio-edition"
                      ? "Je site live, gevonden in jouw stad. Hoe eerder we starten, hoe eerder Google je studio kent."
                      : selectedPackage === "local-growth"
                        ? "Local Growth · ik stuur actief op proeflessen uit Google. Laten we meteen plannen."
                        : "Growth Partner · ads, creators en alles eromheen. Klaar voor echte groei? Start hier."}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold">
                    Naar checkout
                    <ArrowUpRight
                      className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    />
                  </span>
                </a>
              </Magnetic>
              </TiltStackCard>
            </Reveal>

            <Reveal delay={0.18}>
              <TiltStackCard rotate={0.5} delay={0.18}>
                <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-[#fffef9] shadow-[0_24px_50px_-36px_rgba(15,23,42,0.22)] ring-1 ring-slate-900/[0.04]">
                <div className="border-b border-slate-100 bg-slate-50 px-5 py-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Eerst even sparren?
                  </p>
                  <p className="mt-0.5 text-sm font-extrabold text-slate-900">
                    Kies hoe je me het liefst bereikt
                  </p>
                </div>

                <div className="flex flex-col p-4 sm:p-5">
                  <div
                    className="flex flex-wrap gap-2"
                    role="tablist"
                    aria-label="Contactvoorkeur"
                  >
                    {channels.map((channel) => {
                      const selected = contactMode === channel.id;
                      const Icon = CHANNEL_ICONS[channel.id];
                      return (
                        <button
                          key={channel.id}
                          type="button"
                          role="tab"
                          aria-selected={selected}
                          onClick={() => pickContact(channel.id)}
                          className={
                            selected
                              ? channel.id === "whatsapp"
                                ? "inline-flex items-center gap-2 rounded-full bg-emerald-500 px-3.5 py-1.5 text-[13px] font-bold text-white shadow-md"
                                : "inline-flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-1.5 text-[13px] font-bold text-white shadow-md"
                              : "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[13px] font-bold text-slate-700 transition hover:border-slate-300"
                          }
                        >
                          <Icon className="size-4" aria-hidden />
                          {channel.label}
                          {channel.id === "whatsapp" ? (
                            <span
                              className={
                                selected
                                  ? "rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                                  : "rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-800"
                              }
                            >
                              Favoriet
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex min-h-[8.5rem] flex-col rounded-xl border border-slate-100 bg-[#f7f8fa] p-3.5">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={contactMode}
                        initial={reduce ? false : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, y: -8 }}
                        transition={{ duration: 0.22, ease: EASE }}
                        className="flex flex-1 flex-col"
                      >
                        <div className="flex items-start gap-2.5">
                          <InteractiveLogo className="size-8 shrink-0" />
                          <div className="max-w-[90%] rounded-2xl rounded-tl-md bg-white px-3.5 py-2.5 shadow-sm ring-1 ring-slate-200/80">
                            <p className="text-[13px] leading-relaxed text-slate-700">
                              {PILATES_CONTACT_HINTS[contactMode]}
                            </p>
                          </div>
                        </div>

                        <div className="mt-auto flex justify-end pt-3">
                          <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-[#FF5722] px-3.5 py-2 text-[13px] font-semibold text-white shadow-sm">
                            {contactMode === "whatsapp"
                              ? "WhatsApp me even over mijn studio"
                              : contactMode === "phone"
                                ? "Zullen we bellen?"
                                : "Ik mail je even mijn situatie"}
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {activeChannel.external ? (
                    <a
                      href={pilatesChannelHref(activeChannel)}
                      target={
                        activeChannel.id === "whatsapp" ? "_blank" : undefined
                      }
                      rel={
                        activeChannel.id === "whatsapp"
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="mt-3.5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] font-bold text-slate-900 transition hover:border-[#FF5722]/40 hover:text-[#FF5722]"
                    >
                      {contactMode === "whatsapp"
                        ? "Open WhatsApp"
                        : contactMode === "phone"
                          ? "Bel of plan een moment"
                          : `Mail ${businessEmailDisplay}`}
                      <ArrowUpRight className="size-4" aria-hidden />
                    </a>
                  ) : (
                    <Link
                      href="/contact"
                      className="mt-3.5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] font-bold text-slate-900 transition hover:border-[#FF5722]/40 hover:text-[#FF5722]"
                    >
                      Naar contact
                      <ArrowUpRight className="size-4" aria-hidden />
                    </Link>
                  )}
                </div>
                </div>
              </TiltStackCard>
            </Reveal>
          </div>

          <div className="flex w-full justify-center lg:sticky lg:top-24 lg:ml-4 lg:justify-start xl:ml-6">
            <PilatesStudioReceipt packageId={selectedPackage} />
          </div>
        </div>
      </div>
    </section>
  );
}
