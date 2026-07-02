import { redirect } from "next/navigation";

import { ActivityFeed } from "@/components/ActivityFeed";
import { AutomationPanel } from "@/components/AutomationPanel";
import { ClientTable } from "@/components/ClientTable";
import { DemoWorkspacePanel } from "@/components/DemoWorkspacePanel";
import { Header } from "@/components/Header";
import { LogoutButton } from "@/components/LogoutButton";
import { MetricCard } from "@/components/MetricCard";
import { NotesPanel } from "@/components/NotesPanel";
import { ProjectPipeline } from "@/components/ProjectPipeline";
import { Sidebar } from "@/components/Sidebar";
import { TaskBoard } from "@/components/TaskBoard";
import { getDashboardData, getEmptyDashboardData } from "@/lib/dashboard-data";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";
import { type Metric, projectSummary, quickActions } from "@/lib/ui-config";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  searchParams: Promise<{ error?: string; success?: string }>;
};

function percentage(part: number, total: number) {
  return total === 0 ? 0 : Math.round((part / total) * 100);
}

function automationFitForProject(
  projectId: string,
  data: Awaited<ReturnType<typeof getDashboardData>>,
) {
  const hasTasks = data.tasks.some((task) => task.project_id === projectId);
  const hasNotes = data.notes.some((note) => note.project_id === projectId);
  const hasSummary = data.summaries.some((summary) => summary.project_id === projectId);
  const hasActivity = data.activity.some((item) => item.project_id === projectId);

  return (
    (hasTasks ? 40 : 0) +
    (hasNotes ? 25 : 0) +
    (hasSummary ? 25 : 0) +
    (hasActivity ? 10 : 0)
  );
}

function buildMetrics(data: Awaited<ReturnType<typeof getDashboardData>>): Metric[] {
  const activeClients = data.clients.filter((client) => client.status === "Active").length;
  const openProjects = data.projects.filter((project) => project.status !== "Complete").length;
  const pendingTasks = data.tasks.filter((task) => task.status !== "Done").length;
  const completedTasks = data.tasks.filter((task) => task.status === "Done").length;
  const taskCompletion = percentage(completedTasks, data.tasks.length);
  const summarizedProjects = new Set(data.summaries.map((summary) => summary.project_id)).size;
  const automationFit =
    data.projects.length === 0
      ? 0
      : Math.round(
          data.projects.reduce(
            (sum, project) => sum + automationFitForProject(project.id, data),
            0,
          ) /
            data.projects.length,
        );

  return [
    {
      label: "Active clients",
      value: String(activeClients),
      change: `${data.clients.length} total accounts`,
      detail: `${data.clients.filter((client) => client.status === "At risk").length} at-risk clients`,
      tone: "cyan",
    },
    {
      label: "Open projects",
      value: String(openProjects),
      change: `${data.projects.length} total projects`,
      detail: `${data.projects.filter((project) => project.status === "Launch").length} in launch`,
      tone: "emerald",
    },
    {
      label: "Task completion",
      value: `${taskCompletion}%`,
      change: `${completedTasks}/${data.tasks.length} tasks done`,
      detail: `${pendingTasks} pending. Formula: done tasks / total tasks`,
      tone: "amber",
    },
    {
      label: "Automation fit",
      value: `${automationFit}%`,
      change: `${summarizedProjects}/${data.projects.length} projects summarized`,
      detail: "Formula: tasks 40, notes 25, summary 25, activity 10",
      tone: "violet",
    },
  ];
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const supabaseReady = hasSupabaseEnv();
  let data = getEmptyDashboardData();

  if (supabaseReady) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    data = await getDashboardData(supabase);
  }

  const metrics = buildMetrics(data);
  const isEmptyWorkspace =
    supabaseReady &&
    data.clients.length === 0 &&
    data.projects.length === 0 &&
    data.tasks.length === 0 &&
    data.notes.length === 0 &&
    data.summaries.length === 0 &&
    data.activity.length === 0;

  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 lg:flex">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <Header summary={projectSummary} actions={quickActions}>
          {supabaseReady ? <LogoutButton /> : null}
        </Header>

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          {!supabaseReady ? (
            <section className="rounded-lg border border-amber-400/25 bg-amber-400/10 p-4 text-sm text-amber-100">
              <p className="font-semibold text-amber-50">Connect Supabase to use the app</p>
              <p className="mt-1 leading-6">
                Connect the local Supabase project, then restart the app. The
                dashboard will require login and load your workspace records.
              </p>
            </section>
          ) : null}

          {params.error ? (
            <section className="rounded-lg border border-rose-400/25 bg-rose-400/10 p-4 text-sm text-rose-100">
              <p className="font-semibold text-rose-50">Action needed</p>
              <p className="mt-1 leading-6">{params.error}</p>
            </section>
          ) : null}

          {params.success ? (
            <section className="rounded-lg border border-emerald-400/25 bg-emerald-400/10 p-4 text-sm text-emerald-100">
              <p className="font-semibold text-emerald-50">Saved</p>
              <p className="mt-1 leading-6">{params.success}</p>
            </section>
          ) : null}

          {data.errors.map((error) => (
            <section
              className="rounded-lg border border-rose-400/25 bg-rose-400/10 p-4 text-sm text-rose-100"
              key={error}
            >
              <p className="font-semibold text-rose-50">Data could not fully load</p>
              <p className="mt-1 leading-6">{error}</p>
            </section>
          ))}

          {isEmptyWorkspace ? <DemoWorkspacePanel /> : null}

          <section
            id="overview"
            aria-label="Overview metrics"
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {metrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </section>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
            <div className="flex min-w-0 flex-col gap-6">
              <ClientTable clients={data.clients} projects={data.projects} />
              <ProjectPipeline
                clients={data.clients}
                projects={data.projects}
                tasks={data.tasks}
              />
              <TaskBoard projects={data.projects} tasks={data.tasks} />
            </div>

            <aside className="flex min-w-0 flex-col gap-6">
              <NotesPanel notes={data.notes} projects={data.projects} />
              <AutomationPanel
                activity={data.activity}
                notes={data.notes}
                projects={data.projects}
                summaries={data.summaries}
                tasks={data.tasks}
              />
              <ActivityFeed activity={data.activity} />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
