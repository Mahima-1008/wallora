"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Heart,
  Sparkles,
  Trash2,
  Search,
  X,
  Compass,
  Layers,
  ChevronDown,
  Home,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WallpaperCard from "@/components/WallpaperCard";
import WallpaperModal from "@/components/WallpaperModal";
import { Wallpaper, CURATED_COLLECTIONS } from "@/data/wallpapers";
import { useFavorites } from "@/context/FavoritesContext";

type SortOption = "recent" | "title" | "downloads" | "category";

export default function FavoritesPageClient() {
  const {
    favorites,
    favoritesCount,
    favoriteWallpapers,
    toggleFavorite,
    removeFavorite,
    clearAllFavorites,
    isLoaded,
  } = useFavorites();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Derive categories present in user's saved favorites
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    favoriteWallpapers.forEach((w) => cats.add(w.category));
    return Array.from(cats);
  }, [favoriteWallpapers]);

  // Filter & Sort
  const processedWallpapers = useMemo(() => {
    let result = [...favoriteWallpapers];

    // Filter search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          w.category.toLowerCase().includes(q) ||
          w.tags.some((t) => t.toLowerCase().includes(q)) ||
          w.author.name.toLowerCase().includes(q)
      );
    }

    // Filter category
    if (selectedCategory !== "all") {
      result = result.filter((w) => w.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "downloads":
        result.sort((a, b) => b.downloads - a.downloads);
        break;
      case "category":
        result.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case "recent":
      default:
        // Reverse order of IDs in favorites array so latest favorited is first
        result.sort((a, b) => {
          const idxA = favorites.indexOf(a.id);
          const idxB = favorites.indexOf(b.id);
          return idxB - idxA;
        });
        break;
    }

    return result;
  }, [favoriteWallpapers, favorites, searchQuery, selectedCategory, sortBy]);

  const handleClearAll = () => {
    clearAllFavorites();
    setConfirmClearOpen(false);
    notify("Cleared all saved favorites");
  };

  return (
    <div className="min-h-screen bg-[#07090F] text-zinc-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar
        favoritesCount={favoritesCount}
        onOpenFavorites={() => {}}
      />

      {/* Breadcrumb Bar */}
      <div className="border-b border-white/[0.08] bg-[#0E101B]/80 backdrop-blur-md sticky top-16 z-30 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400 min-w-0">
            <Link href="/" className="hover:text-white transition flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-white font-medium">Favorites</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/explore"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-xs text-zinc-300 hover:text-white border border-white/10 transition"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Explore Wallpapers</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Heart className="w-4 h-4 fill-rose-500" />
              </span>
              <span
                suppressHydrationWarning
                className="px-2.5 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 text-xs font-mono font-medium border border-white/10"
              >
                {favoritesCount} {favoritesCount === 1 ? "Wallpaper" : "Wallpapers"}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-mono border border-emerald-500/20">
                Stored Locally
              </span>
            </div>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              My Saved Favorites
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">
              Your personalized collection of favorited wallpapers. Kept in sync across your browser tabs and saved locally on this device.
            </p>
          </div>

          {favoritesCount > 0 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmClearOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/25 transition active:scale-95"
                aria-label="Clear all favorited wallpapers"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Favorites</span>
              </button>
            </div>
          )}
        </div>

        {/* Informative Empty State */}
        {isLoaded && favoriteWallpapers.length === 0 ? (
          <div className="py-16 sm:py-24 text-center max-w-2xl mx-auto px-4">
            <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-3xl bg-gradient-to-b from-rose-500/20 to-rose-500/5 border border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.15)]">
              <Heart className="w-10 h-10 text-rose-400 fill-rose-500/30 animate-pulse" />
            </div>

            <h2
              className="text-2xl sm:text-3xl font-bold text-white mb-3"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              No favorites saved yet
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-8">
              Click the heart icon on any wallpaper card or in the full-resolution preview modal to save it here for quick access. Your favorites persist locally in your browser.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
              <Link
                href="/explore"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white text-zinc-950 font-bold text-xs hover:bg-zinc-200 transition shadow-lg flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>Explore All Wallpapers</span>
              </Link>
              <Link
                href="/collections"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white/[0.06] hover:bg-white/10 text-white font-semibold text-xs border border-white/10 transition flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Browse Curated Packs</span>
              </Link>
            </div>

            {/* Quick Suggestions: Curated Themes */}
            <div className="pt-8 border-t border-white/[0.08] text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-4 text-center">
                Or jump directly into a curated theme
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CURATED_COLLECTIONS.slice(0, 6).map((col) => (
                  <Link
                    key={col.id}
                    href={`/collections/${col.slug}`}
                    className="p-3 rounded-xl bg-[#0F1220] border border-white/[0.08] hover:border-amber-400/50 transition group flex flex-col justify-between"
                  >
                    <span className="text-xs font-semibold text-white group-hover:text-amber-300 transition truncate">
                      {col.title}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 mt-1">
                      {col.wallpaperCount} Wallpapers
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0D0F1C] border border-white/[0.08]">
              {/* Search input */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search in saved favorites..."
                  className="w-full pl-10 pr-9 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sorting and Category Selector */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Category Filter Pills */}
                {availableCategories.length > 1 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory("all")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        selectedCategory === "all"
                          ? "bg-white text-zinc-950 font-bold"
                          : "bg-white/[0.04] text-zinc-400 hover:text-white border border-white/10"
                      }`}
                    >
                      All ({favoriteWallpapers.length})
                    </button>
                    {availableCategories.map((cat) => {
                      const count = favoriteWallpapers.filter((w) => w.category === cat).length;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition capitalize shrink-0 ${
                            selectedCategory === cat
                              ? "bg-amber-400 text-zinc-950 font-bold shadow"
                              : "bg-white/[0.04] text-zinc-400 hover:text-white border border-white/10"
                          }`}
                        >
                          {cat} ({count})
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Sort Dropdown */}
                <div className="relative shrink-0">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-zinc-300 font-medium hover:text-white hover:border-white/20 focus:outline-none focus:border-amber-400 transition cursor-pointer"
                    aria-label="Sort favorites"
                  >
                    <option value="recent" className="bg-[#121624] text-white">
                      Recently Saved
                    </option>
                    <option value="title" className="bg-[#121624] text-white">
                      Title (A–Z)
                    </option>
                    <option value="downloads" className="bg-[#121624] text-white">
                      Most Downloaded
                    </option>
                    <option value="category" className="bg-[#121624] text-white">
                      Category
                    </option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Wallpapers Grid */}
            {processedWallpapers.length === 0 ? (
              <div className="py-16 text-center bg-[#0D0F1C] border border-white/[0.08] rounded-3xl p-8">
                <Search className="w-8 h-8 text-zinc-500 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-white mb-1">
                  No matching favorites found
                </h3>
                <p className="text-xs text-zinc-400 mb-4">
                  No wallpapers match the search &ldquo;{searchQuery}&rdquo; in category &ldquo;{selectedCategory}&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {processedWallpapers.map((wallpaper) => (
                  <WallpaperCard
                    key={wallpaper.id}
                    wallpaper={wallpaper}
                    isFavorite={true}
                    onToggleFavorite={() => {
                      removeFavorite(wallpaper.id);
                      notify(`Removed "${wallpaper.title}" from favorites`);
                    }}
                    onSelect={(w) => setSelectedWallpaper(w)}
                    onNotify={notify}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Confirmation Modal for Clearing All */}
      {confirmClearOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-fav-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
        >
          <div className="bg-[#121626] border border-white/15 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 id="clear-fav-title" className="text-base font-bold text-white">
                  Clear all favorites?
                </h3>
                <p className="text-xs text-zinc-400">
                  This will remove all {favoritesCount} saved wallpapers from this device.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmClearOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md transition"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wallpaper Modal Preview */}
      <WallpaperModal
        wallpaper={selectedWallpaper}
        allWallpapers={processedWallpapers}
        isFavorite={selectedWallpaper ? favorites.includes(selectedWallpaper.id) : false}
        onToggleFavorite={(id) => toggleFavorite(id)}
        onClose={() => setSelectedWallpaper(null)}
        onSelectWallpaper={(w) => setSelectedWallpaper(w)}
        onNotify={notify}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161928] text-white border border-white/20 px-4 py-2.5 rounded-2xl shadow-2xl text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Footer onNotify={notify} />
    </div>
  );
}
