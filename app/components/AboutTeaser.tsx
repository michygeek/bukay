"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

const highlights = [
  "Civil, Highway & Transportation Engineering",
  "Mechanical & Electrical Engineering",
  "Telecommunications Infrastructure",
  "Building & Architectural Works",
  "Plumbing & Water Engineering",
  "Laminate Flooring Systems",
];

export default function AboutTeaser() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left: image collage */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-3">
              <img
                src="/images/Screenshot 2026-04-22 203012.png"
                alt="Foundation construction"
                className="rounded-2xl h-52 w-full object-cover"
              />
              <img
                src="/images/Screenshot 2026-04-22 212508.png"
                alt="Building under construction"
                className="rounded-2xl h-52 w-full object-cover mt-8"
              />
              <img
                src="/images/Screenshot 2026-04-22 213044.png"
                alt="Completed house"
                className="rounded-2xl h-44 w-full object-cover"
              />
              <img
                src="/images/Screenshot 2026-04-22 212553.png"
                alt="Completed building"
                className="rounded-2xl h-44 w-full object-cover mt-4"
              />
            </div>

            <div className="absolute -bottom-6 -right-4 bg-[#e8820c] text-white rounded-2xl p-5 shadow-xl text-center">
              <p className="text-4xl font-black leading-none">20+</p>
              <p className="text-xs font-semibold mt-1 uppercase tracking-wide">
                Years of
                <br />
                Excellence
              </p>
            </div>
          </div>

          {/* Right: text */}
          <div>
            <span className="inline-block bg-[#e8820c]/10 text-[#e8820c] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
              About Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0f2d54] mb-4 leading-tight">
              Bukay Global Services —{" "}
              <span className="text-[#e8820c]">An Indigenous Engineering Force</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-sm">
              Bukay Global Services Limited is an indigenous engineering construction company
              established by dynamic and highly experienced professionals, providing infrastructural
              development in Civil, Highway, Mechanical, Electrical and Telecommunications
              engineering across Nigeria.
            </p>

            <p className="text-xs font-bold text-[#0f2d54] uppercase tracking-widest mb-3">
              Core Expertise
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 size={16} className="text-[#e8820c] shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-[#0f2d54] hover:bg-[#1b4880] text-white px-7 py-3 rounded-full text-sm font-bold transition-all hover:shadow-lg"
              >
                Learn More <ArrowRight size={15} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border-2 border-[#0f2d54] text-[#0f2d54] hover:bg-[#0f2d54] hover:text-white px-7 py-3 rounded-full text-sm font-bold transition-all"
              >
                Work With Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
