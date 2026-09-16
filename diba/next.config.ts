import type { NextConfig } from "next";
import { LEGACY_REDIRECTS } from "./src/data/redirects";
import { EN_SLUG_REDIRECTS } from "./src/data/redirects-en";
import { OUDE_SITE_REDIRECTS } from "./src/data/redirects-oud";

const nextConfig: NextConfig = {
  /**
   * Wie de dev-server op zijn telefoon opent via het lokale IP in plaats van via
   * localhost, kreeg een site die er goed uitzag en waarin niets werkte: geen enkele
   * knop, geen enkele interactieve sectie. De oorzaak zit niet in de componenten maar
   * hier. Next 16 beschouwt een ander origin als niet-vertrouwd, weigert de
   * HMR-websocket, en dan komt React niet door de hydratie heen. De HTML staat er dus
   * wel en de JavaScript neemt hem nooit over.
   *
   * Deze lijst maakt het lokale netwerk vertrouwd. Alleen voor `next dev`; in productie
   * doet hij niets. Voeg een reeks toe als je op een ander netwerk zit en dezelfde
   * dode knoppen ziet.
   */
  allowedDevOrigins: [
    "192.168.0.239",
    "192.168.0.*",
    "192.168.1.*",
    "192.168.2.*",
    "10.0.0.*",
    "172.20.10.*",
  ],
  turbopack: {
    root: __dirname,
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Geen externe beeldbronnen. Alle fotografie is eigen materiaal onder /public/images
    // (DIBA-RULES §2: geen stockfoto's, §14: geen externe requests).
    remotePatterns: [],
    /**
     * Welke beeldkwaliteiten er opgevraagd mogen worden.
     *
     * Next 16 weigert elke andere waarde met een 400, en dat is terecht: zonder zo'n
     * lijst kan iedereen willekeurige varianten laten genereren en je optimizer laten
     * zweten. Vandaar precies twee.
     *
     * 75 is de standaard en genoeg voor alles wat in een kaartje past. 92 is er voor het
     * ene beeld dat het hele eerste scherm vult: daar staat een artefact op tachtig
     * centimeter van iemands ogen, en dan zie je het verschil wel.
     */
    qualities: [75, 92],
    /**
     * Hoe lang een geoptimaliseerd beeld blijft liggen.
     *
     * Dit is de bewaartijd van de omgezette varianten én de `max-age` die ze meekrijgen.
     * Stond op de standaard, en die gaf `max-age=0, must-revalidate`: elk herhaalbezoek
     * haalde alle beelden opnieuw op. Dertig dagen, net als de bronbestanden hieronder.
     */
    minimumCacheTTL: 60 * 60 * 24 * 30,
    /**
     * GEEN AVIF. GEMETEN, NIET AANGENOMEN.
     *
     * Het advies uit het SEO-rapport (Okan, 15 september 2026): "AVIF is doorgaans 20 tot 30
     * procent kleiner." Doorgaans wel, hier niet, en de reden zit in Next zelf: `qualities`
     * geeft hetzelfde getal aan beide encoders door, en een 75 betekent in AVIF iets heel
     * anders dan in WebP.
     *
     * Gemeten over vijftien beelden uit de eigen shoot op 1080 breed
     * (`scratch/avif-sweep.mjs`):
     *
     *     webp q75  695 kB     avif q75  965 kB    39% GROTER
     *     webp q75  695 kB     avif q60  626 kB    10% kleiner
     *     webp q75  695 kB     avif q50  404 kB    42% kleiner
     *
     * AVIF wint hier pas onder q60. Aanzetten zoals het nu staat maakt elk beeld dus groter,
     * en het coderen kost er ook nog eens 4,4 keer zo lang over (593 ms tegen 134 ms per
     * beeld). Next kent geen aparte kwaliteit per formaat, dus de enige weg naar die winst
     * is `qualities` voor iedereen omlaag — en dan levert de WebP voor de browsers zonder
     * AVIF kwaliteit in. Dat is geen ruil die deze beelden verdienen.
     *
     * Terugkomen zodra Next een kwaliteit per formaat kent. Dan is het wél de goede keuze.
     */
  },
  /**
   * Hoe lang media in de browser blijft liggen.
   *
   * WAT ER MIS WAS. Next levert alles onder /public uit met `max-age=0, must-revalidate`,
   * en de beeldoptimizer neemt die kop over. Gemeten op de live site: de homepage op een
   * Pixel 5 haalt 2,1 MB binnen, waarvan 1,74 MB de herovideo is — en dat hele pakket komt
   * bij élk bezoek opnieuw over de lijn. De lettertypen stonden wel goed
   * (`max-age=31536000, immutable`), want die regelt Next zelf.
   *
   * WAAROM DE VIDEO'S EEN JAAR KRIJGEN EN DE BEELDEN DERTIG DAGEN.
   *
   * Een lange bewaartijd is een belofte dat het bestand op dit adres niet verandert. Voor de
   * video's klopt die: het zijn er drie, ze staan met hun naam in `data/videos.ts` en een
   * nieuwe opname krijgt een nieuwe naam.
   *
   * Bij de beelden is die belofte riskanter. Er staan er honderden en een logo of een
   * portret wordt nog wel eens vervangen zonder de naam te veranderen; dan blijft een
   * terugkerende bezoeker het oude zien tot de bewaartijd om is. Dertig dagen vangt vrijwel
   * elk herhaalbezoek — wie een behandeling uitzoekt komt binnen weken terug, niet binnen
   * maanden — en een vergissing is binnen een maand weer weg in plaats van binnen een jaar.
   *
   * Wil je de beelden ook op een jaar, dan hoort daar één afspraak bij: nieuwe inhoud krijgt
   * een nieuwe bestandsnaam. Zo staat het deelbeeld er al in (`diba-clinics-2026.jpg`, zie
   * `lib/seo.ts`), en om precies deze reden.
   */
  async headers() {
    return [
      {
        source: "/videos/:pad*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:pad*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }],
      },
      /* Deze gelden voor alles, dus ze staan achteraan: ze vullen aan, ze vervangen niet. */
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  /**
   * De omleidingen, in deze volgorde.
   *
   * Next leest ze van boven naar beneden en de eerste die past wint. Dat is hier geen
   * detail: `redirects-oud.ts` sluit af met een paar hele takken (`/blog/:pad*`), en die
   * mogen pas aan de beurt komen als de losse adressen erboven niet gepast hebben.
   *
   * Omleidingen worden bovendien vóór de routes afgehandeld. Een bron die toevallig ook
   * een echte pagina van ons is, maakt die pagina dus onbereikbaar. `npm run omleidingen`
   * loopt de hele lijst na en meldt dat.
   */
  async redirects() {
    return [
      ...LEGACY_REDIRECTS,
      ...EN_SLUG_REDIRECTS,
      ...OUDE_SITE_REDIRECTS,
    ].map((r) => ({
      source: r.source,
      destination: r.destination,
      /**
       * 301 en niet `permanent: true`.
       *
       * Die vlag geeft in Next een 308. Voor Google maakt dat niets uit — allebei zijn
       * permanent en allebei geven de opgebouwde waarde door — maar 308 is van 2015 en
       * oudere linkcheckers, crawlers en logboekanalyses kennen hem niet altijd als
       * permanent. Dan lijkt een verhuizing die goed is gegaan een fout.
       *
       * Het verschil in de norm gaat over iets anders: een 308 verplicht de browser om
       * dezelfde methode aan te houden, een 301 mag een POST naar een GET ombuigen. Deze
       * omleidingen gaan allemaal over adressen uit Google en die worden met GET opgehaald,
       * dus dat onderscheid doet hier niet mee. Okan, 15 september 2026.
       */
      statusCode: 301 as const,
    }));
  },
};

export default nextConfig;
