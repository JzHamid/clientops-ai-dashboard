import { redirect } from "next/navigation";

import { ActivityFeed } from "@/components/ActivityFeed";
import { AutomationPanel } from "@/components/AutomationPanel";
import { ClientTable } from "@/components/ClientTable";
import { Header } from "@/components/Header";
import { LogoutButton } from "@/components/LogoutButton";
import { MetricCard } from "@/components/MetricCard";
import { NotesPanel } from "@/components/NotesPanel";
import { ProjectPipeline } from "@/components/ProjectPipeline";
import { Sidebar } from "@/components/Sidebar";
import { TaskBoard } from "@/components/TaskBoard";
import { getDashboardData, getEmptyDashboardData } from "@/lib/dashboard-data";
import { type Metric, projectSummary, quickActions } from "@/lib/mock-data";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  searchParams: Promise<{ error?: string; success?: string }>;
};

function buildMetrics(data: Awaited<ReturnType<typeof getDashboardData>>): Metric[] {
  const activeClients = data.clients.filter((client) => client.status === "Active").length;
  const openProjects = data.projects.filter((project) => project.status !== "Complete").length;
  const pendingTasks = data.tasks.filter((task) => task.status !== "Done").length;
  const automationFit =
    data.projects.length === 0
      ? 0
      : Math.round(
          data.projects.reduce((sum, project) => sum + project.progress, 0) /
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
      label: "Pending tasks",
      value: String(pendingTasks),
      change: `${data.tasks.filter((task) => task.priority === "High").length} high priority`,
      detail: `${data.tasks.filter((task) => task.status === "Blocked").length} blocked tasks`,
      tone: "amber",
    },
    {
      label: "Automation fit",
      value: `${automationFit}%`,
      change: `${data.summaries.length} summaries generated`,
      detail: "Based on project progress and saved notes",
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
              Supabase is not configured yet. Add your values to `.env.local`,
              then the dashboard will require login and load database records.
            </section>
          ) : null}

          {params.error ? (
            <section className="rounded-lg border border-rose-400/25 bg-rose-400/10 p-4 text-sm text-rose-100">
              {params.error}
            </section>
          ) : null}

          {params.success ? (
            <section className="rounded-lg border border-emerald-400/25 bg-emerald-400/10 p-4 text-sm text-emerald-100">
              {params.success}
            </section>
          ) : null}

          {data.errors.map((error) => (
            <section
              className="rounded-lg border border-rose-400/25 bg-rose-400/10 p-4 text-sm text-rose-100"
              key={error}
            >
              {error}
            </section>
          ))}

          <section
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
              <ProjectPipeline clients={data.clients} projects={data.projects} />
              <TaskBoard projects={data.projects} tasks={data.tasks} />
            </div>

            <aside className="flex min-w-0 flex-col gap-6">
              <NotesPanel notes={data.notes} projects={data.projects} />
              <AutomationPanel projects={data.projects} summaries={data.summaries} />
              <ActivityFeed activity={data.activity} />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
