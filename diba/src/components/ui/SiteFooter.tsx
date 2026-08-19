import Link from "next/link";
import { DIBA_INSTAGRAM_URL, DIBA_SITE } from "@/lib/site";
import { figmaInnerContainer } from "@/lib/figma-inner-layout";

export type SiteFooterProps = {
  instagramHref?: string;
};

const footerLink =
  "text-[10px] font-medium uppercase tracking-[.13em] text-[var(--t-muted)] transition hover:text-[var(--g-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]";

/** Figma footer — nav-links + copyright, zelfde als homepage. */
export default function SiteFooter({ instagramHref }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const instagram = instagramHref ?? DIBA_INSTAGRAM_URL;

  return (
    <footer className={`${figmaInnerContainer} pb-10 pt-4`}>
      <div className="flex flex-col gap-6 border-t border-[var(--g-100)] pt-7">
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <Link prefetch={false} href="/huidproblemen" className={footerLink}>
            Huidproblemen
          </Link>
          <Link prefetch={false} href="/behandelingen" className={footerLink}>
            Behandelingen
          </Link>
          <Link prefetch={false} href="/prijzen" className={footerLink}>
            Prijzen
          </Link>
          <Link prefetch={false} href="/contact" className={footerLink}>
            Contact
          </Link>
          <Link prefetch={false} href="/privacybeleid" className={footerLink}>
            Privacy
          </Link>
          <Link prefetch={false} href="/cookiebeleid" className={footerLink}>
            Cookies
          </Link>
          {instagram ? (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={footerLink}
            >
              Instagram
            </a>
          ) : (
            <span className={`${footerLink} opacity-50`}>Instagram</span>
          )}
        </div>
        <div className="flex flex-col gap-5 text-[10px] font-medium uppercase tracking-[.13em] text-[var(--t-muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {DIBA_SITE.name}
          </span>
          <span>Weissenbruchlaan 166 · Rotterdam · Hillegersberg</span>
        </div>
      </div>
    </footer>
  );
}
