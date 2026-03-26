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
    default: "VisaGuru | Visa Refusal Recovery & SOP Writing Service",
    template: "%s | VisaGuru",
  },
  description:
    "Premium visa refusal recovery service for UK, Canada, Schengen, Germany, and Australia applications. Expert SOP rewriting, refusal analysis, and reapplication strategy.",
  keywords: [
    "visa refusal help India",
    "SOP after visa rejection",
    "UK visa rejected what to do",
    "Canada study visa refusal SOP",
    "visa refusal letter analysis",
  ],
  openGraph: {
    type: "website",
    title: "VisaGuru | Turn Visa Rejections Into Approvals",
    description:
      "We analyze refusal letters, rebuild SOPs, and help applicants reapply with confidence.",
    url: siteUrl,
    siteName: "VisaGuru",
  },
  twitter: {
    card: "summary_large_image",
    title: "VisaGuru | Visa Refusal Recovery",
    description:
      "Expert SOP writing and visa refusal recovery for major destinations.",
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
