import crypto from "crypto";
import bcrypt from "bcryptjs";
import { SessionRole } from "@/lib/domain-types";

export type SessionPayload = {
  userId: string;
  email: string;
  name: string;
  role: SessionRole;
  exp: number;
};

const AUTH_SECRET = process.env.AUTH_SECRET;
const DEV_AUTH_SECRET = "dev-auth-secret-change-me";
const PASSWORD_COST = Number.parseInt(process.env.PASSWORD_COST ?? "12", 10);

function getAuthSecret() {
  if (AUTH_SECRET) return AUTH_SECRET;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET is required in production.");
  }
  return DEV_AUTH_SECRET;
}

function toBase64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, PASSWORD_COST);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export function createSessionToken(
  payload: Omit<SessionPayload, "exp">,
  maxAgeSeconds = 60 * 60 * 24 * 7,
) {
  const secret = getAuthSecret();
  const header = toBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const exp = Math.floor(Date.now() / 1000) + maxAgeSeconds;
  const body = toBase64Url(JSON.stringify({ ...payload, exp }));
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const secret = getAuthSecret();
    const [header, body, signature] = token.split(".");
    if (!header || !body || !signature) return null;
    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${header}.${body}`)
      .digest("base64url");
    if (expected !== signature) return null;
    const payload = JSON.parse(fromBase64Url(body)) as SessionPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
  secret,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
  secret: string;
}) {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return expected === signature;
}

export function verifyWebhookSignature({
  rawBody,
  signature,
  secret,
}: {
  rawBody: string;
  signature: string;
  secret: string;
}) {
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return expected === signature;
}
