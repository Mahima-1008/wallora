"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ArrowRight, Sparkles, Filter, AlertCircle, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import HeroSection from "@/components/HeroSection";
import CategoryBar from "@/components/CategoryBar";
import FilterBar from "@/components/FilterBar";
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
  CategoryItem,
} from "@/data/wallpapers";

export default function HomePage() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>(WALLPAPERS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [deviceFilter, setDeviceFilter] = useState<string>("all");
  const [resolutionFilter, setResolutionFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("trending");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [activeNav, setActiveNav] = useState<string>("home");

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
        // Initial sample favorites
        const sampleFavs = ["wall-1", "wall-3", "wall-7"];
        setFavorites(sampleFavs);
        localStorage.setItem("wallora_favorites", JSON.stringify(sampleFavs));
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
        // Ignore storage errors
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

    // Search query
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

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((w) => w.category === selectedCategory);
    }

    // Device filter
    if (deviceFilter !== "all") {
      result = result.filter((w) => w.deviceType === deviceFilter);
    }

    // Resolution filter
    if (resolutionFilter !== "all") {
      if (resolutionFilter === "OLED") {
        result = result.filter((w) => w.tags.includes("OLED") || w.category === "dark");
      } else {
        result = result.filter((w) => w.resolution === resolutionFilter);
      }
    }

    // Sorting
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

  // Section specific arrays
  const trendingList = useMemo(() => {
    return wallpapers.filter((w) => w.trending).slice(0, 6);
  }, [wallpapers]);

  const recentlyAddedList = useMemo(() => {
    return wallpapers.filter((w) => w.recentlyAdded).slice(0, 6);
  }, [wallpapers]);

  const favoriteWallpapers = useMemo(() => {
    return wallpapers.filter((w) => favorites.includes(w.id));
  }, [wallpapers, favorites]);

  // Filter reset
  const handleResetFilters = () => {
    setSelectedCategory("all");
    setDeviceFilter("all");
    setResolutionFilter("all");
    setSearchQuery("");
    setSortBy("trending");
  };

  const handleSelectCollection = (col: CollectionItem) => {
    const matchTag = col.tags[0].toLowerCase();
    setSearchQuery(matchTag);
    notify(`Filtered by "${col.title}"`);
    document.getElementById("wallpapers-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#EDEDED] flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenAIStudio={() => setIsAIOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />

      {/* Main Layout Area: Left Sidebar + Center/Right Content */}
      <div className="max-w-[1920px] mx-auto w-full px-4 sm:px-6 lg:px-8 flex-1 flex gap-6">
        {/* Sidebar Navigation (Matches screenshot!) */}
        <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          favoritesCount={favorites.length}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAIStudio={() => setIsAIOpen(true)}
        />

        {/* Center Main Stage */}
        <main className="flex-1 min-w-0 py-4 pb-20">
          {/* Hero Section */}
          <HeroSection
            wallpapers={wallpapers}
            onSelectWallpaper={(w) => setSelectedWallpaper(w)}
            onExploreClick={() => {
              document.getElementById("wallpapers-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            onTrendingClick={() => {
              document.getElementById("trending-section")?.scrollIntoView({ behavior: "smooth" });
            }}
          />

          {/* Category Bar (Row of thumbnail chips matching screenshot!) */}
          <CategoryBar
            selectedCategory={selectedCategory}
            onSelectCategory={(catId) => {
              setSelectedCategory(catId);
              if (catId !== "all") {
                document.getElementById("wallpapers-section")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
          />

          {/* Filter Bar (Devices, Resolutions, Sorting) */}
          <FilterBar
            deviceFilter={deviceFilter}
            setDeviceFilter={setDeviceFilter}
            resolutionFilter={resolutionFilter}
            setResolutionFilter={setResolutionFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            totalCount={filteredWallpapers.length}
            resetFilters={handleResetFilters}
          />

          {/* SECTION 1: Trending Wallpapers (Matches screenshot layout!) */}
          {selectedCategory === "all" && !searchQuery && deviceFilter === "all" && (
            <section id="trending-section" className="w-full py-6 select-none">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-xl sm:text-2xl font-bold text-white tracking-tight"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Trending Wallpapers
                </h2>
                <button
                  onClick={() => {
                    setSortBy("trending");
                    document.getElementById("wallpapers-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1 group transition"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              {/* 6 Grid Cards across widescreen (Exact screenshot arrangement!) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
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
          )}

          {/* SECTION 2: Recently Added (Matches screenshot second section!) */}
          {selectedCategory === "all" && !searchQuery && deviceFilter === "all" && (
            <section className="w-full py-6 select-none">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-xl sm:text-2xl font-bold text-white tracking-tight"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Recently Added
                </h2>
                <button
                  onClick={() => {
                    setSortBy("newest");
                    document.getElementById("wallpapers-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1 group transition"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              {/* 6 Grid Cards across widescreen */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
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
          )}

          {/* Curated Collections Showcase */}
          <CuratedCollections onSelectCollection={handleSelectCollection} />

          {/* SECTION 3: All Filtered Wallpapers Main Gallery */}
          <section id="wallpapers-section" className="w-full pt-6 select-none">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2
                  className="text-xl sm:text-2xl font-bold text-white tracking-tight"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {searchQuery
                    ? `Results for "${searchQuery}"`
                    : selectedCategory !== "all"
                    ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Wallpapers`
                    : "Complete Wallora Gallery"}
                </h2>
                <span className="text-xs text-zinc-400">
                  Showing {filteredWallpapers.length} high-resolution AI wallpapers
                </span>
              </div>

              {/* Quick AI Studio Button */}
              <button
                onClick={() => setIsAIOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/25 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Upscale to 8K</span>
              </button>
            </div>

            {/* Empty State */}
            {filteredWallpapers.length === 0 ? (
              <div className="w-full py-16 flex flex-col items-center justify-center text-center rounded-3xl bg-[#111420] border border-white/[0.08] p-8 space-y-4">
                <div className="p-4 rounded-full bg-white/[0.04] text-zinc-500">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-white">No wallpapers found</h3>
                <p className="text-xs text-zinc-400 max-w-md">
                  No wallpapers matched your active search or filters. Try searching for "Cyberpunk", "Minimal", "Nature", or reset filters.
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
          </section>
        </main>
      </div>

      {/* Footer */}
      <Footer onNotify={notify} />

      {/* Fullscreen Wallpaper Preview & Studio Modal */}
      <WallpaperModal
        wallpaper={selectedWallpaper}
        allWallpapers={filteredWallpapers}
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
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#141826]/95 border border-white/15 text-white text-xs font-medium shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-in slide-in-from-bottom-5">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
