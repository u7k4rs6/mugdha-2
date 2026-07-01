"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { WhatsAppButton } from "./WhatsAppButton";
import { TempleBorder } from "./motifs/TempleBorder";
import type { SiteSettings } from "@/lib/types";

const NAV_ITEMS = [
  { label: "Sarees", href: "/sarees" },
  { label: "Fabrics", href: "/fabrics" },
  { label: "Bridal", href: "/bridal" },
  { label: "Find Your Drape", href: "/find" },
  { label: "AR Try-On", href: "/ar" },
  { label: "Stores", href: "/stores" },
];

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "ta", label: "த" },
  { code: "te", label: "తె" },
  { code: "hi", label: "हि" },
] as const;

/**
 * Wordmark, nav, language switch, sound toggle, wishlist and WhatsApp.
 * The language switch is a visual toggle only this step, no i18n wiring yet.
 * The heart button's count is a fixed placeholder, matching the reference's
 * demo state, until a real wishlist feature exists.
 */
export function Header({
  settings,
  wishCount = 2,
}: {
  settings: SiteSettings;
  wishCount?: number;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState<(typeof LANGUAGES)[number]["code"]>("en");
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) / 520 > 0.04);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tick = settings.announcementTicker.flatMap((t, i) => (i === 0 ? [t] : ["✦", t]));
  tick.push("✦");

  return (
    <Fragment>
      <div style={{ position: "relative", zIndex: 60, background: "#1A0E1B", color: "#FFF8F0", overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            width: "max-content",
            animation: "mug-marquee 40s linear infinite",
            whiteSpace: "nowrap",
            padding: "9px 0",
            fontSize: "13px",
            letterSpacing: ".06em",
            fontWeight: 500,
          }}
        >
          {["a", "b"].map((copy) => (
            <span key={copy} style={{ display: "inline-flex", gap: "34px", paddingRight: "34px" }}>
              {tick.map((t, i) => (
                <span key={copy + i} style={{ color: i % 2 ? "#C9A227" : "#FFF8F0" }}>
                  {t}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
      <div style={{ position: "relative", zIndex: 60, background: "#1A0E1B", lineHeight: 0 }}>
        <TempleBorder color="#A8884E" height={8} />
      </div>
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 55,
        backdropFilter: "blur(14px)",
        background: scrolled ? "rgba(245,239,230,.94)" : "rgba(245,239,230,.4)",
        borderBottom: "1px solid rgba(26,14,27,.07)",
        transition: "background .4s",
      }}
    >
      <div
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "0 26px",
          height: "68px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        <Link
          href="/"
          style={{
            border: 0,
            background: "none",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "baseline",
            gap: "8px",
            textDecoration: "none",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-label)",
              fontWeight: 700,
              fontSize: "27px",
              letterSpacing: "-.01em",
              color: "#2C1B20",
            }}
          >
            MUGDHA
          </span>
          <span style={{ fontFamily: "var(--font-devanagari)", fontSize: "14px", color: "#C9A227" }}>
            उत्सव
          </span>
        </Link>

        <nav className="hidden md:flex" style={{ alignItems: "center", gap: "2px" }}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              style={{
                border: 0,
                background: "none",
                cursor: "pointer",
                fontWeight: 400,
                fontSize: "14.5px",
                color: "#2C1B20",
                padding: "9px 12px",
                borderRadius: "9px",
                whiteSpace: "nowrap",
                textDecoration: "none",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          <div
            role="group"
            aria-label="Language"
            style={{
              display: "flex",
              gap: "2px",
              background: "rgba(26,14,27,.06)",
              borderRadius: "24px",
              padding: "3px",
            }}
          >
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code)}
                title={l.code}
                style={{
                  border: 0,
                  cursor: "pointer",
                  background: lang === l.code ? "#1A0E1B" : "transparent",
                  color: lang === l.code ? "#FFF8F0" : "#1A0E1B",
                  fontWeight: 600,
                  fontSize: "13px",
                  minWidth: "30px",
                  padding: "6px 7px",
                  borderRadius: "20px",
                }}
              >
                {l.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setSoundOn((v) => !v)}
            className="hidden md:inline-flex"
            title="Festive sound"
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              border: "1px solid rgba(26,14,27,.14)",
              background: soundOn ? "#FFB100" : "transparent",
              color: "#1A0E1B",
              cursor: "pointer",
              fontSize: "14px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ♪
          </button>

          <Link
            href="/find"
            prefetch={false}
            className="hidden md:inline-flex"
            style={{
              alignItems: "center",
              gap: "7px",
              border: 0,
              cursor: "pointer",
              background: "#1A0E1B",
              color: "#FFF8F0",
              fontWeight: 600,
              fontSize: "13.5px",
              padding: "9px 13px",
              borderRadius: "30px",
              textDecoration: "none",
            }}
          >
            <span style={{ color: "#FF6FBE" }}>❀</span>
            <span>{wishCount}</span>
          </Link>

          <WhatsAppButton
            settings={settings}
            message="Hi Mugdha! I want to explore your sarees."
          />
        </div>
      </div>
    </header>
    </Fragment>
  );
}
