import { deleteProject, updateProjectStatus } from "@/app/actions/projects";
import { ConfirmSubmitButton } from "@/components/forms/ConfirmSubmitButton";
import { ProjectForm } from "@/components/forms/ProjectForm";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { StatusBadge } from "@/components/StatusBadge";
import type { BadgeTone } from "@/lib/ui-config";
import type { ClientRecord, ProjectRecord, TaskRecord } from "@/lib/types";

type ProjectPipelineProps = {
  clients: ClientRecord[];
  projects: ProjectRecord[];
  tasks: TaskRecord[];
};

const stages = ["Discovery", "Build", "Review", "Launch", "Complete", "Blocked"];

function toneFromStatus(status: string): BadgeTone {
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

function formatMoney(value: number | null) {
  if (value === null) {
    return "No budget";
  }

  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function taskProgressForProject(projectId: string, tasks: TaskRecord[]) {
  const projectTasks = tasks.filter((task) => task.project_id === projectId);
  const completedTasks = projectTasks.filter((task) => task.status === "Done");
  const progress =
    projectTasks.length === 0
      ? 0
      : Math.round((completedTasks.length / projectTasks.length) * 100);

  return {
    completed: completedTasks.length,
    progress,
    total: projectTasks.length,
  };
}

export function ProjectPipeline({ clients, projects, tasks }: ProjectPipelineProps) {
  return (
    <section
      id="projects"
      className="rounded-lg border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/20"
    >
      <div className="flex flex-col gap-2 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-300">
            Pipeline
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">
            Project pipeline
          </h2>
        </div>
        <p className="text-sm text-zinc-400">
          Progress uses completed tasks divided by total tasks.
        </p>
      </div>

      <div className="border-b border-white/10 p-4">
        <details className="rounded-lg border border-white/10 bg-[#0d1017] p-4">
          <summary className="cursor-pointer text-sm font-semibold text-white">
            Add project
          </summary>
          <div className="mt-4">
            <ProjectForm clients={clients} />
          </div>
        </details>
      </div>

      {projects.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm font-semibold text-white">No projects yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
            Add a project after creating a client. Projects unlock task tracking,
            project notes, status movement, and AI summary previews.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 p-4 lg:grid-cols-2 2xl:grid-cols-3">
          {stages.map((stage) => {
            const stageProjects = projects.filter((project) => project.status === stage);
            const stageBudget = stageProjects.reduce(
              (sum, project) => sum + Number(project.budget ?? 0),
              0,
            );

            return (
              <article
                key={stage}
                className="rounded-lg border border-white/10 bg-[#0d1017] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{stage}</h3>
                    <p className="mt-1 text-xs text-zinc-500">
                      {stageProjects.length} projects / {formatMoney(stageBudget)}
                    </p>
                  </div>
                  <StatusBadge label={stage} tone={toneFromStatus(stage)} />
                </div>

                <div className="mt-5 space-y-4">
                  {stageProjects.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-white/10 p-3 text-xs text-zinc-500">
                      Empty stage
                    </p>
                  ) : (
                    stageProjects.map((project) => {
                      const taskProgress = taskProgressForProject(project.id, tasks);

                      return (
                        <div
                          key={project.id}
                          className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="break-words text-sm font-medium text-zinc-100">
                                {project.name}
                              </p>
                              <p className="mt-1 text-xs text-zinc-500">
                                {project.clients?.name ?? "Unlinked client"}
                              </p>
                            </div>
                            <StatusBadge
                              label={project.priority}
                              tone={project.priority === "High" ? "rose" : "amber"}
                            />
                          </div>

                          <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
                            <div
                              className="h-full rounded-full bg-cyan-300"
                              style={{ width: `${taskProgress.progress}%` }}
                            />
                          </div>

                          <div className="mt-3 flex flex-col gap-1 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
                            <span>{taskProgress.progress}% complete by tasks</span>
                            <span>
                              {taskProgress.total === 0
                                ? "No tasks yet"
                                : `${taskProgress.completed}/${taskProgress.total} tasks done`}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-zinc-600">
                            Due {project.due_date ?? "not set"}
                          </p>

                          <form
                            action={updateProjectStatus}
                            className="mt-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]"
                          >
                            <input name="id" type="hidden" value={project.id} />
                            <select
                              className="h-9 w-full min-w-0 rounded-lg border border-white/10 bg-[#0d1017] px-2 text-xs text-white outline-none"
                              defaultValue={project.status}
                              name="status"
                            >
                              {stages.map((status) => (
                                <option key={status}>{status}</option>
                              ))}
                            </select>
                            <SubmitButton
                              className="h-9 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 text-xs font-medium text-zinc-200 transition hover:bg-white/[0.08] disabled:opacity-60 sm:w-auto"
                              pendingLabel="Saving..."
                            >
                              Update
                            </SubmitButton>
                          </form>

                          <details className="mt-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                            <summary className="cursor-pointer text-xs font-medium text-zinc-300">
                              Edit project
                            </summary>
                            <div className="mt-3">
                              <ProjectForm clients={clients} project={project} />
                            </div>
                          </details>

                          <form action={deleteProject} className="mt-2">
                            <input name="id" type="hidden" value={project.id} />
                            <ConfirmSubmitButton
                              className="h-9 w-full rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 text-xs font-medium text-rose-100 transition hover:bg-rose-400/15 sm:w-auto"
                              confirmMessage={`Delete ${project.name}? This will also remove related tasks, notes, and summaries.`}
                            >
                              Delete project
                            </ConfirmSubmitButton>
                          </form>
                        </div>
                      );
                    })
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
