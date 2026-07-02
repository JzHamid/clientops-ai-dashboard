"use server";

import { ZodError, z } from "zod";

import {
  dashboardRedirect,
  logActivity,
  isRedirectError,
  refreshDashboard,
  requireUser,
  validationMessage,
} from "@/app/actions/_utils";
import { idSchema } from "@/lib/validations";

const generateSummarySchema = z.object({
  project_id: idSchema,
});

type SummaryProject = {
  id: string;
  name: string;
  status: string;
  priority: string;
  description: string | null;
  client_id: string;
  clients?: { name: string } | { name: string }[] | null;
};

function ageInSeconds(createdAt: string) {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000);
}

export async function generateAiSummary(formData: FormData) {
  try {
    const { project_id } = generateSummarySchema.parse(Object.fromEntries(formData));
    const { supabase, user } = await requireUser();

    const { data: recentSummary } = await supabase
      .from("ai_summaries")
      .select("created_at")
      .eq("project_id", project_id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (recentSummary?.created_at && ageInSeconds(recentSummary.created_at) < 20) {
      dashboardRedirect("error", "A summary was just generated. Wait a moment before trying again.");
    }

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, name, status, priority, description, client_id, clients(name)")
      .eq("id", project_id)
      .eq("user_id", user.id)
      .single();

    if (projectError || !project) {
      dashboardRedirect("error", "That project could not be loaded for summary generation.");
    }

    const [tasksResult, notesResult, activityResult] = await Promise.all([
      supabase
        .from("tasks")
        .select("title, status, priority, due_date")
        .eq("project_id", project_id)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("project_notes")
        .select("title, body, note_type")
        .eq("project_id", project_id)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("activity_logs")
        .select("detail, created_at")
        .eq("project_id", project_id)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

    const summaryProject = project as SummaryProject;
    const tasks = tasksResult.data ?? [];
    const notes = notesResult.data ?? [];
    const activity = activityResult.data ?? [];
    const blockedTasks = tasks.filter((task) => task.status === "Blocked");
    const highPriorityTasks = tasks.filter((task) => task.priority === "High");
    const riskNotes = notes.filter((note) => note.note_type === "Risk");
    const openTasks = tasks.filter((task) => task.status !== "Done");
    const doneTasks = tasks.filter((task) => task.status === "Done");
    const taskCompletion =
      tasks.length === 0 ? 0 : Math.round((doneTasks.length / tasks.length) * 100);
    const riskLevel =
      summaryProject.status === "Blocked" || blockedTasks.length > 0 || riskNotes.length > 1
        ? "High"
        : highPriorityTasks.length > 0 || riskNotes.length === 1
          ? "Medium"
          : "Low";

    const summaryPrefix = process.env.OPENAI_API_KEY
      ? "AI summary preview"
      : "Demo summary preview";
    const clientName = Array.isArray(summaryProject.clients)
      ? summaryProject.clients[0]?.name
      : summaryProject.clients?.name;

    const summary = `${summaryPrefix}: ${summaryProject.name} for ${
      clientName ?? "the client"
    } is currently in ${summaryProject.status} with ${taskCompletion}% task completion. There are ${
      openTasks.length
    } open tasks, ${blockedTasks.length} blocked tasks, and ${
      notes.length
    } recent notes available for context.`;

    const recommendedNextSteps = [
      blockedTasks.length > 0
        ? "Resolve the blocked task lane before adding more delivery scope."
        : "Confirm the next delivery milestone and owner.",
      riskNotes.length > 0
        ? "Review risk notes and send the client a clear mitigation update."
        : "Add a client-facing note after the next project movement.",
      highPriorityTasks.length > 0
        ? "Close or reassign high-priority tasks before the next status review."
        : "Keep the task board updated so future summaries stay useful.",
    ];

    const suggestedFollowUpMessage = `Hi ${
      clientName ?? "team"
    }, quick update on ${summaryProject.name}: the project is in ${summaryProject.status}, with ${
      openTasks.length
    } open tasks currently tracked. Next, I recommend focusing on ${recommendedNextSteps[0].toLowerCase()}`;

    const { error: insertError } = await supabase.from("ai_summaries").insert({
      user_id: user.id,
      project_id,
      summary,
      risk_level: riskLevel,
      recommended_next_steps: recommendedNextSteps,
      suggested_follow_up_message: suggestedFollowUpMessage,
    });

    if (insertError) {
      dashboardRedirect("error", "AI summary could not be saved. Refresh and try again.");
    }

    await logActivity(supabase, {
      userId: user.id,
      clientId: summaryProject.client_id,
      projectId: summaryProject.id,
      action: "generated",
      detail: `Generated an AI summary preview for ${summaryProject.name}. ${
        activity.length > 0 ? "Recent activity was included." : "No recent activity was available."
      }`,
    });

    refreshDashboard(
      process.env.OPENAI_API_KEY
        ? "AI summary preview generated."
        : "Demo summary saved. This portfolio demo uses a safe server-side fallback when no AI provider key is configured.",
    );
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      dashboardRedirect("error", validationMessage(error));
    }

    dashboardRedirect("error", "AI summary could not be generated. Refresh and try again.");
  }
}
