import type { Page } from "./App";

const EXPERTS = [
  {
    name: 'Dr. Sophie van der Berg',
    role: 'Dermatoloog',
    locs: ['Amsterdam', 'Rotterdam'],
    bio: 'Gespecialiseerd in medische huidzorg en esthetische dermatologie met meer dan 14 jaar klinische ervaring. Lid van de Nederlandse Vereniging voor Dermatologie.',
    specs: ['Dermapen Microneedling', 'Laser Huidverbetering', 'Pigmentatie'],
    img: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?w=700&h=900&fit=crop&auto=format&q=85',
  },
  {
    name: 'Dr. Thomas Hoekstra',
    role: 'Cosmetisch Arts',
    locs: ['Utrecht', 'Den Haag'],
    bio: 'BIG-geregistreerd cosmetisch arts met jarenlange ervaring in niet-chirurgische huidbehandelingen. Gespecialiseerd in mesotherapie, PRP en huidverjonging.',
    specs: ['Mesotherapie', 'PRP Therapie', 'Huidverjonging'],
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=700&h=900&fit=crop&auto=format&q=85',
  },
  {
    name: 'Dr. Lena Visser',
    role: 'Cosmetisch Dermatoloog',
    locs: ['Amsterdam', 'Den Haag'],
    bio: 'Gespecialiseerd in huidveroudering, preventieve huidzorg en Dermapen microneedling. Regelmatig spreker op internationale huidzorgconferenties.',
    specs: ['Huidanalyse', 'Chemical Peel', 'Anti-aging'],
    img: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?w=700&h=900&fit=crop&auto=format&q=85',
  },
  {
    name: 'Dr. Niels Bakker',
    role: 'Huidtherapeut',
    locs: ['Rotterdam', 'Amsterdam'],
    bio: 'Gecertificeerd huidtherapeut met een passie voor wetenschappelijk onderbouwde behandelingen. Gespecialiseerd in acné, littekens en LED-lichttherapie.',
    specs: ['Chemical Peel', 'PRP Bloedplaatjes', 'LED-lichttherapie'],
    img: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=700&h=900&fit=crop&auto=format&q=85',
  },
  {
    name: 'Dr. Marieke de Groot',
    role: 'Huidtherapeut & Huidanalyse Specialist',
    locs: ['Utrecht', 'Eindhoven'],
    bio: 'Erkend huidtherapeut met expertise in geavanceerde huidanalyse en behandelplannen op maat. Gespecialiseerd in droge, gevoelige en gecombineerde huidtypes.',
    specs: ['Huidanalyse', 'Mesotherapie', 'LED-lichttherapie'],
    img: 'https://images.unsplash.com/photo-1773852730965-1e60e2e9dd8f?w=700&h=900&fit=crop&auto=format&q=85',
  },
  {
    name: 'Dr. Marc de Wit',
    role: 'Medisch Specialist Huidzorg',
    locs: ['Amsterdam', 'Rotterdam'],
    bio: 'Arts met speciale expertise in lasertherapie en pigmentafwijkingen. Behandelt zowel vrouwelijke als mannelijke patiënten met huidklachten en esthetische wensen.',
    specs: ['Laser Huidverbetering', 'Pigmentatie', 'Dermapen'],
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=700&h=900&fit=crop&auto=format&q=85',
  },
]

const ArrowRight = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
    <path d="M2 6.5h9M8 3l3.5 3.5L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function ExpertsPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <>
      {/* Header */}
      <section className="max-w-[1540px] mx-auto px-6 lg:px-12 pt-14 pb-12">
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-text mb-5">Ons team</p>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-end">
          <h1 className="text-soft-black leading-[0.93]" style={{ fontSize: 'clamp(40px, 5vw, 66px)' }}>
            <strong className="font-extrabold block">Uw huid in goede handen</strong>
            <span className="font-light block">van gecertificeerde specialisten.</span>
          </h1>
          <p className="text-[15px] text-muted-text leading-[1.7]">
            Ons team bestaat uit BIG-geregistreerde dermatologen, cosmetisch artsen en gecertificeerde huidtherapeuten — elk met een eigen expertise en passie voor medische huidzorg.
          </p>
        </div>
      </section>

      <div className="max-w-[1540px] mx-auto px-6 lg:px-12">
        <div className="h-px bg-border-subtle mb-14" />
      </div>

      {/* Expert grid */}
      <section className="max-w-[1540px] mx-auto px-6 lg:px-12 pb-20 lg:pb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXPERTS.map((expert) => (
            <div
              key={expert.name}
              className="group rounded-[20px] overflow-hidden border border-border-subtle bg-warm-white hover:border-primary/20 hover:shadow-sm transition-all duration-300 cursor-pointer"
            >
              {/* Portrait */}
              <div className="relative overflow-hidden h-[320px] bg-light-grey">
                <img
                  src={expert.img}
                  alt={expert.name}
                  className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-soft-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Location chips */}
                <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap">
                  {expert.locs.map((loc) => (
                    <span
                      key={loc}
                      className="bg-warm-white/90 backdrop-blur-sm text-charcoal text-[10px] font-semibold px-2.5 py-1 rounded-full"
                    >
                      {loc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="text-[17px] font-bold text-soft-black leading-tight">{expert.name}</h3>
                <p className="text-[13px] text-primary font-semibold mt-0.5 mb-4">{expert.role}</p>
                <p className="text-[13.5px] text-muted-text leading-[1.6] mb-5">{expert.bio}</p>

                {/* Specs */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {expert.specs.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] font-semibold text-primary bg-primary-light px-2.5 py-1 rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <button className="flex items-center gap-1.5 text-primary text-[13px] font-semibold group-hover:gap-2 transition-all">
                  Maak een afspraak
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                    <ArrowRight />
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-off-white py-20">
        <div className="max-w-[1540px] mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-[28px] lg:text-[40px] font-extrabold text-soft-black leading-tight mb-4">
            Niet zeker welke huidspecialist bij u past?
          </h2>
          <p className="text-[14px] text-muted-text leading-[1.65] mb-8 max-w-[480px] mx-auto">
            Plan een vrijblijvend huidconsult. Wij helpen u de juiste huidspecialist te vinden op basis van uw huidtype en wensen.
          </p>
          <button
            onClick={() => setPage('behandelingen')}
            className="inline-flex items-center gap-2 bg-primary text-warm-white text-[14px] font-semibold px-7 py-3.5 rounded-full hover:bg-primary-dark transition-colors group"
          >
            Afspraak plannen
            <span className="group-hover:translate-x-0.5 transition-transform duration-200">
              <ArrowRight />
            </span>
          </button>
        </div>
      </section>
    </>
  )
}
