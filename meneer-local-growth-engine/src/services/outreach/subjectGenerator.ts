/** Subject families for hardened outreach (app-rendered). */
export const SUBJECT_VARIANTS = {
  made: (name: string) => `Ik heb iets gemaakt voor ${name}`,
  idea: (name: string) => `Een idee voor ${name}`,
  concept: (name: string) => `Concept voor ${name}`,
  website: (name: string) => `Een website-concept voor ${name}`,
} as const;
