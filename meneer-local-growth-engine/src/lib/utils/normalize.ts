export function normalizeDomain(input: string | null | undefined): string | null {
  if (!input) return null;
  let value = input.trim().toLowerCase();
  value = value.replace(/^https?:\/\//, "");
  value = value.replace(/^www\./, "");
  value = value.split("/")[0] ?? value;
  value = value.split("?")[0] ?? value;
  if (!value || value.includes(" ") || !value.includes(".")) return null;
  // Drop common directory hosts
  const blocked = [
    "facebook.com",
    "instagram.com",
    "linkedin.com",
    "google.com",
    "maps.google.com",
    "yelp.com",
    "tripadvisor.com",
  ];
  if (blocked.some((b) => value === b || value.endsWith(`.${b}`))) return null;
  return value;
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}
