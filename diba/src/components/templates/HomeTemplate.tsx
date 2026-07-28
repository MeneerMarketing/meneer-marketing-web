import Image from "next/image";
import Link from "next/link";
import HomeCtaBanner from "@/components/ui/HomeCtaBanner";
import HomeEerlijkAdviesSection from "@/components/ui/HomeEerlijkAdviesSection";
import HomeFaqSection from "@/components/ui/HomeFaqSection";
import HomeHuidscanSection from "@/components/ui/HomeHuidscanSection";
import HomeKennisbankSection from "@/components/ui/HomeKennisbankSection";
import HomeKliniekSection from "@/components/ui/HomeKliniekSection";
import HomeTrajectSection from "@/components/ui/HomeTrajectSection";
import HomeVoorJouSection from "@/components/ui/HomeVoorJouSection";
import HomeWerkwijzeSection from "@/components/ui/HomeWerkwijzeSection";
import HomeProofBar from "@/components/ui/HomeProofBar";
import {
  figmaContainer,
  figmaGuideLeft,
  figmaGuideRight,
  figmaHomeShell,
} from "@/lib/figma-home-layout";
import type { ProofStripItem } from "@/lib/site";

export type HomeTemplateProps = {
  hero: {
    image: { src: string; alt: string };
  };
  homeProofItems: readonly ProofStripItem[];
};

/** Homepage — hero + proof uit Figma Make export; overige secties volgen in port-batches. */
export default function HomeTemplate({
  hero,
  homeProofItems,
}: HomeTemplateProps) {
  return (
    <main className={figmaHomeShell}>
      <div className={figmaGuideLeft} aria-hidden="true" />
      <div className={figmaGuideRight} aria-hidden="true" />

      <section id="top" className={`relative ${figmaContainer}`}>
        <div className="grid min-h-[730px] lg:grid-cols-[1.18fr_.82fr]">
          <div className="flex flex-col justify-between py-14 lg:py-20">
            <div className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[.16em] text-[#5d8166]">
              <span className="h-2 w-2 rounded-full bg-[#5eae67]" aria-hidden="true" />
              Trust the green touch.
            </div>

            <div className="my-12">
              <p className="mb-5 text-[11px] uppercase tracking-[.14em] text-[#5d8166]">
                Huidzorg die klopt
              </p>
              <h1 className="max-w-4xl text-[clamp(3.8rem,8.3vw,8.8rem)] font-medium leading-[.84] tracking-[-.08em]">
                Geen gokwerk.
                <br />
                <span className="text-[#387849]">Wel jouw huid.</span>
              </h1>
              <p className="mt-8 max-w-md text-[16px] leading-7 text-[#5d7464]">
                Diba Clinics is de huidkliniek in Rotterdam voor eerlijk advies,
                professionele behandelingen en meetbaar resultaat.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/intake"
                className="rounded-full bg-[#286943] px-6 py-4 text-[11px] font-medium uppercase tracking-[.13em] text-white transition hover:-translate-y-0.5 hover:bg-[#174e31]"
              >
                Ontdek jouw huid ↗
              </Link>
              <Link
                href="#voor-jou"
                className="px-3 text-[11px] font-medium uppercase tracking-[.13em] text-[#2c6843] underline decoration-[#a0c9a1] underline-offset-5"
              >
                Ik zoek hulp bij
              </Link>
            </div>
          </div>

          <div className="relative min-h-[440px] overflow-hidden rounded-bl-[9rem] bg-[#cbe5bf] lg:rounded-bl-[14rem]">
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-center mix-blend-multiply opacity-75"
            />
            <div
              className="absolute inset-0 bg-[linear-gradient(145deg,rgba(232,248,220,.84),transparent_55%,rgba(38,104,66,.28))]"
              aria-hidden="true"
            />
            <span className="absolute left-7 top-7 rounded-full bg-white/90 px-4 py-2 text-[10px] font-medium uppercase tracking-[.12em] text-[#397449]">
              Huidzorg, zonder hype
            </span>
            <span className="absolute bottom-7 right-7 grid h-24 w-24 place-items-center rounded-full border border-white/70 bg-[#2c7649]/90 text-center text-[10px] uppercase leading-4 tracking-[.11em] text-white">
              Eerlijk
              <br />
              advies
            </span>
          </div>
        </div>
      </section>

      <HomeProofBar items={[...homeProofItems]} />

      <HomeVoorJouSection />
      <HomeHuidscanSection />
      <HomeWerkwijzeSection />
      <HomeEerlijkAdviesSection />
      <HomeTrajectSection />
      <HomeKliniekSection />
      <HomeKennisbankSection />
      <HomeFaqSection />
      <HomeCtaBanner />
    </main>
  );
}
