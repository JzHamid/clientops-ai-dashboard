import { deleteProjectNote } from "@/app/actions/notes";
import { ConfirmSubmitButton } from "@/components/forms/ConfirmSubmitButton";
import { NoteForm } from "@/components/forms/NoteForm";
import { StatusBadge } from "@/components/StatusBadge";
import type { BadgeTone } from "@/lib/ui-config";
import type { ProjectNoteRecord, ProjectRecord } from "@/lib/types";

type NotesPanelProps = {
  notes: ProjectNoteRecord[];
  projects: ProjectRecord[];
};

function toneFromType(type: string): BadgeTone {
  if (type === "Risk") {
    return "rose";
  }

  if (type === "Decision") {
    return "emerald";
  }

  if (type === "Client context") {
    return "amber";
  }

  return "cyan";
}

export function NotesPanel({ notes, projects }: NotesPanelProps) {
  return (
    <section
      id="notes"
      className="rounded-lg border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/20"
    >
      <div className="border-b border-white/10 px-5 py-4">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-amber-300">
          Context
        </p>
        <h2 className="mt-1 text-lg font-semibold text-white">
          Project notes
        </h2>
      </div>

      <div className="border-b border-white/10 p-4">
        <details className="rounded-lg border border-white/10 bg-[#0d1017] p-4">
          <summary className="cursor-pointer text-sm font-semibold text-white">
            Add project note
          </summary>
          <div className="mt-4">
            <NoteForm projects={projects} />
          </div>
        </details>
      </div>

      {notes.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-sm font-semibold text-white">No project notes yet</p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500">
            Add notes for decisions, risks, updates, and client context. These
            notes make generated summaries more useful.
          </p>
        </div>
      ) : (
        <div className="space-y-4 p-4">
          {notes.map((note) => (
            <article
              key={note.id}
              className="rounded-lg border border-white/10 bg-[#0d1017] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">{note.title}</h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    {note.projects?.name ?? "Unlinked project"}
                  </p>
                </div>
                <StatusBadge label={note.note_type} tone={toneFromType(note.note_type)} />
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{note.body}</p>
              <details className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <summary className="cursor-pointer text-xs font-medium text-zinc-300">
                  Edit note
                </summary>
                <div className="mt-3">
                  <NoteForm projects={projects} note={note} />
                </div>
              </details>
              <form action={deleteProjectNote} className="mt-4">
                <input name="id" type="hidden" value={note.id} />
                <ConfirmSubmitButton
                  className="h-9 rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 text-xs font-medium text-rose-100 transition hover:bg-rose-400/15"
                  confirmMessage={`Delete note "${note.title}"?`}
                >
                  Delete note
                </ConfirmSubmitButton>
              </form>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
