import { z } from "zod";

export const WIZARD_STEPS = [
  { id: "branche", label: "Branche", title: "Kies je branche" },
  { id: "discovery", label: "Discovery", title: "Discovery terms" },
  { id: "landing", label: "Landing", title: "Landing path" },
  { id: "templates", label: "Templates", title: "Template pack" },
  { id: "pilot", label: "Pilotstad", title: "Eerste pilotstad" },
] as const;

export type WizardStepId = (typeof WIZARD_STEPS)[number]["id"];

export const templateVariantSchema = z.object({
  variant: z.enum(["editorial", "soft-movement", "reformer-minimal", "clinical-atelier"]),
  name: z.string().min(2).max(60),
  description: z.string().max(200).optional(),
});

export const pilotCitySchema = z.object({
  name: z.string().min(2).max(80),
  countryCode: z.enum(["NL", "BE"]),
  region: z.string().min(2).max(80),
  radiusKm: z.number().min(5).max(30).default(12),
});

export const verticalWizardProvisionSchema = z.object({
  catalogSlug: z.string().optional(),
  slug: z
    .string()
    .min(2)
    .max(40)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: kleine letters, cijfers en koppeltekens"),
  name: z.string().min(2).max(80),
  description: z.string().max(240).optional(),
  blueprintSlug: z.enum(["skin-clinics", "pilates"]).default("skin-clinics"),
  discoveryTerms: z.array(z.string().min(2).max(80)).min(3).max(20),
  categoryHints: z.array(z.string().min(2).max(40)).max(12).optional(),
  negativeNamePatterns: z.array(z.string().min(2).max(80)).max(20).optional(),
  landingPath: z
    .string()
    .min(2)
    .max(80)
    .regex(/^\/[a-z0-9]+(?:-[a-z0-9]+)*$/, "Pad begint met /, bijv. /tandartsen"),
  inboundSource: z
    .string()
    .min(2)
    .max(40)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Bron: kleine letters en koppeltekens"),
  landingLive: z.boolean().default(false),
  templateVariants: z.array(templateVariantSchema).min(1).max(5),
  pilotCity: pilotCitySchema,
  businessLabel: z.string().min(2).max(30),
  businessNoun: z.string().min(2).max(40),
  editionLabel: z.string().min(2).max(40).default("Studio Edition"),
  launchDiscovery: z.boolean().optional(),
  discoveryMode: z.enum(["QUICK", "STANDARD", "DEEP"]).optional(),
});

export type VerticalWizardProvisionInput = z.infer<typeof verticalWizardProvisionSchema>;

export type TemplateVariantInput = z.infer<typeof templateVariantSchema>;
export type PilotCityInput = z.infer<typeof pilotCitySchema>;

export interface VerticalWizardDraft {
  catalogSlug?: string;
  slug: string;
  name: string;
  description: string;
  blueprintSlug: "skin-clinics" | "pilates";
  discoveryTerms: string[];
  categoryHints: string[];
  negativeNamePatterns: string[];
  landingPath: string;
  inboundSource: string;
  landingLive: boolean;
  templateVariants: TemplateVariantInput[];
  pilotCity: PilotCityInput;
  businessLabel: string;
  businessNoun: string;
  editionLabel: string;
}

export function slugifyVerticalInput(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export function landingPathFromName(name: string): string {
  const slug = slugifyVerticalInput(name);
  return slug ? `/${slug}` : "/nieuwe-branche";
}

export function inboundSourceFromSlug(slug: string): string {
  return slug.replace(/-/g, "-");
}
