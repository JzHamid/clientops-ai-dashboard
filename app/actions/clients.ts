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
import { clientSchema, idSchema, parseFormData } from "@/lib/validations";

const updateClientSchema = clientSchema.extend({
  id: idSchema,
});

export async function createClientRecord(formData: FormData) {
  try {
    const values = parseFormData(clientSchema, formData);
    const { supabase, user } = await requireUser();
    const { data, error } = await supabase
      .from("clients")
      .insert({ ...values, user_id: user.id })
      .select("id, name")
      .single();

    if (error) {
      dashboardRedirect("error", "Client could not be created. Check the form and try again.");
    }

    if (data) {
      await logActivity(supabase, {
        userId: user.id,
        clientId: data.id,
        action: "created",
        detail: `Created client ${data.name}.`,
      });
    }

    refreshDashboard("Client added. You can attach a project next.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      dashboardRedirect("error", validationMessage(error));
    }

    dashboardRedirect("error", "Client could not be created. Check the form and try again.");
  }
}

export async function updateClientRecord(formData: FormData) {
  try {
    const values = parseFormData(updateClientSchema, formData);
    const { id, ...client } = values;
    const { supabase, user } = await requireUser();
    const { data, error } = await supabase
      .from("clients")
      .update(client)
      .eq("id", id)
      .eq("user_id", user.id)
      .select("id, name")
      .single();

    if (error) {
      dashboardRedirect("error", "Client changes could not be saved. Check the form and try again.");
    }

    if (data) {
      await logActivity(supabase, {
        userId: user.id,
        clientId: data.id,
        action: "updated",
        detail: `Updated client ${data.name}.`,
      });
    }

    refreshDashboard("Client changes saved.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      dashboardRedirect("error", validationMessage(error));
    }

    dashboardRedirect("error", "Client changes could not be saved. Check the form and try again.");
  }
}

export async function deleteClientRecord(formData: FormData) {
  try {
    const id = z.object({ id: idSchema }).parse(Object.fromEntries(formData)).id;
    const { supabase, user } = await requireUser();
    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      dashboardRedirect("error", "Client could not be deleted. Refresh and try again.");
    }

    refreshDashboard("Client deleted.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      dashboardRedirect("error", validationMessage(error));
    }

    dashboardRedirect("error", "Client could not be deleted. Refresh and try again.");
  }
}
