import Link from "next/link";

interface LogoProps {
  className?: string;
  /** `light` = footer / donkere achtergronden */
  variant?: "dark" | "light";
}

export function Logo({ className, variant = "dark" }: LogoProps) {
  const light = variant === "light";

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 rounded-lg outline-offset-4 ${className ?? ""}`}
      aria-label="MeneerMarketing. Home"
    >
      {/* SVG via native img: stabiele hydration vs next/image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/mark.svg"
        alt=""
        width={40}
        height={40}
        className={`size-9 shrink-0 sm:size-10 ${light ? "brightness-0 invert opacity-95" : ""}`}
        fetchPriority={light ? "auto" : "high"}
      />
      <span className="flex flex-wrap items-baseline gap-x-1 font-sans text-[1.05rem] leading-none tracking-tight sm:text-lg">
        <span
          className={`font-semibold ${light ? "text-white" : "text-mm-text"}`}
        >
          Meneer
        </span>
        <span
          className={`font-extrabold ${light ? "text-white" : "text-mm-text"}`}
        >
          Marketing
        </span>
      </span>
    </Link>
  );
}
