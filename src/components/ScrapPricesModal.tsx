"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import CityTransitionSplash from "@/components/CityTransitionSplash";
import {
  X,
  Search,
  MapPin,
  ChevronDown,
  Check,
  Sparkles,
} from "lucide-react";
import {
  CITIES_LIST,
  CityName,
  ScrapCategory,
  ScrapRateItem,
  SCRAP_ITEMS_DATA,
  CITY_LOCALITIES,
} from "@/lib/scrapRatesData";

export {
  CITIES_LIST,
  SCRAP_ITEMS_DATA,
  CITY_LOCALITIES,
};
export type { CityName, ScrapCategory, ScrapRateItem };

interface ScrapPricesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCity?: CityName;
  onOpenSellModal?: () => void;
}

export default function ScrapPricesModal({
  isOpen,
  onClose,
  initialCity = "Patna",
  onOpenSellModal,
}: ScrapPricesModalProps) {
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState<"city-select" | "splash" | "rates-board">(
    "city-select"
  );
  const [selectedCity, setSelectedCity] = useState<CityName>(initialCity);
  const [splashProgress, setSplashProgress] = useState(false);

  // Rates board states
  const [selectedCategory, setSelectedCategory] = useState<ScrapCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [selectedLocality, setSelectedLocality] = useState<string | null>(null);

  const cityDropdownRef = useRef<HTMLDivElement>(null);

  // Guarantee hydration before createPortal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync initial city when prop changes
  useEffect(() => {
    if (initialCity) {
      setSelectedCity(initialCity);
    }
  }, [initialCity]);

  // Reset to step 1 when opening freshly
  useEffect(() => {
    if (isOpen) {
      setCurrentStep("city-select");
      setSearchQuery("");
      setSelectedCategory("All");
      setCityDropdownOpen(false);
      setSelectedLocality(null);
    }
  }, [isOpen]);

  // Body scroll locking and ESC key listener
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (cityDropdownOpen) {
          setCityDropdownOpen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, cityDropdownOpen, onClose]);

  // Outside click to close city dropdown in rates board
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

    setTimeout(() => {
      setCurrentStep("rates-board");
    }, 2500);
  };

  // Filter items based on category and search query
  const filteredItems = useMemo(() => {
    return SCRAP_ITEMS_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

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

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center font-sans select-none">
      {/* STEP 1: "Where do you reside?" Modal */}
      {currentStep === "city-select" && (
        <div
          className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 sm:p-10 text-center overflow-hidden transition-all duration-300"
          >
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#5EDC1F]/10 rounded-full blur-3xl pointer-events-none" />

            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-8 relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-3">
                Scrap Prices
              </h2>
              <p className="text-base sm:text-lg text-neutral-400 font-medium tracking-wide">
                Where do you reside?
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 max-w-3xl mx-auto relative z-10">
              {CITIES_LIST.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleSelectCity(city)}
                  className="px-4 sm:px-5 py-2.5 rounded-xl border border-neutral-800 bg-[#14171a] text-sm font-semibold text-neutral-300 hover:border-[#5EDC1F] hover:text-[#5EDC1F] hover:bg-[#191d22] transition-all duration-150 cursor-pointer active:scale-95 shadow-sm"
                >
                  {city}
                </button>
              ))}
            </div>

            <div className="mt-8 text-xs text-neutral-500 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5EDC1F] animate-pulse" />
              <span>Real-time benchmark rates updated for verified doorstep collection</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Animated Green Cargo Truck Transition Splash (1.3s) */}
      {currentStep === "splash" && (
        <CityTransitionSplash cityName={selectedCity} />
      )}

      {/* STEP 3: Detailed Scrap Prices Board Modal */}
      {currentStep === "rates-board" && (
        <div
          className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0c0e11] border border-neutral-800 shadow-2xl overflow-hidden text-left"
          >
            <div className="p-4 sm:p-5 pb-3 border-b border-neutral-800/80 flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Scrap Prices
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:px-6 bg-[#0f1115] border-b border-neutral-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative" ref={cityDropdownRef}>
                <button
                  type="button"
                  onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#14171a] border border-neutral-800 text-sm font-semibold text-white flex items-center justify-between sm:justify-start gap-2.5 hover:border-neutral-700 hover:bg-[#191d22] transition-colors cursor-pointer"
                  aria-expanded={cityDropdownOpen}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#5EDC1F]" />
                    <span>{selectedCity}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                      cityDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {cityDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 max-h-64 overflow-y-auto rounded-2xl bg-[#121417] border border-neutral-800 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1.5 border-b border-neutral-800/60 mb-1">
                      Select Location
                    </div>
                    {CITIES_LIST.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleSelectCity(city)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition-colors cursor-pointer ${
                          selectedCity === city
                            ? "bg-[#5EDC1F]/15 text-[#5EDC1F] font-semibold"
                            : "text-neutral-300 hover:bg-neutral-800/60 hover:text-white"
                        }`}
                      >
                        <span>{city}</span>
                        {selectedCity === city && <Check className="w-4 h-4 text-[#5EDC1F]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative flex-1 sm:max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search any materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 text-sm bg-[#14171a] border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#5EDC1F] transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="px-4 sm:px-6 py-2.5 bg-[#0c0e11] border-b border-neutral-800/60 flex items-center gap-2 overflow-x-auto scrollbar-none">
              {(["All", "Paper", "Plastic", "Metal", "E-waste", "Other"] as ScrapCategory[]).map(
                (cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#5EDC1F] text-black font-semibold shadow-md"
                          : "bg-[#181b1f] text-neutral-400 border border-neutral-800 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                }
              )}
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto max-h-[50vh] min-h-[300px]">
              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#16181c] border border-neutral-800/80 rounded-xl p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:border-neutral-700 hover:bg-[#1a1c22] transition-colors group cursor-default"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800/80 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform">
                          {item.icon}
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-neutral-200 break-words group-hover:text-white transition-colors">
                          {item.name}
                        </span>
                      </div>

                      <div className="text-right shrink-0 pl-2">
                        <span className="text-xs sm:text-sm font-bold text-[#5EDC1F] whitespace-nowrap">
                          {item.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center text-neutral-400 space-y-2">
                  <Search className="w-8 h-8 mx-auto text-neutral-600 mb-2" />
                  <p className="text-sm font-medium">No materials found matching &quot;{searchQuery}&quot;</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                    }}
                    className="text-xs text-[#5EDC1F] underline cursor-pointer"
                  >
                    Clear search and show all items
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 sm:px-6 pt-3 border-t border-neutral-800/80 bg-[#0c0e11] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-neutral-400 gap-2">
                <div>
                  <span>Note: For Bulk scrap (Commercial) prices may vary. </span>
                  <a
                    href="/#contact"
                    className="text-[#5EDC1F] hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    Contact us to know more →
                  </a>
                </div>

                {onOpenSellModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSellModal();
                    }}
                    className="px-4 py-1.5 rounded-full bg-[#5EDC1F] hover:bg-[#52c41b] text-black font-bold text-xs transition cursor-pointer self-start sm:self-auto shrink-0 shadow-sm"
                  >
                    Schedule Pickup
                  </button>
                )}
              </div>

              <div className="border-t border-neutral-800/80 pt-3">
                <div className="text-[12px] font-semibold text-neutral-300 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#5EDC1F]" />
                  <span>Check scrap rates of specific locality in {selectedCity}</span>
                  {selectedLocality && (
                    <span className="text-[11px] text-[#5EDC1F] font-normal">
                      (Selected: {selectedLocality})
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto pr-1 scrollbar-none">
                  {localities.map((loc) => {
                    const isLocSelected = selectedLocality === loc;
                    return (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setSelectedLocality(isLocSelected ? null : loc)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                          isLocSelected
                            ? "bg-[#5EDC1F] text-black font-semibold shadow-xs"
                            : "border border-neutral-800 bg-[#121417] text-neutral-400 hover:text-[#5EDC1F] hover:border-[#5EDC1F]/60"
                        }`}
                      >
                        {loc}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
