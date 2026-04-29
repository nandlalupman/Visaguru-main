import { NextRequest, NextResponse } from "next/server";
import { enforceRateLimit, getRequestIdentifier } from "@/lib/rate-limit";
import { getCurrentSession } from "@/lib/session";

type Rule = { keywords: string[]; reply: string };

const rules: Rule[] = [
  {
    keywords: ["uk", "united kingdom", "britain", "british"],
    reply:
      "For UK refusals, we provide refusal-line diagnosis, SOP rewrite, financial evidence review, and a bank-letter framework. Most UK recovery cases are completed in 3-5 working days. Want a free refusal analysis?",
  },
  {
    keywords: ["canada", "canadian", "ircc"],
    reply:
      "Canada refusals often cite ties-to-home or financial insufficiency. We rebuild the narrative with a full SOP, fund-source explanation letter, and tie-strengthening documentation. Typical turnaround is 4-6 working days.",
  },
  {
    keywords: ["schengen", "europe", "eu", "france", "italy", "spain", "netherlands"],
    reply:
      "Schengen refusals are usually about travel-purpose clarity or financial proof. We prepare a detailed cover letter, itinerary justification, and supporting sponsor documentation. Most cases take 3-5 working days.",
  },
  {
    keywords: ["germany", "german", "studienkolleg"],
    reply:
      "Germany refusals often relate to blocked-account issues or motivation-letter weaknesses. We provide SOP recovery, financial restructuring guidance, and Studienkolleg-specific documentation. Typical turnaround is 4-6 working days.",
  },
  {
    keywords: ["australia", "australian", "subclass"],
    reply:
      "Australian refusals can involve GTE or GS credibility concerns. We rebuild your intent statement, financial evidence, and return narrative. Typical turnaround is 4-6 working days.",
  },
  {
    keywords: ["sop", "statement of purpose", "motivation letter", "fresh sop"],
    reply:
      "Our SOP service includes strategy consultation, up to 3 revision rounds, and final pre-submit review. Fresh SOPs take 3-4 working days; refusal-recovery SOPs take 4-6 days. We write from scratch, never templates.",
  },
  {
    keywords: ["price", "cost", "fee", "pricing", "how much", "package", "plan"],
    reply:
      "We offer three plans: Analysis (Rs 999), Full Recovery (Rs 4,999), and Express (Rs 7,999). Tell me your visa type and refusal reason, and I can suggest the right plan.",
  },
  {
    keywords: ["refund", "money back", "guarantee"],
    reply:
      "We follow a tier-based refund policy. Refunds are available before work begins and on a pro-rata basis during active work. After final deliverables are sent, refunds do not apply. Full details are on /refund-policy.",
  },
  {
    keywords: ["how long", "turnaround", "time", "days", "timeline", "delivery", "deadline"],
    reply:
      "Standard turnaround is 4-6 working days for full recovery. Express includes priority delivery within 24-48 hours for urgent files.",
  },
  {
    keywords: ["refusal", "refused", "rejected", "denial", "denied"],
    reply:
      "A refusal means the strategy needs to change. Share your refusal letter and we will identify each officer concern and map a recovery plan.",
  },
  {
    keywords: ["document", "documents", "checklist", "what to submit", "required"],
    reply:
      "Document requirements depend on your visa type and refusal reasons. Usually we need the refusal notice, updated SOP, financial evidence, and supporting letters. We provide a tailored checklist for each case.",
  },
  {
    keywords: ["whatsapp", "call", "contact", "phone", "reach"],
    reply:
      "You can reach us on WhatsApp at +91 98876 78900 or email VisaHelper@visaguru.live. For a structured start, submit free refusal analysis from the homepage.",
  },
  {
    keywords: ["hello", "hi", "hey", "help"],
    reply:
      "Hello. I can help with refusal recovery for UK, Canada, Schengen, Germany, or Australia. Tell me your visa type and refusal reason.",
  },
];

function sanitize(input: string): string {
  return input.replace(/[<>&"']/g, (char) => {
    const map: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[char] ?? char;
  });
}

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json(
      {
        reply: "Please log in to use the VisaGuru assistant.",
        loginUrl: "/login?next=/",
      },
      { status: 401 },
    );
  }

  const identifier = getRequestIdentifier(request.headers.get("x-forwarded-for"));
  const rate = await enforceRateLimit({
    bucket: "chatbot_message",
    identifier,
    limit: 20,
    windowMs: 60_000,
  });
  if (!rate.allowed) {
    return NextResponse.json(
      { reply: "Too many messages. Please wait a minute and try again." },
      { status: 429 },
    );
  }

  const body = (await request.json()) as { message?: string };
  const raw = (body.message ?? "").trim();
  if (!raw || raw.length > 500) {
    return NextResponse.json({
      reply: "Please send a short message under 500 characters.",
    });
  }

  const message = sanitize(raw).toLowerCase();
  const match = rules.find((rule) =>
    rule.keywords.some((keyword) => message.includes(keyword)),
  );

  return NextResponse.json({
    reply:
      match?.reply ??
      "Please share your visa type and refusal reason for specific guidance. You can also use free refusal analysis from the homepage or WhatsApp +91 98876 78900 for human support.",
  });
}
