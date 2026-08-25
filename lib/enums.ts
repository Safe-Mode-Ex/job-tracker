export const ApiRoute = {
  Dashboard: '/dashboard',
  SignIn: '/sign-in',
  SignUp: '/sign-up',
} as const;

export const ErrorMessage = {
  SignIn: 'Failed to sign in',
  SignUp: 'Failed to sign up',
  MoveJob: 'Failed to move job application',
  CreateJob: 'Failed to create job',
  UpdateJob: 'Failed to update job',
  DeleteJob: 'Failed to delete job',
} as const;

export const DialogMode = {
  Edit: 'edit',
  Create: 'create',
} as const;
