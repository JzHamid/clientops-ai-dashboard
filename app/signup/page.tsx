import Link from "next/link";
import { redirect } from "next/navigation";

import { signup } from "@/app/actions/auth";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";

type SignupPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const supabaseReady = hasSupabaseEnv();

  if (supabaseReady) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/dashboard");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#08090d] px-4 py-10 text-zinc-100">
      <section className="w-full max-w-md rounded-lg border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-300">
          ClientOps AI Dashboard
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-white">Create account</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Start a secure workspace for clients, projects, tasks, notes, and AI
          summary previews.
        </p>

        {!supabaseReady ? (
          <div className="mt-5 rounded-lg border border-amber-400/25 bg-amber-400/10 p-3 text-sm text-amber-100">
            Add Supabase values to `.env.local` to enable signup.
          </div>
        ) : null}

        {params.error ? (
          <div className="mt-5 rounded-lg border border-rose-400/25 bg-rose-400/10 p-3 text-sm text-rose-100">
            {params.error}
          </div>
        ) : null}

        <form action={signup} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-zinc-200">Email</span>
            <input
              className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-[#0d1017] px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-300/50"
              name="email"
              placeholder="you@example.com"
              required
              type="email"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-zinc-200">Password</span>
            <input
              className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-[#0d1017] px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-300/50"
              minLength={8}
              name="password"
              placeholder="At least 8 characters"
              required
              type="password"
            />
          </label>

          <SubmitButton
            className="h-11 w-full rounded-lg border border-cyan-300/40 bg-cyan-300 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!supabaseReady}
            pendingLabel="Creating account..."
          >
            Sign up
          </SubmitButton>
        </form>

        <p className="mt-5 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link className="font-medium text-cyan-200 hover:text-cyan-100" href="/login">
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
