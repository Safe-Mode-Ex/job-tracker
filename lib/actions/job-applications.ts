'use server';

import { getSession } from "../auth/auth";
import connectDB from "../db";
import { Board, Column, JobApplication } from "../models";

const ErrorMessage = {
  Unauthorized: 'Unauthorized',
  Required: 'Missing required fields',
  BoardNotFound: 'Board not found',
  ColumnNotFound: 'Column not found',
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
    tags: tags ?? [],
    status: 'applied',
    order: maxOrder ? maxOrder?.order + 1 : 0,
  });

  await Column.findByIdAndUpdate(columnId, {
    $push: { jobApplications: jobApplication._id },
  });

  return { data: jobApplication };
}
