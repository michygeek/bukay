"use client";

import { useState } from "react";
import { Calculator, AlertCircle, ArrowRight, RotateCcw } from "lucide-react";
import Link from "next/link";

type ProjectType = "building" | "road" | "telecom" | "electrical" | "plumbing" | "";

interface FormState {
  projectType: ProjectType;
  // building
  floorArea: string;
  floors: string;
  buildingQuality: "standard" | "medium" | "luxury";
  // road
  roadLength: string;
  roadType: "gravel" | "asphalt" | "concrete";
  // telecom
  telecomType: "greenfield-30" | "greenfield-60" | "rooftop" | "upgrade";
  // electrical
  capacity: string;
  electricalType: "residential" | "commercial" | "industrial";
  // plumbing
  bathrooms: string;
  plumbingQuality: "standard" | "medium" | "luxury";
}

const defaultForm: FormState = {
  projectType: "",
  floorArea: "",
  floors: "1",
  buildingQuality: "medium",
  roadLength: "",
  roadType: "asphalt",
  telecomType: "greenfield-30",
  capacity: "",
  electricalType: "commercial",
  bathrooms: "",
  plumbingQuality: "medium",
};

function fmt(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

function calcRange(form: FormState): [number, number] | null {
  switch (form.projectType) {
    case "building": {
      const area = parseFloat(form.floorArea);
      const floors = parseInt(form.floors) || 1;
      if (!area || area <= 0) return null;
      const total = area * floors;
      const rates = {
        standard: [200_000, 350_000],
        medium: [350_000, 550_000],
        luxury: [550_000, 1_200_000],
      }[form.buildingQuality];
      return [total * rates[0], total * rates[1]];
    }
    case "road": {
      const km = parseFloat(form.roadLength);
      if (!km || km <= 0) return null;
      const rates = {
        gravel: [15_000_000, 30_000_000],
        asphalt: [45_000_000, 90_000_000],
        concrete: [80_000_000, 160_000_000],
      }[form.roadType];
      return [km * rates[0], km * rates[1]];
    }
    case "telecom": {
      const ranges: Record<FormState["telecomType"], [number, number]> = {
        "greenfield-30": [18_000_000, 35_000_000],
        "greenfield-60": [35_000_000, 65_000_000],
        rooftop: [8_000_000, 18_000_000],
        upgrade: [5_000_000, 14_000_000],
      };
      return ranges[form.telecomType];
    }
    case "electrical": {
      const kva = parseFloat(form.capacity);
      if (!kva || kva <= 0) return null;
      const rates = {
        residential: [180_000, 320_000],
        commercial: [160_000, 280_000],
        industrial: [130_000, 240_000],
      }[form.electricalType];
      return [kva * rates[0], kva * rates[1]];
    }
    case "plumbing": {
      const baths = parseInt(form.bathrooms);
      if (!baths || baths <= 0) return null;
      const rates = {
        standard: [600_000, 1_000_000],
        medium: [1_000_000, 2_000_000],
        luxury: [2_000_000, 4_500_000],
      }[form.plumbingQuality];
      return [baths * rates[0], baths * rates[1]];
    }
    default:
      return null;
  }
}

export default function CostCalculator() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [result, setResult] = useState<[number, number] | null | "error">(null);

  const set = (field: keyof FormState, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const calculate = () => {
    const range = calcRange(form);
    setResult(range ?? "error");
  };

  const reset = () => {
    setForm(defaultForm);
    setResult(null);
  };

  return (
    <section id="calculator" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-[#e8820c]/10 text-[#e8820c] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
            Budget Planner
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0f2d54] mb-4">
            Rough Cost Estimator
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Get a preliminary budget range for your project in seconds. For a precise quotation,{" "}
            <Link href="/contact" className="text-[#e8820c] font-semibold hover:underline">
              contact our team
            </Link>
            .
          </p>
          <div className="w-16 h-1 bg-[#e8820c] mx-auto rounded-full mt-4" />
        </div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* Form */}
          <div className="lg:col-span-3 bg-[#f8fafc] rounded-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#0f2d54] rounded-xl flex items-center justify-center">
                <Calculator size={20} className="text-white" />
              </div>
              <h3 className="font-black text-[#0f2d54] text-lg">Project Details</h3>
            </div>

            <div className="space-y-5">
              {/* Project type */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  Project Type *
                </label>
                <select
                  value={form.projectType}
                  onChange={(e) => { set("projectType", e.target.value); setResult(null); }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#0f2d54] focus:ring-1 focus:ring-[#0f2d54]"
                >
                  <option value="">— Select a project type —</option>
                  <option value="building">Building Construction</option>
                  <option value="road">Road & Highway Construction</option>
                  <option value="telecom">Telecom Cell Site</option>
                  <option value="electrical">Electrical / MEP Installation</option>
                  <option value="plumbing">Plumbing & Water Engineering</option>
                </select>
              </div>

              {/* Building fields */}
              {form.projectType === "building" && (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                        Floor Area (m²) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={form.floorArea}
                        onChange={(e) => set("floorArea", e.target.value)}
                        placeholder="e.g. 250"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#0f2d54] focus:ring-1 focus:ring-[#0f2d54]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                        Number of Floors
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={form.floors}
                        onChange={(e) => set("floors", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#0f2d54] focus:ring-1 focus:ring-[#0f2d54]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Finish Quality
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["standard", "medium", "luxury"] as const).map((q) => (
                        <button
                          key={q}
                          onClick={() => set("buildingQuality", q)}
                          className={`py-2.5 rounded-xl text-sm font-bold border-2 capitalize transition-all ${
                            form.buildingQuality === q
                              ? "border-[#0f2d54] bg-[#0f2d54] text-white"
                              : "border-gray-200 text-gray-600 hover:border-[#0f2d54]"
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Road fields */}
              {form.projectType === "road" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Road Length (km) *
                    </label>
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={form.roadLength}
                      onChange={(e) => set("roadLength", e.target.value)}
                      placeholder="e.g. 2.5"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#0f2d54] focus:ring-1 focus:ring-[#0f2d54]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Road Type
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["gravel", "asphalt", "concrete"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => set("roadType", t)}
                          className={`py-2.5 rounded-xl text-sm font-bold border-2 capitalize transition-all ${
                            form.roadType === t
                              ? "border-[#0f2d54] bg-[#0f2d54] text-white"
                              : "border-gray-200 text-gray-600 hover:border-[#0f2d54]"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Telecom fields */}
              {form.projectType === "telecom" && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Site Type
                  </label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {(
                      [
                        { value: "greenfield-30", label: "Greenfield (30 m)" },
                        { value: "greenfield-60", label: "Greenfield (60 m)" },
                        { value: "rooftop", label: "Rooftop Site" },
                        { value: "upgrade", label: "Site Upgrade" },
                      ] as const
                    ).map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => set("telecomType", value)}
                        className={`py-2.5 px-4 rounded-xl text-sm font-bold border-2 transition-all text-left ${
                          form.telecomType === value
                            ? "border-[#0f2d54] bg-[#0f2d54] text-white"
                            : "border-gray-200 text-gray-600 hover:border-[#0f2d54]"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Electrical fields */}
              {form.projectType === "electrical" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Supply Capacity (KVA) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={form.capacity}
                      onChange={(e) => set("capacity", e.target.value)}
                      placeholder="e.g. 100"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#0f2d54] focus:ring-1 focus:ring-[#0f2d54]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Installation Type
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["residential", "commercial", "industrial"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => set("electricalType", t)}
                          className={`py-2.5 rounded-xl text-sm font-bold border-2 capitalize transition-all ${
                            form.electricalType === t
                              ? "border-[#0f2d54] bg-[#0f2d54] text-white"
                              : "border-gray-200 text-gray-600 hover:border-[#0f2d54]"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Plumbing fields */}
              {form.projectType === "plumbing" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Number of Bathrooms / Wet Rooms *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={form.bathrooms}
                      onChange={(e) => set("bathrooms", e.target.value)}
                      placeholder="e.g. 4"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#0f2d54] focus:ring-1 focus:ring-[#0f2d54]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Fitting Quality
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["standard", "medium", "luxury"] as const).map((q) => (
                        <button
                          key={q}
                          onClick={() => set("plumbingQuality", q)}
                          className={`py-2.5 rounded-xl text-sm font-bold border-2 capitalize transition-all ${
                            form.plumbingQuality === q
                              ? "border-[#0f2d54] bg-[#0f2d54] text-white"
                              : "border-gray-200 text-gray-600 hover:border-[#0f2d54]"
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Actions */}
              {form.projectType && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={calculate}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#e8820c] hover:bg-[#d4730a] text-white py-3.5 rounded-xl font-bold text-sm transition-all hover:shadow-lg"
                  >
                    <Calculator size={16} /> Calculate Estimate
                  </button>
                  <button
                    onClick={reset}
                    className="w-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors"
                    title="Reset"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Result panel */}
          <div className="lg:col-span-2 space-y-5">
            {result === null && (
              <div className="bg-[#f8fafc] rounded-2xl p-8 border border-gray-100 text-center">
                <div className="w-16 h-16 bg-[#0f2d54]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calculator size={28} className="text-[#0f2d54]" />
                </div>
                <h4 className="font-black text-[#0f2d54] mb-2">Your Estimate</h4>
                <p className="text-gray-400 text-sm">
                  Fill in the project details and click{" "}
                  <span className="font-semibold text-[#e8820c]">Calculate</span> to see a rough
                  cost range.
                </p>
              </div>
            )}

            {result === "error" && (
              <div className="bg-red-50 rounded-2xl p-6 border border-red-100 flex items-start gap-3">
                <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">
                  Please fill in all required fields to calculate an estimate.
                </p>
              </div>
            )}

            {Array.isArray(result) && (
              <>
                <div className="bg-linear-to-br from-[#0f2d54] to-[#1b4880] rounded-2xl p-8 text-white">
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3">
                    Estimated Cost Range
                  </p>
                  <p className="text-2xl sm:text-3xl font-black leading-tight text-[#e8820c]">
                    {fmt(result[0])}
                  </p>
                  <p className="text-white/40 text-sm my-1 font-semibold">to</p>
                  <p className="text-2xl sm:text-3xl font-black leading-tight text-[#e8820c]">
                    {fmt(result[1])}
                  </p>
                  <div className="mt-6 pt-5 border-t border-white/20">
                    <p className="text-white/50 text-xs leading-relaxed">
                      Mid-point estimate:{" "}
                      <span className="text-white font-bold">
                        {fmt(Math.round((result[0] + result[1]) / 2))}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 flex items-start gap-3">
                  <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-amber-800 text-xs leading-relaxed">
                    <strong>Rough estimate only.</strong> Actual costs vary based on site
                    conditions, material prices, location, access, and detailed scope. Contact us
                    for a formal quotation.
                  </p>
                </div>

                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 bg-[#e8820c] hover:bg-[#d4730a] text-white py-3.5 rounded-xl font-bold text-sm transition-all hover:shadow-lg w-full"
                >
                  Request a Formal Quote <ArrowRight size={15} />
                </Link>
              </>
            )}

            {/* Rate reference card */}
            <div className="bg-[#f8fafc] rounded-2xl p-6 border border-gray-100">
              <h4 className="font-black text-[#0f2d54] text-sm mb-4">Rate Reference Guide</h4>
              <div className="space-y-2.5 text-xs text-gray-600">
                {[
                  ["Building — Standard", "₦200k – ₦350k / m²"],
                  ["Building — Medium", "₦350k – ₦550k / m²"],
                  ["Building — Luxury", "₦550k – ₦1.2M / m²"],
                  ["Gravel Road", "₦15M – ₦30M / km"],
                  ["Asphalt Road", "₦45M – ₦90M / km"],
                  ["Concrete Road", "₦80M – ₦160M / km"],
                  ["Telecom Greenfield", "₦18M – ₦65M / site"],
                  ["Electrical (Comm.)", "₦160k – ₦280k / KVA"],
                ].map(([label, rate]) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-bold text-[#0f2d54]">{rate}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-[10px] mt-4 leading-relaxed">
                Rates are approximate 2025 estimates for Nigeria. Prices vary by state and market conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
