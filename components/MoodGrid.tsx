import Link from "next/link";
import { SectionLabel } from "./SectionLabel";
import { ZoomImage } from "./ZoomImage";

export interface MoodTile {
  name: string;
  image: string;
  sareeCount: number;
  href: string;
}

/** "Read by colour": six colour edits, each a different real saree. */
export function MoodGrid({ tiles }: { tiles: MoodTile[] }) {
  return (
    <section style={{ background: "#ECE2D2", padding: "96px 0 104px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 40px" }}>
        <div style={{ marginBottom: "52px", maxWidth: "60ch" }}>
          <div style={{ marginBottom: "16px" }}>
            <SectionLabel>Shop by color</SectionLabel>
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
            Read by colour
          </h2>
          <p style={{ margin: "16px 0 0", maxWidth: "42ch", fontSize: "15px", lineHeight: 1.75, color: "#7A6A66" }}>
            In Indian textile, colour leads. Six edits, each a different silk.
          </p>
        </div>
        <div className="mug-g3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "48px 36px" }}>
          {tiles.map((t) => (
            <Link
              key={t.name}
              href={t.href}
              prefetch={false}
              className="mug-zoom"
              style={{ border: 0, background: "none", cursor: "pointer", padding: 0, textAlign: "center", display: "block", textDecoration: "none" }}
            >
              <ZoomImage src={t.image} alt={`${t.name} silk`} />
              <span style={{ display: "block", width: "30px", height: "1px", background: "#A8884E", margin: "18px auto 12px" }} />
              <span style={{ display: "block", fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "23px", color: "#2C1B20" }}>
                {t.name}
              </span>
              <span style={{ display: "block", fontSize: "12.5px", letterSpacing: ".04em", color: "#8B7A73", marginTop: "3px" }}>
                {t.sareeCount} sarees
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
