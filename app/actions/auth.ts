"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { authSchema, formValue } from "@/lib/validations";
import { isRedirectError } from "@/app/actions/_utils";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";

function authRedirect(path: string, message: string): never {
  const params = new URLSearchParams({ error: message });
  redirect(`${path}?${params.toString()}`);
}

export async function login(formData: FormData) {
  if (!hasSupabaseEnv()) {
    authRedirect("/login", "Supabase is not configured yet.");
  }

  try {
    const credentials = authSchema.parse({
      email: formValue(formData, "email"),
      password: formValue(formData, "password"),
    });

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(credentials);

    if (error) {
      authRedirect("/login", "Invalid email or password.");
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      authRedirect("/login", error.issues[0]?.message ?? "Invalid login details.");
    }

    authRedirect("/login", "Unable to log in right now.");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  if (!hasSupabaseEnv()) {
    authRedirect("/signup", "Supabase is not configured yet.");
  }

  try {
    const credentials = authSchema.parse({
      email: formValue(formData, "email"),
      password: formValue(formData, "password"),
    });

    const supabase = await createClient();
    const { error } = await supabase.auth.signUp(credentials);

    if (error) {
      authRedirect("/signup", "Unable to create that account.");
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      authRedirect("/signup", error.issues[0]?.message ?? "Invalid signup details.");
    }

    authRedirect("/signup", "Unable to sign up right now.");
  }

  const params = new URLSearchParams({
    message: "Account created. Check your email if confirmation is enabled.",
  });

  revalidatePath("/", "layout");
  redirect(`/login?${params.toString()}`);
}

export async function logout() {
  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
