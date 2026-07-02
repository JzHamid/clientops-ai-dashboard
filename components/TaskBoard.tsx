import { deleteTask, updateTaskStatus } from "@/app/actions/tasks";
import { ConfirmSubmitButton } from "@/components/forms/ConfirmSubmitButton";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { TaskForm } from "@/components/forms/TaskForm";
import { StatusBadge } from "@/components/StatusBadge";
import type { BadgeTone } from "@/lib/ui-config";
import type { ProjectRecord, TaskRecord } from "@/lib/types";

type TaskBoardProps = {
  projects: ProjectRecord[];
  tasks: TaskRecord[];
};

const columns = ["Todo", "In progress", "Blocked", "Done"];

function toneFromStatus(status: string): BadgeTone {
  if (status === "Done") {
    return "emerald";
  }

  if (status === "Blocked") {
    return "rose";
  }

  if (status === "In progress") {
    return "cyan";
  }

  return "zinc";
}

export function TaskBoard({ projects, tasks }: TaskBoardProps) {
  const completedTasks = tasks.filter((task) => task.status === "Done").length;
  const taskCompletion =
    tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);

  return (
    <section
      id="tasks"
      className="rounded-lg border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/20"
    >
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
          Completion is done tasks divided by total tasks.
        </p>
      </div>

      <div className="border-b border-white/10 p-4">
        <details className="rounded-lg border border-white/10 bg-[#0d1017] p-4">
          <summary className="cursor-pointer text-sm font-semibold text-white">
            Add task
          </summary>
          <div className="mt-4">
            <TaskForm projects={projects} />
          </div>
        </details>
      </div>

      <div className="border-b border-white/10 p-4">
        <div className="rounded-lg border border-white/10 bg-[#0d1017] p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                Task completion
              </p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {taskCompletion}%
              </p>
            </div>
            <p className="text-sm leading-6 text-zinc-400">
              {completedTasks}/{tasks.length} tasks done. Formula: done tasks /
              total tasks.
            </p>
          </div>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm font-semibold text-white">No tasks yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
            Add tasks to make project execution visible. Tasks feed the metrics,
            status board, activity timeline, and AI summary context.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 p-4 lg:grid-cols-2 2xl:grid-cols-4">
          {columns.map((column) => {
            const columnTasks = tasks.filter((task) => task.status === column);

            return (
              <div
                key={column}
                className="min-w-0 rounded-lg border border-white/10 bg-[#0d1017] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-white">{column}</h3>
                  <span className="text-xs text-zinc-500">{columnTasks.length} items</span>
                </div>

                <div className="mt-4 space-y-3">
                  {columnTasks.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-white/10 p-3 text-xs text-zinc-500">
                      Empty lane
                    </p>
                  ) : (
                    columnTasks.map((task) => (
                      <article
                        key={task.id}
                        className="min-w-0 rounded-lg border border-white/10 bg-white/[0.03] p-4"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <h4 className="min-w-0 break-words text-sm font-medium leading-5 text-zinc-100">
                            {task.title}
                          </h4>
                          <div className="shrink-0">
                            <StatusBadge label={task.status} tone={toneFromStatus(task.status)} />
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                          <span>{task.owner || "Unassigned"}</span>
                          <span className="h-1 w-1 rounded-full bg-zinc-700" />
                          <span>{task.due_date ?? "No due date"}</span>
                        </div>
                        <p className="mt-2 break-words text-xs text-zinc-500">
                          {task.projects?.name ?? "Unlinked project"}
                        </p>

                        <form
                          action={updateTaskStatus}
                          className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]"
                        >
                          <input name="id" type="hidden" value={task.id} />
                          <select
                            aria-label={`Update status for ${task.title}`}
                            className="h-10 w-full min-w-0 rounded-lg border border-white/10 bg-[#0d1017] px-3 text-xs text-white outline-none"
                            defaultValue={task.status}
                            name="status"
                          >
                            {columns.map((status) => (
                              <option key={status}>{status}</option>
                            ))}
                          </select>
                          <SubmitButton
                            className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 text-xs font-medium text-zinc-200 transition hover:bg-white/[0.08] disabled:opacity-60 sm:w-auto"
                            pendingLabel="Saving..."
                          >
                            Update status
                          </SubmitButton>
                        </form>

                        <details className="mt-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                          <summary className="cursor-pointer text-xs font-medium text-zinc-300">
                            Edit task
                          </summary>
                          <div className="mt-3">
                            <TaskForm projects={projects} task={task} />
                          </div>
                        </details>

                        <form action={deleteTask} className="mt-2">
                          <input name="id" type="hidden" value={task.id} />
                          <ConfirmSubmitButton
                            className="h-9 w-full rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 text-xs font-medium text-rose-100 transition hover:bg-rose-400/15 sm:w-auto"
                            confirmMessage={`Delete task "${task.title}"?`}
                          >
                            Delete task
                          </ConfirmSubmitButton>
                        </form>
                      </article>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
