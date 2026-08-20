/**
 * Zet een nieuwe huidprobleempagina neer volgens het vaste patroon.
 *
 * WAAROM DIT EEN SCRIPT IS EN GEEN KOPIEER-EN-PLAK.
 *
 * Er staan inmiddels elf van deze pagina's, en ze hebben allemaal dezelfde romp: hero met
 * kruimelpad, bewijsstrip, sprongnavigatie, een eigen test in drie stappen, de beeldkiezer
 * met een doorverwijsblok, wat wel en niet helpt, waar wij nee zeggen, eventueel de meting,
 * de vragen en de afsluiter.
 *
 * Die romp met de hand overtypen ging twee keer mis op precies dezelfde manier: één keer
 * een verschoven className, en één keer namen het kruimelpad en de gestructureerde data de
 * eerste regel van de kop over. Dat laatste leverde "Home / Huidproblemen / Wit en hard?"
 * op, want die eerste kopregel is bij de meeste van deze pagina's een vraag en geen naam.
 * Beide fouten zijn onzichtbaar tot iemand ernaar kijkt.
 *
 * Wat hier staat is dus geen gemak maar een vangnet: de romp ligt vast, en wat per pagina
 * verschilt moet je opgeven.
 *
 * WAT DIT SCRIPT NIET DOET.
 *
 * De inhoud. Die hoort in `src/data/<slug>.ts` en is per huidprobleem echt anders: de vier
 * beelden, de zelfcheck, wat wij wel en niet doen, de vragen. Een pagina die alleen uit
 * deze romp bestaat is een lege pagina, en die zetten we niet neer.
 *
 * En het registreren: `src/data/pillars.ts`, `src/app/sitemap.ts` en de bestemming in
 * `src/data/symptoomzoeker.ts` doe je er met de hand bij. Dat zijn drie regels, en ze
 * vragen elk om een keuze (welke groep, welke kenmerken, welke eerste vraag) die een
 * script niet voor je kan maken.
 *
 * GEBRUIK.
 *
 *   import { maakPillarPagina } from "./nieuwe-pillarpagina.mjs";
 *   maakPillarPagina({ slug: "...", naam: "...", ... });
 *
 * Draai daarna `npx prettier --write` op het resultaat, want dit script let op inhoud en
 * niet op regelafbreking.
 */
import { mkdirSync, writeFileSync, renameSync } from "node:fs";

export function maakPillarPagina(c) {
  const map = `src/app/huidproblemen/${c.slug}`;
  mkdirSync(map, { recursive: true });
  const pad = `${map}/page.tsx`;

  const metingBlok = c.meting
    ? `
      <NulmetingAssen
        kop=${JSON.stringify(c.meting.kop)}
        alineas={[
${c.meting.alineas.map((a) => `          ${JSON.stringify(a)},`).join("\n")}
        ]}
        assen={[
${c.meting.assen
  .map(([a, b]) => `          [${JSON.stringify(a)}, ${JSON.stringify(b)}],`)
  .join("\n")}
        ]}
      />
`
    : "";

  const s = `import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PillarNav from "@/components/pillar/PillarNav";
import {
${c.meting ? "  NulmetingAssen,\n" : ""}  PillarCta,
  PillarFaq,
  SectieKop,
  WelNiet,
  WijZeggenNee,
} from "@/components/pillar/PillarSecties";
import SoortKiezer, { type SoortOptie } from "@/components/pillar/SoortKiezer";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import {
${c.imports.map((i) => `  ${i},`).join("\n")}
} from "@/data/${c.dataModule}";
import { publicCopy } from "@/lib/copy-flags";
import { NOG_IN_AANBOUW } from "@/lib/pagina-af";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * ${c.naam} — ${c.doc}
 *
 * De achtergrond bij de inhoud staat in \`src/data/${c.dataModule}.ts\`.
 *
 * COPY: concept in de Diba-stem. Medische beweringen zijn gemarkeerd voor Rojda.
 */

export const metadata: Metadata = {
  title: ${JSON.stringify(c.titel)},
  description: ${JSON.stringify(c.description)},
  ...NOG_IN_AANBOUW,
};

const PAD = "/huidproblemen/${c.slug}";

const ANKERS = [
  { id: "${c.stappen.id}", label: ${JSON.stringify(c.stappen.label)} },
  { id: "welke", label: ${JSON.stringify(c.kiezer.anker)} },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "nee", label: "Waar wij nee zeggen" },
${c.meting ? '  { id: "meten", label: "Hoe we meten" },\n' : ""}  { id: "vragen", label: "Vragen" },
] as const;

const SOORTEN: readonly SoortOptie[] = ${c.soortenConst}.map((o) => ({
  id: o.id,
  naam: o.naam,
  klanttaal: o.klanttaal,
  vakterm: o.vakterm,
  velden: [
    ["Waar je het zelf aan herkent", o.zelfcheck],
    ["Wat het is", o.watHetIs],
    ["Wat wij doen", o.watWijDoen],
  ] as const,
  uitgelicht: {
    label: o.binnenBereik
      ? ${JSON.stringify(c.kiezer.labelWel)}
      : ${JSON.stringify(c.kiezer.labelNiet)},
    tekst: o.binnenBereik
      ? ${JSON.stringify(c.kiezer.tekstWel)}
      : ${JSON.stringify(c.kiezer.tekstNiet)},
  },
}));

export default function Pagina() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: \`\${DIBA_SITE_URL}/huidproblemen\` },
          { name: ${JSON.stringify(c.naam)}, url: \`\${DIBA_SITE_URL}\${PAD}\` },
        ])}
      />

      <section className="mx-auto px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="py-14 lg:py-20">
            <nav
              aria-label="Kruimelpad"
              className="diba-label flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-[var(--g-700)]">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link href="/huidproblemen" className="hover:text-[var(--g-700)]">
                Huidproblemen
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--t-muted)]">${c.naam}</span>
            </nav>

            <h1 className="diba-display-l mt-6">
              ${c.h1a}
              <br />
              <span className="diba-accent">${c.h1b}</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              ${c.intro1}
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              ${c.intro2}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="#${c.stappen.id}">${c.stappen.knop}</Button>
              <Button
                href={DIBA_WHATSAPP_URL}
                variant="ghost"
                target="_blank"
                rel="noopener noreferrer"
              >
                Liever eerst een vraag stellen
              </Button>
            </div>
          </div>

          <div className="relative min-h-[300px] overflow-hidden rounded-[var(--r-md)] bg-[var(--g-200)] lg:min-h-[460px]">
            <Image
              src="${c.foto}"
              alt="${c.fotoAlt}"
              fill
              priority
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      <ProofBar items={DIBA_PROOF_STRIP_ITEMS} />

      <PillarNav ankers={ANKERS} />

      <section
        id="${c.stappen.id}"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label=${JSON.stringify(c.stappen.label)}
            raster="gelijk"
            kop=${JSON.stringify(c.stappen.kop)}
            accent=${JSON.stringify(c.stappen.accent)}
            intro=${JSON.stringify(c.stappen.intro)}
          />

          <ol className="mt-12 grid gap-5 lg:grid-cols-3">
            {${c.stappen.const}.map((stap, i) => (
              <li
                key={stap.kop}
                className="flex flex-col rounded-[var(--r-md)] bg-white p-7 sm:p-8"
              >
                <span className="diba-label text-[var(--g-700)]">
                  Stap {i + 1}
                </span>
                <h3 className="diba-card-title mt-3">{stap.kop}</h3>
                <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                  {publicCopy(stap.tekst)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="welke"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label=${JSON.stringify(c.kiezer.label)}
            kop=${JSON.stringify(c.kiezer.kop)}
            accent=${JSON.stringify(c.kiezer.accent)}
            intro=${JSON.stringify(c.kiezer.intro)}
          />
          <SoortKiezer
            opties={SOORTEN}
            ctaHrefPatroon="/intake?topic=${c.slug}&beeld={id}"
            ctaLabel="Laat dit bekijken"
            hint="Twijfel je tussen twee? Dan kijken we samen."
          />

          {/* Het doorverwijsblok hoort hier en niet onderaan: wie na de beelden doorheeft
              dat hij op de verkeerde pagina is, moet weg kunnen zonder eerst de rest te
              lezen die dan niet over hem gaat. */}
          <div className="mt-10 rounded-[var(--r-md)] bg-[var(--g-700)] p-7 text-[var(--on-dark)] sm:p-9">
            <Label opDonker>${c.verwijs.label}</Label>
            <p className="diba-card-title-lg mt-4 max-w-[36ch]">
              ${c.verwijs.kop}
            </p>
            <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              ${c.verwijs.tekst}
            </p>
            <div className="mt-7">
              <Button href="${c.verwijs.href}" variant="primair-op-donker">
                ${c.verwijs.knop}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <WelNiet
        wel={${c.welNietConst}.wel}
        niet={${c.welNietConst}.niet}
        intro=${JSON.stringify(c.welNietIntro)}
      />

      <WijZeggenNee
        kop=${JSON.stringify(c.nee.kop)}
        accent=${JSON.stringify(c.nee.accent)}
        intro=${JSON.stringify(c.nee.intro)}
        punten={${c.neeConst}}
      />
${metingBlok}
      <PillarFaq items={${c.faqConst}} />

      <PillarCta
        kop=${JSON.stringify(c.cta.kop)}
        accent=${JSON.stringify(c.cta.accent)}
        tekst=${JSON.stringify(c.cta.tekst)}
        topic="${c.slug}"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
`;

  writeFileSync(pad + ".tmp", s);
  renameSync(pad + ".tmp", pad);
  return pad;
}
