import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const items = await prisma.blogPostEntry.findMany({ orderBy: { publishedAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const item = await prisma.blogPostEntry.create({
    data: {
      slug: body.slug,
      title: body.title,
      description: body.description ?? "",
      content: JSON.stringify(body.content ?? []),
      publishedAt: body.publishedAt ?? new Date().toISOString().slice(0, 10),
      readTime: body.readTime ?? "",
      cta: body.cta ?? "",
      status: body.status ?? "draft",
    },
  });
  return NextResponse.json(item, { status: 201 });
}
