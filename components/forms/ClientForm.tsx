import { createClientRecord, updateClientRecord } from "@/app/actions/clients";
import { SubmitButton } from "@/components/forms/SubmitButton";
import type { ClientRecord } from "@/lib/types";

type ClientFormProps = {
  client?: ClientRecord;
};

const inputClass =
  "h-10 rounded-lg border border-white/10 bg-[#0d1017] px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-300/50";

export function ClientForm({ client }: ClientFormProps) {
  const isEditing = Boolean(client);

  return (
    <form
      action={isEditing ? updateClientRecord : createClientRecord}
      className="grid gap-3 sm:grid-cols-2"
    >
      {client ? <input name="id" type="hidden" value={client.id} /> : null}

      <label className="grid gap-1">
        <span className="text-xs font-medium text-zinc-400">Client name</span>
        <input
          className={inputClass}
          defaultValue={client?.name}
          name="name"
          placeholder="Northstar Studio"
          required
        />
      </label>

      <label className="grid gap-1">
        <span className="text-xs font-medium text-zinc-400">Contact name</span>
        <input
          className={inputClass}
          defaultValue={client?.contact_name ?? ""}
          name="contact_name"
          placeholder="Maya R."
        />
      </label>

      <label className="grid gap-1">
        <span className="text-xs font-medium text-zinc-400">Contact email</span>
        <input
          className={inputClass}
          defaultValue={client?.contact_email ?? ""}
          name="contact_email"
          placeholder="client@example.com"
          type="email"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-xs font-medium text-zinc-400">Status</span>
        <select className={inputClass} defaultValue={client?.status ?? "Lead"} name="status">
          <option>Lead</option>
          <option>Active</option>
          <option>At risk</option>
          <option>Paused</option>
          <option>Complete</option>
        </select>
      </label>

      <label className="grid gap-1">
        <span className="text-xs font-medium text-zinc-400">Priority</span>
        <select className={inputClass} defaultValue={client?.priority ?? "Medium"} name="priority">
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </label>

      <label className="grid gap-1">
        <span className="text-xs font-medium text-zinc-400">Health score</span>
        <input
          className={inputClass}
          defaultValue={client?.health_score ?? 80}
          max={100}
          min={0}
          name="health_score"
          type="number"
        />
      </label>

      <div className="sm:col-span-2">
        <SubmitButton
          className="h-10 rounded-lg border border-cyan-300/40 bg-cyan-300 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
          pendingLabel={isEditing ? "Saving..." : "Creating..."}
        >
          {isEditing ? "Save client" : "Create client"}
        </SubmitButton>
      </div>
    </form>
  );
}
