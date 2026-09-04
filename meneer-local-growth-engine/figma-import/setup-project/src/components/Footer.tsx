import type { Page } from '../App'

export default function Footer({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <footer className="bg-warm-white">

      {/* ── CTA strip boven footer ── */}
      <div style={{ background: '#1A3A5C' }}>
        <div className="max-w-[1540px] mx-auto px-6 lg:px-12 py-14 lg:py-16 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
          <div className="relative z-10">
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>Volgende stap</p>
            <h2 className="text-warm-white font-extrabold leading-[1.1]" style={{ fontSize: 'clamp(24px, 2.8vw, 40px)' }}>
              Plan uw huidbehandeling
              <br />
              <span className="font-light" style={{ color: 'rgba(255,255,255,0.55)' }}>of een vrijblijvend huidconsult.</span>
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <button
              onClick={() => setPage('behandelingen')}
              className="flex items-center gap-2 text-[13.5px] font-semibold h-[44px] px-6 rounded-full transition-all"
              style={{ background: 'rgba(255,255,255,0.13)', color: 'white', border: '1px solid rgba(255,255,255,0.22)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.20)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.13)')}
            >
              Afspraak maken
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <span className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.40)' }}>Ma – Vr &nbsp;09:00 – 17:30</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1540px] mx-auto px-6 lg:px-12 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 lg:gap-16">
        {/* Brand column */}
        <div>
          <div className="flex items-center gap-2.5 mb-7">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-warm-white" />
            </div>
            <span className="text-[15px] font-bold text-soft-black tracking-[-0.025em]">Huidkliniek NL</span>
          </div>
          <p className="text-[14px] text-muted-text leading-[1.65] max-w-[260px] mb-8">
            Gecertificeerde huidzorg voor een stralend en gezond resultaat. Al 18 jaar uw specialist in medische huidbehandelingen.
          </p>
          <div className="space-y-1.5 text-[13px] text-muted-text">
            <p className="text-[12px] font-semibold text-soft-black tracking-wider uppercase mb-3">Openingstijden</p>
            <p>Maandag – vrijdag &nbsp;09:00 – 17:30</p>
            <p>Zaterdag &nbsp;10:00 – 15:00</p>
            <p>Zondag &nbsp;Gesloten</p>
          </div>
          <div className="mt-7 flex gap-2">
            {['Instagram', 'Facebook', 'LinkedIn'].map((s) => (
              <button
                key={s}
                className="text-[11px] font-semibold text-muted-text border border-border-subtle px-3 py-1.5 rounded-full hover:border-primary hover:text-primary transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Behandelingen */}
        <div>
          <p className="text-[11px] font-semibold text-soft-black tracking-widest uppercase mb-6">Behandelingen</p>
          <ul className="space-y-3.5">
            {['Dermapen Microneedling', 'Hydrafacial', 'Laser Huidverbetering', 'Chemical Peel', 'Mesotherapie', 'PRP Bloedplaatjes', 'LED-lichttherapie', 'Huidanalyse'].map((t) => (
              <li key={t}>
                <button
                  onClick={() => setPage('behandelingen')}
                  className="text-[13.5px] text-muted-text hover:text-primary transition-colors"
                >
                  {t}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Over de kliniek */}
        <div>
          <p className="text-[11px] font-semibold text-soft-black tracking-widest uppercase mb-6">Over de kliniek</p>
          <ul className="space-y-3.5">
            {([
              ['Ons verhaal', 'over-ons'],
              ['Huidproblemen', 'huidproblemen'],
              ['Tarieven', 'tarieven'],
              ['Informatie', 'informatie'],
              ['In de media', 'home'],
              ['Ervaringen', 'home'],
            ] as [string, Page][]).map(([label, target]) => (
              <li key={label}>
                <button
                  onClick={() => setPage(target)}
                  className="text-[13.5px] text-muted-text hover:text-primary transition-colors"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-[11px] font-semibold text-soft-black tracking-widest uppercase mb-6">Contact</p>
          <div className="space-y-4 text-[13.5px] text-muted-text">
            <div>
              <p className="font-semibold text-charcoal mb-0.5">Amsterdam</p>
              <p>Keizersgracht 412</p>
              <p>1016 GC Amsterdam</p>
            </div>
            <div>
              <p className="font-semibold text-charcoal mb-0.5">Rotterdam</p>
              <p>Coolsingel 50</p>
              <p>3011 AD Rotterdam</p>
            </div>
            <div className="pt-1">
              <p>020 – 123 45 67</p>
              <p>info@huidkliniknl.nl</p>
            </div>
          </div>
        </div>
      </div>

      {/* Legal */}
      <div className="border-t border-border-subtle">
        <div className="max-w-[1540px] mx-auto px-6 lg:px-12 h-11 flex items-center justify-between">
          <p className="text-[11.5px] text-muted-text/70">© 2025 Huidkliniek NL. Alle rechten voorbehouden.</p>
          <div className="hidden sm:flex gap-5 text-[11.5px] text-muted-text/70">
            {['Privacybeleid', 'Algemene voorwaarden', 'Cookiebeleid'].map((l) => (
              <button key={l} className="hover:text-primary transition-colors">{l}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
