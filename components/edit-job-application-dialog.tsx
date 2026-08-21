"use client";

import { ChangeEvent, SubmitEvent, useState } from "react";
import { Button } from "./ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { JobApplication } from "@/lib/models/models.types";
import { updateJobApplication } from "@/lib/actions/job-applications";
import { ErrorMessage } from "@/lib/enums";

interface EditJobApplicationProps {
  job: JobApplication;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

export default function EditJobApplicationDialog({
  job,
  isEditing,
  setIsEditing,
}: EditJobApplicationProps) {
  const [formData, setFormData] = useState({
    company: job.company,
    position: job.position,
    location: job.location ?? '',
    notes: job.notes ?? '',
    salary: job.salary ?? '',
    jobUrl: job.jobUrl ?? '',
    columnId: job.columnId ?? '',
    tags: job.tags?.join(', ') ?? '',
    description: job.description ?? '',
  });

  async function handleUpdate(evt: SubmitEvent<HTMLFormElement>) {
    evt.preventDefault();

    try {
      const result = await updateJobApplication(job._id, {
        ...formData,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      });

      if (result.error) {
        return;
      }

      setIsEditing(false);
    } catch (error) {
      console.error(ErrorMessage.MoveJob, error);
    }
  }

  // TODO: take off into common with creation form hook
  const handleFormFieldChange =
    ({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFormData({
        ...formData,
        [target.id]: target.value,
    });

  return (
    <Dialog open={isEditing} onOpenChange={setIsEditing}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Job Application</DialogTitle>
          <DialogDescription>Track a new job application</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleUpdate}>
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
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
