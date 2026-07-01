"use client";

import { useId } from "react";

/** A fine repeating triangle strip, the temple-border rule used under the ticker and above the footer. */
export function TempleBorder({
  color = "#A8884E",
  height = 8,
}: {
  color?: string;
  height?: number;
}) {
  const patternId = useId();
  return (
    <svg width="100%" height={height} style={{ display: "block" }} aria-hidden="true">
      <defs>
        <pattern id={patternId} width={16} height={height} patternUnits="userSpaceOnUse">
          <polygon points={`0,0 16,0 8,${height}`} fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#${patternId})`} />
    </svg>
  );
}
