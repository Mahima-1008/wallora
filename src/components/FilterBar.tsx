"use client";

import React from "react";
import {
  Monitor,
  Smartphone,
  Tv,
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  LayoutGrid,
} from "lucide-react";

interface FilterBarProps {
  deviceFilter: string;
  setDeviceFilter: (filter: string) => void;
  resolutionFilter: string;
  setResolutionFilter: (res: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalCount: number;
  resetFilters: () => void;
}

export default function FilterBar({
  deviceFilter,
  setDeviceFilter,
  resolutionFilter,
  setResolutionFilter,
  sortBy,
  setSortBy,
  searchQuery,
  setSearchQuery,
  totalCount,
  resetFilters,
}: FilterBarProps) {
  const isFiltered =
    deviceFilter !== "all" || resolutionFilter !== "all" || searchQuery !== "";

  const devices = [
    { id: "all", label: "All Devices", icon: LayoutGrid },
    { id: "desktop", label: "Desktop & Laptop", icon: Monitor },
    { id: "mobile", label: "Phone", icon: Smartphone },
    { id: "ultrawide", label: "Ultrawide (21:9)", icon: Tv },
  ];

  const resolutions = [
    { id: "all", label: "All Res" },
    { id: "4K", label: "4K UHD" },
    { id: "8K", label: "8K Ultra" },
    { id: "OLED", label: "OLED Dark" },
  ];

  const sortOptions = [
    { id: "trending", label: "Trending" },
    { id: "downloads", label: "Most Downloaded" },
    { id: "likes", label: "Highest Rated" },
    { id: "newest", label: "Recently Added" },
  ];

  return (
    <div className="w-full py-3 my-2 flex flex-wrap items-center justify-between gap-3 text-xs border-y border-white/[0.05]">
      {/* Device Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {devices.map((device) => {
          const Icon = device.icon;
          const isActive = deviceFilter === device.id;
          return (
            <button
              key={device.id}
              onClick={() => setDeviceFilter(device.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shrink-0 font-medium transition ${
                isActive
                  ? "bg-white text-zinc-950 font-semibold shadow-sm"
                  : "bg-[#131724] text-zinc-400 hover:text-white border border-white/[0.06] hover:border-white/15"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{device.label}</span>
            </button>
          );
        })}
      </div>

      {/* Resolution & Sort Options */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Resolution selector */}
        <div className="flex items-center gap-1 p-0.5 rounded-full bg-[#131724] border border-white/[0.06]">
          {resolutions.map((res) => (
            <button
              key={res.id}
              onClick={() => setResolutionFilter(res.id)}
              className={`px-2.5 py-1 rounded-full transition ${
                resolutionFilter === res.id
                  ? "bg-[#1E2335] text-amber-300 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {res.label}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="relative flex items-center">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#131724] border border-white/[0.06] text-zinc-300">
            <ArrowUpDown className="w-3 h-3 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer pr-1"
            >
              {sortOptions.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-[#121624] text-zinc-200">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Counter & Reset */}
        <div className="flex items-center gap-2 pl-1 text-zinc-400">
          <span className="font-mono text-[11px]">
            {totalCount} {totalCount === 1 ? "wallpaper" : "wallpapers"}
          </span>

          {isFiltered && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 transition"
              title="Reset all filters"
            >
              <X className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
