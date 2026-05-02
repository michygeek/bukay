"use client";

const team = [
   {
    name: "Kayode Oyinloye",
    role: "Chairman",
    initials: "OK",
    color: "#0f2d54",
  },
  {
    name: "Banji Olasehinde",
    role: "Director / Chief Business Officer",
    initials: "BO",
    color: "#0f2d54",
  },
  {
    name: "Segun Emmanuel Oyinloye",
    role: "Director",
    initials: "SO",
    color: "#1b4880",
  },
  {
    name: "David Ayilara",
    role: "Architect / Project Coordinator",
    initials: "DA",
    color: "#e8820c",
  },
  
];

export default function Team() {
  return (
    <section id="team" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-[#e8820c]/10 text-[#e8820c] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
            Our People
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0f2d54] mb-4">
            Meet Our Expert Team
          </h2>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto">
            Our people are our best asset. We have put together a team of extraordinary professionals — multinationals technical partners and local well-qualified, highly skilled and appropriately motivated staff.
          </p>
          <div className="w-16 h-1 bg-[#e8820c] mx-auto rounded-full mt-4" />
        </div>

        {/* Team grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {team.map((member) => (
            <div
              key={member.name}
              className="group bg-[#f8fafc] rounded-2xl p-6 text-center border border-gray-100 hover:shadow-lg hover:border-[#e8820c]/30 transition-all"
            >
              {/* Avatar */}
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-black text-xl shadow-md"
                style={{ backgroundColor: member.color }}
              >
                {member.initials}
              </div>

              <h4 className="font-black text-[#0f2d54] text-sm leading-tight mb-1">
                {member.name}
              </h4>
              <p className="text-[#e8820c] text-xs font-semibold leading-tight">
                {member.role}
              </p>
            </div>
          ))}
        </div>

        {/* HR policy note */}
        <div className="mt-12 bg-gradient-to-r from-[#0f2d54] to-[#1b4880] rounded-2xl p-8 text-white text-center">
          <h4 className="text-lg font-black mb-2">Investing in Our People</h4>
          <p className="text-white/70 text-sm max-w-3xl mx-auto">
            Our human resources policy focuses on recruiting the very best, provides high-class training at both local and international level, and ensures excellent motivation through adequate reward, recognition and remuneration packages. Before the commencement of work on any of our sites, all personnel are properly oriented by our <strong className="text-[#e8820c]">Safety, Health and Environment Officer</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}
