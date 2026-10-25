"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  Layers,
  ArrowRight,
  Plus,
  Search,
  X,
  FolderOpen,
  Trash2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import UploadModal from "@/components/UploadModal";
import AIEnhancerModal from "@/components/AIEnhancerModal";
import SettingsDrawer from "@/components/SettingsDrawer";
import { WALLPAPERS } from "@/data/wallpapers";
import { useCollections, UserCollectionItem } from "@/context/CollectionsContext";
import { useFavorites } from "@/context/FavoritesContext";

type CollectionTab = "curated" | "my-collections";

export default function CollectionsPage() {
  const {
    curatedCollections,
    userCollections,
    createCollection,
    deleteCollection,
  } = useCollections();

  const { favoritesCount } = useFavorites();

  const [activeTab, setActiveTab] = useState<CollectionTab>("curated");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [collectionToDelete, setCollectionToDelete] = useState<UserCollectionItem | null>(null);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [defaultFormat, setDefaultFormat] = useState("PNG");
  const [autoPlayCarousel, setAutoPlayCarousel] = useState(true);

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
    setActiveTab("my-collections");
  };

  const handleDeleteUserCollection = (col: UserCollectionItem) => {
    deleteCollection(col.id);
    notify(`Deleted collection "${col.title}"`);
    setCollectionToDelete(null);
  };

  // Tag filter options
  const tagsList = [
    { id: "all", label: "All Packs" },
    { id: "minimalist", label: "Minimalist & Desk" },
    { id: "nature", label: "Nature & Alpine" },
    { id: "dark", label: "OLED Pure Blacks" },
    { id: "japan", label: "Japanese Streets" },
    { id: "space", label: "Space & Cosmos" },
    { id: "cozy", label: "Cozy & Lo-Fi" },
  ];

  // Filtered Curated collections
  const filteredCurated = useMemo(() => {
    let list = [...curatedCollections];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.subtitle.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedTag !== "all") {
      list = list.filter((c) =>
        c.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    return list;
  }, [curatedCollections, searchQuery, selectedTag]);

  // Filtered User collections
  const filteredUserCollections = useMemo(() => {
    let list = [...userCollections];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.subtitle.toLowerCase().includes(q)
      );
    }

    return list;
  }, [userCollections, searchQuery]);

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#EDEDED] flex flex-col font-sans">
      <Navbar
        favoritesCount={favoritesCount}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenAIStudio={() => setIsAIOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <div className="max-w-[1920px] mx-auto w-full px-4 sm:px-6 lg:px-8 flex-1 flex gap-6">
        <Sidebar
          favoritesCount={favoritesCount}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAIStudio={() => setIsAIOpen(true)}
        />

        <main className="flex-1 min-w-0 py-6 pb-20">
          {/* Header Banner */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
              <div>
                <span className="text-[11px] font-bold tracking-[0.2em] text-amber-400 uppercase block mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Curated Thematic Packs & Custom Sets</span>
                </span>
                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Collections
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl leading-relaxed">
                  Discover handcrafted thematic packs designed for cohesive desktop setups, or create your own custom packs.
                </p>
              </div>

              {/* Action: Create Custom Collection */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2.5 rounded-full bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition shadow-lg flex items-center gap-2 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Collection</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs & Search Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
              {/* Tab Selector */}
              <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#121624] border border-white/[0.08] w-fit">
                <button
                  type="button"
                  onClick={() => setActiveTab("curated")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                    activeTab === "curated"
                      ? "bg-amber-400 text-zinc-950 shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Curated Themes ({curatedCollections.length})</span>
                </button>

                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setActiveTab("my-collections")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                    activeTab === "my-collections"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span suppressHydrationWarning>My Collections ({userCollections.length})</span>
                </button>
              </div>

              {/* Search collections */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter collections..."
                  className="w-full py-1.5 pl-8 pr-7 bg-[#121624] text-xs text-white placeholder-zinc-500 rounded-xl border border-white/[0.08] focus:border-amber-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Tag Filter Pills (Only for Curated Tab) */}
            {activeTab === "curated" && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3 mt-4 border-b border-white/[0.06]">
                {tagsList.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => setSelectedTag(tag.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 transition ${
                      selectedTag === tag.id
                        ? "bg-white text-zinc-950 font-semibold shadow-sm"
                        : "bg-[#131724] text-zinc-400 hover:text-white border border-white/[0.06] hover:border-white/15"
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Curated Themes Tab Content */}
          {activeTab === "curated" && (
            <div>
              {filteredCurated.length === 0 ? (
                <div className="text-center py-20 text-zinc-400 text-sm">
                  No curated collections match your criteria.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCurated.map((col) => {
                    const actualCount = col.wallpaperIds.length;
                    return (
                      <Link
                        key={col.id}
                        href={`/collections/${col.slug}`}
                        className="group rounded-3xl overflow-hidden bg-[#121624] border border-white/[0.08] hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between shadow-xl hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                      >
                        {/* Top Image Banner */}
                        <div className="relative aspect-[16/10] overflow-hidden bg-[#0A0C14]">
                          <img
                            src={col.coverImage}
                            alt={col.title}
                            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#121624] via-black/25 to-black/30" />

                          {/* Top Badges */}
                          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white border border-white/15 flex items-center gap-1.5">
                              <Layers className="w-3 h-3 text-amber-400" />
                              <span>{actualCount} {actualCount === 1 ? "Wallpaper" : "Wallpapers"}</span>
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-amber-500/30">
                              Curated Pack
                            </span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <h2
                              className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors"
                              style={{ fontFamily: "var(--font-playfair)" }}
                            >
                              {col.title}
                            </h2>
                            <p className="text-xs text-zinc-400 leading-relaxed mb-4 line-clamp-2">
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

                          {/* Explore Link Action */}
                          <div className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-white/[0.06] group-hover:bg-amber-400 group-hover:text-zinc-950 text-white border border-white/10 transition-colors flex items-center justify-center gap-2">
                            <span>Explore Pack ({actualCount})</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* My Collections Tab Content */}
          {activeTab === "my-collections" && (
            <div>
              {filteredUserCollections.length === 0 ? (
                /* Empty User Collections State */
                <div className="py-16 px-4 text-center max-w-md mx-auto">
                  <div className="p-4 rounded-3xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 w-fit mx-auto mb-4">
                    <FolderOpen className="w-8 h-8" />
                  </div>
                  <h3
                    className="text-xl font-bold text-white mb-2"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    No Custom Collections Yet
                  </h3>
                  <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                    Create your own personalized sets to organize your favorite aesthetics, dual-monitor pairings, or theme moods.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-5 py-2.5 rounded-full bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition flex items-center gap-2 mx-auto active:scale-95 shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Your First Collection</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Create New Collection Card Shortcut */}
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
                    className="group rounded-3xl p-8 border-2 border-dashed border-white/15 hover:border-indigo-400/60 bg-[#101322]/40 hover:bg-[#101322]/80 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer min-h-[320px]"
                  >
                    <div className="p-4 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4 group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                      Create New Collection
                    </h3>
                    <p className="text-xs text-zinc-400 max-w-xs">
                      Start a fresh wallpaper pack and add items from the catalog.
                    </p>
                  </div>

                  {filteredUserCollections.map((col) => {
                    const actualCount = col.wallpaperIds.length;
                    return (
                      <div
                        key={col.id}
                        className="group rounded-3xl overflow-hidden bg-[#121624] border border-white/[0.08] hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl relative"
                      >
                        {/* Top Image Banner */}
                        <Link
                          href={`/collections/${col.slug}`}
                          className="relative aspect-[16/10] overflow-hidden bg-[#0A0C14] block"
                        >
                          <img
                            src={col.coverImage}
                            alt={col.title}
                            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#121624] via-black/25 to-black/30" />

                          {/* Top Badges */}
                          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white border border-white/15 flex items-center gap-1.5">
                              <Layers className="w-3 h-3 text-indigo-400" />
                              <span>{actualCount} {actualCount === 1 ? "Wallpaper" : "Wallpapers"}</span>
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 backdrop-blur-md text-[10px] font-bold text-indigo-300 border border-indigo-500/30">
                              Custom Set
                            </span>
                          </div>
                        </Link>

                        {/* Card Body */}
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <Link
                                href={`/collections/${col.slug}`}
                                className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors"
                                style={{ fontFamily: "var(--font-playfair)" }}
                              >
                                {col.title}
                              </Link>

                              {/* Delete button (Only for custom user collections!) */}
                              <button
                                type="button"
                                onClick={() => setCollectionToDelete(col)}
                                className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                                title="Delete this collection"
                                aria-label={`Delete collection ${col.title}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <p className="text-xs text-zinc-400 leading-relaxed mb-4 line-clamp-2">
                              {col.subtitle || "Custom wallpaper collection"}
                            </p>
                          </div>

                          <Link
                            href={`/collections/${col.slug}`}
                            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-indigo-600 text-white border border-white/10 transition-colors flex items-center justify-center gap-2 mt-4"
                          >
                            <span>Open Collection ({actualCount})</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

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
          <div className="relative w-full max-w-lg bg-[#121624] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl z-10">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    id="create-collection-title"
                    className="text-xl font-bold text-white tracking-tight"
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
                  className="w-full py-2.5 px-4 bg-[#0A0C14] text-xs text-white placeholder-zinc-500 rounded-xl border border-white/10 focus:border-indigo-400 focus:outline-none transition"
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
                  className="w-full py-2.5 px-4 bg-[#0A0C14] text-xs text-white placeholder-zinc-500 rounded-xl border border-white/10 focus:border-indigo-400 focus:outline-none transition resize-none"
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
                  className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition active:scale-95"
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
          <div className="relative w-full max-w-md bg-[#121624] border border-rose-500/30 rounded-3xl p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
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

      {/* Extra Modals */}
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

      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        defaultFormat={defaultFormat}
        setDefaultFormat={setDefaultFormat}
        autoPlayCarousel={autoPlayCarousel}
        setAutoPlayCarousel={setAutoPlayCarousel}
        onClearFavorites={() => {}}
        onNotify={notify}
      />

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
