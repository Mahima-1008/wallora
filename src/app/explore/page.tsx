"use client";

import React, { useState, useEffect, useMemo, Suspense, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Search,
  X,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  Sparkles,
  AlertCircle,
  ArrowRight,
  Eye,
  Check,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import WallpaperCard from "@/components/WallpaperCard";
import WallpaperModal from "@/components/WallpaperModal";
import UploadModal from "@/components/UploadModal";
import AIEnhancerModal from "@/components/AIEnhancerModal";
import SettingsDrawer from "@/components/SettingsDrawer";
import FavoritesModal from "@/components/FavoritesModal";
import Footer from "@/components/Footer";
import ExploreFilterPanel from "@/components/ExploreFilterPanel";
import { WALLPAPERS, Wallpaper } from "@/data/wallpapers";
import { useFavorites } from "@/context/FavoritesContext";
import {
  matchesCategory,
  matchesOrientation,
  matchesResolution,
  wallpaperMatchesColor,
  matchesSearch,
  sortWallpapers,
  EXPLORE_CATEGORIES,
  ORIENTATIONS,
  RESOLUTIONS,
  COLOR_FAMILIES,
} from "@/lib/exploreFilters";

const ITEMS_PER_PAGE = 12;

function ExploreContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial states from URL query parameters
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "all";
  const initialOrientation = searchParams.get("orientation") || "all";
  const initialResolution = searchParams.get("resolution") || "all";
  const initialColor = searchParams.get("color") || "all";
  const initialDominantOnly = searchParams.get("dominant") === "true";
  const initialSort = searchParams.get("sort") || "trending";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  // Filter States
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>(WALLPAPERS);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedOrientation, setSelectedOrientation] = useState<string>(initialOrientation);
  const [selectedResolution, setSelectedResolution] = useState<string>(initialResolution);
  const [selectedColor, setSelectedColor] = useState<string>(initialColor);
  const [dominantOnly, setDominantOnly] = useState<boolean>(initialDominantOnly);
  const [sortBy, setSortBy] = useState<string>(initialSort);

  // Pagination / Load More state
  const [visibleCount, setVisibleCount] = useState<number>(
    Math.max(ITEMS_PER_PAGE, initialPage * ITEMS_PER_PAGE)
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Responsive Drawer / Sidebar UI
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Favorites & Modals
  const {
    favorites,
    favoritesCount,
    favoriteWallpapers,
    toggleFavorite,
    clearAllFavorites,
  } = useFavorites();
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleAddWallpaper = (newWall: Wallpaper) => {
    setWallpapers((prev) => [newWall, ...prev]);
  };

  // Synchronize state with URL Query Parameters
  const updateUrlParams = useCallback(
    (updates: {
      q?: string;
      category?: string;
      orientation?: string;
      resolution?: string;
      color?: string;
      dominant?: boolean;
      sort?: string;
      page?: number;
    }) => {
      const params = new URLSearchParams();

      const q = updates.q !== undefined ? updates.q : searchQuery;
      const cat = updates.category !== undefined ? updates.category : selectedCategory;
      const orient = updates.orientation !== undefined ? updates.orientation : selectedOrientation;
      const res = updates.resolution !== undefined ? updates.resolution : selectedResolution;
      const col = updates.color !== undefined ? updates.color : selectedColor;
      const dom = updates.dominant !== undefined ? updates.dominant : dominantOnly;
      const sort = updates.sort !== undefined ? updates.sort : sortBy;
      const pages = updates.page !== undefined ? updates.page : Math.ceil(visibleCount / ITEMS_PER_PAGE);

      if (q.trim()) params.set("q", q.trim());
      if (cat !== "all") params.set("category", cat);
      if (orient !== "all") params.set("orientation", orient);
      if (res !== "all") params.set("resolution", res);
      if (col !== "all") params.set("color", col);
      if (dom) params.set("dominant", "true");
      if (sort !== "trending") params.set("sort", sort);
      if (pages > 1) params.set("page", pages.toString());

      const qs = params.toString();
      const target = qs ? `${pathname}?${qs}` : pathname;
      router.replace(target, { scroll: false });
    },
    [
      pathname,
      router,
      searchQuery,
      selectedCategory,
      selectedOrientation,
      selectedResolution,
      selectedColor,
      dominantOnly,
      sortBy,
      visibleCount,
    ]
  );

  // Sync external URL changes (e.g. browser back/forward or navigation from navbar)
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const cat = searchParams.get("category") || "all";
    const orient = searchParams.get("orientation") || "all";
    const res = searchParams.get("resolution") || "all";
    const col = searchParams.get("color") || "all";
    const dom = searchParams.get("dominant") === "true";
    const sort = searchParams.get("sort") || "trending";

    setSearchQuery(q);
    setSelectedCategory(cat);
    setSelectedOrientation(orient);
    setSelectedResolution(res);
    setSelectedColor(col);
    setDominantOnly(dom);
    setSortBy(sort);
  }, [searchParams]);

  // Combined Filtering Pipeline
  const filteredWallpapers = useMemo(() => {
    let result = wallpapers.filter((w) => {
      // 1. Search Query (title, tags, category, colors, creator name)
      if (!matchesSearch(w, searchQuery)) return false;

      // 2. Category Filter
      if (!matchesCategory(w, selectedCategory)) return false;

      // 3. Orientation Filter
      if (!matchesOrientation(w, selectedOrientation)) return false;

      // 4. Resolution Filter
      if (!matchesResolution(w, selectedResolution)) return false;

      // 5. Color Family Filter
      if (!wallpaperMatchesColor(w, selectedColor, dominantOnly)) return false;

      return true;
    });

    // 6. Sorting
    result = sortWallpapers(result, sortBy);

    return result;
  }, [
    wallpapers,
    searchQuery,
    selectedCategory,
    selectedOrientation,
    selectedResolution,
    selectedColor,
    dominantOnly,
    sortBy,
  ]);

  // Dynamic Real-Time Counts for Filter Panel
  const dynamicCounts = useMemo(() => {
    // Categories count (considering current search, orientation, res, color)
    const categories: Record<string, number> = {};
    for (const cat of EXPLORE_CATEGORIES) {
      if (cat.id === "all") {
        categories["all"] = wallpapers.filter(
          (w) =>
            matchesSearch(w, searchQuery) &&
            matchesOrientation(w, selectedOrientation) &&
            matchesResolution(w, selectedResolution) &&
            wallpaperMatchesColor(w, selectedColor, dominantOnly)
        ).length;
      } else {
        categories[cat.id] = wallpapers.filter(
          (w) =>
            matchesSearch(w, searchQuery) &&
            matchesCategory(w, cat.id) &&
            matchesOrientation(w, selectedOrientation) &&
            matchesResolution(w, selectedResolution) &&
            wallpaperMatchesColor(w, selectedColor, dominantOnly)
        ).length;
      }
    }

    // Orientations count
    const orientations: Record<string, number> = {};
    for (const opt of ORIENTATIONS) {
      orientations[opt.id] = wallpapers.filter(
        (w) =>
          matchesSearch(w, searchQuery) &&
          matchesCategory(w, selectedCategory) &&
          matchesOrientation(w, opt.id) &&
          matchesResolution(w, selectedResolution) &&
          wallpaperMatchesColor(w, selectedColor, dominantOnly)
      ).length;
    }

    // Resolutions count
    const resolutions: Record<string, number> = {};
    for (const opt of RESOLUTIONS) {
      resolutions[opt.id] = wallpapers.filter(
        (w) =>
          matchesSearch(w, searchQuery) &&
          matchesCategory(w, selectedCategory) &&
          matchesOrientation(w, selectedOrientation) &&
          matchesResolution(w, opt.id) &&
          wallpaperMatchesColor(w, selectedColor, dominantOnly)
      ).length;
    }

    // Colors count
    const colors: Record<string, number> = {};
    for (const opt of COLOR_FAMILIES) {
      colors[opt.id] = wallpapers.filter(
        (w) =>
          matchesSearch(w, searchQuery) &&
          matchesCategory(w, selectedCategory) &&
          matchesOrientation(w, selectedOrientation) &&
          matchesResolution(w, selectedResolution) &&
          wallpaperMatchesColor(w, opt.id, dominantOnly)
      ).length;
    }

    return { categories, orientations, resolutions, colors };
  }, [
    wallpapers,
    searchQuery,
    selectedCategory,
    selectedOrientation,
    selectedResolution,
    selectedColor,
    dominantOnly,
  ]);

  // Paginated Sliced Wallpapers
  const visibleWallpapers = useMemo(() => {
    return filteredWallpapers.slice(0, visibleCount);
  }, [filteredWallpapers, visibleCount]);

  const hasMore = visibleCount < filteredWallpapers.length;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      const nextCount = visibleCount + ITEMS_PER_PAGE;
      setVisibleCount(nextCount);
      setIsLoadingMore(false);
      updateUrlParams({ page: Math.ceil(nextCount / ITEMS_PER_PAGE) });
    }, 200);
  };

  // Reset all filters
  const handleResetAll = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedOrientation("all");
    setSelectedResolution("all");
    setSelectedColor("all");
    setDominantOnly(false);
    setSortBy("trending");
    setVisibleCount(ITEMS_PER_PAGE);
    router.replace(pathname, { scroll: false });
    notify("All filters reset");
  };

  // Count active filters (for badge)
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (selectedCategory !== "all") count++;
    if (selectedOrientation !== "all") count++;
    if (selectedResolution !== "all") count++;
    if (selectedColor !== "all") count++;
    if (dominantOnly) count++;
    if (sortBy !== "trending") count++;
    return count;
  }, [
    searchQuery,
    selectedCategory,
    selectedOrientation,
    selectedResolution,
    selectedColor,
    dominantOnly,
    sortBy,
  ]);

  // Quick filter presets (Requirement 8)
  const quickFilters = [
    {
      id: "all",
      label: "All Wallpapers",
      isActive:
        selectedCategory === "all" &&
        selectedResolution === "all" &&
        selectedOrientation === "all" &&
        !searchQuery,
      apply: () => handleResetAll(),
    },
    {
      id: "8k",
      label: "8K Ultra HD",
      isActive: selectedResolution === "8K",
      apply: () => {
        const next = selectedResolution === "8K" ? "all" : "8K";
        setSelectedResolution(next);
        updateUrlParams({ resolution: next });
      },
    },
    {
      id: "trending",
      label: "Trending Now",
      isActive: sortBy === "trending" && activeFiltersCount <= 1,
      apply: () => {
        setSortBy("trending");
        updateUrlParams({ sort: "trending" });
      },
    },
    {
      id: "landscape",
      label: "Desktop 16:9",
      isActive: selectedOrientation === "landscape",
      apply: () => {
        const next = selectedOrientation === "landscape" ? "all" : "landscape";
        setSelectedOrientation(next);
        updateUrlParams({ orientation: next });
      },
    },
    {
      id: "portrait",
      label: "Mobile 9:16",
      isActive: selectedOrientation === "portrait",
      apply: () => {
        const next = selectedOrientation === "portrait" ? "all" : "portrait";
        setSelectedOrientation(next);
        updateUrlParams({ orientation: next });
      },
    },
    {
      id: "nature",
      label: "Nature & Peaks",
      isActive: selectedCategory === "nature",
      apply: () => {
        const next = selectedCategory === "nature" ? "all" : "nature";
        setSelectedCategory(next);
        updateUrlParams({ category: next });
      },
    },
    {
      id: "anime",
      label: "Anime & Cyberpunk",
      isActive: selectedCategory === "anime",
      apply: () => {
        const next = selectedCategory === "anime" ? "all" : "anime";
        setSelectedCategory(next);
        updateUrlParams({ category: next });
      },
    },
    {
      id: "minimal",
      label: "Minimalist",
      isActive: selectedCategory === "minimal",
      apply: () => {
        const next = selectedCategory === "minimal" ? "all" : "minimal";
        setSelectedCategory(next);
        updateUrlParams({ category: next });
      },
    },
    {
      id: "space",
      label: "Deep Cosmos",
      isActive: selectedCategory === "space",
      apply: () => {
        const next = selectedCategory === "space" ? "all" : "space";
        setSelectedCategory(next);
        updateUrlParams({ category: next });
      },
    },
    {
      id: "cars",
      label: "Motors & Cars",
      isActive: selectedCategory === "cars",
      apply: () => {
        const next = selectedCategory === "cars" ? "all" : "cars";
        setSelectedCategory(next);
        updateUrlParams({ category: next });
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F4F4F6] flex flex-col font-sans selection:bg-white/20 selection:text-white">
      {/* Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          updateUrlParams({ q });
        }}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenAIStudio={() => setIsAIOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Explore Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 space-y-6">
        {/* 1. Header & Prominent Search Section */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-semibold tracking-[0.2em] text-[#8E909B] uppercase">
                  Wallpaper Catalog
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-mono text-zinc-400">
                  {wallpapers.length} High-Res Files
                </span>
              </div>
              <h1
                className="text-3xl sm:text-4xl font-normal text-[#F4F4F6] tracking-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Explore Wallpapers
              </h1>
              <p className="text-xs sm:text-sm text-[#8E909B] mt-1 max-w-xl">
                Search titles, creator names, color palettes, and themes across curated 8K and 4K wallpapers.
              </p>
            </div>

            {/* AI Studio Trigger */}
            <button
              onClick={() => setIsAIOpen(true)}
              className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-zinc-200 text-xs font-medium border border-white/[0.1] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
              <span>AI Enhancer Studio</span>
            </button>
          </div>

          {/* Prominent Search Bar (Requirement 1) */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                updateUrlParams({ q: e.target.value });
              }}
              placeholder="Search by wallpaper title, creator, tag, color, or category (e.g. 'Elena', 'Alpine', 'Blue', 'OLED')..."
              className="w-full py-3.5 pl-11 pr-10 bg-[#13141C] text-sm text-[#F4F4F6] placeholder-zinc-500 rounded-2xl border border-white/[0.08] hover:border-white/20 focus:border-zinc-400 focus:outline-none shadow-sm transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  updateUrlParams({ q: "" });
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white transition rounded-full hover:bg-white/10"
                aria-label="Clear search text"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Suggestion inspiration tags */}
          {!searchQuery && (
            <div className="flex items-center gap-2 text-[11px] text-[#8E909B] flex-wrap">
              <span>Suggestions:</span>
              {["Alpine", "Elena Rostova", "Cyberpunk", "8K Ultra", "Obsidian", "Golden Hour"].map(
                (term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      updateUrlParams({ q: term });
                    }}
                    className="hover:text-white underline decoration-white/20 underline-offset-2 transition"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          )}
        </section>

        {/* 2. Quick-Filter Chips Bar (Requirement 8) */}
        <section className="w-full select-none">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {quickFilters.map((qf) => (
              <button
                key={qf.id}
                type="button"
                onClick={qf.apply}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 ${
                  qf.isActive
                    ? "bg-[#F4F4F6] text-[#0B0C10] border-white shadow-sm font-semibold"
                    : "bg-[#13141C] text-[#8E909B] border-white/[0.07] hover:text-white hover:border-white/20"
                }`}
              >
                {qf.label}
              </button>
            ))}
          </div>
        </section>

        {/* 3. Filter Controls Header & Active Filter Strip */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {/* Desktop / Mobile Filter Panel Toggle Button (Requirement 9) */}
            <div className="flex items-center gap-2.5">
              {/* Desktop Toggle Button */}
              <button
                type="button"
                onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
                className={`hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 ${
                  desktopSidebarOpen
                    ? "bg-white/[0.1] text-white border-white/25"
                    : "bg-[#13141C] text-zinc-300 border-white/[0.08] hover:text-white hover:border-white/20"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-300" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-white text-zinc-950 font-mono text-[10px] font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Mobile Drawer Trigger Button */}
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="md:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#13141C] text-xs font-medium text-white border border-white/[0.08]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-300" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-white text-zinc-950 font-mono text-[10px] font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Total Matching Counter (Requirement 4) */}
              <span className="text-xs text-[#8E909B]">
                Showing{" "}
                <strong className="text-[#F4F4F6] font-mono">
                  {visibleWallpapers.length}
                </strong>{" "}
                of{" "}
                <strong className="text-[#F4F4F6] font-mono">
                  {filteredWallpapers.length}
                </strong>{" "}
                matching wallpapers
              </span>
            </div>

            {/* Sorting Dropdown (Quick Desktop Select) */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#8E909B] hidden sm:inline">Sort:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    updateUrlParams({ sort: e.target.value });
                  }}
                  className="py-1.5 pl-3 pr-7 bg-[#13141C] text-xs text-[#F4F4F6] rounded-xl border border-white/[0.08] hover:border-white/20 focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="trending" className="bg-[#111217]">Trending</option>
                  <option value="downloads" className="bg-[#111217]">Most Downloaded</option>
                  <option value="newest" className="bg-[#111217]">Newest First</option>
                  <option value="likes" className="bg-[#111217]">Most Favorited</option>
                </select>
                <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active Filter Chips with Removable Action & Clear All (Requirement 3) */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-2xl bg-[#13141C]/60 border border-white/[0.06] text-xs">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mr-1">
                Active:
              </span>

              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.08] text-white border border-white/10 text-xs">
                  <span>Search: "{searchQuery}"</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      updateUrlParams({ q: "" });
                    }}
                    className="hover:text-rose-400 transition"
                    aria-label="Remove search filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedCategory !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.08] text-white border border-white/10 text-xs capitalize">
                  <span>Category: {selectedCategory}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("all");
                      updateUrlParams({ category: "all" });
                    }}
                    className="hover:text-rose-400 transition"
                    aria-label="Remove category filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedOrientation !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.08] text-white border border-white/10 text-xs capitalize">
                  <span>Orientation: {selectedOrientation}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOrientation("all");
                      updateUrlParams({ orientation: "all" });
                    }}
                    className="hover:text-rose-400 transition"
                    aria-label="Remove orientation filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedResolution !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.08] text-white border border-white/10 text-xs uppercase">
                  <span>Resolution: {selectedResolution}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedResolution("all");
                      updateUrlParams({ resolution: "all" });
                    }}
                    className="hover:text-rose-400 transition"
                    aria-label="Remove resolution filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedColor !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.08] text-white border border-white/10 text-xs capitalize">
                  <span>Color: {selectedColor}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedColor("all");
                      updateUrlParams({ color: "all" });
                    }}
                    className="hover:text-rose-400 transition"
                    aria-label="Remove color filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {dominantOnly && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.08] text-white border border-white/10 text-xs">
                  <span>Dominant Only</span>
                  <button
                    type="button"
                    onClick={() => {
                      setDominantOnly(false);
                      updateUrlParams({ dominant: false });
                    }}
                    className="hover:text-rose-400 transition"
                    aria-label="Remove dominant only filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {sortBy !== "trending" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.08] text-white border border-white/10 text-xs">
                  <span>Sort: {sortBy}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy("trending");
                      updateUrlParams({ sort: "trending" });
                    }}
                    className="hover:text-rose-400 transition"
                    aria-label="Reset sorting"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={handleResetAll}
                className="text-xs text-zinc-400 hover:text-white underline ml-auto flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </section>

        {/* 4. Main Gallery Body with Collapsible Desktop Sidebar */}
        <div className="flex gap-8 items-start">
          {/* Collapsible Desktop Sidebar (Requirement 9) */}
          {desktopSidebarOpen && (
            <aside className="hidden md:block w-72 shrink-0 p-5 rounded-2xl bg-[#13141C] border border-white/[0.07] sticky top-20 shadow-sm animate-in fade-in slide-in-from-left-4 duration-200">
              <ExploreFilterPanel
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  updateUrlParams({ category: cat });
                }}
                selectedOrientation={selectedOrientation}
                onSelectOrientation={(orient) => {
                  setSelectedOrientation(orient);
                  updateUrlParams({ orientation: orient });
                }}
                selectedResolution={selectedResolution}
                onSelectResolution={(res) => {
                  setSelectedResolution(res);
                  updateUrlParams({ resolution: res });
                }}
                selectedColor={selectedColor}
                onSelectColor={(col) => {
                  setSelectedColor(col);
                  updateUrlParams({ color: col });
                }}
                dominantOnly={dominantOnly}
                onToggleDominantOnly={() => {
                  const next = !dominantOnly;
                  setDominantOnly(next);
                  updateUrlParams({ dominant: next });
                }}
                sortBy={sortBy}
                onSelectSortBy={(sort) => {
                  setSortBy(sort);
                  updateUrlParams({ sort });
                }}
                onResetAll={handleResetAll}
                activeFiltersCount={activeFiltersCount}
                counts={dynamicCounts}
              />
            </aside>
          )}

          {/* Main Wallpaper Grid Stage */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* Empty State when no results match (Requirement 4) */}
            {filteredWallpapers.length === 0 ? (
              <div className="w-full py-16 px-6 sm:px-12 flex flex-col items-center justify-center text-center rounded-3xl bg-[#13141C] border border-white/[0.07] space-y-4">
                <div className="p-4 rounded-full bg-white/[0.04] text-zinc-400">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1.5 max-w-md">
                  <h3
                    className="text-xl font-normal text-[#F4F4F6]"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    No wallpapers found
                  </h3>
                  <p className="text-xs text-[#8E909B] leading-relaxed">
                    We couldn't find any wallpapers matching your active combination of filters and search keywords.
                  </p>
                </div>

                {/* Suggestions */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleResetAll}
                    className="px-5 py-2.5 rounded-full bg-white text-zinc-950 font-medium text-xs hover:bg-zinc-200 transition active:scale-95"
                  >
                    Reset All Filters
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("nature");
                      setSelectedResolution("all");
                      setSelectedOrientation("all");
                      setSelectedColor("all");
                      setSearchQuery("");
                      updateUrlParams({ category: "nature", resolution: "all", orientation: "all", color: "all", q: "" });
                    }}
                    className="px-4 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs transition"
                  >
                    Try Nature Wallpapers
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedResolution("8K");
                      setSelectedCategory("all");
                      setSelectedOrientation("all");
                      setSelectedColor("all");
                      setSearchQuery("");
                      updateUrlParams({ resolution: "8K", category: "all", orientation: "all", color: "all", q: "" });
                    }}
                    className="px-4 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs transition"
                  >
                    Try 8K Ultra HD
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Wallpaper Responsive Grid */}
                <div
                  className={`grid gap-5 ${
                    desktopSidebarOpen
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  }`}
                >
                  {visibleWallpapers.map((wallpaper) => (
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

                {/* 5. Load More Button & Progress Bar (Requirement 7) */}
                {hasMore && (
                  <div className="pt-6 pb-4 flex flex-col items-center justify-center space-y-3">
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="px-8 py-3 rounded-full bg-[#13141C] hover:bg-white/[0.08] text-[#F4F4F6] text-xs font-medium border border-white/[0.1] hover:border-white/20 transition active:scale-95 shadow-sm flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 group"
                    >
                      {isLoadingMore ? (
                        <>
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          <span>Loading Wallpapers...</span>
                        </>
                      ) : (
                        <>
                          <span>
                            Load More Wallpapers (
                            {filteredWallpapers.length - visibleWallpapers.length} remaining)
                          </span>
                          <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
                        </>
                      )}
                    </button>

                    {/* Subtle progress indicator */}
                    <div className="flex flex-col items-center gap-1.5 w-full max-w-xs">
                      <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white transition-all duration-300 rounded-full"
                          style={{
                            width: `${(visibleWallpapers.length / filteredWallpapers.length) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {visibleWallpapers.length} / {filteredWallpapers.length} wallpapers loaded
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Drawer (Requirement 9) */}
      {mobileDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-md animate-in fade-in"
        >
          {/* Backdrop click to close */}
          <div
            className="absolute inset-0"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer container */}
          <div className="relative z-10 w-full max-h-[85vh] bg-[#0E1017] border-t border-white/[0.1] rounded-t-3xl p-5 overflow-y-auto space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span
                  className="text-lg font-normal text-white"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Filters
                </span>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-white text-zinc-950 text-xs font-bold font-mono">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white bg-white/[0.05]"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ExploreFilterPanel
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                updateUrlParams({ category: cat });
              }}
              selectedOrientation={selectedOrientation}
              onSelectOrientation={(orient) => {
                setSelectedOrientation(orient);
                updateUrlParams({ orientation: orient });
              }}
              selectedResolution={selectedResolution}
              onSelectResolution={(res) => {
                setSelectedResolution(res);
                updateUrlParams({ resolution: res });
              }}
              selectedColor={selectedColor}
              onSelectColor={(col) => {
                setSelectedColor(col);
                updateUrlParams({ color: col });
              }}
              dominantOnly={dominantOnly}
              onToggleDominantOnly={() => {
                const next = !dominantOnly;
                setDominantOnly(next);
                updateUrlParams({ dominant: next });
              }}
              sortBy={sortBy}
              onSelectSortBy={(sort) => {
                setSortBy(sort);
                updateUrlParams({ sort });
              }}
              onResetAll={handleResetAll}
              activeFiltersCount={activeFiltersCount}
              counts={dynamicCounts}
              isMobile={true}
              onCloseMobile={() => setMobileDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer onNotify={notify} />

      {/* Fullscreen Wallpaper Preview & Specs Modal */}
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

      {/* AI Studio Enhancer Modal */}
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
        defaultFormat="PNG"
        setDefaultFormat={() => {}}
        autoPlayCarousel={true}
        setAutoPlayCarousel={() => {}}
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

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center text-zinc-500 text-xs">
          Loading Wallora Explore...
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
