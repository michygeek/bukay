import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import PageHero from "../components/PageHero";
import Team from "../components/Team";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Our Team | Bukay Global Services Limited",
  description:
    "Meet the expert team behind Bukay Global Services Limited — highly qualified engineers, architects, and professionals driving Nigeria's infrastructure forward.",
};

export default function TeamPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <PageHero
        badge="Our People"
        title="Meet Our Expert Team"
        description="Our people are our best asset — a team of extraordinary professionals combining multinational technical expertise with deep local knowledge."
      />
      <Team />
      <Footer />
    </main>
  );
}
