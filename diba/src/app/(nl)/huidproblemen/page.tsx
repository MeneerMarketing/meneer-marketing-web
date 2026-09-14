import type { Metadata } from "next";
import Link from "@/components/ui/Linktaal";
import Button from "@/components/ui/Button";
import BeeldVignet from "@/components/ui/BeeldVignet";
import DibaLeafMark from "@/components/ui/DibaLeafMark";
import Label from "@/components/ui/Label";
import Raster from "@/components/huidproblemen/Raster";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import { DIBA_SITE_URL, DIBA_WHATSAPP_URL } from "@/lib/site";
import LeesVerder from "@/components/ui/LeesVerder";
import { t, tc } from "@/lib/vertaal";

/**
 * Het overzicht van alle huidproblemen.
 *
 * De kop gaat over huid en niet over deze website. Een eerdere versie opende met
 * "zeventien pagina's, vijf gaan niet over ons": waar voor de bouwer, nutteloos voor
 * iemand die met een probleem binnenkomt.
 *
 * Wat er nu staat is het idee achter de hele reeks: elke aandoening heeft een andere
 * eerste vraag, en met de verkeerde vraag beginnen kost maanden. Dat is klinisch, het is
 * waar, en het verklaart in één zin waarom deze zeventien pagina's niet op elkaar lijken.
 *
 * De groepen zitten nu in het raster, in klinische taal in plaats van als paginatelling.
 *
 * Twee donkergroene vlakken, niet meer (§5): de zoeker bovenaan en de intake onderaan.
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/huidproblemen",
  titel: "Huidproblemen behandelen in Rotterdam",
  omschrijving:
    "Bij acne telt waar het zit, bij pigment welk seizoen het is, bij littekens hoe oud ze zijn. Kies waar je last van hebt en zie waar we mee beginnen.",
});

export default function HuidproblemenPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
        ])}
      />

      {/* ── Hero ── */}
      <section className="bg-[var(--g-700)] text-[var(--on-dark)] px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-10 py-10 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <nav
              aria-label={tc("Kruimelpad")}
              className="diba-label diba-label-on-dark flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-white">
                {t("Home")}
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--on-dark-body)]">
                {t("Huidproblemen")}
              </span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[21ch]">
              {t("Alle")}{" "}
              <span className="diba-accent-on-dark">{t("huidproblemen")}</span>
            </h1>

            <p className="mt-6 max-w-[52ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              {t(
                "Bij elke klacht telt iets anders: waar het zit, welk seizoen het is, hoe oud het is of hoe diep het ligt. Kies je klacht en lees wat er bij jou telt.",
              )}
            </p>
            <LeesVerder opDonker>
              <p className="mt-4 max-w-[52ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
                {t(
                  "Bij acne telt wáár het zit, want de plek zegt iets over de oorzaak. Bij pigment telt welk seizoen het is. Bij littekens hoe oud ze zijn, en bij melasma hoe diep het pigment ligt. Dat klinkt als een detail en het bepaalt de uitkomst: wie met de verkeerde vraag begint, behandelt maanden het verkeerde.",
                )}
              </p>
            </LeesVerder>
          </div>

          {/* De zoeker als eerste uitweg, voor wie de naam niet kent. */}
          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 text-[var(--t-strong)] sm:p-10">
            <Label>{t("Geen idee waar je moet zijn")}</Label>
            <p className="diba-card-title-lg mt-5">
              {t(
                "Je hoeft niet te weten hoe het heet. Kruis aan wat je ziet, dan zoeken wij de pagina erbij.",
              )}
            </p>
            <div className="mt-7 diba-knoprij">
              <Button
                href="/huidproblemen/symptoomzoeker"
                variant="primair"
                kort="Symptoomzoeker"
              >
                {t("Naar de symptoomzoeker")}
              </Button>
              <Button
                href={DIBA_WHATSAPP_URL}
                variant="secundair"
                target="_blank"
                rel="noopener noreferrer"
                kort="Stel je vraag"
              >
                {t("Of stel je vraag")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Het filterbare raster ──
          Wit vlak, mintkaarten. Stond de sectie ook op mint, dan liepen kaart en
          ondergrond in elkaar over en las het als losse tekst in plaats van als kaarten. */}
      {/* Zestien huidproblemen naast elkaar kan overweldigen. Dit beeld zegt dat er aan het
          eind van elke pagina gewoon een gesprek staat. */}
      <section className="px-5 py-10 sm:px-9 sm:py-14 lg:px-[7.5vw] lg:py-16">
        <div className="mx-auto">
          <BeeldVignet
            src="/images/shoot/kliniek-kamer-overzicht.jpg"
            alt={tc(
              "Overzicht van een behandelkamer bij Diba Clinics met een behandelaar aan het werk",
            )}
            onderschrift="Waar het gesprek plaatsvindt"
            sizes="(min-width: 1024px) 86vw, 92vw"
            className="aspect-[16/9] lg:aspect-[21/9]"
          />
        </div>
      </section>

      <section className="px-5 py-12 sm:py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <div className="mx-auto">
          <Raster />
        </div>
      </section>

      {/* ── Wat elke pagina gemeen heeft ── */}
      <section className="px-5 pb-12 sm:pb-20 sm:px-9 lg:px-[7.5vw]">
        <div className="mx-auto rounded-[var(--r-md)] bg-[var(--g-050)] p-7 sm:p-10">
          <Label>{t("Wat op elke pagina terugkomt")}</Label>
          <h2 className="diba-display-s mt-5 max-w-[20ch]">
            {t("Dezelfde vier vragen,")}
            <br />
            <span className="diba-accent">{t("elke keer.")}</span>
          </h2>
          <ul className="mt-8 sm:mt-10 grid gap-x-10 gap-y-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              [
                t("Wat is het eigenlijk"),
                "Uitgelegd zoals we het in de behandelkamer zeggen, met de vakterm erbij.",
              ],
              [
                t("Wat werkt en wat niet"),
                "Wat er werkt en wat we afraden, en bij allebei de reden erachter.",
              ],
              [
                t("Wat wij eraan doen"),
                "Welke behandeling erbij past, wat je ervan kunt verwachten en wat het kost.",
              ],
              [
                t("Hoe we het meten"),
                "We leggen vast hoe je huid er bij de start voor staat, zodat verschil later te zien is.",
              ],
            ].map(([kop, tekst]) => (
              <li key={kop} className="rounded-[var(--r-sm)] bg-white p-5">
                <h3 className="diba-card-title">{kop}</h3>
                {/* Laatste blok van de kaart: het raster rekt de kaarten al tot dezelfde
                    hoogte. Zie `huidproblemen/striae/page.tsx`. */}
                <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                  {tc(tekst)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Slot ── */}
      <section className="relative overflow-hidden mx-5 mt-16 mb-5 rounded-[var(--r-xl)] lg:mt-20 bg-[var(--g-700)] px-7 py-10 sm:py-14 text-[var(--on-dark)] sm:mx-9 sm:px-12 lg:mx-[7.5vw] lg:px-16 lg:py-20">
        <DibaLeafMark
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -bottom-10 h-[260px] w-[260px] -rotate-12 opacity-20"
        />
        <div className="mx-auto lg:grid lg:grid-cols-[1.35fr_0.65fr] lg:gap-10">
          <div>
            <Label opDonker>{t("Behandeling nul")}</Label>
            <h2 className="diba-display-l mt-5 max-w-[16ch]">
              {t("Alles begint")}{" "}
              <span className="diba-accent-on-dark">{t("bij meten.")}</span>
            </h2>
          </div>
          <div className="mt-8 flex flex-col justify-end lg:mt-0">
            <p className="max-w-sm text-[16px] leading-7 text-[var(--on-dark-body)]">
              {t(
                "Iedere huidvraag begint met een beoordeling, waaruit ook kan volgen dat we geen behandeling adviseren.",
              )}
            </p>
            <div className="mt-7">
              <Button href="/intake" variant="primair-op-donker">
                {t("Plan een huidconsult")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
