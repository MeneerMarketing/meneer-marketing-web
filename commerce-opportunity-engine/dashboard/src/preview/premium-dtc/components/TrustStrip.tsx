import type { TrustItem } from "../types";
import { TrustServiceIcon, trustServiceIconKind } from "./TrustServiceIcons";

/** Service USPs under the buy moment — icon chips, source-backed labels only. */
export function TrustStrip({ items }: { items: TrustItem[] }) {
  if (!items.length) return null;

  return (
    <section className="pdtc-trustline" aria-label="Service en voorwaarden">
      <div className="pdtc-container">
        <ul className="pdtc-trustline-list" role="list">
          {items.slice(0, 4).map((item) => {
            const kind = trustServiceIconKind(item.label);
            return (
              <li key={item.label} data-source={item.source}>
                <span className={`pdtc-trustline-icon pdtc-trustline-icon--${kind}`} aria-hidden="true">
                  <TrustServiceIcon kind={kind} />
                </span>
                <span className="pdtc-trustline-label">{item.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
