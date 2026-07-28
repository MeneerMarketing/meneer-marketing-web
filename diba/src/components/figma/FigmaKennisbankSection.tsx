import Image from "next/image";
import Link from "next/link";
import { HOME_KENNISBANK_ARTICLES } from "@/data/home-kennisbank";

type FigmaKennisbankSectionProps = {
  id?: string;
  className?: string;
};

/** Kennisbank — drie kaarten met Unsplash-beeld, groene tint en categorie-tag. */
export default function FigmaKennisbankSection({
  id = "kennis",
  className = "px-5 py-20 sm:px-9 lg:px-[7.5vw]",
}: FigmaKennisbankSectionProps) {
  return (
    <section id={id} className={className}>
      <div className="mx-auto max-w-[1800px]">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[.15em] text-[#5d9564]">
              Diba kennisbank
            </p>
            <h2 className="mt-4 text-4xl tracking-[-.06em] sm:text-6xl">Eerlijke huidkennis.</h2>
          </div>
          <Link
            href="/huidproblemen"
            className="text-[11px] font-medium uppercase tracking-[.13em] text-[#286943] underline underline-offset-5"
          >
            Bekijk alles ↗
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {HOME_KENNISBANK_ARTICLES.map((article) => (
            <Link
              key={article.id}
              href={article.href}
              className="group flex flex-col overflow-hidden rounded-[1.75rem] bg-[#f2f7ef] transition hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(35,100,62,.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#286943]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#cbe5bf]">
                <Image
                  src={article.image.src}
                  alt={article.image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover mix-blend-multiply opacity-90 transition duration-500 group-hover:scale-[1.03]"
                />
                <div
                  className="absolute inset-0 bg-[linear-gradient(180deg,rgba(148,188,138,.35)_0%,rgba(40,105,67,.22)_100%)]"
                  aria-hidden="true"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/88 px-3.5 py-1.5 text-[9px] font-semibold uppercase tracking-[.11em] text-[#286943] backdrop-blur-[2px]">
                  {article.tag}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <h3 className="text-xl leading-[1.08] tracking-[-.045em] text-[#17372a] sm:text-2xl">
                  {article.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-[#607968]">{article.summary}</p>
                <span className="mt-5 text-[10px] font-semibold uppercase tracking-[.12em] text-[#5d9564] transition group-hover:text-[#286943]">
                  Lees meer &gt;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
