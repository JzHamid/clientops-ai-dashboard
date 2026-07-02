import { createTask, updateTask } from "@/app/actions/tasks";
import { SubmitButton } from "@/components/forms/SubmitButton";
import type { ProjectRecord, TaskRecord } from "@/lib/types";

type TaskFormProps = {
  projects: ProjectRecord[];
  task?: TaskRecord;
};

const inputClass =
  "h-10 rounded-lg border border-white/10 bg-[#0d1017] px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-300/50";

export function TaskForm({ projects, task }: TaskFormProps) {
  const isEditing = Boolean(task);
  const disabled = projects.length === 0;

  return (
    <form action={isEditing ? updateTask : createTask} className="grid gap-3 sm:grid-cols-2">
      {task ? <input name="id" type="hidden" value={task.id} /> : null}
      <p className="text-xs leading-5 text-zinc-500 sm:col-span-2">
        {isEditing
          ? "Keep task ownership, priority, and due dates current."
          : "Add a task to show what is moving, blocked, or ready for review."}
      </p>

      <label className="grid gap-1">
        <span className="text-xs font-medium text-zinc-400">Project</span>
        <select
          className={inputClass}
          defaultValue={task?.project_id}
          disabled={disabled}
          name="project_id"
          required
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1">
        <span className="text-xs font-medium text-zinc-400">Task title</span>
        <input
          className={inputClass}
          defaultValue={task?.title}
          disabled={disabled}
          name="title"
          placeholder="Send stakeholder summary"
          required
        />
      </label>

      <label className="grid gap-1">
        <span className="text-xs font-medium text-zinc-400">Owner</span>
        <input
          className={inputClass}
          defaultValue={task?.owner ?? ""}
          disabled={disabled}
          name="owner"
          placeholder="Jazhem"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-xs font-medium text-zinc-400">Due date</span>
        <input
          className={inputClass}
          defaultValue={task?.due_date ?? ""}
          disabled={disabled}
          name="due_date"
          type="date"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-xs font-medium text-zinc-400">Status</span>
        <select
          className={inputClass}
          defaultValue={task?.status ?? "Todo"}
          disabled={disabled}
          name="status"
        >
          <option>Todo</option>
          <option>In progress</option>
          <option>Blocked</option>
          <option>Done</option>
        </select>
      </label>

      <label className="grid gap-1">
        <span className="text-xs font-medium text-zinc-400">Priority</span>
        <select
          className={inputClass}
          defaultValue={task?.priority ?? "Medium"}
          disabled={disabled}
          name="priority"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </label>

      <div className="sm:col-span-2">
        <SubmitButton
          className="h-10 rounded-lg border border-cyan-300/40 bg-cyan-300 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled}
          pendingLabel={isEditing ? "Saving..." : "Creating..."}
        >
          {isEditing ? "Save task changes" : "Add task"}
        </SubmitButton>
        {disabled ? (
          <p className="mt-2 text-xs text-zinc-500">Create a project before adding tasks.</p>
        ) : null}
      </div>
    </form>
  );
}
