"use client";

import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  MapPin,
  ChevronDown,
  Check,
  ArrowLeft,
  Sun,
  Moon,
  ShieldCheck,
  X,
  ExternalLink,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useNavigationTransition } from "@/context/NavigationTransitionContext";
import BrandLogo from "@/components/BrandLogo";
import Footer from "@/components/Footer";
import CityTransitionSplash from "@/components/CityTransitionSplash";
import {
  CITIES_LIST,
  CityName,
  ScrapCategory,
  ScrapRateItem,
  SCRAP_ITEMS_DATA,
  CITY_LOCALITIES,
  normalizeCityName,
  getCitySlug,
} from "@/lib/scrapRatesData";

function ScrapCardIcon({ item }: { item: ScrapRateItem }) {
  const [hasError, setHasError] = useState(false);

  if (item.image && !hasError) {
    return (
      <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#111315] border border-neutral-800 flex items-center justify-center p-1 shrink-0 shadow-inner group-hover:scale-105 transition-transform overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.name}
          onError={() => setHasError(true)}
          className="w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
        />
      </div>
    );
  }

  return (
    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 flex items-center justify-center text-xl sm:text-2xl shrink-0 shadow-xs group-hover:scale-105 transition-transform">
      {item.icon}
    </div>
  );
}

function RatesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, toggleTheme, mounted } = useTheme();
  const { triggerTransition } = useNavigationTransition();

  // Read city from query param if available
  const cityParam = searchParams.get("city");
  const initialMatchedCity = useMemo(() => normalizeCityName(cityParam), [cityParam]);

  const [currentStep, setCurrentStep] = useState<"city-select" | "splash" | "rates-board">(
    initialMatchedCity ? "rates-board" : "city-select"
  );
  const [selectedCity, setSelectedCity] = useState<CityName>(
    initialMatchedCity || "Patna"
  );

  // Sync state cleanly when URL query param changes directly without cascading effects
  const [prevCityParam, setPrevCityParam] = useState(cityParam);
  if (cityParam !== prevCityParam) {
    setPrevCityParam(cityParam);
    const matched = normalizeCityName(cityParam);
    if (matched) {
      setSelectedCity(matched);
      setCurrentStep("rates-board");
    } else if (!cityParam) {
      setCurrentStep("city-select");
    }
  }

  // Live rates state from DB API
  const [liveRates, setLiveRates] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    let active = true;
    const fetchLiveRates = async () => {
      try {
        const slug = getCitySlug(selectedCity);
        const res = await fetch(`/api/rates?city=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data: Array<{ id: string; price: number }> = await res.json();
          if (active && Array.isArray(data)) {
            const map: Record<string, number> = {};
            for (const item of data) {
              map[item.id] = item.price;
            }
            setLiveRates(map);
          }
        }
      } catch (err) {
        console.warn("Using offline fallback rates:", err);
      }
    };
    fetchLiveRates();
    return () => {
      active = false;
    };
  }, [selectedCity]);

  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState<ScrapCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [selectedLocality, setSelectedLocality] = useState<string | null>(null);

  const cityDropdownRef = useRef<HTMLDivElement>(null);

  // Outside click to close city dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        cityDropdownOpen &&
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(e.target as Node)
      ) {
        setCityDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [cityDropdownOpen]);

  // Handle City Selection with 2.5s Animated Cargo Truck Splash transition
  const handleSelectCity = (city: CityName) => {
    setSelectedCity(city);
    setCityDropdownOpen(false);
    setSelectedLocality(null);
    setCurrentStep("splash");

    // 2.5s Animated Green Cargo Truck Transition -> Switch to Rates Board and update URL
    setTimeout(() => {
      setCurrentStep("rates-board");
      const slug = getCitySlug(city);
      router.push(`/rates?city=${encodeURIComponent(slug)}`, { scroll: false });
    }, 2500);
  };

  // Filter items based on category, search query, and city live rates
  const filteredItems = useMemo(() => {
    return SCRAP_ITEMS_DATA.map((item) => {
      if (liveRates && liveRates[item.id] !== undefined) {
        const unit = item.price.includes("/pcs") ? "/pcs" : "/kg";
        return {
          ...item,
          price: `₹${liveRates[item.id]} ${unit}`,
        };
      }
      return item;
    }).filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, liveRates]);

  const localities = useMemo(() => {
    return (
      CITY_LOCALITIES[selectedCity] || [
        "Main Market",
        "Civil Lines",
        "Industrial Area",
        "Railway Colony",
        "Airport Road",
      ]
    );
  }, [selectedCity]);

  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-[#0a0a0a] dark:text-neutral-100 flex flex-col font-sans transition-colors duration-200">
      {/* =========================================================================
          TOP NAVIGATION BAR (STANDALONE HEADER)
          ========================================================================= */}
      <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between min-h-[68px]">
          {/* Left: Subtle "← Back to Home" button & Brand Identity */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                triggerTransition("/", 1000);
              }}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-[#5EDC1F] px-2.5 sm:px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 border border-neutral-200 dark:border-neutral-800 transition-colors shrink-0 group"
              title="Return to Home page"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                triggerTransition("/", 1000);
              }}
              className="flex items-center gap-2.5 group transition-transform duration-200 hover:scale-[1.01]"
            >
              <BrandLogo className="h-8 sm:h-9 w-auto object-contain shrink-0" />
              <div className="flex flex-col justify-center leading-none">
                <span className="text-lg sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  Kabaad<span className="text-[#5EDC1F]">Se</span>
                </span>
                <span className="hidden md:inline text-[11px] text-neutral-500 dark:text-neutral-400 font-medium tracking-wide mt-0.5">
                  घर बैठे कबाड़ बेचें, सही दाम पाएं
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Sell Scrap CTA */}
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                triggerTransition("/", 1000);
              }}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-full bg-[#5EDC1F] hover:bg-[#52c41b] text-black transition cursor-pointer flex items-center justify-center whitespace-nowrap shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              Sell Scrap
            </Link>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/20 text-neutral-800 dark:text-white transition-all duration-200 cursor-pointer"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {mounted ? (
                theme === "dark" ? (
                  <Sun className="h-4 w-4 text-amber-300 stroke-[2.2]" />
                ) : (
                  <Moon className="h-4 w-4 text-neutral-700 stroke-[2.2]" />
                )
              ) : (
                <Sun className="h-4 w-4 text-amber-300 stroke-[2.2]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          VIEW 1: CITY SELECTION ("Where do you reside?")
          ========================================================================= */}
      {currentStep === "city-select" && (
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="w-full max-w-4xl mx-auto rounded-3xl bg-neutral-50 dark:bg-[#0c0e11] border border-neutral-200 dark:border-neutral-800/90 shadow-xl p-6 sm:p-12 text-center transition-all duration-300 relative overflow-hidden">
            {/* Ambient subtle glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#5EDC1F]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="mb-8 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5EDC1F]/15 text-[#5EDC1F] text-xs font-bold uppercase tracking-wider mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5EDC1F] animate-pulse" />
                Live Scrap Benchmark
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 dark:text-white tracking-tight mb-3">
                Scrap Prices
              </h1>
              <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-medium tracking-wide max-w-lg mx-auto">
                Where do you reside? Select your city to view verified doorstep scrap rates.
              </p>
            </div>

            {/* City Pills List */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 max-w-3xl mx-auto relative z-10">
              {CITIES_LIST.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleSelectCity(city)}
                  className="px-4 sm:px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#14171a] text-sm font-semibold text-neutral-800 dark:text-neutral-300 hover:border-[#5EDC1F] hover:text-[#5EDC1F] dark:hover:border-[#5EDC1F] dark:hover:text-[#5EDC1F] hover:bg-emerald-50 dark:hover:bg-[#191d22] transition-all duration-150 cursor-pointer active:scale-95 shadow-xs"
                >
                  {city}
                </button>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-800/80 text-xs text-neutral-500 dark:text-neutral-400 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#5EDC1F]" />
              <span>Calibrated digital weighing scales • Instant cash/UPI payout guarantee</span>
            </div>
          </div>
        </main>
      )}

      {/* =========================================================================
          VIEW 2: ANIMATED GREEN CARGO TRUCK TRANSITION SPLASH (1.3s)
          ========================================================================= */}
      {currentStep === "splash" && (
        <CityTransitionSplash cityName={selectedCity} />
      )}

      {/* =========================================================================
          VIEW 3: DETAILED FULL-WIDTH RATES BOARD
          ========================================================================= */}
      {currentStep === "rates-board" && (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
          {/* Top Board Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
                  Scrap Prices
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#5EDC1F]/15 text-[#5EDC1F] text-xs font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5EDC1F] animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Current scrap benchmark rates for doorstep pickup in{" "}
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {selectedCity}
                </span>
              </p>
            </div>

            {/* Quick Change City Link */}
            <button
              type="button"
              onClick={() => {
                setCurrentStep("city-select");
                router.push("/rates", { scroll: false });
              }}
              className="self-start md:self-auto text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-[#5EDC1F] dark:hover:text-[#5EDC1F] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Change City</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </button>
          </div>

          {/* Controls Bar: City Dropdown (Left) & Search (Right) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-[#0f1115] border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-sm">
            {/* City Select Dropdown */}
            <div className="relative" ref={cityDropdownRef}>
              <button
                type="button"
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white dark:bg-[#14171a] border border-neutral-300 dark:border-neutral-800 text-sm font-semibold text-neutral-900 dark:text-white flex items-center justify-between sm:justify-start gap-3 hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors cursor-pointer shadow-xs"
                aria-expanded={cityDropdownOpen}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#5EDC1F]" />
                  <span>{selectedCity}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-500 dark:text-neutral-400 transition-transform duration-200 ${
                    cityDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Popover */}
              {cityDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 max-h-72 overflow-y-auto rounded-2xl bg-white dark:bg-[#121417] border border-neutral-200 dark:border-neutral-800 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 px-3 py-1.5 border-b border-neutral-200 dark:border-neutral-800/80 mb-1">
                    Select City
                  </div>
                  {CITIES_LIST.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleSelectCity(city)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition-colors cursor-pointer ${
                        selectedCity === city
                          ? "bg-[#5EDC1F]/15 text-[#5EDC1F] font-semibold"
                          : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-white"
                      }`}
                    >
                      <span>{city}</span>
                      {selectedCity === city && (
                        <Check className="w-4 h-4 text-[#5EDC1F]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search any materials (e.g. copper, newspaper, iron)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 text-sm bg-white dark:bg-[#14171a] border border-neutral-300 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-[#5EDC1F] dark:focus:border-[#5EDC1F] transition-colors shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {(["All", "Paper", "Plastic", "Metal", "E-waste", "Other"] as ScrapCategory[]).map(
              (cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#5EDC1F] text-black font-semibold shadow-sm"
                        : "bg-neutral-100 dark:bg-[#181b1f] text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                );
              }
            )}
          </div>

          {/* Full-Width Scrap Items Grid (NO TRUNCATION, CLEAR TEXT, INCREASED PADDING) */}
          <section aria-label="Scrap Rates Grid">
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-neutral-50 dark:bg-[#14171a] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-md transition-all duration-200 group"
                  >
                    {/* Left: Icon container + Non-truncated Item Title */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <ScrapCardIcon item={item} />
                      <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 leading-snug break-words">
                        {item.name}
                      </span>
                    </div>

                    {/* Right: High contrast Price Tag */}
                    <div className="text-right shrink-0 pl-2">
                      <span className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-[#5EDC1F] whitespace-nowrap tracking-tight">
                        {item.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 p-8 space-y-3">
                <Search className="w-10 h-10 mx-auto text-neutral-400 dark:text-neutral-600" />
                <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200">
                  No materials found matching &quot;{searchQuery}&quot;
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Try searching for general keywords like plastic, iron, paper, or copper.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="px-4 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-xs font-semibold hover:bg-neutral-300 dark:hover:bg-neutral-700 transition cursor-pointer"
                >
                  Clear search filters
                </button>
              </div>
            )}
          </section>

          {/* Locality Tags & Commercial Scrap Banner */}
          <section className="p-5 sm:p-6 rounded-3xl bg-neutral-50 dark:bg-[#0c0e11] border border-neutral-200 dark:border-neutral-800 space-y-4">
            {/* Bulk / Commercial Scrap Note */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 gap-3">
              <div>
                <span className="font-medium">Note: For Bulk scrap (Commercial) prices may vary. </span>
                <Link
                  href="/#contact"
                  className="text-emerald-600 dark:text-[#5EDC1F] hover:underline font-bold inline-flex items-center gap-1"
                >
                  <span>Contact us to know more</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              <Link
                href="/"
                className="px-4 py-2 rounded-full bg-[#5EDC1F] hover:bg-[#52c41b] text-black font-bold text-xs transition cursor-pointer self-start sm:self-auto shrink-0 shadow-sm"
              >
                Schedule Doorstep Pickup
              </Link>
            </div>

            {/* Locality Pills */}
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
              <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-2.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#5EDC1F]" />
                <span>Check scrap rates of specific locality in {selectedCity}</span>
                {selectedLocality && (
                  <span className="text-emerald-600 dark:text-[#5EDC1F] font-semibold">
                    • Active: {selectedLocality}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {localities.map((loc) => {
                  const isLocSelected = selectedLocality === loc;
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setSelectedLocality(isLocSelected ? null : loc)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        isLocSelected
                          ? "bg-[#5EDC1F] text-black font-semibold shadow-xs"
                          : "border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#121417] text-neutral-700 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-[#5EDC1F]/60"
                      }`}
                    >
                      {loc}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default function RatesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-neutral-300 dark:border-neutral-800 border-t-[#5EDC1F] animate-spin" />
        </div>
      }
    >
      <RatesPageContent />
    </Suspense>
  );
}
