"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Shield,
  Layers,
  Cpu,
  Monitor,
  Smartphone,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import UploadModal from "@/components/UploadModal";
import AIEnhancerModal from "@/components/AIEnhancerModal";
import SettingsDrawer from "@/components/SettingsDrawer";
import FavoritesModal from "@/components/FavoritesModal";
import Footer from "@/components/Footer";
import { WALLPAPERS } from "@/data/wallpapers";

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [defaultFormat, setDefaultFormat] = useState("PNG");
  const [autoPlayCarousel, setAutoPlayCarousel] = useState(true);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const notify = (msg: string) => setToastMessage(msg);

  const faqs = [
    {
      q: "Are Wallora wallpapers free to download and use?",
      a: "Yes! All wallpapers on Wallora are 100% free to download in up to 8K Ultra HD for personal and commercial desktop and mobile backgrounds. If you use them in public streaming overlays or videos, creator credit is appreciated.",
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
      a: "Yes! Click the 'Upload' button in the sidebar or navbar to submit your creations. You can also apply for our Verified Creator Program on the Creators page to earn revenue share and showcase your artist portfolio.",
    },
    {
      q: "What resolutions are supported for multi-monitor setups?",
      a: "Wallora supports standard 16:9 (3840×2160, 7680×4320), Apple MacBook 16:10, 21:9 Ultrawide (3440×1440), and 9:16 vertical mobile wallpapers (1170×2532).",
    },
  ];

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#EDEDED] flex flex-col font-sans">
      <Navbar
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenAIStudio={() => setIsAIOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <div className="max-w-[1920px] mx-auto w-full px-4 sm:px-6 lg:px-8 flex-1 flex gap-6">
        <Sidebar
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAIStudio={() => setIsAIOpen(true)}
        />

        <main className="flex-1 min-w-0 py-8 pb-24 max-w-5xl mx-auto">
          {/* Hero Statement */}
          <div className="text-center space-y-4 mb-16">
            <span className="text-[11px] font-bold tracking-[0.25em] text-amber-400 uppercase inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              <Sparkles className="w-3 h-3 text-amber-400" />
              The Wallora Philosophy
            </span>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.15]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Redefining How You <br />
              <span className="italic text-amber-200">Experience Your Screens</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              We spend over 9 hours a day in front of screens. Wallora replaces sterile defaults with breathtaking, AI-remastered visual sanctuaries.
            </p>
          </div>

          {/* Pillars of Engineering Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <div className="p-8 rounded-3xl bg-[#121624] border border-white/[0.08] shadow-xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Cpu className="w-6 h-6" />
              </div>
              <h2
                className="text-xl font-bold text-white tracking-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Neural 8K Vector Upscaling
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Standard upscalers blur textures or hallucinate strange artifacts. Wallora utilizes sub-pixel edge alignment and micro-contrast models to preserve raw organic detail on 4K, 5K Retina, and 8K displays.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#121624] border border-white/[0.08] shadow-xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Monitor className="w-6 h-6" />
              </div>
              <h2
                className="text-xl font-bold text-white tracking-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                OLED True-Black Calibration
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                By clamping dark threshold pixels to absolute #000000, our OLED wallpapers physically turn off display pixels on OLED and Mini-LED monitors, delivering infinite contrast and reducing energy draw.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#121624] border border-white/[0.08] shadow-xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Smartphone className="w-6 h-6" />
              </div>
              <h2
                className="text-xl font-bold text-white tracking-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Live Device Studio Mockups
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Never guess how a wallpaper will look behind your icons or clock. Our real-time simulator allows you to test any artwork inside an authentic MacBook Pro, iPhone 16, or Studio Display frame before downloading.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#121624] border border-white/[0.08] shadow-xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <Shield className="w-6 h-6" />
              </div>
              <h2
                className="text-xl font-bold text-white tracking-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                100% Uncompressed Delivery
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We believe digital art deserves zero degradation. Wallora skips aggressive web compression pipelines, serving lossless PNG and high-bitrate WebP masters straight to your downloads folder.
              </p>
            </div>
          </div>

          {/* Device Resolution Specifications Matrix */}
          <section className="mb-16 p-8 rounded-3xl bg-[#111420] border border-white/[0.08] shadow-xl">
            <div className="mb-6">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block mb-1">
                Display Engineering
              </span>
              <h2
                className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
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
                    <td className="py-3.5 px-4 font-semibold text-white">Apple Studio Display 27&quot;</td>
                    <td className="py-3.5 px-4 font-mono">5120 × 2880 (5K)</td>
                    <td className="py-3.5 px-4 font-mono">16:9</td>
                    <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded bg-white/10 text-white">8K UHD</span></td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-white">MacBook Pro 16&quot; Liquid Retina</td>
                    <td className="py-3.5 px-4 font-mono">3456 × 2234</td>
                    <td className="py-3.5 px-4 font-mono">16:10</td>
                    <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">4K / 8K</span></td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-white">Samsung Odyssey 34&quot; Ultrawide</td>
                    <td className="py-3.5 px-4 font-mono">3440 × 1440</td>
                    <td className="py-3.5 px-4 font-mono">21:9</td>
                    <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">Ultrawide</span></td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-white">iPhone 16 Pro Max</td>
                    <td className="py-3.5 px-4 font-mono">1320 × 2868</td>
                    <td className="py-3.5 px-4 font-mono">9:19.5</td>
                    <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Mobile 9:16</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ Accordion */}
          <section className="mb-16">
            <div className="mb-8 text-center">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block mb-1">
                Got Questions?
              </span>
              <h2
                className="text-3xl font-bold text-white tracking-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-[#121624] border border-white/[0.08] overflow-hidden transition"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02]"
                    >
                      <span className="text-sm font-semibold text-white">
                        {faq.q}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs text-zinc-400 leading-relaxed border-t border-white/[0.04]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Bottom CTA */}
          <div className="text-center p-10 rounded-3xl bg-gradient-to-b from-[#141828] to-[#0E111B] border border-white/10 shadow-2xl space-y-4">
            <h2
              className="text-2xl sm:text-3xl font-bold text-white"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Ready to Upgrade Your Screen?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
              Dive into our library of over 25+ curated 8K wallpapers and find your screen&apos;s new signature look.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                href="/explore"
                className="px-6 py-3 rounded-full bg-white text-zinc-950 font-bold text-xs sm:text-sm hover:bg-zinc-200 transition shadow-lg flex items-center gap-2"
              >
                <span>Explore the Gallery</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </main>
      </div>

      <Footer onNotify={notify} />

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddWallpaper={() => {}}
        onNotify={notify}
      />

      <AIEnhancerModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        wallpapers={WALLPAPERS}
        onNotify={notify}
      />

      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favoriteWallpapers={[]}
        onToggleFavorite={() => {}}
        onSelectWallpaper={() => {}}
        onClearFavorites={() => {}}
        onNotify={notify}
      />

      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        defaultFormat={defaultFormat}
        setDefaultFormat={setDefaultFormat}
        autoPlayCarousel={autoPlayCarousel}
        setAutoPlayCarousel={setAutoPlayCarousel}
        onClearFavorites={() => {}}
        onNotify={notify}
      />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#141826]/95 border border-white/15 text-white text-xs font-medium shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-in slide-in-from-bottom-5">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
