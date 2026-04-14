import { MessageCircle } from "lucide-react";
import { getContactInfo } from "@/lib/contact-config";

export async function WhatsAppFloat() {
  const contact = await getContactInfo();

  return (
    <a
      href={`${contact.whatsappLink}?text=${encodeURIComponent("Hi, I just submitted my visa case")}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-95"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={18} />
      Chat on WhatsApp
    </a>
  );
}
