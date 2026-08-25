"use client";

import { ChangeEvent, ReactElement, SubmitEvent, useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { JobApplication } from "@/lib/models/models.types";
import { createJobApplication, updateJobApplication } from "@/lib/actions/job-applications";
import { ErrorMessage } from "@/lib/enums";

type FormData = {
  company: string;
  position: string;
  location: string;
  notes: string;
  salary: string;
  jobUrl: string;
  tags: string;
  description: string;
};

const INITIAL_FORM_DATA: FormData = {
  company: '',
  position: '',
  location: '',
  notes: '',
  salary: '',
  jobUrl: '',
  tags: '',
  description: '',
};

const parseTags = (tags: string) =>
  tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

type JobApplicationDialogProps =
  | {
      mode: 'create';
      columnId: string;
      boardId: string;
      trigger?: ReactElement;
      open?: boolean;
      onOpenChange?: (open: boolean) => void;
    }
  | {
      mode: 'edit';
      job: JobApplication;
      open: boolean;
      onOpenChange: (open: boolean) => void;
      trigger?: never;
      columnId?: never;
      boardId?: never;
    };

export default function JobApplicationDialog(props: JobApplicationDialogProps) {
  const { mode } = props;

  const [isOpen, setIsOpen] = useState(false);
  const open = props.open ?? isOpen;
  const setOpen = props.onOpenChange ?? setIsOpen;

  const [formData, setFormData] = useState<FormData>(
    mode === 'edit'
      ? {
          company: props.job.company,
          position: props.job.position,
          location: props.job.location ?? '',
          notes: props.job.notes ?? '',
          salary: props.job.salary ?? '',
          jobUrl: props.job.jobUrl ?? '',
          tags: props.job.tags?.join(', ') ?? '',
          description: props.job.description ?? '',
        }
      : INITIAL_FORM_DATA,
  );

  const handleFormFieldChange = ({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({
      ...formData,
      [target.id]: target.value,
    });

  const handleSubmit = async (evt: SubmitEvent) => {
    evt.preventDefault();

    try {
      const tags = parseTags(formData.tags);

      const result =
        mode === 'create'
          ? await createJobApplication({
              ...formData,
              columnId: props.columnId,
              boardId: props.boardId,
              tags,
            })
          : await updateJobApplication(props.job._id, {
              ...formData,
              columnId: props.job.columnId,
              tags,
            });

      if (result.error) {
        console.error(
          mode === 'create' ? ErrorMessage.CreateJob : ErrorMessage.UpdateJob,
          result.error,
        );
        return;
      }

      setFormData(INITIAL_FORM_DATA);
      setOpen(false);
    } catch (error) {
      console.error(
        mode === 'create' ? ErrorMessage.CreateJob : ErrorMessage.UpdateJob,
        error,
      );
    }
  };

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
