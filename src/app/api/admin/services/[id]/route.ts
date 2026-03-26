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
  if (body.slug !== undefined) data.slug = body.slug;
  if (body.flag !== undefined) data.flag = body.flag;
  if (body.title !== undefined) data.title = body.title;
  if (body.subtitle !== undefined) data.subtitle = body.subtitle;
  if (body.description !== undefined) data.description = body.description;
  if (body.accent !== undefined) data.accent = body.accent;
  if (body.price !== undefined) data.price = body.price;
  if (body.reasonStats !== undefined) data.reasonStats = JSON.stringify(body.reasonStats);
  if (body.differentiators !== undefined) data.differentiators = JSON.stringify(body.differentiators);
  if (body.pricingAnalysis !== undefined) data.pricingAnalysis = body.pricingAnalysis;
  if (body.pricingFull !== undefined) data.pricingFull = body.pricingFull;
  if (body.pricingExpress !== undefined) data.pricingExpress = body.pricingExpress;
  if (body.testimonials !== undefined) data.testimonials = JSON.stringify(body.testimonials);
  if (body.sortOrder !== undefined) data.sortOrder = body.sortOrder;
  if (body.published !== undefined) data.published = body.published;

  const service = await prisma.siteService.update({ where: { id }, data });
  return NextResponse.json(service);
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await ctx.params;
  await prisma.siteService.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
