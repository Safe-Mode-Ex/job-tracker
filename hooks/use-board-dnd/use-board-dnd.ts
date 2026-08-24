import { useState } from "react";
import {
  useSensors,
  useSensor,
  PointerSensor,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { sortByOrder } from "@/lib/utils";
import { resolveDropTarget } from "@/lib/board-dnd";
import { Board } from "@/lib/models/models.types";
import { useBoard } from "../use-board/use-board";

export default function useBoardDnd(board: Board) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const { columns, moveJob } = useBoard(board);
  const sortedColumns = sortByOrder(columns);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  async function handleDragStart(evt: DragStartEvent) {
    setActiveId(evt.active.id.toString());
  }

  async function handleDragEnd(evt: DragEndEvent) {
    const { active, over } = evt;

    setActiveId(null);

    if (!over || !board._id) {
      return;
    }

    const target = resolveDropTarget(active, over, sortedColumns);

    if (!target) {
      return;
    }

    await moveJob(active.id.toString(), target.targetColumnId, target.newOrder);
  }

  return {
    activeId,
    sortedColumns,
    sensors,
    handleDragStart,
    handleDragEnd,
  };
}
