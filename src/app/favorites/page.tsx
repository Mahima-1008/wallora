import { Metadata } from "next";
import FavoritesPageClient from "./FavoritesPageClient";

export const metadata: Metadata = {
  title: "My Saved Favorites — Wallora",
  description:
    "View and manage your curated library of saved 4K and ultra HD wallpapers. Synchronized across pages and sessions.",
  openGraph: {
    title: "My Saved Favorites — Wallora",
    description:
      "View and manage your curated library of saved 4K and ultra HD wallpapers.",
  },
};

export default function FavoritesPage() {
  return <FavoritesPageClient />;
}
