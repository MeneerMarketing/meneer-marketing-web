"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import type { CineModel } from "@/components/templates/cinematic/cinematicModel";

interface Props {
  model: CineModel;
  variant?: "pilates" | "skin-clinic";
}

interface FooterLink {
  href: string;
  label: string;
  external?: boolean;
}

function instagramHandle(url: string): string {
  const match = url.match(/instagram\.com\/([^/?#]+)/i);
  return match?.[1] ? `@${match[1]}` : "instagram";
}

function FooterCol({
  title,
  links,
  pending,
}: {
  title: string;
  links: FooterLink[];
  /** Onderdelen die bij de echte site horen maar in dit concept nog geen pagina hebben. */
  pending?: string[];
}) {
  return (
    <div>
      <p className="cine-label text-[rgba(246,241,232,0.5)]">{title}</p>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <a
              href={link.href}
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="text-[13.5px] leading-6 text-[var(--cn-on-dark-soft)] transition-colors duration-300 ease-[var(--cn-ease)] hover:text-[var(--cn-on-dark)]"
            >
              {link.label}
            </a>
          </li>
        ))}
        {pending?.map((label) => (
          <li
            key={label}
            className="text-[13.5px] leading-6 text-[rgba(246,241,232,0.35)]"
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Afsluiting en footer in één donker vlak: uitnodiging bovenaan, gegevens en
 * menu's in kolommen, en een compacte signatuurregel onderaan.
 */
export function CinematicContact({ model, variant = "pilates" }: Props) {
  const { studioName, city, booking, contact, hours, navLinks, faqs } = model;
  const [email, setEmail] = useState("");
  const [signed, setSigned] = useState(false);

  // Home en contact staan al elders in de footer.
  const sectionLinks: FooterLink[] = navLinks.filter(
    (link) => link.href !== "#top" && link.href !== "#contact" && link.href !== "#faq"
  );

  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-[var(--cn-dark-2)] text-[var(--cn-on-dark)]"
    >
      <div aria-hidden className="cine-grain pointer-events-none absolute inset-0" />

      <div className="relative mx-auto px-5 pb-28 pt-16 sm:px-8 sm:pb-28 sm:pt-20 lg:px-10 lg:pt-24">
        <ScrollReveal>
          <div className="flex flex-col gap-8 border-b border-white/12 pb-14 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="cine-label text-[rgba(246,241,232,0.5)]">Contact</p>
              <h2 className="cine-display cine-display-l cine-lower mt-5">
                kom een keer
                <br />
                <span className="cine-italic">
                  {city
                    ? `langs in ${city.toLowerCase()}.`
                    : variant === "skin-clinic"
                      ? "langs in de kliniek."
                      : "langs in de studio."}
                </span>
              </h2>
            </div>

            <div className="flex flex-col items-start gap-5 lg:items-end">
              {contact.phone ? (
                <a
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="cine-display text-[1.5rem] leading-none transition-colors duration-300 hover:text-[rgba(246,241,232,0.7)] sm:text-[1.75rem]"
                >
                  {contact.phone}
                </a>
              ) : null}
              <a
                href={booking.href}
                {...(booking.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="cine-pill cine-pill-solid"
              >
                {booking.label}
              </a>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.1fr_repeat(3,0.63fr)] lg:gap-12">
          <ScrollReveal>
            <div>
              <p className="cine-label text-[rgba(246,241,232,0.5)]">Nieuwsbrief</p>
              <p className="mt-5 max-w-[30ch] text-[13.5px] leading-6 text-[var(--cn-on-dark-soft)]">
                {variant === "skin-clinic"
                  ? "Een korte mail bij nieuwe behandelingen, seizoensadvies of intake-momenten."
                  : "Een korte mail als er lessen bijkomen of het rooster verandert."}
              </p>

              {signed ? (
                <p className="mt-6 text-[13.5px] leading-6 text-[var(--cn-on-dark)]">
                  {variant === "skin-clinic"
                    ? "Je staat erop. Tot in de kliniek."
                    : "Je staat erop. Tot in de studio."}
                </p>
              ) : (
                <form
                  className="mt-6 flex items-center gap-3 border-b border-white/25 pb-3 transition-colors duration-300 focus-within:border-white/70"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (email.trim()) setSigned(true);
                  }}
                >
                  <label htmlFor="cine-newsletter" className="sr-only">
                    E-mailadres
                  </label>
                  <input
                    id="cine-newsletter"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="jouw@email.nl"
                    className="min-w-0 flex-1 bg-transparent text-[14px] text-[var(--cn-on-dark)] outline-none placeholder:text-[rgba(246,241,232,0.4)]"
                  />
                  <button
                    type="submit"
                    className="shrink-0 text-[var(--cn-on-dark-soft)] transition-transform duration-500 ease-[var(--cn-ease)] hover:translate-x-1 hover:text-[var(--cn-on-dark)]"
                    aria-label="Inschrijven voor de nieuwsbrief"
                  >
                    →
                  </button>
                </form>
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={70}>
            <div>
              <p className="cine-label text-[rgba(246,241,232,0.5)]">Studio</p>
              <address className="mt-5 space-y-3 text-[13.5px] not-italic leading-6 text-[var(--cn-on-dark-soft)]">
                {contact.address ? <p>{contact.address}</p> : null}
                {contact.email ? (
                  <p>
                    <a
                      href={`mailto:${contact.email}`}
                      className="transition-colors duration-300 hover:text-[var(--cn-on-dark)]"
                    >
                      {contact.email}
                    </a>
                  </p>
                ) : null}
                {hours ? (
                  <p className="text-[rgba(246,241,232,0.55)]">{hours}</p>
                ) : null}
              </address>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={140}>
            <FooterCol
              title="In de studio"
              // Volgt het hoofdmenu, dat alleen secties toont die ook bestaan.
              links={[
                ...sectionLinks,
                ...(contact.instagram
                  ? [
                      {
                        href: contact.instagram,
                        label: instagramHandle(contact.instagram),
                        external: true,
                      },
                    ]
                  : []),
              ]}
            />
          </ScrollReveal>

          <ScrollReveal delayMs={210}>
            <FooterCol
              title="Klein maar nodig"
              links={[
                ...(faqs.length > 0
                  ? [{ href: "#faq", label: "Veelgestelde vragen" }]
                  : []),
                ...(contact.email
                  ? [{ href: `mailto:${contact.email}`, label: "Stel je vraag", external: true }]
                  : []),
              ]}
              // Deze pagina's horen bij de uiteindelijke site. In het concept
              // benoemen we ze wel, maar we linken niet naar iets dat er nog
              // niet is.
              pending={["Privacybeleid", "Algemene voorwaarden", "Annuleringsbeleid"]}
            />
          </ScrollReveal>
        </div>

        <div className="border-t border-white/12 pt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="cine-label text-[rgba(246,241,232,0.45)]">
              {studioName}
              {city ? ` · ${city}` : ""}
            </p>
            <p className="cine-label text-[rgba(246,241,232,0.45)]">
              {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
