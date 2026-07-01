import Link from "next/link";
import { Gopuram } from "./motifs/Gopuram";
import { Kolam } from "./motifs/Kolam";

/** "The bride wears Mugdha": one reverent editorial image, not a grid, matching the reference exactly. */
export function BridalSection({ image }: { image: string }) {
  return (
    <section
      style={{
        position: "relative",
        background: "radial-gradient(120% 120% at 50% 0%, #20131A 0%, #160A0F 72%, #100709 100%)",
        padding: "196px 0 104px",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "center", pointerEvents: "none", zIndex: 1, opacity: 0.5 }}>
        <Gopuram color="#C9A227" />
      </div>
      <div style={{ position: "absolute", top: "64px", left: 0, right: 0, display: "flex", justifyContent: "center", pointerEvents: "none", zIndex: 1 }}>
        <Kolam stroke="#C9A227" size={72} duration={3.4} strokeWidth={1} />
      </div>
      <div
        className="mug-col2"
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 40px",
          display: "grid",
          gridTemplateColumns: ".95fr 1.05fr",
          gap: "60px",
          alignItems: "center",
        }}
      >
        <div className="mug-zoom" style={{ position: "relative", overflow: "hidden", aspectRatio: "4/5", boxShadow: "inset 0 0 0 1px rgba(201,162,39,.45)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- editorial crop, not a fixed-dimension asset */}
          <img
            src={image}
            alt="Mugdha bridal silk in lamplight"
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(1.28) brightness(1.16)" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(74% 74% at 50% 40%, rgba(16,7,9,0), rgba(16,7,9,.46) 92%)" }} />
          <div
            className="mug-flicker"
            style={{ position: "absolute", inset: 0, background: "radial-gradient(44% 46% at 50% 42%, rgba(233,199,102,.22), transparent 70%)", mixBlendMode: "screen" }}
          />
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-devanagari)", fontSize: "16px", letterSpacing: ".06em", color: "#C9A227", marginBottom: "16px" }}>
            मुहूर्तम्
          </div>
          <h2
            style={{
              margin: 0,
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              fontSize: "clamp(34px,4.8vw,64px)",
              lineHeight: 1.04,
              color: "#F4EFE3",
            }}
          >
            The bride wears Mugdha
          </h2>
          <p style={{ margin: "24px 0 0", maxWidth: "42ch", fontSize: "16px", lineHeight: 1.8, color: "rgba(244,239,227,.72)" }}>
            Kanchipuram heirlooms, a quiet appointment, and a stylist who knows muhurtham timing.
            Begin the trousseau.
          </p>
          <div style={{ marginTop: "34px", display: "flex", alignItems: "center", gap: "28px", flexWrap: "wrap" }}>
            <Link
              href="/bridal"
              prefetch={false}
              style={{
                border: "1px solid #C9A227",
                background: "rgba(201,162,39,.14)",
                color: "#F4EFE3",
                cursor: "pointer",
                fontWeight: 500,
                letterSpacing: ".05em",
                fontSize: "14px",
                padding: "15px 32px",
                borderRadius: "2px",
                textDecoration: "none",
              }}
            >
              Enter the bridal world
            </Link>
            <Link
              href="/ar"
              prefetch={false}
              style={{
                border: 0,
                background: "none",
                cursor: "pointer",
                color: "#E9C766",
                fontSize: "14.5px",
                letterSpacing: ".05em",
                padding: "6px 1px",
                borderBottom: "1px solid #C9A227",
                textDecoration: "none",
              }}
            >
              Try it on you
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
