import { Suspense } from "react";
import { Metadata } from "next";
import { CURATED_COLLECTIONS } from "@/data/wallpapers";
import CollectionDetailClient from "./CollectionDetailClient";

export async function generateStaticParams() {
  return CURATED_COLLECTIONS.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolved = await params;
  const slug = resolved?.slug || "";
  const col = slug
    ? CURATED_COLLECTIONS.find(
        (c) => Boolean(c.slug) && c.slug.toLowerCase() === slug.toLowerCase()
      )
    : null;

  if (col) {
    return {
      title: `${col.title} Collection — Wallora`,
      description: col.description || col.subtitle,
      openGraph: {
        title: `${col.title} Collection — Wallora`,
        description: col.description || col.subtitle,
        images: [
          {
            url: col.coverImage,
            width: 1920,
            height: 1080,
            alt: col.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${col.title} Collection — Wallora`,
        description: col.description || col.subtitle,
        images: [col.coverImage],
      },
    };
  }

  return {
    title: "Curated Wallpaper Collection — Wallora",
    description: "Browse high resolution wallpapers in this curated pack.",
  };
}

export default function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090A0F] text-zinc-400 flex flex-col items-center justify-center gap-3">
          <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">
            Loading collection...
          </p>
        </div>
      }
    >
      <CollectionDetailLoader params={params} />
    </Suspense>
  );
}

async function CollectionDetailLoader({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolved = await params;
  const slug = resolved?.slug || "";
  return <CollectionDetailClient slug={slug} />;
}
