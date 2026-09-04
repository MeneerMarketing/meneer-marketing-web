"use client";

import { FormEvent, useState } from "react";
import type { ClinicModel } from "@/components/templates/reformer-minimal/clinicModel";

interface Props {
  model: ClinicModel;
}

/** Donkere footer: nieuwsbrief, navigatie en juridische links. */
export function ClinicContact({ model }: Props) {
  const { contact, city, booking, studioName } = model;
  const [newsletterDone, setNewsletterDone] = useState(false);

  function onNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNewsletterDone(true);
  }

  return (
    <section id="contact" className="fc-plane-dark">
      <div className="mx-auto px-5 py-10 sm:px-8 sm:py-14 lg:px-[5vw] lg:py-16">
        <footer>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10 lg:gap-y-0">
            <div className="lg:col-span-4">
              <p className="figma-label text-[var(--fc-on-dark-label)]">Nieuwsbrief</p>
              <h3 className="mt-2 text-[1.2rem] font-semibold tracking-tight text-[var(--fc-on-dark)] sm:mt-3 sm:text-[1.35rem]">
                Studio-updates in je inbox
              </h3>
              <p className="mt-2 max-w-[36ch] text-[13px] leading-6 text-[var(--fc-on-dark-body)] sm:mt-3 sm:text-[14px]">
                Nieuwe lessen, openingsuren en soft openings. Kort en rustig.
              </p>
              {newsletterDone ? (
                <p className="mt-4 text-[14px] text-[var(--fc-on-dark)]">
                  Bedankt. Je staat op de lijst.
                </p>
              ) : (
                <form
                  onSubmit={onNewsletter}
                  className="mt-4 flex max-w-md gap-2 sm:mt-5 sm:gap-3"
                >
                  <label className="sr-only" htmlFor="clinic-newsletter-email">
                    E-mailadres
                  </label>
                  <input
                    id="clinic-newsletter-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="jouw@email.nl"
                    className="h-11 min-w-0 flex-1 rounded-full border border-white/20 bg-white/5 px-4 text-[14px] text-[var(--fc-on-dark)] placeholder:text-[var(--fc-on-dark-body)]/60 outline-none transition focus:border-white/45 sm:h-12 sm:px-5"
                  />
                  <button
                    type="submit"
                    className="figma-btn figma-btn-soft h-11 shrink-0 px-4 text-[11px] sm:h-12 sm:px-6"
                  >
                    Aanmelden
                  </button>
                </form>
              )}
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 lg:col-span-8 lg:gap-x-8">
              <FooterCol
                title="Studio"
                links={[
                  { href: "#lessen", label: "Lessen" },
                  { href: "#rooster", label: "Rooster" },
                  { href: "#team", label: "Team" },
                  { href: "#studio", label: "De studio" },
                ]}
              />
              <FooterCol
                title="Boeken"
                links={[
                  { href: "#tarieven", label: "Abonnementen" },
                  {
                    href: booking.href,
                    label: booking.label,
                    external: booking.external,
                  },
                  { href: "#faq", label: "Veelgestelde vragen" },
                  { href: "#contact", label: "Contact" },
                ]}
              />
              <FooterCol
                title="Info"
                links={[
                  { href: "#ervaringen", label: "Reviews" },
                  ...(contact.instagram
                    ? [
                        {
                          href: contact.instagram,
                          label: "Instagram",
                          external: true,
                        },
                      ]
                    : []),
                  ...(contact.email
                    ? [{ href: `mailto:${contact.email}`, label: "E-mail" }]
                    : []),
                  ...(contact.phone
                    ? [
                        {
                          href: `tel:${contact.phone.replace(/\s/g, "")}`,
                          label: "Bellen",
                        },
                      ]
                    : []),
                ]}
              />
              <FooterCol
                title="Juridisch"
                links={[
                  { href: "#privacy", label: "Privacybeleid" },
                  { href: "#voorwaarden", label: "Algemene voorwaarden" },
                  { href: "#cookies", label: "Cookiebeleid" },
                  { href: "#annuleren", label: "Annuleringsbeleid" },
                ]}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-5 sm:mt-10 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:pt-6">
            <div>
              <p className="text-[15px] font-semibold text-[var(--fc-on-dark)]">
                {studioName}
              </p>
              {(contact.address || contact.hours) && (
                <div className="mt-1.5 space-y-0.5 text-[12px] leading-5 text-[var(--fc-on-dark-body)]/80">
                  {contact.address ? <p>{contact.address}</p> : null}
                  {contact.hours ? <p>{contact.hours}</p> : null}
                </div>
              )}
              <p className="mt-2 text-[11px] text-[var(--fc-on-dark-body)]/50">
                Conceptvoorstel. Juridische pagina&apos;s volgen bij livegang.
              </p>
            </div>
            <p className="figma-label text-[var(--fc-on-dark-label)]">
              {city} · Nederland
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string; external?: boolean }[];
}) {
  return (
    <div>
      <p className="figma-label text-[var(--fc-on-dark-label)]">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <a
              href={link.href}
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="text-[13px] text-[var(--fc-on-dark-body)] transition hover:text-[var(--fc-on-dark)] sm:text-[14px]"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ClinicStickyCta({
  booking,
}: {
  booking: ClinicModel["booking"];
}) {
  return (
    <div className="figma-sticky">
      <a
        href={booking.href}
        {...(booking.external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className="figma-btn figma-btn-solid w-full"
      >
        {booking.label}
      </a>
    </div>
  );
}
