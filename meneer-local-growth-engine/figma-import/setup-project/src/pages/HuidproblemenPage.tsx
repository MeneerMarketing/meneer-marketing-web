import type { Page } from '../App'

const PROBLEMEN = [
  {
    slug: 'acne',
    name: 'Acne & Puistjes',
    sub: 'Ontstekingen, mee-eters en littekens',
    desc: 'Acne is een van de meest voorkomende huidaandoeningen. Onze dermatologen stellen een persoonlijk behandelplan op — van medicamenteuze aanpak tot geavanceerde laserbehandelingen.',
    treatments: ['Dermapen Microneedling', 'Chemical Peel', 'LED-lichttherapie'],
    img: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&h=600&fit=crop&auto=format&q=85',
  },
  {
    slug: 'pigmentatie',
    name: 'Pigmentatie',
    sub: 'Vlekken, melasma & zonschade',
    desc: 'Pigmentvlekken ontstaan door overproductie van melanine. Met gerichte laserbehandelingen en peelings egaliseren wij uw huidtoon effectief en veilig.',
    treatments: ['Laser Huidverbetering', 'Chemical Peel', 'Mesotherapie'],
    img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop&auto=format&q=85',
  },
  {
    slug: 'veroudering',
    name: 'Huidveroudering',
    sub: 'Rimpels, verlies van volume & elasticiteit',
    desc: 'Huidveroudering is een natuurlijk proces dat we effectief kunnen vertragen en verminderen. Van PRP-therapie tot Dermapen — wij kiezen de aanpak die bij u past.',
    treatments: ['PRP Bloedplaatjestherapie', 'Dermapen Microneedling', 'Mesotherapie'],
    img: 'https://images.unsplash.com/photo-1643684391140-c5056cfd3436?w=800&h=600&fit=crop&auto=format&q=85',
  },
  {
    slug: 'rosacea',
    name: 'Rosacea & Roodheid',
    sub: 'Couperose, teleangiëctasieën & flush',
    desc: 'Rosacea kenmerkt zich door aanhoudende roodheid en zichtbare bloedvaatjes. Lasertherapie en gerichte huidverzorging bieden langdurig verlichting.',
    treatments: ['Laser Huidverbetering', 'LED-lichttherapie', 'Hydrafacial'],
    img: 'https://images.unsplash.com/photo-1761718210089-ba3bb5ccb54f?w=800&h=600&fit=crop&auto=format&q=85',
  },
  {
    slug: 'littekens',
    name: 'Littekens & Poriën',
    sub: 'Acnelittekens, grote poriën & oneffenheden',
    desc: 'Zichtbare littekens en verwijde poriën zijn goed behandelbaar. Microneedling stimuleert de aanmaak van collageen voor een gladder en egaler huidoppervlak.',
    treatments: ['Dermapen Microneedling', 'Chemical Peel', 'PRP Bloedplaatjestherapie'],
    img: 'https://images.unsplash.com/photo-1683408640631-2c99fff964d7?w=800&h=600&fit=crop&auto=format&q=85',
  },
  {
    slug: 'droge-huid',
    name: 'Droge & Doffe Huid',
    sub: 'Dehydratatie, schilfering & dofheid',
    desc: 'Een droge, doffe huid vraagt om intensieve hydratatie en herstel van de huidbarrière. Hydrafacial en mesotherapie brengen uw huid terug in balans.',
    treatments: ['Hydrafacial', 'Mesotherapie', 'LED-lichttherapie'],
    img: 'https://images.unsplash.com/photo-1761718209708-9ab9ba1c7252?w=800&h=600&fit=crop&auto=format&q=85',
  },
]

const ArrowRight = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function HuidproblemenPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <>
      {/* Hero */}
      <section className="max-w-[1540px] mx-auto px-6 lg:px-10 pt-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-end mb-14">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-text mb-5">Huidproblemen</p>
            <h1 className="text-soft-black font-extrabold leading-[0.95]" style={{ fontSize: 'clamp(38px, 5vw, 68px)', letterSpacing: '-0.025em' }}>
              Herken uw<br />
              <span className="font-light">huidprobleem.</span>
            </h1>
          </div>
          <p className="text-[14px] text-muted-text leading-[1.75] pb-1">
            Elk huidprobleem verdient een gerichte aanpak. Onze dermatologen en huidtherapeuten analyseren uw huid en stellen een behandelplan op dat echt werkt.
          </p>
        </div>

        {/* Problem grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {PROBLEMEN.map((p, i) => (
            <div
              key={p.slug}
              className="group rounded-[20px] overflow-hidden border border-border-subtle bg-warm-white hover:border-primary/20 hover:shadow-md transition-all duration-300 cursor-pointer"
              onClick={() => setPage('behandelingen')}
            >
              {/* Photo */}
              <div className="relative h-[200px] overflow-hidden bg-light-grey">
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-600"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 text-[9.5px] font-semibold tracking-[0.14em] uppercase text-white/70">
                  {p.sub}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-[17px] font-bold text-soft-black mb-2 leading-tight">{p.name}</h3>
                <p className="text-[12.5px] text-muted-text leading-[1.65] mb-5">{p.desc}</p>

                {/* Treatments */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {p.treatments.map(t => (
                    <span key={t} className="text-[10.5px] font-semibold text-primary bg-primary/8 px-2.5 py-1 rounded-full border border-primary/12">
                      {t}
                    </span>
                  ))}
                </div>

                <button className="flex items-center gap-1.5 text-primary text-[12.5px] font-semibold group-hover:gap-2.5 transition-all">
                  Bekijk behandelingen
                  <ArrowRight />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="max-w-[1540px] mx-auto px-6 lg:px-10 pb-20">
        <div className="rounded-[24px] p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center" style={{ background: '#F4F4F2' }}>
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-text mb-3">Gratis advies</p>
            <h2 className="text-soft-black font-extrabold leading-[1.05]" style={{ fontSize: 'clamp(22px, 2.5vw, 34px)' }}>
              Weet u niet zeker welke behandeling<br className="hidden lg:block" /> bij uw huidprobleem past?
            </h2>
          </div>
          <button
            onClick={() => setPage('behandelingen')}
            className="shrink-0 flex items-center gap-2 bg-primary text-warm-white text-[13.5px] font-semibold px-6 h-[44px] rounded-full hover:bg-primary-dark transition-colors group"
          >
            Plan een huidconsult
            <ArrowRight size={12} />
          </button>
        </div>
      </section>
    </>
  )
}
