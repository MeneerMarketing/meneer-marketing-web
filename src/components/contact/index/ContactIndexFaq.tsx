import { DienstFAQ } from "@/components/diensten/DienstFAQ";
import { Reveal } from "@/components/effects/Reveal";
import { CONTACT_FAQ } from "@/data/contact-index";

export function ContactIndexFaq() {
  return (
    <section
      className="border-b border-slate-200 bg-white"
      aria-labelledby="contact-faq-heading"
    >
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <Reveal>
          <h2
            id="contact-faq-heading"
            className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
          >
            Vragen over contact
          </h2>
          <p className="mt-2 text-slate-600">
            Kort en eerlijk. Staat je vraag er niet tussen? Stuur gewoon een
            bericht.
          </p>
        </Reveal>
        <div className="mt-8">
          <DienstFAQ items={[...CONTACT_FAQ]} idPrefix="contact-index" />
        </div>
      </div>
    </section>
  );
}
