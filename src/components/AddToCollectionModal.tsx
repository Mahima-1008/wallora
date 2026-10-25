"use client";

import React, { useState } from "react";
import {
  X,
  Plus,
  Check,
  FolderOpen,
  FolderPlus,
} from "lucide-react";
import { Wallpaper } from "@/data/wallpapers";
import { useCollections, UserCollectionItem } from "@/context/CollectionsContext";

interface AddToCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallpaper: Wallpaper;
  onNotify: (msg: string) => void;
}

export default function AddToCollectionModal({
  isOpen,
  onClose,
  wallpaper,
  onNotify,
}: AddToCollectionModalProps) {
  const {
    userCollections,
    createCollection,
    addWallpaperToCollection,
    removeWallpaperFromCollection,
    isWallpaperInCollection,
  } = useCollections();

  const [newCollectionTitle, setNewCollectionTitle] = useState("");
  const [isCreatingInline, setIsCreatingInline] = useState(false);

  if (!isOpen) return null;

  const handleToggleInCollection = (col: UserCollectionItem) => {
    const inCol = isWallpaperInCollection(col.id, wallpaper.id);
    if (inCol) {
      removeWallpaperFromCollection(col.id, wallpaper.id);
      onNotify(`Removed "${wallpaper.title}" from "${col.title}"`);
    } else {
      addWallpaperToCollection(col.id, wallpaper.id);
      onNotify(`Added "${wallpaper.title}" to "${col.title}"`);
    }
  };

  const handleCreateAndAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionTitle.trim()) return;

    const newCol = createCollection(newCollectionTitle.trim());
    addWallpaperToCollection(newCol.id, wallpaper.id);
    onNotify(`Created "${newCol.title}" and added "${wallpaper.title}"`);
    setNewCollectionTitle("");
    setIsCreatingInline(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="collection-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#121624] border border-white/15 rounded-3xl p-6 shadow-2xl z-10 flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="collection-modal-title"
                className="text-lg font-bold text-white tracking-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Save to Collection
              </h3>
              <p className="text-xs text-zinc-400">
                Organize &ldquo;{wallpaper.title}&rdquo; into your custom packs
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Existing User Collections List */}
        <div className="max-h-60 overflow-y-auto space-y-2 py-1 pr-1">
          {userCollections.length === 0 ? (
            <div className="text-center py-6 px-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
              <p className="text-xs text-zinc-400 mb-2">
                You haven&apos;t created any custom collections yet.
              </p>
              <button
                type="button"
                onClick={() => setIsCreatingInline(true)}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                + Create your first pack
              </button>
            </div>
          ) : (
            userCollections.map((col) => {
              const inCollection = isWallpaperInCollection(col.id, wallpaper.id);
              return (
                <div
                  key={col.id}
                  onClick={() => handleToggleInCollection(col)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleToggleInCollection(col);
                    }
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                    inCollection
                      ? "bg-indigo-950/40 border-indigo-500/40 text-white"
                      : "bg-[#0B0D16] border-white/[0.08] hover:border-white/20 text-zinc-300 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-xl ${
                        inCollection
                          ? "bg-indigo-500/20 text-indigo-400"
                          : "bg-white/[0.04] text-zinc-400"
                      }`}
                    >
                      <FolderOpen className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="text-xs font-semibold truncate">
                        {col.title}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        {col.wallpaperCount} {col.wallpaperCount === 1 ? "item" : "items"}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-1.5 rounded-full border transition ${
                      inCollection
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                        : "bg-white/[0.04] text-zinc-400 border-white/10"
                    }`}
                  >
                    {inCollection ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Create New Collection Inline */}
        {isCreatingInline ? (
          <form
            onSubmit={handleCreateAndAdd}
            className="pt-2 border-t border-white/[0.08] space-y-2"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                autoFocus
                required
                value={newCollectionTitle}
                onChange={(e) => setNewCollectionTitle(e.target.value)}
                placeholder="Pack name (e.g., Late Night Focus)"
                className="flex-1 py-2 px-3 bg-[#0A0C14] text-xs text-white placeholder-zinc-500 rounded-xl border border-white/10 focus:border-indigo-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!newCollectionTitle.trim()}
                className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreatingInline(false);
                  setNewCollectionTitle("");
                }}
                className="p-2 rounded-xl text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        ) : (
          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsCreatingInline(true)}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Collection</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-full bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
