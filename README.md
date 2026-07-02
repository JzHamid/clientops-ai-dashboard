# ClientOps AI Dashboard

ClientOps AI Dashboard is a portfolio-ready SaaS admin system for client
operations teams. It lets a signed-in user manage clients, projects, tasks,
project notes, activity history, and AI-style project summary previews from one
dark, premium dashboard.

The project is built to show practical full-stack product work: authenticated
workflows, protected Supabase data access, Row Level Security, CRUD forms,
server actions, Zod validation, empty states, demo seeding, and an AI-style
summary preview flow with a polished demo preview when no provider is configured.

## Portfolio Highlights

- Real app experience instead of a static landing page
- Authenticated dashboard with user-scoped data
- Recruiter-friendly demo seed flow for instant walkthroughs
- Full CRUD for clients, projects, tasks, and project notes
- Server-side validation and server-derived `user_id`
- Supabase RLS policies documented in SQL
- AI-style automation readiness without exposing provider keys to the browser
- Responsive dark SaaS UI designed for admin and operations workflows

## Features

- Supabase Auth with `/login`, `/signup`, logout, and protected `/dashboard`
- Client CRUD: create, edit, and delete client accounts
- Project CRUD: create, edit, update status, and delete projects
- Task CRUD: create, edit, update status, and delete tasks
- Project notes: add, view, edit, and delete notes for project context
- Portfolio demo seed button for an empty workspace
- Activity timeline for important account, project, task, note, and summary events
- AI-style summary preview workflow with a safe demo preview path
- Zod validation for all form inputs
- Dark responsive SaaS dashboard UI with loading, empty, success, and error states
- Destructive actions use confirmation prompts before delete requests are sent

## How To Test The Demo

1. Create a Supabase project and run `supabase/schema.sql` in the SQL editor.
2. Copy `.env.example` to `.env.local`.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Run `npm install`, then `npm run dev`.
5. Open the app, create an account, and go to the protected dashboard.
6. Click **Load demo workspace** in the empty state.
7. Review the seeded clients, project pipeline, task board, notes, activity feed,
   and saved AI summaries.
8. Create, edit, update status, and delete a client, project, task, and note.
9. Click **Generate AI summary** on a project and confirm the summary preview is saved.
10. Try a destructive delete and confirm the browser prompt appears first.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth and Database
- `@supabase/ssr` for server-side cookie auth
- `@supabase/supabase-js`
- Zod

## Database Schema

The schema lives in `supabase/schema.sql` and creates:

- `clients`
- `projects`
- `tasks`
- `project_notes`
- `ai_summaries`
- `activity_logs`

Every table is owned by `user_id`, has Row Level Security enabled, and includes
policies for select, insert, update, and delete so authenticated users can only
access their own rows. Project-related tables also validate relationships against
the signed-in user's own records.

## Auth And Security Notes

- Do not commit `.env.local`.
- Do not expose Supabase service role keys.
- The browser only uses `NEXT_PUBLIC_SUPABASE_URL` and
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Server actions derive `user_id` from the authenticated Supabase session.
- Forms never submit `user_id`.
- RLS must stay enabled in Supabase.

## Run Locally

Install dependencies.

```bash
npm install
```

Copy the example environment file.

```bash
copy .env.example .env.local
```

Fill in the Supabase browser-safe values.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Optional server-only AI provider key for future real-provider summaries:

```bash
OPENAI_API_KEY=
```

Start the development server.

```bash
npm run dev
```

Build for production.

```bash
npm run build
```

## Supabase Setup

1. Create a Supabase project.
2. Open the Supabase SQL editor.
3. Run the SQL in `supabase/schema.sql`.
4. In Supabase Auth settings, enable email/password auth.
5. Add your project URL and anon key to `.env.local`.
6. Restart the Next.js dev server.

## Demo Workspace

When a signed-in user has no records yet, the dashboard shows a **Load demo
workspace** button. It creates realistic sample clients, projects, tasks, notes,
demo summary previews, and activity logs for the current authenticated user.
The client does not submit `user_id`; the server action derives it from the
Supabase session, and the action refuses to seed duplicate demo data once
records exist.

## AI-Style Summary Preview

The summary action runs on the server and gathers project status, tasks, notes,
and recent activity. If no real provider is configured, it saves a clear demo
summary preview instead of crashing. No provider key is exposed to the browser.

## Future Improvements

- Connect the summary preview flow to a real server-side AI provider
- Add filters and search across clients, projects, and tasks
- Add client and project detail pages
- Add charts for revenue, health, delivery velocity, and risk
- Add role-based team access
- Add Supabase generated TypeScript database types
