import type { ReactNode } from "react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { EditorialFigure } from "@/components/templates/editorial/EditorialFigure";
import { EditorialIcon } from "@/components/templates/editorial/EditorialIcon";
import { EditorialPose } from "@/components/templates/editorial/EditorialPose";
import type { EditorialModel } from "@/components/templates/editorial/editorialModel";
import { plainText } from "@/lib/text";

interface Props {
  city: string;
  studioName: string;
  contact: EditorialModel["contact"];
  booking: EditorialModel["booking"];
  image: EditorialModel["contactImage"];
}

function instagramHandle(url: string): string {
  const match = url.match(/instagram\.com\/([^/?#]+)/i);
  return match?.[1] ? `@${match[1]}` : "Instagram";
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <li className="group relative flex flex-col gap-1.5 py-5 pl-5">
      <span
        aria-hidden
        className="absolute bottom-5 left-0 top-5 w-px origin-top scale-y-[0.18] bg-[var(--ed-accent-line)] transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-y-100"
      />
      <p className="ed-label text-[var(--ed-fg-52)]">{label}</p>
      <div>{children}</div>
    </li>
  );
}

export function EditorialContact({
  city,
  studioName,
  contact,
  booking,
  image,
}: Props) {
  const hasDetails = Boolean(
    contact.address || contact.hours || contact.phone || contact.email
  );

  return (
    <section id="contact" className="border-b border-[var(--ed-line)]">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 px-5 py-20 md:px-10 md:py-24 lg:grid-cols-12 lg:gap-16 lg:px-16 lg:py-28">
        <ScrollReveal className="lg:col-span-6">
          <div className="flex flex-col">
            <p className="ed-label text-[var(--ed-accent)]">Contact</p>
            <h2 className="ed-serif ed-h2 mt-4 max-w-[34ch]">
              {city ? `Kom langs in ${city}` : "Kom langs in de studio"}
            </h2>

            {hasDetails ? (
              <ul className="mt-9 divide-y divide-[var(--ed-line)] border-y border-[var(--ed-line)]">
                {contact.address ? (
                  <DetailRow label="Adres">
                    <p className="ed-serif text-[1.25rem] leading-snug">
                      {plainText(contact.address)}
                      {city ? `, ${city}` : ""}
                    </p>
                  </DetailRow>
                ) : null}

                {contact.hours ? (
                  <DetailRow label="Openingstijden">
                    <p className="text-[1rem] leading-relaxed text-[var(--ed-fg-70)]">
                      {plainText(contact.hours)}
                    </p>
                  </DetailRow>
                ) : null}

                {contact.phone ? (
                  <DetailRow label="Telefoon">
                    <a
                      href={`tel:${contact.phone.replace(/\s/g, "")}`}
                      className="ed-link w-fit text-[1rem]"
                    >
                      {contact.phone}
                    </a>
                  </DetailRow>
                ) : null}

                {contact.email ? (
                  <DetailRow label="E-mail">
                    <a
                      href={`mailto:${contact.email}`}
                      className="ed-link w-fit text-[1rem]"
                    >
                      {contact.email}
                    </a>
                  </DetailRow>
                ) : null}
              </ul>
            ) : (
              <p className="mt-8 max-w-[48ch] text-[1rem] leading-relaxed text-[var(--ed-fg-70)]">
                {`Plan een eerste les bij ${studioName} en ontdek of de studio bij je past.`}
              </p>
            )}

            {contact.instagram ? (
              <a
                href={contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="ed-label group mt-9 inline-flex w-fit items-center gap-3.5 rounded-full border border-[var(--ed-line)] px-5 py-3 text-[var(--ed-fg)] transition-colors duration-500 hover:border-[var(--ed-accent-line)]"
              >
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-[var(--ed-accent)] transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-150"
                />
                {instagramHandle(contact.instagram)}
              </a>
            ) : null}
          </div>
        </ScrollReveal>

        <ScrollReveal className="lg:col-span-6" delayMs={90}>
          <div className="ed-tint flex h-full flex-col border border-[var(--ed-line)]">
            {image ? (
              <EditorialFigure
                image={image}
                sizes="(max-width: 1024px) 92vw, 45vw"
                className="aspect-[16/10] w-full"
              />
            ) : null}
            <div className="relative flex flex-1 flex-col justify-between gap-8 overflow-hidden p-7 md:p-9">
              <EditorialPose
                name="ball"
                className="pointer-events-none absolute -bottom-6 -right-6 h-40 w-40 text-[var(--ed-accent)] opacity-[0.12]"
              />

              <div className="relative">
                <h3 className="ed-serif text-[1.7rem] leading-tight md:text-[2rem]">
                  Eerste les inplannen
                </h3>
                <p className="mt-4 max-w-[42ch] text-[0.97rem] leading-relaxed text-[var(--ed-fg-70)]">
                  Kies een moment dat past. Je krijgt uitleg over de basis en
                  traint daarna mee op je eigen niveau.
                </p>
              </div>
              <a
                href={booking.href}
                {...(booking.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="ed-label ed-btn group relative inline-flex w-full items-center justify-center gap-2.5 bg-[var(--ed-fg)] px-7 py-4 text-[var(--ed-bg)] transition-colors duration-300 hover:text-white sm:w-auto sm:self-start"
              >
                {booking.label}
                <EditorialIcon
                  name="arrow"
                  className="h-3.5 w-3.5 transition-transform duration-500 ease-[var(--ease-premium)] group-hover:translate-x-1"
                />
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
