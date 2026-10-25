"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  Sparkles,
  Check,
  UserPlus,
  UserCheck,
  Download,
  Heart,
  Globe,
  MapPin,
  ExternalLink,
  Upload,
  X,
  Search,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import WallpaperModal from "@/components/WallpaperModal";
import UploadModal from "@/components/UploadModal";
import AIEnhancerModal from "@/components/AIEnhancerModal";
import SettingsDrawer from "@/components/SettingsDrawer";
import FavoritesModal from "@/components/FavoritesModal";
import Footer from "@/components/Footer";
import { CREATORS, Creator } from "@/data/creators";
import { WALLPAPERS, Wallpaper } from "@/data/wallpapers";
import { useFavorites } from "@/context/FavoritesContext";

export default function CreatorsPage() {
  const [creators, setCreators] = useState<Creator[]>(CREATORS);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [followedIds, setFollowedIds] = useState<string[]>(["creator-1", "creator-4"]);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const {
    favorites,
    favoritesCount,
    favoriteWallpapers,
    toggleFavorite,
    clearAllFavorites,
  } = useFavorites();
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Application form state
  const [applicantName, setApplicantName] = useState("");
  const [applicantHandle, setApplicantHandle] = useState("");
  const [applicantPortfolio, setApplicantPortfolio] = useState("");
  const [applicantSpecialty, setApplicantSpecialty] = useState("AI Concept Art");
  const [appliedSuccess, setAppliedSuccess] = useState(false);

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

  const toggleFollow = (creatorId: string, creatorName: string) => {
    setFollowedIds((prev) => {
      if (prev.includes(creatorId)) {
        notify(`Unfollowed ${creatorName}`);
        return prev.filter((id) => id !== creatorId);
      } else {
        notify(`Followed ${creatorName}! You will receive their weekly wallpaper drops.`);
        return [...prev, creatorId];
      }
    });
  };

  const filteredCreators = useMemo(() => {
    let result = [...creators];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.handle.toLowerCase().includes(q) ||
          c.specialty.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q)
      );
    }

    if (selectedFilter === "featured") {
      result = result.filter((c) => c.featured);
    } else if (selectedFilter === "ai") {
      result = result.filter((c) => c.specialty.toLowerCase().includes("ai") || c.specialty.toLowerCase().includes("concept"));
    } else if (selectedFilter === "photography") {
      result = result.filter((c) => c.specialty.toLowerCase().includes("photo") || c.specialty.toLowerCase().includes("astro"));
    } else if (selectedFilter === "dark") {
      result = result.filter((c) => c.specialty.toLowerCase().includes("oled") || c.specialty.toLowerCase().includes("minimal"));
    }

    return result;
  }, [creators, searchQuery, selectedFilter]);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSuccess(true);
    notify("Application submitted! Our curation team will review your portfolio within 24 hours.");
    setTimeout(() => {
      setShowApplyModal(false);
      setAppliedSuccess(false);
    }, 2000);
  };

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
              Creative Community
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Wallora Creators
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl leading-relaxed">
                  Discover over 1,200 digital artists, prompt engineers, and landscape photographers crafting next-generation 8K backgrounds.
                </p>
              </div>

              <button
                onClick={() => setShowApplyModal(true)}
                className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition shadow-lg active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Join as a Creator</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 mb-8 border-y border-white/[0.06]">
            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {[
                { id: "all", label: "All Creators" },
                { id: "featured", label: "Featured Artists" },
                { id: "ai", label: "AI Concept Art" },
                { id: "photography", label: "Astrophotography & Nature" },
                { id: "dark", label: "OLED & Minimalist" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 transition ${
                    selectedFilter === tab.id
                      ? "bg-white text-zinc-950 font-semibold shadow-sm"
                      : "bg-[#131724] text-zinc-400 hover:text-white border border-white/[0.06]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Creator Search */}
            <div className="relative flex items-center w-full sm:w-64">
              <Search className="w-3.5 h-3.5 ml-3 absolute text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search artists..."
                className="w-full py-1.5 pl-8 pr-3 bg-[#131724] border border-white/10 rounded-full text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 text-zinc-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Creators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCreators.map((creator) => {
              const isFollowed = followedIds.includes(creator.id);
              return (
                <div
                  key={creator.id}
                  className="rounded-3xl overflow-hidden bg-[#121624] border border-white/[0.08] hover:border-white/20 transition-all duration-300 flex flex-col justify-between shadow-xl group hover:-translate-y-1"
                >
                  {/* Cover Header */}
                  <div className="relative h-24 overflow-hidden bg-[#181C2B]">
                    <img
                      src={creator.coverImage}
                      alt={creator.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121624] via-black/40 to-transparent" />
                  </div>

                  {/* Profile Body */}
                  <div className="px-5 pb-5 pt-0 relative flex-1 flex flex-col justify-between">
                    <div>
                      {/* Avatar */}
                      <div className="flex items-end justify-between -mt-10 mb-3">
                        <div className="relative">
                          <img
                            src={creator.avatar}
                            alt={creator.name}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/80 shadow-2xl bg-zinc-900"
                          />
                          {creator.verified && (
                            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center p-0.5 border-2 border-[#121624]">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </div>

                        {/* Follow Button */}
                        <button
                          onClick={() => toggleFollow(creator.id, creator.name)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                            isFollowed
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                              : "bg-white text-zinc-950 hover:bg-zinc-200"
                          }`}
                        >
                          {isFollowed ? (
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
                        <h2
                          className="text-lg font-bold text-white group-hover:text-amber-200 transition-colors"
                          style={{ fontFamily: "var(--font-playfair)" }}
                        >
                          {creator.name}
                        </h2>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          <span className="font-mono">{creator.handle}</span>
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

                      {/* Bio */}
                      <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2 mb-4">
                        {creator.bio}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-black/30 border border-white/[0.04] text-center mb-4">
                        <div>
                          <div className="text-[10px] text-zinc-500 uppercase">Downloads</div>
                          <div className="text-xs font-bold text-white font-mono">
                            {(creator.downloads / 1000).toFixed(0)}k
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-zinc-500 uppercase">Followers</div>
                          <div className="text-xs font-bold text-white font-mono">
                            {(creator.followers / 1000).toFixed(1)}k
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-zinc-500 uppercase">Works</div>
                          <div className="text-xs font-bold text-white font-mono">
                            {creator.wallpapersCount}
                          </div>
                        </div>
                      </div>

                      {/* Mini Wallpapers Showcase Strip */}
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1.5 font-semibold">
                          Featured Creations
                        </span>
                        <div className="grid grid-cols-3 gap-1.5">
                          {creator.topWallpapers.map((url, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                const match = WALLPAPERS.find((w) => w.imageUrl === url);
                                if (match) setSelectedWallpaper(match);
                              }}
                              className="aspect-[16/10] rounded-lg overflow-hidden border border-white/10 hover:border-amber-400 cursor-pointer transition group/thumb"
                            >
                              <img
                                src={url}
                                alt="Wallpaper thumbnail"
                                className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Join Creator Banner */}
          <section className="mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#141828] via-[#111420] to-[#171c2f] border border-amber-400/30 relative overflow-hidden shadow-2xl">
            <div className="max-w-2xl relative z-10 space-y-4">
              <span className="text-xs font-bold tracking-[0.2em] text-amber-400 uppercase">
                Wallora Creator Fellowship
              </span>
              <h2
                className="text-3xl sm:text-4xl font-normal text-white"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Share Your 8K Art with Over 1.5 Million Users
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Receive creator revenue share, verified artist status, early access to the Wallora Diffusion Ultra engine, and unlimited cloud portfolio hosting.
              </p>
              <button
                onClick={() => setShowApplyModal(true)}
                className="px-6 py-3 rounded-full bg-white text-zinc-950 font-bold text-xs sm:text-sm hover:bg-zinc-200 transition shadow-xl"
              >
                Apply for Verified Artist Status
              </button>
            </div>
            <div className="absolute right-4 -bottom-10 opacity-20 hidden lg:block text-amber-400">
              <Users className="w-80 h-80" />
            </div>
          </section>
        </main>
      </div>

      <Footer onNotify={notify} />

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="absolute inset-0" onClick={() => setShowApplyModal(false)} />
          <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#121624] border border-white/10 shadow-2xl z-10">
            <button
              onClick={() => setShowApplyModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10"
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
                Join our curated roster of 8K AI artists, concept designers, and photographers.
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
                      Specialty
                    </label>
                    <select
                      value={applicantSpecialty}
                      onChange={(e) => setApplicantSpecialty(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#121624] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="AI Concept Art">AI Concept Art</option>
                      <option value="Alpine & Nature">Alpine & Nature</option>
                      <option value="Cyberpunk & 3D">Cyberpunk & 3D</option>
                      <option value="OLED Dark">OLED Dark</option>
                      <option value="Astrophotography">Astrophotography</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                    Portfolio Link (ArtStation, Behance, X, or Website)
                  </label>
                  <input
                    type="url"
                    required
                    value={applicantPortfolio}
                    onChange={(e) => setApplicantPortfolio(e.target.value)}
                    placeholder="https://artstation.com/username"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-white text-zinc-950 font-bold text-xs uppercase tracking-wide hover:bg-zinc-200 transition mt-2 shadow-lg"
                >
                  Submit Application
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <WallpaperModal
        wallpaper={selectedWallpaper}
        allWallpapers={WALLPAPERS}
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
        wallpapers={WALLPAPERS}
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
