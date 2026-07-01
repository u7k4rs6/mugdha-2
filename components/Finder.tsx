"use client";

import { useMemo, useState } from "react";
import { ZoomImage } from "./ZoomImage";
import { formatINR } from "@/lib/format";
import { buildSareeWhatsAppLink } from "@/lib/whatsapp";
import type { PalluMotif, Saree, SiteSettings } from "@/lib/types";

const MOTIF_OPTIONS: { id: "Any" | PalluMotif; label: string }[] = [
  { id: "Any", label: "Any" },
  { id: "peacock", label: "Peacock" },
  { id: "buta", label: "Mango buta" },
  { id: "temple", label: "Temple" },
];

const SELECTED_BORDER = "#6A1E24";
const SELECTED_BG = "#6A1E24";
const SELECTED_FG = "#F5EFE6";
const IDLE_BORDER = "rgba(168,136,78,.5)";
const IDLE_FG = "#E9DCC9";

function chipStyle(selected: boolean): React.CSSProperties {
  return {
    border: "1px solid " + (selected ? SELECTED_BORDER : IDLE_BORDER),
    background: selected ? SELECTED_BG : "transparent",
    color: selected ? SELECTED_FG : IDLE_FG,
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "13px",
    padding: "8px 14px",
    borderRadius: "2px",
  };
}

/**
 * "Find your drape": fabric, colour, border and motif chips filtering the
 * real local catalogue in the browser. The reference's near-match scoring
 * (fall back to the closest sarees when nothing matches exactly) is
 * reproduced; a dedicated /find route with its own URL-driven state is
 * Step 5's job, this is the homepage panel only.
 */
export function Finder({
  sarees,
  fabricOptions,
  colorOptions,
  settings,
}: {
  sarees: Saree[];
  fabricOptions: string[];
  colorOptions: { name: string; swatch: string }[];
  settings: SiteSettings;
}) {
  const [fabric, setFabric] = useState("Any");
  const [color, setColor] = useState("Any");
  const [border, setBorder] = useState("Any");
  const [motif, setMotif] = useState<"Any" | PalluMotif>("Any");

  // The reference excludes this one product from the Finder specifically:
  // its source photo 404s (S3 returns 403), a pre-existing data issue, not
  // something this port introduced.
  const findable = sarees.filter(
    (s) => s.name !== "Rani Pink Georgette Saree Paisley Buttas Elephant Border",
  );

  const anySelected = !(fabric === "Any" && color === "Any" && border === "Any" && motif === "Any");

  const isExact = (s: Saree) =>
    (fabric === "Any" || s.fabric === fabric) &&
    (color === "Any" || s.colorFamily === color) &&
    (motif === "Any" || s.palluMotif === motif);

  const { results, heading } = useMemo(() => {
    if (!anySelected) {
      return { results: findable.slice(0, 4), heading: "A few from the house" };
    }
    const exact = findable.filter(isExact);
    if (exact.length) {
      return { results: exact.slice(0, 4), heading: "Your matches" };
    }
    const score = (s: Saree) => {
      let sc = 0;
      if (fabric !== "Any" && s.fabric === fabric) sc += 3;
      if (color !== "Any" && s.colorFamily === color) sc += 3;
      if (motif !== "Any" && s.palluMotif === motif) sc += 2;
      if (border !== "Any" && s.colorFamily === border) sc += 1;
      return sc;
    };
    const closest = [...findable].sort((a, b) => score(b) - score(a)).slice(0, 4);
    return { results: closest, heading: "Nothing exact, but these are close" };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [findable, fabric, color, border, motif, anySelected]);

  const reset = () => {
    setFabric("Any");
    setColor("Any");
    setBorder("Any");
    setMotif("Any");
  };

  return (
    <section
      style={{
        position: "relative",
        background: "radial-gradient(120% 120% at 50% 0%, #20131A 0%, #160A0F 70%, #100709 100%)",
        color: "#F5EFE6",
        padding: "128px 0 104px",
        overflow: "hidden",
      }}
    >
      <div
        className="mug-col2"
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 40px",
          display: "grid",
          gridTemplateColumns: "1.05fr .95fr",
          gap: "60px",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: "11px", letterSpacing: ".26em", textTransform: "uppercase", color: "#C9A227", marginBottom: "18px" }}>
            The house atelier · matched to real silk
          </div>
          <h2 style={{ margin: "0 0 16px", fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "clamp(34px,4.6vw,58px)", lineHeight: 1.05, color: "#F5EFE6" }}>
            Find your drape
          </h2>
          <p style={{ margin: "0 0 30px", maxWidth: "44ch", fontSize: "15.5px", lineHeight: 1.75, color: "rgba(245,239,230,.66)" }}>
            Choose the silk, the colour, the border and the pallu. We show you the Mugdha sarees
            that match, ready to reserve.
          </p>

          <div style={{ marginBottom: "18px" }}>
            <div style={{ fontWeight: 600, fontSize: "12px", letterSpacing: ".12em", textTransform: "uppercase", color: "#A8884E", marginBottom: "9px" }}>
              Fabric
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
              {["Any", ...fabricOptions].map((f) => (
                <button key={f} type="button" onClick={() => setFabric(f)} style={chipStyle(fabric === f)}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "28px", flexWrap: "wrap", marginBottom: "18px" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: "12px", letterSpacing: ".12em", textTransform: "uppercase", color: "#A8884E", marginBottom: "9px" }}>
                Body colour
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", maxWidth: "280px" }}>
                {[{ name: "Any", swatch: "transparent" }, ...colorOptions].map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColor(c.name)}
                    title={c.name}
                    style={{ ...chipStyle(color === c.name), display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", padding: "6px 11px" }}
                  >
                    <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: c.swatch, boxShadow: "inset 0 0 0 1px rgba(255,255,255,.2)" }} />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "18px" }}>
            <div style={{ fontWeight: 600, fontSize: "12px", letterSpacing: ".12em", textTransform: "uppercase", color: "#A8884E", marginBottom: "9px" }}>
              Korvai border
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", maxWidth: "340px" }}>
              {[{ name: "Any", swatch: "transparent" }, ...colorOptions].map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setBorder(c.name)}
                  title={c.name}
                  style={{ ...chipStyle(border === c.name), display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", padding: "6px 11px" }}
                >
                  <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: c.swatch, boxShadow: "inset 0 0 0 1px rgba(255,255,255,.2)" }} />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "22px" }}>
            <div style={{ fontWeight: 600, fontSize: "12px", letterSpacing: ".12em", textTransform: "uppercase", color: "#A8884E", marginBottom: "9px" }}>
              Pallu motif
            </div>
            <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
              {MOTIF_OPTIONS.map((m) => (
                <button key={m.id} type="button" onClick={() => setMotif(m.id)} style={chipStyle(motif === m.id)}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={reset}
            style={{ border: 0, background: "none", cursor: "pointer", color: "#A8884E", fontSize: "13px", letterSpacing: ".04em", padding: "4px 1px", borderBottom: "1px solid rgba(168,136,78,.5)" }}
          >
            Reset filters
          </button>
        </div>

        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px", marginBottom: "16px" }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "#F5EFE6" }}>{heading}</div>
            <div style={{ fontSize: "12px", letterSpacing: ".16em", textTransform: "uppercase", color: "#A8884E" }}>
              Lamp-lit picks
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            {results.map((s) => (
              <div key={s.id} style={{ background: "#F5EFE6", boxShadow: "inset 0 0 0 1px rgba(168,136,78,.45)", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "block" }}>
                  <ZoomImage src={s.image} alt={s.name} />
                </div>
                <div style={{ padding: "11px 13px 13px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "16px", lineHeight: 1.15, color: "#2C1B20" }}>
                    {s.name}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "8px", marginTop: "auto" }}>
                    <span style={{ fontSize: "11.5px", color: "#8B7A73" }}>{s.fabric}</span>
                    <span style={{ fontSize: "13px", fontWeight: 300, color: "#2C1B20" }}>{formatINR(s.price)}</span>
                  </div>
                  <a
                    href={buildSareeWhatsAppLink(s, settings)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", textAlign: "center", background: "#57B947", color: "#fff", fontWeight: 500, fontSize: "12.5px", letterSpacing: ".02em", padding: "10px", borderRadius: "2px" }}
                  >
                    Reserve on WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
