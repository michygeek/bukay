"use client";

const clients = [
  "MTN Nigeria",
  "Globacon",
  "Aitel",
  "ZTE",
  "Providus Bank",
  "Obafemi Awolowo University",
  "Merit Group of Company",
  "ABUAD",
  "Awujoola Investment & Trust",
  "JKN Ltd",
];

const customerTypes = [
  { label: "Government & Public Enterprises", icon: "🏛️" },
  { label: "Corporate Organizations", icon: "🏢" },
  { label: "Financial Institutions", icon: "🏦" },
  { label: "Small & Medium Businesses", icon: "🏪" },
  { label: "Foreign Agencies", icon: "🌐" },
  { label: "NGOs & Individuals", icon: "🤝" },
];

export default function Clients() {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="inline-block bg-[#e8820c]/10 text-[#e8820c] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
            Trusted By
          </span>
          <h2 className="text-2xl font-black text-[#0f2d54]">Our Customer Base</h2>
          <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
            Our service base covers government, public enterprises, corporate organizations, financial institutions, foreign agencies, NGOs and individuals.
          </p>
        </div>

        {/* Client logos */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {clients.map((client) => (
            <div
              key={client}
              className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-sm font-semibold text-gray-700 hover:border-[#e8820c] hover:text-[#0f2d54] hover:bg-[#e8820c]/5 transition-colors"
            >
              {client}
            </div>
          ))}
        </div>

        {/* Customer types */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {customerTypes.map(({ label, icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 bg-[#f8fafc] rounded-xl px-5 py-4 border border-gray-100"
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-sm font-semibold text-[#0f2d54]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
