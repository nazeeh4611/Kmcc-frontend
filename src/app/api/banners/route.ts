// src/app/api/banners/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getBanners, saveBanner, uploadDirPath } from "../../../lib/banners";

export async function GET() {
  const banners = getBanners();
  return NextResponse.json({ banners });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");
  const alt = (formData.get("alt") as string) || "";

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || ".jpg";
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const filename = `${id}${ext}`;
  const dir = uploadDirPath();
  fs.writeFileSync(path.join(dir, filename), buffer);

  const banners = saveBanner({
    id,
    url: `/uploads/banners/${filename}`,
    alt,
    createdAt: Date.now(),
  });

  return NextResponse.json({ banners });
}