import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import PageHero from "../components/PageHero";
import ROIEstimator from "../components/ROIEstimator";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "ROI & Property Value Estimator | Bukay Global Services Limited",
  description:
    "Estimate your return on investment, projected property value, rental yield, and 5-year appreciation before you build. Free tool for investors and homeowners.",
};

export default function ROIPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <PageHero
        badge="Investment Analysis"
        title="ROI & Property Value Estimator"
        description="Understand your potential returns before you build. Estimate market value, capital gains, rental yield, and a 5-year projection in seconds."
      />
      <ROIEstimator />
      <Footer />
    </main>
  );
}
