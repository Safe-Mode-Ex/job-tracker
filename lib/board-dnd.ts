import { Column } from "@/lib/models/models.types";
import { DragEndEvent } from "@dnd-kit/core";

interface DropTarget {
  targetColumnId: string;
  newOrder: number;
}

export function resolveDropTarget(
  active: DragEndEvent["active"],
  over: DragEndEvent["over"],
  columns: Column[],
): DropTarget | null {
  if (!over) {
    return null;
  }

  const activeData = active.data.current;
  const overData = over.data.current;

  const draggedColumnId = activeData?.job?.columnId;
  const draggedId = active.id.toString();

  if (!draggedColumnId) {
    return null;
  }

  const sortedColumnJobs = (columnId: string) =>
    (columns
      .find(({ _id }) => _id === columnId)
      ?.jobApplications ?? [])
      .filter(({ _id }) => _id !== draggedId)
      .sort((prev, next) => prev.order - next.order);

  if (overData?.type === "column") {
    const targetColumnId = overData.columnId;

    if (!columns.some(({ _id }) => _id === targetColumnId)) {
      return null;
    }

    return {
      targetColumnId,
      newOrder: sortedColumnJobs(targetColumnId).length,
    };
  }

  if (overData?.type === "job") {
    const targetColumnId = overData.job?.columnId;

    if (!targetColumnId) {
      return null;
    }

    const remaining = sortedColumnJobs(targetColumnId);
    const overJobId = over.id.toString();
    const overIndex = remaining.findIndex(({ _id }) => _id === overJobId);

    if (overIndex === -1) {
      return {
        targetColumnId,
        newOrder: remaining.length,
      };
    }

    const targetColumn = columns.find(({ _id }) => _id === targetColumnId);
    const draggedOriginalIndex = targetColumn?.jobApplications.findIndex(
      ({ _id }) => _id === draggedId,
    );
    const overOriginalIndex = targetColumn?.jobApplications.findIndex(
      ({ _id }) => _id === overJobId,
    );

    const isSameColumn =
      draggedColumnId === targetColumnId &&
      draggedOriginalIndex !== undefined &&
      overOriginalIndex !== undefined &&
      draggedOriginalIndex < overOriginalIndex;

    return {
      targetColumnId,
      newOrder: isSameColumn ? overIndex + 1 : overIndex,
    };
  }

  return null;
}
