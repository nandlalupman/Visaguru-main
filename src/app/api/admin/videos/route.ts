import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const items = await prisma.videoTestimonial.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const item = await prisma.videoTestimonial.create({
    data: {
      title: body.title,
      thumbnailUrl: body.thumbnailUrl ?? "",
      videoUrl: body.videoUrl,
      country: body.country ?? "",
      featured: body.featured ?? false,
      sortOrder: body.sortOrder ?? 0,
      published: body.published ?? true,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
