export type ClientRecord = {
  id: string;
  user_id: string;
  name: string;
  contact_name: string | null;
  contact_email: string | null;
  status: string;
  priority: string;
  health_score: number;
  created_at: string;
  updated_at: string;
};

export type ProjectRecord = {
  id: string;
  user_id: string;
  client_id: string;
  name: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  budget: number | null;
  progress: number;
  created_at: string;
  updated_at: string;
  clients?: Pick<ClientRecord, "id" | "name" | "status" | "priority" | "health_score"> | null;
};

export type TaskRecord = {
  id: string;
  user_id: string;
  project_id: string;
  title: string;
  owner: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  projects?: (Pick<ProjectRecord, "id" | "name"> & {
    clients?: Pick<ClientRecord, "id" | "name"> | null;
  }) | null;
};

export type ProjectNoteRecord = {
  id: string;
  user_id: string;
  project_id: string;
  title: string;
  body: string;
  note_type: string;
  created_at: string;
  updated_at: string;
  projects?: (Pick<ProjectRecord, "id" | "name"> & {
    clients?: Pick<ClientRecord, "id" | "name"> | null;
  }) | null;
};

export type AiSummaryRecord = {
  id: string;
  user_id: string;
  project_id: string;
  summary: string;
  risk_level: string;
  recommended_next_steps: string[];
  suggested_follow_up_message: string;
  created_at: string;
  updated_at: string;
};

export type ActivityLogRecord = {
  id: string;
  user_id: string;
  client_id: string | null;
  project_id: string | null;
  action: string;
  detail: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  clients?: Pick<ClientRecord, "id" | "name"> | null;
  projects?: Pick<ProjectRecord, "id" | "name"> | null;
};

export type DashboardData = {
  clients: ClientRecord[];
  projects: ProjectRecord[];
  tasks: TaskRecord[];
  notes: ProjectNoteRecord[];
  summaries: AiSummaryRecord[];
  activity: ActivityLogRecord[];
  errors: string[];
};
