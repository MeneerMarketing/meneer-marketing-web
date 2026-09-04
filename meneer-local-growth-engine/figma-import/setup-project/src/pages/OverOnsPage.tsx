import type { Page } from '../App'

const TIMELINE = [
  { year: '2006', event: "Huidkliniek NL opent haar eerste kliniek op de Keizersgracht in Amsterdam met een team van vier gecertificeerde huidtherapeuten en dermatologen." },
  { year: '2010', event: "Opening van de tweede locatie in Rotterdam. Introductie van Dermapen microneedling en laserbehandelingen in het behandelaanbod." },
  { year: '2014', event: "Erkend door de Nederlandse Vereniging voor Cosmetische Geneeskunde. Uitbreiding naar Utrecht en Den Haag." },
  { year: '2019', event: "Introductie van PRP bloedplaatjestherapie en mesotherapie. Meer dan 10.000 huidbehandelingen uitgevoerd onder medisch toezicht." },
  { year: '2024', event: "Opening van de vijfde en zesde kliniek in Eindhoven en Groningen. Meer dan 20.000 behandelingen en een 9,2 patiëntscore." },
]

const VALUES = [
  { title: 'Medische integriteit', desc: "Wij werken uitsluitend met BIG-geregistreerde artsen en gecertificeerde huidtherapeuten die voldoen aan de hoogste medische standaarden." },
  { title: 'Persoonlijke huidzorg', desc: "Elk behandelplan begint met een uitgebreide huidanalyse. Wij luisteren naar uw huidwensen en adviseren eerlijk en zonder verplichtingen." },
  { title: "Transparante communicatie", desc: "Geen verborgen kosten, geen onrealistische beloften over huidresultaten. Alleen eerlijk en wetenschappelijk onderbouwd huidadvies." },
  { title: "Duurzame huidresultaten", desc: "Wij richten ons op hoogwaardige huidbehandelingen met langdurig, natuurlijk resultaat — van Dermapen tot laser huidverbetering." },
]

const ArrowRight = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
    <path d="M2 6.5h9M8 3l3.5 3.5L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function OverOnsPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <>
      {/* Hero */}
      <section className="max-w-[1540px] mx-auto px-6 lg:px-12 pt-14 pb-16 lg:pb-24">
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-text mb-5">Over ons</p>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-24 items-end">
          <h1 className="text-soft-black leading-[0.93]" style={{ fontSize: 'clamp(40px, 5vw, 68px)' }}>
            <strong className="font-extrabold block">Medische huidexpertise,</strong>
            <span className="font-light block">met oog voor de mens achter de huid.</span>
          </h1>
          <div>
            <p className="text-[15px] text-muted-text leading-[1.72] mb-8">
              Huidkliniek NL is opgericht met één doel: de kloof dichten tussen medische huidkwaliteit en menselijke warmte. Wij geloven dat huidzorg persoonlijk moet zijn — geen productiestraat, maar een partnerschap op maat.
            </p>
            <div className="flex gap-8">
              <div>
                <p className="text-[42px] font-extrabold text-primary leading-none">18+</p>
                <p className="text-[12px] text-muted-text mt-1">jaar ervaring</p>
              </div>
              <div>
                <p className="text-[42px] font-extrabold text-primary leading-none">6</p>
                <p className="text-[12px] text-muted-text mt-1">klinieken</p>
              </div>
              <div>
                <p className="text-[42px] font-extrabold text-primary leading-none">9,2</p>
                <p className="text-[12px] text-muted-text mt-1">patiëntscore</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Large editorial image */}
      <section className="pb-20 lg:pb-28">
        <div className="rounded-[22px] overflow-hidden bg-light-grey" style={{ height: 'clamp(300px, 45vw, 560px)' }}>
          <img
            src="https://images.unsplash.com/photo-1765371514743-45bd8e6c0a28?w=1600&h=700&fit=crop&auto=format&q=85"
            alt="Huidkliniek NL behandelruimte"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </section>

      {/* Brand statement */}
      <section className="max-w-[1540px] mx-auto px-6 lg:px-12 pb-20 lg:pb-28">
        <div className="max-w-[760px]">
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-text mb-6">Onze missie</p>
          <h2 className="text-soft-black leading-[0.94] mb-8" style={{ fontSize: 'clamp(30px, 3.5vw, 46px)' }}>
            <strong className="font-extrabold">"Stralende huid begint met de juiste zorg."</strong>
          </h2>
          <p className="text-[15px] text-muted-text leading-[1.72]">
            Wij staan voor transparantie, veiligheid en meetbare huidresultaten. Geen beloften die we niet kunnen waarmaken — wel eerlijk huidadvies, vakkundige uitvoering en persoonlijke nazorg. Dat is de Huidkliniek NL standaard.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-off-white py-20 lg:py-28">
        <div className="max-w-[1540px] mx-auto px-6 lg:px-12">
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-text mb-6">Waarden</p>
          <h2 className="text-[30px] lg:text-[42px] font-extrabold text-soft-black leading-[0.94] mb-14">
            Waarop wij ons<br />
            <span className="font-light">niet compromitteren.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {VALUES.map((v, i) => (
              <div
                key={v.title}
                className="bg-warm-white rounded-[18px] border border-border-subtle px-8 py-8"
              >
                <p className="text-[11px] font-semibold text-muted-text tracking-wider mb-4">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="text-[18px] font-bold text-soft-black mb-3">{v.title}</h3>
                <p className="text-[14px] text-muted-text leading-[1.65]">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-[1540px] mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-text mb-6">Geschiedenis</p>
        <h2 className="text-[30px] lg:text-[42px] font-extrabold text-soft-black leading-[0.94] mb-14">
          Achttien jaar<br />
          <span className="font-light">groeien in huidexpertise.</span>
        </h2>
        <div className="relative">
          <div className="absolute left-[28px] top-0 bottom-0 w-px bg-border-subtle" />
          <div className="flex flex-col gap-10">
            {TIMELINE.map((t) => (
              <div key={t.year} className="pl-16 relative">
                <div className="absolute left-[20px] top-1 w-4 h-4 rounded-full bg-primary-light border-2 border-primary" />
                <p className="text-[13px] font-bold text-primary mb-2">{t.year}</p>
                <p className="text-[14px] text-muted-text leading-[1.65] max-w-[560px]">{t.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-off-white py-16">
        <div className="max-w-[1540px] mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-[22px] font-bold text-soft-black">Maak kennis met onze huidspecialisten</h2>
            <p className="text-[14px] text-muted-text mt-1">Plan een vrijblijvend huidconsult en ontmoet uw specialist persoonlijk bij u in de buurt.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => setPage('experts')}
              className="flex items-center gap-2 border border-border-subtle text-charcoal text-[14px] font-semibold px-5 py-3 rounded-full hover:border-primary hover:text-primary transition-colors"
            >
              Onze experts
            </button>
            <button
              onClick={() => setPage('behandelingen')}
              className="flex items-center gap-2 bg-primary text-warm-white text-[14px] font-semibold px-5 py-3 rounded-full hover:bg-primary-dark transition-colors group"
            >
              Afspraak maken
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                <ArrowRight />
              </span>
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
