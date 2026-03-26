export type SessionRole = "user" | "admin";

export type SubmissionStatus = "new" | "in_review" | "resolved";
export type SubmissionPriority = "low" | "medium" | "high";
export type UpdateActorRole = SessionRole | "system";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: SessionRole;
  passwordHash: string;
  createdAt: string;
};

export type SubmissionUpdate = {
  id: string;
  status: SubmissionStatus;
  note: string;
  createdAt: string;
  actorRole: UpdateActorRole;
  actorName: string;
};

export type SubmissionRecord = {
  id: string;
  userId?: string;
  fullName: string;
  email: string;
  whatsapp: string;
  visaType: string;
  message?: string;
  fileName?: string;
  status: SubmissionStatus;
  priority: SubmissionPriority;
  assignedTo?: string;
  createdAt: string;
  updates: SubmissionUpdate[];
};

export type PaymentOrderRecord = {
  id: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  planName: string;
  amount: number;
  currency: string;
  status: "created" | "paid" | "failed";
  userId?: string;
  email?: string;
  createdAt: string;
  paidAt?: string;
  failureReason?: string;
};
