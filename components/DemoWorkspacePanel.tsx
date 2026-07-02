import { loadDemoWorkspace } from "@/app/actions/demo";
import { SubmitButton } from "@/components/forms/SubmitButton";

export function DemoWorkspacePanel() {
  return (
    <section className="rounded-lg border border-cyan-300/25 bg-cyan-300/10 p-5 shadow-2xl shadow-black/20">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-200">
            Empty workspace
          </p>
          <h2 className="mt-2 text-lg font-semibold text-white">
            Load a complete demo workspace
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-300">
            Add realistic clients, projects, tasks, notes, AI summaries, and
            activity logs to this signed-in account. This is the fastest way to
            review the full portfolio demo without entering every record by hand.
          </p>
          <div className="mt-4 grid gap-2 text-xs text-cyan-50 sm:grid-cols-3">
            <span className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-2 py-1">
              3 clients
            </span>
            <span className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-2 py-1">
              4 projects / 8 tasks
            </span>
            <span className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-2 py-1">
              Notes + summaries
            </span>
          </div>
        </div>

        <form action={loadDemoWorkspace}>
          <SubmitButton
            className="h-11 w-full rounded-lg border border-cyan-300/40 bg-cyan-300 px-5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
            pendingLabel="Loading workspace..."
          >
            Load demo workspace
          </SubmitButton>
        </form>
      </div>
    </section>
  );
}
