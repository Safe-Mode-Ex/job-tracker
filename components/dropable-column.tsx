import { MoreVertical, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Column } from "@/lib/models/models.types";
import { ColumnConfig } from "@/lib/types";

interface DropableColumnProps {
  column: Column;
  config: ColumnConfig;
  boardId: string;
}

export default function DropableColumn({ column, config, boardId }: DropableColumnProps) {
  return (
    <Card className="min-w-75 flex-0 shadow-md p-0">
      <CardHeader className={`${config.color} text-white rounded-t-lg pb-3 pt-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {config.icon}
            <CardTitle className="text-white text-base font-semibold">
              {column.name}
            </CardTitle>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white hover:bg-white/20"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            } />

            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
    </Card>
  );
}
