import Image from "next/image";
import type { StudioData } from "@/types/studio";
import { ConceptBanner } from "@/components/preview/ConceptBanner";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { EditorialServices } from "@/components/templates/editorial/EditorialServices";
import { KineticTagline } from "@/components/templates/editorial/KineticTagline";
import { formatRating, fullAddress, getImageByRole, getImagesByRole } from "@/lib/studio";

interface Props {
  studio: StudioData;
}

export function EditorialTemplate({ studio }: Props) {
  const hero = getImageByRole(studio, "hero");
  const reformer = getImageByRole(studio, "reformer");
  const studioImg = getImageByRole(studio, "studio");
  const atmosphere = getImageByRole(studio, "atmosphere");
  const gallery = getImagesByRole(studio, "gallery");
  const tagWords = studio.tagline.split(" ");
  const serviceImages = [
    reformer && { url: reformer.url, alt: reformer.alt },
    atmosphere && { url: atmosphere.url, alt: atmosphere.alt },
    studioImg && { url: studioImg.url, alt: studioImg.alt },
    gallery[0] && { url: gallery[0].url, alt: gallery[0].alt },
  ].filter(Boolean) as { url: string; alt: string }[];

  return (
    <div className="editorial-root relative bg-[#F8F5F0] text-[#141210] pb-14">
      <ConceptBanner studio={studio} tone="light" />

      <header className="relative z-20">
        <div className="mx-auto flex max-w-[1440px] items-baseline justify-between px-6 py-7 md:px-12 lg:px-16">
          <a
            href="#top"
            className="font-[family-name:var(--font-editorial-serif)] text-[1.65rem] tracking-tight"
          >
            {studio.studio_name}
          </a>
          <nav className="hidden items-center gap-11 text-[11px] uppercase tracking-[0.24em] text-[#141210]/55 md:flex">
            <a href="#studio" className="hover:text-[#141210]">Studio</a>
            <a href="#lessen" className="hover:text-[#141210]">Lessen</a>
            <a href="#tarieven" className="hover:text-[#141210]">Tarieven</a>
            <a href="#contact" className="hover:text-[#141210]">Contact</a>
          </nav>
          <a
            href={studio.booking_url}
            className="text-[11px] uppercase tracking-[0.24em] underline decoration-[#BFA78A] underline-offset-[10px] transition-opacity hover:opacity-60"
          >
            Reserveer
          </a>
        </div>
      </header>

      {/* Hero: kinetic tagline + tall editorial crop */}
      <section id="top" className="overflow-hidden">
        <div className="mx-auto grid max-w-[1440px] grid-cols-12 px-6 pb-16 pt-10 md:px-12 md:pt-16 lg:px-16 lg:pb-24">
          <div className="col-span-12 lg:col-span-7 lg:pr-10">
            <p className="mb-8 text-[11px] uppercase tracking-[0.3em] text-[#8F7A62]">
              {studio.city} · {studio.primary_service}
            </p>
            <KineticTagline
              words={tagWords}
              className="font-[family-name:var(--font-editorial-serif)] text-[clamp(2.8rem,7.5vw,6.25rem)] leading-[0.95] tracking-[-0.02em]"
            />
            <div className="mt-14 max-w-md border-l border-[#BFA78A] pl-6">
              <p className="text-[15px] leading-relaxed text-[#141210]/70 md:text-base">
                {studio.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-[11px] uppercase tracking-[0.2em] text-[#8F7A62]">
                <span>{formatRating(studio.review_rating)} · {studio.review_count} reviews</span>
                {studio.founded_year > 0 ? <span>Sinds {studio.founded_year}</span> : null}
              </div>
            </div>
          </div>

          <div className="col-span-12 mt-12 lg:col-span-5 lg:mt-0 lg:pt-8">
            <div className="relative ml-auto aspect-[3/4] w-full max-w-lg overflow-hidden">
              {hero && (
                <Image
                  src={hero.url}
                  alt={hero.alt}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-7">
                <p className="font-[family-name:var(--font-editorial-serif)] text-2xl text-white">
                  {studio.studio_name}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-white/65">
                  {studio.city}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="studio" className="border-t border-[#141210]/10">
        <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-8 px-6 py-24 md:px-12 lg:px-16 lg:py-32">
          <ScrollReveal className="col-span-12 md:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#8F7A62]">De studio</p>
            <h2 className="mt-4 font-[family-name:var(--font-editorial-serif)] text-4xl leading-[1.05] md:text-5xl lg:text-[3.4rem]">
              Een ruimte voor precisie.
            </h2>
          </ScrollReveal>
          <ScrollReveal className="col-span-12 md:col-span-6 md:col-start-7" delayMs={80}>
            <p className="text-lg leading-relaxed text-[#141210]/70 md:text-xl">
              {studio.description} Maximaal zes reformers. Instructeurs die jouw naam kennen.
            </p>
            <dl className="mt-12 grid grid-cols-2 gap-8 border-t border-[#141210]/10 pt-10">
              <div>
                <dt className="text-[11px] uppercase tracking-[0.2em] text-[#8F7A62]">Locatie</dt>
                <dd className="mt-2 font-[family-name:var(--font-editorial-serif)] text-2xl">
                  {studio.city}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.2em] text-[#8F7A62]">Focus</dt>
                <dd className="mt-2 font-[family-name:var(--font-editorial-serif)] text-2xl">
                  {studio.primary_service}
                </dd>
              </div>
            </dl>
          </ScrollReveal>
          {studioImg && (
            <ScrollReveal className="col-span-12 mt-6">
              <div className="relative aspect-[21/9] overflow-hidden">
                <Image src={studioImg.url} alt={studioImg.alt} fill className="object-cover" sizes="100vw" />
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* Unique services: hover magazine swap */}
      <section id="lessen" className="bg-[#141210] text-[#F8F5F0]">
        <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 lg:px-16 lg:py-28">
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#BFA78A]">Aanbod</p>
              <h2 className="mt-3 font-[family-name:var(--font-editorial-serif)] text-4xl md:text-5xl">
                Lessen & trajecten
              </h2>
            </div>
            <p className="max-w-xs text-sm text-[#F8F5F0]/45">
              Hover of tik een les. Het beeld wisselt mee.
            </p>
          </div>
          <EditorialServices services={studio.services} images={serviceImages} />
        </div>
      </section>

      <section className="border-b border-[#141210]/10">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-12">
          <div className="relative aspect-[4/5] lg:col-span-6 lg:aspect-auto lg:min-h-[640px]">
            {reformer && (
              <Image src={reformer.url} alt={reformer.alt} fill className="object-cover" sizes="50vw" />
            )}
          </div>
          <div className="flex flex-col justify-center px-6 py-20 md:px-12 lg:col-span-6 lg:px-16">
            <ScrollReveal>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#8F7A62]">
                {studio.primary_service}
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-editorial-serif)] text-4xl leading-tight md:text-5xl">
                De reformer als instrument.
              </h2>
              <p className="mt-8 max-w-md text-base leading-relaxed text-[#141210]/65">
                Veren, carriage, straps. Bij {studio.studio_name} leer je hoe je lichaam beweegt
                onder druk, met lengte en controle.
              </p>
              <ul className="mt-12 space-y-6">
                {studio.benefits.slice(0, 3).map((b) => (
                  <li key={b.id} className="border-l border-[#BFA78A] pl-5">
                    <p className="font-[family-name:var(--font-editorial-serif)] text-xl">{b.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[#141210]/55">{b.description}</p>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="bg-[#EBE4D8]">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-px bg-[#141210]/10 sm:grid-cols-2 lg:grid-cols-4">
          {studio.benefits.map((b) => (
            <ScrollReveal key={b.id} className="bg-[#EBE4D8] px-8 py-12">
              <h3 className="font-[family-name:var(--font-editorial-serif)] text-2xl">{b.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-[#141210]/60">{b.description}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-24 md:px-12 lg:px-16 lg:py-32">
        <div className="mb-14 flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#8F7A62]">Reviews</p>
            <h2 className="mt-3 font-[family-name:var(--font-editorial-serif)] text-4xl md:text-5xl">
              Wat leden zeggen
            </h2>
          </div>
          <p className="hidden font-[family-name:var(--font-editorial-serif)] text-6xl text-[#BFA78A] md:block">
            {formatRating(studio.review_rating)}
          </p>
        </div>
        <div className="grid gap-12 md:grid-cols-3">
          {studio.reviews.map((review) => (
            <blockquote key={review.id} className="flex flex-col border-t border-[#141210]/12 pt-8">
              <p className="flex-1 font-[family-name:var(--font-editorial-serif)] text-xl leading-snug md:text-2xl">
                &ldquo;{review.text}&rdquo;
              </p>
              <footer className="mt-8">
                <cite className="not-italic text-[11px] uppercase tracking-[0.18em]">{review.author}</cite>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="border-t border-[#141210]/10 bg-[#FBF9F5]">
        <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-12 lg:px-16 lg:py-32">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#8F7A62]">Instructors</p>
          <h2 className="mt-3 font-[family-name:var(--font-editorial-serif)] text-4xl md:text-5xl">
            Het team
          </h2>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {studio.team.map((member, i) => (
              <article key={member.id} className={i === 1 ? "md:mt-14" : i === 2 ? "md:mt-7" : ""}>
                <div className="relative aspect-[3/4] overflow-hidden bg-[#EBE4D8]">
                  <Image src={member.image_url} alt={member.name} fill className="object-cover" sizes="33vw" />
                </div>
                <h3 className="mt-6 font-[family-name:var(--font-editorial-serif)] text-2xl">{member.name}</h3>
                <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#8F7A62]">{member.role}</p>
                <p className="mt-4 text-sm leading-relaxed text-[#141210]/60">{member.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-3 px-6 py-16 md:px-12 lg:px-16">
          {atmosphere && (
            <div className="relative col-span-12 aspect-[16/10] overflow-hidden md:col-span-8">
              <Image src={atmosphere.url} alt={atmosphere.alt} fill className="object-cover" sizes="70vw" />
            </div>
          )}
          {gallery[0] && (
            <div className="relative col-span-12 aspect-[4/5] overflow-hidden md:col-span-4">
              <Image src={gallery[0].url} alt={gallery[0].alt} fill className="object-cover" sizes="30vw" />
            </div>
          )}
        </div>
      </section>

      <section id="tarieven" className="border-t border-[#141210]/10">
        <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-12 lg:px-16 lg:py-32">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#8F7A62]">Memberships</p>
          <h2 className="mt-3 max-w-xl font-[family-name:var(--font-editorial-serif)] text-4xl md:text-5xl">
            Tarieven die meegroeien
          </h2>
          <div className="mt-14 divide-y divide-[#141210]/12">
            {studio.memberships.map((plan) => (
              <div
                key={plan.id}
                className={`grid grid-cols-1 gap-6 py-12 md:grid-cols-12 ${
                  plan.featured ? "bg-[#141210] px-6 text-[#F8F5F0] md:-mx-6 md:px-10" : ""
                }`}
              >
                <div className="md:col-span-3">
                  <h3 className="font-[family-name:var(--font-editorial-serif)] text-2xl md:text-3xl">
                    {plan.name}
                  </h3>
                </div>
                <div className="md:col-span-2">
                  <p className="font-[family-name:var(--font-editorial-serif)] text-4xl">{plan.price_label}</p>
                  <p className={`mt-1 text-[11px] uppercase tracking-[0.18em] ${plan.featured ? "text-[#BFA78A]" : "text-[#8F7A62]"}`}>
                    {plan.period}
                  </p>
                </div>
                <p className={`md:col-span-4 text-sm leading-relaxed ${plan.featured ? "text-[#F8F5F0]/65" : "text-[#141210]/60"}`}>
                  {plan.description}
                </p>
                <ul className={`md:col-span-3 space-y-2 text-sm ${plan.featured ? "text-[#F8F5F0]/75" : "text-[#141210]/65"}`}>
                  {plan.features.map((f) => (
                    <li key={f}>· {f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#EBE4D8]">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-24 md:grid-cols-12 md:px-12 lg:px-16 lg:py-32">
          <div className="md:col-span-4">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#8F7A62]">FAQ</p>
            <h2 className="mt-3 font-[family-name:var(--font-editorial-serif)] text-4xl">Vragen</h2>
          </div>
          <dl className="md:col-span-7 md:col-start-6 divide-y divide-[#141210]/12">
            {studio.faqs.map((faq) => (
              <div key={faq.id} className="py-8 first:pt-0">
                <dt className="font-[family-name:var(--font-editorial-serif)] text-xl md:text-2xl">{faq.question}</dt>
                <dd className="mt-3 text-sm leading-relaxed text-[#141210]/60 md:text-base">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="contact" className="border-t border-[#141210]/10">
        <div className="mx-auto grid max-w-[1440px] gap-16 px-6 py-24 md:grid-cols-2 md:px-12 lg:px-16 lg:py-32">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#8F7A62]">Contact</p>
            <h2 className="mt-3 font-[family-name:var(--font-editorial-serif)] text-4xl md:text-5xl">
              Kom langs in {studio.city}
            </h2>
            <p className="mt-8 text-base text-[#141210]/65">{fullAddress(studio)}</p>
            <p className="mt-2 text-sm text-[#8F7A62]">{studio.opening_hours}</p>
            <div className="mt-10 space-y-3 text-sm">
              <p><a href={`tel:${studio.phone.replace(/\s/g, "")}`} className="underline decoration-[#BFA78A] underline-offset-4">{studio.phone}</a></p>
              <p><a href={`mailto:${studio.email}`} className="underline decoration-[#BFA78A] underline-offset-4">{studio.email}</a></p>
            </div>
          </div>
          <div className="flex flex-col justify-end">
            <a
              href={studio.booking_url}
              className="inline-flex w-full items-center justify-center border border-[#141210] bg-[#141210] px-8 py-5 text-[11px] uppercase tracking-[0.24em] text-[#F8F5F0] transition-colors hover:bg-transparent hover:text-[#141210] md:w-auto md:self-start"
            >
              Plan je eerste les
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-[#141210] text-[#F8F5F0]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-6 py-12 md:flex-row md:items-center md:justify-between md:px-12 lg:px-16">
          <p className="font-[family-name:var(--font-editorial-serif)] text-xl">{studio.studio_name}</p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">{studio.city} · {studio.country}</p>
        </div>
      </footer>
    </div>
  );
}
