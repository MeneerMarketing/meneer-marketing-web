import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import { GroeiscanPreview } from "@/components/home/GroeiscanPreview";
import { siteCtas } from "@/lib/cta";

export function GroeiscanSection() {
  return (
    <section
      className="border-b border-mm-border bg-mm-accent-subtle"
      aria-labelledby="groeiscan-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:items-start lg:gap-12">
          <Reveal className="min-w-0">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-mm-accent">
                Speel met je groei-profiel
              </p>
              <h2
                id="groeiscan-heading"
                className="mt-3 text-3xl font-extrabold tracking-tight text-mm-text sm:text-4xl"
              >
                De Groeiscan:{" "}
                <span className="text-mm-sky-deep">eerst spelen, dan plannen.</span>
              </h2>
              <p className="mt-4 text-lg leading-relaxed tracking-tight text-mm-muted">
                Op de{" "}
                <Link
                  href={siteCtas.groeiscan.href}
                  className="font-semibold text-mm-sky-deep underline-offset-4 hover:underline"
                >
                  Groeiscan-pagina
                </Link>{" "}
                stel je alles scherp: doelen, volwassenheid, frictie en
                kanalen. Live index, directe uitleg. Hieronder alvast een
                korte voorproef.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href={siteCtas.groeiscan.href}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-mm-accent px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-mm-accent/25 transition hover:bg-mm-accent-hover"
                >
                  Naar volledige Groeiscan
                  <ArrowUpRight className="size-5" aria-hidden />
                </Link>
                <Link
                  href={siteCtas.startIntake.href}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-mm-text/15 bg-white px-6 py-3.5 text-base font-bold text-mm-text transition hover:border-mm-sky/40"
                >
                  {siteCtas.startIntake.label}
                  <ArrowUpRight className="size-5" aria-hidden />
                </Link>
              </div>
            </div>
          </Reveal>
          <Reveal className="min-w-0" delay={0.08}>
            <GroeiscanPreview />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
