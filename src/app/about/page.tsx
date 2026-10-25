"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Shield,
  Cpu,
  Monitor,
  Smartphone,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIEnhancerModal from "@/components/AIEnhancerModal";
import { WALLPAPERS } from "@/data/wallpapers";
import { useFavorites } from "@/context/FavoritesContext";

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const { favoritesCount } = useFavorites();

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const notify = (msg: string) => setToastMessage(msg);

  const faqs = [
    {
      q: "Are Wallora wallpapers free to download and use?",
      a: "Yes! All wallpapers on Wallora are 100% free to download in up to 8K Ultra HD for personal and desktop background use. If you use them in public streaming overlays or videos, creator credit is appreciated.",
    },
    {
      q: "What makes Wallora's AI wallpapers superior to standard stock backgrounds?",
      a: "Wallora runs every image through a proprietary post-processing pipeline featuring neural micro-sharpening, chromatic dispersion calibration, and true #000000 black clamping for OLED displays. This ensures crisp edges without haloing or compression artifacts.",
    },
    {
      q: "How does the client-side resolution downloader work?",
      a: "When you select a resolution (8K, 4K, Ultrawide, or Mobile), your browser's hardware-accelerated HTML5 Canvas redraws and re-samples the image at the exact aspect ratio with bicubic interpolation, downloading a clean, uncompressed image file directly to your disk.",
    },
    {
      q: "Can I publish my own wallpapers on Wallora?",
      a: "Yes! You can apply for our Verified Creator Program on the Creators page to showcase your artist portfolio, receive drop promotion, and distribute native resolution desktop backgrounds.",
    },
    {
      q: "What resolutions are supported for multi-monitor setups?",
      a: "Wallora supports standard 16:9 (3840×2160, 7680×4320), Apple MacBook 16:10 (3456×2234), 21:9 Ultrawide (3440×1440), and 9:16 vertical mobile wallpapers (1170×2532, 1320×2868).",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F4F4F6] flex flex-col font-sans selection:bg-white/20 selection:text-white">
      {/* Navbar */}
      <Navbar
        favoritesCount={favoritesCount}
        onOpenAIStudio={() => setIsAIOpen(true)}
      />

      {/* Main Container - Mirrored with Explore Page Width & Spacing */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 space-y-12">
        {/* 1. Header Hero Section (Mirrored with Explore Page) */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-semibold tracking-[0.2em] text-[#8E909B] uppercase">
                  Platform Architecture &amp; Mission
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-mono text-zinc-400">
                  Wallora Philosophy
                </span>
              </div>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#F4F4F6] tracking-tight leading-[1.15]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Redefining How You{" "}
                <span className="italic text-zinc-300">Experience Your Screens</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#8E909B] mt-1.5 max-w-2xl leading-relaxed">
                We spend over 9 hours a day in front of screens. Wallora replaces sterile defaults with breathtaking, AI-enhanced visual sanctuaries calibrated for retina displays, multi-monitor setups, and OLED workstations.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
              <Link
                href="/explore"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition active:scale-95 shadow-sm"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Pillars of Engineering Cards (Mirrored with Explore Card Styling) */}
        <section className="space-y-4">
          <div>
            <span className="text-[11px] font-semibold tracking-[0.2em] text-[#8E909B] uppercase block mb-1">
              Engineering Pillars
            </span>
            <h2
              className="text-2xl sm:text-3xl font-normal text-[#F4F4F6]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Built for Modern Displays
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 sm:p-7 rounded-2xl bg-[#13141C] border border-white/[0.08] hover:border-white/20 transition-all duration-300 shadow-lg space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-amber-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h3
                className="text-lg font-normal text-[#F4F4F6] tracking-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Neural 8K Vector Upscaling
              </h3>
              <p className="text-xs text-[#8E909B] leading-relaxed">
                Standard upscalers blur textures or hallucinate artifacts. Wallora utilizes sub-pixel edge alignment and micro-contrast models to preserve raw organic detail on 4K, 5K Retina, and 8K displays.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-2xl bg-[#13141C] border border-white/[0.08] hover:border-white/20 transition-all duration-300 shadow-lg space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-sky-400">
                <Monitor className="w-5 h-5" />
              </div>
              <h3
                className="text-lg font-normal text-[#F4F4F6] tracking-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                OLED True-Black Calibration
              </h3>
              <p className="text-xs text-[#8E909B] leading-relaxed">
                By clamping dark threshold pixels to absolute #000000, our OLED wallpapers physically turn off display pixels on OLED and Mini-LED monitors, delivering infinite contrast and reducing energy draw.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-2xl bg-[#13141C] border border-white/[0.08] hover:border-white/20 transition-all duration-300 shadow-lg space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-emerald-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3
                className="text-lg font-normal text-[#F4F4F6] tracking-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Live Device Studio Mockups
              </h3>
              <p className="text-xs text-[#8E909B] leading-relaxed">
                Never guess how a wallpaper will look behind your desktop icons or clock. Our real-time simulator allows you to test artwork inside authentic MacBook Pro, iPhone 16, or Studio Display frames before downloading.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-2xl bg-[#13141C] border border-white/[0.08] hover:border-white/20 transition-all duration-300 shadow-lg space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-violet-400">
                <Shield className="w-5 h-5" />
              </div>
              <h3
                className="text-lg font-normal text-[#F4F4F6] tracking-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                100% Uncompressed Delivery
              </h3>
              <p className="text-xs text-[#8E909B] leading-relaxed">
                We believe digital art deserves zero degradation. Wallora skips aggressive web compression pipelines, serving lossless PNG and high-bitrate WebP masters straight to your downloads folder.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Hardware Compatibility Matrix */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#13141C] border border-white/[0.08] shadow-lg space-y-5">
          <div>
            <span className="text-[11px] font-semibold text-[#8E909B] uppercase tracking-wider block mb-1">
              Display Engineering
            </span>
            <h2
              className="text-xl sm:text-2xl font-normal text-[#F4F4F6] tracking-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Hardware Compatibility Matrix
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 uppercase text-[10px]">
                  <th className="py-3 px-4 font-semibold">Device / Display</th>
                  <th className="py-3 px-4 font-semibold">Native Resolution</th>
                  <th className="py-3 px-4 font-semibold">Aspect Ratio</th>
                  <th className="py-3 px-4 font-semibold">Recommended Format</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-zinc-300">
                <tr>
                  <td className="py-3.5 px-4 font-medium text-white">Apple Studio Display 27&quot;</td>
                  <td className="py-3.5 px-4 font-mono text-zinc-400">5120 × 2880 (5K)</td>
                  <td className="py-3.5 px-4 font-mono text-zinc-400">16:9</td>
                  <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[11px]">8K UHD</span></td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-white">MacBook Pro 16&quot; Liquid Retina</td>
                  <td className="py-3.5 px-4 font-mono text-zinc-400">3456 × 2234</td>
                  <td className="py-3.5 px-4 font-mono text-zinc-400">16:10</td>
                  <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[11px]">4K / 8K</span></td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-white">Samsung Odyssey 34&quot; Ultrawide</td>
                  <td className="py-3.5 px-4 font-mono text-zinc-400">3440 × 1440</td>
                  <td className="py-3.5 px-4 font-mono text-zinc-400">21:9</td>
                  <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono text-[11px]">Ultrawide</span></td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-white">iPhone 16 Pro Max</td>
                  <td className="py-3.5 px-4 font-mono text-zinc-400">1320 × 2868</td>
                  <td className="py-3.5 px-4 font-mono text-zinc-400">9:19.5</td>
                  <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[11px]">Mobile 9:16</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. FAQ Accordion (Mirrored with Explore Card Styling) */}
        <section className="space-y-4">
          <div>
            <span className="text-[11px] font-semibold text-[#8E909B] uppercase tracking-wider block mb-1">
              Common Inquiries
            </span>
            <h2
              className="text-2xl sm:text-3xl font-normal text-[#F4F4F6] tracking-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-[#13141C] border border-white/[0.08] overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition"
                  >
                    <span className="text-sm font-medium text-[#F4F4F6]">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-[#8E909B] leading-relaxed border-t border-white/[0.04]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. Bottom CTA (Mirrored with Explore Cards) */}
        <section className="rounded-2xl bg-[#13141C] border border-white/[0.08] p-8 sm:p-10 text-center space-y-3.5 shadow-lg">
          <h2
            className="text-2xl sm:text-3xl font-normal text-[#F4F4F6]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Ready to Upgrade Your Screen?
          </h2>
          <p className="text-xs sm:text-sm text-[#8E909B] max-w-md mx-auto leading-relaxed">
            Dive into our library of over 25+ curated 8K wallpapers and find your screen&apos;s new signature look.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/explore"
              className="px-6 py-2.5 rounded-full bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition shadow-sm flex items-center gap-2 active:scale-95"
            >
              <span>Explore the Gallery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </main>

      {/* AI Studio Modal */}
      {isAIOpen && (
        <AIEnhancerModal
          isOpen={isAIOpen}
          onClose={() => setIsAIOpen(false)}
          wallpapers={WALLPAPERS}
          onNotify={notify}
        />
      )}

      <Footer onNotify={notify} />
    </div>
  );
}
