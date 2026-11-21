"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import {
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  User,
} from "lucide-react";
import { GoogleGIcon } from "@/components/icons/google-icon";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check URL query errors (e.g. from Google OAuth callback)
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      if (errorParam === "google_not_configured") {
        setErrorMessage("Google OAuth is not configured. Please contact support.");
      } else if (errorParam === "invalid_oauth_state") {
        setErrorMessage("Session expired during login. Please try again.");
      } else if (errorParam === "token_exchange_failed" || errorParam === "userinfo_fetch_failed") {
        setErrorMessage("Could not verify your Google account. Please try again.");
      } else if (errorParam === "access_denied") {
        setErrorMessage("Google sign-in was cancelled.");
      } else {
        setErrorMessage(`Authentication failed: ${errorParam}`);
      }
    }
  }, [searchParams]);

  // Handle traditional Email/Password login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (mode === "login") {
        const res = await fetch("/api/customer/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
          body: JSON.stringify({ identifier, password }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setErrorMessage(data.error || "Invalid email or password.");
          setIsLoading(false);
          return;
        }
      } else {
        // Signup
        const cleanPhone = phone.replace(/\D/g, "").slice(0, 10);
        if (cleanPhone.length !== 10) {
          setErrorMessage("Please enter a valid 10-digit mobile number.");
          setIsLoading(false);
          return;
        }

        const res = await fetch("/api/customer/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
          body: JSON.stringify({
            name,
            email: identifier,
            phone: cleanPhone,
            password,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setErrorMessage(data.error || "Failed to create account. Please try again.");
          setIsLoading(false);
          return;
        }
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleClick = () => {
    setIsGoogleLoading(true);
    setErrorMessage(null);
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Main Card Container with crisp square edges */}
      <div className="rounded-none bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 shadow-xl p-8 sm:p-10 transition-colors">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center mb-4 group">
            <BrandLogo size={36} className="h-9 w-9 transition-transform group-hover:scale-105" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1.5 font-normal">
            {mode === "login"
              ? "Sign in to manage doorstep pickups and instant payouts."
              : "Sign up for certified doorstep scrap collection in Patna."}
          </p>
        </div>

        {/* Error notification banner */}
        {errorMessage && (
          <div className="mb-6 p-3 rounded-none bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* 1. Continue with Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleClick}
          disabled={isGoogleLoading || isLoading}
          className="w-full h-12 rounded-none bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700/80 border border-slate-300 dark:border-white/15 text-slate-800 dark:text-zinc-100 font-semibold text-sm flex items-center justify-center gap-3 transition cursor-pointer shadow-xs active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed select-none"
        >
          {isGoogleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-slate-600 dark:text-zinc-400" />
          ) : (
            <GoogleGIcon className="w-5 h-5 shrink-0" />
          )}
          <span>Continue with Google</span>
        </button>

        {/* Divider: "or continue with email" */}
        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-white/10" />
          </div>
          <span className="relative px-3.5 bg-white dark:bg-zinc-900 text-xs text-slate-400 dark:text-zinc-500 font-medium uppercase tracking-wider">
            or continue with email
          </span>
        </div>

        {/* 2. Traditional Email/Phone & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 w-4 h-4 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Raushan Kumar"
                  className="w-full h-11 pl-10 pr-3.5 rounded-none bg-slate-50 dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-[#15803D] dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-800 transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
              {mode === "login" ? "Email Address or Mobile Number" : "Email Address"}
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 dark:text-zinc-500 pointer-events-none" />
              <input
                type={mode === "signup" ? "email" : "text"}
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={mode === "login" ? "name@email.com or 10-digit mobile" : "name@email.com"}
                className="w-full h-11 pl-10 pr-3.5 rounded-none bg-slate-50 dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-[#15803D] dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-800 transition"
              />
            </div>
          </div>

          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                Contact Phone Number
              </label>
              <div className="relative flex items-center">
                <Phone className="absolute left-3.5 w-4 h-4 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full h-11 pl-10 pr-3.5 rounded-none bg-slate-50 dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-[#15803D] dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-800 transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 dark:text-zinc-500 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-11 pl-10 pr-10 rounded-none bg-slate-50 dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-[#15803D] dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-800 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1 text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 transition cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full h-11 rounded-none bg-[#15803D] hover:bg-[#166534] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md disabled:opacity-60 disabled:cursor-not-allowed select-none mt-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <>
                <span>{mode === "login" ? "Sign In" : "Create Account"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer switch: Login vs Signup */}
        <div className="text-center pt-6 mt-6 border-t border-slate-100 dark:border-white/10 text-xs text-slate-500 dark:text-zinc-400">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setErrorMessage(null);
                }}
                className="font-bold text-[#15803D] dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrorMessage(null);
                }}
                className="font-bold text-[#15803D] dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </>
          )}
        </div>

        {/* Return to home */}
        <div className="text-center mt-4">
          <Link
            href="/"
            className="text-xs text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 transition"
          >
            &larr; Back to KabaadSe Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-black font-sans transition-colors">
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-12 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
    </div>
  );
}

