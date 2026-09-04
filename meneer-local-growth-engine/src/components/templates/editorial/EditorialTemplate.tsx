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
import { resolveStudioLogoUrl } from "@/lib/studioLogo";

interface Props {
  studio: StudioData;
}

/**
 * Template A — editorial magazine (v2).
 * Gebruikt buildEditorialModel + Editorial* secties, niet de oude v1-layout.
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
    model.services.length > 0
      ? { href: "#lessen", label: "Bekijk de lessen" }
      : { href: "#studio", label: "Bekijk de studio" };

  const hasTopChrome = Boolean(
    model.ratingDisplay ||
      model.topBarUsps.length > 0 ||
      model.contact.phone ||
      model.contact.instagram
  );

  return (
    <div className="editorial-root relative pb-32" style={style}>
      <ConceptBanner studio={studio} tone="light" />

      <EditorialNav
        studioName={studioName}
        logoUrl={resolveStudioLogoUrl(studio.logo)}
        links={model.navLinks}
        booking={model.booking}
        overlay={model.heroHasMedia}
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
        chromeOffset={hasTopChrome}
      />

      <EditorialStudio
        about={model.about}
        collage={model.collage}
        seal={model.seal}
        link={
          model.services.length > 0
            ? { href: "#lessen", label: "Bekijk de lessen" }
            : null
        }
      />

      {model.show.lessen ? (
        <section id="lessen" className="ed-deep">
          <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-24 lg:px-16 lg:py-28">
            <ScrollReveal>
              <p className="ed-label text-[var(--ed-accent)]">Aanbod</p>
              <h2 className="ed-serif ed-h2 mt-4 max-w-[22ch]">
                {`Lessen bij ${studioName}`}
              </h2>
            </ScrollReveal>
            <div className="mt-12 md:mt-16">
              <EditorialServices
                services={model.services}
                images={model.serviceImages}
              />
            </div>
          </div>
        </section>
      ) : null}

      {model.show.statement && model.statement ? (
        <EditorialStatement
          statement={model.statement}
          image={model.statementImage}
          booking={model.booking}
          primaryService={primaryService}
          city={city}
        />
      ) : null}

      {model.show.bento ? (
        <EditorialBento bento={model.bento} heading="Wat deze studio kenmerkt" />
      ) : null}

      {model.show.quotes ? (
        <EditorialQuotes
          quotes={model.quotes}
          rating={model.ratingDisplay}
          ratingValue={studio.review_rating}
          reviewCount={studio.review_count}
          studioName={studioName}
          highlightsOnly={model.show.quotesAreHighlights}
        />
      ) : null}

      {model.show.team ? <EditorialTeam team={studio.team} /> : null}

      {model.show.gallery ? (
        <EditorialGallery images={model.gallery} studioName={studioName} />
      ) : null}

      {model.show.memberships || model.show.offer ? (
        <EditorialPricing
          memberships={studio.memberships}
          services={model.services}
          booking={model.booking}
          pricingNote={model.pricingNote}
        />
      ) : null}

      {model.show.faq ? (
        <EditorialFaq faqs={model.faqs} booking={model.booking} />
      ) : null}

      <EditorialContact
        city={city}
        studioName={studioName}
        contact={model.contact}
        booking={model.booking}
        image={model.contactImage}
      />

      <EditorialFooter
        studioName={studioName}
        logoUrl={resolveStudioLogoUrl(studio.logo)}
        city={city}
        country={plainText(studio.country)}
        links={model.navLinks}
        contact={model.contact}
        booking={model.booking}
        tagline={plainText(studio.tagline) || null}
      />
    </div>
  );
}
