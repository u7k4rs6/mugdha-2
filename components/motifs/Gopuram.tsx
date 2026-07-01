/** A centred gopuram: a tiered, tapering temple tower drawn as one fine line, crowned with a kalasham finial. */
export function Gopuram({ color }: { color: string }) {
  const W = 240;
  const H = 150;
  const cx = W / 2;
  const tiers = 5;
  const bodyTop = 42;
  const tierHeight = (H - bodyTop) / tiers;
  const halfWidthAt = (i: number) => 104 - (104 - 30) * (i / tiers);

  let d = `M ${cx - halfWidthAt(0)} ${H}`;
  for (let i = 0; i < tiers; i++) {
    const yTop = H - (i + 1) * tierHeight;
    d += ` L ${cx - halfWidthAt(i)} ${yTop} L ${cx - halfWidthAt(i + 1)} ${yTop}`;
  }
  d += ` L ${cx - halfWidthAt(tiers)} ${bodyTop} L ${cx + halfWidthAt(tiers)} ${bodyTop}`;
  for (let i = tiers - 1; i >= 0; i--) {
    const yTop = H - (i + 1) * tierHeight;
    d += ` L ${cx + halfWidthAt(i + 1)} ${yTop} L ${cx + halfWidthAt(i)} ${yTop}`;
  }
  d += ` L ${cx + halfWidthAt(0)} ${H} Z`;

  const tierLines = [];
  for (let i = 1; i < tiers; i++) {
    const y = H - i * tierHeight;
    tierLines.push(
      <line
        key={"tier" + i}
        x1={cx - halfWidthAt(i)}
        y1={y}
        x2={cx + halfWidthAt(i)}
        y2={y}
        stroke={color}
        strokeWidth={0.7}
        opacity={0.5}
      />,
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ display: "block" }} aria-hidden="true">
      <path d={d} fill="none" stroke={color} strokeWidth={1.1} opacity={0.85} strokeLinejoin="round" />
      {tierLines}
      <line x1={cx} y1={bodyTop} x2={cx} y2={24} stroke={color} strokeWidth={1.1} />
      <path d={`M ${cx - 7} 24 Q ${cx} 14 ${cx + 7} 24`} fill="none" stroke={color} strokeWidth={1.1} />
      <line x1={cx} y1={14} x2={cx} y2={4} stroke={color} strokeWidth={1.1} />
      <circle cx={cx} cy={3} r={2.4} fill={color} />
    </svg>
  );
}
