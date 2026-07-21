// src/app/api/banners/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { deleteBanner } from "../../../../lib/banners";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const banners = deleteBanner(params.id);
  return NextResponse.json({ banners });
}