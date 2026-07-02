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
      dashboardRedirect("error", "Project note could not be added. Check the selected project and note content.");
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

    dashboardRedirect("error", "Project note could not be added. Check the selected project and note content.");
  }
}

const updateNoteSchema = noteSchema.extend({
  id: idSchema,
});

export async function updateProjectNote(formData: FormData) {
  try {
    const values = parseFormData(updateNoteSchema, formData);
    const { id, ...note } = values;
    const { supabase, user } = await requireUser();
    const { data, error } = await supabase
      .from("project_notes")
      .update(note)
      .eq("id", id)
      .eq("user_id", user.id)
      .select("id, title, project_id")
      .single();

    if (error) {
      dashboardRedirect("error", "Project note changes could not be saved. Check the form and try again.");
    }

    if (data) {
      await logActivity(supabase, {
        userId: user.id,
        projectId: data.project_id,
        action: "updated",
        detail: `Updated note ${data.title}.`,
      });
    }

    refreshDashboard("Project note changes saved.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      dashboardRedirect("error", validationMessage(error));
    }

    dashboardRedirect("error", "Project note changes could not be saved. Check the form and try again.");
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
      dashboardRedirect("error", "Project note could not be deleted. Refresh and try again.");
    }

    refreshDashboard("Project note deleted.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      dashboardRedirect("error", validationMessage(error));
    }

    dashboardRedirect("error", "Project note could not be deleted. Refresh and try again.");
  }
}
