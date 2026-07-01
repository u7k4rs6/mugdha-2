import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { WeaveGrid, type WeaveTile } from "@/components/WeaveGrid";
import { MoodGrid, type MoodTile } from "@/components/MoodGrid";
import { Finder } from "@/components/Finder";
import { NewDropsRail, type DropTile } from "@/components/NewDropsRail";
import { CraftPanel } from "@/components/CraftPanel";
import { BridalSection } from "@/components/BridalSection";
import { StoreLocator } from "@/components/StoreLocator";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { TempleBorder } from "@/components/motifs/TempleBorder";
import { Kolam } from "@/components/motifs/Kolam";
import {
  getColorFacets,
  getFabrics,
  getHeritageWeaves,
  getNewDrops,
  getMoodStories,
  getSareesByColor,
  getSareesByFabric,
  getSarees,
  getSiteSettings,
  getStores,
  getWeaveGridFabrics,
} from "@/lib/data";
import { BRIDAL_IMAGE } from "@/lib/brand-images";
import { formatINR } from "@/lib/format";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default async function Home() {
  const [sarees, fabrics, moodStories, stores, siteSettings] = await Promise.all([
    getSarees(),
    getFabrics(),
    getMoodStories(),
    getStores(),
    getSiteSettings(),
  ]);

  const weaveTiles: WeaveTile[] = getWeaveGridFabrics(fabrics, sarees).map((f) => ({
    name: f.name,
    script: f.script,
    image: f.heroImage,
    sareeCount: getSareesByFabric(sarees, f.name).length,
    href: `/sarees?fabric=${slugify(f.name)}`,
  }));

  const moodTiles: MoodTile[] = moodStories.map((m) => ({
    name: m.colorName,
    image: m.heroImage,
    sareeCount: getSareesByColor(sarees, m.colorName).length,
    href: `/sarees?color=${slugify(m.colorName)}`,
  }));

  const dropTiles: DropTile[] = getNewDrops(sarees).map((s) => ({
    name: s.name,
    fabric: s.fabric,
    price: formatINR(s.price),
    image: s.image,
    href: `/sarees/${s.slug}`,
  }));

  const fabricOptions = fabrics
    .filter((f) => !f.onLoomDays) // the real catalogue weaves only, not the three heritage weaves
    .map((f) => f.name);

  const colorFacets = getColorFacets(sarees);

  return (
    <div className="mug-root">
      <Header settings={siteSettings} />
      <main>
        <Hero />

        <div style={{ background: "#F5EFE6", padding: "46px 0 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "18px" }}>
          <div style={{ opacity: 0.8 }}>
            <Kolam stroke="#A8884E" size={72} duration={3.4} strokeWidth={1} />
          </div>
          <div style={{ width: "200px", lineHeight: 0, opacity: 0.7 }}>
            <TempleBorder color="#A8884E" height={7} />
          </div>
        </div>

        <WeaveGrid tiles={weaveTiles} />
        <MoodGrid tiles={moodTiles} />
        <Finder
          sarees={sarees}
          fabricOptions={fabricOptions}
          colorOptions={colorFacets.map((c) => ({ name: c.name, swatch: c.swatch }))}
          settings={siteSettings}
        />
        <NewDropsRail tiles={dropTiles} allSareesHref="/sarees" />
        <CraftPanel weaves={getHeritageWeaves(fabrics)} />
        <BridalSection image={BRIDAL_IMAGE} />
        <StoreLocator stores={stores} variant="teaser" />
      </main>
      <Footer />
      <MobileNav settings={siteSettings} />
    </div>
  );
}
