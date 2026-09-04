import { useState, useEffect } from 'react'
import type { Page } from '../App'

const NAV_ITEMS: { label: string; page: Page }[] = [
  { label: 'Behandelingen', page: 'behandelingen' },
  { label: 'Huidproblemen', page: 'huidproblemen' },
  { label: 'Tarieven', page: 'tarieven' },
  { label: 'Informatie', page: 'informatie' },
  { label: 'Over ons', page: 'over-ons' },
]

export default function Header({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isHome = page === 'home'
  const transparent = isHome && !scrolled

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setScrolled(false)
  }, [page])

  return (
    <div className="fixed top-0 left-0 right-0 z-50">

      {/* ── Utility bar — white on home, light grey on inner pages ── */}
      <div className={isHome ? 'bg-warm-white' : 'bg-[#F4F4F2]'}>
        <div className="w-full px-[32px] lg:px-[48px] h-[30px] flex items-center justify-between">
          <span className="text-[11px] text-muted-text">
            <span style={{ color: '#F5A623' }}>★★★★★</span>
            {'  '}
            <span className="font-bold text-soft-black">9,0</span>
            {'  '}
            <span>uit 3.500+ reviews</span>
          </span>
          <div className="hidden md:flex items-center gap-5 text-[11px] text-muted-text">
            <button className="hover:text-charcoal transition-colors">Promoties</button>
            <button className="hover:text-charcoal transition-colors">FAQ</button>
            <button className="hover:text-charcoal transition-colors">Contact</button>
            <span className="text-border-subtle">|</span>
            <span className="flex items-center gap-1.5 font-semibold text-soft-black tracking-tight">
              <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M13 10.33v1.75a1.17 1.17 0 01-1.27 1.17A11.56 11.56 0 016.4 11.4a11.39 11.39 0 01-3.5-3.5A11.56 11.56 0 01.75 2.28 1.17 1.17 0 011.91 1h1.75a1.17 1.17 0 011.17 1 7.5 7.5 0 00.41 1.65 1.17 1.17 0 01-.26 1.23L4.09 5.77a9.33 9.33 0 003.5 3.5l.89-.89a1.17 1.17 0 011.23-.26 7.5 7.5 0 001.65.41A1.17 1.17 0 0113 9.58v.75z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              020 – 123 45 67
            </span>
          </div>
        </div>
      </div>

      {/* ── Main nav — floats over hero when transparent ── */}
      <header
        className={`transition-all duration-300 ${
          transparent
            ? 'bg-transparent'
            : 'bg-warm-white/97 backdrop-blur-md border-b border-border-subtle'
        }`}
      >
        <div className="w-full px-[32px] lg:px-[48px] h-[60px] flex items-center justify-between gap-8">

          {/* Logo */}
          <button
            onClick={() => { setPage('home'); setMobileOpen(false) }}
            className="flex items-center gap-2 shrink-0"
          >
            <span className={`text-[16px] font-extrabold tracking-[-0.02em] transition-colors duration-300 ${transparent ? 'text-white' : 'text-soft-black'}`}>
              Huidkliniek
            </span>
            <span className={`w-[8px] h-[8px] rounded-full transition-colors duration-300 ${transparent ? 'bg-white/80' : 'bg-primary'}`} />
          </button>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-6 flex-1 justify-end">
            {NAV_ITEMS.map(item => (
              <button
                key={item.label}
                onClick={() => setPage(item.page)}
                className={`text-[13.5px] font-medium tracking-[-0.01em] transition-colors duration-200 ${
                  page === item.page
                    ? transparent ? 'text-white' : 'text-primary'
                    : transparent ? 'text-white/75 hover:text-white' : 'text-charcoal/75 hover:text-charcoal'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA — outline white when transparent, filled teal when solid */}
          <div className="flex items-center gap-3 shrink-0">
            <button className={`hidden md:flex items-center gap-1.5 text-[13px] font-semibold px-5 h-[40px] rounded-full transition-all duration-200 ${
              transparent
                ? 'bg-transparent border border-white/60 text-white hover:bg-white/10'
                : 'bg-primary text-warm-white hover:bg-primary-dark'
            }`}>
              Afspraak maken
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                <path d="M1.5 5.5h8M6 2l3.5 3.5L6 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px]"
              aria-label="Menu openen"
            >
              {[0, 1, 2].map(i => (
                <span key={i} className={`block w-[18px] h-[1.5px] origin-center transition-all duration-200 ${transparent ? 'bg-white' : 'bg-charcoal'} ${
                  i === 0 && mobileOpen ? 'rotate-45 translate-y-[6.5px]'
                    : i === 1 && mobileOpen ? 'opacity-0'
                    : i === 2 && mobileOpen ? '-rotate-45 -translate-y-[6.5px]' : ''
                }`} />
              ))}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border-subtle bg-warm-white px-6 pt-6 pb-8 flex flex-col gap-5">
            {NAV_ITEMS.map(item => (
              <button
                key={item.label}
                onClick={() => { setPage(item.page); setMobileOpen(false) }}
                className="text-left text-[15px] font-medium text-charcoal hover:text-primary transition-colors"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 border-t border-border-subtle">
              <button className="w-full bg-primary text-warm-white text-[14px] font-semibold py-3 rounded-full">
                Afspraak maken
              </button>
            </div>
          </div>
        )}
      </header>
    </div>
  )
}
