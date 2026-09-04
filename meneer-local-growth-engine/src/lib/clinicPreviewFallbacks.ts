import type { StudioData, StudioService, StudioSkinConcern } from "@/types/studio";
import { isFitnessJargon, resolveNavBrandName, sanitizeClinicCopy } from "@/lib/clinicCopySanitizer";
import type { ConceptReview } from "@/lib/previewContentFallbacks";
import { clampWords, formatDisplayLabel, plainText } from "@/lib/text";

export const MIN_CLINIC_TREATMENTS = 6;
export const MIN_SKIN_CONCERNS = 8;

export interface ConceptClinicTreatment {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  highlight: boolean;
}

const CLINIC_TREATMENT_TEMPLATES: Omit<ConceptClinicTreatment, "id">[] = [
  {
    name: "Botox & fillers",
    description:
      "Subtiele correctie van expressielijnen en volumeherstel. Altijd na intake en met aandacht voor natuurlijke verhoudingen.",
    duration_minutes: 45,
    highlight: true,
  },
  {
    name: "Laserbehandelingen",
    description:
      "Gericht op pigment, roodheid of huidtextuur. Het protocol stemmen we af op jouw huidtype en doel.",
    duration_minutes: 60,
    highlight: false,
  },
  {
    name: "HydraFacial",
    description:
      "Diepe reiniging, hydratatie en glow in één sessie. Geschikt als onderhoud of startpunt van een huidplan.",
    duration_minutes: 50,
    highlight: false,
  },
  {
    name: "Huidanalyse & intake",
    description:
      "Gratis startgesprek met huidanalyse. Je weet precies welke aanpak past voordat je een behandeling plant.",
    duration_minutes: 30,
    highlight: false,
  },
  {
    name: "Microneedling",
    description:
      "Kan de huidstructuur ondersteunen en de opname van actieve ingrediënten verbeteren. Altijd afgestemd op hersteltijd.",
    duration_minutes: 55,
    highlight: false,
  },
  {
    name: "Chemical peel",
    description:
      "Gecontroleerde exfoliatie voor een frissere teint. Intensiteit en diepte worden per huid bepaald.",
    duration_minutes: 45,
    highlight: false,
  },
];

const SKIN_CONCERN_TEMPLATES: Omit<StudioSkinConcern, "id">[] = [
  {
    slug: "donkere-kringen",
    name: "Donkere kringen",
    description:
      "Vermoeide blik of schaduw onder de ogen kan je uitstraling beïnvloeden. We kijken naar oorzaak, huid en een passend plan.",
    related_treatment: "Botox & fillers",
  },
  {
    slug: "acne",
    name: "Acne & onzuiverheden",
    description:
      "Actieve onzuiverheden of littekens vragen om een protocol op maat. Reiniging, peel of laser kunnen onderdeel zijn.",
    related_treatment: "HydraFacial",
  },
  {
    slug: "pigmentvlekken",
    name: "Pigmentvlekken",
    description:
      "Ongelijke pigmentatie door zon of hormonen. Laser en peel kunnen helpen om de teint egaler te laten ogen.",
    related_treatment: "Laserbehandelingen",
  },
  {
    slug: "rimpels",
    name: "Rimpels & huidveroudering",
    description:
      "Fijne lijntjes of volumeverlies. Botox, fillers en huidverbetering kunnen samen een frisser beeld geven.",
    related_treatment: "Botox & fillers",
  },
  {
    slug: "droge-huid",
    name: "Droge of gevoelige huid",
    description:
      "Barrière en hydratatie eerst. Behandelingen en thuisprotocol ondersteunen een rustigere, comfortabelere huid.",
    related_treatment: "HydraFacial",
  },
  {
    slug: "couperose",
    name: "Couperose & roodheid",
    description:
      "Zichtbare vaatjes of diffuse roodheid. Laser kan helpen om de huid rustiger en egaler te laten ogen.",
    related_treatment: "Laserbehandelingen",
  },
  {
    slug: "striae",
    name: "Striae",
    description:
      "Striemen door groei of spanning. Microneedling en laser kunnen de structuur en kleur ondersteunen.",
    related_treatment: "Microneedling",
  },
  {
    slug: "doffe-huid",
    name: "Doffe huid",
    description:
      "Geen glow of een vale teint. Peel, HydraFacial of een combinatieplan kan de huid frisser laten stralen.",
    related_treatment: "Chemical peel",
  },
];

function inferTreatmentDuration(name: string): number {
  const lower = name.toLowerCase();
  if (/intake|analyse|consult/.test(lower)) return 30;
  if (/botox|filler|inject/.test(lower)) return 45;
  if (/laser|ipl|microneedling|peel|hydra/.test(lower)) return 55;
  return 50;
}

export function buildConceptClinicTreatments(
  studio: StudioData,
  minimum = MIN_CLINIC_TREATMENTS,
): ConceptClinicTreatment[] {
  const service = formatDisplayLabel(plainText(studio.primary_service) || "Huidbehandelingen");
  const studioName = plainText(studio.studio_name);
  const city = plainText(studio.city);

  const fromServices: ConceptClinicTreatment[] = (studio.services ?? []).map((item) => ({
    id: item.id,
    name: formatDisplayLabel(plainText(item.name)),
    description:
      plainText(item.description) ||
      `${plainText(item.name)} bij ${studioName}${city ? ` in ${city}` : ""}. Na intake stellen we een passend protocol samen.`,
    duration_minutes: item.duration_minutes ?? inferTreatmentDuration(plainText(item.name)),
    highlight: Boolean(item.highlight),
  }));

  const merged = [...fromServices];
  const templates = CLINIC_TREATMENT_TEMPLATES.map((template, index) => ({
    ...template,
    id: `concept-clinic-tx-${index + 1}`,
    name: formatDisplayLabel(index === 0 ? service : template.name),
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

export function ensureConceptClinicServices(
  studio: StudioData,
  minimum = MIN_CLINIC_TREATMENTS,
): StudioService[] {
  return buildConceptClinicTreatments(studio, minimum).map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    duration_minutes: item.duration_minutes,
    highlight: item.highlight,
  }));
}

export function buildConceptSkinConcerns(
  studio?: Pick<StudioData, "skin_concerns">,
  minimum = MIN_SKIN_CONCERNS,
): StudioSkinConcern[] {
  const fromData = (studio?.skin_concerns ?? []).filter(
    (item) => plainText(item.name) && plainText(item.description),
  );

  const merged: StudioSkinConcern[] = [...fromData];
  for (const template of SKIN_CONCERN_TEMPLATES) {
    if (merged.length >= minimum) break;
    if (merged.some((item) => item.slug === template.slug)) continue;
    merged.push({
      id: `concern-${template.slug}`,
      ...template,
    });
  }

  return merged.slice(0, Math.max(minimum, fromData.length || minimum));
}

/** Concept-reviews voor huidklinieken. Geen Pilates/reformer/proefles-taal. */
export function buildConceptClinicReviews(
  studio: StudioData,
  minimum = 6,
): ConceptReview[] {
  const studioName = plainText(studio.studio_name);
  const brandName = resolveNavBrandName(studioName) || studioName;
  const city = plainText(studio.city);
  const service = formatDisplayLabel(plainText(studio.primary_service) || "Huidbehandelingen");
  const rating = studio.review_rating > 0 ? studio.review_rating : 4.9;

  const fromData: ConceptReview[] = [];
  for (const review of studio.reviews ?? []) {
    const text = sanitizeClinicCopy(review.text);
    const author = plainText(review.author);
    if (!text || isFitnessJargon(text)) continue;
    if (text.split(/\s+/).filter(Boolean).length < 8) continue;
    fromData.push({
      id: review.id,
      author: author || "Klant",
      text: clampWords(text, 38),
      date_label: plainText(review.date_label) || "recent",
      rating: review.rating > 0 ? review.rating : rating,
    });
    if (fromData.length >= minimum) return fromData.slice(0, minimum);
  }

  const fillers: ConceptReview[] = [
    {
      id: "clinic-review-1",
      author: "Emma van Dijk",
      text: `Gratis intake was helder en zonder druk. Na de huidanalyse wist ik precies welk plan bij mij paste bij ${brandName}.`,
      date_label: "maart 2026",
      rating,
    },
    {
      id: "clinic-review-2",
      author: "Thomas Janssen",
      text: `Professionele ${service.toLowerCase()} met duidelijke uitleg voor en na de sessie. Mijn huid voelt rustiger en ziet er frisser uit.`,
      date_label: "januari 2026",
      rating,
    },
    {
      id: "clinic-review-3",
      author: "Mirthe Vos",
      text: "Klinische sfeer zonder koud gevoel. Het team neemt de tijd, legt elke stap uit en de nazorg was concreet.",
      date_label: "februari 2026",
      rating,
    },
    {
      id: "clinic-review-4",
      author: "Sanne de Boer",
      text: city
        ? `Fijn dat er in ${city} een plek is waar intake en behandeling zo strak op elkaar aansluiten. Geen verrassingen achteraf.`
        : "Intake en behandeling sluiten strak op elkaar aan. Geen verrassingen achteraf, wel een helder vervolgplan.",
      date_label: "december 2025",
      rating,
    },
    {
      id: "clinic-review-5",
      author: "Noah Peters",
      text: `Ik was nerveus voor mijn eerste ${service.toLowerCase()}. Alles werd rustig uitgelegd en ik voelde me direct op mijn gemak.`,
      date_label: "november 2025",
      rating,
    },
    {
      id: "clinic-review-6",
      author: "Lisa Vermeer",
      text: `Mijn huid is egaler geworden na het traject bij ${brandName}. Transparant over wat wel en niet realistisch is. Dat waardeer ik.`,
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

export function buildConceptClinicFaqs(studio: StudioData) {
  const studioName = plainText(studio.studio_name);
  const city = plainText(studio.city);

  return [
    {
      id: "clinic-faq-1",
      question: "Hoe werkt de eerste intake?",
      answer:
        "Je plant een gratis intake. We bespreken je wensen, analyseren je huid en geven een helder voorstel zonder verplichting tot een behandeling.",
    },
    {
      id: "clinic-faq-2",
      question: "Zijn de behandelingen pijnlijk?",
      answer:
        "Dat verschilt per behandeling. We leggen vooraf uit wat je kunt voelen en welke nazorg belangrijk is.",
    },
    {
      id: "clinic-faq-3",
      question: "Hoeveel sessies heb ik nodig?",
      answer:
        "Dat hangt af van je huid, doel en behandeling. Na de intake geven we een realistisch traject met tussentijdse evaluatie.",
    },
    {
      id: "clinic-faq-4",
      question: city ? `Waar zit de kliniek in ${city}?` : "Waar zit de kliniek?",
      answer: plainText(studio.address)
        ? `Aan ${plainText(studio.address)}${city ? ` in ${city}` : ""}.`
        : `${studioName}${city ? ` in ${city}` : ""}. Neem contact op voor route en parkeren.`,
    },
    {
      id: "clinic-faq-5",
      question: "Kan ik combineren met mijn huidverzorging thuis?",
      answer:
        "Ja. We geven advies over producten en routine die passen bij je behandeling, zodat je resultaat langer vasthoudt.",
    },
  ];
}

export function buildConceptClinicMembershipPlans(studio: StudioData) {
  const studioName = plainText(studio.studio_name);

  return [
    {
      id: "clinic-plan-intake",
      name: "Intake & analyse",
      priceLabel: "Gratis",
      period: "eenmalig",
      description: `Kennismaking bij ${studioName}. Huidanalyse en persoonlijk advies zonder verplichting.`,
      features: ["Huidanalyse", "Behandeladvies", "Transparante prijsindicatie"],
      featured: false,
    },
    {
      id: "clinic-plan-glow",
      name: "Glow traject",
      priceLabel: "€249",
      period: "3 behandelingen",
      description: "Starttraject voor een frissere teint. HydraFacial of peel, afgestemd op je huid.",
      features: ["3 sessies", "Thuisprotocol", "Evaluatie na sessie 2"],
      featured: true,
    },
    {
      id: "clinic-plan-maintenance",
      name: "Onderhoud",
      priceLabel: "€189",
      period: "per maand",
      description: "Maandelijks onderhoud na je basisbehandeling. Voor wie zijn huid strak wil houden.",
      features: ["1 behandeling per maand", "Prioriteit bij plannen", "Kortingsvoordeel producten"],
      featured: false,
    },
  ];
}

export function buildConceptClinicJourney(studio: StudioData) {
  const studioName = plainText(studio.studio_name);
  const city = plainText(studio.city);

  if (isSkinClinicStudio(studio)) {
    return [
      {
        id: "journey-1",
        title: "Gratis intake & huidanalyse",
        body: `Je vertelt wat je wilt verbeteren en welke producten of behandelingen je huid al kent. Bij ${studioName}${city ? ` in ${city}` : ""} kijken we naar huidtype, gevoeligheid, leefstijl en verwachtingen. Met een digitale analyse brengen we in kaart wat logisch is voor jouw huid. Je krijgt ruimte voor al je vragen, zonder druk om meteen te boeken.`,
      },
      {
        id: "journey-2",
        title: "Persoonlijk behandelplan",
        body: "Op basis van de analyse stellen we een plan op: welke behandelingen, in welke volgorde en met welke rust tussen sessies. Je ziet vooraf wat een traject ongeveer kost, hoe je huid kan reageren en wat je thuis kunt doen om het resultaat te ondersteunen. Alles in gewone taal, zodat je precies snapt waarom een stap past.",
      },
      {
        id: "journey-3",
        title: "Behandeling in de kliniek",
        body: "In een rustige, klinische setting behandelen we volgens het afgesproken protocol. Vooraf leggen we uit wat we doen, wat je kunt voelen en hoe lang herstel ongeveer duurt. Tijdens de sessie letten we op comfort en veiligheid. Na afloop weet je wat de huid de komende dagen kan doen en wanneer de volgende stap logisch is.",
      },
      {
        id: "journey-4",
        title: "Nazorg & onderhoud",
        body: "We evalueren het resultaat samen en sturen bij waar dat nodig is. Je krijgt concreet advies over thuisverzorging, zonbescherming en eventueel onderhoudsbehandelingen. Zo blijft je huid in balans op de lange termijn, met een team dat je voortgang kent en meedenkt over het vervolg.",
      },
    ];
  }

  const fromBenefits = (studio.benefits ?? [])
    .filter((b) => plainText(b.title) && plainText(b.description))
    .slice(0, 4)
    .map((b) => ({
      id: b.id,
      title: plainText(b.title),
      body: clampWords(plainText(b.description), 42),
    }));

  if (fromBenefits.length >= 3) return fromBenefits;

  return [
    {
      id: "journey-1",
      title: "Gratis intake & huidanalyse",
      body: `Je vertelt wat je wilt verbeteren. Bij ${studioName}${city ? ` in ${city}` : ""} kijken we naar huidtype, geschiedenis en verwachtingen.`,
    },
    {
      id: "journey-2",
      title: "Persoonlijk behandelplan",
      body: "Je krijgt een helder voorstel: welke behandelingen, in welke volgorde en wat je thuis kunt doen. Geen verrassingen achteraf.",
    },
    {
      id: "journey-3",
      title: "Behandeling in de kliniek",
      body: "Rustige setting, duidelijke uitleg en aandacht voor comfort. Na elke sessie weten je wat de volgende stap is.",
    },
    {
      id: "journey-4",
      title: "Nazorg & onderhoud",
      body: "We evalueren het resultaat en sturen bij waar nodig. Zo blijft je huid in balans op de lange termijn.",
    },
  ];
}

export function isSkinClinicStudio(studio: StudioData): boolean {
  const slug = (studio.vertical_slug ?? "").toLowerCase();
  return slug === "skin-clinics" || slug === "huidklinieken";
}

export function buildConceptClinicTeam(studio: StudioData) {
  const city = plainText(studio.city);
  const service = plainText(studio.primary_service) || "huidbehandelingen";

  return [
    {
      id: "clinic-team-1",
      name: "Dr. skin specialist",
      role: "Medisch esthetisch arts",
      bio: clampWords(
        `Gespecialiseerd in ${service.toLowerCase()}${city ? ` in ${city}` : ""}. Intake, veiligheid en natuurlijk resultaat staan centraal.`,
        36,
      ),
      image_url: "/demo/pilates-clinic-instructor-1.jpg",
    },
    {
      id: "clinic-team-2",
      name: "Huidtherapeut",
      role: "Senior skin therapist",
      bio: clampWords(
        "Begeleidt laser, peel en huidverbetering. Legt elke stap uit zodat je weet wat je huid doet en waarom.",
        36,
      ),
      image_url: "/demo/pilates-clinic-instructor-2b.jpg",
    },
    {
      id: "clinic-team-3",
      name: "Intake specialist",
      role: "Client care",
      bio: clampWords(
        "Je eerste aanspreekpunt voor planning, nazorg en productadvies. Helpt je het traject overzichtelijk te houden.",
        36,
      ),
      image_url: "/demo/pilates-clinic-instructor-3b.jpg",
    },
  ];
}
