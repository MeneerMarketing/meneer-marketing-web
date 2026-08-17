import type { MeterAxisScore } from "@/lib/meter/types";

interface MeterVerdict {
  verdict: string;
  oneLiner: string;
}

function weakestAxis(scores: MeterAxisScore[]): MeterAxisScore {
  return scores.reduce((low, axis) => (axis.value < low.value ? axis : low), scores[0]!);
}

export function buildMeterVerdict(
  total: number,
  scores: MeterAxisScore[],
  siteName: string,
): MeterVerdict {
  const weak = weakestAxis(scores);

  if (total >= 82) {
    return {
      verdict: "Sterk",
      oneLiner: `${siteName} scoort hoog. ${weak.label} is nog het zwakste punt, maar dit is geen brandweerklus.`,
    };
  }

  if (total >= 68) {
    return {
      verdict: "Redelijk",
      oneLiner: `Basis staat. ${weak.label} (${weak.value}/100) kost je waarschijnlijk het meeste rendement.`,
    };
  }

  if (total >= 52) {
    return {
      verdict: "Wankel",
      oneLiner: `${siteName} laat geld liggen. Vooral ${weak.label.toLowerCase()} schreeuwt om aandacht.`,
    };
  }

  if (total >= 35) {
    return {
      verdict: "Lek",
      oneLiner: `Technisch en commercieel lekt het. Start bij ${weak.label.toLowerCase()}, niet bij een nieuwe slogan.`,
    };
  }

  return {
    verdict: "Kritiek",
    oneLiner: `Site nauwelijks scanbaar of structureel zwak. ${weak.hint}`,
  };
}
