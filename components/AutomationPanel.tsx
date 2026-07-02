import { generateAiSummary } from "@/app/actions/ai";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { StatusBadge } from "@/components/StatusBadge";
import type {
  ActivityLogRecord,
  AiSummaryRecord,
  ProjectNoteRecord,
  ProjectRecord,
  TaskRecord,
} from "@/lib/types";
import type { BadgeTone } from "@/lib/ui-config";

type AutomationPanelProps = {
  activity: ActivityLogRecord[];
  notes: ProjectNoteRecord[];
  projects: ProjectRecord[];
  summaries: AiSummaryRecord[];
  tasks: TaskRecord[];
};

const suggestedAutomations = [
  {
    title: "Generate project summary",
    detail: "Summarize tasks, notes, activity, risk, and next steps.",
  },
  {
    title: "Flag overdue tasks",
    detail: "Spot due dates that need owner follow-up.",
  },
  {
    title: "Draft client follow-up",
    detail: "Turn project context into a client-ready update.",
  },
  {
    title: "Create weekly project recap",
    detail: "Prepare a recurring status note for active projects.",
  },
  {
    title: "Identify blocked projects",
    detail: "Highlight stalled work before it becomes client risk.",
  },
];

function latestSummaryFor(projectId: string, summaries: AiSummaryRecord[]) {
  return summaries.find((summary) => summary.project_id === projectId);
}

function projectStatusTone(status: string): BadgeTone {
  if (status === "Complete" || status === "Launch") {
    return "emerald";
  }

  if (status === "Blocked") {
    return "rose";
  }

  if (status === "Review") {
    return "amber";
  }

  if (status === "Build") {
    return "cyan";
  }

  return "violet";
}

function riskTone(riskLevel: string): BadgeTone {
  if (riskLevel === "High") {
    return "rose";
  }

  if (riskLevel === "Medium") {
    return "amber";
  }

  return "emerald";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function automationFitScore(input: {
  activityCount: number;
  hasSummary: boolean;
  noteCount: number;
  taskCount: number;
}) {
  return (
    (input.taskCount > 0 ? 40 : 0) +
    (input.noteCount > 0 ? 25 : 0) +
    (input.hasSummary ? 25 : 0) +
    (input.activityCount > 0 ? 10 : 0)
  );
}

export function AutomationPanel({
  activity,
  notes,
  projects,
  summaries,
  tasks,
}: AutomationPanelProps) {
  const summarizedProjectIds = new Set(summaries.map((summary) => summary.project_id));
  const summarizedProjects = projects.filter((project) => summarizedProjectIds.has(project.id));
  const projectsNeedingSummaries = Math.max(projects.length - summarizedProjects.length, 0);
  const totalContextItems = tasks.length + notes.length + activity.length;
  const automationActivity =
    activity
      .filter((item) => {
        const detail = item.detail.toLowerCase();
        return (
          item.action === "generated" ||
          detail.includes("summary") ||
          detail.includes("automation") ||
          detail.includes("blocked")
        );
      })
      .slice(0, 4);
  const recentContextActivity =
    automationActivity.length > 0 ? automationActivity : activity.slice(0, 4);
  const coverageStats = [
    { label: "Projects", value: projects.length },
    { label: "With summaries", value: summarizedProjects.length },
    { label: "Need summaries", value: projectsNeedingSummaries },
    { label: "Context items", value: totalContextItems },
  ];

  return (
    <section
      id="automation"
      className="rounded-lg border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/20"
    >
      <div className="border-b border-white/10 px-5 py-4">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-300">
          AI readiness
        </p>
        <h2 className="mt-1 text-lg font-semibold text-white">
          Project summary previews
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Generates server-side summaries from project tasks, notes, and activity.
        </p>
      </div>

      <div className="grid gap-3 border-b border-white/10 p-4 sm:grid-cols-2">
        {coverageStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-white/10 bg-[#0d1017] p-3"
          >
            <p className="text-xs text-zinc-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold text-white">{stat.value}</p>
          </div>
        ))}
        <p className="sm:col-span-2 rounded-lg border border-white/10 bg-white/[0.025] p-3 text-xs leading-5 text-zinc-500">
          Automation fit formula: tasks 40%, notes 25%, saved summary 25%,
          recent activity 10% per project.
        </p>
      </div>

      <div className="border-b border-white/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
              Suggested automations
            </p>
            <h3 className="mt-1 text-sm font-semibold text-white">
              AI-ready workflows
            </h3>
          </div>
          <StatusBadge label="Demo-ready" tone="cyan" />
        </div>

        <div className="mt-4 grid gap-3">
          {suggestedAutomations.map((automation) => (
            <article
              key={automation.title}
              className="rounded-lg border border-white/10 bg-[#0d1017] p-3"
            >
              <p className="text-sm font-medium text-zinc-100">{automation.title}</p>
              <p className="mt-1 text-xs leading-5 text-zinc-500">{automation.detail}</p>
            </article>
          ))}
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-sm font-semibold text-white">
            No projects to automate yet
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500">
            Add a project or load the demo workspace to see summary generation,
            risk signals, follow-up drafts, and automation context examples.
          </p>
        </div>
      ) : (
        <div className="space-y-4 border-b border-white/10 p-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
              Project readiness
            </p>
            <h3 className="mt-1 text-sm font-semibold text-white">
              Automation coverage by project
            </h3>
          </div>

          {projects.map((project) => {
            const summary = latestSummaryFor(project.id, summaries);
            const projectTasks = tasks.filter((task) => task.project_id === project.id);
            const projectNotes = notes.filter((note) => note.project_id === project.id);
            const projectActivity = activity.filter((item) => item.project_id === project.id);
            const projectFit = automationFitScore({
              activityCount: projectActivity.length,
              hasSummary: Boolean(summary),
              noteCount: projectNotes.length,
              taskCount: projectTasks.length,
            });
            const contextStats = [
              { label: "Tasks", value: projectTasks.length },
              { label: "Notes", value: projectNotes.length },
              { label: "Activity", value: projectActivity.length },
              { label: "Fit", value: `${projectFit}%` },
            ];

            return (
              <article
                key={project.id}
                className="rounded-lg border border-white/10 bg-[#0d1017] p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-sm font-semibold leading-5 text-white">
                      {project.name}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500">
                      {project.clients?.name ?? "Unlinked client"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge label={project.status} tone={projectStatusTone(project.status)} />
                    <StatusBadge
                      label={summary ? "Saved summary available" : "Needs summary"}
                      tone={summary ? "emerald" : "amber"}
                    />
                  </div>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {contextStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
                    >
                      <p className="text-xs text-zinc-500">{stat.label}</p>
                      <p className="mt-1 text-lg font-semibold text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {summary ? (
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
                        Latest saved summary
                      </p>
                      <StatusBadge label={`${summary.risk_level} risk`} tone={riskTone(summary.risk_level)} />
                    </div>
                    <p className="text-sm leading-6 text-zinc-400">{summary.summary}</p>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
                        Next steps
                      </p>
                      <ul className="mt-2 space-y-2 text-sm leading-5 text-zinc-300">
                        {summary.recommended_next_steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ul>
                    </div>
                    <p className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm leading-6 text-zinc-300">
                      {summary.suggested_follow_up_message}
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 rounded-lg border border-dashed border-white/10 bg-white/[0.02] p-4">
                    <p className="text-sm font-medium text-zinc-200">
                      No saved summary yet
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      Generate a preview to save project risk, recommended next
                      steps, and a client follow-up draft using this project&apos;s
                      tasks, notes, and activity.
                    </p>
                  </div>
                )}

                <form action={generateAiSummary} className="mt-4">
                  <input name="project_id" type="hidden" value={project.id} />
                  <SubmitButton
                    className="h-10 rounded-lg border border-violet-300/40 bg-violet-300 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-violet-200 disabled:cursor-not-allowed disabled:opacity-60"
                    pendingLabel="Generating..."
                  >
                    Generate AI summary
                  </SubmitButton>
                </form>
              </article>
            );
          })}
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
              Recent automation context
            </p>
            <h3 className="mt-1 text-sm font-semibold text-white">
              Signals used by summaries
            </h3>
          </div>
          <StatusBadge label={`${recentContextActivity.length} signals`} tone="violet" />
        </div>

        {recentContextActivity.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-white/10 p-4 text-sm leading-6 text-zinc-500">
            Generated summaries, blocker updates, and automation-related activity
            will appear here once the workspace has project movement.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {recentContextActivity.map((item) => (
              <article
                key={item.id}
                className="rounded-lg border border-white/10 bg-[#0d1017] p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm leading-6 text-zinc-300">{item.detail}</p>
                  <span className="shrink-0 text-xs text-zinc-500">
                    {formatDate(item.created_at)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  {item.projects?.name ?? item.clients?.name ?? "Workspace activity"}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
