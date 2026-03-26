import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getCurrentSession } from "@/lib/session";
import { listSubmissionsByUser } from "@/lib/store";
import { LogoutButton } from "@/components/logout-button";

export const metadata: Metadata = {
  title: "User Dashboard",
  description: "Track your VisaGuru submissions and case progress.",
};

type PageProps = {
  searchParams: Promise<{ payment?: string }>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  noStore();
  const session = await getCurrentSession();
  if (!session) {
    redirect("/login");
  }
  if (session.role === "admin") {
    redirect("/admin/dashboard");
  }

  const params = await searchParams;
  const submissions = await listSubmissionsByUser(session.userId);

  return (
    <section className="section-padding">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl text-[var(--color-navy)]">Welcome, {session.name}</h1>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Track case progress, status changes, and team updates in real-time.
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="surface-card rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
              Total submissions
            </p>
            <p className="mt-2 text-3xl font-semibold text-[var(--color-navy)]">
              {submissions.length}
            </p>
          </article>
          <article className="surface-card rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
              Active in review
            </p>
            <p className="mt-2 text-3xl font-semibold text-[var(--color-navy)]">
              {submissions.filter((item) => item.status === "in_review").length}
            </p>
          </article>
          <article className="surface-card rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
              Resolved
            </p>
            <p className="mt-2 text-3xl font-semibold text-[var(--color-navy)]">
              {submissions.filter((item) => item.status === "resolved").length}
            </p>
          </article>
        </div>

        {params.payment === "success" ? (
          <p className="mt-6 rounded-2xl border border-[var(--color-green)]/40 bg-[color:color-mix(in_srgb,var(--color-green)_10%,white)] px-4 py-3 text-sm text-[var(--color-navy)]">
            Payment verified successfully. Your case onboarding will begin shortly.
          </p>
        ) : null}
        {params.payment === "test" ? (
          <p className="mt-6 rounded-2xl border border-[var(--color-gold)]/40 bg-[color:color-mix(in_srgb,var(--color-gold)_12%,white)] px-4 py-3 text-sm text-[var(--color-navy)]">
            Local test mode checkout completed. Configure Razorpay keys to run live payments.
          </p>
        ) : null}

        <div className="mt-8 space-y-4">
          {submissions.length === 0 ? (
            <p className="surface-card rounded-2xl p-5 text-sm text-[var(--color-muted)]">
              No submissions yet. Submit a refusal letter from the homepage to
              start tracking progress.
            </p>
          ) : (
            submissions
              .slice()
              .reverse()
              .map((item) => (
                <article key={item.id} className="surface-card rounded-2xl p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-navy)]">
                        {item.visaType} case - {item.email}
                      </p>
                      <p className="text-xs text-[var(--color-muted)]">
                        Submitted on {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`badge-${item.status} rounded-full px-3 py-1 text-xs font-semibold uppercase`}>
                        {item.status.replace("_", " ")}
                      </span>
                      <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-semibold uppercase text-[var(--color-muted)]">
                        {item.priority}
                      </span>
                    </div>
                  </div>

                  {item.message ? (
                    <p className="mt-3 text-sm text-[var(--color-muted)]">{item.message}</p>
                  ) : null}

                  <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
                      Progress Timeline
                    </p>
                    <div className="mt-3 space-y-3">
                      {item.updates
                        .slice()
                        .reverse()
                        .map((update) => (
                          <div key={update.id} className="flex gap-3">
                            <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--color-gold)]" />
                            <div>
                              <p className="text-sm text-[var(--color-navy)]">{update.note}</p>
                              <p className="text-xs text-[var(--color-muted)]">
                                {new Date(update.createdAt).toLocaleString()} by{" "}
                                {update.actorName}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </article>
              ))
          )}
        </div>
      </div>
    </section>
  );
}
