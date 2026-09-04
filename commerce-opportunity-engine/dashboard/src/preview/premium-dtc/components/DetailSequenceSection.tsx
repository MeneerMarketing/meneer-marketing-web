import type { FeatureRow } from "../types";

type Props = {
  kicker?: string;
  title: string;
  lead?: string;
  items: FeatureRow[];
  /** Product graphics shown in full, without captions or crops */
  mediaBand?: string[];
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/**
 * Practical deep dive: verified facts as a typographic band, plus the
 * remaining product graphics shown uncropped. Facts and images are not
 * paired, because the source gives no evidence for that pairing.
 */
export function DetailSequenceSection({ kicker = "Details", title, lead, items, mediaBand }: Props) {
  if (!items.length && !(mediaBand && mediaBand.length)) return null;

  return (
    <section className="pdtc-seq" aria-labelledby="pdtc-seq-title">
      <div className="pdtc-container">
        <div className="pdtc-seq-head">
          <span className="pdtc-eyebrow">{kicker}</span>
          <h2 className="pdtc-display" id="pdtc-seq-title">
            {title}
          </h2>
          {lead ? <p className="pdtc-body-lg">{lead}</p> : null}
        </div>

        {items.length > 0 ? (
          <ol className="pdtc-seq-facts" role="list">
            {items.map((item, i) => (
              <li key={item.title} data-source={item.source}>
                <span className="pdtc-seq-num">{pad(i + 1)}</span>
                <h3 className="pdtc-h3">{item.title}</h3>
                <p className="pdtc-body">{item.body}</p>
              </li>
            ))}
          </ol>
        ) : null}

        {mediaBand && mediaBand.length > 0 ? (
          <div className="pdtc-seq-band" aria-label="Productbeelden">
            {mediaBand.slice(0, 3).map((src) => (
              <figure className="pdtc-seq-frame" key={src}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="lazy" />
              </figure>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
