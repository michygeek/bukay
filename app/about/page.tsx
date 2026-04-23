import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import PageHero from "../components/PageHero";
import About from "../components/About";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "About Us | Bukay Global Services Limited",
  description:
    "Learn about Bukay Global Services Limited — our mission, vision, values, and over 20 years of excellence in engineering and construction across Nigeria.",
};

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <PageHero
        badge="About Us"
        title="Who We Are"
        description="An indigenous engineering construction company with over 20 years of excellence, building Nigeria's infrastructure with integrity and professionalism."
      />
      <About />
      <Footer />
    </main>
  );
}
