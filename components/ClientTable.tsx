import { clientProjects } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";

function healthColor(score: number) {
  if (score >= 80) {
    return "bg-emerald-300";
  }

  if (score >= 65) {
    return "bg-amber-300";
  }

  return "bg-rose-300";
}

export function ClientTable() {
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
          Live-style mock data for active delivery.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full border-collapse text-left text-sm">
          <thead className="bg-white/[0.025] text-xs uppercase tracking-[0.14em] text-zinc-500">
            <tr>
              <th className="px-5 py-3 font-medium">Client</th>
              <th className="px-5 py-3 font-medium">Project</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Priority</th>
              <th className="px-5 py-3 font-medium">Health</th>
              <th className="px-5 py-3 font-medium">Due</th>
              <th className="px-5 py-3 font-medium">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {clientProjects.map((item) => (
              <tr key={`${item.client}-${item.project}`} className="hover:bg-white/[0.025]">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-xs font-semibold text-zinc-300">
                      {item.client
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-white">{item.client}</p>
                      <p className="mt-1 text-xs text-zinc-500">{item.contact}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-zinc-300">{item.project}</td>
                <td className="px-5 py-4">
                  <StatusBadge label={item.status} tone={item.statusTone} />
                </td>
                <td className="px-5 py-4">
                  <StatusBadge label={item.priority} tone={item.priorityTone} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-20 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className={`h-full rounded-full ${healthColor(item.health)}`}
                        style={{ width: `${item.health}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-400">{item.health}%</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-zinc-400">{item.due}</td>
                <td className="px-5 py-4 font-medium text-zinc-200">{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
