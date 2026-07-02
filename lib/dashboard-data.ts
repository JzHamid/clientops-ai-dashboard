import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  ActivityLogRecord,
  AiSummaryRecord,
  ClientRecord,
  DashboardData,
  ProjectNoteRecord,
  ProjectRecord,
  TaskRecord,
} from "@/lib/types";

const emptyData: DashboardData = {
  clients: [],
  projects: [],
  tasks: [],
  notes: [],
  summaries: [],
  activity: [],
  errors: [],
};

export async function getDashboardData(supabase: SupabaseClient): Promise<DashboardData> {
  const [clientsResult, projectsResult, tasksResult, notesResult, summariesResult, activityResult] =
    await Promise.all([
      supabase.from("clients").select("*").order("created_at", { ascending: false }),
      supabase
        .from("projects")
        .select("*, clients(id, name, status, priority, health_score)")
        .order("created_at", { ascending: false }),
      supabase
        .from("tasks")
        .select("*, projects(id, name, clients(id, name))")
        .order("created_at", { ascending: false }),
      supabase
        .from("project_notes")
        .select("*, projects(id, name, clients(id, name))")
        .order("created_at", { ascending: false }),
      supabase
        .from("ai_summaries")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("activity_logs")
        .select("*, clients(id, name), projects(id, name)")
        .order("created_at", { ascending: false })
        .limit(12),
    ]);

  const errors = [
    clientsResult.error,
    projectsResult.error,
    tasksResult.error,
    notesResult.error,
    summariesResult.error,
    activityResult.error,
  ]
    .filter(Boolean)
    .map(() => "Some dashboard records could not be loaded.");

  return {
    ...emptyData,
    clients: (clientsResult.data ?? []) as ClientRecord[],
    projects: (projectsResult.data ?? []) as ProjectRecord[],
    tasks: (tasksResult.data ?? []) as TaskRecord[],
    notes: (notesResult.data ?? []) as ProjectNoteRecord[],
    summaries: (summariesResult.data ?? []) as AiSummaryRecord[],
    activity: (activityResult.data ?? []) as ActivityLogRecord[],
    errors: [...new Set(errors)],
  };
}

export function getEmptyDashboardData(): DashboardData {
  return emptyData;
}
