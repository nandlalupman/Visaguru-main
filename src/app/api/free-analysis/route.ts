import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSubmission, findUserByEmail } from "@/lib/store";
import { enforceRateLimit, getRequestIdentifier } from "@/lib/rate-limit";
import { sendAdminNotification, sendUserConfirmation } from "@/lib/mailer";

const schema = z.object({
  email: z.string().email("Enter a valid email."),
  whatsapp: z.string().optional(),
  visaType: z.string().min(2, "Select a visa type."),
  message: z.string().max(500, "Message must be under 500 characters.").optional(),
});

export async function POST(request: NextRequest) {
  try {
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

    // Auto-link to existing user if they exist
    const existingUser = await findUserByEmail(result.data.email);
    const userId = existingUser?.id;

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
      userId: userId,
      fullName: existingUser?.name ?? "Guest",
      email: result.data.email,
      whatsapp: result.data.whatsapp || "",
      visaType: result.data.visaType,
      message: result.data.message,
      fileName: file instanceof File ? file.name : undefined,
    });

    // Send emails (non-blocking, failures are logged but don't break the flow)
    Promise.all([
      sendAdminNotification({
        email: result.data.email,
        visaType: result.data.visaType,
        message: result.data.message,
        whatsapp: result.data.whatsapp,
      }),
      sendUserConfirmation(result.data.email, result.data.visaType),
    ]).catch((err) => {
      console.error("[MAILER] Failed to send notification emails:", err);
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
