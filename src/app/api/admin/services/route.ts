import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const services = await prisma.siteService.findMany({
    orderBy: { sortOrder: "asc" },
    include: { faqItems: { orderBy: { sortOrder: "asc" } } },
  });
  return NextResponse.json(services);
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const service = await prisma.siteService.create({
    data: {
      slug: body.slug,
      flag: body.flag ?? "",
      title: body.title,
      subtitle: body.subtitle ?? "",
      description: body.description ?? "",
      accent: body.accent ?? "accent-uk",
      price: body.price ?? "",
      reasonStats: JSON.stringify(body.reasonStats ?? []),
      differentiators: JSON.stringify(body.differentiators ?? []),
      pricingAnalysis: body.pricingAnalysis ?? "",
      pricingFull: body.pricingFull ?? "",
      pricingExpress: body.pricingExpress ?? "",
      testimonials: JSON.stringify(body.testimonials ?? []),
      sortOrder: body.sortOrder ?? 0,
      published: body.published ?? true,
    },
  });
  return NextResponse.json(service, { status: 201 });
}
