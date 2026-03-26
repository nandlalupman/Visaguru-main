import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePageTemplate } from "@/components/service-page-template";
import { getServiceBySlug, getServices } from "@/lib/content-store";
import { getServiceSharedConfig } from "@/lib/site-config";

export async function generateMetadata(): Promise<Metadata> {
  const service = await getServiceBySlug("fresh-sop");
  if (!service) return { title: "Service Not Found" };

  return {
    title: `${service.title} | VisaGuru`,
    description: service.subtitle,
  };
}

export default async function FreshSopPage() {
  const [service, sharedConfig] = await Promise.all([
    getServiceBySlug("fresh-sop"),
    getServiceSharedConfig(),
  ]);
  if (!service) notFound();

  const allServices = await getServices();
  const otherServices = allServices
    .filter((s) => s.slug !== "fresh-sop")
    .map((s) => ({
      slug: s.slug,
      flag: s.flag,
      title: s.title,
      price: s.price || s.pricing?.fullRecovery || "Contact us",
      accent: s.accent,
    }));

  return (
    <ServicePageTemplate
      service={service}
      otherServices={otherServices}
      processSteps={sharedConfig.processSteps}
      trustStats={sharedConfig.trustStats}
    />
  );
}
