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
  for (const key of ["question", "answer", "serviceId", "sortOrder", "published"] as const) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  const item = await prisma.faqItem.update({ where: { id }, data });
  return NextResponse.json(item);
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await ctx.params;
  await prisma.faqItem.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
