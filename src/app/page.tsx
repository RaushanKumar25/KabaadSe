"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CircularEconomy from "@/components/CircularEconomy";
import ServicesSection from "@/components/ServicesSection";
import HowItWorks from "@/components/HowItWorks";
import ImpactSection from "@/components/ImpactSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import PickupBookingModal from "@/components/PickupBookingModal";
import { useNavigationTransition } from "@/context/NavigationTransitionContext";
import {
  ChevronDown,
  Building,
  Sun,
  Moon,
  X,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { triggerTransition } = useNavigationTransition();

  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [businessModalOpen, setBusinessModalOpen] = useState(false);

  const scrollToNext = () => {
    const el =
      document.getElementById("circular-economy") ||
      document.getElementById("how-it-works");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-black dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white transition-colors duration-200">
      {/* 1. TOP NAVBAR */}
      <Navbar
        onOpenSellModal={() => setSellModalOpen(true)}
        onOpenBusinessModal={() => setBusinessModalOpen(true)}
      />

      {/* 2. HERO SECTION (LOCKED TO PERMANENT DARK MODE) */}
      {/* 2. HERO SECTION (LOCKED TO PERMANENT DARK MODE & EXACT ONE-SLIDE 100VH) */}
      <section className="h-screen h-[100dvh] max-h-screen w-full flex flex-col justify-between items-center pt-20 sm:pt-24 pb-4 sm:pb-6 px-6 sm:px-12 box-border relative overflow-hidden bg-[#030712] text-white">
        {/* Background HD Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg-clean.jpg"
            alt="Modern eco doorstep scrap collection vehicle"
            fill
            priority
            quality={95}
            className="w-full h-full object-cover object-center brightness-[0.76] contrast-[1.05]"
          />

          {/* Clean, High-Clarity Dual-Layer Dark Scrim for Perfect Text Readability */}
          <div className="absolute inset-0 bg-black/35 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/70 pointer-events-none" />
        </div>

        {/* Center Hero Content (Vertically Balanced in Available Viewport) */}
        <div className="relative z-10 max-w-5xl w-full mx-auto px-4 sm:px-6 text-center my-auto flex flex-col items-center justify-center">
          {/* Main Headline with Satoshi font and sharp square Thyme box */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-[5.25rem] font-black text-white tracking-tight leading-[1.06] mb-2 sm:mb-3 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] select-none">
            Transform Your{" "}
            <span className="bg-emerald-500 text-slate-950 px-3 sm:px-6 py-0.5 sm:py-1 inline-block mx-1 rounded-none">
              Scrap
            </span>
            <br />
            into Cash
          </h1>

          {/* Clean Subtitle */}
          <p className="text-slate-100 text-sm sm:text-base md:text-lg font-medium mt-2 sm:mt-3 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            Doorstep collection with digital weighing and instant payout.
          </p>

          {/* Hero CTAs */}
          <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setSellModalOpen(true)}
              className="px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition cursor-pointer flex items-center justify-center whitespace-nowrap shadow-lg shadow-emerald-950/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              Sell Scrap
            </button>
            <Link
              href="/rates"
              onClick={(e) => {
                e.preventDefault();
                triggerTransition("/rates", 1000);
              }}
              className="px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold rounded-full border border-white/30 text-white hover:border-white/60 hover:bg-white/10 backdrop-blur-sm transition cursor-pointer flex items-center justify-center whitespace-nowrap shadow-xs hover:scale-[1.02] active:scale-[0.98]"
            >
              Check Live Rates
            </Link>
          </div>
        </div>

        {/* Downward Chevron Indicator (Anchored cleanly at bottom of slide) */}
        <div className="relative z-10 w-full shrink-0 flex justify-center pb-1 pt-1">
          <button
            type="button"
            onClick={scrollToNext}
            className="text-white/80 hover:text-white transition-all transform hover:translate-y-1 p-2 cursor-pointer"
            aria-label="Scroll down to learn more"
          >
            <ChevronDown className="w-7 h-7 sm:w-8 sm:h-8 animate-bounce opacity-80 stroke-[2.5]" />
          </button>
        </div>
      </section>

      {/* CIRCULAR ECONOMY & SUSTAINABILITY */}
      <CircularEconomy />

      {/* OUR SERVICES */}
      <ServicesSection onContact={() => setSellModalOpen(true)} />

      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* FARAK PADTA HAI (IMPACT METRICS) */}
      <ImpactSection />

      {/* 3. TRUST & STATS BAR */}
      <section className="relative z-20 bg-white dark:bg-zinc-950 border-y border-slate-200 dark:border-white/10 py-6 sm:py-8 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center justify-center p-2">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-500 tracking-tight">
                50,000+
              </div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                Happy Households
              </div>
            </div>
            <div className="flex flex-col items-center justify-center p-2">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-500 tracking-tight">
                12,500+
              </div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                Tons Waste Recycled
              </div>
            </div>
            <div className="flex flex-col items-center justify-center p-2">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-500 tracking-tight">
                100%
              </div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                Certified Digital Scales
              </div>
            </div>
            <div className="flex flex-col items-center justify-center p-2">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-500 tracking-tight">
                ₹3.5 Cr+
              </div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                Instant Cash / UPI Paid
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <ContactSection />

      {/* 6. MODAL: SCHEDULE DOORSTEP PICKUP */}
      <PickupBookingModal
        isOpen={sellModalOpen}
        onClose={() => setSellModalOpen(false)}
      />

      {/* 7. MODAL: FOR BUSINESS */}
      {businessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/15 p-6 sm:p-8 shadow-2xl transition-colors">
            <div className="absolute top-5 right-5 flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-amber-400" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-700" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setBusinessModalOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 mb-2">
              <Building className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Enterprise Recycling
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              KabaadSe for Business
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              End-to-end industrial waste management, EPR compliance certificates,
              paper shredding & vehicle scrapping.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(
                  "Thank you! Our Corporate Waste Specialist will call you within 2 hours."
                );
                setBusinessModalOpen(false);
              }}
              className="mt-6 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company / Organization Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Acme Tech Park Pvt Ltd"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Person
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Name"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Work Email / Phone
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="official@company.com"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bulk Scrap Type & Monthly Volume
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your bulk waste: e.g. 500kg office paper monthly, obsolete IT hardware, warehouse packaging waste..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 resize-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-950/20 transition-all cursor-pointer"
              >
                Request Enterprise Quote
              </button>
            </form>
          </div>
        </div>
      )}



      {/* 8. FOOTER */}
      <Footer
        onOpenSellModal={() => setSellModalOpen(true)}
        onOpenBusinessModal={() => setBusinessModalOpen(true)}
      />
    </div>
  );
}
