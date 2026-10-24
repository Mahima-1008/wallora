import confetti from "canvas-confetti";
import { Wallpaper } from "@/data/wallpapers";

export interface WallpaperDownloadVersion {
  id: "original" | "4k" | "mobile" | "webp" | "hd" | "square";
  label: string;
  buttonLabel: string;
  dimensions: string;
  width: number;
  height: number;
  aspectRatio: string;
  format: "jpg" | "webp" | "png";
  mimeType: string;
  isNative: boolean;
  type: "original" | "4k" | "mobile" | "webp" | "hd" | "square";
  description: string;
  badge?: string;
  fileSizeEstimate?: string;
}

export interface DownloadProgress {
  status: "idle" | "connecting" | "downloading" | "processing" | "saving" | "complete" | "error";
  progressPercent: number;
  loadedBytes?: number;
  totalBytes?: number;
  statusText: string;
  errorMessage?: string;
}

/**
 * Parses numeric dimensions from string like "1376 x 768" or "3840 x 2160"
 */
export function parseDimensions(dimStr: string): { width: number; height: number } {
  const parts = dimStr.split(/x|\u00D7/i).map((p) => parseInt(p.trim(), 10));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { width: parts[0], height: parts[1] };
  }
  return { width: 1376, height: 768 };
}

/**
 * Returns the list of genuine download versions for a wallpaper.
 * Rule: Only include versions that genuinely exist or can be generated without upscaling.
 */
export function getAvailableResolutions(wallpaper: Wallpaper): WallpaperDownloadVersion[] {
  const { width: nativeWidth, height: nativeHeight } = parseDimensions(wallpaper.dimensions);
  const isPortrait = nativeHeight > nativeWidth || wallpaper.aspectRatio === "9:16";
  const is4K = nativeWidth >= 3840;

  const versions: WallpaperDownloadVersion[] = [];

  // 1. Genuine 4K version (if and only if native source is >= 3840px wide)
  if (is4K) {
    versions.push({
      id: "4k",
      label: "4K Ultra HD",
      buttonLabel: "Download 4K",
      dimensions: `${nativeWidth} × ${nativeHeight}`,
      width: nativeWidth,
      height: nativeHeight,
      aspectRatio: wallpaper.aspectRatio,
      format: "jpg",
      mimeType: "image/jpeg",
      isNative: true,
      type: "4k",
      description: "Native source asset in 4K UHD resolution",
      badge: "Native 4K",
      fileSizeEstimate: wallpaper.fileSize || "3.5 MB",
    });

    // 4K Mobile Crop (1215 x 2160 for 9:16 ratio)
    const mobileWidth = Math.round(nativeHeight * (9 / 16));
    versions.push({
      id: "mobile",
      label: "Mobile 4K (9:16)",
      buttonLabel: "Download Mobile",
      dimensions: `${mobileWidth} × ${nativeHeight}`,
      width: mobileWidth,
      height: nativeHeight,
      aspectRatio: "9:16",
      format: "jpg",
      mimeType: "image/jpeg",
      isNative: false,
      type: "mobile",
      description: "Centered 9:16 crop optimized for smartphone lockscreens",
      badge: "Mobile Fit",
      fileSizeEstimate: "2.1 MB",
    });

    // Downscaled Full HD (1920 x 1080)
    versions.push({
      id: "hd",
      label: "Full HD (1080p)",
      buttonLabel: "Download 1080p",
      dimensions: "1920 × 1080",
      width: 1920,
      height: 1080,
      aspectRatio: "16:9",
      format: "jpg",
      mimeType: "image/jpeg",
      isNative: false,
      type: "hd",
      description: "Downscaled 1080p format for laptops and standard monitors",
      badge: "Optimized",
      fileSizeEstimate: "1.2 MB",
    });

    // Web-Optimized WebP
    versions.push({
      id: "webp",
      label: "Modern WebP",
      buttonLabel: "Download WebP",
      dimensions: `${nativeWidth} × ${nativeHeight}`,
      width: nativeWidth,
      height: nativeHeight,
      aspectRatio: wallpaper.aspectRatio,
      format: "webp",
      mimeType: "image/webp",
      isNative: false,
      type: "webp",
      description: "Next-gen WebP format (~35% smaller with high fidelity)",
      badge: "Compact",
      fileSizeEstimate: "1.8 MB",
    });

    return versions;
  }

  // 2. Native Portrait / Mobile Wallpaper (e.g. 768 x 1376)
  if (isPortrait) {
    versions.push({
      id: "original",
      label: "Original Mobile (Native)",
      buttonLabel: "Download Mobile",
      dimensions: `${nativeWidth} × ${nativeHeight}`,
      width: nativeWidth,
      height: nativeHeight,
      aspectRatio: "9:16",
      format: "jpg",
      mimeType: "image/jpeg",
      isNative: true,
      type: "mobile",
      description: "Native smartphone portrait format without any cropping",
      badge: "Original",
      fileSizeEstimate: wallpaper.fileSize || "1.0 MB",
    });

    versions.push({
      id: "webp",
      label: "Mobile WebP",
      buttonLabel: "Download WebP",
      dimensions: `${nativeWidth} × ${nativeHeight}`,
      width: nativeWidth,
      height: nativeHeight,
      aspectRatio: "9:16",
      format: "webp",
      mimeType: "image/webp",
      isNative: false,
      type: "webp",
      description: "Compressed WebP for fast phone downloads and mobile cache",
      badge: "WebP",
      fileSizeEstimate: "580 KB",
    });

    const squareDim = Math.min(nativeWidth, nativeHeight);
    versions.push({
      id: "square",
      label: "Square Crop (1:1)",
      buttonLabel: "Download Square",
      dimensions: `${squareDim} × ${squareDim}`,
      width: squareDim,
      height: squareDim,
      aspectRatio: "1:1",
      format: "jpg",
      mimeType: "image/jpeg",
      isNative: false,
      type: "square",
      description: "Centered 1:1 format for avatars, widgets & social profiles",
      badge: "1:1",
      fileSizeEstimate: "450 KB",
    });

    return versions;
  }

  // 3. Landscape Wallpaper (e.g. 1376 x 768)
  versions.push({
    id: "original",
    label: `Original Native (${nativeWidth} × ${nativeHeight})`,
    buttonLabel: `Download Original (${nativeWidth} × ${nativeHeight})`,
    dimensions: `${nativeWidth} × ${nativeHeight}`,
    width: nativeWidth,
    height: nativeHeight,
    aspectRatio: wallpaper.aspectRatio || "16:9",
    format: "jpg",
    mimeType: "image/jpeg",
    isNative: true,
    type: "original",
    description: "Exact original source asset without compression or scaling",
    badge: "Native",
    fileSizeEstimate: wallpaper.fileSize || "930 KB",
  });

  // Mobile Lockscreen (9:16 crop from landscape)
  const mobileCropWidth = Math.round(nativeHeight * (9 / 16));
  versions.push({
    id: "mobile",
    label: "Mobile Lockscreen (9:16)",
    buttonLabel: "Download Mobile",
    dimensions: `${mobileCropWidth} × ${nativeHeight}`,
    width: mobileCropWidth,
    height: nativeHeight,
    aspectRatio: "9:16",
    format: "jpg",
    mimeType: "image/jpeg",
    isNative: false,
    type: "mobile",
    description: "Centered 9:16 crop tailored for iPhone & Android lockscreens",
    badge: "Mobile",
    fileSizeEstimate: "420 KB",
  });

  // Downscaled Desktop HD (1280 x 720) if nativeWidth >= 1280
  if (nativeWidth >= 1280) {
    versions.push({
      id: "hd",
      label: "Desktop HD (720p)",
      buttonLabel: "Download HD (720p)",
      dimensions: "1280 × 720",
      width: 1280,
      height: 720,
      aspectRatio: "16:9",
      format: "jpg",
      mimeType: "image/jpeg",
      isNative: false,
      type: "hd",
      description: "Standard 720p HD downscaled version for laptops & lightweight use",
      badge: "720p",
      fileSizeEstimate: "680 KB",
    });
  }

  // Modern WebP format
  versions.push({
    id: "webp",
    label: "Web-Optimized (WebP)",
    buttonLabel: "Download WebP",
    dimensions: `${nativeWidth} × ${nativeHeight}`,
    width: nativeWidth,
    height: nativeHeight,
    aspectRatio: wallpaper.aspectRatio || "16:9",
    format: "webp",
    mimeType: "image/webp",
    isNative: false,
    type: "webp",
    description: "High-efficiency WebP format (~30-40% smaller size)",
    badge: "WebP",
    fileSizeEstimate: "540 KB",
  });

  // Square 1:1 Avatar Crop
  const squareDim = Math.min(nativeWidth, nativeHeight);
  versions.push({
    id: "square",
    label: "Square Crop (1:1)",
    buttonLabel: "Download Square",
    dimensions: `${squareDim} × ${squareDim}`,
    width: squareDim,
    height: squareDim,
    aspectRatio: "1:1",
    format: "jpg",
    mimeType: "image/jpeg",
    isNative: false,
    type: "square",
    description: "Centered square format for social icons and watch faces",
    badge: "1:1",
    fileSizeEstimate: "480 KB",
  });

  return versions;
}

/**
 * Triggers a file download in the browser from a Blob.
 */
function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Cleans a wallpaper title into a clean filename slug.
 */
export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/**
 * Formats bytes into a human readable string like "940 KB" or "3.4 MB"
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Executes a wallpaper download with live progress tracking, canvas cropping/downscaling,
 * and error handling.
 */
export async function downloadWallpaper(
  wallpaper: Wallpaper,
  version: WallpaperDownloadVersion,
  onProgress?: (progress: DownloadProgress) => void
): Promise<void> {
  const cleanTitle = slugifyTitle(wallpaper.title);
  const filename = `wallora-${cleanTitle}-${version.id}.${version.format}`;

  onProgress?.({
    status: "connecting",
    progressPercent: 5,
    statusText: `Connecting to download server...`,
  });

  try {
    // Case 1: Native direct download (no canvas re-encoding needed)
    if (version.isNative) {
      const response = await fetch(wallpaper.imageUrl);
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}: ${response.statusText}`);
      }

      const contentLength = response.headers.get("content-length");
      const total = contentLength ? parseInt(contentLength, 10) : 0;

      if (!response.body) {
        // Fallback to direct blob
        const blob = await response.blob();
        triggerBlobDownload(blob, filename);
        onProgress?.({
          status: "complete",
          progressPercent: 100,
          statusText: `Downloaded ${filename}!`,
        });
        fireCelebration();
        return;
      }

      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let loaded = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          loaded += value.length;
          const percent = total > 0 ? Math.min(95, Math.round((loaded / total) * 100)) : 50;
          onProgress?.({
            status: "downloading",
            progressPercent: percent,
            loadedBytes: loaded,
            totalBytes: total || undefined,
            statusText: total > 0
              ? `Downloading: ${percent}% (${formatBytes(loaded)} / ${formatBytes(total)})`
              : `Downloading: ${formatBytes(loaded)} received...`,
          });
        }
      }

      onProgress?.({
        status: "saving",
        progressPercent: 98,
        statusText: `Saving file...`,
      });

      const blob = new Blob(chunks as BlobPart[], { type: version.mimeType });
      triggerBlobDownload(blob, filename);

      onProgress?.({
        status: "complete",
        progressPercent: 100,
        loadedBytes: loaded,
        totalBytes: loaded,
        statusText: `Downloaded ${filename} successfully!`,
      });
      fireCelebration();
      return;
    }

    // Case 2: Generated format (Mobile crop, WebP, downscaled HD, or Square crop)
    onProgress?.({
      status: "connecting",
      progressPercent: 15,
      statusText: `Fetching source image for ${version.label}...`,
    });

    const response = await fetch(wallpaper.imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to load source image: ${response.status}`);
    }

    const sourceBlob = await response.blob();
    const sourceObjectUrl = URL.createObjectURL(sourceBlob);

    onProgress?.({
      status: "processing",
      progressPercent: 50,
      statusText: `Processing ${version.label} (${version.dimensions})...`,
    });

    const img = new Image();
    img.crossOrigin = "anonymous";

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Image decoding failed"));
      img.src = sourceObjectUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = version.width;
    canvas.height = version.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      URL.revokeObjectURL(sourceObjectUrl);
      throw new Error("Canvas context could not be initialized");
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const sWidth = img.naturalWidth || img.width;
    const sHeight = img.naturalHeight || img.height;

    // Smart Crop / Scale Calculation
    if (version.type === "mobile") {
      // Crop center vertical 9:16 column
      const targetRatio = 9 / 16;
      let cropW = sWidth;
      let cropH = sHeight;

      if (sWidth / sHeight > targetRatio) {
        // Image is wider than 9:16: crop sides
        cropW = sHeight * targetRatio;
        const cropX = (sWidth - cropW) / 2;
        ctx.drawImage(img, cropX, 0, cropW, sHeight, 0, 0, version.width, version.height);
      } else {
        // Image is taller: crop top/bottom
        cropH = sWidth / targetRatio;
        const cropY = (sHeight - cropH) / 2;
        ctx.drawImage(img, 0, cropY, sWidth, cropH, 0, 0, version.width, version.height);
      }
    } else if (version.type === "square") {
      // Center square crop
      const size = Math.min(sWidth, sHeight);
      const cropX = (sWidth - size) / 2;
      const cropY = (sHeight - size) / 2;
      ctx.drawImage(img, cropX, cropY, size, size, 0, 0, version.width, version.height);
    } else {
      // Fit full image to canvas dimensions (exact downscaling or 1:1)
      ctx.drawImage(img, 0, 0, sWidth, sHeight, 0, 0, version.width, version.height);
    }

    URL.revokeObjectURL(sourceObjectUrl);

    onProgress?.({
      status: "saving",
      progressPercent: 85,
      statusText: `Encoding ${version.format.toUpperCase()}...`,
    });

    const exportQuality = version.format === "webp" ? 0.92 : 0.94;
    canvas.toBlob(
      (generatedBlob) => {
        if (!generatedBlob) {
          throw new Error("Image export failed");
        }
        triggerBlobDownload(generatedBlob, filename);
        onProgress?.({
          status: "complete",
          progressPercent: 100,
          statusText: `Downloaded ${filename}!`,
        });
        fireCelebration();
      },
      version.mimeType,
      exportQuality
    );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Download failed";
    console.error("Download error:", err);

    // Fallback: direct anchor click
    try {
      const a = document.createElement("a");
      a.href = wallpaper.imageUrl;
      a.download = `${cleanTitle}.jpg`;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      // Ignore
    }

    onProgress?.({
      status: "error",
      progressPercent: 0,
      statusText: `Download failed: ${errorMsg}`,
      errorMessage: errorMsg,
    });
    throw err;
  }
}

/**
 * Fires a joyful confetti celebration on successful download.
 */
function fireCelebration() {
  try {
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#F59E0B", "#10B981", "#38BDF8", "#F43F5E", "#FFFFFF"],
    });
  } catch {
    // Ignore if canvas confetti is not available
  }
}
