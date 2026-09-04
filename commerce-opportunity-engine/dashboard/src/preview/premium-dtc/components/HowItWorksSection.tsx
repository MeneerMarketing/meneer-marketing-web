import type { HowStep } from "../types";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function HowItWorksSection({
  kicker = "Gebruik",
  title,
  lead,
  steps,
}: {
  kicker?: string;
  title: string;
  lead?: string;
  steps: HowStep[];
}) {
  if (!steps.length) return null;

  return (
    <section id="pdtc-how" className="pdtc-how" aria-labelledby="pdtc-how-title">
      <div className="pdtc-container">
        <div className="pdtc-how-head">
          <span className="pdtc-eyebrow">{kicker}</span>
          <h2 className="pdtc-display" id="pdtc-how-title">
            {title}
          </h2>
          {lead ? <p className="pdtc-body-lg">{lead}</p> : null}
        </div>

        <ol className="pdtc-how-steps" role="list">
          {steps.map((s) => (
            <li key={s.n} data-source={s.source}>
              <span className="pdtc-how-n">{pad(s.n)}</span>
              <div>
                <h3 className="pdtc-h3">{s.title}</h3>
                <p className="pdtc-body">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
