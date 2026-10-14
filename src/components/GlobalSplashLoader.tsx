"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useNavigationTransition } from "@/context/NavigationTransitionContext";

export default function GlobalSplashLoader() {
  const { isTransitioning } = useNavigationTransition();
  const [mounted, setMounted] = useState(false);
  const [progressActive, setProgressActive] = useState(false);

  // Guarantee hydration before attempting createPortal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Control body scroll locking and progress bar animation
  useEffect(() => {
    if (isTransitioning) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => {
        setProgressActive(true);
      }, 40);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "unset";
      };
    } else {
      setProgressActive(false);
      document.body.style.overflow = "unset";
    }
  }, [isTransitioning]);

  // Safety check: only render when mounted on client and transition is actively running
  if (!mounted || !isTransitioning) return null;

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page transition"
      className="fixed inset-0 w-screen h-screen z-[999999] bg-[#0a0a0a] flex flex-col items-center justify-center select-none overflow-hidden transition-all duration-500"
    >
      {/* Subtle radial ambient green bloom */}
      <div className="absolute w-[500px] h-[500px] bg-[#5EDC1F]/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Central KabaadSe Logo */}
      <div className="relative mb-6 flex items-center justify-center">
        {/* Ambient pulsing green ring */}
        <div className="absolute -inset-4 rounded-full border border-[#5EDC1F]/25 animate-ping opacity-40 pointer-events-none" />
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl shadow-[#5EDC1F]/20 flex items-center justify-center p-3 scale-100 animate-pulse duration-700">
          <Image
            src="/images/logo.png"
            alt="KabaadSe Logo"
            width={80}
            height={80}
            priority
            quality={100}
            className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(94,220,31,0.5)]"
          />
        </div>
      </div>

      {/* Brand Text */}
      <div className="text-center space-y-1.5 mb-8 relative z-10">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          Kabaad<span className="text-[#5EDC1F]">Se</span>
        </h1>
        <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-neutral-400">
          Smart Scrap Recycling
        </p>
      </div>

      {/* Sleek Progress Indicator & Pulsing Ring */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="w-7 h-7 rounded-full border-2 border-neutral-800 border-t-[#5EDC1F] animate-spin mb-1" />
        <div className="w-48 sm:w-56 h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800 relative shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#5EDC1F]/80 via-[#5EDC1F] to-[#a3f779] rounded-full transition-all duration-1000 ease-out"
            style={{
              width: progressActive ? "100%" : "0%",
              boxShadow: "0 0 14px rgba(94, 220, 31, 0.75)",
            }}
          />
        </div>
        <span className="text-[11px] font-mono text-[#5EDC1F]/90 tracking-wider">
          Connecting to Scrap Hub...
        </span>
      </div>
    </div>,
    document.body
  );
}
