import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const items = await prisma.faqItem.findMany({
    orderBy: { sortOrder: "asc" },
    include: { service: { select: { id: true, title: true, slug: true } } },
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const item = await prisma.faqItem.create({
    data: {
      question: body.question,
      answer: body.answer,
      serviceId: body.serviceId ?? null,
      sortOrder: body.sortOrder ?? 0,
      published: body.published ?? true,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
