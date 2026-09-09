import { ReactElement, ReactNode } from "react";
import { JobApplication } from "./models/models.types";
import { JobApplicationData } from "./actions/job-applications";
import { DialogMode } from "./enums";

export type SignInPayload = { email: string, password: string };
export type SignUpPayload = SignInPayload & { name: string };
export type JobDialogMode = typeof DialogMode[keyof typeof DialogMode];

export type JobApplicationDialogProps =
  | {
      mode: typeof DialogMode.Create;
      columnId: string;
      boardId: string;
      trigger?: ReactElement;
      open?: boolean;
      onOpenChange?: (open: boolean) => void;
      createJob?: (data: JobApplicationData) => Promise<{ data?: JobApplication; error?: string }>;
      updateJob?: never;
    }
  | {
      mode: typeof DialogMode.Edit;
      job: JobApplication;
      open: boolean;
      onOpenChange: (open: boolean) => void;
      trigger?: never;
      columnId?: never;
      boardId?: never;
      createJob?: never;
      updateJob?: (id: string, updates: Record<string, unknown>) => Promise<{ data?: JobApplication; error?: string }>;
    };

export interface ColumnConfig {
  color: string;
  icon: ReactNode;
}
