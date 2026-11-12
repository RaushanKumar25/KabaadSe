"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Truck,
  Tags,
  Search,
  RefreshCw,
  Phone,
  MapPin,
  Calendar,
  Trash2,
  ExternalLink,
  Plus,
  Check,
  CheckCircle2,
  AlertCircle,
  X,
  SlidersHorizontal,
  Clock,
  CheckCircle,
} from "lucide-react";

interface PickupItem {
  id: string;
  customerName: string;
  customerPhone: string;
  city: string;
  locality: string;
  address: string;
  pickupDate: string;
  estimatedLoad: string;
  scrapTypes?: string;
  status: string;
  createdAt: string;
  source: "postgres" | "local-json";
}

interface RateItem {
  id: string;
  name: string;
  category: "Paper" | "Plastic" | "Metal" | "E-waste" | "Other";
  price: number;
  unit: string;
  iconPath: string;
  city: string;
  isActive: boolean;
  isCustom?: boolean;
}

interface ToastNotice {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

const STATUS_CONFIGS: Record<
  string,
  { label: string; bg: string; text: string; border: string }
> = {
  PENDING: {
    label: "Pending",
    bg: "bg-amber-950/40",
    text: "text-amber-300",
    border: "border-amber-800/60",
  },
  CONFIRMED: {
    label: "Confirmed",
    bg: "bg-sky-950/40",
    text: "text-sky-300",
    border: "border-sky-800/60",
  },
  COMPLETED: {
    label: "Completed",
    bg: "bg-emerald-950/40",
    text: "text-emerald-300",
    border: "border-emerald-800/60",
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "bg-zinc-800/60",
    text: "text-zinc-400",
    border: "border-zinc-700/60",
  },
};

const RATE_CATEGORIES = ["All", "Paper", "Plastic", "Metal", "E-waste", "Other"] as const;

export default function AdminDashboardPage() {
  // -------------------------------------------------------------
  // State: Pickup Queue & Summary
  // -------------------------------------------------------------
  const [pickups, setPickups] = useState<PickupItem[]>([]);
  const [loadingPickups, setLoadingPickups] = useState(true);
  const [pickupSearch, setPickupSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [pickupCityFilter, setPickupCityFilter] = useState("ALL");
  const [updatingPickupId, setUpdatingPickupId] = useState<string | null>(null);
  const [selectedPickupDetails, setSelectedPickupDetails] = useState<PickupItem | null>(null);

  // -------------------------------------------------------------
  // State: Rate Card Manager
  // -------------------------------------------------------------
  const [rates, setRates] = useState<RateItem[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([
    "Patna",
    "Jalandhar",
    "Ludhiana",
    "Delhi NCR",
    "Ranchi",
    "Mumbai",
  ]);
  const [selectedRateCity, setSelectedRateCity] = useState("Patna");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [rateSearch, setRateSearch] = useState("");
  const [loadingRates, setLoadingRates] = useState(true);
  const [editedPrices, setEditedPrices] = useState<Record<string, number>>({});
  const [savedRateStatus, setSavedRateStatus] = useState<Record<string, boolean>>({});
  const [updatingRateId, setUpdatingRateId] = useState<string | null>(null);

  // Modal: Add Scrap Item
  const [isAddRateModalOpen, setIsAddRateModalOpen] = useState(false);
  const [newMaterialName, setNewMaterialName] = useState("");
  const [newMaterialCategory, setNewMaterialCategory] = useState<"Paper" | "Plastic" | "Metal" | "E-waste" | "Other">("Metal");
  const [newMaterialUnit, setNewMaterialUnit] = useState<"kg" | "pcs">("kg");
  const [newMaterialPrice, setNewMaterialPrice] = useState("");
  const [isSubmittingMaterial, setIsSubmittingMaterial] = useState(false);

  // Toast feedback
  const [toasts, setToasts] = useState<ToastNotice[]>([]);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // -------------------------------------------------------------
  // Data Fetching: Pickups
  // -------------------------------------------------------------
  const fetchPickups = async (showLoader = true) => {
    if (showLoader) setLoadingPickups(true);
    try {
      const res = await fetch("/api/pickups", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.pickups)) {
        setPickups(data.pickups);
      } else {
        showToast(data.error || "Failed to load pickups", "error");
      }
    } catch (err) {
      console.error("Fetch pickups error:", err);
      showToast("Network error while loading pickups", "error");
    } finally {
      if (showLoader) setLoadingPickups(false);
    }
  };

  // -------------------------------------------------------------
  // Data Fetching: Rates
  // -------------------------------------------------------------
  const fetchRates = async (city: string, showLoader = true) => {
    if (showLoader) setLoadingRates(true);
    try {
      const res = await fetch(`/api/rates?city=${encodeURIComponent(city)}&format=admin`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.rates)) {
        setRates(data.rates);
        if (Array.isArray(data.availableCities) && data.availableCities.length > 0) {
          setAvailableCities(data.availableCities);
        }
        setEditedPrices({});
        setSavedRateStatus({});
      } else {
        showToast("Failed to load scrap rates", "error");
      }
    } catch (err) {
      console.error("Fetch rates error:", err);
      showToast("Network error while loading rates", "error");
    } finally {
      if (showLoader) setLoadingRates(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  useEffect(() => {
    fetchRates(selectedRateCity);
  }, [selectedRateCity]);

  // -------------------------------------------------------------
  // Handlers: Pickup Status Update & Delete
  // -------------------------------------------------------------
  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingPickupId(id);
    const prevPickups = [...pickups];

    // Optimistic UI update
    setPickups((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );

    try {
      const res = await fetch(`/api/pickups/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setPickups(prevPickups);
        showToast(data.error || "Failed to update status in PostgreSQL", "error");
      } else {
        const shortId = `#KB-${id.slice(-6).toUpperCase()}`;
        showToast(`Status updated to ${newStatus} for ${shortId}`, "success");
      }
    } catch {
      setPickups(prevPickups);
      showToast("Server connection error during status update", "error");
    } finally {
      setUpdatingPickupId(null);
    }
  };

  const handleDeletePickup = async (id: string) => {
    const shortId = `#KB-${id.slice(-6).toUpperCase()}`;
    if (!window.confirm(`Permanently delete pickup request ${shortId}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/pickups/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPickups((prev) => prev.filter((p) => p.id !== id));
        showToast(`Pickup ${shortId} deleted from database`, "info");
      } else {
        showToast(data.error || "Failed to delete pickup request", "error");
      }
    } catch {
      showToast("Network error during delete", "error");
    }
  };

  // -------------------------------------------------------------
  // Handlers: Rate Card Edit, Save & Add
  // -------------------------------------------------------------
  const handlePriceChange = (itemId: string, val: string) => {
    const parsed = parseFloat(val);
    setEditedPrices((prev) => ({
      ...prev,
      [itemId]: isNaN(parsed) ? 0 : parsed,
    }));
    if (savedRateStatus[itemId]) {
      setSavedRateStatus((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleSaveRate = async (item: RateItem) => {
    const targetPrice =
      editedPrices[item.id] !== undefined ? editedPrices[item.id] : item.price;

    setUpdatingRateId(item.id);
    try {
      const res = await fetch("/api/rates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: selectedRateCity,
          itemId: item.id,
          price: targetPrice,
          isActive: item.isActive,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setRates((prev) =>
          prev.map((r) => (r.id === item.id ? { ...r, price: targetPrice } : r))
        );
        setSavedRateStatus((prev) => ({ ...prev, [item.id]: true }));
        setEditedPrices((prev) => {
          const next = { ...prev };
          delete next[item.id];
          return next;
        });
        showToast(`Rate for ${item.name} updated to ₹${targetPrice}/${item.unit}`, "success");
      } else {
        showToast(data.error || "Failed to update scrap rate", "error");
      }
    } catch {
      showToast("Server connection error while saving rate", "error");
    } finally {
      setUpdatingRateId(null);
    }
  };

  const handleToggleRateActive = async (item: RateItem) => {
    const nextActive = !item.isActive;
    const currentPrice =
      editedPrices[item.id] !== undefined ? editedPrices[item.id] : item.price;

    setUpdatingRateId(item.id);
    try {
      const res = await fetch("/api/rates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: selectedRateCity,
          itemId: item.id,
          price: currentPrice,
          isActive: nextActive,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setRates((prev) =>
          prev.map((r) => (r.id === item.id ? { ...r, isActive: nextActive } : r))
        );
        showToast(
          `${item.name} is now ${nextActive ? "Active" : "Disabled"} in ${selectedRateCity}`,
          "info"
        );
      }
    } catch {
      showToast("Failed to toggle material status", "error");
    } finally {
      setUpdatingRateId(null);
    }
  };

  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterialName.trim() || !newMaterialPrice) {
      showToast("Please enter material name and price", "error");
      return;
    }

    setIsSubmittingMaterial(true);
    try {
      const res = await fetch("/api/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newMaterialName.trim(),
          category: newMaterialCategory,
          unit: newMaterialUnit,
          price: parseFloat(newMaterialPrice),
          city: selectedRateCity,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Material "${data.item.name}" added to catalog`, "success");
        setIsAddRateModalOpen(false);
        setNewMaterialName("");
        setNewMaterialPrice("");
        fetchRates(selectedRateCity, false);
      } else {
        showToast(data.error || "Could not add material", "error");
      }
    } catch {
      showToast("Network error while creating material", "error");
    } finally {
      setIsSubmittingMaterial(false);
    }
  };

  // -------------------------------------------------------------
  // Calculations: Dynamic Summary Analytics
  // -------------------------------------------------------------
  const summaryMetrics = useMemo(() => {
    const total = pickups.length;
    const pending = pickups.filter(
      (p) => (p.status || "").toUpperCase() === "PENDING"
    ).length;
    const completed = pickups.filter(
      (p) => (p.status || "").toUpperCase() === "COMPLETED"
    ).length;
    const confirmed = pickups.filter(
      (p) => (p.status || "").toUpperCase() === "CONFIRMED"
    ).length;
    const cancelled = pickups.filter(
      (p) => (p.status || "").toUpperCase() === "CANCELLED"
    ).length;

    return { total, pending, completed, confirmed, cancelled };
  }, [pickups]);

  // Unique cities from pickups
  const uniquePickupCities = useMemo(() => {
    const set = new Set<string>();
    pickups.forEach((p) => {
      if (p.city) set.add(p.city);
    });
    return Array.from(set);
  }, [pickups]);

  // Filtered Pickups
  const filteredPickups = useMemo(() => {
    const q = pickupSearch.trim().toLowerCase();
    return pickups.filter((item) => {
      const itemStatus = (item.status || "PENDING").toUpperCase();
      const statusMatches =
        statusFilter === "ALL" || itemStatus === statusFilter.toUpperCase();

      const cityMatches =
        pickupCityFilter === "ALL" ||
        (item.city && item.city.toLowerCase() === pickupCityFilter.toLowerCase());

      const queryMatches =
        !q ||
        item.customerName.toLowerCase().includes(q) ||
        item.customerPhone.includes(q) ||
        item.address.toLowerCase().includes(q) ||
        (item.locality && item.locality.toLowerCase().includes(q)) ||
        (item.city && item.city.toLowerCase().includes(q)) ||
        (item.scrapTypes && item.scrapTypes.toLowerCase().includes(q)) ||
        item.id.toLowerCase().includes(q);

      return statusMatches && cityMatches && queryMatches;
    });
  }, [pickups, pickupSearch, statusFilter, pickupCityFilter]);

  // Filtered Rates
  const filteredRates = useMemo(() => {
    const q = rateSearch.trim().toLowerCase();
    return rates.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [rates, selectedCategory, rateSearch]);

  const formatDateDisplay = (dateString: string) => {
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* ========================================================= */}
      {/* 1. TOP HEADER & SUMMARY ANALYTICS                         */}
      {/* ========================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                OPERATIONS
              </span>
              <span className="text-xs text-slate-400 font-mono">Internal Console</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Operations Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                fetchPickups(true);
                fetchRates(selectedRateCity, false);
              }}
              disabled={loadingPickups}
              className="px-3 py-1.5 rounded-lg bg-[#111827] border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingPickups ? "animate-spin" : ""}`} />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Cards: Clean 1px border, high contrast, non-AI styling */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Card 1: Total Pickups */}
          <div
            onClick={() => setStatusFilter("ALL")}
            className={`p-4 rounded-xl border transition cursor-pointer ${
              statusFilter === "ALL"
                ? "bg-[#111827] border-slate-700"
                : "bg-[#111827] border-slate-800/80 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>Total Pickups</span>
              <span className="text-[10px] font-mono uppercase text-slate-400">
                Registered
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-mono font-bold tabular-nums text-white">
                {summaryMetrics.total}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                All-time bookings
              </span>
            </div>
          </div>

          {/* Card 2: Pending Requests */}
          <div
            onClick={() => setStatusFilter("PENDING")}
            className={`p-4 rounded-xl border transition cursor-pointer ${
              statusFilter === "PENDING"
                ? "bg-[#111827] border-amber-500/60"
                : "bg-[#111827] border-slate-800/80 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Pending Requests
              </span>
              <span className="text-[10px] font-mono uppercase text-amber-300 font-semibold">
                Action Required
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-mono font-bold tabular-nums text-white">
                {summaryMetrics.pending}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Needs call verification
              </span>
            </div>
          </div>

          {/* Card 3: Completed Pickups */}
          <div
            onClick={() => setStatusFilter("COMPLETED")}
            className={`p-4 rounded-xl border transition cursor-pointer ${
              statusFilter === "COMPLETED"
                ? "bg-[#111827] border-emerald-500/60"
                : "bg-[#111827] border-slate-800/80 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Completed Pickups
              </span>
              <span className="text-[10px] font-mono uppercase text-emerald-300 font-semibold">
                Settled
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-mono font-bold tabular-nums text-white">
                {summaryMetrics.completed}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Weighed & paid out
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. PICKUP QUEUE SECTION                                   */}
      {/* ========================================================= */}
      <section id="pickup-queue" className="space-y-3.5 scroll-mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400" />
              Pickup Queue
            </h2>
            <p className="text-xs text-slate-400">
              Live requests submitted via Sell Scrap doorstep booking form.
            </p>
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "ALL", label: "All", count: summaryMetrics.total },
              { id: "PENDING", label: "Pending", count: summaryMetrics.pending },
              { id: "CONFIRMED", label: "Confirmed", count: summaryMetrics.confirmed },
              { id: "COMPLETED", label: "Completed", count: summaryMetrics.completed },
              { id: "CANCELLED", label: "Cancelled", count: summaryMetrics.cancelled },
            ].map((tab) => {
              const active = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? "bg-[#111827] text-white border border-slate-700 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-[#111827]/40"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-mono tabular-nums ${
                      active ? "bg-slate-800 text-white font-bold" : "text-slate-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Toolbar: Search & City Filter */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search customer, phone number, locality, scrap types, or ID..."
              value={pickupSearch}
              onChange={(e) => setPickupSearch(e.target.value)}
              className="w-full bg-[#111827] border border-slate-800 rounded-lg pl-8.5 pr-8 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {pickupSearch && (
              <button
                type="button"
                onClick={() => setPickupSearch("")}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={pickupCityFilter}
              onChange={(e) => setPickupCityFilter(e.target.value)}
              className="bg-[#111827] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="ALL">All Cities ({uniquePickupCities.length})</option>
              {uniquePickupCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {(pickupSearch || statusFilter !== "ALL" || pickupCityFilter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setPickupSearch("");
                  setStatusFilter("ALL");
                  setPickupCityFilter("ALL");
                }}
                className="px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white bg-[#111827] border border-slate-800 transition cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Pickup Queue Table */}
        <div className="rounded-xl border border-slate-800/80 bg-[#111827] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0B0F19] text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 select-none">
                <tr>
                  <th className="py-2.5 px-4">Booking ID & Date</th>
                  <th className="py-2.5 px-4">Customer</th>
                  <th className="py-2.5 px-4">Location</th>
                  <th className="py-2.5 px-4">Scrap Details</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {loadingPickups ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-500">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />
                        <span>Loading live pickups from database...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredPickups.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-500">
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-300 text-xs">
                          No pickup requests found
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {pickups.length === 0
                            ? "New requests submitted through the Sell Scrap form will appear here live."
                            : "No bookings match the currently active filters."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPickups.map((item) => {
                    const shortId = `#KB-${item.id.slice(-6).toUpperCase()}`;
                    const currentStatus = (item.status || "PENDING").toUpperCase();
                    const statusConfig =
                      STATUS_CONFIGS[currentStatus] || STATUS_CONFIGS.PENDING;

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-800/25 transition-colors"
                      >
                        {/* ID & Scheduled Date */}
                        <td className="py-3 px-4 align-top">
                          <div className="font-mono tabular-nums font-bold text-slate-100 text-xs">
                            {shortId}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] font-mono tabular-nums text-slate-400 mt-0.5">
                            <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
                            <span>{formatDateDisplay(item.pickupDate)}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Booked: {formatDateDisplay(item.createdAt)}
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="py-3 px-4 align-top">
                          <div className="font-semibold text-slate-100 text-xs">
                            {item.customerName}
                          </div>
                          <div className="mt-0.5">
                            <a
                              href={`tel:+91${item.customerPhone}`}
                              className="inline-flex items-center gap-1 font-mono tabular-nums text-xs text-emerald-400 hover:underline"
                            >
                              <Phone className="w-3 h-3" />
                              +91 {item.customerPhone}
                            </a>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="py-3 px-4 align-top max-w-[200px]">
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                              {item.city || "Patna"}
                            </span>
                            <span className="text-xs text-slate-200 truncate font-medium">
                              {item.locality}
                            </span>
                          </div>
                          <div
                            onClick={() => setSelectedPickupDetails(item)}
                            className="text-[11px] text-slate-400 truncate mt-1 cursor-pointer hover:text-slate-200 hover:underline flex items-center gap-1"
                            title="Click to view full address"
                          >
                            <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                            <span className="truncate">{item.address}</span>
                          </div>
                        </td>

                        {/* Scrap Details */}
                        <td className="py-3 px-4 align-top max-w-[220px]">
                          <div className="flex flex-wrap gap-1 mb-1">
                            {(item.scrapTypes || "Mixed Scrap")
                              .split(",")
                              .map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="px-1.5 py-0.2 rounded text-[10px] bg-slate-900 text-slate-300 border border-slate-800"
                                >
                                  {tag.trim()}
                                </span>
                              ))}
                          </div>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono tabular-nums font-semibold bg-slate-800 text-slate-300">
                            {item.estimatedLoad || "< 20 kg"}
                          </span>
                        </td>

                        {/* Status Control Select */}
                        <td className="py-3 px-4 align-top">
                          <select
                            value={currentStatus}
                            disabled={updatingPickupId === item.id}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            className={`px-2 py-0.5 rounded text-xs font-semibold border cursor-pointer focus:outline-none transition-all ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} disabled:opacity-50`}
                          >
                            <option value="PENDING" className="bg-[#111827] text-slate-200">
                              Pending
                            </option>
                            <option value="CONFIRMED" className="bg-[#111827] text-slate-200">
                              Confirmed
                            </option>
                            <option value="COMPLETED" className="bg-[#111827] text-slate-200">
                              Completed
                            </option>
                            <option value="CANCELLED" className="bg-[#111827] text-slate-200">
                              Cancelled
                            </option>
                          </select>
                        </td>

                        {/* Action: Delete */}
                        <td className="py-3 px-4 align-top text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setSelectedPickupDetails(item)}
                              title="Full Address"
                              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePickup(item.id)}
                              title="Delete Pickup"
                              className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 cursor-pointer transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. LIVE RATE CARD MANAGER SECTION                         */}
      {/* ========================================================= */}
      <section id="rates-manager" className="space-y-3.5 pt-4 border-t border-slate-800/80 scroll-mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Tags className="w-4 h-4 text-emerald-400" />
              Rate Card Manager
            </h2>
            <p className="text-xs text-slate-400">
              Live scrap pricing engine synced directly with PostgreSQL.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddRateModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Scrap Item</span>
            </button>
          </div>
        </div>

        {/* City Switcher Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800/60">
          <span className="text-xs text-slate-400 font-medium mr-1 shrink-0 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" />
            City:
          </span>
          {availableCities.map((city) => {
            const isSelected = selectedRateCity.toLowerCase() === city.toLowerCase();
            return (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedRateCity(city)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer shrink-0 ${
                  isSelected
                    ? "bg-[#111827] text-emerald-400 border border-slate-700 font-bold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#111827]/40"
                }`}
              >
                {city}
              </button>
            );
          })}
        </div>

        {/* Category Pills & Search */}
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          <div className="flex flex-wrap items-center gap-1">
            {RATE_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer ${
                    active
                      ? "bg-[#111827] text-white border border-slate-700 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-[#111827]/30"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search material or ID..."
              value={rateSearch}
              onChange={(e) => setRateSearch(e.target.value)}
              className="w-full bg-[#111827] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Rates Table */}
        <div className="rounded-xl border border-slate-800/80 bg-[#111827] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0B0F19] text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 select-none">
                <tr>
                  <th className="py-2.5 px-4">Material Name</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Unit</th>
                  <th className="py-2.5 px-4 min-w-[150px]">Current Rate (₹)</th>
                  <th className="py-2.5 px-4">Catalog Status</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {loadingRates ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-500">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />
                        <span>Loading scrap rates for {selectedRateCity}...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredRates.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-500">
                      <p className="font-semibold text-slate-300">No scrap materials found</p>
                      <p className="text-[11px] text-slate-400">
                        Try clearing the search or category filter.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredRates.map((item) => {
                    const isEdited =
                      editedPrices[item.id] !== undefined &&
                      editedPrices[item.id] !== item.price;
                    const displayPrice =
                      editedPrices[item.id] !== undefined
                        ? editedPrices[item.id]
                        : item.price;
                    const isSaved = !!savedRateStatus[item.id];
                    const isUpdating = updatingRateId === item.id;

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-800/25 transition-colors"
                      >
                        {/* Name & Icon */}
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 overflow-hidden relative">
                              {item.iconPath ? (
                                <Image
                                  src={item.iconPath}
                                  alt={item.name}
                                  width={20}
                                  height={20}
                                  className="object-contain"
                                />
                              ) : (
                                <span className="text-[10px] font-mono font-bold text-slate-400">
                                  {item.name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-slate-100 text-xs">
                                  {item.name}
                                </span>
                                {item.isCustom && (
                                  <span className="px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-slate-800 text-slate-300">
                                    Custom
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono block">
                                ID: {item.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-2.5 px-4">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-900 text-slate-300 border border-slate-800">
                            {item.category}
                          </span>
                        </td>

                        {/* Unit */}
                        <td className="py-2.5 px-4 font-mono text-xs text-slate-400">
                          /{item.unit}
                        </td>

                        {/* Current Rate Input */}
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <div className="relative max-w-[110px]">
                              <span className="absolute left-2.5 top-1.5 text-xs font-mono text-slate-400">
                                ₹
                              </span>
                              <input
                                type="number"
                                step="any"
                                min="0"
                                value={displayPrice}
                                onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                className={`w-full bg-[#0B0F19] border rounded pl-6 pr-2 py-1 text-xs font-mono tabular-nums text-slate-100 focus:outline-none transition-colors ${
                                  isEdited
                                    ? "border-amber-500 text-amber-200"
                                    : "border-slate-800 focus:border-emerald-500"
                                }`}
                              />
                            </div>
                            <span className="text-[11px] font-mono text-slate-400">
                              /{item.unit}
                            </span>
                          </div>
                        </td>

                        {/* Catalog Status */}
                        <td className="py-2.5 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleRateActive(item)}
                            disabled={isUpdating}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition cursor-pointer border ${
                              item.isActive
                                ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/60"
                                : "bg-slate-900 text-slate-400 border-slate-800"
                            }`}
                          >
                            {item.isActive ? "Active" : "Disabled"}
                          </button>
                        </td>

                        {/* Action: Save */}
                        <td className="py-2.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isSaved && !isEdited ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-800/60">
                                <Check className="w-3 h-3 stroke-[3]" />
                                Saved ✓
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSaveRate(item)}
                                disabled={!isEdited || isUpdating}
                                className={`px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                                  isEdited
                                    ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                                    : "bg-slate-900 text-slate-400 border border-slate-800/80 opacity-50 cursor-not-allowed"
                                }`}
                              >
                                {isUpdating ? (
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                ) : (
                                  <span>Save</span>
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* ADDRESS DETAILS MODAL                                     */}
      {/* ========================================================= */}
      {selectedPickupDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          onClick={() => setSelectedPickupDetails(null)}
        >
          <div
            className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-xl p-5 text-slate-100 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs text-emerald-400 font-bold">
                  #KB-{selectedPickupDetails.id.slice(-6).toUpperCase()}
                </span>
                <h3 className="text-sm font-bold text-white">Pickup Request Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPickupDetails(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Customer</span>
                <div className="font-semibold text-white text-sm">
                  {selectedPickupDetails.customerName}
                </div>
                <a
                  href={`tel:+91${selectedPickupDetails.customerPhone}`}
                  className="font-mono text-emerald-400 hover:underline inline-block mt-0.5"
                >
                  +91 {selectedPickupDetails.customerPhone}
                </a>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[11px]">City</span>
                  <span className="font-medium text-slate-200">
                    {selectedPickupDetails.city || "Patna"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Locality / Sector</span>
                  <span className="font-medium text-slate-200">
                    {selectedPickupDetails.locality}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-400 block text-[11px] mb-1">Full Address</span>
                <div className="p-2.5 rounded bg-[#0B0F19] border border-slate-800 font-mono text-slate-200 text-xs">
                  {selectedPickupDetails.address}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[11px]">Scheduled Date</span>
                  <span className="font-mono text-slate-200">
                    {formatDateDisplay(selectedPickupDetails.pickupDate)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Est. Load</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {selectedPickupDetails.estimatedLoad}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedPickupDetails(null)}
              className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ADD SCRAP MATERIAL MODAL                                  */}
      {/* ========================================================= */}
      {isAddRateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          onClick={() => setIsAddRateModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-xl p-5 text-slate-100 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                  Catalog Expansion
                </span>
                <h3 className="text-sm font-bold text-white">Add Scrap Material</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddRateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMaterial} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Material Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AC Copper Coil, Lead Batteries"
                  value={newMaterialName}
                  onChange={(e) => setNewMaterialName(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Category *
                  </label>
                  <select
                    value={newMaterialCategory}
                    onChange={(e) => setNewMaterialCategory(e.target.value as any)}
                    className="w-full bg-[#0B0F19] border border-slate-800 rounded-lg px-2.5 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Metal">Metal</option>
                    <option value="E-waste">E-waste</option>
                    <option value="Plastic">Plastic</option>
                    <option value="Paper">Paper</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Measurement Unit *
                  </label>
                  <select
                    value={newMaterialUnit}
                    onChange={(e) => setNewMaterialUnit(e.target.value as any)}
                    className="w-full bg-[#0B0F19] border border-slate-800 rounded-lg px-2.5 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="kg">Per Kilogram (/kg)</option>
                    <option value="pcs">Per Piece (/pcs)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Rate (₹ per {newMaterialUnit}) for {selectedRateCity} *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-mono">₹</span>
                  <input
                    type="number"
                    required
                    step="any"
                    min="0.1"
                    placeholder="e.g. 350"
                    value={newMaterialPrice}
                    onChange={(e) => setNewMaterialPrice(e.target.value)}
                    className="w-full bg-[#0B0F19] border border-slate-800 rounded-lg pl-7 pr-3 py-2 text-slate-100 font-mono tabular-nums focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingMaterial}
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSubmittingMaterial ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to PostgreSQL...</span>
                    </>
                  ) : (
                    <span>Add Material to {selectedRateCity}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none select-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-medium backdrop-blur-md shadow-xl ${
              toast.type === "success"
                ? "bg-[#111827] text-emerald-300 border-emerald-800/80"
                : toast.type === "error"
                ? "bg-[#111827] text-rose-300 border-rose-800/80"
                : "bg-[#111827] text-slate-200 border-slate-700"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
