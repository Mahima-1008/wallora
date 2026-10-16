"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Maximize2, Download } from "lucide-react";
import { Wallpaper } from "@/data/wallpapers";

interface HeroSectionProps {
  wallpapers: Wallpaper[];
  onSelectWallpaper: (wallpaper: Wallpaper) => void;
  onExploreClick: () => void;
  onTrendingClick: () => void;
}

export default function HeroSection({
  wallpapers,
  onSelectWallpaper,
  onExploreClick,
  onTrendingClick,
}: HeroSectionProps) {
  // Select top featured hero wallpapers
  const heroSlides = wallpapers.filter((w) => w.featured || w.imageUrl.includes("hero_sunset_room")).slice(0, 4);

  // If no slides, fallback to first 4
  const activeSlides = heroSlides.length > 0 ? heroSlides : wallpapers.slice(0, 4);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-advance slides every 6 seconds unless hovered
  useEffect(() => {
    if (isHovered || activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered, activeSlides.length]);

  const currentWallpaper = activeSlides[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  };

  return (
    <section className="relative w-full pt-4 pb-8 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Content Area */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6 pr-0 lg:pr-4">
          <div className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase">
              Wallpapers for Every Mood
            </span>
          </div>

          <h1
            className="text-4xl sm:text-5xl xl:text-6xl font-normal tracking-tight text-white leading-[1.12]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Beautiful Backgrounds <br />
            <span className="italic font-normal text-amber-100">for Your World</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-lg">
            Discover high-quality wallpapers for your desktop, laptop and mobile — curated and AI-enhanced daily.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onExploreClick}
              className="px-6 py-3 rounded-full bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 active:scale-95 transition-all flex items-center gap-2 shadow-[0_4px_25px_rgba(255,255,255,0.12)] group"
            >
              <span>Explore Wallpapers</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onTrendingClick}
              className="px-6 py-3 rounded-full bg-[#181C2A] hover:bg-[#202538] text-zinc-200 font-medium text-sm border border-white/10 transition-all active:scale-95"
            >
              Trending Now
            </button>
          </div>

          {/* Micro Feature Highlights */}
          <div className="pt-4 flex items-center gap-6 text-xs text-zinc-400 border-t border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>8K & 4K Ultra HD</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <span>Multi-Device Ratios</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>OLED Deep Blacks</span>
            </div>
          </div>
        </div>

        {/* Right Hero Showcase Slider (Matches the window sunset view in screenshot!) */}
        <div
          className="lg:col-span-7 relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            onClick={() => currentWallpaper && onSelectWallpaper(currentWallpaper)}
            className="relative w-full aspect-[16/9.5] sm:aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/[0.09] shadow-2xl bg-[#121624] cursor-pointer group/card"
          >
            {/* Main Image with smooth transition */}
            {currentWallpaper && (
              <img
                src={currentWallpaper.imageUrl}
                alt={currentWallpaper.title}
                className="w-full h-full object-cover object-center transition-all duration-700 group-hover/card:scale-105"
              />
            )}

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

            {/* Top Badges */}
            <div className="absolute top-4 left-4 sm:top-5 sm:left-5 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white border border-white/15 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Featured 8K
              </span>
              <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-[11px] font-mono text-zinc-300 border border-white/10">
                {currentWallpaper?.dimensions || "3840 x 2160"}
              </span>
            </div>

            {/* Hover Fullscreen Prompt */}
            <div className="absolute top-4 right-4 sm:top-5 sm:right-5 opacity-0 group-hover/card:opacity-100 transition-opacity">
              <span className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-xs font-medium text-white flex items-center gap-1.5 border border-white/20">
                <Maximize2 className="w-3.5 h-3.5" /> Fullscreen Preview
              </span>
            </div>

            {/* Bottom Wallpaper Details */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 max-w-md">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-300/90 block mb-1">
                {currentWallpaper?.category}
              </span>
              <h2
                className="text-lg sm:text-2xl font-semibold text-white tracking-tight drop-shadow-md"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {currentWallpaper?.title}
              </h2>
            </div>

            {/* Bottom Right Slider Controls (Matches `<` `>` and `---` indicators in reference screenshot!) */}
            <div
              className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-3 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Pagination lines */}
              <div className="flex items-center gap-1.5">
                {activeSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next buttons */}
              <div className="flex items-center gap-1.5 pl-2">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/15 transition active:scale-90"
                  aria-label="Previous featured wallpaper"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/15 transition active:scale-90"
                  aria-label="Next featured wallpaper"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
