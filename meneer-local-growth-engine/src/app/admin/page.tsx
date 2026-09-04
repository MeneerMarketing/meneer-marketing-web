import { redirect } from "next/navigation";

/** Milestone 1 admin → Milestone 2 templates hub */
export default function AdminRedirectPage() {
  redirect("/dashboard/templates");
}
