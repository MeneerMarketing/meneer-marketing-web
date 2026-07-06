import type { MetadataRoute } from "next";

import { HOME_PAGE_DESCRIPTION, SITE_NAME } from "@/lib/seo/site-metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: HOME_PAGE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#0F172A",
    lang: "nl",
    dir: "ltr",
    categories: ["business", "marketing"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
