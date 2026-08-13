import Image from "next/image";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { EditorialIcon } from "@/components/templates/editorial/EditorialIcon";
import {
  EditorialPose,
  poseForLabel,
} from "@/components/templates/editorial/EditorialPose";
import type {
  EditorialImage,
  EditorialModel,
  EditorialStatement as Statement,
} from "@/components/templates/editorial/editorialModel";

interface Props {
  statement: Statement;
  image: EditorialImage | null;
  booking: EditorialModel["booking"];
  primaryService: string;
  city: string;
}

/**
 * Tweede beeldmoment van de pagina: statement over een full-bleed foto met
 * trage parallax. Werkt ook bij dunne copy, omdat het beeld het werk doet.
 */
export function EditorialStatement({
  statement,
  image,
  booking,
  primaryService,
  city,
}: Props) {
  const pose = poseForLabel(statement.title, 0);

  if (!image) {
    return (
      <section className="ed-tint border-y border-[var(--ed-line)]">
        <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-24 lg:px-16 lg:py-28">
          <ScrollReveal>
            <EditorialPose
              name={pose}
              className="h-24 w-24 text-[var(--ed-accent)]"
            />
            <p className="ed-serif mt-8 max-w-[26ch] pb-1 text-[clamp(2.1rem,4.4vw,3.9rem)] leading-[1.06] tracking-[-0.018em]">
              {statement.title}
              <span className="text-[var(--ed-accent)]">.</span>
            </p>
            {statement.body ? (
              <p className="mt-7 max-w-[56ch] text-[1.02rem] leading-relaxed text-[var(--ed-fg-70)] md:text-[1.1rem]">
                {statement.body}
              </p>
            ) : null}
          </ScrollReveal>
        </div>
      </section>
    );
  }

  const meta = [primaryService, city].filter(Boolean).join(" · ");

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="ed-parallax absolute inset-0">
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes="100vw"
            className="ed-grade object-cover object-center"
          />
        </div>
        <div aria-hidden className="ed-scrim-left absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-36 lg:px-16 lg:py-44">
        <ScrollReveal>
          <div className="max-w-[38rem]">
            <EditorialPose
              name={pose}
              className="ed-float h-[6.5rem] w-[6.5rem] text-white/90"
            />
            {meta ? (
              <p className="ed-label mt-7 text-white/70">{meta}</p>
            ) : null}
            <p className="ed-serif mt-6 max-w-[24ch] pb-1 text-[clamp(2.2rem,4.8vw,4.1rem)] leading-[1.04] tracking-[-0.022em] text-white">
              {statement.title}
              <span className="text-[#e7c9ad]">.</span>
            </p>
            {statement.body ? (
              <p className="mt-7 max-w-[52ch] text-[1.02rem] leading-relaxed text-white/85 md:text-[1.1rem]">
                {statement.body}
              </p>
            ) : null}
            <a
              href={booking.href}
              {...(booking.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="ed-label ed-btn group mt-10 inline-flex items-center justify-center gap-2.5 bg-white px-8 py-4 text-[#2a211a] transition-colors duration-300 hover:text-white"
            >
              {booking.label}
              <EditorialIcon
                name="arrow"
                className="h-3.5 w-3.5 transition-transform duration-500 ease-[var(--ease-premium)] group-hover:translate-x-1"
              />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
