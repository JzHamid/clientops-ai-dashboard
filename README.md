# ClientOps AI Dashboard

ClientOps AI Dashboard is a portfolio-ready SaaS-style admin system for managing
clients, projects, tasks, project notes, and AI-style project summary previews.
It keeps a dark premium dashboard look while demonstrating full-stack product
patterns: authentication, protected data access, form validation, Row Level
Security, CRUD workflows, and server-side summary generation.

## Features

- Supabase Auth with `/login`, `/signup`, logout, and protected `/dashboard`
- Client CRUD: create, edit, and delete client accounts
- Project CRUD: create projects, update project status, and delete projects
- Task CRUD: create tasks, update task status, and delete tasks
- Project notes: add, view, and delete notes for project context
- Activity timeline for important account, project, task, note, and summary events
- Server-side "Generate AI Summary" workflow with a safe demo fallback
- Zod validation for all form inputs
- Dark responsive SaaS dashboard UI with loading, empty, success, and error states

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
- `OPENAI_API_KEY` is reserved for future server-side AI only.
- Server actions derive `user_id` from the authenticated Supabase session.
- Forms never submit `user_id`.
- RLS must stay enabled in Supabase.

## Run Locally

Install dependencies:

```bash
npm install
```

Copy the example environment file:

```bash
copy .env.example .env.local
```

Fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Start the development server:

```bash
npm run dev
```

Build for production:

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

## AI Summary Behavior

The summary action runs on the server and gathers project status, tasks, notes,
and recent activity. If `OPENAI_API_KEY` is missing, it saves a clear demo
summary fallback instead of crashing. No AI key is exposed to the browser.

## Future Improvements

- Replace demo summary logic with a real server-side OpenAI call
- Add filters and search across clients, projects, and tasks
- Add client and project detail pages
- Add charts for revenue, health, delivery velocity, and risk
- Add role-based team access
- Add Supabase generated TypeScript database types
