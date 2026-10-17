"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  Layers,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  Check,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import WallpaperCard from "@/components/WallpaperCard";
import WallpaperModal from "@/components/WallpaperModal";
import UploadModal from "@/components/UploadModal";
import AIEnhancerModal from "@/components/AIEnhancerModal";
import SettingsDrawer from "@/components/SettingsDrawer";
import FavoritesModal from "@/components/FavoritesModal";
import Footer from "@/components/Footer";
import {
  WALLPAPERS,
  CURATED_COLLECTIONS,
  Wallpaper,
  CollectionItem,
} from "@/data/wallpapers";

export default function CollectionsPage() {
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
  const [wallpapers] = useState<Wallpaper[]>(WALLPAPERS);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [defaultFormat, setDefaultFormat] = useState("PNG");
  const [autoPlayCarousel, setAutoPlayCarousel] = useState(true);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const notify = (msg: string) => setToastMessage(msg);

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 3200);
    return () => clearTimeout(t);
  }, [toastMessage]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("wallora_favorites");
      if (saved) setFavorites(JSON.parse(saved));
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

  // Filter collections
  const filteredCollections = useMemo(() => {
    if (selectedTag === "all") return CURATED_COLLECTIONS;
    return CURATED_COLLECTIONS.filter((col) =>
      col.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())
    );
  }, [selectedTag]);

  // Wallpapers belonging to active collection
  const activeCollectionWallpapers = useMemo(() => {
    if (!activeCollectionId) return [];
    const activeCol = CURATED_COLLECTIONS.find((c) => c.id === activeCollectionId);
    if (!activeCol) return [];

    const tagMatches = activeCol.tags.map((t) => t.toLowerCase());
    return wallpapers.filter(
      (w) =>
        tagMatches.some((tag) => w.tags.map((t) => t.toLowerCase()).includes(tag)) ||
        tagMatches.some((tag) => w.category.toLowerCase().includes(tag))
    );
  }, [activeCollectionId, wallpapers]);

  const tagsList = [
    { id: "all", label: "All Packs" },
    { id: "neon", label: "Cyberpunk & Neon" },
    { id: "cozy", label: "Lo-Fi & Coziness" },
    { id: "oled", label: "OLED Pure Blacks" },
    { id: "nature", label: "Alpine & Nature" },
    { id: "cars", label: "Automotive" },
    { id: "space", label: "Cosmos & Deep Space" },
  ];

  const favoriteWallpapers = useMemo(() => {
    return wallpapers.filter((w) => favorites.includes(w.id));
  }, [wallpapers, favorites]);

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#EDEDED] flex flex-col font-sans">
      <Navbar
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
          <div className="mb-8">
            <span className="text-[11px] font-bold tracking-[0.2em] text-amber-400 uppercase block mb-1">
              Curated Thematic Packs
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Curated Collections
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl leading-relaxed">
                  Handcrafted visual universes designed for cohesive desktop setups, multi-monitor workspaces, and matching phone lockscreens.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs text-zinc-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>{CURATED_COLLECTIONS.length} Curated Packs</span>
                </span>
              </div>
            </div>
          </div>

          {/* Tag Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 mb-8 border-b border-white/[0.06]">
            {tagsList.map((tag) => (
              <button
                key={tag.id}
                onClick={() => {
                  setSelectedTag(tag.id);
                  setActiveCollectionId(null);
                }}
                className={`px-4 py-2 rounded-full text-xs font-medium shrink-0 transition ${
                  selectedTag === tag.id
                    ? "bg-white text-zinc-950 font-semibold shadow-sm"
                    : "bg-[#131724] text-zinc-400 hover:text-white border border-white/[0.06] hover:border-white/15"
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Collections Grid */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCollections.map((col) => {
                const isExpanded = activeCollectionId === col.id;
                return (
                  <div
                    key={col.id}
                    className={`group rounded-3xl overflow-hidden bg-[#121624] border transition-all duration-300 flex flex-col justify-between shadow-xl ${
                      isExpanded
                        ? "border-amber-400 ring-2 ring-amber-400/30 shadow-[0_10px_40px_rgba(245,158,11,0.15)]"
                        : "border-white/[0.08] hover:border-white/20 hover:-translate-y-1"
                    }`}
                  >
                    {/* Top Image Banner */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={col.coverImage}
                        alt={col.title}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-108"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121624] via-black/30 to-black/30" />

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white border border-white/15 flex items-center gap-1.5">
                          <Layers className="w-3 h-3 text-amber-400" />
                          <span>{col.wallpaperCount} Wallpapers</span>
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-amber-500/30">
                          8K UHD
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h2
                          className="text-xl font-bold text-white mb-2 group-hover:text-amber-200 transition-colors"
                          style={{ fontFamily: "var(--font-playfair)" }}
                        >
                          {col.title}
                        </h2>
                        <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                          {col.subtitle}
                        </p>

                        {/* Tag Chips */}
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {col.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] px-2.5 py-1 rounded-lg bg-white/[0.04] text-zinc-300 border border-white/[0.06]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => {
                          if (isExpanded) {
                            setActiveCollectionId(null);
                          } else {
                            setActiveCollectionId(col.id);
                            notify(`Viewing "${col.title}" pack`);
                          }
                        }}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 ${
                          isExpanded
                            ? "bg-amber-400 text-zinc-950 hover:bg-amber-300 shadow-md"
                            : "bg-white/[0.06] hover:bg-white/10 text-white border border-white/10"
                        }`}
                      >
                        {isExpanded ? (
                          <>
                            <span>Hide Pack Contents</span>
                            <ChevronUp className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            <span>Explore Pack ({col.wallpaperCount})</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Expanded Active Collection Section */}
            {activeCollectionId && (
              <section className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#111420] border border-amber-400/40 shadow-2xl animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/[0.08] gap-4 mb-6">
                  <div>
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block mb-1">
                      Pack Gallery
                    </span>
                    <h3
                      className="text-2xl sm:text-3xl font-bold text-white"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {CURATED_COLLECTIONS.find((c) => c.id === activeCollectionId)?.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => setActiveCollectionId(null)}
                    className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
                  >
                    Close Pack View
                  </button>
                </div>

                {activeCollectionWallpapers.length === 0 ? (
                  <p className="text-xs text-zinc-400 py-6">Loading pack items...</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                    {activeCollectionWallpapers.map((wallpaper) => (
                      <WallpaperCard
                        key={`col-wall-${wallpaper.id}`}
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
            )}
          </div>
        </main>
      </div>

      <Footer onNotify={notify} />

      {/* Modals */}
      <WallpaperModal
        wallpaper={selectedWallpaper}
        allWallpapers={wallpapers}
        isFavorite={selectedWallpaper ? favorites.includes(selectedWallpaper.id) : false}
        onToggleFavorite={toggleFavorite}
        onClose={() => setSelectedWallpaper(null)}
        onSelectWallpaper={(w) => setSelectedWallpaper(w)}
        onNotify={notify}
      />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddWallpaper={() => {}}
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
