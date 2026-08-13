import type { EditorialStyle } from "@/components/templates/editorial/editorialModel";

export type EditorialPoseName =
  | "boat"
  | "reformer"
  | "kneel"
  | "fold"
  | "cobra"
  | "ball"
  | "lunge";

const FILES: Record<EditorialPoseName, string> = {
  boat: "/pilates/boat.webp",
  reformer: "/pilates/reformer.webp",
  kneel: "/pilates/kneel.webp",
  fold: "/pilates/fold.webp",
  cobra: "/pilates/cobra.webp",
  ball: "/pilates/ball.webp",
  lunge: "/pilates/lunge.webp",
};

interface Props {
  name: EditorialPoseName;
  className?: string;
}

/**
 * Lijntekening uit de Pilates-set. Het bestand is een masker, dus de tekening
 * krijgt de tekstkleur van zijn omgeving: brons op papier, crème op espresso.
 * Puur decoratief, dus altijd aria-hidden.
 */
export function EditorialPose({ name, className = "h-16 w-16" }: Props) {
  const style: EditorialStyle = { "--ed-pose": `url(${FILES[name]})` };

  return (
    <span aria-hidden style={style} className={`ed-pose block ${className}`} />
  );
}

/**
 * Kiest een tekening op basis van de tekst ernaast, met een vaste rotatie als
 * niets matcht. Zo staat er nooit een willekeurige pose naast een kop.
 */
const KEYWORDS: readonly (readonly [RegExp, EditorialPoseName])[] = [
  // Eerst de bijvoeglijke kant, anders krijgt elke les met "reformer" in de
  // naam hetzelfde toestel en oogt de lijst eentonig.
  [/klein|groep|samen|duo|priv|persoonlijk|aandacht|instructie|techniek|precisie|correctie/i, "kneel"],
  [/mat\b|matwork|bal\b|ball|vloer|core/i, "ball"],
  [/reformer|toestel|machine|apparaat/i, "reformer"],
  [/houding|postuur|wervel|rug|lengte|langer|alignment/i, "cobra"],
  [/rust|stilte|adem|ruimte|licht|sfeer|ontspann|kalm/i, "fold"],
  [/kracht|sterk|power|intensiteit|spier|stabiel/i, "boat"],
  [/flow|beweg|mobil|lenig|souple/i, "lunge"],
  [/blessure|herstel|revalidatie|veilig|resultaat|doel/i, "cobra"],
] as const;

const CYCLE: readonly EditorialPoseName[] = [
  "boat",
  "lunge",
  "fold",
  "cobra",
  "kneel",
  "ball",
] as const;

export function poseForLabel(label: string, index = 0): EditorialPoseName {
  for (const [pattern, name] of KEYWORDS) {
    if (pattern.test(label)) return name;
  }
  return CYCLE[index % CYCLE.length]!;
}

/**
 * Verdeelt een lijst labels over verschillende tekeningen. Bij een reformer
 * studio bevat bijna elke lesnaam hetzelfde woord, dus zonder deze stap staat
 * er vier keer hetzelfde toestel onder elkaar. De reformer blijft gereserveerd
 * voor de les die er echt over gaat, want hij zit niet in de reserverotatie.
 */
export function posesForLabels(labels: string[]): EditorialPoseName[] {
  const used = new Set<EditorialPoseName>();

  return labels.map((label, index) => {
    const preferred = poseForLabel(label, index);
    const pose = used.has(preferred)
      ? (CYCLE.find((candidate) => !used.has(candidate)) ?? preferred)
      : preferred;

    used.add(pose);
    return pose;
  });
}
