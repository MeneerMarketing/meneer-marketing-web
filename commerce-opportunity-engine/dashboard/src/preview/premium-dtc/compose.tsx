import type { CSSProperties, ReactNode } from "react";
import { DetailSequenceSection } from "./components/DetailSequenceSection";
import { EditorialIntroSection } from "./components/EditorialIntroSection";
import { FAQSection } from "./components/FAQSection";
import { FinalPurchaseSection } from "./components/FinalPurchaseSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { ImmersiveStorySection } from "./components/ImmersiveStorySection";
import { PremiumBuyBlock } from "./components/PremiumBuyBlock";
import { PremiumFooter, PremiumHeader } from "./components/PremiumHeader";
import { ProductStorySection } from "./components/ProductStorySection";
import { ReviewSection } from "./components/ReviewSection";
import { SignatureFeatureExperience } from "./components/SignatureFeatureExperience";
import { StickyPurchaseBar } from "./components/StickyPurchaseBar";
import { TrustStrip } from "./components/TrustStrip";
import type { PremiumPdpModel } from "./types";

/**
 * Composes a PREMIUM_DTC page in a deliberate commerce cadence:
 * hero → trust → editorial intro → signature feature experience →
 * full-bleed story → practical sequence → dark immersive → FAQ → final purchase.
 * Sections without source-backed content are skipped, never faked.
 */
export function composePremiumDtcPage(
  model: PremiumPdpModel,
  options?: { sectionVariants?: Record<string, string> }
): ReactNode[] {
  const sections = model.sectionPlan.map((s) => s.section);
  const has = (type: string) => sections.includes(type);
  const variant = (section: string, fallback: string) =>
    options?.sectionVariants?.[section] || fallback;

  const nodes: ReactNode[] = [];

  nodes.push(
    <PremiumHeader
      key="header"
      chrome={model.chrome}
      socialProofLabel={model.product.socialProofLabel}
      trustItems={model.product.trustItems}
    />
  );
  nodes.push(<div key="top-anchor" id="pdtc-top" />);

  if (has("HERO_BUY_BLOCK") || sections.length === 0) {
    nodes.push(
      <PremiumBuyBlock
        key="buy"
        product={model.product}
        logoUrl={model.theme.logoUrl}
        logoAlt={model.theme.logoAlt}
      />
    );
  }

  if (has("TRUST_BAR")) {
    nodes.push(<TrustStrip key="trust" items={model.product.trustItems} />);
  }

  if (has("BENEFIT_GRID")) {
    nodes.push(
      <EditorialIntroSection
        key="intro"
        kicker={model.content.benefitsKicker}
        title={model.content.benefitsTitle || "Waarom dit product werkt"}
        lead={model.content.benefitsLead}
        stat={model.content.introStat ?? null}
        facts={model.content.introFacts}
      />
    );
  }

  if (has("FEATURE_DEEP_DIVE") && model.content.features.length > 0) {
    nodes.push(
      <SignatureFeatureExperience
        key="signature"
        kicker={model.content.featuresKicker}
        title={model.content.featuresTitle || "Zo werkt het systeem"}
        lead={model.content.featuresLead}
        features={model.content.features}
        canvasImage={model.content.featureCanvas ?? model.product.media[0]?.src ?? null}
        canvasAlt={model.product.title}
      />
    );
  }

  if (has("PRODUCT_STORY")) {
    nodes.push(
      <ProductStorySection
        key="story"
        variant={
          variant("PRODUCT_STORY", "EDITORIAL_STORY") as
            | "EDITORIAL_STORY"
            | "EDITORIAL_STORY_REVERSE"
        }
        story={model.content.story}
      />
    );
  }

  if (has("TECH_SPECS") || has("MATERIALS")) {
    nodes.push(
      <DetailSequenceSection
        key="sequence"
        kicker={model.content.detailKicker}
        title={model.content.detailTitle || "In de praktijk"}
        lead={model.content.detailLead}
        items={model.content.detailItems ?? []}
        mediaBand={model.content.detailMedia}
      />
    );
  }

  if (has("PROBLEM_SOLUTION") && model.content.secondaryStory) {
    nodes.push(
      <ImmersiveStorySection
        key="immersive"
        story={model.content.secondaryStory}
        meta={model.content.immersiveMeta}
      />
    );
  }

  if (has("HOW_IT_WORKS") || has("HOW_TO_USE") || has("SIZE_GUIDE")) {
    nodes.push(
      <HowItWorksSection
        key="how"
        kicker={has("SIZE_GUIDE") ? "Pasvorm" : "Zo werkt het"}
        title={
          has("SIZE_GUIDE") ? "Zo kies je de juiste maat" : "Zo gebruik je het product"
        }
        steps={model.content.howSteps}
      />
    );
  }

  if (has("REVIEWS") || has("TESTIMONIALS")) {
    nodes.push(
      <ReviewSection
        key="reviews"
        title="Wat klanten zeggen"
        rating={model.product.rating}
        reviewCount={model.product.reviewCount}
        reviews={model.content.reviews}
      />
    );
  }

  if (has("FAQ")) {
    nodes.push(
      <FAQSection
        key="faq"
        title="Veelgestelde vragen"
        lead={model.content.faqLead}
        faqs={model.content.faqs}
      />
    );
  }

  if (has("FINAL_PURCHASE")) {
    nodes.push(
      <FinalPurchaseSection
        key="final"
        kicker={model.content.finalKicker}
        title={model.content.finalTitle}
        body={model.content.finalBody}
        ctaLabel={model.content.finalCtaLabel}
        image={model.content.finalImage}
        priceLabel={model.product.priceLabel}
        compareAtLabel={model.product.compareAtLabel}
        reassure={model.content.finalReassure}
      />
    );
  }

  nodes.push(<PremiumFooter key="footer" chrome={model.chrome} />);

  if (has("STICKY_ATC")) {
    nodes.push(
      <StickyPurchaseBar
        key="purchasebar"
        title={model.product.title}
        ctaLabel={model.product.ctaLabel}
        priceLabel={model.product.priceLabel}
        compareAtLabel={model.product.compareAtLabel}
        inStock={model.product.inStock}
        image={model.product.media[0]?.src ?? null}
        deliveryCutoffHour={model.product.deliveryCutoffHour}
        deliveryCutoffMinute={model.product.deliveryCutoffMinute}
      />
    );
  }

  return nodes;
}

export function themeStyle(model: PremiumPdpModel): CSSProperties {
  const t = model.theme;
  return {
    ["--pdtc-brand" as string]: t.accentSoft ?? t.accent ?? undefined,
    ["--pdtc-ink" as string]: t.ink ?? undefined,
    ["--pdtc-surface" as string]: t.surface ?? undefined,
    ["--pdtc-surface-2" as string]: t.surfaceAlt ?? undefined,
    ["--pdtc-cream" as string]: t.cream ?? undefined,
  };
}
