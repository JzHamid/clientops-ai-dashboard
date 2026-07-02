"use server";

import { ZodError } from "zod";

import {
  dashboardRedirect,
  isRedirectError,
  refreshDashboard,
  requireUser,
  validationMessage,
} from "@/app/actions/_utils";
import {
  activityLogSchema,
  aiSummarySchema,
  clientSchema,
  noteSchema,
  projectSchema,
  taskSchema,
} from "@/lib/validations";

const demoClients = [
  {
    name: "Northstar Studio",
    contact_name: "Maya Rivera",
    contact_email: "maya@northstar.example",
    status: "Active",
    priority: "High",
    health_score: 88,
  },
  {
    name: "BrightPath Dental",
    contact_name: "Andre Thompson",
    contact_email: "andre@brightpath.example",
    status: "Active",
    priority: "Medium",
    health_score: 76,
  },
  {
    name: "Harbor & Field",
    contact_name: "Nina Patel",
    contact_email: "nina@harborfield.example",
    status: "At risk",
    priority: "High",
    health_score: 54,
  },
] as const;

type DemoClientName = (typeof demoClients)[number]["name"];

const demoProjects = [
  {
    clientName: "Northstar Studio",
    name: "Client portal rebuild",
    description: "Rebuild the client-facing portal with clearer intake and project visibility.",
    status: "Build",
    priority: "High",
    due_date: "2026-07-18",
    budget: "18400",
    progress: 64,
  },
  {
    clientName: "Northstar Studio",
    name: "Automation readiness audit",
    description: "Map repeatable admin tasks and identify AI-assisted reporting workflows.",
    status: "Discovery",
    priority: "Medium",
    due_date: "2026-07-28",
    budget: "7200",
    progress: 35,
  },
  {
    clientName: "BrightPath Dental",
    name: "Ops dashboard MVP",
    description: "Create internal KPI screens for patient intake, scheduling, and follow-up.",
    status: "Review",
    priority: "Medium",
    due_date: "2026-07-22",
    budget: "11200",
    progress: 82,
  },
  {
    clientName: "Harbor & Field",
    name: "Admin system cleanup",
    description: "Consolidate legacy spreadsheets and clarify ownership for client operations.",
    status: "Blocked",
    priority: "High",
    due_date: "2026-07-12",
    budget: "14600",
    progress: 48,
  },
] as const;

const demoTasks = [
  {
    projectName: "Client portal rebuild",
    title: "Finalize portal navigation QA notes",
    owner: "Jazhem",
    status: "In progress",
    priority: "High",
    due_date: "2026-07-05",
  },
  {
    projectName: "Client portal rebuild",
    title: "Confirm project timeline copy with Maya",
    owner: "Client Ops",
    status: "Todo",
    priority: "Medium",
    due_date: "2026-07-08",
  },
  {
    projectName: "Automation readiness audit",
    title: "Document repeatable reporting steps",
    owner: "Automation",
    status: "Todo",
    priority: "Medium",
    due_date: "2026-07-10",
  },
  {
    projectName: "Automation readiness audit",
    title: "Score intake workflows by automation fit",
    owner: "Jazhem",
    status: "In progress",
    priority: "Medium",
    due_date: "2026-07-11",
  },
  {
    projectName: "Ops dashboard MVP",
    title: "Send KPI layout for stakeholder review",
    owner: "Jazhem",
    status: "Done",
    priority: "High",
    due_date: "2026-07-02",
  },
  {
    projectName: "Ops dashboard MVP",
    title: "Add empty state copy for scheduling panel",
    owner: "Client Ops",
    status: "Todo",
    priority: "Low",
    due_date: "2026-07-09",
  },
  {
    projectName: "Admin system cleanup",
    title: "Resolve shared drive permissions",
    owner: "Client",
    status: "Blocked",
    priority: "High",
    due_date: "2026-07-04",
  },
  {
    projectName: "Admin system cleanup",
    title: "Prepare migration checklist",
    owner: "Jazhem",
    status: "Todo",
    priority: "Medium",
    due_date: "2026-07-13",
  },
] as const;

const demoNotes = [
  {
    projectName: "Client portal rebuild",
    title: "Stakeholder preference",
    body: "Maya wants the portal to prioritize project status, open blockers, and next milestone visibility.",
    note_type: "Client context",
  },
  {
    projectName: "Automation readiness audit",
    title: "Best automation candidate",
    body: "Weekly reporting appears highly repeatable and could become the first AI-assisted workflow.",
    note_type: "Decision",
  },
  {
    projectName: "Ops dashboard MVP",
    title: "Review feedback",
    body: "BrightPath approved the KPI hierarchy but requested clearer scheduling follow-up labels.",
    note_type: "Update",
  },
  {
    projectName: "Admin system cleanup",
    title: "Access blocker",
    body: "The cleanup is blocked until Harbor confirms who owns the shared drive permissions.",
    note_type: "Risk",
  },
  {
    projectName: "Admin system cleanup",
    title: "Client communication",
    body: "Send a concise note with the exact access decision needed and the impact on launch timing.",
    note_type: "Update",
  },
] as const;

function recordByName<T extends { name: string }>(records: T[]) {
  return new Map(records.map((record) => [record.name, record]));
}

async function workspaceHasRecords(
  supabase: Awaited<ReturnType<typeof requireUser>>["supabase"],
  userId: string,
) {
  const tables = ["clients", "projects", "tasks", "project_notes", "ai_summaries", "activity_logs"];

  const results = await Promise.all(
    tables.map((table) =>
      supabase
        .from(table)
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),
    ),
  );

  const hasError = results.some((result) => result.error);

  if (hasError) {
    dashboardRedirect("error", "Unable to verify whether the workspace is empty.");
  }

  return results.some((result) => (result.count ?? 0) > 0);
}

export async function loadDemoWorkspace() {
  try {
    const { supabase, user } = await requireUser();
    const hasRecords = await workspaceHasRecords(supabase, user.id);

    if (hasRecords) {
      dashboardRedirect("error", "Demo workspace can only be loaded into an empty account.");
    }

    const clientsToInsert = demoClients.map((client) => ({
      ...clientSchema.parse(client),
      user_id: user.id,
    }));

    const { data: clients, error: clientsError } = await supabase
      .from("clients")
      .insert(clientsToInsert)
      .select("id, name");

    if (clientsError || !clients || clients.length !== demoClients.length) {
      dashboardRedirect("error", "Unable to create demo clients.");
    }

    const clientsByName = recordByName(clients);
    const projectsToInsert = demoProjects.map((project) => {
      const client = clientsByName.get(project.clientName as DemoClientName);

      if (!client) {
        throw new Error("Missing seeded client.");
      }

      return {
        ...projectSchema.parse({
          client_id: client.id,
          name: project.name,
          description: project.description,
          status: project.status,
          priority: project.priority,
          due_date: project.due_date,
          budget: project.budget,
          progress: project.progress,
        }),
        user_id: user.id,
      };
    });

    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .insert(projectsToInsert)
      .select("id, name, client_id, status, progress");

    if (projectsError || !projects || projects.length !== demoProjects.length) {
      dashboardRedirect("error", "Unable to create demo projects.");
    }

    const projectsByName = recordByName(projects);
    const tasksToInsert = demoTasks.map((task) => {
      const project = projectsByName.get(task.projectName);

      if (!project) {
        throw new Error("Missing seeded project.");
      }

      return {
        ...taskSchema.parse({
          project_id: project.id,
          title: task.title,
          owner: task.owner,
          status: task.status,
          priority: task.priority,
          due_date: task.due_date,
        }),
        user_id: user.id,
      };
    });

    const { error: tasksError } = await supabase.from("tasks").insert(tasksToInsert);

    if (tasksError) {
      dashboardRedirect("error", "Unable to create demo tasks.");
    }

    const notesToInsert = demoNotes.map((note) => {
      const project = projectsByName.get(note.projectName);

      if (!project) {
        throw new Error("Missing seeded project.");
      }

      return {
        ...noteSchema.parse({
          project_id: project.id,
          title: note.title,
          body: note.body,
          note_type: note.note_type,
        }),
        user_id: user.id,
      };
    });

    const { error: notesError } = await supabase.from("project_notes").insert(notesToInsert);

    if (notesError) {
      dashboardRedirect("error", "Unable to create demo project notes.");
    }

    const portalProject = projectsByName.get("Client portal rebuild");
    const cleanupProject = projectsByName.get("Admin system cleanup");

    if (!portalProject || !cleanupProject) {
      dashboardRedirect("error", "Unable to prepare demo summaries.");
    }

    const summariesToInsert = [
      aiSummarySchema.parse({
        project_id: portalProject.id,
        summary:
          "Demo AI summary fallback: Client portal rebuild is progressing well in Build with strong client alignment. The most important next step is closing QA notes and confirming the timeline copy.",
        risk_level: "Medium",
        recommended_next_steps: [
          "Finish portal navigation QA notes.",
          "Confirm timeline language with the client.",
          "Prepare the next delivery update after copy approval.",
        ],
        suggested_follow_up_message:
          "Hi Maya, quick update on the portal rebuild: QA is moving well and the next focus is confirming timeline language so we can keep delivery moving cleanly.",
      }),
      aiSummarySchema.parse({
        project_id: cleanupProject.id,
        summary:
          "Demo AI summary fallback: Admin system cleanup is blocked by shared drive permissions. The project needs a client ownership decision before cleanup work can safely continue.",
        risk_level: "High",
        recommended_next_steps: [
          "Confirm the shared drive permission owner.",
          "Send a short blocker update to the client.",
          "Resume cleanup only after access is confirmed.",
        ],
        suggested_follow_up_message:
          "Hi Nina, the cleanup is ready to move once shared drive ownership is confirmed. The next decision is who should approve access so we can continue without risking missing data.",
      }),
    ].map((summary) => ({ ...summary, user_id: user.id }));

    const { error: summariesError } = await supabase
      .from("ai_summaries")
      .insert(summariesToInsert);

    if (summariesError) {
      dashboardRedirect("error", "Unable to create demo summaries.");
    }

    const northstar = clientsByName.get("Northstar Studio");
    const brightPath = clientsByName.get("BrightPath Dental");
    const harbor = clientsByName.get("Harbor & Field");

    const activityToInsert = [
      activityLogSchema.parse({
        client_id: northstar?.id ?? null,
        project_id: portalProject.id,
        action: "created",
        detail: "Loaded Northstar Studio portal rebuild demo data.",
      }),
      activityLogSchema.parse({
        client_id: brightPath?.id ?? null,
        project_id: projectsByName.get("Ops dashboard MVP")?.id ?? null,
        action: "updated",
        detail: "Marked BrightPath dashboard MVP as ready for stakeholder review.",
      }),
      activityLogSchema.parse({
        client_id: harbor?.id ?? null,
        project_id: cleanupProject.id,
        action: "flagged",
        detail: "Flagged Harbor & Field permissions as a delivery risk.",
      }),
      activityLogSchema.parse({
        client_id: northstar?.id ?? null,
        project_id: projectsByName.get("Automation readiness audit")?.id ?? null,
        action: "generated",
        detail: "Identified weekly reporting as the strongest automation candidate.",
      }),
      activityLogSchema.parse({
        client_id: harbor?.id ?? null,
        project_id: cleanupProject.id,
        action: "generated",
        detail: "Generated a demo AI summary for Admin system cleanup.",
      }),
    ].map((activity) => ({ ...activity, user_id: user.id }));

    const { error: activityError } = await supabase
      .from("activity_logs")
      .insert(activityToInsert);

    if (activityError) {
      dashboardRedirect("error", "Unable to create demo activity logs.");
    }

    refreshDashboard("Demo workspace loaded.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      dashboardRedirect("error", validationMessage(error));
    }

    dashboardRedirect("error", "Unable to load demo workspace.");
  }
}
