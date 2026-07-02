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
import {
  idSchema,
  parseFormData,
  projectSchema,
  projectStatusSchema,
} from "@/lib/validations";

export async function createProject(formData: FormData) {
  try {
    const values = parseFormData(projectSchema, formData);
    const { supabase, user } = await requireUser();
    const { data, error } = await supabase
      .from("projects")
      .insert({ ...values, user_id: user.id })
      .select("id, name, client_id")
      .single();

    if (error) {
      dashboardRedirect("error", "Project could not be created. Check the client and required fields.");
    }

    if (data) {
      await logActivity(supabase, {
        userId: user.id,
        clientId: data.client_id,
        projectId: data.id,
        action: "created",
        detail: `Created project ${data.name}.`,
      });
    }

    refreshDashboard("Project added. Add tasks or notes to build context.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      dashboardRedirect("error", validationMessage(error));
    }

    dashboardRedirect("error", "Project could not be created. Check the client and required fields.");
  }
}

const updateProjectSchema = projectSchema.extend({
  id: idSchema,
});

export async function updateProject(formData: FormData) {
  try {
    const values = parseFormData(updateProjectSchema, formData);
    const { id, ...project } = values;
    const { supabase, user } = await requireUser();
    const { data, error } = await supabase
      .from("projects")
      .update(project)
      .eq("id", id)
      .eq("user_id", user.id)
      .select("id, name, client_id")
      .single();

    if (error) {
      dashboardRedirect("error", "Project changes could not be saved. Check the form and try again.");
    }

    if (data) {
      await logActivity(supabase, {
        userId: user.id,
        clientId: data.client_id,
        projectId: data.id,
        action: "updated",
        detail: `Updated project ${data.name}.`,
      });
    }

    refreshDashboard("Project changes saved.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      dashboardRedirect("error", validationMessage(error));
    }

    dashboardRedirect("error", "Project changes could not be saved. Check the form and try again.");
  }
}

export async function updateProjectStatus(formData: FormData) {
  try {
    const values = parseFormData(projectStatusSchema, formData);
    const { supabase, user } = await requireUser();
    const { data, error } = await supabase
      .from("projects")
      .update({ status: values.status })
      .eq("id", values.id)
      .eq("user_id", user.id)
      .select("id, name, client_id, status")
      .single();

    if (error) {
      dashboardRedirect("error", "Project status could not be updated. Refresh and try again.");
    }

    if (data) {
      await logActivity(supabase, {
        userId: user.id,
        clientId: data.client_id,
        projectId: data.id,
        action: "updated",
        detail: `Moved ${data.name} to ${data.status}.`,
      });
    }

    refreshDashboard("Project status updated.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      dashboardRedirect("error", validationMessage(error));
    }

    dashboardRedirect("error", "Project status could not be updated. Refresh and try again.");
  }
}

export async function deleteProject(formData: FormData) {
  try {
    const id = z.object({ id: idSchema }).parse(Object.fromEntries(formData)).id;
    const { supabase, user } = await requireUser();
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      dashboardRedirect("error", "Project could not be deleted. Refresh and try again.");
    }

    refreshDashboard("Project deleted.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      dashboardRedirect("error", validationMessage(error));
    }

    dashboardRedirect("error", "Project could not be deleted. Refresh and try again.");
  }
}
