import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import PageHero from "../components/PageHero";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Contact Us | Bukay Global Services Limited",
  description:
    "Get in touch with Bukay Global Services Limited. Ready to build something great? Reach out to discuss your project and get a competitive quote.",
};

export default function ContactPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <PageHero
        badge="Get In Touch"
        title="Start Your Project"
        description="Ready to build something great? Reach out to us — we'd love to discuss your project needs and provide a competitive quote."
      />
      <Contact />
      <Footer />
    </main>
  );
}
