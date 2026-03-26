import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const items = await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const item = await prisma.testimonial.create({
    data: {
      name: body.name,
      country: body.country ?? "",
      role: body.role ?? "",
      date: body.date ?? "",
      feedback: body.feedback,
      rating: body.rating ?? 5,
      featured: body.featured ?? false,
      sortOrder: body.sortOrder ?? 0,
      published: body.published ?? true,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
