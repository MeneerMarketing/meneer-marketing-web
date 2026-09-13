"use client";

import Link from "@/components/ui/Taalpad";
import { useMemo, useSyncExternalStore } from "react";
import Label from "@/components/ui/Label";
import { useT, useTc } from "@/lib/gebruik-taal";

/**
 * "Bedoelde je dit?" op de pagina die niemand wil zien.
 *
 * WAAROM DIT ER IS.
 *
 * De oude WordPress-site staat nog jaren in Google, met adressen die hier niet meer
 * bestaan: /acne-behandeling, /laserontharen-benen, /wat-kost-hydrafacial. Wie daarop
 * klikt komt op een pagina die zegt dat er niets is, en gaat terug naar de zoekresultaten.
 * Dat is de duurste klik van de site: iemand zocht precies wat wij doen, en wij stuurden
 * hem weg.
 *
 * HOE HET WERKT.
 *
 * Het adres waar iemand op uitkwam staat in de browser. Daar halen we de woorden uit en
 * leggen die naast alles wat de site wél heeft: de huidproblemen, de behandelingen, de
 * apparaten en de kennisbank. Een woord dat voorkomt telt mee naar zijn lengte, zodat
 * "laserontharing" zwaarder weegt dan "de". Bij genoeg overeenkomst staan er maximaal
 * drie voorstellen; anders staat er niets en blijven de gewone wegen eronder over.
 *
 * WAAROM CLIENT EN NIET SERVER.
 *
 * Een `not-found` is in deze opzet één statische pagina voor elk onbekend adres. De server
 * weet dus niet welk adres het was; de browser wel. Zonder JavaScript verschijnt dit blok
 * niet, en dan staat de rest van de pagina er nog steeds.
 */

export type Zoekdoel = {
  readonly pad: string;
  readonly naam: string;
  readonly soort: string;
};

/**
 * Woorden die in bijna elk oud adres zitten en dus niets onderscheiden.
 *
 * Zonder deze lijst matcht "behandeling" uit /acne-behandeling met alle achtenvijftig
 * behandelpagina's, en dan is het eerste voorstel willekeurig.
 */
const RUIS = new Set([
  "www",
  "nl",
  "com",
  "html",
  "htm",
  "php",
  "index",
  "page",
  "pagina",
  "home",
  "behandeling",
  "behandelingen",
  "huid",
  "diba",
  "clinics",
  "kliniek",
  "rotterdam",
  "categorie",
  "category",
  "tag",
  "product",
  "producten",
  "blog",
  "nieuws",
  "wp",
  "content",
  "uploads",
  "behandelen",
  "behandel",
  "media",
  "assets",
  "themes",
  "plugins",
]);

export default function Zoekhulp({
  doelen,
}: {
  readonly doelen: readonly Zoekdoel[];
}) {
  const tc = useTc();
  const t = useT();
  /* Het adres verandert niet tijdens een bezoek, dus een abonnement dat niets doet
     volstaat. Op de server luidt het antwoord een lege tekst, zodat de eerste opmaak
     gelijk is aan wat de browser erna toont. Dezelfde aanpak als bij de boekingswidget;
     een effect met setState erin is hier niet nodig en de lint verbiedt het terecht. */
  const pad = useSyncExternalStore(
    () => () => {},
    () => window.location.pathname,
    () => "",
  );

  const treffers = useMemo<readonly Zoekdoel[]>(() => {
    if (!pad) return [];

    let leesbaar = pad;
    try {
      leesbaar = decodeURIComponent(pad);
    } catch {
      /* een adres met een halve escape erin; dan werken we met de ruwe tekst */
    }

    /* Een oud adres naar een plaatje of een stylesheet is geen paginabezoek. Zonder deze
       regel stelde /wp-content/uploads/2021/07/foto.jpg drie Fotona-pagina's voor, puur
       omdat "foto" in "fotona" zit. */
    const laatste = leesbaar.split("/").filter(Boolean).pop() ?? "";
    if (
      /[.](jpe?g|png|gif|webp|svg|ico|pdf|css|js|xml|zip|docx?|xlsx?)$/i.test(
        laatste,
      )
    ) {
      return [];
    }

    const woorden = leesbaar
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 2 && !RUIS.has(w));

    if (woorden.length === 0) return [];

    return (
      doelen
        .map((doel) => {
          const tekst = `${doel.pad} ${tc(doel.naam)}`.toLowerCase();
          let score = 0;
          for (const woord of woorden) {
            if (tekst.includes(woord)) {
              score += woord.length;
              continue;
            }
            /* Oude adressen gebruiken andere uitgangen dan wij: "laserontharen" tegen
               "laserontharing", "peelings" tegen "peeling". Daarom ook de stam proberen,
               maar alleen bij lange woorden en met minder gewicht, zodat een halve
               overeenkomst nooit zwaarder weegt dan een hele. */
            if (woord.length >= 8 && tekst.includes(woord.slice(0, 7))) {
              score += woord.length - 4;
            }
          }
          return { doel, score };
        })
        /* Vier tekens overeenkomst is de ondergrens. Daaronder raden we, en een verkeerd
         voorstel is erger dan geen voorstel: dan klikt iemand door naar iets wat hij niet
         zocht en denkt hij dat de site hem niet begrijpt. */
        .filter((x) => x.score >= 4)
        .sort((a, b) => b.score - a.score)
        /* Twee pagina's kunnen dezelfde naam dragen: "Laserontharing" is zowel de grote
           pagina als de behandeling in de lijst. Twee keer hetzelfde voorstel onder
           elkaar ziet eruit als een fout, dus houdt hij de hoogst scorende. */
        .filter((x, i, alle) => {
          const naam = x.doel.naam.toLowerCase();
          return (
            alle.findIndex((y) => y.doel.naam.toLowerCase() === naam) === i
          );
        })
        .slice(0, 3)
        .map((x) => x.doel)
    );
  }, [pad, doelen]);

  if (treffers.length === 0) return null;

  return (
    <div className="mt-10 rounded-[var(--r-lg)] border border-[var(--g-100)] bg-white p-6 sm:p-8">
      <Label>{t("Bedoelde je dit")}</Label>
      <ul className="mt-5 space-y-3">
        {treffers.map((t) => (
          <li key={t.pad}>
            <Link
              href={t.pad}
              className="flex min-h-11 flex-wrap items-baseline gap-x-3 gap-y-1 text-[17px] leading-7 text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
            >
              {tc(t.naam)}
              <span className="diba-label text-[var(--t-label)] no-underline">
                {tc(t.soort)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
