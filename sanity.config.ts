/**
 * Embedded Sanity Studio config, mounted at /studio by
 * app/studio/[[...tool]]/page.tsx via next-sanity/studio.
 */

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { projectId, dataset, apiVersion } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

export default defineConfig({
  name: "mugdha",
  title: "Mugdha",
  projectId,
  dataset,
  basePath: "/studio",
  schema,
  plugins: [
    structureTool({ structure }),
    // The Vision plugin lets editors and developers test GROQ queries
    // straight against this dataset from inside the Studio.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
