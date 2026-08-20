import connectDB from "@/lib/db";
import { Board } from "@/lib/models";
import { BOARD_NAME } from "@/lib/const";

export async function getBoard(userId: string) {
  "use cache";

  await connectDB();

  const boardDoc = await Board.findOne({
    userId,
    name: BOARD_NAME,
  }).populate({
    path: 'columns',
    populate: {
      path: 'jobApplications',
    },
  });

  return boardDoc ? JSON.parse(JSON.stringify(boardDoc)) : null;
}
