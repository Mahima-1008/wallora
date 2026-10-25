"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Layers, Sparkles } from "lucide-react";
import { CURATED_COLLECTIONS, CollectionItem } from "@/data/wallpapers";

interface CuratedCollectionsProps {
  onSelectCollection?: (collection: CollectionItem) => void;
}

export default function CuratedCollections({
  onSelectCollection,
}: CuratedCollectionsProps) {
  return (
    <section id="collections-section" className="w-full py-8 select-none">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-amber-400 uppercase block mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            <span>Curated Thematic Packs</span>
          </span>
          <h2
            className="text-xl sm:text-2xl font-normal text-[#F4F4F6] tracking-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Curated Collections
          </h2>
          <p className="text-xs text-[#8E909B] mt-0.5">
            Handcrafted series grouped by aesthetic, theme, and atmosphere
          </p>
        </div>

        <Link
          href="/collections"
          className="text-xs font-medium text-zinc-400 hover:text-white flex items-center gap-1.5 group transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded-lg px-2.5 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06]"
        >
          <span>View All ({CURATED_COLLECTIONS.length})</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CURATED_COLLECTIONS.map((col) => {
          const actualCount = col.wallpaperIds.length;
          return (
            <Link
              key={col.id}
              href={`/collections/${col.slug}`}
              onClick={() => {
                if (onSelectCollection) {
                  onSelectCollection(col);
                }
              }}
              className="group relative aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer border border-white/[0.08] hover:border-amber-400/50 transition-all duration-300 shadow-sm hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 flex flex-col justify-between p-4"
            >
              {/* Background Cover */}
              <img
                src={col.coverImage}
                alt={col.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Gradient Contrast Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F]/95 via-[#090A0F]/50 to-black/25" />

              {/* Top Tag */}
              <div className="relative z-10 flex items-center justify-between w-full">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-medium text-zinc-300 border border-white/10">
                  <Layers className="w-3 h-3 text-amber-400" />
                  <span>
                    {actualCount} {actualCount === 1 ? "Wallpaper" : "Wallpapers"}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 backdrop-blur-md text-[9px] font-bold text-amber-300 border border-amber-500/30">
                  Curated
                </span>
              </div>

              {/* Bottom Content */}
              <div className="relative z-10">
                <h3
                  className="text-base sm:text-lg font-medium text-[#F4F4F6] mb-1 drop-shadow-sm group-hover:text-amber-200 transition-colors"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {col.title}
                </h3>
                <p className="text-[11px] text-zinc-300 line-clamp-2 leading-relaxed">
                  {col.subtitle}
                </p>

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {col.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] px-2 py-0.5 rounded-md bg-white/[0.08] text-zinc-300 backdrop-blur-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
