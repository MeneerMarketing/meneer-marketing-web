import type { StudioData } from "@/types/studio";
import { ConceptBanner } from "@/components/preview/ConceptBanner";
import { ClinicSchedule } from "@/components/templates/reformer-minimal/ClinicSchedule";
import {
  ClinicTopBar,
  type MegaMenu,
} from "@/components/templates/reformer-minimal/ClinicChrome";
import { ClinicContact, ClinicStickyCta } from "@/components/templates/reformer-minimal/ClinicContact";
import { ClinicHero } from "@/components/templates/reformer-minimal/ClinicHero";
import { ClinicJourney } from "@/components/templates/reformer-minimal/ClinicJourney";
import {
  ClinicProof,
  ClinicReviews,
} from "@/components/templates/reformer-minimal/ClinicProof";
import {
  ClinicFaq,
  ClinicTeam,
} from "@/components/templates/reformer-minimal/ClinicSections";
import { ClinicPricing } from "@/components/templates/reformer-minimal/ClinicPricing";
import { ClinicSocials } from "@/components/templates/reformer-minimal/ClinicSocials";
import { ClinicTreatments } from "@/components/templates/reformer-minimal/ClinicTreatments";
import { buildClinicModel } from "@/components/templates/reformer-minimal/clinicModel";
import { clampWords } from "@/lib/text";

interface Props {
  studio: StudioData;
}

/**
 * Variant B — Clinic (Body Clinic / DIBA Figma-taal).
 * Solide kleurvlakken, mega-nav, max twee donkere bands.
 */
export function ReformerMinimalTemplate({ studio }: Props) {
  const model = buildClinicModel(studio);

  const menus: MegaMenu[] = [];

  menus.push({
    id: "studio",
    label: "Studio",
    href: "#studio",
    columns: [
      {
        kop: "Ontdek",
        items: [
          ...(model.show.schedule
            ? [
                {
                  href: "#rooster",
                  label: "Rooster deze week",
                  zin: "Tijden, instructeurs en vrije plekken.",
                },
              ]
            : []),
          {
            href: "#studio",
            label: "Over de studio",
            zin: "Sfeer, ruimte en hoe we werken.",
          },
          ...(model.show.team
            ? [
                {
                  href: "#team",
                  label: "Instructors",
                  zin: "Wie je begeleidt tijdens de les.",
                },
              ]
            : []),
          ...(model.show.quotes
            ? [
                {
                  href: "#ervaringen",
                  label: "Ervaringen",
                  zin: "Wat leden zeggen na hun traject.",
                },
              ]
            : []),
        ],
      },
      {
        kop: "Praktisch",
        items: [
          ...(model.show.faq
            ? [
                {
                  href: "#faq",
                  label: "Veelgestelde vragen",
                  zin: "Planning, niveau en wat je meeneemt.",
                },
              ]
            : []),
          {
            href: "#contact",
            label: "Locatie & contact",
            zin: `${model.city}, bereikbaar voor vragen.`,
          },
          ...(model.show.socials
            ? [
                {
                  href: "#socials",
                  label: "Socials",
                  zin: "Achter de schermen op Instagram.",
                },
              ]
            : []),
        ],
      },
    ],
    featured: {
      label: "Kennismaken",
      kop: "Kom een keer kijken",
      zin: "Kies een moment dat past. We helpen je naar de juiste les.",
      href: model.booking.href,
      knop: "Afspraak maken",
      external: model.booking.external,
    },
  });

  if (model.treatments.length > 0) {
    menus.push({
      id: "lessen",
      label: "Lessen",
      href: "#lessen",
      columns: [
        {
          kop: "Populaire lessen",
          breed: model.treatments.length > 3,
          items: model.treatments.slice(0, 6).map((treatment) => ({
            href: "#lessen",
            label: treatment.name,
            zin: clampWords(treatment.description, 12) || undefined,
          })),
        },
      ],
      featured: {
        label: "Membership",
        kop: "Kies jouw ritme",
        zin: "Losse lessen of een abonnement. Tarieven staan open.",
        href: "#tarieven",
        knop: "Bekijk tarieven",
      },
    });
  }

  return (
    <div className="figma-root relative min-h-screen overflow-x-clip pb-20 md:pb-0">
      <ConceptBanner studio={studio} tone="light" />

      <div className="fc-plane-010">
        <ClinicTopBar
          rating={model.ratingDisplay}
          reviewCount={model.reviewCount}
          email={model.contact.email}
          phone={model.contact.phone}
          showPlans={model.show.plans}
          showFaq={model.show.faq}
        />
        <ClinicHero model={model} menus={menus} />
      </div>

      {model.show.treatments ? (
        <ClinicTreatments treatments={model.treatments} />
      ) : null}

      {model.show.steps ? <ClinicJourney steps={model.steps} /> : null}

      {model.show.schedule ? (
        <ClinicSchedule
          days={model.schedule}
          city={model.city}
          intro={model.about.body}
          facts={model.about.facts}
          image={model.studioImage}
          booking={model.booking}
          hours={model.contact.hours}
          primaryService={model.primaryService}
        />
      ) : null}

      <ClinicProof
        rating={model.ratingDisplay}
        reviewCount={model.reviewCount}
        image={model.reformerImage ?? model.heroImage}
        studioName={model.studioName}
        city={model.city}
      />

      {model.show.quotes ? (
        <ClinicReviews
          quotes={model.quotes}
          rating={model.ratingDisplay}
          reviewCount={model.reviewCount}
        />
      ) : null}

      {model.show.team ? <ClinicTeam team={model.team} /> : null}

      {model.show.socials ? (
        <ClinicSocials
          studioName={model.studioName}
          socials={model.socials}
          images={model.gallery}
        />
      ) : null}

      <ClinicPricing
        plans={model.plans}
        booking={model.booking}
        note={model.pricingNote}
      />

      {model.show.faq ? <ClinicFaq faqs={model.faqs} /> : null}

      <ClinicContact model={model} />
      <ClinicStickyCta booking={model.booking} />
    </div>
  );
}
