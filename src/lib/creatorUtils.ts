import { CREATORS, Creator } from "@/data/creators";
import { WALLPAPERS, Wallpaper } from "@/data/wallpapers";

/**
 * Convert string to a URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Find a creator by ID, slugified name, handle, or author name.
 */
export function getCreatorByIdOrSlug(idOrSlug: string): Creator | undefined {
  if (!idOrSlug) return undefined;
  const decoded = decodeURIComponent(idOrSlug).toLowerCase();

  return CREATORS.find((c) => {
    return (
      c.id.toLowerCase() === decoded ||
      c.handle.toLowerCase().replace("@", "") === decoded.replace("@", "") ||
      slugify(c.name) === decoded ||
      c.name.toLowerCase() === decoded
    );
  });
}

/**
 * Find creator corresponding to a wallpaper author name.
 * If not in curated CREATORS list, creates a clean authentic profile
 * derived strictly from real wallpaper data without inventing followers, bio, or badges.
 */
export function getCreatorForAuthor(authorName: string): Creator | undefined {
  const direct = getCreatorByIdOrSlug(authorName);
  if (direct) return direct;

  // Search if author has published wallpapers in catalog
  const authorWallpapers = WALLPAPERS.filter(
    (w) => w.author.name.toLowerCase() === authorName.toLowerCase()
  );

  if (authorWallpapers.length > 0) {
    const first = authorWallpapers[0];
    const slug = slugify(first.author.name);
    return {
      id: slug,
      name: first.author.name,
      handle: `@${slug.replace(/-/g, "")}`,
      avatar: first.author.avatar,
      coverImage: first.imageUrl,
      bio: `Digital wallpaper artist contributing to Wallora's high-resolution catalog.`,
      location: "Global",
      specialty: `${first.category.charAt(0).toUpperCase() + first.category.slice(1)} Wallpapers`,
      verified: first.author.verified,
      featured: false,
      downloads: authorWallpapers.reduce((acc, w) => acc + w.downloads, 0),
      likes: authorWallpapers.reduce((acc, w) => acc + w.likes, 0),
      followers: 0,
      wallpapersCount: authorWallpapers.length,
      topWallpapers: authorWallpapers.map((w) => w.imageUrl).slice(0, 3),
      socials: {},
    };
  }

  return undefined;
}

/**
 * Return the creator profile ID/slug to link to for a given author name.
 */
export function getCreatorProfileHref(authorName: string): string {
  const creator = getCreatorForAuthor(authorName);
  if (creator) {
    return `/creators/${creator.id}`;
  }
  return `/creators`;
}

/**
 * Get all published wallpapers by a specific creator name.
 */
export function getWallpapersByCreator(creatorName: string): Wallpaper[] {
  return WALLPAPERS.filter(
    (w) => w.author.name.toLowerCase() === creatorName.toLowerCase()
  );
}

/**
 * Calculate real data metrics for a creator from catalog wallpapers
 */
export function getRealCreatorMetrics(creator: Creator) {
  const published = getWallpapersByCreator(creator.name);
  const totalDownloads = published.reduce((acc, w) => acc + w.downloads, 0);
  const totalLikes = published.reduce((acc, w) => acc + w.likes, 0);
  const hasRecentlyAdded = published.some((w) => w.recentlyAdded);

  return {
    publishedWallpapers: published,
    publishedCount: published.length,
    catalogDownloads: totalDownloads > 0 ? totalDownloads : creator.downloads,
    catalogLikes: totalLikes > 0 ? totalLikes : creator.likes,
    hasRecentlyAdded,
  };
}
