import Link from "next/link";
import { figmaContainer } from "@/lib/figma-home-layout";

/** Figma Make — announcement bar (exact classes uit export). */
export default function AnnouncementBar() {
  return (
    <div className={`${figmaContainer} relative z-30`}>
      <div className="-mx-5 flex items-center justify-between bg-[#d8efc8] px-5 py-2.5 text-[9px] font-medium uppercase tracking-[.12em] text-[#285f3a] sm:-mx-9 sm:px-9 lg:-mx-[7.5vw] lg:px-[7.5vw]">
        <span className="hidden sm:block">Eerlijke huidzorg begint met goed kijken.</span>
        <span className="sm:hidden">Trust the green touch.</span>
        <span className="flex items-center gap-3">
          <span className="hidden md:block">Diba Clinics · Hillegersberg</span>
          <Link
            href="/intake"
            className="rounded-full bg-[#286943] px-3 py-1.5 text-white transition hover:bg-[#174e31]"
          >
            Start hier ↗
          </Link>
        </span>
      </div>
    </div>
  );
}
