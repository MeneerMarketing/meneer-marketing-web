import { redirect } from "next/navigation";

/** Oude vergelijkingsroute; de hero-variant is nu de homepage. */
export default function HomeVariantPage() {
  redirect("/");
}
