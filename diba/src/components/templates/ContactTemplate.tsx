import Link from "next/link";
import FigmaHeading from "@/components/figma/FigmaHeading";
import { FigmaBreadcrumbs } from "@/components/figma/FigmaTemplateUi";
import { publicCopy } from "@/lib/copy-flags";
import { figmaBtnMint, figmaBtnPrimary } from "@/lib/figma-home-layout";
import {
  figmaBody,
  figmaCardSoft,
  figmaCardWhite,
  figmaInnerContainer,
  figmaLabel,
  figmaSection,
  figmaSectionTight,
} from "@/lib/figma-inner-layout";
import { SchemaMarkup, breadcrumbSchema } from "@/lib/schema";
import { DIBA_ADDRESS, DIBA_NAP, DIBA_WHATSAPP_URL } from "@/lib/site";

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(DIBA_ADDRESS.line)}`;

export type ContactTemplateProps = {
  siteUrl: string;
  whatsappHref: string;
};

export default function ContactTemplate({
  siteUrl,
  whatsappHref,
}: ContactTemplateProps) {
  return (
    <main className="pb-20">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: siteUrl },
          { name: "Contact", url: `${siteUrl}/contact` },
        ])}
      />

      <section className={`${figmaInnerContainer} ${figmaSection}`} data-reveal>
        <FigmaBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Contact" },
          ]}
        />
        <p className={figmaLabel}>Contact</p>
        <FigmaHeading
          as="h1"
          size="hero"
          text="Contact en *route*"
          className="mt-4 max-w-3xl"
        />
        <p className={`mt-7 max-w-2xl ${figmaBody}`}>
          {publicCopy(
            "Diba Clinics in Hillegersberg, Rotterdam. Plan uw route of stel uw vraag via WhatsApp.",
          )}
        </p>
      </section>

      <section className={`${figmaInnerContainer} ${figmaSectionTight} pb-24`}>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7" data-reveal>
            <div className={`${figmaCardWhite} p-7 sm:p-9`}>
              <p className={figmaLabel}>Adres</p>
              <p className="mt-4 text-xl font-medium tracking-[-.03em] text-[#17372a]">
                {DIBA_NAP.name}
              </p>
              <address className="mt-2 not-italic text-[15px] leading-7 text-[#5f7765]">
                {DIBA_ADDRESS.street}
                <br />
                {DIBA_ADDRESS.postalCode} {DIBA_ADDRESS.city}
              </address>
              <p className={`mt-5 ${figmaBody}`}>
                {publicCopy("Tram 4 of 8 richting Kralingse Zoom. Parkeren in de straat of nabij parkeergarage.")}
              </p>
              <div className="mt-7">
                <Link
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={figmaBtnMint}
                >
                  Open in Google Maps ↗
                </Link>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className={`${figmaCardSoft} p-6 sm:p-7`}>
                <p className={figmaLabel}>Bereikbaarheid</p>
                <ul className="mt-4 flex flex-col gap-2 text-[15px] leading-7 text-[#5f7765]">
                  <li>
                    WhatsApp:{" "}
                    <a
                      href={whatsappHref}
                      className="font-medium text-[#286943] underline-offset-4 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      stuur een bericht
                    </a>
                  </li>
                  <li>Telefoon: {publicCopy("[GEGEVEN-NODIG]")}</li>
                  <li>E-mail: {publicCopy("[GEGEVEN-NODIG]")}</li>
                </ul>
              </div>
              <div className={`${figmaCardSoft} p-6 sm:p-7`}>
                <p className={figmaLabel}>Openingstijden</p>
                <p className={`mt-4 ${figmaBody}`}>
                  {publicCopy("Ma t/m vr op afspraak. WhatsApp voor een snelle reactie.")}
                </p>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-5" data-reveal>
            <div className="rounded-[2rem] bg-[#286943] p-7 text-[#f2f7ef] sm:p-9">
              <FigmaHeading
                as="h2"
                size="section"
                text="Plan uw *startmoment*"
                className="text-white [&_span]:text-[#d8f0c8]"
              />
              <p className="mt-5 text-[15px] leading-7 text-[#d8f0c8]">
                Start online met Behandeling Nul. Gratis, 4 minuten, zonder verplichting om te boeken.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <Link href="/intake" className={`${figmaBtnPrimary} bg-white text-[#286943] hover:bg-[#f2f7ef]`}>
                  Start uw intake (4 min) ↗
                </Link>
                <Link
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#d8f0c8]/40 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[.13em] text-[#f2f7ef] transition hover:border-[#d8f0c8]"
                >
                  Vraag stellen via WhatsApp
                </Link>
              </div>
            </div>
            <p className="mt-4 text-[13px] text-[#5f7765]">
              WhatsApp: {DIBA_WHATSAPP_URL.replace("https://wa.me/", "+")}
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
