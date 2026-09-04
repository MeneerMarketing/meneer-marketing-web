import type { StudioData, StudioService } from "@/types/studio";
import { clampWords, plainText } from "@/lib/text";

/** Indicatieve concepttarieven voor previews zonder membership-data. */
export interface ConceptMembershipPlan {
  id: string;
  name: string;
  priceLabel: string;
  period: string;
  description: string;
  features: string[];
  featured: boolean;
}

export function buildConceptMembershipPlans(studio: StudioData): ConceptMembershipPlan[] {
  const studioName = plainText(studio.studio_name);
  const city = plainText(studio.city);
  const service = plainText(studio.primary_service) || "Pilates";
  const serviceLower = service.toLowerCase();

  return [
    {
      id: "concept-intro",
      name: "Intro Pack",
      priceLabel: "€79",
      period: "4 lessen",
      description: `Kennismaken met ${studioName}${city ? ` in ${city}` : ""}. Geldig voor ${serviceLower} en aanverwante lessen.`,
      features: ["4 lessen naar keuze", "Geldig 6 weken", "Inclusief mat en handdoek"],
      featured: false,
    },
    {
      id: "concept-membership",
      name: "Studio Membership",
      priceLabel: "€149",
      period: "per maand",
      description: "Onbeperkt trainen in groepslessen. Jouw ritme, onze ruimte.",
      features: [
        "Onbeperkt groepslessen",
        `Onbeperkt ${serviceLower}`,
        "Priority booking",
        "Maandelijks opzegbaar",
      ],
      featured: true,
    },
    {
      id: "concept-private",
      name: "Private Series",
      priceLabel: "€420",
      period: "6 sessies",
      description:
        "Persoonlijk traject op de reformer of mat. Voor wie dieper wil werken aan techniek en doelen.",
      features: ["6 private sessies", "Persoonlijk programma", "Flexibel inplannen"],
      featured: false,
    },
  ];
}

export interface ConceptFaq {
  id: string;
  question: string;
  answer: string;
}

/** Minimaal aantal FAQ-items in conceptpreviews zodat de sectie vol oogt. */
export const MIN_PREVIEW_FAQS = 5;

export function buildConceptFaqs(studio: StudioData): ConceptFaq[] {
  const studioName = plainText(studio.studio_name);
  const city = plainText(studio.city);
  const service = plainText(studio.primary_service) || "Pilates";

  return [
    {
      id: "concept-faq-1",
      question: `Kan ik als beginner starten bij ${studioName}?`,
      answer:
        "Ja. Lessen hebben aanpassingen voor elk niveau. Je krijgt uitleg over de basis en traint in je eigen tempo.",
    },
    {
      id: "concept-faq-2",
      question: "Wat neem ik mee naar een les?",
      answer:
        "Comfortabele sportkleding en antislip sokken. Matten en benodigde materialen zijn in de studio aanwezig.",
    },
    {
      id: "concept-faq-3",
      question: "Hoe groot zijn de groepen?",
      answer:
        "Kleine groepen, zodat er ruimte is voor persoonlijke aandacht en scherpe instructie.",
    },
    {
      id: "concept-faq-4",
      question: city ? `Waar zit de studio in ${city}?` : "Waar zit de studio?",
      answer: plainText(studio.address)
        ? `Aan ${plainText(studio.address)}${city ? ` in ${city}` : ""}.`
        : `${studioName}${city ? ` in ${city}` : ""}. Neem contact op voor route en parkeren.`,
    },
    {
      id: "concept-faq-5",
      question: `Is ${service.toLowerCase()} geschikt om wekelijks te doen?`,
      answer:
        "Voor de meeste leden werkt een vast ritme van twee tot drie keer per week goed. Je bouwt kracht, controle en lengte op zonder overbelasting.",
    },
  ];
}

/** Echte FAQ's eerst; concept-vragen vullen aan tot minimaal MIN_PREVIEW_FAQS. */
export function ensureConceptFaqs(
  studio: StudioData,
  minimum = MIN_PREVIEW_FAQS
): ConceptFaq[] {
  const fromData: ConceptFaq[] = (studio.faqs ?? [])
    .map((faq) => ({
      id: faq.id,
      question: plainText(faq.question),
      answer: plainText(faq.answer),
    }))
    .filter((faq) => faq.question && faq.answer);

  const merged = [...fromData];
  for (const concept of buildConceptFaqs(studio)) {
    if (merged.length >= minimum) break;
    const duplicate = merged.some(
      (item) => item.question.toLowerCase() === concept.question.toLowerCase()
    );
    if (duplicate) continue;
    merged.push(concept);
  }

  return merged;
}

export interface ConceptInstructor {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

const CONCEPT_INSTRUCTOR_PHOTOS = [
  "/demo/pilates-clinic-instructor-1.jpg",
  "/demo/pilates-clinic-instructor-2b.jpg",
  "/demo/pilates-clinic-instructor-3b.jpg",
] as const;

export function isConceptInstructorImage(url: string): boolean {
  return CONCEPT_INSTRUCTOR_PHOTOS.some((path) => url.startsWith(path));
}

export function buildConceptInstructors(studio: StudioData): ConceptInstructor[] {
  const service = plainText(studio.primary_service) || "Pilates";
  const city = plainText(studio.city);

  return [
    {
      id: "concept-instructor-1",
      name: "Lead instructor",
      role: "Founder & hoofdtrainer",
      bio: clampWords(
        `Opgeleid in klassieke ${service.toLowerCase()} en moderne movement training. Focus op alignment, adem en veilige progressie.`,
        38
      ),
      image: CONCEPT_INSTRUCTOR_PHOTOS[0],
    },
    {
      id: "concept-instructor-2",
      name: "Studio coach",
      role: `${service} instructor`,
      bio: clampWords(
        `Begeleidt groeps- en privélessen${city ? ` in ${city}` : ""}. Helpt je techniek scherper te maken zonder de rust uit de les te halen.`,
        38
      ),
      image: CONCEPT_INSTRUCTOR_PHOTOS[1],
    },
    {
      id: "concept-instructor-3",
      name: "Movement specialist",
      role: "Mat & studio",
      bio: clampWords(
        "Maakt complexe bewegingen begrijpelijk. Lessen voelen kalm, maar je loopt sterker en langer de studio uit.",
        38
      ),
      image: CONCEPT_INSTRUCTOR_PHOTOS[2],
    },
  ];
}

export interface ConceptQuote {
  id: string;
  text: string;
  author: string;
  meta: string | null;
}

export function buildConceptQuotes(studio: StudioData): ConceptQuote[] {
  const rating = studio.review_rating > 0 ? studio.review_rating : 4.9;
  const scoreMeta =
    studio.review_count > 0
      ? `${rating.toFixed(1).replace(".", ",")} · ${studio.review_count} openbare beoordelingen`
      : "Studio focus";

  const fromBenefits: ConceptQuote[] = [];
  for (const benefit of studio.benefits ?? []) {
    const title = plainText(benefit.title);
    const description = plainText(benefit.description);
    if (!title || description.length < 28) continue;
    fromBenefits.push({
      id: `highlight-${benefit.id}`,
      text: clampWords(description, 34),
      author: title,
      meta: scoreMeta,
    });
  }

  if (fromBenefits.length >= 3) return fromBenefits.slice(0, 4);

  const city = plainText(studio.city);
  const service = plainText(studio.primary_service) || "Pilates";
  const studioName = plainText(studio.studio_name);

  const fillers: ConceptQuote[] = [
    {
      id: "highlight-1",
      text: clampWords(
        studio.description ||
          `${studioName} richt zich op ${service.toLowerCase()}${city ? ` in ${city}` : ""}.`,
        34
      ),
      author: studioName,
      meta: scoreMeta,
    },
    {
      id: "highlight-2",
      text: "Kleine groepen, scherpe cues en een studio die uitnodigt tot focus. Je traint kracht en controle zonder ruis.",
      author: "Studio sfeer",
      meta: scoreMeta,
    },
    {
      id: "highlight-3",
      text: `Het aanbod draait om ${service.toLowerCase()}. Plan een proefles en voel zelf hoe de lessen aanvoelen.`,
      author: service,
      meta: scoreMeta,
    },
  ];

  return [...fromBenefits, ...fillers].slice(0, 4);
}

/** Minimaal aantal lessen in conceptpreviews zodat de linkerkolom vol oogt. */
export const MIN_PREVIEW_SERVICES = 5;

function inferServiceDuration(name: string): number {
  const lower = name.toLowerCase();
  if (/stretch|restore|herstel|rust|adem|yin/.test(lower)) return 45;
  if (/priv|één-op-één|een-op-een|1-op-1|duo/.test(lower)) return 55;
  if (/mat\b|matwork|vloer|yoga/.test(lower)) return 50;
  if (/reformer|toestel/.test(lower)) return 55;
  return 55;
}

export function ensureConceptServices(
  studio: StudioData,
  minimum = MIN_PREVIEW_SERVICES
): StudioService[] {
  return buildConceptTreatments(studio, minimum).map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    duration_minutes: item.duration_minutes,
    highlight: item.highlight,
  }));
}

export interface ConceptTreatment {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  highlight: boolean;
}

const CONCEPT_LESSON_TEMPLATES: Omit<ConceptTreatment, "id">[] = [
  {
    name: "Reformer Pilates",
    description:
      "Klassieke reformer lessen in kleine groepen. Elke beweging met weerstand, ritme en adem. Voor beginners én gevorderden.",
    duration_minutes: 55,
    highlight: true,
  },
  {
    name: "Mat Pilates",
    description:
      "Zuivere matwork op de vloer. Core, stabiliteit en flow. Ideaal als aanvulling of startpunt.",
    duration_minutes: 50,
    highlight: false,
  },
  {
    name: "Private Reformer",
    description:
      "Eén-op-één op de reformer. Jouw tempo, jouw doelen, volledige aandacht van de instructor.",
    duration_minutes: 55,
    highlight: false,
  },
  {
    name: "Duo Reformer",
    description:
      "Train met z'n tweeën. Dezelfde intensiteit als private, met de energie van samen bewegen.",
    duration_minutes: 55,
    highlight: false,
  },
  {
    name: "Stretch & Restore",
    description:
      "Lange rekkingen, ademwerk en rust op de reformer. Ideaal na een zware week of als herstelles.",
    duration_minutes: 45,
    highlight: false,
  },
];

export function buildConceptTreatments(
  studio: StudioData,
  minimum = 5
): ConceptTreatment[] {
  const service = plainText(studio.primary_service) || "Reformer Pilates";
  const studioName = plainText(studio.studio_name);
  const city = plainText(studio.city);

  const fromServices: ConceptTreatment[] = (studio.services ?? []).map((item) => ({
    id: item.id,
    name: plainText(item.name),
    description:
      plainText(item.description) ||
      `${plainText(item.name)} bij ${studioName}${city ? ` in ${city}` : ""}. Focus op techniek, adem en controle.`,
    duration_minutes: item.duration_minutes ?? inferServiceDuration(plainText(item.name)),
    highlight: Boolean(item.highlight),
  }));

  const merged = [...fromServices];
  const templates = CONCEPT_LESSON_TEMPLATES.map((template, index) => ({
    ...template,
    id: `concept-lesson-${index + 1}`,
    name: index === 0 ? service : template.name,
    highlight: index === 0,
  }));

  for (const template of templates) {
    if (merged.length >= minimum) break;
    if (merged.some((item) => item.name.toLowerCase() === template.name.toLowerCase())) {
      continue;
    }
    merged.push(template);
  }

  if (merged.length > 0 && !merged.some((item) => item.highlight)) {
    merged[0] = { ...merged[0]!, highlight: true };
  }

  return merged.slice(0, Math.max(minimum, fromServices.length));
}

export interface ConceptReview {
  id: string;
  author: string;
  text: string;
  date_label: string;
  rating: number;
}

export function buildConceptReviews(studio: StudioData, minimum = 6): ConceptReview[] {
  const studioName = plainText(studio.studio_name);
  const city = plainText(studio.city);
  const service = plainText(studio.primary_service) || "Pilates";
  const rating = studio.review_rating > 0 ? studio.review_rating : 4.9;

  const fromData: ConceptReview[] = [];
  for (const review of studio.reviews ?? []) {
    const text = plainText(review.text);
    const author = plainText(review.author);
    if (!text || text.split(/\s+/).filter(Boolean).length < 8) continue;
    fromData.push({
      id: review.id,
      author: author || "Lid",
      text: clampWords(text, 38),
      date_label: plainText(review.date_label) || "recent",
      rating: review.rating > 0 ? review.rating : rating,
    });
    if (fromData.length >= minimum) return fromData.slice(0, minimum);
  }

  const fillers: ConceptReview[] = [
    {
      id: "concept-review-1",
      author: "Emma van Dijk",
      text: `Eindelijk een studio waar de instructie echt scherp is. Kleine groepen, rustige ruimte, en na een paar weken merk ik verschil in houding én kracht bij ${studioName}.`,
      date_label: "maart 2026",
      rating,
    },
    {
      id: "concept-review-2",
      author: "Thomas Janssen",
      text: `Als hardloper dacht ik dat ${service.toLowerCase()} soft was. De reformerlessen hebben mijn core en heupen sterker gemaakt. Blessures zijn verdwenen.`,
      date_label: "januari 2026",
      rating,
    },
    {
      id: "concept-review-3",
      author: "Mirthe Vos",
      text: "De sfeer is premium zonder pretentie. Boeken is makkelijk, de trainers kennen je naam, en elke les voelt doordacht.",
      date_label: "februari 2026",
      rating,
    },
    {
      id: "concept-review-4",
      author: "Sanne de Boer",
      text: city
        ? `Fijn dat er in ${city} eindelijk een studio is waar je echt gezien wordt. Cues zijn helder en de reformers staan perfect afgesteld.`
        : "Fijn dat je echt gezien wordt. Cues zijn helder en de reformers staan perfect afgesteld.",
      date_label: "december 2025",
      rating,
    },
    {
      id: "concept-review-5",
      author: "Noah Peters",
      text: `Ik startte als beginner en voelde me nooit ongemakkelijk. ${service} voelt hier veilig, uitdagend en heel persoonlijk.`,
      date_label: "november 2025",
      rating,
    },
    {
      id: "concept-review-6",
      author: "Lisa Vermeer",
      text: "Mijn favoriete vast ritme in de week. Na elke les loop ik langer en sterker de studio uit. Precies wat ik zocht.",
      date_label: "oktober 2025",
      rating,
    },
  ];

  const merged = [...fromData];
  for (const filler of fillers) {
    if (merged.length >= minimum) break;
    if (merged.some((item) => item.text === filler.text)) continue;
    merged.push(filler);
  }

  return merged.slice(0, minimum);
}
