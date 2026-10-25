import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CREATORS } from "@/data/creators";
import { WALLPAPERS } from "@/data/wallpapers";
import {
  getCreatorByIdOrSlug,
  getCreatorForAuthor,
  getWallpapersByCreator,
  slugify,
} from "@/lib/creatorUtils";
import CreatorProfileClient from "./CreatorProfileClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  const ids = new Set<string>();

  // Add all curated creator IDs and slugs
  CREATORS.forEach((c) => {
    ids.add(c.id);
    ids.add(slugify(c.name));
  });

  // Add author slugs from wallpapers
  WALLPAPERS.forEach((w) => {
    ids.add(slugify(w.author.name));
  });

  return Array.from(ids).map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const creator = getCreatorByIdOrSlug(id) || getCreatorForAuthor(id);

  if (!creator) {
    return {
      title: "Creator Not Found | Wallora",
      description: "The requested creator profile could not be found.",
    };
  }

  const title = `${creator.name} (${creator.handle}) — Wallpaper Creator | Wallora`;
  const description = `${creator.bio} Explore 8K and 4K wallpapers created by ${creator.name} on Wallora.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: [
        {
          url: creator.coverImage,
          width: 1200,
          height: 630,
          alt: `${creator.name} - Wallora Creator`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [creator.coverImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CreatorPage({ params }: PageProps) {
  const { id } = await params;
  const creator = getCreatorByIdOrSlug(id) || getCreatorForAuthor(id);

  if (!creator) {
    notFound();
  }

  const creatorWallpapers = getWallpapersByCreator(creator.name);

  return (
    <CreatorProfileClient
      creator={creator}
      initialWallpapers={creatorWallpapers}
      allWallpapers={WALLPAPERS}
    />
  );
}
