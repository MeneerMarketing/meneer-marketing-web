import type { NextConfig } from "next";
import { LEGACY_REDIRECTS } from "./src/data/redirects";

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
  },
  async redirects() {
    return LEGACY_REDIRECTS.map((r) => ({
      source: r.source,
      destination: r.destination,
      permanent: true,
    }));
  },
  async headers() {
    return [
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
};

export default nextConfig;
