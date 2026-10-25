"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Sparkles,
  Check,
  UserPlus,
  UserCheck,
  MapPin,
  Search,
  X,
  ArrowRight,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WallpaperModal from "@/components/WallpaperModal";
import FavoritesModal from "@/components/FavoritesModal";
import AIEnhancerModal from "@/components/AIEnhancerModal";
import { CREATORS, Creator } from "@/data/creators";
import { WALLPAPERS, Wallpaper } from "@/data/wallpapers";
import { useFollow } from "@/context/FollowContext";
import { useFavorites } from "@/context/FavoritesContext";
import { getRealCreatorMetrics } from "@/lib/creatorUtils";

const SPECIALTY_FILTERS = [
  { id: "all", label: "All Creators" },
  { id: "nature", label: "Alpine & Nature" },
  { id: "lo-fi", label: "Lo-Fi & Aesthetic" },
  { id: "dark", label: "AMOLED & Dark" },
  { id: "anime", label: "Cyberpunk & Anime" },
  { id: "space", label: "Astrophotography & Space" },
  { id: "automotive", label: "Automotive" },
  { id: "minimal", label: "Brutalism & Minimal" },
];

export default function CreatorsDiscoveryClient() {
  const { isFollowing, toggleFollow } = useFollow();
  const { favorites, favoriteWallpapers, toggleFavorite: onToggleFavorite, clearAllFavorites } = useFavorites();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [sortBy, setSortBy] = useState<"popular" | "recent" | "works" | "followers" | "alphabetical">("popular");
  const [showFollowingOnly, setShowFollowingOnly] = useState(false);

  // Modals state
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

  // Application form state
  const [applicantName, setApplicantName] = useState("");
  const [applicantHandle, setApplicantHandle] = useState("");
  const [applicantPortfolio, setApplicantPortfolio] = useState("");
  const [applicantSpecialty, setApplicantSpecialty] = useState("AI Concept Art");
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Build enhanced list of creators with real data metrics
  const enhancedCreators = useMemo(() => {
    return CREATORS.map((creator) => {
      const realMetrics = getRealCreatorMetrics(creator);
      return {
        ...creator,
        publishedCount: realMetrics.publishedCount,
        realDownloads: realMetrics.catalogDownloads,
        realLikes: realMetrics.catalogLikes,
        hasRecentlyAdded: realMetrics.hasRecentlyAdded,
      };
    });
  }, []);

  // Filter and sort creators
  const filteredCreators = useMemo(() => {
    let list = [...enhancedCreators];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.handle.toLowerCase().includes(q) ||
          c.specialty.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.bio.toLowerCase().includes(q)
      );
    }

    // Specialty filter
    if (selectedSpecialty !== "all") {
      if (selectedSpecialty === "nature") {
        list = list.filter((c) => c.specialty.toLowerCase().includes("alpine") || c.specialty.toLowerCase().includes("nature"));
      } else if (selectedSpecialty === "lo-fi") {
        list = list.filter((c) => c.specialty.toLowerCase().includes("lo-fi") || c.specialty.toLowerCase().includes("aesthetic"));
      } else if (selectedSpecialty === "dark") {
        list = list.filter((c) => c.specialty.toLowerCase().includes("amoled") || c.specialty.toLowerCase().includes("dark"));
      } else if (selectedSpecialty === "anime") {
        list = list.filter((c) => c.specialty.toLowerCase().includes("anime") || c.specialty.toLowerCase().includes("cyberpunk"));
      } else if (selectedSpecialty === "space") {
        list = list.filter((c) => c.specialty.toLowerCase().includes("astro") || c.specialty.toLowerCase().includes("space"));
      } else if (selectedSpecialty === "automotive") {
        list = list.filter((c) => c.specialty.toLowerCase().includes("auto"));
      } else if (selectedSpecialty === "minimal") {
        list = list.filter((c) => c.specialty.toLowerCase().includes("minimal") || c.specialty.toLowerCase().includes("brutalism"));
      }
    }

    // Following only
    if (showFollowingOnly) {
      list = list.filter((c) => isFollowing(c.id));
    }

    // Sort using real data
    if (sortBy === "popular") {
      list.sort((a, b) => b.realDownloads - a.realDownloads);
    } else if (sortBy === "recent") {
      list.sort((a, b) => {
        if (a.hasRecentlyAdded && !b.hasRecentlyAdded) return -1;
        if (!a.hasRecentlyAdded && b.hasRecentlyAdded) return 1;
        return b.realDownloads - a.realDownloads;
      });
    } else if (sortBy === "works") {
      list.sort((a, b) => b.publishedCount - a.publishedCount);
    } else if (sortBy === "followers") {
      list.sort((a, b) => b.followers - a.followers);
    } else if (sortBy === "alphabetical") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [enhancedCreators, searchQuery, selectedSpecialty, showFollowingOnly, sortBy, isFollowing]);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSuccess(true);
    notify("Application submitted! Our curation team will review your portfolio within 24 hours.");
    setTimeout(() => {
      setShowApplyModal(false);
      setAppliedSuccess(false);
      setApplicantName("");
      setApplicantHandle("");
      setApplicantPortfolio("");
    }, 2000);
  };

  const handleFollowToggle = (creator: Creator) => {
    const nextState = toggleFollow(creator.id, creator.name);
    notify(
      nextState
        ? `Following ${creator.name}`
        : `Unfollowed ${creator.name}`
    );
  };

  const isFiltered = Boolean(searchQuery.trim() || selectedSpecialty !== "all" || showFollowingOnly || sortBy !== "popular");

  const handleResetAll = () => {
    setSearchQuery("");
    setSelectedSpecialty("all");
    setShowFollowingOnly(false);
    setSortBy("popular");
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F4F4F6] flex flex-col font-sans selection:bg-white/20 selection:text-white">
      {/* Navbar */}
      <Navbar
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenAIStudio={() => setIsAIOpen(true)}
      />

      {/* Main Container - Mirrored with Explore Page Width & Spacing */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 space-y-6">
        {/* 1. Header & Prominent Search Section */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-semibold tracking-[0.2em] text-[#8E909B] uppercase">
                  Creator Directory
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-mono text-zinc-400">
                  {enhancedCreators.length} Verified Artists
                </span>
              </div>
              <h1
                className="text-3xl sm:text-4xl font-normal text-[#F4F4F6] tracking-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Discover Creators
              </h1>
              <p className="text-xs sm:text-sm text-[#8E909B] mt-1 max-w-xl">
                Browse verified 8K artists, astrophotographers, and 3D environment designers. Inspect their portfolios and follow for weekly background drops.
              </p>
            </div>

            {/* Action: Join as a Creator */}
            <button
              type="button"
              onClick={() => setShowApplyModal(true)}
              className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-zinc-200 text-xs font-medium border border-white/[0.1] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 active:scale-95 shadow-sm shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
              <span>Join as a Creator</span>
            </button>
          </div>

          {/* Prominent Search Bar (Mirrors Explore Page exactly) */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search creators by name, specialty, bio, or handle (e.g. 'Elias Vance', 'Astrophotography', 'Berlin')..."
              className="w-full py-3.5 pl-11 pr-10 bg-[#13141C] text-sm text-[#F4F4F6] placeholder-zinc-500 rounded-2xl border border-white/[0.08] hover:border-white/20 focus:border-zinc-400 focus:outline-none shadow-sm transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
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
              {["Elias Vance", "Sora K.", "Nico Thorne", "Astrophotography", "OLED Dark", "Brutalism"].map(
                (term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setSearchQuery(term)}
                    className="hover:text-white underline decoration-white/20 underline-offset-2 transition"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          )}
        </section>

        {/* 2. Quick-Filter Chips Bar (Mirrors Explore Page exactly) */}
        <section className="w-full select-none">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {SPECIALTY_FILTERS.map((tab) => {
              const isActive = selectedSpecialty === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedSpecialty(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 ${
                    isActive
                      ? "bg-[#F4F4F6] text-[#0B0C10] border-white shadow-sm font-semibold"
                      : "bg-[#13141C] text-[#8E909B] border-white/[0.07] hover:text-white hover:border-white/20"
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. Filter Controls Header & Active Filter Strip */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {/* Total Matching Counter */}
            <span className="text-xs text-[#8E909B]">
              Showing{" "}
              <strong className="text-[#F4F4F6] font-mono">
                {filteredCreators.length}
              </strong>{" "}
              of{" "}
              <strong className="text-[#F4F4F6] font-mono">{enhancedCreators.length}</strong>{" "}
              creators
            </span>

            {/* Sort & Following Controls */}
            <div className="flex items-center gap-2 text-xs">
              {/* Following Filter Pill */}
              <button
                type="button"
                onClick={() => setShowFollowingOnly(!showFollowingOnly)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 border ${
                  showFollowingOnly
                    ? "bg-white/[0.1] text-white border-white/25"
                    : "bg-[#13141C] text-zinc-400 hover:text-white border-white/[0.08]"
                }`}
                aria-pressed={showFollowingOnly}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Following Only</span>
              </button>

              <span className="text-[#8E909B] hidden sm:inline">Sort:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as "popular" | "recent" | "works" | "followers" | "alphabetical"
                    )
                  }
                  className="py-1.5 pl-3 pr-7 bg-[#13141C] text-xs text-[#F4F4F6] rounded-xl border border-white/[0.08] hover:border-white/20 focus:outline-none cursor-pointer"
                >
                  <option value="popular" className="bg-[#111217]">Most Popular (Downloads)</option>
                  <option value="recent" className="bg-[#111217]">Recently Active</option>
                  <option value="works" className="bg-[#111217]">Most Works Published</option>
                  <option value="followers" className="bg-[#111217]">Most Followers</option>
                  <option value="alphabetical" className="bg-[#111217]">Alphabetical (A–Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips with Removable Action & Clear All */}
          {isFiltered && (
            <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-2xl bg-[#13141C]/60 border border-white/[0.06] text-xs">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mr-1">
                Active:
              </span>

              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.08] text-white border border-white/10 text-xs">
                  <span>Search: &quot;{searchQuery}&quot;</span>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="hover:text-rose-400 transition"
                    aria-label="Remove search filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedSpecialty !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.08] text-white border border-white/10 text-xs capitalize">
                  <span>
                    Specialty: {SPECIALTY_FILTERS.find((f) => f.id === selectedSpecialty)?.label || selectedSpecialty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedSpecialty("all")}
                    className="hover:text-rose-400 transition"
                    aria-label="Remove specialty filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {showFollowingOnly && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.08] text-white border border-white/10 text-xs">
                  <span>Following Only</span>
                  <button
                    type="button"
                    onClick={() => setShowFollowingOnly(false)}
                    className="hover:text-rose-400 transition"
                    aria-label="Remove following filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {sortBy !== "popular" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.08] text-white border border-white/10 text-xs">
                  <span>Sort: {sortBy}</span>
                  <button
                    type="button"
                    onClick={() => setSortBy("popular")}
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

        {/* 4. Creators Grid (Mirrored with Explore Card Styling) */}
        {filteredCreators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCreators.map((creator) => {
              const following = isFollowing(creator.id);
              const adjustedFollowers = creator.followers + (following ? 1 : 0);

              return (
                <div
                  key={creator.id}
                  className="group rounded-2xl overflow-hidden bg-[#13141C] border border-white/[0.08] hover:border-white/20 transition-all duration-300 flex flex-col justify-between shadow-lg hover:-translate-y-1"
                >
                  {/* Cover Header */}
                  <div className="relative h-28 overflow-hidden bg-[#0A0C14]">
                    <img
                      src={creator.coverImage}
                      alt={`${creator.name} backdrop`}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#13141C] via-black/20 to-black/20" />
                    {creator.hasRecentlyAdded && (
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-[10px] font-semibold text-emerald-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Active Drops</span>
                      </div>
                    )}
                  </div>

                  {/* Profile Card Body */}
                  <div className="px-5 pb-5 pt-0 relative flex-1 flex flex-col justify-between">
                    <div>
                      {/* Avatar & Follow Action */}
                      <div className="flex items-end justify-between -mt-10 mb-3">
                        <Link
                          href={`/creators/${creator.id}`}
                          className="relative block group/avatar"
                          title={`View ${creator.name}'s profile`}
                        >
                          <img
                            src={creator.avatar}
                            alt={creator.name}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/80 shadow-2xl bg-zinc-900 group-hover/avatar:border-white transition-colors"
                          />
                          {creator.verified && (
                            <span
                              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center p-0.5 border-2 border-[#13141C]"
                              title="Verified Creator"
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </Link>

                        {/* Follow Button */}
                        <button
                          type="button"
                          onClick={() => handleFollowToggle(creator)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 shadow-md active:scale-95 ${
                            following
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                              : "bg-white text-zinc-950 hover:bg-zinc-200"
                          }`}
                          aria-pressed={following}
                          aria-label={following ? `Unfollow ${creator.name}` : `Follow ${creator.name}`}
                        >
                          {following ? (
                            <>
                              <UserCheck className="w-3 h-3" />
                              <span>Following</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3 h-3" />
                              <span>Follow</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Name & Handle */}
                      <div className="mb-2">
                        <Link
                          href={`/creators/${creator.id}`}
                          className="inline-block group-hover:text-amber-200 transition-colors"
                        >
                          <h2
                            className="text-base font-medium text-[#F4F4F6] group-hover:text-white tracking-tight line-clamp-1"
                            style={{ fontFamily: "var(--font-playfair)" }}
                          >
                            {creator.name}
                          </h2>
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                          <span className="font-mono text-zinc-400">{creator.handle}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-zinc-500" />
                            {creator.location}
                          </span>
                        </div>
                      </div>

                      {/* Specialty Badge */}
                      <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/[0.04] text-zinc-400 border border-white/[0.06] mb-3">
                        {creator.specialty}
                      </span>

                      {/* Short Bio */}
                      <p className="text-xs text-[#8E909B] leading-relaxed line-clamp-2 mb-4">
                        {creator.bio}
                      </p>

                      {/* Real Data Metrics */}
                      <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-black/40 border border-white/[0.04] text-center mb-4">
                        <div>
                          <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Wallpapers</div>
                          <div className="text-xs font-bold text-white font-mono mt-0.5">
                            {creator.publishedCount} in catalog
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Downloads</div>
                          <div className="text-xs font-bold text-amber-400 font-mono mt-0.5">
                            {(creator.realDownloads / 1000).toFixed(0)}k
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Followers</div>
                          <div className="text-xs font-bold text-white font-mono mt-0.5">
                            {(adjustedFollowers / 1000).toFixed(1)}k
                          </div>
                        </div>
                      </div>

                      {/* Showcase Wallpapers Strip */}
                      {creator.topWallpapers && creator.topWallpapers.length > 0 && (
                        <div className="mb-4">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1.5 font-semibold">
                            Signature Creations
                          </span>
                          <div className="grid grid-cols-3 gap-1.5">
                            {creator.topWallpapers.map((url, idx) => {
                              const catalogMatch = WALLPAPERS.find((w) => w.imageUrl === url);
                              return (
                                <div
                                  key={idx}
                                  onClick={() => {
                                    if (catalogMatch) setSelectedWallpaper(catalogMatch);
                                  }}
                                  className="aspect-[16/10] rounded-lg overflow-hidden border border-white/10 hover:border-amber-400 cursor-pointer transition group/thumb"
                                  title="Inspect wallpaper"
                                >
                                  <img
                                    src={url}
                                    alt="Wallpaper thumbnail"
                                    className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Footer: View Profile link */}
                    <div className="pt-2 border-t border-white/[0.06]">
                      <Link
                        href={`/creators/${creator.id}`}
                        className="w-full py-2 px-3.5 rounded-xl text-xs font-medium bg-white/[0.04] group-hover:bg-white/[0.08] text-zinc-300 group-hover:text-white border border-white/[0.08] transition flex items-center justify-between"
                      >
                        <span>View Creator Profile</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search / Filter State (Mirrors Explore Page exactly) */
          <div className="rounded-3xl bg-[#13141C]/50 border border-white/[0.06] p-12 text-center max-w-md mx-auto space-y-4">
            <div className="p-3.5 rounded-2xl bg-white/[0.04] text-zinc-400 border border-white/[0.08] w-fit mx-auto">
              <Users className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3
                className="text-lg font-normal text-[#F4F4F6]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                No creators match your filters
              </h3>
              <p className="text-xs text-[#8E909B] leading-relaxed">
                Try searching with different keywords, selecting another specialty, or clearing filters.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetAll}
              className="px-5 py-2.5 rounded-full bg-white text-zinc-950 font-medium text-xs hover:bg-zinc-200 transition active:scale-95"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Wallora Creator Fellowship / Join Banner (Matches Explore Cards & Spacing) */}
        <section className="rounded-2xl bg-[#13141C] border border-white/[0.08] p-8 sm:p-10 relative overflow-hidden shadow-lg">
          <div className="max-w-2xl relative z-10 space-y-3">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-[#8E909B] uppercase block">
              Creator Fellowship
            </span>
            <h2
              className="text-2xl sm:text-3xl font-normal text-[#F4F4F6]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Publish Your 8K Wallpapers on Wallora
            </h2>
            <p className="text-xs sm:text-sm text-[#8E909B] leading-relaxed max-w-xl">
              Connect your portfolio, receive verified artist status, and distribute native resolution desktop, laptop, and mobile wallpapers to thousands of daily visitors.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowApplyModal(true)}
                className="px-5 py-2.5 rounded-full bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition shadow-sm active:scale-95"
              >
                Apply for Verified Artist Status
              </button>
            </div>
          </div>
          <div className="absolute right-6 -bottom-8 opacity-10 hidden lg:block text-white pointer-events-none">
            <Users className="w-64 h-64" />
          </div>
        </section>
      </main>

      {/* Wallpaper Preview Modal */}
      {selectedWallpaper && (
        <WallpaperModal
          wallpaper={selectedWallpaper}
          allWallpapers={WALLPAPERS}
          onClose={() => setSelectedWallpaper(null)}
          onSelectWallpaper={(w) => setSelectedWallpaper(w)}
        />
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="absolute inset-0" onClick={() => setShowApplyModal(false)} />
          <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#13141C] border border-white/10 shadow-2xl z-10">
            <button
              type="button"
              onClick={() => setShowApplyModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-[11px] font-semibold text-[#8E909B] uppercase tracking-widest block mb-1">
                Artist Onboarding
              </span>
              <h3
                className="text-2xl font-normal text-white"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Apply to Become a Creator
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Join our curated roster of 8K artists, landscape photographers, and 3D environment designers.
              </p>
            </div>

            {appliedSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-center space-y-2">
                <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-semibold text-white">Application Received!</h4>
                <p className="text-xs text-zinc-300">
                  We&apos;ll contact you at your provided portfolio with your creator badge and access key.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                    Your Full Name / Artist Pseudonym
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="e.g. Maya Lin"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                      Desired Handle
                    </label>
                    <input
                      type="text"
                      required
                      value={applicantHandle}
                      onChange={(e) => setApplicantHandle(e.target.value)}
                      placeholder="@mayalin_art"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                      Primary Style
                    </label>
                    <select
                      value={applicantSpecialty}
                      onChange={(e) => setApplicantSpecialty(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#13141C] border border-white/10 text-xs text-white focus:outline-none focus:border-zinc-400"
                    >
                      <option value="Landscape Photography">Landscape Photography</option>
                      <option value="AI Concept Art">AI Concept Art</option>
                      <option value="AMOLED & Minimalist">AMOLED & Minimalist</option>
                      <option value="Cyberpunk & 3D">Cyberpunk & 3D</option>
                      <option value="Astrophotography">Astrophotography</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                    Portfolio / Social URL
                  </label>
                  <input
                    type="url"
                    required
                    value={applicantPortfolio}
                    onChange={(e) => setApplicantPortfolio(e.target.value)}
                    placeholder="https://artstation.com/yourhandle or https://instagram.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition shadow-sm"
                  >
                    Submit Creator Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Drawer and Modals */}
      {isFavoritesOpen && (
        <FavoritesModal
          isOpen={isFavoritesOpen}
          onClose={() => setIsFavoritesOpen(false)}
          favoriteWallpapers={favoriteWallpapers}
          onToggleFavorite={onToggleFavorite}
          onSelectWallpaper={(w) => {
            setIsFavoritesOpen(false);
            setSelectedWallpaper(w);
          }}
          onClearFavorites={clearAllFavorites}
          onNotify={notify}
        />
      )}

      {isAIOpen && (
        <AIEnhancerModal
          isOpen={isAIOpen}
          onClose={() => setIsAIOpen(false)}
          wallpapers={WALLPAPERS}
          onNotify={notify}
        />
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-full bg-zinc-900/95 text-white text-xs font-medium border border-white/20 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      <Footer onNotify={notify} />
    </div>
  );
}
