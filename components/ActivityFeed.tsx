import type { BadgeTone } from "@/lib/mock-data";
import type { ActivityLogRecord } from "@/lib/types";

type ActivityFeedProps = {
  activity: ActivityLogRecord[];
};

const dotClasses: Record<BadgeTone, string> = {
  cyan: "bg-cyan-300",
  emerald: "bg-emerald-300",
  amber: "bg-amber-300",
  rose: "bg-rose-300",
  violet: "bg-violet-300",
  zinc: "bg-zinc-300",
};

function dotTone(action: string): BadgeTone {
  if (action === "deleted") {
    return "rose";
  }

  if (action === "created" || action === "added") {
    return "emerald";
  }

  if (action === "generated") {
    return "violet";
  }

  return "cyan";
}

export function ActivityFeed({ activity }: ActivityFeedProps) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/20">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">
          Timeline
        </p>
        <h2 className="mt-1 text-lg font-semibold text-white">Recent activity</h2>
      </div>

      {activity.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-sm font-medium text-white">No activity yet</p>
          <p className="mt-2 text-sm text-zinc-500">
            Create records and updates to build a timeline.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-white/10">
          {activity.map((item) => (
            <article key={item.id} className="flex gap-3 px-5 py-4">
              <span
                className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                  dotClasses[dotTone(item.action)]
                }`}
              />
              <div className="min-w-0">
                <p className="text-sm leading-6 text-zinc-300">{item.detail}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
