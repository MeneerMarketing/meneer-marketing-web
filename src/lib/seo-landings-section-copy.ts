import { fill, pick } from "@/lib/seo-landings-voice";

const MYTHS_HEADINGS = [
  "Mythe vs werkelijkheid",
  "Wat forums zeggen vs wat ik zie",
  "Geloven vs meten",
  "Marketing-mythes die budget eten",
  "Wat je hoort, wat klopt",
] as const;

const MYTHS_INTROS = [
  "Wat je op forums leest over {kw}, en wat ik in accounts en shops echt zie.",
  "Veel {kw}-advies klinkt logisch. Tot je de cijfers opent.",
  "Drie dingen die ik steeds hoor over {kw}. En wat er achter de schermen gebeurt.",
  "Mythes over {kw} kosten geld. Hier is de werkelijkheid uit de praktijk.",
  "Forums, LinkedIn, je oom. Iedereen heeft een mening over {kw}. Ik heb data.",
] as const;

const RECOGNITION_HEADINGS = [
  "Herkenbaar? Dan ben je niet de enige.",
  "Dit hoor ik vaak over {kw}",
  "Als dit bekend voelt, is er hoop",
  "Waar {kw} meestal misgaat",
  "Herken je dit? Dan is er een plan.",
] as const;

const RECOGNITION_INTROS = [
  "Geen schuldgevoel. Wel een patroon dat ik vaak zie.",
  "Ondernemers praten hier zelden over. Ik wel, in intake.",
  "Als drie of meer punten kloppen, is er meestal winst te pakken.",
  "Dit zijn geen persoonlijke fouten. Het zijn structurele lekken.",
] as const;

const DELIVERABLES_HEADINGS = [
  "Wat je van mij krijgt",
  "Concreet, geen retainer-vagheid",
  "Dit lever ik op bij {kw}",
  "Wat er uit de bus komt",
  "Geen slides. Dit wel.",
] as const;

const PROCESS_INTROS = [
  "Een volgorde die je bankrekening snapt.",
  "Geen twaalf-stappen-framework. Wel een plan dat klopt.",
  "Zo werk ik. Heldere scope, geen verrassingen achteraf.",
  "Stappen die ik echt doorloop, niet marketingtaal.",
  "Volgorde die past bij {kw}, niet bij een template.",
] as const;

export function getMythsSectionHeading(slug: string): string {
  return pick(slug, MYTHS_HEADINGS, "myths-h");
}

export function getMythsSectionIntro(slug: string, primaryKeyword: string): string {
  return fill(pick(slug, MYTHS_INTROS, "myths-i"), { kw: primaryKeyword });
}

export function getRecognitionHeading(slug: string, primaryKeyword: string): string {
  return fill(pick(slug, RECOGNITION_HEADINGS, "rec-h"), { kw: primaryKeyword });
}

export function getRecognitionIntro(slug: string): string {
  return pick(slug, RECOGNITION_INTROS, "rec-i");
}

export function getDeliverablesHeading(slug: string, primaryKeyword: string): string {
  return fill(pick(slug, DELIVERABLES_HEADINGS, "del-h"), { kw: primaryKeyword });
}

const DELIVERABLES_INTROS = [
  "Concreet rond {kw}. Dit pak ik aan met je marge en je tijd in gedachten.",
  "Geen retainer-vagheid. Wel dingen die je kunt aanwijzen als ze live staan.",
  "Wat je krijgt als we {kw} samen oppakken. Meetbaar waar het kan.",
  "Dit is geen wishlist. Dit is wat ik echt lever op {kw}.",
] as const;

export function getDeliverablesIntro(slug: string, primaryKeyword: string): string {
  return fill(pick(slug, DELIVERABLES_INTROS, "del-i"), { kw: primaryKeyword });
}

export function getProcessIntro(slug: string, primaryKeyword: string): string {
  return fill(pick(slug, PROCESS_INTROS, "proc-i"), { kw: primaryKeyword });
}
