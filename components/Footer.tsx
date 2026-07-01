import { TempleBorder } from "./motifs/TempleBorder";

const FOOTER_COLUMNS: { title: string; items: string[] }[] = [
  { title: "House", items: ["Our story", "Sashi Vangapalli", "The studio", "Journal"] },
  { title: "Shop", items: ["Sarees", "Fabrics", "Bridal", "Design Studio", "New drops"] },
  { title: "Connect", items: ["WhatsApp", "Instagram", "Stores", "Appointments"] },
];

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div
        style={{
          fontWeight: 600,
          fontSize: "13px",
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: "#FFB100",
          marginBottom: "12px",
        }}
      >
        {title}
      </div>
      {items.map((item) => (
        <div key={item} style={{ color: "rgba(255,248,240,.72)", fontSize: "14.5px", padding: "5px 0", cursor: "pointer" }}>
          {item}
        </div>
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer style={{ background: "#1A0E1B", color: "#FFF8F0", padding: "0 0 30px" }}>
      <div style={{ lineHeight: 0, marginBottom: "40px" }}>
        <TempleBorder color="#C9A227" height={12} />
      </div>
      <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 26px" }}>
        <div
          className="grid grid-cols-[1.4fr_1fr_1fr_1fr] max-md:grid-cols-1"
          style={{ gap: "30px", alignItems: "flex-start" }}
        >
          <div>
            <div style={{ fontFamily: "var(--font-label)", fontWeight: 700, fontSize: "30px", color: "#FFF8F0" }}>
              MUGDHA
            </div>
            <div style={{ fontFamily: "var(--font-devanagari)", color: "#C9A227", marginTop: "4px" }}>
              उत्सव · the saree house
            </div>
            <p style={{ color: "rgba(255,248,240,.6)", maxWidth: "34ch", marginTop: "12px", fontSize: "14px" }}>
              Mugdha Art Studio. Creative Director Sashi Vangapalli. Silk Mark certified, pure zari,
              woven in house.
            </p>
          </div>
          {FOOTER_COLUMNS.map((col) => (
            <FooterColumn key={col.title} title={col.title} items={col.items} />
          ))}
        </div>
        <div style={{ height: "1px", background: "rgba(168,136,78,.4)", marginTop: "42px" }} />
        <div style={{ marginTop: "18px", color: "rgba(255,248,240,.45)", fontSize: "13px" }}>
          © 2026 Mugdha Art Studio. Order on WhatsApp · Made for the utsav.
        </div>
      </div>
    </footer>
  );
}
