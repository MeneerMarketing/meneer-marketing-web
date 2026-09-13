import type { Metadata } from "next";
import Nietgevonden from "@/components/ui/Nietgevonden";

/**
 * De pagina voor een adres dat hier niet bestaat.
 *
 * Alleen de metadata staat hier, want die mag alleen vanaf de server. De inhoud staat in
 * `Nietgevonden` en draait in de browser: dat is de enige plek waar bekend is of iemand
 * op een Nederlands of een Engels adres uitkwam. Zie de toelichting daar.
 */

export const metadata: Metadata = {
  title: "Deze link hoort bij de oude site",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <Nietgevonden />;
}
