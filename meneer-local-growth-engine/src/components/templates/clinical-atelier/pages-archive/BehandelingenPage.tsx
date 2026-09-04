import { useState } from 'react'
import type { Page } from "./App";
import BeforeAfterSlider from "./BeforeAfterSlider";

const CATEGORIES = ['Alle', 'Gezicht', 'Huid', 'Laser', 'Lichaam']

const TREATMENTS = [
  {
    cat: 'Huid',
    name: 'Dermapen Microneedling',
    desc: 'Stimuleert de natuurlijke huidvernieuwing via gecontroleerde micronaalden. Effectief bij littekens, grote poriën en een doffe huid.',
    from: '€149',
    duration: '60 min',
    img: 'https://images.unsplash.com/photo-1581182800629-7d90925ad072?w=600&h=400&fit=crop&auto=format&q=80',
  },
  {
    cat: 'Gezicht',
    name: 'Hydrafacial',
    desc: 'Dieptereiniging, peeling en hydratatie in één behandeling. Geschikt voor alle huidtypen, direct stralend resultaat.',
    from: '€129',
    duration: '45 min',
    img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop&auto=format&q=80',
  },
  {
    cat: 'Laser',
    name: 'Laser Huidverbetering',
    desc: 'Precisie laserbehandeling voor pigmentatieproblemen, couperose, littekens en een ongelijkmatige huidtoon.',
    from: '€159',
    duration: '45 min',
    img: 'https://images.unsplash.com/photo-1765371512707-9e0e96fd9e5b?w=600&h=400&fit=crop&auto=format&q=80',
  },
  {
    cat: 'Huid',
    name: 'Chemical Peel',
    desc: 'Chemische exfoliatie voor een verbeterde huidstructuur, minder pigmentatie en een egaler, gladder resultaat.',
    from: '€119',
    duration: '50 min',
    img: 'https://images.unsplash.com/photo-1772714601004-23b94ae3913d?w=600&h=400&fit=crop&auto=format&q=80',
  },
  {
    cat: 'Gezicht',
    name: 'Mesotherapie',
    desc: 'Injectie van vitaminen, mineralen en hyaluronzuur direct in de huid voor intense hydratatie en een zichtbare glow.',
    from: '€179',
    duration: '45 min',
    img: 'https://images.unsplash.com/photo-1765371513276-a74f1ecbcf7d?w=600&h=400&fit=crop&auto=format&q=80',
  },
  {
    cat: 'Lichaam',
    name: 'PRP Bloedplaatjestherapie',
    desc: 'Gebruik van eigen bloedplaatjes voor intensief huidherstel en stimulering van haargroei. Volledig natuurlijk en bewezen effectief.',
    from: '€249',
    duration: '60 min',
    img: 'https://images.unsplash.com/photo-1774853094610-89be6f1a7690?w=600&h=400&fit=crop&auto=format&q=80',
  },
  {
    cat: 'Huid',
    name: 'Huidanalyse',
    desc: 'Uitgebreide analyse van uw huidtype, aandoeningen en behoeften. De basis voor een persoonlijk en effectief behandelplan.',
    from: '€49',
    duration: '30 min',
    img: 'https://images.unsplash.com/photo-1674932668403-33398b81c92f?w=600&h=400&fit=crop&auto=format&q=80',
  },
  {
    cat: 'Lichaam',
    name: 'LED-lichttherapie',
    desc: 'Niet-invasieve lichtbehandeling die acné vermindert, collageen stimuleert en huidherstel versnelt. Geen herstelperiode nodig.',
    from: '€89',
    duration: '40 min',
    img: 'https://images.unsplash.com/photo-1551184451-76b762941ad6?w=600&h=400&fit=crop&auto=format&q=80',
  },
]

const FAQS = [
  { q: 'Is een huidanalyse verplicht voor een behandeling?', a: 'Nee, maar wij raden het ten zeerste aan. Een huidanalyse geeft inzicht in uw huidtype en aandoeningen, zodat we de meest effectieve behandeling kunnen bepalen.' },
  { q: 'Is Dermapen microneedling pijnlijk?', a: "De meeste patiënten ervaren Dermapen als licht ongemakkelijk. Wij brengen vooraf een verdovingscrème aan, waardoor de behandeling goed te verdragen is." },
  { q: 'Hoe snel zie ik resultaat na een chemical peel?', a: 'Na een chemical peel is de huid 3–5 dagen in herstel. Daarna is een verbeterde huidtextuur en uitstraling zichtbaar. Uw specialist bespreekt de verwachtingen vooraf.' },
  { q: 'Zijn alle huidspecialisten gecertificeerd?', a: 'Ja. Al onze huidtherapeuten en artsen zijn BIG-geregistreerd of gecertificeerd en regelmatig bijgeschoold via erkende medische instanties.' },
  { q: "Hoeveel behandelingen heb ik nodig?", a: 'Dit verschilt per behandeling en huidconditie. Bij Dermapen zijn gemiddeld 3–6 sessies aan te raden. Uw huidspecialist stelt een persoonlijk behandelplan op.' },
]

const ArrowRight = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
    <path d="M2 6.5h9M8 3l3.5 3.5L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function BehandelingenPage({ setPage }: { setPage: (p: Page) => void }) {
  const [activeCategory, setActiveCategory] = useState('Alle')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const filtered = activeCategory === 'Alle' ? TREATMENTS : TREATMENTS.filter(t => t.cat === activeCategory)

  return (
    <>
      {/* Hero */}
      <section className="max-w-[1540px] mx-auto px-6 lg:px-12 pt-14 pb-12">
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-text mb-5">Behandelingen</p>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-end">
          <h1 className="text-soft-black leading-[0.93]" style={{ fontSize: 'clamp(40px, 5vw, 68px)' }}>
            <strong className="font-extrabold block">De juiste behandeling</strong>
            <span className="font-light block">voor uw huid.</span>
          </h1>
          <p className="text-[15px] text-muted-text leading-[1.7]">
            Ontdek welke huidbehandeling past bij uw huidtype en wensen. Een persoonlijke huidanalyse van een gecertificeerd huidspecialist is altijd de eerste stap.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1540px] mx-auto px-6 lg:px-12">
        <div className="h-px bg-border-subtle" />
      </div>

      {/* Category filter */}
      <section className="max-w-[1540px] mx-auto px-6 lg:px-12 py-8">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-[13px] font-semibold px-4 py-2 rounded-full border transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-primary text-warm-white border-primary'
                  : 'bg-warm-white text-charcoal border-border-subtle hover:border-primary/40 hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Treatment grid */}
      <section className="max-w-[1540px] mx-auto px-6 lg:px-12 pb-20 lg:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((t) => (
            <div
              key={t.name}
              className="group rounded-[18px] overflow-hidden border border-border-subtle bg-warm-white hover:border-primary/30 hover:shadow-sm transition-all duration-300 cursor-pointer"
            >
              <div className="overflow-hidden h-[220px] bg-light-grey">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-semibold text-muted-text border border-border-subtle px-2.5 py-1 rounded-full">
                    {t.cat}
                  </span>
                  <span className="text-[11px] font-semibold text-primary">
                    {t.duration}
                  </span>
                </div>
                <h3 className="text-[17px] font-bold text-soft-black mb-2 leading-tight">{t.name}</h3>
                <p className="text-[13.5px] text-muted-text leading-[1.6] mb-5">{t.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-charcoal">Vanaf {t.from}</span>
                  <button className="flex items-center gap-1.5 text-primary text-[13px] font-semibold group-hover:gap-2 transition-all">
                    Meer info
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                      <ArrowRight />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-off-white py-20 lg:py-24">
        <div className="max-w-[1540px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-12 lg:gap-20">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-text mb-5">FAQ</p>
              <h2 className="text-[32px] lg:text-[42px] font-extrabold leading-[0.94] text-soft-black mb-5">
                Veelgestelde<br />
                <span className="font-light">vragen</span>
              </h2>
              <p className="text-[14px] text-muted-text leading-[1.65]">
                Staat uw vraag er niet bij? Wij helpen u graag persoonlijk verder.
              </p>
              <button className="mt-6 flex items-center gap-2 text-primary text-[13px] font-semibold group">
                Neem contact op
                <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                  <ArrowRight />
                </span>
              </button>
            </div>
            <div className="flex flex-col divide-y divide-border-subtle">
              {FAQS.map((faq, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between py-5 text-left gap-4"
                  >
                    <span className="text-[15px] font-semibold text-charcoal">{faq.q}</span>
                    <span
                      className={`text-primary transition-transform duration-200 shrink-0 ${openFaq === i ? 'rotate-45' : ''}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </span>
                  </button>
                  {openFaq === i && (
                    <p className="text-[14px] text-muted-text leading-[1.7] pb-5 max-w-[560px]">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1540px] mx-auto px-6 lg:px-12 py-20 lg:py-24">
        <div
          className="rounded-[22px] px-8 py-12 lg:px-14 lg:py-14 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center"
          style={{ background: 'linear-gradient(135deg, #ECEBE8 0%, #E9EEF0 100%)' }}
        >
          <div>
            <h2 className="text-[28px] lg:text-[38px] font-extrabold text-soft-black leading-tight mb-3">
              Klaar voor een vrijblijvend huidconsult?
            </h2>
            <p className="text-[14px] text-muted-text leading-[1.65] max-w-[480px]">
              Plan een afspraak met één van onze huidspecialisten. Wij helpen u de meest geschikte behandeling voor uw huid te kiezen.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="flex items-center justify-center gap-2 bg-primary text-warm-white text-[14px] font-semibold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors group"
            >
              Afspraak maken
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                <ArrowRight />
              </span>
            </button>
            <button
              onClick={() => setPage('informatie')}
              className="flex items-center justify-center gap-2 border border-border-subtle text-charcoal text-[14px] font-semibold px-6 py-3 rounded-full hover:border-primary hover:text-primary transition-colors"
            >
              Onze locaties
            </button>
          </div>
        </div>
      </section>

      {/* ── VOOR / NA RESULTATEN ── */}
      <ResultatenSection />
    </>
  )
}

const RESULTATEN = [
  {
    tag: 'Dermapen',
    label: 'Littekens & textuur',
    weeks: 'Na 4 sessies · 8 weken',
    before: 'https://images.unsplash.com/photo-1683408640631-2c99fff964d7?w=800&h=600&fit=crop&crop=faces&auto=format&q=85',
    after: 'https://images.unsplash.com/photo-1728727217834-b190862837a3?w=800&h=600&fit=crop&crop=faces&auto=format&q=85',
  },
  {
    tag: 'Chemical Peel',
    label: 'Pigmentatie & egale toon',
    weeks: 'Na 3 sessies · 6 weken',
    before: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&h=600&fit=crop&crop=faces&auto=format&q=85',
    after: 'https://images.unsplash.com/photo-1643684391140-c5056cfd3436?w=800&h=600&fit=crop&crop=faces&auto=format&q=85',
  },
  {
    tag: 'Hydrafacial',
    label: 'Hydratatie & glow',
    weeks: 'Directe resultaat · 1 sessie',
    before: 'https://images.unsplash.com/photo-1761718209708-9ab9ba1c7252?w=800&h=600&fit=crop&crop=faces&auto=format&q=85',
    after: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop&crop=faces&auto=format&q=85',
  },
  {
    tag: 'PRP',
    label: 'Huidversteviging & volume',
    weeks: 'Na 3 sessies · 12 weken',
    before: 'https://images.unsplash.com/photo-1761718210089-ba3bb5ccb54f?w=800&h=600&fit=crop&crop=faces&auto=format&q=85',
    after: 'https://images.unsplash.com/photo-1782159981479-0fafb56d3cd6?w=800&h=600&fit=crop&crop=faces&auto=format&q=85',
  },
]

const FILTER_TAGS = ['Alle', 'Dermapen', 'Chemical Peel', 'Hydrafacial', 'PRP']

function ResultatenSection() {
  const [activeFilter, setActiveFilter] = useState('Alle')
  const filtered = activeFilter === 'Alle' ? RESULTATEN : RESULTATEN.filter(r => r.tag === activeFilter)

  return (
    <section className="py-16 lg:py-24" style={{ background: '#F4F4F2' }}>
      <div className="max-w-[1540px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-text mb-4">Bewezen effect</p>
            <h2 className="text-soft-black font-extrabold leading-[0.95]" style={{ fontSize: 'clamp(28px, 3.2vw, 44px)', letterSpacing: '-0.02em' }}>
              Zie het verschil.<br />
              <span className="font-light">Sleep de lijn.</span>
            </h2>
          </div>
          <div className="flex gap-2 flex-wrap">
            {FILTER_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                className={`px-4 h-[34px] rounded-full text-[11.5px] font-semibold transition-all duration-200 ${
                  tag === activeFilter
                    ? 'bg-primary text-white'
                    : 'bg-warm-white border border-border-subtle text-muted-text hover:border-charcoal/30 hover:text-charcoal'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {filtered.map(r => (
            <BeforeAfterSlider
              key={r.label}
              before={r.before}
              after={r.after}
              label={r.label}
              treatment={r.tag}
              weeks={r.weeks}
            />
          ))}
        </div>

        <p className="text-center text-[11.5px] text-muted-text mt-6">
          Resultaten zijn individueel. Sleep de lijn om voor en na te vergelijken.
        </p>
      </div>
    </section>
  )
}
