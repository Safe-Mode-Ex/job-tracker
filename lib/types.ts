import { ReactElement, ReactNode } from "react";
import { JobApplication } from "./models/models.types";
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
    }
  | {
      mode: typeof DialogMode.Edit;
      job: JobApplication;
      open: boolean;
      onOpenChange: (open: boolean) => void;
      trigger?: never;
      columnId?: never;
      boardId?: never;
    };

export interface ColumnConfig {
  color: string;
  icon: ReactNode;
}
