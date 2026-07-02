# ClientOps AI Dashboard

A polished SaaS-style admin dashboard for client operations, project delivery,
task tracking, and future AI automation workflows. This is a portfolio project
for Jazhem Hamid, built to showcase clean frontend implementation, reusable
components, and practical admin-system thinking.

## Features

- Dark, responsive single-page SaaS dashboard
- Sidebar navigation and command-style header
- Overview metrics for clients, projects, tasks, and automation readiness
- Client and project tracker table with statuses, priorities, and health scores
- Project pipeline view across discovery, build, review, and launch
- Task/status board for current operational work
- Client context notes panel
- AI automation readiness panel using mock data only
- Recent activity feed

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Mock data in `lib/mock-data.ts`

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Current Scope

This MVP intentionally uses mock data only. It does not include authentication,
Supabase, OpenAI API calls, external API calls, real client data, or secrets.

## Future Improvements

- Add Supabase-backed clients, projects, and task records
- Add authentication and role-based dashboard access
- Add AI-assisted summaries, triage, and risk detection
- Add charts for revenue, utilization, and delivery velocity
- Add filtering, search, and detail pages for clients and projects
