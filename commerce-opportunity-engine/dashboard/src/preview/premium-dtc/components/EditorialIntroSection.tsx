type Props = {
  kicker?: string;
  title: string;
  lead?: string;
  stat?: { value: string; label: string } | null;
  facts?: string[];
};

/** Editorial intro band — statement typography, no cards, no pills. */
export function EditorialIntroSection({ kicker = "Introductie", title, lead, stat, facts }: Props) {
  return (
    <section className="pdtc-intro" id="pdtc-benefits" aria-labelledby="pdtc-intro-title">
      <div className="pdtc-container pdtc-intro-grid">
        <div className="pdtc-intro-lead">
          <span className="pdtc-eyebrow">{kicker}</span>
          <h2 className="pdtc-display pdtc-intro-statement" id="pdtc-intro-title">
            {title}
          </h2>
        </div>

        <div className="pdtc-intro-support">
          {lead ? <p className="pdtc-body-lg">{lead}</p> : null}

          {stat ? (
            <p className="pdtc-intro-stat">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </p>
          ) : null}

          {facts && facts.length > 0 ? (
            <ul className="pdtc-intro-facts" role="list">
              {facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
