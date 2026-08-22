"use client";

import { useState } from "react";
import { Award, Calendar, CheckCircle2, Mic, XCircle } from "lucide-react";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Board, Column, JobApplication } from "@/lib/models/models.types";
import { ColumnConfig } from "@/lib/types";
import { sortByOrder } from "@/lib/utils";
import DropableColumn from "./dropable-column";
import { useBoard } from "@/hooks/use-board/use-board";
import JobApplicationCard from "./job-application-card";

interface KanbanBoardProps {
  board: Board;
  userId: string;
}

const COLUMN_ICON_CLASSNAME = 'h-4 w-4';
const DEFAULT_COLUMN_CONFIG = {
  color: 'bg-gray-500',
  icon: <Calendar className={COLUMN_ICON_CLASSNAME} />,
};

const COLUMN_CONFIG: Array<ColumnConfig> = [{
  color: 'bg-cyan-500',
  icon: <Calendar className={COLUMN_ICON_CLASSNAME} />,
}, {
  color: 'bg-purple-500',
  icon: <CheckCircle2 className={COLUMN_ICON_CLASSNAME} />,
}, {
  color: 'bg-green-500',
  icon: <Mic className={COLUMN_ICON_CLASSNAME} />,
}, {
  color: 'bg-yellow-500',
  icon: <Award className={COLUMN_ICON_CLASSNAME} />,
}, {
  color: 'bg-red-500',
  icon: <XCircle className={COLUMN_ICON_CLASSNAME} />,
}];

export default function KanbanBoard({ board, userId }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const { columns, moveJob } = useBoard(board);
  const sortedColumns = sortByOrder(columns)

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

  // TODO: strongly need to refactor
  async function handleDragEnd(evt: DragEndEvent) {
    const { active, over } = evt;

    setActiveId(null);

    if (!over || !board._id) {
      return;
    }

    const activeId = active.id.toString();
    const overId = over.id.toString();

    let draggedJob: JobApplication | null = null;
    let sourceColumn: Column | null = null;
    let sourceIndex = -1;

    for (const column of sortedColumns) {
      const jobs = column.jobApplications.sort(
        (prevJob, nextJob) => prevJob.order - nextJob.order
      ) || [];
      const jobIndex = jobs.findIndex(({ _id }) => _id === activeId);

      if (jobIndex !== -1) {
        draggedJob = jobs[jobIndex];
        sourceColumn = column;
        sourceIndex = jobIndex;
        break;
      }
    }

    if (!draggedJob || !sourceColumn) {
      return;
    }

    const targetColumn = sortedColumns.find(({ _id }) => _id == overId);
    const targetJob = sortedColumns
      .flatMap(({ jobApplications }) => jobApplications ?? [])
      .find(({ _id }) => _id === overId);

    let targetColumnId: string;
    let newOrder: number;

    if (targetColumn) {
      targetColumnId = targetColumn._id;

      const jobsInTarget = targetColumn.jobApplications
        .filter(({ _id }) => _id !== activeId)
        .sort(
          (prevJob, nextJob) => prevJob.order - nextJob.order
        ) || [];

      newOrder = jobsInTarget.length;
    } else if (targetJob) {
      const targetJobColumn = sortedColumns.find(({ jobApplications }) =>
        jobApplications.some(({ _id }) => _id === targetJob._id));
      targetColumnId = targetJob.columnId ?? targetJobColumn?._id ?? '';

      if (!targetColumnId) {
        return;
      }

      const targetColumnObj = sortedColumns.find(({ _id }) => _id === targetColumnId);

      if (!targetColumnObj) {
        return;
      }

      const allJobsInTargetOriginal = targetColumnObj.jobApplications.sort(
        (prevJob, nextJob) => prevJob.order - nextJob.order
      ) || [];

      const allJobsInTargetFiltered = allJobsInTargetOriginal.filter(
        ({ _id }) => _id !== activeId
      ) || [];

      const targetIndexInOriginal = allJobsInTargetOriginal.findIndex(
        ({ _id }) => _id === overId
      );

      const targetIndexInFiltered = allJobsInTargetFiltered.findIndex(
        ({ _id }) => _id === overId
      );

      if (targetIndexInFiltered !== -1) {
        if (sourceColumn._id === targetColumnId) {
          if (sourceIndex < targetIndexInOriginal) {
            newOrder = targetIndexInFiltered + 1;
          } else {
            newOrder = targetIndexInFiltered;
          }
        } else {
          newOrder = targetIndexInFiltered;
        }
      } else {
        newOrder = allJobsInTargetFiltered.length;
      }
    } else {
      return;
    }

    if (!targetColumnId) {
      return;
    }

    await moveJob(activeId, targetColumnId, newOrder);
  }

  const activeJob = sortedColumns
    .flatMap(({ jobApplications }) => jobApplications ?? [])
    .find(({_id}) => _id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {sortedColumns.map((col, key) => {
            const config = COLUMN_CONFIG[key] || DEFAULT_COLUMN_CONFIG;
            return (
              <DropableColumn
                key={key}
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
