"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Calendar,
  Package,
  Scale,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  IndianRupee,
} from "lucide-react";

export interface PickupTrackingParallaxCardProps {
  bookingId: string;
  scrapSummary: string;
  status: string; // "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "Booked" | "Assigned" | "Out for Pickup" | "Weighed & Paid"
  scheduledSlot: string;
  estimatedWeightKg?: string | number | null;
  finalPayoutInr?: number | null;
  onSelect?: () => void;
  className?: string;
  badgeLabel?: string;
}

const STAGES = [
  { key: "booked", label: "Booked", shortDesc: "Order Logged" },
  { key: "assigned", label: "Assigned", shortDesc: "Agent Dispatched" },
  { key: "pickup", label: "Out for Pickup", shortDesc: "At Doorstep" },
  { key: "completed", label: "Weighed & Paid", shortDesc: "UPI Settled" },
];

function getStageStep(status: string): number {
  const s = (status || "").toUpperCase();
  if (s === "COMPLETED" || s === "WEIGHED & PAID" || s === "PAID") return 4;
  if (s === "OUT FOR PICKUP" || s === "OUT_FOR_PICKUP" || s === "WEIGHING") return 3;
  if (s === "CONFIRMED" || s === "ASSIGNED") return 2;
  if (s === "PENDING" || s === "BOOKED") return 1;
  return 1;
}

export function PickupTrackingParallaxCard({
  bookingId,
  scrapSummary,
  status,
  scheduledSlot,
  estimatedWeightKg,
  finalPayoutInr,
  onSelect,
  className = "",
  badgeLabel,
}: PickupTrackingParallaxCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });

  // 3D Tilt Spring Physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 260, damping: 22 });
  const mouseYSpring = useSpring(y, { stiffness: 260, damping: 22 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["9deg", "-9deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-9deg", "9deg"]);
  const brightness = useTransform(mouseYSpring, [-0.5, 0.5], [1.03, 0.97]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
    setSpotlightPos({
      x: Math.round((mouseX / width) * 100),
      y: Math.round((mouseY / height) * 100),
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
    setSpotlightPos({ x: 50, y: 50 });
  };

  const activeStep = getStageStep(status);
  const isCancelled = status.toUpperCase() === "CANCELLED";
  const displayId = bookingId.startsWith("#")
    ? bookingId
    : `#KB-${bookingId.slice(-6).toUpperCase()}`;

  return (
    <div
      style={{ perspective: 1200 }}
      className={`relative w-full ${className}`}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onSelect}
        style={{
          rotateX,
          rotateY,
          filter: brightness ? `brightness(${brightness})` : undefined,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        className="group relative w-full rounded-3xl bg-gradient-to-b from-white via-slate-50 to-white dark:from-zinc-900/95 dark:via-zinc-900/90 dark:to-zinc-950/95 border border-slate-200 dark:border-white/10 hover:border-emerald-500/50 dark:hover:border-[#65E817]/40 shadow-2xl p-6 sm:p-7 backdrop-blur-xl transition-colors cursor-pointer select-none overflow-hidden"
      >
        {/* Dynamic Cursor Spotlight Effect */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
          style={{
            background: `radial-gradient(600px circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(101, 232, 23, 0.08), transparent 45%)`,
          }}
        />

        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#65E817]/5 blur-3xl" />

        {/* ========================================================
            DEPTH LAYER 1: Header & Status Pill (translateZ: 30px)
            ======================================================== */}
        <div
          style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
          className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-white/10"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-[#65E817]">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-slate-900 dark:text-white tracking-tight">
                  {displayId}
                </span>
                {badgeLabel && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/15">
                    {badgeLabel}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Doorstep Scrap Collection</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                isCancelled
                  ? "bg-red-950/40 text-red-300 border-red-800/60"
                  : activeStep === 4
                  ? "bg-emerald-950/60 text-emerald-300 border-emerald-700/60"
                  : "bg-[#65E817]/10 text-[#65E817] border-[#65E817]/30"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isCancelled
                    ? "bg-red-400"
                    : activeStep === 4
                    ? "bg-emerald-400"
                    : "bg-[#65E817] animate-pulse"
                }`}
              />
              <span>
                {isCancelled
                  ? "Cancelled"
                  : activeStep === 4
                  ? "Weighed & Paid"
                  : activeStep === 3
                  ? "Out for Pickup"
                  : activeStep === 2
                  ? "Assigned"
                  : "Booked"}
              </span>
            </div>

            <div className="w-7 h-7 rounded-full bg-white/5 group-hover:bg-[#65E817]/20 border border-white/10 group-hover:border-[#65E817]/40 flex items-center justify-center text-slate-400 group-hover:text-[#65E817] transition-all">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* ========================================================
            DEPTH LAYER 2: Illustration & Scrap Summary (translateZ: 60px)
            ======================================================== */}
        <div
          style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }}
          className="relative z-10 py-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center"
        >
          {/* Left: Summary & Metadata */}
          <div className="md:col-span-7 space-y-3">
            <div>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Scrap Items Included
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-[#65E817] transition-colors">
                {scrapSummary || "Mixed Recyclables"}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex flex-col justify-between">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3 text-emerald-600 dark:text-[#65E817]" />
                  Slot Time
                </span>
                <span className="font-semibold text-slate-800 dark:text-white mt-1 truncate">
                  {scheduledSlot}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex flex-col justify-between">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                  <Scale className="w-3 h-3 text-emerald-600 dark:text-[#65E817]" />
                  {finalPayoutInr ? "Verified Payout" : "Estimated Load"}
                </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300 mt-1 truncate font-mono">
                  {finalPayoutInr
                    ? `₹${finalPayoutInr.toLocaleString("en-IN")}`
                    : estimatedWeightKg
                    ? `${estimatedWeightKg}`
                    : "Standard Scale"}
                </span>
              </div>
            </div>
          </div>

          {/* Right: KabaadSe Pickup Truck 3D SVG Illustration */}
          <div className="md:col-span-5 flex items-center justify-center">
            <div className="relative w-44 h-28 sm:w-48 sm:h-32 flex items-center justify-center">
              {/* Radial Ground Shadow */}
              <div className="absolute bottom-2 w-36 h-6 bg-[#65E817]/20 blur-xl rounded-full" />
              <div className="absolute bottom-1 w-32 h-4 bg-black/60 blur-md rounded-full" />

              {/* Crisp Custom KabaadSe Pickup Truck Vector */}
              <svg
                viewBox="0 0 220 140"
                className="w-full h-full drop-shadow-2xl transition-transform duration-300 group-hover:translate-y-[-4px]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Truck Cargo Box (Dark Emerald Slate) */}
                <rect x="22" y="38" width="112" height="62" rx="8" fill="#0A2518" stroke="#10B981" strokeWidth="2" />
                <rect x="26" y="42" width="104" height="10" rx="3" fill="#134E2E" />
                
                {/* Slats & Ribs on Cargo Body */}
                <line x1="56" y1="52" x2="56" y2="98" stroke="#10B981" strokeWidth="1.5" strokeOpacity="0.4" />
                <line x1="86" y1="52" x2="86" y2="98" stroke="#10B981" strokeWidth="1.5" strokeOpacity="0.4" />
                <line x1="116" y1="52" x2="116" y2="98" stroke="#10B981" strokeWidth="1.5" strokeOpacity="0.4" />

                {/* Recycling Emblem on Truck Bed */}
                <g transform="translate(68, 62)">
                  <circle cx="10" cy="10" r="12" fill="#064E3B" stroke="#65E817" strokeWidth="1.5" />
                  <path
                    d="M10 3L13 7H7L10 3Z M16.5 13.5L14 17L10.5 11L16.5 13.5Z M3.5 13.5L9.5 11L6 17L3.5 13.5Z"
                    fill="#65E817"
                  />
                </g>
                <text x="32" y="93" fill="#65E817" fontSize="8" fontWeight="bold" fontFamily="monospace">
                  KABAADSE • ZERO CARBON
                </text>

                {/* Truck Cab (KabaadSe Vibrant Green) */}
                <path
                  d="M134 48H168C176 48 184 54 187 62L196 82C198 86 198 90 198 94V100H134V48Z"
                  fill="#059669"
                  stroke="#10B981"
                  strokeWidth="2"
                />
                
                {/* Windshield Glass with Reflection */}
                <path
                  d="M142 53H166C172 53 177 57 180 63L188 78H142V53Z"
                  fill="#A7F3D0"
                  fillOpacity="0.85"
                />
                <path d="M148 56L176 56L158 75L148 75V56Z" fill="#FFFFFF" fillOpacity="0.4" />

                {/* Door Trim & Handle */}
                <rect x="146" y="82" width="6" height="3" rx="1.5" fill="#111827" />
                <line x1="134" y1="78" x2="168" y2="78" stroke="#047857" strokeWidth="1.5" />

                {/* Headlight (Glowing Neon Lime) */}
                <path d="M196 86L201 88V96H196V86Z" fill="#65E817" />
                <circle cx="199" cy="91" r="5" fill="#65E817" fillOpacity="0.5" filter="blur(2px)" />

                {/* Front Bumper & Grill */}
                <rect x="194" y="98" width="10" height="6" rx="2" fill="#1F2937" stroke="#374151" strokeWidth="1" />
                <rect x="134" y="98" width="60" height="4" fill="#1F2937" />

                {/* Wheel 1 (Rear) */}
                <circle cx="56" cy="106" r="16" fill="#111827" stroke="#374151" strokeWidth="3" />
                <circle cx="56" cy="106" r="8" fill="#374151" stroke="#65E817" strokeWidth="2" />
                <circle cx="56" cy="106" r="3" fill="#65E817" />

                {/* Wheel 2 (Middle Bed) */}
                <circle cx="106" cy="106" r="16" fill="#111827" stroke="#374151" strokeWidth="3" />
                <circle cx="106" cy="106" r="8" fill="#374151" stroke="#65E817" strokeWidth="2" />
                <circle cx="106" cy="106" r="3" fill="#65E817" />

                {/* Wheel 3 (Front) */}
                <circle cx="174" cy="106" r="16" fill="#111827" stroke="#374151" strokeWidth="3" />
                <circle cx="174" cy="106" r="8" fill="#374151" stroke="#65E817" strokeWidth="2" />
                <circle cx="174" cy="106" r="3" fill="#65E817" />
              </svg>
            </div>
          </div>
        </div>

        {/* ========================================================
            DEPTH LAYER 3: 4-Segment Progress Bar (translateZ: 45px)
            ======================================================== */}
        <div
          style={{ transform: "translateZ(45px)", transformStyle: "preserve-3d" }}
          className="relative z-10 pt-3 border-t border-slate-200 dark:border-white/10 space-y-3"
        >
          {/* Segmented Track Bar */}
          <div className="grid grid-cols-4 gap-2">
            {STAGES.map((stage, idx) => {
              const stepNumber = idx + 1;
              const isPassed = !isCancelled && stepNumber <= activeStep;
              const isCurrent = !isCancelled && stepNumber === activeStep;

              return (
                <div key={stage.key} className="space-y-1.5">
                  <div className="relative h-1.5 w-full rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: isPassed ? "100%" : "0%" }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      className={`h-full ${
                        isCurrent
                          ? "bg-emerald-500 dark:bg-[#65E817] shadow-[0_0_10px_#65E817]"
                          : isPassed
                          ? "bg-emerald-600 dark:bg-emerald-500"
                          : "bg-transparent"
                      }`}
                    />
                  </div>

                  <div className="flex flex-col">
                    <span
                      className={`text-[10px] sm:text-[11px] font-bold truncate ${
                        isCurrent
                          ? "text-emerald-700 dark:text-[#65E817]"
                          : isPassed
                          ? "text-slate-800 dark:text-slate-200"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {stage.label}
                    </span>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 hidden sm:block truncate">
                      {stage.shortDesc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Interactive Hint */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Accurate ISO digital scale at your doorstep</span>
            </span>
            <span className="text-emerald-700 dark:text-[#65E817] font-semibold flex items-center gap-1 group-hover:underline">
              <span>View Timeline & Actions</span>
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

