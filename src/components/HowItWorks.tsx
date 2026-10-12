/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="min-h-screen w-full flex flex-col justify-center items-center py-10 sm:py-12 px-6 sm:px-12 box-border relative overflow-hidden bg-[#f8fafc] dark:bg-black border-t border-neutral-200 dark:border-neutral-900 transition-colors duration-200"
    >
      <div className="max-w-5xl w-full mx-auto">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            How Doorstep Pickup Works
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base mt-2 max-w-lg mx-auto">
            Zero haggling. Accurate digital weight. Instant payment directly to you.
          </p>
        </div>

        {/* Connected Stepper Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-8">
          {/* Connecting line (Desktop only) */}
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-[2px] bg-neutral-200 dark:bg-neutral-800 -z-0" />

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-white dark:bg-[#121417] border border-neutral-200 dark:border-white/10 shadow-sm flex items-center justify-center mb-4 relative">
              <span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-emerald-500 text-black text-xs font-bold flex items-center justify-center shadow">
                1
              </span>
              <img
                src="/images/book-slot.png"
                alt="Book a Slot"
                className="w-12 h-12 object-contain"
              />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1.5">
              Book a Slot
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xs">
              Pick a date and convenient time slot. Select the scrap items you want to dispose of.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-white dark:bg-[#121417] border border-neutral-200 dark:border-white/10 shadow-sm flex items-center justify-center mb-4 relative">
              <span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-emerald-500 text-black text-xs font-bold flex items-center justify-center shadow">
                2
              </span>
              <img
                src="/images/certified-weighing.png"
                alt="Certified Weighing"
                className="w-12 h-12 object-contain"
              />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1.5">
              Certified Weighing
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xs">
              Our verified executive visits your doorstep with a certified, precision digital scale.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-white dark:bg-[#121417] border border-neutral-200 dark:border-white/10 shadow-sm flex items-center justify-center mb-4 relative">
              <span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-emerald-500 text-black text-xs font-bold flex items-center justify-center shadow">
                3
              </span>
              <img
                src="/images/instant-payment.png"
                alt="Instant Payment"
                className="w-12 h-12 object-contain"
              />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1.5">
              Instant Payment
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xs">
              Receive on-the-spot payment via UPI or cash right after weighing, with a digital receipt sent instantly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
