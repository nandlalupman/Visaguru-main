import { prisma } from "@/lib/prisma";

export async function enforceRateLimit(input: {
  bucket: string;
  identifier: string;
  limit: number;
  windowMs: number;
}) {
  const now = new Date();
  const key = `${input.bucket}:${input.identifier}`;

  const result = await prisma.$transaction(async (tx) => {
    const row = await tx.rateLimit.findUnique({ where: { key } });
    const resetAt = new Date(now.getTime() + input.windowMs);

    if (!row || row.resetAt <= now) {
      await tx.rateLimit.upsert({
        where: { key },
        create: {
          key,
          bucket: input.bucket,
          identifier: input.identifier,
          count: 1,
          resetAt,
        },
        update: {
          bucket: input.bucket,
          identifier: input.identifier,
          count: 1,
          resetAt,
        },
      });
      return { allowed: true, remaining: input.limit - 1, resetAt };
    }

    if (row.count >= input.limit) {
      return { allowed: false, remaining: 0, resetAt: row.resetAt };
    }

    const updated = await tx.rateLimit.update({
      where: { key },
      data: { count: { increment: 1 } },
    });
    return {
      allowed: true,
      remaining: Math.max(0, input.limit - updated.count),
      resetAt: updated.resetAt,
    };
  });

  const retryAfterMs = Math.max(0, result.resetAt.getTime() - now.getTime());
  return { ...result, retryAfterMs };
}

export function getRequestIdentifier(forwardedFor: string | null) {
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}
