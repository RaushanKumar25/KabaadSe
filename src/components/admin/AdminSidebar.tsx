"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import {
  Truck,
  Tags,
  ArrowUpRight,
  Database,
  Menu,
  X,
  RefreshCw,
  Server,
  Layers,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [storageMode, setStorageMode] = useState<"postgres" | "local-json">("local-json");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/pickup", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        if (data.storageInfo) {
          setPendingCount(data.storageInfo.pendingCount || 0);
          setStorageMode(data.storageInfo.mode || "local-json");
        } else if (Array.isArray(data.pickups)) {
          const pending = data.pickups.filter(
            (p: any) => (p.status || "").toUpperCase() === "PENDING"
          ).length;
          setPendingCount(pending);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch admin sidebar stats:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 15000); // refresh stats every 15s
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    {
      name: "Pickup Queue",
      href: "/admin",
      icon: Truck,
      exact: true,
      badge: pendingCount > 0 ? pendingCount : null,
      badgeColor: "amber",
    },
    {
      name: "Rate Card Manager",
      href: "/admin/rates",
      icon: Tags,
      exact: false,
    },
  ];

  const isItemActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href || pathname === "/admin/pickups";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Top Header (hidden on md and larger) */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-[#0B0F19] border-b border-slate-800 text-slate-100">
        <div className="flex items-center gap-2.5">
          <BrandLogo size={22} className="h-5 w-5" />
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm tracking-tight text-white">KabaadSe</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/80">
              OPS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-950/90 text-amber-300 border border-amber-800/80">
              {pendingCount} Pending
            </span>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop & Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden flex flex-col"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-72 bg-[#0B0F19] border-r border-slate-800 h-full p-4 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <BrandLogo size={24} className="h-6 w-6" />
                  <span className="font-bold text-base text-white">KabaadSe Ops</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const active = isItemActive(item.href, item.exact);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition font-medium ${
                        active
                          ? "bg-[#111827] text-white border-l-2 border-emerald-500 font-semibold"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${active ? "text-emerald-400" : "text-slate-400"}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge !== null && item.badge !== undefined && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800/80">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <Link
                href="/"
                className="flex items-center justify-between text-xs text-slate-400 hover:text-white py-1.5 transition"
              >
                <span>← Live Website</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-[#111827] p-2 rounded-lg border border-slate-800">
                <span
                  className={`w-2 h-2 rounded-full ${
                    storageMode === "postgres" ? "bg-emerald-400" : "bg-sky-400"
                  }`}
                />
                <span>{storageMode === "postgres" ? "PostgreSQL Connected" : "Local Dev Store"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (w-60, fixed/sticky, border-r) */}
      <aside className="hidden md:flex flex-col justify-between w-60 shrink-0 min-h-screen bg-[#0B0F19] border-r border-slate-800/80 p-4 sticky top-0 h-screen select-none">
        {/* Top Header & Branding */}
        <div>
          <div className="flex items-center justify-between px-2 py-2 mb-6 border-b border-slate-800/80 pb-4">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <div className="p-1 rounded-lg bg-[#111827] border border-slate-800 group-hover:border-slate-700 transition">
                <BrandLogo size={22} className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-slate-100 tracking-tight">KabaadSe</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/80 uppercase">
                    Ops
                  </span>
                </div>
                <span className="block text-[10px] text-slate-500 font-mono">Operations Console</span>
              </div>
            </Link>

            <button
              type="button"
              onClick={fetchStats}
              title="Refresh Queue Stats"
              className="text-slate-500 hover:text-slate-300 transition p-1 rounded hover:bg-slate-900 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="px-2 mb-2">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Management
              </span>
            </div>

            {navItems.map((item) => {
              const active = isItemActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition font-medium group ${
                    active
                      ? "bg-[#111827] text-white font-semibold border border-slate-800/80 border-l-2 border-l-emerald-500 shadow-xs"
                      : "text-slate-400 hover:text-slate-200 hover:bg-[#111827]/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        active ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge !== null && item.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tabular-nums bg-amber-950/80 text-amber-300 border border-amber-800/60 shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Status & Links */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-[#111827]/60 transition border border-transparent hover:border-slate-800"
          >
            <span className="font-medium">← Live Website</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
          </Link>

          {/* Active Storage Connectivity Dot */}
          <div className="px-3 py-2 rounded-xl bg-[#111827] border border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-500 font-medium">Storage Engine</span>
              <span className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    storageMode === "postgres"
                      ? "bg-emerald-400 shadow-[0_0_8px_#34D399]"
                      : "bg-sky-400 shadow-[0_0_8px_#38BDF8]"
                  }`}
                />
              </span>
            </div>
            <div className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>{storageMode === "postgres" ? "PostgreSQL Active" : "Local Dev Store"}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

