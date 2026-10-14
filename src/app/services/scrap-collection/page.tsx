"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Download,
  CalendarCheck,
  CheckCircle2,
  Droplets,
  Trees,
  Zap,
  Fuel,
  ArrowRight,
  Star,
  Quote,
  X,
  Search,
  ChevronDown,
  Layers,
  Recycle,
  Truck,
  Building2,
  PackageCheck,
  BookOpen,
  Bed,
  Box,
  Boxes,
  Sparkles,
  Car,
  ShieldCheck,
  Trash2,
  Leaf,
  Users,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface ScrapRate {
  id: string;
  name: string;
  category: "Paper" | "Plastic" | "Metals" | "E-Waste";
  rate: number;
  unit: string;
  badge?: string;
}

const SCRAP_RATES: ScrapRate[] = [
  { id: "newspaper", name: "Newspaper (Akbhar)", category: "Paper", rate: 16, unit: "kg", badge: "Trending" },
  { id: "cardboard", name: "Corrugated Cardboard (Gatta)", category: "Paper", rate: 14, unit: "kg", badge: "High Demand" },
  { id: "books", name: "Office Paper / Books / Notebooks", category: "Paper", rate: 15, unit: "kg" },
  { id: "copper", name: "Copper Wire & Utensils", category: "Metals", rate: 460, unit: "kg", badge: "Highest Value" },
  { id: "brass", name: "Brass (Peetal)", category: "Metals", rate: 340, unit: "kg" },
  { id: "aluminum", name: "Aluminum", category: "Metals", rate: 125, unit: "kg" },
  { id: "iron", name: "Iron & Steel (Loha)", category: "Metals", rate: 28, unit: "kg" },
  { id: "pet-bottles", name: "PET Bottles & Hard Plastic", category: "Plastic", rate: 14, unit: "kg" },
  { id: "soft-plastic", name: "Polythene & Mix Plastic", category: "Plastic", rate: 8, unit: "kg" },
  { id: "ewaste-pc", name: "Desktop CPU / Laptops / PCB", category: "E-Waste", rate: 320, unit: "piece", badge: "Certified" },
  { id: "batteries", name: "Lead Acid Batteries (Inverter/Car)", category: "E-Waste", rate: 85, unit: "kg" },
];

export default function ScrapCollectionPage() {
  const { theme, toggleTheme } = useTheme();

  // Modal states
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [rateListModalOpen, setRateListModalOpen] = useState(false);

  // Phone Mockup interactive category states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "papers",
    "plastics",
  ]);

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

  // Rate list search and filter
  const [rateSearch, setRateSearch] = useState("");
  const [rateCategory, setRateCategory] = useState("All");

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSubmitted(true);
  };

  const filteredScrapRates = SCRAP_RATES.filter((item) => {
    const matchesCategory = rateCategory === "All" || item.category === rateCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(rateSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(rateSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#5EDC1F] selection:text-black">
      {/* GLOBAL NAVBAR (Always visible and fixed on service page) */}
      <Navbar
        alwaysVisible={true}
        onOpenSellModal={() => setSellModalOpen(true)}
        onOpenRateList={() => setRateListModalOpen(true)}
      />

      {/* 1. SECTION 1: HERO & INTERACTIVE BOOKING MOCKUP */}
      <section className="relative min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-24 px-6 sm:px-12 flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
        {/* Subtle background ambient gradients */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#5EDC1F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-[#5EDC1F]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-black text-white tracking-tight leading-[1.08]">
              Sell your scrap in just few clicks!
            </h1>

            <p className="text-neutral-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-xl">
              In this evolving technological world, let your kabaad find a
              kabadiwala, <span className="text-[#5EDC1F] font-bold">ONLINE!</span>
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setSellModalOpen(true)}
                className="px-7 py-3.5 rounded-full bg-[#5EDC1F] hover:bg-[#52c41b] text-black font-semibold text-sm sm:text-base transition duration-200 shadow-lg shadow-[#5EDC1F]/20 cursor-pointer flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <CalendarCheck className="w-5 h-5 stroke-[2.2]" />
                <span>Raise Pickup Request</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  alert("KabaadSe Mobile App is currently available for Android & iOS! Direct booking is active right now on this web platform.");
                }}
                className="px-6 py-3.5 rounded-full border border-white/20 hover:border-white/40 text-white font-medium text-sm sm:text-base hover:bg-white/10 transition duration-200 cursor-pointer flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                <span>Download App</span>
              </button>
            </div>

            {/* Micro Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 max-w-lg">
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#5EDC1F]">40+</div>
                <div className="text-xs text-neutral-400">Recyclable Grades</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">100%</div>
                <div className="text-xs text-neutral-400">Digital Weighing</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">Instant</div>
                <div className="text-xs text-neutral-400">UPI / Cash Payout</div>
              </div>
            </div>
          </div>

          {/* Right Column: Phone Container with Green Circular Background (Matches Screenshot 1 & 2) */}
          <div className="lg:col-span-6 flex justify-center items-center relative">
            {/* Concentric Green Graphic Radiance behind Phone */}
            <div className="absolute w-[360px] sm:w-[460px] h-[360px] sm:h-[460px] rounded-full border border-[#5EDC1F]/20 flex items-center justify-center pointer-events-none">
              <div className="w-[300px] sm:w-[380px] h-[300px] sm:h-[380px] rounded-full border-2 border-[#5EDC1F]/30 flex items-center justify-center">
                <div className="w-[240px] sm:w-[300px] h-[240px] sm:h-[300px] rounded-full bg-gradient-to-tr from-[#5EDC1F]/20 to-transparent blur-md" />
              </div>
            </div>

            {/* Smartphone Mockup */}
            <div className="relative w-[320px] sm:w-[350px] rounded-[42px] border-[7px] border-neutral-800 bg-[#121417] p-2.5 shadow-[0_25px_70px_-10px_rgba(0,0,0,0.95)] z-10 select-none">
              {/* Speaker & Sensor Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-neutral-900 rounded-full z-20 flex items-center justify-center">
                <div className="w-10 h-1 bg-neutral-700 rounded-full" />
              </div>

              {/* Screen Shell */}
              <div className="rounded-[32px] overflow-hidden bg-white text-neutral-900 flex flex-col h-[580px] justify-between">
                {/* App Top Header Bar */}
                <div className="bg-[#5EDC1F] text-black px-4 pt-6 pb-3 rounded-b-2xl shadow-sm">
                  <div className="flex items-center justify-between text-[11px] font-bold mb-1 opacity-80">
                    <span>9:41</span>
                    <span className="flex items-center gap-1">5G • 100%</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-left">
                      <div className="text-[10px] font-medium uppercase tracking-wider text-black/75">
                        Pickup Location - Home
                      </div>
                      <div className="text-xs font-bold text-black flex items-center gap-1">
                        <span>Arera Colony, Bhopal</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center font-bold text-xs">
                      P
                    </div>
                  </div>
                </div>

                {/* Inner Screen Content Body */}
                <div className="px-4 py-3 text-left overflow-y-auto flex-1 space-y-3">
                  <div>
                    <span className="text-[11px] text-neutral-500 font-medium">Good morning Prakash</span>
                    <h3 className="text-base font-extrabold text-neutral-900 leading-tight">
                      What would you like to sell?
                    </h3>
                  </div>

                  {/* 2-Column Category Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {/* Item 1: Papers */}
                    <button
                      type="button"
                      onClick={() => toggleCategory("papers")}
                      className={`p-2.5 rounded-xl border text-left transition relative cursor-pointer ${
                        selectedCategories.includes("papers")
                          ? "border-[#5EDC1F] bg-[#5EDC1F]/10 ring-1 ring-[#5EDC1F]"
                          : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Box className="w-5 h-5 text-neutral-700" />
                        <div
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            selectedCategories.includes("papers")
                              ? "bg-[#5EDC1F] border-[#5EDC1F]"
                              : "border-neutral-300"
                          }`}
                        >
                          {selectedCategories.includes("papers") && (
                            <CheckCircle2 className="w-3 h-3 text-black stroke-[3]" />
                          )}
                        </div>
                      </div>
                      <div className="text-xs font-bold text-neutral-900">Papers</div>
                      <div className="text-[9px] text-neutral-500 line-clamp-1 mt-0.5">
                        Newspapers, Books, etc.
                      </div>
                    </button>

                    {/* Item 2: Plastics */}
                    <button
                      type="button"
                      onClick={() => toggleCategory("plastics")}
                      className={`p-2.5 rounded-xl border text-left transition relative cursor-pointer ${
                        selectedCategories.includes("plastics")
                          ? "border-[#5EDC1F] bg-[#5EDC1F]/10 ring-1 ring-[#5EDC1F]"
                          : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Recycle className="w-5 h-5 text-neutral-700" />
                        <div
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            selectedCategories.includes("plastics")
                              ? "bg-[#5EDC1F] border-[#5EDC1F]"
                              : "border-neutral-300"
                          }`}
                        >
                          {selectedCategories.includes("plastics") && (
                            <CheckCircle2 className="w-3 h-3 text-black stroke-[3]" />
                          )}
                        </div>
                      </div>
                      <div className="text-xs font-bold text-neutral-900">Plastics</div>
                      <div className="text-[9px] text-neutral-500 line-clamp-1 mt-0.5">
                        Oil container, bottles, etc.
                      </div>
                    </button>

                    {/* Item 3: Metals */}
                    <button
                      type="button"
                      onClick={() => toggleCategory("metals")}
                      className={`p-2.5 rounded-xl border text-left transition relative cursor-pointer ${
                        selectedCategories.includes("metals")
                          ? "border-[#5EDC1F] bg-[#5EDC1F]/10 ring-1 ring-[#5EDC1F]"
                          : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Building2 className="w-5 h-5 text-neutral-700" />
                        <div
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            selectedCategories.includes("metals")
                              ? "bg-[#5EDC1F] border-[#5EDC1F]"
                              : "border-neutral-300"
                          }`}
                        >
                          {selectedCategories.includes("metals") && (
                            <CheckCircle2 className="w-3 h-3 text-black stroke-[3]" />
                          )}
                        </div>
                      </div>
                      <div className="text-xs font-bold text-neutral-900">Metals</div>
                      <div className="text-[9px] text-neutral-500 line-clamp-1 mt-0.5">
                        Utensils, coolers, iron, etc.
                      </div>
                    </button>

                    {/* Item 4: E-Waste */}
                    <button
                      type="button"
                      onClick={() => toggleCategory("ewaste")}
                      className={`p-2.5 rounded-xl border text-left transition relative cursor-pointer ${
                        selectedCategories.includes("ewaste")
                          ? "border-[#5EDC1F] bg-[#5EDC1F]/10 ring-1 ring-[#5EDC1F]"
                          : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Zap className="w-5 h-5 text-neutral-700" />
                        <div
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            selectedCategories.includes("ewaste")
                              ? "bg-[#5EDC1F] border-[#5EDC1F]"
                              : "border-neutral-300"
                          }`}
                        >
                          {selectedCategories.includes("ewaste") && (
                            <CheckCircle2 className="w-3 h-3 text-black stroke-[3]" />
                          )}
                        </div>
                      </div>
                      <div className="text-xs font-bold text-neutral-900">E-waste</div>
                      <div className="text-[9px] text-neutral-500 line-clamp-1 mt-0.5">
                        Computers, keyboards, etc.
                      </div>
                    </button>
                  </div>

                  {/* Item 5: Other Items (Spans full width) */}
                  <button
                    type="button"
                    onClick={() => toggleCategory("other")}
                    className={`w-full p-2.5 rounded-xl border text-left transition relative cursor-pointer ${
                      selectedCategories.includes("other")
                        ? "border-[#5EDC1F] bg-[#5EDC1F]/10 ring-1 ring-[#5EDC1F]"
                        : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PackageCheck className="w-4 h-4 text-neutral-700" />
                        <span className="text-xs font-bold text-neutral-900">Appliances & Other Items</span>
                      </div>
                      <div
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          selectedCategories.includes("other")
                            ? "bg-[#5EDC1F] border-[#5EDC1F]"
                            : "border-neutral-300"
                        }`}
                      >
                        {selectedCategories.includes("other") && (
                          <CheckCircle2 className="w-3 h-3 text-black stroke-[3]" />
                        )}
                      </div>
                    </div>
                    <div className="text-[9px] text-neutral-500 line-clamp-1 mt-0.5 pl-6">
                      Refrigerators, washing machines, batteries, etc.
                    </div>
                  </button>

                  {/* Disclaimer note */}
                  <div className="pt-1 text-center">
                    <p className="text-[10px] text-neutral-400 font-medium">
                      We do not pickup wood, cloth and glasses
                    </p>
                  </div>

                  {/* In-App Action Button */}
                  <button
                    type="button"
                    onClick={() => setSellModalOpen(true)}
                    className="w-full py-3 rounded-xl bg-[#5EDC1F] hover:bg-[#52c41b] text-black font-bold text-xs tracking-tight transition duration-150 shadow-md cursor-pointer text-center"
                  >
                    Raise pickup request
                  </button>
                </div>

                {/* Bottom App Navigation Bar */}
                <div className="border-t border-neutral-100 bg-white px-6 py-2.5 flex items-center justify-around text-[10px] font-bold">
                  <button
                    type="button"
                    className="flex flex-col items-center gap-0.5 text-[#5EDC1F] cursor-pointer"
                  >
                    <Recycle className="w-4 h-4" />
                    <span>Sell scrap</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRateListModalOpen(true)}
                    className="flex flex-col items-center gap-0.5 text-neutral-400 hover:text-neutral-700 transition cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>Rate list</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION 2: ENVIRONMENTAL CONTRIBUTION (MATCHES SCREENSHOT 1 & 2) */}
      <section className="py-20 sm:py-28 px-6 sm:px-12 bg-[#0a0a0a] border-t border-neutral-900 relative">
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left: Visual card with Green Leaf Hand */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-72 sm:w-80 md:w-96 aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white">
              <Image
                src="/images/eco-hand-leaf.jpg"
                alt="Human hand painted green gently holding a fresh plant twig"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 320px, 400px"
              />
            </div>
          </div>

          {/* Right: Environmental Impact Description & 4 Stats */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Know your{" "}
              <span className="text-[#5EDC1F]">Contribution</span> to the{" "}
              <br className="hidden sm:inline" />
              environment
            </h2>

            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              The KabaadSe app allows you to check your environmental impact for the
              scrap you sold to us. The impact is shown in terms of the natural
              resources you saved from exploitation or the units of energy you
              preserved for a sustainable future.
            </p>

            {/* 4 Icon Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4">
              {/* Stat 1: Water */}
              <div className="flex flex-col items-start gap-2">
                <div className="w-12 h-12 rounded-2xl bg-[#5EDC1F]/15 border border-[#5EDC1F]/30 flex items-center justify-center text-[#5EDC1F]">
                  <Droplets className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white block">Water</span>
                  <span className="text-xs text-[#5EDC1F] font-semibold mt-0.5 block">
                    30,000+ L Saved
                  </span>
                </div>
              </div>

              {/* Stat 2: Trees */}
              <div className="flex flex-col items-start gap-2">
                <div className="w-12 h-12 rounded-2xl bg-[#5EDC1F]/15 border border-[#5EDC1F]/30 flex items-center justify-center text-[#5EDC1F]">
                  <Trees className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white block">Trees</span>
                  <span className="text-xs text-[#5EDC1F] font-semibold mt-0.5 block">
                    1,200+ Preserved
                  </span>
                </div>
              </div>

              {/* Stat 3: Electricity */}
              <div className="flex flex-col items-start gap-2">
                <div className="w-12 h-12 rounded-2xl bg-[#5EDC1F]/15 border border-[#5EDC1F]/30 flex items-center justify-center text-[#5EDC1F]">
                  <Zap className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white block">Electricity</span>
                  <span className="text-xs text-[#5EDC1F] font-semibold mt-0.5 block">
                    8,400+ kWh Cut
                  </span>
                </div>
              </div>

              {/* Stat 4: Oil */}
              <div className="flex flex-col items-start gap-2">
                <div className="w-12 h-12 rounded-2xl bg-[#5EDC1F]/15 border border-[#5EDC1F]/30 flex items-center justify-center text-[#5EDC1F]">
                  <Fuel className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white block">Oil</span>
                  <span className="text-xs text-[#5EDC1F] font-semibold mt-0.5 block">
                    950+ L Conserved
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION 3: B2C / CROSS-SERVICE TEASER BANNERS (SCREENSHOTS 3, 4, 5) */}
      <section className="py-20 sm:py-24 px-6 sm:px-12 bg-[#0c0d0e] border-t border-neutral-900 space-y-16">
        <div className="max-w-6xl w-full mx-auto space-y-14">
          {/* BANNER A: VEHICLE SCRAPPING (MATCHES SCREENSHOT 3) */}
          <div className="rounded-3xl border border-neutral-800 bg-gradient-to-br from-[#1c1613] via-[#15171a] to-[#0c0d0e] p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-2xl text-left">
            <div className="max-w-3xl relative z-10 space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Want to get rid of your old vehicle?
              </h2>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-normal">
                Let go of your age old unfit motor that doesn&apos;t serve its purpose neither to you
                nor to the environment & help bring circularity in the Indian automobile sector.
              </p>
            </div>

            {/* 3 Pillar Cards (Why, Benefits, Our Solution - Screenshot 3 match) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 mt-8 relative z-10">
              {/* Card 1: Why */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#162740]/90 border border-blue-900/40 text-left flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-white">Why</h3>
                    <span className="w-6 h-6 rounded-full bg-blue-950 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                  </div>
                  <p className="text-xs text-blue-100/80 leading-relaxed font-normal">
                    A vehicle as old as 10 to 15 years becomes unfit to drive on roads due to its
                    decreased efficiency and increased carbon emissions, making it prone to road
                    accidents, requires high maintenance, and causes extensive harm to the environment.
                  </p>
                </div>
              </div>

              {/* Card 2: Benefits */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#162740]/90 border border-blue-900/40 text-left flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-white">Benefits</h3>
                    <span className="w-6 h-6 rounded-full bg-blue-950 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                  </div>
                  <p className="text-xs text-blue-100/80 leading-relaxed font-normal">
                    Adhering to the Vehicle Scrappage Policy of 2021, the right disposal of the
                    scrapped vehicle is streamlined, thus helping to establish a circular economy
                    in the automobile sector. While you enjoy perks like no registration fee on your
                    new purchase & road taxes waiver.
                  </p>
                </div>
              </div>

              {/* Card 3: Our Solution */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#162740]/90 border border-blue-900/40 text-left flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-white">Our Solution</h3>
                    <span className="w-6 h-6 rounded-full bg-blue-950 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                  </div>
                  <p className="text-xs text-blue-100/80 leading-relaxed font-normal">
                    When your vehicle becomes unfit to be on roads, KabaadSe provides solutions for
                    its right disposal while giving fair value against it. We also issue a certified
                    vehicle scrapping certificate (COD) so that you can avail benefits under the
                    Vehicle Scrappage Policy 2021.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4 relative z-10">
              <button
                type="button"
                onClick={() => setSellModalOpen(true)}
                className="px-6 py-3 rounded-full bg-[#5EDC1F] hover:bg-[#52c41b] text-black font-bold text-xs uppercase tracking-wider transition cursor-pointer"
              >
                Request Vehicle Scrapping
              </button>
            </div>
          </div>

          {/* BANNER B: KNOW YOUR WASTE (SOURCE SEGREGATION BANNER) */}
          <div className="rounded-3xl border border-neutral-800 bg-[#121417] p-6 sm:p-10 lg:p-12 text-left relative overflow-hidden shadow-2xl">
            <div className="max-w-2xl space-y-3 mb-8">
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Source Segregation is Key to Circularity
              </h2>
              <p className="text-neutral-400 text-sm leading-relaxed font-normal">
                Segregating at source makes 90% of household waste recoverable. Here is how simple it is:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category 1: Dry Waste */}
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-blue-500/50 transition">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center mb-4">
                  <Box className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white">Dry Recyclables</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400">
                    Blue Bin
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Paper, cardboard, PET bottles, glass containers, metal cans, electronics.
                  <strong> 100% picked up and paid for by KabaadSe.</strong>
                </p>
              </div>

              {/* Category 2: Wet / Kitchen Waste */}
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-green-500/50 transition">
                <div className="w-10 h-10 rounded-xl bg-green-500/15 text-green-400 flex items-center justify-center mb-4">
                  <Leaf className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white">Wet / Kitchen Waste</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-400">
                    Green Bin
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Vegetable peels, fruit rinds, leftover food, tea bags, garden trimmings.
                  Ideal for home and society organic composting.
                </p>
              </div>

              {/* Category 3: Domestic Hazardous Waste */}
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-red-500/50 transition">
                <div className="w-10 h-10 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white">Domestic Hazardous</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400">
                    Red Bin
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Batteries, tube lights, paint cans, expired medicines, pesticide bottles.
                  Safely isolated for authorized scientific disposal.
                </p>
              </div>
            </div>
          </div>

          {/* BANNER C: ZERO WASTE SOCIETIES */}
          <div className="rounded-3xl border border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 p-6 sm:p-10 lg:p-12 text-left relative overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Zero Waste Societies & Gated Complexes
                </h2>
                <p className="text-neutral-300 text-sm leading-relaxed max-w-2xl font-normal">
                  Turn your residential society into an eco-certified zero-landfill hub.
                  We provide doorstep dual-bin sorting systems, decentralized organic composting,
                  and scheduled bulk dry scrap collection that monetizes waste for society funds.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <span className="text-xs font-medium px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-neutral-300">
                    ✓ 85%+ Landfill Diversion
                  </span>
                  <span className="text-xs font-medium px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-neutral-300">
                    ✓ RWA Revenue Monetization
                  </span>
                  <span className="text-xs font-medium px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-neutral-300">
                    ✓ Swachh Survekshan Boost
                  </span>
                </div>
              </div>
              <div className="lg:col-span-4 flex justify-start lg:justify-end">
                <button
                  type="button"
                  onClick={() => setSellModalOpen(true)}
                  className="px-6 py-3.5 rounded-full bg-[#5EDC1F] hover:bg-[#52c41b] text-black font-bold text-sm tracking-wide transition cursor-pointer shadow-lg shadow-[#5EDC1F]/20"
                >
                  Partner Your Society
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION 4: PROCESS FLOW (WHAT WE DO WITH YOUR WASTE) */}
      <section className="py-20 sm:py-28 px-6 sm:px-12 bg-[#0a0a0a] border-t border-neutral-900 relative">
        <div className="max-w-6xl w-full mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            What we do with your Waste
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base mt-2 max-w-2xl mx-auto font-normal">
            Every gram of scrap collected from your doorstep is responsibly segregated,
            processed, and channelized directly back into industrial manufacturing.
          </p>

          {/* 4-Step Flow Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 text-left">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-[#5EDC1F]/40 transition group relative">
              <span className="text-3xl font-black text-[#5EDC1F]/30 group-hover:text-[#5EDC1F] transition mb-4 block">
                01
              </span>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#5EDC1F] mb-4">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Certified Digital Weighing
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                Our trained eco-executives weigh all recyclables using an ISO-calibrated
                digital scale right in front of you with instant UPI credit.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-[#5EDC1F]/40 transition group relative">
              <span className="text-3xl font-black text-[#5EDC1F]/30 group-hover:text-[#5EDC1F] transition mb-4 block">
                02
              </span>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#5EDC1F] mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Scientific Segregation
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                Collected scrap is unloaded at our regional MRF facility and categorized into
                40+ granular polymer and paper grades.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-[#5EDC1F]/40 transition group relative">
              <span className="text-3xl font-black text-[#5EDC1F]/30 group-hover:text-[#5EDC1F] transition mb-4 block">
                03
              </span>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#5EDC1F] mb-4">
                <Box className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                High-Density Baling
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                Hydraulic compactor balers press sorted scrap into dense cubes,
                reducing freight volume and drastically decreasing transport emissions.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-[#5EDC1F]/40 transition group relative">
              <span className="text-3xl font-black text-[#5EDC1F]/30 group-hover:text-[#5EDC1F] transition mb-4 block">
                04
              </span>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#5EDC1F] mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Authorized Smelters & Mills
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                Materials are dispatched to certified recyclers to be reconstituted into
                fresh paper, recycled yarn, and secondary metal ingots.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION 5: OUR INITIATIVES */}
      <section className="py-20 sm:py-28 px-6 sm:px-12 bg-[#0c0d0e] border-t border-neutral-900 relative">
        <div className="max-w-6xl w-full mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Our Initiatives
            </h2>
            <p className="text-[#5EDC1F] font-semibold text-sm sm:text-base mt-2">
              Small steps towards sustainability.
            </p>
          </div>

          {/* Grid of 5 Key Initiatives */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Initiative 1: Tetra Pak */}
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between hover:border-[#5EDC1F]/50 transition duration-200">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#5EDC1F]/15 text-[#5EDC1F] flex items-center justify-center">
                    <Box className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300">
                    Carton Upcycling
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Tetra Pak Recycling Drive
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                  Multi-layered beverage cartons are collected from households and
                  hot-pressed into water-resistant recycled roof sheets and school desks.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-[#5EDC1F] font-semibold">
                <span>50,000+ Cartons Diverted</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Initiative 2: Mattress Circular Journey */}
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between hover:border-[#5EDC1F]/50 transition duration-200">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#5EDC1F]/15 text-[#5EDC1F] flex items-center justify-center">
                    <Bed className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300">
                    Bulky Waste
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Mattress Circular Journey
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                  Diverting bulky discarded foam and coir mattresses from municipal dumps,
                  reclaiming steel inner-springs and shredding foam for acoustic insulation.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-[#5EDC1F] font-semibold">
                <span>Zero Dumpyard Burning</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Initiative 3: Tree Plantation */}
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between hover:border-[#5EDC1F]/50 transition duration-200">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#5EDC1F]/15 text-[#5EDC1F] flex items-center justify-center">
                    <Trees className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300">
                    Afforestation
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Tree Plantation Initiative
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                  For every 100 kg of newspaper or office cardboard recycled through KabaadSe,
                  we plant a geotagged native tree sapling on behalf of the customer.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-[#5EDC1F] font-semibold">
                <span>1,200+ Trees Planted</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Initiative 4: Kitab Ghar */}
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between hover:border-[#5EDC1F]/50 transition duration-200">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#5EDC1F]/15 text-[#5EDC1F] flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300">
                    Education & Social
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Kitab Ghar (Community Libraries)
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                  Used school textbooks, storybooks, and competitive exam guides are vetted
                  and channeled to create free learning centers for underprivileged kids.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-[#5EDC1F] font-semibold">
                <span>15+ Libraries Built</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Initiative 5: Plastic Wall Experiment */}
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between hover:border-[#5EDC1F]/50 transition duration-200 lg:col-span-2">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#5EDC1F]/15 text-[#5EDC1F] flex items-center justify-center">
                    <Boxes className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300">
                    Innovation Lab
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Plastic Wall & Eco-Paver Experiment
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                  Low-density multi-layered plastic wrappers (MLP chips packets, sachets) are shredded,
                  melt-molded with sand, and transformed into high-load interlocking boundary wall blocks.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-[#5EDC1F] font-semibold">
                <span>10+ Tons Non-recyclable Plastic Bound</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECTION 6: CUSTOMER REVIEWS (TESTIMONIALS) */}
      <section className="py-20 sm:py-28 px-6 sm:px-12 bg-[#0a0a0a] border-t border-neutral-900 relative">
        <div className="max-w-6xl w-full mx-auto text-left">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Reviews
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base mt-2 font-normal">
              Check out our customer&apos;s scrap selling experiences!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Review 1 */}
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-neutral-700" />
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed font-normal">
                  &ldquo;Very punctual! The executive came with a digital scale, weighed everything
                  in front of me, and sent ₹850 directly to my UPI within 2 minutes. No bargaining!&rdquo;
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Anita Sharma</div>
                  <div className="text-xs text-neutral-500">Arera Colony, Bhopal</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#5EDC1F]/15 text-[#5EDC1F]">
                  Verified
                </span>
              </div>
            </div>

            {/* Review 2 */}
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-neutral-700" />
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed font-normal">
                  &ldquo;We partnered with KabaadSe for our 350-flat apartment society. Our dry
                  waste is now 100% monetized, and our society looks cleaner than ever.&rdquo;
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Dr. Rajiv Menon</div>
                  <div className="text-xs text-neutral-500">RWA President, Indirapuram</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#5EDC1F]/15 text-[#5EDC1F]">
                  Society Partner
                </span>
              </div>
            </div>

            {/* Review 3 */}
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-neutral-700" />
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed font-normal">
                  &ldquo;Selling old office computer towers and 150 kg of archive files was seamless.
                  Professional digital receipt and guaranteed certified recycling.&rdquo;
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Vikramaditya Singh</div>
                  <div className="text-xs text-neutral-500">Patna, Bihar</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#5EDC1F]/15 text-[#5EDC1F]">
                  Verified
                </span>
              </div>
            </div>

            {/* Review 4 */}
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-neutral-700" />
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed font-normal">
                  &ldquo;No more haggling with street kabadiwalas who manipulate physical analog
                  balances. KabaadSe brings true dignity and transparency to the process!&rdquo;
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Priya Mukherjee</div>
                  <div className="text-xs text-neutral-500">Vijay Nagar, Indore</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#5EDC1F]/15 text-[#5EDC1F]">
                  Verified
                </span>
              </div>
            </div>

            {/* Review 5 */}
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-neutral-700" />
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed font-normal">
                  &ldquo;Booked a slot on Sunday morning, truck arrived at 11:30 AM sharp.
                  Checked rate list beforehand on the web and got the exact rate per kg.&rdquo;
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Harsh Vardhan</div>
                  <div className="text-xs text-neutral-500">Kankarbagh, Patna</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#5EDC1F]/15 text-[#5EDC1F]">
                  Verified
                </span>
              </div>
            </div>

            {/* CTA Card inside reviews */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#5EDC1F]/20 to-neutral-900 border border-[#5EDC1F]/40 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#5EDC1F]">
                  Ready to sell?
                </span>
                <h3 className="text-xl font-black text-white mt-2">
                  Experience hassle-free doorstep pickup today.
                </h3>
                <p className="text-xs text-neutral-300 mt-2">
                  Schedule your free pickup slot in 60 seconds with verified digital weighing.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSellModalOpen(true)}
                className="w-full py-3 rounded-full bg-[#5EDC1F] hover:bg-[#52c41b] text-black font-bold text-xs tracking-tight transition cursor-pointer mt-4 text-center"
              >
                Book Doorstep Pickup Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* GLOBAL FOOTER */}
      <Footer
        onOpenSellModal={() => setSellModalOpen(true)}
        onOpenBusinessModal={() => setSellModalOpen(true)}
      />

      {/* PICKUP BOOKING MODAL */}
      {sellModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-2xl text-left transition-colors">
            <div className="absolute top-5 right-5 flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-full text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-amber-400" />
                ) : (
                  <Moon className="h-5 w-5 text-neutral-700" />
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSellModalOpen(false);
                  setBookingSubmitted(false);
                }}
                className="p-2 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {!bookingSubmitted ? (
              <div>
                <div className="flex items-center gap-2 text-[#5EDC1F] mb-1">
                  <CalendarCheck className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Instant Booking
                  </span>
                </div>
                <h3 className="text-2xl font-black text-neutral-900 dark:text-white">
                  Schedule Scrap Pickup
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                  Verified executive with calibrated digital scale will visit your doorstep.
                </p>

                <form onSubmit={handleBookingSubmit} className="mt-5 space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={bookingData.name}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, name: e.target.value })
                      }
                      className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-750 rounded-xl px-3.5 py-2.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-[#5EDC1F] focus:ring-1 focus:ring-[#5EDC1F] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Phone Number *
                      </label>
                      <input
                        required
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={bookingData.phone}
                        onChange={(e) =>
                          setBookingData({ ...bookingData, phone: e.target.value })
                        }
                        className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-750 rounded-xl px-3.5 py-2.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-[#5EDC1F] focus:ring-1 focus:ring-[#5EDC1F] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Approx Weight
                      </label>
                      <select
                        value={bookingData.approxWeight}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            approxWeight: e.target.value,
                          })
                        }
                        className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-750 rounded-xl px-3 py-2.5 text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-[#5EDC1F] focus:ring-1 focus:ring-[#5EDC1F] transition-colors"
                      >
                        <option value="10-20 kg" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">10 - 20 kg</option>
                        <option value="20-50 kg" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">20 - 50 kg</option>
                        <option value="50-100 kg" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">50 - 100 kg</option>
                        <option value="100+ kg" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">100+ kg (Bulk)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Complete Address *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Flat/House No., Society/Locality, City..."
                      value={bookingData.address}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, address: e.target.value })
                      }
                      className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-750 rounded-xl px-3.5 py-2 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-[#5EDC1F] focus:ring-1 focus:ring-[#5EDC1F] resize-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-[#5EDC1F] hover:bg-[#52c41b] text-black font-bold text-sm shadow-xl shadow-[#5EDC1F]/20 transition cursor-pointer mt-2 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    Confirm Doorstep Pickup
                  </button>
                </form>
              </div>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#5EDC1F]/20 text-[#5EDC1F] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h4 className="text-2xl font-black text-neutral-900 dark:text-white">
                  Pickup Scheduled!
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-sm mx-auto">
                  Thank you, <strong>{bookingData.name || "Customer"}</strong>. Our executive
                  will contact you on <strong>{bookingData.phone}</strong> to confirm your slot.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSellModalOpen(false);
                    setBookingSubmitted(false);
                  }}
                  className="px-6 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/20 text-neutral-800 dark:text-white font-semibold text-sm transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RATE LIST MODAL */}
      {rateListModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden text-left transition-colors">
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#5EDC1F]/15 text-[#5EDC1F] text-xs font-bold uppercase tracking-wider mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5EDC1F] animate-pulse" />
                  Live Market Rates
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
                  Today&apos;s Scrap Rate List
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                  aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                  title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5 text-amber-400" />
                  ) : (
                    <Moon className="h-5 w-5 text-neutral-700" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setRateListModalOpen(false)}
                  className="p-2 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-4 sm:px-6 bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search scrap item (e.g. copper, newspaper, iron, laptop)..."
                  value={rateSearch}
                  onChange={(e) => setRateSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-[#5EDC1F] transition-colors"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {["All", "Paper", "Metals", "Plastic", "E-Waste"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setRateCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      rateCategory === cat
                        ? "bg-[#5EDC1F] text-black shadow-xs font-bold"
                        : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Rates Grid / List */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-2.5 max-h-[46vh]">
              {filteredScrapRates.length > 0 ? (
                filteredScrapRates.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-neutral-50/80 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3 hover:border-[#5EDC1F]/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-neutral-900 dark:text-white">
                          {item.name}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#5EDC1F]/15 text-[#5EDC1F]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        Category: {item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-base sm:text-lg font-black text-[#5EDC1F]">
                          ₹{item.rate}
                          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                            /{item.unit}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setRateListModalOpen(false);
                          setSellModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#5EDC1F] hover:bg-[#52c41b] text-black font-bold text-xs transition cursor-pointer whitespace-nowrap"
                      >
                        Sell Now
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                  No items found matching &quot;{rateSearch}&quot;
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 flex items-center justify-between gap-4">
              <span className="text-xs text-neutral-600 dark:text-neutral-400">
                100% certified digital scale weighing at your doorstep.
              </span>
              <button
                type="button"
                onClick={() => {
                  setRateListModalOpen(false);
                  setSellModalOpen(true);
                }}
                className="px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-bold text-xs transition cursor-pointer shrink-0"
              >
                Schedule Pickup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
