"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import {
  X,
  Loader2,
  Check,
  Truck,
  Boxes,
  Calendar,
  Phone,
  MapPin,
  User,
  Search,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { SCRAP_ITEMS_DATA } from "@/lib/scrapRatesData";

interface PickupBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCity?: string;
  defaultLocality?: string;
  defaultPickupDate?: string;
  defaultCategory?: string;
}

const WEIGHT_OPTIONS = [
  "< 20 kg",
  "20 - 50 kg",
  "50+ kg",
  "Commercial / Bulk",
];

const CATEGORY_TABS = ["All", "Paper", "Plastic", "Metal", "E-waste", "Other"] as const;

export default function PickupBookingModal({
  isOpen,
  onClose,
  defaultCity = "Patna",
  defaultLocality = "",
  defaultPickupDate = "",
  defaultCategory = "",
}: PickupBookingModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [city, setCity] = useState(defaultCity);
  const [locality, setLocality] = useState(defaultLocality);
  const [address, setAddress] = useState("");
  const [pickupDate, setPickupDate] = useState(defaultPickupDate);
  const [selectedScrapTypes, setSelectedScrapTypes] = useState<string[]>([
    "Newspaper",
  ]);
  const [estimatedLoad, setEstimatedLoad] = useState("< 20 kg");

  // Dropdown & Searchable rates state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrapSearch, setScrapSearch] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dynamic live rates list (pre-seeded with SCRAP_ITEMS_DATA)
  const [scrapItemsList, setScrapItemsList] = useState<
    Array<{ id: string; name: string; category: string; price: string; icon?: string }>
  >(() =>
    SCRAP_ITEMS_DATA.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      icon: item.icon,
    }))
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);
  const [activeCustomerId, setActiveCustomerId] = useState<string | null>(null);

  // Check if customer is logged in; if so, pre-fill name, phone, and address
  useEffect(() => {
    let isCancelled = false;
    async function loadCustomerProfile() {
      try {
        const res = await fetch("/api/customer/me", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && data.customer && !isCancelled) {
          setActiveCustomerId(data.customer.id);
          setCustomerName((prev) => prev || data.customer.name || "");
          setCustomerPhone((prev) => prev || data.customer.phone || "");
          if (data.customer.defaultAddress) {
            setAddress((prev) => prev || data.customer.defaultAddress || "");
          }
        }
      } catch {
        // Guest mode fallback
      }
    }

    if (isOpen) {
      if (defaultPickupDate) {
        setPickupDate(defaultPickupDate);
      }
      if (defaultCategory) {
        const formatted =
          defaultCategory.charAt(0).toUpperCase() +
          defaultCategory.slice(1).toLowerCase();
        setSelectedCategoryFilter(formatted);
        if (formatted.toLowerCase().includes("paper")) setSelectedScrapTypes(["Newspaper", "Cardboard"]);
        else if (formatted.toLowerCase().includes("plastic")) setSelectedScrapTypes(["Plastic Bottles", "Plastic Bags"]);
        else if (formatted.toLowerCase().includes("metal")) setSelectedScrapTypes(["Iron & Steel", "Copper"]);
        else if (formatted.toLowerCase().includes("waste")) setSelectedScrapTypes(["E-Waste", "Laptops"]);
        else setSelectedScrapTypes(["Mixed Scrap"]);
      }
      loadCustomerProfile();
    }

    return () => {
      isCancelled = true;
    };
  }, [isOpen]);

  // Calculate today's date string (YYYY-MM-DD) for date picker minimum
  const todayString = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  // Sync default city/locality when opened or updated
  useEffect(() => {
    if (defaultCity) setCity(defaultCity);
    if (defaultLocality) setLocality(defaultLocality);
  }, [defaultCity, defaultLocality]);

  // Sync live rates from /api/rates for the selected city
  useEffect(() => {
    let isCancelled = false;
    async function fetchLiveRates() {
      try {
        const queryCity = city?.trim() || "Patna";
        const res = await fetch(`/api/rates?city=${encodeURIComponent(queryCity)}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0 && !isCancelled) {
          setScrapItemsList(
            data.map((item: any) => ({
              id: item.id,
              name: item.name,
              category: item.category || "Other",
              price: item.unit ? `₹${item.price} /${item.unit}` : `₹${item.price}`,
              icon: item.iconPath || undefined,
            }))
          );
        }
      } catch {
        // Fallback gracefully remains SCRAP_ITEMS_DATA
      }
    }

    if (isOpen) {
      fetchLiveRates();
    }

    return () => {
      isCancelled = true;
    };
  }, [city, isOpen]);

  // Handle click outside dropdown to close menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Lock body scroll and listen for ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isDropdownOpen) {
          setIsDropdownOpen(false);
        } else {
          handleDismiss();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, confirmedBookingId, isDropdownOpen]);

  const handleDismiss = () => {
    setIsDropdownOpen(false);
    onClose();
    if (confirmedBookingId) {
      setTimeout(() => {
        setConfirmedBookingId(null);
        setCustomerName("");
        setCustomerPhone("");
        setCity(defaultCity || "Patna");
        setLocality(defaultLocality || "");
        setAddress("");
        setPickupDate("");
        setSelectedScrapTypes(["Newspaper"]);
        setEstimatedLoad("< 20 kg");
        setErrorMessage(null);
      }, 200);
    } else {
      setErrorMessage(null);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleDismiss();
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "").slice(0, 10);
    setCustomerPhone(rawValue);
  };

  const toggleScrapType = (type: string) => {
    setSelectedScrapTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const removeScrapType = (type: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedScrapTypes((prev) => prev.filter((t) => t !== type));
  };

  // Filtered scrap items according to active category tab and search input
  const filteredScrapItems = useMemo(() => {
    return scrapItemsList.filter((item) => {
      const matchesCategory =
        selectedCategoryFilter === "All" ||
        item.category.toLowerCase() === selectedCategoryFilter.toLowerCase();
      const matchesSearch =
        !scrapSearch.trim() ||
        item.name.toLowerCase().includes(scrapSearch.toLowerCase().trim()) ||
        item.category.toLowerCase().includes(scrapSearch.toLowerCase().trim());
      return matchesCategory && matchesSearch;
    });
  }, [scrapItemsList, selectedCategoryFilter, scrapSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (customerName.trim().length < 2) {
      setErrorMessage("Full name must be at least 2 characters.");
      return;
    }

    if (customerPhone.trim().length !== 10) {
      setErrorMessage("Contact number must be exactly 10 digits.");
      return;
    }

    if (!city.trim()) {
      setErrorMessage("Please enter your city.");
      return;
    }

    if (locality.trim().length < 2) {
      setErrorMessage("Please enter your area, sector, or colony.");
      return;
    }

    if (address.trim().length < 5) {
      setErrorMessage("Please enter a complete address with nearby landmark (min 5 characters).");
      return;
    }

    if (!pickupDate) {
      setErrorMessage("Please choose a preferred pickup date.");
      return;
    }

    if (selectedScrapTypes.length === 0) {
      setErrorMessage("Please select at least one scrap item.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/pickup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          customerId: activeCustomerId || undefined,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          city: city.trim(),
          locality: locality.trim(),
          address: address.trim(),
          pickupDate,
          scrapTypes: selectedScrapTypes,
          estimatedLoad,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to submit pickup booking. Please try again.");
      }

      setConfirmedBookingId(data.bookingId);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to connect to server. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const formattedRefId = confirmedBookingId
    ? `#KB-${confirmedBookingId.slice(-6).toUpperCase()}`
    : "";

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/50 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pickup-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92vh] rounded-2xl sm:rounded-3xl bg-white border border-slate-200 text-slate-900 shadow-2xl my-auto overflow-hidden transition-all flex flex-col md:flex-row shadow-slate-950/20"
      >
        {/* Close Button - Floating cleanly in top-right corner over image/header */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-4 right-4 z-30 p-2 rounded-full text-slate-800 hover:text-slate-950 bg-white/90 hover:bg-white border border-slate-200/80 transition cursor-pointer shadow-md backdrop-blur-xs"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
        </button>

        {confirmedBookingId ? (
          /* Confirmation Receipt Card (Fade-white with emerald accents) */
          <div className="w-full p-6 sm:p-8 lg:p-10 space-y-5 overflow-y-auto max-h-[90vh] bg-white text-slate-900">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  Booking Confirmed
                </span>
                <h3
                  id="pickup-modal-title"
                  className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight"
                >
                  Doorstep Pickup Scheduled
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  We have registered your pickup request. Our coordinator will contact you shortly.
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 sm:text-right">
                <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Booking Reference ID
                </span>
                <span className="text-base sm:text-lg font-mono font-bold text-emerald-700">
                  {formattedRefId}
                </span>
              </div>
            </div>

            {/* Summary Details Grid */}
            <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 shadow-2xs">
                  <User className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <span className="text-slate-400 text-xs block font-medium">Customer</span>
                  <span className="text-slate-900 font-semibold">{customerName}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 shadow-2xs">
                  <Phone className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <span className="text-slate-400 text-xs block font-medium">Phone</span>
                  <span className="text-slate-900 font-mono font-semibold">+91 {customerPhone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 shadow-2xs">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <span className="text-slate-400 text-xs block font-medium">Location</span>
                  <span className="text-slate-900 font-semibold">{locality}, {city}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 shadow-2xs">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <span className="text-slate-400 text-xs block font-medium">Preferred Date</span>
                  <span className="text-slate-900 font-semibold">{pickupDate}</span>
                </div>
              </div>

              <div className="sm:col-span-2 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="text-slate-500 text-xs font-medium">Scrap Items:</span>
                  <span className="text-slate-900 font-medium">{selectedScrapTypes.join(", ")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="text-slate-500 text-xs font-medium">Est. Load:</span>
                  <span className="text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {estimatedLoad}
                  </span>
                </div>
              </div>

              <div className="sm:col-span-2 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-medium">Address: </span>
                <span className="text-slate-800">{address}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 leading-relaxed flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Our field coordinator will call your mobile number to confirm the arrival window before dispatching the collection vehicle.</span>
            </p>

            <button
              type="button"
              onClick={handleDismiss}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition cursor-pointer shadow-sm"
            >
              Done
            </button>
          </div>
        ) : (
          /* Split-Screen Modal Layout: Left Form (~62%) + Right HD Visual (~38%) */
          <>
            {/* LEFT COLUMN: Clean Form Area (Fade-White Background with Crisp Green Accents) */}
            <div className="w-full md:w-[62%] lg:w-[64%] p-5 sm:p-6 lg:p-7 flex flex-col justify-between bg-white relative z-10 overflow-y-auto max-h-[90vh] md:max-h-[92vh]">
              <div>
                {/* Form Header (Free Doorstep Service badge removed per user request) */}
                <div className="mb-4 pr-8">
                  <h3
                    id="pickup-modal-title"
                    className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight"
                  >
                    Schedule Doorstep Pickup
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Verified digital scale weighing with instant UPI payment.
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs leading-relaxed flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3" autoComplete="off">
                  {/* Row 1: Full Name | Contact Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name <span className="text-emerald-600">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        name="customer_full_name"
                        autoComplete="off"
                        spellCheck={false}
                        placeholder="e.g. Ramesh Kumar"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-slate-50 hover:bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Contact Number <span className="text-emerald-600">*</span>
                      </label>
                      <div className="flex rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-50/80 focus-within:bg-white focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all overflow-hidden">
                        <span className="inline-flex items-center px-3 text-xs font-bold text-slate-600 bg-slate-100 border-r border-slate-200 select-none">
                          +91
                        </span>
                        <input
                          required
                          type="tel"
                          name="customer_phone_number"
                          autoComplete="off"
                          inputMode="numeric"
                          pattern="[0-9]{10}"
                          maxLength={10}
                          placeholder="9876543210"
                          value={customerPhone}
                          onChange={handlePhoneChange}
                          className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-mono tracking-wide"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: City (simple clean input, no chips) | Locality / Area */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        City <span className="text-emerald-600">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        name="pickup_city"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                        placeholder="Enter your city, e.g. Patna"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-slate-50 hover:bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Locality / Area <span className="text-emerald-600">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        name="pickup_area"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                        placeholder="Enter area, sector, or colony"
                        value={locality}
                        onChange={(e) => setLocality(e.target.value)}
                        className="w-full bg-slate-50 hover:bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Row 3: Preferred Date | Estimated Weight */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Preferred Pickup Date <span className="text-emerald-600">*</span>
                      </label>
                      <input
                        required
                        type="date"
                        min={todayString}
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full bg-slate-50 hover:bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer [color-scheme:light]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Estimated Weight
                      </label>
                      <select
                        value={estimatedLoad}
                        onChange={(e) => setEstimatedLoad(e.target.value)}
                        className="w-full bg-slate-50 hover:bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
                      >
                        {WEIGHT_OPTIONS.map((w) => (
                          <option key={w} value={w} className="bg-white text-slate-900">
                            {w}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Complete Address & Landmark */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Complete Address & Landmark <span className="text-emerald-600">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      name="pickup_full_address"
                      autoComplete="off"
                      spellCheck={false}
                      placeholder="House / Flat No., Building name, Street, Landmark"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-slate-50 hover:bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none transition-all"
                    />
                  </div>

                  {/* Row 5: Searchable Multi-Select Dropdown Synced to Live Rates */}
                  <div className="relative" ref={dropdownRef}>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Scrap Items to Sell <span className="text-emerald-600">*</span>
                      </label>
                      <span className="text-[11px] text-emerald-700 font-bold">
                        {selectedScrapTypes.length} selected
                      </span>
                    </div>

                    {/* Dropdown Button Trigger */}
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen((prev) => !prev)}
                      className={`w-full bg-slate-50 hover:bg-slate-50/90 border rounded-xl px-3.5 py-2.5 text-left text-xs sm:text-sm flex items-center justify-between gap-2 transition-all cursor-pointer ${
                        isDropdownOpen
                          ? "bg-white border-emerald-500 ring-2 ring-emerald-500/20"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Boxes className="w-4 h-4 text-emerald-600 shrink-0" />
                        {selectedScrapTypes.length === 0 ? (
                          <span className="text-slate-400">Select Scrap Items (Search live rates)...</span>
                        ) : (
                          <span className="text-slate-800 truncate font-semibold">
                            {selectedScrapTypes.slice(0, 3).join(", ")}
                            {selectedScrapTypes.length > 3 && (
                              <span className="text-emerald-700 font-bold ml-1">
                                +{selectedScrapTypes.length - 3} more
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                          isDropdownOpen ? "rotate-180 text-emerald-600" : ""
                        }`}
                      />
                    </button>

                    {/* Selected Tags Display */}
                    {selectedScrapTypes.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 max-h-16 overflow-y-auto">
                        {selectedScrapTypes.map((type) => (
                          <span
                            key={type}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs"
                          >
                            <span>{type}</span>
                            <button
                              type="button"
                              onClick={(e) => removeScrapType(type, e)}
                              className="text-emerald-600 hover:text-emerald-950 p-0.5 transition cursor-pointer"
                              title={`Remove ${type}`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Dropdown Floating Panel */}
                    {isDropdownOpen && (
                      <div className="absolute left-0 right-0 bottom-full mb-1.5 z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 space-y-2.5">
                        {/* Search Input */}
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Search scrap items (Newspaper, Iron, AC...)"
                            value={scrapSearch}
                            onChange={(e) => setScrapSearch(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-7 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500"
                            autoFocus
                          />
                          {scrapSearch && (
                            <button
                              type="button"
                              onClick={() => setScrapSearch("")}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        {/* Category Filter Chips */}
                        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                          {CATEGORY_TABS.map((cat) => {
                            const isActive = selectedCategoryFilter === cat;
                            return (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategoryFilter(cat)}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition cursor-pointer ${
                                  isActive
                                    ? "bg-[#5EDC1F] text-slate-950 font-bold shadow-xs"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                                }`}
                              >
                                {cat}
                              </button>
                            );
                          })}
                        </div>

                        {/* Items Checklist List */}
                        <div className="max-h-48 overflow-y-auto space-y-1 pr-1 divide-y divide-slate-100">
                          {filteredScrapItems.length === 0 ? (
                            <div className="py-4 text-center text-xs text-slate-400">
                              No scrap items found matching &quot;{scrapSearch}&quot;
                            </div>
                          ) : (
                            filteredScrapItems.map((item) => {
                              const isChecked = selectedScrapTypes.includes(item.name);
                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => toggleScrapType(item.name)}
                                  className={`w-full py-1.5 px-2 rounded-lg text-left text-xs flex items-center justify-between gap-2 transition cursor-pointer ${
                                    isChecked
                                      ? "bg-emerald-50 text-emerald-900 font-medium"
                                      : "hover:bg-slate-50 text-slate-700"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <div
                                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                        isChecked
                                          ? "bg-[#5EDC1F] border-[#5EDC1F] text-slate-950"
                                          : "border-slate-300 bg-white"
                                      }`}
                                    >
                                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                    </div>
                                    <span className="truncate font-semibold text-slate-800">
                                      {item.name}
                                    </span>
                                    <span className="text-[10px] text-slate-500 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                                      {item.category}
                                    </span>
                                  </div>
                                  <span className="text-xs font-mono font-bold text-emerald-700 shrink-0">
                                    {item.price}
                                  </span>
                                </button>
                              );
                            })
                          )}
                        </div>

                        {/* Dropdown Footer Actions */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <button
                            type="button"
                            onClick={() => setSelectedScrapTypes([])}
                            className="text-xs text-slate-500 hover:text-slate-800 transition cursor-pointer font-medium"
                          >
                            Clear all
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsDropdownOpen(false)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#5EDC1F] hover:bg-[#52c51b] text-slate-950 text-xs font-bold transition cursor-pointer shadow-xs"
                          >
                            Done ({selectedScrapTypes.length})
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Primary Submit CTA with project's signature Thyme Green (#5EDC1F) */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-3 py-3 px-5 rounded-xl bg-[#5EDC1F] hover:bg-[#52c51b] active:bg-[#47b016] disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-black text-sm tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Confirming Pickup...</span>
                      </>
                    ) : (
                      <span>Confirm Pickup Request</span>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT COLUMN: Full-Bleed KabaadSe Doorstep Pickup Image (Zero Text Overlays) */}
            <div className="hidden md:block md:w-[38%] lg:w-[40%] relative overflow-hidden p-0 self-stretch min-h-[450px]">
              <Image
                src="/images/kabaadse-doorstep-pickup.jpg"
                alt="KabaadSe Doorstep Digital Weighing & Collection"
                fill
                sizes="(max-width: 768px) 0vw, 420px"
                priority
                quality={95}
                className="w-full h-full object-cover object-center select-none pointer-events-none"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
