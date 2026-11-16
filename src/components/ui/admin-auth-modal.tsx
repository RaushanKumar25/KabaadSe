"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminAuthModalProps {
  defaultOpen?: boolean;
  standalonePage?: boolean;
  triggerText?: string;
  triggerClassName?: string;
  onSuccess?: () => void;
}

export default function AdminAuthModal({
  defaultOpen = false,
  standalonePage = false,
  triggerText = "Admin",
  triggerClassName,
  onSuccess,
}: AdminAuthModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync defaultOpen changes
  useEffect(() => {
    setIsOpen(defaultOpen);
  }, [defaultOpen]);

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

  const handleSubmit = async (e: React.FormEvent) => {
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

  const modalFormContent = (
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
      className="relative w-full max-w-[390px] rounded-3xl bg-white border border-slate-200/90 shadow-2xl p-7 sm:p-8 text-slate-900 overflow-hidden"
    >
      {/* Top Close Button (overlay mode only) */}
      {!standalonePage && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setErrorMessage(null);
          }}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Header Emblem & Titles */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center p-2 mb-3 shadow-xs">
          <BrandLogo size={28} className="h-7 w-7" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Sign in to KabaadSe Operations
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
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
            className="w-full h-12 pl-11 pr-4 rounded-full bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 transition-all"
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
            className="w-full h-12 pl-11 pr-24 rounded-full bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 transition-all"
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
            className="absolute right-2 h-8 w-8 rounded-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs disabled:opacity-60 disabled:cursor-not-allowed group"
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
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Restricted Operations Gateway</span>
      </div>
    </motion.div>
  );

  // Standalone Page Mode (used on /admin/login)
  if (standalonePage) {
    return (
      <div className="min-h-screen bg-[#F4F6F4] flex flex-col items-center justify-center p-4 selection:bg-emerald-600 selection:text-white">
        {modalFormContent}

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

  // Trigger + Overlay Modal Mode (used in Navbar or buttons)
  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
          "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/10 dark:hover:bg-white/20 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 shadow-2xs hover:scale-[1.02] active:scale-[0.98]",
          triggerClassName
        )}
      >
        <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>{triggerText}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div
            onClick={() => {
              setIsOpen(false);
              setErrorMessage(null);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            {modalFormContent}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

