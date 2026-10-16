export interface Wallpaper {
  id: string;
  title: string;
  category:
    | "nature"
    | "aesthetic"
    | "anime"
    | "minimal"
    | "dark"
    | "city"
    | "space"
    | "animals"
    | "cars"
    | "games"
    | "art";
  imageUrl: string;
  thumbnailUrl: string;
  resolution: "4K" | "8K" | "QHD" | "OLED";
  dimensions: string;
  aspectRatio: "16:9" | "9:16" | "21:9";
  deviceType: "desktop" | "mobile" | "laptop" | "ultrawide";
  tags: string[];
  aiPrompt: string;
  aiEngine: string;
  downloads: number;
  views: number;
  likes: number;
  colors: string[];
  featured?: boolean;
  trending?: boolean;
  recentlyAdded?: boolean;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  fileSize: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  count: number;
  thumbnail?: string;
  isAll?: boolean;
}

export const CATEGORIES: CategoryItem[] = [
  { id: "all", name: "All", slug: "all", count: 48, isAll: true },
  {
    id: "nature",
    name: "Nature",
    slug: "nature",
    count: 14,
    thumbnail: "/wallpapers/mountain_lake.jpg",
  },
  {
    id: "aesthetic",
    name: "Aesthetic",
    slug: "aesthetic",
    count: 12,
    thumbnail: "/wallpapers/tulips_sunlight.jpg",
  },
  {
    id: "anime",
    name: "Anime",
    slug: "anime",
    count: 9,
    thumbnail: "/wallpapers/cyberpunk_anime.jpg",
  },
  {
    id: "minimal",
    name: "Minimal",
    slug: "minimal",
    count: 8,
    thumbnail: "/wallpapers/minimal_architecture.jpg",
  },
  {
    id: "dark",
    name: "Dark",
    slug: "dark",
    count: 16,
    thumbnail: "/wallpapers/night_city_crescent.jpg",
  },
  {
    id: "city",
    name: "City",
    slug: "city",
    count: 11,
    thumbnail: "/wallpapers/cozy_desk_sunset.jpg",
  },
  {
    id: "space",
    name: "Space",
    slug: "space",
    count: 7,
    thumbnail: "/wallpapers/cosmic_nebula.jpg",
  },
  {
    id: "animals",
    name: "Animals",
    slug: "animals",
    count: 6,
    thumbnail: "/wallpapers/cat_golden_eyes.jpg",
  },
  {
    id: "cars",
    name: "Cars",
    slug: "cars",
    count: 8,
    thumbnail: "/wallpapers/black_supercar.jpg",
  },
  {
    id: "games",
    name: "Games",
    slug: "games",
    count: 7,
    thumbnail:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "art",
    name: "Art",
    slug: "art",
    count: 10,
    thumbnail:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
  },
];

export const WALLPAPERS: Wallpaper[] = [
  {
    id: "wall-1",
    title: "Alpine Mirror Lake & Peak",
    category: "nature",
    imageUrl: "/wallpapers/mountain_lake.jpg",
    thumbnailUrl: "/wallpapers/mountain_lake.jpg",
    resolution: "4K",
    dimensions: "3840 x 2160",
    aspectRatio: "16:9",
    deviceType: "desktop",
    tags: ["Mountains", "Reflection", "Alpine", "Sunrise", "Calm"],
    aiPrompt:
      "Stunning majestic snow capped mountain peak perfectly reflected in a still crystal clear alpine lake, soft dramatic morning dawn light, pine forests on shore, ultra realistic 8k wallpaper photography",
    aiEngine: "Wallora Diffusion Ultra 4.2",
    downloads: 14208,
    views: 48920,
    likes: 3120,
    colors: ["#2C3E50", "#E0D7C6", "#4A6B82", "#1A252C", "#8CA6BC"],
    featured: true,
    trending: true,
    author: {
      name: "Elias Vance",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      verified: true,
    },
    fileSize: "6.8 MB",
  },
  {
    id: "wall-2",
    title: "Twilight Skyline Study Haven",
    category: "aesthetic",
    imageUrl: "/wallpapers/cozy_desk_sunset.jpg",
    thumbnailUrl: "/wallpapers/cozy_desk_sunset.jpg",
    resolution: "4K",
    dimensions: "3840 x 2160",
    aspectRatio: "16:9",
    deviceType: "desktop",
    tags: ["Lo-Fi", "Study", "Desk", "City View", "Warm"],
    aiPrompt:
      "Aesthetic cozy workspace desk at dusk with a glowing brass lamp, laptop open on wooden table, warm ambient interior light, large window looking out onto twilight city skyline, indoor monstera plants, peaceful lo-fi atmosphere, 8k wallpaper",
    aiEngine: "Midjourney v6.1 Enhanced",
    downloads: 22840,
    views: 67390,
    likes: 5410,
    colors: ["#D97706", "#1E293B", "#78350F", "#F59E0B", "#0F172A"],
    featured: true,
    trending: true,
    author: {
      name: "Sora K.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      verified: true,
    },
    fileSize: "7.2 MB",
  },
  {
    id: "wall-3",
    title: "Crescent Moon Nocturne",
    category: "dark",
    imageUrl: "/wallpapers/night_city_crescent.jpg",
    thumbnailUrl: "/wallpapers/night_city_crescent.jpg",
    resolution: "4K",
    dimensions: "3840 x 2160",
    aspectRatio: "16:9",
    deviceType: "desktop",
    tags: ["OLED", "Crescent Moon", "Night Sky", "Cityscape", "Minimal"],
    aiPrompt:
      "Moody cinematic dark night city skyline with skyscrapers and rooftops, delicate glowing crescent moon in starry indigo night sky, atmospheric subtle city lights, minimalist aesthetic, 8k wallpaper",
    aiEngine: "Wallora OLED Master Pro",
    downloads: 38910,
    views: 94100,
    likes: 8940,
    colors: ["#0B0E14", "#1E293B", "#F1F5F9", "#334155", "#0F172A"],
    featured: true,
    trending: true,
    author: {
      name: "Nico Thorne",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
      verified: true,
    },
    fileSize: "5.4 MB",
  },
  {
    id: "wall-4",
    title: "Pastel Dusk Ocean Tide",
    category: "aesthetic",
    imageUrl: "/wallpapers/sunset_ocean_clouds.jpg",
    thumbnailUrl: "/wallpapers/sunset_ocean_clouds.jpg",
    resolution: "4K",
    dimensions: "3840 x 2160",
    aspectRatio: "16:9",
    deviceType: "desktop",
    tags: ["Ocean", "Pastel", "Lilac", "Beach", "Sunset"],
    aiPrompt:
      "Gentle pastel pink and lilac sunset clouds over peaceful calm ocean waves on sandy beach, dreamy aesthetic horizon, serene golden dusk light, ultra high definition 8k wallpaper photography",
    aiEngine: "Flux.1 Cinematic Pro",
    downloads: 18230,
    views: 52140,
    likes: 4290,
    colors: ["#E0A899", "#818CF8", "#FBCFE8", "#475569", "#FDE047"],
    featured: false,
    trending: true,
    author: {
      name: "Aria Sterling",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
      verified: true,
    },
    fileSize: "6.1 MB",
  },
  {
    id: "wall-5",
    title: "Kyoto Twilight Blossom Street",
    category: "city",
    imageUrl: "/wallpapers/cherry_blossom_street.jpg",
    thumbnailUrl: "/wallpapers/cherry_blossom_street.jpg",
    resolution: "4K",
    dimensions: "3840 x 2160",
    aspectRatio: "16:9",
    deviceType: "desktop",
    tags: ["Sakura", "Japan", "Kyoto", "Lanterns", "Twilight"],
    aiPrompt:
      "Photorealistic Japanese cobblestone street lined with blooming pink cherry blossom trees at twilight, traditional lanterns glowing softly, petals on the ground, 8k cinematic wallpaper",
    aiEngine: "Wallora Diffusion Ultra 4.2",
    downloads: 31400,
    views: 89020,
    likes: 7650,
    colors: ["#F472B6", "#F59E0B", "#1E1B4B", "#701A75", "#312E81"],
    featured: true,
    trending: true,
    author: {
      name: "Kenji Sato",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80",
      verified: true,
    },
    fileSize: "8.4 MB",
  },
  {
    id: "wall-6",
    title: "Minimal Sunlit White Tulips",
    category: "aesthetic",
    imageUrl: "/wallpapers/tulips_sunlight.jpg",
    thumbnailUrl: "/wallpapers/tulips_sunlight.jpg",
    resolution: "4K",
    dimensions: "3840 x 2160",
    aspectRatio: "16:9",
    deviceType: "desktop",
    tags: ["Minimalist", "Tulips", "Shadows", "Sunlight", "Clean"],
    aiPrompt:
      "Minimalist elegant white tulips in a vase with soft dramatic diagonal morning sunlight and architectural window shadows on warm neutral beige wall, fine art photography, 8k wallpaper",
    aiEngine: "Wallora Studio Lens v3",
    downloads: 16900,
    views: 45780,
    likes: 3820,
    colors: ["#D4C4B5", "#FDFBF7", "#4D7C0F", "#78716C", "#A8A29E"],
    featured: false,
    trending: true,
    author: {
      name: "Hannah Lind",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
      verified: true,
    },
    fileSize: "5.8 MB",
  },
  {
    id: "wall-7",
    title: "Skyline Loft Sunset Panorama",
    category: "city",
    imageUrl: "/wallpapers/hero_sunset_room.jpg",
    thumbnailUrl: "/wallpapers/hero_sunset_room.jpg",
    resolution: "8K",
    dimensions: "7680 x 4320",
    aspectRatio: "16:9",
    deviceType: "desktop",
    tags: ["Loft", "Golden Hour", "New York", "Panoramic", "Cozy"],
    aiPrompt:
      "Cinematic cozy bedroom loft with a huge panoramic window overlooking a sprawling city skyline at golden hour sunset, warm interior desk lamp, aesthetic plants on windowsill, moody atmospheric lighting, ultra high definition 8k wallpaper",
    aiEngine: "Wallora Masterpiece 8K",
    downloads: 45200,
    views: 120500,
    likes: 11400,
    colors: ["#B45309", "#EA580C", "#1E293B", "#FDE047", "#0F172A"],
    featured: true,
    recentlyAdded: true,
    author: {
      name: "Wallora Curators",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
      verified: true,
    },
    fileSize: "9.6 MB",
  },
  {
    id: "wall-8",
    title: "Tokyo 2099 Cyber Runner",
    category: "anime",
    imageUrl: "/wallpapers/cyberpunk_anime.jpg",
    thumbnailUrl: "/wallpapers/cyberpunk_anime.jpg",
    resolution: "8K",
    dimensions: "7680 x 4320",
    aspectRatio: "16:9",
    deviceType: "desktop",
    tags: ["Cyberpunk", "Anime", "Neon", "Rain", "Sci-Fi"],
    aiPrompt:
      "Cinematic anime style cyberpunk character with subtle glowing neon visor looking over a sprawling futuristic rainy neo Tokyo metropolis, detailed, atmospheric, 8k wallpaper",
    aiEngine: "Niji Anime v6 Ultra",
    downloads: 33700,
    views: 89400,
    likes: 7920,
    colors: ["#06B6D4", "#EC4899", "#0F172A", "#3B82F6", "#1E1B4B"],
    featured: true,
    recentlyAdded: true,
    author: {
      name: "Ren Takahashi",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80",
      verified: true,
    },
    fileSize: "8.9 MB",
  },
  {
    id: "wall-9",
    title: "Aura of the Golden Gaze",
    category: "animals",
    imageUrl: "/wallpapers/cat_golden_eyes.jpg",
    thumbnailUrl: "/wallpapers/cat_golden_eyes.jpg",
    resolution: "4K",
    dimensions: "3840 x 2160",
    aspectRatio: "16:9",
    deviceType: "desktop",
    tags: ["Cat", "Portrait", "Wildlife", "Emerald", "Moody"],
    aiPrompt:
      "Hyperrealistic cinematic close up portrait of a majestic tabby cat with glowing emerald golden eyes in soft moody shadows, fine fur details, 8k wallpaper photography",
    aiEngine: "Wallora Nature Photoreal",
    downloads: 24100,
    views: 61200,
    likes: 5620,
    colors: ["#D97706", "#1C1917", "#78350F", "#A3E635", "#292524"],
    featured: false,
    recentlyAdded: true,
    author: {
      name: "Chloe Martin",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
      verified: true,
    },
    fileSize: "6.2 MB",
  },
  {
    id: "wall-10",
    title: "Obsidian McLaren Rain Asphalt",
    category: "cars",
    imageUrl: "/wallpapers/black_supercar.jpg",
    thumbnailUrl: "/wallpapers/black_supercar.jpg",
    resolution: "8K",
    dimensions: "7680 x 4320",
    aspectRatio: "16:9",
    deviceType: "desktop",
    tags: ["Supercar", "Rain", "Night", "Wet Asphalt", "Matte Black"],
    aiPrompt:
      "Sleek matte black luxury exotic supercar parked on wet asphalt rain reflections at night, glowing red aerodynamic taillights, atmospheric moody city street lighting, 8k wallpaper photography",
    aiEngine: "Wallora Automotive Studio",
    downloads: 41800,
    views: 104200,
    likes: 9810,
    colors: ["#EF4444", "#090A0F", "#1F2937", "#9CA3AF", "#B91C1C"],
    featured: true,
    recentlyAdded: true,
    author: {
      name: "Marcus Cole",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
      verified: true,
    },
    fileSize: "9.1 MB",
  },
  {
    id: "wall-11",
    title: "Celestial Black Hole Singularity",
    category: "space",
    imageUrl: "/wallpapers/cosmic_nebula.jpg",
    thumbnailUrl: "/wallpapers/cosmic_nebula.jpg",
    resolution: "8K",
    dimensions: "7680 x 4320",
    aspectRatio: "16:9",
    deviceType: "desktop",
    tags: ["Nebula", "Deep Space", "Cosmos", "Astronomy", "Black Hole"],
    aiPrompt:
      "Breathtaking cosmic deep space nebula with glowing magenta and cyan star clusters, accretion disk around a shimmering celestial rift, James Webb space telescope style, 8k wallpaper",
    aiEngine: "Astrophoto AI v2.4",
    downloads: 36200,
    views: 88500,
    likes: 8430,
    colors: ["#D946EF", "#06B6D4", "#F59E0B", "#030712", "#4C1D95"],
    featured: true,
    recentlyAdded: true,
    author: {
      name: "Dr. Paul Sagan",
      avatar: "https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=120&q=80",
      verified: true,
    },
    fileSize: "9.8 MB",
  },
  {
    id: "wall-12",
    title: "Monolith in Mist Waters",
    category: "minimal",
    imageUrl: "/wallpapers/minimal_architecture.jpg",
    thumbnailUrl: "/wallpapers/minimal_architecture.jpg",
    resolution: "4K",
    dimensions: "3840 x 2160",
    aspectRatio: "16:9",
    deviceType: "desktop",
    tags: ["Brutalist", "Monolith", "Fog", "Minimalist", "Architecture"],
    aiPrompt:
      "Minimalist brutalist concrete monolith structure rising out of calm misty reflective water under overcast neutral gray minimalist sky, fine art architectural photography, 8k wallpaper",
    aiEngine: "Wallora Architecture AI",
    downloads: 19400,
    views: 47200,
    likes: 3910,
    colors: ["#6B7280", "#1F2937", "#9CA3AF", "#E5E7EB", "#374151"],
    featured: false,
    recentlyAdded: true,
    author: {
      name: "Freja Olsen",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      verified: true,
    },
    fileSize: "5.1 MB",
  },
  {
    id: "wall-13",
    title: "Neo Shinjuku Lockscreen Neon",
    category: "city",
    imageUrl: "/wallpapers/phone_cyberpunk_neon.jpg",
    thumbnailUrl: "/wallpapers/phone_cyberpunk_neon.jpg",
    resolution: "4K",
    dimensions: "1170 x 2532",
    aspectRatio: "9:16",
    deviceType: "mobile",
    tags: ["Mobile", "Lockscreen", "Tokyo", "Cyberpunk", "Vertical"],
    aiPrompt:
      "Vertical smartphone wallpaper 9:16 aspect ratio, moody neon Tokyo alleyway at night with glowing kanji holographic signs, rain slicked asphalt, purple and cyan cyberpunk aesthetic, 8k ultra detailed",
    aiEngine: "Wallora Mobile Studio Pro",
    downloads: 51200,
    views: 139000,
    likes: 12800,
    colors: ["#06B6D4", "#A855F7", "#090A0F", "#F43F5E", "#1E1B4B"],
    featured: true,
    recentlyAdded: true,
    author: {
      name: "Tatsuya Mori",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      verified: true,
    },
    fileSize: "7.8 MB",
  },
  {
    id: "wall-14",
    title: "Boreal Pine Forest Winter Frost",
    category: "nature",
    imageUrl:
      "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?auto=format&fit=crop&w=2400&q=85",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?auto=format&fit=crop&w=800&q=80",
    resolution: "4K",
    dimensions: "3840 x 2160",
    aspectRatio: "16:9",
    deviceType: "desktop",
    tags: ["Snow", "Winter", "Pine Forest", "Frost", "Nordic"],
    aiPrompt:
      "Ultra detailed Nordic pine forest heavy with freshly fallen powder snow, misty cold atmosphere, crisp winter morning light, fine art nature landscape 8k",
    aiEngine: "Wallora Nature Photoreal",
    downloads: 21500,
    views: 59300,
    likes: 4780,
    colors: ["#E2E8F0", "#334155", "#0F172A", "#64748B", "#94A3B8"],
    featured: false,
    recentlyAdded: true,
    author: {
      name: "Astrid Lindgren",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
      verified: true,
    },
    fileSize: "6.4 MB",
  },
  {
    id: "wall-15",
    title: "Iridescent Liquid Chrome Dreams",
    category: "art",
    imageUrl:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    resolution: "8K",
    dimensions: "7680 x 4320",
    aspectRatio: "16:9",
    deviceType: "desktop",
    tags: ["3D Render", "Chrome", "Holographic", "Abstract", "Fluid"],
    aiPrompt:
      "Flowing holographic liquid metal ribbons undulating in dark void, iridescent prism color dispersion, glass refraction caustics, octane render 8k",
    aiEngine: "Wallora 3D Octane Studio",
    downloads: 37900,
    views: 92400,
    likes: 8190,
    colors: ["#EC4899", "#8B5CF6", "#06B6D4", "#1E1B4B", "#F43F5E"],
    featured: false,
    recentlyAdded: true,
    author: {
      name: "Zane Voxel",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80",
      verified: true,
    },
    fileSize: "9.2 MB",
  },
  {
    id: "wall-16",
    title: "Cyberpunk Mech Pilot Cockpit",
    category: "games",
    imageUrl:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=2400&q=85",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    resolution: "4K",
    dimensions: "3840 x 2160",
    aspectRatio: "16:9",
    deviceType: "desktop",
    tags: ["Gaming", "Mech", "Sci-Fi", "HUD", "Cyberpunk"],
    aiPrompt:
      "Detailed futuristic titanium mech cockpit with glowing holographic HUD display interfaces, orbital planetary view through viewport, 8k unreal engine 5 render",
    aiEngine: "Wallora GameArt Pro",
    downloads: 29800,
    views: 74500,
    likes: 6410,
    colors: ["#F97316", "#0284C7", "#090A0F", "#FACC15", "#1E293B"],
    featured: false,
    recentlyAdded: true,
    author: {
      name: "Alex Cross",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
      verified: true,
    },
    fileSize: "7.1 MB",
  },
];

export interface CollectionItem {
  id: string;
  title: string;
  subtitle: string;
  wallpaperCount: number;
  coverImage: string;
  tags: string[];
}

export const CURATED_COLLECTIONS: CollectionItem[] = [
  {
    id: "col-1",
    title: "Cyberpunk Tokyo 2099",
    subtitle: "Neon-soaked alleys, holographic rain, and high-tech dystopias",
    wallpaperCount: 16,
    coverImage: "/wallpapers/cyberpunk_anime.jpg",
    tags: ["Neon", "Anime", "Sci-Fi", "Rain"],
  },
  {
    id: "col-2",
    title: "Lo-Fi Dusk & Sunset Havens",
    subtitle: "Warm study lamps, steaming coffee, and skyline window views",
    wallpaperCount: 24,
    coverImage: "/wallpapers/hero_sunset_room.jpg",
    tags: ["Aesthetic", "Cozy", "Golden Hour", "Study"],
  },
  {
    id: "col-3",
    title: "OLED Pure Blacks & Deep Cosmos",
    subtitle: "Pixel-perfect true blacks optimized for OLED & mini-LED panels",
    wallpaperCount: 19,
    coverImage: "/wallpapers/night_city_crescent.jpg",
    tags: ["OLED", "Minimal", "Cosmos", "Dark"],
  },
  {
    id: "col-4",
    title: "Nordic Solitude & Alpine Waters",
    subtitle: "Pristine mountain reflections, silent fjords, and pine forests",
    wallpaperCount: 22,
    coverImage: "/wallpapers/mountain_lake.jpg",
    tags: ["Nature", "Alpine", "Reflections", "Nordic"],
  },
];
