import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";

/**
 * Verifies the request is from an authenticated admin user.
 * Returns the session if valid, or a NextResponse error if not.
 */
export async function requireAdmin() {
  const session = await getCurrentSession();
  if (!session || session.role !== "admin") {
    return {
      error: NextResponse.json({ message: "Unauthorized." }, { status: 401 }),
      session: null,
    };
  }
  return { error: null, session };
}
