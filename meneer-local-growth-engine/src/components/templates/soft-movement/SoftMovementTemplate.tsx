import Image from "next/image";
import type { StudioData } from "@/types/studio";
import { ConceptBanner } from "@/components/preview/ConceptBanner";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { SoftServices } from "@/components/templates/soft-movement/SoftServices";
import { formatRating, fullAddress, getImageByRole, getImagesByRole } from "@/lib/studio";

interface Props {
  studio: StudioData;
}

/**
 * Variant C — Soft Movement:
 * warm clay/sand, Sora geometry, organic blobs, horizontal snap services,
 * pulsing booking orb as signature motion.
 */
export function SoftMovementTemplate({ studio }: Props) {
  const hero = getImageByRole(studio, "hero");
  const reformer = getImageByRole(studio, "reformer");
  const studioImg = getImageByRole(studio, "studio");
  const atmosphere = getImageByRole(studio, "atmosphere");
  const gallery = getImagesByRole(studio, "gallery");

  return (
    <div className="soft-root relative overflow-x-clip bg-[#F3EBE3] text-[#3A322B] pb-14">
      <ConceptBanner studio={studio} tone="warm" />

      {/* Ambient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-[#E0D0C0]/70 blur-3xl animate-soft-float"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-[28rem] h-80 w-80 rounded-full bg-[#D4BFA8]/45 blur-3xl animate-soft-float [animation-delay:1.4s]"
      />

      <header className="relative z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7 md:px-10">
          <a href="#top" className="text-[1.35rem] font-medium tracking-tight text-[#2A221C]">
            {studio.studio_name}
          </a>
          <nav className="hidden items-center gap-7 text-[13px] text-[#3A322B]/65 md:flex">
            <a href="#studio" className="hover:text-[#2A221C]">Studio</a>
            <a href="#lessen" className="hover:text-[#2A221C]">Lessen</a>
            <a href="#team" className="hover:text-[#2A221C]">Team</a>
            <a href="#tarieven" className="hover:text-[#2A221C]">Tarieven</a>
          </nav>
          <a
            href={studio.booking_url}
            className="relative rounded-full bg-[#B8956E] px-5 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
          >
            <span
              aria-hidden
              className="absolute inset-0 rounded-full bg-[#B8956E] animate-soft-pulse-ring"
            />
            <span className="relative">Boek een les</span>
          </a>
        </div>
      </header>

      <section id="top" className="relative px-6 pb-20 pt-8 md:px-10 md:pb-28 md:pt-12">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <p className="text-[12px] font-medium tracking-[0.22em] uppercase text-[#9A8170]">
              {studio.city} · {studio.founded_year > 0 ? `sinds ${studio.founded_year}` : studio.primary_service}
            </p>
            <h1 className="mt-6 text-[clamp(2.6rem,6.5vw,4.75rem)] font-medium leading-[1.08] tracking-tight text-[#2A221C]">
              {studio.tagline}
            </h1>
            <p className="mx-auto mt-7 max-w-lg text-[15px] leading-relaxed text-[#3A322B]/70">
              {studio.description}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a
                href={studio.booking_url}
                className="rounded-full bg-[#2A221C] px-7 py-3.5 text-[13px] font-medium text-[#F3EBE3] transition-opacity hover:opacity-90"
              >
                Plan je eerste bezoek
              </a>
              <a
                href="#lessen"
                className="rounded-full border border-[#B8956E]/55 px-7 py-3.5 text-[13px] font-medium transition-colors hover:bg-[#E8DDD2]"
              >
                Scroll door lessen
              </a>
            </div>
            <p className="mt-8 text-[13px] text-[#9A8170]">
              {formatRating(studio.review_rating)} uit 5 · {studio.review_count} reviews
            </p>
          </ScrollReveal>

          <ScrollReveal delayMs={120} className="relative mx-auto mt-14 max-w-4xl">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2.75rem] md:rounded-[3.25rem]">
              {hero && (
                <Image
                  src={hero.url}
                  alt={hero.alt}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 896px) 100vw, 896px"
                />
              )}
            </div>
            <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-white/95 px-5 py-3 shadow-sm backdrop-blur-sm">
              <span className="relative flex h-3 w-3">
                <span className="absolute inset-0 rounded-full bg-[#B8956E] animate-soft-pulse-ring" />
                <span className="relative h-3 w-3 rounded-full bg-[#B8956E]" />
              </span>
              <span className="whitespace-nowrap text-[12px] font-medium tracking-wide text-[#2A221C]">
                Live plaatsen vandaag
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="studio" className="relative px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <ScrollReveal className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem]">
              {studioImg && (
                <Image src={studioImg.url} alt={studioImg.alt} fill className="object-cover" sizes="50vw" />
              )}
            </div>
            <div className="absolute -bottom-5 -right-2 max-w-[180px] rounded-[1.5rem] bg-[#E8DDD2] p-5 md:-right-4">
              <p className="text-3xl font-medium text-[#2A221C]">{formatRating(studio.review_rating)}</p>
              <p className="mt-1 text-[12px] text-[#9A8170]">gemiddelde score</p>
            </div>
          </ScrollReveal>
          <ScrollReveal className="order-1 lg:order-2" delayMs={80}>
            <p className="text-[12px] font-medium tracking-[0.18em] uppercase text-[#9A8170]">
              De studio
            </p>
            <h2 className="mt-4 text-3xl font-medium leading-snug tracking-tight text-[#2A221C] md:text-4xl">
              Een kalme plek om sterker te worden
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-[#3A322B]/70">{studio.description}</p>
            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="rounded-[1.5rem] bg-[#E8DDD2]/80 p-5">
                <p className="text-lg font-medium text-[#2A221C]">{studio.primary_service}</p>
                <p className="mt-2 text-[12px] text-[#9A8170]">Primaire focus</p>
              </div>
              <div className="rounded-[1.5rem] bg-white/70 p-5">
                <p className="text-lg font-medium text-[#2A221C]">Max. 6</p>
                <p className="mt-2 text-[12px] text-[#9A8170]">Per reformer les</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Unique services: horizontal snap carousel */}
      <section id="lessen" className="bg-[#E8DDD2]/55 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <ScrollReveal className="max-w-xl">
            <p className="text-[12px] font-medium tracking-[0.18em] uppercase text-[#9A8170]">
              Aanbod
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight text-[#2A221C] md:text-4xl">
              Swipe door de lessen
            </h2>
            <p className="mt-3 text-[14px] text-[#3A322B]/65">
              Een zachte carousel. Niet dezelfde lijst als de andere templates.
            </p>
          </ScrollReveal>
          <div className="mt-10">
            <SoftServices services={studio.services} />
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[2.75rem]">
            <div className="relative aspect-[16/11] md:aspect-[21/9]">
              {reformer && (
                <Image src={reformer.url} alt={reformer.alt} fill className="object-cover" sizes="100vw" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-[#2A221C]/75 via-[#2A221C]/30 to-transparent" />
              <div className="absolute inset-0 flex items-end p-8 md:p-12">
                <div className="max-w-md text-[#F3EBE3]">
                  <p className="text-[12px] tracking-[0.18em] uppercase text-[#B8956E]">
                    {studio.primary_service}
                  </p>
                  <h2 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">
                    Bewegen met weerstand en adem
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 md:px-10 md:pb-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-medium tracking-tight text-[#2A221C] md:text-4xl">
            Wat je merkt
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {studio.benefits.map((b, i) => (
              <ScrollReveal
                key={b.id}
                delayMs={i * 60}
                className={`rounded-[1.75rem] bg-[#E8DDD2]/85 p-8 ${i % 2 === 1 ? "sm:translate-y-8" : ""}`}
              >
                <h3 className="text-xl font-medium text-[#2A221C]">{b.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-[#3A322B]/70">{b.description}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#D9CBB8]/40 px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-medium tracking-tight text-[#2A221C] md:text-4xl">
            Leden over {studio.studio_name}
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {studio.reviews.map((review) => (
              <blockquote key={review.id} className="flex flex-col rounded-[1.75rem] bg-[#F3EBE3] p-7">
                <p className="flex-1 text-lg leading-snug text-[#2A221C]">
                  &ldquo;{review.text}&rdquo;
                </p>
                <footer className="mt-8 border-t border-[#D9CBB8]/70 pt-5">
                  <cite className="not-italic text-[14px]">{review.author}</cite>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-md text-3xl font-medium tracking-tight text-[#2A221C] md:text-4xl">
            Mensen die je beweging zien
          </h2>
          <div className="mt-14 grid gap-12 md:grid-cols-3">
            {studio.team.map((member) => (
              <article key={member.id} className="text-center">
                <div className="relative mx-auto aspect-square max-w-[260px] overflow-hidden rounded-full">
                  <Image src={member.image_url} alt={member.name} fill className="object-cover" sizes="260px" />
                </div>
                <h3 className="mt-6 text-xl font-medium text-[#2A221C]">{member.name}</h3>
                <p className="mt-1 text-[12px] tracking-[0.12em] uppercase text-[#9A8170]">{member.role}</p>
                <p className="mx-auto mt-4 max-w-xs text-[13px] leading-relaxed text-[#3A322B]/65">
                  {member.bio}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 md:px-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 md:gap-4">
          {atmosphere && (
            <div className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-[2rem]">
              <Image src={atmosphere.url} alt={atmosphere.alt} fill className="object-cover" sizes="100vw" />
            </div>
          )}
          {gallery[0] && (
            <div className="relative aspect-square overflow-hidden rounded-[1.75rem]">
              <Image src={gallery[0].url} alt={gallery[0].alt} fill className="object-cover" sizes="50vw" />
            </div>
          )}
          {gallery[1] && (
            <div className="relative aspect-square overflow-hidden rounded-[1.75rem]">
              <Image src={gallery[1].url} alt={gallery[1].alt} fill className="object-cover" sizes="50vw" />
            </div>
          )}
        </div>
      </section>

      <section id="tarieven" className="bg-[#E8DDD2]/55 px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-medium tracking-tight text-[#2A221C] md:text-4xl">
            Memberships
          </h2>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {studio.memberships.map((plan) => (
              <article
                key={plan.id}
                className={`flex flex-col rounded-[1.75rem] p-8 ${
                  plan.featured ? "bg-[#2A221C] text-[#F3EBE3] md:-translate-y-2" : "bg-[#F3EBE3]"
                }`}
              >
                <p className={`text-[12px] ${plan.featured ? "text-[#B8956E]" : "text-[#9A8170]"}`}>
                  {plan.period}
                </p>
                <h3 className="mt-3 text-2xl font-medium">{plan.name}</h3>
                <p className="mt-6 text-4xl font-medium">{plan.price_label}</p>
                <p className={`mt-4 flex-1 text-[13px] leading-relaxed ${plan.featured ? "text-[#F3EBE3]/70" : "text-[#3A322B]/65"}`}>
                  {plan.description}
                </p>
                <ul className="mt-6 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className={`text-[13px] ${plan.featured ? "text-[#F3EBE3]/80" : "text-[#3A322B]/70"}`}>
                      · {f}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-medium tracking-tight text-[#2A221C]">Vragen</h2>
          <dl className="mt-10 space-y-3">
            {studio.faqs.map((faq) => (
              <div key={faq.id} className="rounded-[1.5rem] bg-[#E8DDD2]/75 px-6 py-6 md:px-8">
                <dt className="text-lg font-medium text-[#2A221C]">{faq.question}</dt>
                <dd className="mt-3 text-[14px] leading-relaxed text-[#3A322B]/70">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="contact" className="px-6 pb-24 md:px-10">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.75rem] bg-[#2A221C] text-[#F3EBE3]">
          <div className="grid gap-10 p-8 md:grid-cols-2 md:gap-16 md:p-14">
            <div>
              <p className="text-[12px] tracking-[0.18em] uppercase text-[#B8956E]">Locatie</p>
              <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
                Bezoek ons in {studio.city}
              </h2>
              <p className="mt-6 text-[14px] leading-relaxed text-[#F3EBE3]/70">{fullAddress(studio)}</p>
              <p className="mt-2 text-[13px] text-[#B8956E]">{studio.opening_hours}</p>
            </div>
            <div className="flex flex-col justify-end">
              <div className="space-y-2 text-[14px]">
                <p>
                  <a href={`tel:${studio.phone.replace(/\s/g, "")}`} className="underline decoration-[#B8956E] underline-offset-4">
                    {studio.phone}
                  </a>
                </p>
                <p>
                  <a href={`mailto:${studio.email}`} className="underline decoration-[#B8956E] underline-offset-4">
                    {studio.email}
                  </a>
                </p>
              </div>
              <a
                href={studio.booking_url}
                className="relative mt-8 inline-flex w-fit rounded-full bg-[#B8956E] px-7 py-3.5 text-[13px] font-medium text-white"
              >
                <span aria-hidden className="absolute inset-0 rounded-full bg-[#B8956E] animate-soft-pulse-ring" />
                <span className="relative">Reserveer nu</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#D9CBB8]/50 px-6 py-10 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 md:flex-row">
          <p className="text-lg font-medium text-[#2A221C]">{studio.studio_name}</p>
          <p className="text-[12px] text-[#9A8170]">{studio.city} · {studio.country}</p>
        </div>
      </footer>
    </div>
  );
}
