import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { WALLPAPERS } from "@/data/wallpapers";
import WallpaperDetailClient from "./WallpaperDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return WALLPAPERS.map((wallpaper) => ({
    id: wallpaper.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const wallpaper = WALLPAPERS.find((w) => w.id === id);

  if (!wallpaper) {
    return {
      title: "Wallpaper Not Found — Wallora",
      description: "The requested wallpaper could not be found on Wallora.",
    };
  }

  return {
    title: `${wallpaper.title} — ${wallpaper.dimensions} ${wallpaper.resolution} Wallpaper | Wallora`,
    description: `Download "${wallpaper.title}" created by ${wallpaper.author.name} in ${wallpaper.dimensions} (${wallpaper.fileType || "JPEG"}). Free high-resolution wallpaper on Wallora.`,
    openGraph: {
      title: `${wallpaper.title} | Wallora`,
      description: `High-resolution ${wallpaper.dimensions} wallpaper by ${wallpaper.author.name}`,
      images: [
        {
          url: wallpaper.imageUrl,
          width: 1376,
          height: 768,
          alt: wallpaper.title,
        },
      ],
    },
  };
}

async function WallpaperDetailContent({ params }: PageProps) {
  const { id } = await params;
  const wallpaper = WALLPAPERS.find((w) => w.id === id);

  if (!wallpaper) {
    notFound();
  }

  return (
    <WallpaperDetailClient
      wallpaper={wallpaper}
      allWallpapers={WALLPAPERS}
    />
  );
}

function WallpaperDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#07090F] flex flex-col animate-pulse">
      <div className="h-16 border-b border-white/[0.08] bg-[#0E101B]" />
      <div className="h-12 border-b border-white/[0.08] bg-[#0E101B]/60" />
      <div className="max-w-7xl w-full mx-auto p-6 space-y-6 flex-1">
        <div className="h-10 w-72 bg-white/10 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 h-[550px] bg-white/[0.04] rounded-3xl" />
          <div className="lg:col-span-4 h-[550px] bg-white/[0.04] rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

export default function WallpaperDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<WallpaperDetailSkeleton />}>
      <WallpaperDetailContent params={params} />
    </Suspense>
  );
}
