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
  LayoutDashboard,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [storageMode, setStorageMode] = useState<"postgres" | "local-json">("postgres");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/pickups", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        if (data.summary) {
          setPendingCount(data.summary.pending || 0);
        } else if (Array.isArray(data.pickups)) {
          const pending = data.pickups.filter(
            (p: any) => (p.status || "").toUpperCase() === "PENDING"
          ).length;
          setPendingCount(pending);
        }

        if (data.storageInfo?.mode) {
          setStorageMode(data.storageInfo.mode);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch admin stats:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    {
      name: "Dashboard Overview",
      href: "/admin",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: "Pickup Queue",
      href: "/admin#pickup-queue",
      icon: Truck,
      badge: pendingCount > 0 ? pendingCount : null,
    },
    {
      name: "Rate Card Manager",
      href: "/admin#rates-manager",
      icon: Tags,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-[#0B0F19] border-b border-slate-800 text-slate-100">
        <div className="flex items-center gap-2.5">
          <BrandLogo size={20} className="h-5 w-5" />
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm text-white">KabaadSe</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
              OPS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-amber-950/50 text-amber-300 border border-amber-800/60">
              {pendingCount} Pending
            </span>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-[#111827] border border-slate-800 cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs md:hidden flex flex-col"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-68 bg-[#0B0F19] border-r border-slate-800 h-full p-4 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <BrandLogo size={22} className="h-5 w-5" />
                  <span className="font-bold text-sm text-white">KabaadSe Operations</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-[#111827] transition"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-slate-400" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge !== null && item.badge !== undefined && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/60 text-amber-300 border border-amber-800/60">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2.5 text-xs text-slate-400">
              <Link
                href="/"
                className="flex items-center justify-between py-1.5 hover:text-white transition"
              >
                <span>← Live Website</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-[#111827] p-2 rounded-lg border border-slate-800">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    storageMode === "postgres" ? "bg-emerald-400" : "bg-sky-400"
                  }`}
                />
                <span>{storageMode === "postgres" ? "PostgreSQL Active" : "Local Dev Store"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex flex-col justify-between w-60 shrink-0 min-h-screen bg-[#0B0F19] border-r border-slate-800/80 p-4 sticky top-0 h-screen select-none">
        <div>
          {/* Brand Mark */}
          <div className="flex items-center justify-between px-2 py-2 mb-6 border-b border-slate-800/80 pb-4">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="p-1 rounded-lg bg-[#111827] border border-slate-800">
                <BrandLogo size={20} className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-slate-100 tracking-tight">KabaadSe</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                    Ops
                  </span>
                </div>
                <span className="block text-[10px] text-slate-500 font-mono">Operations Console</span>
              </div>
            </Link>

            <button
              type="button"
              onClick={fetchStats}
              title="Refresh"
              className="text-slate-500 hover:text-slate-300 transition p-1 rounded hover:bg-slate-900 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="px-2 mb-2">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Workspace
              </span>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-[#111827] transition border border-transparent hover:border-slate-800"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{item.name}</span>
                  </div>

                  {item.badge !== null && item.badge !== undefined && (
                    <span className="px-2 py-0.2 rounded text-[10px] font-mono font-semibold tabular-nums bg-amber-950/60 text-amber-300 border border-amber-800/50">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Meta */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-[#111827] transition border border-transparent hover:border-slate-800"
          >
            <span className="font-medium">← Live Website</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
          </Link>

          {/* Storage Connectivity Status */}
          <div className="px-3 py-2 rounded-lg bg-[#111827] border border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-500 font-medium">Database Layer</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  storageMode === "postgres" ? "bg-emerald-400" : "bg-sky-400"
                }`}
              />
            </div>
            <div className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>{storageMode === "postgres" ? "PostgreSQL Active" : "Local Dev Store"}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
