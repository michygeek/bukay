"use client";

import { useState } from "react";
import { MapPin, Calendar, ExternalLink } from "lucide-react";

const categories = ["All", "Building", "Roads & Highway", "Electrical", "Telecom"];

const projects = [
  {
    title: "Providus Bank Remodeling",
    location: "Abuja",
    period: "May 2017 – Date",
    category: "Building",
    image: "/images/Screenshot 2026-04-22 212433.png",
    description: "Complete remodeling of Providus Bank premises including exterior renovation, demolition, construction, interior works and external finishing.",
  },
  {
    title: "Construction of Twin Five-Bedroom Duplex",
    location: "Dawaki, Abuja",
    period: "2015",
    category: "Building",
    image: "/images/Screenshot 2026-04-22 213044.png",
    description: "Full construction from foundation block laying, superstructure works, reinforcement works on upper floor, through to interior and exterior finishing.",
  },
  {
    title: "Construction of 6 Units of 2-Bedroom Flats",
    location: "Dawaki, Abuja",
    period: "2015",
    category: "Building",
    image: "/images/Screenshot 2026-04-22 212935.png",
    description: "Foundation trench excavation, concrete oversite casting, setting out, upper floor reinforcement and electrical works.",
  },
  {
    title: "5-Bedroom Country Home",
    location: "Isanlu Isin, Kwara State",
    period: "July 2017 – Date",
    category: "Building",
    image: "/images/Screenshot 2026-04-22 213204.png",
    description: "Completion and finishing of 5-bedroom country home with BQ including block works, roofing, electrical wiring, and exterior concrete decoration.",
  },
  {
    title: "Drainage Construction",
    location: "Abakaliki, Ebonyi State",
    period: "Completed",
    category: "Roads & Highway",
    image: "/images/Screenshot 2026-04-22 203044.png",
    description: "Full drainage construction project in Abakaliki, Ebonyi State including trenching, concrete works and finishing.",
  },
  {
    title: "Median Barrier Construction",
    location: "Agidingbi to Ogba, Lagos State",
    period: "Completed",
    category: "Roads & Highway",
    image: "/images/Screenshot 2026-04-22 212536.png",
    description: "Construction of median barrier from Agidingbi to Ogba along Lagos State highway.",
  },
  {
    title: "Stone Pitched Trapezoidal Drainage",
    location: "Daywaterman College, Ogun State",
    period: "Completed",
    category: "Roads & Highway",
    image: "/images/Screenshot 2026-04-22 212843.png",
    description: "Construction of stone pitched trapezoidal drainage at Daywaterman College, Asu Village, Off Kobape Road.",
  },
  {
    title: "Faculty of Pharmacy Building — Phase 2",
    location: "Obafemi Awolowo University, Ile-Ife",
    period: "Completed",
    category: "Electrical",
    image: "/images/Screenshot 2026-04-22 213240.png",
    description: "Electrical/Mechanical Installations of New Faculty of Pharmacy Building Phase 2, Obafemi Awolowo University through JKN Ltd.",
  },
  {
    title: "500KVA Transformer Installation",
    location: "Awujoola Investment, Abeokuta, Ogun State",
    period: "Completed",
    category: "Electrical",
    image: "/images/Screenshot 2026-04-22 210032.png",
    description: "Installation of 500KVA, 330.0.415KV Transformer for Awujoola Investment & Trust Limited.",
  },
  // {
  //   title: "ABUAD Mini-Industrial Park",
  //   location: "ABUAD",
  //   period: "Completed",
  //   category: "Building",
  //   image: "/images/Screenshot 2026-04-22 212508.png",
  //   description: "Construction of ABUAD Mini-Industrial Park Project and development of small scale industrial chemical plant.",
  // },
  // {
  //   title: "Multi-Functional Central Mosque",
  //   location: "Obafemi Awolowo University, Ile-Ife",
  //   period: "Completed",
  //   category: "Building",
  //   image: "/images/Screenshot 2026-04-22 212553.png",
  //   description: "Multi-functional South Western Central Mosque construction, Obafemi Awolowo University, Ile-Ife, Osun State.",
  // },
  {
    title: "Hostel Complex Security Infrastructure",
    location: "Agadagba-Obon, Ondo State",
    period: "Completed",
    category: "Building",
    image: "/images/Screenshot 2026-04-22 213018.png",
    description: "Award for Contract for Construction of Security Infrastructure of the Hostel Complex of Vocational Training Center.",
  },
];

export default function Projects() {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-[#e8820c]/10 text-[#e8820c] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
            Our Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0f2d54] mb-4">
            Success Stories
          </h2>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto">
            A selection of projects successfully executed by Bukay Global Services Limited across Nigeria — from Lagos to Abuja, Ile-Ife to Kwara.
          </p>
          <div className="w-16 h-1 bg-[#e8820c] mx-auto rounded-full mt-4" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === cat
                  ? "bg-[#0f2d54] text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-[#e8820c]/10 hover:text-[#e8820c]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <div
              key={project.title}
              className="project-card group rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />

                {/* Overlay */}
                <div className="project-overlay absolute inset-0 bg-[#0f2d54]/80 flex items-center justify-center">
                  <a
                    href="#contact"
                    className="flex items-center gap-2 bg-white text-[#0f2d54] px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#e8820c] hover:text-white transition-colors"
                  >
                    <ExternalLink size={13} /> Learn More
                  </a>
                </div>

                {/* Category badge */}
                <span className="absolute top-3 left-3 bg-[#e8820c] text-white text-xs font-bold px-3 py-1 rounded-full">
                  {project.category}
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-black text-[#0f2d54] text-sm mb-2 leading-tight">
                  {project.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin size={11} className="text-[#e8820c]" />
                    {project.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    {project.period}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-[#e8820c] hover:bg-[#d4730a] text-white px-8 py-3.5 rounded-full font-bold text-sm transition-all hover:shadow-lg"
          >
            Start Your Project
          </a>
        </div>
      </div>
    </section>
  );
}
