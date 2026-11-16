"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import PickupBookingModal from "@/components/PickupBookingModal";
import {
  Truck,
  Package,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Plus,
  RefreshCw,
  FileText,
  Printer,
  X,
  ShieldCheck,
  Zap,
  ArrowRight,
  User,
  Phone,
  Mail,
  IndianRupee,
  Scale,
} from "lucide-react";

interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  defaultAddress?: string | null;
}

interface CustomerPickup {
  id: string;
  customerName: string;
  customerPhone: string;
  city: string;
  locality: string;
  address: string;
  pickupDate: string;
  estimatedLoad: string;
  scrapTypes: string;
  status: string;
  actualWeightKg?: number | null;
  finalPayoutInr?: number | null;
  createdAt: string;
}

const STATUS_CONFIGS: Record<
  string,
  { label: string; bg: string; text: string; border: string }
> = {
  PENDING: {
    label: "Pending Confirmation",
    bg: "bg-amber-950/40",
    text: "text-amber-300",
    border: "border-amber-800/60",
  },
  CONFIRMED: {
    label: "Collector Assigned",
    bg: "bg-sky-950/40",
    text: "text-sky-300",
    border: "border-sky-800/60",
  },
  COMPLETED: {
    label: "Collected & Paid",
    bg: "bg-emerald-950/40",
    text: "text-emerald-300",
    border: "border-emerald-800/60",
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "bg-slate-900",
    text: "text-slate-400",
    border: "border-slate-800",
  },
};

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [pickups, setPickups] = useState<CustomerPickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "COMPLETED" | "CANCELLED">("ALL");

  // Receipt Modal & Booking Modal States
  const [selectedReceipt, setSelectedReceipt] = useState<CustomerPickup | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Load customer profile and pickups
  const fetchData = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      // 1. Fetch Customer Profile
      const meRes = await fetch("/api/customer/me", { cache: "no-store" });
      const meData = await meRes.json();

      if (!meRes.ok || !meData.success || !meData.customer) {
        router.push("/?auth=customer");
        return;
      }
      setCustomer(meData.customer);

      // 2. Fetch Customer Pickups
      const pickupsRes = await fetch("/api/customer/pickups", { cache: "no-store" });
      const pickupsData = await pickupsRes.json();

      if (pickupsRes.ok && pickupsData.success && Array.isArray(pickupsData.pickups)) {
        setPickups(pickupsData.pickups);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/customer/logout", { method: "POST", cache: "no-store" });
    } finally {
      router.push("/");
      router.refresh();
    }
  };

  // Metrics
  const totalPickups = pickups.length;
  const activePickupsList = useMemo(
    () => pickups.filter((p) => ["PENDING", "CONFIRMED"].includes(p.status)),
    [pickups]
  );
  const completedPickupsList = useMemo(
    () => pickups.filter((p) => p.status === "COMPLETED"),
    [pickups]
  );
  const totalEarningsInr = useMemo(
    () =>
      completedPickupsList.reduce(
        (sum, p) => sum + (typeof p.finalPayoutInr === "number" ? p.finalPayoutInr : 0),
        0
      ),
    [completedPickupsList]
  );

  // Most recent active pickup for the progress timeline tracker
  const currentActivePickup = activePickupsList[0] || null;

  // Filtered Pickups
  const filteredPickups = useMemo(() => {
    if (statusFilter === "ALL") return pickups;
    if (statusFilter === "ACTIVE")
      return pickups.filter((p) => ["PENDING", "CONFIRMED"].includes(p.status));
    if (statusFilter === "COMPLETED")
      return pickups.filter((p) => p.status === "COMPLETED");
    if (statusFilter === "CANCELLED")
      return pickups.filter((p) => p.status === "CANCELLED");
    return pickups;
  }, [pickups, statusFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090E] flex flex-col items-center justify-center text-slate-300">
        <BrandLogo size={36} className="h-9 w-9 animate-pulse mb-3" />
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Loading your KabaadSe Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group transition hover:opacity-90">
          <BrandLogo size={28} className="h-7 w-7" />
          <div className="flex flex-col leading-none">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Kabaad<span className="text-[#65E817]">Se</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Customer Portal</span>
          </div>
        </Link>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => fetchData(true)}
            disabled={isRefreshing}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
            title="Refresh bookings"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-400" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setIsBookingModalOpen(true)}
            className="h-9 sm:h-10 px-4 sm:px-5 rounded-full bg-[#65E817] hover:bg-[#58d012] text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Book Pickup</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="h-9 sm:h-10 px-3.5 rounded-full bg-red-950/40 hover:bg-red-900/60 border border-red-900/60 text-red-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isLoggingOut ? "..." : "Logout"}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-7">
        {/* Welcome Customer Card */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#0D1E1E] to-[#0A1414] border border-slate-800/80 p-6 sm:p-8 overflow-hidden shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 mb-2.5">
                <span className="w-2 h-2 rounded-full bg-[#65E817] animate-pulse" />
                <span>Verified Household Recycling Account</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Welcome back, {customer?.name || "Customer"}!
              </h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-400 mt-2 font-mono">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  +91 {customer?.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  {customer?.email}
                </span>
                {customer?.defaultAddress && (
                  <span className="flex items-center gap-1.5 truncate max-w-xs font-sans">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{customer.defaultAddress}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/rates"
                className="px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-semibold transition flex items-center gap-2"
              >
                <span>Check Live Rates</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#65E817]" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Overview Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0F172A]/70 border border-slate-800/80 shadow-md">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Total Pickups
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">
              {totalPickups}
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Lifetime bookings</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#0F172A]/70 border border-slate-800/80 shadow-md">
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block">
              Active / In-Queue
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-1">
              {activePickupsList.length}
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Pending doorstep arrival</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#0F172A]/70 border border-slate-800/80 shadow-md">
            <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block">
              Completed
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-300 mt-1">
              {completedPickupsList.length}
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Weighed & paid</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#0F172A]/70 border border-slate-800/80 shadow-md">
            <span className="text-[11px] font-mono text-[#65E817] uppercase tracking-wider block">
              Total Scrap Earnings
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1 flex items-center">
              <span>₹{totalEarningsInr.toLocaleString("en-IN")}</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Instant UPI transfers</span>
          </div>
        </div>

        {/* Active Pickup Progress Tracker (If any active pickup exists) */}
        {currentActivePickup && (
          <div className="rounded-3xl bg-[#0F172A]/90 border border-emerald-900/40 p-5 sm:p-7 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#65E817]/20 text-[#65E817] border border-[#65E817]/40">
                    LIVE STATUS
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    #KB-{currentActivePickup.id.slice(-6).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mt-1">
                  Active Doorstep Scrap Collection
                </h3>
              </div>
              <div className="text-xs text-slate-400 bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Scheduled for: <strong className="text-white">{currentActivePickup.pickupDate}</strong></span>
              </div>
            </div>

            {/* Step-by-Step Progress Bar (4 Stages) */}
            <div className="py-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {/* Step 1: Booking Confirmed */}
                <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-700/60 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-[11px]">
                      ✓
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">Step 1</span>
                  </div>
                  <div>
                    <span className="font-bold text-white block">Booking Confirmed</span>
                    <span className="text-[10px] text-slate-400">Request registered</span>
                  </div>
                </div>

                {/* Step 2: Collector Assigned */}
                <div className={`p-3 rounded-2xl border flex flex-col justify-between space-y-2 ${
                  currentActivePickup.status === "CONFIRMED"
                    ? "bg-emerald-950/40 border-emerald-700/60"
                    : "bg-slate-900/60 border-slate-800"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      currentActivePickup.status === "CONFIRMED"
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-slate-800 text-slate-400"
                    }`}>
                      2
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Step 2</span>
                  </div>
                  <div>
                    <span className="font-bold text-white block">Collector Assigned</span>
                    <span className="text-[10px] text-slate-400">Vehicle en route to sector</span>
                  </div>
                </div>

                {/* Step 3: Digital Weighment */}
                <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[11px] font-bold">
                      3
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Step 3</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-300 block">Digital Weighment</span>
                    <span className="text-[10px] text-slate-500">ISO-certified Bluetooth scale</span>
                  </div>
                </div>

                {/* Step 4: Instant UPI Payout */}
                <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[11px] font-bold">
                      4
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Step 4</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-300 block">Instant UPI Paid</span>
                    <span className="text-[10px] text-slate-500">Instant bank deposit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Details Meta */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{currentActivePickup.locality}, {currentActivePickup.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Items: <strong className="text-slate-200">{currentActivePickup.scrapTypes}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Estimated: <strong className="text-slate-200">{currentActivePickup.estimatedLoad}</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* My Bookings & Digital Receipts Section */}
        <div className="rounded-3xl bg-[#0F172A]/70 border border-slate-800/80 p-5 sm:p-7 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                My Bookings & Receipts
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                History of all your doorstep scrap requests and verified receipts
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-semibold overflow-x-auto scrollbar-none">
              {(["ALL", "ACTIVE", "COMPLETED", "CANCELLED"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap ${
                    statusFilter === tab
                      ? "bg-white text-slate-950 font-bold shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab === "ALL"
                    ? `All (${pickups.length})`
                    : tab === "ACTIVE"
                    ? `Active (${activePickupsList.length})`
                    : tab === "COMPLETED"
                    ? `Completed (${completedPickupsList.length})`
                    : `Cancelled`}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings Table / Cards */}
          {filteredPickups.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Package className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-sm font-semibold text-slate-300">
                No scrap pickup bookings found
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {statusFilter === "ALL"
                  ? "You haven't scheduled any scrap pickups yet. Book your first pickup today!"
                  : `No bookings found with status ${statusFilter}.`}
              </p>
              <button
                type="button"
                onClick={() => setIsBookingModalOpen(true)}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#65E817] hover:bg-[#58d012] text-slate-950 font-bold text-xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Schedule First Pickup</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPickups.map((pickup) => {
                const statusConfig = STATUS_CONFIGS[pickup.status] || STATUS_CONFIGS.PENDING;
                const shortId = `#KB-${pickup.id.slice(-6).toUpperCase()}`;

                return (
                  <div
                    key={pickup.id}
                    className="p-4 sm:p-5 rounded-2xl bg-[#0B0F19] border border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono font-bold text-xs text-white">
                          {shortId}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                        >
                          {statusConfig.label}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-emerald-400" />
                          {pickup.pickupDate}
                        </span>
                      </div>

                      <div className="text-xs text-slate-300 flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span className="flex items-center gap-1 text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          {pickup.locality}, {pickup.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="font-medium">{pickup.scrapTypes}</span>
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 truncate max-w-lg">
                        {pickup.address}
                      </div>
                    </div>

                    {/* Right: Load, Payout & Receipt Button */}
                    <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                      <div className="text-left md:text-right">
                        {pickup.finalPayoutInr ? (
                          <>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
                              Paid Amount
                            </span>
                            <span className="text-base sm:text-lg font-black text-[#65E817] font-mono">
                              ₹{pickup.finalPayoutInr.toLocaleString("en-IN")}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
                              Est. Load
                            </span>
                            <span className="text-xs font-semibold text-slate-300">
                              {pickup.estimatedLoad}
                            </span>
                          </>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedReceipt(pickup)}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        <span>View Receipt</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* =========================================================
          DIGITAL RECEIPT MODAL (CLEAN PRINTABLE CARD)
          ========================================================= */}
      {selectedReceipt && (
        <div
          onClick={() => setSelectedReceipt(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl bg-white text-slate-900 border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-4 my-auto overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BrandLogo size={22} className="h-5 w-5" />
                <span className="font-bold text-sm text-slate-900">KabaadSe Digital Receipt</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">
                    Receipt Reference
                  </span>
                  <span className="font-mono font-bold text-base text-emerald-800">
                    #KB-{selectedReceipt.id.slice(-6).toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">
                    Collection Date
                  </span>
                  <span className="font-semibold text-slate-800">
                    {selectedReceipt.pickupDate}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-2 space-y-1 text-slate-600">
                <div>
                  <span className="font-medium text-slate-400">Customer: </span>
                  <strong className="text-slate-900">{selectedReceipt.customerName}</strong>
                </div>
                <div>
                  <span className="font-medium text-slate-400">Contact: </span>
                  <span className="font-mono text-slate-800">+91 {selectedReceipt.customerPhone}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-400">Address: </span>
                  <span className="text-slate-800">{selectedReceipt.address}, {selectedReceipt.locality}, {selectedReceipt.city}</span>
                </div>
              </div>

              {/* Itemized Weighment Details */}
              <div className="border-t border-slate-200 pt-2.5">
                <span className="text-[11px] font-bold text-slate-700 block mb-1">
                  Itemized Scrap Collection
                </span>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-900 block">
                      {selectedReceipt.scrapTypes}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Certified ISO Digital Platform Scale
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-800 block">
                      {selectedReceipt.actualWeightKg
                        ? `${selectedReceipt.actualWeightKg} kg`
                        : selectedReceipt.estimatedLoad}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payout & Stamp */}
              <div className="border-t border-slate-200 pt-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                    Payment Method
                  </span>
                  <span className="font-semibold text-emerald-800 text-xs flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-600" />
                    <span>Instant UPI / Bank</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                    Total Amount
                  </span>
                  <span className="text-lg font-black text-emerald-700 font-mono">
                    {selectedReceipt.finalPayoutInr
                      ? `₹${selectedReceipt.finalPayoutInr.toLocaleString("en-IN")}`
                      : "Pending Weighment"}
                  </span>
                </div>
              </div>
            </div>

            {/* Environmental Trust Footnote */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 text-emerald-900 text-[11px] border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                100% of scrap collected through KabaadSe is ethically segregated and delivered to government-authorized recycling smelters.
              </span>
            </div>

            {/* Print / Action Buttons */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Print Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Universal Pickup Booking Modal (Triggered by 'Book Pickup' CTA) */}
      <PickupBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          fetchData(); // Refetch pickups upon closing so new booking appears immediately
        }}
        defaultCity={customer?.defaultAddress ? undefined : "Patna"}
      />
    </div>
  );
}

