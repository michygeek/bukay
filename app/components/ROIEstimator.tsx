"use client";

import { useState } from "react";
import { TrendingUp, AlertCircle, ArrowRight, BarChart3, RotateCcw } from "lucide-react";
import Link from "next/link";

type PropertyType = "residential" | "commercial" | "industrial";
type LocationTier = "prime" | "urban" | "suburban" | "rural";
type UseType = "rental" | "sell" | "self";

interface FormState {
  propertyType: PropertyType;
  constructionCost: string;
  landCost: string;
  location: LocationTier;
  useType: UseType;
  monthlyRent: string;
}

interface ROIResult {
  totalInvestment: number;
  marketValueLow: number;
  marketValueHigh: number;
  capitalGainLow: number;
  capitalGainHigh: number;
  capitalGainPctLow: number;
  capitalGainPctHigh: number;
  annualRent?: number;
  grossYield?: number;
  netYield?: number;
  paybackYears?: number;
  projection: { year: number; value: number; cumRent: number }[];
}

const fmt = (n: number, decimals = 0) => {
  if (n >= 1_000_000_000) return `₦${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(decimals === 0 ? 1 : decimals)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}K`;
  return `₦${n.toLocaleString()}`;
};

const fmtPct = (n: number) => `${n.toFixed(1)}%`;

// Market value multipliers (applied to total investment)
const VALUE_MULT: Record<LocationTier, [number, number]> = {
  prime: [1.8, 2.8],
  urban: [1.3, 1.9],
  suburban: [1.1, 1.6],
  rural: [0.9, 1.2],
};

// Annual appreciation rate
const APPRECIATION: Record<LocationTier, number> = {
  prime: 0.15,
  urban: 0.11,
  suburban: 0.08,
  rural: 0.05,
};

// Rental yield as % of market value
const RENTAL_YIELD: Record<LocationTier, Record<PropertyType, number>> = {
  prime: { residential: 0.055, commercial: 0.08, industrial: 0.1 },
  urban: { residential: 0.09, commercial: 0.12, industrial: 0.13 },
  suburban: { residential: 0.11, commercial: 0.13, industrial: 0.14 },
  rural: { residential: 0.14, commercial: 0.16, industrial: 0.18 },
};

function calculate(form: FormState): ROIResult | null {
  const construction = parseFloat(form.constructionCost.replace(/,/g, ""));
  const land = parseFloat(form.landCost.replace(/,/g, "")) || 0;
  if (!construction || construction <= 0) return null;

  const totalInvestment = construction + land;
  const [multLow, multHigh] = VALUE_MULT[form.location];
  const marketValueLow = totalInvestment * multLow;
  const marketValueHigh = totalInvestment * multHigh;
  const marketValueMid = (marketValueLow + marketValueHigh) / 2;

  const capitalGainLow = marketValueLow - totalInvestment;
  const capitalGainHigh = marketValueHigh - totalInvestment;
  const capitalGainPctLow = (capitalGainLow / totalInvestment) * 100;
  const capitalGainPctHigh = (capitalGainHigh / totalInvestment) * 100;

  const appreciation = APPRECIATION[form.location];

  // 5-year projection (using mid market value)
  let annualRent: number | undefined;
  let grossYield: number | undefined;
  let netYield: number | undefined;
  let paybackYears: number | undefined;

  const projection: ROIResult["projection"] = [];
  let cumRent = 0;

  if (form.useType === "rental") {
    const monthlyRent = parseFloat(form.monthlyRent.replace(/,/g, ""));
    if (monthlyRent > 0) {
      annualRent = monthlyRent * 12;
    } else {
      // estimate from yield
      annualRent = marketValueMid * RENTAL_YIELD[form.location][form.propertyType];
    }
    grossYield = (annualRent / marketValueMid) * 100;
    netYield = grossYield * 0.74; // ~26% vacancy + expenses
    const netAnnualIncome = annualRent * 0.74;
    paybackYears = totalInvestment / netAnnualIncome;

    for (let y = 0; y <= 5; y++) {
      const value = marketValueMid * Math.pow(1 + appreciation, y);
      cumRent += y === 0 ? 0 : netAnnualIncome;
      projection.push({ year: y, value, cumRent });
    }
  } else {
    for (let y = 0; y <= 5; y++) {
      const value = marketValueMid * Math.pow(1 + appreciation, y);
      projection.push({ year: y, value, cumRent: 0 });
    }
  }

  return {
    totalInvestment,
    marketValueLow,
    marketValueHigh,
    capitalGainLow,
    capitalGainHigh,
    capitalGainPctLow,
    capitalGainPctHigh,
    annualRent,
    grossYield,
    netYield,
    paybackYears,
    projection,
  };
}

const DEFAULT: FormState = {
  propertyType: "residential",
  constructionCost: "",
  landCost: "",
  location: "urban",
  useType: "rental",
  monthlyRent: "",
};

const LOCATION_LABELS: Record<LocationTier, string> = {
  prime: "Prime (VI / Ikoyi / Abuja CBD)",
  urban: "Urban (Mainland / Ibadan / PH)",
  suburban: "Suburban (Outskirts / New Towns)",
  rural: "Rural / Semi-urban",
};

export default function ROIEstimator() {
  const [form, setForm] = useState<FormState>(DEFAULT);
  const [result, setResult] = useState<ROIResult | null | "error">(null);

  const set = (k: keyof FormState, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setResult(null);
  };

  const run = () => {
    const r = calculate(form);
    setResult(r ?? "error");
  };

  const maxProjectionValue =
    Array.isArray(result) || result === "error" || result === null
      ? 0
      : Math.max(...result.projection.map((p) => p.value + p.cumRent));

  return (
    <section id="roi" className="py-20 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-[#e8820c]/10 text-[#e8820c] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
            Investment Analysis
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0f2d54] mb-4">
            ROI &amp; Property Value Estimator
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Estimate your return on investment, projected property value, and rental yield before breaking ground.
          </p>
          <div className="w-16 h-1 bg-[#e8820c] mx-auto rounded-full mt-4" />
        </div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#0f2d54] rounded-xl flex items-center justify-center shrink-0">
                <TrendingUp size={18} className="text-white" />
              </div>
              <h3 className="font-black text-[#0f2d54]">Project Details</h3>
            </div>

            <div className="space-y-5">
              {/* Property type */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  Property Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["residential", "commercial", "industrial"] as PropertyType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => set("propertyType", t)}
                      className={`py-2 rounded-xl text-xs font-bold capitalize border-2 transition-all ${
                        form.propertyType === t
                          ? "bg-[#0f2d54] border-[#0f2d54] text-white"
                          : "border-gray-200 text-gray-600 hover:border-[#0f2d54]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Costs */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Construction Cost (₦) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 80000000"
                    value={form.constructionCost}
                    onChange={(e) => set("constructionCost", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0f2d54] focus:ring-1 focus:ring-[#0f2d54]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Land / Acquisition Cost (₦)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 30000000"
                    value={form.landCost}
                    onChange={(e) => set("landCost", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0f2d54] focus:ring-1 focus:ring-[#0f2d54]"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  Location Tier
                </label>
                <select
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#0f2d54] focus:ring-1 focus:ring-[#0f2d54]"
                >
                  {(Object.entries(LOCATION_LABELS) as [LocationTier, string][]).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              {/* Intended use */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  Intended Use
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([["rental", "Rental Income"], ["sell", "Sell After Build"], ["self", "Owner-occupied"]] as const).map(
                    ([val, label]) => (
                      <button
                        key={val}
                        onClick={() => set("useType", val)}
                        className={`py-2 rounded-xl text-xs font-bold border-2 transition-all text-center ${
                          form.useType === val
                            ? "bg-[#e8820c] border-[#e8820c] text-white"
                            : "border-gray-200 text-gray-600 hover:border-[#e8820c]"
                        }`}
                      >
                        {label}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Monthly rent (only for rental) */}
              {form.useType === "rental" && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Expected Monthly Rent (₦) — optional
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Leave blank to auto-estimate"
                    value={form.monthlyRent}
                    onChange={(e) => set("monthlyRent", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0f2d54] focus:ring-1 focus:ring-[#0f2d54]"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={run}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#e8820c] hover:bg-[#d4730a] text-white py-3.5 rounded-xl font-bold text-sm transition-all hover:shadow-lg"
                >
                  <BarChart3 size={16} /> Calculate ROI
                </button>
                <button
                  onClick={() => { setForm(DEFAULT); setResult(null); }}
                  title="Reset"
                  className="w-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-5">
            {result === null && (
              <div className="bg-white rounded-2xl p-10 border border-gray-100 text-center shadow-sm">
                <div className="w-16 h-16 bg-[#0f2d54]/8 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp size={28} className="text-[#0f2d54]" />
                </div>
                <h4 className="font-black text-[#0f2d54] mb-2">Your Analysis Will Appear Here</h4>
                <p className="text-gray-400 text-sm">Fill in the project details and click Calculate ROI.</p>
              </div>
            )}

            {result === "error" && (
              <div className="bg-red-50 rounded-2xl p-5 border border-red-100 flex items-start gap-3">
                <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">Please enter a valid construction cost to continue.</p>
              </div>
            )}

            {result && result !== "error" && (
              <>
                {/* Key metrics */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-[#0f2d54] to-[#1b4880] rounded-2xl p-6 text-white">
                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Total Investment</p>
                    <p className="text-2xl font-black text-white">{fmt(result.totalInvestment)}</p>
                    <p className="text-white/50 text-xs mt-1">Construction + Land</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Est. Market Value</p>
                    <p className="text-xl font-black text-[#0f2d54]">{fmt(result.marketValueLow)} – {fmt(result.marketValueHigh)}</p>
                    <p className="text-gray-400 text-xs mt-1">{LOCATION_LABELS[form.location].split(" ")[0]} market range</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Capital Gain</p>
                    <p className={`text-xl font-black ${result.capitalGainLow >= 0 ? "text-green-600" : "text-red-500"}`}>
                      {fmt(result.capitalGainLow)} – {fmt(result.capitalGainHigh)}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {fmtPct(result.capitalGainPctLow)} – {fmtPct(result.capitalGainPctHigh)} on investment
                    </p>
                  </div>
                  {result.grossYield !== undefined && (
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Rental Yield</p>
                      <p className="text-xl font-black text-[#e8820c]">
                        {fmtPct(result.netYield!)} net
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {fmtPct(result.grossYield)} gross · {result.paybackYears!.toFixed(1)} yr payback
                      </p>
                    </div>
                  )}
                  {result.annualRent !== undefined && (
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sm:col-span-2">
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Annual Rental Income</p>
                      <p className="text-xl font-black text-[#0f2d54]">{fmt(result.annualRent)}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        Net (after expenses): {fmt(result.annualRent * 0.74)} · Monthly: {fmt(result.annualRent / 12)}
                      </p>
                    </div>
                  )}
                </div>

                {/* 5-year projection chart */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h4 className="font-black text-[#0f2d54] text-sm mb-5">5-Year Value Projection</h4>
                  <div className="space-y-3">
                    {result.projection.map(({ year, value, cumRent }) => {
                      const total = value + cumRent;
                      const pct = maxProjectionValue > 0 ? (total / maxProjectionValue) * 100 : 0;
                      return (
                        <div key={year} className="flex items-center gap-3">
                          <span className="text-xs font-bold text-gray-400 w-10 shrink-0">
                            {year === 0 ? "Now" : `Yr ${year}`}
                          </span>
                          <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#0f2d54] to-[#e8820c] transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="text-right shrink-0 w-32">
                            <span className="text-xs font-black text-[#0f2d54]">{fmt(value, 1)}</span>
                            {cumRent > 0 && (
                              <span className="text-[10px] text-[#e8820c] block">+{fmt(cumRent, 1)} rent</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-gray-400 text-[10px] mt-4">
                    Appreciation rate: {fmtPct(APPRECIATION[form.location] * 100)} p.a. · Based on mid-range market value estimate.
                  </p>
                </div>

                {/* Disclaimer + CTA */}
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-start gap-3">
                  <AlertCircle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-amber-800 text-xs leading-relaxed">
                    <strong>Indicative estimates only.</strong> Actual returns depend on market conditions, occupancy rates, maintenance costs, financing, and regulatory factors. Consult a qualified valuer for a formal assessment.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 bg-[#0f2d54] hover:bg-[#1b4880] text-white py-3.5 rounded-xl font-bold text-sm transition-all hover:shadow-lg w-full"
                >
                  Discuss Your Investment <ArrowRight size={15} />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
