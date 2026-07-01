"use client";

import dynamic from "next/dynamic";
import config from "../../../sanity.config";

// Sanity Studio is a browser-only React app: it must never be attempted
// server-side, which is what caused a build-time crash when this route
// tried to statically prerender it. ssr: false guarantees it only ever
// mounts client-side, after hydration.
const NextStudio = dynamic(() => import("next-sanity/studio").then((m) => m.NextStudio), {
  ssr: false,
});

export default function StudioClient() {
  return <NextStudio config={config} />;
}
