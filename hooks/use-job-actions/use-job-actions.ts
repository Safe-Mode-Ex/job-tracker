"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateJobApplication } from "@/lib/actions/job-applications";

export function useJobActions(deleteJob?: (id: string) => void) {
  const [isMoving, setIsMoving] = useState(false);

  function handleDelete(id: string) {
    if (!deleteJob) return;
    deleteJob(id);
    toast.success("Application deleted");
  }

  async function handleMove(id: string, columnId: string) {
    setIsMoving(true);
    try {
      const res = await updateJobApplication(id, { columnId });
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Moved");
      }
    } finally {
      setIsMoving(false);
    }
  }

  return { handleDelete, handleMove, isMoving };
}
