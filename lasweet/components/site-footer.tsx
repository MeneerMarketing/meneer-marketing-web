import Image from "next/image";
import Link from "next/link";
import {
  InstagramLogoIcon,
  MapPinIcon,
  TiktokLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import logoWhite from "@/public/brand/la-sweet-logo-white.png";

export function SiteFooter() {
  return (
    <footer className="bg-matcha-deep text-cream">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="relative h-12 w-[220px] md:h-14 md:w-[260px]">
              <Image
                src={logoWhite}
                alt="Lá Sweet by Ela"
                fill
                sizes="260px"
                className="object-contain object-left"
              />
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/75">
              Handgemaakte crumble cookies en iced matcha uit Enschede. In
              kleine batches, dus op is op.
            </p>
            <div className="mt-6 flex gap-2">
              <a
                href="https://www.tiktok.com/@la.sweetbyela"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-11 items-center justify-center rounded-full border border-cream/25 text-cream transition-colors hover:bg-cream hover:text-matcha-deep"
                aria-label="Lá Sweet op TikTok"
              >
                <TiktokLogoIcon size={18} weight="fill" />
              </a>
              <a
                href="https://www.instagram.com/la.sweetbyela"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-11 items-center justify-center rounded-full border border-cream/25 text-cream transition-colors hover:bg-cream hover:text-matcha-deep"
                aria-label="Lá Sweet op Instagram"
              >
                <InstagramLogoIcon size={18} weight="fill" />
              </a>
            </div>
          </div>

          <nav aria-label="Footermenu">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cream/60">
              Menu
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {[
                { label: "Matcha", href: "/#matcha" },
                { label: "Cookies", href: "/#cookies" },
                { label: "Bestellen", href: "/bestellen" },
                { label: "Contact", href: "/contact" },
                { label: "Matcha Enschede", href: "/matcha-enschede" },
                { label: "Koekjes Enschede", href: "/koekjes-enschede" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-display text-lg font-bold text-cream transition-colors hover:text-parchment"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cream/60">
              Bezoek
            </p>
            <div className="mt-4 flex items-start gap-3">
              <MapPinIcon size={20} weight="fill" className="mt-0.5 shrink-0 text-cream/70" />
              <div>
                <address className="not-italic text-sm leading-relaxed text-cream/85">
                  Haaksbergerstraat 302
                  <br />
                  7513 EH Enschede
                  <br />
                  Walk-in op zaterdag
                </address>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-cream/15 pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p className="text-xs text-cream/60">
            &copy; {new Date().getFullYear()} Lá Sweet by Ela
          </p>
          <p className="text-xs text-cream/60">Met liefde gebakken in Enschede</p>
          <p className="text-xs text-cream/60">
            Website door{" "}
            <a
              href="https://meneermarketing.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-cream/35 underline-offset-2 transition-colors hover:text-cream hover:decoration-cream"
            >
              Meneer Marketing
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
