import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const items = await prisma.pricingTier.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const item = await prisma.pricingTier.create({
    data: {
      name: body.name,
      price: body.price,
      note: body.note ?? "",
      features: JSON.stringify(body.features ?? []),
      popular: body.popular ?? false,
      amountInr: body.amountInr ?? 0,
      sortOrder: body.sortOrder ?? 0,
      published: body.published ?? true,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
