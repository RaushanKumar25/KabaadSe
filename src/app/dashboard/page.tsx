"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import BrandLogo from "@/components/BrandLogo";
import PickupBookingModal from "@/components/PickupBookingModal";
import { PickupTrackingParallaxCard } from "@/components/ui/pickup-tracking-parallax-card";
import { KnowAboutKabad } from "@/components/ui/know-about-kabad";
import { VirtualPaperCalendar } from "@/components/ui/virtual-paper-calendar";
import { ProfileAvatarCard } from "@/components/ui/profile-avatar-card";
import { useTheme } from "@/context/ThemeContext";
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
  Leaf,
  Flame,
  Edit3,
  Save,
  ChevronRight,
  RotateCcw,
  Sun,
  Moon,
  Menu,
  LayoutDashboard,
  Layers,
  TrendingUp,
  CreditCard,
  AlertTriangle,
  Sparkles,
  Camera,
  BookOpen,
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
  customerId?: string | null;
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
    label: "Booked",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800/60",
  },
  CONFIRMED: {
    label: "Assigned",
    bg: "bg-sky-50 dark:bg-sky-950/40",
    text: "text-sky-700 dark:text-sky-300",
    border: "border-sky-200 dark:border-sky-800/60",
  },
  COMPLETED: {
    label: "Weighed & Paid",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800/60",
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "bg-slate-100 dark:bg-slate-900",
    text: "text-slate-600 dark:text-slate-400",
    border: "border-slate-200 dark:border-slate-800",
  },
};

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { theme, toggleTheme, mounted } = useTheme();

  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [pickups, setPickups] = useState<CustomerPickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"overview" | "pickups" | "address" | "guide">("overview");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "COMPLETED" | "CANCELLED">("ALL");

  // Selected Active Pickup Index for the 3D Parallax Card
  const [activePickupTabIdx, setActivePickupTabIdx] = useState(0);

  // Slide-Over Detail & Receipt Drawer States
  const [drawerPickup, setDrawerPickup] = useState<CustomerPickup | null>(null);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newRescheduleDate, setNewRescheduleDate] = useState("");
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Address & UPI inline edit state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editAddressText, setEditAddressText] = useState("");
  const [customerUpiId, setCustomerUpiId] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // Universal Booking Modal States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [preselectedDate, setPreselectedDate] = useState("");
  const [preselectedCategory, setPreselectedCategory] = useState("");

  // Customer Profile Photo State
  const [customerPhoto, setCustomerPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Saved Photo and UPI from localStorage on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUpi = localStorage.getItem("kabaadse_customer_upi");
      if (savedUpi) setCustomerUpiId(savedUpi);

      const key = customer?.id ? `kabaadse_photo_${customer.id}` : "kabaadse_customer_photo";
      const savedPhoto = localStorage.getItem(key) || localStorage.getItem("kabaadse_customer_photo");
      if (savedPhoto) setCustomerPhoto(savedPhoto);
    }
  }, [customer?.id]);

  const processPhotoFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("Please choose an image under 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCustomerPhoto(dataUrl);
      if (typeof window !== "undefined") {
        const key = customer?.id ? `kabaadse_photo_${customer.id}` : "kabaadse_customer_photo";
        localStorage.setItem(key, dataUrl);
        localStorage.setItem("kabaadse_customer_photo", dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processPhotoFile(file);
    }
  };

  const handleRemovePhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCustomerPhoto(null);
    if (typeof window !== "undefined") {
      if (customer?.id) {
        localStorage.removeItem(`kabaadse_photo_${customer.id}`);
      }
      localStorage.removeItem("kabaadse_customer_photo");
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Load customer profile and pickups
  const fetchData = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      const meRes = await fetch("/api/customer/me", { cache: "no-store" });
      const meData = await meRes.json();

      if (!meRes.ok || !meData.success || !meData.customer) {
        router.push("/?auth=customer");
        return;
      }
      setCustomer(meData.customer);
      setEditAddressText(meData.customer.defaultAddress || "");

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
  const activePickupsList = useMemo(
    () => pickups.filter((p) => ["PENDING", "CONFIRMED"].includes(p.status)),
    [pickups]
  );
  const completedPickupsList = useMemo(
    () => pickups.filter((p) => p.status === "COMPLETED"),
    [pickups]
  );

  // Total Earnings
  const totalEarnings = useMemo(
    () =>
      completedPickupsList.reduce(
        (sum, p) => sum + (typeof p.finalPayoutInr === "number" ? p.finalPayoutInr : 0),
        0
      ),
    [completedPickupsList]
  );

  // Total Scrap Recycled (kg) & Eco Impact
  const totalKg = useMemo(() => {
    let sum = 0;
    for (const p of completedPickupsList) {
      if (typeof p.actualWeightKg === "number" && p.actualWeightKg > 0) {
        sum += p.actualWeightKg;
      } else {
        if (p.estimatedLoad.includes("< 20")) sum += 15;
        else if (p.estimatedLoad.includes("20-50")) sum += 35;
        else if (p.estimatedLoad.includes("50-100")) sum += 75;
        else if (p.estimatedLoad.includes("100+")) sum += 120;
        else sum += 20;
      }
    }
    return Math.round(sum);
  }, [completedPickupsList]);

  // Carbon Offset: ~1.8 kg CO2 saved per kg recycled scrap
  const co2Saved = Math.round(totalKg * 1.8);

  // Completed Pickups Count
  const completedCount = completedPickupsList.length;

  // Current active pickup for the 3D Tracking Parallax Card
  const selectedActivePickup =
    activePickupsList[activePickupTabIdx] || activePickupsList[0] || pickups[0] || null;

  // Filtered Pickups for the History List
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

  // Handle Save Address & UPI Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccessMsg(null);
    try {
      const res = await fetch("/api/customer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ defaultAddress: editAddressText.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (customer) {
          setCustomer({ ...customer, defaultAddress: editAddressText.trim() });
        }
        if (typeof window !== "undefined") {
          localStorage.setItem("kabaadse_customer_upi", customerUpiId.trim());
        }
        setIsEditingAddress(false);
        setProfileSuccessMsg("Saved address & payout settings!");
        setTimeout(() => setProfileSuccessMsg(null), 3500);
      } else {
        alert(data.error || "Failed to update address.");
      }
    } catch (err: any) {
      alert(err.message || "Network error updating address.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle Repeat Last Pickup
  const handleRepeatLastPickup = () => {
    setPreselectedDate("");
    setIsBookingModalOpen(true);
  };

  // Handle Booking Cancellation
  const handleCancelPickup = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this doorstep scrap pickup?")) {
      return;
    }
    setIsSubmittingAction(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await fetch(`/api/pickups/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccess("Pickup has been successfully cancelled.");
        setPickups((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: "CANCELLED" } : p))
        );
        if (drawerPickup?.id === id) {
          setDrawerPickup({ ...drawerPickup, status: "CANCELLED" });
        }
      } else {
        setActionError(data.error || "Failed to cancel pickup.");
      }
    } catch (err: any) {
      setActionError(err.message || "Failed to cancel pickup.");
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // Handle Reschedule Slot
  const handleReschedulePickup = async (id: string) => {
    if (!newRescheduleDate) {
      setActionError("Please choose a valid new pickup date.");
      return;
    }
    setIsSubmittingAction(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await fetch(`/api/pickups/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickupDate: newRescheduleDate }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccess(`Pickup slot rescheduled for ${newRescheduleDate}`);
        setIsRescheduling(false);
        setPickups((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, pickupDate: newRescheduleDate } : p
          )
        );
        if (drawerPickup?.id === id) {
          setDrawerPickup({ ...drawerPickup, pickupDate: newRescheduleDate });
        }
      } else {
        setActionError(data.error || "Failed to reschedule slot.");
      }
    } catch (err: any) {
      setActionError(err.message || "Failed to reschedule slot.");
    } finally {
      setIsSubmittingAction(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#07090E] flex flex-col items-center justify-center text-slate-600 dark:text-slate-300 transition-colors duration-200">
        <BrandLogo size={36} className="h-9 w-9 animate-pulse mb-3" />
        <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Loading your KabaadSe Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090E] text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 transition-colors duration-200">
      {/* =========================================================
          LEFT SIDEBAR RAIL (PADHEGA STYLE: AIRY, CLEAN, SPACIOUS)
          ========================================================= */}
      <aside className="hidden lg:flex flex-col justify-between fixed top-0 bottom-0 left-0 w-64 bg-white/95 dark:bg-[#0B0F19]/95 border-r border-slate-200 dark:border-slate-800/80 p-6 z-40 backdrop-blur-xl shadow-xs">
        {/* Top: Logo & Nav items */}
        <div className="space-y-7">
          <Link href="/" className="flex items-center gap-3 group transition hover:opacity-95">
            <BrandLogo size={32} className="h-8 w-8 shrink-0" />
            <div className="flex flex-col leading-none">
              <span className="text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                Kabaad<span className="text-emerald-600 dark:text-emerald-400">Se</span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                Doorstep Recycling
              </span>
            </div>
          </Link>

          {/* Nav Items with Active Vertical Indicator */}
          <nav className="space-y-1.5 pt-2">
            <button
              type="button"
              onClick={() => {
                setActiveSection("overview");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${
                activeSection === "overview"
                  ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 font-semibold border-l-2 border-l-emerald-600 dark:border-l-emerald-500"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Overview</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveSection("pickups");
                document.getElementById("pickups-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${
                activeSection === "pickups"
                  ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 font-semibold border-l-2 border-l-emerald-600 dark:border-l-emerald-500"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span>My Pickups</span>
              {activePickupsList.length > 0 && (
                <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white">
                  {activePickupsList.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveSection("guide");
                document.getElementById("kabad-guide-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${
                activeSection === "guide"
                  ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 font-semibold border-l-2 border-l-emerald-600 dark:border-l-emerald-500"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Kabad Guide</span>
            </button>

            <Link
              href="/rates"
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition"
            >
              <TrendingUp className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Live Scrap Rates</span>
              <ArrowRight className="w-4 h-4 ml-auto text-slate-400 dark:text-zinc-500" />
            </Link>

            <button
              type="button"
              onClick={() => {
                setActiveSection("address");
                document.getElementById("address-card")?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${
                activeSection === "address"
                  ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 font-semibold border-l-2 border-l-emerald-600 dark:border-l-emerald-500"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              <CreditCard className="w-4 h-4 shrink-0" />
              <span>Address & UPI</span>
            </button>
          </nav>
        </div>

        {/* Bottom: Customer Profile, Logout & Copyright */}
        <div className="border-t border-slate-200 dark:border-slate-800/80 pt-5 space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-sm font-bold text-emerald-700 dark:text-emerald-400 shrink-0 overflow-hidden cursor-pointer relative group"
              title="Click to upload profile photo"
            >
              {customerPhoto ? (
                <img src={customerPhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                customer?.name ? customer.name.charAt(0).toUpperCase() : "C"
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="overflow-hidden leading-tight flex-1 min-w-0">
              <span className="text-sm font-bold text-slate-900 dark:text-white block truncate">
                {customer?.name || "Customer"}
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline block truncate text-left cursor-pointer font-medium"
              >
                {customerPhoto ? "Change photo" : "Upload photo"}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-300 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
          </button>

          <div className="text-[11px] text-slate-400 dark:text-zinc-500 text-center font-normal">
            © 2026 KabaadSe Portal
          </div>
        </div>
      </aside>

      {/* =========================================================
          MOBILE SLIDE-OVER DRAWER
          ========================================================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 flex lg:hidden bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="w-72 h-full bg-white dark:bg-[#0B0F19] border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-2xl"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-2.5">
                    <BrandLogo size={28} className="h-7 w-7" />
                    <span className="text-lg font-bold text-slate-950 dark:text-white">
                      Kabaad<span className="text-emerald-600 dark:text-emerald-400">Se</span>
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSection("overview");
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 text-left"
                  >
                    <LayoutDashboard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Overview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveSection("pickups");
                      setMobileMenuOpen(false);
                      document.getElementById("pickups-section")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 text-left"
                  >
                    <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>My Pickups</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveSection("guide");
                      setMobileMenuOpen(false);
                      document.getElementById("kabad-guide-section")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 text-left"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Kabad Guide</span>
                  </button>

                  <Link
                    href="/rates"
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
                  >
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Live Scrap Rates</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveSection("address");
                      setMobileMenuOpen(false);
                      document.getElementById("address-card")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 text-left"
                  >
                    <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Address & UPI</span>
                  </button>
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <div
                    onClick={() => {
                      setMobileMenuOpen(false);
                      fileInputRef.current?.click();
                    }}
                    className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-700 dark:text-emerald-400 shrink-0 overflow-hidden cursor-pointer"
                  >
                    {customerPhoto ? (
                      <img src={customerPhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      customer?.name ? customer.name.charAt(0).toUpperCase() : "C"
                    )}
                  </div>
                  <div className="overflow-hidden leading-tight flex-1 min-w-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                      {customer?.name || "Customer"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        fileInputRef.current?.click();
                      }}
                      className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline block truncate text-left"
                    >
                      {customerPhoto ? "Change photo" : "Upload photo"}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-300 text-xs font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================
          MAIN DASHBOARD AREA (RESPONSIVE lg:pl-64)
          ========================================================= */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Minimal Bar (Theme Switcher & Refresh) */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/60 px-4 sm:px-6 lg:px-8 py-3 transition-colors duration-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Left: Mobile hamburger */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 lg:hidden cursor-pointer shadow-xs"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 hidden sm:inline">
                KabaadSe Customer Operations Console
              </span>
            </div>

            {/* Right: Theme Toggle & Quick Refresh */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={toggleTheme}
                className="h-9 px-3.5 rounded-full bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-medium flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                title="Toggle Theme"
              >
                {mounted && theme === "light" ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-700" />
                    <span>Dark</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => fetchData(true)}
                disabled={isRefreshing}
                className="h-9 px-3.5 rounded-full bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                title="Refresh bookings"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-600 dark:text-emerald-400" : ""}`} />
                <span>Refresh</span>
              </button>

              {/* Header Profile Photo Avatar */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-9 w-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-700 dark:text-emerald-400 overflow-hidden cursor-pointer shadow-xs relative group transition-transform hover:scale-105"
                title="Click to upload profile photo"
              >
                {customerPhoto ? (
                  <img src={customerPhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  customer?.name ? customer.name.charAt(0).toUpperCase() : "C"
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Camera className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* =======================================================
            MAIN CONTENT CONTAINER (max-w-7xl mx-auto px-4 sm:px-6 lg:px-8)
            ======================================================= */}
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
          {/* =====================================================
              HERO SECTION: BIG DISPLAY HEADING (PADHEGA STYLE)
              ===================================================== */}
          <div className="relative rounded-none bg-gradient-to-br from-emerald-50/70 via-slate-50 to-white dark:from-[#0c1017] dark:via-[#091310] dark:to-[#070b09] border border-emerald-100/80 dark:border-white/10 p-8 sm:p-10 lg:p-12 overflow-hidden shadow-2xl backdrop-blur-2xl transition-colors duration-200">
            {/* Ambient soft glow */}
            <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl" />

            {/* Hidden file input for photo upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left: Big Bold Display Heading & CTAs (lg:col-span-8) */}
              <div className="lg:col-span-8 space-y-5">
                {/* Verified Status Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none text-xs font-semibold bg-emerald-100/80 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800/60 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                  <span>Verified Household Recycling Account</span>
                </div>

                {/* Big Display Heading */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.08]">
                  Welcome back, <br />
                  <span className="text-[#15803D] dark:text-emerald-400">{customer?.name || "Customer"}.</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-300 max-w-xl font-normal leading-relaxed">
                  Track your active doorstep pickups, monitor verified digital scale payouts, and explore live recycling categories.
                </p>

                {/* Clean Rounded Action Buttons */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPreselectedDate("");
                      setPreselectedCategory("");
                      setIsBookingModalOpen(true);
                    }}
                    className="h-12 px-7 rounded-none bg-[#15803D] hover:bg-[#166534] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2.5 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <span>+ Book Scrap Pickup</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>

                  <Link
                    href="/rates"
                    className="h-12 px-7 rounded-none bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-slate-300 dark:border-white/15 hover:border-slate-400 dark:border-white/30 text-slate-800 dark:text-white font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md shadow-xs hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Check Live Rates</span>
                  </Link>
                </div>
              </div>

              {/* Right: Clean Profile Avatar Card */}
              <div className="lg:col-span-4 flex items-center justify-center lg:justify-end">
                <ProfileAvatarCard
                  name={customer?.name || "Customer"}
                  subCaption="Personal Account"
                  photoUrl={customerPhoto}
                  onPhotoUpload={processPhotoFile}
                  onPhotoRemove={() => handleRemovePhoto()}
                  className="w-full max-w-[260px]"
                />
              </div>
            </div>
          </div>

          {/* =====================================================
              ROW 1 — 4 EQUAL-HEIGHT KPI CARDS (grid-cols-2 lg:grid-cols-4)
              ===================================================== */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Card 1: Total Earnings */}
            <div className="p-5 rounded-none h-full flex items-center gap-4 bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-xl">
              <div className="w-11 h-11 rounded-none bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 block">
                  Total earnings
                </span>
                <div className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white tabular-nums truncate">
                  ₹{totalEarnings.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            {/* Card 2: Scrap Recycled */}
            <div className="p-5 rounded-none h-full flex items-center gap-4 bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-xl">
              <div className="w-11 h-11 rounded-none bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 block">
                  Scrap recycled
                </span>
                <div className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white tabular-nums truncate">
                  {totalKg} <span className="text-xs font-normal text-slate-500 dark:text-zinc-400">kg</span>
                </div>
              </div>
            </div>

            {/* Card 3: CO2 Saved */}
            <div className="p-5 rounded-none h-full flex items-center gap-4 bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-xl">
              <div className="w-11 h-11 rounded-none bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 block">
                  CO₂ saved
                </span>
                <div className="text-xl sm:text-2xl font-bold text-[#15803D] dark:text-emerald-400 tabular-nums truncate">
                  {co2Saved} <span className="text-xs font-normal text-slate-500 dark:text-zinc-400">kg</span>
                </div>
              </div>
            </div>

            {/* Card 4: Completed Pickups */}
            <div className="p-5 rounded-none h-full flex items-center gap-4 bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-xl">
              <div className="w-11 h-11 rounded-none bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 block">
                  Completed pickups
                </span>
                <div className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white tabular-nums truncate">
                  {completedCount} <span className="text-xs font-normal text-slate-500 dark:text-zinc-400">trips</span>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              ROW 2 — ACTIVE PICKUP 3D CARD + SAVED ADDRESS & UPI (grid-cols-12)
              ===================================================== */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left (col-span-7): 3D Tracking Parallax Card */}
            <div className="lg:col-span-7 space-y-3 flex flex-col justify-between">
              {activePickupsList.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
                  <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium shrink-0">
                    Active Pickups:
                  </span>
                  {activePickupsList.map((p, idx) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActivePickupTabIdx(idx)}
                      className={`px-3 py-1 rounded-none text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                        activePickupTabIdx === idx
                          ? "bg-[#15803D] dark:bg-emerald-600 text-white shadow-xs"
                          : "bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
                      }`}
                    >
                      #{p.id.slice(-6).toUpperCase()} • {p.pickupDate}
                    </button>
                  ))}
                </div>
              )}

              {selectedActivePickup ? (
                <div className="h-full flex flex-col justify-between">
                  <PickupTrackingParallaxCard
                    bookingId={selectedActivePickup.id}
                    scrapSummary={selectedActivePickup.scrapTypes}
                    status={selectedActivePickup.status}
                    scheduledSlot={selectedActivePickup.pickupDate}
                    estimatedWeightKg={
                      selectedActivePickup.actualWeightKg
                        ? `${selectedActivePickup.actualWeightKg} kg`
                        : selectedActivePickup.estimatedLoad
                    }
                    finalPayoutInr={selectedActivePickup.finalPayoutInr}
                    badgeLabel={selectedActivePickup.locality}
                    onSelect={() => setDrawerPickup(selectedActivePickup)}
                  />
                </div>
              ) : (
                <div className="rounded-none border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900/80 p-8 text-center space-y-4 shadow-xl backdrop-blur-xl h-full flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-none bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                    <Truck className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-950 dark:text-white">Schedule Your First Pickup</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm">
                      Accurate digital scale weighing with instant UPI bank deposits right at your doorstep.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPreselectedDate("");
                      setPreselectedCategory("");
                      setIsBookingModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-none bg-[#15803D] hover:bg-[#166534] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Book Scrap Pickup</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right (col-span-5): Saved Pickup Address & UPI Card */}
            <div
              id="address-card"
              className="lg:col-span-5 rounded-none border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900/80 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-none bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white tracking-wide">
                      Doorstep Address & UPI Payout
                    </span>
                  </div>

                  {!isEditingAddress && (
                    <button
                      type="button"
                      onClick={() => setIsEditingAddress(true)}
                      className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                {profileSuccessMsg && (
                  <div className="p-2.5 rounded-none bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{profileSuccessMsg}</span>
                  </div>
                )}

                {isEditingAddress ? (
                  <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">
                        Default Pickup Address
                      </label>
                      <textarea
                        value={editAddressText}
                        onChange={(e) => setEditAddressText(e.target.value)}
                        rows={2}
                        placeholder="e.g. Flat 402, Shivam Enclave, Main Road, Patna"
                        className="w-full px-3.5 py-2.5 rounded-none bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">
                        Instant UPI ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={customerUpiId}
                        onChange={(e) => setCustomerUpiId(e.target.value)}
                        placeholder="e.g. mobile@upi or name@okaxis"
                        className="w-full px-3.5 py-2.5 rounded-none bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="flex-1 py-2.5 px-3 rounded-none bg-[#15803D] hover:bg-[#166534] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-60"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSavingProfile ? "Saving..." : "Save Changes"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingAddress(false);
                          setEditAddressText(customer?.defaultAddress || "");
                        }}
                        className="py-2.5 px-3 rounded-none bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 rounded-none bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80">
                      <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 block mb-1">
                        Saved Location
                      </span>
                      <p className="text-slate-800 dark:text-zinc-200 font-medium">
                        {customer?.defaultAddress || (
                          <span className="text-slate-400 dark:text-zinc-500 italic">
                            No address saved yet. Click Edit to add your default pickup location.
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-none bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 block">
                          Instant Payout Mode
                        </span>
                        <span className="text-emerald-700 dark:text-emerald-300 font-semibold text-xs flex items-center gap-1 mt-0.5">
                          <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>{customerUpiId || `${customer?.phone}@upi`}</span>
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-none border border-emerald-500/20">
                        Verified
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Repeat Last Pickup Button */}
              {pickups.length > 0 && (
                <button
                  type="button"
                  onClick={handleRepeatLastPickup}
                  className="w-full py-2.5 px-4 rounded-none bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer hover:border-emerald-500/40 dark:hover:border-emerald-500/30 shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Repeat Last Pickup</span>
                </button>
              )}
            </div>
          </section>

          {/* =====================================================
              ROW 3 — KABAD EDITORIAL GUIDE + VIRTUAL PAPER CALENDAR (grid-cols-12)
              ===================================================== */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left (col-span-7): Editorial Category Guide with Auto-Sliding Showcase & Drawers */}
            <div className="lg:col-span-7 flex flex-col">
              <KnowAboutKabad
                onSellScrap={(catName) => {
                  setPreselectedCategory(catName);
                  setPreselectedDate("");
                  setIsBookingModalOpen(true);
                }}
              />
            </div>

            {/* Right (col-span-5): Virtual Paper Desk Calendar */}
            <div className="lg:col-span-5 flex flex-col">
              <VirtualPaperCalendar
                pickups={pickups}
                onSelectPickup={(p) => setDrawerPickup(p as CustomerPickup)}
                onScheduleDate={(dateStr) => {
                  setPreselectedDate(dateStr);
                  setIsBookingModalOpen(true);
                }}
              />
            </div>
          </section>

          {/* =====================================================
              ROW 4 — CLEAN BOOKINGS & DIGITAL RECEIPTS LIST
              ===================================================== */}
          <section
            id="pickups-section"
            className="rounded-none border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900/80 p-6 sm:p-7 shadow-xl backdrop-blur-xl space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950 dark:text-white tracking-tight">
                  My Bookings & Digital Receipts
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  Click any booking to track timeline, reschedule slot, cancel, or print certified receipt
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-none border border-slate-200 dark:border-slate-800 text-xs font-semibold overflow-x-auto scrollbar-none">
                {(["ALL", "ACTIVE", "COMPLETED", "CANCELLED"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setStatusFilter(tab)}
                    className={`px-3 py-1.5 rounded-none transition cursor-pointer whitespace-nowrap ${
                      statusFilter === tab
                        ? "bg-white dark:bg-slate-800 text-slate-950 dark:text-white font-bold shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
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
                <Package className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-300">
                  No scrap pickup bookings found
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-500 max-w-sm mx-auto">
                  {statusFilter === "ALL"
                    ? "You haven't scheduled any scrap pickups yet. Book your first pickup today!"
                    : `No bookings found with status ${statusFilter}.`}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setPreselectedDate("");
                    setPreselectedCategory("");
                    setIsBookingModalOpen(true);
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-none bg-[#15803D] hover:bg-[#166534] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer shadow-sm"
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
                      onClick={() => setDrawerPickup(pickup)}
                      className="p-4 sm:p-5 rounded-none bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/30 hover:bg-slate-100/90 dark:hover:bg-slate-900/60 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group shadow-xs"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-mono font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                            {shortId}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-none text-xs font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                          >
                            {statusConfig.label}
                          </span>
                          <span className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1 tabular-nums">
                            <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            {pickup.pickupDate}
                          </span>
                        </div>

                        <div className="text-xs text-slate-700 dark:text-slate-300 flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            {pickup.locality}, {pickup.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <Package className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span className="font-medium text-slate-900 dark:text-slate-200">{pickup.scrapTypes}</span>
                          </span>
                        </div>

                        <div className="text-xs text-slate-500 truncate max-w-lg">
                          {pickup.address}
                        </div>
                      </div>

                      {/* Right: Load, Payout & Details Button */}
                      <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-slate-800/80">
                        <div className="text-left md:text-right">
                          {pickup.finalPayoutInr ? (
                            <>
                              <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium block">
                                Verified payout
                              </span>
                              <span className="text-base sm:text-lg font-bold text-[#15803D] dark:text-emerald-400 tabular-nums">
                                ₹{pickup.finalPayoutInr.toLocaleString("en-IN")}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium block">
                                Estimated load
                              </span>
                              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                                {pickup.estimatedLoad}
                              </span>
                            </>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDrawerPickup(pickup);
                          }}
                          className="px-4 py-2 rounded-none bg-white dark:bg-slate-900 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/20 border border-slate-300 dark:border-slate-700 group-hover:border-emerald-400 dark:group-hover:border-emerald-500/30 text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Details & Receipt</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* =========================================================
          INTERACTIVE SLIDE-OVER DETAIL & RECEIPT DRAWER (SHEET)
          ========================================================= */}
      <AnimatePresence>
        {drawerPickup && (
          <div
            className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm"
            onClick={() => {
              setDrawerPickup(null);
              setIsRescheduling(false);
              setActionError(null);
              setActionSuccess(null);
            }}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg h-full bg-white dark:bg-[#0B0F19] border-l border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#0F172A]/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-none bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-base text-slate-950 dark:text-white">
                        #KB-{drawerPickup.id.slice(-6).toUpperCase()}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-none text-xs font-semibold border ${
                          STATUS_CONFIGS[drawerPickup.status]?.bg || "bg-slate-100 dark:bg-slate-900"
                        } ${STATUS_CONFIGS[drawerPickup.status]?.text || "text-slate-700 dark:text-slate-300"} ${
                          STATUS_CONFIGS[drawerPickup.status]?.border || "border-slate-200 dark:border-slate-800"
                        }`}
                      >
                        {STATUS_CONFIGS[drawerPickup.status]?.label || drawerPickup.status}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Scrap Pickup Lifecycle</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setDrawerPickup(null);
                    setIsRescheduling(false);
                  }}
                  className="p-1.5 rounded-none text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition cursor-pointer shadow-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Feedback notifications */}
                {actionSuccess && (
                  <div className="p-3 rounded-none bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-600 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{actionSuccess}</span>
                  </div>
                )}
                {actionError && (
                  <div className="p-3 rounded-none bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" />
                    <span>{actionError}</span>
                  </div>
                )}

                {/* 4-Step Interactive Timeline */}
                <div className="rounded-none bg-slate-50 dark:bg-[#0F172A]/80 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block border-b border-slate-200 dark:border-slate-800 pb-2">
                    Pickup Progress Timeline
                  </span>

                  <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                    {/* Stage 1: Booked */}
                    <div className="relative">
                      <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                        ✓
                      </span>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-950 dark:text-white">Booking Confirmed</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                            {drawerPickup.createdAt ? new Date(drawerPickup.createdAt).toLocaleDateString() : "Logged"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Doorstep slot scheduled for <strong>{drawerPickup.pickupDate}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Stage 2: Assigned */}
                    <div className="relative">
                      <span
                        className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          ["CONFIRMED", "COMPLETED"].includes(drawerPickup.status)
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700"
                        }`}
                      >
                        {["CONFIRMED", "COMPLETED"].includes(drawerPickup.status) ? "✓" : "2"}
                      </span>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-950 dark:text-white">Collector Assigned</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {drawerPickup.status === "CONFIRMED" ? "Active" : "Auto-Sector"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {["CONFIRMED", "COMPLETED"].includes(drawerPickup.status)
                            ? "Verified collector en route with ISO Bluetooth scale"
                            : "Pending assignment for current sector"}
                        </p>
                      </div>
                    </div>

                    {/* Stage 3: Digital Weighment */}
                    <div className="relative">
                      <span
                        className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          drawerPickup.status === "COMPLETED"
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700"
                        }`}
                      >
                        {drawerPickup.status === "COMPLETED" ? "✓" : "3"}
                      </span>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-950 dark:text-white">Digital Scale Weighment</span>
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                            {drawerPickup.actualWeightKg ? `${drawerPickup.actualWeightKg} kg` : drawerPickup.estimatedLoad}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {drawerPickup.actualWeightKg
                            ? `Certified weighment completed: ${drawerPickup.actualWeightKg} kg`
                            : "Awaiting doorstep weighment upon collector arrival"}
                        </p>
                      </div>
                    </div>

                    {/* Stage 4: Paid */}
                    <div className="relative">
                      <span
                        className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          drawerPickup.status === "COMPLETED"
                            ? "bg-[#15803D] dark:bg-emerald-600 text-white"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700"
                        }`}
                      >
                        {drawerPickup.status === "COMPLETED" ? "✓" : "4"}
                      </span>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-950 dark:text-white">Instant UPI Settlement</span>
                          {drawerPickup.finalPayoutInr && (
                            <span className="text-xs font-bold text-[#15803D] dark:text-emerald-400 tabular-nums">
                              ₹{drawerPickup.finalPayoutInr.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {drawerPickup.status === "COMPLETED"
                            ? "Payment transferred instantly to customer bank account"
                            : "Direct UPI payout upon final digital scale verification"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pickup Details Card */}
                <div className="rounded-none bg-slate-50 dark:bg-[#0F172A]/80 border border-slate-200 dark:border-slate-800 p-5 space-y-3 text-xs">
                  <span className="text-xs font-bold text-slate-950 dark:text-white uppercase tracking-wider block border-b border-slate-200 dark:border-slate-800 pb-2">
                    Doorstep Pickup Information
                  </span>

                  <div className="grid grid-cols-2 gap-3 text-slate-700 dark:text-slate-300">
                    <div>
                      <span className="text-xs text-slate-500 block">Customer</span>
                      <strong className="text-slate-950 dark:text-white text-sm">{drawerPickup.customerName}</strong>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Contact</span>
                      <span className="text-slate-900 dark:text-white tabular-nums">+91 {drawerPickup.customerPhone}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Locality</span>
                      <span className="text-slate-900 dark:text-white">{drawerPickup.locality}, {drawerPickup.city}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Scheduled Date</span>
                      <span className="text-slate-900 dark:text-white tabular-nums">{drawerPickup.pickupDate}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-800 pt-2">
                    <span className="text-xs text-slate-500 block">Full Address</span>
                    <span className="text-slate-700 dark:text-slate-300">{drawerPickup.address}</span>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-800 pt-2">
                    <span className="text-xs text-slate-500 block">Scrap Items</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{drawerPickup.scrapTypes}</span>
                  </div>
                </div>

                {/* Reschedule Slot Inline Card */}
                {isRescheduling && (
                  <div className="rounded-none bg-white dark:bg-slate-900 border border-emerald-500/40 p-5 space-y-3 shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-950 dark:text-white flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Select New Pickup Date</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsRescheduling(false)}
                        className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={newRescheduleDate}
                        onChange={(e) => setNewRescheduleDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-none bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500"
                      />

                      <div className="flex items-center gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            const d = new Date();
                            d.setDate(d.getDate() + 1);
                            setNewRescheduleDate(d.toISOString().split("T")[0]);
                          }}
                          className="px-3 py-1.5 rounded-none bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                        >
                          Tomorrow
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const d = new Date();
                            d.setDate(d.getDate() + 2);
                            setNewRescheduleDate(d.toISOString().split("T")[0]);
                          }}
                          className="px-3 py-1.5 rounded-none bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                        >
                          In 2 Days
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isSubmittingAction || !newRescheduleDate}
                      onClick={() => handleReschedulePickup(drawerPickup.id)}
                      className="w-full py-2.5 rounded-none bg-[#15803D] hover:bg-[#166534] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer disabled:opacity-50"
                    >
                      {isSubmittingAction ? "Updating Slot..." : "Confirm New Slot"}
                    </button>
                  </div>
                )}
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-[#0F172A]/90 space-y-2.5">
                {["PENDING", "CONFIRMED"].includes(drawerPickup.status) && (
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsRescheduling(!isRescheduling)}
                      className="flex-1 py-2.5 px-4 rounded-none bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Reschedule Slot</span>
                    </button>

                    <button
                      type="button"
                      disabled={isSubmittingAction}
                      onClick={() => handleCancelPickup(drawerPickup.id)}
                      className="py-2.5 px-4 rounded-none bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}

                {drawerPickup.status === "COMPLETED" && (
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="w-full py-2.5 px-4 rounded-none bg-[#15803D] hover:bg-[#166534] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                  >
                    <Printer className="w-4 h-4 stroke-[2.5]" />
                    <span>Print Certified Digital Receipt</span>
                  </button>
                )}

                {drawerPickup.status === "CANCELLED" && (
                  <button
                    type="button"
                    onClick={() => {
                      setDrawerPickup(null);
                      setPreselectedDate("");
                      setPreselectedCategory("");
                      setIsBookingModalOpen(true);
                    }}
                    className="w-full py-2.5 px-4 rounded-none bg-[#15803D] hover:bg-[#166534] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Book New Pickup</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Universal Pickup Booking Modal */}
      <PickupBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setPreselectedDate("");
          setPreselectedCategory("");
          fetchData();
        }}
        defaultCity={customer?.defaultAddress ? undefined : "Patna"}
        defaultPickupDate={preselectedDate}
        defaultCategory={preselectedCategory}
      />
    </div>
  );
}
