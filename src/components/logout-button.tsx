"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      className="rounded-full border border-[var(--color-border)] px-4 py-2 text-xs font-semibold text-[var(--color-navy)]"
      onClick={() =>
        startTransition(async () => {
          await fetch("/api/auth/logout", { method: "POST" });
          router.push("/");
          router.refresh();
        })
      }
    >
      {isPending ? "Signing out..." : "Logout"}
    </button>
  );
}
