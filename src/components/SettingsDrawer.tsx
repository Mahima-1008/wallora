"use client";

import React from "react";
import { X, Settings, Sliders, Moon, Check, Trash2 } from "lucide-react";

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultFormat: string;
  setDefaultFormat: (format: string) => void;
  autoPlayCarousel: boolean;
  setAutoPlayCarousel: (val: boolean) => void;
  onClearFavorites: () => void;
  onNotify: (msg: string) => void;
}

export default function SettingsDrawer({
  isOpen,
  onClose,
  defaultFormat,
  setDefaultFormat,
  autoPlayCarousel,
  setAutoPlayCarousel,
  onClearFavorites,
  onNotify,
}: SettingsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-sm h-full bg-[#111420] border-l border-white/10 p-6 shadow-2xl flex flex-col justify-between z-10 overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-white/[0.08] mb-6">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">Preferences</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Download Format */}
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                Preferred Download Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["PNG", "JPG", "WebP"].map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => {
                      setDefaultFormat(fmt);
                      onNotify(`Download format set to ${fmt}`);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold transition border ${
                      defaultFormat === fmt
                        ? "bg-amber-500/20 text-amber-300 border-amber-400"
                        : "bg-white/[0.03] text-zinc-400 border-white/10 hover:text-white"
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1.5">
                PNG gives uncompressed lossless quality for crisp wallpapers.
              </p>
            </div>

            {/* Auto-Play Carousel */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div>
                <span className="text-xs font-semibold text-white block">
                  Autoplay Hero Showcase
                </span>
                <span className="text-[10px] text-zinc-400">
                  Rotates featured wallpapers every 6s
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAutoPlayCarousel(!autoPlayCarousel)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  autoPlayCarousel ? "bg-amber-500" : "bg-zinc-700"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    autoPlayCarousel ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>

            {/* Dark Theme Mode */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-3">
                <Moon className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-xs font-semibold text-white block">Theme Mode</span>
                  <span className="text-[10px] text-zinc-400">Obsidian Luxury Dark</span>
                </div>
              </div>
              <span className="text-xs font-mono text-zinc-400 px-2 py-0.5 rounded bg-white/5">
                Default
              </span>
            </div>

            {/* Storage & Favorites */}
            <div className="pt-4 border-t border-white/[0.08]">
              <button
                onClick={() => {
                  if (confirm("Clear all saved favorites and local preferences?")) {
                    onClearFavorites();
                    onNotify("Favorites and cache cleared.");
                  }
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold transition flex items-center justify-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Favorites & Storage</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-white/[0.08] text-center text-[11px] text-zinc-500">
          Wallora v2.4.0 — Premium AI Wallpaper Platform
        </div>
      </div>
    </div>
  );
}
