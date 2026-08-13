import type { StudioData } from "@/types/studio";
import { ConceptBanner } from "@/components/preview/ConceptBanner";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { EditorialBento } from "@/components/templates/editorial/EditorialBento";
import { EditorialContact } from "@/components/templates/editorial/EditorialContact";
import { EditorialFaq } from "@/components/templates/editorial/EditorialFaq";
import { EditorialFooter } from "@/components/templates/editorial/EditorialFooter";
import { EditorialGallery } from "@/components/templates/editorial/EditorialGallery";
import { EditorialHero } from "@/components/templates/editorial/EditorialHero";
import { EditorialNav } from "@/components/templates/editorial/EditorialNav";
import { EditorialPricing } from "@/components/templates/editorial/EditorialPricing";
import { EditorialQuotes } from "@/components/templates/editorial/EditorialQuotes";
import { EditorialServices } from "@/components/templates/editorial/EditorialServices";
import { EditorialStatement } from "@/components/templates/editorial/EditorialStatement";
import { EditorialStudio } from "@/components/templates/editorial/EditorialStudio";
import { EditorialTeam } from "@/components/templates/editorial/EditorialTeam";
import {
  buildEditorialModel,
  type EditorialStyle,
} from "@/components/templates/editorial/editorialModel";
import { plainText } from "@/lib/text";

interface Props {
  studio: StudioData;
}

/**
 * Template A: editorial magazine-taal voor boutique Pilates.
 * Palet komt uit het brandprofiel van de studio, met een koele
 * forest/bone fallback wanneer de gescrapete kleuren onleesbaar zijn.
 */
export function EditorialTemplate({ studio }: Props) {
  const model = buildEditorialModel(studio);
  const studioName = plainText(studio.studio_name);
  const city = plainText(studio.city);
  const primaryService = plainText(studio.primary_service);

  const style: EditorialStyle = {
    "--ed-ink": model.palette.ink,
    "--ed-paper": model.palette.paper,
    "--ed-accent-base": model.palette.accent,
  };

  const heroSecondary =
    studio.services.length > 0
      ? { href: "#lessen", label: "Bekijk de lessen" }
      : { href: "#studio", label: "Bekijk de studio" };

  const hasTopBar = Boolean(
    model.ratingDisplay ||
      model.topBarUsps.length > 0 ||
      model.contact.phone ||
      model.contact.instagram
  );

  return (
    <div className="editorial-root relative" style={style}>
      <ConceptBanner studio={studio} tone="light" />

      <EditorialNav
        studioName={studioName}
        links={model.navLinks}
        booking={model.booking}
        overlay={Boolean(model.heroImage)}
        rating={model.ratingDisplay}
        ratingValue={studio.review_rating}
        reviewCount={studio.review_count}
        usps={model.topBarUsps}
        phone={model.contact.phone}
        instagram={model.contact.instagram}
      />

      <EditorialHero
        model={model}
        studioName={studioName}
        city={city}
        primaryService={primaryService}
        secondary={heroSecondary}
        chromeOffset={hasTopBar}
      />

      <EditorialStudio
        about={model.about}
        collage={model.collage}
        seal={model.seal}
        link={studio.services.length > 0 ? heroSecondary : null}
      />

      {studio.services.length > 0 ? (
        <section id="lessen" className="ed-deep">
          <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-24 lg:px-16 lg:py-28">
            <ScrollReveal>
              <p className="ed-label text-[var(--ed-accent)]">Aanbod</p>
              <h2 className="ed-serif ed-h2 mt-4 max-w-[34ch]">
                {`Lessen bij ${studioName}`}
              </h2>
              <p className="mt-5 max-w-[46ch] text-[1rem] leading-relaxed text-[var(--ed-fg-70)]">
                Kies een lesvorm en zie direct hoe die eruitziet.
              </p>
            </ScrollReveal>
            <div className="mt-12 md:mt-16">
              <EditorialServices
                services={studio.services}
                images={model.serviceImages}
              />
            </div>
          </div>
        </section>
      ) : null}

      {model.statement ? (
        <EditorialStatement
          statement={model.statement}
          image={model.statementImage}
          booking={model.booking}
          primaryService={primaryService}
          city={city}
        />
      ) : null}

      <EditorialBento bento={model.bento} heading="Wat deze studio kenmerkt" />

      <EditorialQuotes
        quotes={model.quotes}
        rating={model.ratingDisplay}
        ratingValue={studio.review_rating}
        reviewCount={studio.review_count}
        studioName={studioName}
      />

      <EditorialTeam team={studio.team} />

      <EditorialGallery images={model.gallery} studioName={studioName} />

      <EditorialPricing
        memberships={studio.memberships}
        services={studio.services}
        booking={model.booking}
        pricingNote={model.pricingNote}
      />

      <EditorialFaq faqs={studio.faqs} booking={model.booking} />

      <EditorialContact
        city={city}
        studioName={studioName}
        contact={model.contact}
        booking={model.booking}
        image={model.contactImage}
      />

      <EditorialFooter
        studioName={studioName}
        city={city}
        country={plainText(studio.country)}
        links={model.navLinks}
        contact={model.contact}
      />
    </div>
  );
}
