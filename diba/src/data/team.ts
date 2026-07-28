import type { TeamMember } from "@/components/templates/TeamTemplate";

const foto = {
  src: "/dev/behandeling.svg",
  alt: "[BEELD-NODIG: portret huidtherapeut, warm daglicht]",
} as const;

export const TEAM: TeamMember[] = [
  {
    slug: "therapeut-1",
    name: "[COPY-NODIG]",
    role: "Huidtherapeut",
    bio: "[COPY-NODIG: bio therapeut] [MEDISCHE-CHECK-ROJDA]",
    image: foto,
  },
  {
    slug: "therapeut-2",
    name: "[COPY-NODIG]",
    role: "Huidtherapeut",
    bio: "[COPY-NODIG: bio therapeut]",
    image: foto,
  },
  {
    slug: "therapeut-3",
    name: "[COPY-NODIG]",
    role: "Huidtherapeut",
    bio: "[COPY-NODIG: bio therapeut]",
    image: foto,
  },
  {
    slug: "therapeut-4",
    name: "[COPY-NODIG]",
    role: "Huidtherapeut",
    bio: "[COPY-NODIG: bio therapeut]",
    image: foto,
  },
];
