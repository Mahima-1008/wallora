"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
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
          <h2
            className="text-xl sm:text-2xl font-normal text-[#F4F4F6] tracking-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Curated Collections
          </h2>
          <p className="text-xs text-[#8E909B] mt-0.5">
            Handpicked series grouped by aesthetic, theme, and atmosphere
          </p>
        </div>

        <Link
          href="/collections"
          className="text-xs font-medium text-zinc-400 hover:text-white flex items-center gap-1.5 group transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded-lg px-2 py-1"
        >
          <span>View All Collections</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CURATED_COLLECTIONS.map((col) => (
          <div
            key={col.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelectCollection(col)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectCollection(col);
              }
            }}
            className="group relative h-48 sm:h-52 rounded-2xl overflow-hidden cursor-pointer border border-white/[0.08] hover:border-white/25 transition-all duration-300 shadow-sm hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
          >
            {/* Background Cover */}
            <img
              src={col.coverImage}
              alt={col.title}
              loading="lazy"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Subtle Gradient Contrast Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10]/95 via-[#0B0C10]/40 to-transparent" />

            {/* Top Tag */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-medium text-zinc-300 border border-white/10">
              <Layers className="w-3 h-3 text-zinc-400" />
              <span>{col.wallpaperCount} Wallpapers</span>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-3 left-3.5 right-3.5">
              <h3
                className="text-base sm:text-lg font-medium text-[#F4F4F6] mb-1 drop-shadow-sm group-hover:text-white transition-colors"
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
          </div>
        ))}
      </div>
    </section>
  );
}
