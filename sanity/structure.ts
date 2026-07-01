import type { StructureResolver } from "sanity/structure";

// siteSettings is a singleton, enforced here (not via a schema option) by
// locking it to a fixed document id and excluding it from the generic
// document type list below.
const SINGLETONS = ["siteSettings"];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !SINGLETONS.includes(listItem.getId() as string),
      ),
    ]);
