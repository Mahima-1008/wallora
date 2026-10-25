"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  MapPin,
  Check,
  UserPlus,
  UserCheck,
  Share2,
  Copy,
  Download,
  Heart,
  Eye,
  SlidersHorizontal,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Layers,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WallpaperCard from "@/components/WallpaperCard";
import WallpaperModal from "@/components/WallpaperModal";
import FavoritesModal from "@/components/FavoritesModal";
import UploadModal from "@/components/UploadModal";
import AIEnhancerModal from "@/components/AIEnhancerModal";
import SettingsDrawer from "@/components/SettingsDrawer";
import { Creator, CREATORS } from "@/data/creators";
import { Wallpaper, WALLPAPERS } from "@/data/wallpapers";
import { useFollow } from "@/context/FollowContext";
import { useFavorites } from "@/context/FavoritesContext";
import { getRealCreatorMetrics } from "@/lib/creatorUtils";

interface CreatorProfileClientProps {
  creator: Creator;
  initialWallpapers: Wallpaper[];
  allWallpapers?: Wallpaper[];
}

export default function CreatorProfileClient({
  creator,
  initialWallpapers,
  allWallpapers = WALLPAPERS,
}: CreatorProfileClientProps) {
  const { isFollowing, toggleFollow } = useFollow();
  const following = isFollowing(creator.id);

  const { favorites, favoriteWallpapers, toggleFavorite: onToggleFavorite, clearAllFavorites } = useFavorites();

  // Modals state
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [defaultFormat, setDefaultFormat] = useState("PNG");
  const [autoPlayCarousel, setAutoPlayCarousel] = useState(true);

  // Sorting
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "likes" | "resolution">("popular");

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const metrics = useMemo(() => {
    return getRealCreatorMetrics(creator);
  }, [creator]);

  // Handle follow toggle with feedback
  const handleFollowClick = () => {
    const newState = toggleFollow(creator.id, creator.name);
    notify(
      newState
        ? `Following ${creator.name}. You will see their new wallpapers first.`
        : `Unfollowed ${creator.name}.`
    );
  };

  // Copy profile link
  const handleCopyLink = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        notify("Creator profile link copied to clipboard!");
      }
    } catch {
      notify("Failed to copy link");
    }
  };

  // Sort wallpapers
  const sortedWallpapers = useMemo(() => {
    const list = [...initialWallpapers];
    if (sortBy === "recent") {
      list.sort((a, b) => (b.recentlyAdded ? 1 : 0) - (a.recentlyAdded ? 1 : 0));
    } else if (sortBy === "popular") {
      list.sort((a, b) => b.downloads - a.downloads);
    } else if (sortBy === "likes") {
      list.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === "resolution") {
      const getP = (w: Wallpaper) => (w.resolution === "8K" ? 4 : w.resolution === "4K" ? 3 : 2);
      list.sort((a, b) => getP(b) - getP(a));
    }
    return list;
  }, [initialWallpapers, sortBy]);

  // Other curated creators
  const relatedCreators = useMemo(() => {
    return CREATORS.filter((c) => c.id !== creator.id).slice(0, 3);
  }, [creator.id]);

  const adjustedFollowerCount = creator.followers
    ? creator.followers + (following ? 1 : 0)
    : following ? 1 : 0;

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#EDEDED] flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenAIStudio={() => setIsAIOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Profile Cover Header */}
      <div className="relative w-full h-72 sm:h-80 md:h-96 overflow-hidden bg-[#111422]">
        <img
          src={creator.coverImage}
          alt={`${creator.name} cover`}
          className="w-full h-full object-cover object-center scale-105 filter blur-[1px] brightness-75"
        />
        {/* Editorial Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-[#090A0F]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090A0F]/80 via-transparent to-[#090A0F]/80" />

        {/* Back Link Breadcrumb */}
        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <Link
            href="/creators"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-xs font-medium text-zinc-300 hover:text-white border border-white/10 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Creators</span>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-28 relative z-20 pb-24 flex-1">
        {/* Creator Info Card */}
        <div className="rounded-3xl bg-[#111422]/90 backdrop-blur-xl border border-white/10 p-6 sm:p-8 md:p-10 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            {/* Avatar & Identifiers */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
              <div className="relative shrink-0">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-amber-400/80 shadow-2xl bg-zinc-900"
                />
                {creator.verified && (
                  <span
                    className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center border-2 border-[#111422] shadow"
                    title="Verified Creator"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                )}
              </div>

              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <h1
                    className="text-2xl sm:text-3xl md:text-4xl font-normal text-white tracking-tight"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {creator.name}
                  </h1>
                  {creator.featured && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[11px] font-semibold text-amber-300">
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                  <span className="font-mono text-zinc-300">{creator.handle}</span>
                  {creator.location && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                        {creator.location}
                      </span>
                    </>
                  )}
                </div>

                {creator.specialty && (
                  <div className="pt-1">
                    <span className="inline-block text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {creator.specialty}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 self-start shrink-0">
              <button
                type="button"
                onClick={handleFollowClick}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold transition flex items-center gap-2 shadow-lg active:scale-95 ${
                  following
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                    : "bg-white text-zinc-950 hover:bg-zinc-200"
                }`}
                aria-pressed={following}
                aria-label={following ? `Unfollow ${creator.name}` : `Follow ${creator.name}`}
              >
                {following ? (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Follow Creator</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2.5 rounded-full bg-[#1A1F30] hover:bg-[#232940] text-zinc-300 hover:text-white border border-white/10 transition active:scale-95"
                title="Copy Profile Link"
                aria-label="Copy Profile Link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Biography */}
          {creator.bio && (
            <div className="pt-2 border-t border-white/[0.06]">
              <p className="text-xs sm:text-sm text-zinc-300 max-w-3xl leading-relaxed">
                {creator.bio}
              </p>
            </div>
          )}

          {/* Social Links (only rendered when actually present) */}
          {creator.socials && Object.keys(creator.socials).length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mr-1">
                Connect:
              </span>
              {creator.socials.twitter && (
                <a
                  href={creator.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] hover:bg-white/10 text-xs text-zinc-300 hover:text-white border border-white/10 transition"
                >
                  <span>X / Twitter</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                </a>
              )}
              {creator.socials.instagram && (
                <a
                  href={creator.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] hover:bg-white/10 text-xs text-zinc-300 hover:text-white border border-white/10 transition"
                >
                  <span>Instagram</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                </a>
              )}
              {creator.socials.artstation && (
                <a
                  href={creator.socials.artstation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] hover:bg-white/10 text-xs text-zinc-300 hover:text-white border border-white/10 transition"
                >
                  <span>ArtStation</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                </a>
              )}
            </div>
          )}

          {/* Real Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/[0.06]">
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.04]">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-medium">
                Wallpapers on Wallora
              </span>
              <span className="text-lg sm:text-xl font-bold text-white font-mono mt-0.5 block">
                {metrics.publishedCount}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.04]">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-medium">
                Total Downloads
              </span>
              <span className="text-lg sm:text-xl font-bold text-amber-400 font-mono mt-0.5 block">
                {metrics.catalogDownloads.toLocaleString()}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.04]">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-medium">
                Total Likes
              </span>
              <span className="text-lg sm:text-xl font-bold text-rose-400 font-mono mt-0.5 block">
                {metrics.catalogLikes.toLocaleString()}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.04]">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-medium">
                Community Followers
              </span>
              <span className="text-lg sm:text-xl font-bold text-white font-mono mt-0.5 block">
                {adjustedFollowerCount > 0 ? adjustedFollowerCount.toLocaleString() : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Published Works Header & Controls */}
        <div className="mt-12 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 block mb-1">
              Creator Catalog
            </span>
            <h2
              className="text-2xl sm:text-3xl font-normal text-white"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Published Wallpapers ({initialWallpapers.length})
            </h2>
          </div>

          {/* Sort Tabs */}
          {initialWallpapers.length > 1 && (
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#131724] border border-white/10 self-start sm:self-auto text-xs">
              <span className="px-3 text-zinc-400 font-medium hidden md:inline">Sort by:</span>
              <button
                type="button"
                onClick={() => setSortBy("popular")}
                className={`px-3 py-1.5 rounded-full transition font-medium ${
                  sortBy === "popular"
                    ? "bg-white text-zinc-950 font-semibold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Most Popular
              </button>
              <button
                type="button"
                onClick={() => setSortBy("recent")}
                className={`px-3 py-1.5 rounded-full transition font-medium ${
                  sortBy === "recent"
                    ? "bg-white text-zinc-950 font-semibold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Recently Added
              </button>
              <button
                type="button"
                onClick={() => setSortBy("likes")}
                className={`px-3 py-1.5 rounded-full transition font-medium ${
                  sortBy === "likes"
                    ? "bg-white text-zinc-950 font-semibold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Most Liked
              </button>
              <button
                type="button"
                onClick={() => setSortBy("resolution")}
                className={`px-3 py-1.5 rounded-full transition font-medium ${
                  sortBy === "resolution"
                    ? "bg-white text-zinc-950 font-semibold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Resolution
              </button>
            </div>
          )}
        </div>

        {/* Published Wallpapers Grid */}
        {sortedWallpapers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedWallpapers.map((wallpaper) => (
              <WallpaperCard
                key={wallpaper.id}
                wallpaper={wallpaper}
                onSelect={(w) => setSelectedWallpaper(w)}
                onNotify={notify}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-[#111422] border border-white/10 text-center space-y-4">
            <Layers className="w-10 h-10 text-zinc-500 mx-auto" />
            <h3 className="text-lg font-medium text-white">No Catalog Uploads Yet</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              {creator.name} is preparing new 8K visual assets for release. Check back soon or follow this creator to receive drop alerts.
            </p>
          </div>
        )}

        {/* Featured Portfolio Preview (from creator topWallpapers) */}
        {creator.topWallpapers && creator.topWallpapers.length > 0 && (
          <section className="mt-16 pt-10 border-t border-white/[0.06]">
            <div className="mb-6">
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 block mb-1">
                Portfolio Showcase
              </span>
              <h3
                className="text-xl sm:text-2xl font-normal text-white"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Signature Works by {creator.name}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {creator.topWallpapers.map((url, idx) => {
                const catalogMatch = allWallpapers.find((w) => w.imageUrl === url);
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (catalogMatch) setSelectedWallpaper(catalogMatch);
                    }}
                    className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 group cursor-pointer shadow-lg hover:border-amber-400/50 transition-all duration-300"
                  >
                    <img
                      src={url}
                      alt={`${creator.name} portfolio ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-xs font-medium text-white flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-amber-300" />
                        <span>Inspect in Studio</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Related Artists Strip */}
        <section className="mt-16 pt-10 border-t border-white/[0.06]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 block mb-1">
                Community Discovery
              </span>
              <h3
                className="text-xl sm:text-2xl font-normal text-white"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                More Creators on Wallora
              </h3>
            </div>
            <Link
              href="/creators"
              className="text-xs text-amber-400 hover:text-amber-300 font-medium transition flex items-center gap-1"
            >
              <span>Explore All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedCreators.map((rel) => (
              <Link
                key={rel.id}
                href={`/creators/${rel.id}`}
                className="p-5 rounded-2xl bg-[#121624] border border-white/[0.08] hover:border-white/20 transition flex items-center gap-4 group shadow-md"
              >
                <img
                  src={rel.avatar}
                  alt={rel.name}
                  className="w-14 h-14 rounded-xl object-cover border border-amber-400/40 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-semibold text-white group-hover:text-amber-300 transition truncate">
                      {rel.name}
                    </h4>
                    {rel.verified && (
                      <Check className="w-3 h-3 text-amber-400 shrink-0 stroke-[3]" />
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                    {rel.specialty}
                  </p>
                  <span className="text-[10px] font-mono text-zinc-500 mt-1 block">
                    {rel.downloads.toLocaleString()} downloads
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Reusable Modals */}
      {selectedWallpaper && (
        <WallpaperModal
          wallpaper={selectedWallpaper}
          allWallpapers={allWallpapers}
          onClose={() => setSelectedWallpaper(null)}
          onSelectWallpaper={(w) => setSelectedWallpaper(w)}
        />
      )}

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
          wallpapers={allWallpapers}
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
