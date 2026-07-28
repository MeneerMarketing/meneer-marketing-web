export type WerkwijzeStep = {
  readonly id: string;
  readonly title: string;
  readonly body: string;
};

export const HOME_WERKWIJZE_STEPS: readonly WerkwijzeStep[] = [
  {
    id: "luisteren",
    title: "Luisteren",
    body: "Naar jouw huid, jouw verhaal en wat je wel, of juist niet, wilt.",
  },
  {
    id: "meten",
    title: "Kijken & meten",
    body: "Met expertise én objectieve huidanalyse.",
  },
  {
    id: "plan",
    title: "Een plan dat past",
    body: "Helder over keuzes, kosten en realistische resultaten.",
  },
] as const;
