import type { Metadata } from "next";
import Pagina from "@/app/(nl)/page";
import { zetTaal } from "@/lib/taalcontext";
import { zoekmachineVelden } from "@/lib/seo";

/**
 * De Engelse homepage.
 *
 * Dit is niet langer een eigen, kortere pagina maar dezelfde homepage als het Nederlands,
 * met de teksten in het Engels. Yasin, 12 september 2026: "als ik op de home zit en op
 * engels klik wil ik gewoon dat alle teksten op dezelfde site in het engels worden
 * weergegeven." Dat kan alleen als het één pagina is en niet twee.
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/en",
  titel: "Skin clinic in Rotterdam",
  omschrijving:
    "English-speaking skin clinic in Rotterdam. Acne, pigmentation, scars, redness and laser hair removal, with every price published on the site.",
});

export default function EngelseHome() {
  zetTaal("en");
  return <Pagina />;
}
