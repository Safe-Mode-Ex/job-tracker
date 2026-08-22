import { updateJobApplication } from "@/lib/actions/job-applications";
import { Board, Column, JobApplication } from "@/lib/models/models.types";
import { useState } from "react";

export function useBoard(initialBoard?: Board | null) {
  const [columns, setColumns] = useState<Column[]>(initialBoard?.columns ?? [])
  const board = initialBoard;
  const error = null;

  async function moveJob(
    jobApplicationId: string,
    newColumnId: string,
    newOrder: number,
  ) {
    setColumns((prev) => {
      const newColumns = prev.map((column) => ({
        ...column,
        jobApplications: [...column.jobApplications],
      }));

      let jobToMove: JobApplication | null = null;
      let oldColumnId: string | null = null;

      for (const column of newColumns) {
        const jobIndex = column.jobApplications.findIndex(({ _id }) => _id === jobApplicationId);

        if (jobIndex !== undefined && jobIndex !== -1) {
          jobToMove = column.jobApplications[jobIndex];
          oldColumnId = column._id;
          column.jobApplications = column.jobApplications.filter(
            ({ _id }) => _id !== jobApplicationId
          );
        }
      }

      if (jobToMove && oldColumnId) {
        const targetColumnIndex = newColumns.findIndex(
          ({ _id }) => _id === newColumnId
        );

        if (targetColumnIndex !== -1) {
          const targetColumn = newColumns[targetColumnIndex];
          const currentJobs = targetColumn.jobApplications ?? [];
          const updatedJobs = [...currentJobs];

          updatedJobs.splice(newOrder, 0, {
            ...jobToMove,
            columnId: newColumnId,
            order: newOrder * 100,
          });

          const jobsWithUpdatedOrders = updatedJobs.map((job, index) => ({
            ...job,
            order: index * 100,
          }));

          newColumns[targetColumnIndex] = {
            ...targetColumn,
            jobApplications: jobsWithUpdatedOrders,
          };
        }
      }

      return newColumns;
    });

    try {
      const result = await updateJobApplication(jobApplicationId, {
        columnId: newColumnId,
        order: newOrder,
      });
    } catch (error) {
      console.error('Error', error);
    }
  }

  return {board, columns, error, moveJob};
}
