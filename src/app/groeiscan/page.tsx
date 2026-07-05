import { redirect } from "next/navigation";

/** Groeiscan tijdelijk uit — doorverwijzen naar intake. */
export default function GroeiscanPage() {
  redirect("/intake");
}
