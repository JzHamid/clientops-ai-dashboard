import { addProjectNote, updateProjectNote } from "@/app/actions/notes";
import { SubmitButton } from "@/components/forms/SubmitButton";
import type { ProjectNoteRecord, ProjectRecord } from "@/lib/types";

type NoteFormProps = {
  projects: ProjectRecord[];
  note?: ProjectNoteRecord;
};

const inputClass =
  "h-10 rounded-lg border border-white/10 bg-[#0d1017] px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-300/50";

export function NoteForm({ projects, note }: NoteFormProps) {
  const isEditing = Boolean(note);
  const disabled = projects.length === 0;

  return (
    <form action={isEditing ? updateProjectNote : addProjectNote} className="space-y-3">
      {note ? <input name="id" type="hidden" value={note.id} /> : null}
      <p className="text-xs leading-5 text-zinc-500">
        {isEditing
          ? "Refine the project context saved for future summaries and follow-ups."
          : "Capture decisions, risks, updates, or client context for a project."}
      </p>

      <label className="grid gap-1">
        <span className="text-xs font-medium text-zinc-400">Project</span>
        <select
          className={inputClass}
          defaultValue={note?.project_id}
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
        <span className="text-xs font-medium text-zinc-400">Note type</span>
        <select
          className={inputClass}
          defaultValue={note?.note_type ?? "Update"}
          disabled={disabled}
          name="note_type"
        >
          <option>Update</option>
          <option>Risk</option>
          <option>Decision</option>
          <option>Client context</option>
        </select>
      </label>

      <label className="grid gap-1">
        <span className="text-xs font-medium text-zinc-400">Title</span>
        <input
          className={inputClass}
          defaultValue={note?.title}
          disabled={disabled}
          name="title"
          placeholder="Client approved dashboard direction"
          required
        />
      </label>

      <label className="grid gap-1">
        <span className="text-xs font-medium text-zinc-400">Note</span>
        <textarea
          className="min-h-24 rounded-lg border border-white/10 bg-[#0d1017] px-3 py-2 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-300/50"
          defaultValue={note?.body}
          disabled={disabled}
          name="body"
          placeholder="Add the important client context, risk, decision, or update."
          required
        />
      </label>

      <SubmitButton
        className="h-10 rounded-lg border border-cyan-300/40 bg-cyan-300 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled}
        pendingLabel={isEditing ? "Saving..." : "Adding..."}
      >
        {isEditing ? "Save note changes" : "Add project note"}
      </SubmitButton>
    </form>
  );
}
