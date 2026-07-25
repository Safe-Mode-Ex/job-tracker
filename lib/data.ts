import { Briefcase, CheckCircle2, TrendingUp } from "lucide-react";

export const TABS = [{
  title: 'Organize Aplications',
  image: '/hero-images/hero1.png',
}, {
  title: 'Get Hired',
  image: '/hero-images/hero2.png',
}, {
  title: 'Manage Boards',
  image: '/hero-images/hero3.png',
}]

export const FEATURES = [{
  title: 'Organize Applications',
  text: 'Create custom boards and columns to track your job applications at every stage of the process.',
  icon: Briefcase,
}, {
  title: 'Track Progress',
  text: 'Monitor your application status from applied to interview to offer with visual Kanban boards.',
  icon: TrendingUp,
}, {
  title: 'Stay Organized',
  text: 'Never lose track of an application. Keep all your job search information in one centralized place.',
  icon: CheckCircle2,
}];
