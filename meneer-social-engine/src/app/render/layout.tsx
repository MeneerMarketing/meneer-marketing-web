import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** Geen dashboard-shell, geen marges. Alleen het canvas. */
export default function RenderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ margin: 0, padding: 0, width: 1080, height: 1350, overflow: "hidden" }}>
      {children}
    </div>
  );
}
