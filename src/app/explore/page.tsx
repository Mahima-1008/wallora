"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  SlidersHorizontal,
  Search,
  X,
  ArrowUpDown,
  Filter,
  Monitor,
  Smartphone,
  Tv,
  LayoutGrid,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import CategoryBar from "@/components/CategoryBar";
import WallpaperCard from "@/components/WallpaperCard";
import WallpaperModal from "@/components/WallpaperModal";
import UploadModal from "@/components/UploadModal";
import AIEnhancerModal from "@/components/AIEnhancerModal";
import SettingsDrawer from "@/components/SettingsDrawer";
import FavoritesModal from "@/components/FavoritesModal";
import Footer from "@/components/Footer";
import { WALLPAPERS, Wallpaper } from "@/data/wallpapers";

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "all";
  const initialSort = searchParams.get("sort") || "trending";

  const [wallpapers, setWallpapers] = useState<Wallpaper[]>(WALLPAPERS);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [deviceFilter, setDeviceFilter] = useState<string>("all");
  const [resolutionFilter, setResolutionFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>(initialSort);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Settings
  const [defaultFormat, setDefaultFormat] = useState("PNG");
  const [autoPlayCarousel, setAutoPlayCarousel] = useState(true);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Load & persist favorites from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wallora_favorites");
      if (saved) {
        setFavorites(JSON.parse(saved));
      } else {
        const sampleFavs = ["wall-1", "wall-3", "wall-17"];
        setFavorites(sampleFavs);
        localStorage.setItem("wallora_favorites", JSON.stringify(sampleFavs));
      }
    } catch {
      // Ignore
    }
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("wallora_favorites", JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const clearAllFavorites = () => {
    setFavorites([]);
    try {
      localStorage.removeItem("wallora_favorites");
    } catch {
      // Ignore
    }
  };

  const handleAddWallpaper = (newWall: Wallpaper) => {
    setWallpapers((prev) => [newWall, ...prev]);
  };

  // Filtered Wallpapers
  const filteredWallpapers = useMemo(() => {
    let result = [...wallpapers];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          w.category.toLowerCase().includes(q) ||
          w.tags.some((t) => t.toLowerCase().includes(q)) ||
          w.aiPrompt.toLowerCase().includes(q) ||
          w.author.name.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((w) => w.category === selectedCategory);
    }

    if (deviceFilter !== "all") {
      result = result.filter((w) => w.deviceType === deviceFilter);
    }

    if (resolutionFilter !== "all") {
      if (resolutionFilter === "OLED") {
        result = result.filter((w) => w.tags.includes("OLED") || w.category === "dark");
      } else {
        result = result.filter((w) => w.resolution === resolutionFilter);
      }
    }

    if (sortBy === "trending") {
      result.sort((a, b) => b.views - a.views);
    } else if (sortBy === "downloads") {
      result.sort((a, b) => b.downloads - a.downloads);
    } else if (sortBy === "likes") {
      result.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === "newest") {
      result.sort((a, b) => (b.recentlyAdded ? 1 : 0) - (a.recentlyAdded ? 1 : 0));
    }

    return result;
  }, [wallpapers, searchQuery, selectedCategory, deviceFilter, resolutionFilter, sortBy]);

  const favoriteWallpapers = useMemo(() => {
    return wallpapers.filter((w) => favorites.includes(w.id));
  }, [wallpapers, favorites]);

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setDeviceFilter("all");
    setResolutionFilter("all");
    setSearchQuery("");
    setSortBy("trending");
  };

  const devices = [
    { id: "all", label: "All Devices", icon: LayoutGrid },
    { id: "desktop", label: "Desktop (16:9)", icon: Monitor },
    { id: "mobile", label: "Mobile (9:16)", icon: Smartphone },
    { id: "ultrawide", label: "Ultrawide (21:9)", icon: Tv },
  ];

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#EDEDED] flex flex-col font-sans">
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenAIStudio={() => setIsAIOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <div className="max-w-[1920px] mx-auto w-full px-4 sm:px-6 lg:px-8 flex-1 flex gap-6">
        <Sidebar
          favoritesCount={favorites.length}
          onOpenFavorites={() => setIsFavoritesOpen(true)}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAIStudio={() => setIsAIOpen(true)}
        />

        <main className="flex-1 min-w-0 py-6 pb-20">
          {/* Header Banner */}
          <div className="mb-6">
            <span className="text-[11px] font-bold tracking-[0.2em] text-amber-400 uppercase block mb-1">
              Infinite Discovery
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1
                  className="text-3xl sm:text-4xl font-normal tracking-tight text-white"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Explore AI Wallpapers
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Discover over 25+ pixel-perfect 8K & 4K wallpapers curated for desktop and mobile displays.
                </p>
              </div>

              <button
                onClick={() => setIsAIOpen(true)}
                className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/25 transition shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Launch AI Upscaler</span>
              </button>
            </div>
          </div>

          {/* Visual Category Chips */}
          <CategoryBar
            selectedCategory={selectedCategory}
            onSelectCategory={(catId) => setSelectedCategory(catId)}
          />

          {/* Secondary Filter & Control Bar */}
          <div className="w-full py-3 my-3 flex flex-wrap items-center justify-between gap-3 text-xs border-y border-white/[0.05]">
            {/* Device selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {devices.map((device) => {
                const Icon = device.icon;
                const isActive = deviceFilter === device.id;
                return (
                  <button
                    key={device.id}
                    onClick={() => setDeviceFilter(device.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shrink-0 font-medium transition ${
                      isActive
                        ? "bg-white text-zinc-950 font-semibold shadow-sm"
                        : "bg-[#131724] text-zinc-400 hover:text-white border border-white/[0.06] hover:border-white/15"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{device.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Resolution & Sorting */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 p-0.5 rounded-full bg-[#131724] border border-white/[0.06]">
                {[
                  { id: "all", label: "All" },
                  { id: "8K", label: "8K Ultra" },
                  { id: "4K", label: "4K UHD" },
                  { id: "OLED", label: "OLED Dark" },
                ].map((res) => (
                  <button
                    key={res.id}
                    onClick={() => setResolutionFilter(res.id)}
                    className={`px-2.5 py-1 rounded-full transition ${
                      resolutionFilter === res.id
                        ? "bg-[#1E2335] text-amber-300 font-semibold shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {res.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#131724] border border-white/[0.06] text-zinc-300">
                <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer pr-1"
                >
                  <option value="trending" className="bg-[#121624]">Trending</option>
                  <option value="downloads" className="bg-[#121624]">Most Downloaded</option>
                  <option value="likes" className="bg-[#121624]">Highest Rated</option>
                  <option value="newest" className="bg-[#121624]">Recently Added</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pl-1 text-zinc-400">
                <span className="font-mono text-[11px]">
                  {filteredWallpapers.length} wallpapers
                </span>

                {(deviceFilter !== "all" || resolutionFilter !== "all" || selectedCategory !== "all" || searchQuery) && (
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 transition"
                  >
                    <X className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          {filteredWallpapers.length === 0 ? (
            <div className="w-full py-20 flex flex-col items-center justify-center text-center rounded-3xl bg-[#111420] border border-white/[0.08] p-8 space-y-4">
              <div className="p-4 rounded-full bg-white/[0.04] text-zinc-500">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-white">No wallpapers found</h3>
              <p className="text-xs text-zinc-400 max-w-md">
                No wallpapers matched your active filters. Try searching for other tags or clear your filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-full bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
              {filteredWallpapers.map((wallpaper) => (
                <WallpaperCard
                  key={wallpaper.id}
                  wallpaper={wallpaper}
                  isFavorite={favorites.includes(wallpaper.id)}
                  onToggleFavorite={toggleFavorite}
                  onSelect={(w) => setSelectedWallpaper(w)}
                  onNotify={notify}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer onNotify={notify} />

      {/* Modals */}
      <WallpaperModal
        wallpaper={selectedWallpaper}
        allWallpapers={filteredWallpapers}
        isFavorite={selectedWallpaper ? favorites.includes(selectedWallpaper.id) : false}
        onToggleFavorite={toggleFavorite}
        onClose={() => setSelectedWallpaper(null)}
        onSelectWallpaper={(w) => setSelectedWallpaper(w)}
        onNotify={notify}
      />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddWallpaper={handleAddWallpaper}
        onNotify={notify}
      />

      <AIEnhancerModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        wallpapers={wallpapers}
        onNotify={notify}
      />

      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favoriteWallpapers={favoriteWallpapers}
        onToggleFavorite={toggleFavorite}
        onSelectWallpaper={(w) => {
          setIsFavoritesOpen(false);
          setSelectedWallpaper(w);
        }}
        onClearFavorites={clearAllFavorites}
        onNotify={notify}
      />

      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        defaultFormat={defaultFormat}
        setDefaultFormat={setDefaultFormat}
        autoPlayCarousel={autoPlayCarousel}
        setAutoPlayCarousel={setAutoPlayCarousel}
        onClearFavorites={clearAllFavorites}
        onNotify={notify}
      />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#141826]/95 border border-white/15 text-white text-xs font-medium shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-in slide-in-from-bottom-5">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#090A0F]" />}>
      <ExploreContent />
    </Suspense>
  );
}
