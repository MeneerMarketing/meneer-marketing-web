import { useState, useRef } from 'react'
import type { Page } from '../App'
import QuizModal from '../components/QuizModal'

const IMG = {
  hero: 'https://images.unsplash.com/photo-1643684391140-c5056cfd3436?w=1800&h=1000&fit=crop&crop=top&auto=format&q=90',
  imageData: 'https://images.unsplash.com/photo-1782159981479-0fafb56d3cd6?w=900&h=1200&fit=crop&auto=format&q=85',
  journey: [
    'https://images.unsplash.com/photo-1761718209708-9ab9ba1c7252?w=900&h=680&fit=crop&auto=format&q=85',
    'https://images.unsplash.com/photo-1713085085470-fba013d67e65?w=900&h=680&fit=crop&auto=format&q=85',
    'https://images.unsplash.com/photo-1782159981435-78545e10428a?w=900&h=680&fit=crop&auto=format&q=85',
    'https://images.unsplash.com/photo-1782159981439-b99dfb84f4b8?w=900&h=680&fit=crop&auto=format&q=85',
    'https://images.unsplash.com/photo-1647004692483-c5d942fe1137?w=900&h=680&fit=crop&auto=format&q=85',
  ],
  treatPortrait: 'https://images.unsplash.com/photo-1761819920857-7edc5e808fd3?w=800&h=1060&fit=crop&auto=format&q=85',
  treatDetail: 'https://images.unsplash.com/photo-1713085085470-fba013d67e65?w=700&h=460&fit=crop&auto=format&q=85',
  treatHands: 'https://images.unsplash.com/photo-1761718209708-9ab9ba1c7252?w=700&h=460&fit=crop&auto=format&q=85',
  campaign: 'https://images.unsplash.com/photo-1782159981435-78545e10428a?w=1800&h=800&fit=crop&auto=format&q=85',
  expert1: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?w=600&h=780&fit=crop&auto=format&q=85',
  expert2: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=780&fit=crop&auto=format&q=85',
  expert3: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&h=780&fit=crop&auto=format&q=85',
  expert4: 'https://images.unsplash.com/photo-1773852730965-1e60e2e9dd8f?w=600&h=780&fit=crop&auto=format&q=85',
  testimonial: 'https://images.unsplash.com/photo-1551184451-76b762941ad6?w=1200&h=900&fit=crop&auto=format&q=85',
  clinicArch: 'https://images.unsplash.com/photo-1765371513276-a74f1ecbcf7d?w=700&h=900&fit=crop&auto=format&q=85',
}

const JOURNEY_STEPS = [
  { num: '01', title: 'Kennismakingsgesprek', desc: 'Plan eenvoudig een consult via onze website of telefonisch. Wij helpen u snel en vrijblijvend verder.' },
  { num: '02', title: 'Huidanalyse', desc: 'Uw huidtherapeut voert een uitgebreide huidanalyse uit om uw huidtype en aandoeningen in kaart te brengen.' },
  { num: '03', title: 'Behandelplan', desc: 'Uw specialist stelt een persoonlijk behandelplan op, afgestemd op uw huid, wensen en doelstellingen.' },
  { num: '04', title: 'Behandeling', desc: 'De behandeling wordt uitgevoerd door een ervaren huidspecialist in een veilige, medische omgeving.' },
  { num: '05', title: 'Nazorg', desc: 'Na de behandeling ontvangt u persoonlijk nazorgadvies en blijft uw specialist beschikbaar voor vragen.' },
]

const TREATMENTS = [
  { name: 'Dermapen Microneedling', from: '€ 149' },
  { name: 'Hydrafacial', from: '€ 129' },
  { name: 'Laser Huidverbetering', from: '€ 159' },
  { name: 'Chemical Peel', from: '€ 119' },
  { name: 'Mesotherapie', from: '€ 169' },
  { name: 'PRP Bloedplaatjestherapie', from: '€ 249' },
]

const EXPERTS = [
  { name: 'Dr. Sophie van der Berg', role: 'Dermatoloog', locs: ['Amsterdam', 'Rotterdam'], img: IMG.expert1 },
  { name: 'Dr. Thomas Hoekstra', role: 'Cosmetisch Arts', locs: ['Utrecht', 'Den Haag'], img: IMG.expert2 },
  { name: 'Dr. Lena Visser', role: 'Huidtherapeut', locs: ['Amsterdam'], img: IMG.expert3 },
  { name: 'Dr. Niels Bakker', role: 'Cosmetisch Dermatoloog', locs: ['Rotterdam', '+1'], img: IMG.expert4 },
]

const ArrowRight = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CircleArrow = () => (
  <div className="w-[42px] h-[42px] rounded-full border border-white/25 flex items-center justify-center text-white/70 hover:border-white/50 hover:text-white transition-all duration-200 cursor-pointer group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
)

export default function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  const [activeStep, setActiveStep] = useState(0)
  const [expertOffset, setExpertOffset] = useState(0)
  const [quizOpen, setQuizOpen] = useState(false)
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, visible: false })
  const socialRef = useRef<HTMLDivElement>(null)
  const maxOffset = Math.max(0, EXPERTS.length - 3)

  const handleSocialMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = socialRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true })
  }

  return (
    <>
      <QuizModal open={quizOpen} onClose={() => setQuizOpen(false)} setPage={setPage} />
      {/* ─── HERO — rounded panel, 8px side gutters, nav floats inside ─── */}
      <section
        className="relative overflow-hidden rounded-[16px] bg-[#C2B0A0]"
        style={{
          margin: '30px 8px 0',
          height: 'clamp(580px, calc(100vh - 46px), 860px)',
        }}
      >
        <img
          src={IMG.hero}
          alt="Vrouw in behandelstoel tijdens LED-huidtherapie"
          className="absolute inset-0 w-full h-full object-cover object-center hero-img-zoom"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.15) 55%, transparent 75%), ' +
              'linear-gradient(to top, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.1) 45%, transparent 65%), ' +
              'linear-gradient(to bottom, rgba(0,0,0,0.38) 0%, transparent 28%)',
          }}
        />
        <div className="absolute top-[72px] left-0 right-0 px-6 lg:px-10">
          <p className="text-[11px] text-white/45 tracking-wide">
            <span className="hover:text-white/70 cursor-pointer transition-colors">Home</span>
            <span className="mx-2 text-white/25">›</span>
            <span className="hover:text-white/70 cursor-pointer transition-colors">Kliniek</span>
            <span className="mx-2 text-white/25">›</span>
            <span className="text-white/60 border-b border-white/30">Home</span>
          </p>
        </div>
        <div className="absolute bottom-[36px] lg:bottom-[48px] left-0 right-0 px-6 lg:px-[64px]">
          <div className="max-w-[580px]">
            <h1
              className="text-warm-white mb-4 anim-fade-up anim-fade-up-1"
              style={{ fontSize: 'clamp(30px, 2.8vw, 42px)', lineHeight: '1.06', letterSpacing: '-0.01em' }}
            >
              <strong className="font-extrabold">Stralende huid begint</strong>
              <br />
              <span className="font-normal">met de juiste zorg</span>
            </h1>
            <p className="text-white/80 text-[14px] lg:text-[15px] leading-[1.65] mb-7 max-w-[490px] anim-fade-up anim-fade-up-2">
              Gespecialiseerde huidbehandelingen uitgevoerd door gediplomeerde huidtherapeuten en dermatologen in zes klinieken door Nederland.
            </p>
            <div className="flex items-center gap-4 flex-wrap anim-fade-up anim-fade-up-3">
              <button
                onClick={() => setPage('behandelingen')}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-warm-white text-[13.5px] font-semibold rounded-full transition-colors duration-200 group"
                style={{ height: '44px', paddingLeft: '22px', paddingRight: '22px' }}
              >
                Afspraak maken
                <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                  <ArrowRight />
                </span>
              </button>
              <button
                onClick={() => setQuizOpen(true)}
                className="flex items-center gap-2 text-white/85 hover:text-white text-[13px] font-semibold transition-colors border border-white/30 hover:border-white/55 rounded-full"
                style={{ height: '44px', paddingLeft: '18px', paddingRight: '18px' }}
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7 5v2.5l1.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                Welke behandeling past bij mij?
              </button>
            </div>
            <p className="text-white/45 text-[11.5px] mt-4 anim-fade-up anim-fade-up-4">
              Ma–Vr. 09:00–17:30&nbsp;&nbsp;·&nbsp;&nbsp;Za. 09:00–15:00
            </p>
          </div>
        </div>
      </section>

      {/* ─── POST-HERO MEDICAL REVIEWER ─── */}
      <div className="max-w-[1540px] mx-auto px-6 lg:px-10 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-light-grey shrink-0">
            <img
              src={IMG.expert2}
              alt="Dr. Sophie van der Berg"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <p className="text-[11.5px] text-muted-text leading-[1.5]">
            De informatie op deze pagina is medisch gecontroleerd door
            <br />
            <span className="font-semibold text-charcoal">Dr. Sophie van der Berg</span>
            <span className="text-muted-text"> — Dermatoloog, Huidkliniek NL</span>
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          BRAND THREE-MODULE EDITORIAL COMPOSITION
          Pale petrol canvas · three cards: soft / dark / white
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-14 lg:py-16" style={{ background: '#F4F4F2' }}>
        <div className="max-w-[1540px] mx-auto px-6 lg:px-10">
          <div className="grid gap-3 grid-cols-1 lg:grid-cols-[27fr_46fr_27fr]" style={{ minHeight: 'clamp(300px, 36vw, 520px)' }}>

            {/* Card A — soft petrol, bottom-aligned statement */}
            <div className="rounded-[24px] p-8 lg:p-10 flex flex-col justify-between" style={{ background: '#E4E4E0' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(36,124,145,0.15)' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1.5v11M1.5 7h11" stroke="#2E5B8A" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-primary mb-3">Onze aanpak</p>
                <h3 className="text-soft-black font-extrabold leading-[1.1] mb-3" style={{ fontSize: 'clamp(20px, 1.8vw, 26px)' }}>
                  Medische expertise.<br />Menselijke zorg.
                </h3>
                <p className="text-[12.5px] text-muted-text leading-[1.6] font-light">
                  Elk behandelplan wordt individueel opgesteld — afgestemd op uw huid, wensen en levensstijl.
                </p>
              </div>
            </div>

            {/* Card B — deep petrol, brand graphic, editorial statement */}
            <div className="rounded-[24px] p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden group cursor-pointer" style={{ background: '#1A3A5C' }}>
              {/* Abstract brand circle — large, partially cropped */}
              <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full border-[50px] opacity-[0.06]" style={{ borderColor: 'white' }} />
              <div className="absolute right-8 bottom-32 w-40 h-40 rounded-full border-[28px] opacity-[0.04]" style={{ borderColor: 'white' }} />

              <div className="flex items-start justify-between relative z-10">
                <span className="text-[10px] font-semibold tracking-[0.16em] uppercase px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}>
                  Amsterdam · Utrecht · Rotterdam
                </span>
              </div>

              <div className="flex items-end justify-between relative z-10">
                <div>
                  <h3 className="text-warm-white font-extrabold leading-[1.08] mb-3" style={{ fontSize: 'clamp(22px, 2vw, 30px)' }}>
                    Huidexpertise.<br />Menselijke warmte.
                  </h3>
                  <button
                    onClick={() => setPage('over-ons')}
                    className="text-[12px] text-white/60 hover:text-white/90 transition-colors font-medium"
                  >
                    Lees ons verhaal
                  </button>
                </div>
                <CircleArrow />
              </div>
            </div>

            {/* Card C — white, metric data */}
            <div className="rounded-[24px] p-8 lg:p-10 flex flex-col justify-between bg-warm-white">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-muted-text mb-5">Kliniek in cijfers</p>
                <div className="space-y-4">
                  {[
                    { label: 'Jaren ervaring', value: '18+', progress: 90 },
                    { label: 'Klinieken NL', value: '6', progress: 60 },
                    { label: 'Behandelingen/jaar', value: '20.000+', progress: 95 },
                    { label: 'Patiëntscore', value: '9,2', progress: 92 },
                    { label: 'BIG-geregistreerd', value: '100%', progress: 100 },
                  ].map(({ label, value, progress }) => (
                    <div key={label}>
                      <div className="flex items-baseline justify-between mb-1.5">
                        <span className="text-[9.5px] font-semibold tracking-[0.14em] uppercase text-muted-text">{label}</span>
                        <span className="text-[16px] font-extrabold text-primary leading-none">{value}</span>
                      </div>
                      <div className="h-[4px] rounded-full" style={{ background: '#E4E4E0' }}>
                        <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setPage('over-ons')}
                className="flex items-center gap-1.5 text-primary text-[12.5px] font-semibold group w-fit"
              >
                Lees ons verhaal
                <span className="group-hover:translate-x-0.5 transition-transform duration-200"><ArrowRight size={12} /></span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          IMAGE + DATA COMPOSITION
          Photo with brand petrol gradient + quote LEFT · data metrics RIGHT
      ════════════════════════════════════════════════════════════════ */}
      <section className="max-w-[1540px] mx-auto px-6 lg:px-10 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-4" style={{ minHeight: 'clamp(320px, 48vw, 600px)' }}>

          {/* LEFT — editorial portrait photo with brand petrol gradient */}
          <div className="relative rounded-[24px] overflow-hidden bg-charcoal" style={{ minHeight: '320px' }}>
            <img
              src={IMG.imageData}
              alt="Huidbehandeling consultatie"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            {/* Brand petrol gradient overlay — not black */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(26,58,92,0.88) 0%, rgba(26,58,92,0.30) 40%, transparent 70%)',
              }}
            />
            <div className="absolute bottom-8 left-8 right-8">
              <p className="text-[10px] font-semibold tracking-[0.16em] uppercase mb-4" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Patiëntervaring
              </p>
              <p className="text-warm-white font-light leading-[1.35] mb-4" style={{ fontSize: 'clamp(18px, 1.8vw, 26px)' }}>
                "Mijn huid heeft een complete transformatie doorgemaakt.<br />Ik voel me eindelijk zelfverzekerd in mijn eigen huid."
              </p>
              <p className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.50)' }}>— Marieke, 38 · Utrecht</p>
            </div>
          </div>

          {/* RIGHT — premium health data panel */}
          <div className="rounded-[24px] p-8 lg:p-10 flex flex-col justify-between border border-border-subtle bg-warm-white">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-primary mb-1.5">Gemeten resultaten</p>
              <h3 className="text-soft-black font-extrabold leading-tight mb-6" style={{ fontSize: 'clamp(20px, 1.8vw, 28px)' }}>
                Persoonlijke huidanalyse.<br />
                <span className="font-light">Meetbaar resultaat.</span>
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Hydratatie', result: '+22%', sub: 'Na 4 Dermapen sessies', progress: 72 },
                  { label: 'Huidtextuur', result: 'Egaler', sub: 'Zichtbaar gladder na peeling', progress: 85 },
                  { label: 'Elasticiteit', result: '+18%', sub: 'Verbetering na PRP', progress: 68 },
                  { label: 'Pigmentatie', result: 'Verminderd', sub: 'Na laserbehandeling', progress: 78 },
                  { label: 'Behandelplan', result: 'Helder', sub: 'Afgestemd op uw huid', progress: 100 },
                ].map(({ label, result, sub, progress }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10.5px] font-semibold tracking-[0.12em] uppercase text-muted-text">{label}</span>
                      <span className="text-[14px] font-extrabold text-primary">{result}</span>
                    </div>
                    <div className="h-[4px] rounded-full mb-1" style={{ background: '#F4F4F2' }}>
                      <div className="h-full rounded-full" style={{ width: `${progress}%`, background: '#2E5B8A' }} />
                    </div>
                    <p className="text-[10.5px] text-muted-text">{sub}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-muted-text/70 leading-relaxed border-t border-border-subtle pt-4 mt-2">
              Op basis van uw huidanalyse stelt uw huidspecialist een persoonlijk en meetbaar behandelplan op.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          OPEN EDITORIAL — Customer Journey
          Left heading · right copy · interactive steps below
      ════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#F4F4F2' }} className="py-16 lg:py-24">
        <div className="max-w-[1540px] mx-auto px-6 lg:px-10">

          {/* Editorial heading split */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-20 mb-14">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-primary mb-5">Stap voor stap</p>
              <h2 className="text-soft-black font-extrabold leading-[0.95]" style={{ fontSize: 'clamp(36px, 4vw, 54px)' }}>
                Uw huidtraject<br />
                <span className="font-light">stap voor stap.</span>
              </h2>
            </div>
            <div className="flex items-end">
              <p className="text-[14px] text-muted-text leading-[1.7] max-w-[380px]">
                Van huidanalyse tot nazorg: wij begeleiden u bij elke stap. Uw huidspecialist blijft betrokken gedurende het volledige behandeltraject.
              </p>
            </div>
          </div>

          {/* Step progress rail — scrollable chips on mobile, rail on desktop */}
          <div className="mb-10">
            {/* Mobile: horizontal scrollable chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:hidden" style={{ scrollbarWidth: 'none' }}>
              {JOURNEY_STEPS.map((step, i) => (
                <button
                  key={step.num}
                  onClick={() => setActiveStep(i)}
                  className={`shrink-0 flex items-center gap-2 px-4 h-[36px] rounded-full text-[11.5px] font-semibold transition-all duration-200 ${
                    i === activeStep
                      ? 'bg-primary text-white'
                      : 'bg-warm-white border border-border-subtle text-muted-text'
                  }`}
                >
                  {i <= activeStep && i !== activeStep && (
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {step.title}
                </button>
              ))}
            </div>
            {/* Desktop: dot rail */}
            <div className="relative hidden lg:block">
              <div className="absolute top-3 left-0 right-0 h-px" style={{ background: '#E4E4E0' }} />
              <div
                className="absolute top-3 left-0 h-px bg-primary transition-all duration-500"
                style={{ width: `${(activeStep / (JOURNEY_STEPS.length - 1)) * 100}%` }}
              />
              <div className="relative flex justify-between">
                {JOURNEY_STEPS.map((step, i) => (
                  <button key={step.num} onClick={() => setActiveStep(i)} className="flex flex-col items-center gap-3 group">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      i <= activeStep ? 'bg-primary border-primary' : 'bg-warm-white border-border-subtle group-hover:border-primary/50'
                    }`}>
                      {i <= activeStep && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span className={`text-[10px] font-medium text-center leading-tight max-w-[80px] ${i === activeStep ? 'text-primary' : 'text-muted-text'}`}>
                      {step.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step content */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 lg:gap-12 items-center">
            <div className="rounded-[22px] overflow-hidden bg-light-grey" style={{ height: 'clamp(280px, 38vw, 480px)' }}>
              <img
                key={activeStep}
                src={IMG.journey[activeStep]}
                alt={JOURNEY_STEPS[activeStep].title}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div>
              <h3 className="text-soft-black font-bold leading-tight mb-4" style={{ fontSize: 'clamp(22px, 2.5vw, 32px)' }}>
                {JOURNEY_STEPS[activeStep].title}
              </h3>
              <p className="text-[14px] text-muted-text leading-[1.7] mb-8 max-w-[360px]">
                {JOURNEY_STEPS[activeStep].desc}
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                  disabled={activeStep === 0}
                  className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center text-charcoal hover:border-primary hover:text-primary disabled:opacity-30 transition-all"
                >
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button
                  onClick={() => setActiveStep(Math.min(JOURNEY_STEPS.length - 1, activeStep + 1))}
                  disabled={activeStep === JOURNEY_STEPS.length - 1}
                  className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center text-charcoal hover:border-primary hover:text-primary disabled:opacity-30 transition-all"
                >
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button
                  onClick={() => setPage('behandelingen')}
                  className="ml-2 flex items-center gap-2 bg-primary text-warm-white text-[13px] font-semibold px-5 h-[40px] rounded-full hover:bg-primary-dark transition-colors group"
                >
                  Afspraak maken
                  <span className="group-hover:translate-x-0.5 transition-transform"><ArrowRight /></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TREATMENT MOSAIC
          Tall editorial photo left · asymmetric treatment grid right
      ════════════════════════════════════════════════════════════════ */}
      <section className="max-w-[1540px] mx-auto px-6 lg:px-10 py-16 lg:py-24">

        {/* Section heading — editorial split */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-muted-text mb-4">Aanbod</p>
            <h2 className="text-soft-black font-extrabold leading-[0.94]" style={{ fontSize: 'clamp(32px, 3.5vw, 48px)' }}>
              Populaire <span className="font-light">behandelingen</span>
            </h2>
          </div>
          <button
            onClick={() => setPage('behandelingen')}
            className="hidden lg:flex items-center gap-2 text-primary text-[13px] font-semibold group"
          >
            Alles bekijken
            <span className="group-hover:translate-x-1 transition-transform"><ArrowRight /></span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[40fr_60fr] gap-4 items-stretch" style={{ minHeight: '560px' }}>

          {/* LEFT — tall editorial portrait with brand petrol gradient */}
          <div
            className="relative rounded-[24px] overflow-hidden bg-charcoal cursor-pointer group"
            style={{ minHeight: '340px' }}
            onClick={() => setPage('behandelingen')}
          >
            <img
              src={IMG.treatPortrait}
              alt="Huidverbetering behandeling"
              className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-700"
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(26,58,92,0.90) 0%, rgba(26,58,92,0.35) 45%, transparent 70%)',
              }}
            />
            <div className="absolute top-7 left-7">
              <span className="text-[10px] font-semibold tracking-[0.14em] uppercase px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}>
                Dermapen Microneedling
              </span>
            </div>
            <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
              <div>
                <p className="text-[11px] font-semibold tracking-wide uppercase mb-2" style={{ color: 'rgba(255,255,255,0.50)' }}>Vanaf € 149</p>
                <h3 className="text-warm-white font-extrabold leading-tight" style={{ fontSize: 'clamp(22px, 2.2vw, 30px)' }}>
                  Dermapen Microneedling
                </h3>
                <p className="text-[13px] mt-1.5 font-light" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Stimuleert huidvernieuwing voor een stralende, egale huid.
                </p>
              </div>
              <CircleArrow />
            </div>
          </div>

          {/* RIGHT — asymmetric grid of treatment modules */}
          <div className="grid grid-rows-[1fr_1fr] gap-4">

            {/* Top row: two smaller photo cards */}
            <div className="grid grid-cols-1 sm:grid-cols-[55fr_45fr] gap-4">
              <div
                className="relative rounded-[22px] overflow-hidden bg-charcoal cursor-pointer group"
                style={{ minHeight: '200px' }}
                onClick={() => setPage('behandelingen')}
              >
                <img src={IMG.treatDetail} alt="Hydrafacial behandeling" className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,58,92,0.85) 0%, transparent 55%)' }} />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-[10px] font-semibold tracking-wide uppercase mb-1" style={{ color: 'rgba(255,255,255,0.50)' }}>Vanaf € 129</p>
                  <h4 className="text-warm-white text-[16px] font-bold">Hydrafacial</h4>
                </div>
              </div>
              {/* Soft petrol info card */}
              <div className="rounded-[22px] p-6 flex flex-col justify-between" style={{ background: '#E4E4E0' }}>
                <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-primary">Hydrafacial</p>
                <div>
                  <p className="text-[28px] font-extrabold text-primary leading-none mb-1">€ 129</p>
                  <p className="text-[12px] text-muted-text leading-[1.5]">Verfijnde injectables voor een fris en natuurlijk resultaat.</p>
                </div>
                <button onClick={() => setPage('behandelingen')} className="flex items-center gap-1.5 text-primary text-[12px] font-semibold group w-fit">
                  Meer info <span className="group-hover:translate-x-0.5 transition-transform"><ArrowRight size={11} /></span>
                </button>
              </div>
            </div>

            {/* Bottom row: dark brand card + photo card */}
            <div className="grid grid-cols-1 sm:grid-cols-[45fr_55fr] gap-4">
              {/* Deep petrol editorial card */}
              <div className="rounded-[22px] p-6 flex flex-col justify-between relative overflow-hidden" style={{ background: '#2E5B8A' }}>
                <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full border-[20px] opacity-[0.08]" style={{ borderColor: 'white' }} />
                <p className="text-[10px] font-semibold tracking-[0.14em] uppercase relative z-10" style={{ color: 'rgba(255,255,255,0.60)' }}>Laser Huidverbetering</p>
                <div className="relative z-10">
                  <p className="text-warm-white font-extrabold leading-[1.1] mb-2" style={{ fontSize: '20px' }}>
                    Stralende huid.<br />Zichtbaar effect.
                  </p>
                  <p className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>Vanaf € 159</p>
                </div>
              </div>
              <div
                className="relative rounded-[22px] overflow-hidden bg-charcoal cursor-pointer group"
                style={{ minHeight: '200px' }}
                onClick={() => setPage('behandelingen')}
              >
                <img src={IMG.treatHands} alt="Chemical peeling" className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,58,92,0.85) 0%, transparent 55%)' }} />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-[10px] font-semibold tracking-wide uppercase mb-1" style={{ color: 'rgba(255,255,255,0.50)' }}>Vanaf € 119</p>
                  <h4 className="text-warm-white text-[16px] font-bold">Chemical Peel</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Treatment list — clean editorial */}
        <div className="mt-10 border-t border-border-subtle">
          {TREATMENTS.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setPage('behandelingen')}
              className="w-full flex items-center justify-between py-4 border-b border-border-subtle group hover:bg-off-white/60 -mx-3 px-3 transition-colors text-left"
            >
              <span className="text-[14px] font-medium text-charcoal group-hover:text-primary transition-colors">{t.name}</span>
              <div className="flex items-center gap-4">
                <span className="text-[12px] text-muted-text">{t.from}</span>
                <span className="text-muted-text group-hover:text-primary group-hover:translate-x-1 transition-all"><ArrowRight size={13} /></span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CAMPAIGN QUOTE PHOTOGRAPHY
          Full-bleed · brand petrol gradient · editorial quote inside
      ════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(380px, 44vw, 560px)' }}>
        <img
          src={IMG.campaign}
          alt="Samen is mooier campagne"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Brand petrol gradient — not generic black */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(26,58,92,0.82) 0%, rgba(26,58,92,0.45) 45%, rgba(26,58,92,0.15) 70%, transparent 88%)',
          }}
        />
        <div className="absolute inset-0 flex items-end pb-12 lg:pb-16">
          <div className="max-w-[1540px] mx-auto px-6 lg:px-10 w-full">
            <div className="max-w-[520px]">
              <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>Actie</p>
              <h2 className="text-warm-white leading-[1.08] mb-5 font-extrabold" style={{ fontSize: 'clamp(28px, 3.2vw, 46px)' }}>
                Samen stralen.<br />
                <span className="font-light">Breng een vriendin mee.</span>
              </h2>
              <p className="text-[13.5px] leading-relaxed mb-8 max-w-[380px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Plan een huidconsult samen met een vriendin en ontvang allebei 15% korting op uw eerste behandeling.
              </p>
              <button className="flex items-center gap-2 border text-[13px] font-semibold px-5 h-[42px] rounded-full backdrop-blur-sm transition-all group" style={{ borderColor: 'rgba(255,255,255,0.40)', color: 'white' }}>
                Meer informatie
                <span className="group-hover:translate-x-0.5 transition-transform"><ArrowRight /></span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          EXPERT EDITORIAL
          Pale canvas · asymmetric portrait mix · editorial profiles
      ════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#F4F4F2' }} className="py-16 lg:py-24">
        <div className="max-w-[1540px] mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-muted-text mb-4">Ons team</p>
              <h2 className="text-soft-black font-extrabold leading-[0.95]" style={{ fontSize: 'clamp(32px, 3.5vw, 48px)' }}>
                Onze experts
              </h2>
            </div>
            <button
              onClick={() => setPage('experts')}
              className="hidden sm:flex items-center gap-2 text-primary text-[13px] font-semibold group"
            >
              Alle experts
              <span className="group-hover:translate-x-1 transition-transform"><ArrowRight /></span>
            </button>
          </div>

          {/* Asymmetric grid: large · medium · small · accent */}
          <div className="grid grid-cols-2 lg:grid-cols-[38fr_26fr_20fr_16fr] gap-3" style={{ height: 'clamp(320px, 44vw, 560px)' }}>
            {/* Large — portrait photo */}
            {EXPERTS.slice(0, 1).map(e => (
              <div
                key={e.name}
                className="relative rounded-[24px] overflow-hidden bg-charcoal group cursor-pointer"
                onClick={() => setPage('experts')}
              >
                <img src={e.img} alt={e.name} className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-700" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,58,92,0.88) 0%, transparent 55%)' }} />
                <div className="absolute top-5 left-5 flex gap-1.5 flex-wrap">
                  {e.locs.map(loc => (
                    <span key={loc} className="text-[9.5px] font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.80)' }}>{loc}</span>
                  ))}
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.50)' }}>{e.role}</p>
                  <p className="text-warm-white font-bold text-[17px] leading-tight">{e.name}</p>
                </div>
              </div>
            ))}

            {/* Medium */}
            {EXPERTS.slice(1, 2).map(e => (
              <div
                key={e.name}
                className="relative rounded-[24px] overflow-hidden bg-charcoal group cursor-pointer"
                onClick={() => setPage('experts')}
              >
                <img src={e.img} alt={e.name} className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-700" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,58,92,0.88) 0%, transparent 55%)' }} />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-[10px] font-semibold tracking-[0.12em] uppercase mb-1.5" style={{ color: 'rgba(255,255,255,0.50)' }}>{e.role}</p>
                  <p className="text-warm-white font-bold text-[15px] leading-tight">{e.name}</p>
                </div>
              </div>
            ))}

            {/* Small portrait */}
            {EXPERTS.slice(2, 3).map(e => (
              <div
                key={e.name}
                className="relative rounded-[24px] overflow-hidden bg-charcoal group cursor-pointer"
                onClick={() => setPage('experts')}
              >
                <img src={e.img} alt={e.name} className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-700" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,58,92,0.88) 0%, transparent 55%)' }} />
                <div className="absolute bottom-5 left-4 right-4">
                  <p className="text-[9px] font-semibold tracking-[0.12em] uppercase mb-1" style={{ color: 'rgba(255,255,255,0.50)' }}>{e.role}</p>
                  <p className="text-warm-white font-bold text-[13px] leading-tight">{e.name}</p>
                </div>
              </div>
            ))}

            {/* Deep petrol accent card */}
            <div className="rounded-[24px] p-6 flex flex-col justify-between relative overflow-hidden" style={{ background: '#1A3A5C' }}>
              <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full border-[16px] opacity-[0.08]" style={{ borderColor: 'white' }} />
              <p className="text-[9.5px] font-semibold tracking-[0.14em] uppercase relative z-10" style={{ color: 'rgba(255,255,255,0.55)' }}>Ons team</p>
              <div className="relative z-10">
                <p className="text-warm-white font-extrabold leading-[1.1] mb-3 text-[16px]">
                  {EXPERTS.length}+<br />specialisten
                </p>
                <button
                  onClick={() => setPage('experts')}
                  className="text-[11px] font-medium transition-colors" style={{ color: 'rgba(255,255,255,0.60)' }}
                >
                  Bekijk allen →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TESTIMONIAL — photo-integrated with brand gradient + quote
      ════════════════════════════════════════════════════════════════ */}
      <section className="max-w-[1540px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-4">

          {/* Photo with brand gradient + integrated quote */}
          <div className="relative rounded-[24px] overflow-hidden bg-charcoal" style={{ minHeight: '320px' }}>
            <img
              src={IMG.testimonial}
              alt="Patiënt ervaringen"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(26,58,92,0.88) 0%, rgba(26,58,92,0.30) 40%, transparent 65%)',
              }}
            />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex gap-0.5 mb-4">
                {[0,1,2,3,4].map(i => (
                  <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="rgba(255,255,255,0.80)">
                    <path d="M7 1l1.6 3.3 3.6.5-2.6 2.6.6 3.6L7 9.3 3.8 11l.6-3.6L2 4.8l3.6-.5z"/>
                  </svg>
                ))}
              </div>
              <p className="text-warm-white font-light leading-[1.35] mb-4" style={{ fontSize: 'clamp(17px, 1.8vw, 24px)' }}>
                "Na jaren strijd met mijn huid voelde ik me hier voor het eerst echt begrepen. Het resultaat heeft mijn zelfvertrouwen teruggegeven."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-px h-8 bg-white/30" />
                <div>
                  <p className="text-[13px] font-semibold text-warm-white">Femke V., 41 jaar</p>
                  <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.55)' }}>Dermapen Microneedling · Amsterdam</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews data panel */}
          <div className="rounded-[24px] p-8 lg:p-10 flex flex-col justify-between border border-border-subtle bg-warm-white">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-muted-text mb-6">Beoordeeld via</p>
              <div className="space-y-4 mb-8">
                {['Google', 'Kliniekervaringen', 'Trustpilot'].map(s => (
                  <div key={s} className="flex items-center justify-between border-b border-border-subtle pb-4">
                    <span className="text-[12px] font-semibold text-charcoal">{s}</span>
                    <div className="flex gap-0.5">
                      {[0,1,2,3,4].map(i => <svg key={i} width="11" height="11" viewBox="0 0 14 14" fill="#2E5B8A"><path d="M7 1l1.6 3.3 3.6.5-2.6 2.6.6 3.6L7 9.3 3.8 11l.6-3.6L2 4.8l3.6-.5z"/></svg>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[64px] font-extrabold text-primary leading-none">9,2</p>
              <p className="text-[12px] text-muted-text mt-1 mb-6">uit 4.800+ ervaringen</p>
              <button className="flex items-center gap-1.5 text-primary text-[12.5px] font-semibold group">
                Bekijk alle ervaringen
                <span className="group-hover:translate-x-0.5 transition-transform"><ArrowRight size={12} /></span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SOCIAL — Instagram full-width mosaic
      ════════════════════════════════════════════════════════════════ */}
      <section className="pb-0">
        {/* Header row */}
        <div className="max-w-[1540px] mx-auto px-6 lg:px-10 pt-16 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-[9px] flex items-center justify-center shrink-0" style={{
                background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4.5"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none"/>
                </svg>
              </div>
              <div>
                <p className="text-[12px] font-bold text-soft-black tracking-[-0.01em]">@huidkliniknl</p>
                <p className="text-[10.5px] text-muted-text">28,4K volgers</p>
              </div>
            </div>
            <h2 className="font-extrabold text-soft-black leading-[1.0]" style={{ fontSize: 'clamp(26px, 2.6vw, 38px)', letterSpacing: '-0.02em' }}>
              Dagelijkse inspiratie voor uw huid
            </h2>
          </div>
          <a
            href="#"
            className="shrink-0 inline-flex items-center gap-2 text-[13px] font-semibold h-[40px] px-5 rounded-full border border-border-subtle text-charcoal hover:bg-soft-black hover:text-warm-white hover:border-soft-black transition-all duration-200"
          >
            Volgen op Instagram
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M1.5 9.5l8-8M9.5 1.5H3.5M9.5 1.5v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        {/* Full-width photo strip with cursor spotlight */}
        <div
          ref={socialRef}
          className="relative grid gap-1 overflow-hidden"
          style={{ gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1.4fr', height: 'clamp(280px, 26vw, 400px)' }}
          onMouseMove={handleSocialMouseMove}
          onMouseLeave={() => setSpotlight(s => ({ ...s, visible: false }))}
        >
          {/* Cursor spotlight overlay */}
          {spotlight.visible && (
            <div
              className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-200"
              style={{
                background: `radial-gradient(320px circle at ${spotlight.x}px ${spotlight.y}px, rgba(255,255,255,0.10) 0%, transparent 70%)`,
              }}
            />
          )}
          {[
            { img: 'https://images.unsplash.com/photo-1643684391140-c5056cfd3436?w=700&h=900&fit=crop&auto=format&q=85', likes: '1.2K', caption: 'Gezichtsmassage' },
            { img: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&h=700&fit=crop&auto=format&q=85', likes: '847', caption: 'Hydratatie masker' },
            { img: 'https://images.unsplash.com/photo-1761718210089-ba3bb5ccb54f?w=600&h=700&fit=crop&auto=format&q=85', likes: '2.1K', caption: 'Dermapen resultaat' },
            { img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=700&fit=crop&auto=format&q=85', likes: '964', caption: 'Enzyme peeling' },
            { img: 'https://images.unsplash.com/photo-1683408640631-2c99fff964d7?w=700&h=900&fit=crop&auto=format&q=85', likes: '1.5K', caption: 'Even tot rust' },
          ].map((post, i) => (
            <div key={i} className="relative overflow-hidden group cursor-pointer bg-light-grey">
              <img
                src={post.img}
                alt={post.caption}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-[1.05] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/25">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
                <span className="text-white text-[12px] font-bold mt-1">{post.likes}</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[10px] text-white/80 font-medium">{post.caption}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
