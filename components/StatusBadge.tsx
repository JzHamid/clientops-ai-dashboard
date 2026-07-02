import type { BadgeTone } from "@/lib/mock-data";

const toneClasses: Record<BadgeTone, string> = {
  cyan: "border-cyan-400/25 bg-cyan-400/10 text-cyan-200",
  emerald: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  amber: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  rose: "border-rose-400/25 bg-rose-400/10 text-rose-200",
  violet: "border-violet-400/25 bg-violet-400/10 text-violet-200",
  zinc: "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",
};

type StatusBadgeProps = {
  label: string;
  tone?: BadgeTone;
};

export function StatusBadge({ label, tone = "zinc" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md border px-2 py-1 text-xs font-medium ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
}
