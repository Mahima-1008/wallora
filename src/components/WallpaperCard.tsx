"use client";

import React, { useState } from "react";
import { Heart, Download, Eye, Check } from "lucide-react";
import { Wallpaper } from "@/data/wallpapers";

import { useFavorites } from "@/context/FavoritesContext";
import { downloadWallpaper, getAvailableResolutions } from "@/lib/wallpaperUtils";

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onSelect: (wallpaper: Wallpaper) => void;
  onNotify?: (msg: string) => void;
}

export default function WallpaperCard({
  wallpaper,
  isFavorite: isFavoriteProp,
  onToggleFavorite,
  onSelect,
  onNotify,
}: WallpaperCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Centralized favorites context fallback
  const { isFavorite: checkFavorite, toggleFavorite: contextToggleFavorite } = useFavorites();
  const isFav = isFavoriteProp !== undefined ? isFavoriteProp : checkFavorite(wallpaper.id);

  // Trigger real file download using wallpaperUtils
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownloading(true);

    try {
      const versions = getAvailableResolutions(wallpaper);
      const targetVersion = versions.find((v) => v.isNative) || versions[0];
      await downloadWallpaper(wallpaper, targetVersion);

      setDownloadSuccess(true);
      onNotify?.(`Downloaded "${wallpaper.title}" (${targetVersion.dimensions})`);

      setTimeout(() => {
        setDownloadSuccess(false);
        setIsDownloading(false);
      }, 2000);
    } catch {
      setIsDownloading(false);
      onNotify?.(`Downloading "${wallpaper.title}"...`);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(wallpaper.id);
    } else {
      contextToggleFavorite(wallpaper.id);
    }
    const nextState = !isFav;
    onNotify?.(nextState ? `Saved "${wallpaper.title}" to Favorites` : `Removed "${wallpaper.title}" from Favorites`);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(wallpaper)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(wallpaper);
        }
      }}
      className="group flex flex-col text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded-2xl transition"
      aria-label={`View wallpaper ${wallpaper.title}`}
    >
      {/* Visual Image Container - Fixed Aspect Ratio prevents Layout Shifts */}
      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#13141C] border border-white/[0.07] group-hover:border-white/20 transition-all duration-300 shadow-sm group-hover:shadow-xl">
        <img
          src={wallpaper.thumbnailUrl || wallpaper.imageUrl}
          alt={wallpaper.title}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-104"
        />

        {/* Restrained Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-50 group-hover:opacity-75 transition-opacity duration-300 pointer-events-none" />

        {/* Top Left: Resolution & Orientation Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono font-medium text-zinc-300 border border-white/10">
            {wallpaper.resolution === "4K" ? "4K UHD" : `${wallpaper.dimensions.split(" ")[0]} px`}
          </span>
          {wallpaper.aspectRatio === "9:16" && (
            <span className="px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] text-zinc-400 border border-white/10">
              Mobile
            </span>
          )}
        </div>

        {/* Top Right: Favorite Action */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleFavoriteClick(e);
            }
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
            isFav
              ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 scale-105"
              : "bg-black/50 hover:bg-black/80 text-zinc-400 hover:text-white border border-white/10"
          }`}
          aria-label={isFav ? `Remove ${wallpaper.title} from favorites` : `Save ${wallpaper.title} to favorites`}
          aria-pressed={isFav}
          title={isFav ? "Remove from favorites" : "Save to favorites"}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-transform active:scale-125 ${
              isFav ? "fill-rose-400 text-rose-400" : ""
            }`}
          />
        </button>

        {/* Center Hover Action: Clear Preview & 1-Click Download */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 pointer-events-none group-hover:pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(wallpaper);
            }}
            className="px-3.5 py-2 rounded-full bg-black/75 hover:bg-black text-white text-xs font-medium backdrop-blur-md border border-white/20 shadow-lg flex items-center gap-1.5 transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-300" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className={`p-2 rounded-full backdrop-blur-md border text-xs shadow-lg transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
              downloadSuccess
                ? "bg-emerald-600/90 text-white border-emerald-400"
                : "bg-white/90 hover:bg-white text-zinc-950 border-white"
            }`}
            aria-label="Download wallpaper"
            title="Download"
          >
            {downloadSuccess ? (
              <Check className="w-3.5 h-3.5 text-white" />
            ) : isDownloading ? (
              <span className="w-3.5 h-3.5 block rounded-full border-2 border-zinc-950 border-t-transparent animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Wallpaper Metadata: Title and Category clearly visible */}
      <div className="mt-2.5 px-0.5 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-[#F4F4F6] truncate group-hover:text-white transition">
            {wallpaper.title}
          </h3>
          <p className="text-xs text-[#8E909B] capitalize mt-0.5">
            {wallpaper.category}
          </p>
        </div>

        <span className="text-[11px] font-mono text-zinc-400 shrink-0 mt-0.5">
          {wallpaper.dimensions.split(" x ")[0]}w
        </span>
      </div>
    </div>
  );
}
