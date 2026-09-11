export type TrajectMetric = {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly progress: number;
};

export const HOME_TRAJECT_METRICS: readonly TrajectMetric[] = [
  { id: "hydratatie", label: "Hydratatie", value: "+18%", progress: 80 },
  { id: "textuur", label: "Textuur", value: "Rustiger", progress: 40 },
  { id: "plan", label: "Jouw plan", value: "Helder", progress: 90 },
] as const;

export const HOME_TRAJECT_QUOTE =
  "Ze namen de tijd om te kijken, en ik hoorde precies wat er wel en niet kon." as const;
