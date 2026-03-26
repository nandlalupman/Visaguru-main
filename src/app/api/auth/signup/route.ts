import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createUser } from "@/lib/store";
import { setSessionCookie } from "@/lib/session";
import { enforceRateLimit, getRequestIdentifier } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
    .regex(/[a-z]/, "Password must include at least one lowercase letter.")
    .regex(/[0-9]/, "Password must include at least one number."),
  nextPath: z.string().optional(),
});

function resolveRedirect(input: string | undefined) {
  if (!input) return "/dashboard";
  if (!input.startsWith("/") || input.startsWith("//") || input.startsWith("/admin")) {
    return "/dashboard";
  }
  return input;
}

export async function POST(request: NextRequest) {
  try {
    const identifier = getRequestIdentifier(request.headers.get("x-forwarded-for"));
    const limit = await enforceRateLimit({
      bucket: "auth_signup",
      identifier,
      limit: 8,
      windowMs: 60_000,
    });
    if (!limit.allowed) {
      return NextResponse.json(
        { message: "Too many signup attempts. Please wait and try again." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Please provide valid signup details." },
        { status: 400 },
      );
    }

    const user = await createUser({
      name: parsed.data.name.trim(),
      email: parsed.data.email.trim().toLowerCase(),
      password: parsed.data.password,
      role: "user",
    });

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json({
      message: "Account created successfully.",
      redirect: resolveRedirect(parsed.data.nextPath),
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create account.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
