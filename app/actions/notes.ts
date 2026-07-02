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
import { idSchema, noteSchema, parseFormData } from "@/lib/validations";

export async function addProjectNote(formData: FormData) {
  try {
    const values = parseFormData(noteSchema, formData);
    const { supabase, user } = await requireUser();
    const { data, error } = await supabase
      .from("project_notes")
      .insert({ ...values, user_id: user.id })
      .select("id, title, project_id")
      .single();

    if (error) {
      dashboardRedirect("error", "Unable to add note.");
    }

    if (data) {
      await logActivity(supabase, {
        userId: user.id,
        projectId: data.project_id,
        action: "added",
        detail: `Added note ${data.title}.`,
      });
    }

    refreshDashboard("Project note added.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      dashboardRedirect("error", validationMessage(error));
    }

    dashboardRedirect("error", "Unable to add note.");
  }
}

export async function deleteProjectNote(formData: FormData) {
  try {
    const id = z.object({ id: idSchema }).parse(Object.fromEntries(formData)).id;
    const { supabase, user } = await requireUser();
    const { error } = await supabase
      .from("project_notes")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      dashboardRedirect("error", "Unable to delete note.");
    }

    refreshDashboard("Project note deleted.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      dashboardRedirect("error", validationMessage(error));
    }

    dashboardRedirect("error", "Unable to delete note.");
  }
}
