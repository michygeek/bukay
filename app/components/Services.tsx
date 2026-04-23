"use client";

import { Road, Radio, Building2, Zap, Droplets, LayoutGrid, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Road,
    number: "01",
    title: "Roads & Highway Construction",
    subtitle: "Bridges, Tunnels & Drainage Systems",
    description:
      "We have special capabilities for handling construction of highways and estate roads. We construct flexible pavements (asphaltic concrete surfaced roads with tunnels and drainage systems), rigid pavements including car parks, airport runways and bridges, and surfaces with interlocking paving blocks for flood-prone areas.",
    image: "/images/Screenshot 2026-04-22 212536.png",
    features: [
      "Flexible & Rigid Pavements",
      "Bridges & Tunnels",
      "Drainage Systems",
      "Interlocking Paving Blocks",
      "Airport Runways & Aprons",
    ],
    color: "#0f2d54",
  },
  {
    icon: Radio,
    number: "02",
    title: "Telecom Cell Sites Construction",
    subtitle: "Fiber Implementation Works",
    description:
      "Within our civil engineering department, we have teams of competent personnel specializing in Fibre Optic Works including cable laying, pressure tests, fiber blowing, splicing, termination, testing, equipment installation and maintenance. Major clients include MTN Nigeria, Globacon, Aitel and ZTE.",
    image: "/images/Screenshot 2026-04-22 203104.png",
    features: [
      "Telecom Site Construction (Civil, Electrical & Mechanical)",
      "Quality Assurance Services",
      "Technical Site Survey (TSS)",
      "Tower Supply & Erection",
      "Microwave Installation & Testing",
      "Fibre Optic Works",
    ],
    color: "#1b4880",
  },
  {
    icon: Building2,
    number: "03",
    title: "Building Construction",
    subtitle: "Mechanical & Electrical Services",
    description:
      "We undertake construction of Residential, Commercial and Industrial buildings in reinforced concrete and steel structures. We advise clients on optimal material use and cost-effectiveness, ensure strict compliance with Design Drawings, specifications and code of practice, and undertake design-and-build projects.",
    image: "/images/Screenshot 2026-04-22 212914.png",
    features: [
      "Residential & Commercial Buildings",
      "Industrial Structures",
      "Reinforced Concrete & Steel",
      "Design & Build Projects",
      "Mechanical & Electrical Works",
    ],
    color: "#0f2d54",
  },
  {
    icon: Zap,
    number: "04",
    title: "Electrical Engineering",
    subtitle: "Services & Products",
    description:
      "We recognize the dearth of electrical energy in Nigeria and intend to bridge the gap. Our knowledge of local and international conditions, techniques and operations enables us to provide quality services handling electrical engineering projects across the full scope — from urban electrification to distribution transformers.",
    image: "/images/Screenshot 2026-04-22 213240.png",
    features: [
      "Urban Electrification",
      "House & Office Wiring",
      "Power Distributions",
      "Street Lighting & Solar Solutions",
      "Distribution Transformers (up to 36 Kva)",
      "Generator Control System Design",
    ],
    color: "#1b4880",
  },
  {
    icon: Droplets,
    number: "05",
    title: "Plumbing & Water Engineering",
    subtitle: "Sewage & Fire-Fighting Systems",
    description:
      "We provide excellent plumbing solutions for every type of project. Our plumbing engineers are involved from early project stages. We design and install various water systems, deal with sewage and septic tank issues, and our expertise extends to firefighting equipment with both automatic and manual solutions.",
    image: "/images/Screenshot 2026-04-22 210032.png",
    features: [
      "Sanitary Fixtures & Water Pipe Work",
      "Water Treatment Plants & Boreholes",
      "Irrigation Systems",
      "Sewage Treatment Plants",
      "Firefighting: Pipe Work, Sprinkler, Fire Hose",
      "Utility Water Supply",
    ],
    color: "#0f2d54",
  },
  {
    icon: LayoutGrid,
    number: "06",
    title: "Laminate Flooring Systems",
    subtitle: "Kronotex USA — Swiss Krono Group",
    description:
      "We market, sell, install and maintain Kronotex USA, a division of Swiss Krono Group Laminate floors. Our laminate floors are made from wood but better than hardwood — healthier for your home and the planet. Four layers fused together in a single press operation at over 300°F using direct-pressure laminate (DPL) construction.",
    image: "/images/Screenshot 2026-04-22 211156.png",
    features: [
      "Valley Forge Collection",
      "Berkeley Lane Collection",
      "Stone Harbor Collection",
      "Middlebrooke Collection",
      "Sanderlin Mountain Collection",
      "Dalton Ridge & Liberty Collections",
    ],
    color: "#1b4880",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-[#e8820c]/10 text-[#e8820c] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
            What We Do
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0f2d54] mb-4">
            Our Services
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed">
            As a full-time functional Civil Engineering Construction team, we provide comprehensive services across multiple disciplines — adopting strict international best practices and using the very best materials in all our construction activities.
          </p>
          <div className="w-16 h-1 bg-[#e8820c] mx-auto rounded-full mt-4" />
        </div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.number}
                className="service-card bg-white rounded-2xl overflow-hidden border border-gray-100"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={svc.image}
                    alt={svc.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div
                    className="absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: svc.color }}
                  >
                    <Icon size={18} className="text-white" />
                  </div>
                  <span className="absolute bottom-3 right-4 text-white/40 font-black text-4xl leading-none">
                    {svc.number}
                  </span>
                </div>

                {/* Body */}
                <div className="p-6">
                  <h3 className="text-lg font-black text-[#0f2d54] leading-tight mb-1">
                    {svc.title}
                  </h3>
                  <p className="text-[#e8820c] text-xs font-semibold uppercase tracking-wide mb-3">
                    {svc.subtitle}
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                    {svc.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-1.5 mb-4">
                    {svc.features.slice(0, 4).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#e8820c] mt-1.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1.5 text-[#0f2d54] hover:text-[#e8820c] text-xs font-bold transition-colors group"
                  >
                    Enquire Now
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Warranty note */}
        <div className="mt-12 bg-[#0f2d54] rounded-2xl p-8 text-center text-white">
          <p className="text-lg font-black mb-2">
            Quality Guaranteed — Every Project, Every Time
          </p>
          <p className="text-white/70 text-sm max-w-2xl mx-auto">
            Upon completion of our services, a <strong className="text-[#e8820c]">Warranty Certification</strong> is issued for all our construction projects. We adopt strict International best practices and use the very best materials in all our construction activities.
          </p>
        </div>
      </div>
    </section>
  );
}
