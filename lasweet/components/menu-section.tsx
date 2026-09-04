import Image from "next/image";
import { Reveal } from "@/components/reveal";
import menuCookies from "@/public/photos/menu-cookies-plates.png";

interface MenuItem {
  name: string;
  price: string;
  note?: string;
  highlight?: boolean;
}

const ICED_MATCHA: readonly MenuItem[] = [
  { name: "Iced matcha", price: "5,50" },
  { name: "Iced blue matcha", price: "6,50", note: "met smaak naar keuze" },
  { name: "Iced cherry matcha", price: "6,50" },
  { name: "Iced mango matcha", price: "6,50", highlight: true },
  { name: "Iced vanilla matcha", price: "6,50" },
  { name: "Iced strawberry matcha", price: "6,50" },
  { name: "Iced white chocolate matcha", price: "6,50" },
];

function MenuRow({ item }: { item: MenuItem }) {
  return (
    <li className="py-2.5 lg:py-3.5">
      <div className="flex items-baseline gap-2">
        <span className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-display text-base font-bold leading-tight tracking-tight text-ink sm:text-lg lg:text-xl lg:tracking-normal">
            {item.name}
          </span>
          {item.note && (
            <span className="text-xs leading-snug text-ink-soft sm:text-sm lg:text-base">
              {item.note}
            </span>
          )}
          {item.highlight && (
            <span className="shrink-0 rounded-full bg-matcha px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-cream sm:px-3 sm:py-1 lg:text-[10px]">
              <span className="sm:hidden">viral</span>
              <span className="hidden sm:inline">de viral</span>
            </span>
          )}
        </span>
        <span
          aria-hidden="true"
          className="mb-1 min-w-3 grow border-b-2 border-dotted border-ink/20"
        />
        <span className="shrink-0 font-display text-base font-bold text-matcha-deep sm:text-lg lg:text-xl">
          &euro;{item.price}
        </span>
      </div>
    </li>
  );
}

export function MenuSection() {
  return (
    <section id="matcha" className="stripe-bg py-16 lg:py-28">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-8 px-5 md:px-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        <div>
          <Reveal>
            <h2 className="font-display text-4xl font-semibold leading-[0.94] tracking-[-0.05em] text-ink md:text-5xl">
              De <span className="font-semibold text-matcha">menukaart</span>.
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">
              Elke matcha wordt op het moment zelf opgeklopt en per laagje
              opgebouwd. Melk naar keuze: koemelk, havermelk, kokosmelk of
              amandelmelk.
            </p>
          </Reveal>

          {/* Mobiel: lage horizontale strip */}
          <Reveal delay={0.08} className="mt-6 lg:hidden">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[1.5rem] border-[5px] border-cream shadow-[0_20px_50px_-24px_rgba(68,57,43,0.4)]">
              <Image
                src={menuCookies}
                alt="Crumble cookies van Lá Sweet op bordjes: red velvet, matcha, Kinder Bueno en meer"
                fill
                quality={90}
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
          </Reveal>

          {/* Desktop: schuine kaart met cookie-foto */}
          <Reveal delay={0.12} className="mt-10 hidden max-w-[420px] lg:block">
            <div className="rotate-3 overflow-hidden rounded-[2rem] border-[6px] border-cream shadow-[0_28px_70px_-28px_rgba(68,57,43,0.45)] transition-transform duration-500 hover:rotate-1 hover:-translate-y-1">
              <div className="relative aspect-square">
                <Image
                  src={menuCookies}
                  alt="Assortiment crumble cookies van Lá Sweet op marmeren tafel in Enschede"
                  fill
                  quality={90}
                  sizes="420px"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="rounded-[2rem] border border-ink/10 bg-cream p-6 shadow-[0_32px_80px_-40px_rgba(68,57,43,0.4)] md:p-10 lg:p-12">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-ink lg:text-3xl">
                Iced matcha
              </h3>
              <span className="font-logo text-lg text-ink-soft lg:text-xl">
                Lá Sweet
              </span>
            </div>
            <ul className="mt-4 lg:mt-6">
              {ICED_MATCHA.map((item) => (
                <MenuRow key={item.name} item={item} />
              ))}
            </ul>

            <p className="mt-8 rounded-2xl bg-beige-mist px-5 py-4 text-sm leading-relaxed text-beige-deep lg:mt-10 lg:px-6 lg:py-5 lg:text-base">
              De crumble cookies wisselen elke week en staan bij de smaken van
              nu. Op zaterdag kun je matcha en cookies proeven aan de
              Haaksbergerstraat 302 in Enschede. Walk-in welkom.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
