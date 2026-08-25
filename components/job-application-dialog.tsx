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

  const [formData, handleFormFieldChange, handleSubmit] = useJobForm({
    mode,
    columnId,
    boardId,
    setOpen,
    job: mode === DialogMode.Edit ? props.job : undefined,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {mode === 'create' && props.trigger && (
        <DialogTrigger render={props.trigger} />
      )}

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Job Application' : 'Add Job Application'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit'
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
                  required
                  value={formData.company}
                  onChange={handleFormFieldChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  required
                  value={formData.position}
                  onChange={handleFormFieldChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={handleFormFieldChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  placeholder="e.g., $100k - $150k"
                  value={formData.salary}
                  onChange={handleFormFieldChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobUrl">Job URL</Label>
              <Input
                id="jobUrl"
                placeholder="htttps://..."
                value={formData.jobUrl}
                onChange={handleFormFieldChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                placeholder="React, Tailwind, High Pay"
                value={formData.tags}
                onChange={handleFormFieldChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Brief description of the role"
                value={formData.description}
                onChange={handleFormFieldChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                rows={4}
                value={formData.notes}
                onChange={handleFormFieldChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'edit' ? 'Save Changes' : 'Add Application'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
