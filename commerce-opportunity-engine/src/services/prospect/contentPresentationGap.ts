/**
 * Milestone 9.5 — split content richness from presentation quality.
 *
 * Vitalwave lesson: lots of text/features does not mean the page is visually
 * strong. High available + low presentation is the sweet spot.
 */

export type ContentPresentationInput = {
  descriptionLength: number;
  bodyTextLength: number;
  imageCount: number;
  videoPresent: boolean;
  faqPresent: boolean;
  featuresPresent: boolean;
  benefitsPresent: boolean;
  reviewCountProxy: boolean;
  sectionCount: number;
  styledBlocks: number;
  listOnlyBlocks: number;
};

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function computeContentPresentationGap(input: ContentPresentationInput): {
  contentAvailableScore: number;
  contentPresentationQuality: number;
  evidence: string[];
} {
  const evidence: string[] = [];
  let available = 35;

  if (input.descriptionLength >= 200) {
    available += 12;
    evidence.push("rich_meta_or_description");
  } else if (input.descriptionLength >= 80) {
    available += 6;
  }

  if (input.bodyTextLength >= 2500) {
    available += 18;
    evidence.push("long_body_copy");
  } else if (input.bodyTextLength >= 1200) {
    available += 10;
  } else if (input.bodyTextLength < 600) {
    available -= 8;
    evidence.push("thin_body_copy");
  }

  if (input.imageCount >= 6) {
    available += 14;
    evidence.push("many_product_images");
  } else if (input.imageCount >= 3) {
    available += 8;
  } else if (input.imageCount <= 1) {
    available -= 10;
    evidence.push("few_images");
  }

  if (input.videoPresent) {
    available += 8;
    evidence.push("video_assets");
  }
  if (input.faqPresent) {
    available += 6;
    evidence.push("faq_content");
  }
  if (input.featuresPresent) {
    available += 8;
    evidence.push("feature_content");
  }
  if (input.benefitsPresent) {
    available += 6;
    evidence.push("benefit_content");
  }
  if (input.reviewCountProxy) {
    available += 8;
    evidence.push("review_content");
  }

  let presentation = 52;

  if (input.sectionCount >= 6) {
    presentation += 10;
    evidence.push("structured_sections");
  } else if (input.sectionCount <= 2) {
    presentation -= 12;
    evidence.push("flat_single_column");
  }

  if (input.styledBlocks >= 3) {
    presentation += 12;
    evidence.push("styled_content_blocks");
  }
  if (input.listOnlyBlocks >= 2 && input.styledBlocks <= 1) {
    presentation -= 14;
    evidence.push("bullet_list_only_presentation");
  }

  if (input.imageCount >= 5 && input.sectionCount <= 3) {
    presentation -= 8;
    evidence.push("assets_not_visually_deployed");
  }

  return {
    contentAvailableScore: clamp(available),
    contentPresentationQuality: clamp(presentation),
    evidence,
  };
}

export function extractContentPresentationSignals(html: string): Omit<
  ContentPresentationInput,
  "descriptionLength" | "bodyTextLength" | "imageCount"
> & { descriptionLength: number; bodyTextLength: number; imageCount: number } {
  const lower = html.toLowerCase();
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i);
  const bodyText = lower.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const imageCount = (html.match(/<img[\s>]/gi) ?? []).length;
  const sectionCount = (html.match(/<section[\s>]/gi) ?? []).length;
  const styledBlocks = (html.match(/class=["'][^"']*(card|grid|feature|benefit|icon-row|media-with-text)/gi) ?? []).length;
  const listOnlyBlocks = (html.match(/<ul[^>]*>[\s\S]*?<li/gi) ?? []).length;

  return {
    descriptionLength: descMatch?.[1]?.length ?? 0,
    bodyTextLength: bodyText.length,
    imageCount,
    videoPresent: /<video|youtube|vimeo/i.test(lower),
    faqPresent: /faq|veelgestelde vragen/i.test(lower),
    featuresPresent: /specificatie|feature|werking|materiaal|ingredient/i.test(lower),
    benefitsPresent: /voordeel|benefit|waarom dit|kenmerk/i.test(lower),
    reviewCountProxy: /review|beoordeling|sterren|rating/i.test(lower),
    sectionCount,
    styledBlocks,
    listOnlyBlocks,
  };
}
