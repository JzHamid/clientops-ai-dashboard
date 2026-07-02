import { createProject, updateProject } from "@/app/actions/projects";
import { SubmitButton } from "@/components/forms/SubmitButton";
import type { ClientRecord, ProjectRecord } from "@/lib/types";

type ProjectFormProps = {
  clients: ClientRecord[];
  project?: ProjectRecord;
};

const inputClass =
  "h-10 rounded-lg border border-white/10 bg-[#0d1017] px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-300/50";

export function ProjectForm({ clients, project }: ProjectFormProps) {
  const isEditing = Boolean(project);
  const disabled = clients.length === 0;

  return (
    <form action={isEditing ? updateProject : createProject} className="grid gap-3 sm:grid-cols-2">
      {project ? <input name="id" type="hidden" value={project.id} /> : null}
      <p className="text-xs leading-5 text-zinc-500 sm:col-span-2">
        {isEditing
          ? "Adjust project scope, timeline, budget, priority, and status."
          : "Create a project under a client so tasks, notes, and summaries have context."}
      </p>
      <input name="progress" type="hidden" value={project?.progress ?? 0} />

      <label className="grid gap-1">
        <span className="text-xs font-medium text-zinc-400">Client</span>
        <select
          className={inputClass}
          defaultValue={project?.client_id}
          disabled={disabled}
          name="client_id"
          required
        >
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1">
        <span className="text-xs font-medium text-zinc-400">Project name</span>
        <input
          className={inputClass}
          defaultValue={project?.name}
          disabled={disabled}
          name="name"
          placeholder="Client portal rebuild"
          required
        />
      </label>

      <label className="grid gap-1 sm:col-span-2">
        <span className="text-xs font-medium text-zinc-400">Description</span>
        <input
          className={inputClass}
          defaultValue={project?.description ?? ""}
          disabled={disabled}
          name="description"
          placeholder="What this project is meant to improve"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-xs font-medium text-zinc-400">Status</span>
        <select
          className={inputClass}
          defaultValue={project?.status ?? "Discovery"}
          disabled={disabled}
          name="status"
        >
          <option>Discovery</option>
          <option>Build</option>
          <option>Review</option>
          <option>Launch</option>
          <option>Complete</option>
          <option>Blocked</option>
        </select>
      </label>

      <label className="grid gap-1">
        <span className="text-xs font-medium text-zinc-400">Priority</span>
        <select
          className={inputClass}
          defaultValue={project?.priority ?? "Medium"}
          disabled={disabled}
          name="priority"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </label>

      <label className="grid gap-1">
        <span className="text-xs font-medium text-zinc-400">Due date</span>
        <input
          className={inputClass}
          defaultValue={project?.due_date ?? ""}
          disabled={disabled}
          name="due_date"
          type="date"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-xs font-medium text-zinc-400">Budget</span>
        <input
          className={inputClass}
          defaultValue={project?.budget ?? ""}
          disabled={disabled}
          min={0}
          name="budget"
          placeholder="12000"
          step="0.01"
          type="number"
        />
      </label>

      <div className="sm:col-span-2">
        <SubmitButton
          className="h-10 rounded-lg border border-cyan-300/40 bg-cyan-300 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled}
          pendingLabel={isEditing ? "Saving..." : "Creating..."}
        >
          {isEditing ? "Save project changes" : "Add project"}
        </SubmitButton>
        {disabled ? (
          <p className="mt-2 text-xs text-zinc-500">Create a client before adding projects.</p>
        ) : null}
      </div>
    </form>
  );
}
