"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  X,
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
  ChevronLeft,
  ChevronRight,
  Palette,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Layers,
  FolderPlus,
} from "lucide-react";
import { Wallpaper } from "@/data/wallpapers";
import { useFavorites } from "@/context/FavoritesContext";
import AddToCollectionModal from "./AddToCollectionModal";
import {
  WallpaperDownloadVersion,
  DownloadProgress,
  getAvailableResolutions,
  downloadWallpaper,
  slugifyTitle,
} from "@/lib/wallpaperUtils";

interface WallpaperModalProps {
  wallpaper: Wallpaper | null;
  allWallpapers: Wallpaper[];
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onClose: () => void;
  onSelectWallpaper: (wallpaper: Wallpaper) => void;
  onNotify?: (msg: string) => void;
}

type DeviceMode = "fit" | "laptop" | "phone" | "desktop" | "zoom";

export default function WallpaperModal({
  wallpaper,
  allWallpapers,
  isFavorite: isFavoriteProp,
  onToggleFavorite,
  onClose,
  onSelectWallpaper,
  onNotify,
}: WallpaperModalProps) {
  const { isFavorite: checkFavorite, toggleFavorite: contextToggleFavorite } = useFavorites();
  const isFav = isFavoriteProp !== undefined ? isFavoriteProp : (wallpaper ? checkFavorite(wallpaper.id) : false);

  const handleToggleFavorite = () => {
    if (!wallpaper) return;
    if (onToggleFavorite) {
      onToggleFavorite(wallpaper.id);
    } else {
      contextToggleFavorite(wallpaper.id);
    }
  };

  // Modal DOM reference for focus trapping
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  // Preview state
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("fit");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Download & Resolution selection
  const availableVersions = useMemo(() => {
    return wallpaper ? getAvailableResolutions(wallpaper) : [];
  }, [wallpaper]);

  const [selectedVersionId, setSelectedVersionId] = useState<string>("original");
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  // Copy & Action feedback
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [isAddToColOpen, setIsAddToColOpen] = useState(false);

  // Touch swipe handling
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);

  // Active version object
  const activeVersion = useMemo(() => {
    return (
      availableVersions.find((v) => v.id === selectedVersionId) ||
      availableVersions[0] ||
      null
    );
  }, [availableVersions, selectedVersionId]);

  // Adjust state during render when wallpaper changes (official React pattern)
  const [prevWallpaperId, setPrevWallpaperId] = useState<string | undefined>(wallpaper?.id);
  if (wallpaper && wallpaper.id !== prevWallpaperId) {
    setPrevWallpaperId(wallpaper.id);
    const defaultVer = availableVersions.find((v) => v.id === "4k") || availableVersions[0];
    if (defaultVer) {
      setSelectedVersionId(defaultVer.id);
    }
    setImageLoaded(false);
    setImageError(false);
    setDownloadProgress(null);
    setDownloadSuccessMessage(null);
    setZoomLevel(1);
  }

  // 1. Prevent background page scrolling & compensate for scrollbar width
  useEffect(() => {
    if (!wallpaper) return;

    previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Focus close button or modal container on mount
    const timer = setTimeout(() => {
      const closeBtn = modalRef.current?.querySelector<HTMLButtonElement>('[data-autofocus="true"]');
      closeBtn?.focus();
    }, 50);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      if (previouslyFocusedElementRef.current && typeof previouslyFocusedElementRef.current.focus === "function") {
        previouslyFocusedElementRef.current.focus();
      }
    };
  }, [wallpaper]);

  // 2. Keyboard Navigation: Escape to close, Arrow keys for prev/next, Tab trap
  const currentIndex = allWallpapers.findIndex((w) => w.id === wallpaper?.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allWallpapers.length - 1;

  const handlePrev = useCallback(() => {
    if (hasPrev) {
      onSelectWallpaper(allWallpapers[currentIndex - 1]);
    }
  }, [hasPrev, currentIndex, allWallpapers, onSelectWallpaper]);

  const handleNext = useCallback(() => {
    if (hasNext) {
      onSelectWallpaper(allWallpapers[currentIndex + 1]);
    }
  }, [hasNext, currentIndex, allWallpapers, onSelectWallpaper]);

  useEffect(() => {
    if (!wallpaper) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
        return;
      }

      // Focus trap inside modal
      if (e.key === "Tab" && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [wallpaper, onClose, handlePrev, handleNext]);

  // 3. Touch Gestures (Swipe left for next, right for prev)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
    const diffY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Trigger only if horizontal swipe dominates and exceeds threshold
    if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      if (diffX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // 4. Download Execution Handler
  const handleDownload = async (customVersion?: WallpaperDownloadVersion) => {
    if (!wallpaper) return;
    const targetVersion = customVersion || activeVersion;
    if (!targetVersion) return;

    setDownloadSuccessMessage(null);
    try {
      await downloadWallpaper(wallpaper, targetVersion, (progress) => {
        setDownloadProgress(progress);
      });

      const successText = `Downloaded "${wallpaper.title}" in ${targetVersion.label}`;
      setDownloadSuccessMessage(successText);
      onNotify?.(successText);

      setTimeout(() => {
        setDownloadSuccessMessage(null);
        setDownloadProgress(null);
      }, 4000);
    } catch {
      // Progress error state is set inside downloadWallpaper
      onNotify?.(`Download failed. Please try again or use the direct link.`);
    }
  };

  // 5. Copy Link Handler (Uses direct permalink)
  const handleCopyLink = async () => {
    if (!wallpaper) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const permalink = `${origin}/wallpaper/${wallpaper.id}`;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(permalink);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = permalink;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedLink(true);
      onNotify?.("Direct wallpaper link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      onNotify?.(`Link: ${permalink}`);
    }
  };

  // 6. Native Share API (if supported)
  const handleNativeShare = async () => {
    if (!wallpaper || typeof navigator === "undefined" || !navigator.share) return;
    const origin = window.location.origin;
    try {
      await navigator.share({
        title: `${wallpaper.title} | Wallora`,
        text: `Check out "${wallpaper.title}" high-resolution wallpaper on Wallora`,
        url: `${origin}/wallpaper/${wallpaper.id}`,
      });
    } catch {
      // User cancelled share
    }
  };

  // 7. Copy Palette & Prompt
  const copyColorCode = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopiedColor(hex);
    onNotify?.(`Copied hex: ${hex}`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const copyAIPrompt = () => {
    if (!wallpaper) return;
    navigator.clipboard?.writeText(wallpaper.aiPrompt);
    setCopiedPrompt(true);
    onNotify?.("AI generation prompt copied to clipboard!");
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  // 8. Related Wallpapers (computed based on same category or matching tags)
  const relatedWallpapers = useMemo(() => {
    if (!wallpaper) return [];
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

  if (!wallpaper) return null;

  const isDownloading =
    downloadProgress !== null &&
    downloadProgress.status !== "idle" &&
    downloadProgress.status !== "complete" &&
    downloadProgress.status !== "error";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-wallpaper-title"
      aria-describedby="modal-wallpaper-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/92 backdrop-blur-2xl animate-in fade-in duration-200"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background backdrop click to dismiss */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
        aria-label="Close dialog background"
      />

      {/* Main Modal Card Container */}
      <div
        ref={modalRef}
        className="relative w-full max-w-7xl max-h-[95vh] bg-[#0C0E17] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_90px_rgba(0,0,0,0.95)] flex flex-col z-10 text-zinc-100"
      >
        {/* Top Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-white/[0.08] flex items-center justify-between gap-3 bg-[#11131E] shrink-0">
          {/* Title & Real Dimensions Badge */}
          <div className="min-w-0 flex items-center gap-2.5 sm:gap-3.5">
            <h2
              id="modal-wallpaper-title"
              className="text-base sm:text-xl font-bold text-white tracking-tight truncate"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {wallpaper.title}
            </h2>

            <div className="hidden md:flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.08] text-zinc-200 text-xs font-mono border border-white/10">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {wallpaper.dimensions} px
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/[0.05] text-zinc-400 text-xs font-mono border border-white/[0.06]">
                {wallpaper.aspectRatio === "9:16" ? "Portrait (9:16)" : "Landscape (16:9)"}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-xs font-mono border border-amber-500/20">
                {wallpaper.fileType || "JPEG"} • {wallpaper.fileSize}
              </span>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Prev / Next arrows */}
            <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-1">
              <button
                type="button"
                disabled={!hasPrev}
                onClick={handlePrev}
                className="p-2 rounded-xl text-zinc-400 hover:text-white disabled:opacity-25 disabled:hover:text-zinc-400 hover:bg-white/10 transition"
                title="Previous Wallpaper (Left Arrow)"
                aria-label="Previous Wallpaper"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={!hasNext}
                onClick={handleNext}
                className="p-2 rounded-xl text-zinc-400 hover:text-white disabled:opacity-25 disabled:hover:text-zinc-400 hover:bg-white/10 transition"
                title="Next Wallpaper (Right Arrow)"
                aria-label="Next Wallpaper"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Copy Link Button */}
            <button
              type="button"
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
                copiedLink
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                  : "bg-white/[0.05] hover:bg-white/10 border-white/10 text-zinc-300 hover:text-white"
              }`}
              title="Copy direct shareable link"
              aria-label="Copy direct wallpaper link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedLink ? "Link Copied" : "Copy Link"}</span>
            </button>

            {/* Native Share (if available) */}
            {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
              <button
                type="button"
                onClick={handleNativeShare}
                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition"
                title="Share Wallpaper"
                aria-label="Share Wallpaper"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}

            {/* Open dedicated page */}
            <a
              href={`/wallpaper/${wallpaper.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition hidden md:flex items-center justify-center"
              title="Open full page in new tab"
              aria-label="Open full detail page in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Save to Collection */}
            <button
              type="button"
              onClick={() => setIsAddToColOpen(true)}
              className="p-2 rounded-xl border bg-white/[0.05] hover:bg-white/10 text-zinc-300 hover:text-white border-white/10 transition"
              title="Save to Collection"
              aria-label={`Save ${wallpaper.title} to custom collection`}
            >
              <FolderPlus className="w-4 h-4" />
            </button>

            {/* Favorite toggle */}
            <button
              type="button"
              onClick={handleToggleFavorite}
              className={`p-2 rounded-xl border transition ${
                isFav
                  ? "bg-rose-500/20 text-rose-500 border-rose-500/40"
                  : "bg-white/[0.05] hover:bg-white/10 text-zinc-300 hover:text-white border-white/10"
              }`}
              title={isFav ? "Remove from Favorites" : "Save to Favorites"}
              aria-label={isFav ? `Remove ${wallpaper.title} from favorites` : `Save ${wallpaper.title} to favorites`}
              aria-pressed={isFav}
            >
              <Heart className={`w-4 h-4 ${isFav ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>

            {/* Close button with autofocus */}
            <button
              data-autofocus="true"
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.07] hover:bg-white/15 text-zinc-400 hover:text-white border border-white/10 transition ml-1"
              title="Close modal (Escape)"
              aria-label="Close modal dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-white/[0.08]">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-full">
            {/* Left Column: Visual Preview & Device Simulator (8 Cols) */}
            <div className="lg:col-span-7 xl:col-span-8 p-4 sm:p-6 flex flex-col items-center justify-center bg-[#06080F] relative min-h-[380px] lg:min-h-[560px]">
              {/* Device Mode Switcher Bar */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-1 p-1 rounded-2xl bg-[#101322]/90 backdrop-blur-md border border-white/10 text-xs">
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
                  title="Fit wallpaper within preview"
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
                  title="Preview on Smartphone"
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
                  title="Preview on MacBook"
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
                  title="Preview on Desktop"
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
                  title="Zoom 1:1 pixel inspection"
                >
                  {zoomLevel > 1 ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
                  <span>Zoom</span>
                </button>
              </div>

              {/* Visual Display Container */}
              <div className="w-full h-full flex items-center justify-center py-10 px-2 select-none overflow-hidden">
                {/* 1. Fit / Raw View */}
                {deviceMode === "fit" && (
                  <div className="relative max-h-[62vh] max-w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                    {/* Shimmer skeleton while loading */}
                    {!imageLoaded && !imageError && (
                      <div className="w-full h-72 sm:h-96 aspect-video bg-[#121526] animate-pulse flex items-center justify-center">
                        <span className="text-xs text-zinc-500 font-mono">Loading high-resolution asset...</span>
                      </div>
                    )}

                    {imageError ? (
                      <div className="p-8 text-center bg-[#151726] rounded-2xl border border-rose-500/20">
                        <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-white">Preview unavailable</p>
                        <p className="text-xs text-zinc-400 mt-1">Unable to load image asset</p>
                      </div>
                    ) : (
                      <img
                        src={wallpaper.imageUrl}
                        alt={wallpaper.title}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                        className={`max-h-[62vh] w-auto max-w-full object-contain rounded-2xl transition-opacity duration-300 ${
                          imageLoaded ? "opacity-100" : "opacity-0 absolute"
                        }`}
                      />
                    )}

                    {/* Native Resolution Overlay Pill */}
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[11px] font-mono text-zinc-300 border border-white/15">
                      {wallpaper.dimensions} • {wallpaper.fileType || "JPEG"}
                    </div>
                  </div>
                )}

                {/* 2. Phone Simulation (iPhone 16 Pro Style) */}
                {deviceMode === "phone" && (
                  <div className="relative w-[240px] sm:w-[270px] h-[490px] sm:h-[550px] bg-black overflow-hidden border-4 border-zinc-700 rounded-[48px] shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                    {/* Dynamic Island */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-30 flex items-center justify-center border border-white/10" />

                    {/* Clock & Status */}
                    <div className="absolute top-10 left-0 right-0 text-center z-20 pointer-events-none">
                      <span className="text-4xl sm:text-5xl font-light text-white/95 tracking-tight font-sans drop-shadow-lg">
                        09:41
                      </span>
                      <p className="text-[11px] text-white/85 font-medium drop-shadow mt-0.5">
                        Saturday, October 24
                      </p>
                    </div>

                    {/* Wallpaper Background */}
                    <img
                      src={wallpaper.imageUrl}
                      alt={wallpaper.title}
                      className="w-full h-full object-cover object-center"
                    />

                    {/* Home Indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/70 rounded-full z-20" />
                  </div>
                )}

                {/* 3. MacBook Simulation */}
                {deviceMode === "laptop" && (
                  <div className="relative w-full max-w-[580px] flex flex-col items-center">
                    <div className="relative w-full aspect-[16/10] bg-black overflow-hidden border-2 border-zinc-700 rounded-t-xl shadow-2xl">
                      {/* Notch */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-3 bg-black rounded-b-md z-30 border-b border-zinc-800" />

                      {/* Menu Bar */}
                      <div className="absolute top-0 left-0 right-0 h-5 bg-black/40 backdrop-blur-md z-20 flex items-center justify-between px-3 text-[9px] text-white/80">
                        <div className="flex items-center gap-2">
                          <span></span>
                          <span>Finder</span>
                          <span>File</span>
                          <span>Edit</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>100%</span>
                          <span>Sat 9:41 AM</span>
                        </div>
                      </div>

                      {/* Image */}
                      <img
                        src={wallpaper.imageUrl}
                        alt={wallpaper.title}
                        className="w-full h-full object-cover object-center"
                      />

                      {/* Dock */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-8 px-3 rounded-xl bg-white/20 backdrop-blur-xl border border-white/20 flex items-center gap-2 z-20 shadow-lg">
                        <div className="w-5 h-5 rounded-md bg-blue-500 shadow-sm" />
                        <div className="w-5 h-5 rounded-md bg-zinc-800 shadow-sm" />
                        <div className="w-5 h-5 rounded-md bg-amber-500 shadow-sm" />
                        <div className="w-5 h-5 rounded-md bg-emerald-500 shadow-sm" />
                      </div>
                    </div>
                    {/* Base */}
                    <div className="w-[105%] h-3 bg-gradient-to-b from-zinc-700 to-zinc-800 rounded-b-xl border-t border-zinc-600 shadow-xl" />
                    <div className="w-24 h-1 bg-zinc-600 rounded-b-md" />
                  </div>
                )}

                {/* 4. Desktop Studio Display Simulation */}
                {deviceMode === "desktop" && (
                  <div className="relative w-full max-w-[620px] flex flex-col items-center">
                    <div className="relative w-full aspect-[16/9] bg-black overflow-hidden border-2 border-zinc-700 rounded-lg shadow-2xl">
                      <img
                        src={wallpaper.imageUrl}
                        alt={wallpaper.title}
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute bottom-2 right-3 px-2 py-0.5 rounded bg-black/70 text-[10px] text-zinc-300 font-mono">
                        Studio 4K Ultra
                      </div>
                    </div>
                    <div className="w-12 h-14 bg-gradient-to-b from-zinc-700 to-zinc-800" />
                    <div className="w-36 h-2.5 bg-zinc-700 rounded-md shadow-md" />
                  </div>
                )}

                {/* 5. Zoom 1:1 Pixel Inspection */}
                {deviceMode === "zoom" && (
                  <div className="relative w-full h-[60vh] overflow-auto border border-white/15 rounded-2xl bg-[#030408] flex items-center justify-center p-4">
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
            <div className="lg:col-span-5 xl:col-span-4 p-5 sm:p-6 bg-[#111320] flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                {/* Creator Profile & Download Metrics */}
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <div className="flex items-center gap-3">
                    <img
                      src={wallpaper.author.avatar}
                      alt={wallpaper.author.name}
                      className="w-11 h-11 rounded-full object-cover border border-amber-400/40"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-white">
                          {wallpaper.author.name}
                        </span>
                        {wallpaper.author.verified && (
                          <span title="Verified Artist">
                            <ShieldCheck className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-zinc-400">Wallora Artist</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-zinc-400 block">
                      Downloads
                    </span>
                    <span className="text-sm font-bold text-amber-400 font-mono">
                      {wallpaper.downloads.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Genuine Resolution & Format Selector */}
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
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-zinc-950 font-bold text-sm shadow-[0_4px_30px_rgba(245,158,11,0.35)] hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed group"
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

                  {/* Quick 1-Click Alternate Actions */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {/* Quick Mobile Button (if not already selected) */}
                    {availableVersions.some((v) => v.id === "mobile") && (
                      <button
                        type="button"
                        onClick={() => {
                          const mobileVer = availableVersions.find((v) => v.id === "mobile");
                          if (mobileVer) handleDownload(mobileVer);
                        }}
                        disabled={isDownloading}
                        className="py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/10 transition text-center flex items-center justify-center gap-1.5"
                      >
                        <Smartphone className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Quick Mobile (9:16)</span>
                      </button>
                    )}

                    {/* Quick Native Original Button */}
                    <button
                      type="button"
                      onClick={() => {
                        const origVer = availableVersions.find((v) => v.isNative) || availableVersions[0];
                        if (origVer) handleDownload(origVer);
                      }}
                      disabled={isDownloading}
                      className="py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/10 transition text-center flex items-center justify-center gap-1.5"
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

                      {/* Progress Bar */}
                      {downloadProgress.status !== "error" && downloadProgress.status !== "complete" && (
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-150"
                            style={{ width: `${Math.max(5, downloadProgress.progressPercent)}%` }}
                          />
                        </div>
                      )}

                      {/* Error fallback link */}
                      {downloadProgress.status === "error" && (
                        <div className="mt-2 flex items-center justify-between text-[11px]">
                          <span>Network issue encountered.</span>
                          <a
                            href={wallpaper.imageUrl}
                            download={`${slugifyTitle(wallpaper.title)}.jpg`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-white font-medium ml-2"
                          >
                            Direct Download Link
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {downloadSuccessMessage && !downloadProgress && (
                    <div
                      className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in"
                      aria-live="polite"
                    >
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{downloadSuccessMessage}</span>
                    </div>
                  )}
                </div>

                {/* Color Palette Extraction */}
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
                          aria-label={`Copy color code ${color}`}
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

                {/* AI Prompt & Engine Details */}
                {wallpaper.aiPrompt && (
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-amber-400 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> {wallpaper.aiEngine}
                      </span>
                      <button
                        type="button"
                        onClick={copyAIPrompt}
                        className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition"
                        title="Copy generation prompt"
                      >
                        {copiedPrompt ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedPrompt ? "Copied" : "Copy Prompt"}</span>
                      </button>
                    </div>
                    <p
                      id="modal-wallpaper-desc"
                      className="text-xs text-zinc-300 leading-relaxed italic line-clamp-3"
                    >
                      &ldquo;{wallpaper.aiPrompt}&rdquo;
                    </p>
                  </div>
                )}

                {/* Tags */}
                {wallpaper.tags && wallpaper.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {wallpaper.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.04] text-zinc-300 border border-white/[0.06]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Technical Specifications Sheet */}
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
                      Source Format
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

          {/* Section: Related Wallpapers (Bottom Drawer) */}
          {relatedWallpapers.length > 0 && (
            <div className="p-5 sm:p-6 bg-[#0B0D18]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    Related Wallpapers
                  </h3>
                  <span className="text-xs text-zinc-500 font-mono">
                    ({wallpaper.category})
                  </span>
                </div>
                <a
                  href={`/explore?category=${wallpaper.category}`}
                  className="text-xs text-amber-400 hover:text-amber-300 transition"
                >
                  View all in category →
                </a>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {relatedWallpapers.map((rel) => (
                  <button
                    key={rel.id}
                    type="button"
                    onClick={() => onSelectWallpaper(rel)}
                    className="group flex flex-col text-left rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.08] hover:border-amber-400/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    aria-label={`View related wallpaper ${rel.title}`}
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
                    <div className="p-2">
                      <p className="text-[11px] font-medium text-white truncate group-hover:text-amber-300 transition">
                        {rel.title}
                      </p>
                      <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                        {rel.author.name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save to Collection Modal */}
      {wallpaper && (
        <AddToCollectionModal
          isOpen={isAddToColOpen}
          onClose={() => setIsAddToColOpen(false)}
          wallpaper={wallpaper}
          onNotify={onNotify || (() => {})}
        />
      )}
    </div>
  );
}
