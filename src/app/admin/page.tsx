"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  RefreshCw,
  Phone,
  MapPin,
  Calendar,
  Truck,
  Boxes,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  Filter,
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

interface ToastNotice {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending", bg: "bg-amber-950/70", text: "text-amber-300", border: "border-amber-800/80" },
  { value: "CONFIRMED", label: "Confirmed", bg: "bg-sky-950/70", text: "text-sky-300", border: "border-sky-800/80" },
  { value: "COMPLETED", label: "Completed", bg: "bg-emerald-950/70", text: "text-emerald-300", border: "border-emerald-800/80" },
  { value: "CANCELLED", label: "Cancelled", bg: "bg-rose-950/70", text: "text-rose-300", border: "border-rose-800/80" },
];

export default function AdminPickupQueuePage() {
  const [pickups, setPickups] = useState<PickupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [cityFilter, setCityFilter] = useState<string>("ALL");
  const [toasts, setToasts] = useState<ToastNotice[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedAddressItem, setSelectedAddressItem] = useState<PickupItem | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const fetchPickups = async (showLoadingState = true) => {
    if (showLoadingState) setLoading(true);
    try {
      const res = await fetch("/api/pickup", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.pickups)) {
        setPickups(data.pickups);
      } else {
        showToast(data.error || "Failed to load pickups", "error");
      }
    } catch (err) {
      console.error("Fetch pickups error:", err);
      showToast("Network error while fetching pickups", "error");
    } finally {
      if (showLoadingState) setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    const prevPickups = [...pickups];

    // Optimistic UI update
    setPickups((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );

    try {
      const res = await fetch("/api/pickup", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        // Rollback
        setPickups(prevPickups);
        showToast(data.error || "Failed to update status", "error");
      } else {
        const shortId = `#KB-${id.slice(-6).toUpperCase()}`;
        showToast(`Status updated to ${newStatus} for ${shortId}`, "success");
      }
    } catch (err) {
      setPickups(prevPickups);
      showToast("Server connection error during status update", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const shortId = `#KB-${id.slice(-6).toUpperCase()}`;
    if (!window.confirm(`Are you sure you want to delete ${shortId}? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/pickup?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPickups((prev) => prev.filter((p) => p.id !== id));
        showToast(`Booking ${shortId} removed successfully`, "info");
      } else {
        showToast(data.error || "Could not delete booking", "error");
      }
    } catch {
      showToast("Failed to delete booking", "error");
    }
  };

  // Compute operational statistics
  const stats = useMemo(() => {
    const pending = pickups.filter((p) => (p.status || "").toUpperCase() === "PENDING").length;
    const confirmed = pickups.filter((p) => (p.status || "").toUpperCase() === "CONFIRMED").length;
    const completed = pickups.filter((p) => (p.status || "").toUpperCase() === "COMPLETED").length;
    const cancelled = pickups.filter((p) => (p.status || "").toUpperCase() === "CANCELLED").length;
    return { pending, confirmed, completed, cancelled, total: pickups.length };
  }, [pickups]);

  // Extract unique cities list
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    pickups.forEach((p) => {
      if (p.city) set.add(p.city);
    });
    return Array.from(set);
  }, [pickups]);

  // Filter pickups
  const filteredPickups = useMemo(() => {
    const q = search.trim().toLowerCase();
    return pickups.filter((item) => {
      const itemStatus = (item.status || "PENDING").toUpperCase();
      const statusMatches =
        statusFilter === "ALL" || itemStatus === statusFilter.toUpperCase();

      const cityMatches =
        cityFilter === "ALL" ||
        (item.city && item.city.toLowerCase() === cityFilter.toLowerCase());

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
  }, [pickups, search, statusFilter, cityFilter]);

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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/80 uppercase tracking-wider">
              Logistics
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Live Doorstep Pickups
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2 mt-1">
            <Truck className="w-5 h-5 text-emerald-400" />
            Pickup Queue
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => fetchPickups(true)}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-[#111827] border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      {/* Top Operational Strip (3 compact cards, data-first, zero generic bloat) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Card 1: Action Required (Pending) */}
        <div
          onClick={() => setStatusFilter("PENDING")}
          className={`p-4 rounded-xl border transition cursor-pointer ${
            statusFilter === "PENDING"
              ? "bg-amber-950/30 border-amber-500/50"
              : "bg-[#111827] border-slate-800/80 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-1.5">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Action Required
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400/90 font-bold">
              Pending Call
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-mono font-bold tabular-nums text-white">
              {stats.pending}
            </span>
            <span className="text-[11px] text-slate-400">
              Needs slot verification
            </span>
          </div>
        </div>

        {/* Card 2: Scheduled / Confirmed */}
        <div
          onClick={() => setStatusFilter("CONFIRMED")}
          className={`p-4 rounded-xl border transition cursor-pointer ${
            statusFilter === "CONFIRMED"
              ? "bg-sky-950/30 border-sky-500/50"
              : "bg-[#111827] border-slate-800/80 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-1.5">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              Scheduled / Confirmed
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider text-sky-400/90 font-bold">
              En Route
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-mono font-bold tabular-nums text-white">
              {stats.confirmed}
            </span>
            <span className="text-[11px] text-slate-400">
              Vehicle allocated
            </span>
          </div>
        </div>

        {/* Card 3: Completed Pickups */}
        <div
          onClick={() => setStatusFilter("COMPLETED")}
          className={`p-4 rounded-xl border transition cursor-pointer ${
            statusFilter === "COMPLETED"
              ? "bg-emerald-950/30 border-emerald-500/50"
              : "bg-[#111827] border-slate-800/80 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-1.5">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Completed Pickups
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400/90 font-bold">
              Settled
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-mono font-bold tabular-nums text-white">
              {stats.completed}
            </span>
            <span className="text-[11px] text-slate-400">
              Weighed & paid out
            </span>
          </div>
        </div>
      </div>

      {/* Toolbar: Status Filter Tabs + Search + City Filter */}
      <div className="space-y-3">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/60 pb-3">
          {[
            { id: "ALL", label: "All Requests", count: stats.total },
            { id: "PENDING", label: "Pending", count: stats.pending },
            { id: "CONFIRMED", label: "Confirmed", count: stats.confirmed },
            { id: "COMPLETED", label: "Completed", count: stats.completed },
            { id: "CANCELLED", label: "Cancelled", count: stats.cancelled },
          ].map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-2 ${
                  active
                    ? "bg-[#111827] text-white border border-slate-700 shadow-xs font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#111827]/50"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-mono tabular-nums ${
                    active
                      ? "bg-emerald-950 text-emerald-400 font-bold"
                      : "bg-slate-900 text-slate-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & City Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by customer name, phone, city, locality, scrap types, or #KB-XXXX..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#111827] border border-slate-800/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="bg-[#111827] border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer pr-8"
              >
                <option value="ALL">All Cities ({availableCities.length})</option>
                {availableCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {(search || statusFilter !== "ALL" || cityFilter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                  setCityFilter("ALL");
                }}
                className="px-2.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Clean Operations Table */}
      <div className="rounded-xl border border-slate-800/80 bg-[#111827] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0B0F19] text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 select-none">
              <tr>
                <th className="py-3 px-4">Booking ID & Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Scrap Details</th>
                <th className="py-3 px-4">Status Control</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
                      <span>Loading operations queue...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredPickups.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="max-w-sm mx-auto space-y-2">
                      <Truck className="w-8 h-8 mx-auto text-slate-600 stroke-[1.5]" />
                      <p className="text-sm font-semibold text-slate-300">
                        No pickup requests match this filter
                      </p>
                      <p className="text-xs text-slate-500">
                        Try clearing search terms or switching tabs to view other records.
                      </p>
                      {(search || statusFilter !== "ALL" || cityFilter !== "ALL") && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearch("");
                            setStatusFilter("ALL");
                            setCityFilter("ALL");
                          }}
                          className="mt-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPickups.map((item) => {
                  const shortId = `#KB-${item.id.slice(-6).toUpperCase()}`;
                  const currentStatus = (item.status || "PENDING").toUpperCase();
                  const statusConfig =
                    STATUS_OPTIONS.find((s) => s.value === currentStatus) || STATUS_OPTIONS[0];

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* Booking ID & Scheduled Date */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-mono tabular-nums font-bold text-slate-100 text-xs tracking-tight">
                          {shortId}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-mono tabular-nums text-slate-400 mt-1">
                          <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
                          <span>{formatDateDisplay(item.pickupDate)}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          Booked: {formatDateDisplay(item.createdAt)}
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-semibold text-slate-100 text-sm">
                          {item.customerName}
                        </div>
                        <div className="mt-1">
                          <a
                            href={`tel:+91${item.customerPhone}`}
                            className="inline-flex items-center gap-1 font-mono tabular-nums text-xs text-emerald-400 hover:underline hover:text-emerald-300"
                            title="Click to dial customer"
                          >
                            <Phone className="w-3 h-3" />
                            +91 {item.customerPhone}
                          </a>
                        </div>
                      </td>

                      {/* Location Details */}
                      <td className="py-3.5 px-4 align-top max-w-[220px]">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                            {item.city || "Patna"}
                          </span>
                          <span className="text-xs font-medium text-slate-200 truncate">
                            {item.locality}
                          </span>
                        </div>
                        <div
                          onClick={() => setSelectedAddressItem(item)}
                          className="text-[11px] text-slate-400 truncate mt-1 cursor-pointer hover:text-slate-200 hover:underline flex items-center gap-1"
                          title="Click to view full address"
                        >
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate">{item.address}</span>
                        </div>
                      </td>

                      {/* Scrap Details */}
                      <td className="py-3.5 px-4 align-top max-w-[240px]">
                        <div className="flex flex-wrap gap-1 mb-1.5">
                          {(item.scrapTypes || "Mixed Scrap")
                            .split(",")
                            .map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-900 text-slate-300 border border-slate-800"
                              >
                                {tag.trim()}
                              </span>
                            ))}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono tabular-nums font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                            {item.estimatedLoad || "< 20 kg"}
                          </span>
                        </div>
                      </td>

                      {/* Status Control Select Badge */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="relative inline-block">
                          <select
                            value={currentStatus}
                            disabled={updatingId === item.id}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none transition-all ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} disabled:opacity-50`}
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option
                                key={opt.value}
                                value={opt.value}
                                className="bg-[#111827] text-slate-200"
                              >
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedAddressItem(item)}
                            title="View Full Details"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            title="Delete Record"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition cursor-pointer"
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

      {/* Address Details Modal */}
      {selectedAddressItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          onClick={() => setSelectedAddressItem(null)}
        >
          <div
            className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-2xl p-5 sm:p-6 text-slate-100 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs text-emerald-400 font-bold">
                  #KB-{selectedAddressItem.id.slice(-6).toUpperCase()}
                </span>
                <h3 className="text-base font-bold text-white">
                  Pickup & Address Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAddressItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block mb-0.5">Customer</span>
                <div className="font-semibold text-white text-sm">
                  {selectedAddressItem.customerName}
                </div>
                <a
                  href={`tel:+91${selectedAddressItem.customerPhone}`}
                  className="font-mono text-emerald-400 hover:underline mt-0.5 inline-block"
                >
                  +91 {selectedAddressItem.customerPhone}
                </a>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                <div>
                  <span className="text-slate-500 block">City</span>
                  <span className="font-medium text-slate-200">
                    {selectedAddressItem.city || "Patna"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Locality / Sector</span>
                  <span className="font-medium text-slate-200">
                    {selectedAddressItem.locality}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-slate-500 block mb-1">Complete Address & Landmark</span>
                <div className="p-3 rounded-lg bg-[#0B0F19] border border-slate-800 text-slate-200 font-mono text-xs leading-relaxed">
                  {selectedAddressItem.address}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                <div>
                  <span className="text-slate-500 block">Scheduled Pickup</span>
                  <span className="font-mono text-slate-200">
                    {formatDateDisplay(selectedAddressItem.pickupDate)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Estimated Weight</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {selectedAddressItem.estimatedLoad}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-slate-500 block mb-1">Selected Scrap Categories</span>
                <div className="flex flex-wrap gap-1">
                  {(selectedAddressItem.scrapTypes || "Mixed Scrap")
                    .split(",")
                    .map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] bg-slate-900 text-slate-300 border border-slate-800"
                      >
                        {t.trim()}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedAddressItem(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Floating Bottom-Right Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none select-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-xl border shadow-2xl text-xs font-medium backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2 duration-200 ${
              toast.type === "success"
                ? "bg-emerald-950/90 text-emerald-200 border-emerald-700/80"
                : toast.type === "error"
                ? "bg-rose-950/90 text-rose-200 border-rose-700/80"
                : "bg-slate-900/90 text-slate-200 border-slate-700/80"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

