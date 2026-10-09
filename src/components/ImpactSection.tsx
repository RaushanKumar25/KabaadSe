"use client";

import React from "react";
import Image from "next/image";
import { Droplet, Zap, Fuel, TreePine } from "lucide-react";

export default function ImpactSection() {
  const stats = [
    {
      id: "water",
      value: "13.8 crores",
      label: "LITRES OF WATER",
      cardBg: "bg-[#004e9a]",
      iconBg: "bg-white",
      iconColor: "text-[#004e9a] fill-[#004e9a]",
      icon: Droplet,
    },
    {
      id: "electricity",
      value: "5,65,536",
      label: "KWH OF ELECTRICITY",
      cardBg: "bg-[#9a0000]",
      iconBg: "bg-white",
      iconColor: "text-[#00a86b] fill-[#00a86b]",
      icon: Zap,
    },
    {
      id: "oil",
      value: "2.5 lakhs",
      label: "LITRES OF OIL",
      cardBg: "bg-[#7a6200]",
      iconBg: "bg-[#fef0b3]",
      iconColor: "text-[#705600] fill-[#705600]",
      icon: Fuel,
    },
    {
      id: "trees",
      value: "10,243",
      label: "NUMBER OF TREES",
      cardBg: "bg-[#137333]",
      iconBg: "bg-[#e8f5e9]",
      iconColor: "text-[#137333] fill-[#137333]",
      icon: TreePine,
    },
  ];

  return (
    <section className="w-full bg-[#f8fafc] dark:bg-black py-16 sm:py-20 px-4 sm:px-8 lg:px-12 border-t border-neutral-200 dark:border-neutral-900 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        {/* Main Banner Image Container */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-neutral-200/80 dark:border-white/10 bg-neutral-950">
          <Image
            src="/images/farak-padta-hai.png"
            alt="Farak Padta Hai - 81,10,504 kilograms waste diverted from land fills"
            width={1006}
            height={322}
            priority
            className="w-full h-auto object-cover select-none"
          />
        </div>

        {/* 4 Colored Metric Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-6 sm:mt-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className={`flex items-center gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl ${stat.cardBg} text-white shadow-md transition-transform duration-200 hover:scale-[1.02]`}
              >
                {/* Circle Icon Badge */}
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full ${stat.iconBg} flex items-center justify-center shrink-0 shadow-sm`}
                >
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>

                {/* Stat Content */}
                <div className="min-w-0">
                  <div className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
                    {stat.value}
                  </div>
                  <div className="text-[11px] sm:text-xs font-semibold text-white/90 uppercase tracking-wider mt-0.5 whitespace-nowrap">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
