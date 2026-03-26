import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const configs = await prisma.siteConfig.findMany({ orderBy: { key: "asc" } });
  return NextResponse.json(configs);
}

export async function PATCH(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  // body is an object of { key: value } pairs
  const entries = Object.entries(body) as [string, unknown][];

  const results = [];
  for (const [key, value] of entries) {
    const result = await prisma.siteConfig.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value), label: key.replace(/_/g, " ") },
    });
    results.push(result);
  }
  return NextResponse.json(results);
}
