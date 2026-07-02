-- ClientOps AI Dashboard schema
-- Run this in the Supabase SQL editor before connecting the app.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.set_updated_at() from public;

-- Clients represent accounts managed by the signed-in user.
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  contact_name text,
  contact_email text,
  status text not null default 'Lead' check (status in ('Lead', 'Active', 'At risk', 'Paused', 'Complete')),
  priority text not null default 'Medium' check (priority in ('Low', 'Medium', 'High')),
  health_score integer not null default 80 check (health_score between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.clients is 'Client accounts owned by each authenticated user.';
comment on column public.clients.user_id is 'Owner id from auth.users. The client never submits this value.';

-- Projects belong to clients and track delivery state.
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'Discovery' check (status in ('Discovery', 'Build', 'Review', 'Launch', 'Complete', 'Blocked')),
  priority text not null default 'Medium' check (priority in ('Low', 'Medium', 'High')),
  due_date date,
  budget numeric(12, 2),
  progress integer not null default 0 check (progress between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.projects is 'Projects owned by a user and attached to one of their clients.';

-- Tasks belong to projects and support lightweight delivery tracking.
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  owner text,
  status text not null default 'Todo' check (status in ('Todo', 'In progress', 'Blocked', 'Done')),
  priority text not null default 'Medium' check (priority in ('Low', 'Medium', 'High')),
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.tasks is 'Project tasks scoped to the authenticated owner.';

-- Project notes store client context, decisions, risks, and updates.
create table if not exists public.project_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  body text not null,
  note_type text not null default 'Update' check (note_type in ('Update', 'Risk', 'Decision', 'Client context')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.project_notes is 'Notes and client context for a project.';

-- AI summaries are generated server-side and saved for project history.
create table if not exists public.ai_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  summary text not null,
  risk_level text not null check (risk_level in ('Low', 'Medium', 'High')),
  recommended_next_steps text[] not null default '{}',
  suggested_follow_up_message text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.ai_summaries is 'Server-generated project summary previews and fallback demo summaries.';

-- Activity logs can reference a client, a project, both, or neither.
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  action text not null,
  detail text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.activity_logs is 'Append-friendly activity events shown in the dashboard timeline.';

create index if not exists clients_user_id_idx on public.clients(user_id);
create index if not exists projects_user_id_idx on public.projects(user_id);
create index if not exists projects_client_id_idx on public.projects(client_id);
create index if not exists tasks_project_id_idx on public.tasks(project_id);
create index if not exists project_notes_project_id_idx on public.project_notes(project_id);
create index if not exists ai_summaries_project_id_idx on public.ai_summaries(project_id);
create index if not exists activity_logs_user_id_idx on public.activity_logs(user_id);

drop trigger if exists clients_set_updated_at on public.clients;
drop trigger if exists projects_set_updated_at on public.projects;
drop trigger if exists tasks_set_updated_at on public.tasks;
drop trigger if exists project_notes_set_updated_at on public.project_notes;
drop trigger if exists ai_summaries_set_updated_at on public.ai_summaries;
drop trigger if exists activity_logs_set_updated_at on public.activity_logs;

create trigger clients_set_updated_at
before update on public.clients
for each row execute function public.set_updated_at();

create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create trigger tasks_set_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

create trigger project_notes_set_updated_at
before update on public.project_notes
for each row execute function public.set_updated_at();

create trigger ai_summaries_set_updated_at
before update on public.ai_summaries
for each row execute function public.set_updated_at();

create trigger activity_logs_set_updated_at
before update on public.activity_logs
for each row execute function public.set_updated_at();

alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.project_notes enable row level security;
alter table public.ai_summaries enable row level security;
alter table public.activity_logs enable row level security;

grant select, insert, update, delete on public.clients to authenticated;
grant select, insert, update, delete on public.projects to authenticated;
grant select, insert, update, delete on public.tasks to authenticated;
grant select, insert, update, delete on public.project_notes to authenticated;
grant select, insert, update, delete on public.ai_summaries to authenticated;
grant select, insert, update, delete on public.activity_logs to authenticated;

drop policy if exists "Users can select own clients" on public.clients;
drop policy if exists "Users can insert own clients" on public.clients;
drop policy if exists "Users can update own clients" on public.clients;
drop policy if exists "Users can delete own clients" on public.clients;
drop policy if exists "Users can select own projects" on public.projects;
drop policy if exists "Users can insert own projects" on public.projects;
drop policy if exists "Users can update own projects" on public.projects;
drop policy if exists "Users can delete own projects" on public.projects;
drop policy if exists "Users can select own tasks" on public.tasks;
drop policy if exists "Users can insert own tasks" on public.tasks;
drop policy if exists "Users can update own tasks" on public.tasks;
drop policy if exists "Users can delete own tasks" on public.tasks;
drop policy if exists "Users can select own project notes" on public.project_notes;
drop policy if exists "Users can insert own project notes" on public.project_notes;
drop policy if exists "Users can update own project notes" on public.project_notes;
drop policy if exists "Users can delete own project notes" on public.project_notes;
drop policy if exists "Users can select own AI summaries" on public.ai_summaries;
drop policy if exists "Users can insert own AI summaries" on public.ai_summaries;
drop policy if exists "Users can update own AI summaries" on public.ai_summaries;
drop policy if exists "Users can delete own AI summaries" on public.ai_summaries;
drop policy if exists "Users can select own activity logs" on public.activity_logs;
drop policy if exists "Users can insert own activity logs" on public.activity_logs;
drop policy if exists "Users can update own activity logs" on public.activity_logs;
drop policy if exists "Users can delete own activity logs" on public.activity_logs;

create policy "Users can select own clients"
on public.clients for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert own clients"
on public.clients for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update own clients"
on public.clients for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete own clients"
on public.clients for delete to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can select own projects"
on public.projects for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert own projects"
on public.projects for insert to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.clients
    where clients.id = projects.client_id
    and clients.user_id = (select auth.uid())
  )
);

create policy "Users can update own projects"
on public.projects for update to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.clients
    where clients.id = projects.client_id
    and clients.user_id = (select auth.uid())
  )
);

create policy "Users can delete own projects"
on public.projects for delete to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can select own tasks"
on public.tasks for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert own tasks"
on public.tasks for insert to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.projects
    where projects.id = tasks.project_id
    and projects.user_id = (select auth.uid())
  )
);

create policy "Users can update own tasks"
on public.tasks for update to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.projects
    where projects.id = tasks.project_id
    and projects.user_id = (select auth.uid())
  )
);

create policy "Users can delete own tasks"
on public.tasks for delete to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can select own project notes"
on public.project_notes for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert own project notes"
on public.project_notes for insert to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.projects
    where projects.id = project_notes.project_id
    and projects.user_id = (select auth.uid())
  )
);

create policy "Users can update own project notes"
on public.project_notes for update to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.projects
    where projects.id = project_notes.project_id
    and projects.user_id = (select auth.uid())
  )
);

create policy "Users can delete own project notes"
on public.project_notes for delete to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can select own AI summaries"
on public.ai_summaries for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert own AI summaries"
on public.ai_summaries for insert to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.projects
    where projects.id = ai_summaries.project_id
    and projects.user_id = (select auth.uid())
  )
);

create policy "Users can update own AI summaries"
on public.ai_summaries for update to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.projects
    where projects.id = ai_summaries.project_id
    and projects.user_id = (select auth.uid())
  )
);

create policy "Users can delete own AI summaries"
on public.ai_summaries for delete to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can select own activity logs"
on public.activity_logs for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert own activity logs"
on public.activity_logs for insert to authenticated
with check (
  (select auth.uid()) = user_id
  and (
    client_id is null
    or exists (
      select 1 from public.clients
      where clients.id = activity_logs.client_id
      and clients.user_id = (select auth.uid())
    )
  )
  and (
    project_id is null
    or exists (
      select 1 from public.projects
      where projects.id = activity_logs.project_id
      and projects.user_id = (select auth.uid())
    )
  )
);

create policy "Users can update own activity logs"
on public.activity_logs for update to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and (
    client_id is null
    or exists (
      select 1 from public.clients
      where clients.id = activity_logs.client_id
      and clients.user_id = (select auth.uid())
    )
  )
  and (
    project_id is null
    or exists (
      select 1 from public.projects
      where projects.id = activity_logs.project_id
      and projects.user_id = (select auth.uid())
    )
  )
);

create policy "Users can delete own activity logs"
on public.activity_logs for delete to authenticated
using ((select auth.uid()) = user_id);
