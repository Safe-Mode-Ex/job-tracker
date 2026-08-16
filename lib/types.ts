export type SignInPayload = { email: string, password: string };
export type SignUpPayload = SignInPayload & { name: string };
