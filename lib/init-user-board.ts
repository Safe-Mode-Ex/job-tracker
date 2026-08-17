import connectDB from "./db";
import { Board, Column } from './models';

const BOARD_NAME = 'Job Hunt';
const DEFAULT_COLUMNS = [
  { name: 'Wish List', order: 0 },
  { name: 'Applied', order: 1 },
  { name: 'Interviewing', order: 2 },
  { name: 'Offer', order: 3 },
  { name: 'Rejected', order: 4 },
];

export async function initializeUserBoard(userId: string) {
  try {
    await connectDB();

    const existingBoard = await Board.findOne({ userId, name: BOARD_NAME});

    if (existingBoard) {
      return existingBoard;
    }

    const board = await Board.create({
      userId,
      name: BOARD_NAME,
      columns: [],
    });

    const columns = await Promise.all(DEFAULT_COLUMNS.map(
      ({ name, order }) => Column.create({
        name,
        order,
        boardId: board._id,
        jobApplication: [],
      })
    ));

    board.columns = columns.map(({ _id }) => _id);
    await board.save();

    return board;
  } catch (error) {
    throw error;
  }
}
