import { deleteTask, updateTaskStatus } from "@/app/actions/tasks";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { TaskForm } from "@/components/forms/TaskForm";
import { StatusBadge } from "@/components/StatusBadge";
import type { BadgeTone } from "@/lib/mock-data";
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
  return (
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
          Create tasks, update status, and remove completed noise.
        </p>
      </div>

      <div className="border-b border-white/10 p-4">
        <details className="rounded-lg border border-white/10 bg-[#0d1017] p-4">
          <summary className="cursor-pointer text-sm font-semibold text-white">
            Create task
          </summary>
          <div className="mt-4">
            <TaskForm projects={projects} />
          </div>
        </details>
      </div>

      {tasks.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm font-medium text-white">No tasks yet</p>
          <p className="mt-2 text-sm text-zinc-500">
            Add tasks to show execution detail for active projects.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((column) => {
            const columnTasks = tasks.filter((task) => task.status === column);

            return (
              <div key={column} className="rounded-lg border border-white/10 bg-[#0d1017] p-4">
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
                        className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="text-sm font-medium leading-5 text-zinc-100">
                            {task.title}
                          </h4>
                          <StatusBadge label={task.status} tone={toneFromStatus(task.status)} />
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                          <span>{task.owner || "Unassigned"}</span>
                          <span className="h-1 w-1 rounded-full bg-zinc-700" />
                          <span>{task.due_date ?? "No due date"}</span>
                        </div>
                        <p className="mt-2 text-xs text-zinc-500">
                          {task.projects?.name ?? "Unlinked project"}
                        </p>

                        <form action={updateTaskStatus} className="mt-3 flex gap-2">
                          <input name="id" type="hidden" value={task.id} />
                          <select
                            className="h-9 min-w-0 flex-1 rounded-lg border border-white/10 bg-[#0d1017] px-2 text-xs text-white outline-none"
                            defaultValue={task.status}
                            name="status"
                          >
                            {columns.map((status) => (
                              <option key={status}>{status}</option>
                            ))}
                          </select>
                          <SubmitButton
                            className="h-9 rounded-lg border border-white/10 bg-white/[0.05] px-3 text-xs font-medium text-zinc-200 transition hover:bg-white/[0.08] disabled:opacity-60"
                            pendingLabel="Saving..."
                          >
                            Save
                          </SubmitButton>
                        </form>

                        <form action={deleteTask} className="mt-2">
                          <input name="id" type="hidden" value={task.id} />
                          <button
                            className="h-9 rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 text-xs font-medium text-rose-100 transition hover:bg-rose-400/15"
                            type="submit"
                          >
                            Delete task
                          </button>
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
