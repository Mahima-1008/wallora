"use client";

import React from "react";
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

interface SidebarProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
  favoritesCount: number;
  onOpenUpload: () => void;
  onOpenSettings: () => void;
  onOpenAIStudio: () => void;
}

export default function Sidebar({
  activeNav,
  setActiveNav,
  favoritesCount,
  onOpenUpload,
  onOpenSettings,
  onOpenAIStudio,
}: SidebarProps) {
  const mainNavItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "explore", label: "Explore", icon: Compass },
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "collections", label: "Collections", icon: Grid },
    { id: "categories", label: "Categories", icon: Folder },
    { id: "favorites", label: "Favorites", icon: Heart, badge: favoritesCount },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 sticky top-18 h-[calc(100vh-4.5rem)] py-6 pr-4 select-none border-r border-white/[0.04]">
      {/* Main Navigation */}
      <div className="space-y-1.5 flex-1">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveNav(item.id);
                if (item.id === "home") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else if (item.id === "explore" || item.id === "trending") {
                  document.getElementById("wallpapers-section")?.scrollIntoView({ behavior: "smooth" });
                } else if (item.id === "collections") {
                  document.getElementById("collections-section")?.scrollIntoView({ behavior: "smooth" });
                } else if (item.id === "categories") {
                  document.getElementById("categories-section")?.scrollIntoView({ behavior: "smooth" });
                }
              }}
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
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* AI Enhancer highlight in sidebar */}
        <div className="pt-4">
          <button
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
          onClick={onOpenUpload}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/[0.04] transition group"
        >
          <UploadCloud className="w-4 h-4 text-zinc-400 group-hover:text-amber-400 transition" />
          <span>Upload</span>
        </button>

        <button
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
