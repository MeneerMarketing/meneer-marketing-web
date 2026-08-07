import DeLijn from "@/components/ui/DeLijn";
import FigmaHeading from "@/components/figma/FigmaHeading";
import type { NazorgMoment } from "@/data/nazorg";
import { publicCopy } from "@/lib/copy-flags";
import { figmaBody, figmaLabel } from "@/lib/figma-inner-layout";

export type NazorgTijdlijnProps = {
  kop?: string;
  momenten: readonly NazorgMoment[];
};

export default function NazorgTijdlijn({ kop, momenten }: NazorgTijdlijnProps) {
  return (
    <div>
      {kop ? <FigmaHeading as="h2" size="card" text={kop} /> : null}
      <ol className={`${kop ? "mt-8" : ""} flex flex-col gap-8`}>
        {momenten.map((m, i) => {
          const pct =
            momenten.length <= 1
              ? 100
              : Math.round((i / (momenten.length - 1)) * 100);
          return (
            <li
              key={m.label}
              className="grid gap-3 md:grid-cols-[140px_1fr] md:gap-8"
            >
              <div>
                <p className={figmaLabel}>{m.label}</p>
                <div className="mt-2 hidden md:block">
                  <DeLijn length="lang" dot={pct} />
                </div>
              </div>
              {/* De nazorgteksten zijn nog placeholders en stonden hier ongefilterd,
                  twintig vlaggen op één pagina. De intro erboven liep wél door
                  `publicCopy`; alleen deze regel niet, en dat is genoeg. */}
              <p className={figmaBody}>
                {publicCopy(m.tekst, "Wordt ingevuld door de kliniek")}
              </p>
            </li>
          );
        })}
      </ol>
      <div className="mt-6 md:hidden">
        <DeLijn length="full" dot={100} />
      </div>
    </div>
  );
}
