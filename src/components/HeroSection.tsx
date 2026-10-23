"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Maximize2 } from "lucide-react";
import { Wallpaper } from "@/data/wallpapers";

interface HeroSectionProps {
  wallpapers: Wallpaper[];
  onSelectWallpaper: (wallpaper: Wallpaper) => void;
  onExploreClick?: () => void;
  onBrowseCollectionsClick?: () => void;
}

export default function HeroSection({
  wallpapers,
  onSelectWallpaper,
  onExploreClick,
  onBrowseCollectionsClick,
}: HeroSectionProps) {
  // Select top landscape featured wallpaper (Alpine Mirror Lake & Peak)
  const featured =
    wallpapers.find((w) => w.imageUrl.includes("mountain_lake")) ||
    wallpapers.find((w) => w.featured && w.aspectRatio === "16:9") ||
    wallpapers[0];

  const handleExplore = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      document.getElementById("explore-all-section")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBrowseCollections = () => {
    if (onBrowseCollectionsClick) {
      onBrowseCollectionsClick();
    } else {
      const el = document.getElementById("collections-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section className="relative w-full pt-2 pb-6 select-none">
      <div className="relative w-full min-h-[460px] sm:min-h-[500px] md:min-h-[540px] rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl bg-[#111217] flex items-end">
        {/* Featured Landscape Wallpaper Background */}
        {featured && (
          <img
            src={featured.imageUrl}
            alt={featured.title}
            className="absolute inset-0 w-full h-full object-cover object-center scale-[1.01] transition-transform duration-1000 ease-out"
          />
        )}

        {/* Directional Contrast Gradient: Keeps typography crisp and readable while preserving landscape clarity */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/65 to-black/25 md:bg-gradient-to-r md:from-[#0B0C10]/90 md:via-[#0B0C10]/55 md:to-transparent pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 w-full p-6 sm:p-10 md:p-14 max-w-2xl flex flex-col justify-end">
          {/* Subtle Category / Meta tag */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-zinc-400">
              Featured Wallpaper • {featured?.resolution || "8K"}
            </span>
          </div>

          {/* Clean, Impactful Headline */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-normal text-[#F4F4F6] tracking-tight leading-[1.08] drop-shadow-sm"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            A better view, <br />
            <span className="italic text-zinc-200">every day.</span>
          </h1>

          {/* Concise Subtitle */}
          <p className="mt-3.5 text-sm sm:text-base text-zinc-300 leading-relaxed max-w-lg">
            Curated ultra-high-resolution wallpapers crafted for desktops, laptops, and mobile screens.
          </p>

          {/* Functional Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-6">
            <Link
              href="/explore"
              className="px-6 py-3 rounded-full bg-[#F4F4F6] text-[#0B0C10] font-medium text-sm hover:bg-white active:scale-95 transition-all flex items-center gap-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 group"
            >
              <span>Explore Wallpapers</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/collections"
              className="px-6 py-3 rounded-full bg-black/40 hover:bg-black/60 text-[#F4F4F6] font-medium text-sm border border-white/20 backdrop-blur-md transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              Browse Collections
            </Link>
          </div>
        </div>

        {/* Bottom Right: Clean Wallpaper Attribution & Preview Action */}
        {featured && (
          <div className="absolute top-4 right-4 sm:top-auto sm:bottom-6 sm:right-6 z-10">
            <button
              onClick={() => onSelectWallpaper(featured)}
              className="group/badge flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-md text-xs text-zinc-300 hover:text-white border border-white/15 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
              title="View featured wallpaper details"
            >
              <Maximize2 className="w-3.5 h-3.5 text-zinc-400 group-hover/badge:text-white transition" />
              <span className="font-medium hidden sm:inline">{featured.title}</span>
              <span className="text-[11px] font-mono text-zinc-400">{featured.resolution}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
