import { getAllSiteConfigs } from "@/lib/content-store";

export type ContactInfo = {
  whatsapp: string;
  email: string;
  phone: string;
  whatsappLink: string;
};

const DEFAULTS = {
  whatsapp: "919887678900",
  email: "VisaHelper@visaguru.live",
  phone: "+91 9887678900",
};

export async function getContactInfo(): Promise<ContactInfo> {
  const configs = await getAllSiteConfigs();

  const whatsapp = parseString(configs["contact_whatsapp"], DEFAULTS.whatsapp);
  const email = parseString(configs["contact_email"], DEFAULTS.email);
  const phone = parseString(configs["contact_phone"], DEFAULTS.phone);

  return {
    whatsapp,
    email,
    phone,
    whatsappLink: `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`,
  };
}

function parseString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}
