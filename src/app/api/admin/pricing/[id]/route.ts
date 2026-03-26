import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await ctx.params;
  const body = await request.json();

  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.price !== undefined) data.price = body.price;
  if (body.note !== undefined) data.note = body.note;
  if (body.features !== undefined) data.features = JSON.stringify(body.features);
  if (body.popular !== undefined) data.popular = body.popular;
  if (body.amountInr !== undefined) data.amountInr = body.amountInr;
  if (body.sortOrder !== undefined) data.sortOrder = body.sortOrder;
  if (body.published !== undefined) data.published = body.published;

  const item = await prisma.pricingTier.update({ where: { id }, data });
  return NextResponse.json(item);
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await ctx.params;
  await prisma.pricingTier.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
