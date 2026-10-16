"use client";

import React, { useState } from "react";
import { X, UploadCloud, Sparkles, Check } from "lucide-react";
import { Wallpaper } from "@/data/wallpapers";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWallpaper: (wallpaper: Wallpaper) => void;
  onNotify: (msg: string) => void;
}

export default function UploadModal({
  isOpen,
  onClose,
  onAddWallpaper,
  onNotify,
}: UploadModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Wallpaper["category"]>("nature");
  const [resolution, setResolution] = useState<Wallpaper["resolution"]>("4K");
  const [aiPrompt, setAiPrompt] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl) {
      onNotify("Please select an image to upload!");
      return;
    }

    setIsUploading(true);

    const newWallpaper: Wallpaper = {
      id: `custom-${Date.now()}`,
      title: title || "Custom AI Wallpaper",
      category,
      imageUrl: previewUrl,
      thumbnailUrl: previewUrl,
      resolution,
      dimensions: resolution === "8K" ? "7680 x 4320" : "3840 x 2160",
      aspectRatio: "16:9",
      deviceType: "desktop",
      tags: tagsInput ? tagsInput.split(",").map((t) => t.trim()) : ["AI Enhanced", category],
      aiPrompt: aiPrompt || "Custom user-uploaded AI prompt enhancement",
      aiEngine: "Wallora Community Studio",
      downloads: 1,
      views: 12,
      likes: 1,
      colors: ["#111420", "#38BDF8", "#F59E0B", "#10B981", "#EC4899"],
      recentlyAdded: true,
      author: {
        name: "You (Creator)",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
        verified: true,
      },
      fileSize: "7.5 MB",
    };

    setTimeout(() => {
      onAddWallpaper(newWallpaper);
      setIsUploading(false);
      onNotify(`Published "${newWallpaper.title}" to Wallora!`);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-[#121624] border border-white/10 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-[11px] font-bold tracking-[0.2em] text-amber-400 uppercase block mb-1">
            Creator Studio
          </span>
          <h2
            className="text-2xl font-bold text-white tracking-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Upload AI Wallpaper
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Contribute high-resolution AI art or photography to the Wallora community gallery.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Dropzone / Preview */}
          <div className="relative border-2 border-dashed border-white/15 hover:border-amber-400/50 rounded-2xl p-6 text-center transition bg-[#0B0E17]/60 group">
            {previewUrl ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/20">
                <img src={previewUrl} alt="Upload preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPreviewUrl("")}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center space-y-2 py-4">
                <div className="p-3 rounded-full bg-white/[0.05] group-hover:bg-amber-500/10 transition">
                  <UploadCloud className="w-6 h-6 text-zinc-400 group-hover:text-amber-400" />
                </div>
                <div className="text-sm font-semibold text-zinc-200">
                  Click or drag image to upload
                </div>
                <p className="text-[11px] text-zinc-500">
                  PNG, JPG, or WebP up to 8K resolution (max 25MB)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                Wallpaper Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Neon Cyber Dawn"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Wallpaper["category"])}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#121624] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="nature">Nature</option>
                <option value="aesthetic">Aesthetic</option>
                <option value="anime">Anime</option>
                <option value="minimal">Minimal</option>
                <option value="dark">Dark / OLED</option>
                <option value="city">City</option>
                <option value="space">Space</option>
                <option value="animals">Animals</option>
                <option value="cars">Cars</option>
                <option value="games">Games</option>
                <option value="art">Art</option>
              </select>
            </div>
          </div>

          {/* Resolution & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                Target Resolution
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["4K", "8K"] as const).map((res) => (
                  <button
                    type="button"
                    key={res}
                    onClick={() => setResolution(res)}
                    className={`py-2 rounded-xl text-xs font-bold transition border ${
                      resolution === res
                        ? "bg-amber-500/20 text-amber-300 border-amber-400"
                        : "bg-white/[0.03] text-zinc-400 border-white/10"
                    }`}
                  >
                    {res} UHD
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="sunset, moody, lo-fi, 8k"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* AI Prompt */}
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
              AI Prompt / Parameters (Optional)
            </label>
            <textarea
              rows={2}
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. Cinematic cozy bedroom loft overlooking twilight city, warm lamp lighting, 8k photography..."
              className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isUploading}
            className="w-full py-3.5 rounded-xl bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-200 transition shadow-lg flex items-center justify-center gap-2 mt-4"
          >
            {isUploading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                <span>Publishing to Gallery...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Publish to Wallora Gallery</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
