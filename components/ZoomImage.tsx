/** The 4:5 product-tile photo with the gold hairline frame and the hover "View" reveal. Wrap in an element carrying the mug-zoom class. */
export function ZoomImage({ src, alt }: { src: string; alt: string }) {
  return (
    <span
      style={{
        position: "relative",
        display: "block",
        overflow: "hidden",
        aspectRatio: "4/5",
        boxShadow: "inset 0 0 0 1px rgba(168,136,78,.4)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- fixed-aspect card art in a grid, plain img keeps the zoom-on-hover CSS simple */}
      <img src={src} alt={alt} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <span
        className="mug-view"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(30,16,22,.22)",
        }}
      >
        <span
          style={{
            color: "#F5EFE6",
            fontSize: "12px",
            letterSpacing: ".18em",
            textTransform: "uppercase",
            borderBottom: "1px solid #F5EFE6",
            paddingBottom: "3px",
          }}
        >
          View
        </span>
      </span>
    </span>
  );
}
