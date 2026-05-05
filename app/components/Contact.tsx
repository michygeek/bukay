"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Send, CheckCircle, Loader2, AlertCircle } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send message. Please try again or email us at bukay.ng@gmail.com."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-[#e8820c]/10 text-[#e8820c] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0f2d54] mb-4">
            Start Your Project
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Ready to build something great? Reach out to us — we&apos;d love to discuss your project needs and provide a competitive quote.
          </p>
          <div className="w-16 h-1 bg-[#e8820c] mx-auto rounded-full mt-4" />
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Info column */}
          <div className="lg:col-span-2 space-y-5">
            {[
              {
                icon: MapPin,
                label: "Head Office",
                value: "4 Thambo Mbeki Close, off Danjuma Street, Asokoro Abuja",
                sub: "With operations nationwide",
              },
              {
                icon: Phone,
                label: "Call Us",
                value: "+2348108792617 - whatsapp: +23485793075 | +2348033218941",
                sub: "Monday – Friday, 8am – 6pm",
              },
              {
                icon: Mail,
                label: "Email Us",
                value: "bukay.ng@gmail.com",
                sub: "We respond within 24 hours",
              },
            ].map(({ icon: Icon, label, value, sub }) => (
              <div
                key={label}
                className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#0f2d54] to-[#1b4880] flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="font-black text-[#0f2d54] text-sm">{value}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{sub}</p>
                </div>
              </div>
            ))}

            <div className="bg-[#0f2d54] rounded-2xl p-6 text-white">
              <h4 className="font-black mb-2">Operating Nationwide</h4>
              <p className="text-white/70 text-xs leading-relaxed">
                Lagos • Abuja • Ile-Ife • Kwara State • Ebonyi State • Ogun State • Ondo State • Nasarawa State • and expanding.
              </p>
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-[#e8820c] font-bold text-sm">NEMSA Certified</p>
                <p className="text-white/60 text-xs mt-0.5">Category A — Nigerian Electricity Management Services Agency</p>
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                  <h3 className="text-xl font-black text-[#0f2d54] mb-2">Message Sent!</h3>
                  <p className="text-gray-500 text-sm">
                    Thank you for reaching out. A confirmation has been sent to <strong>{form.email}</strong>. Our team will contact you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", email: "", phone: "", service: "", message: "" });
                    }}
                    className="mt-6 bg-[#e8820c] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#d4730a] transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-black text-[#0f2d54] mb-5">Send Us a Message</h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">Full Name *</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Your full name"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0f2d54] focus:ring-1 focus:ring-[#0f2d54] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email Address *</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0f2d54] focus:ring-1 focus:ring-[#0f2d54] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">Phone Number</label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+234 —"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0f2d54] focus:ring-1 focus:ring-[#0f2d54] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">Service Required *</label>
                      <select
                        name="service"
                        value={form.service}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0f2d54] focus:ring-1 focus:ring-[#0f2d54] transition-colors bg-white"
                      >
                        <option value="">Select a service</option>
                        <option>Roads &amp; Highway Construction</option>
                        <option>Telecom Cell Sites Construction</option>
                        <option>Building Construction</option>
                        <option>Electrical Engineering</option>
                        <option>Plumbing &amp; Water Engineering</option>
                        <option>Laminate Flooring</option>
                        <option>General Supply</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Project Description *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell us about your project — location, scope, timeline and any specific requirements..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0f2d54] focus:ring-1 focus:ring-[#0f2d54] transition-colors resize-none"
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                      <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-[#e8820c] hover:bg-[#d4730a] disabled:bg-[#e8820c]/60 text-white py-3.5 rounded-xl font-bold text-sm transition-all hover:shadow-lg disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Sending…
                      </>
                    ) : (
                      <>
                        <Send size={16} /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
