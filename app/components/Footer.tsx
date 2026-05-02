import Image from "next/image";
import { Phone, Mail, MapPin, Globe, MessageCircle, Share2, AtSign, type LucideIcon } from "lucide-react";

const socialIcons: LucideIcon[] = [Globe, MessageCircle, Share2, AtSign];

const services = [
  "Roads & Highway Construction",
  "Telecom Cell Sites Construction",
  "Building Construction",
  "Electrical Engineering Services",
  "Plumbing & Water Engineering",
  "Laminate Flooring Systems",
];

const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/#services" },
  { label: "Projects", href: "/#projects" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Our Team", href: "/team" },
  { label: "Contact Us", href: "/contact" },
  { label: "Book Appointment", href: "/book" },
];

const tools = [
  { label: "3D House Designer", href: "/design" },
  { label: "ROI & Property Estimator", href: "/roi" },
  { label: "Cost Calculator", href: "/#calculator" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0a1e36] text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/bukaylogo.png"
                alt="Bukay Global Services Limited"
                width={100}
                height={100}
                className="object-contain"
              />
              <div>
                <p className="font-black text-sm leading-tight">BUKAY GLOBAL</p>
                <p className="text-[#e8820c] text-xs font-medium">SERVICES LIMITED</p>
              </div>
            </div>
            <p className="text-white/60 text-xs leading-relaxed mb-5">
              An indigenous engineering construction company providing infrastructure development services in Civil, Highway, Mechanical, Electrical and Telecommunications engineering.
            </p>
            <div className="flex gap-3">
              {socialIcons.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 bg-white/10 hover:bg-[#e8820c] rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>

            {/* Certifications */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="text-xs text-white/40 mb-2">Certifications</p>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10 inline-block">
                <p className="text-[#e8820c] text-xs font-bold">NEMSA Certified</p>
                <p className="text-white/50 text-xs">Category A — Cert No. A01175</p>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-black text-sm mb-4 text-white">Our Services</h4>
            <ul className="space-y-2">
              {services.map((svc) => (
                <li key={svc}>
                  <a
                    href="/#services"
                    className="text-white/60 hover:text-[#e8820c] text-xs transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#e8820c] shrink-0" />
                    {svc}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-black text-sm mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-white/60 hover:text-[#e8820c] text-xs transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#e8820c] shrink-0" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Tools */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <h4 className="font-black text-sm mb-3 text-white">Tools</h4>
              <ul className="space-y-2">
                {tools.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-white/60 hover:text-[#e8820c] text-xs transition-colors flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#e8820c]/60 shrink-0" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-black text-sm mb-4 text-white">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={14} className="text-[#e8820c] mt-0.5 shrink-0" />
                <p className="text-white/60 text-xs">
                  4 Thambo Mbeki Close, off Danjuma Street, Asokoro Abuja<br />
                  Operations Nationwide
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={14} className="text-[#e8820c] shrink-0" />
                <p className="text-white/60 text-xs">+2348108792617</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={14} className="text-[#e8820c] shrink-0" />
                <p className="text-white/60 text-xs">bukay.ng@gmail.com</p>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-white/10">
              <p className="text-xs text-white/40 mb-2">Business Hours</p>
              <p className="text-white/60 text-xs">Monday – Friday: 8:00am – 6:00pm</p>
              <p className="text-white/60 text-xs">Saturday: 9:00am – 2:00pm</p>
            </div>

            <a
              href="/book"
              className="mt-5 flex items-center justify-center gap-2 bg-[#e8820c] hover:bg-[#d4730a] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
            >
              Book an Appointment
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Bukay Global Services Limited. All rights reserved.</p>
          <p>Building • Construction • Engineering</p>
        </div>
      </div>
    </footer>
  );
}
