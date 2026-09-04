"use client";

import { PaymentIcons } from "./PaymentIcons";
import { BuyCommerceExtras } from "./BuyCommerceExtras";
import { DeliveryPromise } from "./DeliveryPromise";
import { PremiumMediaGallery } from "./PremiumMediaGallery";
import { TrustStarsBadge } from "./TrustStarsBadge";
import type { PremiumPdpProduct } from "../types";

type Props = {
  product: PremiumPdpProduct;
  logoUrl?: string | null;
  logoAlt?: string;
};

function PerkCheck() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="#00b67a" />
      <path
        d="M6 10.2l2.6 2.6 5.4-5.6"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RatingRow({ product }: { product: PremiumPdpProduct }) {
  if (product.rating != null) {
    const note =
      product.reviewCount != null
        ? `Gebaseerd op ${product.reviewCount.toLocaleString("nl-NL")} beoordelingen`
        : product.ratingNote;
    return (
      <div className="pdtc-buy-rating">
        <TrustStarsBadge score={product.rating} size="sm" href={product.ratingHref} />
        {note ? <span className="pdtc-buy-rating-note">{note}</span> : null}
      </div>
    );
  }

  if (product.socialProofLabel) {
    return (
      <div className="pdtc-buy-rating">
        <span className="pdtc-buy-stars" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <svg key={i} viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
              <path d="M10 1.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L10 14.9l-5.25 2.75 1-5.85L1.5 7.65l5.9-.85z" />
            </svg>
          ))}
        </span>
        <span className="pdtc-buy-rating-note">{product.socialProofLabel}</span>
      </div>
    );
  }

  return null;
}

export function PremiumBuyBlock({ product }: Props) {
  const payments = product.paymentMethods ?? [];
  const benefits = product.buyBenefits ?? [];
  const primary = benefits.slice(0, 3);
  const rest = benefits.slice(3);
  const discountBadge = product.discountLabel?.replace(/^Je bespaart\s*/i, "") ?? null;
  const shippingNote =
    product.reassureItems.find((t) => /verzending/i.test(t)) ?? null;

  return (
    <section className="pdtc-buy" aria-label="Product koopblok">
      <div className="pdtc-container pdtc-buy-grid">
        <div className="pdtc-buy-media">
          <PremiumMediaGallery
            media={product.media}
            productTitle={product.title}
            discountBadge={discountBadge}
          />
        </div>

        <div className="pdtc-buy-panel">
          <RatingRow product={product} />

          <h1 className="pdtc-buy-title">{product.title}</h1>

          <div className="pdtc-priceblock">
            <div className="pdtc-price-main">
              <span className={`pdtc-price${product.compareAtLabel ? " is-sale" : ""}`}>
                {product.priceLabel}
              </span>
              {product.compareAtLabel ? (
                <span className="pdtc-price-compare">{product.compareAtLabel}</span>
              ) : null}
              {product.discountLabel ? (
                <span className="pdtc-price-pill">{product.discountLabel}</span>
              ) : null}
            </div>
            <p className="pdtc-availability">
              {product.inStock ? (
                <>
                  <span className="pdtc-availability-dot" aria-hidden="true" />
                  Op voorraad
                </>
              ) : (
                "Tijdelijk niet leverbaar"
              )}
            </p>
          </div>

          {primary.length > 0 ? (
            <ul className="pdtc-buy-checks" role="list">
              {primary.map((b) => (
                <li key={b.title} className="pdtc-buy-check">
                  <span className="pdtc-buy-check-mark" aria-hidden="true">
                    <PerkCheck />
                  </span>
                  <div className="pdtc-buy-check-copy">
                    <strong>{b.title}</strong>
                    <p>{b.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}

          {product.discountLabel && product.compareAtLabel ? (
            <div className="pdtc-promo-card">
              <span className="pdtc-promo-card-ico" aria-hidden="true">%</span>
              <div className="pdtc-promo-card-copy">
                <strong>Aanbieding</strong>
                <p>
                  {product.discountLabel} t.o.v. de normale prijs van {product.compareAtLabel}.
                </p>
              </div>
            </div>
          ) : null}

          {rest.length > 0 ? (
            <details className="pdtc-benefits-more">
              <summary>
                <span>Meer voordelen</span>
                <span className="pdtc-benefits-more-ico" aria-hidden="true" />
              </summary>
              <ul className="pdtc-buy-checks pdtc-buy-checks--more" role="list">
                {rest.map((b) => (
                  <li key={b.title} className="pdtc-buy-check">
                    <span className="pdtc-buy-check-mark" aria-hidden="true">
                      <PerkCheck />
                    </span>
                    <div className="pdtc-buy-check-copy">
                      <strong>{b.title}</strong>
                      <p>{b.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </details>
          ) : null}

          <DeliveryPromise
            inStock={product.inStock}
            shippingNote={shippingNote}
            cutoffHour={product.deliveryCutoffHour ?? 23}
            cutoffMinute={product.deliveryCutoffMinute ?? 0}
          />

          <div className="pdtc-buy-cta" id="pdtc-buy-area">
            <button
              type="button"
              className={`pdtc-cta pdtc-cta--shop pdtc-cta--block${!product.inStock ? " is-disabled" : ""}`}
              data-pdtc-primary-atc
              disabled={!product.inStock}
            >
              {product.inStock ? product.ctaLabel : "Niet op voorraad"}
            </button>
          </div>

          <BuyCommerceExtras product={product} />

          {payments.length > 0 ? (
            <PaymentIcons methods={payments} label="Betaal met" />
          ) : null}
        </div>
      </div>
    </section>
  );
}
