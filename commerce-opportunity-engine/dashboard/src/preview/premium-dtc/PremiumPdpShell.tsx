import type { ReactNode } from "react";
import { composePremiumDtcPage, themeStyle } from "./compose";
import type { PremiumPdpModel } from "./types";
import "./tokens.css";
import "./components.css";

export function PremiumPdpShell({
  model,
  demoBanner,
  sectionVariants,
}: {
  model: PremiumPdpModel;
  demoBanner?: ReactNode;
  sectionVariants?: Record<string, string>;
}) {
  return (
    <div className="pdtc-root" style={themeStyle(model)}>
      {demoBanner}
      {composePremiumDtcPage(model, { sectionVariants })}
    </div>
  );
}

export * from "./mapping";
export * from "./types";
export * from "./demo-data";
export { composePremiumDtcPage, themeStyle } from "./compose";
