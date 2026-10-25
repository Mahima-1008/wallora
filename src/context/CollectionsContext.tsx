"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { Wallpaper, WALLPAPERS, CURATED_COLLECTIONS, CollectionItem } from "@/data/wallpapers";

export interface UserCollectionItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  tags: string[];
  wallpaperIds: string[];
  wallpaperCount: number;
  isCurated: false;
  createdAt: number;
}

export type AnyCollection = CollectionItem | UserCollectionItem;

interface CollectionsContextType {
  curatedCollections: CollectionItem[];
  userCollections: UserCollectionItem[];
  allCollections: AnyCollection[];
  createCollection: (title: string, description?: string) => UserCollectionItem;
  deleteCollection: (id: string) => void;
  addWallpaperToCollection: (collectionId: string, wallpaperId: string) => void;
  removeWallpaperFromCollection: (collectionId: string, wallpaperId: string) => void;
  isWallpaperInCollection: (collectionId: string, wallpaperId: string) => boolean;
  getCollectionBySlugOrId: (slugOrId: string) => AnyCollection | null;
  getCollectionWallpapers: (collection: AnyCollection) => Wallpaper[];
}

const STORAGE_KEY = "wallora_user_collections";
const SYNC_EVENT = "wallora_user_collections_synced";

const CollectionsContext = createContext<CollectionsContextType | null>(null);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function CollectionsProvider({ children }: { children: React.ReactNode }) {
  const [userCollections, setUserCollections] = useState<UserCollectionItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore
    }
    return [];
  });

  // Listen to cross-tab and custom events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setUserCollections(parsed);
          }
        } catch {
          // Ignore
        }
      }
    };

    const handleCustomSync = (e: Event) => {
      const customEvent = e as CustomEvent<UserCollectionItem[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        setUserCollections(customEvent.detail);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(SYNC_EVENT, handleCustomSync);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(SYNC_EVENT, handleCustomSync);
    };
  }, []);

  const persist = useCallback((items: UserCollectionItem[]) => {
    setUserCollections(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      window.dispatchEvent(
        new CustomEvent<UserCollectionItem[]>(SYNC_EVENT, { detail: items })
      );
    } catch {
      // Ignore
    }
  }, []);

  const createCollection = useCallback(
    (title: string, description = ""): UserCollectionItem => {
      const trimmedTitle = title.trim();
      const baseSlug = slugify(trimmedTitle) || `collection-${Date.now()}`;
      const uniqueId = `user-col-${Date.now()}`;
      const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

      const newCollection: UserCollectionItem = {
        id: uniqueId,
        slug,
        title: trimmedTitle,
        subtitle: description.trim() || "Custom user collection",
        description: description.trim() || "A custom personal collection created on Wallora.",
        coverImage: "/wallpapers/hero_sunset_room.jpg",
        tags: ["Custom", "User Pack"],
        wallpaperIds: [],
        wallpaperCount: 0,
        isCurated: false,
        createdAt: Date.now(),
      };

      persist([newCollection, ...userCollections]);
      return newCollection;
    },
    [userCollections, persist]
  );

  const deleteCollection = useCallback(
    (id: string) => {
      persist(userCollections.filter((c) => c.id !== id));
    },
    [userCollections, persist]
  );

  const addWallpaperToCollection = useCallback(
    (collectionId: string, wallpaperId: string) => {
      const updated = userCollections.map((col) => {
        if (col.id === collectionId) {
          if (!col.wallpaperIds.includes(wallpaperId)) {
            const nextIds = [...col.wallpaperIds, wallpaperId];
            // Auto update cover image if first wallpaper
            const targetWallpaper = WALLPAPERS.find((w) => w.id === wallpaperId);
            const coverImage = col.wallpaperIds.length === 0 && targetWallpaper
              ? targetWallpaper.imageUrl
              : col.coverImage;

            return {
              ...col,
              wallpaperIds: nextIds,
              wallpaperCount: nextIds.length,
              coverImage,
            };
          }
        }
        return col;
      });
      persist(updated);
    },
    [userCollections, persist]
  );

  const removeWallpaperFromCollection = useCallback(
    (collectionId: string, wallpaperId: string) => {
      const updated = userCollections.map((col) => {
        if (col.id === collectionId) {
          const nextIds = col.wallpaperIds.filter((id) => id !== wallpaperId);
          return {
            ...col,
            wallpaperIds: nextIds,
            wallpaperCount: nextIds.length,
          };
        }
        return col;
      });
      persist(updated);
    },
    [userCollections, persist]
  );

  const isWallpaperInCollection = useCallback(
    (collectionId: string, wallpaperId: string) => {
      const col = userCollections.find((c) => c.id === collectionId);
      return col ? col.wallpaperIds.includes(wallpaperId) : false;
    },
    [userCollections]
  );

  const allCollections = useMemo<AnyCollection[]>(() => {
    return [...CURATED_COLLECTIONS, ...userCollections];
  }, [userCollections]);

  const getCollectionBySlugOrId = useCallback(
    (slugOrId: string): AnyCollection | null => {
      const lower = slugOrId.toLowerCase();
      // Check curated first
      const curatedMatch = CURATED_COLLECTIONS.find(
        (c) => c.slug.toLowerCase() === lower || c.id.toLowerCase() === lower
      );
      if (curatedMatch) return curatedMatch;

      // Check user collections
      const userMatch = userCollections.find(
        (c) => c.slug.toLowerCase() === lower || c.id.toLowerCase() === lower
      );
      return userMatch || null;
    },
    [userCollections]
  );

  const getCollectionWallpapers = useCallback((col: AnyCollection): Wallpaper[] => {
    return WALLPAPERS.filter((w) => col.wallpaperIds.includes(w.id));
  }, []);

  const value = useMemo(
    () => ({
      curatedCollections: CURATED_COLLECTIONS,
      userCollections,
      allCollections,
      createCollection,
      deleteCollection,
      addWallpaperToCollection,
      removeWallpaperFromCollection,
      isWallpaperInCollection,
      getCollectionBySlugOrId,
      getCollectionWallpapers,
    }),
    [
      userCollections,
      allCollections,
      createCollection,
      deleteCollection,
      addWallpaperToCollection,
      removeWallpaperFromCollection,
      isWallpaperInCollection,
      getCollectionBySlugOrId,
      getCollectionWallpapers,
    ]
  );

  return (
    <CollectionsContext.Provider value={value}>
      {children}
    </CollectionsContext.Provider>
  );
}

export function useCollections() {
  const context = useContext(CollectionsContext);
  if (!context) {
    throw new Error("useCollections must be used within a CollectionsProvider");
  }
  return context;
}
