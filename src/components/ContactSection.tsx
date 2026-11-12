"use client";

import React, { useState } from "react";
import { PhoneCall, Mail, MapPin, CheckCircle2 } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 4000);
  };

  return (
    <section
      id="contact"
      className="w-full bg-[#f8fafc] dark:bg-black py-16 sm:py-24 px-4 sm:px-8 lg:px-12 border-t border-neutral-200 dark:border-neutral-900 transition-colors duration-200"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight">
            Get in touch with us
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base mt-2.5 font-normal">
            Any question or remarks? Just write us a{" "}
            <span className="text-[#22c55e] font-semibold">message!</span>
          </p>
        </div>

        {/* Contact Container Box */}
        <div className="rounded-3xl bg-white dark:bg-[#15171a] border border-neutral-200 dark:border-white/[0.06] shadow-xl dark:shadow-2xl overflow-hidden p-3 sm:p-4 lg:p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 transition-colors">
          {/* Left Column: Pastel Green Contact Info Card */}
          <div className="lg:col-span-5 rounded-2xl bg-[#d5fad9] p-6 sm:p-8 lg:p-10 flex flex-col justify-between text-slate-900 shadow-xs">
            <div>
              <h3 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
                Contact Information
              </h3>
              <p className="text-base sm:text-lg text-slate-800 mt-3 leading-relaxed font-normal">
                Fill up the form and our Team will get back to you within 24 hours
              </p>
            </div>

            {/* Contact Details List */}
            <div className="flex flex-col gap-6 sm:gap-7 my-8 sm:my-10">
              {/* Phone */}
              <div className="flex items-center gap-3.5">
                <div className="shrink-0 text-slate-950">
                  <PhoneCall className="h-5 w-5 stroke-[2.2]" />
                </div>
                <a
                  href="tel:+917061529409"
                  className="text-sm sm:text-base font-semibold text-slate-950 hover:underline tracking-tight"
                >
                  +91-7061529409
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3.5">
                <div className="shrink-0 text-slate-950">
                  <Mail className="h-5 w-5 stroke-[2.2]" />
                </div>
                <a
                  href="mailto:raushankumarbhardwaj4510@gmail.com"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(
                      "https://mail.google.com/mail/?view=cm&fs=1&to=raushankumarbhardwaj4510@gmail.com",
                      "_blank"
                    );
                  }}
                  className="text-sm sm:text-base font-semibold text-slate-950 hover:underline break-all cursor-pointer"
                  title="Open in Gmail"
                >
                  raushankumarbhardwaj4510@gmail.com
                </a>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3.5">
                <div className="shrink-0 text-slate-950 mt-0.5">
                  <MapPin className="h-5 w-5 stroke-[2.2]" />
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                  The Kabadiwala, 3rd floor, Plot No. 22, Beside Biscoman Bhawan, Gandhi Maidan,
                  Gate No. 07, Patna, Bihar, 800001
                </p>
              </div>
            </div>

            <div className="hidden lg:block text-[11px] text-slate-600 font-medium tracking-wide">
              KabaadSe Support Desk • 24/7 Digital Assistance
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 p-3 sm:p-5 lg:p-7 flex flex-col justify-center">
            {submitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
                </div>
                <h4 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  Message Sent!
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm">
                  Thank you, <strong>{formData.name || "there"}</strong>. Our team has
                  received your message and will reach out to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Name */}
                <div>
                  <label className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                    Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-neutral-50 dark:bg-[#121417] border border-neutral-300 dark:border-neutral-700/60 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>

                {/* Phone & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                      Phone Number
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full bg-neutral-50 dark:bg-[#121417] border border-neutral-300 dark:border-neutral-700/60 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-neutral-50 dark:bg-[#121417] border border-neutral-300 dark:border-neutral-700/60 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                    Subject
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full bg-neutral-50 dark:bg-[#121417] border border-neutral-300 dark:border-neutral-700/60 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full bg-neutral-50 dark:bg-[#121417] border border-neutral-300 dark:border-neutral-700/60 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-y"
                  />
                </div>

                {/* Bottom Submit Button (Aligned Right like reference) */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-7 py-2.5 rounded-lg bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold text-sm transition-all duration-200 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
