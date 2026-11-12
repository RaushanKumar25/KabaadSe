"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Tags,
  Search,
  Plus,
  RefreshCw,
  Check,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ArrowUpDown,
  SlidersHorizontal,
} from "lucide-react";

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
  updatedAt?: string;
}

interface ToastNotice {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

const CATEGORIES = ["All", "Paper", "Plastic", "Metal", "E-waste", "Other"] as const;

export default function AdminRatesPage() {
  const [rates, setRates] = useState<RateItem[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([
    "Patna",
    "Jalandhar",
    "Ludhiana",
    "Delhi NCR",
    "Ranchi",
    "Mumbai",
  ]);
  const [selectedCity, setSelectedCity] = useState("Patna");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Track inline edited prices: itemId -> editedPrice
  const [editedPrices, setEditedPrices] = useState<Record<string, number>>({});
  // Track saved state: itemId -> boolean
  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({});
  // Track updating state: itemId -> boolean
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Modal for adding new scrap item
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<"Paper" | "Plastic" | "Metal" | "E-waste" | "Other">("Metal");
  const [newUnit, setNewUnit] = useState<"kg" | "pcs">("kg");
  const [newPrice, setNewPrice] = useState("");
  const [newCity, setNewCity] = useState(selectedCity);
  const [isSubmittingItem, setIsSubmittingItem] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastNotice[]>([]);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const fetchRates = async (city: string, showLoader = true) => {
    if (showLoader) setLoading(true);
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
        // Reset unsaved edits when switching city
        setEditedPrices({});
        setSavedStatus({});
      } else {
        showToast("Failed to load scrap rates", "error");
      }
    } catch (err) {
      console.error("Fetch rates error:", err);
      showToast("Network error while loading rates", "error");
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates(selectedCity);
  }, [selectedCity]);

  const handlePriceInputChange = (itemId: string, value: string) => {
    const parsed = parseFloat(value);
    setEditedPrices((prev) => ({
      ...prev,
      [itemId]: isNaN(parsed) ? 0 : parsed,
    }));
    // Remove "Saved ✓" indication if user edits again
    if (savedStatus[itemId]) {
      setSavedStatus((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleSavePrice = async (item: RateItem) => {
    const targetPrice =
      editedPrices[item.id] !== undefined ? editedPrices[item.id] : item.price;

    setUpdatingId(item.id);
    try {
      const res = await fetch("/api/rates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: selectedCity,
          itemId: item.id,
          price: targetPrice,
          isActive: item.isActive,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Update local item
        setRates((prev) =>
          prev.map((r) => (r.id === item.id ? { ...r, price: targetPrice } : r))
        );
        // Set saved status
        setSavedStatus((prev) => ({ ...prev, [item.id]: true }));
        // Clean up from edited
        setEditedPrices((prev) => {
          const next = { ...prev };
          delete next[item.id];
          return next;
        });

        showToast(`Rate for ${item.name} updated to ₹${targetPrice}/${item.unit}`, "success");
      } else {
        showToast(data.error || "Failed to update rate", "error");
      }
    } catch {
      showToast("Server connection error while saving rate", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleActive = async (item: RateItem) => {
    const nextActive = !item.isActive;
    const currentPrice =
      editedPrices[item.id] !== undefined ? editedPrices[item.id] : item.price;

    setUpdatingId(item.id);
    try {
      const res = await fetch("/api/rates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: selectedCity,
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
          `${item.name} is now ${nextActive ? "Active" : "Disabled"} in ${selectedCity}`,
          "info"
        );
      }
    } catch {
      showToast("Could not toggle status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddNewItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPrice) {
      showToast("Please fill in material name and price", "error");
      return;
    }

    setIsSubmittingItem(true);
    try {
      const res = await fetch("/api/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          category: newCategory,
          unit: newUnit,
          price: parseFloat(newPrice),
          city: newCity || selectedCity,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Material "${data.item.name}" added successfully!`, "success");
        setIsAddModalOpen(false);
        setNewName("");
        setNewPrice("");
        // Refresh rates
        fetchRates(selectedCity, false);
      } else {
        showToast(data.error || "Failed to add material", "error");
      }
    } catch {
      showToast("Network error while creating material", "error");
    } finally {
      setIsSubmittingItem(false);
    }
  };

  // Filtered items
  const filteredRates = useMemo(() => {
    const q = search.trim().toLowerCase();
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
  }, [rates, selectedCategory, search]);

  const hasUnsavedEdits = Object.keys(editedPrices).length > 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/80 uppercase tracking-wider">
              Pricing Engine
            </span>
            <span className="text-xs text-slate-500 font-mono">Live City Rates</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2 mt-1">
            <Tags className="w-5 h-5 text-emerald-400" />
            Rate Card Manager
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => fetchRates(selectedCity, true)}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-[#111827] border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setNewCity(selectedCity);
              setIsAddModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-emerald-950/40"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Scrap Item</span>
          </button>
        </div>
      </div>

      {/* City Switcher Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800/60">
        <span className="text-xs text-slate-500 font-medium mr-1 shrink-0 flex items-center gap-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          City:
        </span>
        {availableCities.map((city) => {
          const isSelected = selectedCity.toLowerCase() === city.toLowerCase();
          return (
            <button
              key={city}
              type="button"
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
                isSelected
                  ? "bg-[#111827] text-white border border-slate-700 shadow-xs font-bold text-emerald-400"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#111827]/50"
              }`}
            >
              {city}
            </button>
          );
        })}
      </div>

      {/* Category Pills & Search Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  active
                    ? "bg-[#111827] text-emerald-400 border border-slate-700 font-bold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#111827]/40"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search material or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111827] border border-slate-800/80 rounded-xl pl-8 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Unsaved Edits Notice Pill (if user has unsaved modifications) */}
      {hasUnsavedEdits && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-amber-950/40 border border-amber-800/80 text-amber-300 text-xs font-medium animate-in fade-in">
          <span>You have unsaved price changes in this rate card. Click &quot;Save&quot; on modified rows to apply.</span>
          <span className="font-mono font-bold">
            {Object.keys(editedPrices).length} unsaved
          </span>
        </div>
      )}

      {/* Inline Editable Rate Table */}
      <div className="rounded-xl border border-slate-800/80 bg-[#111827] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0B0F19] text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 select-none">
              <tr>
                <th className="py-3 px-4">Material Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4 min-w-[170px]">Current Rate (₹)</th>
                <th className="py-3 px-4">Catalog Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
                      <span>Loading rate card for {selectedCity}...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredRates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="max-w-sm mx-auto space-y-2">
                      <Tags className="w-8 h-8 mx-auto text-slate-600 stroke-[1.5]" />
                      <p className="text-sm font-semibold text-slate-300">
                        No scrap materials found
                      </p>
                      <p className="text-xs text-slate-500">
                        No items match your filter. You can add a new scrap material above.
                      </p>
                    </div>
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
                  const isSaved = !!savedStatus[item.id];
                  const isUpdating = updatingId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* Material Name & Custom Tag */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 overflow-hidden relative">
                            {item.iconPath ? (
                              <Image
                                src={item.iconPath}
                                alt={item.name}
                                width={24}
                                height={24}
                                className="object-contain"
                              />
                            ) : (
                              <span className="text-xs font-mono font-bold text-slate-400">
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
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                                  Custom
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono block">
                              ID: {item.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900 text-slate-300 border border-slate-800">
                          {item.category}
                        </span>
                      </td>

                      {/* Unit */}
                      <td className="py-3 px-4 font-mono text-xs text-slate-400">
                        /{item.unit}
                      </td>

                      {/* Current Rate (Editable Input with Data-First Mono) */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1 max-w-[130px]">
                            <span className="absolute left-2.5 top-2 text-xs font-mono text-slate-400 select-none">
                              ₹
                            </span>
                            <input
                              type="number"
                              step="any"
                              min="0"
                              value={displayPrice}
                              onChange={(e) =>
                                handlePriceInputChange(item.id, e.target.value)
                              }
                              className={`w-full bg-[#0B0F19] border rounded-lg pl-6 pr-2.5 py-1.5 text-xs font-mono tabular-nums text-slate-100 focus:outline-none transition-colors ${
                                isEdited
                                  ? "border-amber-500 text-amber-200 bg-amber-950/20"
                                  : "border-slate-800 focus:border-emerald-500"
                              }`}
                            />
                          </div>
                          <span className="text-[11px] font-mono text-slate-500">
                            /{item.unit}
                          </span>
                        </div>
                      </td>

                      {/* Catalog Status Toggle */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item)}
                          disabled={isUpdating}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition cursor-pointer border ${
                            item.isActive
                              ? "bg-emerald-950/80 text-emerald-300 border-emerald-800/80"
                              : "bg-slate-900 text-slate-500 border-slate-800"
                          }`}
                        >
                          {item.isActive ? "Active" : "Disabled"}
                        </button>
                      </td>

                      {/* Action (Save button with Saved ✓ State) */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isSaved && !isEdited ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 px-2 py-1 rounded bg-emerald-950/60 border border-emerald-800/60">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              Saved ✓
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSavePrice(item)}
                              disabled={!isEdited || isUpdating}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                                isEdited
                                  ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950 font-bold"
                                  : "bg-slate-900 text-slate-500 border border-slate-800/80 opacity-50 cursor-not-allowed"
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

      {/* Add New Scrap Item Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-2xl p-5 sm:p-6 text-slate-100 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Catalog Expansion
                </span>
                <h3 className="text-base font-bold text-white">Add New Scrap Material</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Material Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AC Copper Coil, Old Batteries, Lead Scrap"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-[#0B0F19] border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
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
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value as any)}
                    className="w-full bg-[#0B0F19] border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="kg">Per Kilogram (/kg)</option>
                    <option value="pcs">Per Piece (/pcs)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Rate (₹ per {newUnit}) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400 font-mono">₹</span>
                    <input
                      type="number"
                      required
                      step="any"
                      min="0.1"
                      placeholder="e.g. 450"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full bg-[#0B0F19] border border-slate-800 rounded-lg pl-7 pr-3 py-2 text-slate-100 font-mono tabular-nums focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Apply to City *
                  </label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full bg-[#0B0F19] border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {availableCities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingItem}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/40"
                >
                  {isSubmittingItem ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
                      <span>Saving Material...</span>
                    </>
                  ) : (
                    <span>Add Scrap Material to Catalog</span>
                  )}
                </button>
              </div>
            </form>
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

