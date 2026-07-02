import { loadDemoWorkspace } from "@/app/actions/demo";
import { SubmitButton } from "@/components/forms/SubmitButton";

export function DemoWorkspacePanel() {
  return (
    <section className="rounded-lg border border-cyan-300/25 bg-cyan-300/10 p-5 shadow-2xl shadow-black/20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-200">
            Portfolio demo
          </p>
          <h2 className="mt-2 text-lg font-semibold text-white">
            Start with a realistic workspace
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-300">
            Load sample clients, projects, tasks, notes, AI summaries, and
            activity logs for the current signed-in user.
          </p>
        </div>

        <form action={loadDemoWorkspace}>
          <SubmitButton
            className="h-11 rounded-lg border border-cyan-300/40 bg-cyan-300 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
            pendingLabel="Loading workspace..."
          >
            Load demo workspace
          </SubmitButton>
        </form>
      </div>
    </section>
  );
}
