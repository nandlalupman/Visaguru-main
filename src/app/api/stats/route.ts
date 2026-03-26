import { NextResponse } from "next/server";
import { countUsers, getSubmissionMetrics } from "@/lib/store";

export async function GET() {
  const [metrics, users] = await Promise.all([getSubmissionMetrics(), countUsers()]);
  return NextResponse.json({
    users,
    submissions: metrics.total,
    statusBreakdown: metrics.statusBreakdown,
  });
}
