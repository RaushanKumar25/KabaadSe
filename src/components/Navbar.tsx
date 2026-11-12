"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import BrandLogo from "./BrandLogo";
import { useTheme } from "@/context/ThemeContext";
import {
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
  Truck,
  Building2,
  Cpu,
} from "lucide-react";

interface NavbarProps {
  onOpenSellModal?: () => void;
  onOpenRateList?: () => void;
}

export default function Navbar({
  onOpenSellModal,
  onOpenRateList,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [companyDropdown, setCompanyDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { theme, toggleTheme, setTheme, mounted } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 dark:bg-[#030712]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800/80 shadow-md shadow-slate-200/40 dark:shadow-black/50"
          : "bg-white/80 dark:bg-[#030712]/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/40"
      }`}
    >
      <nav className="w-full flex items-center justify-between py-3 px-4 sm:px-8 min-h-[72px]">
        {/* Left: Brand Identity & Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group transition-transform duration-200 hover:scale-[1.01]"
        >
          {/* Logo icon */}
          <BrandLogo className="h-10 w-auto object-contain shrink-0" />

          {/* Dedicated column container for brand name & Hindi tagline */}
          <div className="flex flex-col justify-center leading-none">
            <span className="text-2xl sm:text-[1.65rem] font-bold tracking-tight text-slate-900 dark:text-white">
              Kabaad<span className="text-emerald-600 dark:text-emerald-400">Se</span>
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide mt-1">
              घर बैठे कबाड़ बेचें, सही दाम पाएं
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesDropdown(true)}
            onMouseLeave={() => setServicesDropdown(false)}
          >
            <button
              type="button"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition cursor-pointer"
            >
              <span>Services</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  servicesDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {servicesDropdown && (
              <div className="absolute top-full left-0 w-72 rounded-2xl bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-3 shadow-xl dark:shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="space-y-1">
                  <a
                    href="#rate-list"
                    onClick={() => setServicesDropdown(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Truck className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        Scrap Pickup
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Doorstep collection for homes & offices
                      </div>
                    </div>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setServicesDropdown(false);
                      onOpenSellModal?.();
                    }}
                    className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        Commercial / EPR
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Bulk recycling & compliance
                      </div>
                    </div>
                  </button>

                  <a
                    href="#rate-list"
                    onClick={() => setServicesDropdown(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Cpu className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        E-Waste Disposal
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Safe certified electronics scrapping
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Company Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCompanyDropdown(true)}
            onMouseLeave={() => setCompanyDropdown(false)}
          >
            <button
              type="button"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition cursor-pointer"
            >
              <span>Company</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  companyDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {companyDropdown && (
              <div className="absolute top-full left-0 w-60 rounded-2xl bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-3 shadow-xl dark:shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="space-y-1">
                  <a
                    href="#how-it-works"
                    onClick={() => setCompanyDropdown(false)}
                    className="block p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-medium text-slate-900 dark:text-white transition-colors"
                  >
                    How It Works
                  </a>
                  <a
                    href="#rate-list"
                    onClick={() => setCompanyDropdown(false)}
                    className="block p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-medium text-slate-900 dark:text-white transition-colors"
                  >
                    Live Rates
                  </a>
                </div>
              </div>
            )}
          </div>

          <a
            href="#how-it-works"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition"
          >
            About
          </a>
        </div>

        {/* Right: Actions (Desktop & Tablet) */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Pill button 1: Check Rate List */}
          <a
            href="#rate-list"
            onClick={onOpenRateList}
            className="px-4 py-2 text-xs sm:text-sm font-medium rounded-full border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-white hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition cursor-pointer flex items-center justify-center whitespace-nowrap"
          >
            Check Rate List
          </a>

          {/* Pill button 2: Sell Scrap */}
          <button
            type="button"
            onClick={onOpenSellModal}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-full bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 transition cursor-pointer flex items-center justify-center whitespace-nowrap shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            Sell Scrap
          </button>

          {/* Round button 3: Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border border-slate-300/80 dark:border-slate-700/80 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-amber-300 transition-all duration-200 shadow-xs cursor-pointer hover:scale-105 active:scale-95"
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400 stroke-[2.2] transition-transform duration-300 rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 text-slate-800 stroke-[2.2] transition-transform duration-300 -rotate-12 hover:rotate-0" />
              )
            ) : (
              <span className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse" />
            )}
          </button>
        </div>

        {/* Mobile top bar buttons (Phones & small screens) */}
        <div className="flex sm:hidden items-center gap-2">
          {/* Mobile Sell Scrap CTA */}
          <button
            type="button"
            onClick={onOpenSellModal}
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-white dark:text-slate-950 font-semibold px-3 py-1.5 text-xs shadow-xs cursor-pointer active:scale-95 transition-transform"
          >
            Sell Scrap
          </button>

          {/* Mobile Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-800 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-amber-400 transition cursor-pointer active:scale-95"
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400 stroke-[2.2]" />
              ) : (
                <Moon className="h-4 w-4 text-slate-800 stroke-[2.2]" />
              )
            ) : (
              <div className="w-4 h-4" />
            )}
          </button>

          {/* Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-xl p-2 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 focus:outline-none transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Medium screens (between sm and md) Menu button */}
        <div className="hidden sm:flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-xl p-2 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 focus:outline-none transition-colors cursor-pointer ml-1"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-white/10 bg-white/98 dark:bg-zinc-950/98 backdrop-blur-2xl px-5 pt-4 pb-8 space-y-4 animate-in slide-in-from-top-2 duration-200 shadow-2xl">
          <nav className="flex flex-col gap-2 text-base font-medium text-slate-800 dark:text-slate-100">
            <a
              href="#rate-list"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              Check Rate Card
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              How It Works
            </a>
          </nav>

          {/* Mobile Theme Segmented Controller */}
          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Appearance
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                {theme} mode active
              </span>
            </div>
            <div className="flex items-center p-1 bg-slate-200/90 dark:bg-zinc-900 rounded-xl border border-slate-300/60 dark:border-white/10">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  theme === "light"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <Sun className="h-3.5 w-3.5 text-amber-500" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  theme === "dark"
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <Moon className="h-3.5 w-3.5 text-amber-300" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSellModal?.();
              }}
              className="w-full text-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-semibold py-3 text-sm shadow-md transition-colors cursor-pointer"
            >
              Sell Scrap
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
