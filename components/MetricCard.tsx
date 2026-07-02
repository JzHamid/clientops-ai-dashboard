import type { BadgeTone, Metric } from "@/lib/mock-data";

const accentClasses: Record<BadgeTone, string> = {
  cyan: "bg-cyan-300",
  emerald: "bg-emerald-300",
  amber: "bg-amber-300",
  rose: "bg-rose-300",
  violet: "bg-violet-300",
  zinc: "bg-zinc-300",
};

type MetricCardProps = {
  metric: Metric;
};

export function MetricCard({ metric }: MetricCardProps) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-zinc-400">{metric.label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {metric.value}
          </p>
        </div>
        <span className={`mt-1 h-2.5 w-2.5 rounded-full ${accentClasses[metric.tone]}`} />
      </div>
      <div className="mt-5 flex flex-col gap-1">
        <p className="text-sm font-medium text-zinc-200">{metric.change}</p>
        <p className="text-sm text-zinc-500">{metric.detail}</p>
      </div>
    </article>
  );
}
