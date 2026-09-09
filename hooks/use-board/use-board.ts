import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createJobApplication,
  deleteJobApplication,
  updateJobApplication,
  JobApplicationData,
} from "@/lib/actions/job-applications";
import { Board, Column, JobApplication } from "@/lib/models/models.types";
import { useState } from "react";

export function useBoard(initialBoard?: Board | null) {
  const [columns, setColumns] = useState<Column[]>(initialBoard?.columns ?? []);
  const board = initialBoard;
  const router = useRouter();
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
      await updateJobApplication(jobApplicationId, {
        columnId: newColumnId,
        order: newOrder,
      });
    } catch (error) {
      console.error("Error", error);
    }
  }

  function deleteJob(jobId: string) {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        jobApplications: col.jobApplications.filter((j) => j._id !== jobId),
      }))
    );

    deleteJobApplication(jobId).then((res) => {
      if (res?.error) {
        toast.error(res.error);
        router.refresh();
      }
    });
  }

  async function createJob(data: JobApplicationData) {
    const result = await createJobApplication(data);
    if (result.error) {
      return { error: result.error };
    }
    setColumns((prev) =>
      prev.map((col) => {
        if (col._id === data.columnId) {
          return {
            ...col,
            jobApplications: [...col.jobApplications, result.data],
          };
        }
        return col;
      })
    );
    return { data: result.data };
  }

  async function updateJob(id: string, updates: Parameters<typeof updateJobApplication>[1]) {
    const result = await updateJobApplication(id, updates);
    if (result.error) {
      return { error: result.error };
    }
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        jobApplications: col.jobApplications.map((j) =>
          j._id === id ? result.data : j
        ),
      }))
    );
    return { data: result.data };
  }

  return { board, columns, error, moveJob, deleteJob, createJob, updateJob };
}
