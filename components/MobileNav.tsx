"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buildWhatsAppTextLink } from "@/lib/whatsapp";
import type { SiteSettings } from "@/lib/types";

// Home, Search and Design highlight gold when active. Wishlist, in the
// reference, stays a fixed muted colour regardless of route, so it is
// rendered separately below rather than folded into this list.
const ACTIVATABLE_TABS = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/fabrics", label: "Search", icon: "⌕" },
  { href: "/find", label: "Design", icon: "✦" },
] as const;

/** The mobile-only sticky bottom bar: Home, Search, Design (find your drape), Wishlist, WhatsApp. */
export function MobileNav({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();

  return (
    <nav
      className="mug-only-m"
      aria-label="Primary"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 80,
        background: "#1A0E1B",
        justifyContent: "space-around",
        alignItems: "stretch",
        padding: "7px 4px 9px",
        borderTop: "2px solid #C9A227",
      }}
    >
      {ACTIVATABLE_TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.label}
            href={tab.href}
            prefetch={false}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
              color: active ? "#FFB100" : "rgba(255,248,240,.66)",
              fontWeight: 600,
              fontSize: "10.5px",
              textDecoration: "none",
            }}
          >
            <span style={{ fontSize: "18px", lineHeight: 1 }}>{tab.icon}</span>
            {tab.label}
          </Link>
        );
      })}
      <Link
        href="/find"
        prefetch={false}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "3px",
          color: "rgba(255,248,240,.66)",
          fontWeight: 600,
          fontSize: "10.5px",
          textDecoration: "none",
        }}
      >
        <span style={{ fontSize: "16px", lineHeight: 1, color: "#FF6FBE" }}>❀</span>
        Wishlist
      </Link>
      <a
        href={buildWhatsAppTextLink("Hi Mugdha! I want to explore your sarees.", settings)}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          flex: 1,
          textDecoration: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "3px",
          color: "#57B947",
          fontWeight: 600,
          fontSize: "10.5px",
        }}
      >
        <span style={{ fontSize: "17px", lineHeight: 1 }}>✆</span>
        WhatsApp
      </a>
    </nav>
  );
}
