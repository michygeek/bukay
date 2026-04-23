"use client";

import { CheckCircle2, Target, Eye, Lightbulb } from "lucide-react";

const highlights = [
  "Civil, Highway & Transportation Engineering",
  "Mechanical & Electrical Engineering",
  "Telecommunications Infrastructure",
  "Building & Architectural Works",
  "Plumbing & Water Engineering",
  "Laminate Flooring Systems",
];

const pillars = [
  {
    icon: Target,
    title: "Our Mission",
    color: "bg-[#0f2d54]",
    text: "To build a foremost construction and engineering organization characterized by a determined focus on customers, professionalism, integrity and a commitment to distinction. We deploy building, construction and engineering solutions with integrity and commitment, ensuring superior quality and performance in the most cost-effective way.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    color: "bg-[#e8820c]",
    text: "To be a highly professional and technical service organization providing unique consulting services — an enduring organization that achieves consistent long-term superior performance, focused on customers, with the reputation of bonafide integrity and professionalism recognized by all stakeholders.",
  },
  {
    icon: Lightbulb,
    title: "Our Values",
    color: "bg-[#1b4880]",
    text: "Honesty, qualitative and reliable service. Continued commitment to Nigeria's growth and development. Continual social responsibilities to our operational areas. Appropriate returns to our stakeholders. A conducive working environment and undaunted adherence to regulatory authorities, ethics, laws and orders.",
  },
];

export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-[#e8820c]/10 text-[#e8820c] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
            About Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0f2d54] mb-4">
            Who We Are
          </h2>
          <div className="w-16 h-1 bg-[#e8820c] mx-auto rounded-full" />
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-14 items-center mb-20">
          {/* Left: image collage */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-3">
              <img
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80"
                alt="Construction site"
                className="rounded-2xl h-52 w-full object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80"
                alt="Engineering work"
                className="rounded-2xl h-52 w-full object-cover mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=600&q=80"
                alt="Building construction"
                className="rounded-2xl h-44 w-full object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=600&q=80"
                alt="Road construction"
                className="rounded-2xl h-44 w-full object-cover mt-4"
              />
            </div>

            {/* Experience badge */}
            <div className="absolute -bottom-6 -right-4 bg-[#e8820c] text-white rounded-2xl p-5 shadow-xl text-center">
              <p className="text-4xl font-black leading-none">20+</p>
              <p className="text-xs font-semibold mt-1 uppercase tracking-wide">Years of<br />Excellence</p>
            </div>
          </div>

          {/* Right: text */}
          <div>
            <h3 className="text-2xl font-black text-[#0f2d54] mb-4 leading-tight">
              Bukay Global Services Limited —{" "}
              <span className="text-[#e8820c]">An Indigenous Engineering Force</span>
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4 text-sm">
              Bukay Global Services Limited is an indigenous engineering construction company established by dynamic and highly experienced professionals for the purpose of providing infrastructural development needs for humanity in areas of engineering works, especially in Civil, Highway/Transportation, Mechanical, Electrical and Telecommunications.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6 text-sm">
              Since establishment, our operations have grown by leaps and bounds. We embody a full utilization of years of varied experience in planning, engineering management, construction, and supply and maintenance practice — geared towards participation at the highest level of engineering construction in Nigeria.
            </p>

            <p className="text-xs font-bold text-[#0f2d54] uppercase tracking-widest mb-3">
              Core Expertise
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 size={16} className="text-[#e8820c] shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#0f2d54] hover:bg-[#1b4880] text-white px-7 py-3 rounded-full text-sm font-bold transition-all hover:shadow-lg"
            >
              Work With Us
            </a>
          </div>
        </div>

        {/* Mission / Vision / Values */}
        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map(({ icon: Icon, title, color, text }) => (
            <div key={title} className="rounded-2xl border border-gray-100 p-7 hover:shadow-lg transition-shadow">
              <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md`}>
                <Icon size={22} className="text-white" />
              </div>
              <h4 className="text-lg font-black text-[#0f2d54] mb-3">{title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
