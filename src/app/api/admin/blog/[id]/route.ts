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
  if (body.title !== undefined) data.title = body.title;
  if (body.description !== undefined) data.description = body.description;
  if (body.content !== undefined) data.content = JSON.stringify(body.content);
  if (body.publishedAt !== undefined) data.publishedAt = body.publishedAt;
  if (body.readTime !== undefined) data.readTime = body.readTime;
  if (body.cta !== undefined) data.cta = body.cta;
  if (body.status !== undefined) data.status = body.status;

  const item = await prisma.blogPostEntry.update({ where: { id }, data });
  return NextResponse.json(item);
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await ctx.params;
  await prisma.blogPostEntry.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
