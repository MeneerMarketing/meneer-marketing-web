export function FinalPurchaseSection({
  kicker = "Bestellen",
  title,
  body,
  ctaLabel,
  image,
  priceLabel,
  compareAtLabel,
  reassure,
}: {
  kicker?: string;
  title: string;
  body: string;
  ctaLabel: string;
  image?: string | null;
  priceLabel?: string;
  compareAtLabel?: string | null;
  reassure?: string[];
}) {
  return (
    <section className="pdtc-final" aria-labelledby="pdtc-final-title">
      <div className="pdtc-final-grid">
        {image ? (
          <figure className="pdtc-final-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="" loading="lazy" />
          </figure>
        ) : null}

        <div className="pdtc-final-panel">
          <div className="pdtc-final-panel-inner">
            <span className="pdtc-eyebrow pdtc-eyebrow--brand">{kicker}</span>
            <h2 className="pdtc-display" id="pdtc-final-title">
              {title}
            </h2>
            {body ? <p className="pdtc-final-body">{body}</p> : null}

            <div className="pdtc-final-price">
              {priceLabel ? <strong>{priceLabel}</strong> : null}
              {compareAtLabel ? <span>{compareAtLabel}</span> : null}
            </div>

            <a href="#pdtc-buy-area" className="pdtc-cta pdtc-cta--light" data-pdtc-final-atc>
              {ctaLabel}
              <span className="pdtc-cta-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h13M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>

            {reassure && reassure.length > 0 ? (
              <ul className="pdtc-final-reassure" role="list">
                {reassure.slice(0, 3).map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
