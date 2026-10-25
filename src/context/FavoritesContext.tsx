"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
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

const FavoritesContext = createContext<FavoritesContextType | null>(null);

const DEFAULT_INITIAL_FAVORITES = ["wall-1", "wall-3", "wall-7"];

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return DEFAULT_INITIAL_FAVORITES;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore
    }
    return DEFAULT_INITIAL_FAVORITES;
  });

  const [isLoaded] = useState(true);

  // Sync initial default favorites to storage on mount if empty
  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_FAVORITES));
      }
    } catch {
      // Ignore
    }
  }, []);

  // Listen to cross-component and cross-tab storage events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setFavorites(parsed);
          }
        } catch {
          // Ignore
        }
      }
    };

    const handleCustomSync = (e: Event) => {
      const customEvent = e as CustomEvent<string[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        setFavorites(customEvent.detail);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(SYNC_EVENT, handleCustomSync);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(SYNC_EVENT, handleCustomSync);
    };
  }, []);

  // Helper to persist and broadcast changes
  const persistAndBroadcast = useCallback((newFavs: string[]) => {
    setFavorites(newFavs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavs));
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
      isLoaded,
    }),
    [
      favorites,
      isFavorite,
      toggleFavorite,
      addFavorite,
      removeFavorite,
      clearAllFavorites,
      favoriteWallpapers,
      isLoaded,
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
