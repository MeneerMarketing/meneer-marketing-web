"use client";

import { FormEvent, useState, type ReactNode } from "react";
import type { SkinClinicMinimalModel } from "@/components/templates/clinical-minimal/skinClinicMinimalModel";

function FooterIcon({ name }: { name: "pin" | "clock" | "phone" | "mail" | "instagram" }) {
  const paths = {
    pin: (
      <>
        <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l2.5 1.5" />
      </>
    ),
    phone: <path d="M7.5 4.2 5 6.7c0 5.2 3.6 9.8 8.5 11.3l2.5-2.5-2.8-2.1 1.4-3.4-3.3-1.4z" />,
    mail: (
      <>
        <rect x="4" y="6" width="16" height="12" rx="2" />
        <path d="m4 8 8 5 8-5" />
      </>
    ),
    instagram: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.2" />
        <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
      </>
    ),
  } as const;

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0 text-white/55"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[name]}
    </svg>
  );
}

function FooterCard({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex h-full min-h-[17.5rem] flex-col rounded-[var(--fc-radius-lg)] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-7 lg:min-h-[19rem] lg:p-8 ${className}`}
    >
      <p className="figma-label text-white/48">{label}</p>
      <div className="mt-4 flex flex-1 flex-col">{children}</div>
    </div>
  );
}

function ContactRow({
  icon,
  children,
}: {
  icon: "pin" | "clock" | "phone" | "mail";
  children: ReactNode;
}) {
  return (
    <li className="flex items-start gap-3 text-[14px] leading-6 text-white/68">
      <FooterIcon name={icon} />
      <span className="min-w-0">{children}</span>
    </li>
  );
}

export function SkinClinicMinimalContact({
  model,
}: {
  model: SkinClinicMinimalModel;
}) {
  const { contact, city, booking, studioName, navLinks, ratingDisplay, reviewCount } = model;
  const [newsletterDone, setNewsletterDone] = useState(false);

  function onNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNewsletterDone(true);
  }

  const navMid = Math.ceil(navLinks.length / 2);
  const navColA = navLinks.slice(0, navMid);
  const navColB = navLinks.slice(navMid);

  return (
    <section id="contact" className="sc-footer-surface relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="relative mx-auto px-5 py-16 sm:px-8 sm:py-18 lg:px-[5vw] lg:py-20">
        <footer>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4 xl:gap-6">
            <FooterCard label="Nieuwsbrief">
              <h3 className="text-[1.15rem] font-semibold tracking-tight text-white sm:text-[1.25rem]">
                Huidtips en kliniekupdates
              </h3>
              <p className="mt-3 max-w-[34ch] flex-1 text-[13px] leading-6 text-white/62 sm:text-[14px] sm:leading-7">
                Seizoensadvies, nieuwe behandelingen en vrije intake-momenten. Eén
                keer per maand, zonder spam.
              </p>
              <div className="mt-6">
                {newsletterDone ? (
                  <p className="text-[14px] text-white/88">Bedankt. Je staat op de lijst.</p>
                ) : (
                  <form onSubmit={onNewsletter} className="flex flex-col gap-2.5 sm:flex-row">
                    <label className="sr-only" htmlFor="skin-clinic-newsletter-email">
                      E-mailadres
                    </label>
                    <input
                      id="skin-clinic-newsletter-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="jouw@email.nl"
                      className="h-11 min-w-0 flex-1 rounded-full border border-white/18 bg-white/[0.06] px-4 text-[14px] text-white placeholder:text-white/40 outline-none transition focus:border-white/40 sm:h-12 sm:px-5"
                    />
                    <button
                      type="submit"
                      className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-white px-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1a1520] transition hover:bg-white/92 sm:h-12 sm:px-6"
                    >
                      Aanmelden
                    </button>
                  </form>
                )}
              </div>
            </FooterCard>

            <FooterCard label="Contact">
              <ul className="space-y-4">
                {contact.address ? (
                  <ContactRow icon="pin">{contact.address}</ContactRow>
                ) : null}
                {contact.hours ? <ContactRow icon="clock">{contact.hours}</ContactRow> : null}
                {contact.phone ? (
                  <ContactRow icon="phone">
                    <a
                      href={`tel:${contact.phone.replace(/\s/g, "")}`}
                      className="transition-colors hover:text-white"
                    >
                      {contact.phone}
                    </a>
                  </ContactRow>
                ) : null}
                {contact.email ? (
                  <ContactRow icon="mail">
                    <a href={`mailto:${contact.email}`} className="transition-colors hover:text-white">
                      {contact.email}
                    </a>
                  </ContactRow>
                ) : null}
              </ul>
              {contact.instagram ? (
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-2 pt-6 text-[12px] font-medium uppercase tracking-[0.12em] text-white/72 transition-colors hover:text-white"
                >
                  <FooterIcon name="instagram" />
                  Instagram
                </a>
              ) : (
                <span className="mt-auto block pt-6" />
              )}
            </FooterCard>

            <FooterCard label="Navigatie">
              <div className="grid flex-1 grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                <ul className="space-y-2.5 text-[14px]">
                  {navColA.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-white/68 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-2.5 text-[14px]">
                  {navColB.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-white/68 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-auto pt-6 text-[12px] leading-5 text-white/45">
                {studioName}
                {city ? ` · ${city}` : ""}
              </p>
            </FooterCard>

            <FooterCard
              label="Afspraak"
              className="border-white/16 bg-white/[0.07] shadow-[0_24px_60px_-36px_rgba(0,0,0,0.65)]"
            >
              <p className="text-[1.05rem] font-semibold leading-snug tracking-tight text-white">
                Klaar voor je eerste gesprek?
              </p>
              <p className="mt-3 flex-1 text-[13px] leading-6 text-white/65 sm:text-[14px] sm:leading-7">
                Plan een vrijblijvende intake. We kijken naar je huid, je doelen en welk
                traject logisch is om te starten.
              </p>

              {ratingDisplay ? (
                <p className="mt-4 text-[12px] text-white/55">
                  <span className="font-semibold text-white">{ratingDisplay}</span>
                  {reviewCount > 0 ? ` · ${reviewCount} reviews` : null}
                </p>
              ) : null}

              <div className="mt-6 space-y-2.5">
                <a
                  href={booking.href}
                  {...(booking.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1a1520] transition hover:bg-white/92"
                >
                  {booking.label}
                </a>
                {contact.phone ? (
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="inline-flex h-11 w-full items-center justify-center rounded-full border border-white/22 bg-transparent px-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/85 transition hover:border-white/40 hover:bg-white/[0.06]"
                  >
                    Bel de kliniek
                  </a>
                ) : null}
              </div>
            </FooterCard>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 text-[11px] text-white/48 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {studioName}. Concept preview.
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <a href="#contact" className="transition-colors hover:text-white/75">
                Privacy
              </a>
              <span aria-hidden className="text-white/25">
                ·
              </span>
              <a href="#contact" className="transition-colors hover:text-white/75">
                Algemene voorwaarden
              </a>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}

export function SkinClinicMinimalStickyCta({
  booking,
}: {
  booking: SkinClinicMinimalModel["booking"];
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-3 md:hidden">
      <a
        href={booking.href}
        {...(booking.external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className="pointer-events-auto figma-btn figma-btn-dark flex h-12 w-full items-center justify-center text-[12px] shadow-lg"
      >
        {booking.label}
      </a>
    </div>
  );
}
