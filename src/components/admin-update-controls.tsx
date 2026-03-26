"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import type { SubmissionPriority, SubmissionStatus } from "@/lib/domain-types";

type Props = {
  submissionId: string;
  currentStatus: SubmissionStatus;
  currentPriority: SubmissionPriority;
  currentAssignedTo?: string;
};

export function AdminUpdateControls({
  submissionId,
  currentStatus,
  currentPriority,
  currentAssignedTo,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<SubmissionStatus>(currentStatus);
  const [priority, setPriority] = useState<SubmissionPriority>(currentPriority);
  const [assignedTo, setAssignedTo] = useState(currentAssignedTo ?? "");
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectClass =
    "rounded-lg border border-[var(--color-border)] bg-white px-2 py-1.5 text-xs outline-none transition focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]/20";

  const onSave = () => {
    setError(null);
    startTransition(async () => {
      const response = await fetch(`/api/submissions/${submissionId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          priority,
          assignedTo: assignedTo.trim(),
          note: note.trim(),
        }),
      });
      if (!response.ok) {
        const result = (await response.json().catch(() => ({}))) as { message?: string };
        setError(result.message ?? "Unable to save update.");
        return;
      }

      setNote("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <select
          value={status}
          disabled={isPending}
          className={selectClass}
          onChange={(event) => setStatus(event.target.value as SubmissionStatus)}
        >
          <option value="new">New</option>
          <option value="in_review">In Review</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          value={priority}
          disabled={isPending}
          className={selectClass}
          onChange={(event) => setPriority(event.target.value as SubmissionPriority)}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>

      <input
        value={assignedTo}
        onChange={(event) => setAssignedTo(event.target.value)}
        disabled={isPending}
        placeholder="Assignee"
        className={`w-full ${selectClass}`}
      />

      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        disabled={isPending}
        placeholder="Internal update note"
        rows={2}
        className={`w-full ${selectClass}`}
      />

      <button
        type="button"
        disabled={isPending}
        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-navy)] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[var(--color-navy-light)] disabled:opacity-70"
        onClick={onSave}
      >
        {isPending ? (
          <>
            <Loader2 size={12} className="animate-spin" />
            Saving...
          </>
        ) : (
          "Save"
        )}
      </button>

      <AnimatePresence>
        {saved && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1 text-xs font-medium text-[var(--color-green)]"
          >
            <Check size={12} /> Saved successfully
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-[var(--color-red)]"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
