"use client";

import React from "react";
import {
  RotateCcw,
  Sparkles,
  Monitor,
  Smartphone,
  Square,
  Check,
  ChevronDown,
} from "lucide-react";
import {
  EXPLORE_CATEGORIES,
  ORIENTATIONS,
  RESOLUTIONS,
  COLOR_FAMILIES,
  SORT_OPTIONS,
} from "@/lib/exploreFilters";

interface FilterCounts {
  categories: Record<string, number>;
  orientations: Record<string, number>;
  resolutions: Record<string, number>;
  colors: Record<string, number>;
}

interface ExploreFilterPanelProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedOrientation: string;
  onSelectOrientation: (orientation: string) => void;
  selectedResolution: string;
  onSelectResolution: (resolution: string) => void;
  selectedColor: string;
  onSelectColor: (color: string) => void;
  dominantOnly: boolean;
  onToggleDominantOnly: () => void;
  sortBy: string;
  onSelectSortBy: (sort: string) => void;
  onResetAll: () => void;
  activeFiltersCount: number;
  counts: FilterCounts;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function ExploreFilterPanel({
  selectedCategory,
  onSelectCategory,
  selectedOrientation,
  onSelectOrientation,
  selectedResolution,
  onSelectResolution,
  selectedColor,
  onSelectColor,
  dominantOnly,
  onToggleDominantOnly,
  sortBy,
  onSelectSortBy,
  onResetAll,
  activeFiltersCount,
  counts,
  isMobile = false,
  onCloseMobile,
}: ExploreFilterPanelProps) {
  return (
    <div className="space-y-6 text-xs text-[#8E909B]">
      {/* Header with active count & reset */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#F4F4F6]">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-white/[0.1] text-[11px] font-mono text-white">
              {activeFiltersCount} active
            </span>
          )}
        </div>

        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={onResetAll}
            className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition px-2 py-1 rounded-md hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* 1. Sort Order */}
      <div className="space-y-2.5">
        <label className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400 block">
          Sort By
        </label>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSelectSortBy(e.target.value)}
            className="w-full py-2 px-3 appearance-none bg-[#13141C] text-xs text-[#F4F4F6] rounded-xl border border-white/[0.08] hover:border-white/20 focus:border-zinc-400 focus:outline-none transition cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id} className="bg-[#111217] text-white">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* 2. Orientation */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400 block">
            Orientation
          </label>
          {selectedOrientation !== "all" && (
            <button
              onClick={() => onSelectOrientation("all")}
              className="text-[10px] text-zinc-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {ORIENTATIONS.map((opt) => {
            const isSelected = selectedOrientation === opt.id;
            const count = counts.orientations[opt.id] ?? 0;

            const Icon =
              opt.id === "landscape"
                ? Monitor
                : opt.id === "portrait"
                ? Smartphone
                : opt.id === "square"
                ? Square
                : Sparkles;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelectOrientation(opt.id)}
                className={`flex items-center justify-between p-2 rounded-xl border text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 ${
                  isSelected
                    ? "bg-white/[0.1] border-white/40 text-white font-medium shadow-sm"
                    : "bg-[#13141C] border-white/[0.07] text-[#8E909B] hover:text-white hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{opt.label}</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 ml-1">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Categories (Nature, Anime, Minimal, Abstract, Architecture, Space, Cars, Animals, Gaming, Photography) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400 block">
            Categories
          </label>
          {selectedCategory !== "all" && (
            <button
              onClick={() => onSelectCategory("all")}
              className="text-[10px] text-zinc-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        <div className="max-h-56 overflow-y-auto pr-1 space-y-1 no-scrollbar">
          {EXPLORE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = counts.categories[cat.id] ?? 0;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 ${
                  isSelected
                    ? "bg-white/[0.1] text-white font-medium"
                    : "text-[#8E909B] hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? "bg-white" : "bg-white/20"
                    }`}
                  />
                  <span className="truncate">{cat.name}</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Resolution Filter (8K, 4K, QHD, Full HD, HD) based on actual available files */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400 block">
            Resolution
          </label>
          {selectedResolution !== "all" && (
            <button
              onClick={() => onSelectResolution("all")}
              className="text-[10px] text-zinc-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {RESOLUTIONS.map((res) => {
            const isSelected = selectedResolution === res.id;
            const count = counts.resolutions[res.id] ?? 0;

            return (
              <button
                key={res.id}
                type="button"
                onClick={() => onSelectResolution(res.id)}
                disabled={count === 0 && res.id !== "all"}
                className={`flex items-center justify-between p-2 rounded-xl border text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 ${
                  isSelected
                    ? "bg-white/[0.1] border-white/40 text-white font-medium shadow-sm"
                    : count === 0 && res.id !== "all"
                    ? "opacity-35 bg-[#13141C] border-white/[0.04] text-zinc-600 cursor-not-allowed"
                    : "bg-[#13141C] border-white/[0.07] text-[#8E909B] hover:text-white hover:border-white/20"
                }`}
              >
                <span className="font-mono text-xs truncate">{res.id}</span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Color Family & Dominant Color */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400 block">
            Color Palette
          </label>
          {selectedColor !== "all" && (
            <button
              onClick={() => onSelectColor("all")}
              className="text-[10px] text-zinc-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Color swatches */}
        <div className="grid grid-cols-6 gap-2">
          {COLOR_FAMILIES.map((color) => {
            const isSelected = selectedColor === color.id;
            const count = counts.colors[color.id] ?? 0;

            if (color.id === "all") {
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => onSelectColor(color.id)}
                  className={`h-7 rounded-lg border text-[10px] font-medium flex items-center justify-center transition col-span-2 ${
                    isSelected
                      ? "bg-white text-zinc-950 border-white font-bold"
                      : "bg-[#13141C] border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/20"
                  }`}
                  title="Any Color"
                >
                  All Colors
                </button>
              );
            }

            return (
              <button
                key={color.id}
                type="button"
                onClick={() => onSelectColor(color.id)}
                style={{ backgroundColor: color.hex }}
                className={`relative h-7 rounded-lg border transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 ${
                  color.border ? "border-white/30" : "border-transparent"
                } ${
                  isSelected
                    ? "ring-2 ring-white scale-110 shadow-lg"
                    : "opacity-85 hover:opacity-100"
                }`}
                title={`${color.name} (${count})`}
                aria-label={color.name}
              >
                {isSelected && (
                  <Check
                    className={`w-3.5 h-3.5 ${
                      color.id === "light" || color.id === "yellow"
                        ? "text-zinc-950"
                        : "text-white"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Dominant Color Mode Toggle */}
        {selectedColor !== "all" && (
          <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Dominant color only</span>
            <button
              type="button"
              onClick={onToggleDominantOnly}
              className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                dominantOnly ? "bg-white" : "bg-zinc-700"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-zinc-950 transition-transform ${
                  dominantOnly ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        )}
      </div>

      {/* Mobile-only Apply button */}
      {isMobile && onCloseMobile && (
        <div className="pt-4 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={onCloseMobile}
            className="w-full py-3 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition"
          >
            Apply Filters & View Results
          </button>
        </div>
      )}
    </div>
  );
}
