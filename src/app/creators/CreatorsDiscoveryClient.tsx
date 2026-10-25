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
  ArrowUpRight,
  SlidersHorizontal,
  Flame,
  Clock,
  Layers,
  Heart,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import WallpaperModal from "@/components/WallpaperModal";
import UploadModal from "@/components/UploadModal";
import AIEnhancerModal from "@/components/AIEnhancerModal";
import SettingsDrawer from "@/components/SettingsDrawer";
import FavoritesModal from "@/components/FavoritesModal";
import { CREATORS, Creator } from "@/data/creators";
import { WALLPAPERS, Wallpaper } from "@/data/wallpapers";
import { useFollow } from "@/context/FollowContext";
import { useFavorites } from "@/context/FavoritesContext";
import { getRealCreatorMetrics } from "@/lib/creatorUtils";

const SPECIALTY_FILTERS = [
  { id: "all", label: "All Specialties" },
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
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [defaultFormat, setDefaultFormat] = useState("PNG");
  const [autoPlayCarousel, setAutoPlayCarousel] = useState(true);

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

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#EDEDED] flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
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
              Creator Directory
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Discover Wallora Creators
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">
                  Browse verified artists, astrophotographers, and 3D environment designers. Inspect their signature 8K portfolios and follow for weekly background drops.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowApplyModal(true)}
                className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition shadow-lg active:scale-95 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Join as a Creator</span>
              </button>
            </div>
          </div>

          {/* Controls: Search, Specialty Filter Pills & Sorting */}
          <div className="space-y-3.5 mb-8">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Creator Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-3.5 h-3.5 ml-3.5 absolute top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search creators by name, specialty, bio..."
                  className="w-full py-2 pl-9 pr-8 bg-[#131724] border border-white/10 rounded-full text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    aria-label="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Sort Controls & Following Toggle */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Following Toggle */}
                <button
                  type="button"
                  onClick={() => setShowFollowingOnly(!showFollowingOnly)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1.5 border ${
                    showFollowingOnly
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-[#131724] text-zinc-400 hover:text-white border-white/[0.08]"
                  }`}
                  aria-pressed={showFollowingOnly}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Following Only</span>
                </button>

                {/* Sort Selector */}
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#131724] border border-white/10 rounded-full text-xs text-zinc-400">
                  <SlidersHorizontal className="w-3 h-3 text-zinc-400" />
                  <span className="hidden sm:inline text-zinc-500">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "popular" | "recent" | "works" | "followers" | "alphabetical")}
                    className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1"
                  >
                    <option value="popular" className="bg-[#131724] text-white">Most Popular (Downloads)</option>
                    <option value="recent" className="bg-[#131724] text-white">Recently Active</option>
                    <option value="works" className="bg-[#131724] text-white">Most Works Published</option>
                    <option value="followers" className="bg-[#131724] text-white">Most Followers</option>
                    <option value="alphabetical" className="bg-[#131724] text-white">Alphabetical (A–Z)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Specialty Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {SPECIALTY_FILTERS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedSpecialty(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 transition ${
                    selectedSpecialty === tab.id
                      ? "bg-white text-zinc-950 font-semibold shadow-sm"
                      : "bg-[#131724] text-zinc-400 hover:text-white border border-white/[0.06]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filter Counter & Reset */}
          {(searchQuery || selectedSpecialty !== "all" || showFollowingOnly) && (
            <div className="flex items-center justify-between py-2 px-3 mb-6 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-zinc-400">
              <span>
                Showing <strong className="text-white">{filteredCreators.length}</strong> matching creators
              </span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSpecialty("all");
                  setShowFollowingOnly(false);
                }}
                className="text-amber-400 hover:text-amber-300 font-medium transition"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Creators Grid */}
          {filteredCreators.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCreators.map((creator) => {
                const following = isFollowing(creator.id);
                const adjustedFollowers = creator.followers + (following ? 1 : 0);

                return (
                  <div
                    key={creator.id}
                    className="rounded-3xl overflow-hidden bg-[#121624] border border-white/[0.08] hover:border-white/20 transition-all duration-300 flex flex-col justify-between shadow-xl group hover:-translate-y-1"
                  >
                    {/* Cover Header */}
                    <div className="relative h-28 overflow-hidden bg-[#181C2B]">
                      <img
                        src={creator.coverImage}
                        alt={`${creator.name} backdrop`}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121624] via-black/40 to-transparent" />
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
                                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center p-0.5 border-2 border-[#121624]"
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
                              className="text-lg font-bold text-white tracking-tight"
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
                        <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-3">
                          {creator.specialty}
                        </span>

                        {/* Short Bio */}
                        <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2 mb-4">
                          {creator.bio}
                        </p>

                        {/* Real Data Metrics */}
                        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-black/40 border border-white/[0.04] text-center mb-4">
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
                          className="w-full py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white transition flex items-center justify-center gap-1.5 group/btn"
                        >
                          <span>View Full Profile & Catalog</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-[#111422] border border-white/10 text-center space-y-4">
              <Users className="w-12 h-12 text-zinc-500 mx-auto" />
              <h3 className="text-lg font-medium text-white">No creators match your active filters</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Try searching with different keywords, selecting a different specialty, or clearing the filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSpecialty("all");
                  setShowFollowingOnly(false);
                }}
                className="px-5 py-2 rounded-full bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition"
              >
                Show All Creators
              </button>
            </div>
          )}

          {/* Wallora Creator Fellowship / Join Banner */}
          <section className="mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#141828] via-[#111420] to-[#171c2f] border border-amber-400/30 relative overflow-hidden shadow-2xl">
            <div className="max-w-2xl relative z-10 space-y-4">
              <span className="text-xs font-bold tracking-[0.2em] text-amber-400 uppercase">
                Wallora Creator Fellowship
              </span>
              <h2
                className="text-3xl sm:text-4xl font-normal text-white"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Publish Your 8K Wallpapers on Wallora
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Connect your portfolio, receive artist verified status, and distribute native resolution desktop, laptop, and mobile wallpapers to thousands of daily visitors.
              </p>
              <button
                type="button"
                onClick={() => setShowApplyModal(true)}
                className="px-6 py-3 rounded-full bg-white text-zinc-950 font-bold text-xs sm:text-sm hover:bg-zinc-200 transition shadow-xl"
              >
                Apply for Verified Artist Status
              </button>
            </div>
            <div className="absolute right-4 -bottom-10 opacity-15 hidden lg:block text-amber-400 pointer-events-none">
              <Users className="w-80 h-80" />
            </div>
          </section>
        </main>
      </div>

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
          <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#121624] border border-white/10 shadow-2xl z-10">
            <button
              type="button"
              onClick={() => setShowApplyModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block mb-1">
                Artist Onboarding
              </span>
              <h3
                className="text-2xl font-bold text-white"
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
                <h4 className="text-sm font-bold text-white">Application Received!</h4>
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                      Primary Style
                    </label>
                    <select
                      value={applicantSpecialty}
                      onChange={(e) => setApplicantSpecialty(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#181C2B] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs transition shadow-lg"
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

      {isUploadOpen && (
        <UploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onAddWallpaper={(w) => {
            setIsUploadOpen(false);
            notify(`Uploaded "${w.title}"!`);
          }}
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

      {isSettingsOpen && (
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
