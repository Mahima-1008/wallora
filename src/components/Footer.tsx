"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, Heart, Shield, Check } from "lucide-react";

interface FooterProps {
  onNotify: (msg: string) => void;
}

export default function Footer({ onNotify }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      onNotify("Subscribed to Wallora 8K Weekly Drop!");
      setEmail("");
    }
  };

  return (
    <footer id="footer-about" className="w-full bg-[#07090F] border-t border-white/[0.06] pt-14 pb-12 text-zinc-400 select-none">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span
                className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Wallora
              </span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                AI 8K
              </span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm">
              Wallora is the premier platform for AI-enhanced, high-resolution desktop and mobile wallpapers. Remastered for OLED screens, Retina displays, and ultra-wide workspaces.
            </p>

            <div className="flex items-center gap-2 text-xs text-zinc-400 pt-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Free for personal & commercial desktop use</span>
            </div>
          </div>

          {/* Resolutions & Categories */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#wallpapers-section" className="hover:text-white transition">
                  Nature & Landscapes
                </a>
              </li>
              <li>
                <a href="#wallpapers-section" className="hover:text-white transition">
                  Aesthetic & Lo-Fi
                </a>
              </li>
              <li>
                <a href="#wallpapers-section" className="hover:text-white transition">
                  Cyberpunk & Anime
                </a>
              </li>
              <li>
                <a href="#wallpapers-section" className="hover:text-white transition">
                  Minimal & OLED Dark
                </a>
              </li>
              <li>
                <a href="#wallpapers-section" className="hover:text-white transition">
                  Deep Space & Nebula
                </a>
              </li>
            </ul>
          </div>

          {/* Device Resolutions */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Resolutions & Devices
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-zinc-300">8K UHD (7680 × 4320)</span> — Multi-display & Studio
              </li>
              <li>
                <span className="text-zinc-300">4K UHD (3840 × 2160)</span> — Desktop & iMac Retina
              </li>
              <li>
                <span className="text-zinc-300">Ultrawide (3440 × 1440)</span> — Curved 21:9 monitors
              </li>
              <li>
                <span className="text-zinc-300">iPhone & Android (9:16)</span> — 120Hz Lockscreen
              </li>
            </ul>
          </div>

          {/* Newsletter Drop */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Weekly 8K Drop
            </h4>
            <p className="text-xs text-zinc-400">
              Get 5 hand-curated, uncompressed AI wallpapers delivered to your inbox every Friday.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>You're on the VIP list for the Friday Drop!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-white text-zinc-950 font-bold hover:bg-zinc-200 transition shrink-0"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div>
            © 2026 Wallora Inc. All wallpapers AI remastered and rights reserved to their respective creators.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer transition">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition">API Docs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
