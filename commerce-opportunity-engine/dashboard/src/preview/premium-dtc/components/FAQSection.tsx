import type { FaqItem } from "../types";

export function FAQSection({
  kicker = "Service",
  title,
  lead,
  faqs,
}: {
  kicker?: string;
  title: string;
  lead?: string;
  faqs: FaqItem[];
}) {
  if (!faqs.length) return null;

  return (
    <section id="pdtc-faq" className="pdtc-faq" aria-labelledby="pdtc-faq-title">
      <div className="pdtc-container pdtc-faq-grid">
        <div className="pdtc-faq-aside">
          <span className="pdtc-eyebrow">{kicker}</span>
          <h2 className="pdtc-display" id="pdtc-faq-title">
            {title}
          </h2>
          {lead ? <p className="pdtc-body">{lead}</p> : null}
        </div>

        <div className="pdtc-faq-list">
          {faqs.map((f) => (
            <details key={f.question} className="pdtc-faq-item" data-source={f.source}>
              <summary>
                <span>{f.question}</span>
                <span className="pdtc-faq-ico" aria-hidden="true" />
              </summary>
              <div className="pdtc-faq-answer">
                <p>{f.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
