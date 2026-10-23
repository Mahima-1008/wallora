"use client";

import React, { useState, useEffect } from "react";
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
  Info,
  Palette,
  Eye,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Wallpaper } from "@/data/wallpapers";

interface WallpaperModalProps {
  wallpaper: Wallpaper | null;
  allWallpapers: Wallpaper[];
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
  onSelectWallpaper: (wallpaper: Wallpaper) => void;
  onNotify: (msg: string) => void;
}

type DeviceMode = "raw" | "desktop" | "laptop" | "phone";

export default function WallpaperModal({
  wallpaper,
  allWallpapers,
  isFavorite,
  onToggleFavorite,
  onClose,
  onSelectWallpaper,
  onNotify,
}: WallpaperModalProps) {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("raw");
  const [selectedResolution, setSelectedResolution] = useState<string>("4K");
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Set initial resolution based on wallpaper
  useEffect(() => {
    if (wallpaper) {
      setSelectedResolution(wallpaper.resolution === "8K" ? "8K" : "4K");
    }
  }, [wallpaper]);

  // Keyboard navigation (Escape to close, Left/Right arrows to navigate)
  useEffect(() => {
    if (!wallpaper) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        const currentIndex = allWallpapers.findIndex((w) => w.id === wallpaper.id);
        if (currentIndex > 0) {
          onSelectWallpaper(allWallpapers[currentIndex - 1]);
        }
      } else if (e.key === "ArrowRight") {
        const currentIndex = allWallpapers.findIndex((w) => w.id === wallpaper.id);
        if (currentIndex < allWallpapers.length - 1) {
          onSelectWallpaper(allWallpapers[currentIndex + 1]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [wallpaper, allWallpapers, onClose, onSelectWallpaper]);

  if (!wallpaper) return null;

  const currentIndex = allWallpapers.findIndex((w) => w.id === wallpaper.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allWallpapers.length - 1;

  // Real canvas download to specified resolution
  const handleDownload = async () => {
    setIsDownloading(true);
    onNotify(`Preparing ${selectedResolution} download for "${wallpaper.title}"...`);

    try {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = wallpaper.imageUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      let targetWidth = 3840;
      let targetHeight = 2160;

      if (selectedResolution === "8K") {
        targetWidth = 7680;
        targetHeight = 4320;
      } else if (selectedResolution === "Mobile") {
        targetWidth = 1170;
        targetHeight = 2532;
      } else if (selectedResolution === "Ultrawide") {
        targetWidth = 3440;
        targetHeight = 1440;
      }

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Draw image scaled
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            const cleanTitle = wallpaper.title.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
            a.download = `wallora-${cleanTitle}-${selectedResolution.toLowerCase()}.png`;
            a.href = url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // Celebration
            confetti({
              particleCount: 50,
              spread: 70,
              origin: { y: 0.6 },
              colors: ["#F59E0B", "#FBBF24", "#38BDF8", "#FFFFFF"],
            });

            onNotify(`Successfully downloaded ${wallpaper.title}!`);
          }
          setIsDownloading(false);
        }, "image/png");
      } else {
        throw new Error("Canvas context failed");
      }
    } catch {
      // Fallback direct download
      const a = document.createElement("a");
      a.href = wallpaper.imageUrl;
      a.download = `${wallpaper.title}.jpg`;
      a.target = "_blank";
      a.click();
      setIsDownloading(false);
      onNotify(`Downloading original image...`);
    }
  };

  const copyColorCode = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    onNotify(`Copied hex code: ${hex}`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const copyAIPrompt = () => {
    navigator.clipboard.writeText(wallpaper.aiPrompt);
    setCopiedPrompt(true);
    onNotify("AI Prompt copied to clipboard!");
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Modal Container */}
      <div className="relative w-full max-w-7xl max-h-[94vh] bg-[#0E111B] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col z-10">
        {/* Top Modal Header */}
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between gap-4 bg-[#11131A]">
          <div className="flex items-center gap-3">
            <h2
              className="text-lg sm:text-xl font-bold text-[#F4F4F6] tracking-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {wallpaper.title}
            </h2>
            <div className="hidden sm:flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.08] text-zinc-200 text-[11px] font-medium border border-white/10">
                <Sparkles className="w-3 h-3 text-zinc-300" /> {wallpaper.resolution} Ultra HD
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/[0.05] text-zinc-400 text-[11px] font-mono border border-white/[0.06]">
                {wallpaper.aspectRatio === "9:16" ? "Portrait" : "Landscape"}
              </span>
            </div>
          </div>

          {/* Right Action Icons in Header */}
          <div className="flex items-center gap-2">
            {/* Prev / Next buttons */}
            <div className="hidden sm:flex items-center gap-1 mr-2 border-r border-white/10 pr-3">
              <button
                disabled={!hasPrev}
                onClick={() => hasPrev && onSelectWallpaper(allWallpapers[currentIndex - 1])}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 hover:bg-white/10 transition"
                title="Previous (Left Arrow)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={!hasNext}
                onClick={() => hasNext && onSelectWallpaper(allWallpapers[currentIndex + 1])}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 hover:bg-white/10 transition"
                title="Next (Right Arrow)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Favorite button */}
            <button
              onClick={() => onToggleFavorite(wallpaper.id)}
              className={`p-2 rounded-full border transition ${
                isFavorite
                  ? "bg-rose-500/20 text-rose-500 border-rose-500/40"
                  : "bg-white/[0.05] hover:bg-white/10 text-zinc-300 hover:text-white border-white/10"
              }`}
              title="Add to Favorites"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? "fill-rose-500" : ""}`} />
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/[0.05] hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 transition"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Left Preview, Right Details */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 min-h-0">
          {/* Left Column: Visual Preview & Device Simulator */}
          <div className="lg:col-span-8 p-4 sm:p-6 flex flex-col items-center justify-center bg-[#07090F] relative min-h-[380px] lg:min-h-[520px]">
            {/* Device Switcher Bar */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 p-1 rounded-full bg-[#121624]/90 backdrop-blur-md border border-white/10 text-xs">
              <button
                onClick={() => setDeviceMode("raw")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition ${
                  deviceMode === "raw" ? "bg-white text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                <Maximize2 className="w-3 h-3" />
                <span>Fit</span>
              </button>
              <button
                onClick={() => setDeviceMode("laptop")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition ${
                  deviceMode === "laptop" ? "bg-white text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                <Laptop className="w-3 h-3" />
                <span>MacBook</span>
              </button>
              <button
                onClick={() => setDeviceMode("phone")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition ${
                  deviceMode === "phone" ? "bg-white text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>iPhone</span>
              </button>
              <button
                onClick={() => setDeviceMode("desktop")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition ${
                  deviceMode === "desktop" ? "bg-white text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                <Monitor className="w-3 h-3" />
                <span>Desktop</span>
              </button>
            </div>

            {/* Display according to deviceMode */}
            <div className="w-full h-full flex items-center justify-center py-8">
              {deviceMode === "raw" && (
                <div className="relative max-h-[65vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <img
                    src={wallpaper.imageUrl}
                    alt={wallpaper.title}
                    className="max-h-[65vh] w-auto object-contain rounded-2xl"
                  />
                </div>
              )}

              {deviceMode === "phone" && (
                <div className="phone-frame relative w-[230px] sm:w-[260px] h-[480px] sm:h-[530px] bg-black overflow-hidden border-4 border-zinc-800 rounded-[44px] shadow-2xl">
                  {/* Dynamic Island */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-30 flex items-center justify-center border border-white/10" />
                  {/* Clock & Status */}
                  <div className="absolute top-10 left-0 right-0 text-center z-20 pointer-events-none">
                    <span className="text-4xl sm:text-5xl font-light text-white/90 tracking-tight font-sans drop-shadow-lg">
                      09:41
                    </span>
                    <p className="text-[11px] text-white/80 font-medium drop-shadow mt-0.5">
                      Thursday, October 16
                    </p>
                  </div>
                  {/* Wallpaper Background */}
                  <img
                    src={wallpaper.imageUrl}
                    alt={wallpaper.title}
                    className="w-full h-full object-cover object-center"
                  />
                  {/* iOS Home Indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/70 rounded-full z-20" />
                </div>
              )}

              {deviceMode === "laptop" && (
                <div className="relative w-full max-w-[560px] flex flex-col items-center">
                  <div className="laptop-frame relative w-full aspect-[16/10] bg-black overflow-hidden border-2 border-zinc-700 rounded-t-xl shadow-2xl">
                    {/* Camera notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-3 bg-black rounded-b-md z-30 border-b border-zinc-800" />
                    {/* Simulated macOS Menu Bar */}
                    <div className="absolute top-0 left-0 right-0 h-5 bg-black/40 backdrop-blur-md z-20 flex items-center justify-between px-3 text-[9px] text-white/80">
                      <div className="flex items-center gap-2">
                        <span></span>
                        <span>Finder</span>
                        <span>File</span>
                        <span>View</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>100%</span>
                        <span>Thu 9:41 AM</span>
                      </div>
                    </div>
                    {/* Wallpaper Background */}
                    <img
                      src={wallpaper.imageUrl}
                      alt={wallpaper.title}
                      className="w-full h-full object-cover object-center"
                    />
                    {/* Simulated macOS Dock */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-8 px-3 rounded-xl bg-white/20 backdrop-blur-xl border border-white/20 flex items-center gap-2 z-20 shadow-lg">
                      <div className="w-5 h-5 rounded-md bg-blue-500 shadow-sm" />
                      <div className="w-5 h-5 rounded-md bg-zinc-800 shadow-sm" />
                      <div className="w-5 h-5 rounded-md bg-amber-500 shadow-sm" />
                      <div className="w-5 h-5 rounded-md bg-rose-500 shadow-sm" />
                    </div>
                  </div>
                  {/* Laptop base */}
                  <div className="w-[106%] h-3 bg-gradient-to-b from-zinc-700 to-zinc-800 rounded-b-xl border-t border-zinc-600 shadow-xl" />
                  <div className="w-24 h-1.5 bg-zinc-600 rounded-b-md" />
                </div>
              )}

              {deviceMode === "desktop" && (
                <div className="relative w-full max-w-[620px] flex flex-col items-center">
                  <div className="desktop-frame relative w-full aspect-[16/9] bg-black overflow-hidden border-2 border-zinc-800 rounded-lg shadow-2xl">
                    <img
                      src={wallpaper.imageUrl}
                      alt={wallpaper.title}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute bottom-2 right-3 px-2 py-0.5 rounded bg-black/60 text-[10px] text-zinc-300">
                      Studio Display 5K
                    </div>
                  </div>
                  {/* Stand */}
                  <div className="w-12 h-14 bg-gradient-to-b from-zinc-700 to-zinc-800" />
                  <div className="w-36 h-2.5 bg-zinc-700 rounded-md shadow-md" />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Download & Metadata Studio */}
          <div className="lg:col-span-4 p-5 sm:p-6 bg-[#111420] border-t lg:border-t-0 lg:border-l border-white/[0.08] flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              {/* Creator Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={wallpaper.author.avatar}
                    alt={wallpaper.author.name}
                    className="w-10 h-10 rounded-full object-cover border border-amber-400/40"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-white">
                        {wallpaper.author.name}
                      </span>
                      {wallpaper.author.verified && (
                        <Check className="w-3.5 h-3.5 text-amber-400 bg-amber-400/20 rounded-full p-0.5" />
                      )}
                    </div>
                    <span className="text-xs text-zinc-400">Verified AI Artist</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono text-zinc-400">Downloads</div>
                  <div className="text-sm font-bold text-amber-400">
                    {wallpaper.downloads.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Resolution Selector Pills */}
              <div>
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2.5">
                  Select Download Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "4K", label: "Desktop 4K", desc: "3840 × 2160" },
                    { id: "8K", label: "Ultra 8K", desc: "7680 × 4320" },
                    { id: "Mobile", label: "Mobile 9:16", desc: "1170 × 2532" },
                    { id: "Ultrawide", label: "Ultrawide", desc: "3440 × 1440" },
                  ].map((res) => (
                    <button
                      key={res.id}
                      onClick={() => setSelectedResolution(res.id)}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        selectedResolution === res.id
                          ? "bg-amber-500/15 border-amber-400 text-white shadow-sm"
                          : "bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      <div className="text-xs font-bold">{res.label}</div>
                      <div className="text-[10px] text-zinc-400 font-mono">{res.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Download Action Button */}
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full py-3.5 px-6 rounded-2xl bg-white text-zinc-950 font-bold text-sm shadow-[0_4px_30px_rgba(255,255,255,0.15)] hover:bg-zinc-200 active:scale-98 transition flex items-center justify-center gap-2 group"
              >
                {isDownloading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin" />
                    <span>Rendering {selectedResolution}...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                    <span>Download {selectedResolution} Wallpaper</span>
                  </>
                )}
              </button>

              {/* Color Palette Extraction */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-amber-400" />
                    Color Palette (Click to Copy)
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  {wallpaper.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => copyColorCode(color)}
                      style={{ backgroundColor: color }}
                      className="group/color relative flex-1 h-9 rounded-xl border border-white/20 shadow-sm transition-transform hover:scale-105 active:scale-95"
                      title={`Copy ${color}`}
                    >
                      {copiedColor === color ? (
                        <span className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl text-white">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Generation Prompt */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> {wallpaper.aiEngine}
                  </span>
                  <button
                    onClick={copyAIPrompt}
                    className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition"
                  >
                    {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPrompt ? "Copied" : "Copy Prompt"}</span>
                  </button>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed italic line-clamp-3">
                  "{wallpaper.aiPrompt}"
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {wallpaper.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.05] text-zinc-300 border border-white/[0.05]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="pt-4 border-t border-white/[0.08] space-y-2">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Technical Specifications
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300">
                <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[10px] text-zinc-400 block">Resolution</span>
                  <span className="font-mono font-medium">{wallpaper.resolution} ({wallpaper.dimensions})</span>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[10px] text-zinc-400 block">Orientation</span>
                  <span className="font-medium">{wallpaper.aspectRatio === "9:16" ? "Portrait" : "Landscape"} ({wallpaper.aspectRatio})</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                <span>File Size: {wallpaper.fileSize}</span>
                <span>Category: {wallpaper.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
