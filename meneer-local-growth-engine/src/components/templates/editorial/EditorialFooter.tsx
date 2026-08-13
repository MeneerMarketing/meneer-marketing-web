import type { EditorialModel } from "@/components/templates/editorial/editorialModel";
import { plainText } from "@/lib/text";

interface Props {
  studioName: string;
  city: string;
  country: string;
  links: EditorialModel["navLinks"];
  contact: EditorialModel["contact"];
}

export function EditorialFooter({
  studioName,
  city,
  country,
  links,
  contact,
}: Props) {
  return (
    <footer className="ed-deep">
      <div className="mx-auto max-w-[1440px] px-5 pb-32 pt-16 md:px-10 md:pb-28 md:pt-20 lg:px-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="ed-serif text-[1.9rem] leading-tight">{studioName}</p>
            {contact.address ? (
              <p className="mt-4 text-[0.95rem] leading-relaxed text-[var(--ed-fg-70)]">
                {plainText(contact.address)}
                {city ? `, ${city}` : ""}
              </p>
            ) : null}
            {contact.hours ? (
              <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--ed-fg-52)]">
                {plainText(contact.hours)}
              </p>
            ) : null}
          </div>

          <nav aria-label="Footermenu" className="md:col-span-3">
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="ed-label ed-link text-[var(--ed-fg-70)] hover:text-[var(--ed-fg)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <ul className="space-y-3 text-[0.95rem]">
              {contact.phone ? (
                <li>
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="ed-link text-[var(--ed-fg-70)] hover:text-[var(--ed-fg)]"
                  >
                    {contact.phone}
                  </a>
                </li>
              ) : null}
              {contact.email ? (
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="ed-link text-[var(--ed-fg-70)] hover:text-[var(--ed-fg)]"
                  >
                    {contact.email}
                  </a>
                </li>
              ) : null}
              {contact.instagram ? (
                <li>
                  <a
                    href={contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ed-link text-[var(--ed-fg-70)] hover:text-[var(--ed-fg)]"
                  >
                    Instagram
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <p className="ed-label mt-14 border-t border-[var(--ed-line)] pt-7 text-[var(--ed-fg-52)]">
          {[plainText(city), plainText(country)].filter(Boolean).join(" · ")}
        </p>
      </div>
    </footer>
  );
}
