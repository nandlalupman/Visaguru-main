import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSubmission } from "@/lib/store";
import { getCurrentSession } from "@/lib/session";
import { enforceRateLimit, getRequestIdentifier } from "@/lib/rate-limit";

const schema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Enter a valid email."),
  whatsapp: z
    .string()
    .min(8, "Enter a valid phone number.")
    .regex(/^[\d+\-\s()]+$/, "Phone number contains invalid characters."),
  visaType: z.string().min(2, "Select a visa type."),
  message: z.string().max(500, "Message must be under 500 characters.").optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json(
        {
          message: "Please log in to submit your case.",
          loginUrl: "/login?next=/#free-analysis",
        },
        { status: 401 },
      );
    }

    const identifier = getRequestIdentifier(request.headers.get("x-forwarded-for"));
    const rate = await enforceRateLimit({
      bucket: "free_analysis_submit",
      identifier,
      limit: 5,
      windowMs: 60_000,
    });
    if (!rate.allowed) {
      return NextResponse.json(
        { message: "Too many submissions. Please wait a minute before trying again." },
        { status: 429 },
      );
    }

    const formData = await request.formData();
    const payload = {
      fullName: String(formData.get("fullName") ?? "").trim(),
      email: String(formData.get("email") ?? "")
        .trim()
        .toLowerCase(),
      whatsapp: String(formData.get("whatsapp") ?? "").trim(),
      visaType: String(formData.get("visaType") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };
    const result = schema.safeParse(payload);

    if (!result.success) {
      const firstError =
        result.error.issues[0]?.message ??
        "Please complete all required fields correctly.";
      return NextResponse.json({ message: firstError }, { status: 400 });
    }

    const file = formData.get("refusalLetter");
    if (file instanceof File && file.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Please upload a PDF smaller than 8 MB." },
        { status: 400 },
      );
    }

    if (file instanceof File && file.type !== "application/pdf") {
      return NextResponse.json({ message: "Only PDF files are accepted." }, { status: 400 });
    }

    const submission = await createSubmission({
      userId: session.userId,
      fullName: result.data.fullName,
      email: result.data.email,
      whatsapp: result.data.whatsapp,
      visaType: result.data.visaType,
      message: result.data.message,
      fileName: file instanceof File ? file.name : undefined,
    });

    return NextResponse.json({
      message:
        "Request received. Our consultant will send your refusal analysis within 2 hours.",
      submissionId: submission.id,
    });
  } catch {
    return NextResponse.json(
      {
        message:
          "We could not submit your request right now. Please try again or contact us on WhatsApp.",
      },
      { status: 500 },
    );
  }
}
