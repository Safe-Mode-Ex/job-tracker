import { Board, Column } from "@/lib/models/models.types";

export function useBoard(initialBoard?: Board | null) {
  const board = initialBoard;
  const columns: Column[] = board?.columns ?? [];
  const error = null;

  async function moveJob(
    jobApplicationId: string,
    newColumnId: string,
    newOrder: number,
  ) {

  }

  return {board, columns, error};
}
