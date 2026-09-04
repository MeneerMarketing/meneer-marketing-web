import type { ReactNode } from "react";

import { EditorialIcon } from "@/components/templates/editorial/EditorialIcon";
import type { EditorialModel } from "@/components/templates/editorial/editorialModel";
import { StudioBrandMark } from "@/components/templates/StudioBrandMark";
import { plainText } from "@/lib/text";

interface Props {
  studioName: string;
  logoUrl: string | null;
  city: string;
  country: string;
  links: EditorialModel["navLinks"];
  contact: EditorialModel["contact"];
  booking: EditorialModel["booking"];
  tagline?: string | null;
}

function instagramHandle(url: string): string {
  const match = url.match(/instagram\.com\/([^/?#]+)/i);
  return match?.[1] ? `@${match[1]}` : "Instagram";
}

function mapsHref(address: string, city: string): string {
  const q = [address, city].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

function FooterLinkRow({
  href,
  label,
  icon,
  external,
}: {
  href: string;
  label: string;
  icon: "phone" | "mail" | "instagram" | "map-pin";
  external?: boolean;
}) {
  return (
    <li>
      <a
        href={href}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className="group flex items-center gap-3 py-1.5 text-[0.95rem] text-[var(--ed-fg-70)] transition-colors duration-300 hover:text-[var(--ed-fg)]"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--ed-line)] bg-[var(--ed-bg-raised)] text-[var(--ed-accent)] transition-colors duration-300 group-hover:border-[var(--ed-accent-line)] group-hover:bg-[color-mix(in_oklab,var(--ed-accent)_12%,transparent)]">
          <EditorialIcon name={icon} className="h-[15px] w-[15px]" />
        </span>
        <span className="ed-link">{label}</span>
      </a>
    </li>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="ed-label text-[var(--ed-accent)]">{title}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

export function EditorialFooter({
  studioName,
  logoUrl,
  city,
  country,
  links,
  contact,
  booking,
  tagline,
}: Props) {
  const year = new Date().getFullYear();
  const locationLine = [plainText(city), plainText(country)]
    .filter(Boolean)
    .join(" · ");

  const navLinks = links.filter(
    (link) => link.href !== "#top" && link.href !== "#contact",
  );

  return (
    <footer className="ed-deep relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 ed-glow opacity-80"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--ed-accent-line)] to-transparent"
      />

      <div className="relative mx-auto max-w-[1440px] px-5 pb-28 pt-14 md:px-10 md:pb-24 md:pt-16 lg:px-16 lg:pt-20">
        {/* Merk + CTA */}
        <div className="flex flex-col gap-8 border-b border-[var(--ed-line)] pb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <a href="#top" className="inline-block">
              <StudioBrandMark
                studioName={studioName}
                logoUrl={logoUrl}
                variant="editorial"
                onMedia
                size="footer"
              />
            </a>
            <p className="mt-4 max-w-[34ch] text-[0.95rem] leading-relaxed text-[var(--ed-fg-52)]">
              {tagline?.trim() ||
                (city
                  ? `Lessen in ${city}. Boek online en kom langs in de studio.`
                  : "Boek online en kom langs in de studio.")}
            </p>
          </div>

          <a
            href={booking.href}
            {...(booking.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="ed-btn group inline-flex h-12 w-full items-center justify-center gap-2.5 border border-[var(--ed-accent-line)] bg-[var(--ed-accent)] px-7 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--ed-bg)] transition-colors duration-500 md:w-auto"
          >
            {booking.label}
            <EditorialIcon
              name="arrow"
              className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5"
            />
          </a>
        </div>

        {/* Kolommen */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <FooterCol title="Bezoek">
              <ul className="space-y-1">
                {contact.address ? (
                  <FooterLinkRow
                    href={mapsHref(plainText(contact.address), city)}
                    label={`${plainText(contact.address)}${city ? `, ${city}` : ""}`}
                    icon="map-pin"
                    external
                  />
                ) : city ? (
                  <li className="flex items-start gap-3 py-1.5 text-[0.95rem] text-[var(--ed-fg-70)]">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--ed-line)] bg-[var(--ed-bg-raised)] text-[var(--ed-accent)]">
                      <EditorialIcon name="map-pin" className="h-[15px] w-[15px]" />
                    </span>
                    <span>{city}</span>
                  </li>
                ) : null}

                {contact.hours ? (
                  <li className="flex items-start gap-3 py-1.5 text-[0.95rem] leading-relaxed text-[var(--ed-fg-70)]">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--ed-line)] bg-[var(--ed-bg-raised)] text-[var(--ed-accent)]">
                      <EditorialIcon name="clock" className="h-[15px] w-[15px]" />
                    </span>
                    <span>{plainText(contact.hours)}</span>
                  </li>
                ) : null}
              </ul>
            </FooterCol>
          </div>

          <nav aria-label="Footermenu" className="lg:col-span-3">
            <FooterCol title="Studio">
              <ul className="space-y-2.5">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="ed-label ed-link inline-block py-1 text-[var(--ed-fg-70)] transition-colors hover:text-[var(--ed-fg)]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </FooterCol>
          </nav>

          <div className="lg:col-span-5">
            <FooterCol title="Contact">
              <ul className="space-y-1">
                {contact.phone ? (
                  <FooterLinkRow
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    label={contact.phone}
                    icon="phone"
                  />
                ) : null}
                {contact.email ? (
                  <FooterLinkRow
                    href={`mailto:${contact.email}`}
                    label={contact.email}
                    icon="mail"
                  />
                ) : null}
                {contact.instagram ? (
                  <FooterLinkRow
                    href={contact.instagram}
                    label={instagramHandle(contact.instagram)}
                    icon="instagram"
                    external
                  />
                ) : null}
              </ul>

              {contact.instagram ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  <a
                    href={contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--ed-line)] px-4 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--ed-fg-70)] transition-colors hover:border-[var(--ed-accent-line)] hover:text-[var(--ed-fg)]"
                  >
                    <EditorialIcon name="instagram" className="h-3.5 w-3.5" />
                    Volg ons
                  </a>
                  {contact.phone ? (
                    <a
                      href={`https://wa.me/${contact.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--ed-line)] px-4 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--ed-fg-70)] transition-colors hover:border-[var(--ed-accent-line)] hover:text-[var(--ed-fg)]"
                    >
                      <EditorialIcon name="phone" className="h-3.5 w-3.5" />
                      WhatsApp
                    </a>
                  ) : null}
                </div>
              ) : null}
            </FooterCol>
          </div>
        </div>

        {/* Onderbalk */}
        <div className="flex flex-col gap-4 border-t border-[var(--ed-line)] pt-8 md:flex-row md:items-center md:justify-between">
          <p className="ed-label text-[var(--ed-fg-52)]">
            {locationLine || studioName}
            <span className="mx-2 text-[var(--ed-line)]" aria-hidden>
              |
            </span>
            © {year} {studioName}
          </p>
          <p className="ed-label-xs text-[var(--ed-fg-52)]">
            Privacy · Algemene voorwaarden · Annuleringsbeleid
          </p>
        </div>
      </div>
    </footer>
  );
}
