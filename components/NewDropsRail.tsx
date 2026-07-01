import Link from "next/link";
import { SectionLabel } from "./SectionLabel";
import { ZoomImage } from "./ZoomImage";

export interface DropTile {
  name: string;
  fabric: string;
  price: string;
  image: string;
  href: string;
}

/** "Newly on the loom": the freshest real pieces from the catalogue. */
export function NewDropsRail({ tiles, allSareesHref }: { tiles: DropTile[]; allSareesHref: string }) {
  return (
    <section style={{ background: "#F5EFE6", padding: "24px 0 104px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 40px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "52px",
          }}
        >
          <div>
            <div style={{ marginBottom: "16px" }}>
              <SectionLabel>Newly on the loom</SectionLabel>
            </div>
            <h2
              style={{
                margin: 0,
                fontFamily: "var(--font-serif)",
                fontWeight: 400,
                fontSize: "clamp(34px,4.8vw,62px)",
                lineHeight: 1.02,
                color: "#2C1B20",
              }}
            >
              Newly on the loom
            </h2>
          </div>
          <Link
            href={allSareesHref}
            prefetch={false}
            style={{
              border: 0,
              background: "none",
              cursor: "pointer",
              color: "#2C1B20",
              fontSize: "13.5px",
              letterSpacing: ".05em",
              padding: "6px 1px",
              borderBottom: "1px solid #A8884E",
              marginBottom: "10px",
              textDecoration: "none",
            }}
          >
            View all
          </Link>
        </div>
        <div className="mug-g3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "48px 36px" }}>
          {tiles.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              prefetch={false}
              className="mug-zoom"
              style={{ border: 0, background: "none", cursor: "pointer", padding: 0, textAlign: "left", display: "block", textDecoration: "none" }}
            >
              <ZoomImage src={t.image} alt={t.name} />
              <div style={{ marginTop: "16px" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "22px", lineHeight: 1.15, color: "#2C1B20" }}>
                  {t.name}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "10px", marginTop: "5px" }}>
                  <span style={{ fontSize: "13px", color: "#8B7A73" }}>{t.fabric}</span>
                  <span style={{ fontSize: "14px", fontWeight: 300, color: "#2C1B20" }}>{t.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
