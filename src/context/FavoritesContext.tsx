"use client";

import React, { createContext, useContext, useMemo, useCallback, useSyncExternalStore } from "react";
import { Wallpaper, WALLPAPERS } from "@/data/wallpapers";

interface FavoritesContextType {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => boolean;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  clearAllFavorites: () => void;
  favoritesCount: number;
  favoriteWallpapers: Wallpaper[];
  isLoaded: boolean;
}

const STORAGE_KEY = "wallora_favorites";
const SYNC_EVENT = "wallora_favorites_synced";

const DEFAULT_INITIAL_FAVORITES: string[] = ["wall-1", "wall-3", "wall-7"];

let favoritesCache: string[] = DEFAULT_INITIAL_FAVORITES;
let lastRawStorage: string | null = null;

function getFavoritesSnapshot(): string[] {
  if (typeof window === "undefined") {
    return DEFAULT_INITIAL_FAVORITES;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== lastRawStorage) {
      lastRawStorage = raw;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          favoritesCache = parsed;
        } else {
          favoritesCache = DEFAULT_INITIAL_FAVORITES;
        }
      } else {
        favoritesCache = DEFAULT_INITIAL_FAVORITES;
      }
    }
  } catch {
    // Ignore storage errors
  }
  return favoritesCache;
}

function getServerFavoritesSnapshot(): string[] {
  return DEFAULT_INITIAL_FAVORITES;
}

function subscribeFavorites(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(SYNC_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(SYNC_EVENT, callback);
  };
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const favorites = useSyncExternalStore(
    subscribeFavorites,
    getFavoritesSnapshot,
    getServerFavoritesSnapshot
  );

  // Helper to persist and broadcast changes
  const persistAndBroadcast = useCallback((newFavs: string[]) => {
    favoritesCache = newFavs;
    lastRawStorage = JSON.stringify(newFavs);
    try {
      localStorage.setItem(STORAGE_KEY, lastRawStorage);
      window.dispatchEvent(
        new CustomEvent<string[]>(SYNC_EVENT, { detail: newFavs })
      );
    } catch {
      // Storage unavailable or quota exceeded
    }
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (id: string): boolean => {
      let next: string[];
      let isNowFav: boolean;
      if (favorites.includes(id)) {
        next = favorites.filter((favId) => favId !== id);
        isNowFav = false;
      } else {
        next = [...favorites, id];
        isNowFav = true;
      }
      persistAndBroadcast(next);
      return isNowFav;
    },
    [favorites, persistAndBroadcast]
  );

  const addFavorite = useCallback(
    (id: string) => {
      if (!favorites.includes(id)) {
        persistAndBroadcast([...favorites, id]);
      }
    },
    [favorites, persistAndBroadcast]
  );

  const removeFavorite = useCallback(
    (id: string) => {
      if (favorites.includes(id)) {
        persistAndBroadcast(favorites.filter((favId) => favId !== id));
      }
    },
    [favorites, persistAndBroadcast]
  );

  const clearAllFavorites = useCallback(() => {
    persistAndBroadcast([]);
  }, [persistAndBroadcast]);

  const favoriteWallpapers = useMemo(() => {
    return WALLPAPERS.filter((w) => favorites.includes(w.id));
  }, [favorites]);

  const value = useMemo(
    () => ({
      favorites,
      isFavorite,
      toggleFavorite,
      addFavorite,
      removeFavorite,
      clearAllFavorites,
      favoritesCount: favorites.length,
      favoriteWallpapers,
      isLoaded: true,
    }),
    [
      favorites,
      isFavorite,
      toggleFavorite,
      addFavorite,
      removeFavorite,
      clearAllFavorites,
      favoriteWallpapers,
    ]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
