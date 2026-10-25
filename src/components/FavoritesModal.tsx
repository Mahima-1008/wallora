"use client";

import React from "react";
import Link from "next/link";
import { X, Heart, Trash2, ExternalLink } from "lucide-react";
import { Wallpaper } from "@/data/wallpapers";
import WallpaperCard from "./WallpaperCard";

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteWallpapers: Wallpaper[];
  onToggleFavorite: (id: string) => void;
  onSelectWallpaper: (w: Wallpaper) => void;
  onClearFavorites: () => void;
  onNotify: (msg: string) => void;
}

export default function FavoritesModal({
  isOpen,
  onClose,
  favoriteWallpapers,
  onToggleFavorite,
  onSelectWallpaper,
  onClearFavorites,
  onNotify,
}: FavoritesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-5xl h-[85vh] p-6 rounded-3xl bg-[#121624] border border-white/10 shadow-2xl z-10 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h2
                className="text-xl sm:text-2xl font-bold text-white tracking-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Saved Favorites
              </h2>
              <span className="text-xs text-zinc-400">
                {favoriteWallpapers.length} {favoriteWallpapers.length === 1 ? "wallpaper" : "wallpapers"} saved
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/favorites"
              onClick={onClose}
              className="text-xs text-zinc-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/10 border border-white/10 transition"
              title="Open full dedicated favorites page"
            >
              <span>Full Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {favoriteWallpapers.length > 0 && (
              <button
                onClick={() => {
                  if (confirm("Clear all favorited wallpapers?")) {
                    onClearFavorites();
                    onNotify("All favorites cleared");
                  }
                }}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-6">
          {favoriteWallpapers.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
              <div className="p-4 rounded-full bg-white/[0.04] text-zinc-500">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-white">No favorites saved yet</h3>
              <p className="text-xs text-zinc-400 max-w-sm">
                Click the heart icon on any wallpaper card or in the preview modal to build your personal collection.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 rounded-full bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition"
              >
                Explore Wallpapers
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteWallpapers.map((wallpaper) => (
                <WallpaperCard
                  key={wallpaper.id}
                  wallpaper={wallpaper}
                  isFavorite={true}
                  onToggleFavorite={onToggleFavorite}
                  onSelect={onSelectWallpaper}
                  onNotify={onNotify}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
