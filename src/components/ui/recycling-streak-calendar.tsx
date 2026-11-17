"use client";

import React, { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Flame, Sparkles, Info, Leaf } from "lucide-react";

export interface PickupData {
  id?: string;
  pickupDate?: string;
  createdAt?: string;
  status?: string;
  actualWeightKg?: number | null;
  estimatedLoad?: string;
  finalPayoutInr?: number | null;
  scrapTypes?: string;
}

export interface RecyclingStreakCalendarProps {
  pickups?: PickupData[];
  className?: string;
}

interface DayActivity {
  date: Date;
  dateStr: string; // YYYY-MM-DD
  count: number;
  totalKg: number;
  totalPayout: number;
  scrapTypes: string[];
  isFuture: boolean;
  tier: 0 | 1 | 2 | 3;
}

function extractKg(actualWeightKg?: number | null, estimatedLoad?: string): number {
  if (typeof actualWeightKg === "number" && actualWeightKg > 0) {
    return actualWeightKg;
  }
  if (!estimatedLoad) return 5;
  if (estimatedLoad.includes("< 20")) return 12;
  if (estimatedLoad.includes("20-50")) return 32;
  if (estimatedLoad.includes("50-100")) return 70;
  if (estimatedLoad.includes("100+")) return 110;
  const match = estimatedLoad.match(/(\d+)/);
  if (match) return parseInt(match[1], 10);
  return 8;
}

function getIntensityTier(count: number, totalKg: number): 0 | 1 | 2 | 3 {
  if (count === 0) return 0;
  if (count >= 2 || totalKg > 25) return 3;
  if (totalKg >= 10 && totalKg <= 25) return 2;
  return 1;
}

const TIER_CLASSES: Record<number, string> = {
  0: "bg-slate-100 dark:bg-zinc-800/60 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20",
  1: "bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800/60 hover:border-emerald-500",
  2: "bg-emerald-500/80 dark:bg-emerald-600/80 border border-emerald-400 dark:border-emerald-500/60 hover:border-emerald-300 shadow-[0_0_6px_rgba(16,185,129,0.3)]",
  3: "bg-[#65E817] border border-[#65E817] shadow-[0_0_10px_rgba(101,232,23,0.45)] hover:scale-110",
};

export function RecyclingStreakCalendar({
  pickups = [],
  className = "",
}: RecyclingStreakCalendarProps) {
  const [mounted, setMounted] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<DayActivity | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Map non-cancelled pickups by YYYY-MM-DD
  const dayMap = useMemo(() => {
    const map = new Map<
      string,
      { count: number; totalKg: number; totalPayout: number; scrapTypes: string[] }
    >();

    for (const p of pickups) {
      if (p.status?.toUpperCase() === "CANCELLED") continue;

      let dateKey = "";
      if (p.pickupDate) {
        dateKey = p.pickupDate.slice(0, 10);
      } else if (p.createdAt) {
        dateKey = p.createdAt.slice(0, 10);
      }
      if (!dateKey || dateKey.length < 10) continue;

      const existing = map.get(dateKey) || {
        count: 0,
        totalKg: 0,
        totalPayout: 0,
        scrapTypes: [],
      };

      existing.count += 1;
      existing.totalKg += extractKg(p.actualWeightKg, p.estimatedLoad);
      if (typeof p.finalPayoutInr === "number") {
        existing.totalPayout += p.finalPayoutInr;
      }
      if (p.scrapTypes && !existing.scrapTypes.includes(p.scrapTypes)) {
        existing.scrapTypes.push(p.scrapTypes);
      }

      map.set(dateKey, existing);
    }

    return map;
  }, [pickups]);

  // 2. Build 52 weeks grid (Padhega Style)
  const { weeks, monthLabels, activeDaysCount, streakDays } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayOfWeek = today.getDay(); // 0 is Sun, 6 is Sat
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - dayOfWeek));

    const TOTAL_WEEKS = 52;
    const startDate = new Date(endOfWeek);
    startDate.setDate(endOfWeek.getDate() - (TOTAL_WEEKS * 7 - 1));

    const weeksData: DayActivity[][] = [];
    const currentDate = new Date(startDate);
    let activeCount = 0;

    for (let w = 0; w < TOTAL_WEEKS; w++) {
      const weekDays: DayActivity[] = [];
      for (let d = 0; d < 7; d++) {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const dateNum = String(currentDate.getDate()).padStart(2, "0");
        const dStr = `${year}-${month}-${dateNum}`;

        const isFuture = currentDate > today;
        const dayData = dayMap.get(dStr);

        const count = dayData ? dayData.count : 0;
        const totalKg = dayData ? dayData.totalKg : 0;
        const totalPayout = dayData ? dayData.totalPayout : 0;
        const scrapTypes = dayData ? dayData.scrapTypes : [];
        const tier = isFuture ? 0 : getIntensityTier(count, totalKg);

        if (count > 0 && !isFuture) {
          activeCount += 1;
        }

        weekDays.push({
          date: new Date(currentDate),
          dateStr: dStr,
          count,
          totalKg,
          totalPayout,
          scrapTypes,
          isFuture,
          tier,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeksData.push(weekDays);
    }

    // Month labels across top
    const labels: { weekIndex: number; label: string }[] = [];
    let lastMonth = -1;
    weeksData.forEach((week, wIdx) => {
      const midDay = week[3].date;
      const m = midDay.getMonth();
      if (m !== lastMonth) {
        labels.push({
          weekIndex: wIdx,
          label: midDay.toLocaleDateString("en-US", { month: "short" }),
        });
        lastMonth = m;
      }
    });

    const calculatedStreak = activeCount > 0 ? Math.max(1, activeCount) : 0;

    return {
      weeks: weeksData,
      monthLabels: labels,
      activeDaysCount: activeCount,
      streakDays: calculatedStreak,
    };
  }, [dayMap]);

  const handleMouseEnter = (day: DayActivity, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredDay(day);
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  return (
    <div className={`p-6 rounded-2xl h-full flex flex-col justify-between border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl select-none transition-colors duration-200 ${className}`}>
      {/* ========================================================
          1. HEADER (PADHEGA STYLE): Current Streak + Pill Badge
          ======================================================== */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4 mb-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#65E817] shadow-[0_0_8px_#65E817] animate-pulse" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Current Streak
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-normal">
            Daily household recycling contribution log
          </p>
        </div>

        {/* Warm Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-semibold shadow-xs">
          <Flame className="w-3.5 h-3.5 text-emerald-600 dark:text-[#65E817] fill-emerald-600 dark:fill-[#65E817]" />
          <span className="tabular-nums font-bold text-slate-900 dark:text-white">{streakDays}</span>
          <span className="text-emerald-600 dark:text-emerald-400">days</span>
        </div>
      </div>

      {/* ========================================================
          2. PADHEGA-STYLE GREEN DOT CONTRIBUTION GRID
          - Evenly spaced rounded squares: w-3.5 h-3.5 rounded-[4px] gap-1.5
          - MON, WED, FRI labels on left
          - 26 weeks on mobile, 52 weeks on desktop
          ======================================================== */}
      <div className="relative overflow-x-auto scrollbar-none py-1 my-auto">
        <div className="min-w-fit flex flex-col space-y-2">
          {/* Month Labels Across Top */}
          <div className="flex text-[10px] font-mono text-zinc-400 pl-10 h-4 relative">
            {monthLabels.map((m) => {
              const isFirstHalf = m.weekIndex < 26;
              return (
                <span
                  key={`${m.label}-${m.weekIndex}`}
                  style={{ left: `${m.weekIndex * 20 + 40}px` }}
                  className={`absolute font-medium ${isFirstHalf ? "hidden md:inline-block" : "inline-block"}`}
                >
                  {m.label}
                </span>
              );
            })}
          </div>

          {/* Grid + Left Day Labels */}
          <div className="flex items-start gap-2.5">
            {/* MON, WED, FRI Labels */}
            <div className="flex flex-col justify-between text-[10px] font-mono text-zinc-500 w-8 h-[126px] shrink-0 pt-1 font-semibold uppercase tracking-wider">
              <span></span>
              <span>MON</span>
              <span></span>
              <span>WED</span>
              <span></span>
              <span>FRI</span>
              <span></span>
            </div>

            {/* Week Columns */}
            <div className="flex items-center gap-1.5">
              {weeks.map((week, wIdx) => {
                const isFirstHalf = wIdx < 26;
                return (
                  <div
                    key={wIdx}
                    className={`flex-col gap-1.5 ${
                      isFirstHalf ? "hidden md:flex" : "flex"
                    }`}
                  >
                    {week.map((day) => {
                      const tierClass = TIER_CLASSES[day.tier];
                      return (
                        <button
                          key={day.dateStr}
                          type="button"
                          onMouseEnter={(e) => handleMouseEnter(day, e)}
                          onMouseLeave={handleMouseLeave}
                          onClick={(e) => handleMouseEnter(day, e)}
                          className={`w-3.5 h-3.5 rounded-[4px] transition-all cursor-pointer ${tierClass} ${
                            day.isFuture ? "opacity-25 cursor-default" : ""
                          }`}
                          aria-label={`${day.dateStr}: ${day.count} pickups`}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. FOOTER: Motivational Bar & Color Legend (Less [][][][] More)
          ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-4 border-t border-slate-200 dark:border-white/5 mt-4">
        {/* Motivational Status Bar */}
        <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-300">
          <Leaf className="w-3.5 h-3.5 text-emerald-600 dark:text-[#65E817] shrink-0" />
          <span className="font-normal text-xs text-slate-600 dark:text-zinc-300">
            Keep recycling! Every doorstep pickup builds your green streak.
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-[11px] font-mono text-slate-500 dark:text-zinc-400">
          <span>Less</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-[4px] bg-slate-100 dark:bg-zinc-800/60 border border-slate-200 dark:border-white/5" />
            <span className="w-3.5 h-3.5 rounded-[4px] bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800/60" />
            <span className="w-3.5 h-3.5 rounded-[4px] bg-emerald-500/80 dark:bg-emerald-600/80 border border-emerald-400 dark:border-emerald-500/60" />
            <span className="w-3.5 h-3.5 rounded-[4px] bg-[#65E817] border border-[#65E817] shadow-[0_0_8px_rgba(101,232,23,0.45)]" />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* ========================================================
          4. FLOATING DARK GLASS TOOLTIP
          ======================================================== */}
      {mounted &&
        hoveredDay &&
        tooltipPos &&
        createPortal(
          <div
            style={{
              position: "fixed",
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y - 8}px`,
              transform: "translate(-50%, -100%)",
              pointerEvents: "none",
              zIndex: 9999,
            }}
            className="w-56 p-3 rounded-xl bg-zinc-950/95 border border-white/15 text-white shadow-2xl backdrop-blur-md text-xs space-y-1.5 animate-in fade-in zoom-in-95 duration-100"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-1">
              <span className="font-semibold text-zinc-200">
                {hoveredDay.date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              {hoveredDay.count > 0 && (
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#65E817]/20 text-[#65E817] font-bold">
                  {hoveredDay.count} {hoveredDay.count === 1 ? "pickup" : "pickups"}
                </span>
              )}
            </div>

            {hoveredDay.count > 0 ? (
              <div className="space-y-1 text-[11px] pt-0.5">
                <div className="flex justify-between text-zinc-300">
                  <span className="text-zinc-400">Total Scrap:</span>
                  <strong className="text-white font-mono tabular-nums">{hoveredDay.totalKg} kg</strong>
                </div>
                {hoveredDay.totalPayout > 0 && (
                  <div className="flex justify-between text-zinc-300">
                    <span className="text-zinc-400">Total Payout:</span>
                    <strong className="text-[#65E817] font-mono tabular-nums">
                      ₹{hoveredDay.totalPayout.toLocaleString("en-IN")}
                    </strong>
                  </div>
                )}
                {hoveredDay.scrapTypes.length > 0 && (
                  <div className="text-[10px] text-emerald-400 truncate pt-0.5 font-medium">
                    {hoveredDay.scrapTypes.join(", ")}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-[11px] text-zinc-400 pt-0.5">
                {hoveredDay.isFuture ? "Upcoming day" : "No scrap pickup scheduled"}
              </p>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
