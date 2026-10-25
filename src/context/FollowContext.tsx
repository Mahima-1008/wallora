"use client";

import React, { createContext, useContext, useMemo, useCallback, useSyncExternalStore } from "react";

interface FollowContextType {
  following: string[];
  isFollowing: (creatorId: string) => boolean;
  toggleFollow: (creatorId: string, creatorName?: string) => boolean;
  followingCount: number;
}

const STORAGE_KEY = "wallora_followed_creators";
const SYNC_EVENT = "wallora_followed_creators_synced";

const DEFAULT_FOLLOWED: string[] = ["creator-1", "creator-4"];

let followingCache: string[] = DEFAULT_FOLLOWED;
let lastRawStorage: string | null = null;

function getFollowSnapshot(): string[] {
  if (typeof window === "undefined") {
    return DEFAULT_FOLLOWED;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== lastRawStorage) {
      lastRawStorage = raw;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          followingCache = parsed;
        } else {
          followingCache = DEFAULT_FOLLOWED;
        }
      } else {
        followingCache = DEFAULT_FOLLOWED;
      }
    }
  } catch {
    // Ignore storage parse errors
  }
  return followingCache;
}

function getServerFollowSnapshot(): string[] {
  return DEFAULT_FOLLOWED;
}

function subscribeFollow(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(SYNC_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(SYNC_EVENT, callback);
  };
}

const FollowContext = createContext<FollowContextType | null>(null);

export function FollowProvider({ children }: { children: React.ReactNode }) {
  const following = useSyncExternalStore(
    subscribeFollow,
    getFollowSnapshot,
    getServerFollowSnapshot
  );

  const persistAndBroadcast = useCallback((newFollows: string[]) => {
    followingCache = newFollows;
    lastRawStorage = JSON.stringify(newFollows);
    try {
      localStorage.setItem(STORAGE_KEY, lastRawStorage);
      window.dispatchEvent(
        new CustomEvent<string[]>(SYNC_EVENT, { detail: newFollows })
      );
    } catch {
      // Ignore local storage quota errors
    }
  }, []);

  const isFollowing = useCallback(
    (creatorId: string) => {
      return following.includes(creatorId);
    },
    [following]
  );

  const toggleFollow = useCallback(
    (creatorId: string): boolean => {
      let nextState: boolean;
      let updated: string[];

      if (following.includes(creatorId)) {
        updated = following.filter((id) => id !== creatorId);
        nextState = false;
      } else {
        updated = [...following, creatorId];
        nextState = true;
      }

      persistAndBroadcast(updated);
      return nextState;
    },
    [following, persistAndBroadcast]
  );

  const value = useMemo<FollowContextType>(
    () => ({
      following,
      isFollowing,
      toggleFollow,
      followingCount: following.length,
    }),
    [following, isFollowing, toggleFollow]
  );

  return (
    <FollowContext.Provider value={value}>{children}</FollowContext.Provider>
  );
}

export function useFollow(): FollowContextType {
  const context = useContext(FollowContext);
  if (!context) {
    throw new Error("useFollow must be used within a FollowProvider");
  }
  return context;
}
