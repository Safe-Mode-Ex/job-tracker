# Job Tracker

A better way to track your job applications. Capture, organize, and manage your entire job search in one place with a visual Kanban board.

## Features

- **Kanban boards** — drag-and-drop job applications across columns to track every stage of your search.
- **Default workflow** — every account starts with a "Job Hunt" board containing the columns *Wish List → Applied → Interviewing → Offer → Rejected*.
- **Application CRUD** — store company, position, location, salary, tags, notes, job URL, and description for each application.
- **Authentication** — email & password sign-up/sign-in powered by `better-auth`, with a personal board auto-created on registration.
- **Per-user data** — all boards, columns, and applications are scoped to the authenticated user.

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router)
- React 19
- [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (`@base-ui/react`)
- [better-auth](https://better-auth.com) (email & password)
- [MongoDB](https://www.mongodb.com) via [mongoose](https://mongoosejs.com)
- [@dnd-kit](https://dndkit.com) for drag-and-drop
- [lucide-react](https://lucide.dev) icons
- TypeScript

## Prerequisites

- Node.js 18+
- A MongoDB database (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd job-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.local` (or create it) and set the values described in [Environment Variables](#environment-variables). `.env.local` is gitignored, so it is never committed.

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser. Create an account via `/sign-up` — a personal board is initialized automatically.

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

| Variable | Description |
| --- | --- |
| `MONGODB_URI` | Connection string for your MongoDB database. |
| `BETTER_AUTH_SECRET` | Secret used by `better-auth` to sign sessions/cookies. Generate a random string. |
| `BETTER_AUTH_URL` | Base URL of the app (e.g. `http://localhost:3000`). |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Public base URL exposed to the client (same as above for local dev). |
| `SEED_USER_ID` | (Optional) User ID used by the seed script to populate sample data. |

## Database & Auth Setup

- Database models (`Board`, `Column`, `JobApplication`) are defined under `lib/models` and created automatically on first use via `mongoose`.
- On user registration, a `databaseHook` in `lib/auth/auth.ts` calls `initializeUserBoard`, which creates the default board and its five columns.
- No manual migrations are required.

## Seeding Sample Data

To populate a board with sample job applications, run the seed script with a target user ID:

```bash
SEED_USER_ID=<your-user-id> npm run seed:jobs
```

You can find your user ID in the `users` collection of your MongoDB database, or copy it from the session after signing up. The seeder clears existing applications for that user and distributes 15 sample jobs across the columns.

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Build the production bundle. |
| `npm run start` | Run the production server (after `build`). |
| `npm run lint` | Run ESLint. |
| `npm run seed:jobs` | Seed sample job applications (requires `SEED_USER_ID`). |

> The seed script uses `tsx --env-file=.env.local`, so your env vars are loaded automatically.

## Project Structure

```
app/
  api/            # API routes
  dashboard/      # Authenticated Kanban board view
  sign-in/        # Sign-in page
  sign-up/        # Sign-up page
  layout.tsx      # Root layout
  page.tsx        # Marketing/landing page
components/
  applications-board.tsx     # Board container (data fetching)
  kanban-board.tsx           # Drag-and-drop board
  job-application-card.tsx   # Application card
  create-/edit-...-dialog.tsx# Add/edit dialogs
  ui/                        # shadcn/ui primitives
lib/
  models/         # Mongoose models (Board, Column, JobApplication)
  actions/        # Server actions (create/update/delete applications)
  auth/           # better-auth config + session helpers
  board.ts        # Board data helpers
  board-dnd.ts    # Drag-and-drop helpers
  init-user-board.ts  # Default board/column initialization
  data.ts         # Landing page content (features, hero tabs)
scripts/
  seed.ts         # Sample data seeder
```

## Data Model

- **Board** — belongs to a `userId`, owns an ordered list of `columns`.
- **Column** — belongs to a `boardId`, has a `name` and `order`, and references its `jobApplications`.
- **JobApplication** — belongs to a `userId`, `boardId`, and `columnId`; tracks `company`, `position`, `location`, `salary`, `tags`, `notes`, `jobUrl`, `description`, `status`, and an `order` for positioning within its column.

## License

This project is currently unlicensed. Add a `LICENSE` file if you intend to distribute it.
