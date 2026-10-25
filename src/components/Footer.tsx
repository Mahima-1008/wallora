"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Shield, Check } from "lucide-react";

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
      onNotify("Subscribed to Wallora Curated Drop");
      setEmail("");
    }
  };

  return (
    <footer id="footer-about" className="w-full bg-[#0E1017] border-t border-white/[0.07] pt-16 pb-12 text-[#8E909B] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-16 pb-14 border-b border-white/[0.07]">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <span
                className="text-2xl font-bold tracking-tight text-[#F4F4F6] font-serif"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Wallora
              </span>
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-white/[0.08] text-zinc-300 border border-white/10">
                Ultra HD
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#8E909B] leading-relaxed max-w-md">
              Wallora is a premium photography and wallpaper platform offering ultra-high-resolution imagery crafted for modern workstations, Retina displays, and mobile devices.
            </p>

            <div className="flex items-center gap-2 text-xs text-zinc-400 pt-1">
              <Shield className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>Free for personal and desktop background use</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs font-semibold text-[#F4F4F6] uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/explore" className="hover:text-white transition">
                  Explore Wallpapers
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-white transition">
                  Curated Collections
                </Link>
              </li>
              <li>
                <Link href="/creators" className="hover:text-white transition">
                  Wallora Creators
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="hover:text-white transition">
                  Saved Favorites
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Platform
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Drop */}
          <div className="lg:col-span-4 space-y-3.5">
            <h4 className="text-xs font-semibold text-[#F4F4F6] uppercase tracking-wider">
              Weekly Curation
            </h4>
            <p className="text-xs text-[#8E909B] leading-relaxed max-w-sm">
              Receive our top weekly wallpaper selections and new artist drops directly to your inbox.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-white/[0.08] border border-white/15 text-zinc-200 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-white shrink-0" />
                <span>You&apos;re on the list for the next release.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2 max-w-sm">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full py-2.5 px-3.5 rounded-xl bg-[#14161F] text-xs text-white placeholder-zinc-500 border border-white/[0.08] focus:border-zinc-400 focus:outline-none transition"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-[#F4F4F6] hover:bg-white text-zinc-950 transition active:scale-95 shrink-0"
                  title="Subscribe to weekly drops"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
          <div className="flex items-center gap-1">
            <span>© 2026 Wallora. Crafted for aesthetic desktop workspaces.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/explore" className="hover:text-zinc-300 transition">
              Explore
            </Link>
            <Link href="/collections" className="hover:text-zinc-300 transition">
              Collections
            </Link>
            <Link href="/creators" className="hover:text-zinc-300 transition">
              Creators
            </Link>
            <Link href="/about" className="hover:text-zinc-300 transition">
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
