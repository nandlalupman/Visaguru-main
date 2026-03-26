import {
  ActorRole,
  Prisma,
  SubmissionPriority as PrismaPriority,
  SubmissionStatus as PrismaStatus,
  UserRole,
} from "@prisma/client";
import {
  PaymentOrderRecord,
  SessionRole,
  SubmissionPriority,
  SubmissionRecord,
  SubmissionStatus,
  SubmissionUpdate,
  UserRecord,
} from "@/lib/domain-types";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/security";

function toSessionRole(role: UserRole): SessionRole {
  return role === "admin" ? "admin" : "user";
}

function toPrismaUserRole(role: SessionRole | undefined): UserRole {
  return role === "admin" ? UserRole.admin : UserRole.user;
}

function toSubmissionStatus(status: PrismaStatus): SubmissionStatus {
  if (status === "in_review" || status === "resolved") return status;
  return "new";
}

function toPrismaSubmissionStatus(status: SubmissionStatus): PrismaStatus {
  if (status === "in_review") return PrismaStatus.in_review;
  if (status === "resolved") return PrismaStatus.resolved;
  return PrismaStatus.new;
}

function toSubmissionPriority(priority: PrismaPriority): SubmissionPriority {
  if (priority === "low" || priority === "high") return priority;
  return "medium";
}

function toPrismaSubmissionPriority(priority: SubmissionPriority): PrismaPriority {
  if (priority === "low") return PrismaPriority.low;
  if (priority === "high") return PrismaPriority.high;
  return PrismaPriority.medium;
}

function toActorRole(role: ActorRole): "user" | "admin" | "system" {
  if (role === "admin" || role === "user") return role;
  return "system";
}

function toPrismaActorRole(role: "user" | "admin" | "system"): ActorRole {
  if (role === "admin") return ActorRole.admin;
  if (role === "user") return ActorRole.user;
  return ActorRole.system;
}

function toUserRecord(user: {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  passwordHash: string;
  createdAt: Date;
}): UserRecord {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: toSessionRole(user.role),
    passwordHash: user.passwordHash,
    createdAt: user.createdAt.toISOString(),
  };
}

function toSubmissionUpdate(update: {
  id: string;
  status: PrismaStatus;
  note: string;
  createdAt: Date;
  actorRole: ActorRole;
  actorName: string;
}): SubmissionUpdate {
  return {
    id: update.id,
    status: toSubmissionStatus(update.status),
    note: update.note,
    createdAt: update.createdAt.toISOString(),
    actorRole: toActorRole(update.actorRole),
    actorName: update.actorName,
  };
}

function toSubmissionRecord(submission: {
  id: string;
  userId: string | null;
  fullName: string;
  email: string;
  whatsapp: string;
  visaType: string;
  message: string | null;
  fileName: string | null;
  status: PrismaStatus;
  priority: PrismaPriority;
  assignedTo: string | null;
  createdAt: Date;
  updates: {
    id: string;
    status: PrismaStatus;
    note: string;
    createdAt: Date;
    actorRole: ActorRole;
    actorName: string;
  }[];
}): SubmissionRecord {
  return {
    id: submission.id,
    userId: submission.userId ?? undefined,
    fullName: submission.fullName,
    email: submission.email,
    whatsapp: submission.whatsapp,
    visaType: submission.visaType,
    message: submission.message ?? undefined,
    fileName: submission.fileName ?? undefined,
    status: toSubmissionStatus(submission.status),
    priority: toSubmissionPriority(submission.priority),
    assignedTo: submission.assignedTo ?? undefined,
    createdAt: submission.createdAt.toISOString(),
    updates: submission.updates.map(toSubmissionUpdate),
  };
}

function toPaymentOrderRecord(order: {
  id: string;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  planName: string;
  amount: number;
  currency: string;
  status: "created" | "paid" | "failed";
  userId: string | null;
  email: string | null;
  createdAt: Date;
  paidAt: Date | null;
  failureReason: string | null;
}): PaymentOrderRecord {
  return {
    id: order.id,
    razorpayOrderId: order.razorpayOrderId,
    razorpayPaymentId: order.razorpayPaymentId ?? undefined,
    planName: order.planName,
    amount: order.amount,
    currency: order.currency,
    status: order.status,
    userId: order.userId ?? undefined,
    email: order.email ?? undefined,
    createdAt: order.createdAt.toISOString(),
    paidAt: order.paidAt?.toISOString(),
    failureReason: order.failureReason ?? undefined,
  };
}

export async function listUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
  });
  return users.map(toUserRecord);
}

export async function countUsers() {
  return prisma.user.count();
}

export async function listSubmissions() {
  const submissions = await prisma.submission.findMany({
    include: {
      updates: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });
  return submissions.map(toSubmissionRecord);
}

export async function getSubmissionMetrics() {
  const [total, grouped] = await Promise.all([
    prisma.submission.count(),
    prisma.submission.groupBy({
      by: ["status"],
      _count: {
        _all: true,
      },
    }),
  ]);

  const statusBreakdown = {
    new: 0,
    in_review: 0,
    resolved: 0,
  };

  for (const row of grouped) {
    if (row.status === "new") statusBreakdown.new = row._count._all;
    if (row.status === "in_review") statusBreakdown.in_review = row._count._all;
    if (row.status === "resolved") statusBreakdown.resolved = row._count._all;
  }

  return {
    total,
    statusBreakdown,
  };
}

export async function listSubmissionsPage(input?: {
  page?: number;
  pageSize?: number;
  status?: SubmissionStatus | "all";
  query?: string;
}) {
  const page = Math.max(1, input?.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, input?.pageSize ?? 25));
  const query = input?.query?.trim();

  const where: Prisma.SubmissionWhereInput = {};
  if (input?.status && input.status !== "all") {
    where.status = toPrismaSubmissionStatus(input.status);
  }
  if (query) {
    where.OR = [
      {
        fullName: { contains: query },
      },
      {
        email: { contains: query },
      },
      {
        visaType: { contains: query },
      },
    ];
  }

  const [total, submissions] = await Promise.all([
    prisma.submission.count({ where }),
    prisma.submission.findMany({
      where,
      include: {
        updates: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    items: submissions.map(toSubmissionRecord),
    total,
    page,
    pageSize,
    totalPages,
  };
}

export async function listSubmissionsByUser(userId: string) {
  const submissions = await prisma.submission.findMany({
    where: { userId },
    include: {
      updates: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });
  return submissions.map(toSubmissionRecord);
}

export async function ensureAdminUser() {
  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@visaguru.live").toLowerCase();
  const existingAdmin = await prisma.user.findFirst({
    where: { role: UserRole.admin },
    select: { id: true },
  });
  if (existingAdmin) return;

  const adminPassword =
    process.env.ADMIN_PASSWORD ??
    (process.env.NODE_ENV === "production" ? undefined : "Admin@12345");

  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD is required in production.");
  }

  await prisma.user.create({
    data: {
      name: "VisaGuru Admin",
      email: adminEmail,
      role: UserRole.admin,
      passwordHash: await hashPassword(adminPassword),
    },
  });
}

export async function findUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  return user ? toUserRecord(user) : undefined;
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  role?: SessionRole;
}) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
    select: { id: true },
  });
  if (existing) {
    throw new Error("A user with this email already exists.");
  }

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email.toLowerCase(),
      role: toPrismaUserRole(input.role),
      passwordHash: await hashPassword(input.password),
    },
  });
  return toUserRecord(user);
}

export async function createSubmission(input: {
  userId?: string;
  fullName: string;
  email: string;
  whatsapp: string;
  visaType: string;
  message?: string;
  fileName?: string;
}) {
  const submission = await prisma.submission.create({
    data: {
      userId: input.userId,
      fullName: input.fullName,
      email: input.email,
      whatsapp: input.whatsapp,
      visaType: input.visaType,
      message: input.message,
      fileName: input.fileName,
      status: PrismaStatus.new,
      priority: PrismaPriority.medium,
      updates: {
        create: {
          status: PrismaStatus.new,
          note: "Submission received.",
          actorRole: ActorRole.system,
          actorName: "VisaGuru System",
        },
      },
    },
    include: {
      updates: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
  return toSubmissionRecord(submission);
}

export async function updateSubmission(
  submissionId: string,
  patch: {
    status?: SubmissionStatus;
    priority?: SubmissionPriority;
    assignedTo?: string;
    note?: string;
    actorName?: string;
    actorRole?: SessionRole | "system";
  },
) {
  const current = await prisma.submission.findUnique({
    where: { id: submissionId },
    select: {
      id: true,
      status: true,
      priority: true,
      assignedTo: true,
    },
  });
  if (!current) return null;

  const nextStatus = patch.status ?? toSubmissionStatus(current.status);
  const nextPriority = patch.priority ?? toSubmissionPriority(current.priority);
  const nextAssigned = (patch.assignedTo ?? current.assignedTo ?? "").trim();
  const cleanAssigned = nextAssigned || null;
  const cleanNote = patch.note?.trim();

  const statusChanged = nextStatus !== toSubmissionStatus(current.status);
  const priorityChanged = nextPriority !== toSubmissionPriority(current.priority);
  const assignmentChanged = (current.assignedTo ?? null) !== cleanAssigned;
  const hasNote = Boolean(cleanNote);

  const noteParts: string[] = [];
  if (statusChanged) noteParts.push(`Status changed to ${nextStatus}.`);
  if (priorityChanged) noteParts.push(`Priority set to ${nextPriority}.`);
  if (assignmentChanged) {
    noteParts.push(cleanAssigned ? `Assigned to ${cleanAssigned}.` : "Unassigned from previous owner.");
  }
  if (cleanNote) noteParts.push(cleanNote);

  const submission = await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: toPrismaSubmissionStatus(nextStatus),
      priority: toPrismaSubmissionPriority(nextPriority),
      assignedTo: cleanAssigned,
      ...(statusChanged || priorityChanged || assignmentChanged || hasNote
        ? {
            updates: {
              create: {
                status: toPrismaSubmissionStatus(nextStatus),
                note: noteParts.join(" "),
                actorRole: toPrismaActorRole(patch.actorRole ?? "system"),
                actorName: patch.actorName ?? "VisaGuru Team",
              },
            },
          }
        : {}),
    },
    include: {
      updates: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return toSubmissionRecord(submission);
}

export async function updateSubmissionStatus(
  submissionId: string,
  status: SubmissionStatus,
) {
  return updateSubmission(submissionId, { status });
}

export async function getPaymentMetrics() {
  const [totalOrders, paidOrders, failedOrders, revenue] = await Promise.all([
    prisma.paymentOrder.count(),
    prisma.paymentOrder.count({
      where: { status: "paid" },
    }),
    prisma.paymentOrder.count({
      where: { status: "failed" },
    }),
    prisma.paymentOrder.aggregate({
      where: { status: "paid" },
      _sum: {
        amount: true,
      },
    }),
  ]);

  return {
    totalOrders,
    paidOrders,
    failedOrders,
    revenueInInr: revenue._sum.amount ?? 0,
  };
}

export async function listRecentPaymentOrders(limit = 15) {
  const safeLimit = Math.min(100, Math.max(1, limit));
  const orders = await prisma.paymentOrder.findMany({
    orderBy: { createdAt: "desc" },
    take: safeLimit,
  });
  return orders.map(toPaymentOrderRecord);
}

export async function createPaymentOrder(input: {
  razorpayOrderId: string;
  planName: string;
  amount: number;
  currency: string;
  userId?: string;
  email?: string;
}) {
  const order = await prisma.paymentOrder.upsert({
    where: { razorpayOrderId: input.razorpayOrderId },
    create: {
      razorpayOrderId: input.razorpayOrderId,
      planName: input.planName,
      amount: input.amount,
      currency: input.currency,
      userId: input.userId,
      email: input.email,
      status: "created",
    },
    update: {
      planName: input.planName,
      amount: input.amount,
      currency: input.currency,
      userId: input.userId,
      email: input.email,
    },
  });
  return toPaymentOrderRecord(order);
}

export async function findPaymentOrderByRazorpayOrderId(razorpayOrderId: string) {
  const order = await prisma.paymentOrder.findUnique({
    where: { razorpayOrderId },
  });
  return order ? toPaymentOrderRecord(order) : undefined;
}

export async function markPaymentOrderPaid(input: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
}) {
  const existing = await prisma.paymentOrder.findUnique({
    where: { razorpayOrderId: input.razorpayOrderId },
  });
  if (!existing) return null;

  const order = await prisma.paymentOrder.update({
    where: { razorpayOrderId: input.razorpayOrderId },
    data: {
      status: "paid",
      razorpayPaymentId: input.razorpayPaymentId,
      paidAt: new Date(),
      failureReason: null,
    },
  });
  return toPaymentOrderRecord(order);
}

export async function markPaymentOrderFailed(input: {
  razorpayOrderId: string;
  reason?: string;
}) {
  const existing = await prisma.paymentOrder.findUnique({
    where: { razorpayOrderId: input.razorpayOrderId },
  });
  if (!existing) return null;

  const order = await prisma.paymentOrder.update({
    where: { razorpayOrderId: input.razorpayOrderId },
    data: {
      status: "failed",
      failureReason: input.reason?.slice(0, 300) ?? "Payment failed.",
    },
  });
  return toPaymentOrderRecord(order);
}

export async function appendPaymentEvent(input: {
  razorpayOrderId: string;
  eventType: string;
  payload: string;
}) {
  const order = await prisma.paymentOrder.findUnique({
    where: { razorpayOrderId: input.razorpayOrderId },
    select: { id: true },
  });
  if (!order) return null;
  return prisma.paymentEvent.create({
    data: {
      paymentOrderId: order.id,
      eventType: input.eventType,
      payload: input.payload,
    },
  });
}
