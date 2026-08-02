import type { NextConfig } from "next";
import { SEO_LANDING_CANNIBAL_REDIRECTS } from "./src/data/seo-landings/cannibal-slice1";
import { SEO_LANDING_CANNIBAL_REDIRECTS_SLICE2 } from "./src/data/seo-landings/cannibal-slice2";
import { SEO_LANDING_CITY_PRUNE_REDIRECTS } from "./src/data/seo-landings/city-prune";

/** Sync met src/lib/seo/robots-policy.ts — geen import (next.config draait buiten app-bundel). */
const NOINDEX_HEADER_PATHS = [
  "/intake",
  "/samenwerken",
  "/project-starten",
  "/schaal-op",
  "/groeiscan",
] as const;

const nextConfig: NextConfig = {
  compress: true,
  trailingSlash: false,
  poweredByHeader: false,
  experimental: {
    /*
     * inlineCss: true tripliceerde ~300KB Tailwind in head + Flight
     * (~1.1MB HTML op /zoeken). Uit = externe CSS (~1 request), HTML ~250KB.
     */
    inlineCss: false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async rewrites() {
    const indexNowKey = process.env.INDEXNOW_KEY?.trim();
    if (!indexNowKey || indexNowKey.length < 8) return [];

    return [
      {
        source: `/${indexNowKey}.txt`,
        destination: "/api/indexnow/keyfile",
      },
    ];
  },
  async redirects() {
    return [
      /*
       * Productie-alias op vercel.app doorsturen naar het hoofddomein zodat
       * er geen tweede, indexeerbare kopie van de site bestaat. Preview-
       * deployments (unieke subdomeinen) blijven bereikbaar voor testen.
       */
      {
        source: "/:path*",
        has: [{ type: "host", value: "meneer-marketing-web.vercel.app" }],
        destination: "https://meneermarketing.nl/:path*",
        permanent: true,
      },
      { source: "/groeiscan", destination: "/intake", permanent: true },
      { source: "/groeien", destination: "/vindbaarheid", permanent: true },
      { source: "/automatiseren", destination: "/behoud", permanent: true },
      { source: "/vormgeven", destination: "/bouwen", permanent: true },
      { source: "/acquisitie", destination: "/campagnes", permanent: true },
      { source: "/blog", destination: "/kennisbank", permanent: true },
      {
        source: "/blog/:slug",
        destination: "/kennisbank/:slug",
        permanent: true,
      },
      /* P0.3 cannibal: synoniem-landings → primary hubs */
      ...SEO_LANDING_CANNIBAL_REDIRECTS,
      ...SEO_LANDING_CANNIBAL_REDIRECTS_SLICE2,
      /* P0.4 city prune: thin/synonym city URLs → hubs */
      ...SEO_LANDING_CITY_PRUNE_REDIRECTS,
    ];
  },
  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
    ];

    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          ...securityHeaders,
        ],
      },
      ...NOINDEX_HEADER_PATHS.map((path) => ({
        source: path,
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
      })),
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
