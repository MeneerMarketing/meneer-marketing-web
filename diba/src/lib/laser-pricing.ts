import { LASER_ZONES, type LaserZone } from "@/data/laser-zones";

const euro = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatLaserPrice(value: number): string {
  if (value === 0) return "[PRIJS-NODIG]";
  return euro.format(value);
}

export type LaserPriceLine = {
  zoneId: string;
  label: string;
  amount: number;
  formatted: string;
};

export type LaserPriceSummary = {
  lines: LaserPriceLine[];
  subtotal: number;
  formattedSubtotal: string;
  hasMissingPrices: boolean;
  zoneCount: number;
};

function zoneById(id: string): LaserZone | undefined {
  return LASER_ZONES.find((z) => z.id === id);
}

/**
 * Berekent live prijsopbouw voor geselecteerde zones.
 * Pakketten overschrijven overlappende losse zones.
 */
export function calculateLaserPrice(selectedZoneIds: readonly string[]): LaserPriceSummary {
  const packages = selectedZoneIds.filter((id) => {
    const z = zoneById(id);
    return z?.area === "pakket";
  });

  const coveredByPackage = new Set<string>();
  for (const pkgId of packages) {
    const pkg = zoneById(pkgId);
    pkg?.includesZones?.forEach((z) => coveredByPackage.add(z));
    coveredByPackage.add(pkgId);
  }

  const billableIds = selectedZoneIds.filter((id) => !coveredByPackage.has(id) || packages.includes(id));

  const uniqueBillable = [...new Set(billableIds)].filter((id) => {
    const z = zoneById(id);
    if (!z) return false;
    if (z.area === "pakket") return true;
    return !packages.some((pkgId) => zoneById(pkgId)?.includesZones?.includes(id));
  });

  const lines: LaserPriceLine[] = uniqueBillable
    .map((id) => {
      const z = zoneById(id);
      if (!z) return null;
      return {
        zoneId: id,
        label: z.label,
        amount: z.singlePrice,
        formatted: formatLaserPrice(z.singlePrice),
      };
    })
    .filter((l): l is LaserPriceLine => l !== null);

  const subtotal = lines.reduce((sum, l) => sum + l.amount, 0);
  const hasMissingPrices = lines.some((l) => l.amount === 0);

  return {
    lines,
    subtotal,
    formattedSubtotal: formatLaserPrice(subtotal),
    hasMissingPrices,
    zoneCount: lines.length,
  };
}

export function toggleZoneSelection(
  current: readonly string[],
  zoneId: string,
): string[] {
  const zone = zoneById(zoneId);
  if (!zone) return [...current];

  const isSelected = current.includes(zoneId);
  let next = isSelected ? current.filter((id) => id !== zoneId) : [...current, zoneId];

  if (!isSelected && zone.area === "pakket" && zone.includesZones) {
    const remove = new Set([...zone.includesZones, zoneId]);
    next = next.filter((id) => !remove.has(id) || id === zoneId);
    next.push(zoneId);
  }

  if (!isSelected && zone.area !== "pakket") {
    next = next.filter((id) => {
      const pkg = zoneById(id);
      if (pkg?.area !== "pakket" || !pkg.includesZones?.includes(zoneId)) return true;
      return false;
    });
  }

  return [...new Set(next)];
}
