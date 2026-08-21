'use server';

import { revalidatePath } from "next/cache";
import { getSession } from "../auth/auth";
import connectDB from "../db";
import { Board, Column, JobApplication } from "../models";
import { ApiRoute } from "../enums";

const ErrorMessage = {
  Unauthorized: 'Unauthorized',
  Required: 'Missing required fields',
  BoardNotFound: 'Board not found',
  ColumnNotFound: 'Column not found',
  JobNotFound: 'Job application not found',
} as const;

export interface JobApplicationData {
  company: string;
  position: string;
  location?: string;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  columnId: string;
  boardId: string;
  tags?: string[];
  description?: string;
}

export async function createJobApplication(data: JobApplicationData) {
  const session = await getSession();

  if (!session?.user) {
    return { error: ErrorMessage.Unauthorized };
  }

  await connectDB();

  const {
    company,
    position,
    columnId,
    boardId,
    tags,
  } = data;

  if (!company || !position || !columnId || !boardId) {
    return { error: ErrorMessage.Required };
  }

  const board = await Board.findOne({
    _id: boardId,
    userId: session.user.id,
  });

  if (!board) {
    return { error: ErrorMessage.BoardNotFound };
  }

  const column = await Column.findOne({
    _id: columnId,
    boardId,
  });

  if (!column) {
    return { error: ErrorMessage.ColumnNotFound };
  }

  const maxOrder = (
    await JobApplication
      .findOne({ columnId })
      .sort({ order: -1 })
      .select('order').lean() as { order: number } | null
  );

  const jobApplication = await JobApplication.create({
    ...data,
    userId: session.user.id,
    tags: tags ?? [],
    status: 'applied',
    order: maxOrder ? maxOrder?.order + 1 : 0,
  });

  await Column.findByIdAndUpdate(columnId, {
    $push: { jobApplications: jobApplication._id },
  });

  revalidatePath(ApiRoute.Dashboard);

  return { data: JSON.parse(JSON.stringify(jobApplication)) };
}

export async function updateJobApplication(
  id: string,
  updates: {
    company?: string;
    position?: string;
    location?: string;
    notes?: string;
    salary?: string;
    jobUrl?: string;
    columnId?: string;
    order?: number;
    tags?: string[];
    description?: string;
  },
) {
  const session = await getSession();

  if (!session?.user) {
    return { error: ErrorMessage.Unauthorized };
  }

  const jobApplication = await JobApplication.findById(id)

  if (!jobApplication) {
    return { error: ErrorMessage.JobNotFound };
  }

  if (jobApplication?.userId !== session.user.id) {
    return { error: ErrorMessage.Unauthorized };
  }

  const { columnId, order, ...otherUpdates } = updates;


  const updatesToApply: Partial<{
    company: string;
    position: string;
    location?: string;
    notes?: string;
    salary?: string;
    jobUrl?: string;
    columnId: string;
    order?: number;
    tags?: string[];
    description?: string;
  }> = otherUpdates;

  const currentColumnId = jobApplication.columnId.toString();
  const newColumnId = columnId?.toString();

  const isMovingToDifferentColumn = newColumnId !== currentColumnId;

  if (isMovingToDifferentColumn) {
    await Column.findByIdAndUpdate(currentColumnId, {
      $pull: { jobApplications: id },
    });

    const jobsInTargetColumn = await JobApplication.find({
      columnId: newColumnId,
      _id: {$ne: id},
    })
      .sort({ order: 1 })
      .lean();

    let newOrderValue: number;

    if (order) {
      newOrderValue = order * 100;

      const jobsThatNeedToShift = jobsInTargetColumn.slice(order);

      for (const job of jobsThatNeedToShift) {
        await JobApplication.findByIdAndUpdate(job._id, {
          $set: {order: job.order + 100},
        });
      }
    } else {
      if (jobsInTargetColumn.length) {
        const lastJobOrder = jobsInTargetColumn[jobsInTargetColumn.length - 1].order || 0;
        newOrderValue = lastJobOrder + 100;
      } else {
        newOrderValue = 0;
      }
    }

    updatesToApply.columnId = newColumnId;
    updatesToApply.order = newOrderValue;

    await Column.findByIdAndUpdate(newColumnId, {
      $push: { jobApplications: id },
    });
  } else if (order) {
    const otherJobsInColumn = await JobApplication.find({
      columnId: currentColumnId,
      _id: {$ne: id},
    })
      .sort({ order: 1 })
      .lean();

    const currentJobOrder = jobApplication.order || 0;
    const currentPositionIndex = otherJobsInColumn.findIndex(
      (job) => job.order > currentJobOrder
    );
    const oldPositionIndex = currentPositionIndex === -1 ?
      otherJobsInColumn.length :
      currentPositionIndex;

    const newOrderValue = order * 100;

    if (order < oldPositionIndex) {
      const jobsToShiftDown = otherJobsInColumn.slice(order, oldPositionIndex);

      for (const job of jobsToShiftDown) {
        await JobApplication.findByIdAndUpdate(job._id, {
          $set: { order: job.order + 100 },
        });
      }
    } else if (order > oldPositionIndex) {
      const jobsToShiftUp = otherJobsInColumn.slice(oldPositionIndex, order);

      for (const job of jobsToShiftUp) {
        const newOrder = Math.max(0, job.order - 100);
        await JobApplication.findByIdAndUpdate(job._id, {
          $set: { order: newOrder },
        });
      }
    }

    updatesToApply.order = newOrderValue;
  }

  const updated = await JobApplication.findByIdAndUpdate(id, updatesToApply, { new: true });

  revalidatePath(ApiRoute.Dashboard);

  return {data: JSON.parse(JSON.stringify(updated))}
}

export async function deleteJobApplication(id: string) {
  const session = await getSession();

  if (!session?.user) {
    return { error: ErrorMessage.Unauthorized };
  }

  const jobApplication = await JobApplication.findById(id);

  if (!jobApplication) {
    return { error: ErrorMessage.JobNotFound };
  }

  if (jobApplication.userId !== session.user.id) {
    return { error: ErrorMessage.Unauthorized };
  }

  await Column.findByIdAndUpdate(jobApplication.columnId, {
    $pull: { jobApplications: id },
  })

  await JobApplication.deleteOne({ _id: id });
  revalidatePath(ApiRoute.Dashboard);

  return { success: true };
}
