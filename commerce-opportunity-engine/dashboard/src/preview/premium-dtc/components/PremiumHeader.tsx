"use client";

import { useEffect, useState } from "react";
import type { SiteChrome, TrustItem } from "../types";
import { TrustServiceIcon, trustServiceIconKind } from "./TrustServiceIcons";

type Props = {
  chrome: SiteChrome;
  socialProofLabel?: string | null;
  trustItems?: TrustItem[];
};

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.4" />
      <path d="M19.4 19.4 15.6 15.6" strokeLinecap="round" />
    </svg>
  );
}

function IconAccount() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="8.4" r="3.7" />
      <path d="M5.2 19.6c1.2-3.4 3.7-5.1 6.8-5.1s5.6 1.7 6.8 5.1" strokeLinecap="round" />
    </svg>
  );
}

function IconBag() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M5.6 7.8h12.8L19.4 19.6H4.6L5.6 7.8z" strokeLinejoin="round" />
      <path d="M9.2 9.6V7.2a2.8 2.8 0 0 1 5.6 0v2.4" strokeLinecap="round" />
    </svg>
  );
}

function IconHeadset() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M4 14.5V11a8 8 0 0 1 16 0v3.5" strokeLinecap="round" />
      <path d="M4 14.5a2.5 2.5 0 0 0 2.5 2.5H7V11H4.5A.5.5 0 0 0 4 11.5v3zM20 14.5a2.5 2.5 0 0 1-2.5 2.5H17V11h2.5a.5.5 0 0 1 .5.5v3z" strokeLinejoin="round" />
    </svg>
  );
}

export function PremiumHeader({ chrome, socialProofLabel, trustItems = [] }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const slides = chrome.announcements.filter((s) => s.text.trim().length > 0);
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("pdtc-nav-open", menuOpen);
    return () => document.body.classList.remove("pdtc-nav-open");
  }, [menuOpen]);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const id = window.setInterval(() => setSlideIdx((i) => (i + 1) % slides.length), 4800);
    return () => window.clearInterval(id);
  }, [slides.length]);

  const activeSlide = slides[slideIdx] ?? slides[0];
  const hasTrustRail = socialProofLabel || trustItems.length > 0;

  return (
    <header className={`pdtc-header${scrolled ? " is-condensed" : ""}`}>
      {activeSlide ? (
        <div className="pdtc-promo" aria-live="polite">
          <div className="pdtc-container pdtc-promo-inner">
            <p className="pdtc-promo-text">
              {activeSlide.href ? (
                <a href={activeSlide.href}>{activeSlide.text}</a>
              ) : (
                activeSlide.text
              )}
            </p>
            {slides.length > 1 ? (
              <div className="pdtc-promo-dots" aria-hidden="true">
                {slides.map((s, i) => (
                  <span key={s.text} className={i === slideIdx ? "is-active" : ""} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="pdtc-nav">
        <div className="pdtc-container pdtc-nav-inner">
          <a href="#pdtc-top" className="pdtc-brand pdtc-brand--desktop" aria-label={chrome.brandName}>
            {chrome.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={chrome.logoUrl}
                alt={chrome.logoAlt || chrome.brandName}
                width={118}
                height={32}
              />
            ) : (
              <span className="pdtc-brand-word">{chrome.brandName}</span>
            )}
          </a>

          <button
            type="button"
            className="pdtc-nav-burger"
            aria-label={menuOpen ? "Menu sluiten" : "Menu openen"}
            aria-expanded={menuOpen}
            aria-controls="pdtc-drawer"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <path d="M5 5l10 10M15 5 5 15" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <path d="M3 6h14M3 10h14M3 14h14" />
              </svg>
            )}
          </button>

          <a href="#pdtc-top" className="pdtc-brand pdtc-brand--mobile" aria-label={chrome.brandName}>
            {chrome.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={chrome.logoUrl}
                alt={chrome.logoAlt || chrome.brandName}
                width={118}
                height={32}
              />
            ) : (
              <span className="pdtc-brand-word">{chrome.brandName}</span>
            )}
          </a>

          <nav className="pdtc-nav-links" aria-label="Hoofdmenu">
            {chrome.navLinks.map((link, index) => (
              <a
                key={link.href + link.label}
                href={link.href}
                className={`pdtc-nav-pill${index === 0 ? " pdtc-nav-pill--lead" : ""}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pdtc-nav-utils">
            <a href="#pdtc-faq" className="pdtc-support-pill">
              <IconHeadset />
              <span>Support</span>
            </a>

            <button type="button" className="pdtc-icon-btn pdtc-icon-btn--round" aria-label="Zoeken">
              <IconSearch />
            </button>
            {chrome.accountLabel ? (
              <button
                type="button"
                className="pdtc-icon-btn pdtc-icon-btn--round pdtc-icon-btn--account"
                aria-label={chrome.accountLabel}
              >
                <IconAccount />
              </button>
            ) : null}
            <a href="#pdtc-buy-area" className="pdtc-icon-btn pdtc-icon-btn--round" aria-label="Winkelwagen">
              <IconBag />
              {(chrome.cartCount ?? 0) > 0 ? (
                <span className="pdtc-cart-count">{chrome.cartCount}</span>
              ) : null}
            </a>
          </div>
        </div>
      </div>

      {hasTrustRail ? (
        <div className="pdtc-trust-rail">
          <div className="pdtc-container pdtc-trust-rail-grid">
            {socialProofLabel ? (
              <span className="pdtc-trust-chip pdtc-trust-chip--lead">
                <TrustServiceIcon kind="heart" />
                <span>{socialProofLabel}</span>
              </span>
            ) : null}
            {trustItems.map((item) => (
              <span key={item.label} className="pdtc-trust-chip" data-source={item.source}>
                <TrustServiceIcon kind={trustServiceIconKind(item.label)} />
                <span>{item.label}</span>
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div id="pdtc-drawer" className={`pdtc-drawer${menuOpen ? " is-open" : ""}`} hidden={!menuOpen}>
        <button
          type="button"
          className="pdtc-drawer-backdrop"
          aria-label="Menu sluiten"
          onClick={() => setMenuOpen(false)}
        />
        <div className="pdtc-drawer-panel">
          <div className="pdtc-drawer-head">
            <span className="pdtc-brand-word">{chrome.brandName}</span>
            <button
              type="button"
              className="pdtc-drawer-close"
              aria-label="Menu sluiten"
              onClick={() => setMenuOpen(false)}
            >
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <path d="M5 5l10 10M15 5 5 15" />
              </svg>
            </button>
          </div>
          <ul role="list" className="pdtc-drawer-links">
            {chrome.navLinks.map((link) => (
              <li key={link.href + link.label}>
                <a href={link.href} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#pdtc-faq" className="pdtc-drawer-support" onClick={() => setMenuOpen(false)}>
            <IconHeadset />
            Support en veelgestelde vragen
          </a>
        </div>
      </div>
    </header>
  );
}

export function PremiumFooter({ chrome }: { chrome: SiteChrome }) {
  const columns = chrome.footerColumns ?? [];

  return (
    <footer className="pdtc-footer">
      <div className="pdtc-container">
        <div className="pdtc-footer-top">
          <div className="pdtc-footer-brand">
            {chrome.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="pdtc-footer-logo"
                src={chrome.logoUrl}
                alt={chrome.logoAlt || chrome.brandName}
                width={118}
                height={32}
              />
            ) : (
              <span className="pdtc-brand-word">{chrome.brandName}</span>
            )}
            {chrome.footerTagline ? (
              <p className="pdtc-footer-tagline">{chrome.footerTagline}</p>
            ) : null}
          </div>

          <div className="pdtc-footer-cols">
            {columns.map((col) => (
              <div className="pdtc-footer-col" key={col.title}>
                <h3>{col.title}</h3>
                {col.links && col.links.length > 0 ? (
                  <ul role="list">
                    {col.links.map((l) => (
                      <li key={l.href + l.label}>
                        <a href={l.href}>{l.label}</a>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {col.facts && col.facts.length > 0 ? (
                  <ul role="list" className="pdtc-footer-facts">
                    {col.facts.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="pdtc-footer-bottom">
          {chrome.legalNote ? <p>{chrome.legalNote}</p> : <span />}
        </div>
      </div>
    </footer>
  );
}
