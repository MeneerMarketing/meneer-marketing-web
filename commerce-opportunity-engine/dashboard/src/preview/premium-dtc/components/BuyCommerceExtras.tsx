import { KlarnaInline } from "./PaymentIcons";
import type { PremiumPdpProduct } from "../types";

type AccordionRow = {
  title: string;
  body: string;
};

function IconTruck() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 7h11v8H3z" />
      <path d="M14 10h4l3 3v2h-7" />
      <circle cx="7" cy="17" r="1.4" />
      <circle cx="17" cy="17" r="1.4" />
    </svg>
  );
}

function formatKlarnaChip(label: string) {
  const match = label.match(/3×\s*€\s*([\d,.]+)/i);
  if (match?.[1]) return `Betaal in 3 delen van € ${match[1]}`;
  return label;
}

function buildAccordionRows(product: PremiumPdpProduct): AccordionRow[] {
  if (product.miniFaqs?.length) {
    return product.miniFaqs.map((f) => ({ title: f.question, body: f.answer }));
  }

  const rows: AccordionRow[] = [];
  const shipping = product.reassureItems.find((t) => /verzending/i.test(t));
  const klarna = product.reassureItems.find((t) => /klarna/i.test(t));
  const returns = product.reassureItems.find((t) => /bedenktijd|retour/i.test(t));

  if (product.buyBenefits?.length) {
    rows.push({
      title: "Productspecificaties",
      body: product.buyBenefits.map((b) => `${b.title}. ${b.body}`).join(" "),
    });
  }

  if (shipping) {
    rows.push({
      title: "Snelle levering",
      body: `${shipping}. Op werkdagen vóór 23:00 besteld is doorgaans de volgende dag in huis.`,
    });
  }

  if (klarna) {
    rows.push({
      title: "Achteraf betalen met Klarna",
      body: product.klarnaLabel
        ? `${klarna}. ${product.klarnaLabel}.`
        : klarna,
    });
  }

  if (returns) {
    rows.push({
      title: "14 dagen bedenktijd",
      body: `${returns}. Je kunt je bestelling binnen deze termijn heroverwegen volgens het retourbeleid.`,
    });
  }

  return rows;
}

type Props = {
  product: PremiumPdpProduct;
};

/**
 * Cloudpillo-style post-CTA commerce strip: reassurance chips + accordion rows.
 */
export function BuyCommerceExtras({ product }: Props) {
  const shippingLine =
    product.reassureItems.find((t) => /verzending/i.test(t)) ?? product.reassureItems[0];
  const accordionRows = buildAccordionRows(product);
  const hasChips = shippingLine || product.klarnaLabel;
  const hasAccordion = accordionRows.length > 0;

  if (!hasChips && !hasAccordion) return null;

  return (
    <div className="pdtc-buy-post">
      {hasChips ? (
        <div className="pdtc-buy-chips">
          {shippingLine ? (
            <div className="pdtc-buy-chip pdtc-buy-chip--ship">
              <IconTruck />
              <span>{shippingLine}</span>
            </div>
          ) : null}
          {product.klarnaLabel ? (
            <div className="pdtc-buy-chip pdtc-buy-chip--klarna">
              <KlarnaInline className="pdtc-klarna-badge pdtc-klarna-badge--chip" />
              <span>{formatKlarnaChip(product.klarnaLabel)}</span>
            </div>
          ) : null}
        </div>
      ) : null}

      {hasAccordion ? (
        <div className="pdtc-buy-accordion" role="list">
          {accordionRows.map((row) => (
            <details key={row.title} className="pdtc-buy-acc-item" role="listitem">
              <summary>
                <span>{row.title}</span>
                <span className="pdtc-buy-acc-plus" aria-hidden="true" />
              </summary>
              <p>{row.body}</p>
            </details>
          ))}
        </div>
      ) : null}
    </div>
  );
}
