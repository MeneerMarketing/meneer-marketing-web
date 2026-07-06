import { absoluteUrl } from "@/lib/site";

const TITLE_MAX = 90;
const SUBTITLE_MAX = 120;

export function ogImageUrl(input: {
  title: string;
  subtitle?: string;
  accent?: string;
}): string {
  const params = new URLSearchParams();
  params.set("title", input.title.slice(0, TITLE_MAX));
  if (input.subtitle) {
    params.set("subtitle", input.subtitle.slice(0, SUBTITLE_MAX));
  }
  if (input.accent) {
    params.set("accent", input.accent.replace("#", ""));
  }
  return absoluteUrl(`/og?${params.toString()}`);
}

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;
