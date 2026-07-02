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
import { idSchema, parseFormData, taskSchema, taskStatusSchema } from "@/lib/validations";

export async function createTask(formData: FormData) {
  try {
    const values = parseFormData(taskSchema, formData);
    const { supabase, user } = await requireUser();
    const { data, error } = await supabase
      .from("tasks")
      .insert({ ...values, user_id: user.id })
      .select("id, title, project_id")
      .single();

    if (error) {
      dashboardRedirect("error", "Unable to create task.");
    }

    if (data) {
      await logActivity(supabase, {
        userId: user.id,
        projectId: data.project_id,
        action: "created",
        detail: `Created task ${data.title}.`,
      });
    }

    refreshDashboard("Task created.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      dashboardRedirect("error", validationMessage(error));
    }

    dashboardRedirect("error", "Unable to create task.");
  }
}

export async function updateTaskStatus(formData: FormData) {
  try {
    const values = parseFormData(taskStatusSchema, formData);
    const { supabase, user } = await requireUser();
    const { data, error } = await supabase
      .from("tasks")
      .update({ status: values.status })
      .eq("id", values.id)
      .eq("user_id", user.id)
      .select("id, title, project_id, status")
      .single();

    if (error) {
      dashboardRedirect("error", "Unable to update task status.");
    }

    if (data) {
      await logActivity(supabase, {
        userId: user.id,
        projectId: data.project_id,
        action: "updated",
        detail: `Marked ${data.title} as ${data.status}.`,
      });
    }

    refreshDashboard("Task status updated.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      dashboardRedirect("error", validationMessage(error));
    }

    dashboardRedirect("error", "Unable to update task status.");
  }
}

export async function deleteTask(formData: FormData) {
  try {
    const id = z.object({ id: idSchema }).parse(Object.fromEntries(formData)).id;
    const { supabase, user } = await requireUser();
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      dashboardRedirect("error", "Unable to delete task.");
    }

    refreshDashboard("Task deleted.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      dashboardRedirect("error", validationMessage(error));
    }

    dashboardRedirect("error", "Unable to delete task.");
  }
}
