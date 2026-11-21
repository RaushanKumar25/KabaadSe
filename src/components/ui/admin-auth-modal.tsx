"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import BrandLogo from "@/components/BrandLogo";
import {
  User,
  Lock,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  X,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  LogIn,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GoogleGIcon } from "@/components/icons/google-icon";

interface AdminAuthModalProps {
  defaultOpen?: boolean;
  standalonePage?: boolean;
  defaultTab?: "customer" | "admin";
  triggerText?: string;
  triggerClassName?: string;
  onSuccess?: () => void;
}

export default function AdminAuthModal({
  defaultOpen = false,
  standalonePage = false,
  defaultTab,
  triggerText = "Sign up / Login",
  triggerClassName,
  onSuccess,
}: AdminAuthModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [activeTab, setActiveTab] = useState<"customer" | "admin">(
    defaultTab ?? (standalonePage ? "admin" : "customer")
  );

  // Customer sub-view: "login" vs "signup"
  const [customerMode, setCustomerMode] = useState<"login" | "signup">("login");

  // Customer Form state
  const [customerIdentifier, setCustomerIdentifier] = useState("");
  const [customerPassword, setCustomerPassword] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [showCustomerPassword, setShowCustomerPassword] = useState(false);

  // Admin Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Common submission states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // SSR hydration safety for createPortal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for ?auth=customer or ?auth=admin in URL query parameters
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const authParam = params.get("auth");
      if (authParam === "customer") {
        setIsOpen(true);
        setActiveTab("customer");
      } else if (authParam === "admin") {
        setIsOpen(true);
        setActiveTab("admin");
      }
    }
  }, []);

  // Sync defaultOpen and defaultTab changes
  useEffect(() => {
    setIsOpen(defaultOpen);
  }, [defaultOpen]);

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  // Lock body scroll when modal is open as overlay
  useEffect(() => {
    if (standalonePage || !isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setErrorMessage(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, standalonePage]);

  // -------------------------------------------------------------
  // CUSTOMER AUTH HANDLERS
  // -------------------------------------------------------------
  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerIdentifier.trim() || !customerPassword) {
      setErrorMessage("Please enter your email or phone and password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/customer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          identifier: customerIdentifier.trim(),
          password: customerPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Invalid credentials. Please try again.");
        setIsLoading(false);
        return;
      }

      setIsOpen(false);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setErrorMessage("Unable to connect to authentication server. Please check your connection.");
      setIsLoading(false);
    }
  };

  const handleCustomerSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = customerPhone.replace(/\D/g, "").slice(0, 10);

    if (customerName.trim().length < 2) {
      setErrorMessage("Full name must be at least 2 characters.");
      return;
    }

    if (!customerEmail.trim().includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (cleanPhone.length !== 10) {
      setErrorMessage("Mobile number must be exactly 10 digits.");
      return;
    }

    if (customerPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/customer/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          name: customerName.trim(),
          email: customerEmail.trim().toLowerCase(),
          phone: cleanPhone,
          password: customerPassword,
          defaultAddress: customerAddress.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to create account. Please try again.");
        setIsLoading(false);
        return;
      }

      setIsOpen(false);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setErrorMessage("Unable to connect to authentication server. Please check your connection.");
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // ADMIN AUTH HANDLER
  // -------------------------------------------------------------
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMessage("Please enter both username and password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Invalid username or password.");
        setIsLoading(false);
        return;
      }

      setIsOpen(false);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setErrorMessage("Unable to connect to authentication server.");
      setIsLoading(false);
    }
  };

  const modalCardContent = (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring", stiffness: 350, damping: 26 },
      }}
      exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.15 } }}
      onClick={(e) => e.stopPropagation()}
      className="relative w-full max-w-[430px] rounded-3xl bg-white border border-slate-200/90 shadow-2xl p-6 sm:p-7 text-slate-900 overflow-hidden my-auto max-h-[92vh] overflow-y-auto"
    >
      {/* Top Close Button (overlay mode only) */}
      {!standalonePage && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setErrorMessage(null);
          }}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer shadow-2xs z-20"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Header Brand Emblem */}
      <div className="flex flex-col items-center text-center mb-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center p-2 mb-2 shadow-xs">
          <BrandLogo size={28} className="h-7 w-7" />
        </div>

        {/* 2-Role Tab Pill Switcher */}
        <div className="w-full p-1 bg-slate-100 rounded-full border border-slate-200/80 grid grid-cols-2 gap-1 text-xs font-semibold mt-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab("customer");
              setErrorMessage(null);
            }}
            className={cn(
              "py-1.5 px-3 rounded-full text-center transition-all cursor-pointer flex items-center justify-center gap-1.5",
              activeTab === "customer"
                ? "bg-white text-slate-950 shadow-xs font-bold"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <User className="w-3.5 h-3.5" />
            <span>Customer</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("admin");
              setErrorMessage(null);
            }}
            className={cn(
              "py-1.5 px-3 rounded-full text-center transition-all cursor-pointer flex items-center justify-center gap-1.5",
              activeTab === "admin"
                ? "bg-white text-slate-950 shadow-xs font-bold"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin / Ops</span>
          </button>
        </div>
      </div>

      {/* Error Message Alert */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 text-xs text-red-600 bg-red-50 border border-red-200 px-3.5 py-2 rounded-xl text-center font-medium leading-relaxed"
          role="alert"
        >
          {errorMessage}
        </motion.div>
      )}

      {/* =========================================================
          TAB 1: CUSTOMER VIEW (LOG IN & SIGN UP)
          ========================================================= */}
      {activeTab === "customer" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {customerMode === "login" ? "Customer Log In" : "Customer Sign Up"}
              </h2>
              <p className="text-[11px] text-slate-500">
                {customerMode === "login"
                  ? "Access your pickups & instant payouts"
                  : "Track pickups and link previous guest bookings"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setCustomerMode(customerMode === "login" ? "signup" : "login");
                setErrorMessage(null);
              }}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition cursor-pointer underline underline-offset-2 shrink-0 ml-2"
            >
              {customerMode === "login" ? "Create Account" : "I have an account"}
            </button>
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={() => {
              window.location.href = "/api/auth/google";
            }}
            className="w-full h-11 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <GoogleGIcon className="w-4 h-4 shrink-0" />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative px-3 bg-white text-[11px] text-slate-400 font-medium uppercase tracking-wider">
              {customerMode === "login" ? "or log in with mobile/email" : "or sign up with email"}
            </span>
          </div>

          {/* SUB-VIEW A: CUSTOMER LOG IN */}
          {customerMode === "login" && (
            <form onSubmit={handleCustomerLogin} className="space-y-3">
              {/* Identifier (Email or Phone) */}
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400 pointer-events-none">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={customerIdentifier}
                  onChange={(e) => {
                    setCustomerIdentifier(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Mobile number or email"
                  className="w-full h-11 pl-11 pr-4 rounded-full bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 transition-all"
                />
              </div>

              {/* Password */}
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showCustomerPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={customerPassword}
                  onChange={(e) => {
                    setCustomerPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Password"
                  className="w-full h-11 pl-11 pr-24 rounded-full bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 transition-all"
                />

                <button
                  type="button"
                  onClick={() => setShowCustomerPassword(!showCustomerPassword)}
                  className="absolute right-12 text-slate-400 hover:text-slate-600 p-1.5 transition cursor-pointer"
                  aria-label={showCustomerPassword ? "Hide password" : "Show password"}
                >
                  {showCustomerPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-1.5 h-8 w-8 rounded-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs disabled:opacity-60 disabled:cursor-not-allowed group"
                  aria-label="Submit login"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  )}
                </button>
              </div>

              <div className="pt-2 text-center">
                <span className="text-[11px] text-slate-400">
                  New to KabaadSe?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setCustomerMode("signup");
                      setErrorMessage(null);
                    }}
                    className="text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    Sign up now
                  </button>
                </span>
              </div>
            </form>
          )}

          {/* SUB-VIEW B: CUSTOMER SIGN UP */}
          {customerMode === "signup" && (
            <form onSubmit={handleCustomerSignup} className="space-y-2.5">
              {/* Full Name */}
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400 pointer-events-none">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Full name"
                  className="w-full h-10 pl-11 pr-4 rounded-full bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 transition-all"
                />
              </div>

              {/* Mobile Number */}
              <div className="relative flex items-center">
                <div className="flex rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-50/80 focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/15 transition-all overflow-hidden w-full h-10">
                  <span className="inline-flex items-center pl-4 pr-1.5 text-xs font-bold text-slate-500 select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    pattern="[0-9]{10}"
                    value={customerPhone}
                    onChange={(e) => {
                      setCustomerPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="10-digit mobile number"
                    className="w-full bg-transparent pr-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={customerEmail}
                  onChange={(e) => {
                    setCustomerEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Email address"
                  className="w-full h-10 pl-11 pr-4 rounded-full bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 transition-all"
                />
              </div>

              {/* Password */}
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showCustomerPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={customerPassword}
                  onChange={(e) => {
                    setCustomerPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Create password (min 6 chars)"
                  className="w-full h-10 pl-11 pr-11 rounded-full bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 transition-all"
                />

                <button
                  type="button"
                  onClick={() => setShowCustomerPassword(!showCustomerPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 p-1 transition cursor-pointer"
                  aria-label={showCustomerPassword ? "Hide password" : "Show password"}
                >
                  {showCustomerPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Default Address (Optional) */}
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400 pointer-events-none">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Default address / locality (optional)"
                  className="w-full h-10 pl-11 pr-4 rounded-full bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Customer Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-slate-400 text-center leading-tight">
                Any previous doorstep bookings made with your phone number will be automatically linked.
              </p>
            </form>
          )}

          {/* Guest Booking Helper */}
          <div className="pt-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                const sellButton = document.querySelector<HTMLButtonElement>(
                  'header button:has-text("Sell Scrap"), [data-action="sell-scrap"]'
                );
                if (sellButton) {
                  sellButton.click();
                } else {
                  router.push("/#sell-scrap");
                }
              }}
              className="w-full py-2 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Book Scrap Pickup (No Account Required)</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 2: ADMIN / OPS VIEW (REAL ENVIRONMENT AUTHENTICATION)
          ========================================================= */}
      {activeTab === "admin" && (
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Welcome back
            </h2>
          </div>

          <form onSubmit={handleAdminSubmit} className="space-y-3">
            {/* Username Field */}
            <div className="relative flex items-center">
              <div className="absolute left-4 text-slate-400 pointer-events-none">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Admin username"
                className="w-full h-11 pl-11 pr-4 rounded-full bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 transition-all"
              />
            </div>

            {/* Password Field with Integrated Circular Submit Arrow Button */}
            <div className="relative flex items-center">
              <div className="absolute left-4 text-slate-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Password"
                className="w-full h-11 pl-11 pr-24 rounded-full bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 transition-all"
              />

              {/* Show / Hide Password Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-12 text-slate-400 hover:text-slate-600 p-1.5 transition cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>

              {/* Circular Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-1.5 h-8 w-8 rounded-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs disabled:opacity-60 disabled:cursor-not-allowed group"
                aria-label="Submit login"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                )}
              </button>
            </div>
          </form>

          {/* Security Reassurance Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Restricted Operations Gateway</span>
          </div>
        </div>
      )}
    </motion.div>
  );

  // Standalone Page Mode (used on /admin/login)
  if (standalonePage) {
    return (
      <div className="min-h-screen bg-[#F4F6F4] flex flex-col items-center justify-center p-4 selection:bg-emerald-600 selection:text-white">
        {modalCardContent}

        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to KabaadSe Home</span>
        </Link>
      </div>
    );
  }

  // Overlay Modal Dialog with createPortal to document.body
  const modalOverlay = (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={() => {
            setIsOpen(false);
            setErrorMessage(null);
          }}
          className="fixed inset-0 z-[100] flex min-h-screen w-screen items-center justify-center bg-zinc-950/50 backdrop-blur-sm p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          {modalCardContent}
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "h-10 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-5 py-2 text-sm font-medium text-white transition-all hover:border-emerald-500/50 hover:bg-white/10 flex items-center gap-2 cursor-pointer shadow-xs hover:scale-[1.02] active:scale-[0.98]",
          triggerClassName
        )}
      >
        <LogIn className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>{triggerText}</span>
      </button>

      {mounted && typeof document !== "undefined"
        ? createPortal(modalOverlay, document.body)
        : null}
    </>
  );
}
