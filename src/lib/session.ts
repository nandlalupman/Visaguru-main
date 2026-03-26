import { cookies } from "next/headers";
import { createSessionToken, verifySessionToken } from "@/lib/security";

export const SESSION_COOKIE = "vg_session";

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function setSessionCookie(input: {
  userId: string;
  email: string;
  name: string;
  role: "user" | "admin";
}) {
  const cookieStore = await cookies();
  const token = createSessionToken(input);
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
