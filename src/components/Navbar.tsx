"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Sparkles,
  Heart,
  Upload,
  Menu,
  X,
  SlidersHorizontal,
  Compass,
  FolderOpen,
  Wand2,
  Check,
  User,
  Users,
  Info,
} from "lucide-react";

interface NavbarProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenUpload: () => void;
  onOpenAIStudio: () => void;
  onOpenSettings: () => void;
  activeNav?: string;
  setActiveNav?: (nav: string) => void;
}

export default function Navbar({
  searchQuery = "",
  setSearchQuery,
  favoritesCount,
  onOpenFavorites,
  onOpenUpload,
  onOpenAIStudio,
  onOpenSettings,
}: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const quickSearchSuggestions = [
    "Cyberpunk",
    "Minimal",
    "Sunset",
    "Alpine Lake",
    "Porsche",
    "OLED Dark",
    "Nebula",
    "Jellyfish",
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
    }
  };

  const handleSelectSuggestion = (term: string) => {
    setLocalSearch(term);
    if (setSearchQuery) {
      setSearchQuery(term);
    }
    router.push(`/explore?q=${encodeURIComponent(term)}`);
  };

  const navLinks = [
    { label: "Explore", href: "/explore", icon: Compass },
    { label: "Collections", href: "/collections", icon: FolderOpen },
    { label: "Creators", href: "/creators", icon: Users },
    { label: "About", href: "/about", icon: Info },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#090A0F]/85 backdrop-blur-xl border-b border-white/[0.06] transition-all">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group text-left">
              <div className="relative">
                <span
                  className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif transition-colors group-hover:text-amber-400"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Wallora
                </span>
                <span className="absolute -top-1 -right-2.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              </div>
              <span className="hidden xl:inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sparkles className="w-2.5 h-2.5" /> AI 8K
              </span>
            </Link>
          </div>

          {/* Center Search Bar */}
          <div className="flex-1 max-w-2xl mx-auto hidden md:block relative">
            <form onSubmit={handleSearchSubmit}>
              <div
                className={`relative flex items-center transition-all duration-200 rounded-full bg-[#131722]/90 border ${
                  isSearchFocused
                    ? "border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-1 ring-amber-400/30"
                    : "border-white/[0.08] hover:border-white/[0.18]"
                }`}
              >
                <Search className="w-4 h-4 ml-4 text-zinc-400 pointer-events-none" />
                <input
                  id="search-wallpapers-input"
                  type="text"
                  value={localSearch}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 220)}
                  placeholder="Search wallpapers (e.g. nature, anime, city, dark)..."
                  className="w-full py-2.5 pl-3 pr-20 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
                />
                {localSearch ? (
                  <button
                    type="button"
                    onClick={() => handleSearchChange("")}
                    className="mr-3 p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 text-xs transition"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="mr-3 flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] text-zinc-500 bg-white/[0.04] border border-white/[0.06] select-none">
                    <span className="text-xs">⌘</span>K
                  </div>
                )}
              </div>
            </form>

            {/* Quick Search Suggestions Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 p-3 rounded-2xl bg-[#121624] border border-white/[0.1] shadow-2xl backdrop-blur-2xl z-50">
                <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 px-1">
                  Popular Searches
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {quickSearchSuggestions.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectSuggestion(term);
                      }}
                      className="px-3 py-1 rounded-full bg-white/[0.05] hover:bg-amber-500/15 hover:text-amber-300 hover:border-amber-500/30 text-xs text-zinc-300 border border-white/[0.06] transition"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Navigation Links & Sign In */}
          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="hidden lg:flex items-center gap-1 sm:gap-2 text-sm text-zinc-300 font-medium">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-full transition ${
                      isActive
                        ? "text-white bg-white/10 font-semibold"
                        : "hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <button
                type="button"
                onClick={onOpenAIStudio}
                className="px-3 py-1.5 rounded-full transition flex items-center gap-1.5 text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 border border-amber-500/20"
              >
                <Wand2 className="w-3.5 h-3.5" />
                AI Enhancer
              </button>
            </nav>

            {/* Favorites Icon Button with badge */}
            <button
              type="button"
              onClick={onOpenFavorites}
              className="relative p-2.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition"
              title="Saved Favorites"
            >
              <Heart className={`w-4 h-4 ${favoritesCount > 0 ? "fill-rose-500 text-rose-500" : ""}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-lg animate-pulse">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Sign In Button / User Avatar */}
            {userLoggedIn ? (
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <button
                  type="button"
                  onClick={() => setUserLoggedIn(false)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-xs font-medium text-zinc-200 transition"
                  title="Click to sign out"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[10px] font-bold text-black">
                    M
                  </div>
                  <span>Pro Member</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowSignInModal(true)}
                className="px-5 py-2 rounded-full bg-white text-zinc-950 font-semibold text-xs sm:text-sm shadow-md hover:bg-zinc-200 active:scale-95 transition-all duration-150"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 lg:hidden transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="px-4 pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative flex items-center rounded-full bg-[#131722] border border-white/[0.08]">
              <Search className="w-4 h-4 ml-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search 8K wallpapers..."
                className="w-full py-2 pl-3 pr-8 bg-transparent text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  className="mr-3 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Mobile Slide-down Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/[0.06] bg-[#0c0e17] px-4 py-4 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/explore"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] text-xs font-medium text-zinc-200"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                Explore Gallery
              </Link>
              <Link
                href="/collections"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] text-xs font-medium text-zinc-200"
              >
                <FolderOpen className="w-4 h-4 text-sky-400" />
                Collections
              </Link>
              <Link
                href="/creators"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] text-xs font-medium text-zinc-200"
              >
                <Users className="w-4 h-4 text-violet-400" />
                Creators
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] text-xs font-medium text-zinc-200"
              >
                <Info className="w-4 h-4 text-emerald-400" />
                About Wallora
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={() => {
                  onOpenAIStudio();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 text-xs font-medium text-amber-300 border border-amber-500/20"
              >
                <Wand2 className="w-4 h-4" />
                AI Enhancer
              </button>
              <button
                type="button"
                onClick={() => {
                  onOpenUpload();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] text-xs font-medium text-zinc-200"
              >
                <Upload className="w-4 h-4 text-emerald-400" />
                Upload Wallpaper
              </button>
            </div>
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
              <button type="button" onClick={onOpenSettings} className="flex items-center gap-1.5 hover:text-white">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Settings & Quality
              </button>
              <button type="button" onClick={() => setShowSignInModal(true)} className="text-amber-400 font-medium">
                {userLoggedIn ? "Account Profile" : "Sign In to Wallora"}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Sign In / Sign Up Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#121624] border border-white/10 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowSignInModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-6">
              <span
                className="text-3xl font-bold font-serif text-white block mb-1"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Wallora
              </span>
              <p className="text-xs sm:text-sm text-zinc-400">
                Unlock 8K uncompressed downloads, custom device mockups & unlimited favorites.
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  setUserLoggedIn(true);
                  setShowSignInModal(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                Continue with Demo Account
              </button>

              <button
                type="button"
                onClick={() => {
                  setUserLoggedIn(true);
                  setShowSignInModal(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/10 text-zinc-200 font-medium text-sm transition"
              >
                Sign in with Google
              </button>
            </div>

            <div className="mt-6 pt-5 border-t border-white/[0.08] text-center text-[11px] text-zinc-500">
              Free lifetime access. No credit card required.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
