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
  Sparkles,
  Phone,
  CheckCircle2,
  LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

  // Admin credentials state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Customer state (early access / notification signup)
  const [customerContact, setCustomerContact] = useState("");
  const [customerSubmitted, setCustomerSubmitted] = useState(false);

  // SSR hydration safety for createPortal
  useEffect(() => {
    setMounted(true);
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
        setCustomerSubmitted(false);
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
        headers: {
          "Content-Type": "application/json",
        },
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

      // Success
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

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerContact.trim()) return;
    setCustomerSubmitted(true);
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
      className="relative w-full max-w-[410px] rounded-3xl bg-white border border-slate-200/90 shadow-2xl p-6 sm:p-7 text-slate-900 overflow-hidden my-auto"
    >
      {/* Top Close Button (overlay mode only) */}
      {!standalonePage && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setErrorMessage(null);
            setCustomerSubmitted(false);
          }}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer shadow-2xs z-20"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Header Brand Emblem */}
      <div className="flex flex-col items-center text-center mb-5">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center p-2 mb-2.5 shadow-xs">
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

      {/* Tab 1: Customer View (Sign Up / Portal Preview) */}
      {activeTab === "customer" && (
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Sign up or Log in
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Access your scrap recycling dashboard and rewards
            </p>
          </div>

          {/* Launching Soon Badge Card */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 text-left">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Customer Portal — Launching Soon</span>
            </div>
            <p className="text-[11px] text-emerald-950/80 mt-1 leading-relaxed">
              Track pickups, check historical rate credits, and redeem instant UPI cashback. You can already book doorstep pickups without an account!
            </p>
          </div>

          {/* Phone / Email input for early access notifications */}
          <form onSubmit={handleCustomerSubmit} className="space-y-3">
            <div className="relative flex items-center">
              <div className="flex rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-50/80 focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/15 transition-all overflow-hidden w-full h-11">
                <span className="inline-flex items-center pl-4 pr-1.5 text-xs font-bold text-slate-500 select-none">
                  <Phone className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  value={customerContact}
                  onChange={(e) =>
                    setCustomerContact(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  placeholder="Enter mobile number"
                  className="w-full bg-transparent pr-11 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-mono"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center transition cursor-pointer shadow-2xs"
                  title="Notify me when customer portal launches"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {customerSubmitted ? (
              <div className="p-2.5 rounded-xl bg-emerald-100/70 border border-emerald-300 text-emerald-900 text-xs font-medium text-center flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Thank you! We&apos;ll notify you as soon as logins go live.</span>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 text-center">
                Enter your mobile number to get priority early access.
              </p>
            )}
          </form>

          {/* Direct Doorstep Pickup CTA (No Login Needed) */}
          <div className="pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                // Open the sell scrap modal if on homepage
                const sellButton = document.querySelector<HTMLButtonElement>(
                  'header button:has-text("Sell Scrap"), [data-action="sell-scrap"]'
                );
                if (sellButton) {
                  sellButton.click();
                } else {
                  router.push("/#sell-scrap");
                }
              }}
              className="w-full py-2.5 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Schedule Pickup Today (No Login Needed)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Admin / Ops View (Real Environment Authentication) */}
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
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>

              {/* Circular 21st.dev Style Submit Button */}
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

            {/* Error Message */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-600 bg-red-50 border border-red-200 px-3.5 py-2 rounded-xl text-center font-medium leading-relaxed"
                role="alert"
              >
                {errorMessage}
              </motion.div>
            )}
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
            setCustomerSubmitted(false);
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
          "h-10 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-5 py-2 text-sm font-medium text-white transition-all hover:border-[#65E817]/60 hover:bg-white/10 flex items-center gap-2 cursor-pointer shadow-xs hover:scale-[1.02] active:scale-[0.98]",
          triggerClassName
        )}
      >
        <LogIn className="w-4 h-4 text-[#65E817] shrink-0" />
        <span>{triggerText}</span>
      </button>

      {mounted && typeof document !== "undefined"
        ? createPortal(modalOverlay, document.body)
        : null}
    </>
  );
}
