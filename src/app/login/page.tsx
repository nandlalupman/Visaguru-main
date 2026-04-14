import { unstable_noStore as noStore } from "next/cache";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCurrentSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Log in to your VisaGuru account with password or email OTP.",
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

function sanitizeNextPath(value?: string) {
  if (!value) return undefined;
  if (!value.startsWith("/") || value.startsWith("//")) return undefined;
  return value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  noStore();
  const params = await searchParams;
  const nextPath = sanitizeNextPath(params.next);
  const session = await getCurrentSession();
  if (session?.role === "admin") {
    redirect(nextPath ?? "/admin/dashboard");
  }
  if (session?.role === "user") {
    redirect(nextPath ?? "/dashboard");
  }

  return (
    <section className="section-padding">
      <div className="mx-auto w-full max-w-md px-4 md:px-0">
        <h1 className="text-4xl text-[var(--color-navy)]">Login</h1>
        <p className="mt-3 text-sm text-[var(--color-muted)]">
          Use one login for all accounts. You will be sent to the correct
          dashboard automatically.
        </p>
        <div className="mt-6">
          <AuthForm mode="login" nextPath={nextPath} />
        </div>
      </div>
    </section>
  );
}
