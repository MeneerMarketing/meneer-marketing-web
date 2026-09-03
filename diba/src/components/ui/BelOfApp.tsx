import {
  DIBA_TELEFOON,
  DIBA_TELEFOON_HREF,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Bellen of appen, als twee echte koppelingen.
 *
 * WAT ER MIS WAS.
 *
 * "Bel of app ons" stond op drie plekken als platte tekst. Precies op het moment dat iemand
 * het wil doen — hij twijfelt of hij moet komen, of zijn verzekeraar de eis stelt, of zijn
 * vraag er niet bij staat — moest hij eerst zelf het nummer gaan zoeken. Op een telefoon is
 * dat het verschil tussen een gesprek en een gesloten tabblad.
 *
 * TWEE VORMEN.
 *
 * `inline` loopt mee in een zin ("bel ons of app ons") en `knoppen` staat als los blok
 * eronder, met het nummer erbij. Ze delen dezelfde doelen, zodat een nummerwijziging op
 * één plek gebeurt.
 *
 * De appkoppeling gaat naar wa.me en dus naar buiten: `target` en `rel` horen erbij.
 */

const inlineLink =
  "font-medium text-[var(--g-700)] underline underline-offset-4 transition hover:text-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]";

/* min-h-11 is geen sierlijke maat maar de ondergrens voor een duim. */
const knop =
  "diba-label inline-flex min-h-11 items-center gap-2 rounded-[var(--r-pill)] border border-[var(--g-200)] bg-white px-5 text-[var(--g-700)] transition hover:border-[var(--g-400)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]";

export function BelOfAppInline({
  bellen = "bel ons",
  appen = "app ons",
}: {
  bellen?: string;
  appen?: string;
}) {
  return (
    <>
      <a href={DIBA_TELEFOON_HREF} className={inlineLink}>
        {bellen}
      </a>{" "}
      of{" "}
      <a
        href={DIBA_WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={inlineLink}
      >
        {appen}
      </a>
    </>
  );
}

export default function BelOfApp({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <a href={DIBA_TELEFOON_HREF} className={knop}>
        Bel {DIBA_TELEFOON}
      </a>
      <a
        href={DIBA_WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={knop}
      >
        App ons
      </a>
    </div>
  );
}
