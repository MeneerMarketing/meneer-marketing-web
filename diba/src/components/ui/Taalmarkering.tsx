"use client";

import { useEffect } from "react";
import { useTaal } from "@/lib/gebruik-taal";
import { TAALCODES } from "@/lib/taal";

/**
 * Zet `lang` op het html-element naar de taal van het adres.
 *
 * Dit stond tot 13 september 2026 op elke pagina: de enige indeling van de site hing boven
 * beide talen en zette `lang="nl"` boven een pagina vol Engels. Sinds de site per taal een
 * wortelindeling heeft, `(nl)`, `(en)` en `(es)`, staat dat attribuut meteen goed in de
 * HTML die de server uitlevert en is dit daar niet meer voor nodig.
 *
 * Wat overblijft is de 404 buiten de groepen: een adres als /oude-link-uit-2019 hoort
 * bij geen van de talen, dus daar is niets aan af te lezen. Die pagina begint op
 * `nl` en corrigeert hier, na de eerste render. Voor een schermlezer is dat op tijd, want
 * die leest pas voor als de pagina er staat, en de 404 draagt `noindex`, dus voor de
 * zoekmachine maakt de eerste waarde niet uit.
 */
export default function Taalmarkering() {
  const taal = useTaal();
  useEffect(() => {
    document.documentElement.lang = TAALCODES[taal].html;
  }, [taal]);
  return null;
}
