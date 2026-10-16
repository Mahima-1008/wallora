"use client";

import React, { useState } from "react";
import { X, Sparkles, Wand2, Sliders, Download, Check, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";
import { Wallpaper } from "@/data/wallpapers";

interface AIEnhancerModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallpapers: Wallpaper[];
  onNotify: (msg: string) => void;
}

export default function AIEnhancerModal({
  isOpen,
  onClose,
  wallpapers,
  onNotify,
}: AIEnhancerModalProps) {
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper>(wallpapers[0]);
  const [enhancerModel, setEnhancerModel] = useState("Wallora Diffusion Ultra 4.2");
  const [oledMode, setOledMode] = useState(false);
  const [sharpness, setSharpness] = useState(70);
  const [vibrancy, setVibrancy] = useState(60);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleEnhance = () => {
    setIsEnhancing(true);
    setIsDone(false);

    setTimeout(() => {
      setIsEnhancing(false);
      setIsDone(true);
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#F59E0B", "#F43F5E", "#38BDF8", "#10B981"],
      });
      onNotify("Wallpaper AI Upscaled to 8K Ultra HD!");
    }, 1200);
  };

  const handleDownloadEnhanced = () => {
    const link = document.createElement("a");
    link.href = selectedWallpaper.imageUrl;
    link.download = `wallora-ai-enhanced-${selectedWallpaper.id}.jpg`;
    link.click();
    onNotify("Downloading AI Enhanced 8K Wallpaper!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-4xl p-6 sm:p-8 rounded-3xl bg-[#121624] border border-white/10 shadow-2xl z-10 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Wand2 className="w-5 h-5 text-amber-400" />
          <span className="text-[11px] font-bold tracking-[0.2em] text-amber-400 uppercase">
            Wallora AI Studio
          </span>
        </div>

        <h2
          className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          AI Wallpaper Enhancer & 8K Upscaler
        </h2>

        <p className="text-xs sm:text-sm text-zinc-400 mb-6">
          Remaster any wallpaper into true 8K resolution with neural micro-contrast and OLED pure black calibration.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Preview */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/15 bg-black shadow-2xl">
              <img
                src={selectedWallpaper.imageUrl}
                alt={selectedWallpaper.title}
                style={{
                  filter: `contrast(${100 + (oledMode ? 25 : 0)}%) saturate(${
                    100 + (vibrancy - 50)
                  }%) brightness(${oledMode ? 95 : 100}%)`,
                }}
                className={`w-full h-full object-cover transition-all duration-300 ${
                  isEnhancing ? "blur-sm scale-105" : ""
                }`}
              />

              {/* Scanning laser line during enhancement */}
              {isEnhancing && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-400/25 to-transparent h-12 w-full animate-bounce pointer-events-none" />
              )}

              {/* Overlay Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-semibold text-white border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isDone ? "Enhanced 8K Studio" : "Source Preview"}</span>
              </div>
            </div>

            {/* Quick Picker below image */}
            <div className="w-full mt-3">
              <span className="text-[11px] text-zinc-400 block mb-2 font-medium">
                Choose wallpaper to enhance:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {wallpapers.slice(0, 6).map((w) => (
                  <button
                    key={w.id}
                    onClick={() => {
                      setSelectedWallpaper(w);
                      setIsDone(false);
                    }}
                    className={`shrink-0 w-16 h-10 rounded-lg overflow-hidden border transition ${
                      selectedWallpaper.id === w.id
                        ? "border-amber-400 ring-2 ring-amber-400/40"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <img src={w.thumbnailUrl} alt={w.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                Neural AI Engine
              </label>
              <select
                value={enhancerModel}
                onChange={(e) => setEnhancerModel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161B29] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Wallora Diffusion Ultra 4.2">Wallora Diffusion Ultra 4.2</option>
                <option value="Flux.1 Pro Cinematic">Flux.1 Pro Cinematic 8K</option>
                <option value="OLED Deep Black 100%">OLED Pure Black Neural Master</option>
                <option value="Super-Res 8K Upscaler">Super-Res 8K Vector Upscaler</option>
              </select>
            </div>

            {/* Sliders */}
            <div className="space-y-3 pt-2 border-t border-white/[0.08]">
              <div>
                <div className="flex justify-between text-xs text-zinc-300 mb-1">
                  <span>Micro-Detail Sharpness</span>
                  <span className="font-mono text-amber-400">{sharpness}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={sharpness}
                  onChange={(e) => setSharpness(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-zinc-300 mb-1">
                  <span>Color Vibrancy & Saturation</span>
                  <span className="font-mono text-amber-400">{vibrancy}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={vibrancy}
                  onChange={(e) => setVibrancy(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>

            {/* OLED Mode Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <div>
                <span className="text-xs font-semibold text-white block">OLED Pure Black Mode</span>
                <span className="text-[10px] text-zinc-400">Deepens shadow pixels to #000000</span>
              </div>
              <button
                type="button"
                onClick={() => setOledMode(!oledMode)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  oledMode ? "bg-amber-500" : "bg-zinc-700"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    oledMode ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>

            {/* Enhance Button */}
            <button
              onClick={handleEnhance}
              disabled={isEnhancing}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs tracking-wide uppercase transition shadow-lg flex items-center justify-center gap-2"
            >
              {isEnhancing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Neural Upscale...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Enhance to 8K Ultra HD</span>
                </>
              )}
            </button>

            {/* Download Enhanced */}
            {isDone && (
              <button
                onClick={handleDownloadEnhanced}
                className="w-full py-2.5 rounded-xl bg-white text-zinc-950 font-semibold text-xs transition flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Remastered 8K Image</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
