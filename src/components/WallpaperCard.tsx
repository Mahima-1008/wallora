"use client";

import React, { useState } from "react";
import { Heart, Download, Eye, Sparkles, Check, Share2 } from "lucide-react";
import confetti from "canvas-confetti";
import { Wallpaper } from "@/data/wallpapers";

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect: (wallpaper: Wallpaper) => void;
  onNotify: (msg: string) => void;
}

export default function WallpaperCard({
  wallpaper,
  isFavorite,
  onToggleFavorite,
  onSelect,
  onNotify,
}: WallpaperCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Trigger real file download
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownloading(true);

    try {
      // Create download trigger
      const response = await fetch(wallpaper.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const cleanTitle = wallpaper.title.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
      link.download = `wallora-${cleanTitle}-${wallpaper.resolution.toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Trigger Confetti
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#F59E0B", "#FBBF24", "#38BDF8", "#FFFFFF"],
      });

      setDownloadSuccess(true);
      onNotify(`Downloaded "${wallpaper.title}" in ${wallpaper.resolution}!`);

      setTimeout(() => {
        setDownloadSuccess(false);
        setIsDownloading(false);
      }, 2000);
    } catch {
      // Fallback direct link download
      const link = document.createElement("a");
      link.href = wallpaper.imageUrl;
      link.download = `${wallpaper.title}.jpg`;
      link.target = "_blank";
      link.click();
      setIsDownloading(false);
      onNotify(`Downloading "${wallpaper.title}"...`);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(wallpaper.id);
    if (!isFavorite) {
      onNotify(`Added "${wallpaper.title}" to Favorites`);
    } else {
      onNotify(`Removed "${wallpaper.title}" from Favorites`);
    }
  };

  const isPortrait = wallpaper.aspectRatio === "9:16";

  return (
    <div
      onClick={() => onSelect(wallpaper)}
      className={`group relative rounded-2xl overflow-hidden bg-[#121624] border border-white/[0.07] hover:border-white/20 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1 ${
        isPortrait ? "aspect-[9/16]" : "aspect-[16/10] sm:aspect-[16/9.5]"
      }`}
    >
      {/* Background Image */}
      <img
        src={wallpaper.thumbnailUrl || wallpaper.imageUrl}
        alt={wallpaper.title}
        loading="lazy"
        className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-108"
      />

      {/* Dark Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/30 opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

      {/* Top Left: AI Sparkle Tag */}
      {wallpaper.resolution === "8K" && (
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-amber-500/30">
          <Sparkles className="w-2.5 h-2.5" />
          <span>8K AI</span>
        </div>
      )}

      {/* Top Right: Favorite Button (Matches screenshot!) */}
      <button
        onClick={handleFavoriteClick}
        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
          isFavorite
            ? "bg-rose-500/20 text-rose-500 border border-rose-500/40 scale-110"
            : "bg-black/40 hover:bg-black/70 text-white/80 hover:text-white border border-white/10"
        }`}
        aria-label="Save to favorites"
      >
        <Heart
          className={`w-4 h-4 transition-transform active:scale-125 ${
            isFavorite ? "fill-rose-500" : ""
          }`}
        />
      </button>

      {/* Center Hover Action: Preview & Download */}
      <div className="absolute inset-0 flex items-center justify-center gap-2.5 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 pointer-events-none group-hover:pointer-events-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(wallpaper);
          }}
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xl text-white border border-white/25 shadow-xl transition-all duration-150 active:scale-90"
          title="Fullscreen Studio Preview"
        >
          <Eye className="w-4 h-4" />
        </button>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`px-4 py-2.5 rounded-full backdrop-blur-xl font-medium text-xs shadow-xl flex items-center gap-2 border transition-all duration-150 active:scale-95 ${
            downloadSuccess
              ? "bg-emerald-500 text-white border-emerald-400"
              : "bg-white text-zinc-950 hover:bg-zinc-200 border-white"
          }`}
          title="Instant 1-Click Download"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Saved!</span>
            </>
          ) : isDownloading ? (
            <>
              <span className="w-3 h-3 rounded-full border-2 border-black border-t-transparent animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </>
          )}
        </button>
      </div>

      {/* Bottom Left Badges: "4K" and "3840 x 2160" (Exact match to screenshot!) */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 tracking-wider">
            {wallpaper.resolution}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md text-[10px] font-mono text-zinc-300 border border-white/10">
            {wallpaper.dimensions}
          </span>
        </div>

        {/* Device Aspect Indicator on Hover */}
        <span className="text-[10px] text-zinc-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
          {wallpaper.aspectRatio}
        </span>
      </div>

      {/* Wallpaper Title on Bottom (Fades in on hover) */}
      <div className="absolute bottom-9 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
        <p className="text-xs font-semibold text-white truncate drop-shadow-md">
          {wallpaper.title}
        </p>
      </div>
    </div>
  );
}
