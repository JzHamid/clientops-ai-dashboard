import { automationItems } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";

export function AutomationPanel() {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/20">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-300">
          AI readiness
        </p>
        <h2 className="mt-1 text-lg font-semibold text-white">
          Automation opportunities
        </h2>
      </div>

      <div className="space-y-4 p-4">
        {automationItems.map((item) => (
          <article key={item.title} className="rounded-lg border border-white/10 bg-[#0d1017] p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold leading-5 text-white">
                {item.title}
              </h3>
              <StatusBadge label={item.status} tone={item.tone} />
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {item.description}
            </p>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Readiness</span>
                <span className="font-medium text-zinc-300">
                  {item.readiness}%
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-violet-300"
                  style={{ width: `${item.readiness}%` }}
                />
              </div>
            </div>
            <p className="mt-3 text-xs font-medium text-emerald-300">
              {item.impact}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
