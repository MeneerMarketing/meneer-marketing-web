"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { StudioBrandMark } from "@/components/templates/StudioBrandMark";
import type { CineModel } from "@/components/templates/cinematic/cinematicModel";

interface Props {
  model: CineModel;
  variant?: "pilates" | "skin-clinic";
}

/**
 * Chrome op beeld: wordmark links, boek-pill en menu rechts.
 * Het menu is een filmisch fullscreen overlay, geen dropdown.
 */
export function CinematicChrome({ model, variant = "pilates" }: Props) {
  const { wordmark, logoUrl, logoLight, logoOnLightBackground, booking, navLinks, contact, city, studioName, primaryService } =
    model;
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  // Still naast de links, zodat het menu een pagina is en geen lijst. Het
  // laatste beeld uit de reeks, want de eerste staan al in de lessenkaarten.
  const menuImage =
    model.gallery[model.gallery.length - 1] ?? model.gallery[0] ?? model.heroImage;

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-30 px-5 pt-5 sm:px-8 sm:pt-7 lg:px-10">
        <div className="flex items-center justify-between gap-4">
          <a href="#top" className="min-w-0 shrink-0">
            <StudioBrandMark
              studioName={studioName}
              logoUrl={logoUrl}
              variant="cinematic"
              wordmark={wordmark}
              logoLight={logoLight}
              logoOnLightBackground={logoOnLightBackground}
            />
          </a>

          <div className="flex items-center gap-2.5">
            {/* Wrapper regelt het verbergen: .cine-pill zet zelf display. */}
            <span className="hidden sm:block">
              <a
                href={booking.href}
                {...(booking.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="cine-pill"
              >
                {booking.label}
              </a>
            </span>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="cine-menu"
              className="cine-pill"
            >
              Menu
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="cine-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.35 }}
            className="fixed inset-0 z-50 bg-[var(--cn-dark)] text-[var(--cn-on-dark)]"
          >
            <div aria-hidden className="cine-grain pointer-events-none absolute inset-0" />

            <div className="relative flex h-full flex-col px-5 pb-24 pt-5 sm:px-8 sm:pb-28 sm:pt-7 lg:px-10">
              <div className="flex items-center justify-between gap-4">
                <span className="cine-display cine-lower text-[1.6rem] sm:text-[1.85rem]">
                  {wordmark.head}
                  {wordmark.tail ? (
                    <>
                      {" "}
                      <span className="cine-italic">{wordmark.tail}</span>
                    </>
                  ) : null}
                  <span className="text-[var(--cn-on-dark-soft)]">.</span>
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="cine-pill"
                >
                  Sluiten
                </button>
              </div>

              <nav className="mt-12 flex flex-1 flex-col justify-center sm:mt-0 lg:grid lg:grid-cols-[1fr_0.72fr] lg:items-center lg:gap-16">
                <ul>
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.href}
                      initial={
                        reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: reduceMotion ? 0 : 0.5,
                        delay: reduceMotion ? 0 : 0.06 * index,
                        ease: [0.22, 0.9, 0.24, 1],
                      }}
                    >
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="cine-display cine-lower block py-1 text-[clamp(1.9rem,5.4vw,3.5rem)] leading-[1.06] text-[var(--cn-on-dark)] transition-colors duration-300 hover:text-[var(--cn-on-dark-soft)]"
                      >
                        {link.label}
                      </a>
                    </motion.li>
                  ))}
                </ul>

                {menuImage ? (
                  <motion.figure
                    className="hidden lg:block"
                    initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.7,
                      delay: reduceMotion ? 0 : 0.18,
                      ease: [0.22, 0.9, 0.24, 1],
                    }}
                  >
                    <div className="relative h-[min(52vh,30rem)] overflow-hidden rounded-[1.5rem] bg-[var(--cn-dark-2)]">
                      <div className="cine-media absolute inset-0">
                        <Image
                          src={menuImage.url}
                          alt={menuImage.alt}
                          fill
                          className="object-cover"
                          sizes="34vw"
                        />
                      </div>
                      <div
                        aria-hidden
                        className="cine-grain pointer-events-none absolute inset-0"
                      />
                    </div>
                    <figcaption className="cine-label mt-4 text-[var(--cn-on-dark-soft)]">
                      {[city, primaryService].filter(Boolean).join(" · ")}
                    </figcaption>
                  </motion.figure>
                ) : null}
              </nav>

              <div className="mt-10 grid gap-6 border-t border-white/12 pt-6 sm:grid-cols-3">
                <div>
                  <p className="cine-label text-[var(--cn-on-dark-soft)]">
                    {variant === "skin-clinic" ? "Kliniek" : "Studio"}
                  </p>
                  <p className="mt-2 text-[14px] leading-6">
                    {studioName}
                    {contact.address ? (
                      <>
                        <br />
                        {contact.address}
                      </>
                    ) : (
                      <>
                        <br />
                        {city}
                      </>
                    )}
                  </p>
                </div>
                <div>
                  <p className="cine-label text-[var(--cn-on-dark-soft)]">Contact</p>
                  <p className="mt-2 space-x-0 text-[14px] leading-6">
                    {contact.phone ? (
                      <>
                        <a
                          href={`tel:${contact.phone.replace(/\s/g, "")}`}
                          className="underline decoration-white/30 underline-offset-4"
                        >
                          {contact.phone}
                        </a>
                        <br />
                      </>
                    ) : null}
                    {contact.email ? (
                      <a
                        href={`mailto:${contact.email}`}
                        className="underline decoration-white/30 underline-offset-4"
                      >
                        {contact.email}
                      </a>
                    ) : null}
                  </p>
                </div>
                <div className="flex items-end sm:justify-end">
                  <a
                    href={booking.href}
                    {...(booking.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="cine-pill cine-pill-solid"
                  >
                    {booking.label}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
