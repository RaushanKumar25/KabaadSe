"use client";

import React, { useState, useEffect, useMemo } from "react";
import BrandLogo from "@/components/BrandLogo";
import {
  X,
  Loader2,
  Check,
  Scale,
  Zap,
  ShieldCheck,
  Truck,
  Boxes,
  Calendar,
  Phone,
  MapPin,
} from "lucide-react";

interface PickupBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCity?: string;
  defaultLocality?: string;
}

const PRESET_CITIES = [
  "Patna",
  "Jalandhar",
  "Ludhiana",
  "Delhi NCR",
  "Ranchi",
];

const SCRAP_TYPES = [
  "Newspaper & Cardboard",
  "Plastics",
  "Iron & Steel",
  "Copper & Brass",
  "E-Waste & Appliances",
  "Mixed Scrap",
];

const WEIGHT_OPTIONS = [
  "< 20 kg",
  "20 - 50 kg",
  "50+ kg",
  "Commercial / Bulk",
];

export default function PickupBookingModal({
  isOpen,
  onClose,
  defaultCity = "Patna",
  defaultLocality = "",
}: PickupBookingModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [city, setCity] = useState(defaultCity);
  const [locality, setLocality] = useState(defaultLocality);
  const [address, setAddress] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [selectedScrapTypes, setSelectedScrapTypes] = useState<string[]>([
    "Newspaper & Cardboard",
  ]);
  const [estimatedLoad, setEstimatedLoad] = useState("< 20 kg");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

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

  // Lock body scroll and listen for ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleDismiss();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, confirmedBookingId]);

  const handleDismiss = () => {
    onClose();
    // If user dismisses after booking confirmation, reset form fields
    if (confirmedBookingId) {
      setTimeout(() => {
        setConfirmedBookingId(null);
        setCustomerName("");
        setCustomerPhone("");
        setCity(defaultCity || "Patna");
        setLocality(defaultLocality || "");
        setAddress("");
        setPickupDate("");
        setSelectedScrapTypes(["Newspaper & Cardboard"]);
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
    // Only permit numerical digits, cap at 10
    const rawValue = e.target.value.replace(/\D/g, "").slice(0, 10);
    setCustomerPhone(rawValue);
  };

  const toggleScrapType = (type: string) => {
    setSelectedScrapTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Frontend validations
    if (customerName.trim().length < 2) {
      setErrorMessage("Full name must be at least 2 characters.");
      return;
    }

    if (customerPhone.trim().length !== 10) {
      setErrorMessage("Contact number must be exactly 10 digits.");
      return;
    }

    if (!city.trim()) {
      setErrorMessage("Please enter or select your city.");
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
      setErrorMessage("Please select at least one scrap type category.");
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

  // Format reference ID according to guideline: #KB-${id.slice(-6).toUpperCase()}
  const formattedRefId = confirmedBookingId
    ? `#KB-${confirmedBookingId.slice(-6).toUpperCase()}`
    : "";

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pickup-modal-title"
    >
      {/* Ambient background waves behind modal card (matching reference illustration depth) */}
      <div className="fixed -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/15 blur-[120px] pointer-events-none" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl rounded-2xl sm:rounded-3xl bg-[#0B0F19] border border-slate-800 text-slate-100 shadow-2xl my-auto overflow-hidden transition-all flex flex-col md:flex-row shadow-black/80"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-4 right-4 z-30 p-2 rounded-full text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 transition cursor-pointer shadow-md"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {confirmedBookingId ? (
          /* Confirmation Receipt Card (Spans full modal width) */
          <div className="w-full p-6 sm:p-8 lg:p-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/90 text-emerald-400 border border-emerald-800/80">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  Booking Received Successfully
                </span>
                <h3
                  id="pickup-modal-title"
                  className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight"
                >
                  Doorstep Pickup Scheduled
                </h3>
              </div>
              <div className="bg-[#0F172A] border border-slate-800 rounded-xl px-4 py-2.5 sm:text-right">
                <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Booking Reference ID
                </span>
                <span className="text-base sm:text-lg font-mono font-bold text-emerald-400">
                  {formattedRefId}
                </span>
              </div>
            </div>

            {/* Summary Details Grid */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center text-slate-400 shrink-0">
                  <BrandLogo size={18} className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Customer</span>
                  <span className="text-slate-100 font-semibold">{customerName}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center text-slate-400 shrink-0">
                  <Phone className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Phone</span>
                  <span className="text-slate-100 font-mono font-semibold">+91 {customerPhone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center text-slate-400 shrink-0">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Location</span>
                  <span className="text-slate-100 font-semibold">{locality}, {city}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center text-slate-400 shrink-0">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Preferred Date</span>
                  <span className="text-slate-100 font-semibold">{pickupDate}</span>
                </div>
              </div>

              <div className="sm:col-span-2 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-400 text-xs">Scrap Items:</span>
                  <span className="text-emerald-300 font-medium">{selectedScrapTypes.join(", ")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-400 text-xs">Est. Load:</span>
                  <span className="text-emerald-400 font-bold">{estimatedLoad}</span>
                </div>
              </div>

              <div className="sm:col-span-2 text-xs text-slate-400">
                <span className="text-slate-500">Address: </span>
                <span className="text-slate-200">{address}</span>
              </div>
            </div>

            {/* Field Team Notice */}
            <p className="text-xs text-slate-400 bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 leading-relaxed flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Our field coordinator will call to confirm your scheduled slot before dispatching the collection vehicle.</span>
            </p>

            {/* Single Close Button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm transition cursor-pointer border border-slate-700"
            >
              Close
            </button>
          </div>
        ) : (
          /* Split-Screen Modal Layout: Left Form (60%) + Right Visual Panel (40%) */
          <>
            {/* LEFT COLUMN: Clean Form Area (60%) */}
            <div className="w-full md:w-[60%] lg:w-[62%] p-5 sm:p-6 lg:p-7 flex flex-col justify-between bg-[#0B0F19] relative z-10">
              <div>
                {/* Form Header */}
                <div className="mb-4 pr-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 uppercase tracking-wider">
                      <Truck className="w-3 h-3" />
                      Free Doorstep Service
                    </span>
                  </div>
                  <h3
                    id="pickup-modal-title"
                    className="text-lg sm:text-xl font-bold text-slate-100 tracking-tight"
                  >
                    Schedule Doorstep Pickup
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Verified digital scale weighing with instant UPI payment.
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-3 p-2.5 rounded-lg bg-red-950/50 border border-red-900/80 text-red-300 text-xs leading-relaxed">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3" autoComplete="off">
                  {/* Row 1: Full Name | Contact Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Full Name *
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
                        className="w-full bg-[#0F172A] border border-slate-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Contact Number *
                      </label>
                      <div className="flex rounded-lg border border-slate-800 bg-[#0F172A] focus-within:border-emerald-500 transition-colors overflow-hidden">
                        <span className="inline-flex items-center px-2.5 text-xs font-semibold text-slate-400 bg-slate-900/90 border-r border-slate-800 select-none">
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
                          className="w-full bg-transparent px-2.5 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: City (custom selector without OS popup) | Locality / Area */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        City *
                      </label>
                      <input
                        required
                        type="text"
                        name="pickup_city"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                        placeholder="Patna, Jalandhar, etc."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-[#0F172A] border border-slate-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                      {/* Preset quick-select city chips */}
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {PRESET_CITIES.map((c) => {
                          const isSelected = city.toLowerCase() === c.toLowerCase();
                          return (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setCity(c)}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition cursor-pointer ${
                                isSelected
                                  ? "bg-emerald-950 text-emerald-300 border border-emerald-600/80 font-bold"
                                  : "bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200"
                              }`}
                            >
                              {c}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Locality / Area *
                      </label>
                      <input
                        required
                        type="text"
                        name="pickup_area"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                        placeholder="Area, sector, or colony"
                        value={locality}
                        onChange={(e) => setLocality(e.target.value)}
                        className="w-full bg-[#0F172A] border border-slate-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 3: Preferred Date | Estimated Weight */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Preferred Pickup Date *
                      </label>
                      <input
                        required
                        type="date"
                        min={todayString}
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full bg-[#0F172A] border border-slate-800 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Estimated Weight
                      </label>
                      <select
                        value={estimatedLoad}
                        onChange={(e) => setEstimatedLoad(e.target.value)}
                        className="w-full bg-[#0F172A] border border-slate-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                      >
                        {WEIGHT_OPTIONS.map((w) => (
                          <option key={w} value={w} className="bg-[#0F172A] text-slate-100">
                            {w}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Complete Address & Landmark */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Complete Address & Landmark *
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
                      className="w-full bg-[#0F172A] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none transition-colors"
                    />
                  </div>

                  {/* Row 5: Scrap Type / Items (Multi-select pills) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-semibold text-slate-300">
                        Scrap Type / Items <span className="text-slate-500 font-normal">(Select multiple)</span>
                      </label>
                      <span className="text-[10px] text-emerald-400 font-medium">
                        {selectedScrapTypes.length} selected
                      </span>
                    </div>
                    <div
                      className="grid grid-cols-2 sm:grid-cols-3 gap-1.5"
                      role="group"
                      aria-label="Select scrap categories"
                    >
                      {SCRAP_TYPES.map((type) => {
                        const isSelected = selectedScrapTypes.includes(type);
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => toggleScrapType(type)}
                            className={`py-1.5 px-2 text-[11px] rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between gap-1 ${
                              isSelected
                                ? "bg-emerald-950/70 border-emerald-500 text-emerald-300 font-semibold shadow-xs"
                                : "bg-[#0F172A] border-slate-800 text-slate-300 hover:border-slate-700 hover:text-slate-100"
                            }`}
                          >
                            <span className="truncate">{type}</span>
                            {isSelected && (
                              <Check className="w-3 h-3 text-emerald-400 stroke-[3] shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit CTA Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-3 py-2.5 sm:py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-black text-xs sm:text-sm tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 hover:scale-[1.01] active:scale-[0.99]"
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

            {/* RIGHT COLUMN: Branded Visual & Trust Panel (40%) with S-Curve Divider */}
            <div className="hidden md:flex md:w-[40%] lg:w-[38%] p-6 lg:p-7 flex-col justify-between bg-gradient-to-br from-emerald-600 via-green-700 to-slate-950 text-white relative overflow-hidden select-none">
              {/* Organic S-Curve Wave Divider carving smoothly from left (matching reference layout) */}
              <div className="absolute top-0 bottom-0 left-0 w-12 lg:w-16 overflow-hidden pointer-events-none z-10">
                <svg
                  viewBox="0 0 100 1000"
                  preserveAspectRatio="none"
                  className="h-full w-full fill-[#0B0F19]"
                >
                  <path d="M0,0 L95,0 C55,200 12,380 28,520 C45,660 70,820 90,1000 L0,1000 Z" />
                </svg>
              </div>

              {/* Decorative Subtle Background Orbs */}
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-green-500/20 blur-2xl pointer-events-none" />

              {/* Top Header Badge & Headline (inspired by reference card typography) */}
              <div className="relative z-10 pl-4 text-center md:text-left">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="p-1 rounded-lg bg-black/35 backdrop-blur-sm border border-white/20 shadow-sm">
                    <BrandLogo size={20} className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-200">
                    KabaadSe Doorstep
                  </span>
                </div>

                <h4 className="text-xl lg:text-2xl font-black text-white leading-tight tracking-tight drop-shadow-sm">
                  Turn your household scrap into instant cash.
                </h4>
                <p className="text-xs text-emerald-100/90 leading-relaxed font-medium mt-1">
                  Accurate digital scale weighing & on-the-spot UPI payout.
                </p>
              </div>

              {/* Center Vector Illustration (inspired by reference monitor & eco elements) */}
              <div className="relative z-10 pl-4 my-2 flex items-center justify-center">
                <div className="relative w-full max-w-[280px] py-2 flex flex-col items-center">
                  {/* Stylized Doorstep Pickup Vector Graphics */}
                  <svg
                    viewBox="0 0 280 130"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-auto drop-shadow-xl"
                  >
                    {/* Background Decorative Foliage / Eco Leaves */}
                    <path
                      d="M20 70C20 40 50 25 70 30C75 55 55 80 20 70Z"
                      fill="#10B981"
                      fillOpacity="0.35"
                    />
                    <path
                      d="M260 70C260 40 230 25 210 30C205 55 225 80 260 70Z"
                      fill="#10B981"
                      fillOpacity="0.35"
                    />
                    <circle cx="140" cy="65" r="55" fill="#047857" fillOpacity="0.4" />

                    {/* Central Digital Weighing Scale & Display Screen */}
                    <rect
                      x="70"
                      y="20"
                      width="140"
                      height="85"
                      rx="12"
                      fill="#0F172A"
                      stroke="#34D399"
                      strokeWidth="2.5"
                    />
                    {/* Inner Screen Stand Base */}
                    <rect x="120" y="105" width="40" height="8" rx="4" fill="#334155" />
                    <rect x="105" y="113" width="70" height="5" rx="2.5" fill="#1E293B" />

                    {/* Scale Weight Screen Readout */}
                    <rect x="85" y="32" width="110" height="28" rx="6" fill="#022C22" stroke="#059669" strokeWidth="1" />
                    <text
                      x="140"
                      y="51"
                      fill="#34D399"
                      fontFamily="monospace"
                      fontSize="14"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      24.50 KG
                    </text>
                    <circle cx="94" cy="46" r="3" fill="#10B981" />

                    {/* Feature Indicators inside Monitor */}
                    <rect x="85" y="68" width="50" height="18" rx="4" fill="#1E293B" />
                    <text x="110" y="81" fill="#E2E8F0" fontSize="9" fontWeight="600" textAnchor="middle">
                      Verified
                    </text>
                    <rect x="145" y="68" width="50" height="18" rx="4" fill="#059669" />
                    <text x="170" y="81" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                      ₹ Instant
                    </text>

                    {/* Floating Shield Badge (Left) */}
                    <g transform="translate(32, 45)">
                      <rect width="36" height="36" rx="10" fill="#0B0F19" stroke="#10B981" strokeWidth="1.5" />
                      <path
                        d="M18 10L27 14V20C27 24.5 23.2 27.8 18 29C12.8 27.8 9 24.5 9 20V14L18 10Z"
                        fill="#059669"
                        fillOpacity="0.4"
                        stroke="#34D399"
                        strokeWidth="1.5"
                      />
                      <path d="M15 19L17 21L21 16" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </g>

                    {/* Floating Cash/UPI Coin Badge (Right) */}
                    <g transform="translate(212, 45)">
                      <circle cx="18" cy="18" r="18" fill="#0B0F19" stroke="#FBBF24" strokeWidth="1.5" />
                      <circle cx="18" cy="18" r="14" fill="#D97706" fillOpacity="0.3" />
                      <text x="18" y="23" fill="#FCD34D" fontSize="16" fontWeight="bold" textAnchor="middle">
                        ₹
                      </text>
                    </g>
                  </svg>
                </div>
              </div>

              {/* Structured Trust Highlights */}
              <div className="relative z-10 pl-4 space-y-2 mb-3">
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-black/35 backdrop-blur-md border border-white/10">
                  <div className="p-1 rounded-md bg-emerald-500/20 text-emerald-300 shrink-0">
                    <Scale className="w-3.5 h-3.5 stroke-[2.2]" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-white block">Certified Bluetooth Scale</span>
                    <span className="text-[10px] text-emerald-100/75">Accurate to 10 grams at your doorstep</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-black/35 backdrop-blur-md border border-white/10">
                  <div className="p-1 rounded-md bg-emerald-500/20 text-emerald-300 shrink-0">
                    <Zap className="w-3.5 h-3.5 stroke-[2.2]" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-white block">Instant UPI Transfer</span>
                    <span className="text-[10px] text-emerald-100/75">Direct bank transfer before vehicle departs</span>
                  </div>
                </div>
              </div>

              {/* Bottom Live Summary Card */}
              <div className="relative z-10 pl-4">
                <div className="p-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-emerald-400/30 shadow-lg">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-300 mb-0.5">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Live Summary
                    </span>
                    <span className="font-mono text-emerald-200 text-xs">
                      {estimatedLoad}
                    </span>
                  </div>
                  <div className="text-xs text-white font-bold truncate">
                    📍 {city || "Patna"} {locality ? `• ${locality}` : ""}
                  </div>
                  <div className="text-[10px] text-emerald-200/90 truncate mt-0.5">
                    📦 {selectedScrapTypes.length > 0 ? selectedScrapTypes.join(", ") : "Select scrap items"}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
