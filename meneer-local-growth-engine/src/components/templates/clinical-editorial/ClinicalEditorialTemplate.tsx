import type { StudioData, StudioMembership } from "@/types/studio";
import { ConceptBanner } from "@/components/preview/ConceptBanner";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { ClinicalEditorialContact } from "@/components/templates/clinical-editorial/ClinicalEditorialContact";
import { ClinicalEditorialFaq } from "@/components/templates/clinical-editorial/ClinicalEditorialFaq";
import { EditorialFooter } from "@/components/templates/editorial/EditorialFooter";
import { EditorialHero } from "@/components/templates/editorial/EditorialHero";
import { EditorialNav } from "@/components/templates/editorial/EditorialNav";
import { ClinicalEditorialPricing } from "@/components/templates/clinical-editorial/ClinicalEditorialPricing";
import { EditorialQuotes } from "@/components/templates/editorial/EditorialQuotes";
import { ClinicalEditorialTreatments } from "@/components/templates/clinical-editorial/ClinicalEditorialTreatments";
import { EditorialTeam } from "@/components/templates/editorial/EditorialTeam";
import {
  buildClinicalEditorialModel,
  buildClinicalEditorialStyle,
} from "@/components/templates/clinical-editorial/clinicalEditorialModel";
import {
  ClinicalEditorialAbout,
  ClinicalEditorialJourney,
} from "@/components/templates/clinical-editorial/ClinicalEditorialSections";
import { ClinicalEditorialConcerns } from "@/components/templates/clinical-editorial/ClinicalEditorialConcerns";
import { buildConceptClinicTeam } from "@/lib/clinicPreviewFallbacks";
import { resolveNavBrandName } from "@/lib/clinicCopySanitizer";
import { plainText } from "@/lib/text";
import { resolveStudioLogoUrl } from "@/lib/studioLogo";
import type { EditorialModel } from "@/components/templates/editorial/editorialModel";

interface Props {
  studio: StudioData;
}

function toEditorialHeroModel(
  model: ReturnType<typeof buildClinicalEditorialModel>,
): EditorialModel {
  return {
    palette: {
      ink: "var(--ed-ink)",
      paper: "var(--ed-paper)",
      accent: "var(--ed-accent)",
    },
    eyebrow: model.eyebrow,
    headlineWords: model.headlineWords,
    lead: model.lead,
    booking: model.booking,
    topBarUsps: model.topBarUsps,
    about: {
      heading: model.about.heading,
      paragraphs: model.about.paragraphs,
      meta: model.about.facts.map((f, i) => ({
        id: `fact-${i}`,
        value: f.value,
        label: f.label,
      })),
    },
    serviceImages: model.treatmentImages,
    statement: null,
    bento: { band: null, tiles: [] },
    quotes: model.quotes,
    ratingDisplay: model.ratingDisplay,
    gallery: model.gallery,
    heroImage: model.heroImage,
    heroHasMedia: model.heroHasMedia,
    collage: model.gallery.slice(0, 3),
    seal: null,
    statementImage: null,
    contactImage: model.contactImage,
    contact: model.contact,
    pricingNote: model.pricingNote,
    navLinks: model.navLinks,
    faqs: model.faqs,
    services: model.treatments,
    show: {
      statement: false,
      bento: false,
      quotes: model.show.quotes,
      quotesAreHighlights: false,
      team: model.show.team,
      gallery: false,
      memberships: model.show.memberships,
      offer: true,
      lessen: false,
      faq: model.show.faq,
    },
  };
}

function mapMemberships(
  plans: ReturnType<typeof buildClinicalEditorialModel>["memberships"],
): StudioMembership[] {
  return plans.map((plan) => ({
    id: plan.id,
    name: plan.name,
    price_label: plan.priceLabel,
    period: plan.period,
    description: plan.description,
    features: plan.features,
    featured: plan.featured,
  }));
}

/**
 * Template A voor huidklinieken — editorial magazine, clinical-grade copy.
 * Eerste skin-clinic template (editorial variant).
 */
export function ClinicalEditorialTemplate({ studio }: Props) {
  const model = buildClinicalEditorialModel(studio);
  const heroModel = toEditorialHeroModel(model);
  const style = buildClinicalEditorialStyle(studio);

  const studioName = plainText(studio.studio_name);
  const city = plainText(studio.city);
  const primaryService = plainText(studio.primary_service);

  const team =
    (studio.team ?? []).length > 0 ? studio.team : buildConceptClinicTeam(studio);

  const studioForPricing: StudioData = {
    ...studio,
    memberships: mapMemberships(model.memberships),
  };

  const hasTopChrome = Boolean(
    model.ratingDisplay ||
      model.topBarUsps.length > 0 ||
      model.contact.phone ||
      model.contact.instagram,
  );

  return (
    <div className="editorial-root relative pb-32" style={style}>
      <ConceptBanner studio={studio} tone="light" />

      <EditorialNav
        studioName={studioName}
        brandName={resolveNavBrandName(studioName)}
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
        model={heroModel}
        studioName={studioName}
        city={city}
        primaryService={primaryService}
        secondary={{ href: "#behandelingen", label: "Bekijk behandelingen" }}
        headlineCompact
        chromeOffset={hasTopChrome}
      />

      <ClinicalEditorialAbout
        studioName={studioName}
        city={city}
        heading={model.about.heading}
        lead={model.about.lead}
        paragraphs={model.about.paragraphs}
        pillars={model.about.pillars}
        facts={model.about.facts}
        image={model.aboutImage}
        booking={model.booking}
      />

      {model.show.treatments ? (
        <section id="behandelingen" className="ed-deep">
          <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-24 lg:px-16 lg:py-28">
            <ScrollReveal>
              <p className="ed-label text-[var(--ed-accent)]">Behandelingen</p>
              <h2 className="ed-serif ed-h2 mt-4 max-w-[22ch]">
                {`Behandelingen bij ${studioName}`}
              </h2>
              <p className="mt-4 max-w-[50ch] text-[15px] leading-relaxed text-[var(--ed-fg-70)]">
                Van intake tot laser en injectables. Elk protocol start met
                huidanalyse, zodat je weet wat bij jouw huid past.
              </p>
            </ScrollReveal>
            <div className="mt-12 md:mt-16">
              <ClinicalEditorialTreatments
                services={model.treatments}
                images={model.treatmentImages}
              />
            </div>
          </div>
        </section>
      ) : null}

      {model.show.concerns ? (
        <ClinicalEditorialConcerns
          concerns={model.skinConcerns}
          images={[...model.treatmentImages, ...model.gallery]}
          brandName={resolveNavBrandName(studioName)}
          city={city}
        />
      ) : null}

      {model.show.journey ? (
        <ClinicalEditorialJourney
          steps={model.journeySteps}
          bookingHref={model.booking.href}
        />
      ) : null}

      {model.show.quotes ? (
        <section id="reviews">
          <EditorialQuotes
            quotes={model.quotes}
            rating={model.ratingDisplay}
            ratingValue={studio.review_rating}
            reviewCount={studio.review_count}
            studioName={studioName}
            highlightsOnly={false}
          />
        </section>
      ) : null}

      <section id="team">
        <EditorialTeam team={team} />
      </section>

      {model.show.memberships ? (
        <ClinicalEditorialPricing
          memberships={studioForPricing.memberships}
          services={model.treatments}
          booking={model.booking}
          pricingNote={model.pricingNote}
        />
      ) : null}

      {model.show.faq ? (
        <ClinicalEditorialFaq faqs={model.faqs} booking={model.booking} />
      ) : null}

      <ClinicalEditorialContact
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
