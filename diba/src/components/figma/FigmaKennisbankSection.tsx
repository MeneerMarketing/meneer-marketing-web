import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icon";
import Label from "@/components/ui/Label";
import Veegrij from "@/components/ui/Veegrij";
import { HOME_KENNISBANK_ARTICLES } from "@/data/home-kennisbank";

type FigmaKennisbankSectionProps = {
  id?: string;
  className?: string;
};

/**
 * Kennisbank — drie kaarten met eigen fotografie en een categorie-tag.
 *
 * Op een telefoon een rij die je opzij veegt en niet drie kaarten onder elkaar (Yasin,
 * 11 september 2026). Gemeten scheelt dat op 390 pixels ruim achthonderd pixels hoogte:
 * van drie schermen naar één. Vanaf 768 is het weer een raster van drie, want daar is de
 * ruimte er wel en is kijken sneller dan vegen.
 *
 * De marges staan daarom niet meer op de sectie maar op de onderdelen: een veegrij moet
 * rechts tot de schermrand kunnen doorlopen, anders zie je niet dat er meer is.
 */
export default function FigmaKennisbankSection({
  id = "kennis",
  className = "py-20",
}: FigmaKennisbankSectionProps) {
  return (
    <section id={id} className={className}>
      <div className="mx-auto px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <Label>Diba kennisbank</Label>
            <h2 className="diba-display-m mt-4">Uitleg per klacht.</h2>
          </div>
          {/* Wees hier naar het huidprobleemoverzicht, terwijl de kop "Diba kennisbank"
              belooft. Nu naar de kennisbank zelf, die sinds vandaag bestaat. */}
          <Link
            href="/kennisbank"
            className="diba-label inline-flex items-center gap-1.5 text-[var(--g-700)] underline underline-offset-4"
          >
            Naar de kennisbank
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>

      <Veegrij
        label="Uitleg per klacht"
        raster="md"
        klasse="mt-8 sm:mt-10"
        breedte="w-[82%] max-w-[420px] sm:w-[56%]"
        items={HOME_KENNISBANK_ARTICLES.map((article) => ({
          sleutel: article.id,
          naam: article.title,
          inhoud: (
            <Link
              href={article.href}
              className="group flex flex-col overflow-hidden rounded-[var(--r-md)] bg-[var(--g-025)] transition hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(67,79,58,.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
            >
              <div className="relative aspect-[16/7] overflow-hidden bg-[var(--g-200)] md:aspect-[4/3]">
                <Image
                  src={article.image.src}
                  alt={article.image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                {/* Hier lag groen over groen: van mint naar donkergroen, over de volle
                    hoogte van de foto. De chip linksboven draagt zijn eigen witte vlak, dus
                    er was niets dat leesbaar gehouden hoefde te worden. Nu een neutraal
                    vignet dat alleen onderin aanzet, zodat de kaartrand niet wegvalt. */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[var(--foto-scrim)]/28 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <span className="diba-label absolute left-4 top-4 rounded-[var(--r-pill)] bg-white/90 px-3.5 py-1.5 text-[var(--g-700)] backdrop-blur-[2px]">
                  {article.tag}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <h3 className="diba-card-title text-[var(--t-strong)]">
                  {article.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-[var(--t-body)]">
                  {article.summary}
                </p>
                <span className="diba-label mt-5 inline-flex items-center gap-1.5 transition group-hover:text-[var(--g-700)]">
                  Lees meer
                  <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          ),
        }))}
      />
    </section>
  );
}
