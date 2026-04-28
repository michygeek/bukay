"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ArrowRight, Award, Users, Briefcase } from "lucide-react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Building Nigeria's",
    highlight: "Infrastructure",
    subtitle: "Excellence in Civil, Highway, Mechanical, Electrical & Telecommunications Engineering",
  },
  {
    image: "https://images.unsplash.com/photo-1630683924997-fe27050a0416?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Engineering",
    highlight: "World-Class Solutions",
    subtitle: "From roads and bridges to telecom sites and building construction — we deliver it all",
  },
  {
    image: "https://images.unsplash.com/photo-1586865638239-e19dca99a4de?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Quality Construction",
    highlight: "At Every Scale",
    subtitle: "Residential, commercial, industrial — we build with precision, professionalism and integrity",
  },
];

const stats = [
  { icon: Award, value: "20+", label: "Years Experience" },
  { icon: Briefcase, value: "50+", label: "Projects Completed" },
  { icon: Users, value: "100+", label: "Expert Professionals" },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex flex-col">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f2d54]/90 via-[#0f2d54]/75 to-[#0f2d54]/40" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center max-w-7xl mx-auto px-4 sm:px-6 w-full pt-24 pb-16">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-[#e8820c] animate-pulse" />
            Indigenous Engineering Construction Company
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
            {slides[current].title}{" "}
            <span className="text-[#e8820c]">{slides[current].highlight}</span>
          </h1>

          <p className="text-lg text-white/80 mb-8 max-w-xl leading-relaxed">
            {slides[current].subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-12">
            <a
              href="#services"
              className="flex items-center gap-2 bg-[#e8820c] hover:bg-[#d4730a] text-white px-8 py-3.5 rounded-full font-bold text-sm transition-all hover:shadow-xl hover:scale-105"
            >
              Our Services <ArrowRight size={16} />
            </a>
            <a
              href="#projects"
              className="flex items-center gap-2 bg-white/10 backdrop-blur hover:bg-white/20 text-white border border-white/30 px-8 py-3.5 rounded-full font-bold text-sm transition-all"
            >
              View Projects
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3 bg-white/10 backdrop-blur border border-white/20 px-5 py-3 rounded-2xl">
                <Icon size={20} className="text-[#e8820c]" />
                <div>
                  <p className="text-white font-black text-xl leading-none">{value}</p>
                  <p className="text-white/70 text-xs mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="relative z-10 flex justify-center gap-2 pb-8">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${i === current ? "w-8 h-2 bg-[#e8820c]" : "w-2 h-2 bg-white/40"}`}
          />
        ))}
      </div>

      {/* Scroll arrow */}
      <a
        href="#about"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-white/60 hover:text-white transition-colors animate-bounce"
      >
        <ChevronDown size={28} />
      </a>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L1440 60L1440 0C1200 40 960 60 720 40C480 20 240 0 0 30L0 60Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
