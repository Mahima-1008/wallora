"use client";

import React, { useRef } from "react";
import { LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIES } from "@/data/wallpapers";

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  showHeading?: boolean;
}

export default function CategoryBar({
  selectedCategory,
  onSelectCategory,
  showHeading = true,
}: CategoryBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const offset = direction === "left" ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section id="categories-section" className="relative w-full py-4 select-none group/scroll">
      {showHeading && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2
              className="text-xl sm:text-2xl font-normal text-[#F4F4F6] tracking-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Popular Categories
            </h2>
            <p className="text-xs text-[#8E909B] mt-0.5">
              Browse wallpapers curated by theme and aesthetic
            </p>
          </div>
        </div>
      )}

      {/* Relative wrapper for scroll buttons */}
      <div className="relative">
        {/* Scroll Left Button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-[#13141C]/90 border border-white/10 text-white shadow-lg opacity-0 group-hover/scroll:opacity-100 hover:bg-[#1A1C26] transition focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
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
                  className={`flex flex-col items-center justify-center shrink-0 w-24 sm:w-28 h-16 sm:h-18 rounded-2xl border transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 ${
                    isSelected
                      ? "bg-white/[0.1] border-white/40 text-white shadow-sm"
                      : "bg-[#13141C] border-white/[0.07] text-[#8E909B] hover:text-white hover:border-white/20"
                  }`}
                >
                  <LayoutGrid
                    className={`w-4 h-4 mb-1 transition-transform group-hover:scale-110 ${
                      isSelected ? "text-white" : "text-[#8E909B] group-hover:text-white"
                    }`}
                  />
                  <span className="text-xs font-medium tracking-wide">All</span>
                </button>
              );
            }

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="flex flex-col shrink-0 w-24 sm:w-28 group text-left cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded-2xl"
              >
                {/* Thumbnail Container */}
                <div
                  className={`relative w-full h-12 sm:h-14 rounded-xl overflow-hidden border transition-all duration-200 ${
                    isSelected
                      ? "border-white/50 ring-2 ring-white/20 scale-[1.02]"
                      : "border-white/[0.07] group-hover:border-white/25 group-hover:scale-[1.01]"
                  }`}
                >
                  {cat.thumbnail ? (
                    <img
                      src={cat.thumbnail}
                      alt={cat.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#181920]" />
                  )}
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />
                </div>

                {/* Category Name Label */}
                <span
                  className={`text-xs font-medium mt-1.5 transition-colors truncate w-full ${
                    isSelected ? "text-white font-semibold" : "text-[#8E909B] group-hover:text-zinc-200"
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
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-[#13141C]/90 border border-white/10 text-white shadow-lg opacity-0 group-hover/scroll:opacity-100 hover:bg-[#1A1C26] transition focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
          aria-label="Scroll categories right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
