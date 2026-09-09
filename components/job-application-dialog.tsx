"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { JobApplicationDialogProps } from "@/lib/types";
import { DialogMode } from "@/lib/enums";
import useJobForm from "@/hooks/use-job-form/use-job-form";

export default function JobApplicationDialog(props: JobApplicationDialogProps) {
  const { mode, columnId = '', boardId = '' } = props;
  const [isOpen, setIsOpen] = useState(false);
  const open = props.open ?? isOpen;
  const setOpen = props.onOpenChange ?? setIsOpen;

  const { register, handleSubmit, formState } = useJobForm({
    mode,
    columnId,
    boardId,
    setOpen,
    job: mode === DialogMode.Edit ? props.job : undefined,
    createJob: props.mode === DialogMode.Create ? props.createJob : undefined,
    updateJob: props.mode === DialogMode.Edit ? props.updateJob : undefined,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {mode === DialogMode.Create && props.trigger && (
        <DialogTrigger render={props.trigger} />
      )}

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === DialogMode.Edit ? 'Edit Job Application' : 'Add Job Application'}
          </DialogTitle>
          <DialogDescription>
            {mode === DialogMode.Edit
              ? 'Update the details of your job application'
              : 'Track a new job application'}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  aria-invalid={!!formState.errors.company}
                  {...register("company")}
                />
                {formState.errors.company && (
                  <p className="text-sm text-destructive">
                    {formState.errors.company.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  aria-invalid={!!formState.errors.position}
                  {...register("position")}
                />
                {formState.errors.position && (
                  <p className="text-sm text-destructive">
                    {formState.errors.position.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  aria-invalid={!!formState.errors.location}
                  {...register("location")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  placeholder="e.g., $100k - $150k"
                  aria-invalid={!!formState.errors.salary}
                  {...register("salary")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobUrl">Job URL</Label>
              <Input
                id="jobUrl"
                placeholder="https://..."
                aria-invalid={!!formState.errors.jobUrl}
                {...register("jobUrl")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                placeholder="React, Tailwind, High Pay"
                aria-invalid={!!formState.errors.tags}
                {...register("tags")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Brief description of the role"
                aria-invalid={!!formState.errors.description}
                {...register("description")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                rows={4}
                aria-invalid={!!formState.errors.notes}
                {...register("notes")}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={formState.isSubmitting}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={formState.isSubmitting}>
              {formState.isSubmitting
                ? 'Saving...'
                : mode === DialogMode.Edit
                  ? 'Save Changes'
                  : 'Add Application'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
