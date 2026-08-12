import Image from "next/image";
import type { StudioData } from "@/types/studio";
import { ConceptBanner } from "@/components/preview/ConceptBanner";
import { KenBurnsImage } from "@/components/motion/KenBurnsImage";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { FigmaServices } from "@/components/templates/reformer-minimal/FigmaServices";
import { formatRating, fullAddress, getImageByRole, getImagesByRole } from "@/lib/studio";

interface Props {
  studio: StudioData;
}

/**
 * Variant B — high-end full-screen Figma language (inspired by DIBA Clinics):
 * inset almost-fullscreen hero, floating white nav, oversized DM Sans,
 * signature bottom-left radius, accordion services, soft sage accent.
 */
export function ReformerMinimalTemplate({ studio }: Props) {
  const hero = getImageByRole(studio, "hero");
  const reformer = getImageByRole(studio, "reformer");
  const studioImg = getImageByRole(studio, "studio");
  const atmosphere = getImageByRole(studio, "atmosphere");
  const gallery = getImagesByRole(studio, "gallery");

  const headlineParts = splitHeadline(studio.tagline);

  return (
    <div className="figma-root relative min-h-screen overflow-x-clip bg-[#F3F5F2] text-[#1C211A] pb-14">
      <ConceptBanner studio={studio} tone="light" />

      {/* Thin trust strip */}
      <div className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-2 px-5 py-2.5 text-[12px] text-black/50 sm:px-8 lg:px-[5vw]">
          <span>
            {formatRating(studio.review_rating)} · {studio.review_count} reviews · {studio.city}
          </span>
          <span className="figma-label text-black/35">{studio.primary_service}</span>
        </div>
      </div>

      {/* Full-screen inset hero — DIBA HeroVariant pattern */}
      <section id="top" className="px-3 pb-3 pt-3 sm:px-4 sm:pb-4">
        <div className="relative h-[calc(100svh-5.5rem)] min-h-[560px] w-full overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] lg:rounded-[2.25rem]">
          {hero && <KenBurnsImage src={hero.url} alt={hero.alt} priority />}

          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/55 to-transparent"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/35 to-transparent"
          />

          {/* Floating nav on image */}
          <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6 lg:px-10">
            <a href="#top" className="text-[15px] font-semibold tracking-tight text-white">
              {studio.studio_name}
            </a>
            <nav className="hidden items-center gap-7 text-[12px] font-medium text-white/85 md:flex">
              <a href="#studio" className="hover:text-white">Studio</a>
              <a href="#lessen" className="hover:text-white">Lessen</a>
              <a href="#tarieven" className="hover:text-white">Tarieven</a>
              <a href="#contact" className="hover:text-white">Contact</a>
            </nav>
            <a
              href={studio.booking_url}
              className="figma-label inline-flex h-11 items-center rounded-full bg-white px-5 text-[#1C211A] transition-transform hover:-translate-y-0.5"
            >
              Boek les
            </a>
          </header>

          {/* Floating chip */}
          <div className="absolute left-5 top-24 z-10 hidden rounded-full bg-white/90 px-4 py-2 text-[12px] font-medium text-[#1C211A] backdrop-blur-sm sm:left-8 sm:top-28 lg:left-10 lg:block">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#A8B59A]" aria-hidden />
            Kleine groepen · max 6
          </div>

          {/* Bottom-left copy */}
          <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-8 sm:px-8 sm:pb-10 lg:px-10 lg:pb-14">
            <div className="max-w-[34ch] sm:max-w-[42ch]">
              <p className="figma-label flex items-center gap-2 text-white/70">
                <span className="h-2 w-2 rounded-full bg-[#C8D5C0]" aria-hidden />
                {studio.city}
              </p>
              <h1 className="figma-display-xl mt-4 text-white">
                {headlineParts.primary}
                {headlineParts.accent ? (
                  <>
                    <br />
                    <span className="text-[#C8D5C0]">{headlineParts.accent}</span>
                  </>
                ) : null}
              </h1>
              <p className="mt-5 max-w-[40ch] text-[15px] leading-7 text-white/75 sm:text-[16px]">
                {studio.description}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={studio.booking_url}
                  className="figma-label inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[#1C211A] transition-transform hover:-translate-y-0.5"
                >
                  Plan je eerste les
                  <span aria-hidden>↗</span>
                </a>
                <a
                  href="#lessen"
                  className="figma-label inline-flex h-12 items-center rounded-full border border-white/45 px-6 text-white transition-colors hover:border-white hover:bg-white/10"
                >
                  Bekijk lessen
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Asymmetric intro — signature radius media */}
      <section id="studio" className="mx-auto px-5 py-20 sm:px-8 lg:px-[5vw] lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <ScrollReveal>
            <p className="figma-label flex items-center gap-2.5 text-black/45">
              <span className="h-2 w-2 rounded-full bg-[#A8B59A]" aria-hidden />
              De studio
            </p>
            <h2 className="figma-display-l mt-5 max-w-[14ch]">
              Architectuur van{" "}
              <span className="text-[#6F7F64]">beweging</span>
            </h2>
            <p className="mt-7 max-w-[44ch] text-[16px] leading-7 text-black/60">
              {studio.description}
            </p>
            <div className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-black/10 pt-8">
              <div>
                <p className="figma-display-l !text-[2rem]">{formatRating(studio.review_rating)}</p>
                <p className="mt-1 text-[12px] text-black/40">Score</p>
              </div>
              <div>
                <p className="figma-display-l !text-[2rem]">
                  {studio.founded_year > 0 ? studio.founded_year : "—"}
                </p>
                <p className="mt-1 text-[12px] text-black/40">Sinds</p>
              </div>
              <div>
                <p className="figma-display-l !text-[2rem]">6</p>
                <p className="mt-1 text-[12px] text-black/40">Max groep</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={100} className="relative">
            <div className="absolute inset-3 -z-10 rounded-bl-[4rem] bg-[#D5E0CF] sm:inset-4 sm:rounded-bl-[6rem] lg:rounded-bl-[8rem]" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-bl-[4rem] sm:rounded-bl-[6rem] lg:rounded-bl-[9rem]">
              {studioImg && (
                <Image
                  src={studioImg.url}
                  alt={studioImg.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              )}
            </div>
            <div className="absolute -bottom-4 -right-2 flex h-24 w-24 items-center justify-center rounded-full bg-white text-center shadow-sm sm:h-28 sm:w-28">
              <div>
                <p className="text-[11px] font-medium leading-tight text-[#1C211A]">
                  Eerlijke
                  <br />
                  instructie
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Services — accordion rows (unique vs A/C) */}
      <section id="lessen" className="bg-white">
        <div className="mx-auto px-5 py-20 sm:px-8 lg:px-[5vw] lg:py-28">
          <ScrollReveal>
            <p className="figma-label text-black/40">Lessen</p>
            <h2 className="figma-display-l mt-4 max-w-[16ch]">
              Kies jouw ritme
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-7 text-black/55">
              Open een les voor details. Eén overzicht, klinisch en rustig.
            </p>
          </ScrollReveal>
          <div className="mt-12">
            <FigmaServices services={studio.services} />
          </div>
        </div>
      </section>

      {/* Reformer band */}
      <section className="mx-auto px-5 py-16 sm:px-8 lg:px-[5vw] lg:py-20">
        <div className="relative min-h-[58vh] overflow-hidden rounded-[1.75rem] sm:rounded-[2rem]">
          {reformer && (
            <Image src={reformer.url} alt={reformer.alt} fill className="object-cover" sizes="100vw" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C211A]/80 via-[#1C211A]/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 lg:p-14">
            <p className="figma-label text-white/55">Primary apparatus</p>
            <h2 className="figma-display-l mt-3 max-w-[10ch] text-white">Reformer first</h2>
            <p className="mt-5 max-w-md text-[15px] leading-7 text-white/75">
              {studio.primary_service} bij {studio.studio_name}. Weerstand die meetbaar is in
              houding, kracht en controle.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits — soft plates, not icon grids */}
      <section className="bg-[#E8EFE4]">
        <div className="mx-auto grid gap-px bg-black/5 px-0 sm:grid-cols-2 lg:grid-cols-4">
          {studio.benefits.map((b) => (
            <ScrollReveal key={b.id} className="bg-[#E8EFE4] px-7 py-12 sm:px-8">
              <h3 className="text-[17px] font-semibold tracking-tight">{b.title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-black/55">{b.description}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto px-5 py-20 sm:px-8 lg:px-[5vw] lg:py-28">
        <ScrollReveal>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="figma-display-l">Reviews</h2>
            <p className="figma-label text-black/40">
              {studio.review_count} stemmen · {formatRating(studio.review_rating)}/5
            </p>
          </div>
        </ScrollReveal>
        <div className="mt-12 space-y-0 border-t border-black/10">
          {studio.reviews.map((review) => (
            <blockquote
              key={review.id}
              className="grid grid-cols-1 gap-3 border-b border-black/10 py-9 md:grid-cols-12"
            >
              <p className="figma-label text-black/40 md:col-span-3">{review.author}</p>
              <p className="text-[18px] leading-snug tracking-tight md:col-span-9 md:text-[22px]">
                {review.text}
              </p>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-white">
        <div className="mx-auto px-5 py-20 sm:px-8 lg:px-[5vw] lg:py-28">
          <h2 className="figma-display-l">Instructors</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {studio.team.map((member) => (
              <article key={member.id}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-bl-[3rem] bg-[#D5E0CF]">
                  <Image
                    src={member.image_url}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="33vw"
                  />
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">{member.name}</h3>
                <p className="mt-1 figma-label text-black/40">{member.role}</p>
                <p className="mt-3 text-[14px] leading-relaxed text-black/55">{member.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto grid gap-3 px-5 py-10 sm:px-8 md:grid-cols-3 lg:px-[5vw]">
        {[atmosphere, gallery[0], gallery[1]].filter(Boolean).map((img) =>
          img ? (
            <div key={img.id} className="relative aspect-square overflow-hidden rounded-[1.25rem]">
              <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="33vw" />
            </div>
          ) : null
        )}
      </section>

      {/* Pricing */}
      <section id="tarieven" className="bg-white">
        <div className="mx-auto px-5 py-20 sm:px-8 lg:px-[5vw] lg:py-28">
          <h2 className="figma-display-l">Tarieven</h2>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {studio.memberships.map((plan) => (
              <article
                key={plan.id}
                className={`flex flex-col rounded-[1.5rem] p-7 sm:p-8 ${
                  plan.featured
                    ? "bg-[#1C211A] text-white lg:-translate-y-2"
                    : "bg-[#F3F5F2]"
                }`}
              >
                <p className={`figma-label ${plan.featured ? "text-[#C8D5C0]" : "text-black/40"}`}>
                  {plan.period}
                </p>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight">{plan.name}</h3>
                <p className="figma-display-l mt-6 !text-[2.75rem]">{plan.price_label}</p>
                <p className={`mt-5 flex-1 text-[14px] leading-relaxed ${plan.featured ? "text-white/65" : "text-black/55"}`}>
                  {plan.description}
                </p>
                <ul className="mt-6 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className={`text-[13px] ${plan.featured ? "text-white/80" : "text-black/65"}`}>
                      · {f}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto px-5 py-20 sm:px-8 lg:px-[5vw] lg:py-28">
        <h2 className="figma-display-l">FAQ</h2>
        <dl className="mt-10 border-t border-black/10">
          {studio.faqs.map((faq) => (
            <div key={faq.id} className="grid gap-3 border-b border-black/10 py-8 md:grid-cols-12">
              <dt className="text-[15px] font-semibold tracking-tight md:col-span-5">{faq.question}</dt>
              <dd className="text-[14px] leading-relaxed text-black/55 md:col-span-7">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Contact CTA band */}
      <section id="contact" className="mx-auto px-5 pb-20 sm:px-8 lg:px-[5vw]">
        <div className="overflow-hidden rounded-[1.75rem] bg-[#1C211A] text-white sm:rounded-[2rem]">
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:p-14">
            <div>
              <p className="figma-label text-[#C8D5C0]">Locatie</p>
              <h2 className="figma-display-l mt-4 max-w-[12ch]">{studio.city}</h2>
              <p className="mt-6 text-[15px] leading-7 text-white/65">{fullAddress(studio)}</p>
              <p className="mt-2 text-[13px] text-white/40">{studio.opening_hours}</p>
            </div>
            <div className="flex flex-col justify-end">
              <div className="space-y-2 text-[14px]">
                <p>
                  <a href={`tel:${studio.phone.replace(/\s/g, "")}`} className="underline decoration-[#C8D5C0] underline-offset-4">
                    {studio.phone}
                  </a>
                </p>
                <p>
                  <a href={`mailto:${studio.email}`} className="underline decoration-[#C8D5C0] underline-offset-4">
                    {studio.email}
                  </a>
                </p>
              </div>
              <a
                href={studio.booking_url}
                className="figma-label mt-8 inline-flex h-12 w-fit items-center rounded-full bg-[#C8D5C0] px-6 text-[#1C211A] transition-transform hover:-translate-y-0.5"
              >
                Reserveer nu
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/5 bg-white px-5 py-8 sm:px-8 lg:px-[5vw]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[15px] font-semibold">{studio.studio_name}</p>
          <p className="figma-label text-black/35">{studio.city} · {studio.country}</p>
        </div>
      </footer>
    </div>
  );
}

function splitHeadline(tagline: string): { primary: string; accent: string | null } {
  const words = tagline.trim().split(/\s+/);
  if (words.length < 3) {
    return { primary: tagline, accent: null };
  }
  const mid = Math.ceil(words.length / 2);
  return {
    primary: words.slice(0, mid).join(" "),
    accent: words.slice(mid).join(" "),
  };
}
