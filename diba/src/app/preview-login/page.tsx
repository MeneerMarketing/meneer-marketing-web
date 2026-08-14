import type { Metadata } from "next";
import PreviewLoginForm from "./PreviewLoginForm";

export const metadata: Metadata = {
  title: "Preview login",
  robots: { index: false, follow: false },
};

export default function PreviewLoginPage() {
  return <PreviewLoginForm />;
}
