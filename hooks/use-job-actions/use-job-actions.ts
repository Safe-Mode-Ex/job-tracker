"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateJobApplication } from "@/lib/actions/job-applications";

export function useJobActions(deleteJob?: (id: string) => void) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    if (!deleteJob) return;
    startTransition(() => {
      deleteJob(id);
      toast.success("Application deleted");
    });
  }

  function handleMove(id: string, columnId: string) {
    startTransition(async () => {
      const res = await updateJobApplication(id, { columnId });
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Moved");
      }
    });
  }

  return { handleDelete, handleMove, isPending };
}
