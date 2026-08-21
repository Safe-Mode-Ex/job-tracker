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
} as const;
