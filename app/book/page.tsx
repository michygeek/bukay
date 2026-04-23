import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import PageHero from "../components/PageHero";
import AppointmentBooking from "../components/AppointmentBooking";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Book an Appointment | Bukay Global Services Limited",
  description:
    "Schedule a consultation, site survey, design review, or project meeting with the Bukay Global Services team. Available Monday to Friday, 9am–5pm.",
};

export default function BookPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <PageHero
        badge="Schedule a Meeting"
        title="Book an Appointment"
        description="Choose a service, pick a date and time, and our expert team will confirm your appointment within 24 hours."
      />
      <AppointmentBooking />
      <Footer />
    </main>
  );
}
