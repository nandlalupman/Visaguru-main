import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function readJsonArray(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf8");
  if (!raw.trim()) return [];
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

function toDate(value) {
  if (typeof value !== "string") return new Date();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

async function migrateSubmissions() {
  const filePath = path.join(process.cwd(), "data", "submissions.json");
  const submissions = readJsonArray(filePath);

  let inserted = 0;
  for (const record of submissions) {
    if (!record?.id || !record?.fullName || !record?.email || !record?.whatsapp || !record?.visaType) {
      continue;
    }

    const existing = await prisma.submission.findUnique({
      where: { id: record.id },
      select: { id: true },
    });
    if (existing) continue;

    const updates = Array.isArray(record.updates) ? record.updates : [];
    await prisma.submission.create({
      data: {
        id: record.id,
        userId: typeof record.userId === "string" ? record.userId : null,
        fullName: record.fullName,
        email: String(record.email).toLowerCase(),
        whatsapp: record.whatsapp,
        visaType: record.visaType,
        message: typeof record.message === "string" ? record.message : null,
        fileName: typeof record.fileName === "string" ? record.fileName : null,
        status:
          record.status === "in_review" || record.status === "resolved"
            ? record.status
            : "new",
        priority:
          record.priority === "low" || record.priority === "high"
            ? record.priority
            : "medium",
        assignedTo: typeof record.assignedTo === "string" ? record.assignedTo : null,
        createdAt: toDate(record.createdAt),
        updates: {
          create: updates
            .filter((update) => typeof update?.note === "string")
            .map((update) => ({
              id: typeof update.id === "string" ? update.id : undefined,
              status:
                update.status === "in_review" || update.status === "resolved"
                  ? update.status
                  : "new",
              note: update.note,
              actorRole:
                update.actorRole === "admin" || update.actorRole === "user"
                  ? update.actorRole
                  : "system",
              actorName:
                typeof update.actorName === "string"
                  ? update.actorName
                  : "VisaGuru System",
              createdAt: toDate(update.createdAt),
            })),
        },
      },
    });
    inserted += 1;
  }

  return inserted;
}

async function main() {
  const insertedSubmissions = await migrateSubmissions();
  console.log(`Migrated submissions: ${insertedSubmissions}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
