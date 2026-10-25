"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Heart,
  Share2,
  Sparkles,
  Monitor,
  Smartphone,
  Laptop,
  Maximize2,
  Copy,
  Check,
  ChevronRight,
  Palette,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Layers,
  Home,
  FolderPlus,
} from "lucide-react";
import { Wallpaper } from "@/data/wallpapers";
import { useFavorites } from "@/context/FavoritesContext";
import AddToCollectionModal from "@/components/AddToCollectionModal";
import {
  WallpaperDownloadVersion,
  DownloadProgress,
  getAvailableResolutions,
  downloadWallpaper,
  slugifyTitle,
} from "@/lib/wallpaperUtils";
import { getCreatorProfileHref } from "@/lib/creatorUtils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface WallpaperDetailClientProps {
  wallpaper: Wallpaper;
  allWallpapers: Wallpaper[];
}

type DeviceMode = "fit" | "laptop" | "phone" | "desktop" | "zoom";

export default function WallpaperDetailClient({
  wallpaper,
  allWallpapers,
}: WallpaperDetailClientProps) {
  // Device & Preview state
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("fit");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Resolution selector
  const availableVersions = useMemo(() => {
    return getAvailableResolutions(wallpaper);
  }, [wallpaper]);

  const [selectedVersionId, setSelectedVersionId] = useState<string>(() => {
    const has4K = availableVersions.find((v) => v.id === "4k");
    return has4K ? "4k" : availableVersions[0]?.id || "original";
  });

  const activeVersion = useMemo(() => {
    return (
      availableVersions.find((v) => v.id === selectedVersionId) ||
      availableVersions[0] ||
      null
    );
  }, [availableVersions, selectedVersionId]);

  // Download state
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  // Centralized favorites context
  const { isFavorite: checkFavorite, toggleFavorite: contextToggleFavorite, favoritesCount } = useFavorites();
  const isFavorite = checkFavorite(wallpaper.id);

  const toggleFavorite = () => {
    const nextState = contextToggleFavorite(wallpaper.id);
    notify(nextState ? `Saved "${wallpaper.title}" to favorites` : `Removed "${wallpaper.title}" from favorites`);
  };

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddToColOpen, setIsAddToColOpen] = useState(false);
  const notify = (msg: string) => setToastMessage(msg);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Copy Link Feedback
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleCopyLink = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
      setCopiedLink(true);
      notify("Wallpaper link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      notify(`Link: ${url}`);
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: `${wallpaper.title} | Wallora`,
          text: `Download "${wallpaper.title}" high-resolution wallpaper`,
          url: window.location.href,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  const copyColorCode = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopiedColor(hex);
    notify(`Copied color: ${hex}`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const copyAIPrompt = () => {
    navigator.clipboard?.writeText(wallpaper.aiPrompt);
    setCopiedPrompt(true);
    notify("AI prompt copied to clipboard!");
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  // Download Handler
  const handleDownload = async (customVersion?: WallpaperDownloadVersion) => {
    const targetVersion = customVersion || activeVersion;
    if (!targetVersion) return;

    setDownloadSuccessMessage(null);
    try {
      await downloadWallpaper(wallpaper, targetVersion, (progress) => {
        setDownloadProgress(progress);
      });

      const success = `Downloaded "${wallpaper.title}" (${targetVersion.dimensions})`;
      setDownloadSuccessMessage(success);
      notify(success);

      setTimeout(() => {
        setDownloadSuccessMessage(null);
        setDownloadProgress(null);
      }, 4000);
    } catch {
      notify("Download failed. Please check your network or try again.");
    }
  };

  // Related Wallpapers
  const relatedWallpapers = useMemo(() => {
    return allWallpapers
      .filter((w) => w.id !== wallpaper.id)
      .map((w) => {
        let score = 0;
        if (w.category === wallpaper.category) score += 5;
        const matchingTags = w.tags.filter((t) => wallpaper.tags.includes(t));
        score += matchingTags.length * 2;
        return { wallpaper: w, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((item) => item.wallpaper);
  }, [wallpaper, allWallpapers]);

  const isDownloading =
    downloadProgress !== null &&
    downloadProgress.status !== "idle" &&
    downloadProgress.status !== "complete" &&
    downloadProgress.status !== "error";

  return (
    <div className="min-h-screen bg-[#07090F] text-zinc-100 flex flex-col">
      {/* Top Main Navbar */}
      <Navbar
        searchQuery=""
        setSearchQuery={() => {}}
        onOpenUpload={() => {}}
        onOpenAIStudio={() => {}}
        onOpenFavorites={() => {}}
        onOpenSettings={() => {}}
        favoritesCount={favoritesCount}
      />

      {/* Breadcrumb Navigation Bar */}
      <div className="border-b border-white/[0.08] bg-[#0E101B]/80 backdrop-blur-md sticky top-16 z-30 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400 min-w-0">
            <Link
              href="/"
              className="hover:text-white transition flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />
            <Link
              href="/explore"
              className="hover:text-white transition hidden sm:inline"
            >
              Explore
            </Link>
            <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0 hidden sm:inline" />
            <Link
              href={`/explore?category=${wallpaper.category}`}
              className="hover:text-white transition capitalize"
            >
              {wallpaper.category}
            </Link>
            <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />
            <span className="text-white font-medium truncate max-w-[160px] sm:max-w-xs">
              {wallpaper.title}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/explore"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-xs text-zinc-300 hover:text-white border border-white/10 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Gallery</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Wallpaper Experience */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Title & Metadata Top Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-xs font-mono font-medium border border-amber-500/20 capitalize">
                {wallpaper.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/[0.08] text-zinc-300 text-xs font-mono border border-white/10">
                {wallpaper.dimensions} px
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/[0.05] text-zinc-400 text-xs font-mono border border-white/[0.06]">
                {wallpaper.fileType || "JPEG"} • {wallpaper.fileSize}
              </span>
            </div>
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {wallpaper.title}
            </h1>
          </div>

          {/* Social Actions (Copy Link, Share, Favorite) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-medium transition ${
                copiedLink
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                  : "bg-white/[0.05] hover:bg-white/10 border-white/10 text-zinc-300 hover:text-white"
              }`}
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? "Link Copied" : "Copy Link"}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition"
              title="Share Wallpaper"
              aria-label="Share wallpaper"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Save to Collection */}
            <button
              type="button"
              onClick={() => setIsAddToColOpen(true)}
              className="p-2.5 rounded-xl border bg-white/[0.05] hover:bg-white/10 text-zinc-300 hover:text-white border-white/10 transition flex items-center gap-1.5"
              title="Save to Collection"
              aria-label={`Save ${wallpaper.title} to custom collection`}
            >
              <FolderPlus className="w-4 h-4" />
            </button>

            {/* Favorite Button */}
            <button
              type="button"
              onClick={toggleFavorite}
              className={`p-2.5 rounded-xl border transition ${
                isFavorite
                  ? "bg-rose-500/20 text-rose-500 border-rose-500/40"
                  : "bg-white/[0.05] hover:bg-white/10 text-zinc-300 hover:text-white border-white/10"
              }`}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              aria-label={isFavorite ? `Remove ${wallpaper.title} from favorites` : `Save ${wallpaper.title} to favorites`}
              aria-pressed={isFavorite}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>
          </div>
        </div>

        {/* 2-Column Studio: Left Visual Preview, Right Download & Technical Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Visual Preview & Device Simulator (8 Cols) */}
          <div className="lg:col-span-7 xl:col-span-8 bg-[#0D0F1C] border border-white/10 rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center relative min-h-[440px] lg:min-h-[640px] shadow-2xl overflow-hidden">
            {/* Device Switcher Bar */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1 p-1 rounded-2xl bg-[#14172B]/90 backdrop-blur-md border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => {
                  setDeviceMode("fit");
                  setZoomLevel(1);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                  deviceMode === "fit"
                    ? "bg-white text-zinc-950 font-bold shadow"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Fit</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDeviceMode("phone");
                  setZoomLevel(1);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                  deviceMode === "phone"
                    ? "bg-white text-zinc-950 font-bold shadow"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDeviceMode("laptop");
                  setZoomLevel(1);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                  deviceMode === "laptop"
                    ? "bg-white text-zinc-950 font-bold shadow"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">MacBook</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDeviceMode("desktop");
                  setZoomLevel(1);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                  deviceMode === "desktop"
                    ? "bg-white text-zinc-950 font-bold shadow"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDeviceMode("zoom");
                  setZoomLevel(zoomLevel === 1 ? 1.75 : 1);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                  deviceMode === "zoom"
                    ? "bg-amber-400 text-zinc-950 font-bold shadow"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {zoomLevel > 1 ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
                <span>Zoom</span>
              </button>
            </div>

            {/* Display View */}
            <div className="w-full h-full flex items-center justify-center py-12 px-2 select-none overflow-hidden">
              {deviceMode === "fit" && (
                <div className="relative max-h-[70vh] max-w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                  {!imageLoaded && !imageError && (
                    <div className="w-full h-80 sm:h-96 aspect-video bg-[#121526] animate-pulse flex items-center justify-center">
                      <span className="text-xs text-zinc-500 font-mono">Loading full-resolution asset...</span>
                    </div>
                  )}

                  {imageError ? (
                    <div className="p-8 text-center bg-[#151726] rounded-2xl border border-rose-500/20">
                      <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-white">Preview unavailable</p>
                    </div>
                  ) : (
                    <img
                      src={wallpaper.imageUrl}
                      alt={wallpaper.title}
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageError(true)}
                      className={`max-h-[70vh] w-auto max-w-full object-contain rounded-2xl transition-opacity duration-300 ${
                        imageLoaded ? "opacity-100" : "opacity-0 absolute"
                      }`}
                    />
                  )}

                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-[11px] font-mono text-zinc-300 border border-white/15">
                    {wallpaper.dimensions} • {wallpaper.fileType || "JPEG"}
                  </div>
                </div>
              )}

              {deviceMode === "phone" && (
                <div className="relative w-[240px] sm:w-[280px] h-[500px] sm:h-[580px] bg-black overflow-hidden border-4 border-zinc-700 rounded-[50px] shadow-[0_0_60px_rgba(0,0,0,0.85)]">
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-30 flex items-center justify-center border border-white/10" />
                  <div className="absolute top-10 left-0 right-0 text-center z-20 pointer-events-none">
                    <span className="text-4xl sm:text-5xl font-light text-white/95 tracking-tight font-sans drop-shadow-lg">
                      09:41
                    </span>
                    <p className="text-[11px] text-white/85 font-medium drop-shadow mt-0.5">
                      Saturday, October 24
                    </p>
                  </div>
                  <img
                    src={wallpaper.imageUrl}
                    alt={wallpaper.title}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/70 rounded-full z-20" />
                </div>
              )}

              {deviceMode === "laptop" && (
                <div className="relative w-full max-w-[620px] flex flex-col items-center">
                  <div className="relative w-full aspect-[16/10] bg-black overflow-hidden border-2 border-zinc-700 rounded-t-xl shadow-2xl">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-3 bg-black rounded-b-md z-30 border-b border-zinc-800" />
                    <div className="absolute top-0 left-0 right-0 h-5 bg-black/40 backdrop-blur-md z-20 flex items-center justify-between px-3 text-[9px] text-white/80">
                      <div className="flex items-center gap-2">
                        <span></span>
                        <span>Finder</span>
                        <span>File</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>100%</span>
                        <span>Sat 9:41 AM</span>
                      </div>
                    </div>
                    <img
                      src={wallpaper.imageUrl}
                      alt={wallpaper.title}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-8 px-3 rounded-xl bg-white/20 backdrop-blur-xl border border-white/20 flex items-center gap-2 z-20 shadow-lg">
                      <div className="w-5 h-5 rounded-md bg-blue-500 shadow-sm" />
                      <div className="w-5 h-5 rounded-md bg-zinc-800 shadow-sm" />
                      <div className="w-5 h-5 rounded-md bg-amber-500 shadow-sm" />
                      <div className="w-5 h-5 rounded-md bg-emerald-500 shadow-sm" />
                    </div>
                  </div>
                  <div className="w-[105%] h-3.5 bg-gradient-to-b from-zinc-700 to-zinc-800 rounded-b-xl border-t border-zinc-600 shadow-xl" />
                  <div className="w-24 h-1 bg-zinc-600 rounded-b-md" />
                </div>
              )}

              {deviceMode === "desktop" && (
                <div className="relative w-full max-w-[660px] flex flex-col items-center">
                  <div className="relative w-full aspect-[16/9] bg-black overflow-hidden border-2 border-zinc-700 rounded-lg shadow-2xl">
                    <img
                      src={wallpaper.imageUrl}
                      alt={wallpaper.title}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute bottom-2 right-3 px-2 py-0.5 rounded bg-black/70 text-[10px] text-zinc-300 font-mono">
                      Studio Display 5K
                    </div>
                  </div>
                  <div className="w-12 h-14 bg-gradient-to-b from-zinc-700 to-zinc-800" />
                  <div className="w-36 h-2.5 bg-zinc-700 rounded-md shadow-md" />
                </div>
              )}

              {deviceMode === "zoom" && (
                <div className="relative w-full h-[65vh] overflow-auto border border-white/15 rounded-2xl bg-[#030408] flex items-center justify-center p-4">
                  <img
                    src={wallpaper.imageUrl}
                    alt={wallpaper.title}
                    style={{
                      transform: `scale(${zoomLevel})`,
                      transformOrigin: "center center",
                      transition: "transform 0.2s ease-out",
                    }}
                    className="max-h-none max-w-none cursor-grab active:cursor-grabbing shadow-2xl rounded-lg"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs">
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.max(1, z - 0.5))}
                      className="p-1 text-zinc-300 hover:text-white"
                      title="Zoom out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="font-mono text-[11px] px-1 text-amber-300">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.min(3, z + 0.5))}
                      className="p-1 text-zinc-300 hover:text-white"
                      title="Zoom in"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Download & Metadata Studio (4 Cols / 5 Cols on xl) */}
          <div className="lg:col-span-5 xl:col-span-4 bg-[#0D0F1C] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-6 shadow-2xl">
            {/* Creator Card */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <Link
                href={getCreatorProfileHref(wallpaper.author.name)}
                className="flex items-center gap-3 group hover:opacity-95 transition"
                title={`View ${wallpaper.author.name}'s creator profile`}
              >
                <img
                  src={wallpaper.author.avatar}
                  alt={wallpaper.author.name}
                  className="w-12 h-12 rounded-full object-cover border border-amber-400/40 group-hover:border-amber-400 transition"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                      {wallpaper.author.name}
                    </span>
                    {wallpaper.author.verified && (
                      <span title="Verified Artist">
                        <ShieldCheck className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors flex items-center gap-1">
                    View Artist Profile &rarr;
                  </span>
                </div>
              </Link>

              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider font-mono text-zinc-400 block">
                  Downloads
                </span>
                <span className="text-base font-bold text-amber-400 font-mono">
                  {wallpaper.downloads.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Genuine Resolution Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  Available Formats ({availableVersions.length})
                </label>
                <span className="text-[10px] text-zinc-500 font-mono">
                  Native {wallpaper.dimensions}
                </span>
              </div>

              <div className="space-y-2">
                {availableVersions.map((ver) => {
                  const isSelected = selectedVersionId === ver.id;
                  return (
                    <button
                      key={ver.id}
                      type="button"
                      onClick={() => setSelectedVersionId(ver.id)}
                      className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? "bg-amber-500/15 border-amber-400/80 text-white shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-1 ring-amber-400/40"
                          : "bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/20 hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white tracking-tight">
                            {ver.label}
                          </span>
                          {ver.badge && (
                            <span
                              className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                                ver.isNative
                                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                  : "bg-white/10 text-zinc-300 border-white/10"
                              }`}
                            >
                              {ver.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
                          {ver.description}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-medium text-zinc-200 block">
                          {ver.dimensions}
                        </span>
                        {ver.fileSizeEstimate && (
                          <span className="text-[10px] font-mono text-zinc-500 block">
                            ~{ver.fileSizeEstimate}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary CTA Download Button */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => handleDownload()}
                disabled={isDownloading}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-zinc-950 font-bold text-sm shadow-[0_4px_30px_rgba(245,158,11,0.35)] hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed group"
              >
                {isDownloading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{downloadProgress?.statusText || "Downloading asset..."}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                    <span>{activeVersion?.buttonLabel || "Download Wallpaper"}</span>
                  </>
                )}
              </button>

              {/* Quick 1-Click Alternate Downloads */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {availableVersions.some((v) => v.id === "mobile") && (
                  <button
                    type="button"
                    onClick={() => {
                      const m = availableVersions.find((v) => v.id === "mobile");
                      if (m) handleDownload(m);
                    }}
                    disabled={isDownloading}
                    className="py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/10 transition text-center flex items-center justify-center gap-1.5"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Quick Mobile (9:16)</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const orig = availableVersions.find((v) => v.isNative) || availableVersions[0];
                    if (orig) handleDownload(orig);
                  }}
                  disabled={isDownloading}
                  className="py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/10 transition text-center flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Original ({wallpaper.dimensions.split(" ")[0]})</span>
                </button>
              </div>

              {/* Live Download Progress Indicator */}
              {downloadProgress && (
                <div
                  className={`p-3 rounded-xl border transition-all text-xs ${
                    downloadProgress.status === "error"
                      ? "bg-rose-500/15 border-rose-500/30 text-rose-300"
                      : downloadProgress.status === "complete"
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                      : "bg-white/[0.05] border-white/10 text-zinc-300"
                  }`}
                  aria-live="polite"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-medium flex items-center gap-1.5">
                      {downloadProgress.status === "complete" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : downloadProgress.status === "error" ? (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                      )}
                      {downloadProgress.statusText}
                    </span>
                    {downloadProgress.progressPercent > 0 && (
                      <span className="font-mono text-[11px] text-zinc-400">
                        {downloadProgress.progressPercent}%
                      </span>
                    )}
                  </div>

                  {downloadProgress.status !== "error" && downloadProgress.status !== "complete" && (
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-150"
                        style={{ width: `${Math.max(5, downloadProgress.progressPercent)}%` }}
                      />
                    </div>
                  )}

                  {downloadProgress.status === "error" && (
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span>Download could not complete directly.</span>
                      <a
                        href={wallpaper.imageUrl}
                        download={`${slugifyTitle(wallpaper.title)}.jpg`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-white font-medium ml-2"
                      >
                        Direct Image Link
                      </a>
                    </div>
                  )}
                </div>
              )}

              {downloadSuccessMessage && !downloadProgress && (
                <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{downloadSuccessMessage}</span>
                </div>
              )}
            </div>

            {/* Color Palette */}
            {wallpaper.colors && wallpaper.colors.length > 0 && (
              <div>
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  Color Palette (Click to Copy HEX)
                </label>
                <div className="flex items-center gap-2">
                  {wallpaper.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => copyColorCode(color)}
                      style={{ backgroundColor: color }}
                      className="group/color relative flex-1 h-9 rounded-xl border border-white/20 shadow-sm transition-transform hover:scale-105 active:scale-95"
                      title={`Copy ${color}`}
                    >
                      {copiedColor === color && (
                        <span className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl text-white">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AI Generation Prompt */}
            {wallpaper.aiPrompt && (
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> {wallpaper.aiEngine}
                  </span>
                  <button
                    type="button"
                    onClick={copyAIPrompt}
                    className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition"
                  >
                    {copiedPrompt ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedPrompt ? "Copied" : "Copy Prompt"}</span>
                  </button>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed italic">
                  &ldquo;{wallpaper.aiPrompt}&rdquo;
                </p>
              </div>
            )}

            {/* Tags */}
            {wallpaper.tags && wallpaper.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {wallpaper.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/explore?q=${encodeURIComponent(tag)}`}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.06] transition"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Technical Specifications */}
            <div className="pt-4 border-t border-white/[0.08] space-y-2">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Technical Specifications
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                    Native Dimensions
                  </span>
                  <span className="font-mono font-medium text-white">{wallpaper.dimensions} px</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                    Aspect Ratio
                  </span>
                  <span className="font-medium text-white">{wallpaper.aspectRatio}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                    File Type
                  </span>
                  <span className="font-mono font-medium text-white">{wallpaper.fileType || "JPEG"}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                    File Size
                  </span>
                  <span className="font-mono font-medium text-white">{wallpaper.fileSize}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Related Wallpapers */}
        {relatedWallpapers.length > 0 && (
          <section className="pt-8 border-t border-white/[0.08]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Related Wallpapers
                </h2>
                <span className="text-xs text-zinc-500 font-mono">
                  in {wallpaper.category}
                </span>
              </div>
              <Link
                href={`/explore?category=${wallpaper.category}`}
                className="text-xs text-amber-400 hover:text-amber-300 transition"
              >
                View all {wallpaper.category} wallpapers →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {relatedWallpapers.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/wallpaper/${rel.id}`}
                  className="group flex flex-col text-left rounded-2xl overflow-hidden bg-[#0D0F1C] border border-white/[0.08] hover:border-amber-400/50 transition-all shadow-md hover:shadow-xl"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                    <img
                      src={rel.thumbnailUrl || rel.imageUrl}
                      alt={rel.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-zinc-300">
                      {rel.dimensions.split(" ")[0]}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-white truncate group-hover:text-amber-300 transition">
                      {rel.title}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {rel.author.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <Footer onNotify={notify} />

      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161928] text-white border border-white/20 px-4 py-2.5 rounded-2xl shadow-2xl text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Save to Collection Modal */}
      <AddToCollectionModal
        isOpen={isAddToColOpen}
        onClose={() => setIsAddToColOpen(false)}
        wallpaper={wallpaper}
        onNotify={notify}
      />
    </div>
  );
}
