"use client";

import React, { useState } from "react";
import {
  Smartphone,
  Building2,
  Trash2,
  Users,
  FileText,
  Wrench,
  Truck,
  RefreshCw,
  Globe,
  Layers,
  Landmark,
} from "lucide-react";

type AudienceType = "all" | "individual" | "organisation";

interface ServiceItem {
  id: string;
  title: string;
  audience: "individual" | "organisation";
  description: string;
  icon: React.ElementType;
  badgeBg: string;
  badgeText: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: "scrap-collection",
    title: "Scrap Collection",
    audience: "individual",
    description:
      "Digitised solution for doorstep free pickup of 40+ recyclables with certified digital scale.",
    icon: Smartphone,
    badgeBg: "bg-[#fde8e4]",
    badgeText: "text-[#d9534f]",
  },
  {
    id: "epr-service",
    title: "EPR Service",
    audience: "organisation",
    description:
      "Official collection & recycling partner helping businesses with EPR compliance.",
    icon: Building2,
    badgeBg: "bg-[#e1f5fe]",
    badgeText: "text-[#0288d1]",
  },
  {
    id: "zero-waste-services",
    title: "Zero Waste Services",
    audience: "organisation",
    description:
      "Helping offices, institutes, and events achieve zero-waste landfill goals.",
    icon: Trash2,
    badgeBg: "bg-[#fef9e7]",
    badgeText: "text-[#fbc02d]",
  },
  {
    id: "zero-waste-society",
    title: "Zero Waste Society",
    audience: "individual",
    description:
      "Empowering residential societies with decentralized waste segregation and recycling.",
    icon: Users,
    badgeBg: "bg-[#e8f5e9]",
    badgeText: "text-[#2e7d32]",
  },
  {
    id: "shredding-service",
    title: "Shredding Service",
    audience: "organisation",
    description:
      "Safe, secure, and on-site destruction of confidential business documents.",
    icon: FileText,
    badgeBg: "bg-[#f1f8e9]",
    badgeText: "text-[#689f38]",
  },
  {
    id: "dismantling-service",
    title: "Dismantling Service",
    audience: "organisation",
    description:
      "Holistic, certified dismantling solutions for obsolete industrial and office assets.",
    icon: Wrench,
    badgeBg: "bg-[#e0f7fa]",
    badgeText: "text-[#00838f]",
  },
  {
    id: "vehicle-scrapping",
    title: "Vehicle Scrapping",
    audience: "individual",
    description:
      "Assisting vehicle owners in deregistering and scrapping end-of-life vehicles responsibly.",
    icon: Truck,
    badgeBg: "bg-[#e8eaf6]",
    badgeText: "text-[#3949ab]",
  },
  {
    id: "circular-economy-advisory",
    title: "Circular Economy Advisory",
    audience: "organisation",
    description:
      "Planning and executing sustainability initiatives and closed-loop material flows.",
    icon: RefreshCw,
    badgeBg: "bg-[#e8f8f2]",
    badgeText: "text-[#00897b]",
  },
  {
    id: "csr-activity",
    title: "CSR Activity",
    audience: "organisation",
    description:
      "Designing and executing grassroots environmental CSR campaigns for corporate brands.",
    icon: Globe,
    badgeBg: "bg-[#fce4ec]",
    badgeText: "text-[#c2185b]",
  },
];

interface ServicesSectionProps {
  onContact?: () => void;
}

export default function ServicesSection({ onContact }: ServicesSectionProps) {
  const [activeTab, setActiveTab] = useState<AudienceType>("all");

  const filteredServices =
    activeTab === "all"
      ? SERVICES
      : SERVICES.filter((s) => s.audience === activeTab);

  const handleContact = () => {
    if (onContact) {
      onContact();
    } else {
      const el = document.getElementById("contact") || document.getElementById("rate-list");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-[#f8fafc] dark:bg-black py-20 px-6 sm:px-12 border-t border-neutral-200 dark:border-neutral-900 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-900 dark:text-white text-center tracking-tight leading-tight">
            Our Services
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-center mt-3 text-lg sm:text-xl md:text-2xl font-normal tracking-tight">
            Attaining{" "}
            <span className="text-emerald-500 font-semibold">
              sustainable solutions
            </span>{" "}
            with ease.
          </p>

          {/* Filter Tabs (Centered) */}
          <div className="flex justify-center items-center gap-3 mt-6 flex-wrap">
            {/* Tab: All Services */}
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === "all"
                  ? "bg-[#22c55e] text-black font-semibold"
                  : "bg-white dark:bg-[#1a1d21] text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-800 hover:border-neutral-400"
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>All services</span>
            </button>

            {/* Tab: For Individuals */}
            <button
              type="button"
              onClick={() => setActiveTab("individual")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === "individual"
                  ? "bg-[#22c55e] text-black font-semibold"
                  : "bg-white dark:bg-[#1a1d21] text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-800 hover:border-neutral-400"
              }`}
            >
              <Smartphone className="h-4 w-4" />
              <span>For Individuals</span>
            </button>

            {/* Tab: For Organisations */}
            <button
              type="button"
              onClick={() => setActiveTab("organisation")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === "organisation"
                  ? "bg-[#22c55e] text-black font-semibold"
                  : "bg-white dark:bg-[#1a1d21] text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-800 hover:border-neutral-400"
              }`}
            >
              <Landmark className="h-4 w-4" />
              <span>For Organisations</span>
            </button>
          </div>
        </div>

        {/* Static 3-Column Grid Layout (No Slider) */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {filteredServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-[#121417] border border-neutral-200 dark:border-white/[0.06] transition-colors shadow-xs dark:shadow-none hover:border-emerald-500/40"
              >
                {/* Circular Pastel Badge */}
                <div
                  className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center ${service.badgeBg} ${service.badgeText}`}
                >
                  <Icon className="h-5 w-5 stroke-[2.2]" />
                </div>

                {/* Right Side Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1 tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-snug">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Us Button */}
        <div className="flex justify-center mt-10">
          <button
            type="button"
            onClick={handleContact}
            className="px-7 py-2.5 rounded-lg bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold text-sm transition-colors cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
}
