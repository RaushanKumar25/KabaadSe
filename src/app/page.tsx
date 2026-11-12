"use client";

import React, { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import CircularEconomy from "@/components/CircularEconomy";
import ServicesSection from "@/components/ServicesSection";
import HowItWorks from "@/components/HowItWorks";
import ImpactSection from "@/components/ImpactSection";
import ContactSection from "@/components/ContactSection";
import BrandLogo from "@/components/BrandLogo";
import {
  ChevronDown,
  ArrowRight,
  Scale,
  Zap,
  CheckCircle2,
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
      <section className="min-h-screen w-full flex flex-col justify-between items-center py-6 sm:py-8 px-6 sm:px-12 box-border relative overflow-hidden bg-[#030712] text-white">
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
        <div className="h-16 sm:h-20" />

        {/* Center Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center my-auto py-6 sm:py-8">
          {/* Main Headline with Satoshi font and professional emerald box */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.25rem] font-black text-white tracking-tight leading-[1.04] mb-3 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] select-none">
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
