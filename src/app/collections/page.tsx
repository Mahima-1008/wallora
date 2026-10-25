"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  X,
  RotateCcw,
  Sparkles,
  Plus,
  Layers,
  ArrowRight,
  FolderOpen,
  Trash2,
  SlidersHorizontal,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCollections, UserCollectionItem, AnyCollection } from "@/context/CollectionsContext";
import { useFavorites } from "@/context/FavoritesContext";

type FilterTab =
  | "all"
  | "curated"
  | "custom"
  | "minimalist"
  | "nature"
  | "dark"
  | "japan"
  | "space"
  | "cozy";

type SortOption = "curated" | "wallpapers" | "title";

export default function CollectionsPage() {
  const {
    curatedCollections,
    userCollections,
    createCollection,
    deleteCollection,
  } = useCollections();

  const { favoritesCount } = useFavorites();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [sortBy, setSortBy] = useState<SortOption>("curated");

  // Create & Delete Modals State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [collectionToDelete, setCollectionToDelete] = useState<UserCollectionItem | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const created = createCollection(newTitle, newDescription);
    notify(`Created collection "${created.title}"`);
    setNewTitle("");
    setNewDescription("");
    setIsCreateModalOpen(false);
    setActiveFilter("custom");
  };

  const handleDeleteUserCollection = (col: UserCollectionItem) => {
    deleteCollection(col.id);
    notify(`Deleted collection "${col.title}"`);
    setCollectionToDelete(null);
  };

  // Quick Filter Chips List
  const quickFilters = [
    { id: "all", label: "All Collections" },
    {
      id: "curated",
      label: `Curated Packs (${curatedCollections.length})`,
    },
    {
      id: "custom",
      label: `My Collections (${userCollections.length})`,
      isCustom: true,
    },
    { id: "minimalist", label: "Minimalist & Desk" },
    { id: "nature", label: "Nature & Alpine" },
    { id: "dark", label: "AMOLED Dark" },
    { id: "japan", label: "Japanese Streets" },
    { id: "space", label: "Space & Cosmos" },
    { id: "cozy", label: "Cozy & Lo-Fi" },
  ];

  // Combined and filtered collections
  const filteredCollections = useMemo(() => {
    // 1. Gather all collections
    let list: AnyCollection[] = [];

    if (activeFilter === "curated") {
      list = [...curatedCollections];
    } else if (activeFilter === "custom") {
      list = [...userCollections];
    } else {
      list = [...curatedCollections, ...userCollections];
    }

    // 2. Tag / specialty filter
    if (
      activeFilter !== "all" &&
      activeFilter !== "curated" &&
      activeFilter !== "custom"
    ) {
      list = list.filter((c) =>
        c.tags.some(
          (t) => t.toLowerCase() === activeFilter.toLowerCase()
        )
      );
    }

    // 3. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.subtitle.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // 4. Sorting
    if (sortBy === "wallpapers") {
      list.sort((a, b) => b.wallpaperIds.length - a.wallpaperIds.length);
    } else if (sortBy === "title") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Default: curated first, then custom
      list.sort((a, b) => {
        if (a.isCurated && !b.isCurated) return -1;
        if (!a.isCurated && b.isCurated) return 1;
        return 0;
      });
    }

    return list;
  }, [curatedCollections, userCollections, activeFilter, searchQuery, sortBy]);

  const totalPacks = curatedCollections.length + userCollections.length;
  const isFiltered = Boolean(searchQuery.trim() || activeFilter !== "all" || sortBy !== "curated");

  const handleResetAll = () => {
    setSearchQuery("");
    setActiveFilter("all");
    setSortBy("curated");
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F4F4F6] flex flex-col font-sans selection:bg-white/20 selection:text-white">
      {/* Navbar */}
      <Navbar
        favoritesCount={favoritesCount}
      />

      {/* Main Container - Mirrored with Explore Page Width & Spacing */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 space-y-6">
        {/* 1. Header & Prominent Search Section */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-semibold tracking-[0.2em] text-[#8E909B] uppercase">
                  Curated Packs &amp; Custom Sets
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-mono text-zinc-400">
                  {totalPacks} Thematic Collections
                </span>
              </div>
              <h1
                className="text-3xl sm:text-4xl font-normal text-[#F4F4F6] tracking-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Collections
              </h1>
              <p className="text-xs sm:text-sm text-[#8E909B] mt-1 max-w-xl">
                Discover handcrafted thematic packs designed for cohesive desktop workspaces, or organize your own custom collections.
              </p>
            </div>

            {/* Action: Create Collection */}
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-zinc-200 text-xs font-medium border border-white/[0.1] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 active:scale-95 shadow-sm shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-zinc-300" />
              <span>Create Collection</span>
            </button>
          </div>

          {/* Prominent Search Bar (Mirrors Explore Page exactly) */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search collections by theme, mood, or aesthetic (e.g. 'Minimal Workspaces', 'Space', 'Dark', 'Japan')..."
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
              {[
                "Minimal Workspaces",
                "Nature Escapes",
                "Dark Wallpapers",
                "Japanese Streets",
                "Space & Astronomy",
                "Cozy Interiors",
              ].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setSearchQuery(term)}
                  className="hover:text-white underline decoration-white/20 underline-offset-2 transition"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* 2. Quick-Filter Chips Bar (Mirrors Explore Page exactly) */}
        <section className="w-full select-none">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {quickFilters.map((qf) => {
              const isActive = activeFilter === qf.id;
              return (
                <button
                  key={qf.id}
                  type="button"
                  suppressHydrationWarning={qf.isCustom}
                  onClick={() => setActiveFilter(qf.id as FilterTab)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 ${
                    isActive
                      ? "bg-[#F4F4F6] text-[#0B0C10] border-white shadow-sm font-semibold"
                      : "bg-[#13141C] text-[#8E909B] border-white/[0.07] hover:text-white hover:border-white/20"
                  }`}
                >
                  <span suppressHydrationWarning={qf.isCustom}>{qf.label}</span>
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
                {filteredCollections.length}
              </strong>{" "}
              of{" "}
              <strong className="text-[#F4F4F6] font-mono">{totalPacks}</strong>{" "}
              collections
            </span>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#8E909B] hidden sm:inline">Sort:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="py-1.5 pl-3 pr-7 bg-[#13141C] text-xs text-[#F4F4F6] rounded-xl border border-white/[0.08] hover:border-white/20 focus:outline-none cursor-pointer"
                >
                  <option value="curated" className="bg-[#111217]">Curators&apos; Pick</option>
                  <option value="wallpapers" className="bg-[#111217]">Most Wallpapers</option>
                  <option value="title" className="bg-[#111217]">Alphabetical (A–Z)</option>
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

              {activeFilter !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.08] text-white border border-white/10 text-xs capitalize">
                  <span>
                    Filter: {quickFilters.find((f) => f.id === activeFilter)?.label || activeFilter}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveFilter("all")}
                    className="hover:text-rose-400 transition"
                    aria-label="Remove filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {sortBy !== "curated" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.08] text-white border border-white/10 text-xs">
                  <span>Sort: {sortBy === "wallpapers" ? "Most Wallpapers" : "Alphabetical"}</span>
                  <button
                    type="button"
                    onClick={() => setSortBy("curated")}
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

        {/* 4. Collections Grid (Mirrored with Explore Card Styling) */}
        {filteredCollections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create New Collection Card Shortcut (Shows when on 'My Collections' or 'All' without active text search) */}
            {(activeFilter === "custom" || (!searchQuery && activeFilter === "all")) && (
              <div
                onClick={() => setIsCreateModalOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIsCreateModalOpen(true);
                  }
                }}
                className="group rounded-2xl p-6 border-2 border-dashed border-white/10 hover:border-white/25 bg-[#13141C]/40 hover:bg-[#13141C]/80 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer min-h-[340px]"
              >
                <div className="p-4 rounded-full bg-white/[0.06] text-zinc-300 border border-white/10 mb-4 group-hover:scale-110 group-hover:bg-white/[0.1] transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
                <h3
                  className="text-lg font-normal text-white mb-1 group-hover:text-amber-200 transition-colors"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Create New Collection
                </h3>
                <p className="text-xs text-[#8E909B] max-w-xs leading-relaxed">
                  Start a custom wallpaper pack and curate your favorite 8K desktop backgrounds.
                </p>
              </div>
            )}

            {filteredCollections.map((col) => {
              const actualCount = col.wallpaperIds.length;
              const isCurated = col.isCurated;

              return (
                <div
                  key={col.id}
                  className="group rounded-2xl overflow-hidden bg-[#13141C] border border-white/[0.08] hover:border-white/20 transition-all duration-300 flex flex-col justify-between shadow-lg hover:-translate-y-1"
                >
                  {/* Top Image Banner with 16:10 Aspect Ratio */}
                  <Link
                    href={`/collections/${col.slug}`}
                    className="relative aspect-[16/10] overflow-hidden bg-[#0A0C14] block"
                  >
                    <img
                      src={col.coverImage}
                      alt={col.title}
                      className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#13141C] via-black/20 to-black/20" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-zinc-300 border border-white/10 flex items-center gap-1.5">
                        <Layers className="w-3 h-3 text-amber-400" />
                        <span>{actualCount} {actualCount === 1 ? "Wallpaper" : "Wallpapers"}</span>
                      </span>

                      <div className="flex items-center gap-1.5">
                        {isCurated ? (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/15 backdrop-blur-md text-[10px] font-medium text-amber-300 border border-amber-500/25">
                            Curated Pack
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 backdrop-blur-md text-[10px] font-medium text-indigo-300 border border-indigo-500/25">
                            Custom Set
                          </span>
                        )}

                        {/* Delete button (Only for custom user collections) */}
                        {!isCurated && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCollectionToDelete(col as UserCollectionItem);
                            }}
                            className="p-1 rounded-md bg-black/60 backdrop-blur-md text-zinc-400 hover:text-rose-400 border border-white/10 transition"
                            title="Delete collection"
                            aria-label={`Delete ${col.title}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <Link
                        href={`/collections/${col.slug}`}
                        className="block group/title"
                      >
                        <h2
                          className="text-lg font-normal text-[#F4F4F6] group-hover/title:text-white transition-colors line-clamp-1"
                          style={{ fontFamily: "var(--font-playfair)" }}
                        >
                          {col.title}
                        </h2>
                      </Link>

                      <p className="text-xs text-[#8E909B] leading-relaxed line-clamp-2 mt-1">
                        {col.subtitle || "Curated wallpaper pack on Wallora."}
                      </p>

                      {/* Tag Chips */}
                      {col.tags && col.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
                          {col.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] text-zinc-400 border border-white/[0.06]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Explore Link Action */}
                    <Link
                      href={`/collections/${col.slug}`}
                      className="w-full py-2 px-3.5 rounded-xl text-xs font-medium bg-white/[0.04] group-hover:bg-white/[0.08] text-zinc-300 group-hover:text-white border border-white/[0.08] transition flex items-center justify-between"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search / Filter State (Mirrors Explore Page exactly) */
          <div className="rounded-3xl bg-[#13141C]/50 border border-white/[0.06] p-12 text-center max-w-md mx-auto space-y-4">
            <div className="p-3.5 rounded-2xl bg-white/[0.04] text-zinc-400 border border-white/[0.08] w-fit mx-auto">
              <FolderOpen className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3
                className="text-lg font-normal text-[#F4F4F6]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                No collections found
              </h3>
              <p className="text-xs text-[#8E909B] leading-relaxed">
                We couldn&apos;t find any collections matching your active filters and search keywords.
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
      </main>

      <Footer onNotify={notify} />

      {/* Create Collection Modal */}
      {isCreateModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-collection-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
        >
          <div
            className="absolute inset-0"
            onClick={() => setIsCreateModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-[#13141C] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl z-10">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white/[0.06] text-white border border-white/10">
                  <FolderOpen className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3
                    id="create-collection-title"
                    className="text-xl font-normal text-white tracking-tight"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    New Collection
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Create a personalized wallpaper collection
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCollection} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Collection Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Midnight Focus, Lo-Fi Coffee"
                  autoFocus
                  className="w-full py-2.5 px-4 bg-[#0A0C14] text-xs text-white placeholder-zinc-500 rounded-xl border border-white/10 focus:border-zinc-400 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Short Description (Optional)
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="What is the mood or aesthetic of this pack?"
                  className="w-full py-2.5 px-4 bg-[#0A0C14] text-xs text-white placeholder-zinc-500 rounded-xl border border-white/10 focus:border-zinc-400 focus:outline-none transition resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-medium text-zinc-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="px-5 py-2.5 rounded-full bg-white hover:bg-zinc-200 disabled:opacity-50 text-zinc-950 font-semibold text-xs shadow-lg transition active:scale-95"
                >
                  Create Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Collection Confirmation Modal */}
      {collectionToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
        >
          <div
            className="absolute inset-0"
            onClick={() => setCollectionToDelete(null)}
          />
          <div className="relative w-full max-w-md bg-[#13141C] border border-rose-500/30 rounded-3xl p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white tracking-tight">
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
                &ldquo;{collectionToDelete.title}&rdquo;
              </strong>
              ?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCollectionToDelete(null)}
                className="px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteUserCollection(collectionToDelete)}
                className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/20 transition"
              >
                Delete Pack
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#141826]/95 border border-white/15 text-white text-xs font-medium shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-in slide-in-from-bottom-5">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
