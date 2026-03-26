import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      userId: session.userId,
      email: session.email,
      name: session.name,
      role: session.role,
    },
  });
}
