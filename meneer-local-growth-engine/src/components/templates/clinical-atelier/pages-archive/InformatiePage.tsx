import type { Page } from "./App";

const KLINIEKEN = [
  { city: 'Amsterdam', address: 'Keizersgracht 412', postcode: '1016 GC Amsterdam', phone: '020 – 123 45 67', hours: 'Ma–Vr 09:00–17:30 · Za 10:00–15:00' },
  { city: 'Rotterdam', address: 'Coolsingel 50', postcode: '3011 AD Rotterdam', phone: '010 – 234 56 78', hours: 'Ma–Vr 09:00–17:30 · Za 10:00–15:00' },
  { city: 'Utrecht', address: 'Oudegracht 180', postcode: '3511 NV Utrecht', phone: '030 – 345 67 89', hours: 'Ma–Vr 09:00–17:00 · Za 10:00–14:00' },
  { city: 'Den Haag', address: 'Lange Poten 10', postcode: '2511 CM Den Haag', phone: '070 – 456 78 90', hours: 'Ma–Vr 09:00–17:30 · Za Gesloten' },
  { city: 'Eindhoven', address: 'Rechtestraat 25', postcode: '5611 GS Eindhoven', phone: '040 – 567 89 01', hours: 'Di–Za 09:00–18:00' },
  { city: 'Groningen', address: 'Grote Markt 5', postcode: '9711 LV Groningen', phone: '050 – 678 90 12', hours: 'Ma–Vr 09:00–17:00 · Za 10:00–14:00' },
]

const FAQ = [
  { q: 'Hoe maak ik een afspraak?', a: 'U kunt een afspraak maken via onze website, telefonisch of per e-mail. Wij reageren binnen één werkdag.' },
  { q: 'Wat moet ik meenemen naar mijn eerste afspraak?', a: 'Neem een geldig legitimatiebewijs mee en een lijst van medicijnen die u gebruikt. Wij sturen u van tevoren een intake-formulier toe.' },
  { q: 'Kan ik een afspraak annuleren of verzetten?', a: 'Ja, dat kan tot 24 uur van tevoren kosteloos. Bij latere annulering brengen wij een vergoeding van € 35 in rekening.' },
  { q: 'Zijn de behandelingen pijnlijk?', a: 'De meeste behandelingen zijn licht ongemakkelijk maar niet pijnlijk. Indien nodig passen wij een verdovende crème toe.' },
  { q: 'Hoe lang duurt het voor ik resultaat zie?', a: 'Dit hangt af van de behandeling en uw huidtype. Bij de meeste behandelingen is binnen 2–6 weken zichtbaar resultaat merkbaar.' },
  { q: 'Zijn de behandelingen veilig voor alle huidtypes?', a: 'Ja. Al onze behandelingen zijn geschikt voor alle huidtypes. Uw specialist past de intensiteit aan op uw specifieke huid.' },
]

const ArrowRight = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function InformatiePage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <>
      {/* Header */}
      <section className="max-w-[1540px] mx-auto px-6 lg:px-10 pt-10 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-end">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-text mb-5">Informatie</p>
            <h1 className="text-soft-black font-extrabold leading-[0.95]" style={{ fontSize: 'clamp(38px, 5vw, 68px)', letterSpacing: '-0.025em' }}>
              Alles wat u<br />
              <span className="font-light">wilt weten.</span>
            </h1>
          </div>
          <p className="text-[14px] text-muted-text leading-[1.75] pb-1">
            Zes klinieken door Nederland, open zes dagen per week. Wij staan voor u klaar — voor een afspraak, een vraag of gewoon goed advies.
          </p>
        </div>
      </section>

      {/* Contact strip */}
      <section className="max-w-[1540px] mx-auto px-6 lg:px-10 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Centraal nummer', value: '020 – 123 45 67', sub: 'Ma–Vr 08:30–18:00', icon: 'phone' },
            { label: 'E-mail', value: 'info@huidkliniknl.nl', sub: 'Reactie binnen 1 werkdag', icon: 'mail' },
            { label: 'Spoed buiten openingstijden', value: '06 – 12 34 56 78', sub: 'Alleen medische vragen', icon: 'alert' },
          ].map(c => (
            <div key={c.label} className="rounded-[20px] p-6 border border-border-subtle bg-warm-white">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                {c.icon === 'phone' && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#2E5B8A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 10.33v1.75a1.17 1.17 0 01-1.27 1.17A11.56 11.56 0 016.4 11.4a11.39 11.39 0 01-3.5-3.5A11.56 11.56 0 01.75 2.28 1.17 1.17 0 011.91 1h1.75a1.17 1.17 0 011.17 1 7.5 7.5 0 00.41 1.65 1.17 1.17 0 01-.26 1.23L4.09 5.77a9.33 9.33 0 003.5 3.5l.89-.89a1.17 1.17 0 011.23-.26 7.5 7.5 0 001.65.41A1.17 1.17 0 0113 9.58v.75z"/>
                  </svg>
                )}
                {c.icon === 'mail' && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#2E5B8A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 3h12v8.5a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5V3zM1 3l6 5 6-5"/>
                  </svg>
                )}
                {c.icon === 'alert' && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#2E5B8A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="7" cy="7" r="6"/><path d="M7 4.5v3M7 9.5h.01"/>
                  </svg>
                )}
              </div>
              <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-muted-text mb-1">{c.label}</p>
              <p className="text-[15px] font-bold text-soft-black mb-0.5">{c.value}</p>
              <p className="text-[11.5px] text-muted-text">{c.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Locations */}
      <section className="py-14 lg:py-16" style={{ background: '#F4F4F2' }}>
        <div className="max-w-[1540px] mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-text mb-4">Locaties</p>
              <h2 className="text-soft-black font-extrabold leading-[0.95]" style={{ fontSize: 'clamp(28px, 3vw, 42px)', letterSpacing: '-0.02em' }}>
                Zes klinieken<br />
                <span className="font-light">door Nederland.</span>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {KLINIEKEN.map((k, i) => (
              <div key={k.city} className="rounded-[20px] p-7 bg-warm-white border border-border-subtle hover:border-primary/20 hover:shadow-sm transition-all duration-300 cursor-pointer group">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-[12px] text-warm-white" style={{ background: '#1A3A5C' }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-muted-text pt-1">Kliniek</span>
                </div>
                <h3 className="text-[20px] font-extrabold text-soft-black mb-1 group-hover:text-primary transition-colors">{k.city}</h3>
                <p className="text-[13px] text-muted-text mb-0.5">{k.address}</p>
                <p className="text-[13px] text-muted-text mb-4">{k.postcode}</p>
                <div className="w-full h-px bg-border-subtle mb-4" />
                <p className="text-[12.5px] font-semibold text-primary mb-1">{k.phone}</p>
                <p className="text-[11.5px] text-muted-text">{k.hours}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-[1540px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-text mb-4">Veelgestelde vragen</p>
            <h2 className="text-soft-black font-extrabold leading-[1.0]" style={{ fontSize: 'clamp(26px, 3vw, 38px)', letterSpacing: '-0.02em' }}>
              Praktische<br />
              <span className="font-light">informatie.</span>
            </h2>
            <p className="text-[13px] text-muted-text leading-[1.65] mt-5 max-w-[280px]">
              Staat uw vraag er niet bij? Bel ons of stuur een e-mail — wij reageren altijd binnen één werkdag.
            </p>
          </div>
          <div className="space-y-5">
            {FAQ.map(({ q, a }) => (
              <div key={q} className="border-b border-border-subtle pb-5">
                <p className="text-[14px] font-semibold text-soft-black mb-2">{q}</p>
                <p className="text-[13px] text-muted-text leading-[1.65]">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1540px] mx-auto px-6 lg:px-10 pb-20">
        <div className="rounded-[24px] p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center relative overflow-hidden" style={{ background: '#1A3A5C' }}>
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full border-[48px] opacity-[0.05]" style={{ borderColor: 'white' }} />
          <div className="relative z-10">
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>Direct contact</p>
            <h2 className="text-warm-white font-extrabold leading-[1.05]" style={{ fontSize: 'clamp(22px, 2.5vw, 34px)' }}>
              Heeft u een specifieke vraag<br className="hidden lg:block" /> of wilt u een afspraak maken?
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 relative z-10">
            <button
              onClick={() => setPage('behandelingen')}
              className="flex items-center justify-center gap-2 text-[13px] font-semibold h-[44px] px-6 rounded-full transition-all"
              style={{ background: 'rgba(255,255,255,0.13)', color: 'white', border: '1px solid rgba(255,255,255,0.22)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.20)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.13)')}
            >
              Afspraak maken
              <ArrowRight size={11} />
            </button>
            <button
              className="flex items-center justify-center gap-2 text-[13px] font-semibold h-[44px] px-6 rounded-full bg-white text-primary hover:bg-white/90 transition-all"
            >
              020 – 123 45 67
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
