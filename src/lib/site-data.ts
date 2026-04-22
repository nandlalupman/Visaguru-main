export type ServiceSlug =
  | "uk-visa"
  | "canada-visa"
  | "schengen-visa"
  | "germany-visa"
  | "australia-visa"
  | "fresh-sop";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/reviews", label: "Reviews" },
];

export const trustDestinations = [
  "🇬🇧 UK",
  "🇨🇦 Canada",
  "🇩🇪 Germany",
  "🇮🇹 Italy",
  "🇦🇺 Australia",
  "🇫🇷 France",
];

export const problemCards = [
  {
    title: "Section 214(b) Denial",
    description:
      "The #1 reason for US visa rejection. It means the officer wasn't convinced you'll return home. A 214b visa rejection doesn't mean you lied — it means your ties weren't clear enough.",
  },
  {
    title: "Weak Financial Proof",
    description:
      "A last-minute lump sum deposit or unclear sponsor relationship raises red flags instantly. Visa financial proof rejection happens even when you actually have the money.",
  },
  {
    title: "Section 221(g) Refusal",
    description:
      "This 221g visa refusal means your application is incomplete or needs more documents. It's technically a hold, not a denial — but without the right response, it becomes one.",
  },
  {
    title: "DS-160 Mistakes",
    description:
      "In 2025, a new rule requires the DS-160 barcode to exactly match the one used for interview booking. DS-160 mistakes cause visa rejection more often than people realize.",
  },
  {
    title: "AI-Generated SOPs Flagged",
    description:
      "Germany embassies now actively reject AI-generated motivation letters. Copy-paste templates and ChatGPT drafts are getting caught by experienced reviewers.",
  },
  {
    title: "Social Media Red Flags",
    description:
      "US consular officers now review your social media as part of the process. Inconsistent posts, public complaints, or mismatched timelines can quietly sink your application.",
  },
] as const;

export const processSteps = [
  {
    title: "Upload Your Rejection Letter",
    day: "Takes 2 Minutes",
    description:
      "Share your refusal letter through our secure upload. Don't worry about what it says — that's our job to decode.",
  },
  {
    title: "We Analyze Every Line",
    day: "Within 2 Hours",
    description:
      "Our team reads your letter like a visa officer would and identifies exactly what triggered the rejection. No guessing, no generic advice.",
  },
  {
    title: "Get Your Fix-It Report",
    day: "Day 1-2",
    description:
      "You'll get a detailed breakdown of what went wrong, what to change, and a rebuilt SOP and document checklist tailored to your case.",
  },
  {
    title: "Reapply With Confidence",
    day: "When You're Ready",
    description:
      "Walk into your next interview knowing your file is solid. We give you everything the officer needs to say yes this time.",
  },
] as const;

export const homeServices = [
  {
    slug: "uk-visa",
    flag: "🇬🇧",
    title: "UK Visa Refusal Recovery",
    description: "Expert SOP rewriting and documentation strategy for UK student, visitor, and dependent visa refusals.",
    price: "Starting from ₹4,999",
    accent: "accent-uk",
  },
  {
    slug: "canada-visa",
    flag: "🇨🇦",
    title: "Canada Study Permit Refusal",
    description: "High-precision SOP and financial explanation strategy tailored to IRCC reasoning patterns.",
    price: "Starting from ₹5,499",
    accent: "accent-canada",
  },
  {
    slug: "schengen-visa",
    flag: "🇪🇺",
    title: "Europe (Schengen) Refusal",
    description: "Tourist and short-stay refusal recovery with itinerary-safe documentation for Italy, France, and more.",
    price: "Starting from ₹4,499",
    accent: "accent-schengen",
  },
  {
    slug: "germany-visa",
    flag: "🇩🇪",
    title: "Germany Visa Refusal",
    description: "Specialized SOP and blocked-account clarification for German study and work visa applications.",
    price: "Starting from ₹5,999",
    accent: "accent-germany",
  },
  {
    slug: "australia-visa",
    flag: "🇦🇺",
    title: "Australia Visa Refusal",
    description: "Strong genuine-student narrative and evidence strategy for Australian reapplications.",
    price: "Starting from ₹5,499",
    accent: "accent-australia",
  },
  {
    slug: "fresh-sop",
    flag: "📝",
    title: "Fresh SOP Writing",
    description: "Officer-focused SOP drafting for first-time applicants who want a strong file from day one.",
    price: "Starting from ₹2,999",
    accent: "accent-sop",
  },
] as const;

export const trustStats = [
  { label: "Cases Handled", value: "500+" },
  { label: "Approval Rate", value: "94%" },
  { label: "Average Delivery", value: "48hr" },
  { label: "Average Rating", value: "5★" },
];

export const expertProfile = {
  name: "Priya Mehta",
  role: "Former UK Home Office Documentation Reviewer",
  experience: "9 years of visa documentation and refusal-recovery experience",
  summary:
    "Our team includes ex-visa consultants, IELTS experts, and certified SOP writers who have reviewed applications from both sides of the table.",
};

export const mediaLogos = ["Shiksha", "Yocket", "Quora", "Reddit Communities"];

export const caseStudies = [
  {
    title: "UK Student Visa",
    timeline: "Refused in January 2026 -> Approved in March 2026",
    before:
      "Refusal cited unclear study progression and weak post-study return rationale.",
    after:
      "Rebuilt SOP around academic progression, sponsor liquidity proof, and country-return anchors.",
  },
  {
    title: "Canada Study Permit",
    timeline: "Refused in August 2025 -> Approved in November 2025",
    before:
      "Officer flagged purpose of visit and financial sustainability with inconsistent evidence.",
    after:
      "Drafted targeted SOP with ROI logic and a compliant financial narrative.",
  },
  {
    title: "Schengen Italy Visa",
    timeline: "Refused in May 2025 -> Approved in July 2025",
    before:
      "Refusal letter highlighted uncertain itinerary credibility and weak tie-back evidence.",
    after:
      "Restructured travel narrative with document-aligned itinerary and return-intent proof.",
  },
];

export const testimonials = [
  {
    name: "Rahul M.",
    country: "🇬🇧 UK Visa",
    date: "February 2026",
    feedback:
      "After two UK refusals I was hopeless. Their consultant analyzed my letter in two hours and mapped every red flag.",
  },
  {
    name: "Sneha P.",
    country: "🇨🇦 Canada Visa",
    date: "January 2026",
    feedback:
      "The SOP they wrote was completely different from what I had. Specific, professional, and easy for the officer to follow.",
  },
  {
    name: "Ankit R.",
    country: "🇩🇪 Germany Visa",
    date: "December 2025",
    feedback:
      "Their financial explanation letter solved exactly what was missing in my previous file.",
  },
  {
    name: "Nisha T.",
    country: "🇫🇷 Schengen Visa",
    date: "November 2025",
    feedback:
      "Fast turnaround and clear communication. They rewrote my trip narrative and fixed document mismatches.",
  },
  {
    name: "Karan S.",
    country: "🇦🇺 Australia Visa",
    date: "October 2025",
    feedback:
      "They told me what to fix first, then delivered every file in 24 hours for my urgent timeline.",
  },
  {
    name: "Megha D.",
    country: "🇨🇦 Canada Visa",
    date: "September 2025",
    feedback:
      "The difference was structure and logic, not fancy words. That changed my outcome.",
  },
];

export const pricingTiers = [
  {
    name: "Refusal Analysis Only",
    price: "₹999",
    note: "Single-case strategy report",
    features: [
      "Detailed analysis of refusal reasons",
      "Written strategy report",
      "Actionable reapplication checklist",
      "SOP writing not included",
    ],
    popular: false,
  },
  {
    name: "Full Visa Recovery",
    price: "₹4,999 / €60",
    note: "Most popular",
    features: [
      "Everything in Analysis",
      "Full SOP rewrite (2 revisions)",
      "Financial explanation letter",
      "Submission checklist",
      "48-hour delivery",
      "Refund if reapplication rejected*",
    ],
    popular: true,
  },
  {
    name: "Express Recovery",
    price: "₹7,999",
    note: "Urgent turnaround",
    features: [
      "Everything in Full Recovery",
      "24-hour delivery",
      "Priority WhatsApp support",
      "Cover letter + supporting docs",
    ],
    popular: false,
  },
];

export const faqItems = [
  {
    question: "Why was my visa rejected?",
    answer:
      "Every rejection has a specific reason, even if the letter feels vague. The most common one is Section 214(b) — which basically means the officer wasn't convinced you'd return home after your trip. Other reasons include insufficient financial proof, missing documents (221g), or inconsistencies in your application. It's rarely personal, and it's almost always fixable once you understand what actually triggered it.",
  },
  {
    question: "Can I reapply after visa rejection?",
    answer:
      "Yes, absolutely. There's no law that stops you from reapplying immediately after a visa denial. But here's the thing — reapplying with the exact same file is a waste of time and money. You need to fix the specific issues the officer flagged. VisaGuru.live helps you understand what those issues were and builds you a stronger case before you walk back in.",
  },
  {
    question: "How long should I wait before reapplying?",
    answer:
      "There's no mandatory waiting period for most visa types. Some people reapply within a week, others take a few months. What matters isn't how long you wait — it's whether you actually fixed what went wrong. Rushing in with the same weak file is worse than waiting and getting it right. We'll tell you honestly if you're ready or need more prep.",
  },
  {
    question: "What is a 214(b) visa rejection?",
    answer:
      "Section 214(b) is the most common reason for US visa denial. It means the consular officer wasn't satisfied that you have strong enough ties to your home country — things like a stable job, property, family obligations, or a clear plan to return. It doesn't mean they think you're lying. It just means your file didn't prove it clearly enough. The good news? It's one of the easiest rejections to fix with the right documentation.",
  },
  {
    question: "Does a previous rejection hurt my next application?",
    answer:
      "A past rejection is visible to the officer reviewing your next application. But it doesn't automatically mean you'll be rejected again. Officers look at whether you've addressed the previous concerns. If your new file is stronger and shows clear changes, a previous denial can actually work in your favor — it shows you took feedback seriously. The worst thing you can do is pretend it didn't happen.",
  },
  {
    question: "What documents do I need to fix after rejection?",
    answer:
      "It depends entirely on why you were rejected. If it was 214(b), you'll need stronger proof of ties to your home country — employment letters, property documents, family obligations. If it was financial, you need cleaner bank statements and a solid explanation of fund sources. If your SOP was flagged, it needs a complete rewrite. VisaGuru analyzes your specific rejection and tells you exactly which documents need work.",
  },
  {
    question: "Can VisaGuru really help me figure out why I was rejected?",
    answer:
      "That's literally what we built this tool for. You upload your refusal letter, and our AI visa analyzer combined with expert review breaks down every line of the rejection into plain language. We don't just tell you what happened — we tell you what to change and how to make your next application stronger. We've helped 500+ applicants so far, with a 94% approval rate on reapplications.",
  },
  {
    question: "Is there a fee to use VisaGuru?",
    answer:
      "The initial refusal analysis is completely free — no credit card, no commitment. You upload your letter and get a detailed breakdown within 2 hours. If you want us to rebuild your SOP, write financial explanation letters, or create a full reapplication package, those are paid services starting at ₹999. But the free analysis alone gives you real, actionable insight you won't find anywhere else.",
  },
];

export const socialProofTicker = [
  "Rahul from Delhi got his F-1 visa approved after 214(b) rejection — this week",
  "Sneha from Pune turned a Canada study permit refusal into approval in 14 days",
  "Ankit from Mumbai fixed his financial proof and got Germany student visa approved",
  "Priya from Hyderabad cleared UK visa reapplication after two previous denials",
  "Karan from Bangalore got Australia student visa approved with rebuilt SOP",
  "Nidhi from Chennai fixed DS-160 errors and passed her US visa interview",
];

export type ServiceData = {
  slug: ServiceSlug;
  flag: string;
  title: string;
  subtitle: string;
  reasonStats: string[];
  differentiators: string[];
  pricing: {
    analysis: string;
    fullRecovery: string;
    express: string;
  };
  faq: { question: string; answer: string }[];
  testimonials: { name: string; role: string; feedback: string }[];
};

export const servicesBySlug: Record<ServiceSlug, ServiceData> = {
  "uk-visa": {
    slug: "uk-visa",
    flag: "🇬🇧",
    title: "UK Visa Refusal Recovery Service",
    subtitle:
      "Focused SOP rebuilding and refusal-response strategy for UK student and visitor cases.",
    reasonStats: [
      "Most UK refusals cite credibility, funds clarity, or weak academic rationale.",
      "Template SOPs and generic career plans are frequently flagged by officers.",
      "Reapplications succeed when each refusal line is answered with evidence-backed logic.",
    ],
    differentiators: [
      "Former UK-document-review perspective in strategy design",
      "Clear tie-back narrative for return intent and progression logic",
      "Submission-ready checklist aligned to VFS and UKVI expectations",
    ],
    pricing: {
      analysis: "₹999",
      fullRecovery: "₹4,999",
      express: "₹7,999",
    },
    faq: [
      {
        question: "Can you help after multiple UK refusals?",
        answer:
          "Yes. Multi-refusal cases are common and require deeper evidence restructuring.",
      },
      {
        question: "Do you review CAS-related documentation context?",
        answer:
          "Yes, especially where course logic and progression need better explanation.",
      },
      {
        question: "Do you support visitor and dependent categories?",
        answer:
          "Yes, where refusal recovery depends on narrative and documentation quality.",
      },
    ],
    testimonials: [
      {
        name: "Rahul M.",
        role: "MSc Applicant",
        feedback:
          "The rewritten SOP addressed every refusal point and improved my presentation significantly.",
      },
      {
        name: "Sonal K.",
        role: "Visitor Visa Applicant",
        feedback:
          "They improved my financial and intent explanation without making unrealistic claims.",
      },
    ],
  },
  "canada-visa": {
    slug: "canada-visa",
    flag: "🇨🇦",
    title: "Canada Study Permit Refusal Recovery",
    subtitle:
      "High-precision SOP and financial explanation strategy for Canadian study permits.",
    reasonStats: [
      "Study permit refusals often cite purpose of visit and financial sufficiency.",
      "Officers look for coherent program logic and realistic post-study pathway.",
      "Strong proof alignment between SOP, finances, and admission profile is essential.",
    ],
    differentiators: [
      "Program-to-career narrative framework tailored to IRCC reasoning",
      "Financial continuity explanations for salary, sponsor, and asset documents",
      "Pre-submission contradiction audit across all forms and supporting files",
    ],
    pricing: {
      analysis: "₹1,199",
      fullRecovery: "₹5,499",
      express: "₹8,499",
    },
    faq: [
      {
        question: "Can you assist with SDS and non-SDS files?",
        answer:
          "Yes. We structure strategy based on your specific intake, category, and profile.",
      },
      {
        question: "Do you rewrite old generic SOPs from agents?",
        answer:
          "Yes. Most clients come with template SOPs that need complete reconstruction.",
      },
      {
        question: "Do you include financial explanation letters?",
        answer:
          "Yes, included in full recovery plans with rationale and document references.",
      },
    ],
    testimonials: [
      {
        name: "Sneha P.",
        role: "PG Diploma Applicant",
        feedback:
          "My refusal was for purpose of visit. Their strategy made my case coherent and credible.",
      },
      {
        name: "Dev J.",
        role: "Business Program Applicant",
        feedback:
          "The financial explanation letter was the biggest difference in my reapplication.",
      },
    ],
  },
  "schengen-visa": {
    slug: "schengen-visa",
    flag: "🇪🇺",
    title: "Schengen Visa Refusal Fix Service",
    subtitle:
      "Tourist and short-stay refusal recovery with itinerary-safe documentation.",
    reasonStats: [
      "Common refusal grounds include travel intent, financial reliability, and return certainty.",
      "Weak itinerary or inconsistent bookings can trigger avoidable doubts.",
      "Country-specific embassy preferences need precision in supporting evidence.",
    ],
    differentiators: [
      "Itinerary-document consistency checks before filing",
      "Intent and tie-back narrative for tourism and short visits",
      "Country-specific document framing for Italy, France, Germany, and more",
    ],
    pricing: {
      analysis: "₹899",
      fullRecovery: "₹4,499",
      express: "₹6,999",
    },
    faq: [
      {
        question: "Can you help with Italy and France refusals?",
        answer:
          "Yes, including itinerary, sponsor, and return-intent strengthening.",
      },
      {
        question: "Do you prepare cover letters for Schengen cases?",
        answer:
          "Yes. Cover letters are included in full recovery and express plans.",
      },
      {
        question: "Can you support family travel applications?",
        answer:
          "Yes, with profile-specific consistency checks across all applicants.",
      },
    ],
    testimonials: [
      {
        name: "Nisha T.",
        role: "Italy Tourist Visa Applicant",
        feedback:
          "Their updated cover letter and itinerary proof solved the refusal issues quickly.",
      },
      {
        name: "Aditya V.",
        role: "France Visitor Applicant",
        feedback:
          "They found contradictions in my bookings that my earlier consultant missed.",
      },
    ],
  },
  "germany-visa": {
    slug: "germany-visa",
    flag: "🇩🇪",
    title: "Germany Student Visa Refusal Recovery",
    subtitle:
      "Specialized SOP and blocked-account clarification for German study applications.",
    reasonStats: [
      "Frequent concerns include financial proof clarity, APS context, and study intent.",
      "Inconsistent academic mapping can weaken visa officer confidence.",
      "Proper consulate-ready documentation significantly improves outcomes.",
    ],
    differentiators: [
      "Academic progression narrative matched to German course structure",
      "Blocked-account and sponsor explanation support",
      "Concise document pack with interview-consistent talking points",
    ],
    pricing: {
      analysis: "₹1,199",
      fullRecovery: "₹5,999",
      express: "₹8,999",
    },
    faq: [
      {
        question: "Can you help with blocked account explanations?",
        answer:
          "Yes, we build clear source-of-funds and continuity narratives.",
      },
      {
        question: "Do you support APS-linked profile clarity?",
        answer:
          "Yes. We align educational history, chosen course, and post-study plan.",
      },
      {
        question: "Do you give mock interview guidance?",
        answer:
          "Yes, high-level talking points are included with full recovery plans.",
      },
    ],
    testimonials: [
      {
        name: "Ananya L.",
        role: "TU9 Applicant",
        feedback:
          "They clarified my financial trail and improved SOP logic. Approval came in the next cycle.",
      },
      {
        name: "Ankit R.",
        role: "Data Science Applicant",
        feedback:
          "The team made my documents consulate-ready and easier to defend in interview.",
      },
    ],
  },
  "australia-visa": {
    slug: "australia-visa",
    flag: "🇦🇺",
    title: "Australia Visa Refusal Recovery",
    subtitle:
      "Strong genuine-student narrative and evidence strategy for reapplications.",
    reasonStats: [
      "Australian refusals often revolve around intent credibility and profile consistency.",
      "Generic statements about career plans are commonly rejected.",
      "Financial and sponsor narratives must match documentation exactly.",
    ],
    differentiators: [
      "GTE-style narrative improvement focused on credibility",
      "Profile consistency review across forms and attachments",
      "Fast-tracked urgent filing support for intake deadlines",
    ],
    pricing: {
      analysis: "₹1,099",
      fullRecovery: "₹5,499",
      express: "₹8,299",
    },
    faq: [
      {
        question: "Do you support GS/GTE related refusals?",
        answer:
          "Yes, this is one of our most common Australia case categories.",
      },
      {
        question: "Can you prepare financial explanations for sponsors?",
        answer:
          "Yes. We include sponsor background and fund-source narrative where needed.",
      },
      {
        question: "Do you handle urgent deadlines?",
        answer:
          "Yes, express turnaround is available for qualifying profiles.",
      },
    ],
    testimonials: [
      {
        name: "Karan S.",
        role: "Masters Applicant",
        feedback:
          "My file became much stronger after they restructured intent and financial sections.",
      },
      {
        name: "Nikita H.",
        role: "Graduate Diploma Applicant",
        feedback:
          "Excellent turnaround and practical checklists. I knew exactly what to submit.",
      },
    ],
  },
  "fresh-sop": {
    slug: "fresh-sop",
    flag: "📝",
    title: "Fresh SOP Writing Service",
    subtitle:
      "Officer-focused SOP drafting for first-time applicants who want a strong file from day one.",
    reasonStats: [
      "Many first-time refusals are preventable with better narrative structure.",
      "Weakly structured SOPs create doubt around intent and planning.",
      "Country-specific SOP expectations differ and require tailored writing.",
    ],
    differentiators: [
      "Interview-aligned SOP narrative that is easy to defend",
      "Country and visa-type custom drafting instead of templates",
      "Revision rounds included before final submission",
    ],
    pricing: {
      analysis: "Free fit-check",
      fullRecovery: "₹2,999",
      express: "₹4,499",
    },
    faq: [
      {
        question: "Do you write SOPs for first-time applicants?",
        answer:
          "Yes. We draft from scratch based on your profile and destination.",
      },
      {
        question: "Can one SOP be reused for multiple countries?",
        answer:
          "No. Each destination requires a tailored narrative and supporting logic.",
      },
      {
        question: "How many revisions are included?",
        answer:
          "Two rounds are included in the standard plan, with add-ons available.",
      },
    ],
    testimonials: [
      {
        name: "Riya B.",
        role: "First-Time Canada Applicant",
        feedback:
          "They made my SOP structured and evidence-driven. It sounded like my profile, not a template.",
      },
      {
        name: "Akash N.",
        role: "UK MSc Applicant",
        feedback:
          "Clear writing, practical edits, and great support before final submission.",
      },
    ],
  },
};

export const serviceSlugs = Object.keys(servicesBySlug) as ServiceSlug[];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return servicesBySlug[slug as ServiceSlug];
}
