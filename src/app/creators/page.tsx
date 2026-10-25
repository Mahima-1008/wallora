import type { Metadata } from "next";
import CreatorsDiscoveryClient from "./CreatorsDiscoveryClient";

export const metadata: Metadata = {
  title: "Discover Wallpaper Creators & Digital Artists | Wallora",
  description:
    "Explore world-class 8K wallpaper creators, astrophotographers, and environment artists. Discover their portfolios, specialty aesthetics, and follow for new wallpaper drops.",
  keywords: [
    "wallpaper creators",
    "digital artists",
    "8K photography",
    "astrophotography",
    "minimalist artists",
    "AI concept artists",
    "Wallora creators",
  ],
  openGraph: {
    title: "Discover Wallpaper Creators & Digital Artists | Wallora",
    description:
      "Explore world-class 8K wallpaper creators, astrophotographers, and environment artists on Wallora.",
    type: "website",
    url: "https://wallora.art/creators",
  },
  twitter: {
    card: "summary_large_image",
    title: "Discover Wallpaper Creators & Digital Artists | Wallora",
    description:
      "Explore world-class 8K wallpaper creators, astrophotographers, and environment artists on Wallora.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CreatorsPage() {
  return <CreatorsDiscoveryClient />;
}
