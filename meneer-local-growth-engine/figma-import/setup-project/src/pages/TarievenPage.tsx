import { useState } from 'react'
import type { Page } from '../App'

const CATEGORIES = [
  {
    name: 'Microneedling',
    color: '#1A3A5C',
    treatments: [
      { name: 'Dermapen Consult', duration: '30 min', price: 'Gratis', note: 'Vrijblijvend' },
      { name: 'Dermapen — enkel gezicht', duration: '60 min', price: '€ 149', note: 'Incl. serum' },
      { name: 'Dermapen — gezicht + hals', duration: '75 min', price: '€ 189', note: 'Incl. serum' },
      { name: 'Dermapen — gezicht + hals + décolleté', duration: '90 min', price: '€ 229', note: 'Incl. serum' },
      { name: 'Kuurprijs 3 sessies', duration: '3 × 60 min', price: '€ 399', note: '€ 133 p/s' },
    ],
  },
  {
    name: 'Hydrafacial',
    color: '#2E5B8A',
    treatments: [
      { name: 'Hydrafacial Signature', duration: '45 min', price: '€ 129', note: 'Alle huidtypen' },
      { name: 'Hydrafacial Deluxe', duration: '60 min', price: '€ 169', note: '+ Booster' },
      { name: 'Hydrafacial Platinum', duration: '75 min', price: '€ 209', note: '+ LED-therapie' },
      { name: 'Kuurprijs 3 sessies', duration: '3 × 45 min', price: '€ 339', note: '€ 113 p/s' },
    ],
  },
  {
    name: 'Laser',
    color: '#1A3A5C',
    treatments: [
      { name: 'Laserbehandeling consult', duration: '30 min', price: 'Gratis', note: 'Vrijblijvend' },
      { name: 'Laser — klein gebied', duration: '30 min', price: '€ 159', note: 'Bijv. pigmentvlek' },
      { name: 'Laser — gezicht', duration: '45 min', price: '€ 229', note: 'Incl. koeling' },
      { name: 'Laser — gezicht + hals', duration: '60 min', price: '€ 289', note: 'Incl. koeling' },
      { name: 'Kuurprijs 4 sessies', duration: '4 × 45 min', price: '€ 799', note: '€ 200 p/s' },
    ],
  },
  {
    name: 'Chemical Peel',
    color: '#2E5B8A',
    treatments: [
      { name: 'Superficiële peeling', duration: '30 min', price: '€ 89', note: 'Lichte exfoliatie' },
      { name: 'Medium peeling', duration: '45 min', price: '€ 119', note: 'Diepere reiniging' },
      { name: 'Diepe peeling', duration: '60 min', price: '€ 159', note: 'Medisch' },
      { name: 'Kuurprijs 4 sessies', duration: '4 × 45 min', price: '€ 419', note: '€ 105 p/s' },
    ],
  },
  {
    name: 'Mesotherapie',
    color: '#1A3A5C',
    treatments: [
      { name: 'Mesotherapie consult', duration: '30 min', price: 'Gratis', note: 'Vrijblijvend' },
      { name: 'Mesotherapie — gezicht', duration: '60 min', price: '€ 169', note: 'Hydratatie' },
      { name: 'Mesotherapie — hoofdhuid', duration: '60 min', price: '€ 179', note: 'Haargroei' },
      { name: 'Kuurprijs 3 sessies', duration: '3 × 60 min', price: '€ 449', note: '€ 150 p/s' },
    ],
  },
  {
    name: 'PRP Therapie',
    color: '#2E5B8A',
    treatments: [
      { name: 'PRP consult + bloedafname', duration: '30 min', price: '€ 49', note: 'Verrekend bij behandeling' },
      { name: 'PRP — gezicht', duration: '75 min', price: '€ 249', note: 'Eigen bloedplasma' },
      { name: 'PRP — gezicht + hals', duration: '90 min', price: '€ 319', note: 'Eigen bloedplasma' },
      { name: 'PRP — hoofdhuid (haargroei)', duration: '75 min', price: '€ 279', note: 'Eigen bloedplasma' },
      { name: 'Kuurprijs 3 sessies', duration: '3 × 75 min', price: '€ 649', note: '€ 216 p/s' },
    ],
  },
]

const PACKAGES = [
  {
    name: 'Huidstarter',
    price: '€ 299',
    period: 'eenmalig',
    highlight: false,
    desc: 'Ideaal voor een eerste kennismaking met professionele huidzorg.',
    items: ['1× Hydrafacial Signature', '1× Huidanalyse & advies', 'Persoonlijk huidprofiel', 'Nazorgadvies & producten'],
  },
  {
    name: 'Huidtransformatie',
    price: '€ 749',
    period: '3 maanden',
    highlight: true,
    desc: 'Ons meest populaire pakket voor zichtbaar en blijvend resultaat.',
    items: ['3× Dermapen Microneedling', '2× Chemical Peel', '1× Hydrafacial Deluxe', 'Persoonlijk behandelplan', 'Maandelijkse voortgangscheck', 'Prioriteit bij inplannen'],
  },
  {
    name: 'Huidperfectie',
    price: '€ 1.399',
    period: '6 maanden',
    highlight: false,
    desc: 'Het complete traject voor maximale huidverbetering op de lange termijn.',
    items: ['4× Dermapen Microneedling', '3× PRP Bloedplaatjestherapie', '2× Laser behandeling', '2× Hydrafacial Platinum', 'Volledig persoonlijk plan', 'Maandelijkse evaluatie', 'Directe bereikbaarheid specialist'],
  },
]

const ArrowRight = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function TarievenPage({ setPage }: { setPage: (p: Page) => void }) {
  const [activeCategory, setActiveCategory] = useState(0)

  return (
    <>
      {/* Page header */}
      <section className="max-w-[1540px] mx-auto px-6 lg:px-10 pt-10 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-end">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-text mb-5">Tarieven</p>
            <h1 className="text-soft-black font-extrabold leading-[0.95]" style={{ fontSize: 'clamp(38px, 5vw, 68px)', letterSpacing: '-0.025em' }}>
              Transparante<br />
              <span className="font-light">prijzen.</span>
            </h1>
          </div>
          <div className="pb-1">
            <p className="text-[14px] text-muted-text leading-[1.75] mb-5">
              Geen verborgen kosten. Alle tarieven zijn inclusief consult en nazorg. Bij elke behandeling ontvangt u een vrijblijvende prijsopgave op maat.
            </p>
            <div className="flex gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-[12px] text-muted-text">
                <div className="w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#2E5B8A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                Vrijblijvend consult
              </div>
              <div className="flex items-center gap-2 text-[12px] text-muted-text">
                <div className="w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#2E5B8A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                Achteraf betalen mogelijk
              </div>
              <div className="flex items-center gap-2 text-[12px] text-muted-text">
                <div className="w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#2E5B8A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                Kuurkorting tot 15%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Treatment price tables */}
      <section className="max-w-[1540px] mx-auto px-6 lg:px-10 pb-20">

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(i)}
              className={`shrink-0 px-5 h-[38px] rounded-full text-[12px] font-semibold transition-all duration-200 ${
                i === activeCategory
                  ? 'bg-primary text-white'
                  : 'bg-warm-white border border-border-subtle text-muted-text hover:text-charcoal hover:border-charcoal/30'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Active category table */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
          {/* Price table */}
          <div className="rounded-[20px] overflow-hidden border border-border-subtle">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_100px_90px] px-6 py-3 border-b border-border-subtle" style={{ background: '#F4F4F2' }}>
              <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-muted-text">Behandeling</span>
              <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-muted-text text-center">Duur</span>
              <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-muted-text text-right">Prijs</span>
            </div>
            {CATEGORIES[activeCategory].treatments.map((t, i) => (
              <div
                key={t.name}
                className={`grid grid-cols-[1fr_100px_90px] px-6 py-4 items-center border-b border-border-subtle last:border-0 hover:bg-off-white/60 transition-colors ${
                  t.price === 'Gratis' ? 'bg-primary/[0.02]' : ''
                }`}
              >
                <div>
                  <p className="text-[14px] font-semibold text-soft-black leading-tight">{t.name}</p>
                  <p className="text-[11px] text-muted-text mt-0.5">{t.note}</p>
                </div>
                <p className="text-[12px] text-muted-text text-center">{t.duration}</p>
                <p className={`text-right font-extrabold ${t.price === 'Gratis' ? 'text-primary text-[13px]' : 'text-soft-black text-[16px]'}`}>
                  {t.price}
                </p>
              </div>
            ))}
          </div>

          {/* Sidebar card */}
          <div className="flex flex-col gap-4">
            <div className="rounded-[20px] p-7 flex flex-col gap-5" style={{ background: CATEGORIES[activeCategory].color }}>
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1.5v11M1.5 7h11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-semibold tracking-[0.14em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {CATEGORIES[activeCategory].name}
                </p>
                <h3 className="text-warm-white font-extrabold leading-[1.1] text-[20px]">
                  Vrijblijvend<br />consult inbegrepen
                </h3>
              </div>
              <p className="text-[12.5px] leading-[1.65]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Bij elke eerste behandeling ontvangt u een gratis huidanalyse en persoonlijk advies van uw specialist.
              </p>
              <button
                onClick={() => setPage('behandelingen')}
                className="flex items-center gap-2 text-[12.5px] font-semibold h-[40px] px-5 rounded-full transition-all"
                style={{ background: 'rgba(255,255,255,0.13)', color: 'white', border: '1px solid rgba(255,255,255,0.22)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.20)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.13)')}
              >
                Maak een afspraak
                <ArrowRight size={11} />
              </button>
            </div>

            <div className="rounded-[20px] p-6 border border-border-subtle bg-warm-white">
              <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-muted-text mb-4">Betaalopties</p>
              <div className="space-y-3">
                {['iDEAL & creditcard', 'Achteraf betalen (Klarna)', 'Gespreide betaling (3-12 mnd)', 'Zorgverzekering (deels)'].map(m => (
                  <div key={m} className="flex items-center gap-2.5 text-[12.5px] text-charcoal">
                    <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#2E5B8A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    {m}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16 lg:py-20" style={{ background: '#F4F4F2' }}>
        <div className="max-w-[1540px] mx-auto px-6 lg:px-10">
          <div className="mb-12">
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-text mb-4">Behandelpakketten</p>
            <h2 className="text-soft-black font-extrabold leading-[0.95]" style={{ fontSize: 'clamp(30px, 3.5vw, 46px)', letterSpacing: '-0.02em' }}>
              Meer resultaat,<br />
              <span className="font-light">minder per sessie.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PACKAGES.map(pkg => (
              <div
                key={pkg.name}
                className={`rounded-[24px] p-8 flex flex-col justify-between relative overflow-hidden ${
                  pkg.highlight
                    ? 'text-warm-white'
                    : 'bg-warm-white border border-border-subtle'
                }`}
                style={pkg.highlight ? { background: '#1A3A5C' } : {}}
              >
                {pkg.highlight && (
                  <>
                    <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full border-[40px] opacity-[0.05]" style={{ borderColor: 'white' }} />
                    <span className="absolute top-6 right-6 text-[9.5px] font-bold tracking-[0.14em] uppercase px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.80)' }}>
                      Populairste keuze
                    </span>
                  </>
                )}

                <div className="relative z-10">
                  <p className={`text-[10px] font-semibold tracking-[0.16em] uppercase mb-4 ${pkg.highlight ? 'text-white/50' : 'text-muted-text'}`}>
                    {pkg.period}
                  </p>
                  <h3 className={`text-[22px] font-extrabold mb-1 ${pkg.highlight ? 'text-warm-white' : 'text-soft-black'}`}>
                    {pkg.name}
                  </h3>
                  <p className={`text-[12.5px] leading-[1.6] mb-6 ${pkg.highlight ? 'text-white/60' : 'text-muted-text'}`}>
                    {pkg.desc}
                  </p>

                  <div className="space-y-2.5 mb-8">
                    {pkg.items.map(item => (
                      <div key={item} className="flex items-start gap-2.5">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${pkg.highlight ? 'bg-white/15' : 'bg-primary/10'}`}>
                          <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2 2 4-4" stroke={pkg.highlight ? 'white' : '#2E5B8A'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span className={`text-[12.5px] leading-snug ${pkg.highlight ? 'text-white/75' : 'text-charcoal'}`}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative z-10">
                  <div className={`w-full h-px mb-6 ${pkg.highlight ? 'bg-white/10' : 'bg-border-subtle'}`} />
                  <div className="flex items-end justify-between">
                    <div>
                      <p className={`text-[36px] font-extrabold leading-none ${pkg.highlight ? 'text-warm-white' : 'text-primary'}`}>
                        {pkg.price}
                      </p>
                      <p className={`text-[11px] mt-1 ${pkg.highlight ? 'text-white/45' : 'text-muted-text'}`}>{pkg.period}</p>
                    </div>
                    <button
                      onClick={() => setPage('behandelingen')}
                      className={`flex items-center gap-2 text-[12.5px] font-semibold h-[40px] px-5 rounded-full transition-all ${
                        pkg.highlight
                          ? 'bg-white text-primary hover:bg-white/90'
                          : 'bg-primary text-warm-white hover:bg-primary-dark'
                      }`}
                    >
                      Kies pakket
                      <ArrowRight size={11} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ strip */}
      <section className="max-w-[1540px] mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-text mb-4">Veelgestelde vragen</p>
            <h2 className="text-soft-black font-extrabold leading-[1.0]" style={{ fontSize: 'clamp(26px, 3vw, 38px)', letterSpacing: '-0.02em' }}>
              Vragen over<br />
              <span className="font-light">onze tarieven?</span>
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { q: 'Zijn de consulten echt gratis?', a: 'Ja. Uw eerste huidconsult is altijd gratis en vrijblijvend. Wij geven u eerlijk advies — ook als een behandeling niet nodig is.' },
              { q: 'Vergoedt mijn zorgverzekering de behandelingen?', a: 'Sommige medisch noodzakelijke behandelingen worden (deels) vergoed vanuit de aanvullende verzekering. Wij helpen u graag uitzoeken wat van toepassing is.' },
              { q: 'Kan ik achteraf betalen?', a: 'Ja, wij werken samen met Klarna voor achteraf betalen en gespreide betalingen van 3 tot 12 maanden zonder rente.' },
              { q: 'Hoe lang zijn de tarieven geldig?', a: 'Onze tarieven zijn per kwartaal vastgesteld. Bij een lopend kuurtraject garanderen wij de prijs voor de volledige kuur.' },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-border-subtle pb-4">
                <p className="text-[14px] font-semibold text-soft-black mb-1.5">{q}</p>
                <p className="text-[13px] text-muted-text leading-[1.65]">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIJSCALCULATOR ── */}
      <PrijsCalculator setPage={setPage} />
    </>
  )
}

const CALC_TREATMENTS = [
  { name: 'Dermapen Microneedling', base: 149, kuurFactor: 0.88 },
  { name: 'Hydrafacial Signature', base: 129, kuurFactor: 0.87 },
  { name: 'Laser Huidverbetering', base: 159, kuurFactor: 0.86 },
  { name: 'Chemical Peel (medium)', base: 119, kuurFactor: 0.88 },
  { name: 'Mesotherapie', base: 169, kuurFactor: 0.89 },
  { name: 'PRP Bloedplaatjestherapie', base: 249, kuurFactor: 0.87 },
]

function PrijsCalculator({ setPage }: { setPage: (p: Page) => void }) {
  const [treatIdx, setTreatIdx] = useState(0)
  const [sessions, setSessions] = useState(3)
  const [monthly, setMonthly] = useState(false)

  const t = CALC_TREATMENTS[treatIdx]
  const singleTotal = t.base * sessions
  const kuurTotal = Math.round(t.base * t.kuurFactor) * sessions
  const saving = singleTotal - kuurTotal
  const perMonth = Math.round(kuurTotal / 3)

  return (
    <section className="max-w-[1540px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
      <div className="rounded-[28px] overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr_380px]" style={{ background: '#1A3A5C' }}>

        {/* LEFT — controls */}
        <div className="p-10 lg:p-12">
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full border-[50px] opacity-[0.04]" style={{ borderColor: 'white' }} />
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>Prijscalculator</p>
          <h2 className="text-warm-white font-extrabold leading-[1.0] mb-2" style={{ fontSize: 'clamp(24px, 2.8vw, 38px)', letterSpacing: '-0.02em' }}>
            Bereken uw behandelkosten
          </h2>
          <p className="text-[13px] mb-8 leading-[1.65]" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Stel uw kuur samen en zie direct wat u bespaart met een kuurprijs.
          </p>

          {/* Treatment selector */}
          <div className="mb-6">
            <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-3" style={{ color: 'rgba(255,255,255,0.50)' }}>Behandeling</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CALC_TREATMENTS.map((ct, i) => (
                <button
                  key={ct.name}
                  onClick={() => setTreatIdx(i)}
                  className="text-left px-4 py-3 rounded-[12px] text-[12px] font-semibold transition-all duration-200"
                  style={
                    i === treatIdx
                      ? { background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.30)' }
                      : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.08)' }
                  }
                >
                  {ct.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sessions slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-semibold tracking-[0.14em] uppercase" style={{ color: 'rgba(255,255,255,0.50)' }}>Aantal sessies</p>
              <p className="text-[18px] font-extrabold text-warm-white">{sessions}</p>
            </div>
            <input
              type="range"
              min={1}
              max={6}
              value={sessions}
              onChange={e => setSessions(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: 'white' }}
            />
            <div className="flex justify-between text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.30)' }}>
              <span>1 sessie</span><span>6 sessies</span>
            </div>
          </div>
        </div>

        {/* RIGHT — result */}
        <div className="p-10 lg:p-12 flex flex-col justify-between" style={{ background: 'rgba(255,255,255,0.06)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>Uw kostenindicatie</p>

            <div className="space-y-4 mb-8">
              <div className="flex items-baseline justify-between pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
                <span className="text-[12px] line-through" style={{ color: 'rgba(255,255,255,0.35)' }}>Los per sessie</span>
                <span className="text-[16px] font-bold line-through" style={{ color: 'rgba(255,255,255,0.30)' }}>€ {singleTotal}</span>
              </div>
              <div className="flex items-baseline justify-between pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
                <span className="text-[13px] font-semibold text-warm-white">Kuurprijs totaal</span>
                <span className="text-[24px] font-extrabold text-warm-white">€ {kuurTotal}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.55)' }}>Uw besparing</span>
                <span className="text-[16px] font-bold" style={{ color: '#7FB3E8' }}>€ {saving} korting</span>
              </div>
            </div>

            {/* Monthly toggle */}
            <div className="flex items-center justify-between p-4 rounded-[14px] mb-6" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <span className="text-[12.5px] text-warm-white font-medium">Toon per maand</span>
              <button
                onClick={() => setMonthly(!monthly)}
                className="relative w-10 h-6 rounded-full transition-colors duration-200"
                style={{ background: monthly ? 'rgba(255,255,255,0.40)' : 'rgba(255,255,255,0.15)' }}
              >
                <span
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                  style={{ left: monthly ? '22px' : '4px' }}
                />
              </button>
            </div>

            {monthly && (
              <div className="p-4 rounded-[14px] mb-6 text-center" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <p className="text-[11px] mb-1" style={{ color: 'rgba(255,255,255,0.50)' }}>Gespreid over 3 maanden</p>
                <p className="text-[32px] font-extrabold text-warm-white">€ {perMonth}<span className="text-[14px] font-normal" style={{ color: 'rgba(255,255,255,0.50)' }}>/mnd</span></p>
              </div>
            )}
          </div>

          <button
            onClick={() => setPage('behandelingen')}
            className="w-full flex items-center justify-center gap-2 text-[13px] font-semibold h-[44px] rounded-full bg-white text-primary hover:bg-white/90 transition-all"
          >
            Maak een afspraak
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </section>
  )
}
