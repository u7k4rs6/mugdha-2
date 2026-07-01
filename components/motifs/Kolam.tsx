"use client";

import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/** A fine gold kolam, eight petals that self-draw once, dots ringing the outside. */
export function Kolam({
  stroke,
  size = 120,
  duration = 2.2,
  strokeWidth = 1.6,
}: {
  stroke: string;
  size?: number;
  duration?: number;
  strokeWidth?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const S = size;
  const c = S / 2;
  const petals = 8;
  const dashLength = S * 2.4;

  const petalCircles = Array.from({ length: petals }).map((_, i) => {
    const angle = (i / petals) * Math.PI * 2;
    const x = c + Math.cos(angle) * c * 0.42;
    const y = c + Math.sin(angle) * c * 0.42;
    return (
      <circle
        key={"petal" + i}
        cx={x}
        cy={y}
        r={c * 0.36}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        style={
          {
            strokeDasharray: dashLength,
            strokeDashoffset: 0,
            "--len": dashLength,
            animation: reduced
              ? "none"
              : `mug-draw ${duration}s ease ${i * (duration * 0.07)}s both`,
          } as React.CSSProperties
        }
      />
    );
  });

  const dots = Array.from({ length: petals }).map((_, i) => {
    const angle = (i / petals) * Math.PI * 2;
    return (
      <circle
        key={"dot" + i}
        cx={c + Math.cos(angle) * c * 0.8}
        cy={c + Math.sin(angle) * c * 0.8}
        r={2.2}
        fill={stroke}
      />
    );
  });

  return (
    <svg viewBox={`0 0 ${S} ${S}`} width={S} height={S} style={{ display: "block" }} aria-hidden="true">
      {petalCircles}
      <circle cx={c} cy={c} r={c * 0.15} fill="none" stroke={stroke} strokeWidth={strokeWidth} />
      {dots}
    </svg>
  );
}
