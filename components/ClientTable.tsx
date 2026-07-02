import { deleteClientRecord } from "@/app/actions/clients";
import { ClientForm } from "@/components/forms/ClientForm";
import { StatusBadge } from "@/components/StatusBadge";
import type { BadgeTone } from "@/lib/mock-data";
import type { ClientRecord, ProjectRecord } from "@/lib/types";

type ClientTableProps = {
  clients: ClientRecord[];
  projects: ProjectRecord[];
};

function healthColor(score: number) {
  if (score >= 80) {
    return "bg-emerald-300";
  }

  if (score >= 65) {
    return "bg-amber-300";
  }

  return "bg-rose-300";
}

function toneFromStatus(status: string): BadgeTone {
  if (status === "Active" || status === "Complete") {
    return "emerald";
  }

  if (status === "At risk") {
    return "rose";
  }

  if (status === "Paused") {
    return "amber";
  }

  return "cyan";
}

function toneFromPriority(priority: string): BadgeTone {
  if (priority === "High") {
    return "rose";
  }

  if (priority === "Low") {
    return "zinc";
  }

  return "amber";
}

export function ClientTable({ clients, projects }: ClientTableProps) {
  const projectCountByClient = clients.map((client) => {
    const clientProjects = projects.filter((project) => project.client_id === client.id);
    return {
      client,
      count: clientProjects.length,
      latestProject: clientProjects[0],
    };
  });

  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/20">
      <div className="flex flex-col gap-2 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-300">
            Accounts
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">
            Client and project tracker
          </h2>
        </div>
        <p className="text-sm text-zinc-400">
          Real account records scoped by Supabase RLS.
        </p>
      </div>

      <div className="border-b border-white/10 p-4">
        <details className="rounded-lg border border-white/10 bg-[#0d1017] p-4">
          <summary className="cursor-pointer text-sm font-semibold text-white">
            Create client
          </summary>
          <div className="mt-4">
            <ClientForm />
          </div>
        </details>
      </div>

      {clients.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm font-medium text-white">No clients yet</p>
          <p className="mt-2 text-sm text-zinc-500">
            Create your first client to unlock projects, tasks, notes, and summaries.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full border-collapse text-left text-sm">
            <thead className="bg-white/[0.025] text-xs uppercase tracking-[0.14em] text-zinc-500">
              <tr>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Latest project</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Priority</th>
                <th className="px-5 py-3 font-medium">Health</th>
                <th className="px-5 py-3 font-medium">Projects</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {projectCountByClient.map(({ client, count, latestProject }) => (
                <tr key={client.id} className="align-top hover:bg-white/[0.025]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-xs font-semibold text-zinc-300">
                        {client.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-white">{client.name}</p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {client.contact_name || "No contact"}{" "}
                          {client.contact_email ? `/${client.contact_email}` : ""}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-zinc-300">
                    {latestProject?.name ?? "No project yet"}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge label={client.status} tone={toneFromStatus(client.status)} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge label={client.priority} tone={toneFromPriority(client.priority)} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-20 overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className={`h-full rounded-full ${healthColor(client.health_score)}`}
                          style={{ width: `${client.health_score}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-400">{client.health_score}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-zinc-400">{count}</td>
                  <td className="px-5 py-4">
                    <div className="flex min-w-52 flex-col gap-2">
                      <details className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                        <summary className="cursor-pointer text-xs font-medium text-zinc-300">
                          Edit
                        </summary>
                        <div className="mt-3">
                          <ClientForm client={client} />
                        </div>
                      </details>
                      <form action={deleteClientRecord}>
                        <input name="id" type="hidden" value={client.id} />
                        <button
                          className="h-9 rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 text-xs font-medium text-rose-100 transition hover:bg-rose-400/15"
                          type="submit"
                        >
                          Delete client
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
