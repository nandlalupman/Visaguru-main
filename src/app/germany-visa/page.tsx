import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePageTemplate } from "@/components/service-page-template";
import { getServiceBySlug, getServices } from "@/lib/content-store";
import { getServiceSharedConfig } from "@/lib/site-config";

export async function generateMetadata(): Promise<Metadata> {
  const service = await getServiceBySlug("germany-visa");
  if (!service) return { title: "Service Not Found" };

  return {
    title: `${service.title} | VisaGuru`,
    description: service.subtitle,
  };
}

export default async function GermanyVisaPage() {
  const [service, sharedConfig] = await Promise.all([
    getServiceBySlug("germany-visa"),
    getServiceSharedConfig(),
  ]);
  if (!service) notFound();

  const allServices = await getServices();
  const otherServices = allServices
    .filter((s) => s.slug !== "germany-visa")
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
