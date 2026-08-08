import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DienstFAQ } from "@/components/diensten/DienstFAQ";
import { Reveal } from "@/components/effects/Reveal";
import { MarketingFunFactsRow } from "@/components/shared/MarketingFunFactCard";
import { JsonLdScript, breadcrumbJsonLd, faqPageJsonLd } from "@/components/seo/JsonLd";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getFunFactsForPage } from "@/data/marketing-fun-facts";
import { siteCtas } from "@/lib/cta";
import { buildPageMetadata } from "@/lib/seo/site-metadata";
import { HUB_PAGE_SEO } from "@/lib/seo/hub-pages";

const seo = HUB_PAGE_SEO.faq;

export const metadata = buildPageMetadata({
  title: seo.title,
  titleAbsolute: true,
  description: seo.description,
  path: "/faq",
  ogAccent: seo.ogAccent,
});

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  id: string;
  label: string;
  title: string;
  items: FaqItem[];
}

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "samenwerken",
    label: "Samenwerken",
    title: "Samenwerken met Meneer",
    items: [
      {
        question: "Krijg ik een heel team of gewoon jou?",
        answer:
          "Je krijgt Meneer Marketing. Eén aanspreekpunt dat strategie, design, code en marketing combineert. Wat jij en ik bespreken, bouw ik. Jij merkt het verschil in snelheid.",
      },
      {
        question: "Werken jullie met vaste pakketten?",
        answer:
          "Nee. Goud, zilver en brons zijn leuk voor de Olympische Spelen, niet voor jouw marketing. Elk bedrijf heeft andere marges, klanten en systemen. Je krijgt een voorstel op basis van jouw situatie, met uitleg waarom die volgorde de slimste is.",
      },
      {
        question: "Zit ik vast aan een langlopend contract?",
        answer:
          "Nee. Alles wat ik bouw is van jou: de code, de accounts, de data. Klanten blijven omdat het werkt, niet omdat er een handtekening knelt. Voor doorlopend werk spreek ik gewoon een nette opzegtermijn af.",
      },
      {
        question: "Remote of op locatie?",
        answer:
          "Voornamelijk remote, dat werkt snel en scherp. Voor een strategiesessie of kickoff kan op locatie prima. In overleg, zonder gedoe.",
      },
    ],
  },
  {
    id: "websites",
    label: "Bouwen",
    title: "Websites en webshops",
    items: [
      {
        question: "Waarom een website from scratch en geen template?",
        answer:
          "Een template is een huis dat duizend keer eerder verkocht is, inclusief de rommel op zolder. From scratch betekent: alleen code die jouw site echt nodig heeft. Daardoor laadt hij sneller, scoort hij beter in Google en doet hij precies wat jouw klant verwacht.",
      },
      {
        question: "Ik heb een webshop. Kun je met Shopify uit de voeten?",
        answer:
          "Shopify is de thuisbasis. Van custom themes tot complete B2B-portalen waar zakelijke klanten zelf bestellen tegen eigen prijzen. Dat soort systemen draaien dagelijks bij klanten. Dus ja, ruimschoots.",
      },
      {
        question: "Kan ik straks zelf teksten en foto's aanpassen?",
        answer:
          "Ja. Je krijgt een site die je zelf kunt bijhouden, met korte uitleg hoe. Heb je er geen zin in of geen tijd voor? Dan doe ik het beheer. Ook prima.",
      },
      {
        question: "Mijn huidige site is traag. Moet alles opnieuw?",
        answer:
          "Niet per definitie. Eerst meten waar de vertraging zit. Soms is het een kwestie van opruimen, soms is opnieuw bouwen goedkoper dan blijven pleisteren. Je krijgt eerlijk advies, ook als dat advies is: laat lekker staan.",
      },
    ],
  },
  {
    id: "marketing",
    label: "Groeien",
    title: "Marketing en vindbaarheid",
    items: [
      {
        question: "Hoe lang duurt het voor SEO iets oplevert?",
        answer:
          "Maanden, geen dagen. Wie je topposities binnen twee weken belooft, verkoopt vooral facturen. Maar als het eenmaal loopt, heb je een kanaal dat blijft werken zonder dat je per klik betaalt. Eerst organisch verkeer, daarna pas advertentiebudget. Die volgorde loont.",
      },
      {
        question: "Google Ads of Meta Ads: wat past bij mij?",
        answer:
          "Hangt af van waar jouw klant zit. Google Ads vangt mensen die al zoeken naar wat jij verkoopt. Meta Ads creëert vraag bij mensen die jou nog niet kennen. Vaak is het antwoord een slimme combinatie, met budget op wat meetbaar rendeert.",
      },
      {
        question: "Wat is vindbaarheid in AI-antwoorden?",
        answer:
          "Steeds meer mensen vragen ChatGPT of Gemini om advies in plaats van Google. Ik zorg dat jouw bedrijf in die antwoorden opduikt, technisch én inhoudelijk. Nieuw speelveld, nog weinig concurrentie. Wie nu instapt, heeft straks de voorsprong.",
      },
      {
        question: "Garandeer je resultaat?",
        answer:
          "Ik garandeer eerlijk werk, meetbare rapportage en dat ik stop met dingen die niet werken. Posities of omzet garanderen kan niemand, wat verkopers ook beweren. Wel kun je sturen op data in plaats van op hoop. Dat is precies wat ik doe.",
      },
    ],
  },
  {
    id: "praktisch",
    label: "Praktisch",
    title: "Centen en planning",
    items: [
      {
        question: "Wat kost het?",
        answer:
          "Het eerlijke antwoord: dat hangt af van wat er moet gebeuren. Een landingspagina is geen webshop en een campagne is geen merkstrategie. Na een korte intake krijg je een voorstel met vaste afspraken, geen verrassingen achteraf. Wil je eerst richting? Vul de intake in (twee minuten).",
      },
      {
        question: "Hoe snel kan ik live?",
        answer:
          "Een strakke landingspagina kan binnen enkele weken. Een custom shop of platform vraagt meer tijd. In het voorstel staan mijlpalen die kloppen. Liever realistisch beloven dan achteraf sorry zeggen.",
      },
      {
        question: "Hoe weet ik of het werkt?",
        answer:
          "Omdat je het ziet. Meetbare doelen vooraf, nette tracking en rapportage in taal die je begrijpt. De cijfers waar jij beslissingen op neemt, niet een rapport van veertig pagina's met grafieken die niets zeggen.",
      },
    ],
  },
];

const ALL_ITEMS: FaqItem[] = FAQ_CATEGORIES.flatMap((c) => c.items);

export default function FaqPage() {
  const faqLd = faqPageJsonLd(ALL_ITEMS);

  return (
    <>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ])}
      />
      <JsonLdScript data={faqLd} />
      <SiteHeader />
      <main id="main" className="flex-1">
        <header className="relative overflow-hidden border-b border-mm-border bg-mm-sky-subtle/50">
          <div
            className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-mm-sky/15 blur-3xl"
            aria-hidden
          />
          <div className="relative mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <Reveal>
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-mm-sky-deep">
                    FAQ
                  </p>
                  <h1 className="mt-3 text-balance text-4xl font-extrabold tracking-tight text-mm-text sm:text-5xl">
                    Vragen die iedereen stelt.
                    <br />
                    Antwoorden zonder omwegen.
                  </h1>
                  <p className="mt-5 max-w-xl text-lg leading-relaxed text-mm-muted">
                    Eerlijk, kort en in gewone taal. Staat jouw vraag er niet
                    tussen?{" "}
                    <Link
                      href="/contact"
                      className="font-semibold text-mm-sky-deep underline-offset-2 hover:underline"
                    >
                      Stel hem gewoon
                    </Link>
                    . Meneer leest alles zelf.
                  </p>
                </div>
                <div className="hidden shrink-0 sm:block">
                  <InteractiveLogo className="h-24 w-24" />
                </div>
              </div>
            </Reveal>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="space-y-14">
            {FAQ_CATEGORIES.map((category, index) => (
              <section key={category.id} aria-labelledby={`faq-${category.id}`}>
                <Reveal delay={index * 0.04}>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-mm-accent">
                    {category.label}
                  </p>
                  <h2
                    id={`faq-${category.id}`}
                    className="mt-2 text-2xl font-extrabold tracking-tight text-mm-text"
                  >
                    {category.title}
                  </h2>
                </Reveal>
                <div className="mt-6">
                  <DienstFAQ items={category.items} idPrefix={category.id} />
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16">
            <MarketingFunFactsRow
              facts={getFunFactsForPage("/faq")}
              variant="inline"
            />
          </div>

          <Reveal delay={0.06}>
            <div className="mt-10 flex flex-col items-start gap-5 rounded-3xl border border-mm-border bg-mm-accent-subtle/60 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div className="flex items-center gap-4">
                <InteractiveLogo className="h-12 w-12 shrink-0" />
                <div>
                  <p className="text-lg font-extrabold text-mm-text">
                    Nog steeds een vraag over?
                  </p>
                  <p className="mt-1 text-sm text-mm-muted">
                    Typ alsof je me app't. Ik reageer zelf, persoonlijk.
                  </p>
                </div>
              </div>
              <Link
                href={siteCtas.contact.href}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-mm-accent px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-mm-accent/25 transition hover:bg-mm-accent-hover"
              >
                {siteCtas.contact.label}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
