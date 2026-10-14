"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import BrandLogo from "./BrandLogo";
import { useTheme } from "@/context/ThemeContext";
import ServiceInquiryModal, {
  ServiceDetail,
  SERVICES_DATA,
} from "./ServiceInquiryModal";
import {
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";

interface NavbarProps {
  onOpenSellModal?: () => void;
  onOpenRateList?: () => void;
  onOpenBusinessModal?: () => void;
  alwaysVisible?: boolean;
}

export default function Navbar({
  onOpenSellModal,
  onOpenRateList,
  onOpenBusinessModal,
  alwaysVisible = false,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [companyDropdown, setCompanyDropdown] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  const servicesMenuRef = useRef<HTMLDivElement>(null);
  const servicesBtnRef = useRef<HTMLButtonElement>(null);
  const companyMenuRef = useRef<HTMLDivElement>(null);
  const companyBtnRef = useRef<HTMLButtonElement>(null);

  const { theme, setTheme, mounted } = useTheme();

  // Close menus on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        servicesDropdown &&
        servicesMenuRef.current &&
        !servicesMenuRef.current.contains(target) &&
        servicesBtnRef.current &&
        !servicesBtnRef.current.contains(target)
      ) {
        setServicesDropdown(false);
      }
      if (
        companyDropdown &&
        companyMenuRef.current &&
        !companyMenuRef.current.contains(target) &&
        companyBtnRef.current &&
        !companyBtnRef.current.contains(target)
      ) {
        setCompanyDropdown(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setServicesDropdown(false);
        setCompanyDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [servicesDropdown, companyDropdown]);

  useEffect(() => {
    if (alwaysVisible) {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      // Disappear once user starts scrolling down away from hero section top
      if (window.scrollY > 50) {
        setIsVisible(false);
        setMobileMenuOpen(false);
        setServicesDropdown(false);
        setCompanyDropdown(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [alwaysVisible]);

  return (
    <header
      className={`${
        alwaysVisible
          ? "fixed top-0 left-0 right-0 w-full z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10 shadow-lg"
          : `absolute top-0 left-0 right-0 w-full z-50 bg-transparent transition-all duration-300 ease-in-out ${
              isVisible
                ? "translate-y-0 opacity-100 pointer-events-auto"
                : "-translate-y-full opacity-0 pointer-events-none"
            }`
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
            <span className="text-2xl sm:text-[1.65rem] font-bold tracking-tight text-white drop-shadow-sm">
              Kabaad<span className="text-emerald-400">Se</span>
            </span>
            <span className="text-xs text-slate-300 font-medium tracking-wide mt-1 drop-shadow-sm">
              घर बैठे कबाड़ बेचें, सही दाम पाएं
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          {/* Services Button with Active Capsule Pill Style */}
          <button
            ref={servicesBtnRef}
            type="button"
            onClick={() => {
              setServicesDropdown((prev) => !prev);
              setCompanyDropdown(false);
            }}
            className={`flex items-center gap-1.5 text-sm font-medium transition-all duration-200 cursor-pointer drop-shadow-sm ${
              servicesDropdown
                ? "bg-white/20 dark:bg-zinc-800/90 text-white px-4 py-1.5 rounded-full shadow-inner"
                : "text-white/90 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/10"
            }`}
            aria-expanded={servicesDropdown}
          >
            <span>Services</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                servicesDropdown ? "rotate-180 text-emerald-400" : "text-white/70"
              }`}
            />
          </button>

          {/* Company Dropdown */}
          <div className="relative">
            <button
              ref={companyBtnRef}
              type="button"
              onClick={() => {
                setCompanyDropdown((prev) => !prev);
                setServicesDropdown(false);
              }}
              className={`flex items-center gap-1.5 text-sm font-medium transition-all duration-200 cursor-pointer drop-shadow-sm ${
                companyDropdown
                  ? "bg-white/20 dark:bg-zinc-800/90 text-white px-4 py-1.5 rounded-full shadow-inner"
                  : "text-white/90 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/10"
              }`}
              aria-expanded={companyDropdown}
            >
              <span>Company</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  companyDropdown ? "rotate-180 text-emerald-400" : "text-white/70"
                }`}
              />
            </button>

            {companyDropdown && (
              <div
                ref={companyMenuRef}
                className="absolute top-full left-0 mt-2 w-56 rounded-2xl bg-[#0c0d0e]/95 backdrop-blur-2xl border border-white/15 p-2.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="space-y-1">
                  <a
                    href="#how-it-works"
                    onClick={() => setCompanyDropdown(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-200 active:text-[#5EDC1F] cursor-pointer transition-colors duration-75 select-none"
                  >
                    How It Works
                  </a>
                  <a
                    href="#circular-economy"
                    onClick={() => setCompanyDropdown(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-200 active:text-[#5EDC1F] cursor-pointer transition-colors duration-75 select-none"
                  >
                    Circular Economy
                  </a>
                  <a
                    href="#contact"
                    onClick={() => setCompanyDropdown(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-200 active:text-[#5EDC1F] cursor-pointer transition-colors duration-75 select-none"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            )}
          </div>

          <a
            href="#how-it-works"
            className="flex items-center gap-1.5 text-sm font-medium text-white/90 hover:text-white transition drop-shadow-sm px-3.5 py-1.5 rounded-full hover:bg-white/10"
          >
            Careers
          </a>
        </div>

        {/* Right: Actions (Desktop & Tablet) */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Pill button 1: Check Rate List */}
          <button
            type="button"
            onClick={onOpenRateList}
            className="px-4 py-2 text-xs sm:text-sm font-medium rounded-full border border-white/30 text-white hover:border-white/60 hover:bg-white/10 backdrop-blur-sm transition cursor-pointer flex items-center justify-center whitespace-nowrap shadow-xs"
          >
            Check Rate List
          </button>

          {/* Pill button 2: Sell Scrap */}
          <button
            type="button"
            onClick={onOpenSellModal}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition cursor-pointer flex items-center justify-center whitespace-nowrap shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            Sell Scrap
          </button>

          {/* Round button 3: Theme Toggle */}
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all duration-200 shadow-xs cursor-pointer hover:scale-105 active:scale-95 backdrop-blur-sm"
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-300 stroke-[2.2] transition-transform duration-300 rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 text-white stroke-[2.2] transition-transform duration-300 -rotate-12 hover:rotate-0" />
              )
            ) : (
              <Sun className="h-4 w-4 text-amber-300 stroke-[2.2]" />
            )}
          </button>
        </div>

        {/* Mobile top bar buttons (Phones & small screens) */}
        <div className="flex sm:hidden items-center gap-2">
          {/* Mobile Sell Scrap CTA */}
          <button
            type="button"
            onClick={onOpenSellModal}
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-3 py-1.5 text-xs shadow-xs cursor-pointer active:scale-95 transition-transform"
          >
            Sell Scrap
          </button>

          {/* Mobile Theme Toggle Button */}
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border border-white/20 bg-white/10 hover:bg-white/20 text-white transition cursor-pointer active:scale-95 backdrop-blur-sm"
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-300 stroke-[2.2]" />
              ) : (
                <Moon className="h-4 w-4 text-white stroke-[2.2]" />
              )
            ) : (
              <Sun className="h-4 w-4 text-amber-300 stroke-[2.2]" />
            )}
          </button>

          {/* Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-xl p-2 text-white hover:bg-white/10 focus:outline-none transition-colors cursor-pointer"
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
            className="inline-flex items-center justify-center rounded-xl p-2 text-white hover:bg-white/10 focus:outline-none transition-colors cursor-pointer ml-1"
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

      {/* Services Mega-Menu Box (Enterprise Non-AI Look Matching Reference Screenshot) */}
      {servicesDropdown && (
        <div
          ref={servicesMenuRef}
          className="hidden md:block absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2 w-[95vw] max-w-5xl rounded-2xl bg-[#0a0b0d]/98 backdrop-blur-2xl border border-white/15 p-7 lg:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-left"
        >
          <div className="grid grid-cols-5 gap-8 lg:gap-10">
            {/* Column 1: For Individuals */}
            <div className="col-span-1">
              <div className="border-b border-[#5EDC1F]/40 pb-2 mb-4">
                <h4 className="text-[#5EDC1F] font-semibold text-[14px] tracking-wide">
                  For Individuals
                </h4>
              </div>
              <ul className="space-y-3.5 text-left">
                <li>
                  <Link
                    href="/services/scrap-collection"
                    onClick={() => setServicesDropdown(false)}
                    className="w-full block text-left text-white/80 active:text-[#5EDC1F] font-normal text-[13.5px] cursor-pointer transition-colors duration-75 select-none"
                  >
                    Scrap Collection
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setServicesDropdown(false);
                      setSelectedService(SERVICES_DATA["zero-waste-society"]);
                    }}
                    className="w-full text-left text-white/80 active:text-[#5EDC1F] font-normal text-[13.5px] cursor-pointer transition-colors duration-75 select-none"
                  >
                    Zero Waste Society
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setServicesDropdown(false);
                      setSelectedService(SERVICES_DATA["vehicle-scrapping"]);
                    }}
                    className="w-full text-left text-white/80 active:text-[#5EDC1F] font-normal text-[13.5px] cursor-pointer transition-colors duration-75 select-none"
                  >
                    Vehicle Scrapping
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: For Businesses (3 sub-columns) */}
            <div className="col-span-3">
              <div className="border-b border-[#5EDC1F]/40 pb-2 mb-4">
                <h4 className="text-[#5EDC1F] font-semibold text-[14px] tracking-wide">
                  For Businesses
                </h4>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {/* Sub-col 1 */}
                <ul className="space-y-3.5 text-left">
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setServicesDropdown(false);
                        setSelectedService(SERVICES_DATA["commercial-scrap"]);
                      }}
                      className="w-full text-left text-white/80 active:text-[#5EDC1F] font-normal text-[13.5px] cursor-pointer transition-colors duration-75 select-none"
                    >
                      Scrap Collection
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setServicesDropdown(false);
                        setSelectedService(SERVICES_DATA["epr-services"]);
                      }}
                      className="w-full text-left text-white/80 active:text-[#5EDC1F] font-normal text-[13.5px] cursor-pointer transition-colors duration-75 select-none"
                    >
                      EPR services
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setServicesDropdown(false);
                        setSelectedService(SERVICES_DATA["dismantling"]);
                      }}
                      className="w-full text-left text-white/80 active:text-[#5EDC1F] font-normal text-[13.5px] cursor-pointer transition-colors duration-75 select-none"
                    >
                      Dismantling
                    </button>
                  </li>
                </ul>

                {/* Sub-col 2 */}
                <ul className="space-y-3.5 text-left">
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setServicesDropdown(false);
                        setSelectedService(SERVICES_DATA["circular-economy"]);
                      }}
                      className="w-full text-left text-white/80 active:text-[#5EDC1F] font-normal text-[13.5px] cursor-pointer transition-colors duration-75 select-none"
                    >
                      Circular Economy
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setServicesDropdown(false);
                        setSelectedService(SERVICES_DATA["zero-waste-business"]);
                      }}
                      className="w-full text-left text-white/80 active:text-[#5EDC1F] font-normal text-[13.5px] cursor-pointer transition-colors duration-75 select-none"
                    >
                      Zero Waste
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setServicesDropdown(false);
                        setSelectedService(SERVICES_DATA["paper-shredding"]);
                      }}
                      className="w-full text-left text-white/80 active:text-[#5EDC1F] font-normal text-[13.5px] cursor-pointer transition-colors duration-75 select-none"
                    >
                      Paper Shredding
                    </button>
                  </li>
                </ul>

                {/* Sub-col 3 */}
                <ul className="space-y-3.5 text-left">
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setServicesDropdown(false);
                        setSelectedService(SERVICES_DATA["csr-services"]);
                      }}
                      className="w-full text-left text-white/80 active:text-[#5EDC1F] font-normal text-[13.5px] cursor-pointer transition-colors duration-75 select-none"
                    >
                      CSR Services
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setServicesDropdown(false);
                        setSelectedService(SERVICES_DATA["zero-waste-event"]);
                      }}
                      className="w-full text-left text-white/80 active:text-[#5EDC1F] font-normal text-[13.5px] cursor-pointer transition-colors duration-75 select-none"
                    >
                      Zero Waste Event
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setServicesDropdown(false);
                        setSelectedService(SERVICES_DATA["rfp-ewaste"]);
                      }}
                      className="w-full text-left text-white/80 active:text-[#5EDC1F] font-normal text-[13.5px] cursor-pointer transition-colors duration-75 select-none"
                    >
                      RFP for E-waste Recycling
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 3: For Governments */}
            <div className="col-span-1">
              <div className="border-b border-[#5EDC1F]/40 pb-2 mb-4">
                <h4 className="text-[#5EDC1F] font-semibold text-[14px] tracking-wide">
                  For Governments
                </h4>
              </div>
              <ul className="space-y-3.5 text-left">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setServicesDropdown(false);
                      setSelectedService(SERVICES_DATA["mrf"]);
                    }}
                    className="w-full text-left text-white/80 active:text-[#5EDC1F] font-normal text-[13.5px] cursor-pointer transition-colors duration-75 select-none"
                  >
                    Material Recovery Facility
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setServicesDropdown(false);
                      setSelectedService(SERVICES_DATA["iec"]);
                    }}
                    className="w-full text-left text-white/80 active:text-[#5EDC1F] font-normal text-[13.5px] cursor-pointer transition-colors duration-75 select-none"
                  >
                    IEC
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setServicesDropdown(false);
                      setSelectedService(SERVICES_DATA["drs"]);
                    }}
                    className="w-full text-left text-white/80 active:text-[#5EDC1F] font-normal text-[13.5px] cursor-pointer transition-colors duration-75 select-none"
                  >
                    Deposit Refund System (DRS)
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-white/10 bg-white/98 dark:bg-zinc-950/98 backdrop-blur-2xl px-5 pt-4 pb-8 space-y-4 animate-in slide-in-from-top-2 duration-200 shadow-2xl text-left">
          <nav className="flex flex-col gap-2 text-base font-medium text-slate-800 dark:text-slate-100">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRateList?.();
              }}
              className="px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-left font-medium text-emerald-600 dark:text-emerald-400 cursor-pointer"
            >
              Check Rate List
            </button>

            {/* Mobile Services Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-left font-medium"
              >
                <span>Services</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    mobileServicesOpen ? "rotate-180 text-emerald-400" : ""
                  }`}
                />
              </button>
              {mobileServicesOpen && (
                <div className="pl-3 pr-2 py-3 space-y-4 text-xs bg-black/40 rounded-xl my-1 border border-white/10">
                  <div>
                    <div className="text-[#5EDC1F] font-bold uppercase tracking-wider text-[11px] mb-1.5 border-b border-[#5EDC1F]/30 pb-1">
                      For Individuals
                    </div>
                    <div className="space-y-1.5 pl-1">
                      <Link
                        href="/services/scrap-collection"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-slate-300 active:text-[#5EDC1F] text-left py-0.5 cursor-pointer select-none"
                      >
                        Scrap Collection
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setSelectedService(SERVICES_DATA["zero-waste-society"]);
                        }}
                        className="block text-slate-300 active:text-[#5EDC1F] text-left py-0.5 cursor-pointer select-none"
                      >
                        Zero Waste Society
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setSelectedService(SERVICES_DATA["vehicle-scrapping"]);
                        }}
                        className="block text-slate-300 active:text-[#5EDC1F] text-left py-0.5 cursor-pointer select-none"
                      >
                        Vehicle Scrapping
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="text-[#5EDC1F] font-bold uppercase tracking-wider text-[11px] mb-1.5 border-b border-[#5EDC1F]/30 pb-1">
                      For Businesses
                    </div>
                    <div className="space-y-1.5 pl-1">
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setSelectedService(SERVICES_DATA["commercial-scrap"]);
                        }}
                        className="block text-slate-300 active:text-[#5EDC1F] text-left py-0.5 cursor-pointer select-none"
                      >
                        Commercial Recycling & EPR
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setSelectedService(SERVICES_DATA["paper-shredding"]);
                        }}
                        className="block text-slate-300 active:text-[#5EDC1F] text-left py-0.5 cursor-pointer select-none"
                      >
                        Paper Shredding & Dismantling
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setSelectedService(SERVICES_DATA["csr-services"]);
                        }}
                        className="block text-slate-300 active:text-[#5EDC1F] text-left py-0.5 cursor-pointer select-none"
                      >
                        CSR & Zero Waste Events
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="text-[#5EDC1F] font-bold uppercase tracking-wider text-[11px] mb-1.5 border-b border-[#5EDC1F]/30 pb-1">
                      For Governments
                    </div>
                    <div className="space-y-1.5 pl-1">
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setSelectedService(SERVICES_DATA["mrf"]);
                        }}
                        className="block text-slate-300 active:text-[#5EDC1F] text-left py-0.5 cursor-pointer select-none"
                      >
                        Material Recovery Facility (MRF) & DRS
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              Contact Us
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

      {/* Universal Service Inquiry Modal */}
      <ServiceInquiryModal
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        service={selectedService}
      />
    </header>
  );
}
