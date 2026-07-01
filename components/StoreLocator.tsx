import Link from "next/link";
import { SectionLabel } from "./SectionLabel";
import type { Store } from "@/lib/types";

/**
 * The homepage only ever shows the teaser (heading, city list, one CTA to
 * /stores), the reference's actual store locator with a map lives on its
 * own page. The "full" variant here is the visual shell for that future
 * /stores page: a static placeholder where the map goes (Step 6 replaces
 * it with a real Google Maps or Mapbox embed) plus the store cards. Not
 * used on the homepage yet.
 */
export function StoreLocator({
  stores,
  variant = "teaser",
}: {
  stores: Store[];
  variant?: "teaser" | "full";
}) {
  if (variant === "full") {
    return (
      <section style={{ padding: "34px 0" }}>
        <div
          className="mug-col2"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}
        >
          <div
            style={{
              position: "relative",
              background: "#ECE2D2",
              aspectRatio: "1/1",
              overflow: "hidden",
              boxShadow: "inset 0 0 0 1px rgba(168,136,78,.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#8B7A73",
              fontSize: "13px",
              letterSpacing: ".04em",
              textAlign: "center",
              padding: "24px",
            }}
          >
            Map placeholder. A real Google Maps or Mapbox embed, styled to match the house, lands
            in Step 6.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {stores.map((s) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "18px 20px",
                  boxShadow: "0 8px 20px rgba(26,14,27,.06)",
                  borderLeft: "3px solid #A8884E",
                }}
              >
                <div>
                  <div style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: "20px" }}>
                    {s.city}
                  </div>
                  <div style={{ color: "#8a4a6f", fontSize: "14px" }}>{s.storeCount} stores · open daily</div>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(s.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", background: "#57B947", color: "#fff", fontWeight: 500, fontSize: "13.5px", padding: "10px 16px", borderRadius: "2px" }}
                >
                  Directions
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ background: "#1E1016", color: "#F5EFE6", padding: "104px 0" }}>
      <div
        className="mug-col2"
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 40px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "64px",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ marginBottom: "18px" }}>
            <SectionLabel color="#C9A227">Visit the house</SectionLabel>
          </div>
          <h2 style={{ margin: "0 0 16px", fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "clamp(32px,4.4vw,56px)", lineHeight: 1.05, color: "#F5EFE6" }}>
            Twenty five stores, and counting
          </h2>
          <p style={{ margin: "0 0 30px", maxWidth: "40ch", fontSize: "15.5px", lineHeight: 1.8, color: "rgba(245,239,230,.62)" }}>
            Across Hyderabad, Bengaluru, Chennai and Andhra Pradesh. Walk in for a drape, a chai
            and a Silk Mark certificate.
          </p>
          <Link
            href="/stores"
            prefetch={false}
            style={{ display: "inline-block", border: "1px solid rgba(168,136,78,.6)", background: "none", color: "#F5EFE6", cursor: "pointer", fontSize: "14px", letterSpacing: ".05em", padding: "14px 30px", borderRadius: "2px", textDecoration: "none" }}
          >
            Find a store
          </Link>
        </div>
        <div>
          {stores.map((s) => (
            <div key={s.id} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "18px 0", borderBottom: "1px solid rgba(168,136,78,.25)" }}>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "#F5EFE6" }}>{s.city}</span>
              <span style={{ fontSize: "12px", letterSpacing: ".06em", textTransform: "uppercase", color: "#A8884E" }}>
                {s.storeCount} stores
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
