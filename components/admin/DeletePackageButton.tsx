"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deletePackage } from "@/app/(admin)/admin/packages/actions";

export function DeletePackageButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2 text-xs">
        <span className="text-ink-soft">Delete?</span>
        <button
          onClick={() =>
            startTransition(async () => {
              await deletePackage(id);
            })
          }
          className="font-medium text-ember hover:underline"
        >
          {pending ? <Loader2 size={14} className="animate-spin" /> : "Yes"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-ink-soft hover:underline"
        >
          No
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      aria-label={`Delete ${title}`}
      className="inline-flex items-center gap-1 text-ink-soft transition-colors hover:text-ember"
    >
      <Trash2 size={16} />
    </button>
  );
}
