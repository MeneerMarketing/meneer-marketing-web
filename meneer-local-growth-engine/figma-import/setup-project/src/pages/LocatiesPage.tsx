import { useState } from 'react'
import type { Page } from '../App'

const LOCATIONS = [
  {
    city: 'Amsterdam',
    address: 'Keizersgracht 412',
    postal: '1016 GC Amsterdam',
    hours: 'Ma – Vr: 09:00 – 17:30 · Za: 10:00 – 15:00',
    phone: '020 – 123 45 67',
    img: 'https://images.unsplash.com/photo-1765371512707-9e0e96fd9e5b?w=1000&h=700&fit=crop&auto=format&q=85',
  },
  {
    city: 'Rotterdam',
    address: 'Coolsingel 50',
    postal: '3011 AD Rotterdam',
    hours: 'Ma – Vr: 09:00 – 18:00 · Za: 10:00 – 15:00',
    phone: '010 – 234 56 78',
    img: 'https://images.unsplash.com/photo-1759987383760-327efaf5522a?w=1000&h=700&fit=crop&auto=format&q=85',
  },
  {
    city: 'Utrecht',
    address: 'Catharijnesingel 80',
    postal: '3511 GS Utrecht',
    hours: 'Di – Vr: 09:00 – 17:00 · Za: 10:00 – 14:00',
    phone: '030 – 345 67 89',
    img: 'https://images.unsplash.com/photo-1765371513276-a74f1ecbcf7d?w=1000&h=700&fit=crop&auto=format&q=85',
  },
  {
    city: 'Den Haag',
    address: 'Lange Voorhout 9',
    postal: '2514 EA Den Haag',
    hours: 'Ma – Do: 09:00 – 17:30 · Vr: 09:00 – 16:00',
    phone: '070 – 456 78 90',
    img: 'https://images.unsplash.com/photo-1774853094610-89be6f1a7690?w=1000&h=700&fit=crop&auto=format&q=85',
  },
  {
    city: 'Eindhoven',
    address: 'Stratumseind 14',
    postal: '5611 ES Eindhoven',
    hours: 'Ma – Vr: 09:00 – 18:00 · Za: 10:00 – 15:00',
    phone: '040 – 567 89 01',
    img: 'https://images.unsplash.com/photo-1765371514743-45bd8e6c0a28?w=1000&h=700&fit=crop&auto=format&q=85',
  },
  {
    city: 'Groningen',
    address: 'Herestraat 92',
    postal: '9711 LM Groningen',
    hours: 'Di – Vr: 09:00 – 17:30 · Za: 10:00 – 14:00',
    phone: '050 – 678 90 12',
    img: 'https://images.unsplash.com/photo-1778855180219-a22ee4351a2e?w=1000&h=700&fit=crop&auto=format&q=85',
  },
]

const ArrowRight = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
    <path d="M2 6.5h9M8 3l3.5 3.5L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function LocatiesPage({ setPage }: { setPage: (p: Page) => void }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = LOCATIONS[activeIdx]

  return (
    <>
      {/* Header */}
      <section className="max-w-[1540px] mx-auto px-6 lg:px-12 pt-14 pb-12">
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-text mb-5">Waar we te vinden zijn</p>
        <h1 className="text-soft-black leading-[0.93]" style={{ fontSize: 'clamp(40px, 5vw, 66px)' }}>
          <strong className="font-extrabold block">Onze huidklinieken</strong>
          <span className="font-light block">door heel Nederland.</span>
        </h1>
      </section>

      <div className="max-w-[1540px] mx-auto px-6 lg:px-12">
        <div className="h-px bg-border-subtle mb-10" />
      </div>

      {/* Location selector + image */}
      <section className="max-w-[1540px] mx-auto px-6 lg:px-12 pb-20 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 lg:gap-12 items-start">
          {/* Location list */}
          <div className="flex flex-col divide-y divide-border-subtle border border-border-subtle rounded-[18px] overflow-hidden">
            {LOCATIONS.map((loc, i) => (
              <button
                key={loc.city}
                onClick={() => setActiveIdx(i)}
                className={`text-left px-6 py-5 transition-all duration-200 ${
                  i === activeIdx ? 'bg-primary-light' : 'bg-warm-white hover:bg-off-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-[16px] font-bold leading-tight ${i === activeIdx ? 'text-primary' : 'text-soft-black'}`}>
                      {loc.city}
                    </p>
                    <p className="text-[13px] text-muted-text mt-0.5">{loc.address}</p>
                  </div>
                  <span className={`transition-colors ${i === activeIdx ? 'text-primary' : 'text-muted-text'}`}>
                    <ArrowRight />
                  </span>
                </div>
                {i === activeIdx && (
                  <div className="mt-4 space-y-1.5 text-[12.5px] text-muted-text">
                    <p>{loc.postal}</p>
                    <p>{loc.hours}</p>
                    <p className="text-primary font-medium">{loc.phone}</p>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Active location image */}
          <div>
            <div className="rounded-[20px] overflow-hidden bg-light-grey" style={{ height: 'clamp(300px, 40vw, 520px)' }}>
              <img
                key={activeIdx}
                src={active.img}
                alt={`Kliniek ${active.city}`}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 bg-primary text-warm-white text-[14px] font-semibold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors group">
                Afspraak in {active.city}
                <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                  <ArrowRight />
                </span>
              </button>
              <button className="flex items-center justify-center gap-2 border border-border-subtle text-charcoal text-[14px] font-semibold px-6 py-3 rounded-full hover:border-primary hover:text-primary transition-colors">
                Route bekijken
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-off-white py-16">
        <div className="max-w-[1540px] mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-[22px] font-bold text-soft-black">Twijfelt u welke huidkliniek het dichtst bij u is?</h2>
            <p className="text-[14px] text-muted-text mt-1">Bel ons of stuur een bericht — wij helpen u graag verder.</p>
          </div>
          <button
            onClick={() => setPage('behandelingen')}
            className="shrink-0 flex items-center gap-2 bg-primary text-warm-white text-[14px] font-semibold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors group"
          >
            Neem contact op
            <span className="group-hover:translate-x-0.5 transition-transform duration-200">
              <ArrowRight />
            </span>
          </button>
        </div>
      </section>
    </>
  )
}
