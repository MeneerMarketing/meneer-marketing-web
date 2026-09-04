import type { StudioData } from "@/types/studio";
import { ConceptBanner } from "@/components/preview/ConceptBanner";
import {
  buildSkinClinicMinimalModel,
  buildSkinClinicMinimalStyle,
} from "@/components/templates/clinical-minimal/skinClinicMinimalModel";
import {
  SkinClinicMinimalAbout,
  SkinClinicMinimalConcerns,
  SkinClinicMinimalHero,
  SkinClinicMinimalJourney,
  SkinClinicMinimalTopBar,
} from "@/components/templates/clinical-minimal/SkinClinicMinimalSections";
import {
  SkinClinicMinimalContact,
  SkinClinicMinimalStickyCta,
} from "@/components/templates/clinical-minimal/SkinClinicMinimalContact";
import { SkinClinicMinimalTrust } from "@/components/templates/clinical-minimal/SkinClinicMinimalTrust";
import { SkinClinicMinimalTreatments } from "@/components/templates/clinical-minimal/SkinClinicMinimalTreatments";
import type { MegaMenu } from "@/components/templates/reformer-minimal/ClinicChrome";
import { ClinicFaq, ClinicTeam } from "@/components/templates/reformer-minimal/ClinicSections";
import { ClinicReviews } from "@/components/templates/reformer-minimal/ClinicProof";
import { ClinicPricing } from "@/components/templates/reformer-minimal/ClinicPricing";
import { ClinicSocials } from "@/components/templates/reformer-minimal/ClinicSocials";
import { buildConceptClinicTeam } from "@/lib/clinicPreviewFallbacks";
import { clampWords } from "@/lib/text";

interface Props {
  studio: StudioData;
}

function buildMenus(model: ReturnType<typeof buildSkinClinicMinimalModel>): MegaMenu[] {
  const menus: MegaMenu[] = [
    {
      id: "kliniek",
      label: "Kliniek",
      href: "#over",
      columns: [
        {
          kop: "Ontdek",
          items: [
            {
              href: "#over",
              label: "Over de kliniek",
              zin: "Aanpak, sfeer en wat je kunt verwachten.",
            },
            {
              href: "#traject",
              label: "Jouw traject",
              zin: "Van intake tot nazorg en onderhoud.",
            },
            {
              href: "#ervaringen",
              label: "Ervaringen",
              zin: "Wat klanten zeggen na hun behandeling.",
            },
            ...(model.show.socials
              ? [
                  {
                    href: "#socials",
                    label: "Socials",
                    zin: "Volg de kliniek op Instagram en TikTok.",
                  },
                ]
              : []),
          ],
        },
        {
          kop: "Praktisch",
          items: [
            {
              href: "#faq",
              label: "Veelgestelde vragen",
              zin: "Intake, hersteltijd en nazorg uitgelegd.",
            },
            {
              href: "#contact",
              label: "Locatie & contact",
              zin: `${model.city}, bereikbaar voor vragen.`,
            },
            ...(model.show.plans
              ? [
                  {
                    href: "#tarieven",
                    label: "Pakketten",
                    zin: "Starttrajecten en onderhoud.",
                  },
                ]
              : []),
          ],
        },
      ],
      featured: {
        label: "Intake",
        kop: "Gratis huidanalyse",
        zin: "Plan een intake zonder verplichting. Je weet direct welk plan past.",
        href: model.booking.href,
        knop: model.booking.label,
        external: model.booking.external,
      },
    },
  ];

  if (model.treatments.length > 0) {
    menus.push({
      id: "behandelingen",
      label: "Behandelingen",
      href: "#behandelingen",
      columns: [
        {
          kop: "Populaire behandelingen",
          breed: model.treatments.length > 3,
          items: model.treatments.slice(0, 6).map((treatment) => ({
            href: "#behandelingen",
            label: treatment.name,
            zin: clampWords(treatment.description, 12) || undefined,
          })),
        },
      ],
      featured: {
        label: "Huidproblemen",
        kop: "Waar we bij helpen",
        zin: "Acne, pigment, roodheid en meer. Per thema een info-pagina.",
        href: "#huidproblemen",
        knop: "Bekijk thema's",
      },
    });
  }

  if (model.skinConcerns.length > 0) {
    menus.push({
      id: "huid",
      label: "Huidproblemen",
      href: "#huidproblemen",
      columns: [
        {
          kop: "Veelgevraagd",
          breed: model.skinConcerns.length > 4,
          items: model.skinConcerns.slice(0, 6).map((concern) => ({
            href: "#huidproblemen",
            label: concern.name,
            zin: clampWords(concern.description, 10) || undefined,
          })),
        },
      ],
      featured: {
        label: "SEO & info",
        kop: "Pagina per huidthema",
        zin: "Ideaal voor Google en klanten die eerst willen lezen.",
        href: "#huidproblemen",
        knop: "Naar overzicht",
      },
    });
  }

  return menus;
}

/**
 * Template B voor huidklinieken — modern minimal, trust-first clinic UX.
 * Tweede skin-clinic template (reformer-minimal variant).
 */
export function SkinClinicMinimalTemplate({ studio }: Props) {
  const model = buildSkinClinicMinimalModel(studio);
  const style = buildSkinClinicMinimalStyle(studio);
  const menus = buildMenus(model);

  const team =
    model.team.length > 0 ? model.team : buildConceptClinicTeam(studio);

  const teamWithImages = team.map((member, index) => ({
    ...member,
    image_url:
      member.image_url ||
      [
        "/demo/pilates-clinic-instructor-1.jpg",
        "/demo/pilates-clinic-instructor-2b.jpg",
        "/demo/pilates-clinic-instructor-3b.jpg",
      ][index % 3],
  }));

  return (
    <div
      className="figma-root sc-skin-minimal relative min-h-screen overflow-x-clip pb-20 md:pb-0"
      style={style}
    >
      <ConceptBanner studio={studio} tone="light" />

      <div className="fc-plane-010">
        <SkinClinicMinimalTopBar model={model} />
        <SkinClinicMinimalHero model={model} menus={menus} />
      </div>

      {model.show.about ? (
        <SkinClinicMinimalAbout
          studioName={model.studioName}
          city={model.city}
          about={model.about}
          image={model.studioImage}
          primaryService={model.primaryService}
          pillars={model.trustPillars}
          booking={model.booking}
        />
      ) : null}

      {model.show.treatments ? (
        <SkinClinicMinimalTreatments
          treatments={model.treatments}
          studioName={model.studioName}
        />
      ) : null}

      {model.show.concerns ? (
        <SkinClinicMinimalConcerns
          concerns={model.skinConcerns}
          studioName={model.studioName}
          city={model.city}
        />
      ) : null}

      {model.show.trust ? <SkinClinicMinimalTrust pillars={model.trustPillars} /> : null}

      {model.show.steps ? (
        <SkinClinicMinimalJourney steps={model.steps} bookingHref={model.booking.href} />
      ) : null}

      {model.show.quotes ? (
        <ClinicReviews
          quotes={model.quotes}
          rating={model.ratingDisplay}
          reviewCount={model.reviewCount}
          highlightsOnly={false}
          variant="skin-clinic"
        />
      ) : null}

      {model.show.team ? (
        <ClinicTeam team={teamWithImages} variant="skin-clinic" />
      ) : null}

      {model.show.socials ? (
        <ClinicSocials
          studioName={model.studioName}
          socials={model.socials}
          images={model.gallery}
          intro={`Behandelingen, sfeer en resultaten van ${model.studioName}. Dagelijks op Instagram en TikTok.`}
        />
      ) : null}

      {model.show.plans ? (
        <ClinicPricing
          plans={model.plans}
          booking={model.booking}
          note={model.pricingNote}
          variant="skin-clinic"
        />
      ) : null}

      {model.show.faq ? <ClinicFaq faqs={model.faqs} variant="skin-clinic" /> : null}

      <SkinClinicMinimalContact model={model} />
      <SkinClinicMinimalStickyCta booking={model.booking} />
    </div>
  );
}
