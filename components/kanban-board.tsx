"use client";

import { Award, Calendar, CheckCircle2, Mic, XCircle } from "lucide-react";
import { Board } from "@/lib/models/models.types";
import { ColumnConfig } from "@/lib/types";
import DropableColumn from "./dropable-column";
import { sortByOrder } from "@/lib/utils";

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
  const columns = board.columns;
  const sortedColumns = sortByOrder(columns)

  return (
    <>
      <div>
        <div>
          {columns.map((col, key) => {
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
    </>
  );
}
