import { generateAiSummary } from "@/app/actions/ai";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { StatusBadge } from "@/components/StatusBadge";
import type { AiSummaryRecord, ProjectRecord } from "@/lib/types";

type AutomationPanelProps = {
  projects: ProjectRecord[];
  summaries: AiSummaryRecord[];
};

function latestSummaryFor(projectId: string, summaries: AiSummaryRecord[]) {
  return summaries.find((summary) => summary.project_id === projectId);
}

export function AutomationPanel({ projects, summaries }: AutomationPanelProps) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/20">
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

      {projects.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-sm font-medium text-white">No projects to summarize</p>
          <p className="mt-2 text-sm text-zinc-500">
            Create a project before generating an AI-style summary preview.
          </p>
        </div>
      ) : (
        <div className="space-y-4 p-4">
          {projects.slice(0, 4).map((project) => {
            const summary = latestSummaryFor(project.id, summaries);

            return (
              <article
                key={project.id}
                className="rounded-lg border border-white/10 bg-[#0d1017] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold leading-5 text-white">
                      {project.name}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500">
                      {project.clients?.name ?? "Unlinked client"}
                    </p>
                  </div>
                  <StatusBadge label={summary?.risk_level ?? "Not generated"} tone="violet" />
                </div>

                {summary ? (
                  <div className="mt-4 space-y-3">
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
                  <p className="mt-4 text-sm leading-6 text-zinc-500">
                    No saved summary yet. Generate one to preview project risk,
                    next steps, and a follow-up message.
                  </p>
                )}

                <form action={generateAiSummary} className="mt-4">
                  <input name="project_id" type="hidden" value={project.id} />
                  <SubmitButton
                    className="h-10 rounded-lg border border-violet-300/40 bg-violet-300 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-violet-200 disabled:cursor-not-allowed disabled:opacity-60"
                    pendingLabel="Generating..."
                  >
                    Generate AI Summary
                  </SubmitButton>
                </form>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
