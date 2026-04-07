import { unstable_noStore as noStore } from "next/cache";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/session";
import {
  countUsers,
  ensureAdminUser,
  getPaymentMetrics,
  getSubmissionMetrics,
  getSubmissionsByVisaType,
  listRecentPaymentOrders,
  listSubmissionsPage,
} from "@/lib/store";
import { LogoutButton } from "@/components/logout-button";
import { AdminUpdateControls } from "@/components/admin-update-controls";
import AdminCmsManager from "@/components/admin-cms-manager";
import type { SubmissionStatus } from "@/lib/domain-types";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "VisaGuru admin operations panel.",
};

type PageProps = {
  searchParams: Promise<{
    page?: string;
    status?: string;
    q?: string;
  }>;
};

function parsePage(input?: string) {
  const parsed = Number.parseInt(input ?? "1", 10);
  return Number.isNaN(parsed) ? 1 : Math.max(1, parsed);
}

function parseStatus(input?: string): SubmissionStatus | "all" {
  if (input === "new" || input === "in_review" || input === "resolved") return input;
  return "all";
}

function buildDashboardHref(input: {
  page: number;
  status: SubmissionStatus | "all";
  query?: string;
}) {
  const params = new URLSearchParams();
  if (input.page > 1) params.set("page", String(input.page));
  if (input.status !== "all") params.set("status", input.status);
  if (input.query) params.set("q", input.query);
  const queryString = params.toString();
  return queryString ? `/admin/dashboard?${queryString}` : "/admin/dashboard";
}

function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

async function getContentMetrics() {
  const [
    services,
    testimonials,
    videos,
    blogPublished,
    blogDraft,
    faqGlobal,
    faqService,
    pricing,
    siteConfigs,
  ] = await Promise.all([
    prisma.siteService.count({ where: { published: true } }),
    prisma.testimonial.count({ where: { published: true } }),
    prisma.videoTestimonial.count({ where: { published: true } }),
    prisma.blogPostEntry.count({ where: { status: "published" } }),
    prisma.blogPostEntry.count({ where: { status: "draft" } }),
    prisma.faqItem.count({ where: { serviceId: null, published: true } }),
    prisma.faqItem.count({ where: { serviceId: { not: null }, published: true } }),
    prisma.pricingTier.count({ where: { published: true } }),
    prisma.siteConfig.count(),
  ]);

  return {
    services,
    testimonials,
    videos,
    blogPublished,
    blogDraft,
    faqGlobal,
    faqService,
    pricing,
    siteConfigs,
  };
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  noStore();
  await ensureAdminUser();

  const session = await getCurrentSession();
  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  const params = await searchParams;
  const page = parsePage(params.page);
  const status = parseStatus(params.status);
  const query = params.q?.trim() || undefined;

  const [usersCount, submissionMetrics, submissionsPage, paymentMetrics, recentPayments, contentMetrics, visaTypeBreakdown] =
    await Promise.all([
      countUsers(),
      getSubmissionMetrics(),
      listSubmissionsPage({ page, status, query, pageSize: 25 }),
      getPaymentMetrics(),
      listRecentPaymentOrders(12),
      getContentMetrics(),
      getSubmissionsByVisaType(),
    ]);

  const maxVisaCount = visaTypeBreakdown.length > 0 ? visaTypeBreakdown[0].count : 1;

  // Admin credentials info
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@visaguru.live";
  const adminPasswordHint = process.env.NODE_ENV === "production" ? "(Set via ADMIN_PASSWORD env)" : "Admin@12345";

  const openCases =
    submissionMetrics.statusBreakdown.new + submissionMetrics.statusBreakdown.in_review;
  const resolutionRate =
    submissionMetrics.total > 0
      ? Math.round((submissionMetrics.statusBreakdown.resolved / submissionMetrics.total) * 100)
      : 0;

  const hasPrevPage = submissionsPage.page > 1;
  const hasNextPage = submissionsPage.page < submissionsPage.totalPages;
  const prevHref = buildDashboardHref({
    page: submissionsPage.page - 1,
    status,
    query,
  });
  const nextHref = buildDashboardHref({
    page: submissionsPage.page + 1,
    status,
    query,
  });

  return (
    <section className="section-padding">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl text-[var(--color-navy)]">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Logged in as {session.email}
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* ── Admin Credentials Info ── */}
        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔐</span>
            <div>
              <p className="text-sm font-semibold text-[var(--color-navy)]">Admin Credentials</p>
              <div className="mt-2 grid gap-2 text-sm md:grid-cols-3">
                <p className="text-[var(--color-muted)]">Email: <span className="font-mono font-semibold text-[var(--color-navy)]">{adminEmail}</span></p>
                <p className="text-[var(--color-muted)]">Password: <span className="font-mono font-semibold text-[var(--color-navy)]">{adminPasswordHint}</span></p>
                <p className="text-[var(--color-muted)]">Role: <span className="rounded-full bg-[var(--color-navy)] px-2 py-0.5 text-xs font-semibold text-white">{session.role}</span></p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <article className="surface-card rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
              Total users
            </p>
            <p className="mt-2 text-3xl font-semibold text-[var(--color-navy)]">
              {usersCount}
            </p>
          </article>
          <article className="surface-card rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
              Total submissions
            </p>
            <p className="mt-2 text-3xl font-semibold text-[var(--color-navy)]">
              {submissionMetrics.total}
            </p>
          </article>
          <article className="surface-card rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
              New
            </p>
            <p className="mt-2 text-3xl font-semibold text-[var(--color-navy)]">
              {submissionMetrics.statusBreakdown.new}
            </p>
          </article>
          <article className="surface-card rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
              In review
            </p>
            <p className="mt-2 text-3xl font-semibold text-[var(--color-navy)]">
              {submissionMetrics.statusBreakdown.in_review}
            </p>
          </article>
          <article className="surface-card rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
              Paid orders
            </p>
            <p className="mt-2 text-3xl font-semibold text-[var(--color-navy)]">
              {paymentMetrics.paidOrders}
            </p>
          </article>
          <article className="surface-card rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
              Revenue
            </p>
            <p className="mt-2 text-2xl font-semibold text-[var(--color-navy)]">
              {formatInr(paymentMetrics.revenueInInr)}
            </p>
          </article>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <article className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
              Workflow Health
            </p>
            <p className="mt-2 text-2xl font-semibold text-[var(--color-navy)]">
              {openCases} open case{openCases === 1 ? "" : "s"}
            </p>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              {resolutionRate}% resolved overall
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--color-bg)]">
              <div
                className="h-full rounded-full bg-[var(--color-gold)]"
                style={{ width: `${resolutionRate}%` }}
              />
            </div>
          </article>

          <article className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
              Content Inventory
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--color-muted)]">
              <p>Services: <span className="font-semibold text-[var(--color-navy)]">{contentMetrics.services}</span></p>
              <p>Reviews: <span className="font-semibold text-[var(--color-navy)]">{contentMetrics.testimonials}</span></p>
              <p>Videos: <span className="font-semibold text-[var(--color-navy)]">{contentMetrics.videos}</span></p>
              <p>Pricing: <span className="font-semibold text-[var(--color-navy)]">{contentMetrics.pricing}</span></p>
              <p>FAQs: <span className="font-semibold text-[var(--color-navy)]">{contentMetrics.faqGlobal + contentMetrics.faqService}</span></p>
              <p>Site Keys: <span className="font-semibold text-[var(--color-navy)]">{contentMetrics.siteConfigs}</span></p>
            </div>
            <p className="mt-3 text-xs text-[var(--color-muted)]">
              Blog: {contentMetrics.blogPublished} published / {contentMetrics.blogDraft} draft
            </p>
          </article>

          <article className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
              Quick Actions
            </p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <a href="#submissions" className="rounded-xl border border-[var(--color-border)] px-3 py-2 text-[var(--color-navy)] transition hover:bg-[var(--color-bg)]">
                Review submissions
              </a>
              <a href="#payments" className="rounded-xl border border-[var(--color-border)] px-3 py-2 text-[var(--color-navy)] transition hover:bg-[var(--color-bg)]">
                Check recent payments
              </a>
              <a href="#content-cms" className="rounded-xl border border-[var(--color-border)] px-3 py-2 text-[var(--color-navy)] transition hover:bg-[var(--color-bg)]">
                Edit website content
              </a>
            </div>
          </article>
        </div>

        {/* ── Visa Type Analytics ── */}
        {visaTypeBreakdown.length > 0 && (
          <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">Submission Analytics</p>
                <h3 className="mt-1 text-lg font-bold text-[var(--color-navy)]">Visa Type Breakdown</h3>
                <p className="text-xs text-[var(--color-muted)]">Which visa types are most applied for — sorted by frequency</p>
              </div>
              <span className="text-3xl">📊</span>
            </div>
            <div className="mt-5 space-y-3">
              {visaTypeBreakdown.map((item, idx) => (
                <div key={item.visaType} className="flex items-center gap-3">
                  <span className="w-6 text-center text-xs font-bold text-[var(--color-gold)]">{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-[var(--color-navy)] truncate">{item.visaType}</p>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        idx === 0
                          ? "bg-[var(--color-gold)] text-white"
                          : idx < 3
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-600"
                      }`}>
                        {item.count} {item.count === 1 ? "submission" : "submissions"}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          idx === 0 ? "bg-[var(--color-gold)]" : idx < 3 ? "bg-amber-400" : "bg-gray-300"
                        }`}
                        style={{ width: `${Math.max(8, (item.count / maxVisaCount) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-[var(--color-muted)]">💡 Top visa types indicate where your marketing and services have the most traction.</p>
          </div>
        )}

        <div id="submissions" className="mt-6 rounded-2xl border border-[var(--color-border)] bg-white p-4">
          <form className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search name, email, visa type"
              className="rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm outline-none transition focus:border-[var(--color-gold)]"
            />
            <select
              name="status"
              defaultValue={status}
              className="rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm outline-none transition focus:border-[var(--color-gold)]"
            >
              <option value="all">All statuses</option>
              <option value="new">New</option>
              <option value="in_review">In review</option>
              <option value="resolved">Resolved</option>
            </select>
            <button
              type="submit"
              className="rounded-full bg-[var(--color-navy)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-navy-light)]"
            >
              Apply
            </button>
          </form>
          <p className="mt-3 text-xs text-[var(--color-muted)]">
            Showing {submissionsPage.items.length} of {submissionsPage.total} submissions.
            Page {submissionsPage.page} of {submissionsPage.totalPages}.
          </p>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white text-left text-sm">
            <thead className="bg-[var(--color-bg)]">
              <tr className="[&>th]:font-semibold">
                <th className="px-4 py-3 text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
                  Applicant
                </th>
                <th className="px-4 py-3 text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
                  Visa Type
                </th>
                <th className="px-4 py-3 text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
                  Status
                </th>
                <th className="px-4 py-3 text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
                  Latest Update
                </th>
                <th className="px-4 py-3 text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
                  Workflow
                </th>
              </tr>
            </thead>
            <tbody>
              {submissionsPage.items.map((item) => {
                const latestUpdate = item.updates[item.updates.length - 1];
                return (
                  <tr
                    key={item.id}
                    className="border-t border-[var(--color-border)] align-top transition-colors hover:bg-[var(--color-bg)]"
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[var(--color-navy)]">{item.fullName}</p>
                      <p className="text-xs text-[var(--color-muted)]">{item.email}</p>
                      <p className="text-xs text-[var(--color-muted)]">{item.whatsapp}</p>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-muted)]">
                      <p>{item.visaType}</p>
                      <p className="mt-1 text-xs">
                        Priority: <span className="font-semibold">{item.priority}</span>
                      </p>
                      <p className="text-xs">
                        Assignee: <span className="font-semibold">{item.assignedTo ?? "-"}</span>
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge-${item.status} rounded-full px-3 py-1 text-xs font-semibold uppercase`}
                      >
                        {item.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="max-w-[320px] px-4 py-3 text-xs text-[var(--color-muted)]">
                      <p className="line-clamp-3">{latestUpdate?.note ?? "-"}</p>
                      <p className="mt-1">
                        {latestUpdate
                          ? new Date(latestUpdate.createdAt).toLocaleString()
                          : new Date(item.createdAt).toLocaleString()}
                      </p>
                    </td>
                    <td className="min-w-[220px] px-4 py-3">
                      <AdminUpdateControls
                        submissionId={item.id}
                        currentStatus={item.status}
                        currentPriority={item.priority}
                        currentAssignedTo={item.assignedTo}
                      />
                    </td>
                  </tr>
                );
              })}
              {submissionsPage.items.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-[var(--color-muted)]"
                  >
                    No submissions available for the current filter.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <Link
            href={prevHref}
            aria-disabled={!hasPrevPage}
            className={`rounded-full border px-4 py-2 transition ${
              hasPrevPage
                ? "border-[var(--color-border)] text-[var(--color-navy)] hover:bg-[var(--color-bg)]"
                : "pointer-events-none border-[var(--color-border)] text-[var(--color-muted)] opacity-50"
            }`}
          >
            Previous
          </Link>
          <span className="text-[var(--color-muted)]">
            Page {submissionsPage.page} of {submissionsPage.totalPages}
          </span>
          <Link
            href={nextHref}
            aria-disabled={!hasNextPage}
            className={`rounded-full border px-4 py-2 transition ${
              hasNextPage
                ? "border-[var(--color-border)] text-[var(--color-navy)] hover:bg-[var(--color-bg)]"
                : "pointer-events-none border-[var(--color-border)] text-[var(--color-muted)] opacity-50"
            }`}
          >
            Next
          </Link>
        </div>

        <div id="payments" className="mt-10">
          <h2 className="text-2xl text-[var(--color-navy)]">Recent Payments</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Total orders: {paymentMetrics.totalOrders}. Failed orders: {paymentMetrics.failedOrders}.
          </p>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white text-left text-sm">
              <thead className="bg-[var(--color-bg)]">
                <tr className="[&>th]:font-semibold">
                  <th className="px-4 py-3 text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
                    Order
                  </th>
                  <th className="px-4 py-3 text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
                    Plan
                  </th>
                  <th className="px-4 py-3 text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-t border-[var(--color-border)] align-top"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-[var(--color-muted)]">
                      {payment.razorpayOrderId}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-navy)]">{payment.planName}</td>
                    <td className="px-4 py-3 text-[var(--color-navy)]">
                      {formatInr(payment.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                          payment.status === "paid"
                            ? "bg-[color:color-mix(in_srgb,var(--color-green)_12%,white)] text-[var(--color-green)]"
                            : payment.status === "failed"
                              ? "bg-[color:color-mix(in_srgb,var(--color-red)_12%,white)] text-[var(--color-red)]"
                              : "bg-[var(--color-bg)] text-[var(--color-muted)]"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--color-muted)]">
                      {new Date(payment.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {recentPayments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-sm text-[var(--color-muted)]"
                    >
                      No payment orders yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── CMS Content Management ── */}
        <div id="content-cms">
          <AdminCmsManager />
        </div>
      </div>
    </section>
  );
}
