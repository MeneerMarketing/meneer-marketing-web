"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  APPARATUUR,
  DOELWITTEN,
  type Doelwit,
  type Werkwijze,
} from "@/data/apparatuur";
import { HUIDLAGEN, LAAGAANDEEL } from "@/data/behandelingen";
import { publicCopy } from "@/lib/copy-flags";

/**
 * De dieptevergelijker: alle apparaten op één schaal.
 *
 * WAAROM DIT GEEN KAARTENRASTER IS.
 *
 * Twaalf kaarten met twaalf merknamen leren je precies niets, want je kunt ze niet naast
 * elkaar leggen. En dat is nou net de vraag die iemand hier heeft: welke van deze dingen
 * doet wat ik nodig heb, en waarom zijn het er zoveel. Zodra ze op dezelfde as staan is
 * dat in één blik te zien, inclusief het antwoord op de vraag waarom een peeling geen
 * rimpels wegneemt: hij komt daar niet.
 *
 * De as loopt van de hoornlaag tot de diepe lederhuid, met segmenten in de verhouding
 * waarin die lagen ook in het werkingsvenster staan. Dezelfde schaal op beide plekken,
 * anders is vergelijken een truc.
 *
 * De filters staan op mechaniek en niet op categorie. Categorie is hoe een kliniek zijn
 * apparatuur inkoopt; mechaniek is wat het met jou doet.
 *
 * Alles is een link. Er zit geen scherm tussen de vergelijking en het apparaat zelf.
 */

const MECHANIEKEN: readonly {
  readonly id: Werkwijze;
  readonly label: string;
  readonly zin: string;
}[] = [
  { id: "meten", label: "Meten", zin: "Kijken zonder iets te veranderen." },
  {
    id: "licht",
    label: "Licht en laser",
    zin: "Energie die door één ding wordt opgenomen.",
  },
  {
    id: "naald",
    label: "Naalden",
    zin: "Herstel uitlokken met kleine kanaaltjes.",
  },
  {
    id: "injectie",
    label: "Injectie",
    zin: "Stoffen op een vaste diepte brengen.",
  },
  {
    id: "chemisch",
    label: "Chemisch en mechanisch",
    zin: "De bovenlaag laten loslaten.",
  },
  { id: "zuiging", label: "Zuiging", zin: "Losmaken en wegtrekken." },
  {
    id: "kou",
    label: "Kou en druk",
    zin: "Vaatjes prikkelen zonder ze te raken.",
  },
];

export default function Dieptevergelijker() {
  const [mechaniek, setMechaniek] = useState<Werkwijze | "alles">("alles");
  const [zweeft, setZweeft] = useState<string | null>(null);

  const rijen = useMemo(
    () =>
      [...APPARATUUR]
        .filter((a) => mechaniek === "alles" || a.werkwijze === mechaniek)
        .sort((a, b) => a.diepte - b.diepte),
    [mechaniek],
  );

  const tellingen = useMemo(() => {
    const t = new Map<Werkwijze, number>();
    for (const a of APPARATUUR)
      t.set(a.werkwijze, (t.get(a.werkwijze) ?? 0) + 1);
    return t;
  }, []);

  return (
    <div>
      {/* ── Filters op mechaniek ── */}
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filter op mechaniek"
      >
        <Chip
          actief={mechaniek === "alles"}
          onClick={() => setMechaniek("alles")}
          label="Alles"
          telling={APPARATUUR.length}
        />
        {MECHANIEKEN.filter((m) => (tellingen.get(m.id) ?? 0) > 0).map((m) => (
          <Chip
            key={m.id}
            actief={mechaniek === m.id}
            onClick={() => setMechaniek(m.id)}
            label={m.label}
            telling={tellingen.get(m.id) ?? 0}
          />
        ))}
      </div>

      {mechaniek !== "alles" ? (
        <p className="mt-4 text-[15px] leading-7 text-[var(--t-body)]">
          {MECHANIEKEN.find((m) => m.id === mechaniek)?.zin}
        </p>
      ) : null}

      {/* ── De as ── */}
      <div className="mt-10 overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-[minmax(190px,1fr)_2.2fr] items-end gap-6">
            <p className="diba-label text-[var(--t-label)]">
              {rijen.length} {rijen.length === 1 ? "apparaat" : "apparaten"}
            </p>
            <p className="diba-label text-[var(--t-label)]">Tot hoe diep</p>
          </div>

          <ul className="mt-3">
            {rijen.map((a) => {
              const doelwit: Doelwit = a.doelwit;
              const leest = a.werkwijze === "meten";
              const op = zweeft === null || zweeft === a.slug;
              return (
                <li key={a.slug}>
                  <Link
                    href={`/apparatuur/${a.slug}`}
                    onMouseEnter={() => setZweeft(a.slug)}
                    onMouseLeave={() => setZweeft(null)}
                    onFocus={() => setZweeft(a.slug)}
                    onBlur={() => setZweeft(null)}
                    className="grid grid-cols-[minmax(190px,1fr)_2.2fr] items-center gap-6 rounded-[var(--r-sm)] px-3 py-3.5 transition-colors duration-200 hover:bg-[var(--g-100)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                    style={{
                      opacity: op ? 1 : 0.45,
                      transition: "opacity 200ms ease",
                    }}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[16px] leading-6 font-medium text-[var(--t-strong)]">
                        {a.naam}
                      </span>
                      <span className="mt-0.5 block truncate text-[13px] leading-5 text-[var(--t-muted)]">
                        {leest
                          ? "Kijkt tot hier, verandert niets"
                          : doelwit === "geen"
                            ? "Geen specifiek doelwit"
                            : `Grijpt aan op ${DOELWITTEN[doelwit].naam.toLowerCase()}`}
                      </span>
                    </span>

                    <span className="relative block h-9">
                      {/* De lagen als achtergrond, zodat de balk iets betekent. */}
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 flex"
                      >
                        {LAAGAANDEEL.map((deel, i) => (
                          <span
                            key={HUIDLAGEN[i].id}
                            style={{
                              width: `${deel}%`,
                              background: `var(${["--g-025", "--g-050", "--g-075", "--g-100"][i]})`,
                            }}
                            className="first:rounded-l-[var(--r-pill)] last:rounded-r-[var(--r-pill)]"
                          />
                        ))}
                      </span>
                      {/* Tot hier komt dit apparaat.

                          Een meetapparaat krijgt een lichte balk en geen groene. Het
                          komt wel tot die diepte, maar het doet daar niets, en dezelfde
                          balk als een laser zou net doen alsof dat hetzelfde is.

                          Dit was een gestippelde omlijning. Dat leest goed en het is een
                          streep, en de huisstijl kent alleen vlakken. */}
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center justify-end rounded-[var(--r-pill)] pr-3 ${
                          leest ? "bg-[var(--g-300)]" : "bg-[var(--g-700)]"
                        }`}
                        style={{
                          width: `${a.diepte}%`,
                          transition: "width 450ms cubic-bezier(.22,.61,.36,1)",
                        }}
                      >
                        <span
                          className={`text-[12px] leading-4 font-semibold tabular-nums ${
                            leest ? "text-[var(--g-900)]" : "text-white"
                          }`}
                        >
                          {a.diepte}
                        </span>
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* De legenda staat los van de as en niet erboven.

          Boven de as moest elke laagnaam in zijn eigen band passen, en de hoornlaag is
          negen procent breed. Dan botsen de namen, en dat is niet op te lossen met een
          kleiner lettertype maar door het label los te koppelen van de bandbreedte. */}
      <ul className="mt-6 grid gap-x-6 gap-y-2 sm:grid-cols-2 xl:grid-cols-4">
        {LAAGAANDEEL.map((deel, i) => {
          const vanaf = LAAGAANDEEL.slice(0, i).reduce((s, d) => s + d, 0);
          return (
            <li key={HUIDLAGEN[i].id} className="flex items-baseline gap-2.5">
              <span
                aria-hidden="true"
                className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                style={{
                  background: `var(${["--g-025", "--g-050", "--g-075", "--g-100"][i]})`,
                  outline: "1px solid var(--g-300)",
                }}
              />
              <span className="text-[13px] leading-5 text-[var(--t-body)]">
                <span className="font-medium text-[var(--t-strong)]">
                  {HUIDLAGEN[i].naam}
                </span>{" "}
                <span className="text-[var(--t-muted)] tabular-nums">
                  {Math.round(vanaf)} tot {Math.round(vanaf + deel)}
                </span>
              </span>
            </li>
          );
        })}
      </ul>

      {/* [MEDISCHE-CHECK-ROJDA]: de dieptewaarden waarop deze hele as rust. */}
      <p className="mt-6 max-w-[62ch] text-[13px] leading-6 text-[var(--t-muted)]">
        Het getal is een verhouding en geen millimeter: hoe diep een apparaat
        komt hangt af van de instelling en van jouw huid. Waar het om gaat is de
        volgorde.
      </p>

      {/* ── Wat de mechanieken zijn ── */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {MECHANIEKEN.filter((m) => (tellingen.get(m.id) ?? 0) > 0).map((m) => {
          const doelwitten = [
            ...new Set(
              APPARATUUR.filter((a) => a.werkwijze === m.id).map(
                (a) => a.doelwit,
              ),
            ),
          ].filter((d) => d !== "geen");
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMechaniek(mechaniek === m.id ? "alles" : m.id)}
              className={`rounded-[var(--r-md)] border p-6 text-left transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                mechaniek === m.id
                  ? "border-[var(--g-300)] bg-[var(--g-050)]"
                  : "border-[var(--g-100)] bg-white hover:border-[var(--g-300)]"
              }`}
            >
              <span className="diba-label text-[var(--t-label)]">
                {tellingen.get(m.id)}{" "}
                {tellingen.get(m.id) === 1 ? "apparaat" : "apparaten"}
              </span>
              <span className="mt-2 block text-[17px] leading-6 font-medium text-[var(--t-strong)]">
                {m.label}
              </span>
              <span className="mt-2 block text-[15px] leading-7 text-[var(--t-body)]">
                {publicCopy(m.zin)}
              </span>
              {doelwitten.length > 0 ? (
                <span className="mt-4 block pt-3 text-[13px] leading-5 text-[var(--t-muted)]">
                  Grijpt aan op{" "}
                  {doelwitten
                    .map((d) => DOELWITTEN[d].naam.toLowerCase())
                    .join(", ")}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Chip({
  actief,
  onClick,
  label,
  telling,
}: {
  readonly actief: boolean;
  readonly onClick: () => void;
  readonly label: string;
  readonly telling: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={actief}
      className={`diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] px-5 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
        actief
          ? "bg-[var(--g-700)] text-white"
          : "bg-white text-[var(--t-label)] hover:bg-[var(--g-100)]"
      }`}
    >
      {label}
      <span
        className={
          actief ? "text-[var(--on-dark-body)]" : "text-[var(--t-muted)]"
        }
      >
        {telling}
      </span>
    </button>
  );
}
