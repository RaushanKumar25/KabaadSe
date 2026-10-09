"use client";

import React from "react";
import Image from "next/image";

interface CircularEconomyProps {
  onLearnMore?: () => void;
}

export default function CircularEconomy({ onLearnMore }: CircularEconomyProps) {
  const handleLearnMore = () => {
    if (onLearnMore) {
      onLearnMore();
    } else {
      const el = document.getElementById("how-it-works");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-white dark:bg-black py-20 px-6 sm:px-12 border-t border-neutral-200 dark:border-neutral-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left Column Graphic: Transparent Branded Truck */}
        <div className="relative flex items-center justify-center p-4 lg:p-8">
          <Image
            src="/images/kabadsetruck.png"
            alt="KabaadSe Branded Collection Truck"
            width={1024}
            height={765}
            priority
            className="w-full max-w-lg h-auto object-contain select-none"
          />
        </div>

        {/* Right Column (Content Block) */}
        <div className="flex flex-col justify-center">
          {/* Top Pill Badge */}
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-950/70 border border-emerald-500/30 dark:border-emerald-800/60 uppercase tracking-wider mb-4">
              About KabaadSe
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white leading-tight tracking-tight mb-6">
            Sustainability &<br />Circular Economy
          </h2>

          {/* Description (Short, natural, non-AI copy) */}
          <p className="text-neutral-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
            <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">KabaadSe</strong> makes scrap selling simple, transparent, and rewarding. We connect your home directly with authorized recycling centers—ensuring fair digital weighing, instant payouts, and zero scrap in landfills.
          </p>

          {/* Action Button */}
          <div>
            <button
              type="button"
              onClick={handleLearnMore}
              className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-all duration-200 inline-flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              Learn More <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
