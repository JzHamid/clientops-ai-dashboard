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
      dashboardRedirect("error", "Task could not be created. Check the selected project and required fields.");
    }

    if (data) {
      await logActivity(supabase, {
        userId: user.id,
        projectId: data.project_id,
        action: "created",
        detail: `Created task ${data.title}.`,
      });
    }

    refreshDashboard("Task added to the status board.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      dashboardRedirect("error", validationMessage(error));
    }

    dashboardRedirect("error", "Task could not be created. Check the selected project and required fields.");
  }
}

const updateTaskSchema = taskSchema.extend({
  id: idSchema,
});

export async function updateTask(formData: FormData) {
  try {
    const values = parseFormData(updateTaskSchema, formData);
    const { id, ...task } = values;
    const { supabase, user } = await requireUser();
    const { data, error } = await supabase
      .from("tasks")
      .update(task)
      .eq("id", id)
      .eq("user_id", user.id)
      .select("id, title, project_id")
      .single();

    if (error) {
      dashboardRedirect("error", "Task changes could not be saved. Check the form and try again.");
    }

    if (data) {
      await logActivity(supabase, {
        userId: user.id,
        projectId: data.project_id,
        action: "updated",
        detail: `Updated task ${data.title}.`,
      });
    }

    refreshDashboard("Task changes saved.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      dashboardRedirect("error", validationMessage(error));
    }

    dashboardRedirect("error", "Task changes could not be saved. Check the form and try again.");
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
      dashboardRedirect("error", "Task status could not be updated. Refresh and try again.");
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

    dashboardRedirect("error", "Task status could not be updated. Refresh and try again.");
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
      dashboardRedirect("error", "Task could not be deleted. Refresh and try again.");
    }

    refreshDashboard("Task deleted.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      dashboardRedirect("error", validationMessage(error));
    }

    dashboardRedirect("error", "Task could not be deleted. Refresh and try again.");
  }
}
