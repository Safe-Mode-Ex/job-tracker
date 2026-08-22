"use client";

import { HTMLAttributes, useState } from "react";
import { Edit2, ExternalLink, MoreVertical, Trash2 } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Column, JobApplication } from "@/lib/models/models.types";
import { ErrorMessage } from "@/lib/enums";
import { deleteJobApplication, updateJobApplication } from "@/lib/actions/job-applications";
import EditJobApplicationDialog from "./edit-job-application-dialog";

interface JobApplicationCardProps {
  job: JobApplication;
  columns: Column[];
  dragHandleProps?: HTMLAttributes<HTMLElement>;
}

export default function JobApplicationCard({
  job,
  columns,
  dragHandleProps,
}: JobApplicationCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  async function handleDelete() {
    try {
      const result = await deleteJobApplication(job._id);
    } catch (error) {
      console.error(ErrorMessage.DeleteJob, error);
    }
  }

  async function handleMove(newColumnId: string) {
    try {
      const result = await updateJobApplication(job._id, {
        columnId: newColumnId,
      })
    } catch (error) {
      console.error(ErrorMessage.MoveJob, error);
    }
  }

  return (
    <>
      <Card
        className="cursot-pointer transition-shadow hover:shadow-2xl"
        {...dragHandleProps}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-1">{job.position}</h3>
              <p className="text-xs text-muted-foreground mb-2">{job.company}</p>
              {job.description && (
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">job.description</p>
              )}

              {job.tags?.length && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    >{tag}</span>
                  ))}
                </div>
              )}

              {job.jobUrl && (
                <a
                  target="_blank"
                  href={job.jobUrl}
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            <div className="flex items-start gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                } />

                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>

                  {columns.length > 1 && (
                    <>
                      {columns.filter(({ _id }) => _id !== job.columnId).map(({name, _id}) => (
                        <DropdownMenuItem
                          key={_id}
                          onClick={() => handleMove(_id)}
                        >
                          Move to {name}
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}

                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleDelete()}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditJobApplicationDialog job={job} isEditing={isEditing} setIsEditing={setIsEditing} />
    </>
  );
}
