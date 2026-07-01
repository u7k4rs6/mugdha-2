"use client";

import { useState } from "react";
import { SectionLabel } from "./SectionLabel";
import { Gopuram } from "./motifs/Gopuram";
import { Kolam } from "./motifs/Kolam";
import type { Fabric } from "@/lib/types";

/** "The making, up close": the three heritage weaves, tabbed. */
export function CraftPanel({ weaves }: { weaves: Fabric[] }) {
  const [activeName, setActiveName] = useState(weaves[0]?.name);
  const active = weaves.find((w) => w.name === activeName) ?? weaves[0];
  if (!active) return null;

  return (
    <section
      style={{
        position: "relative",
        background: "radial-gradient(120% 120% at 50% 0%, #20131A 0%, #160A0F 72%, #100709 100%)",
        color: "#F5EFE6",
        padding: "128px 0 104px",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "center", pointerEvents: "none", zIndex: 1, opacity: 0.5 }}>
        <Gopuram color="#C9A227" />
      </div>
      <div style={{ position: "absolute", top: "64px", left: 0, right: 0, display: "flex", justifyContent: "center", pointerEvents: "none", zIndex: 1 }}>
        <Kolam stroke="#C9A227" size={72} duration={3.4} strokeWidth={1} />
      </div>
      <div style={{ position: "relative", zIndex: 2, maxWidth: "1280px", margin: "0 auto", padding: "0 40px" }}>
        <div style={{ marginBottom: "14px" }}>
          <SectionLabel>The making</SectionLabel>
        </div>
        <h2
          style={{
            margin: "0 0 32px",
            fontFamily: "var(--font-serif)",
            fontWeight: 400,
            fontSize: "clamp(34px,4.6vw,58px)",
            lineHeight: 1.05,
            color: "#F5EFE6",
          }}
        >
          The making, up close
        </h2>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "30px" }}>
          {weaves.map((w) => {
            const selected = w.name === active.name;
            return (
              <button
                key={w.name}
                type="button"
                onClick={() => setActiveName(w.name)}
                style={{
                  border: "1px solid " + (selected ? "#C9A227" : "rgba(201,162,39,.35)"),
                  background: selected ? "rgba(201,162,39,.16)" : "transparent",
                  color: selected ? "#E9C766" : "rgba(245,239,230,.72)",
                  cursor: "pointer",
                  fontWeight: 500,
                  letterSpacing: ".03em",
                  fontSize: "14px",
                  padding: "11px 22px",
                  borderRadius: "2px",
                }}
              >
                {w.name}
              </button>
            );
          })}
        </div>
        <div className="mug-col2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "34px", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "var(--font-tamil)", fontSize: "46px", color: active.accentColor, lineHeight: 1, marginBottom: "14px" }}>
              {active.script}
            </div>
            <p style={{ margin: "0 0 18px", fontSize: "19px", lineHeight: 1.55, color: "rgba(255,248,240,.86)", maxWidth: "46ch" }}>
              {active.story}
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                border: "1px solid rgba(201,162,39,.4)",
                padding: "10px 18px",
                fontWeight: 500,
                letterSpacing: ".03em",
                fontSize: "13.5px",
                color: "#E9C766",
              }}
            >
              On the loom · {active.onLoomDays}
            </div>
          </div>
          <div>
            <div style={{ position: "relative", overflow: "hidden", aspectRatio: "4/5" }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- editorial crop, not a fixed-dimension asset */}
              <img
                src={active.heroImage}
                alt={`${active.name} silk`}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 32%",
                  filter: "saturate(1.18) brightness(1.06)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
