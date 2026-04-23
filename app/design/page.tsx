import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import PageHero from "../components/PageHero";
import HouseDesigner from "../components/HouseDesigner";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "3D House Designer | Bukay Global Services Limited",
  description:
    "Visualise your dream home in 3D. Choose a house type, customise wall colours, roof style and window glass, then rotate and explore your design from every angle.",
};

export default function DesignPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <PageHero
        badge="3D Visualiser"
        title="House Designer"
        description="Choose a house type, customise colours and roof style, then rotate your design in real time. Drag to orbit · scroll to zoom."
      />
      <HouseDesigner />
      <Footer />
    </main>
  );
}
