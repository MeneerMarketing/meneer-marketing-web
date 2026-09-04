"use client";

import { useEffect, useId, useRef, useState } from "react";
import type {
  ClinicModel,
  ClinicNavLink,
} from "@/components/templates/reformer-minimal/clinicModel";
import { StudioBrandMark } from "@/components/templates/StudioBrandMark";

interface TopBarProps {
  rating: string | null;
  reviewCount: number;
  email: string | null;
  phone: string | null;
  showPlans: boolean;
  showFaq: boolean;
}

/** Trust-strook à la Body Clinic: sterren + onderstreepte reviews, lichte links, dikke contact. */
export function ClinicTopBar({
  rating,
  reviewCount,
  email,
  phone,
  showPlans,
  showFaq,
}: TopBarProps) {
  return (
    <div className="fc-plane-010 px-3 sm:px-4">
      <div className="flex h-10 items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
        <div className="min-w-0">
          {rating ? (
            <a
              href="#ervaringen"
              className="inline-flex items-center gap-2 text-[12px] text-[var(--fc-ink)] transition-opacity hover:opacity-70"
            >
              <span
                className="inline-flex shrink-0 gap-0.5 text-[11px] leading-none text-[var(--fc-ink)]"
                aria-hidden
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </span>
              <span className="font-semibold tabular-nums">{rating}</span>
              <span className="text-[var(--fc-ink-soft)]">
                uit{" "}
                {reviewCount > 0 ? (
                  <span className="underline underline-offset-[3px] decoration-[var(--fc-ink-soft)]">
                    {reviewCount} reviews
                  </span>
                ) : (
                  "waardering"
                )}
              </span>
            </a>
          ) : (
            <span className="text-[12px] text-[var(--fc-ink-soft)]">
              Studio Forma
            </span>
          )}
        </div>

        <div className="hidden items-center gap-5 text-[12px] md:flex lg:gap-6">
          {showFaq ? (
            <a
              href="#faq"
              className="text-[var(--fc-ink-faint)] transition-colors hover:text-[var(--fc-ink)]"
            >
              Veelgestelde vragen
            </a>
          ) : null}
          {showPlans ? (
            <a
              href="#tarieven"
              className="text-[var(--fc-ink-faint)] transition-colors hover:text-[var(--fc-ink)]"
            >
              Abonnementen
            </a>
          ) : null}
          {email ? (
            <a
              href={`mailto:${email}`}
              className="font-medium text-[var(--fc-ink)] underline underline-offset-[3px] decoration-[var(--fc-ink)]/50 transition-opacity hover:opacity-70"
            >
              {email}
            </a>
          ) : null}
          {phone ? (
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="font-medium text-[var(--fc-ink)] underline underline-offset-[3px] decoration-[var(--fc-ink)]/50 transition-opacity hover:opacity-70"
            >
              {phone}
            </a>
          ) : null}
        </div>

        {phone ? (
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="text-[12px] font-medium text-[var(--fc-ink)] underline underline-offset-[3px] md:hidden"
          >
            Bel
          </a>
        ) : null}
      </div>
    </div>
  );
}

export interface MegaLink {
  href: string;
  label: string;
  zin?: string;
}

export interface MegaColumn {
  kop: string;
  items: MegaLink[];
  breed?: boolean;
}

export interface MegaFeatured {
  label: string;
  kop: string;
  zin: string;
  href: string;
  knop: string;
  external?: boolean;
}

export interface MegaMenu {
  id: string;
  label: string;
  href: string;
  columns: MegaColumn[];
  featured?: MegaFeatured;
}

interface NavProps {
  studioName: string;
  brandName?: string;
  logoUrl: string | null;
  logoLight?: boolean;
  logoOnLightBackground?: boolean;
  links: ClinicNavLink[];
  booking: ClinicModel["booking"];
  menus: MegaMenu[];
  /** Zwevend over het hero-beeld (DIBA opBeeld). */
  onMedia?: boolean;
}

const CLOSE_DELAY = 120;

/**
 * Navigatie à la DIBA: brede mega-panelen, solide vlakken, geen smalle dropdowns.
 */
export function ClinicNav({
  studioName,
  brandName,
  logoUrl,
  logoLight,
  logoOnLightBackground,
  links,
  booking,
  menus,
  onMedia = false,
}: NavProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const active = menus.find((menu) => menu.id === openId) ?? null;

  function plan(next: string | null) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (next === null) {
      closeTimer.current = setTimeout(() => setOpenId(null), CLOSE_DELAY);
      return;
    }
    setOpenId(next);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenId(null);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const itemClass = onMedia
    ? "text-white/85 hover:bg-white/12 hover:text-white"
    : "text-[var(--fc-ink-soft)] hover:bg-[var(--fc-wash)] hover:text-[var(--fc-ink)]";
  const itemOpenClass = onMedia
    ? "bg-white/15 text-white"
    : "bg-[var(--fc-wash)] text-[var(--fc-ink)]";
  const navBrand = brandName?.trim() || studioName;

  return (
    <div
      className={onMedia ? "absolute inset-x-0 top-0 z-30" : "relative z-30 fc-plane-010"}
      onMouseLeave={() => plan(null)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpenId(null);
        }
      }}
    >
      <header className="relative z-10">
        <div
          className={
            onMedia
              ? "relative flex min-h-[4rem] items-center justify-between gap-6 px-5 py-2.5 sm:min-h-[4.25rem] sm:px-8 sm:py-3 lg:px-10 lg:py-3"
              : "relative mx-auto flex h-[4.25rem] max-w-[1400px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-[5vw] lg:px-10"
          }
        >
          <a
            href="#top"
            className="relative z-10 flex min-w-0 max-w-[10.5rem] shrink-0 items-center leading-none sm:max-w-[11.5rem]"
          >
            <StudioBrandMark
              studioName={navBrand}
              logoUrl={logoUrl}
              variant="clinic"
              onMedia={onMedia}
              logoLight={logoLight}
              logoOnLightBackground={logoOnLightBackground}
            />
          </a>

          <nav
            aria-label="Hoofdmenu"
            className="absolute left-1/2 top-1/2 z-10 hidden min-w-0 max-w-[min(52vw,38rem)] -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1 overflow-hidden lg:flex"
          >
            {links.map((link) => {
              const menu = menus.find(
                (entry) => entry.href === link.href || entry.id === link.href
              );
              if (menu) {
                return (
                  <button
                    key={link.href}
                    type="button"
                    aria-expanded={openId === menu.id}
                    onMouseEnter={() => plan(menu.id)}
                    onFocus={() => plan(menu.id)}
                    onClick={() =>
                      setOpenId((current) =>
                        current === menu.id ? null : menu.id
                      )
                    }
                    className={`inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 text-[13px] transition-colors ${itemClass} ${
                      openId === menu.id ? itemOpenClass : ""
                    }`}
                  >
                    {link.label}
                    <Caret open={openId === menu.id} />
                  </button>
                );
              }

              return (
                <a
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => plan(null)}
                  className={`inline-flex h-10 items-center rounded-full px-3.5 text-[13px] transition-colors ${itemClass}`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <a
            href={booking.href}
            {...(booking.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className={`relative z-10 inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-[12px] font-medium transition-colors ${
              onMedia
                ? "bg-[var(--fc-on-dark-btn)] text-[var(--fc-on-dark-btn-text)] hover:bg-[var(--fc-paper)]"
                : "bg-[var(--fc-accent-deep)] text-[var(--fc-on-dark)] hover:bg-[var(--fc-dark-deeper)]"
            }`}
          >
            Afspraak maken
            <span aria-hidden>›</span>
          </a>
        </div>
      </header>

      {/* Scrim: solide donker vlak, geen gradient */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-full h-[100vh] bg-[var(--fc-ink)]/40 transition-opacity duration-300 ease-[var(--fc-ease)] ${
          active ? "opacity-100" : "opacity-0"
        }`}
      />

      {active ? (
        <MegaPanel
          menu={active}
          onMedia={onMedia}
          onClose={() => setOpenId(null)}
          onKeepOpen={() => plan(active.id)}
          onLeave={() => plan(null)}
        />
      ) : null}
    </div>
  );
}

function Caret({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={`h-2.5 w-2.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      fill="none"
      aria-hidden
    >
      <path
        d="M2.5 4.25 6 7.75l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MegaPanel({
  menu,
  onMedia,
  onClose,
  onKeepOpen,
  onLeave,
}: {
  menu: MegaMenu;
  onMedia: boolean;
  onClose: () => void;
  onKeepOpen: () => void;
  onLeave: () => void;
}) {
  const panelId = useId();
  const lanes = menu.columns.reduce(
    (sum, column) => sum + (column.breed ? 2 : 1),
    0
  );

  return (
    <div
      id={panelId}
      className={`absolute inset-x-3 z-40 hidden overflow-hidden rounded-[var(--fc-radius-lg)] border border-[var(--fc-line)] bg-[var(--fc-paper)] lg:block ${
        onMedia ? "top-full" : "top-[4.25rem]"
      } ${onMedia ? "" : "sm:inset-x-5 lg:inset-x-[5vw]"}`}
      onMouseEnter={onKeepOpen}
      onMouseLeave={onLeave}
    >
      <div className={`grid ${menu.featured ? "grid-cols-12" : "grid-cols-1"}`}>
        <div
          className={menu.featured ? "col-span-12 p-7 xl:col-span-9 xl:p-9" : "p-7 xl:p-9"}
        >
          <div
            className="grid gap-x-8 gap-y-8"
            style={{
              gridTemplateColumns: `repeat(${Math.max(1, lanes)}, minmax(0, 1fr))`,
            }}
          >
            {menu.columns.map((column) => (
              <div
                key={column.kop}
                style={column.breed ? { gridColumn: "span 2" } : undefined}
              >
                <p className="figma-label text-[var(--fc-label)]">{column.kop}</p>
                <ul
                  className={`mt-4 gap-x-4 ${
                    column.breed ? "grid grid-cols-2" : "flex flex-col"
                  }`}
                >
                  {column.items.map((item) => (
                    <li key={item.href + item.label}>
                      <a
                        href={item.href}
                        onClick={onClose}
                        className="group -mx-3 block rounded-[1rem] px-3 py-2.5 transition-colors hover:bg-[var(--fc-wash)]"
                      >
                        <span className="block text-[15px] font-medium leading-6 text-[var(--fc-ink)]">
                          {item.label}
                        </span>
                        {item.zin ? (
                          <span className="mt-0.5 block text-[13px] leading-5 text-[var(--fc-ink-mute)]">
                            {item.zin}
                          </span>
                        ) : null}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-[var(--fc-line)] pt-5">
            <a
              href={menu.href}
              onClick={onClose}
              className="figma-label inline-flex items-center gap-2 text-[var(--fc-accent-deep)] transition-colors hover:text-[var(--fc-ink)]"
            >
              Alles over {menu.label.toLowerCase()}
              <span aria-hidden>›</span>
            </a>
          </div>
        </div>

        {menu.featured ? (
          <div className="col-span-12 flex flex-col justify-center bg-[var(--fc-wash)] p-7 xl:col-span-3 xl:p-9">
            <p className="figma-label text-[var(--fc-label)]">
              {menu.featured.label}
            </p>
            <p className="mt-3 text-[1.25rem] font-medium tracking-tight text-[var(--fc-ink)]">
              {menu.featured.kop}
            </p>
            <p className="mt-3 text-[14px] leading-6 text-[var(--fc-ink-soft)]">
              {menu.featured.zin}
            </p>
            <a
              href={menu.featured.href}
              {...(menu.featured.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              onClick={onClose}
              className="figma-label mt-7 inline-flex h-11 w-fit items-center gap-2 rounded-full bg-[var(--fc-accent-deep)] px-5 text-[var(--fc-on-dark)] transition-colors hover:bg-[var(--fc-dark-deeper)]"
            >
              {menu.featured.knop}
              <span aria-hidden>›</span>
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
