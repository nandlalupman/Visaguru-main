import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentSession } from "@/lib/session";
import { updateSubmission } from "@/lib/store";

const schema = z.object({
  status: z.enum(["new", "in_review", "resolved"]),
  priority: z.enum(["low", "medium", "high"]).optional(),
  assignedTo: z.string().max(80).optional(),
  note: z.string().max(400).optional(),
});

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteProps) {
  const session = await getCurrentSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid submission update payload." }, { status: 400 });
  }

  const updated = await updateSubmission(id, {
    status: parsed.data.status,
    priority: parsed.data.priority,
    assignedTo: parsed.data.assignedTo,
    note: parsed.data.note,
    actorName: session.name,
    actorRole: session.role,
  });
  if (!updated) {
    return NextResponse.json({ message: "Submission not found." }, { status: 404 });
  }
  return NextResponse.json({ submission: updated });
}
