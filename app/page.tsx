import { ActivityFeed } from "@/components/ActivityFeed";
import { AutomationPanel } from "@/components/AutomationPanel";
import { ClientTable } from "@/components/ClientTable";
import { Header } from "@/components/Header";
import { MetricCard } from "@/components/MetricCard";
import { ProjectPipeline } from "@/components/ProjectPipeline";
import { Sidebar } from "@/components/Sidebar";
import { StatusBadge } from "@/components/StatusBadge";
import {
  contextNotes,
  overviewMetrics,
  projectSummary,
  quickActions,
  taskColumns,
} from "@/lib/mock-data";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 lg:flex">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <Header summary={projectSummary} actions={quickActions} />

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <section
            aria-label="Overview metrics"
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {overviewMetrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </section>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
            <div className="flex min-w-0 flex-col gap-6">
              <ClientTable />
              <ProjectPipeline />

              <section className="rounded-lg border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/20">
                <div className="flex flex-col gap-2 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">
                      Operations
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-white">
                      Task and status board
                    </h2>
                  </div>
                  <p className="text-sm text-zinc-400">
                    Prioritized work for the current delivery cycle.
                  </p>
                </div>

                <div className="grid gap-4 p-4 md:grid-cols-3">
                  {taskColumns.map((column) => (
                    <div
                      key={column.title}
                      className="rounded-lg border border-white/10 bg-[#0d1017] p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold text-white">
                          {column.title}
                        </h3>
                        <span className="text-xs text-zinc-500">
                          {column.tasks.length} items
                        </span>
                      </div>

                      <div className="mt-4 space-y-3">
                        {column.tasks.map((task) => (
                          <article
                            key={task.title}
                            className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <h4 className="text-sm font-medium leading-5 text-zinc-100">
                                {task.title}
                              </h4>
                              <StatusBadge label={task.status} tone={task.tone} />
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                              <span>{task.owner}</span>
                              <span className="h-1 w-1 rounded-full bg-zinc-700" />
                              <span>{task.due}</span>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="flex min-w-0 flex-col gap-6">
              <section className="rounded-lg border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/20">
                <div className="border-b border-white/10 px-5 py-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-amber-300">
                    Context
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-white">
                    Client notes
                  </h2>
                </div>

                <div className="space-y-4 p-4">
                  {contextNotes.map((note) => (
                    <article
                      key={note.title}
                      className="rounded-lg border border-white/10 bg-[#0d1017] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-sm font-semibold text-white">
                          {note.title}
                        </h3>
                        <StatusBadge label={note.type} tone={note.tone} />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-zinc-400">
                        {note.detail}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {note.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md border border-white/10 px-2 py-1 text-xs text-zinc-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <AutomationPanel />
              <ActivityFeed />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
