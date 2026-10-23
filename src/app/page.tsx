"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, AlertCircle, Compass, Search, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryBar from "@/components/CategoryBar";
import WallpaperCard from "@/components/WallpaperCard";
import CuratedCollections from "@/components/CuratedCollections";
import WallpaperModal from "@/components/WallpaperModal";
import UploadModal from "@/components/UploadModal";
import AIEnhancerModal from "@/components/AIEnhancerModal";
import SettingsDrawer from "@/components/SettingsDrawer";
import FavoritesModal from "@/components/FavoritesModal";
import Footer from "@/components/Footer";
import {
  WALLPAPERS,
  Wallpaper,
  CollectionItem,
} from "@/data/wallpapers";

export default function HomePage() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>(WALLPAPERS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [deviceFilter, setDeviceFilter] = useState<string>("all");
  const [resolutionFilter, setResolutionFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
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
        const initialFavs = ["wall-1", "wall-3", "wall-7"];
        setFavorites(initialFavs);
        localStorage.setItem("wallora_favorites", JSON.stringify(initialFavs));
      }
    } catch {
      // Ignore storage errors
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

  // Section 3: Trending This Week (Top 8 trending wallpapers)
  const trendingList = useMemo(() => {
    return wallpapers.filter((w) => w.trending).slice(0, 8);
  }, [wallpapers]);

  // Section 4: Recently Added (Top 8 recently added wallpapers)
  const recentlyAddedList = useMemo(() => {
    return wallpapers.filter((w) => w.recentlyAdded).slice(0, 8);
  }, [wallpapers]);

  // Section 6: Explore All Wallpapers (Filtered or all)
  const filteredExploreWallpapers = useMemo(() => {
    let result = [...wallpapers];

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

    return result;
  }, [wallpapers, searchQuery, selectedCategory, deviceFilter, resolutionFilter]);

  const favoriteWallpapers = useMemo(() => {
    return wallpapers.filter((w) => favorites.includes(w.id));
  }, [wallpapers, favorites]);

  const handleResetExploreFilters = () => {
    setSelectedCategory("all");
    setDeviceFilter("all");
    setResolutionFilter("all");
    setSearchQuery("");
  };

  const handleSelectCollection = (col: CollectionItem) => {
    const matchTag = col.tags[0].toLowerCase();
    setSearchQuery(matchTag);
    notify(`Filtered by "${col.title}"`);
    document.getElementById("explore-all-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "all" ||
    deviceFilter !== "all" ||
    resolutionFilter !== "all";

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F4F4F6] flex flex-col font-sans selection:bg-white/20 selection:text-white">
      {/* 1. Simplify Navigation: Compact, Clean Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenAIStudio={() => setIsAIOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 space-y-12 flex-1">
        {/* SECTION 1: Featured Wallpaper (Hero Section) */}
        <HeroSection
          wallpapers={wallpapers}
          onSelectWallpaper={(w) => setSelectedWallpaper(w)}
          onExploreClick={() => {
            document.getElementById("explore-all-section")?.scrollIntoView({ behavior: "smooth" });
          }}
          onBrowseCollectionsClick={() => {
            document.getElementById("collections-section")?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* SECTION 2: Popular Categories */}
        <CategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => {
            setSelectedCategory(catId);
            if (catId !== "all") {
              document.getElementById("explore-all-section")?.scrollIntoView({ behavior: "smooth" });
            }
          }}
        />

        {/* SECTION 3: Trending This Week */}
        <section id="trending-section" className="w-full pt-2 select-none">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2
                className="text-xl sm:text-2xl font-normal text-[#F4F4F6] tracking-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Trending This Week
              </h2>
              <p className="text-xs text-[#8E909B] mt-0.5">
                Most viewed and downloaded by the community
              </p>
            </div>
            <Link
              href="/explore?sort=trending"
              className="text-xs font-medium text-zinc-400 hover:text-white flex items-center gap-1.5 group transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded-lg px-2 py-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Consistent Grid: 4 columns on large screens, elegant spacing, no layout shifts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {trendingList.map((wallpaper) => (
              <WallpaperCard
                key={`trending-${wallpaper.id}`}
                wallpaper={wallpaper}
                isFavorite={favorites.includes(wallpaper.id)}
                onToggleFavorite={toggleFavorite}
                onSelect={(w) => setSelectedWallpaper(w)}
                onNotify={notify}
              />
            ))}
          </div>
        </section>

        {/* SECTION 4: Recently Added */}
        <section id="recent-section" className="w-full pt-2 select-none">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2
                className="text-xl sm:text-2xl font-normal text-[#F4F4F6] tracking-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Recently Added
              </h2>
              <p className="text-xs text-[#8E909B] mt-0.5">
                Fresh additions rendered in ultra-high resolution
              </p>
            </div>
            <Link
              href="/explore?sort=newest"
              className="text-xs font-medium text-zinc-400 hover:text-white flex items-center gap-1.5 group transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded-lg px-2 py-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {recentlyAddedList.map((wallpaper) => (
              <WallpaperCard
                key={`recent-${wallpaper.id}`}
                wallpaper={wallpaper}
                isFavorite={favorites.includes(wallpaper.id)}
                onToggleFavorite={toggleFavorite}
                onSelect={(w) => setSelectedWallpaper(w)}
                onNotify={notify}
              />
            ))}
          </div>
        </section>

        {/* SECTION 5: Curated Collections */}
        <CuratedCollections onSelectCollection={handleSelectCollection} />

        {/* SECTION 6: A small "Explore all wallpapers" section */}
        <section id="explore-all-section" className="w-full pt-6 pb-8 select-none border-t border-white/[0.07]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h2
                className="text-xl sm:text-2xl font-normal text-[#F4F4F6] tracking-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Explore All Wallpapers
              </h2>
              <p className="text-xs text-[#8E909B] mt-0.5">
                Search, filter by device and resolution, or browse our complete catalog of {wallpapers.length} wallpapers
              </p>
            </div>

            {/* Quick Filter Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-full bg-[#13141C] border border-white/[0.08] p-1 text-xs">
                {["all", "desktop", "phone"].map((dev) => (
                  <button
                    key={dev}
                    onClick={() => setDeviceFilter(dev)}
                    className={`px-3 py-1 rounded-full transition capitalize ${
                      deviceFilter === dev
                        ? "bg-white/[0.12] text-white font-medium"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {dev === "all" ? "All Devices" : dev}
                  </button>
                ))}
              </div>

              <div className="inline-flex rounded-full bg-[#13141C] border border-white/[0.08] p-1 text-xs">
                {["all", "8K", "4K"].map((res) => (
                  <button
                    key={res}
                    onClick={() => setResolutionFilter(res)}
                    className={`px-3 py-1 rounded-full transition uppercase ${
                      resolutionFilter === res
                        ? "bg-white/[0.12] text-white font-medium"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {res === "all" ? "All Res" : res}
                  </button>
                ))}
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleResetExploreFilters}
                  className="text-xs text-zinc-400 hover:text-white underline px-2 py-1 transition"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Active Filter Indicator */}
          {hasActiveFilters && (
            <div className="mb-4 flex items-center justify-between text-xs text-zinc-400 bg-[#13141C] px-3.5 py-2 rounded-xl border border-white/[0.06]">
              <span>
                Showing {filteredExploreWallpapers.length} matching wallpapers
                {selectedCategory !== "all" && ` in ${selectedCategory}`}
                {searchQuery && ` for "${searchQuery}"`}
              </span>
              <button
                onClick={handleResetExploreFilters}
                className="text-zinc-300 hover:text-white flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear filters</span>
              </button>
            </div>
          )}

          {/* Wallpapers Grid or Empty State */}
          {filteredExploreWallpapers.length === 0 ? (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center rounded-2xl bg-[#13141C] border border-white/[0.07] p-8 space-y-3">
              <div className="p-3.5 rounded-full bg-white/[0.04] text-zinc-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-medium text-white">No wallpapers found</h3>
              <p className="text-xs text-[#8E909B] max-w-sm">
                No wallpapers matched your search or filters. Try adjusting keywords or resetting filters.
              </p>
              <button
                onClick={handleResetExploreFilters}
                className="mt-2 px-4 py-2 rounded-full bg-white text-zinc-950 font-medium text-xs hover:bg-zinc-200 transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredExploreWallpapers
                .slice(0, hasActiveFilters ? filteredExploreWallpapers.length : 8)
                .map((wallpaper) => (
                  <WallpaperCard
                    key={`explore-${wallpaper.id}`}
                    wallpaper={wallpaper}
                    isFavorite={favorites.includes(wallpaper.id)}
                    onToggleFavorite={toggleFavorite}
                    onSelect={(w) => setSelectedWallpaper(w)}
                    onNotify={notify}
                  />
                ))}
            </div>
          )}

          {/* Explore Page Link Banner */}
          {!hasActiveFilters && (
            <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-[#13141C] border border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <h3 className="text-base sm:text-lg font-medium text-[#F4F4F6]">
                  Looking for more wallpapers?
                </h3>
                <p className="text-xs text-[#8E909B] mt-0.5">
                  Browse our dedicated Explore catalog with comprehensive device ratios, sorting, and tag filters.
                </p>
              </div>

              <Link
                href="/explore"
                className="px-6 py-2.5 rounded-full bg-[#F4F4F6] text-[#0B0C10] font-medium text-xs hover:bg-white active:scale-95 transition-all flex items-center gap-2 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
              >
                <span>Browse Full Explore Catalog</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <Footer onNotify={notify} />

      {/* Fullscreen Wallpaper Preview & Studio Modal */}
      <WallpaperModal
        wallpaper={selectedWallpaper}
        allWallpapers={wallpapers}
        isFavorite={selectedWallpaper ? favorites.includes(selectedWallpaper.id) : false}
        onToggleFavorite={toggleFavorite}
        onClose={() => setSelectedWallpaper(null)}
        onSelectWallpaper={(w) => setSelectedWallpaper(w)}
        onNotify={notify}
      />

      {/* Upload Custom Wallpaper Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddWallpaper={handleAddWallpaper}
        onNotify={notify}
      />

      {/* AI Enhancer / Studio Modal */}
      <AIEnhancerModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        wallpapers={wallpapers}
        onNotify={notify}
      />

      {/* Favorites Modal */}
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

      {/* Settings Drawer */}
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

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#14161F]/95 border border-white/15 text-white text-xs font-medium shadow-xl backdrop-blur-xl animate-in slide-in-from-bottom-5">
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
