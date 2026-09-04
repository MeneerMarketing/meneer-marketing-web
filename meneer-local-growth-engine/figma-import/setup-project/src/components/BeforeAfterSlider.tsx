import { useState, useRef, useCallback } from 'react'

interface Props {
  before: string
  after: string
  label: string
  treatment: string
  weeks: string
}

export default function BeforeAfterSlider({ before, after, label, treatment, weeks }: Props) {
  const [pos, setPos] = useState(48)
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const updatePos = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100))
    setPos(pct)
  }, [])

  const onMouseDown = (e: React.MouseEvent) => { setDragging(true); updatePos(e.clientX) }
  const onMouseMove = (e: React.MouseEvent) => { if (dragging) updatePos(e.clientX) }
  const onMouseUp = () => setDragging(false)
  const onTouchMove = (e: React.TouchEvent) => updatePos(e.touches[0].clientX)

  return (
    <div
      ref={containerRef}
      className="relative rounded-[20px] overflow-hidden select-none cursor-col-resize bg-light-grey"
      style={{ aspectRatio: '4/3' }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={e => { setDragging(true); updatePos(e.touches[0].clientX) }}
      onTouchMove={onTouchMove}
      onTouchEnd={() => setDragging(false)}
    >
      {/* After image (full) */}
      <img src={after} alt="Na behandeling" className="absolute inset-0 w-full h-full object-cover object-center" draggable={false} />

      {/* Before image (clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={before} alt="Voor behandeling" className="absolute inset-0 w-full h-full object-cover object-center" draggable={false} />
        {/* Before label */}
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-charcoal bg-warm-white/90 backdrop-blur-sm">
          Vóór
        </div>
      </div>

      {/* After label */}
      <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-warm-white bg-primary/90 backdrop-blur-sm">
        Na
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-white shadow-lg z-10"
        style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
      >
        {/* Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-xl flex items-center justify-center z-20">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 8H1M1 8l2.5-2M1 8l2.5 2M11 8h4M15 8l-2.5-2M15 8l-2.5 2" stroke="#1A3A5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Bottom info strip */}
      <div className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-gradient-to-t from-black/60 to-transparent">
        <p className="text-white font-bold text-[13px]">{label}</p>
        <p className="text-white/65 text-[11px] mt-0.5">{treatment} · {weeks}</p>
      </div>
    </div>
  )
}
