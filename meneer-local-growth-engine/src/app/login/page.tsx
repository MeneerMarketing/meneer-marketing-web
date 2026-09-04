import { Suspense } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { LoginForm } from "./login-form";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Login · Local Growth Engine",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div
      className={`${plusJakarta.variable} flex min-h-screen items-center justify-center bg-mm-bg px-4 font-sans antialiased mm-grid-bg`}
    >
      <Suspense fallback={<div className="text-sm text-slate-500">Laden…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
