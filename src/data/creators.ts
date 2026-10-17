export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  coverImage: string;
  bio: string;
  location: string;
  specialty: string;
  verified: boolean;
  featured: boolean;
  downloads: number;
  likes: number;
  followers: number;
  wallpapersCount: number;
  topWallpapers: string[]; // URLs of preview wallpapers
  socials: {
    twitter?: string;
    instagram?: string;
    artstation?: string;
  };
}

export const CREATORS: Creator[] = [
  {
    id: "creator-1",
    name: "Elias Vance",
    handle: "@eliasvance",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    coverImage: "/wallpapers/mountain_lake.jpg",
    bio: "Alpine landscape photographer and generative landscape architect. Capturing pristine waters and dawn summits in 8K.",
    location: "Zurich, Switzerland",
    specialty: "Alpine & Nature Landscapes",
    verified: true,
    featured: true,
    downloads: 184500,
    likes: 24300,
    followers: 12800,
    wallpapersCount: 28,
    topWallpapers: [
      "/wallpapers/mountain_lake.jpg",
      "/wallpapers/foggy_mountain_highway.jpg",
      "/wallpapers/sunset_ocean_clouds.jpg",
    ],
    socials: {
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
    },
  },
  {
    id: "creator-2",
    name: "Sora K.",
    handle: "@sorak_art",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    coverImage: "/wallpapers/cozy_desk_sunset.jpg",
    bio: "Lo-Fi concept artist and interior lighting specialist. Designing peaceful workspaces for focus and creative coding.",
    location: "Tokyo, Japan",
    specialty: "Lo-Fi & Aesthetic Havens",
    verified: true,
    featured: true,
    downloads: 215000,
    likes: 31200,
    followers: 18400,
    wallpapersCount: 34,
    topWallpapers: [
      "/wallpapers/cozy_desk_sunset.jpg",
      "/wallpapers/hero_sunset_room.jpg",
      "/wallpapers/rainy_cafe_window.jpg",
    ],
    socials: {
      twitter: "https://twitter.com",
      artstation: "https://artstation.com",
    },
  },
  {
    id: "creator-3",
    name: "Nico Thorne",
    handle: "@nicothorne",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    coverImage: "/wallpapers/night_city_crescent.jpg",
    bio: "OLED dark mode evangelist and nocturnal cityscape hunter. Fine-tuning true blacks for Apple XDR and OLED panels.",
    location: "Berlin, Germany",
    specialty: "AMOLED Dark & Minimalist",
    verified: true,
    featured: true,
    downloads: 298000,
    likes: 42100,
    followers: 24600,
    wallpapersCount: 41,
    topWallpapers: [
      "/wallpapers/night_city_crescent.jpg",
      "/wallpapers/bioluminescent_jellyfish.jpg",
      "/wallpapers/minimal_architecture.jpg",
    ],
    socials: {
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
    },
  },
  {
    id: "creator-4",
    name: "Ren Takahashi",
    handle: "@ren_cyber",
    avatar:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80",
    coverImage: "/wallpapers/cyberpunk_anime.jpg",
    bio: "Cyberpunk illustrator and anime 3D environment artist. Neon reflections, rainy megacities, and mecha aesthetics.",
    location: "Osaka, Japan",
    specialty: "Cyberpunk & Anime Concept Art",
    verified: true,
    featured: true,
    downloads: 342000,
    likes: 48900,
    followers: 29800,
    wallpapersCount: 46,
    topWallpapers: [
      "/wallpapers/cyberpunk_anime.jpg",
      "/wallpapers/mech_warrior_neon.jpg",
      "/wallpapers/phone_cyberpunk_neon.jpg",
    ],
    socials: {
      twitter: "https://twitter.com",
      artstation: "https://artstation.com",
    },
  },
  {
    id: "creator-5",
    name: "Dr. Paul Sagan",
    handle: "@paulsagan_astro",
    avatar:
      "https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=300&q=80",
    coverImage: "/wallpapers/pillars_of_creation_gold.jpg",
    bio: "Astrophysicist and deep-space imaging researcher. Processing raw James Webb and Hubble telemetry data into 8K visual masterpieces.",
    location: "Pasadena, USA",
    specialty: "Astrophotography & Deep Space",
    verified: true,
    featured: false,
    downloads: 275000,
    likes: 38400,
    followers: 21500,
    wallpapersCount: 32,
    topWallpapers: [
      "/wallpapers/pillars_of_creation_gold.jpg",
      "/wallpapers/cosmic_nebula.jpg",
      "/wallpapers/abstract_prismatic_glass.jpg",
    ],
    socials: {
      twitter: "https://twitter.com",
    },
  },
  {
    id: "creator-6",
    name: "Dante Rossi",
    handle: "@danterossi_motors",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
    coverImage: "/wallpapers/vintage_porsche_rain.jpg",
    bio: "Automotive cinematographer focusing on wet asphalt reflections, classic air-cooled Porsches, and modern matte hypercars.",
    location: "Milan, Italy",
    specialty: "Automotive & Supercars",
    verified: true,
    featured: false,
    downloads: 210000,
    likes: 29800,
    followers: 17200,
    wallpapersCount: 25,
    topWallpapers: [
      "/wallpapers/vintage_porsche_rain.jpg",
      "/wallpapers/black_supercar.jpg",
      "/wallpapers/foggy_mountain_highway.jpg",
    ],
    socials: {
      instagram: "https://instagram.com",
    },
  },
  {
    id: "creator-7",
    name: "Aoi Miyazaki",
    handle: "@aoi_shrine",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    coverImage: "/wallpapers/anime_celestial_lanterns.jpg",
    bio: "Celestial anime and fantasy matte painter inspired by Shinto mythology, auroras, and quiet midnight shrines.",
    location: "Kyoto, Japan",
    specialty: "Fantasy & Celestial Anime",
    verified: true,
    featured: true,
    downloads: 310000,
    likes: 44200,
    followers: 26100,
    wallpapersCount: 38,
    topWallpapers: [
      "/wallpapers/anime_celestial_lanterns.jpg",
      "/wallpapers/cherry_blossom_street.jpg",
      "/wallpapers/cyberpunk_anime.jpg",
    ],
    socials: {
      twitter: "https://twitter.com",
      artstation: "https://artstation.com",
    },
  },
  {
    id: "creator-8",
    name: "Freja Olsen",
    handle: "@freja_minimal",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    coverImage: "/wallpapers/minimal_architecture.jpg",
    bio: "Scandinavian minimalist and brutalist architectural photographer. Geometry, quiet fog, and pure concrete lines.",
    location: "Copenhagen, Denmark",
    specialty: "Brutalism & Minimalism",
    verified: true,
    featured: false,
    downloads: 165000,
    likes: 22100,
    followers: 14300,
    wallpapersCount: 22,
    topWallpapers: [
      "/wallpapers/minimal_architecture.jpg",
      "/wallpapers/tulips_sunlight.jpg",
      "/wallpapers/mountain_lake.jpg",
    ],
    socials: {
      instagram: "https://instagram.com",
    },
  },
];
