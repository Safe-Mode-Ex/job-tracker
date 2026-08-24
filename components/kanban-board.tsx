"use client";

import { Award, Calendar, CheckCircle2, Mic, XCircle } from "lucide-react";
import { closestCorners, DndContext, DragOverlay } from "@dnd-kit/core";
import { Board } from "@/lib/models/models.types";
import { ColumnConfig } from "@/lib/types";
import DropableColumn from "./dropable-column";
import JobApplicationCard from "./job-application-card";
import useBoardDnd from "@/hooks/use-board-dnd/use-board-dnd";

interface KanbanBoardProps {
  board: Board;
}

const COLUMN_ICON_CLASSNAME = 'h-4 w-4';
const DEFAULT_COLUMN_CONFIG = {
  color: 'bg-gray-500',
  icon: <Calendar className={COLUMN_ICON_CLASSNAME} />,
};

const COLUMN_CONFIG: Record<string, ColumnConfig> = {
  'Wish List': {
    color: 'bg-cyan-500',
    icon: <Calendar className={COLUMN_ICON_CLASSNAME} />,
  },
  'Applied': {
    color: 'bg-purple-500',
    icon: <CheckCircle2 className={COLUMN_ICON_CLASSNAME} />,
  },
  'Interviewing': {
    color: 'bg-green-500',
    icon: <Mic className={COLUMN_ICON_CLASSNAME} />,
  },
  'Offer': {
    color: 'bg-yellow-500',
    icon: <Award className={COLUMN_ICON_CLASSNAME} />,
  },
  'Rejected': {
    color: 'bg-red-500',
    icon: <XCircle className={COLUMN_ICON_CLASSNAME} />,
  },
};

export default function KanbanBoard({ board }: KanbanBoardProps) {
  const {
    activeId,
    sortedColumns,
    sensors,
    handleDragStart,
    handleDragEnd,
  } = useBoardDnd(board);

  const activeJob = sortedColumns
    .flatMap(({ jobApplications }) => jobApplications ?? [])
    .find(({_id}) => _id === activeId);

  return (
    <DndContext
      id={board._id}
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {sortedColumns.map((col) => {
            const config = COLUMN_CONFIG[col.name] || DEFAULT_COLUMN_CONFIG;
            return (
              <DropableColumn
                key={col._id}
                column={col}
                config={config}
                boardId={board._id}
                sortedColumns={sortedColumns}
              />
            );
          })}
        </div>
      </div>

      <DragOverlay>
        {activeJob ? (
          <div className="opacity-50">
            <JobApplicationCard job={activeJob} columns={sortedColumns} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
