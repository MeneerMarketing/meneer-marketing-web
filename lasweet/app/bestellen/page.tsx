import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { OrderPage } from "@/components/order-page";
import { JsonLdScript } from "@/components/json-ld";
import {
  ORDER_DESCRIPTION,
  ORDER_TITLE,
  breadcrumbJsonLd,
  orderPageJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: ORDER_TITLE,
  },
  description: ORDER_DESCRIPTION,
  alternates: {
    canonical: "/bestellen",
  },
  openGraph: {
    title: ORDER_TITLE,
    description: ORDER_DESCRIPTION,
    url: "/bestellen",
  },
  twitter: {
    title: ORDER_TITLE,
    description: ORDER_DESCRIPTION,
  },
};

export default function Bestellen() {
  return (
    <>
      <JsonLdScript
        data={[
          webPageJsonLd({
            path: "/bestellen",
            name: ORDER_TITLE,
            description: ORDER_DESCRIPTION,
          }),
          orderPageJsonLd(),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Bestellen", path: "/bestellen" },
          ]),
        ]}
      />
      <SiteHeader />
      <main>
        <OrderPage />
      </main>
      <SiteFooter />
    </>
  );
}
