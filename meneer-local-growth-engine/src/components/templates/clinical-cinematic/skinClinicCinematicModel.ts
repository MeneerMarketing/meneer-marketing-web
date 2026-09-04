import type { StudioData, StudioSkinConcern } from "@/types/studio";
import type {
  CineBand,
  CineClass,
  CineImage,
  CineInstructor,
  CineModel,
  CineNavLink,
  CineStatement,
  CineStudio,
} from "@/components/templates/cinematic/cinematicModel";
import {
  buildConceptClinicFaqs,
  buildConceptClinicJourney,
  buildConceptClinicMembershipPlans,
  buildConceptClinicReviews,
  buildConceptClinicTreatments,
  buildConceptClinicTeam,
  buildConceptSkinConcerns,
} from "@/lib/clinicPreviewFallbacks";
import { isFitnessJargon, sanitizeClinicCopy } from "@/lib/clinicCopySanitizer";
import { SKIN_CLINIC_LIFESTYLE_FALLBACKS } from "@/lib/previewImagePolicy";
import { clinicImagesFromStudio } from "@/lib/mapPreviewImages";
import { resolveStudioLogoUrl } from "@/lib/studioLogo";
import { clampWords, normalizeEmail, plainText, quoteText, sentences } from "@/lib/text";

export interface SkinCineJourneyStep {
  id: string;
  title: string;
  body: string;
  image: CineImage;
  phase: string;
}

export interface SkinClinicCineBundle {
  model: CineModel;
  skinConcerns: StudioSkinConcern[];
  journey: SkinCineJourneyStep[];
}

const FALLBACKS = [
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.hero,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.reception,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.treatment,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.atmosphere,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.gallery1,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.gallery2,
] as const;

const JOURNEY_PHASES = ["intake", "plan", "sessie", "nazorg"] as const;

function pickImages(studio: StudioData, count: number): CineImage[] {
  return clinicImagesFromStudio(studio, count, FALLBACKS);
}

function splitWordmark(name: string): { head: string; tail: string } {
  const words = plainText(name).split(/\s+/).filter(Boolean);
  if (words.length <= 1) return { head: plainText(name), tail: "" };
  if (words.length === 2) return { head: words[0]!, tail: words[1]! };
  const mid = Math.ceil(words.length / 2);
  return { head: words.slice(0, mid).join(" "), tail: words.slice(mid).join(" ") };
}

function buildHeadline(tagline: string, primaryService: string): { first: string; second: string } {
  const clean = plainText(tagline);
  if (clean) {
    const words = clean.split(/\s+/).filter(Boolean);
    if (words.length >= 3) {
      const mid = Math.ceil(words.length / 2);
      return {
        first: words.slice(0, mid).join(" "),
        second: words.slice(mid).join(" "),
      };
    }
  }
  const service = primaryService || "huidbehandelingen";
  return { first: service, second: "met zorg." };
}

function zoneForTreatment(name: string): string {
  const blob = name.toLowerCase();
  if (/laser|licht|ipl|pigment/.test(blob)) return "laser suite";
  if (/botox|filler|inject/.test(blob)) return "inject room";
  if (/hydra|facial|reinig/.test(blob)) return "facial room";
  if (/peel|zuur|exfol/.test(blob)) return "peel studio";
  if (/intake|analyse|consult/.test(blob)) return "consult";
  if (/needle|microneed/.test(blob)) return "skin lab";
  return "behandelkamer";
}

function buildTreatments(studio: StudioData, gallery: CineImage[]): CineClass[] {
  const concept = buildConceptClinicTreatments(studio);
  return concept.slice(0, 6).map((item, index) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    duration: item.duration_minutes ? `${item.duration_minutes} min` : null,
    room: zoneForTreatment(item.name),
    highlight: item.highlight,
    image: gallery[index % gallery.length] ?? gallery[0]!,
  }));
}

function firstName(name: string): string {
  return name.trim().split(/\s+/).filter(Boolean)[0] ?? name;
}

function buildInstructors(studio: StudioData): CineInstructor[] {
  const team =
    (studio.team ?? []).length > 0 ? studio.team : buildConceptClinicTeam(studio);

  return team.slice(0, 4).map((member, index) => ({
    id: member.id,
    name: plainText(member.name),
    first: firstName(plainText(member.name)),
    role: plainText(member.role),
    bio: clampWords(plainText(member.bio), 36),
    image:
      member.image_url ||
      [
        "/demo/pilates-clinic-instructor-1.jpg",
        "/demo/pilates-clinic-instructor-2b.jpg",
        "/demo/pilates-clinic-instructor-3b.jpg",
      ][index % 3]!,
  }));
}

function buildStudioBlock(studio: StudioData, city: string, images: CineImage[]): CineStudio {
  const studioName = plainText(studio.studio_name);
  const desc = plainText(studio.description);
  const body =
    clampWords(desc, 52) ||
    `${studioName} is een huidkliniek${city ? ` in ${city}` : ""} waar intake, analyse en behandeling in één lijn lopen.`;

  const facts: CineStudio["facts"] = [];
  if (studio.review_rating > 0) {
    facts.push({
      value: studio.review_rating.toFixed(1).replace(".", ","),
      label: studio.review_count ? `${studio.review_count} reviews` : "beoordeling",
    });
  }
  facts.push({ value: "gratis", label: "intake" });
  if (city) facts.push({ value: city.toLowerCase(), label: "locatie" });

  const notes = (studio.benefits ?? [])
    .slice(0, 3)
    .map((b) => ({
      id: b.id,
      title: plainText(b.title),
      body: clampWords(plainText(b.description), 22),
    }))
    .filter((n) => n.title);

  if (notes.length < 3) {
    notes.push(
      {
        id: "note-analysis",
        title: "huidanalyse eerst",
        body: "Elk traject start met een analyse. Zo weten we welke behandeling veilig en logisch is.",
      },
      {
        id: "note-protocol",
        title: "clinical-grade protocollen",
        body: "Laser, peel en injectables worden afgestemd op huidtype, hersteltijd en doel.",
      },
      {
        id: "note-care",
        title: "nazorg die blijft",
        body: "We evalueren tussentijds en sturen bij. Thuisroutine hoort bij het plan.",
      },
    );
  }

  return {
    first: "de kliniek",
    second: city ? `in ${city.toLowerCase()}.` : "aan tafel.",
    body,
    facts: facts.slice(0, 3),
    notes: notes.slice(0, 4),
    main: images[1] ?? images[0]!,
    inset: images[2] ?? images[0]!,
  };
}

function buildJourney(studio: StudioData, images: CineImage[]): SkinCineJourneyStep[] {
  const steps = buildConceptClinicJourney(studio);
  return steps.slice(0, 4).map((step, index) => ({
    id: step.id,
    title: step.title,
    body: step.body,
    image: images[(index + 2) % images.length] ?? images[0]!,
    phase: JOURNEY_PHASES[index] ?? "traject",
  }));
}

export function buildSkinClinicCineBundle(studio: StudioData): SkinClinicCineBundle {
  const studioName = plainText(studio.studio_name);
  const city = plainText(studio.city);
  const primaryService = plainText(studio.primary_service) || "Huidbehandelingen";
  const images = pickImages(studio, 10);

  const heroPrimary = images[0] ?? SKIN_CLINIC_LIFESTYLE_FALLBACKS.hero;
  const heroSecond = images[1] ?? SKIN_CLINIC_LIFESTYLE_FALLBACKS.reception;
  const bandImage = images[2] ?? images[0]!;
  const gallery = images.slice(3, 8);

  const classes = buildTreatments(studio, gallery.length > 0 ? gallery : images);
  const skinConcerns = buildConceptSkinConcerns(studio.skin_concerns ? studio : undefined);
  const journey = buildJourney(studio, images);
  const instructors = buildInstructors(studio);
  const studioBlock = buildStudioBlock(studio, city, images);

  const lead =
    clampWords(sentences(studio.description)[0] ?? studio.description, 34) ||
    `Clinical-grade ${primaryService.toLowerCase()}${city ? ` in ${city}` : ""}. Intake, analyse en behandeling in één rustige lijn.`;

  const bookingRaw = plainText(studio.booking_url);

  const statement: CineStatement = {
    first: "jouw huid.",
    second: "ons vak.",
    body:
      clampWords(plainText(studio.description), 46) ||
      `${studioName} combineert medische esthetiek met een rustige kliniekervaring. Van intake tot nazorg: helder, persoonlijk en zonder harde beloftes.`,
  };

  const band: CineBand = {
    first: "rust die je voelt.",
    second: "resultaat dat blijft.",
    image: bandImage,
  };

  const focusPills =
    skinConcerns.length > 0
      ? skinConcerns.slice(0, 3).map((c) => ({ id: c.id, label: c.name }))
      : classes.slice(0, 3).map((c) => ({ id: c.id, label: c.name }));

  const plansFromData = (studio.memberships ?? []).map((plan) => ({
    id: plan.id,
    name: plainText(plan.name),
    price: plainText(plan.price_label),
    period: plainText(plan.period),
    description: clampWords(plainText(plan.description), 20),
    features: plan.features.map((f) => plainText(f)).filter(Boolean),
    featured: Boolean(plan.featured),
  }));

  const plans =
    plansFromData.length > 0
      ? plansFromData
      : buildConceptClinicMembershipPlans(studio).map((plan) => ({
          id: plan.id,
          name: plan.name,
          price: plan.priceLabel,
          period: plan.period,
          description: plan.description,
          features: plan.features,
          featured: plan.featured,
        }));

  const ratingValue = studio.review_rating > 0 ? studio.review_rating : 4.9;
  const defaultStars = Math.min(5, Math.max(4, Math.round(ratingValue)));

  const quotesFromReviews = (studio.reviews ?? [])
    .map((review) => {
      const text = sanitizeClinicCopy(review.text);
      if (!text || isFitnessJargon(text)) return null;
      if (text.split(/\s+/).filter(Boolean).length < 8) return null;
      return {
        id: review.id,
        text: clampWords(text, 34),
        author: plainText(review.author),
        meta: plainText(review.date_label) || null,
        rating: review.rating > 0 ? review.rating : defaultStars,
      };
    })
    .filter((q): q is NonNullable<typeof q> => Boolean(q));

  const quotes =
    quotesFromReviews.length > 0
      ? quotesFromReviews
      : buildConceptClinicReviews(studio, 6).map((item) => ({
          id: item.id,
          text: quoteText(item.text),
          author: item.author,
          meta: item.date_label,
          rating: item.rating,
        }));

  const navLinks: CineNavLink[] = [
    { href: "#top", label: "Home" },
    { href: "#behandelingen", label: "Behandelingen" },
    { href: "#huidproblemen", label: "Huidproblemen" },
    { href: "#traject", label: "Traject" },
    { href: "#team", label: "Team" },
    { href: "#kliniek", label: "De kliniek" },
    { href: "#tarieven", label: "Pakketten" },
    { href: "#ervaringen", label: "Ervaringen" },
    { href: "#faq", label: "Vragen" },
    { href: "#contact", label: "Contact" },
  ];

  const address = [plainText(studio.address), city].filter(Boolean).join(", ") || null;

  const model: CineModel = {
    studioName,
    logoUrl: resolveStudioLogoUrl(studio.logo),
    logoLight: studio.logo_light,
    logoOnLightBackground: studio.logo_on_light_background,
    wordmark: splitWordmark(studioName),
    city,
    primaryService,
    headline: buildHeadline(studio.tagline, primaryService),
    lead,
    booking: {
      href: bookingRaw || "#contact",
      external: Boolean(bookingRaw),
      label: "Gratis intake",
    },
    studioTypes: focusPills,
    statement,
    band,
    classes,
    schedule: [],
    instructors,
    studio: studioBlock,
    plans,
    reviews: {
      rating: ratingValue.toFixed(1).replace(".", ","),
      count: studio.review_count > 0 ? studio.review_count : 52,
      quotes,
    },
    faqs: buildConceptClinicFaqs(studio),
    hours: plainText(studio.opening_hours) || "ma–vr 09:00–18:00 · za op afspraak",
    navLinks,
    heroImage: heroPrimary,
    heroShots: [heroPrimary, heroSecond, images[2] ?? heroPrimary].filter(
      (img, index, arr) => arr.findIndex((x) => x.url === img.url) === index,
    ),
    gallery,
    pricingNote:
      plansFromData.length > 0
        ? null
        : "Indicatieve concepttarieven voor dit voorstel. Actuele prijzen volgen bij livegang.",
    quotesAreHighlights: quotesFromReviews.length === 0,
    contact: {
      address,
      email: normalizeEmail(studio.email),
      phone: plainText(studio.phone) || null,
      instagram: plainText(studio.instagram_url) || null,
    },
  };

  return { model, skinConcerns, journey };
}
