"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Truck,
  Plus,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";

export interface PickupData {
  id?: string;
  pickupDate?: string;
  createdAt?: string;
  status?: string;
  actualWeightKg?: number | null;
  estimatedLoad?: string;
  finalPayoutInr?: number | null;
  scrapTypes?: string;
  locality?: string;
  city?: string;
}

export interface VirtualPaperCalendarProps {
  pickups?: PickupData[];
  onSelectPickup?: (pickup: PickupData) => void;
  onScheduleDate?: (dateStr: string) => void;
  className?: string;
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function VirtualPaperCalendar({
  pickups = [],
  onSelectPickup,
  onScheduleDate,
  className = "",
}: VirtualPaperCalendarProps) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [currentMonth, setCurrentMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [direction, setDirection] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date(today));

  // Map non-cancelled pickups by YYYY-MM-DD
  const pickupMap = useMemo(() => {
    const map = new Map<string, PickupData[]>();
    for (const p of pickups) {
      if (p.status?.toUpperCase() === "CANCELLED") continue;
      let dateKey = "";
      if (p.pickupDate) {
        dateKey = p.pickupDate.slice(0, 10);
      } else if (p.createdAt) {
        dateKey = p.createdAt.slice(0, 10);
      }
      if (!dateKey) continue;
      const list = map.get(dateKey) || [];
      list.push(p);
      map.set(dateKey, list);
    }
    return map;
  }, [pickups]);

  // Calendar generation for currentMonth
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Navigation handlers
  const handlePrevMonth = () => {
    setDirection(-1);
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setDirection(1);
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // Format selected date string YYYY-MM-DD in local time
  const selectedDateStr = useMemo(() => {
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const d = String(selectedDate.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, [selectedDate]);

  const selectedPickups = pickupMap.get(selectedDateStr) || [];
  const hasPickupsOnSelected = selectedPickups.length > 0;

  // Month Title string
  const monthTitle = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className={`relative rounded-none h-full flex flex-col justify-between p-6 overflow-hidden transition-all select-none shadow-xl border bg-[#FCFBF7] text-zinc-900 border-zinc-200/90 dark:bg-zinc-900/90 dark:text-zinc-100 dark:border-white/10 ${className}`}
    >
      {/* ========================================================
          1. PHYSICAL DESK CALENDAR BINDER RINGS & PERFORATION
          ======================================================== */}
      <div className="absolute top-2 left-0 right-0 flex justify-around px-12 pointer-events-none">
        <div className="flex items-center gap-1">
          <div className="w-3.5 h-5 rounded-full bg-gradient-to-b from-zinc-300 via-zinc-100 to-zinc-400 dark:from-zinc-600 dark:via-zinc-400 dark:to-zinc-700 shadow-sm border border-black/15" />
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 -ml-2.5" />
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3.5 h-5 rounded-full bg-gradient-to-b from-zinc-300 via-zinc-100 to-zinc-400 dark:from-zinc-600 dark:via-zinc-400 dark:to-zinc-700 shadow-sm border border-black/15" />
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 -ml-2.5" />
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3.5 h-5 rounded-full bg-gradient-to-b from-zinc-300 via-zinc-100 to-zinc-400 dark:from-zinc-600 dark:via-zinc-400 dark:to-zinc-700 shadow-sm border border-black/15" />
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 -ml-2.5" />
        </div>
      </div>

      {/* Perforation Line */}
      <div className="w-full border-b border-dashed border-zinc-300 dark:border-white/15 pt-5 mb-3" />

      {/* ========================================================
          2. CALENDAR HEADER: Month Name + Prev / Next Arrows
          ======================================================== */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-bold text-sm sm:text-base tracking-tight text-zinc-900 dark:text-white">
            {monthTitle}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-none hover:bg-zinc-200/70 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 transition cursor-pointer"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-none hover:bg-zinc-200/70 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 transition cursor-pointer"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================
          3. 7-COLUMN MONTHLY DATE GRID WITH PAGE FLIP ANIMATION
          ======================================================== */}
      <div className="my-auto">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
          {DAYS_OF_WEEK.map((d) => (
            <span
              key={d}
              className="text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-wider"
            >
              {d}
            </span>
          ))}
        </div>

        {/* Date Squares with Page Transition */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${year}-${month}`}
            custom={direction}
            initial={{ opacity: 0, x: direction * 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="grid grid-cols-7 gap-1"
          >
            {/* Empty Offset cells before 1st of month */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8 sm:h-9" />
            ))}

            {/* Days 1..N */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateObj = new Date(year, month, dayNum);
              const mStr = String(month + 1).padStart(2, "0");
              const dStr = String(dayNum).padStart(2, "0");
              const dateKey = `${year}-${mStr}-${dStr}`;

              const isToday =
                dateObj.getFullYear() === today.getFullYear() &&
                dateObj.getMonth() === today.getMonth() &&
                dateObj.getDate() === today.getDate();

              const isSelected =
                dateObj.getFullYear() === selectedDate.getFullYear() &&
                dateObj.getMonth() === selectedDate.getMonth() &&
                dateObj.getDate() === selectedDate.getDate();

              const dayPickups = pickupMap.get(dateKey) || [];
              const hasPickups = dayPickups.length > 0;

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => setSelectedDate(dateObj)}
                  className={`relative h-8 sm:h-9 rounded-none flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? "bg-emerald-600 text-white font-bold shadow-md scale-105"
                      : isToday
                      ? "ring-2 ring-emerald-500/80 font-bold text-zinc-900 dark:text-white bg-emerald-500/10"
                      : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200/70 dark:hover:bg-white/10"
                  }`}
                >
                  <span className="text-xs font-mono tabular-nums leading-none">
                    {dayNum}
                  </span>

                  {/* Green Pickup Dot */}
                  {hasPickups && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                        isSelected
                          ? "bg-white"
                          : "bg-emerald-600 dark:bg-emerald-500"
                      }`}
                      title={`${dayPickups.length} pickup(s)`}
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ========================================================
          4. INTERACTIVE DATE MINI-PANEL
          ======================================================== */}
      <div className="pt-3 border-t border-zinc-200 dark:border-white/10 mt-3">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
          {hasPickupsOnSelected && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-none bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              {selectedPickups.length} Pickup Booked
            </span>
          )}
        </div>

        {hasPickupsOnSelected ? (
          <div className="space-y-1.5">
            {selectedPickups.map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectPickup && onSelectPickup(p)}
                className="p-2.5 rounded-none bg-zinc-100 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 flex items-center justify-between gap-2 hover:border-emerald-500/40 dark:hover:border-emerald-500/30 transition cursor-pointer"
              >
                <div className="space-y-0.5 truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-zinc-900 dark:text-white">
                      #{p.id?.slice(-6).toUpperCase()}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                      {p.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                    {p.scrapTypes || "Mixed Scrap"} • {p.actualWeightKg ? `${p.actualWeightKg} kg` : p.estimatedLoad}
                  </p>
                </div>
                <button
                  type="button"
                  className="shrink-0 p-1 rounded-none text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              No pickup on this date
            </span>
            <button
              type="button"
              onClick={() => onScheduleDate && onScheduleDate(selectedDateStr)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer shadow-xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Schedule on {selectedDate.getDate()} {selectedDate.toLocaleDateString("en-US", { month: "short" })}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

