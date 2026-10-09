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
    <section className="w-full bg-black py-20 px-6 sm:px-12 border-t border-neutral-900">
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
          {/* Live Metric Tag */}
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 uppercase tracking-wider mb-6">
              🌎 Eco-System Action
            </span>
          </div>

          {/* Content Header */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Sustainability &<br />
            Circular Economy
          </h2>

          {/* Description Paragraph */}
          <p className="text-slate-400 text-base leading-relaxed mt-6">
            <strong className="text-emerald-400 font-semibold">KabaadSe</strong>{" "}
            acts as a direct bridge connecting households with certified recycling
            mills, driving a zero-waste future. By bringing digital traceability
            and verified weighting to doorstep scrap, we&apos;re ensuring every
            kilogram is ethical, organized, and looped right back into active
            production.
          </p>

          {/* Process Checklist (Professional layout) */}
          <div className="flex flex-col gap-4 mt-8 border-t border-neutral-900 pt-6">
            <div className="flex items-start gap-3">
              <span className="text-base select-none mt-0.5">🔄</span>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Closed-Loop Traceability
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-relaxed">
                  Every material handoff is logged, ensuring nothing reaches a
                  landfill.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3 border-t border-neutral-900">
              <span className="text-base select-none mt-0.5">⚖</span>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Verified Digital Scale Audit
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-relaxed">
                  No guessing or manual tampering. Instant proof-of-weight
                  transparency.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3 border-t border-neutral-900">
              <span className="text-base select-none mt-0.5">📈</span>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Direct Industrial Feeds
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-relaxed">
                  Scrap goes straight to recycling mills, decreasing raw extraction
                  demands.
                </p>
              </div>
            </div>
          </div>

          {/* Call-To-Action Button */}
          <div className="mt-8">
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
