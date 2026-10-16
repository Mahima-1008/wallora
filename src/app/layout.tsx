import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#090A0F",
};

export const metadata: Metadata = {
  title: "Wallora — Premium AI-Enhanced Wallpapers for Desktop & Mobile",
  description:
    "Explore, preview in live device frames, and download curated 4K & 8K AI-enhanced wallpapers for mobile phones, laptops, and ultra-wide desktops.",
  keywords: [
    "AI wallpapers",
    "4K wallpapers",
    "8K wallpapers",
    "desktop backgrounds",
    "phone wallpapers",
    "dark mode wallpapers",
    "aesthetic backgrounds",
    "Wallora",
  ],
  authors: [{ name: "Wallora Studios" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${jakartaSans.variable} ${playfairDisplay.variable} dark antialiased`}
    >
      <body className="min-h-screen bg-[#090A0F] text-[#ededed] font-sans selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
