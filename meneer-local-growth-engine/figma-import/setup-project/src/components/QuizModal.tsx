import { useState } from 'react'
import type { Page } from '../App'

interface Props {
  open: boolean
  onClose: () => void
  setPage: (p: Page) => void
}

const STEP1 = [
  { id: 'acne', label: 'Acne & onzuiverheden', icon: '⚡' },
  { id: 'pigment', label: 'Pigmentvlekken', icon: '☀️' },
  { id: 'aging', label: 'Rimpels & veroudering', icon: '🕰' },
  { id: 'droog', label: 'Droge of doffe huid', icon: '💧' },
  { id: 'littekens', label: 'Littekens & poriën', icon: '🔬' },
  { id: 'glow', label: 'Gewoon stralender', icon: '✨' },
]

const STEP2 = [
  { id: 'snel', label: 'Snel zichtbaar resultaat', sub: 'Binnen 2–4 weken' },
  { id: 'langdurig', label: 'Langdurige verbetering', sub: 'Traject van 3–6 maanden' },
  { id: 'preventie', label: 'Preventie & onderhoud', sub: 'Mijn huid gezond houden' },
]

const STEP3 = ['Amsterdam', 'Rotterdam', 'Utrecht', 'Den Haag', 'Eindhoven', 'Groningen']

const RESULTS: Record<string, { treatment: string; specialist: string; role: string; desc: string; price: string }> = {
  acne:      { treatment: 'Chemical Peel + LED-lichttherapie', specialist: 'Dr. Sophie van der Berg', role: 'Dermatoloog', desc: 'Een combinatie van chemische peeling en LED-therapie vermindert ontstekingen en zuivert de huid in kuren van 4–6 sessies.', price: 'Vanaf € 89' },
  pigment:   { treatment: 'Laser Huidverbetering', specialist: 'Dr. Niels Bakker', role: 'Cosmetisch Dermatoloog', desc: 'Lasertherapie is de goudstandaard voor hardnekkige pigmentvlekken. Zichtbaar resultaat na 2–3 sessies.', price: 'Vanaf € 159' },
  aging:     { treatment: 'PRP Bloedplaatjestherapie', specialist: 'Dr. Thomas Hoekstra', role: 'Cosmetisch Arts', desc: 'PRP stimuleert uw eigen collageen aanmaak voor een natuurlijker en langduriger resultaat dan injectables.', price: 'Vanaf € 249' },
  droog:     { treatment: 'Hydrafacial Platinum', specialist: 'Dr. Lena Visser', role: 'Huidtherapeut', desc: 'De Hydrafacial reinigt, pelt en hydrateert in één sessie. Direct stralend resultaat, geschikt voor alle huidtypen.', price: 'Vanaf € 129' },
  littekens: { treatment: 'Dermapen Microneedling', specialist: 'Dr. Sophie van der Berg', role: 'Dermatoloog', desc: 'Dermapen stimuleert de aanmaak van collageen en elastine en vermindert zichtbaar littekens en verwijde poriën.', price: 'Vanaf € 149' },
  glow:      { treatment: 'Hydrafacial + Mesotherapie', specialist: 'Dr. Lena Visser', role: 'Huidtherapeut', desc: 'De perfecte combinatie voor een directe glow-boost: Hydrafacial reinigt, Mesotherapie voedt de huid van binnenuit.', price: 'Vanaf € 129' },
}

export default function QuizModal({ open, onClose, setPage }: Props) {
  const [step, setStep] = useState(0)
  const [s1, setS1] = useState('')
  const [s2, setS2] = useState('')
  const [s3, setS3] = useState('')

  const reset = () => { setStep(0); setS1(''); setS2(''); setS3('') }
  const close = () => { reset(); onClose() }

  const result = RESULTS[s1] ?? RESULTS['glow']

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />

      {/* Panel */}
      <div className="relative w-full sm:max-w-[520px] bg-warm-white rounded-t-[28px] sm:rounded-[28px] overflow-hidden shadow-2xl">

        {/* Progress bar */}
        <div className="h-1 bg-light-grey">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: step < 3 ? `${((step + 1) / 4) * 100}%` : '100%' }} />
        </div>

        <div className="px-8 pt-7 pb-8">
          {/* Close */}
          <button onClick={close} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-light-grey transition-colors text-muted-text">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>

          {step === 0 && (
            <>
              <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-muted-text mb-2">Stap 1 van 3</p>
              <h2 className="text-[22px] font-extrabold text-soft-black mb-1 leading-tight">Wat is uw voornaamste huidzorg?</h2>
              <p className="text-[13px] text-muted-text mb-6">Wij stellen het beste behandeladvies samen op basis van uw antwoorden.</p>
              <div className="grid grid-cols-2 gap-2">
                {STEP1.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { setS1(opt.id); setStep(1) }}
                    className="flex items-center gap-3 p-4 rounded-[14px] border-2 text-left transition-all hover:border-primary hover:bg-primary/[0.03] border-border-subtle"
                  >
                    <span className="text-[20px] leading-none">{opt.icon}</span>
                    <span className="text-[12.5px] font-semibold text-soft-black leading-tight">{opt.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-muted-text mb-2">Stap 2 van 3</p>
              <h2 className="text-[22px] font-extrabold text-soft-black mb-1 leading-tight">Wat is uw behandeldoel?</h2>
              <p className="text-[13px] text-muted-text mb-6">Dit helpt ons de juiste aanpak en intensiteit te bepalen.</p>
              <div className="flex flex-col gap-2">
                {STEP2.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { setS2(opt.id); setStep(2) }}
                    className="flex items-center justify-between p-4 rounded-[14px] border-2 text-left transition-all hover:border-primary hover:bg-primary/[0.03] border-border-subtle group"
                  >
                    <div>
                      <p className="text-[13.5px] font-semibold text-soft-black">{opt.label}</p>
                      <p className="text-[11.5px] text-muted-text">{opt.sub}</p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-muted-text group-hover:text-primary transition-colors shrink-0">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-muted-text mb-2">Stap 3 van 3</p>
              <h2 className="text-[22px] font-extrabold text-soft-black mb-1 leading-tight">Welke kliniek is het dichtst bij?</h2>
              <p className="text-[13px] text-muted-text mb-6">Zo koppelen wij u aan de juiste specialist in uw regio.</p>
              <div className="grid grid-cols-2 gap-2">
                {STEP3.map(city => (
                  <button
                    key={city}
                    onClick={() => { setS3(city); setStep(3) }}
                    className="p-4 rounded-[14px] border-2 text-left font-semibold text-[13px] text-soft-black transition-all hover:border-primary hover:bg-primary/[0.03] border-border-subtle"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <p className="text-[12px] font-semibold text-primary">Uw persoonlijk advies is klaar</p>
              </div>

              <h2 className="text-[20px] font-extrabold text-soft-black mb-1 leading-tight">Aanbevolen voor u</h2>
              <p className="text-[22px] font-extrabold text-primary mb-5">{result.treatment}</p>

              <p className="text-[13px] text-muted-text leading-[1.65] mb-5">{result.desc}</p>

              <div className="flex items-center gap-3 p-4 rounded-[14px] bg-[#F4F4F2] mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-extrabold text-[13px] shrink-0">
                  {result.specialist.split(' ')[1]?.[0]}{result.specialist.split(' ')[2]?.[0]}
                </div>
                <div>
                  <p className="text-[13px] font-bold text-soft-black">{result.specialist}</p>
                  <p className="text-[11px] text-muted-text">{result.role} · {s3}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-[11px] text-muted-text">Vanaf</p>
                  <p className="text-[15px] font-extrabold text-primary">{result.price}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { close(); setPage('behandelingen') }}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-warm-white text-[13px] font-semibold h-[44px] rounded-full hover:bg-primary-dark transition-colors"
                >
                  Maak een afspraak
                </button>
                <button
                  onClick={() => { reset() }}
                  className="flex items-center justify-center text-[12px] font-semibold text-muted-text border border-border-subtle h-[44px] px-4 rounded-full hover:text-charcoal transition-colors"
                >
                  Opnieuw
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
