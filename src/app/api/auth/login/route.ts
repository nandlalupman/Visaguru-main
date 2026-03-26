import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ensureAdminUser, findUserByEmail } from "@/lib/store";
import { setSessionCookie } from "@/lib/session";
import { verifyPassword } from "@/lib/security";
import { enforceRateLimit, getRequestIdentifier } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  nextPath: z.string().optional(),
});

function resolveRedirect(input: string | undefined, role: "admin" | "user") {
  if (!input) return role === "admin" ? "/admin/dashboard" : "/dashboard";
  if (!input.startsWith("/") || input.startsWith("//")) {
    return role === "admin" ? "/admin/dashboard" : "/dashboard";
  }
  if (role !== "admin" && input.startsWith("/admin")) {
    return "/dashboard";
  }
  return input;
}

export async function POST(request: NextRequest) {
  try {
    const identifier = getRequestIdentifier(request.headers.get("x-forwarded-for"));
    const limit = await enforceRateLimit({
      bucket: "auth_login",
      identifier,
      limit: 10,
      windowMs: 60_000,
    });
    if (!limit.allowed) {
      return NextResponse.json(
        { message: "Too many login attempts. Please wait a minute." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Please provide valid login details." },
        { status: 400 },
      );
    }

    await ensureAdminUser();
    const user = await findUserByEmail(parsed.data.email.trim().toLowerCase());
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    const validPassword = await verifyPassword(parsed.data.password, user.passwordHash);
    if (!validPassword) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const redirect = resolveRedirect(parsed.data.nextPath, user.role);

    return NextResponse.json({
      message: "Logged in successfully.",
      redirect,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to login right now. Please try again." },
      { status: 500 },
    );
  }
}
