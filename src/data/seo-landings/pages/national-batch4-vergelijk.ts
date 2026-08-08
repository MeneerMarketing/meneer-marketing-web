import type { SeoLandingPage } from "@/data/seo-landings/types";

const processDefault = [
  { title: "Jouw situatie helder", body: "We kijken naar marge, verkeer, tijdlijn en wat je al hebt." },
  { title: "Eerlijke keuze", body: "Data en logica. Een aanbeveling met waarom." },
  { title: "Plan met volgorde", body: "Wat eerst, wat later, wat nooit." },
  { title: "Uitvoeren", body: "Ik help je het ook echt live te krijgen." },
] as const;

export { GOOGLE_ADS_OF_SEO } from './google-ads-of-seo';

export { SHOPIFY_OF_WOOCOMMERCE } from './shopify-of-woocommerce';

export { META_ADS_OF_GOOGLE_ADS } from './meta-ads-of-google-ads';

export const BUREAU_OF_FREELANCER_MARKETING: SeoLandingPage = {
  slug: "bureau-of-freelancer-marketing",
  primaryKeyword: "marketing bureau of freelancer",
  category: "seo",
  metaTitle: "Marketing bureau of freelancer · wat past bij MKB? | Meneer Marketing",
  metaDescription: "Marketing bureau of freelancer? Eerlijke vergelijking voor MKB. Wanneer een team, wanneer één persoon met alle skills.",
  keywords: ["marketing bureau of freelancer", "freelancer of bureau marketing", "online marketing freelancer"],
  eyebrow: "Bureau vs freelancer",
  headline: "Marketing bureau of freelancer?",
  headlineAccent: "Ik ben eigenlijk het derde antwoord.",
  subheadline: "Groot bureau: veel mensen, veel overhead. Freelancer: goedkoop tot je vijf freelancers coördineert. Ik ben één senior brein dat bouwt, SEO doet en ads draait. Eén lijn, volledige dekking.",
  pains: [
    { title: "Bureau overhead", body: "Jij praat met junior, betaalt voor senior." },
    { title: "Freelancer-gaten", body: "Design hier, SEO daar, ads nergens." },
    { title: "Project zonder eigenaar", body: "Iedereen doet een stukje." },
  ],
  deliverables: [
    { title: "Eén aanspreekpunt", body: "Strategie tot uitvoering." },
    { title: "Bouwen + marketing", body: "Dev en ads in één lijn." },
    { title: "Schaalbaar", body: "Groei mee zonder team van twintig." },
    { title: "Eerlijke scope", body: "Wat ik wel en niet doe." },
  ],
  visual: "content-hub",
  processTitle: "De juiste match vinden",
  processSteps: processDefault,
  proofTitle: "Meneer-model",
  proofBody: "Ik ben je online marketing manager, niet een kantoor vol stagiairs.",
  hotTake: { label: "Heet take", body: "Een marketing bureau waar je nooit de persoon spreekt die je account aanraakt, is een gok met service fee." },
  faq: [
    { question: "Ben jij freelancer of bureau?", answer: "Eén expert met bureau-breedte. Beste van beide, hopelijk." },
    { question: "Wanneer groot bureau?", answer: "Als je enterprise budget en internationaal team nodig hebt. Veel MKB niet." },
  ],
  ctaTitle: "Zoek je iemand die alles pakt?",
  ctaBody: "Vertel je situatie. Ik zeg eerlijk of ik pas.",
  relatedSlugs: ["online-marketing-manager", "online-marketing-bureau", "marketing-consultant-mkb"],
  pillarSlug: "strategie",
  pillarLabel: "Strategie",
};
