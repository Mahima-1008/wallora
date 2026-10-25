"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  TrendingUp,
  Grid,
  Folder,
  Heart,
  UploadCloud,
  Settings,
  Sparkles,
} from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";

interface SidebarProps {
  activeNav?: string;
  setActiveNav?: (nav: string) => void;
  favoritesCount?: number;
  onOpenFavorites?: () => void;
  onOpenUpload: () => void;
  onOpenSettings: () => void;
  onOpenAIStudio: () => void;
}

export default function Sidebar({
  favoritesCount,
  onOpenFavorites: _onOpenFavorites,
  onOpenUpload,
  onOpenSettings,
  onOpenAIStudio,
}: SidebarProps) {
  const pathname = usePathname();
  const { favoritesCount: liveFavoritesCount } = useFavorites();
  const count = favoritesCount !== undefined ? favoritesCount : liveFavoritesCount;

  const mainNavItems = [
    { id: "home", label: "Home", icon: Home, href: "/" },
    { id: "explore", label: "Explore", icon: Compass, href: "/explore" },
    { id: "trending", label: "Trending", icon: TrendingUp, href: "/explore?sort=trending" },
    { id: "collections", label: "Collections", icon: Grid, href: "/collections" },
    { id: "categories", label: "Categories", icon: Folder, href: "/explore#categories" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 sticky top-18 h-[calc(100vh-4.5rem)] py-6 pr-4 select-none border-r border-white/[0.04]">
      {/* Main Navigation */}
      <div className="space-y-1.5 flex-1">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href.split("?")[0].split("#")[0]);

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? "bg-[#1E2230] text-white shadow-sm font-semibold"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? "text-amber-400" : "text-zinc-400 group-hover:text-zinc-200"
                  }`}
                />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}

        {/* Favorites item */}
        <Link
          href="/favorites"
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all group ${
            pathname === "/favorites"
              ? "bg-[#1E2230] text-white shadow-sm font-semibold"
              : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]"
          }`}
        >
          <div className="flex items-center gap-3">
            <Heart
              className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                pathname === "/favorites" || count > 0
                  ? "fill-rose-500 text-rose-500"
                  : "text-zinc-400 group-hover:text-rose-400"
              }`}
            />
            <span>Favorites</span>
          </div>
          {count > 0 && (
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {count}
            </span>
          )}
        </Link>

        {/* AI Enhancer highlight in sidebar */}
        <div className="pt-4">
          <button
            type="button"
            onClick={onOpenAIStudio}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-amber-300/90 bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 transition group"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>AI Upscaler & Studio</span>
          </button>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="pt-6 border-t border-white/[0.06] space-y-1.5">
        <button
          type="button"
          onClick={onOpenUpload}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/[0.04] transition group"
        >
          <UploadCloud className="w-4 h-4 text-zinc-400 group-hover:text-amber-400 transition" />
          <span>Upload</span>
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/[0.04] transition group"
        >
          <Settings className="w-4 h-4 text-zinc-400 group-hover:text-amber-400 transition" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
