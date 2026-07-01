import Link from "next/link";
import { SectionLabel } from "./SectionLabel";
import { ZoomImage } from "./ZoomImage";

export interface WeaveTile {
  name: string;
  script?: string;
  image: string;
  sareeCount: number;
  href: string;
}

/** "The house weaves": the top real fabric categories from the catalogue. */
export function WeaveGrid({ tiles }: { tiles: WeaveTile[] }) {
  return (
    <section style={{ background: "#F5EFE6", padding: "30px 0 104px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 40px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "24px",
            marginBottom: "56px",
          }}
        >
          <div style={{ maxWidth: "62%" }}>
            <div style={{ marginBottom: "18px" }}>
              <SectionLabel>The house weaves</SectionLabel>
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
              The house weaves
            </h2>
          </div>
          <p style={{ maxWidth: "32ch", fontSize: "15px", lineHeight: 1.75, color: "#7A6A66", margin: "0 0 8px" }}>
            Sarees are finished drapes, ready to wear. Fabrics are the cloth, by the metre.
          </p>
        </div>
        <div className="mug-g3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "48px 36px" }}>
          {tiles.map((t) => (
            <Link
              key={t.name}
              href={t.href}
              prefetch={false}
              className="mug-zoom"
              style={{ border: 0, background: "none", cursor: "pointer", padding: 0, textAlign: "left", display: "block", textDecoration: "none" }}
            >
              <ZoomImage src={t.image} alt={`${t.name} silk`} />
              <span style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: "16px" }}>
                <span style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "23px", color: "#2C1B20" }}>
                  {t.name}
                </span>
                {t.script ? (
                  <span style={{ fontFamily: "var(--font-devanagari)", fontSize: "13px", color: "#A8884E" }}>
                    {t.script}
                  </span>
                ) : null}
              </span>
              <span style={{ display: "block", fontSize: "12.5px", letterSpacing: ".03em", color: "#8B7A73", marginTop: "3px" }}>
                {t.sareeCount} sarees
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
