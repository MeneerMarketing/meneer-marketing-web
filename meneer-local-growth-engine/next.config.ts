import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  serverExternalPackages: ["playwright", "playwright-core"],
  turbopack: {
    root: path.join(__dirname),
  },
  /**
   * Op preview.meneermarketing.nl staat een conceptwebsite direct achter de
   * domeinnaam. Die host doet niets anders, dus alles met één segment gaat naar
   * de preview-route. Dashboard, API en assets houden hun eigen pad.
   */
  async rewrites() {
    return {
      beforeFiles: [
        {
          source:
            "/:slug((?!api$|dashboard$|preview$|login$|auth$|_next$|robots\\.txt$|sitemap\\.xml$|favicon\\.ico$)[a-z0-9][a-z0-9-]*)",
          has: [{ type: "host", value: "preview\\..*" }],
          destination: "/preview/:slug",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
