"use client";

import React from "react";
import { ArrowRight, Layers, Sparkles } from "lucide-react";
import { CURATED_COLLECTIONS, CollectionItem } from "@/data/wallpapers";

interface CuratedCollectionsProps {
  onSelectCollection: (collection: CollectionItem) => void;
}

export default function CuratedCollections({
  onSelectCollection,
}: CuratedCollectionsProps) {
  return (
    <section id="collections-section" className="w-full py-8 select-none">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-400 uppercase block mb-1">
            Curated Themes
          </span>
          <h2
            className="text-2xl sm:text-3xl font-semibold text-white tracking-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Featured Collections
          </h2>
        </div>

        <button
          onClick={() => {
            const el = document.getElementById("wallpapers-section");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          className="text-xs font-medium text-zinc-400 hover:text-white flex items-center gap-1 group transition"
        >
          <span>Explore All Packs</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CURATED_COLLECTIONS.map((col) => (
          <div
            key={col.id}
            onClick={() => onSelectCollection(col)}
            className="group relative h-48 sm:h-52 rounded-2xl overflow-hidden cursor-pointer border border-white/[0.08] hover:border-amber-400/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1"
          >
            {/* Background Cover */}
            <img
              src={col.coverImage}
              alt={col.title}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
            />

            {/* Gradient Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Top Tag */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-medium text-zinc-300 border border-white/10">
              <Layers className="w-3 h-3 text-amber-400" />
              <span>{col.wallpaperCount} Wallpapers</span>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-3 left-3 right-3">
              <h3
                className="text-base sm:text-lg font-bold text-white mb-1 drop-shadow-md group-hover:text-amber-200 transition-colors"
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
                    className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 backdrop-blur-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
