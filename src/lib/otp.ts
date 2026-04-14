import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 5;

/** Generate a cryptographically random 6-digit OTP */
export function generateOtp(): string {
  const max = Math.pow(10, OTP_LENGTH);
  const num = crypto.randomInt(0, max);
  return num.toString().padStart(OTP_LENGTH, "0");
}

/** Create an OTP for the given email and persist it in the database */
export async function createOtp(email: string): Promise<string> {
  const normalizedEmail = email.trim().toLowerCase();

  // Invalidate any existing unused OTPs for this email
  await prisma.otpCode.updateMany({
    where: { email: normalizedEmail, used: false },
    data: { used: true },
  });

  const code = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.otpCode.create({
    data: {
      email: normalizedEmail,
      code,
      expiresAt,
    },
  });

  return code;
}

/** Verify an OTP code for the given email. Returns true if valid. */
export async function verifyOtp(email: string, code: string): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();
  const now = new Date();

  const otp = await prisma.otpCode.findFirst({
    where: {
      email: normalizedEmail,
      code,
      used: false,
      expiresAt: { gt: now },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) return false;

  // Mark as used
  await prisma.otpCode.update({
    where: { id: otp.id },
    data: { used: true },
  });

  return true;
}

/** Cleanup expired OTPs (can be called periodically) */
export async function cleanupExpiredOtps(): Promise<void> {
  await prisma.otpCode.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: new Date() } },
        { used: true, createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      ],
    },
  });
}
