"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Heart,
  Menu,
  X,
  Compass,
  FolderOpen,
  Users,
  Info,
} from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";

interface NavbarProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  favoritesCount?: number;
  onOpenFavorites?: () => void;
  onOpenUpload?: () => void;
  onOpenAIStudio?: () => void;
  onOpenSettings?: () => void;
  activeNav?: string;
  setActiveNav?: (nav: string) => void;
}

export default function Navbar({
  searchQuery = "",
  setSearchQuery,
  favoritesCount,
}: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { favoritesCount: liveFavoritesCount } = useFavorites();
  const count = favoritesCount !== undefined ? favoritesCount : liveFavoritesCount;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const navLinks = [
    { label: "Explore", href: "/explore", icon: Compass },
    { label: "Collections", href: "/collections", icon: FolderOpen },
    { label: "Creators", href: "/creators", icon: Users },
    { label: "About", href: "/about", icon: Info },
  ];

  const handleSearchChange = (val: string) => {
    setLocalSearch(val);
    if (setSearchQuery) {
      setSearchQuery(val);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      router.push(`/explore?q=${encodeURIComponent(localSearch.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0C10]/90 backdrop-blur-md border-b border-white/[0.08] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Left: Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded-lg py-1 px-1.5 -ml-1.5"
        >
          <span
            className="text-2xl font-bold tracking-tight text-[#F4F4F6] font-serif transition-colors group-hover:text-white"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Wallora
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-1 text-sm font-medium"
        >
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-full transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 ${
                  isActive
                    ? "text-[#F4F4F6] bg-white/[0.08] font-semibold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Search & Favorites */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Desktop Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden sm:flex items-center relative w-56 lg:w-64"
          >
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search wallpapers..."
              className="w-full py-1.5 pl-8 pr-7 bg-[#14161F] text-xs text-[#F4F4F6] placeholder-zinc-500 rounded-full border border-white/[0.08] hover:border-white/[0.15] focus:border-zinc-400 focus:outline-none transition-all"
            />
            {localSearch && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="absolute right-2.5 text-zinc-400 hover:text-white"
                title="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </form>

          {/* Mobile Search Toggle */}
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className="sm:hidden p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.06] transition"
            aria-label="Toggle search input"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Favorites Button */}
          <Link
            href="/favorites"
            suppressHydrationWarning
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 ${
              pathname === "/favorites"
                ? "bg-rose-500/15 text-rose-200 border border-rose-500/30 font-semibold"
                : "bg-[#14161F] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.08]"
            }`}
            title="Saved Favorites"
            aria-label={`View your saved favorites (${count} items)`}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                count > 0 ? "fill-rose-500 text-rose-500" : "text-zinc-400"
              }`}
            />
            <span className="hidden xs:inline">Favorites</span>
            {count > 0 && (
              <span
                suppressHydrationWarning
                className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-[10px] font-mono font-medium text-rose-300 border border-rose-500/30"
              >
                {count}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Dropdown */}
      {searchOpen && (
        <div className="sm:hidden px-4 pb-3 pt-1 border-t border-white/[0.06] bg-[#0B0C10]">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search wallpapers (e.g. nature, minimal)..."
              autoFocus
              className="w-full py-2 pl-8 pr-8 bg-[#14161F] text-xs text-[#F4F4F6] placeholder-zinc-500 rounded-xl border border-white/[0.08] focus:border-zinc-400 focus:outline-none"
            />
            {localSearch && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>
      )}

      {/* Mobile Slide-down Navigation Menu */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden border-t border-white/[0.06] bg-[#0E1017] px-4 py-4 space-y-1 animate-in fade-in"
        >
          {/* Navigation links including Favorites in mobile */}
          {[
            ...navLinks,
            { label: `Favorites (${count})`, href: "/favorites", icon: Heart },
          ].map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                suppressHydrationWarning
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-white/[0.08] text-white font-semibold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                }`}
              >
                <Icon className={`w-4 h-4 ${link.href === "/favorites" && count > 0 ? "text-rose-400 fill-rose-500/30" : "text-zinc-400"}`} />
                <span suppressHydrationWarning>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
