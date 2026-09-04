import { Plus_Jakarta_Sans } from "next/font/google";
import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getSessionUser } from "@/lib/supabase/server";
import "../dashboard-globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Local Growth Dashboard · Meneer Marketing",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  const bypass = process.env.LGE_DEV_AUTH_BYPASS === "true";

  return (
    <div className={`${plusJakarta.variable} font-sans antialiased`}>
      <DashboardShell userEmail={user?.email} bypass={bypass}>
        {children}
      </DashboardShell>
    </div>
  );
}
