# 🌌 Wallora — AI-Enhanced Wallpaper Download Platform

A modern, high-performance web platform built with **Next.js 16**, **Tailwind CSS**, and **Framer Motion** for discovering, customizing, and downloading ultra high-resolution AI-enhanced wallpapers for mobile devices, laptops, desktops, and ultrawide monitors.

![Wallora Preview](public/wallpapers/hero_sunset_room.jpg)

---

## ✨ Features

- **🎨 Luxury Obsidian Aesthetic**: Designed with an ultra-deep dark theme, glassmorphism (`backdrop-blur-xl`), glowing neon borders, and elegant editorial serif typography (**Playfair Display**).
- **📱 Device Mockup Studio Simulator**: Preview any wallpaper live inside interactive CSS device frames:
  - **MacBook Pro** (with notch, menu bar, and macOS dock)
  - **iPhone 16 Pro** (with Dynamic Island, clock, and status bar)
  - **Studio Display Desktop** (with aluminum stand)
- **⚡ 1-Click Resolution Downloader**: Real client-side canvas engine capable of rendering and downloading in:
  - **8K Ultra HD** (7680 × 4320)
  - **4K UHD** (3840 × 2160)
  - **Mobile 9:16** (1170 × 2532)
  - **Ultrawide 21:9** (3440 × 1440)
  - Celebratory `canvas-confetti` micro-animation on download.
- **🏷️ Visual Category Chips**: Interactive category filter bar featuring thumbnail previews for *Nature, Aesthetic, Anime, Minimal, Dark / OLED, City, Space, Animals, Cars, Games, and Art*.
- **🔍 Instant Search & Quick Suggestions**: Autocomplete search with `⌘K` keyboard shortcut support.
- **🎯 Multi-Device & Resolution Filters**: Filter wallpapers by aspect ratio, resolution (4K, 8K, OLED pure blacks), and sort by trending, views, downloads, and newest.
- **🎨 Color Palette Extractor**: Extracts dominant 5-color hex swatches with 1-click clipboard copying.
- **🤖 AI Prompt Inspector & Studio**: Inspect prompts, generation models, and upscale parameters. Includes an interactive AI Studio for neural enhancement and OLED black calibration.
- **💾 LocalStorage Favorites**: Save wallpapers to favorites with a persistent counter badge and dedicated drawer.
- **📤 Community Upload**: Upload and publish custom wallpapers directly to the gallery during the session.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations & Micro-interactions**: [Framer Motion](https://www.framer.com/motion/), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: [Google Fonts](https://fonts.google.com/) via `next/font` (Playfair Display & Plus Jakarta Sans)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Mahima-1008/wallora.git
cd wallora
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience the platform.

### 4. Build for production
```bash
npm run build
npm run start
```

---

## 📄 License

MIT License. Free for personal and commercial usage.
