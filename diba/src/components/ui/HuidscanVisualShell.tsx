import EveMHuidscanVisual from "@/components/ui/EveMHuidscanVisual";
import { homeHuidscanCardShell } from "@/lib/home-layout";

type HuidscanVisualShellProps = {
  className?: string;
};

/** Eve-M visual — strak wit kaartblok met licht radar-inset. */
export default function HuidscanVisualShell({ className = "" }: HuidscanVisualShellProps) {
  return (
    <div className={`${homeHuidscanCardShell} ${className}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(239,248,234,.85),transparent)]"
      />
      <EveMHuidscanVisual surface="light" className="relative max-w-none" />
    </div>
  );
}
