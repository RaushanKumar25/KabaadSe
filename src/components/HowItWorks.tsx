/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="w-full flex flex-col justify-center items-center py-16 sm:py-24 px-6 sm:px-12 box-border relative overflow-hidden bg-white dark:bg-black text-slate-900 dark:text-white border-t border-slate-200 dark:border-white/10 transition-colors duration-200"
    >
      <div className="max-w-6xl w-full mx-auto">
        {/* Header: "3 easy steps to sell your Scrap" */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            3 <span className="text-emerald-600 dark:text-[#5EDC1F]">easy steps</span> to sell your Scrap
          </h2>
        </div>

        {/* Horizontal Progress Arrow (Spans across all 3 steps) */}
        <div className="relative w-full max-w-4xl mx-auto my-8 sm:my-12 px-2 hidden sm:flex items-center justify-center">
          <div className="w-full h-[2px] bg-slate-300 dark:bg-white/80 relative flex items-center justify-end">
            {/* Arrowhead */}
            <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[14px] border-l-slate-400 dark:border-l-white/90 translate-x-[2px]" />
          </div>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12 max-w-5xl mx-auto w-full mt-6 sm:mt-0">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="text-emerald-600 dark:text-[#5EDC1F] font-bold text-lg sm:text-xl mb-3 sm:mb-4 tracking-wide">
              Step 1
            </div>
            <div className="w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-[32px] sm:rounded-[36px] bg-white border border-slate-200/80 dark:border-transparent shadow-md flex items-center justify-center p-8 mb-5 sm:mb-6">
              <img
                src="/images/book-slot.png"
                alt="Book a Slot"
                className="w-28 h-28 sm:w-32 sm:h-32 object-contain"
              />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
              Book a Slot
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed">
              Pick a convenient date and time slot. Select the scrap items you want to dispose of.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="text-emerald-600 dark:text-[#5EDC1F] font-bold text-lg sm:text-xl mb-3 sm:mb-4 tracking-wide">
              Step 2
            </div>
            <div className="w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-[32px] sm:rounded-[36px] bg-white border border-slate-200/80 dark:border-transparent shadow-md flex items-center justify-center p-8 mb-5 sm:mb-6">
              <img
                src="/images/certified-weighing.png"
                alt="Certified Weighing"
                className="w-28 h-28 sm:w-32 sm:h-32 object-contain"
              />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
              Certified Weighing
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed">
              Our verified executive visits your doorstep with a certified, precision digital scale.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="text-emerald-600 dark:text-[#5EDC1F] font-bold text-lg sm:text-xl mb-3 sm:mb-4 tracking-wide">
              Step 3
            </div>
            <div className="w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-[32px] sm:rounded-[36px] bg-white border border-slate-200/80 dark:border-transparent shadow-md flex items-center justify-center p-8 mb-5 sm:mb-6">
              <img
                src="/images/instant-payment.png"
                alt="Receive Payment"
                className="w-28 h-28 sm:w-32 sm:h-32 object-contain"
              />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
              Receive Payment
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed">
              Receive on-the-spot payment via cash, UPI, or IMPS right after digital weighing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
