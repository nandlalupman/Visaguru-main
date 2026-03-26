import { unstable_noStore as noStore } from "next/cache";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCurrentSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a VisaGuru account to manage your visa recovery requests.",
};

type SignupPageProps = {
  searchParams: Promise<{ next?: string }>;
};

function sanitizeNextPath(value?: string) {
  if (!value) return undefined;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/admin")) {
    return undefined;
  }
  return value;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  noStore();
  const params = await searchParams;
  const nextPath = sanitizeNextPath(params.next);
  const session = await getCurrentSession();
  if (session?.role === "admin") {
    redirect("/admin/dashboard");
  }
  if (session?.role === "user") {
    redirect(nextPath ?? "/dashboard");
  }

  return (
    <section className="section-padding">
      <div className="mx-auto w-full max-w-md px-4 md:px-0">
        <h1 className="text-4xl text-[var(--color-navy)]">Create Account</h1>
        <p className="mt-3 text-sm text-[var(--color-muted)]">
          Save your details, submit refusal files, and track progress.
        </p>
        <div className="mt-6">
          <AuthForm mode="signup" nextPath={nextPath} />
        </div>
      </div>
    </section>
  );
}
