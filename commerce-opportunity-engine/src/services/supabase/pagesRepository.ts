import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProductPageResult } from "../../types/crawler.js";
import type { PageExtractedSignals } from "../../types/crawler.js";

export async function upsertQualifiedPage(
  client: SupabaseClient,
  input: {
    brandId: string;
    url: string;
    finalUrl: string;
    crawlStatus: string;
    productPage: ProductPageResult;
    signals: PageExtractedSignals | null;
    maturityScore: number;
  }
): Promise<void> {
  const now = new Date().toISOString();
  const product = input.productPage;

  // Prefer storing the resolved product URL as the page URL when available
  const pageUrl = product.productUrl ?? input.url;

  const extractedData = {
    title: input.signals?.title ?? null,
    metaDescription: input.signals?.metaDescription ?? null,
    paymentSignals: product.paymentSignals.length
      ? product.paymentSignals
      : input.signals?.paymentSignals ?? [],
    shippingText: product.shippingText ?? input.signals?.shippingText ?? null,
    returnsText: product.returnsText ?? input.signals?.returnsText ?? null,
    guaranteeText: product.guaranteeText ?? input.signals?.guaranteeText ?? null,
    socialProofSignals: input.signals?.socialProofSignals ?? [],
    estimatedProductLinks: input.signals?.estimatedProductLinks ?? null,
    estimatedCategoryLinks: input.signals?.estimatedCategoryLinks ?? null,
    maturityScore: input.maturityScore,
    productBrand: product.productBrand,
    description: product.description,
    availability: product.availability,
  };

  const { data: existing } = await client
    .from("pages")
    .select("id")
    .eq("brand_id", input.brandId)
    .eq("url", pageUrl)
    .maybeSingle();

  const row = {
    brand_id: input.brandId,
    url: pageUrl,
    final_url: product.productUrl ?? input.finalUrl,
    page_type: product.pageType,
    product_name: product.productName,
    price: product.price,
    currency: product.currency,
    review_count: product.reviewCount,
    rating: product.rating,
    availability: product.availability,
    product_brand: product.productBrand,
    product_description: product.description,
    product_resolution_confidence: product.productResolutionConfidence,
    product_resolution_source: product.productResolutionSource,
    product_candidate_count: product.productCandidateCount,
    extraction_evidence: product.extractionEvidence,
    extracted_data: extractedData,
    crawl_status: input.crawlStatus,
    updated_at: now,
  };

  if (existing?.id) {
    const { error } = await client.from("pages").update(row).eq("id", existing.id);
    if (error) {
      throw new Error(`Failed to update page: ${error.message}`);
    }
    return;
  }

  const { error } = await client.from("pages").insert(row);
  if (error) {
    if (error.code === "23505") {
      return;
    }
    throw new Error(`Failed to insert page: ${error.message}`);
  }
}
