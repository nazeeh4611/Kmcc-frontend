// src/app/api/banners/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { deleteBanner } from "../../../../lib/banners";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const banners = deleteBanner(id);

  return NextResponse.json({ banners });
}