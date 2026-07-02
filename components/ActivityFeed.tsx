import { recentActivity } from "@/lib/mock-data";
import type { BadgeTone } from "@/lib/mock-data";

const dotClasses: Record<BadgeTone, string> = {
  cyan: "bg-cyan-300",
  emerald: "bg-emerald-300",
  amber: "bg-amber-300",
  rose: "bg-rose-300",
  violet: "bg-violet-300",
  zinc: "bg-zinc-300",
};

export function ActivityFeed() {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/20">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">
          Timeline
        </p>
        <h2 className="mt-1 text-lg font-semibold text-white">Recent activity</h2>
      </div>

      <div className="divide-y divide-white/10">
        {recentActivity.map((item) => (
          <article key={`${item.person}-${item.target}`} className="flex gap-3 px-5 py-4">
            <span
              className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dotClasses[item.tone]}`}
            />
            <div className="min-w-0">
              <p className="text-sm leading-6 text-zinc-300">
                <span className="font-medium text-white">{item.person}</span>{" "}
                {item.action} {item.target}
              </p>
              <p className="mt-1 text-xs text-zinc-500">{item.time}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
