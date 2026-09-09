"use client";

import { useState } from "react";
import { toast } from "sonner";

export function useJobActions(
  deleteJob?: (id: string) => void,
  moveJob?: (id: string, columnId: string, order: number) => Promise<void>,
) {
  const [isMoving, setIsMoving] = useState(false);

  function handleDelete(id: string) {
    if (!deleteJob) return;
    deleteJob(id);
    toast.success("Application deleted");
  }

  async function handleMove(id: string, columnId: string, order: number) {
    if (!moveJob) return;
    setIsMoving(true);
    try {
      await moveJob(id, columnId, order);
      toast.success("Moved");
    } finally {
      setIsMoving(false);
    }
  }

  return { handleDelete, handleMove, isMoving };
}
