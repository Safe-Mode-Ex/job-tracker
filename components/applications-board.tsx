import { getSession } from "@/lib/auth/auth";
import { getBoard } from "@/lib/board";
import KanbanBoard from "@/components/kanban-board";

export default async function ApplicationsBoard() {
  const session = await getSession();
  const board = await getBoard(session?.user.id ?? '');

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">{board.name}</h1>
          <p className="text-gray-600">Track your job applications</p>
        </div>

        <KanbanBoard board={board} userId={session!.user.id} />
      </div>
    </div>
  );
}
