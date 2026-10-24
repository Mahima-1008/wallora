import { Wallpaper } from "@/data/wallpapers";

// --- COLOR CLASSIFICATION ---

export interface ColorFamilyOption {
  id: string;
  name: string;
  hex: string;
  border?: boolean;
}

export const COLOR_FAMILIES: ColorFamilyOption[] = [
  { id: "all", name: "All Colors", hex: "transparent" },
  { id: "dark", name: "Dark / Obsidian", hex: "#111217", border: true },
  { id: "light", name: "Light / Warm White", hex: "#F4F4F6", border: true },
  { id: "blue", name: "Blue / Ocean", hex: "#3B82F6" },
  { id: "cyan", name: "Cyan / Turquoise", hex: "#06B6D4" },
  { id: "amber", name: "Amber / Gold", hex: "#F59E0B" },
  { id: "orange", name: "Orange / Sunset", hex: "#F97316" },
  { id: "red", name: "Red / Crimson", hex: "#EF4444" },
  { id: "purple", name: "Purple / Violet", hex: "#8B5CF6" },
  { id: "pink", name: "Pink / Rose", hex: "#EC4899" },
  { id: "green", name: "Green / Emerald", hex: "#10B981" },
];

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let c = hex.replace("#", "");
  if (c.length === 3) {
    c = c.split("").map((x) => x + x).join("");
  }
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function getColorFamilyId(hex: string): string {
  if (!hex || !hex.startsWith("#")) return "dark";
  const { h, s, l } = hexToHsl(hex);

  // Low lightness or very low saturation
  if (l <= 18) return "dark";
  if (l >= 82 && s < 25) return "light";
  if (s < 12) return l < 50 ? "dark" : "light";

  // Hue ranges
  if (h >= 345 || h < 15) return "red";
  if (h >= 15 && h < 45) return "orange";
  if (h >= 45 && h < 70) return "amber";
  if (h >= 70 && h < 165) return "green";
  if (h >= 165 && h < 200) return "cyan";
  if (h >= 200 && h < 255) return "blue";
  if (h >= 255 && h < 315) return "purple";
  if (h >= 315 && h < 345) return "pink";
  return "blue";
}

export function wallpaperMatchesColor(
  wallpaper: Wallpaper,
  colorId: string,
  dominantOnly = false
): boolean {
  if (!colorId || colorId === "all") return true;
  if (!wallpaper.colors || wallpaper.colors.length === 0) return false;

  if (dominantOnly) {
    return getColorFamilyId(wallpaper.colors[0]) === colorId;
  }

  return wallpaper.colors.some((hex) => getColorFamilyId(hex) === colorId);
}

// --- CATEGORY DEFINITIONS ---

export interface CategoryFilterOption {
  id: string;
  name: string;
  description: string;
}

export const EXPLORE_CATEGORIES: CategoryFilterOption[] = [
  { id: "all", name: "All Categories", description: "Every theme & style" },
  { id: "nature", name: "Nature", description: "Mountains, lakes, forests & vistas" },
  { id: "anime", name: "Anime", description: "Cel-shaded, cyber aesthetics & manga" },
  { id: "minimal", name: "Minimal", description: "Clean geometry, negative space & calm" },
  { id: "abstract", name: "Abstract", description: "Refractions, prisms & 3D art" },
  { id: "architecture", name: "Architecture", description: "Cities, brutalism & skyline views" },
  { id: "space", name: "Space", description: "Nebulas, deep cosmos & Webb imagery" },
  { id: "cars", name: "Cars", description: "Supercars, vintage motors & rain asphalt" },
  { id: "animals", name: "Animals", description: "Felines, wildlife & blizzards" },
  { id: "gaming", name: "Gaming", description: "Mechs, cyberpunk & fantasy battlegrounds" },
  { id: "photography", name: "Photography", description: "Fine-art real-world camera compositions" },
];

export function matchesCategory(w: Wallpaper, catId: string): boolean {
  if (!catId || catId === "all") return true;
  const lowerCat = w.category.toLowerCase();
  const lowerTags = w.tags.map((t) => t.toLowerCase());

  switch (catId.toLowerCase()) {
    case "nature":
      return lowerCat === "nature" || lowerTags.includes("nature") || lowerTags.includes("mountains") || lowerTags.includes("landscape");
    case "anime":
      return lowerCat === "anime" || lowerTags.includes("anime") || lowerTags.includes("manga");
    case "minimal":
      return lowerCat === "minimal" || lowerTags.includes("minimal") || lowerTags.includes("minimalist");
    case "abstract":
      return (
        lowerCat === "art" ||
        lowerCat === "abstract" ||
        lowerTags.includes("abstract") ||
        lowerTags.includes("prismatic") ||
        lowerTags.includes("geometry")
      );
    case "architecture":
      return (
        lowerCat === "city" ||
        lowerTags.includes("architecture") ||
        lowerTags.includes("buildings") ||
        lowerTags.includes("cityscape") ||
        lowerTags.includes("brutalist")
      );
    case "space":
      return lowerCat === "space" || lowerTags.includes("space") || lowerTags.includes("nebula") || lowerTags.includes("cosmos") || lowerTags.includes("galaxy");
    case "cars":
      return lowerCat === "cars" || lowerTags.includes("cars") || lowerTags.includes("supercar") || lowerTags.includes("coupe") || lowerTags.includes("automotive");
    case "animals":
      return lowerCat === "animals" || lowerTags.includes("animals") || lowerTags.includes("wildlife") || lowerTags.includes("feline") || lowerTags.includes("leopard");
    case "gaming":
      return (
        lowerCat === "games" ||
        lowerCat === "gaming" ||
        lowerTags.includes("gaming") ||
        lowerTags.includes("mech") ||
        lowerTags.includes("cyberpunk") ||
        lowerTags.includes("cybernetic")
      );
    case "photography":
      return (
        lowerCat === "aesthetic" ||
        lowerTags.includes("photography") ||
        lowerTags.includes("photo") ||
        lowerTags.includes("realistic") ||
        lowerTags.includes("alpine") ||
        lowerTags.includes("ocean")
      );
    default:
      return lowerCat === catId.toLowerCase() || lowerTags.includes(catId.toLowerCase());
  }
}

// --- ORIENTATION DEFINITIONS ---

export interface OrientationOption {
  id: "all" | "landscape" | "portrait" | "square";
  label: string;
  ratio: string;
}

export const ORIENTATIONS: OrientationOption[] = [
  { id: "all", label: "All Orientations", ratio: "Any" },
  { id: "landscape", label: "Landscape", ratio: "16:9 / 21:9" },
  { id: "portrait", label: "Portrait", ratio: "9:16 Mobile" },
  { id: "square", label: "Square", ratio: "1:1 Social" },
];

export function matchesOrientation(w: Wallpaper, orientationId: string): boolean {
  if (!orientationId || orientationId === "all") return true;
  if (orientationId === "landscape") {
    return w.aspectRatio === "16:9" || w.aspectRatio === "21:9";
  }
  if (orientationId === "portrait") {
    return w.aspectRatio === "9:16";
  }
  if (orientationId === "square") {
    return w.aspectRatio === "1:1";
  }
  return true;
}

// --- RESOLUTION DEFINITIONS ---

export interface ResolutionOption {
  id: "all" | "8K" | "4K" | "QHD" | "Full HD" | "HD";
  label: string;
  dimensions: string;
}

export const RESOLUTIONS: ResolutionOption[] = [
  { id: "all", label: "All Resolutions", dimensions: "Any format" },
  { id: "8K", label: "8K Ultra HD", dimensions: "7680 × 4320" },
  { id: "4K", label: "4K Ultra HD", dimensions: "3840 × 2160" },
  { id: "QHD", label: "QHD / 2K", dimensions: "2560 × 1440" },
  { id: "Full HD", label: "Full HD", dimensions: "1920 × 1080" },
  { id: "HD", label: "HD Standard", dimensions: "1280 × 720" },
];

export function matchesResolution(w: Wallpaper, resolutionId: string): boolean {
  if (!resolutionId || resolutionId === "all") return true;
  if (resolutionId === "8K") {
    return w.resolution === "8K" || w.dimensions.includes("7680");
  }
  if (resolutionId === "4K") {
    return w.resolution === "4K" || w.dimensions.includes("3840") || w.dimensions.includes("2532");
  }
  if (resolutionId === "QHD") {
    return w.resolution === "QHD" || w.dimensions.includes("2560") || w.dimensions.includes("3440") || w.dimensions.includes("2880");
  }
  if (resolutionId === "Full HD") {
    return w.dimensions.includes("1920") || w.dimensions.includes("1080");
  }
  if (resolutionId === "HD") {
    return w.resolution === "HD" || w.dimensions.includes("1280") || w.dimensions.includes("720") || w.dimensions.includes("1376");
  }
  return true;
}

// --- SORTING DEFINITIONS ---

export interface SortOption {
  id: "trending" | "downloads" | "newest" | "likes";
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { id: "trending", label: "Trending" },
  { id: "downloads", label: "Most Downloaded" },
  { id: "newest", label: "Newest First" },
  { id: "likes", label: "Most Favorited" },
];

export function sortWallpapers(wallpapers: Wallpaper[], sortBy: string): Wallpaper[] {
  const list = [...wallpapers];
  switch (sortBy) {
    case "downloads":
      return list.sort((a, b) => b.downloads - a.downloads);
    case "newest":
      return list.sort((a, b) => (b.recentlyAdded ? 1 : 0) - (a.recentlyAdded ? 1 : 0));
    case "likes":
      return list.sort((a, b) => b.likes - a.likes);
    case "trending":
    default:
      return list.sort((a, b) => b.views - a.views);
  }
}

// --- SEARCH MATCHING ---

export function matchesSearch(w: Wallpaper, query: string): boolean {
  if (!query || !query.trim()) return true;
  const q = query.toLowerCase().trim();

  // Match title
  if (w.title.toLowerCase().includes(q)) return true;

  // Match tags
  if (w.tags.some((tag) => tag.toLowerCase().includes(q))) return true;

  // Match category
  if (w.category.toLowerCase().includes(q)) return true;

  // Match creator name
  if (w.author.name.toLowerCase().includes(q)) return true;

  // Match AI prompt keywords
  if (w.aiPrompt.toLowerCase().includes(q)) return true;

  // Match hex colors
  if (w.colors.some((c) => c.toLowerCase().includes(q))) return true;

  // Match common color names in query
  const colorNameMatches: Record<string, string> = {
    dark: "dark",
    black: "dark",
    obsidian: "dark",
    light: "light",
    white: "light",
    blue: "blue",
    cyan: "cyan",
    teal: "cyan",
    amber: "amber",
    gold: "amber",
    yellow: "amber",
    orange: "orange",
    sunset: "orange",
    red: "red",
    crimson: "red",
    purple: "purple",
    violet: "purple",
    pink: "pink",
    rose: "pink",
    green: "green",
    emerald: "green",
  };

  for (const [name, famId] of Object.entries(colorNameMatches)) {
    if (q.includes(name)) {
      if (w.colors.some((c) => getColorFamilyId(c) === famId)) {
        return true;
      }
    }
  }

  return false;
}
