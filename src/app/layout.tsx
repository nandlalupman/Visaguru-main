import type { Metadata } from "next";
import { DM_Mono, DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { CookieBanner } from "@/components/cookie-banner";
import { ExitIntentModal } from "@/components/exit-intent-modal";
import { ChatbotWidget } from "@/components/chatbot-widget";
import { assertProductionConfig, getSiteUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

assertProductionConfig();
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Visa Rejected? Fix It With VisaGuru | Free Analysis",
    template: "%s | VisaGuru",
  },
  description:
    "Visa rejected? VisaGuru explains why and shows you how to fix it. AI-powered refusal letter analysis + expert reapplication strategy. Try free.",
  keywords: [
    "visa rejected what to do next",
    "why was my visa rejected",
    "visa rejection reason explained",
    "how to fix visa rejection",
    "visa refusal letter analysis",
    "reapply after visa denial",
    "214b visa rejection",
    "221g visa refusal meaning",
    "visa rejection for Indian students 2025",
    "student visa rejected F1 2025 2026",
    "AI visa analyzer tool",
    "visa rejection reapplication success tips",
  ],
  openGraph: {
    type: "website",
    title: "Visa Rejected? You Deserve to Know Exactly Why | VisaGuru",
    description:
      "Upload your visa rejection letter. Get a clear, honest breakdown of what went wrong and exactly how to fix it before you reapply.",
    url: siteUrl,
    siteName: "VisaGuru",
  },
  twitter: {
    card: "summary_large_image",
    title: "Visa Rejected? Find Out Why — Free | VisaGuru",
    description:
      "41% of US student visas got rejected in 2026. Don't guess — let VisaGuru analyze your refusal and tell you how to fix it.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-bg)] text-[var(--color-navy)]">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <WhatsAppFloat />
        <ChatbotWidget />
        <CookieBanner />
        <ExitIntentModal />
      </body>
    </html>
  );
}
