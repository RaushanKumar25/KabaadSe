"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import BrandLogo from "./BrandLogo";
import {
  ChevronDown,
  Menu,
  X,
  Sun,
  Truck,
  Building2,
  Cpu,
  CalendarCheck,
  Recycle,
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
  const [darkMode, setDarkMode] = useState(true);

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/50"
          : "bg-gradient-to-b from-black/85 via-black/45 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Left: Brand Identity & Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group transition-transform duration-200 hover:scale-[1.01]"
          >
            {/* Modern geometric overlapping leaf/loop logo from uploaded design */}
            <BrandLogo className="h-10 w-10 sm:h-11 sm:w-11" />

            {/* Title & Hindi Tagline */}
            <div className="flex flex-col">
              <span className="text-2xl sm:text-[1.65rem] font-black tracking-tight text-white leading-none">
                kabaad<span className="text-emerald-500">se</span>
              </span>
              <span className="text-xs text-slate-300 font-medium tracking-wide mt-1">
                घर बैठे कबाड़ बेचें, सही दाम पाएं
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-white/90">
            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdown(true)}
              onMouseLeave={() => setServicesDropdown(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors py-2 cursor-pointer"
              >
                <span>Services</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    servicesDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {servicesDropdown && (
                <div className="absolute top-full left-0 w-72 rounded-2xl bg-zinc-950/95 backdrop-blur-xl border border-white/10 p-3 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="space-y-1">
                    <a
                      href="#rate-list"
                      onClick={() => setServicesDropdown(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <Truck className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          Scrap Pickup
                        </div>
                        <div className="text-xs text-slate-400">
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
                      className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          Commercial / EPR
                        </div>
                        <div className="text-xs text-slate-400">
                          Bulk recycling & compliance
                        </div>
                      </div>
                    </button>

                    <a
                      href="#rate-list"
                      onClick={() => setServicesDropdown(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <Cpu className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          E-Waste Disposal
                        </div>
                        <div className="text-xs text-slate-400">
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
                className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors py-2 cursor-pointer"
              >
                <span>Company</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    companyDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {companyDropdown && (
                <div className="absolute top-full left-0 w-60 rounded-2xl bg-zinc-950/95 backdrop-blur-xl border border-white/10 p-3 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="space-y-1">
                    <a
                      href="#how-it-works"
                      onClick={() => setCompanyDropdown(false)}
                      className="block p-2.5 rounded-xl hover:bg-white/5 text-sm font-medium text-white transition-colors"
                    >
                      How It Works
                    </a>
                    <a
                      href="#rate-list"
                      onClick={() => setCompanyDropdown(false)}
                      className="block p-2.5 rounded-xl hover:bg-white/5 text-sm font-medium text-white transition-colors"
                    >
                      Live Rates
                    </a>
                  </div>
                </div>
              )}
            </div>

            <a
              href="#how-it-works"
              className="hover:text-emerald-400 transition-colors py-2"
            >
              About
            </a>
          </nav>

          {/* Right: Actions matching uploaded reference */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Pill button 1: Check Rate List (white outline) */}
            <a
              href="#rate-list"
              onClick={onOpenRateList}
              className="inline-flex items-center justify-center rounded-full border border-white hover:border-white/80 px-5 py-2 text-sm font-medium text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
            >
              Check Rate List
            </a>

            {/* Pill button 2: Sell Scrap (solid white background, dark text) */}
            <button
              type="button"
              onClick={onOpenSellModal}
              className="inline-flex items-center justify-center rounded-full bg-white hover:bg-slate-100 text-slate-950 px-6 py-2 text-sm font-semibold shadow-sm transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
            >
              Sell Scrap
            </button>

            {/* Round button 3: Sun Theme Toggle (solid bright yellow background with black sun icon) */}
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#facc15] hover:bg-[#eab308] text-slate-950 transition-colors shadow-sm cursor-pointer"
              aria-label="Toggle theme mode"
            >
              <Sun className="h-4 w-4 stroke-[2.2] text-slate-950" />
            </button>
          </div>

          {/* Mobile buttons */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={onOpenSellModal}
              className="sm:hidden inline-flex items-center justify-center rounded-full bg-white text-slate-950 font-semibold px-4 py-1.5 text-xs shadow-sm"
            >
              Sell Scrap
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2 text-white hover:bg-white/10 focus:outline-none transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-zinc-950/98 backdrop-blur-2xl px-5 pt-4 pb-8 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-2 text-base font-medium text-slate-100">
            <a
              href="#rate-list"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              Check Rate Card
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              How It Works
            </a>
          </nav>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSellModal?.();
              }}
              className="w-full text-center rounded-full bg-white text-slate-950 font-semibold py-3 text-sm shadow-md transition-colors cursor-pointer"
            >
              Sell Scrap
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
