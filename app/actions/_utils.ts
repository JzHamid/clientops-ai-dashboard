import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ZodError } from "zod";

import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";

export function dashboardRedirect(type: "success" | "error", message: string): never {
  const params = new URLSearchParams({ [type]: message });
  redirect(`/dashboard?${params.toString()}`);
}

export function isRedirectError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    String((error as { digest?: unknown }).digest).startsWith("NEXT_REDIRECT")
  );
}

export async function requireUser() {
  if (!hasSupabaseEnv()) {
    dashboardRedirect("error", "Supabase is not configured yet.");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return { supabase, user };
}

export function validationMessage(error: ZodError) {
  return error.issues[0]?.message ?? "Please check the form and try again.";
}

export async function logActivity(
  supabase: Awaited<ReturnType<typeof createClient>>,
  input: {
    userId: string;
    action: string;
    detail: string;
    clientId?: string | null;
    projectId?: string | null;
  },
) {
  await supabase.from("activity_logs").insert({
    user_id: input.userId,
    client_id: input.clientId ?? null,
    project_id: input.projectId ?? null,
    action: input.action,
    detail: input.detail,
  });
}

export function refreshDashboard(message: string) {
  revalidatePath("/dashboard");
  dashboardRedirect("success", message);
}
