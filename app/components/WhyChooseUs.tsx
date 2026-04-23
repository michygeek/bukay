"use client";

import { Shield, Award, Wrench, Clock, HeartHandshake, Globe } from "lucide-react";

const reasons = [
  {
    icon: Award,
    title: "International Standards",
    text: "We adopt strict international best practices in all construction activities, aspiring to attain international standards across every aspect of our business.",
  },
  {
    icon: Shield,
    title: "EH&S Commitment",
    text: "Committed to the highest standards of corporate citizenship — protecting employee health and safety, safeguarding the environment with ISO-9000:2000 based management systems.",
  },
  {
    icon: Wrench,
    title: "Own Equipment Fleet",
    text: "D8 Bulldozers, Excavators, Tower Cranes, Steel Rollers, Concrete Mixers and more — we own our equipment, enabling quick mobilization and zero delay.",
  },
  {
    icon: Clock,
    title: "Rapid Mobilization",
    text: "Quick mobilization to site is always achievable. We have partnerships with firms providing additional construction equipment when scope demands it.",
  },
  {
    icon: HeartHandshake,
    title: "Client-Centric",
    text: "We believe the customer is the reason for our being. Our success depends on how well we secure our clients and develop their enterprise — a value that can never be compromised.",
  },
  {
    icon: Globe,
    title: "Multinational Partnerships",
    text: "In technical partnership with multinationals, we bring wide-range reliable core infrastructures and enterprise business solutions to every engagement.",
  },
];

const equipment = [
  "D8 Bulldozer", "Excavator", "Steel Roller", "Water Tanker",
  "Concrete Mixers", "Concrete Vibrators", "Plate Compactor", "Drilling Machine",
  "Water Pump", "Grader", "Concrete Cutting Machine", "Tower Crane",
  "Mobile Crane", "Dumper", "Welding Machine", "Vice & Power Saw",
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="py-20 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-[#e8820c]/10 text-[#e8820c] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0f2d54] mb-4">
            Our Competitive Edge
          </h2>
          <div className="w-16 h-1 bg-[#e8820c] mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left: reasons */}
          <div className="grid sm:grid-cols-2 gap-5">
            {reasons.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#0f2d54] to-[#1b4880] flex items-center justify-center mb-3 shadow-sm">
                  <Icon size={18} className="text-white" />
                </div>
                <h4 className="font-black text-[#0f2d54] text-sm mb-1.5">{title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          {/* Right: equipment + stats */}
          <div>
            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { val: "50+", label: "Projects" },
                { val: "20+", label: "Years" },
                { val: "100+", label: "Professionals" },
              ].map(({ val, label }) => (
                <div
                  key={label}
                  className="bg-linear-to-br from-[#0f2d54] to-[#1b4880] rounded-2xl p-5 text-center text-white shadow-lg"
                >
                  <p className="text-3xl font-black">{val}</p>
                  <p className="text-xs text-white/70 mt-1 font-medium uppercase tracking-wide">{label}</p>
                </div>
              ))}
            </div>

            {/* Equipment list */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h4 className="font-black text-[#0f2d54] mb-1">Plants & Equipment</h4>
              <p className="text-gray-400 text-xs mb-4">
                Ready for immediate deployment on any project
              </p>
              <div className="grid grid-cols-2 gap-2">
                {equipment.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e8820c] shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-xs mt-3 italic">
                + Computers, Printers, Scanners and more office equipment
              </p>
            </div>
          </div>
        </div>

        {/* Promise bar */}
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Honest & Reliable Service", sub: "At best price possible" },
            { label: "Warranty Certification", sub: "On all construction projects" },
            { label: "24/7 Communication", sub: "Email, SMS, Radio & Mobile" },
            { label: "Backup Equipment", sub: "Zero downtime guarantee" },
          ].map(({ label, sub }) => (
            <div
              key={label}
              className="bg-[#0f2d54] rounded-2xl p-5 text-white text-center"
            >
              <p className="font-black text-sm mb-1">{label}</p>
              <p className="text-white/60 text-xs">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
