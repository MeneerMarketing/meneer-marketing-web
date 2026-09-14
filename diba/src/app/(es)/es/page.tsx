import type { Metadata } from "next";
import Pagina from "@/app/(nl)/page";
import { zetTaal } from "@/lib/taalcontext";
import { zoekmachineVelden } from "@/lib/seo";

/**
 * De Spaanse homepage.
 *
 * Dezelfde homepage als het Nederlands, met de teksten in het Spaans. Zie
 * `src/app/(en)/en/page.tsx` voor waarom dat één pagina is en niet twee.
 *
 * De titel en de omschrijving staan hier met de hand en niet in het woordenboek: ze zijn
 * geschreven voor wat een Spaanstalige intypt, niet vertaald uit het Nederlands.
 *
 * WAT HIER BEWUST NIET STAAT. De Engelse omschrijving opent met "English-speaking skin
 * clinic". Of het team ook Spaans spreekt weten we niet, en dat is geen belofte om te doen
 * voordat iemand het bevestigt: wie hierop klikt en in de kliniek geen Spaans hoort, heeft
 * een slechtere ervaring dan wie de Engelse pagina had gelezen. Staat open bij Yasin.
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/es",
  titel: "Clínica de la piel en Rotterdam",
  omschrijving:
    "Clínica de la piel en Rotterdam. Acné, pigmentación, cicatrices, rojeces y depilación láser, con todos los precios publicados en la web.",
});

export default function SpaanseHome() {
  zetTaal("es");
  return <Pagina />;
}
