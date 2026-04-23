import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutTeaser from "./components/AboutTeaser";
import Stats from "./components/Stats";
import Services from "./components/Services";
import Projects from "./components/Projects";
import WhyChooseUs from "./components/WhyChooseUs";
import Clients from "./components/Clients";
import CostCalculator from "./components/CostCalculator";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <AboutTeaser />
      <Stats />
      <Services />
      <Projects />
      <WhyChooseUs />
      <Clients />
      <CostCalculator />
      <Footer />
    </main>
  );
}
