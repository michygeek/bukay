"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle, Calendar, Clock, User, Loader2, AlertCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4;

interface BookingState {
  service: string;
  date: Date | null;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
  { id: "consultation", label: "Initial Consultation", duration: "45 min", desc: "Discuss your project goals, timeline, and budget." },
  { id: "survey", label: "Site Survey & Assessment", duration: "1-2 hrs", desc: "Our engineers visit and assess the site conditions." },
  { id: "design", label: "Design Review", duration: "1 hr", desc: "Review preliminary drawings and propose improvements." },
  { id: "quotation", label: "Detailed Quotation", duration: "45 min", desc: "Receive a detailed cost breakdown for your project." },
  { id: "progress", label: "Project Progress Meeting", duration: "30 min", desc: "Ongoing update meeting for active project clients." },
  { id: "handover", label: "Handover Inspection", duration: "2 hrs", desc: "Final walkthrough and sign-off on completed work." },
];

const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM",
  "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isWeekend(d: Date) { return d.getDay() === 0 || d.getDay() === 6; }
function isPast(d: Date) {
  const today = new Date(); today.setHours(0,0,0,0);
  return d < today;
}
function isUnavailable(d: Date) { return isWeekend(d) || isPast(d); }

function getBookedSlots(d: Date): string[] {
  const hash = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  return TIME_SLOTS.filter((_, i) => (hash * 3 + i * 7) % 11 < 2);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ServiceCard({ svc, selected, onClick }: {
  svc: typeof SERVICES[0]; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
        selected
          ? "border-[#0f2d54] bg-[#0f2d54]/5"
          : "border-gray-100 bg-white hover:border-[#0f2d54]/40"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-black text-[#0f2d54] text-sm">{svc.label}</p>
          <p className="text-gray-500 text-xs mt-0.5">{svc.desc}</p>
        </div>
        <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded-full ${
          selected ? "bg-[#e8820c] text-white" : "bg-gray-100 text-gray-500"
        }`}>
          {svc.duration}
        </span>
      </div>
    </button>
  );
}

function MiniCalendar({ selected, onSelect }: {
  selected: Date | null; onSelect: (d: Date) => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const cells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(viewYear, viewMonth, i + 1)),
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <ChevronLeft size={16} />
        </button>
        <span className="font-black text-[#0f2d54] text-sm">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />;
          const unavailable = isUnavailable(date);
          const isSelected =
            selected &&
            selected.getFullYear() === date.getFullYear() &&
            selected.getMonth() === date.getMonth() &&
            selected.getDate() === date.getDate();
          const isToday =
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();

          return (
            <button
              key={date.toISOString()}
              disabled={unavailable}
              onClick={() => onSelect(date)}
              className={`aspect-square flex items-center justify-center rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-[#0f2d54] text-white font-black"
                  : unavailable
                  ? "text-gray-300 cursor-not-allowed"
                  : isToday
                  ? "border-2 border-[#e8820c] text-[#e8820c] font-black hover:bg-[#e8820c] hover:text-white"
                  : "text-gray-700 hover:bg-[#0f2d54]/10 hover:text-[#0f2d54]"
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      <div className="flex gap-4 mt-4 pt-3 border-t border-gray-100">
        <span className="flex items-center gap-1.5 text-[10px] text-gray-400">
          <span className="w-3 h-3 rounded-full border-2 border-[#e8820c] inline-block" /> Today
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-gray-400">
          <span className="w-3 h-3 rounded-full bg-[#0f2d54] inline-block" /> Selected
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-gray-400">
          <span className="w-3 h-3 rounded-full bg-gray-200 inline-block" /> Unavailable
        </span>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AppointmentBooking() {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingState>({
    service: "",
    date: null,
    time: "",
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (k: keyof BookingState, v: string | Date | null) =>
    setBooking((b) => ({ ...b, [k]: v }));

  const bookedSlots = booking.date ? getBookedSlots(booking.date) : [];
  const availableSlots = TIME_SLOTS.filter((t) => !bookedSlots.includes(t));

  const canNext = () => {
    if (step === 1) return !!booking.service;
    if (step === 2) return !!booking.date && !!booking.time;
    if (step === 3) return !!booking.name && !!booking.email && !!booking.phone;
    return false;
  };

  const svcLabel = SERVICES.find((s) => s.id === booking.service)?.label ?? "";

  const steps = [
    { n: 1, label: "Service", icon: <Calendar size={14} /> },
    { n: 2, label: "Date & Time", icon: <Clock size={14} /> },
    { n: 3, label: "Your Details", icon: <User size={14} /> },
    { n: 4, label: "Confirm", icon: <CheckCircle size={14} /> },
  ];

  if (submitted) {
    return (
      <section className="py-20 bg-[#f8fafc]">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-[#0f2d54] mb-3">Appointment Requested!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Thank you, <strong>{booking.name}</strong>. Your appointment for{" "}
            <strong>{svcLabel}</strong> on{" "}
            <strong>
              {booking.date?.toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </strong>{" "}
            at <strong>{booking.time}</strong> has been received. We will confirm within 24 hours via {booking.email}.
          </p>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 text-left mb-6 shadow-sm">
            <h4 className="font-black text-[#0f2d54] text-sm mb-4">Booking Summary</h4>
            {[
              ["Service", svcLabel],
              ["Date", booking.date?.toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" })],
              ["Time", booking.time],
              ["Contact", `${booking.name} · ${booking.phone}`],
              ["Email", booking.email],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-xs py-2 border-b border-gray-50 last:border-0">
                <span className="text-gray-400 font-semibold">{label}</span>
                <span className="text-[#0f2d54] font-bold text-right max-w-[60%]">{value}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => { setSubmitted(false); setStep(1); setBooking({ service:"", date:null, time:"", name:"", email:"", phone:"", notes:"" }); }}
            className="bg-[#0f2d54] hover:bg-[#1b4880] text-white px-8 py-3 rounded-full font-bold text-sm transition-all"
          >
            Book Another Appointment
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="book" className="py-20 bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-[#e8820c]/10 text-[#e8820c] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
            Book a Meeting
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0f2d54] mb-4">
            Appointment Booking
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Schedule a consultation with our expert team at a time that works for you. Mon–Fri, 9am–5pm.
          </p>
          <div className="w-16 h-1 bg-[#e8820c] mx-auto rounded-full mt-4" />
        </div>

        {/* Step progress */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center">
              <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                step === s.n
                  ? "bg-[#0f2d54] text-white"
                  : step > s.n
                  ? "bg-green-100 text-green-700"
                  : "bg-white text-gray-400 border border-gray-200"
              }`}>
                {step > s.n ? <CheckCircle size={13} /> : s.icon}
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">{s.n}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-6 h-0.5 mx-0.5 transition-colors ${step > s.n ? "bg-green-400" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* ── Step 1: Service ── */}
        {step === 1 && (
          <div>
            <h3 className="font-black text-[#0f2d54] text-lg mb-5 text-center">What type of meeting do you need?</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {SERVICES.map((svc) => (
                <ServiceCard
                  key={svc.id}
                  svc={svc}
                  selected={booking.service === svc.id}
                  onClick={() => set("service", svc.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Step 2: Date & Time ── */}
        {step === 2 && (
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="font-black text-[#0f2d54] text-base mb-4">Pick a date</h3>
              <MiniCalendar
                selected={booking.date}
                onSelect={(d) => { set("date", d); set("time", ""); }}
              />
            </div>
            <div>
              <h3 className="font-black text-[#0f2d54] text-base mb-4">
                {booking.date
                  ? `Available slots — ${booking.date.toLocaleDateString("en-NG", { weekday: "short", day: "numeric", month: "short" })}`
                  : "Select a date first"}
              </h3>
              {booking.date ? (
                <div className="space-y-2">
                  {TIME_SLOTS.map((t) => {
                    const booked = bookedSlots.includes(t);
                    return (
                      <button
                        key={t}
                        disabled={booked}
                        onClick={() => set("time", t)}
                        className={`w-full py-3 px-5 rounded-xl text-sm font-bold border-2 flex justify-between items-center transition-all ${
                          booking.time === t
                            ? "bg-[#0f2d54] border-[#0f2d54] text-white"
                            : booked
                            ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                            : "bg-white border-gray-200 text-gray-700 hover:border-[#0f2d54] hover:text-[#0f2d54]"
                        }`}
                      >
                        <span>{t}</span>
                        {booked && <span className="text-[10px] font-normal text-gray-400">Booked</span>}
                        {!booked && booking.time === t && <CheckCircle size={14} />}
                      </button>
                    );
                  })}
                  <p className="text-xs text-gray-400 mt-2">
                    {availableSlots.length} slot{availableSlots.length !== 1 ? "s" : ""} available
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                  <Calendar size={28} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Choose a weekday from the calendar</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Step 3: Details ── */}
        {step === 3 && (
          <div className="max-w-lg mx-auto">
            <h3 className="font-black text-[#0f2d54] text-lg mb-6 text-center">Your contact details</h3>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Full Name *</label>
                  <input
                    value={booking.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Your full name"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0f2d54] focus:ring-1 focus:ring-[#0f2d54]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Phone Number *</label>
                  <input
                    value={booking.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+234 —"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0f2d54] focus:ring-1 focus:ring-[#0f2d54]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Email Address *</label>
                <input
                  type="email"
                  value={booking.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="your@email.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0f2d54] focus:ring-1 focus:ring-[#0f2d54]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Additional Notes</label>
                <textarea
                  value={booking.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  rows={3}
                  placeholder="Any specific topics, project details, or special requests..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0f2d54] focus:ring-1 focus:ring-[#0f2d54] resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: Confirm ── */}
        {step === 4 && (
          <div className="max-w-lg mx-auto">
            <h3 className="font-black text-[#0f2d54] text-lg mb-6 text-center">Confirm your booking</h3>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="space-y-4">
                {[
                  { label: "Service", icon: <Calendar size={14} />, value: svcLabel },
                  {
                    label: "Date",
                    icon: <Calendar size={14} />,
                    value: booking.date?.toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
                  },
                  { label: "Time", icon: <Clock size={14} />, value: booking.time },
                  { label: "Name", icon: <User size={14} />, value: booking.name },
                  { label: "Contact", icon: <User size={14} />, value: `${booking.email} · ${booking.phone}` },
                ].map(({ label, icon, value }) => (
                  <div key={label} className="flex items-start gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="w-8 h-8 bg-[#0f2d54]/8 rounded-xl flex items-center justify-center shrink-0 text-[#0f2d54]">
                      {icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</p>
                      <p className="text-[#0f2d54] font-bold text-sm mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {booking.notes && (
                <div className="mt-4 bg-[#f8fafc] rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Notes</p>
                  <p className="text-gray-600 text-sm">{booking.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submission error */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-6 max-w-4xl mx-auto">
            <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-4 max-w-4xl mx-auto">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1) as Step)}
            disabled={step === 1}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:border-[#0f2d54] hover:text-[#0f2d54] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} /> Back
          </button>

          {step < 4 ? (
            <button
              onClick={() => setStep((s) => Math.min(4, s + 1) as Step)}
              disabled={!canNext()}
              className="flex items-center gap-2 bg-[#0f2d54] hover:bg-[#1b4880] disabled:bg-gray-300 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all disabled:cursor-not-allowed"
            >
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={async () => {
              setLoading(true);
              setError(null);
              try {
                const res = await fetch("/api/book", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    service: svcLabel,
                    date: booking.date?.toISOString(),
                    time: booking.time,
                    name: booking.name,
                    email: booking.email,
                    phone: booking.phone,
                    notes: booking.notes,
                  }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error ?? "Submission failed.");
                setSubmitted(true);
              } catch (err) {
                setError(
                  err instanceof Error
                    ? err.message
                    : "Could not submit. Please call us or email info@bukayglobal.com."
                );
              } finally {
                setLoading(false);
              }
            }}
              disabled={loading}
              className="flex items-center gap-2 bg-[#e8820c] hover:bg-[#d4730a] disabled:bg-[#e8820c]/60 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all hover:shadow-lg disabled:cursor-not-allowed"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : <><CheckCircle size={16} /> Confirm Booking</>}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
