import { deleteProjectNote } from "@/app/actions/notes";
import { NoteForm } from "@/components/forms/NoteForm";
import { StatusBadge } from "@/components/StatusBadge";
import type { BadgeTone } from "@/lib/mock-data";
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
    <section className="rounded-lg border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/20">
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
            Add note
          </summary>
          <div className="mt-4">
            <NoteForm projects={projects} />
          </div>
        </details>
      </div>

      {notes.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-sm font-medium text-white">No project notes yet</p>
          <p className="mt-2 text-sm text-zinc-500">
            Capture decisions, risks, updates, and client context here.
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
              <form action={deleteProjectNote} className="mt-4">
                <input name="id" type="hidden" value={note.id} />
                <button
                  className="h-9 rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 text-xs font-medium text-rose-100 transition hover:bg-rose-400/15"
                  type="submit"
                >
                  Delete note
                </button>
              </form>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
