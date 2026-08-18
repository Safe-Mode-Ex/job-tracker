import { ReactNode } from "react";

export type SignInPayload = { email: string, password: string };
export type SignUpPayload = SignInPayload & { name: string };

export interface ColumnConfig {
  color: string;
  icon: ReactNode;
}
