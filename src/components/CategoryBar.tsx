"use client";

import React, { useRef } from "react";
import { LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIES, CategoryItem } from "@/data/wallpapers";

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export default function CategoryBar({
  selectedCategory,
  onSelectCategory,
}: CategoryBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const offset = direction === "left" ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div id="categories-section" className="relative w-full py-4 select-none group/scroll">
      {/* Scroll Left Button */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-[#121624]/90 border border-white/10 text-white shadow-xl opacity-0 group-hover/scroll:opacity-100 hover:bg-[#1a1f33] transition"
        aria-label="Scroll categories left"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Categories Row */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1"
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          if (cat.isAll) {
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex flex-col items-center justify-center shrink-0 w-20 sm:w-22 h-14 sm:h-16 rounded-2xl border transition-all duration-200 group ${
                  isSelected
                    ? "bg-[#1E2333] border-amber-400/80 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                    : "bg-[#121624] border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/20"
                }`}
              >
                <LayoutGrid
                  className={`w-5 h-5 mb-1 transition-transform group-hover:scale-110 ${
                    isSelected ? "text-amber-400" : "text-zinc-400 group-hover:text-white"
                  }`}
                />
                <span className="text-[11px] font-medium tracking-wide">All</span>
              </button>
            );
          }

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex flex-col items-center shrink-0 w-20 sm:w-22 group text-left cursor-pointer transition-all duration-200`}
            >
              {/* Thumbnail Container */}
              <div
                className={`relative w-full h-11 sm:h-12 rounded-xl sm:rounded-2xl overflow-hidden border transition-all duration-200 ${
                  isSelected
                    ? "border-amber-400 ring-2 ring-amber-400/30 scale-105 shadow-[0_4px_16px_rgba(245,158,11,0.25)]"
                    : "border-white/[0.08] group-hover:border-white/30 group-hover:scale-102"
                }`}
              >
                {cat.thumbnail ? (
                  <img
                    src={cat.thumbnail}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-[#181C2B]" />
                )}
                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
              </div>

              {/* Category Name Label */}
              <span
                className={`text-[11px] font-medium mt-1.5 transition-colors ${
                  isSelected ? "text-amber-300 font-semibold" : "text-zinc-400 group-hover:text-zinc-200"
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Scroll Right Button */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-[#121624]/90 border border-white/10 text-white shadow-xl opacity-0 group-hover/scroll:opacity-100 hover:bg-[#1a1f33] transition"
        aria-label="Scroll categories right"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
