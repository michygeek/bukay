import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import PageHero from "../components/PageHero";
import Gallery from "../components/Gallery";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Media Gallery | Bukay Global Services Limited",
  description:
    "Browse photos from Bukay Global Services Limited project sites — roads, buildings, telecom sites, and electrical installations across Nigeria.",
};

export default function GalleryPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <PageHero
        badge="Our Work"
        title="Media Gallery"
        description="A visual showcase of our completed and ongoing projects across Nigeria — roads, buildings, telecom sites, and electrical installations."
      />
      <Gallery />
      <Footer />
    </main>
  );
}
