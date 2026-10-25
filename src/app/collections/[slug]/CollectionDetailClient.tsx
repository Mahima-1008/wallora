"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Share2,
  Check,
  Layers,
  Sparkles,
  Search,
  X,
  Plus,
  Trash2,
  FolderOpen,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WallpaperCard from "@/components/WallpaperCard";
import WallpaperModal from "@/components/WallpaperModal";
import {
  Wallpaper,
  WALLPAPERS,
  CURATED_COLLECTIONS,
} from "@/data/wallpapers";
import { useCollections, AnyCollection } from "@/context/CollectionsContext";
import { useFavorites } from "@/context/FavoritesContext";

type SortOption = "curated" | "downloads" | "title" | "category";

interface CollectionDetailClientProps {
  slug: string;
}

export default function CollectionDetailClient({
  slug,
}: CollectionDetailClientProps) {
  const router = useRouter();
  const {
    getCollectionBySlugOrId,
    getCollectionWallpapers,
    deleteCollection,
    addWallpaperToCollection,
    removeWallpaperFromCollection,
  } = useCollections();

  const { favoritesCount } = useFavorites();

  // Find collection (check context or initial curated collection directly for SSR instant match)
  const collection: AnyCollection | null = useMemo(() => {
    const fromContext = getCollectionBySlugOrId(slug);
    if (fromContext) return fromContext;
    return (
      CURATED_COLLECTIONS.find(
        (c) =>
          Boolean(c.slug) &&
          (c.slug.toLowerCase() === (slug || "").toLowerCase() || c.id === slug)
      ) || null
    );
  }, [slug, getCollectionBySlugOrId]);

  // Modals & UI states
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("curated");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [copiedLink, setCopiedLink] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Raw wallpapers in this collection
  const rawWallpapers = useMemo(() => {
    if (!collection) return [];
    return getCollectionWallpapers(collection);
  }, [collection, getCollectionWallpapers]);

  // Categories present in this collection
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    rawWallpapers.forEach((w) => set.add(w.category));
    return Array.from(set);
  }, [rawWallpapers]);

  // Wallpapers not in this collection (for add modal in custom collections)
  const availableToAdd = useMemo(() => {
    if (!collection || collection.isCurated) return [];
    return WALLPAPERS.filter((w) => !collection.wallpaperIds.includes(w.id));
  }, [collection]);

  // Filtered & Sorted wallpapers for display
  const processedWallpapers = useMemo(() => {
    let list = [...rawWallpapers];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          w.category.toLowerCase().includes(q) ||
          w.tags.some((t) => t.toLowerCase().includes(q)) ||
          w.author.name.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "all") {
      list = list.filter((w) => w.category === selectedCategory);
    }

    switch (sortBy) {
      case "downloads":
        list.sort((a, b) => b.downloads - a.downloads);
        break;
      case "title":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "category":
        list.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case "curated":
      default:
        // Keep order in collection.wallpaperIds
        if (collection) {
          list.sort((a, b) => {
            const indexA = collection.wallpaperIds.indexOf(a.id);
            const indexB = collection.wallpaperIds.indexOf(b.id);
            return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
          });
        }
        break;
    }

    return list;
  }, [rawWallpapers, searchQuery, selectedCategory, sortBy, collection]);

  // Copy shareable link
  const handleCopyLink = async () => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : "";
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      notify("Collection URL copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2400);
    } catch {
      notify("Failed to copy link");
    }
  };

  // Delete custom collection
  const handleDeleteCollection = () => {
    if (!collection || collection.isCurated) return;
    deleteCollection(collection.id);
    notify(`Deleted collection "${collection.title}"`);
    setIsConfirmDeleteOpen(false);
    router.push("/collections");
  };

  // Not Found State
  if (!collection) {
    return (
      <div className="min-h-screen bg-[#090A0F] text-[#EDEDED] flex flex-col font-sans">
        <Navbar favoritesCount={favoritesCount} />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-xl mx-auto">
          <div className="p-4 rounded-3xl bg-white/[0.04] border border-white/10 text-amber-400 mb-4">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h1
            className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Collection Not Found
          </h1>
          <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
            The collection you are looking for may have been moved, renamed, or
            is no longer available.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/collections"
              className="px-5 py-2.5 rounded-full bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition"
            >
              Browse All Collections
            </Link>
            <Link
              href="/explore"
              className="px-5 py-2.5 rounded-full bg-white/[0.08] text-white font-medium text-xs hover:bg-white/15 transition border border-white/10"
            >
              Explore Wallpapers
            </Link>
          </div>
        </main>
        <Footer onNotify={notify} />
      </div>
    );
  }

  const isCurated = collection.isCurated;
  const actualCount = collection.wallpaperIds.length;

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#EDEDED] flex flex-col font-sans">
      <Navbar favoritesCount={favoritesCount} />

      <main className="flex-1 min-w-0 pb-24">
        {/* Collection Hero Banner */}
        <section className="relative overflow-hidden border-b border-white/[0.08] bg-[#0E111C]">
          {/* Background Blurred Ambient Image */}
          <div className="absolute inset-0 pointer-events-none opacity-30 select-none">
            <img
              src={collection.coverImage}
              alt={collection.title}
              className="w-full h-full object-cover blur-3xl scale-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-[#0E111C]/80 to-[#090A0F]/90" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
            {/* Top Back Link & Badges */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Collections</span>
              </Link>

              <div className="flex items-center gap-2">
                {isCurated ? (
                  <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[11px] font-semibold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Curated Pack</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-[11px] font-semibold text-indigo-300 flex items-center gap-1.5">
                    <FolderOpen className="w-3 h-3 text-indigo-400" />
                    <span>User Collection</span>
                  </span>
                )}

                <span className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-medium text-zinc-300 flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-zinc-400" />
                  <span>
                    {actualCount} {actualCount === 1 ? "Wallpaper" : "Wallpapers"}
                  </span>
                </span>
              </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Text Info (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {collection.title}
                </h1>

                <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl">
                  {collection.subtitle}
                </p>

                {collection.description && collection.description !== collection.subtitle && (
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl">
                    {collection.description}
                  </p>
                )}

                {/* Tag Chips */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {collection.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full bg-white/[0.04] text-zinc-300 border border-white/[0.08]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-4">
                  {/* Share / Copy Link */}
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition active:scale-95"
                    title="Copy shareable collection link"
                    aria-label="Copy shareable link for this collection"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share Collection</span>
                      </>
                    )}
                  </button>

                  {/* Custom Collection Management Buttons ONLY (Never show editing controls on curated packs) */}
                  {!isCurated && (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Wallpapers</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsConfirmDeleteOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 text-xs font-medium transition"
                        title="Delete collection"
                        aria-label="Delete this collection"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Pack</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Cover Card Preview (4 cols) */}
              <div className="lg:col-span-4 hidden sm:block">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/15 shadow-2xl group">
                  <img
                    src={collection.coverImage}
                    alt={collection.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-zinc-300 font-mono">
                    <span>Curated Selection</span>
                    <span>8K / 4K UHD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Controls Bar */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
            {/* Left: Search within collection */}
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search inside ${collection.title}...`}
                  className="w-full py-2 pl-9 pr-8 bg-[#121624] text-xs text-white placeholder-zinc-500 rounded-xl border border-white/[0.08] focus:border-amber-400/80 focus:outline-none transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Right: Sort controls & Categories */}
            <div className="flex items-center gap-3">
              {availableCategories.length > 1 && (
                <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      selectedCategory === "all"
                        ? "bg-white text-zinc-950 font-semibold"
                        : "bg-white/[0.04] text-zinc-400 hover:text-white border border-white/[0.06]"
                    }`}
                  >
                    All
                  </button>
                  {availableCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs capitalize transition ${
                        selectedCategory === cat
                          ? "bg-white text-zinc-950 font-semibold"
                          : "bg-white/[0.04] text-zinc-400 hover:text-white border border-white/[0.06]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              {/* Sort Dropdown */}
              <div className="relative flex items-center">
                <span className="text-xs text-zinc-500 mr-2 hidden sm:inline">
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="py-1.5 px-3 bg-[#121624] text-xs text-zinc-200 border border-white/10 rounded-xl focus:border-amber-400/80 focus:outline-none cursor-pointer"
                  aria-label="Sort collection wallpapers"
                >
                  <option value="curated">Curated Order</option>
                  <option value="downloads">Most Downloaded</option>
                  <option value="title">Title (A–Z)</option>
                  <option value="category">Category</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Wallpaper Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {processedWallpapers.length === 0 ? (
            /* Empty State */
            <div className="py-20 flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <div className="p-4 rounded-3xl bg-white/[0.04] border border-white/10 text-zinc-500 mb-4">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                {rawWallpapers.length === 0
                  ? "This pack is currently empty"
                  : "No wallpapers match your search"}
              </h3>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                {rawWallpapers.length === 0
                  ? "Build up this custom pack by adding high-resolution wallpapers from the Wallora catalog."
                  : "Try clearing your filters or searching with different keywords."}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                {!isCurated && rawWallpapers.length === 0 && (
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-5 py-2.5 rounded-full bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Wallpapers to Pack</span>
                  </button>
                )}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                    className="px-4 py-2 rounded-full bg-white/[0.08] text-white text-xs hover:bg-white/15 transition border border-white/10"
                  >
                    Clear Filter
                  </button>
                )}
                <Link
                  href="/explore"
                  className="px-5 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white text-xs border border-white/10 transition"
                >
                  Browse Explore Catalog
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {processedWallpapers.map((wallpaper) => (
                <div key={wallpaper.id} className="relative group">
                  <WallpaperCard
                    wallpaper={wallpaper}
                    onSelect={(w) => setSelectedWallpaper(w)}
                    onNotify={notify}
                  />

                  {/* Remove Button ONLY for User Collections (Never on Curated Collections) */}
                  {!isCurated && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeWallpaperFromCollection(collection.id, wallpaper.id);
                        notify(`Removed "${wallpaper.title}" from pack`);
                      }}
                      className="absolute top-3 left-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-black/80 hover:bg-rose-950/90 text-zinc-300 hover:text-rose-300 border border-white/15 hover:border-rose-500/40 backdrop-blur-md"
                      title="Remove from this collection"
                      aria-label={`Remove ${wallpaper.title} from collection`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer onNotify={notify} />

      {/* Wallpaper Preview & Download Modal */}
      <WallpaperModal
        wallpaper={selectedWallpaper}
        allWallpapers={processedWallpapers.length > 0 ? processedWallpapers : rawWallpapers}
        onClose={() => setSelectedWallpaper(null)}
        onSelectWallpaper={(w) => setSelectedWallpaper(w)}
        onNotify={notify}
      />

      {/* Add Wallpapers Modal for Custom Collections */}
      {!isCurated && isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-wallpapers-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
        >
          <div
            className="absolute inset-0"
            onClick={() => setIsAddModalOpen(false)}
          />
          <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#121624] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col z-10">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <h3
                  id="add-wallpapers-title"
                  className="text-xl font-bold text-white tracking-tight"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Add Wallpapers to {collection.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Select wallpapers from the catalog to include in this custom collection
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition"
                aria-label="Close add wallpapers dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto py-4 min-h-[300px]">
              {availableToAdd.length === 0 ? (
                <div className="text-center py-12 text-zinc-400 text-xs">
                  All available wallpapers are already in this collection!
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {availableToAdd.map((w) => (
                    <div
                      key={w.id}
                      className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#0A0C14] flex flex-col"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={w.thumbnailUrl || w.imageUrl}
                          alt={w.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-2.5 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-semibold text-white truncate">
                            {w.title}
                          </h4>
                          <span className="text-[10px] text-zinc-400 capitalize">
                            {w.category} • {w.resolution}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            addWallpaperToCollection(collection.id, w.id);
                            notify(`Added "${w.title}" to pack`);
                          }}
                          className="mt-2 w-full py-1.5 px-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-medium flex items-center justify-center gap-1.5 transition active:scale-95"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add to Pack</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-white/[0.08] flex justify-end">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-5 py-2 rounded-full bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Collection Confirmation Modal */}
      {!isCurated && isConfirmDeleteOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-delete-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
        >
          <div
            className="absolute inset-0"
            onClick={() => setIsConfirmDeleteOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#121624] border border-rose-500/30 rounded-3xl p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3
                  id="confirm-delete-title"
                  className="text-lg font-bold text-white tracking-tight"
                >
                  Delete Collection?
                </h3>
                <p className="text-xs text-zinc-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Are you sure you want to delete{" "}
              <strong className="text-white font-semibold">
                &ldquo;{collection.title}&rdquo;
              </strong>
              ? The wallpapers inside will remain in the catalog and your favorites.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmDeleteOpen(false)}
                className="px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCollection}
                className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/20 transition"
              >
                Delete Pack
              </button>
            </div>
          </div>
        </div>
      )}

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
