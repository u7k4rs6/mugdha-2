export function SectionLabel({
  children,
  color = "#A8884E",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      style={{
        display: "inline-block",
        fontWeight: 500,
        fontSize: "11px",
        letterSpacing: ".26em",
        textTransform: "uppercase",
        color,
      }}
    >
      {children}
    </span>
  );
}
