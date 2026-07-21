// src/lib/banners.ts
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "public", "uploads", "banners");
const manifestPath = path.join(uploadDir, "manifest.json");

export type BannerImage = {
  id: string;
  url: string;
  alt: string;
  createdAt: number;
};

function ensureDir() {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  if (!fs.existsSync(manifestPath)) {
    fs.writeFileSync(manifestPath, "[]", "utf-8");
  }
}

export function getBanners(): BannerImage[] {
  ensureDir();
  const raw = fs.readFileSync(manifestPath, "utf-8");
  try {
    return JSON.parse(raw) as BannerImage[];
  } catch {
    return [];
  }
}

export function saveBanner(entry: BannerImage) {
  ensureDir();
  const banners = getBanners();
  banners.push(entry);
  fs.writeFileSync(manifestPath, JSON.stringify(banners, null, 2), "utf-8");
  return banners;
}

export function deleteBanner(id: string) {
  ensureDir();
  const banners = getBanners();
  const target = banners.find((b) => b.id === id);
  const remaining = banners.filter((b) => b.id !== id);
  fs.writeFileSync(manifestPath, JSON.stringify(remaining, null, 2), "utf-8");
  if (target) {
    const filePath = path.join(process.cwd(), "public", target.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  return remaining;
}

export function uploadDirPath() {
  ensureDir();
  return uploadDir;
}