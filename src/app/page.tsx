"use client";

import React, { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import CircularEconomy from "@/components/CircularEconomy";
import BrandLogo from "@/components/BrandLogo";
import {
  ChevronDown,
  ArrowRight,
  Scale,
  Zap,
  CheckCircle2,
  Calendar,
  Search,
  Truck,
  X,
  Building,
} from "lucide-react";

interface ScrapRate {
  id: string;
  name: string;
  category: "Paper" | "Plastic" | "Metals" | "E-Waste";
  rate: number;
  unit: string;
  badge?: string;
  description: string;
}

const SCRAP_RATES: ScrapRate[] = [
  {
    id: "newspaper",
    name: "Newspaper (Akbhar)",
    category: "Paper",
    rate: 16,
    unit: "kg",
    badge: "Trending",
    description: "Daily newspapers, printed gazettes & publications",
  },
  {
    id: "cardboard",
    name: "Corrugated Cardboard (Gatta)",
    category: "Paper",
    rate: 14,
    unit: "kg",
    badge: "High Demand",
    description: "E-commerce delivery boxes, packaging cartons, kraft boards",
  },
  {
    id: "books",
    name: "Office Paper / Books / Notebooks",
    category: "Paper",
    rate: 15,
    unit: "kg",
    description: "Textbooks, magazines, office shredded documents",
  },
  {
    id: "copper",
    name: "Copper Wire & Utensils",
    category: "Metals",
    rate: 460,
    unit: "kg",
    badge: "Highest Value",
    description: "Armature coils, electrical copper wires, utensils",
  },
  {
    id: "brass",
    name: "Brass (Peetal)",
    category: "Metals",
    rate: 340,
    unit: "kg",
    description: "Pooja articles, plumbing valves, brass fittings",
  },
  {
    id: "aluminum",
    name: "Aluminum",
    category: "Metals",
    rate: 125,
    unit: "kg",
    description: "Window frames, soda cans, aluminum foil & sheets",
  },
  {
    id: "iron",
    name: "Iron & Steel (Loha)",
    category: "Metals",
    rate: 28,
    unit: "kg",
    description: "Rebar, grills, sheets, iron pipes, vehicle parts",
  },
  {
    id: "pet-bottles",
    name: "PET Bottles & Hard Plastic",
    category: "Plastic",
    rate: 14,
    unit: "kg",
    description: "Mineral water bottles, beverage jugs, plastic buckets",
  },
  {
    id: "soft-plastic",
    name: "Polythene & Mix Plastic",
    category: "Plastic",
    rate: 8,
    unit: "kg",
    description: "Packaging wrap, carry bags, assorted containers",
  },
  {
    id: "ewaste-pc",
    name: "Desktop CPU / Laptops / PCB",
    category: "E-Waste",
    rate: 320,
    unit: "piece",
    badge: "Certified",
    description: "Computers, old laptops, circuit boards & electronics",
  },
  {
    id: "batteries",
    name: "Lead Acid Batteries (Inverter/Car)",
    category: "E-Waste",
    rate: 85,
    unit: "kg",
    description: "Automotive batteries, UPS & home inverter batteries",
  },
];

export default function Home() {
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [businessModalOpen, setBusinessModalOpen] = useState(false);

  // Rate list filters & search
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Instant Value Estimator
  const [calcItem, setCalcItem] = useState<string>("cardboard");
  const [calcWeight, setCalcWeight] = useState<number>(25);

  // Booking Form State
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: "",
    phone: "",
    address: "",
    scrapType: "Cardboard & Paper",
    approxWeight: "20-50 kg",
    timeSlot: "10:00 AM - 01:00 PM",
  });

  const filteredRates = SCRAP_RATES.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedCalcItemData =
    SCRAP_RATES.find((item) => item.id === calcItem) || SCRAP_RATES[1];
  const calculatedTotal = (selectedCalcItemData.rate * calcWeight).toFixed(0);

  const scrollToRateCard = () => {
    const el = document.getElementById("rate-list");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-black dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white transition-colors duration-200">
      {/* 1. TOP NAVBAR */}
      <Navbar
        onOpenSellModal={() => setSellModalOpen(true)}
        onOpenRateList={scrollToRateCard}
      />

      {/* 2. HERO SECTION (LOCKED TO PERMANENT DARK MODE) */}
      <section className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#030712] text-white">
        {/* Background HD Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg-clean.jpg"
            alt="Modern eco doorstep scrap collection vehicle"
            fill
            priority
            quality={95}
            className="w-full h-full object-cover object-center brightness-[0.88] contrast-[1.05]"
          />

          {/* Clean, High-Clarity Neutral Dark Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60 pointer-events-none" />
        </div>

        {/* Top spacer for fixed header */}
        <div className="h-24 sm:h-28" />

        {/* Center Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center my-auto py-10">
          {/* Main Headline with Satoshi font and professional emerald box */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] font-black text-white tracking-tight leading-[1.04] mb-3 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] select-none">
            Transform Your{" "}
            <span className="bg-emerald-500 text-slate-950 px-3 sm:px-6 py-0.5 sm:py-1 inline-block mx-1 rounded-sm">
              Scrap
            </span>
            <br />
            into Cash
          </h1>

          {/* Clean Subtitle */}
          <p className="text-slate-400 text-sm sm:text-base md:text-lg font-normal mt-3.5 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Doorstep collection with digital weighing and instant payout.
          </p>

          {/* Action Button: View Scrap Rates */}
          <div className="flex items-center justify-center mt-8">
            <button
              type="button"
              onClick={scrollToRateCard}
              className="group h-12 px-8 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium text-sm sm:text-base backdrop-blur-xl transition-all duration-200 shadow-md shadow-black/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2.5 whitespace-nowrap"
            >
              <span>View Scrap Rates</span>
              <ArrowRight className="h-4 w-4 text-emerald-400 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Downward Chevron Indicator */}
        <div className="relative z-10 w-full pb-8 pt-2 flex justify-center">
          <button
            type="button"
            onClick={scrollToRateCard}
            className="text-white/80 hover:text-white transition-all transform hover:translate-y-1 p-2 cursor-pointer"
            aria-label="Scroll down to view rates"
          >
            <ChevronDown className="w-8 h-8 animate-bounce opacity-85 stroke-[2.5]" />
          </button>
        </div>
      </section>

      {/* CIRCULAR ECONOMY & SUSTAINABILITY */}
      <CircularEconomy />

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

      {/* 4. LIVE SCRAP RATE CARD & VALUE ESTIMATOR */}
      <section
        id="rate-list"
        className="py-20 bg-slate-100/70 dark:bg-black border-b border-slate-200/80 dark:border-white/10 scroll-mt-20 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Zap className="h-3.5 w-3.5" />
              Live Scrap Market Rates
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Transparent, Daily-Updated Pricing
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-3 text-base sm:text-lg">
              No bargaining, no cheated weights. We guarantee ISO-calibrated digital
              scales and live fair market rates.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left: Cards List & Filter */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {["All", "Paper", "Metals", "Plastic", "E-Waste"].map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                          selectedCategory === cat
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/30"
                            : "bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent hover:bg-slate-50 dark:hover:bg-white/10"
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search scrap item..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredRates.map((item) => (
                  <div
                    key={item.id}
                    className="group relative rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200/90 dark:border-white/10 p-5 hover:border-emerald-500/50 hover:shadow-lg dark:hover:bg-slate-950 transition-all duration-200 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base">
                          {item.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-baseline justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Rate per {item.unit}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                          ₹{item.rate}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          /{item.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Instant Value Estimator */}
            <div className="rounded-3xl bg-white dark:bg-zinc-950 border border-emerald-500/30 dark:border-emerald-500/30 p-6 sm:p-7 shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                <Scale className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Instant Estimator
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Calculate Scrap Earnings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Estimate how much money you will receive directly in your bank or cash.
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Select Scrap Category
                  </label>
                  <select
                    value={calcItem}
                    onChange={(e) => setCalcItem(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    {SCRAP_RATES.map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                        className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                      >
                        {item.name} (₹{item.rate}/{item.unit})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Estimated Quantity ({selectedCalcItemData.unit})
                    </label>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {calcWeight} {selectedCalcItemData.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="200"
                    step="5"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>5 {selectedCalcItemData.unit}</span>
                    <span>100 {selectedCalcItemData.unit}</span>
                    <span>200+ {selectedCalcItemData.unit}</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 p-5 text-center mt-6 transition-colors">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Estimated Direct Payout
                  </span>
                  <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400 mt-1 flex items-center justify-center gap-1">
                    <span>₹{calculatedTotal}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-500 mt-1 block">
                    Instant UPI transfer or hard cash upon doorstep pickup
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSellModalOpen(true)}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-950/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Book Pickup for ₹{calculatedTotal}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section
        id="how-it-works"
        className="py-20 bg-white dark:bg-black scroll-mt-20 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
              Fast & Hassle-free
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              How Doorstep Pickup Works
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-3 text-base sm:text-lg">
              Say goodbye to searching for local ragpickers. We bring certified scrap
              recycling right to your doorstep.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="relative rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 p-8 flex flex-col items-center text-center group hover:border-emerald-500/40 hover:shadow-md transition-all">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="h-8 w-8" />
              </div>
              <div className="absolute top-6 right-6 text-3xl font-black text-slate-200 dark:text-white/10">
                01
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Schedule Pickup
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Choose a suitable date and convenient time slot. Tell us what scrap
                materials you have.
              </p>
            </div>

            <div className="relative rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 p-8 flex flex-col items-center text-center group hover:border-emerald-500/40 hover:shadow-md transition-all">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Scale className="h-8 w-8" />
              </div>
              <div className="absolute top-6 right-6 text-3xl font-black text-slate-200 dark:text-white/10">
                02
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Certified Digital Weighing
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Our verified pickup executive arrives with a calibrated,
                government-inspected digital scale.
              </p>
            </div>

            <div className="relative rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 p-8 flex flex-col items-center text-center group hover:border-emerald-500/40 hover:shadow-md transition-all">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8" />
              </div>
              <div className="absolute top-6 right-6 text-3xl font-black text-slate-200 dark:text-white/10">
                03
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Instant UPI / Cash Payout
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Receive instant money straight to your UPI (GPay/PhonePe/Paytm) or cash,
                plus a digital green recycling certificate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MODAL: SCHEDULE DOORSTEP PICKUP */}
      {sellModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/15 p-6 sm:p-8 shadow-2xl transition-colors">
            <button
              type="button"
              onClick={() => {
                setSellModalOpen(false);
                setBookingSubmitted(false);
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {!bookingSubmitted ? (
              <div>
                <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-500 mb-2">
                  <Truck className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Schedule Free Doorstep Pickup
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Sell Your Scrap
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Fill in your details below. Our executive will reach out to confirm
                  your doorstep slot.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setBookingSubmitted(true);
                  }}
                  className="mt-6 space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Your Full Name
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Ramesh Kumar"
                        value={bookingData.name}
                        onChange={(e) =>
                          setBookingData({ ...bookingData, name: e.target.value })
                        }
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Phone (WhatsApp)
                      </label>
                      <input
                        required
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={bookingData.phone}
                        onChange={(e) =>
                          setBookingData({ ...bookingData, phone: e.target.value })
                        }
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Doorstep Address & Locality
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Flat/House No., Colony, City, Landmark"
                      value={bookingData.address}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, address: e.target.value })
                      }
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Primary Scrap Items
                      </label>
                      <select
                        value={bookingData.scrapType}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            scrapType: e.target.value,
                          })
                        }
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      >
                        <option value="Cardboard & Paper">Cardboard & Paper</option>
                        <option value="Iron & Metals">Iron & Metals</option>
                        <option value="Plastic & Bottles">Plastic & Bottles</option>
                        <option value="E-Waste / Electronics">
                          E-Waste / Electronics
                        </option>
                        <option value="Mixed Scrap (Everything)">
                          Mixed Scrap (Everything)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Estimated Weight
                      </label>
                      <select
                        value={bookingData.approxWeight}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            approxWeight: e.target.value,
                          })
                        }
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      >
                        <option value="10 - 25 kg">10 - 25 kg</option>
                        <option value="25 - 50 kg">25 - 50 kg</option>
                        <option value="50 - 100 kg">50 - 100 kg</option>
                        <option value="100+ kg (Bulk)">100+ kg (Bulk)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Preferred Pickup Slot
                    </label>
                    <select
                      value={bookingData.timeSlot}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, timeSlot: e.target.value })
                      }
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      <option value="Morning (09:00 AM - 12:00 PM)">
                        Morning (09:00 AM - 12:00 PM)
                      </option>
                      <option value="Afternoon (12:00 PM - 03:00 PM)">
                        Afternoon (12:00 PM - 03:00 PM)
                      </option>
                      <option value="Evening (03:00 PM - 06:00 PM)">
                        Evening (03:00 PM - 06:00 PM)
                      </option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-950/20 hover:scale-[1.01] active:scale-95 transition-all mt-4 cursor-pointer"
                  >
                    Confirm Doorstep Pickup
                  </button>
                </form>
              </div>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                  Pickup Scheduled!
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                  Thank you, <strong>{bookingData.name || "Customer"}</strong>. Our
                  team will contact you on <strong>{bookingData.phone}</strong> to
                  confirm your doorstep pickup slot.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSellModalOpen(false);
                    setBookingSubmitted(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-900 dark:text-white font-semibold text-sm transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. MODAL: FOR BUSINESS */}
      {businessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/15 p-6 sm:p-8 shadow-2xl transition-colors">
            <button
              type="button"
              onClick={() => setBusinessModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

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
      <footer className="mt-auto border-t border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-black py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <BrandLogo className="h-10 w-10" size={40} />

              <div>
                <div className="text-lg font-black text-slate-900 dark:text-white">
                  kabaad<span className="text-emerald-600 dark:text-emerald-500">se</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  घर बैठे कबाड़ बेचें, सही दाम पाएं
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-500 text-center sm:text-right">
              © {new Date().getFullYear()} KabaadSe Recycling Technologies. All
              rights reserved.
              <br />
              Digital scale weighing ISO 9001:2015 certified.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
