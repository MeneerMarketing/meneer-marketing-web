import type { NextConfig } from "next";

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
